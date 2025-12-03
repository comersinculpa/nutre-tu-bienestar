import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Crown, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BackButton } from '@/components/BackButton';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  tier: 'FREE' | 'BASIC' | 'PREMIUM';
  price: string;
  priceNote?: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    name: 'Gratuito',
    tier: 'FREE',
    price: '0€',
    description: 'Para empezar tu camino',
    icon: <Sparkles className="h-6 w-6" />,
    features: [
      { text: '5 recetas personalizadas por mes', included: true },
      { text: 'Seguimiento básico del bienestar', included: true },
      { text: 'Ejercicios de respiración limitados', included: true },
      { text: 'Audios guiados de meditación', included: false },
      { text: 'Coach IA personalizado', included: false },
      { text: 'Acceso a la comunidad', included: false },
    ],
  },
  {
    name: 'Básico',
    tier: 'BASIC',
    price: '4,99€',
    priceNote: '/mes',
    description: 'Para un cuidado más completo',
    icon: <Sparkles className="h-6 w-6" />,
    popular: true,
    features: [
      { text: '50 recetas personalizadas por mes', included: true },
      { text: 'Seguimiento avanzado con gráficos', included: true },
      { text: 'Todos los ejercicios de respiración', included: true },
      { text: 'Audios guiados de meditación e hipnosis', included: true },
      { text: '10 audios IA generados por mes', included: true },
      { text: 'Acceso a la comunidad', included: false },
    ],
  },
  {
    name: 'Premium',
    tier: 'PREMIUM',
    price: '9,99€',
    priceNote: '/mes',
    description: 'Experiencia completa sin límites',
    icon: <Crown className="h-6 w-6" />,
    features: [
      { text: 'Recetas ilimitadas', included: true },
      { text: 'Coach IA personalizado 24/7', included: true },
      { text: 'Generación ilimitada de audios IA', included: true },
      { text: 'Todos los contenidos premium', included: true },
      { text: 'Acceso completo a la comunidad', included: true },
      { text: 'Estadísticas avanzadas e insights', included: true },
    ],
  },
];

export default function SuscripcionWeb() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<string>('FREE');
  const [hasStripeSubscription, setHasStripeSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    // Mostrar mensajes según resultado del checkout
    if (searchParams.get('success') === 'true') {
      toast.success('¡Pago completado! Tu suscripción está activa.');
    } else if (searchParams.get('canceled') === 'true') {
      toast.info('Pago cancelado. Puedes intentarlo de nuevo cuando quieras.');
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('tier, stripe_customer_id, stripe_subscription_id, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setCurrentTier(data.tier);
          setHasStripeSubscription(!!data.stripe_subscription_id && data.status === 'active');
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user]);

  const handleSubscribe = async (tier: 'BASIC' | 'PREMIUM') => {
    if (!user) {
      toast.error('Debes iniciar sesión para suscribirte');
      navigate('/auth');
      return;
    }

    setProcessingTier(tier);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier,
          userId: user.id,
          successUrl: `${window.location.origin}/suscripcion-web?success=true`,
          cancelUrl: `${window.location.origin}/suscripcion-web?canceled=true`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error(error.message || 'Error al iniciar el proceso de pago');
    } finally {
      setProcessingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setPortalLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: {
          userId: user.id,
          returnUrl: `${window.location.origin}/suscripcion-web`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL del portal');
      }
    } catch (error: any) {
      console.error('Error opening portal:', error);
      toast.error(error.message || 'Error al abrir el portal de gestión');
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <BackButton />
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Elige tu plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a tu camino de bienestar. 
            Puedes cambiar o cancelar en cualquier momento.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrentPlan = currentTier === plan.tier;
            const isProcessing = processingTier === plan.tier;

            return (
              <Card
                key={plan.tier}
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-primary shadow-md scale-[1.02]' 
                    : 'border-border'
                } ${isCurrentPlan ? 'ring-2 ring-primary/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      Más popular
                    </Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      Plan actual
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto mb-3 p-3 rounded-full ${
                    plan.popular ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.priceNote && (
                      <span className="text-muted-foreground">{plan.priceNote}</span>
                    )}
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check 
                          className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            feature.included ? 'text-green-500' : 'text-muted-foreground/30'
                          }`} 
                        />
                        <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50 line-through'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  {plan.tier === 'FREE' ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Plan actual' : 'Plan gratuito'}
                    </Button>
                  ) : isCurrentPlan && hasStripeSubscription ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ExternalLink className="h-4 w-4 mr-2" />
                      )}
                      Gestionar suscripción
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan.tier as 'BASIC' | 'PREMIUM')}
                      disabled={isProcessing || isCurrentPlan}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Procesando...
                        </>
                      ) : isCurrentPlan ? (
                        'Plan actual'
                      ) : (
                        'Suscribirse'
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Footer Notes */}
        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>✓ Cancela en cualquier momento</p>
          <p>✓ Pago seguro procesado por Stripe</p>
          <p>✓ Renovación automática mensual</p>
        </div>

        {/* Manage Subscription Button (for existing subscribers) */}
        {hasStripeSubscription && (
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ExternalLink className="h-4 w-4 mr-2" />
              )}
              Gestionar métodos de pago y facturas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
