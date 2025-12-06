/**
 * Subscription Router Component
 * Automatically routes to the appropriate subscription page based on platform
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { isNativeApp } from '@/lib/platformDetection';

export default function SubscriptionRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    // Detect platform and redirect to appropriate subscription page
    if (isNativeApp()) {
      // Native app (iOS/Android) → RevenueCat
      navigate('/suscripcion', { replace: true });
    } else {
      // Web → Stripe
      navigate('/suscripcion-web', { replace: true });
    }
  }, [navigate]);

  // Show loading while detecting platform
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Cargando opciones de suscripción...</p>
      </div>
    </div>
  );
}
