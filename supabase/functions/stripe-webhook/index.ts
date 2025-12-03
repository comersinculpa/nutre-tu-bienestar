import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

// Verificar firma del webhook de Stripe
async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const parts = signature.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
    const v1Signature = parts.find(p => p.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !v1Signature) {
      console.error('Firma de Stripe incompleta');
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
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
    console.error('Error verificando firma:', error);
    return false;
  }
}

// Mapear price IDs a tiers
const getTierFromPrice = (priceId: string): 'FREE' | 'BASIC' | 'PREMIUM' => {
  const basicPriceId = Deno.env.get('STRIPE_PRICE_BASIC') || 'price_basic_monthly';
  const premiumPriceId = Deno.env.get('STRIPE_PRICE_PREMIUM') || 'price_premium_monthly';
  
  if (priceId === basicPriceId) return 'BASIC';
  if (priceId === premiumPriceId) return 'PREMIUM';
  
  // Fallback para IDs conocidos
  if (priceId.toLowerCase().includes('basic')) return 'BASIC';
  if (priceId.toLowerCase().includes('premium')) return 'PREMIUM';
  
  return 'FREE';
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    // Verificar firma si el secret está configurado
    if (webhookSecret && signature) {
      const isValid = await verifyStripeSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Firma de webhook inválida');
        return new Response(
          JSON.stringify({ error: 'Firma inválida' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Firma de Stripe verificada correctamente');
    } else {
      console.warn('STRIPE_WEBHOOK_SECRET no configurado o falta firma, omitiendo verificación');
    }

    const event = JSON.parse(body);
    console.log('Stripe webhook recibido:', event.type);

    // Función auxiliar para obtener user_id de metadata
    const getUserIdFromMetadata = (metadata: any): string | null => {
      return metadata?.user_id || null;
    };

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = getUserIdFromMetadata(session.metadata);
        const tier = session.metadata?.tier || getTierFromPrice(session.metadata?.price_id || '');
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log('Checkout completado:', { userId, tier, customerId, subscriptionId });

        if (userId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              tier,
              status: 'active',
              subscription_source: 'web',
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_start_date: new Date().toISOString(),
              subscription_end_date: null,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (error) {
            console.error('Error actualizando suscripción:', error);
          } else {
            console.log(`Suscripción actualizada para usuario ${userId} a tier ${tier}`);
          }
        } else {
          console.error('No se encontró user_id en metadata del checkout');
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = getUserIdFromMetadata(subscription.metadata);
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const status = subscription.status;
        const customerId = subscription.customer;

        console.log('Suscripción creada/actualizada:', { userId, priceId, status, customerId });

        if (userId) {
          const tier = status === 'active' ? getTierFromPrice(priceId) : 'FREE';
          const subscriptionStatus = status === 'active' ? 'active' : 
                                     status === 'canceled' ? 'cancelled' : 
                                     status === 'past_due' ? 'expired' : 'active';

          const { error } = await supabase
            .from('subscriptions')
            .update({
              tier,
              status: subscriptionStatus,
              subscription_source: 'web',
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (error) {
            console.error('Error actualizando suscripción:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = getUserIdFromMetadata(subscription.metadata);

        console.log('Suscripción eliminada:', { userId });

        if (userId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              tier: 'FREE',
              status: 'cancelled',
              subscription_source: 'web',
              subscription_end_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (error) {
            console.error('Error actualizando suscripción:', error);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        console.log('Pago fallido para suscripción:', subscriptionId);

        if (subscriptionId) {
          // Buscar usuario por stripe_subscription_id
          const { data: subData } = await supabase
            .from('subscriptions')
            .select('user_id')
            .eq('stripe_subscription_id', subscriptionId)
            .maybeSingle();

          if (subData?.user_id) {
            const { error } = await supabase
              .from('subscriptions')
              .update({
                status: 'expired',
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', subData.user_id);

            if (error) {
              console.error('Error actualizando suscripción:', error);
            }
          }
        }
        break;
      }

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en stripe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
