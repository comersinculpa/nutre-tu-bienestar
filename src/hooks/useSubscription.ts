import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';
export type Feature = 'generate_recipe' | 'generate_audio' | 'ai_coach' | 'community' | 'advanced_stats' | 'breathing_full' | 'audio_library';

export interface SubscriptionFeatures {
  recipes_per_month: number;
  recipes_used: number;
  recipes_remaining: number;
  audio_generation_per_month: number;
  audio_used: number;
  audio_remaining: number;
  has_ai_coach: boolean;
  has_community_access: boolean;
  has_advanced_stats: boolean;
  has_breathing_full: boolean;
  has_audio_library: boolean;
}

export interface SubscriptionData {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  features: SubscriptionFeatures;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
}

export interface FeatureCheckResult {
  allowed: boolean;
  reason: string | null;
  message: string | null;
  upgrade_tier: SubscriptionTier | null;
}

const TIER_INFO = {
  FREE: {
    name: 'Gratuito',
    price: '0€',
    priceMonthly: 0,
    color: 'bg-muted',
    features: [
      '5 recetas personalizadas/mes',
      'Seguimiento básico del bienestar',
      'Acceso limitado a respiración'
    ]
  },
  BASIC: {
    name: 'Básico',
    price: '4.99€',
    priceMonthly: 4.99,
    color: 'bg-primary/20',
    features: [
      '50 recetas personalizadas/mes',
      'Seguimiento avanzado con gráficos',
      'Acceso completo a respiración',
      'Biblioteca de audios guiados',
      '10 audios IA/mes'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: '9.99€',
    priceMonthly: 9.99,
    color: 'bg-accent/20',
    features: [
      'Recetas ilimitadas',
      'Coach IA personalizado 24/7',
      'Audios IA ilimitados',
      'Todos los contenidos premium',
      'Acceso a la comunidad',
      'Estadísticas avanzadas e insights'
    ]
  }
};

export function useSubscription() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fnError } = await supabase.functions.invoke('subscription-status');

      if (fnError) {
        throw fnError;
      }

      setSubscription(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Error al cargar la suscripción');
      // Set default free subscription on error
      setSubscription({
        tier: 'FREE',
        status: 'active',
        features: {
          recipes_per_month: 5,
          recipes_used: 0,
          recipes_remaining: 5,
          audio_generation_per_month: 0,
          audio_used: 0,
          audio_remaining: 0,
          has_ai_coach: false,
          has_community_access: false,
          has_advanced_stats: false,
          has_breathing_full: false,
          has_audio_library: false
        },
        subscription_start_date: null,
        subscription_end_date: null
      });
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const checkFeature = useCallback(async (feature: Feature): Promise<FeatureCheckResult> => {
    if (!user || !session) {
      return {
        allowed: false,
        reason: 'NOT_AUTHENTICATED',
        message: 'Debes iniciar sesión para usar esta función',
        upgrade_tier: null
      };
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-feature', {
        body: { feature }
      });

      if (fnError) {
        throw fnError;
      }

      return data;
    } catch (err) {
      console.error('Error checking feature:', err);
      return {
        allowed: false,
        reason: 'SERVER_ERROR',
        message: 'Error al verificar los permisos',
        upgrade_tier: null
      };
    }
  }, [user, session]);

  const incrementUsage = useCallback(async (type: 'recipe' | 'audio'): Promise<boolean> => {
    if (!user || !session) return false;

    try {
      const { data, error: fnError } = await supabase.functions.invoke('increment-usage', {
        body: { type }
      });

      if (fnError || !data?.success) {
        throw fnError || new Error('Failed to increment usage');
      }

      // Refresh subscription data
      await fetchSubscription();
      return true;
    } catch (err) {
      console.error('Error incrementing usage:', err);
      return false;
    }
  }, [user, session, fetchSubscription]);

  const getTierInfo = useCallback((tier?: SubscriptionTier) => {
    return TIER_INFO[tier || subscription?.tier || 'FREE'];
  }, [subscription]);

  const canUseFeature = useCallback((feature: Feature): boolean => {
    if (!subscription) return false;

    switch (feature) {
      case 'generate_recipe':
        return subscription.features.recipes_remaining > 0 || subscription.features.recipes_remaining === -1;
      case 'generate_audio':
        return subscription.features.audio_remaining > 0 || subscription.features.audio_remaining === -1;
      case 'ai_coach':
        return subscription.features.has_ai_coach;
      case 'community':
        return subscription.features.has_community_access;
      case 'advanced_stats':
        return subscription.features.has_advanced_stats;
      case 'breathing_full':
        return subscription.features.has_breathing_full;
      case 'audio_library':
        return subscription.features.has_audio_library;
      default:
        return false;
    }
  }, [subscription]);

  return {
    subscription,
    loading,
    error,
    checkFeature,
    incrementUsage,
    refreshSubscription: fetchSubscription,
    getTierInfo,
    canUseFeature,
    TIER_INFO
  };
}
