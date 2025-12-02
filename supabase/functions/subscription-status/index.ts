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

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuario no autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get subscription
    let { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Create subscription if it doesn't exist (for existing users)
    if (!subscription) {
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: newSub, error: createError } = await supabaseService
        .from('subscriptions')
        .insert({
          user_id: user.id,
          tier: 'FREE',
          status: 'active'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating subscription:', createError);
        return new Response(
          JSON.stringify({ error: 'Error al crear la suscripción' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      subscription = newSub;
    }

    // Get tier limits
    const tierLimits = getTierLimits(subscription.tier);
    
    // Check if monthly reset is needed
    const lastReset = new Date(subscription.last_reset_date);
    const now = new Date();
    const needsReset = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();
    
    let recipeCount = subscription.monthly_recipe_count;
    let audioCount = subscription.monthly_audio_count;
    
    if (needsReset) {
      recipeCount = 0;
      audioCount = 0;
      // Update in background
      await supabase
        .from('subscriptions')
        .update({ 
          monthly_recipe_count: 0, 
          monthly_audio_count: 0,
          last_reset_date: now.toISOString().split('T')[0]
        })
        .eq('user_id', user.id);
    }

    const response = {
      tier: subscription.tier,
      status: subscription.status,
      features: {
        recipes_per_month: tierLimits.recipes_per_month,
        recipes_used: recipeCount,
        recipes_remaining: tierLimits.recipes_per_month === -1 ? -1 : Math.max(0, tierLimits.recipes_per_month - recipeCount),
        audio_generation_per_month: tierLimits.audio_per_month,
        audio_used: audioCount,
        audio_remaining: tierLimits.audio_per_month === -1 ? -1 : Math.max(0, tierLimits.audio_per_month - audioCount),
        has_ai_coach: tierLimits.has_ai_coach,
        has_community_access: tierLimits.has_community_access,
        has_advanced_stats: tierLimits.has_advanced_stats,
        has_breathing_full: tierLimits.has_breathing_full,
        has_audio_library: tierLimits.has_audio_library
      },
      subscription_start_date: subscription.subscription_start_date,
      subscription_end_date: subscription.subscription_end_date
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en subscription-status:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getTierLimits(tier: string) {
  switch (tier) {
    case 'FREE':
      return {
        recipes_per_month: 5,
        audio_per_month: 0,
        has_ai_coach: false,
        has_community_access: false,
        has_advanced_stats: false,
        has_breathing_full: false,
        has_audio_library: false
      };
    case 'BASIC':
      return {
        recipes_per_month: 50,
        audio_per_month: 10,
        has_ai_coach: false,
        has_community_access: false,
        has_advanced_stats: false,
        has_breathing_full: true,
        has_audio_library: true
      };
    case 'PREMIUM':
      return {
        recipes_per_month: -1,
        audio_per_month: -1,
        has_ai_coach: true,
        has_community_access: true,
        has_advanced_stats: true,
        has_breathing_full: true,
        has_audio_library: true
      };
    default:
      return {
        recipes_per_month: 5,
        audio_per_month: 0,
        has_ai_coach: false,
        has_community_access: false,
        has_advanced_stats: false,
        has_breathing_full: false,
        has_audio_library: false
      };
  }
}
