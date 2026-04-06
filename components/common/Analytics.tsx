"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Lazy load WebVitalsTracker to avoid HMR issues
const WebVitalsTracker = lazy(() =>
  import("@/components/performance/WebVitalsTracker").catch(() => ({
    default: () => null, // Return null component if import fails
  })),
);

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Google Analytics tracking
export const trackPageView = (path: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: path,
    });
  }
};

export const trackEvent = (eventName: string, params = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [enableWebVitals, setEnableWebVitals] = useState(false);

  useEffect(() => {
    if (pathname) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  // Enable web vitals only after initial mount to avoid HMR issues
  useEffect(() => {
    // Small delay to ensure HMR is stable
    const timer = setTimeout(() => {
      setEnableWebVitals(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {enableWebVitals && (
        <Suspense fallback={null}>
          <WebVitalsTracker />
        </Suspense>
      )}
    </>
  );
}
