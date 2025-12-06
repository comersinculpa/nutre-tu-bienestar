-- Remove the overly permissive INSERT policy for users
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;

-- Remove the overly permissive UPDATE policy for users
DROP POLICY IF EXISTS "Users can update their own subscription usage" ON public.subscriptions;

-- Keep only the SELECT policy (already exists: "Users can view their own subscription")
-- This ensures users can only READ their subscription, not modify it

-- Verify the trigger exists for auto-creating subscriptions on user registration
-- This trigger uses SECURITY DEFINER so it bypasses RLS
DO $$
BEGIN
  -- Check if trigger exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_subscription'
  ) THEN
    CREATE TRIGGER on_auth_user_created_subscription
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user_subscription();
  END IF;
END $$;