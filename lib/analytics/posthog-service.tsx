/**
 * PostHog Analytics Provider
 * 
 * Free tier: 1M events/month
 * Use for: Product analytics, feature flags, session replay
 * 
 * Setup:
 * 1. Create account at posthog.com
 * 2. Add NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST to .env.local
 */

'use client';

import posthog from 'posthog-js';
import { logger } from '@/lib/logger';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

const isConfigured = typeof window !== 'undefined' && 
  !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * Initialize PostHog on client side
 */
export function initPostHog() {
  if (typeof window === 'undefined') return;
  
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    logger.warn('[ANALYTICS] PostHog key not configured');
    return;
  }

  if (!posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll handle this manually for more control
      capture_pageleave: true,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          // Enable debug mode in development
          posthog.debug();
        }
      },
    });
  }
}

/**
 * PostHog React Provider component
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  if (!isConfigured) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined' || !isConfigured) return;
  
  posthog.capture(eventName, properties);
}

/**
 * Track page view
 */
export function trackPageView(path?: string) {
  if (typeof window === 'undefined' || !isConfigured) return;
  
  posthog.capture('$pageview', {
    $current_url: path || window.location.href,
  });
}

/**
 * Identify a user
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined' || !isConfigured) return;
  
  posthog.identify(userId, properties);
}

/**
 * Reset user (on logout)
 */
export function resetUser() {
  if (typeof window === 'undefined' || !isConfigured) return;
  
  posthog.reset();
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined' || !isConfigured) return;
  
  posthog.people.set(properties);
}

/**
 * Track affiliate click
 */
export function trackAffiliateClick(productId: string, productName: string, category: string) {
  trackEvent('affiliate_click', {
    product_id: productId,
    product_name: productName,
    category: category,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track calculator usage
 */
export function trackCalculatorUsage(calculatorType: string, inputs: Record<string, any>) {
  trackEvent('calculator_used', {
    calculator_type: calculatorType,
    ...inputs,
  });
}

/**
 * Track article read
 */
export function trackArticleRead(articleId: string, articleTitle: string, category: string) {
  trackEvent('article_read', {
    article_id: articleId,
    article_title: articleTitle,
    category: category,
  });
}

/**
 * Check feature flag
 */
export function isFeatureEnabled(flagName: string): boolean {
  if (typeof window === 'undefined' || !isConfigured) return false;
  
  return posthog.isFeatureEnabled(flagName) ?? false;
}

export default {
  trackEvent,
  trackPageView,
  identifyUser,
  resetUser,
  setUserProperties,
  trackAffiliateClick,
  trackCalculatorUsage,
  trackArticleRead,
  isFeatureEnabled,
  isConfigured,
};
