/**
 * Web Vitals Tracking Component
 * 
 * Tracks Core Web Vitals (LCP, FID, CLS, FCP, TTFB) and sends to analytics
 */

'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

interface Metric {
    name: string;
    value: number;
    id: string;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta?: number;
}

// Web Vitals thresholds (from Google)
const THRESHOLDS = {
    LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
    FID: { good: 100, poor: 300 }, // First Input Delay (ms)
    CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
    FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
    TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
};

/**
 * Get rating for a metric value
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
}

/**
 * Send metric to analytics endpoint
 */
async function sendToAnalytics(metric: Metric) {
    try {
        // Send to API endpoint for server-side tracking
        await fetch('/api/analytics/web-vitals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: metric.name,
                value: metric.value,
                id: metric.id,
                rating: metric.rating,
                delta: metric.delta,
                url: window.location.pathname,
                timestamp: Date.now(),
            }),
        });
    } catch (error) {
        // Silently fail - don't block page load
        if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to send web vitals', error);
        }
    }
}

/**
 * Report metric to console and analytics
 */
function reportMetric(metric: Metric) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
        console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
    }

    // Send to analytics
    sendToAnalytics(metric).catch(() => {
        // Silent fail
    });
}

/**
 * Web Vitals Tracking Component
 */
export default function WebVitals() {
    useEffect(() => {
        // Only run in browser
        if (typeof window === 'undefined') return;

        // Dynamically import web-vitals library
        import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
            // Largest Contentful Paint
            onLCP((metric) => {
                reportMetric({
                    name: 'LCP',
                    value: metric.value,
                    id: metric.id,
                    rating: getRating('LCP', metric.value),
                    delta: metric.delta,
                });
            });

            // First Input Delay (deprecated, use INP)
            onFID((metric) => {
                reportMetric({
                    name: 'FID',
                    value: metric.value,
                    id: metric.id,
                    rating: getRating('FID', metric.value),
                    delta: metric.delta,
                });
            });

            // Cumulative Layout Shift
            onCLS((metric) => {
                reportMetric({
                    name: 'CLS',
                    value: metric.value,
                    id: metric.id,
                    rating: getRating('CLS', metric.value),
                    delta: metric.delta,
                });
            });

            // First Contentful Paint
            onFCP((metric) => {
                reportMetric({
                    name: 'FCP',
                    value: metric.value,
                    id: metric.id,
                    rating: getRating('FCP', metric.value),
                    delta: metric.delta,
                });
            });

            // Time to First Byte
            onTTFB((metric) => {
                reportMetric({
                    name: 'TTFB',
                    value: metric.value,
                    id: metric.id,
                    rating: getRating('TTFB', metric.value),
                    delta: metric.delta,
                });
            });

            // Interaction to Next Paint (new metric, replaces FID)
            if (onINP) {
                onINP((metric) => {
                    reportMetric({
                        name: 'INP',
                        value: metric.value,
                        id: metric.id,
                        rating: getRating('FID', metric.value), // Use FID thresholds for now
                        delta: metric.delta,
                    });
                });
            }
        }).catch((error) => {
            // If web-vitals library is not installed, log warning
            if (process.env.NODE_ENV === 'development') {
                console.warn('web-vitals library not installed. Install with: npm install web-vitals');
            }
        });
    }, []);

    // Component doesn't render anything
    return null;
}
