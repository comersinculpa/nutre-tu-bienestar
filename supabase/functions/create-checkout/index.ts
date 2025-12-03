import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapeo de tiers a precios de Stripe (configura estos IDs en tu dashboard de Stripe)
const PRICE_IDS: Record<string, string> = {
  'BASIC': Deno.env.get('STRIPE_PRICE_BASIC') || 'price_basic_monthly',
  'PREMIUM': Deno.env.get('STRIPE_PRICE_PREMIUM') || 'price_premium_monthly',
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

    const { tier, userId, successUrl, cancelUrl } = await req.json();

    // Validar entrada
    if (!tier || !userId) {
      return new Response(
        JSON.stringify({ error: 'Faltan parámetros: tier y userId son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['BASIC', 'PREMIUM'].includes(tier)) {
      return new Response(
        JSON.stringify({ error: 'Tier inválido. Debe ser BASIC o PREMIUM' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError || !userData?.user) {
      console.error('Error obteniendo usuario:', userError);
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userEmail = userData.user.email;

    // Verificar si ya existe un customer en Stripe
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();

    let customerId = subscription?.stripe_customer_id;

    // Si no existe customer, crear uno en Stripe
    if (!customerId) {
      console.log('Creando nuevo customer en Stripe para:', userEmail);
      
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: userEmail || '',
          'metadata[user_id]': userId,
        }),
      });

      const customerData = await customerResponse.json();
      if (!customerResponse.ok) {
        console.error('Error creando customer:', customerData);
        throw new Error('Error creando customer en Stripe');
      }

      customerId = customerData.id;

      // Guardar el customer_id en la base de datos
      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    // Crear sesión de checkout
    const priceId = PRICE_IDS[tier];
    console.log('Creando checkout session para tier:', tier, 'price:', priceId);

    const checkoutParams = new URLSearchParams({
      'customer': customerId,
      'mode': 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': successUrl || `${req.headers.get('origin')}/suscripcion?success=true`,
      'cancel_url': cancelUrl || `${req.headers.get('origin')}/suscripcion?canceled=true`,
      'metadata[user_id]': userId,
      'metadata[tier]': tier,
      'subscription_data[metadata][user_id]': userId,
      'subscription_data[metadata][tier]': tier,
      'subscription_data[metadata][email]': userEmail || '',
    });

    const checkoutResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: checkoutParams,
    });

    const checkoutData = await checkoutResponse.json();
    
    if (!checkoutResponse.ok) {
      console.error('Error creando checkout session:', checkoutData);
      throw new Error(checkoutData.error?.message || 'Error creando sesión de pago');
    }

    console.log('Checkout session creada:', checkoutData.id);

    return new Response(
      JSON.stringify({ 
        sessionId: checkoutData.id, 
        url: checkoutData.url 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en create-checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
