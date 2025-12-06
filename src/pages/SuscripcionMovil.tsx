import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription, SubscriptionTier } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { BackButton } from '@/components/BackButton';
import { Check, Crown, Sparkles, Zap, ChefHat, Headphones, Users, BarChart3, Wind, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const tierIcons = {
  FREE: Zap,
  BASIC: Sparkles,
  PREMIUM: Crown
};

const tierColors = {
  FREE: 'border-muted-foreground/30',
  BASIC: 'border-primary',
  PREMIUM: 'border-accent'
};

export default function Suscripcion() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, loading, getTierInfo, TIER_INFO } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentTier = subscription?.tier || 'FREE';
  const currentTierInfo = getTierInfo(currentTier);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === currentTier) {
      toast.info('Ya tienes este plan activo');
      return;
    }
    
    setSelectedTier(tier);
    
    // RevenueCat integration for mobile
    // Check if RevenueCat is available (Capacitor plugin)
    const revenueCat = (window as any).RevenueCat;
    
    if (revenueCat) {
      try {
        // Get offerings from RevenueCat
        const offerings = await revenueCat.getOfferings();
        const currentOffering = offerings.current;
        
        if (currentOffering) {
          const packageId = tier === 'BASIC' ? 'monthly_basic' : 'monthly_premium';
          const selectedPackage = currentOffering.availablePackages.find(
            (pkg: any) => pkg.identifier === packageId
          );
          
          if (selectedPackage) {
            const { customerInfo } = await revenueCat.purchasePackage({ aPackage: selectedPackage });
            if (customerInfo.entitlements.active[tier.toLowerCase()]) {
              toast.success(`¡Bienvenida al plan ${tier}!`);
              // Refresh subscription data
              window.location.reload();
            }
          }
        }
      } catch (error: any) {
        console.error('RevenueCat purchase error:', error);
        if (error.code !== 'PURCHASE_CANCELLED') {
          toast.error('Error al procesar la compra. Inténtalo de nuevo.');
        }
      }
    } else {
      // Fallback for web or if RevenueCat not available
      toast.info('Para suscribirte desde la app, usa la versión móvil. Para web, visita /suscripcion-web');
    }
    
    setSelectedTier(null);
  };

  const getUsageProgress = (used: number, total: number) => {
    if (total === -1) return 100; // Unlimited
    return Math.min((used / total) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 via-background to-accent/10 pt-6 pb-8 px-4">
        <div className="max-w-lg mx-auto">
          <BackButton />
          <h1 className="text-2xl font-bold text-foreground mt-4">Mi Suscripción</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu plan y uso</p>
        </div>
      </div>

      <div className="px-4 -mt-4 max-w-lg mx-auto space-y-6">
        {/* Current Plan Card */}
        <Card className={`border-2 ${tierColors[currentTier]}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = tierIcons[currentTier];
                  return <Icon className="w-5 h-5 text-primary" />;
                })()}
                <CardTitle className="text-lg">Plan {currentTierInfo.name}</CardTitle>
              </div>
              <Badge variant={currentTier === 'PREMIUM' ? 'default' : 'secondary'}>
                {subscription?.status === 'active' ? 'Activo' : subscription?.status}
              </Badge>
            </div>
            <CardDescription>
              {currentTier === 'FREE' ? 'Plan gratuito' : `${currentTierInfo.price}/mes`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Usage Stats */}
            {subscription && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      Recetas este mes
                    </span>
                    <span className="text-muted-foreground">
                      {subscription.features.recipes_used} / {subscription.features.recipes_per_month === -1 ? '∞' : subscription.features.recipes_per_month}
                    </span>
                  </div>
                  <Progress 
                    value={getUsageProgress(subscription.features.recipes_used, subscription.features.recipes_per_month)} 
                    className="h-2"
                  />
                </div>

                {subscription.features.audio_generation_per_month > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1">
                        <Headphones className="w-4 h-4" />
                        Audios IA este mes
                      </span>
                      <span className="text-muted-foreground">
                        {subscription.features.audio_used} / {subscription.features.audio_generation_per_month === -1 ? '∞' : subscription.features.audio_generation_per_month}
                      </span>
                    </div>
                    <Progress 
                      value={getUsageProgress(subscription.features.audio_used, subscription.features.audio_generation_per_month)} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Current Features */}
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Tu plan incluye:</p>
              <ul className="space-y-1">
                {currentTierInfo.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Planes disponibles</h2>
          <div className="space-y-4">
            {(Object.entries(TIER_INFO) as [SubscriptionTier, typeof TIER_INFO.FREE][]).map(([tier, info]) => {
              const Icon = tierIcons[tier];
              const isCurrent = tier === currentTier;
              const isUpgrade = TIER_INFO[tier].priceMonthly > TIER_INFO[currentTier].priceMonthly;
              
              return (
                <Card 
                  key={tier} 
                  className={`transition-all ${isCurrent ? 'border-2 ' + tierColors[tier] : 'hover:border-primary/50'}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${tier === 'PREMIUM' ? 'text-accent' : 'text-primary'}`} />
                        <CardTitle className="text-base">{info.name}</CardTitle>
                      </div>
                      <span className="font-bold text-lg">
                        {info.priceMonthly === 0 ? 'Gratis' : `${info.price}/mes`}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1">
                      {info.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant={isCurrent ? 'outline' : tier === 'PREMIUM' ? 'default' : 'secondary'}
                      className="w-full"
                      disabled={isCurrent || !isUpgrade}
                      onClick={() => handleUpgrade(tier)}
                    >
                      {isCurrent ? 'Plan actual' : isUpgrade ? `Mejorar a ${info.name}` : 'Plan inferior'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              Ventajas Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <ChefHat className="w-4 h-4 text-primary" />
                <span>Recetas ilimitadas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Headphones className="w-4 h-4 text-primary" />
                <span>Audios ilimitados</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Coach IA 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>Comunidad</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span>Estadísticas avanzadas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wind className="w-4 h-4 text-primary" />
                <span>Respiración completa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground text-center">
              ¿Tienes preguntas sobre tu suscripción?{' '}
              <a href="mailto:soporte@nutritubienestar.com" className="text-primary hover:underline">
                Contacta con soporte
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
