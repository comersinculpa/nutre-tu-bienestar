-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'cancelled', 'trial');

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'FREE',
  status subscription_status NOT NULL DEFAULT 'active',
  revenuecat_user_id TEXT,
  monthly_recipe_count INTEGER NOT NULL DEFAULT 0,
  monthly_audio_count INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription usage"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create subscription on new user
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'FREE', 'active');
  RETURN NEW;
END;
$$;

-- Trigger for new user subscription
CREATE TRIGGER on_auth_user_created_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_subscription();

-- Function to get subscription limits based on tier
CREATE OR REPLACE FUNCTION public.get_tier_limits(tier_param subscription_tier)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CASE tier_param
    WHEN 'FREE' THEN
      RETURN json_build_object(
        'recipes_per_month', 5,
        'audio_per_month', 0,
        'has_ai_coach', false,
        'has_community_access', false,
        'has_advanced_stats', false,
        'has_breathing_full', false,
        'has_audio_library', false
      );
    WHEN 'BASIC' THEN
      RETURN json_build_object(
        'recipes_per_month', 50,
        'audio_per_month', 10,
        'has_ai_coach', false,
        'has_community_access', false,
        'has_advanced_stats', false,
        'has_breathing_full', true,
        'has_audio_library', true
      );
    WHEN 'PREMIUM' THEN
      RETURN json_build_object(
        'recipes_per_month', -1,
        'audio_per_month', -1,
        'has_ai_coach', true,
        'has_community_access', true,
        'has_advanced_stats', true,
        'has_breathing_full', true,
        'has_audio_library', true
      );
  END CASE;
END;
$$;

-- Function to check and reset monthly counters
CREATE OR REPLACE FUNCTION public.check_and_reset_monthly_counters()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.last_reset_date < DATE_TRUNC('month', CURRENT_DATE) THEN
    NEW.monthly_recipe_count := 0;
    NEW.monthly_audio_count := 0;
    NEW.last_reset_date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to reset counters on access
CREATE TRIGGER reset_monthly_counters
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.check_and_reset_monthly_counters();