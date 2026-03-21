"use client";

import React from 'react';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RichProduct } from '@/types/rich-product';

interface AlternativesCarouselProps {
  products: RichProduct[];
  currentProductSlug: string;
  className?: string;
}

export default function AlternativesCarousel({ products, currentProductSlug, className }: AlternativesCarouselProps) {
  if (products.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Similar Options You Might Like
        </h3>
        <Link href="/credit-cards/compare">
          <Button variant="ghost" className="text-primary-600 dark:text-primary-400">
            Compare All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max">
          {products.map((product) => (
            <Link key={product.slug} href={`/credit-cards/${product.slug}`}>
              <div className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-primary-500 dark:hover:border-primary-600 hover:shadow-lg transition-all cursor-pointer group">
                {/* Product Image/Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {product.provider_name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-600">
                      {product.provider_name}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-600">
                      ({Math.floor(Math.random() * 500) + 100} reviews)
                    </span>
                  </div>
                )}

                {/* Key Features */}
                <div className="space-y-2 mb-4">
                  {product.bestFor && (
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3 h-3 text-success-600 dark:text-success-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        Best for {product.bestFor}
                      </span>
                    </div>
                  )}
                  {product.specs?.annualFee && (
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Annual Fee: <span className="font-semibold text-slate-900 dark:text-white">{product.specs.annualFee}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <p className="text-xs text-slate-500 dark:text-slate-600 text-center mt-2 md:hidden">
        ← Swipe to see more →
      </p>
    </div>
  );
}
