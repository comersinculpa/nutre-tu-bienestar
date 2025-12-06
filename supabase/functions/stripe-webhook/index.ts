import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

// Verificar firma HMAC-SHA256 de Stripe
async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const parts = signature.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
    const v1Signature = parts.find(p => p.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !v1Signature) {
      console.error('[Stripe Webhook] Firma incompleta');
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return computedSignature === v1Signature;
  } catch (error) {
    console.error('[Stripe Webhook] Error verificando firma:', error);
    return false;
  }
}

// Mapear price IDs a tiers
function getTierFromPrice(priceId: string): 'FREE' | 'BASIC' | 'PREMIUM' {
  const basicPriceId = Deno.env.get('STRIPE_PRICE_ID_BASIC');
  const premiumPriceId = Deno.env.get('STRIPE_PRICE_ID_PREMIUM');
  
  if (priceId === basicPriceId) return 'BASIC';
  if (priceId === premiumPriceId) return 'PREMIUM';
  
  // Fallback por nombre
  const priceLower = priceId.toLowerCase();
  if (priceLower.includes('premium')) return 'PREMIUM';
  if (priceLower.includes('basic')) return 'BASIC';
  
  return 'FREE';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Stripe Webhook] Solicitud recibida');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    // Verificar firma si está configurado el secret
    if (webhookSecret && signature) {
      const isValid = await verifyStripeSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('[Stripe Webhook] Firma inválida');
        // Siempre responder 200 para que Stripe no reintente
        return new Response(JSON.stringify({ received: true, error: 'invalid_signature' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      console.log('[Stripe Webhook] Firma verificada correctamente');
    }

    const event = JSON.parse(body);
    const eventId = event.id;
    const eventType = event.type;

    console.log(`[Stripe Webhook] Evento: ${eventType} (${eventId})`);

    // Verificar idempotencia
    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingEvent) {
      console.log(`[Stripe Webhook] Evento ${eventId} ya procesado, ignorando`);
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const now = new Date().toISOString();

    // Procesar eventos
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id || session.metadata?.userId;
        const tier = session.metadata?.tier || getTierFromPrice(session.metadata?.price_id || '');
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (!userId) {
          console.error('[Stripe Webhook] checkout.session.completed sin user_id en metadata');
          break;
        }

        console.log(`[Stripe Webhook] Checkout completado - Usuario: ${userId}, Tier: ${tier}`);

        const { error } = await supabase
          .from('subscriptions')
          .update({
            tier,
            status: 'active',
            subscription_source: 'web',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_start_date: now,
            subscription_end_date: null,
            last_webhook_event: eventType,
            last_webhook_event_date: now,
            updated_at: now,
          })
          .eq('user_id', userId);

        if (error) {
          console.error(`[Stripe Webhook] Error actualizando suscripción: ${error.message}`);
        } else {
          console.log(`[Stripe Webhook] Usuario ${userId} suscrito a ${tier} vía Stripe`);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const stripeSubId = subscription.id;
        const priceId = subscription.items?.data?.[0]?.price?.id || '';
        const status = subscription.status;

        // Buscar por stripe_subscription_id o metadata
        const userId = subscription.metadata?.user_id || subscription.metadata?.userId;
        
        let query = supabase.from('subscriptions').select('user_id');
        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          query = query.eq('stripe_subscription_id', stripeSubId);
        }

        const { data: subData } = await query.maybeSingle();

        if (subData?.user_id) {
          const tier = status === 'active' ? getTierFromPrice(priceId) : undefined;
          const subscriptionStatus = status === 'active' ? 'active' : 
                                     status === 'canceled' ? 'cancelled' : 
                                     status === 'past_due' ? 'expired' : 'active';

          const updateData: Record<string, unknown> = {
            status: subscriptionStatus,
            stripe_subscription_id: stripeSubId,
            last_webhook_event: eventType,
            last_webhook_event_date: now,
            updated_at: now,
          };

          if (tier) updateData.tier = tier;
          if (subscription.current_period_end) {
            updateData.subscription_end_date = new Date(subscription.current_period_end * 1000).toISOString();
          }

          await supabase
            .from('subscriptions')
            .update(updateData)
            .eq('user_id', subData.user_id);

          console.log(`[Stripe Webhook] Suscripción ${stripeSubId} actualizada: ${subscriptionStatus}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeSubId = subscription.id;

        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', stripeSubId)
          .maybeSingle();

        if (subData?.user_id) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              subscription_end_date: now,
              last_webhook_event: eventType,
              last_webhook_event_date: now,
              updated_at: now,
            })
            .eq('user_id', subData.user_id);

          console.log(`[Stripe Webhook] Suscripción ${stripeSubId} cancelada`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const stripeSubId = invoice.subscription;

        if (stripeSubId) {
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', stripeSubId)
            .maybeSingle();

          if (subData?.user_id) {
            await supabase
              .from('subscriptions')
              .update({
                status: 'expired',
                last_webhook_event: eventType,
                last_webhook_event_date: now,
                updated_at: now,
              })
              .eq('user_id', subData.user_id);

            console.log(`[Stripe Webhook] Pago fallido para suscripción ${stripeSubId}`);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const stripeSubId = invoice.subscription;

        if (stripeSubId) {
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', stripeSubId)
            .maybeSingle();

          if (subData?.user_id) {
            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                last_webhook_event: eventType,
                last_webhook_event_date: now,
                updated_at: now,
              })
              .eq('user_id', subData.user_id);

            console.log(`[Stripe Webhook] Pago exitoso para suscripción ${stripeSubId}`);
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Evento no manejado: ${eventType}`);
    }

    // Guardar evento para idempotencia
    await supabase.from('webhook_events').insert({
      event_id: eventId,
      event_type: eventType,
      source: 'stripe',
      payload: event
    });

    return new Response(JSON.stringify({ received: true, success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`[Stripe Webhook] Error: ${error.message}`);
    // Siempre responder 200 para que Stripe no reintente
    return new Response(JSON.stringify({ received: true, error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
