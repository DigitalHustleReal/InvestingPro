"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Skeleton components for loading states
function WidgetSkeleton({ height = "h-40" }: { height?: string }) {
  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse",
        height,
      )}
    >
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  );
}

function RatesWidgetSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 dark:divide-gray-800">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex flex-col items-center animate-pulse">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsWidgetSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 space-y-2 animate-pulse">
            <div className="flex gap-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Lazy loaded components with SSR disabled for better performance
const RatesWidget = dynamic(() => import("@/components/rates/RatesWidget"), {
  loading: () => <RatesWidgetSkeleton />,
  ssr: false,
});

const ContextualNewsWidget = dynamic(
  () => import("@/components/news/ContextualNewsWidget"),
  {
    loading: () => <NewsWidgetSkeleton />,
    ssr: false,
  },
);

const TaxCountdown = dynamic(
  () => import("@/components/widgets/TaxCountdown"),
  {
    loading: () => <WidgetSkeleton height="h-32" />,
    ssr: false,
  },
);

const CibilGauge = dynamic(() => import("@/components/widgets/CibilGauge"), {
  loading: () => <WidgetSkeleton height="h-48" />,
  ssr: false,
});

const DecisionHelper = dynamic(
  () => import("@/components/widgets/DecisionHelper"),
  {
    loading: () => <WidgetSkeleton height="h-64" />,
    ssr: false,
  },
);

// Fake testimonial and expert widgets removed — no fabricated social proof

interface UniversalSidebarProps {
  className?: string;
  category?: "credit_card" | "loans" | "mutual_fund" | "investing" | "general";
  showNews?: boolean;
  showRates?: boolean;
  showTools?: boolean;
  showExperts?: boolean;
  showTestimonials?: boolean;
}

// Intersection Observer hook for lazy loading below-fold widgets
function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      { threshold: 0.1, rootMargin: "100px", ...options },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isIntersecting, hasIntersected };
}

export default function UniversalSidebar({
  className,
  category = "general",
  showNews = true,
  showRates = true,
  showTools = true,
  showExperts = true,
  showTestimonials = true,
}: UniversalSidebarProps) {
  // Intersection observers for lazy loading
  const ratesObserver = useIntersectionObserver();
  const newsObserver = useIntersectionObserver();

  // Logic to determine which "Tool Widget" to show
  const renderToolWidget = () => {
    switch (category) {
      case "credit_card":
      case "loans":
        return <CibilGauge />;
      case "investing":
      case "mutual_fund":
        return <TaxCountdown />;
      default:
        return null;
    }
  };

  // Logic for Rates Category
  const rateCategory =
    category === "loans"
      ? "loans"
      : category === "investing" || category === "mutual_fund"
        ? "investing"
        : "banking";

  return (
    // Desktop only - mobile uses MobileEngagementBar
    <aside className={cn("hidden lg:block space-y-6", className)}>
      {/* 0. Decision Helper (Key Differentiator) - Always show first */}
      {showTools && category !== "general" && (
        <DecisionHelper
          category={category === "loans" ? "loan" : (category as any)}
          variant="compact"
        />
      )}

      {/* 1. Value/Tool Widget (High Engagement) - Always load immediately */}
      {showTools && renderToolWidget()}

      {/* 2. Market Pulse (Rates) - Load when in view */}
      {showRates && (
        <div ref={ratesObserver.ref}>
          {ratesObserver.hasIntersected ? (
            <RatesWidget category={rateCategory} />
          ) : (
            <RatesWidgetSkeleton />
          )}
        </div>
      )}

      {/* 3. Contextual News - Load when in view (lowest priority) */}
      {showNews && (
        <div ref={newsObserver.ref}>
          {newsObserver.hasIntersected ? (
            <ContextualNewsWidget
              category={
                category === "mutual_fund" ? "investing" : (category as any)
              }
            />
          ) : (
            <NewsWidgetSkeleton />
          )}
        </div>
      )}
    </aside>
  );
}

// Export skeleton components for use elsewhere
export { WidgetSkeleton, RatesWidgetSkeleton, NewsWidgetSkeleton };
