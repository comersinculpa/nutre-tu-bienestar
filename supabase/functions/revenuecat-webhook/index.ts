import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RevenueCatEvent {
  event: {
    type: string;
    app_user_id: string;
    product_id: string;
    expiration_at_ms?: number;
    store?: string; // APP_STORE, PLAY_STORE, etc.
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Verify webhook signature (optional - add REVENUECAT_WEBHOOK_SECRET if needed)
    const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
    if (webhookSecret) {
      const signature = req.headers.get('X-RevenueCat-Webhook-Signature');
      // Add signature verification logic here if needed
    }

    const payload: RevenueCatEvent = await req.json();
    const { event } = payload;

    console.log('RevenueCat webhook received:', event.type, 'for user:', event.app_user_id);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Map product_id to tier
    const getTierFromProduct = (productId: string): 'FREE' | 'BASIC' | 'PREMIUM' => {
      if (productId.includes('premium') || productId.includes('pro')) return 'PREMIUM';
      if (productId.includes('basic') || productId.includes('starter')) return 'BASIC';
      return 'FREE';
    };

    // Get user by revenuecat_user_id or app_user_id (which should be the Supabase user_id)
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .or(`revenuecat_user_id.eq.${event.app_user_id},user_id.eq.${event.app_user_id}`)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Error al buscar la suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscription) {
      console.log('No subscription found for user:', event.app_user_id);
      return new Response(
        JSON.stringify({ message: 'Usuario no encontrado, ignorando evento' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine subscription source based on store
    const getSubscriptionSource = (store?: string): 'ios' | 'android' => {
      if (store === 'APP_STORE' || store === 'MAC_APP_STORE') return 'ios';
      return 'android'; // PLAY_STORE or default to android for mobile
    };

    let updateData: Record<string, unknown> = {
      revenuecat_user_id: event.app_user_id,
      subscription_source: getSubscriptionSource(event.store),
    };

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        updateData.tier = getTierFromProduct(event.product_id);
        updateData.status = 'active';
        updateData.subscription_start_date = new Date().toISOString();
        if (event.expiration_at_ms) {
          updateData.subscription_end_date = new Date(event.expiration_at_ms).toISOString();
        }
        console.log('Activating subscription:', updateData);
        break;

      case 'CANCELLATION':
        updateData.status = 'cancelled';
        console.log('Cancelling subscription');
        break;

      case 'EXPIRATION':
        updateData.status = 'expired';
        updateData.tier = 'FREE';
        console.log('Expiring subscription');
        break;

      case 'BILLING_ISSUE':
        updateData.status = 'expired';
        console.log('Billing issue detected');
        break;

      default:
        console.log('Unhandled event type:', event.type);
        return new Response(
          JSON.stringify({ message: 'Evento no manejado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return new Response(
        JSON.stringify({ error: 'Error al actualizar la suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Subscription updated successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Suscripción actualizada correctamente' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en revenuecat-webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
