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
    // Instant platform detection and redirect
    if (isNativeApp()) {
      navigate('/suscripcion-movil', { replace: true });
    } else {
      navigate('/suscripcion-web', { replace: true });
    }
  }, [navigate]);

  // Brief loading state during redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
