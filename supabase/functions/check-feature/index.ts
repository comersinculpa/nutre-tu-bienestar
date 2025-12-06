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

// Mensajes de error personalizados
const ERROR_MESSAGES = {
  FREE: {
    generate_recipe: 'Has alcanzado tu límite de 5 recetas este mes. Mejora a Básico para obtener 50 recetas por mes.',
    generate_audio: 'La generación de audio no está disponible en el plan gratuito. Mejora a Básico para acceder.',
    ai_coach: 'El coach IA está disponible solo en el plan Premium.',
    community: 'El acceso a la comunidad está disponible solo en el plan Premium.',
    advanced_stats: 'Las estadísticas avanzadas están disponibles solo en el plan Premium.',
    breathing_full: 'El acceso completo a respiración está disponible desde el plan Básico.',
    audio_library: 'La biblioteca de audios está disponible desde el plan Básico.'
  },
  BASIC: {
    generate_recipe: 'Has alcanzado tu límite de 50 recetas este mes. Mejora a Premium para recetas ilimitadas.',
    generate_audio: 'Has alcanzado tu límite de 10 audios este mes. Mejora a Premium para audios ilimitados.',
    ai_coach: 'El coach IA está disponible solo en el plan Premium.',
    community: 'El acceso a la comunidad está disponible solo en el plan Premium.',
    advanced_stats: 'Las estadísticas avanzadas están disponibles solo en el plan Premium.'
  }
};

type Feature = 'generate_recipe' | 'generate_audio' | 'ai_coach' | 'community' | 'advanced_stats' | 'breathing_full' | 'audio_library';
type Tier = 'FREE' | 'BASIC' | 'PREMIUM';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Check Feature] Solicitud recibida');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verificar autenticación
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'NOT_AUTHENTICATED',
          message: 'Debes iniciar sesión para usar esta función',
          upgrade_tier: null
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'NOT_AUTHENTICATED',
          message: 'Usuario no autenticado',
          upgrade_tier: null
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener feature del body
    const { feature } = await req.json() as { feature: Feature };

    if (!feature) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'INVALID_REQUEST',
          message: 'Función no especificada',
          upgrade_tier: null
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Check Feature] Usuario: ${user.id}, Feature: ${feature}`);

    // Obtener suscripción
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const tier = (subscription?.tier as Tier) || 'FREE';
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.FREE;
    
    // Verificar si necesita reset mensual
    const lastReset = subscription?.last_reset_date ? new Date(subscription.last_reset_date) : new Date(0);
    const now = new Date();
    const isNewMonth = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();
    
    const recipesUsed = isNewMonth ? 0 : (subscription?.monthly_recipe_count || 0);
    const audioUsed = isNewMonth ? 0 : (subscription?.monthly_audio_count || 0);

    // Verificar estado de suscripción
    if (subscription?.status && subscription.status !== 'active' && subscription.status !== 'trial') {
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: 'SUBSCRIPTION_INACTIVE',
          message: 'Tu suscripción no está activa',
          upgrade_tier: 'BASIC',
          current_tier: tier
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let allowed = false;
    let reason: string | null = null;
    let message: string | null = null;
    let upgradeTier: Tier | null = null;

    switch (feature) {
      case 'generate_recipe':
        if (limits.recipes_per_month === -1 || recipesUsed < limits.recipes_per_month) {
          allowed = true;
        } else {
          reason = 'LIMIT_REACHED';
          message = ERROR_MESSAGES[tier]?.generate_recipe || 'Límite alcanzado';
          upgradeTier = tier === 'FREE' ? 'BASIC' : 'PREMIUM';
        }
        break;

      case 'generate_audio':
        if (limits.audio_per_month === -1) {
          allowed = true;
        } else if (limits.audio_per_month === 0) {
          reason = 'TIER_REQUIRED';
          message = ERROR_MESSAGES[tier]?.generate_audio || 'No disponible en tu plan';
          upgradeTier = 'BASIC';
        } else if (audioUsed < limits.audio_per_month) {
          allowed = true;
        } else {
          reason = 'LIMIT_REACHED';
          message = ERROR_MESSAGES[tier]?.generate_audio || 'Límite alcanzado';
          upgradeTier = 'PREMIUM';
        }
        break;

      case 'ai_coach':
        allowed = limits.has_ai_coach;
        if (!allowed) {
          reason = 'TIER_REQUIRED';
          message = ERROR_MESSAGES[tier]?.ai_coach || 'Requiere plan Premium';
          upgradeTier = 'PREMIUM';
        }
        break;

      case 'community':
        allowed = limits.has_community_access;
        if (!allowed) {
          reason = 'TIER_REQUIRED';
          message = ERROR_MESSAGES[tier]?.community || 'Requiere plan Premium';
          upgradeTier = 'PREMIUM';
        }
        break;

      case 'advanced_stats':
        allowed = limits.has_advanced_stats;
        if (!allowed) {
          reason = 'TIER_REQUIRED';
          message = ERROR_MESSAGES[tier]?.advanced_stats || 'Requiere plan Premium';
          upgradeTier = 'PREMIUM';
        }
        break;

      case 'breathing_full':
        allowed = limits.has_breathing_full;
        if (!allowed) {
          reason = 'TIER_REQUIRED';
          message = ERROR_MESSAGES[tier]?.breathing_full || 'Requiere plan Básico';
          upgradeTier = 'BASIC';
        }
        break;

      case 'audio_library':
        allowed = limits.has_audio_library;
        if (!allowed) {
          reason = 'TIER_REQUIRED';
          message = ERROR_MESSAGES[tier]?.audio_library || 'Requiere plan Básico';
          upgradeTier = 'BASIC';
        }
        break;

      default:
        reason = 'UNKNOWN_FEATURE';
        message = 'Función desconocida';
    }

    console.log(`[Check Feature] ${feature}: ${allowed ? 'permitido' : reason}`);

    return new Response(
      JSON.stringify({
        allowed,
        reason,
        message,
        upgrade_tier: upgradeTier,
        current_tier: tier
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[Check Feature] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        allowed: false, 
        reason: 'SERVER_ERROR',
        message: 'Error al verificar los permisos',
        upgrade_tier: null
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
