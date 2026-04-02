"use client";

import React from 'react';
import { ArrowRight, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ComparisonCTAProps {
  currentProductSlug: string;
  currentProductName: string;
  similarProducts?: Array<{
    slug: string;
    name: string;
  }>;
  className?: string;
}

export default function ComparisonCTA({ 
  currentProductSlug, 
  currentProductName,
  similarProducts = [],
  className 
}: ComparisonCTAProps) {
  // Auto-generate comparison URL with similar products
  const comparisonUrl = similarProducts.length > 0
    ? `/credit-cards/compare?products=${currentProductSlug},${similarProducts.slice(0, 2).map(p => p.slug).join(',')}`
    : `/credit-cards/compare?products=${currentProductSlug}`;

  return (
    <div className={cn(
      "bg-gradient-to-r from-gray-50 to-primary-50 dark:from-gray-900 dark:to-primary-950/20 border border-gray-200 dark:border-gray-800 rounded-2xl p-6",
      className
    )}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
          <GitCompare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Compare Before You Decide
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            See how {currentProductName} stacks up against similar cards. Compare fees, rewards, and benefits side-by-side.
          </p>

          {/* Similar Products Preview */}
          {similarProducts.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-600 mb-2">Compare with:</p>
              <div className="flex flex-wrap gap-2">
                {similarProducts.slice(0, 3).map((product) => (
                  <span 
                    key={product.slug}
                    className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300"
                  >
                    {product.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <a href={comparisonUrl}>
            <Button className="bg-primary-600 hover:bg-primary-500 text-white font-semibold">
              Compare Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
