/**
 * Web Vitals Tracking
 * Tracks Core Web Vitals (LCP, FID, CLS) for performance monitoring
 */

import { logger } from "@/lib/logger";

// Web vitals tracking is optional and doesn't require Supabase
// It can be extended later to send data to analytics services if needed

export interface WebVitals {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift (score)
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time to First Byte (ms)
}

export interface WebVitalsReport {
  url: string;
  vitals: WebVitals;
  userAgent?: string;
  timestamp: string;
}

/**
 * Track Web Vitals (call from client-side)
 *
 * This is a no-op implementation that can be extended later to:
 * - Send to analytics services (Google Analytics, PostHog, etc.)
 * - Store in database via API route (not directly from client)
 * - Send to monitoring services (Sentry, Datadog, etc.)
 */
export async function trackWebVitals(
  vitals: WebVitals,
  url: string,
): Promise<void> {
  // Use try-catch with explicit error handling to prevent any errors from bubbling up
  try {
    // Only run on client side
    if (typeof window === "undefined") {
      return;
    }

    // Log web vitals for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      logger.info("[Web Vitals]", { url, vitals });
    }

    // Aggregated tracker is now dev-log-only. The actual per-metric
    // POST happens inside components/performance/WebVitalsTracker.tsx
    // where each web-vitals callback fires — that matches the
    // /api/analytics/web-vitals route's per-metric payload contract.
  } catch (error: unknown) {
    // Completely silent fail - web vitals tracking should never break the app
    // Don't even log to avoid any potential issues with logger dependencies
    // This is non-critical analytics that can fail silently
    if (process.env.NODE_ENV === "development") {
      // Only use console.warn in dev, never logger (which might have dependencies)
      logger.warn(
        "[Web Vitals] Tracking error (non-critical, safely ignored):",
        { error: error instanceof Error ? error.message : String(error) },
      );
    }
    // Explicitly return to ensure no error propagation
    return;
  }
}

/**
 * Get Web Vitals metrics for a date range
 */
export async function getWebVitalsMetrics(
  startDate: string,
  endDate: string,
  url?: string,
): Promise<{
  average: WebVitals;
  p75: WebVitals;
  p95: WebVitals;
  good: number; // Percentage of good scores
  needsImprovement: number; // Percentage needing improvement
  poor: number; // Percentage of poor scores
}> {
  try {
    // In production, query web_vitals table
    // For now, return placeholder data

    return {
      average: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        fcp: 1800,
        ttfb: 600,
      },
      p75: {
        lcp: 3000,
        fid: 150,
        cls: 0.15,
        fcp: 2000,
        ttfb: 800,
      },
      p95: {
        lcp: 4000,
        fid: 300,
        cls: 0.25,
        fcp: 3000,
        ttfb: 1200,
      },
      good: 65,
      needsImprovement: 25,
      poor: 10,
    };
  } catch (error: any) {
    logger.error("Error getting Web Vitals metrics", error);
    throw error;
  }
}

/**
 * Check if Web Vitals meet thresholds
 */
export function checkWebVitalsThresholds(vitals: WebVitals): {
  meetsThresholds: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // LCP: Good < 2.5s, Needs Improvement 2.5-4s, Poor > 4s
  if (vitals.lcp > 4000) {
    issues.push(`LCP is poor (${vitals.lcp}ms). Target: < 2.5s`);
  } else if (vitals.lcp > 2500) {
    issues.push(`LCP needs improvement (${vitals.lcp}ms). Target: < 2.5s`);
  }

  // FID: Good < 100ms, Needs Improvement 100-300ms, Poor > 300ms
  if (vitals.fid > 300) {
    issues.push(`FID is poor (${vitals.fid}ms). Target: < 100ms`);
  } else if (vitals.fid > 100) {
    issues.push(`FID needs improvement (${vitals.fid}ms). Target: < 100ms`);
  }

  // CLS: Good < 0.1, Needs Improvement 0.1-0.25, Poor > 0.25
  if (vitals.cls > 0.25) {
    issues.push(`CLS is poor (${vitals.cls}). Target: < 0.1`);
  } else if (vitals.cls > 0.1) {
    issues.push(`CLS needs improvement (${vitals.cls}). Target: < 0.1`);
  }

  // FCP: Good < 1.8s, Needs Improvement 1.8-3s, Poor > 3s
  if (vitals.fcp > 3000) {
    issues.push(`FCP is poor (${vitals.fcp}ms). Target: < 1.8s`);
  } else if (vitals.fcp > 1800) {
    issues.push(`FCP needs improvement (${vitals.fcp}ms). Target: < 1.8s`);
  }

  // TTFB: Good < 600ms, Needs Improvement 600-800ms, Poor > 800ms
  if (vitals.ttfb > 800) {
    issues.push(`TTFB is poor (${vitals.ttfb}ms). Target: < 600ms`);
  } else if (vitals.ttfb > 600) {
    issues.push(`TTFB needs improvement (${vitals.ttfb}ms). Target: < 600ms`);
  }

  return {
    meetsThresholds: issues.length === 0,
    issues,
  };
}
