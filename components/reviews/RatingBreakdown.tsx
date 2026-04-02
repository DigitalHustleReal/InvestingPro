"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingBreakdownProps {
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
  className?: string;
}

export default function RatingBreakdown({ distribution, totalReviews, className }: RatingBreakdownProps) {
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating as keyof typeof distribution];
        const percentage = getPercentage(count);

        return (
          <div key={rating} className="flex items-center gap-3">
            {/* Star Rating Label */}
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Count */}
            <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
