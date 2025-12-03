import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const event = JSON.parse(body);

    console.log('Stripe webhook received:', event.type);

    // Map Stripe product/price IDs to tiers
    const getTierFromPrice = (priceId: string): 'FREE' | 'BASIC' | 'PREMIUM' => {
      // These should be configured with actual Stripe price IDs
      const priceMapping: Record<string, 'BASIC' | 'PREMIUM'> = {
        'price_basic_monthly': 'BASIC',
        'price_basic_yearly': 'BASIC',
        'price_premium_monthly': 'PREMIUM',
        'price_premium_yearly': 'PREMIUM',
      };
      return priceMapping[priceId] || 'FREE';
    };

    // Extract user email from Stripe customer
    const getCustomerEmail = async (customerId: string): Promise<string | null> => {
      // In production, you would fetch the customer from Stripe API
      // For now, we expect the email in metadata
      return null;
    };

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const priceId = session.metadata?.price_id;
        
        if (customerEmail) {
          // Find user by email
          const { data: userData } = await supabase.auth.admin.listUsers();
          const user = userData?.users?.find(u => u.email === customerEmail);
          
          if (user) {
            const tier = getTierFromPrice(priceId);
            const { error } = await supabase
              .from('subscriptions')
              .update({
                tier,
                status: 'active',
                subscription_source: 'web',
                subscription_start_date: new Date().toISOString(),
                subscription_end_date: null,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);

            if (error) {
              console.error('Error updating subscription:', error);
            } else {
              console.log(`Subscription updated for ${customerEmail} to ${tier} via web`);
            }
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const status = subscription.status;

        // Get customer email from metadata or Stripe
        const customerEmail = subscription.metadata?.email;

        if (customerEmail) {
          const { data: userData } = await supabase.auth.admin.listUsers();
          const user = userData?.users?.find(u => u.email === customerEmail);

          if (user) {
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
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);

            if (error) {
              console.error('Error updating subscription:', error);
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerEmail = subscription.metadata?.email;

        if (customerEmail) {
          const { data: userData } = await supabase.auth.admin.listUsers();
          const user = userData?.users?.find(u => u.email === customerEmail);

          if (user) {
            const { error } = await supabase
              .from('subscriptions')
              .update({
                tier: 'FREE',
                status: 'cancelled',
                subscription_source: 'web',
                subscription_end_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);

            if (error) {
              console.error('Error updating subscription:', error);
            }
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerEmail = invoice.customer_email;

        if (customerEmail) {
          const { data: userData } = await supabase.auth.admin.listUsers();
          const user = userData?.users?.find(u => u.email === customerEmail);

          if (user) {
            const { error } = await supabase
              .from('subscriptions')
              .update({
                status: 'expired',
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);

            if (error) {
              console.error('Error updating subscription:', error);
            }
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
