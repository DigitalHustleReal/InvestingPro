/**
 * Skeleton Components Index
 * UI/UX Quick Win #5 - Loading states for better perceived performance
 */

export { ProductCardSkeleton, ProductCardSkeletonGrid } from './ProductCardSkeleton';

import { cn } from "@/lib/utils";

// Generic skeleton building blocks
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)} />
  );
}

// Article card skeleton
export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-pulse bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden",
      className
    )}>
      {/* Image */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
      
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

// Calculator result skeleton
export function CalculatorResultSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-pulse bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6",
      className
    )}>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
      
      {/* Result cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        ))}
      </div>
      
      {/* Chart placeholder */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn(
      "animate-pulse bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className={cn(
                "h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1",
                colIndex === 0 && "w-1/4 flex-none"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Stats widget skeleton
export function StatsWidgetSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-pulse bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}

// Navigation menu skeleton
export function NavMenuSkeleton({ items = 5, className }: { items?: number; className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}
