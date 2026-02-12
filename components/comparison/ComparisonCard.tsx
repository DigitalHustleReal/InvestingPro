/**
 * Enhanced Comparison Card Component - Week 3, Task 3.1
 * Purpose: Production-ready product comparison cards with all fintech features
 * 
 * Features:
 * - Product details with key metrics
 * - Add to compare functionality
 * - Badge system (featured, best value, new)
 * - Rating display with reviews count
 * - Currency formatting (Indian system)
 * - Responsive design
 * - Accessibility support
 */

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/utils/currency";
import { Star, Check, Plus, ArrowRight, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ComparisonCardProduct {
  id: string;
  name: string;
  provider: string;
  logo?: string;
  rating?: number;
  reviewCount?: number;
  keyMetric: {
    label: string;
    value: string | number;
    unit?: string;
    highlight?: boolean;
  };
  features: string[];
  bestFor?: string;
  badges?: ('featured' | 'best-value' | 'new' | 'popular')[];
  slug: string;
}

interface ComparisonCardProps {
  product: ComparisonCardProduct;
  isSelected?: boolean;
  onCompareToggle?: (productId: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

const badgeConfig = {
  featured: {
    label: 'Featured',
    color: 'bg-primary-600 text-white',
  },
  'best-value': {
    label: 'Best Value',
    color: 'bg-accent-500 text-white',
  },
  new: {
    label: 'New',
    color: 'bg-success-600 text-white',
  },
  popular: {
    label: 'Popular',
    color: 'bg-secondary-600 text-white',
  },
};

export function ComparisonCard({
  product,
  isSelected = false,
  onCompareToggle,
  variant = 'default',
  className,
}: ComparisonCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Card
      className={cn(
        "relative border transition-all duration-150",
        isSelected
          ? "border-2 border-primary-600 bg-primary-50 shadow-lg"
          : "border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:-translate-y-1 hover:shadow-lg",
        isCompact ? "p-4" : "p-6 md:p-8",
        className
      )}
    >
      {/* Selection Badge (if added to compare) */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-accent-500 text-white font-semibold shadow-md">
            Added to Compare
          </Badge>
        </div>
      )}

      {/* Product Badges (featured, best value, etc.) */}
      {product.badges && product.badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {product.badges.map((badgeType) => {
            const config = badgeConfig[badgeType];
            return (
              <Badge
                key={badgeType}
                className={cn(
                  "text-xs font-semibold",
                  config.color
                )}
              >
                {config.label}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Header: Logo, Name, Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Logo */}
          {product.logo ? (
            <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center">
              <Image
                src={product.logo}
                alt={product.name}
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
          )}

          {/* Name & Provider */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-bold text-slate-900 dark:text-white tracking-tight leading-tight",
              isCompact ? "text-lg" : "text-xl"
            )}>
              {product.name}
            </h3>
            <p className={cn(
              "text-slate-600 dark:text-slate-600 mt-0.5",
              isCompact ? "text-sm" : "text-base"
            )}>
              {product.provider}
            </p>
          </div>
        </div>

        {/* Rating */}
        {product.rating !== undefined && product.rating !== null && (
          <div className="flex flex-col items-end ml-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-accent-500 text-accent-500" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {typeof product.rating === 'number' && !isNaN(product.rating) 
                  ? (typeof product.rating === 'number' ? product.rating : Number(product.rating) || 4.5).toFixed(1) 
                  : '4.0'}
              </span>
            </div>
            {product.reviewCount && (
              <span className="text-xs text-slate-500 dark:text-slate-600">
                ({product.reviewCount} reviews)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Key Metric Highlight */}
      <div className={cn(
        "bg-gradient-to-br from-primary-50 to-success-50 border-l-4 border-primary-600 rounded-lg mb-4",
        isCompact ? "p-3" : "p-4"
      )}>
        <p className="text-xs text-primary-700 font-medium uppercase tracking-wider">
          {product.keyMetric.label}
        </p>
        <p className={cn(
          "font-bold font-mono text-primary-700 mt-1 flex items-baseline gap-1",
          isCompact ? "text-2xl" : "text-3xl"
        )}>
          {typeof product.keyMetric.value === 'number'
            ? formatINR(product.keyMetric.value, { compact: false })
            : product.keyMetric.value}
          {product.keyMetric.unit && (
            <span className="text-base font-normal text-primary-600">
              {product.keyMetric.unit}
            </span>
          )}
        </p>
      </div>

      {/* Best For */}
      {product.bestFor && (
        <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-lg">
          <p className="text-xs font-semibold text-accent-900 uppercase tracking-wide mb-1">
            Best For:
          </p>
          <p className="text-sm text-accent-900">
            {product.bestFor}
          </p>
        </div>
      )}

      {/* Features List */}
      <ul className={cn(
        "space-y-2 mb-6",
        isCompact && "space-y-1.5 mb-4"
      )}>
        {product.features.slice(0, isCompact ? 3 : 5).map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
          >
            <Check
              className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
        {!isCompact && product.features.length > 5 && (
          <li className="text-sm text-primary-600 font-medium pl-6">
            +{product.features.length - 5} more features
          </li>
        )}
      </ul>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Compare Toggle Button */}
        {onCompareToggle && (
          <Button
            variant={isSelected ? "outline" : "secondary"}
            size={isCompact ? "sm" : "default"}
            onClick={() => onCompareToggle(product.id)}
            className={cn(
              "flex-1",
              isSelected && "border-primary-600 text-primary-700 hover:bg-primary-50"
            )}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Compare
              </>
            )}
          </Button>
        )}

        {/* View Details Button */}
        <Link href={`/reviews/${product.slug}`} className="flex-1">
          <Button
            size={isCompact ? "sm" : "default"}
            className="w-full"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

/**
 * Compact variant for grid layouts with many products
 */
export function CompactComparisonCard(
  props: Omit<ComparisonCardProps, 'variant'>
) {
  return <ComparisonCard {...props} variant="compact" />;
}

/**
 * Comparison Card Grid Container
 */
interface ComparisonCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ComparisonCardGrid({
  children,
  columns = 3,
  className,
}: ComparisonCardGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div
      className={cn(
        "grid gap-6",
        gridCols[columns],
        className
      )}
    >
      {children}
    </div>
  );
}
