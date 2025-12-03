import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY no configurada');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, returnUrl } = await req.json();

    // Validar entrada
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId es requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener el stripe_customer_id del usuario
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (subError || !subscription?.stripe_customer_id) {
      console.error('Error obteniendo customer_id:', subError);
      return new Response(
        JSON.stringify({ error: 'No se encontró cliente de Stripe para este usuario' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creando portal session para customer:', subscription.stripe_customer_id);

    // Crear sesión del portal de cliente
    const portalResponse = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'customer': subscription.stripe_customer_id,
        'return_url': returnUrl || `${req.headers.get('origin')}/suscripcion`,
      }),
    });

    const portalData = await portalResponse.json();

    if (!portalResponse.ok) {
      console.error('Error creando portal session:', portalData);
      throw new Error(portalData.error?.message || 'Error creando sesión del portal');
    }

    console.log('Portal session creada:', portalData.id);

    return new Response(
      JSON.stringify({ url: portalData.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en customer-portal:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
