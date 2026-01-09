"use client";

import { useEffect, useRef } from 'react';

interface ProductViewTrackerProps {
  productSlug: string;
  productId?: string;
}

/**
 * Client component to track product page views
 * Add this anywhere in a product page to enable view tracking
 */
export function ProductViewTracker({ productSlug, productId }: ProductViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !productSlug) return;
    tracked.current = true;

    // Get or create session ID
    let sessionId = sessionStorage.getItem('investingpro_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('investingpro_session', sessionId);
    }

    // Track the view (fire and forget)
    fetch('/api/analytics/product-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productSlug,
        productId,
        sessionId,
        referrer: document.referrer,
        deviceType: /mobile/i.test(navigator.userAgent) ? 'mobile' : 
                    /tablet|ipad/i.test(navigator.userAgent) ? 'tablet' : 'desktop'
      })
    }).catch(() => {
      // Silently fail - analytics shouldn't break UX
    });
  }, [productSlug, productId]);

  // This component renders nothing - it's just for tracking
  return null;
}

/**
 * Comparison view tracker
 */
export function ComparisonViewTracker({ 
  productSlugs, 
  category 
}: { 
  productSlugs: string[]; 
  category?: string 
}) {
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
      body: JSON.stringify({ productSlugs, category, sessionId })
    }).catch(() => {});
  }, [productSlugs, category]);

  return null;
}
