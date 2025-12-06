import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REVENUECAT_PRODUCT_MAP: Record<string, 'BASIC' | 'PREMIUM'> = {
  'basic_monthly': 'BASIC',
  'Basic_Monthly': 'BASIC',
  'basic_yearly': 'BASIC',
  'premium_monthly': 'PREMIUM',
  'Premium_Monthly': 'PREMIUM',
  'premium_yearly': 'PREMIUM',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[RevenueCat Webhook] Solicitud recibida');

  try {
    // Verificar Authorization header
    const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
    const authHeader = req.headers.get('Authorization');
    
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}` && authHeader !== webhookSecret) {
      console.error('[RevenueCat Webhook] Token inválido');
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    const { event } = payload;
    const eventId = event.id || `${event.type}_${event.app_user_id}_${Date.now()}`;

    console.log(`[RevenueCat Webhook] Evento: ${event.type} para ${event.app_user_id}`);

    // Idempotencia
    const { data: existing } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Buscar usuario
    let subscription = null;
    const { data: subByRC } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('revenuecat_user_id', event.app_user_id)
      .maybeSingle();

    subscription = subByRC;

    if (!subscription) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(event.app_user_id)) {
        const { data: subByUserId } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', event.app_user_id)
          .maybeSingle();
        subscription = subByUserId;
      }
    }

    if (!subscription) {
      console.log(`[RevenueCat Webhook] Usuario no encontrado: ${event.app_user_id}`);
      await supabase.from('webhook_events').insert({ event_id: eventId, event_type: event.type, source: 'revenuecat', payload });
      return new Response(JSON.stringify({ received: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const platform = event.store?.toLowerCase().includes('play') ? 'android' : 'ios';
    const now = new Date().toISOString();
    const getTier = (pid: string | undefined) => pid ? (REVENUECAT_PRODUCT_MAP[pid] || 'FREE') : 'FREE';

    let updateData: Record<string, unknown> = { last_webhook_event: event.type, last_webhook_event_date: now, updated_at: now };

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'NON_RENEWING_PURCHASE':
        updateData = { ...updateData, tier: getTier(event.product_id), subscription_source: platform, status: 'active', subscription_start_date: now, revenuecat_user_id: event.app_user_id };
        break;
      case 'RENEWAL':
        updateData = { ...updateData, status: 'active' };
        break;
      case 'CANCELLATION':
        updateData = { ...updateData, status: 'cancelled' };
        break;
      case 'EXPIRATION':
      case 'BILLING_ISSUE':
        updateData = { ...updateData, tier: 'FREE', status: 'expired' };
        break;
      case 'PRODUCT_CHANGE':
        updateData = { ...updateData, tier: getTier(event.new_product_id) };
        break;
    }

    await supabase.from('subscriptions').update(updateData).eq('user_id', subscription.user_id);
    await supabase.from('webhook_events').insert({ event_id: eventId, event_type: event.type, source: 'revenuecat', payload });

    console.log(`[RevenueCat Webhook] Procesado: ${event.type}`);
    return new Response(JSON.stringify({ received: true, success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error(`[RevenueCat Webhook] Error: ${error.message}`);
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
