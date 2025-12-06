/**
 * Feature Check Hook
 * Easy-to-use hook for checking feature access before performing actions
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSubscription, Feature } from './useSubscription';
import { useAuth } from './useAuth';

interface UseFeatureCheckResult {
  /** Check if feature can be used and show appropriate message if not */
  checkAndExecute: (feature: Feature, action: () => void | Promise<void>) => Promise<boolean>;
  /** Check if feature is available without executing anything */
  isFeatureAvailable: (feature: Feature) => boolean;
  /** Show upgrade prompt for a specific feature */
  showUpgradePrompt: (feature: Feature) => void;
}

const FEATURE_MESSAGES: Record<Feature, { blocked: string; upgrade: string }> = {
  generate_recipe: {
    blocked: 'Has alcanzado tu límite de recetas este mes',
    upgrade: 'Mejora tu plan para generar más recetas'
  },
  generate_audio: {
    blocked: 'Has alcanzado tu límite de audios IA este mes',
    upgrade: 'Mejora tu plan para generar más audios'
  },
  ai_coach: {
    blocked: 'El Coach IA requiere plan Premium',
    upgrade: 'Mejora a Premium para acceder al Coach IA 24/7'
  },
  community: {
    blocked: 'La comunidad requiere plan Premium',
    upgrade: 'Mejora a Premium para unirte a la comunidad'
  },
  advanced_stats: {
    blocked: 'Las estadísticas avanzadas requieren plan Premium',
    upgrade: 'Mejora a Premium para ver insights detallados'
  },
  breathing_full: {
    blocked: 'Los ejercicios completos requieren plan Básico o superior',
    upgrade: 'Mejora tu plan para acceder a todos los ejercicios'
  },
  audio_library: {
    blocked: 'La biblioteca de audios requiere plan Básico o superior',
    upgrade: 'Mejora tu plan para acceder a todos los audios'
  }
};

export function useFeatureCheck(): UseFeatureCheckResult {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature, subscription, incrementUsage } = useSubscription();

  const isFeatureAvailable = useCallback((feature: Feature): boolean => {
    if (!user) return false;
    return canUseFeature(feature);
  }, [user, canUseFeature]);

  const showUpgradePrompt = useCallback((feature: Feature) => {
    const messages = FEATURE_MESSAGES[feature];
    
    toast.error(messages.blocked, {
      description: messages.upgrade,
      action: {
        label: 'Ver planes',
        onClick: () => navigate('/planes')
      },
      duration: 5000
    });
  }, [navigate]);

  const checkAndExecute = useCallback(async (
    feature: Feature, 
    action: () => void | Promise<void>
  ): Promise<boolean> => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Debes iniciar sesión', {
        action: {
          label: 'Iniciar sesión',
          onClick: () => navigate('/auth')
        }
      });
      return false;
    }

    // Check if feature is available
    if (!canUseFeature(feature)) {
      showUpgradePrompt(feature);
      return false;
    }

    // Execute the action
    try {
      await action();
      
      // Increment usage for trackable features
      if (feature === 'generate_recipe') {
        await incrementUsage('recipe');
      } else if (feature === 'generate_audio') {
        await incrementUsage('audio');
      }
      
      return true;
    } catch (error) {
      console.error('Error executing feature action:', error);
      toast.error('Error al ejecutar la acción');
      return false;
    }
  }, [user, canUseFeature, showUpgradePrompt, incrementUsage, navigate]);

  return {
    checkAndExecute,
    isFeatureAvailable,
    showUpgradePrompt
  };
}

export default useFeatureCheck;
