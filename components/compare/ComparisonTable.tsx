'use client';

import React from 'react';
import { RichProduct } from '@/types/rich-product';
import { CheckCircle, X, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  products: RichProduct[];
  onRemoveProduct: (id: string) => void;
}

interface ComparisonFeature {
  category: string;
  features: {
    key: string;
    label: string;
    tooltip?: string;
    getValue: (product: RichProduct) => any;
    format: (value: any) => string;
    compareType?: 'higher' | 'lower'; // higher = better or lower = better
  }[];
}

export default function ComparisonTable({ products, onRemoveProduct }: ComparisonTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No products to compare. Add products from the listing page.</p>
      </div>
    );
  }

  // Define comparison categories and features
  const comparisonFeatures: ComparisonFeature[] = [
    {
      category: 'Basic Info',
      features: [
        {
          key: 'name',
          label: 'Product Name',
          getValue: (p) => p.name,
          format: (v) => v
        },
        {
          key: 'provider',
          label: 'Provider',
          getValue: (p) => p.provider_name,
          format: (v) => v
        },
        {
          key: 'rating',
          label: 'Rating',
          tooltip: 'Overall customer rating out of 5',
          getValue: (p) => p.rating.overall,
          format: (v) => `⭐ ${v.toFixed(1)}`,
          compareType: 'higher'
        },
        {
          key: 'trust',
          label: 'Trust Score',
          tooltip: 'InvestingPro Trust Score (0-100)',
          getValue: (p) => p.rating.trust_score,
          format: (v) => `${v}/100`,
          compareType: 'higher'
        }
      ]
    },
    {
      category: 'Key Features',
      features: products[0]?.key_features?.slice(0, 5).map(kf => ({
        key: kf.label,
        label: kf.label,
        getValue: (p: RichProduct) => {
          const feature = p.key_features?.find(f => f.label === kf.label);
          return feature?.value || 'N/A';
        },
        format: (v: any) => v.toString()
      })) || []
    }
  ];

  // Find winner/loser for each comparable feature
  const getWinnerLoser = (feature: ComparisonFeature['features'][0]) => {
    if (!feature.compareType) return { winner: -1, loser: -1 };

    const values = products.map(p => {
      const val = feature.getValue(p);
      return typeof val === 'number' ? val : 0;
    });

    if (values.every(v => v === 0)) return { winner: -1, loser: -1 };

    const maxIndex = values.indexOf(Math.max(...values));
    const minIndex = values.indexOf(Math.min(...values));

    if (feature.compareType === 'higher') {
      return { winner: maxIndex, loser: minIndex };
    } else {
      return { winner: minIndex, loser: maxIndex };
    }
  };

  return (
    <div className="w-full">
      {/* Desktop: Traditional Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
              <th className="p-4 text-left font-bold text-slate-900 dark:text-white border-b-2 border-slate-200 dark:border-slate-700 w-48">
                Feature
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="p-4 text-center border-b-2 border-slate-200 dark:border-slate-700 relative"
                >
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </button>
                  
                  {product.image_url && (
                    <div className="w-20 h-20 mx-auto mb-3 rounded-xl overflow-hidden bg-white">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {product.name}
                  </p>
                  {product.bestFor && (
                    <Badge className="mt-2 text-xs">
                      {product.bestFor}
                    </Badge>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparisonFeatures.map((category, catIdx) => (
              <React.Fragment key={catIdx}>
                {/* Category Header */}
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <td
                    colSpan={products.length + 1}
                    className="p-3 font-bold text-sm uppercase tracking-wide text-slate-700 dark:text-slate-300"
                  >
                    {category.category}
                  </td>
                </tr>

                {/* Feature Rows */}
                {category.features.map((feature, featIdx) => {
                  const { winner, loser } = getWinnerLoser(feature);
                  
                  return (
                    <tr
                      key={featIdx}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          {feature.label}
                          {feature.tooltip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="w-3.5 h-3.5 text-slate-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{feature.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                       </div>
                      </td>

                      {products.map((product, prodIdx) => {
                        const value = feature.getValue(product);
                        const isWinner = winner === prodIdx;
                        const isLoser = loser === prodIdx && products.length > 2;

                        return (
                          <td
                            key={product.id}
                            className={cn(
                              'p-4 text-center font-semibold',
                              isWinner && 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400',
                              isLoser && 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400'
                            )}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {feature.format(value)}
                              {isWinner && <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0.5">BEST</Badge>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Action Row */}
            <tr className="bg-slate-50 dark:bg-slate-900">
              <td className="p-4 font-bold">Actions</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center space-y-2">
                  <Link href={`/${product.category.replace('_', '-')}s/${product.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Details
                    </Button>
                  </Link>
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    size="sm"
                    asChild
                  >
                    <Link href={`/go/${product.slug}`} target="_blank">
                      Apply Now
                    </Link>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile: Side-by-Side Cards (2 at a time with horizontal scroll) */}
      <div className="lg:hidden overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: `${products.length * 180}px` }}>
          {products.map((product, prodIdx) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3"
            >
              {/* Remove Button */}
              <button
                onClick={() => onRemoveProduct(product.id)}
                className="w-full flex justify-end"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
              </button>

              {/* Product Image */}
              {product.image_url && (
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-50">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Product Name */}
              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ⭐ {product.rating.overall.toFixed(1)}
              </p>

              {/* Key Features (condensed) */}
              <div className="space-y-1.5 text-xs">
                {product.key_features?.slice(0, 3).map((kf, idx) => (
                  <div key={idx}>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px]">{kf.label}</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{kf.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Link href={`/${product.category.replace('_', '-')}s/${product.slug}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Details
                  </Button>
                </Link>
                <Button
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs"
                  size="sm"
                  asChild
                >
                  <Link href={`/go/${product.slug}`} target="_blank">
                    Apply
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-slate-500 mt-2">← Scroll to see all products →</p>
      </div>
    </div>
  );
}
