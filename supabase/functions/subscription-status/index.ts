import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Límites por tier
const TIER_LIMITS = {
  FREE: {
    recipes_per_month: 5,
    audio_per_month: 0,
    has_ai_coach: false,
    has_community_access: false,
    has_advanced_stats: false,
    has_breathing_full: false,
    has_audio_library: false
  },
  BASIC: {
    recipes_per_month: 50,
    audio_per_month: 10,
    has_ai_coach: false,
    has_community_access: false,
    has_advanced_stats: false,
    has_breathing_full: true,
    has_audio_library: true
  },
  PREMIUM: {
    recipes_per_month: -1,
    audio_per_month: -1,
    has_ai_coach: true,
    has_community_access: true,
    has_advanced_stats: true,
    has_breathing_full: true,
    has_audio_library: true
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Subscription Status] Solicitud recibida');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verificar autenticación
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

    console.log(`[Subscription Status] Usuario: ${user.id}`);

    // Obtener suscripción
    let { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    // Si no existe, crear suscripción FREE
    if (!subscription) {
      console.log('[Subscription Status] Creando suscripción FREE');
      
      const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
      const { data: newSub, error: createError } = await supabaseService
        .from('subscriptions')
        .insert({
          user_id: user.id,
          tier: 'FREE',
          status: 'active',
          monthly_recipe_count: 0,
          monthly_audio_count: 0,
          last_reset_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (createError) {
        console.error(`[Subscription Status] Error creando suscripción: ${createError.message}`);
      }
      subscription = newSub;
    }

    const tier = (subscription?.tier as keyof typeof TIER_LIMITS) || 'FREE';
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.FREE;

    // Verificar reset mensual
    const lastReset = subscription?.last_reset_date ? new Date(subscription.last_reset_date) : new Date(0);
    const now = new Date();
    const isNewMonth = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();

    let recipesUsed = subscription?.monthly_recipe_count || 0;
    let audioUsed = subscription?.monthly_audio_count || 0;

    if (isNewMonth && subscription) {
      console.log('[Subscription Status] Reseteando contadores mensuales');
      recipesUsed = 0;
      audioUsed = 0;

      await supabase
        .from('subscriptions')
        .update({
          monthly_recipe_count: 0,
          monthly_audio_count: 0,
          last_reset_date: now.toISOString().split('T')[0],
          updated_at: now.toISOString()
        })
        .eq('user_id', user.id);
    }

    // Calcular restantes
    const recipesRemaining = limits.recipes_per_month === -1 
      ? -1 
      : Math.max(0, limits.recipes_per_month - recipesUsed);
    
    const audioRemaining = limits.audio_per_month === -1 
      ? -1 
      : Math.max(0, limits.audio_per_month - audioUsed);

    const response = {
      tier: subscription?.tier || 'FREE',
      status: subscription?.status || 'active',
      source: subscription?.subscription_source || null,
      features: {
        recipes_per_month: limits.recipes_per_month,
        recipes_used: recipesUsed,
        recipes_remaining: recipesRemaining,
        audio_generation_per_month: limits.audio_per_month,
        audio_used: audioUsed,
        audio_remaining: audioRemaining,
        has_ai_coach: limits.has_ai_coach,
        has_community_access: limits.has_community_access,
        has_advanced_stats: limits.has_advanced_stats,
        has_breathing_full: limits.has_breathing_full,
        has_audio_library: limits.has_audio_library
      },
      subscription_start_date: subscription?.subscription_start_date || null,
      subscription_end_date: subscription?.subscription_end_date || null
    };

    console.log(`[Subscription Status] Tier: ${response.tier}, Status: ${response.status}`);

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[Subscription Status] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: 'Error al obtener el estado de la suscripción' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
