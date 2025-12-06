/**
 * Platform Guard Component
 * Ensures users are on the correct subscription page for their platform
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNativeApp } from '@/lib/platformDetection';

interface PlatformGuardProps {
  children: React.ReactNode;
  requireNative?: boolean;
  requireWeb?: boolean;
}

export function PlatformGuard({ children, requireNative = false, requireWeb = false }: PlatformGuardProps) {
  const navigate = useNavigate();
  const isNative = isNativeApp();

  useEffect(() => {
    // If requires native but we're on web, redirect to web subscription
    if (requireNative && !isNative) {
      navigate('/suscripcion-web', { replace: true });
      return;
    }

    // If requires web but we're on native, redirect to mobile subscription
    if (requireWeb && isNative) {
      navigate('/suscripcion-movil', { replace: true });
      return;
    }
  }, [isNative, requireNative, requireWeb, navigate]);

  // If on wrong platform, don't render children (redirect will happen)
  if ((requireNative && !isNative) || (requireWeb && isNative)) {
    return null;
  }

  return <>{children}</>;
}
