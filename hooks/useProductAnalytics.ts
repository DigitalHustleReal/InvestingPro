"use client";

import { useEffect, useRef } from 'react';

/**
 * Hook to track product page views for analytics
 * Call this at the top of any product detail page component
 */
export function useProductViewTracking(productSlug: string, productId?: string) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (tracked.current || !productSlug) return;
    tracked.current = true;

    // Get or create session ID
    let sessionId = sessionStorage.getItem('investingpro_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('investingpro_session', sessionId);
    }

    // Track the view
    fetch('/api/analytics/product-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productSlug,
        productId,
        sessionId,
        referrer: document.referrer
      })
    }).catch(console.error);
  }, [productSlug, productId]);
}

/**
 * Hook to track comparison views
 */
export function useComparisonTracking(productSlugs: string[], category?: string) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || productSlugs.length < 2) return;
    tracked.current = true;

    let sessionId = sessionStorage.getItem('investingpro_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('investingpro_session', sessionId);
    }

    fetch('/api/analytics/comparison-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productSlugs,
        category,
        sessionId
      })
    }).catch(console.error);
  }, [productSlugs, category]);
}
