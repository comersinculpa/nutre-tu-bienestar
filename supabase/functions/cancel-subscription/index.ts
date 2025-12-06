import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Cancel Subscription] Solicitud recibida');

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('[Cancel Subscription] STRIPE_SECRET_KEY no configurada');
      return new Response(
        JSON.stringify({ success: false, error: 'Configuración no disponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Obtener usuario del token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Debes iniciar sesión' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Cancel Subscription] Usuario: ${user.id}`);

    // Obtener suscripción
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, subscription_source')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError || !subscription) {
      console.error('[Cancel Subscription] Suscripción no encontrada');
      return new Response(
        JSON.stringify({ success: false, error: 'No se encontró tu suscripción' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar origen de la suscripción
    if (subscription.subscription_source && subscription.subscription_source !== 'web') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Para cancelar suscripciones móviles, hazlo desde la App Store o Google Play' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscription.stripe_subscription_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'No hay suscripción de Stripe activa' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Cancel Subscription] Cancelando: ${subscription.stripe_subscription_id}`);

    // Cancelar en Stripe (al final del período)
    const cancelResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions/${subscription.stripe_subscription_id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'cancel_at_period_end': 'true',
        }),
      }
    );

    const cancelData = await cancelResponse.json();

    if (!cancelResponse.ok) {
      console.error('[Cancel Subscription] Error de Stripe:', cancelData);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al cancelar la suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Actualizar en la base de datos
    const now = new Date().toISOString();
    const endDate = cancelData.current_period_end 
      ? new Date(cancelData.current_period_end * 1000).toISOString()
      : now;

    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        subscription_end_date: endDate,
        updated_at: now
      })
      .eq('user_id', user.id);

    console.log(`[Cancel Subscription] Suscripción cancelada para usuario ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Tu suscripción ha sido cancelada. Mantendrás acceso hasta el final del período actual.',
        end_date: endDate
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[Cancel Subscription] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
