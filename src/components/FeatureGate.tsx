/**
 * Feature Gate Component
 * Declarative way to conditionally render content based on subscription features
 */

import { ReactNode } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useSubscription, Feature } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface FeatureGateProps {
  /** The feature to check */
  feature: Feature;
  /** Content to show when feature is available */
  children: ReactNode;
  /** Optional content to show when feature is locked (default: upgrade card) */
  fallback?: ReactNode;
  /** If true, hides the component entirely when locked (no fallback shown) */
  hideWhenLocked?: boolean;
  /** Custom message for the upgrade prompt */
  upgradeMessage?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  hideWhenLocked = false,
  upgradeMessage
}: FeatureGateProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature, subscription } = useSubscription();

  // If no user, treat as locked
  if (!user) {
    if (hideWhenLocked) return null;
    return fallback || <AuthPrompt />;
  }

  // Check feature access
  const hasAccess = canUseFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Feature is locked
  if (hideWhenLocked) return null;

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  return (
    <UpgradeCard 
      feature={feature} 
      subscription={subscription}
      customMessage={upgradeMessage}
    />
  );
}

function AuthPrompt() {
  const navigate = useNavigate();
  
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-6 text-center">
        <Lock className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-3">
          Inicia sesión para acceder a esta funcionalidad
        </p>
        <Button size="sm" onClick={() => navigate('/auth')}>
          Iniciar sesión
        </Button>
      </CardContent>
    </Card>
  );
}

interface UpgradeCardProps {
  feature: Feature;
  subscription: any;
  customMessage?: string;
}

function UpgradeCard({ feature, subscription, customMessage }: UpgradeCardProps) {
  const navigate = useNavigate();
  
  const defaultMessages: Record<Feature, string> = {
    generate_recipe: subscription?.features?.recipes_per_month 
      ? `Límite alcanzado (${subscription.features.recipes_used}/${subscription.features.recipes_per_month})`
      : 'Mejora tu plan para generar recetas',
    generate_audio: subscription?.features?.audio_generation_per_month
      ? `Límite alcanzado (${subscription.features.audio_used}/${subscription.features.audio_generation_per_month})`
      : 'Mejora tu plan para generar audios',
    ai_coach: 'Coach IA disponible en Premium',
    community: 'Comunidad disponible en Premium',
    advanced_stats: 'Estadísticas avanzadas en Premium',
    breathing_full: 'Mejora tu plan para desbloquear',
    audio_library: 'Mejora tu plan para desbloquear'
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-medium">
            {customMessage || defaultMessages[feature]}
          </p>
        </div>
        <Button size="sm" onClick={() => navigate('/planes')}>
          Mejorar
        </Button>
      </CardContent>
    </Card>
  );
}

export default FeatureGate;
