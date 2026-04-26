"use client";

import { useEffect, useRef } from "react";
import { trackWebVitals } from "@/lib/performance/web-vitals";

/**
 * Web Vitals Tracker Component
 * Initializes Core Web Vitals tracking on client-side
 *
 * HMR-Safe: Uses refs and careful error handling to avoid HMR module factory issues
 */
export default function WebVitalsTracker() {
  const initialized = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      return;
    }

    // Prevent double initialization (HMR can cause this)
    if (initialized.current) {
      return;
    }

    // Cleanup function
    const cleanup = () => {
      initialized.current = false;
      cleanupRef.current = null;
    };

    try {
      // Use a timeout to ensure module is stable (helps with HMR)
      const initTimer = setTimeout(() => {
        try {
          // Dynamically import web-vitals with retry logic
          const loadWebVitals = async () => {
            try {
              const webVitals = await import("web-vitals");
              // web-vitals v4 dropped onFID (Google deprecated FID for INP).
              // We keep the rest; INP now reflects interactivity.
              const { onCLS, onFCP, onLCP, onTTFB, onINP } = webVitals;

              // Track Core Web Vitals
              const vitals: {
                lcp: number;
                fid: number;
                cls: number;
                fcp: number;
                ttfb: number;
              } = {
                lcp: 0,
                fid: 0,
                cls: 0,
                fcp: 0,
                ttfb: 0,
              };

              const handleMetric = (metric: any) => {
                try {
                  if (metric.name === "LCP") vitals.lcp = metric.value;
                  if (metric.name === "FID") vitals.fid = metric.value;
                  if (metric.name === "CLS") vitals.cls = metric.value;
                  if (metric.name === "FCP") vitals.fcp = metric.value;
                  if (metric.name === "TTFB") vitals.ttfb = metric.value;

                  // Per-metric POST to /api/analytics/web-vitals
                  // matching the route's expected payload shape
                  // (name, value, id, rating, delta, url, timestamp).
                  // Production-only: avoid noisy dev fetches.
                  if (
                    process.env.NODE_ENV === "production" &&
                    typeof window !== "undefined"
                  ) {
                    try {
                      fetch("/api/analytics/web-vitals", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: metric.name,
                          value: metric.value,
                          id: metric.id,
                          rating: metric.rating,
                          delta: metric.delta,
                          url: window.location.pathname,
                          timestamp: Date.now(),
                        }),
                        keepalive: true,
                      }).catch(() => {
                        // Silently fail — non-critical
                      });
                    } catch {
                      // Silently fail
                    }
                  }

                  // Dev-only aggregated log
                  trackWebVitals(vitals, window.location.pathname).catch(() => {
                    // Silently ignore - non-critical
                  });
                } catch (error) {
                  // Silently ignore individual metric errors
                }
              };

              // Store cleanup functions
              const unsubscribers: (() => void)[] = [];

              // Wrap each web-vitals call in try-catch
              try {
                onCLS(handleMetric);
              } catch (e) {
                // Ignore
              }
              try {
                // INP replaces FID since web-vitals v4
                onINP(handleMetric);
              } catch (e) {
                // Ignore
              }
              try {
                onFCP(handleMetric);
              } catch (e) {
                // Ignore
              }
              try {
                onLCP(handleMetric);
              } catch (e) {
                // Ignore
              }
              try {
                onTTFB(handleMetric);
              } catch (e) {
                // Ignore
              }

              initialized.current = true;
              cleanupRef.current = cleanup;
            } catch (importError) {
              // Silently fail if web-vitals library can't be loaded
              // This is non-critical analytics
              cleanup();
            }
          };

          loadWebVitals();
        } catch (error) {
          // Completely silent - web vitals tracking should never break the app
          cleanup();
        }
      }, 500); // Small delay to let HMR stabilize

      return () => {
        clearTimeout(initTimer);
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      };
    } catch (error) {
      // Completely silent - web vitals tracking should never break the app
      cleanup();
      return undefined;
    }
  }, []);

  // This component doesn't render anything
  return null;
}
