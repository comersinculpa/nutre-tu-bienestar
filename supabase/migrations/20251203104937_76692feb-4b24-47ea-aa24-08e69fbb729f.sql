-- Add subscription_source column to track where subscriptions come from
ALTER TABLE public.subscriptions 
ADD COLUMN subscription_source TEXT DEFAULT 'web' CHECK (subscription_source IN ('web', 'ios', 'android'));