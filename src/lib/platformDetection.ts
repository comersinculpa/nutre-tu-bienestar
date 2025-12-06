/**
 * Platform Detection Utilities
 * Detects whether the app is running on web, iOS, or Android
 */

export type Platform = 'web' | 'ios' | 'android';

/**
 * Detect the current platform
 */
export function detectPlatform(): Platform {
  // Check for Capacitor (native app)
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    const capacitor = (window as any).Capacitor;
    if (capacitor.getPlatform) {
      const platform = capacitor.getPlatform();
      if (platform === 'ios') return 'ios';
      if (platform === 'android') return 'android';
    }
  }

  // Check user agent for mobile browsers (fallback)
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return 'ios';
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
      return 'android';
    }
  }

  return 'web';
}

/**
 * Check if running as a native app (Capacitor)
 */
export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
}

/**
 * Check if running on iOS (native or web)
 */
export function isIOS(): boolean {
  return detectPlatform() === 'ios';
}

/**
 * Check if running on Android (native or web)
 */
export function isAndroid(): boolean {
  return detectPlatform() === 'android';
}

/**
 * Check if running on mobile (iOS or Android)
 */
export function isMobile(): boolean {
  const platform = detectPlatform();
  return platform === 'ios' || platform === 'android';
}

/**
 * Check if running on web
 */
export function isWeb(): boolean {
  return detectPlatform() === 'web';
}

/**
 * Get the appropriate subscription route based on platform
 */
export function getSubscriptionRoute(): string {
  if (isNativeApp()) {
    return '/suscripcion'; // Mobile (RevenueCat)
  }
  return '/suscripcion-web'; // Web (Stripe)
}
