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

  console.log('[Customer Portal] Solicitud recibida');

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('[Customer Portal] STRIPE_SECRET_KEY no configurada');
      return new Response(
        JSON.stringify({ error: 'Configuración no disponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Obtener usuario del token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Debes iniciar sesión' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuario no autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener returnUrl del body (opcional)
    let returnUrl = '';
    try {
      const body = await req.json();
      returnUrl = body.returnUrl || '';
    } catch {
      // Body vacío
    }

    if (!returnUrl) {
      returnUrl = `${req.headers.get('origin') || 'https://lovable.dev'}/suscripcion`;
    }

    console.log(`[Customer Portal] Usuario: ${user.id}`);

    // Obtener stripe_customer_id
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, subscription_source')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!subscription?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: 'No tienes una suscripción de Stripe activa' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Customer Portal] Customer: ${subscription.stripe_customer_id}`);

    // Crear sesión del portal
    const portalResponse = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: subscription.stripe_customer_id,
        return_url: returnUrl,
      }),
    });

    const portalData = await portalResponse.json();

    if (!portalResponse.ok) {
      console.error('[Customer Portal] Error de Stripe:', portalData);
      return new Response(
        JSON.stringify({ error: 'Error al crear el portal de cliente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Customer Portal] Portal creado para usuario ${user.id}`);

    return new Response(
      JSON.stringify({ url: portalData.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[Customer Portal] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
