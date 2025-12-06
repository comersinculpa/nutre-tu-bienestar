/**
 * Subscription Service
 * Centralizes all subscription-related API calls to Supabase Edge Functions
 */

import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM';
export type UsageType = 'recipe' | 'audio';

export interface CheckoutOptions {
  tier: 'BASIC' | 'PREMIUM';
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  sessionId: string;
  url: string;
}

export interface PortalOptions {
  userId: string;
  returnUrl: string;
}

export interface PortalResult {
  url: string;
}

export interface SubscriptionStatusResult {
  tier: SubscriptionTier;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  features: {
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
  };
  subscription_start_date: string | null;
  subscription_end_date: string | null;
}

export interface FeatureCheckResult {
  allowed: boolean;
  reason: string | null;
  message: string | null;
  upgrade_tier: SubscriptionTier | null;
}

export interface IncrementUsageResult {
  success: boolean;
  new_count: number;
}

class SubscriptionService {
  /**
   * Get the current user's subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatusResult> {
    const { data, error } = await supabase.functions.invoke<SubscriptionStatusResult>('subscription-status');
    
    if (error) {
      console.error('Error fetching subscription status:', error);
      throw new Error('Error al obtener el estado de la suscripción');
    }
    
    return data!;
  }

  /**
   * Check if a specific feature is available for the current user
   */
  async checkFeature(feature: string): Promise<FeatureCheckResult> {
    const { data, error } = await supabase.functions.invoke<FeatureCheckResult>('check-feature', {
      body: { feature }
    });
    
    if (error) {
      console.error('Error checking feature:', error);
      throw new Error('Error al verificar la funcionalidad');
    }
    
    return data!;
  }

  /**
   * Increment usage count for recipes or audio
   */
  async incrementUsage(type: UsageType): Promise<IncrementUsageResult> {
    const { data, error } = await supabase.functions.invoke<IncrementUsageResult>('increment-usage', {
      body: { type }
    });
    
    if (error) {
      console.error('Error incrementing usage:', error);
      throw new Error('Error al registrar el uso');
    }
    
    return data!;
  }

  /**
   * Create a Stripe checkout session for web subscriptions
   */
  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const { data, error } = await supabase.functions.invoke<CheckoutResult>('create-checkout', {
      body: options
    });
    
    if (error) {
      console.error('Error creating checkout:', error);
      throw new Error('Error al crear la sesión de pago');
    }
    
    if (!data?.url) {
      throw new Error('No se recibió URL de checkout');
    }
    
    return data;
  }

  /**
   * Open Stripe customer portal for subscription management
   */
  async openCustomerPortal(options: PortalOptions): Promise<PortalResult> {
    const { data, error } = await supabase.functions.invoke<PortalResult>('customer-portal', {
      body: options
    });
    
    if (error) {
      console.error('Error opening customer portal:', error);
      throw new Error('Error al abrir el portal de gestión');
    }
    
    if (!data?.url) {
      throw new Error('No se recibió URL del portal');
    }
    
    return data;
  }

  /**
   * Cancel the current subscription
   */
  async cancelSubscription(): Promise<{ success: boolean }> {
    const { data, error } = await supabase.functions.invoke<{ success: boolean }>('cancel-subscription');
    
    if (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Error al cancelar la suscripción');
    }
    
    return data!;
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
