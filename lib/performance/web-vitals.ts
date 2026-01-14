/**
 * Core Web Vitals Tracking
 * Tracks LCP, FID, CLS, FCP, TTFB for performance monitoring
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, Metric } from 'web-vitals';

export interface WebVitalsMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
    navigationType: string;
}

/**
 * Get rating for a metric value
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    // Core Web Vitals thresholds (from Google)
    const thresholds: Record<string, { good: number; poor: number }> = {
        LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
        FID: { good: 100, poor: 300 }, // First Input Delay (ms)
        CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift (score)
        FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
        TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
    };

    const threshold = thresholds[name];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
}

/**
 * Send Web Vitals to analytics
 */
function sendToAnalytics(metric: WebVitalsMetric) {
    // Send to PostHog if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('web_vital', {
            metric_name: metric.name,
            metric_value: metric.value,
            metric_rating: metric.rating,
            metric_id: metric.id,
            navigation_type: metric.navigationType,
        });
    }

    // Send to custom analytics endpoint
    if (typeof fetch !== 'undefined') {
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: 'web_vital',
                properties: {
                    name: metric.name,
                    value: metric.value,
                    rating: metric.rating,
                    delta: metric.delta,
                    id: metric.id,
                    navigationType: metric.navigationType,
                },
            }),
        }).catch(() => {
            // Silently fail - analytics should never break user experience
        });
    }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    onCLS((metric: Metric) => {
        const webVital: WebVitalsMetric = {
            name: 'CLS',
            value: metric.value,
            rating: getRating('CLS', metric.value),
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType || 'navigate',
        };
        sendToAnalytics(webVital);
    });

    onFID((metric: Metric) => {
        const webVital: WebVitalsMetric = {
            name: 'FID',
            value: metric.value,
            rating: getRating('FID', metric.value),
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType || 'navigate',
        };
        sendToAnalytics(webVital);
    });

    onLCP((metric: Metric) => {
        const webVital: WebVitalsMetric = {
            name: 'LCP',
            value: metric.value,
            rating: getRating('LCP', metric.value),
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType || 'navigate',
        };
        sendToAnalytics(webVital);
    });

    // Track additional metrics
    onFCP((metric: Metric) => {
        const webVital: WebVitalsMetric = {
            name: 'FCP',
            value: metric.value,
            rating: getRating('FCP', metric.value),
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType || 'navigate',
        };
        sendToAnalytics(webVital);
    });

    onTTFB((metric: Metric) => {
        const webVital: WebVitalsMetric = {
            name: 'TTFB',
            value: metric.value,
            rating: getRating('TTFB', metric.value),
            delta: metric.delta,
            id: metric.id,
            navigationType: metric.navigationType || 'navigate',
        };
        sendToAnalytics(webVital);
    });
}

/**
 * Get current Web Vitals (if available)
 */
export function getWebVitals(): WebVitalsMetric[] {
    // This would need to be implemented with a store
    // For now, metrics are sent to analytics
    return [];
}
