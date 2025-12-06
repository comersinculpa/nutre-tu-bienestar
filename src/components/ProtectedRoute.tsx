/**
 * Protected Route Component
 * Handles authentication and subscription-based route protection
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription, Feature } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Require user to be authenticated */
  requireAuth?: boolean;
  /** Require specific subscription feature */
  requiredFeature?: Feature;
  /** Minimum subscription tier required */
  requiredTier?: 'BASIC' | 'PREMIUM';
  /** Custom fallback component when access denied */
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredFeature,
  requiredTier,
  fallback
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading, canUseFeature, getTierInfo } = useSubscription();

  // Show loading while checking auth/subscription
  if (authLoading || (requireAuth && subLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (requireAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check subscription tier requirement
  if (requiredTier && subscription) {
    const tierOrder = { FREE: 0, BASIC: 1, PREMIUM: 2 };
    const userTierLevel = tierOrder[subscription.tier] || 0;
    const requiredTierLevel = tierOrder[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      if (fallback) return <>{fallback}</>;
      
      return (
        <UpgradePrompt 
          requiredTier={requiredTier}
          currentTier={subscription.tier}
        />
      );
    }
  }

  // Check specific feature requirement
  if (requiredFeature && !canUseFeature(requiredFeature)) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <FeatureLockedPrompt 
        feature={requiredFeature}
        subscription={subscription}
      />
    );
  }

  return <>{children}</>;
}

interface UpgradePromptProps {
  requiredTier: 'BASIC' | 'PREMIUM';
  currentTier: string;
}

function UpgradePrompt({ requiredTier, currentTier }: UpgradePromptProps) {
  const tierNames = { BASIC: 'Básico', PREMIUM: 'Premium' };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-accent/10">
            <Lock className="h-8 w-8 text-accent" />
          </div>
          <CardTitle>Contenido {tierNames[requiredTier]}</CardTitle>
          <CardDescription>
            Esta funcionalidad está disponible para usuarios del plan {tierNames[requiredTier]} o superior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Tu plan actual: <span className="font-medium">{tierNames[currentTier as keyof typeof tierNames] || currentTier}</span>
          </p>
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/planes'}
          >
            Ver planes disponibles
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureLockedPromptProps {
  feature: Feature;
  subscription: any;
}

function FeatureLockedPrompt({ feature, subscription }: FeatureLockedPromptProps) {
  const featureNames: Record<Feature, string> = {
    generate_recipe: 'Generación de recetas',
    generate_audio: 'Generación de audios IA',
    ai_coach: 'Coach IA personalizado',
    community: 'Acceso a la comunidad',
    advanced_stats: 'Estadísticas avanzadas',
    breathing_full: 'Ejercicios de respiración completos',
    audio_library: 'Biblioteca de audios'
  };

  const featureMessages: Record<Feature, string> = {
    generate_recipe: `Has alcanzado tu límite mensual de recetas (${subscription?.features?.recipes_used || 0}/${subscription?.features?.recipes_per_month || 5}).`,
    generate_audio: `Has alcanzado tu límite mensual de audios IA (${subscription?.features?.audio_used || 0}/${subscription?.features?.audio_generation_per_month || 0}).`,
    ai_coach: 'El Coach IA está disponible en el plan Premium.',
    community: 'El acceso a la comunidad está disponible en el plan Premium.',
    advanced_stats: 'Las estadísticas avanzadas están disponibles en el plan Premium.',
    breathing_full: 'Los ejercicios de respiración completos están disponibles en el plan Básico o superior.',
    audio_library: 'La biblioteca de audios está disponible en el plan Básico o superior.'
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>{featureNames[feature]}</CardTitle>
          <CardDescription>
            {featureMessages[feature]}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/planes'}
          >
            Mejorar mi plan
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProtectedRoute;
