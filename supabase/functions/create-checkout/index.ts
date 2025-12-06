import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeo de tiers a precios de Stripe
const getPriceId = (tier: string): string | null => {
  if (tier === 'BASIC') {
    return Deno.env.get('STRIPE_PRICE_ID_BASIC') || null;
  }
  if (tier === 'PREMIUM') {
    return Deno.env.get('STRIPE_PRICE_ID_PREMIUM') || null;
  }
  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Create Checkout] Solicitud recibida');

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('[Create Checkout] STRIPE_SECRET_KEY no configurada');
      return new Response(
        JSON.stringify({ error: 'Configuración de pago no disponible' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Parsear body
    const { tier, userId, successUrl, cancelUrl } = await req.json();

    // Validación de tier
    if (!tier || !['BASIC', 'PREMIUM'].includes(tier)) {
      console.error('[Create Checkout] Tier inválido:', tier);
      return new Response(
        JSON.stringify({ error: 'Tier inválido. Debe ser BASIC o PREMIUM' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener price_id
    const priceId = getPriceId(tier);
    if (!priceId) {
      console.error(`[Create Checkout] Price ID no configurado para tier ${tier}`);
      return new Response(
        JSON.stringify({ error: `Precio no configurado para el plan ${tier}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar usuario
    let userIdToUse = userId;
    let userEmail = '';

    if (!userIdToUse) {
      // Intentar obtener del token
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        const { data: { user } } = await supabaseAnon.auth.getUser();
        if (user) {
          userIdToUse = user.id;
          userEmail = user.email || '';
        }
      }
    }

    if (!userIdToUse) {
      console.error('[Create Checkout] Usuario no autenticado');
      return new Response(
        JSON.stringify({ error: 'Debes iniciar sesión para suscribirte' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Obtener email del usuario si no lo tenemos
    if (!userEmail) {
      const { data: userData } = await supabase.auth.admin.getUserById(userIdToUse);
      userEmail = userData.user?.email || '';
    }

    console.log(`[Create Checkout] Creando sesión para usuario ${userIdToUse}, tier: ${tier}`);

    // Verificar si ya existe un stripe_customer_id
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userIdToUse)
      .maybeSingle();

    let stripeCustomerId = subscription?.stripe_customer_id;

    // Crear cliente de Stripe si no existe
    if (!stripeCustomerId && userEmail) {
      console.log('[Create Checkout] Creando cliente en Stripe');
      
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: userEmail,
          'metadata[user_id]': userIdToUse,
        }),
      });

      if (customerResponse.ok) {
        const customer = await customerResponse.json();
        stripeCustomerId = customer.id;

        // Guardar customer_id
        await supabase
          .from('subscriptions')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('user_id', userIdToUse);

        console.log(`[Create Checkout] Cliente Stripe creado: ${stripeCustomerId}`);
      }
    }

    // URLs
    const origin = req.headers.get('origin') || 'https://lovable.dev';
    const defaultSuccessUrl = successUrl || `${origin}/suscripcion?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = cancelUrl || `${origin}/suscripcion?cancelled=true`;

    // Crear Checkout Session
    const sessionParams: Record<string, string> = {
      'mode': 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': defaultSuccessUrl,
      'cancel_url': defaultCancelUrl,
      'metadata[user_id]': userIdToUse,
      'metadata[tier]': tier,
      'subscription_data[metadata][user_id]': userIdToUse,
      'subscription_data[metadata][tier]': tier,
    };

    if (stripeCustomerId) {
      sessionParams['customer'] = stripeCustomerId;
    } else if (userEmail) {
      sessionParams['customer_email'] = userEmail;
    }

    const checkoutResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(sessionParams),
    });

    const checkoutData = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      console.error('[Create Checkout] Error de Stripe:', checkoutData);
      return new Response(
        JSON.stringify({ error: checkoutData.error?.message || 'Error al crear sesión de pago' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Create Checkout] Sesión creada: ${checkoutData.id}`);

    return new Response(
      JSON.stringify({ 
        sessionId: checkoutData.id, 
        url: checkoutData.url 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[Create Checkout] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
