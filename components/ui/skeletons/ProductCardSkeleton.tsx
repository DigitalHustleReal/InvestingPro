/**
 * ProductCardSkeleton - Loading placeholder for product cards
 * UI/UX Quick Win #5 - Better perceived performance
 */

import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function ProductCardSkeleton({ className, variant = 'default' }: ProductCardSkeletonProps) {
  if (variant === 'horizontal') {
    return (
      <div className={cn(
        "animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4",
        "flex items-center gap-4",
        className
      )}>
        {/* Logo */}
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
        
        {/* CTA */}
        <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0" />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        "animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4",
        "min-h-[200px] flex flex-col",
        className
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
        </div>
        
        {/* CTA */}
        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg mt-3" />
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6",
      "min-h-[320px] flex flex-col",
      className
    )}>
      {/* Badge */}
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4 mb-3" />
      
      {/* Logo & Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </div>
        <div className="space-y-1">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </div>
      </div>
      
      {/* Features */}
      <div className="flex-1 space-y-2 mb-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
      </div>
      
      {/* CTAs */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex-1" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-10" />
      </div>
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
