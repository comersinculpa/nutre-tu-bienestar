import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Feature = 'generate_recipe' | 'generate_audio' | 'ai_coach' | 'community' | 'advanced_stats' | 'breathing_full' | 'audio_library';

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
        JSON.stringify({ allowed: false, reason: 'NOT_AUTHENTICATED', message: 'Debes iniciar sesión' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { feature } = await req.json() as { feature: Feature };

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ allowed: false, reason: 'NOT_AUTHENTICATED', message: 'Usuario no autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return new Response(
        JSON.stringify({ allowed: false, reason: 'NO_SUBSCRIPTION', message: 'No se encontró tu suscripción' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if subscription is active
    if (subscription.status !== 'active' && subscription.status !== 'trial') {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'SUBSCRIPTION_INACTIVE', 
          message: 'Tu suscripción no está activa',
          upgrade_tier: 'BASIC'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tierLimits = getTierLimits(subscription.tier);
    
    // Check monthly reset
    const lastReset = new Date(subscription.last_reset_date);
    const now = new Date();
    const needsReset = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();
    
    let recipeCount = needsReset ? 0 : subscription.monthly_recipe_count;
    let audioCount = needsReset ? 0 : subscription.monthly_audio_count;

    let result = { allowed: true, reason: null as string | null, message: null as string | null, upgrade_tier: null as string | null };

    switch (feature) {
      case 'generate_recipe':
        if (tierLimits.recipes_per_month !== -1 && recipeCount >= tierLimits.recipes_per_month) {
          result = {
            allowed: false,
            reason: 'LIMIT_REACHED',
            message: `Has alcanzado tu límite de ${tierLimits.recipes_per_month} recetas este mes`,
            upgrade_tier: subscription.tier === 'FREE' ? 'BASIC' : 'PREMIUM'
          };
        }
        break;

      case 'generate_audio':
        if (tierLimits.audio_per_month === 0) {
          result = {
            allowed: false,
            reason: 'FEATURE_NOT_AVAILABLE',
            message: 'La generación de audio no está disponible en tu plan',
            upgrade_tier: 'BASIC'
          };
        } else if (tierLimits.audio_per_month !== -1 && audioCount >= tierLimits.audio_per_month) {
          result = {
            allowed: false,
            reason: 'LIMIT_REACHED',
            message: `Has alcanzado tu límite de ${tierLimits.audio_per_month} audios este mes`,
            upgrade_tier: 'PREMIUM'
          };
        }
        break;

      case 'ai_coach':
        if (!tierLimits.has_ai_coach) {
          result = {
            allowed: false,
            reason: 'FEATURE_NOT_AVAILABLE',
            message: 'El coach IA está disponible solo en el plan Premium',
            upgrade_tier: 'PREMIUM'
          };
        }
        break;

      case 'community':
        if (!tierLimits.has_community_access) {
          result = {
            allowed: false,
            reason: 'FEATURE_NOT_AVAILABLE',
            message: 'El acceso a la comunidad está disponible solo en el plan Premium',
            upgrade_tier: 'PREMIUM'
          };
        }
        break;

      case 'advanced_stats':
        if (!tierLimits.has_advanced_stats) {
          result = {
            allowed: false,
            reason: 'FEATURE_NOT_AVAILABLE',
            message: 'Las estadísticas avanzadas están disponibles solo en el plan Premium',
            upgrade_tier: 'PREMIUM'
          };
        }
        break;

      case 'breathing_full':
        if (!tierLimits.has_breathing_full) {
          result = {
            allowed: false,
            reason: 'FEATURE_NOT_AVAILABLE',
            message: 'Acceso completo a ejercicios de respiración disponible desde el plan Básico',
            upgrade_tier: 'BASIC'
          };
        }
        break;

      case 'audio_library':
        if (!tierLimits.has_audio_library) {
          result = {
            allowed: false,
            reason: 'FEATURE_NOT_AVAILABLE',
            message: 'La biblioteca de audios está disponible desde el plan Básico',
            upgrade_tier: 'BASIC'
          };
        }
        break;
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en check-feature:', error);
    return new Response(
      JSON.stringify({ allowed: false, reason: 'SERVER_ERROR', message: 'Error interno del servidor' }),
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
