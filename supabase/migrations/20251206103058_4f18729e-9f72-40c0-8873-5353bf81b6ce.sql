-- Tabla para idempotencia de webhooks
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('stripe', 'revenuecat')),
  payload JSONB,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para webhook_events
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_source ON public.webhook_events(source);

-- Habilitar RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Solo el service role puede acceder (webhooks usan service role)
CREATE POLICY "Solo service role puede gestionar webhook_events"
ON public.webhook_events
FOR ALL
USING (false)
WITH CHECK (false);

-- Añadir campos de debugging a subscriptions si no existen
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'last_webhook_event') THEN
    ALTER TABLE public.subscriptions ADD COLUMN last_webhook_event TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'last_webhook_event_date') THEN
    ALTER TABLE public.subscriptions ADD COLUMN last_webhook_event_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;