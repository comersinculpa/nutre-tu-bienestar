-- Añadir campos de Stripe a la tabla subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);