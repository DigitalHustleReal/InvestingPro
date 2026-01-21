
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Star, ExternalLink, ArrowRight, Check, Info } from 'lucide-react';
import { RichProduct } from '@/types/rich-product';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import BestForBadge from './BestForBadge';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';

import { useCompare } from '@/contexts/CompareContext';
import DecisionCTA from '@/components/common/DecisionCTA';
import { getProductUrl, getAffiliateUrl } from '@/lib/utils/product-urls';
import { getCategoryImageConfig, getCategoryImageSizes, type ProductCategory } from '@/lib/images/category-image-config';

interface RichProductCardProps {
    product: RichProduct;
    layout?: 'grid' | 'list';
    onCompare?: (id: string) => void; // Keep for backward compatibility if needed, but we'll use context
}

export function RichProductCard({ product, layout = 'grid', onCompare }: RichProductCardProps) {
    const isList = layout === 'list';
    const { addProduct, removeProduct, isSelected } = useCompare();
    const isCompareSelected = isSelected(product.id);

    const handleCompareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCompareSelected) {
            removeProduct(product.id);
        } else {
            const success = addProduct(product);
            if (!success) {
                console.warn('Maximum products reached');
            }
        }
        if (onCompare) onCompare(product.id);
    };

    // Helper: Trust Score Color
    const getTrustColor = (score: number) => {
        if (score >= 90) return 'text-primary-500 ring-primary-500/20';
        if (score >= 75) return 'text-primary-500 ring-primary-500/20';
        if (score >= 50) return 'text-accent-500 ring-yellow-500/20';
        return 'text-danger-500 ring-danger-500/20';
    };

    // Get category-specific image config
    const imageConfig = getCategoryImageConfig((product.category || 'mutual_fund') as ProductCategory);
    const imageSizes = getCategoryImageSizes((product.category || 'mutual_fund') as ProductCategory);

    return (
        <Card className={cn(
            "group relative overflow-hidden border-slate-200 transition-all hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5",
            isList ? "flex flex-col md:flex-row" : "flex flex-col"
        )}>
            {/* Trust Ribbon */}
            {product.rating.trust_score >= 90 && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                        TOP RATED
                    </div>
                </div>
            )}

            {/* Comparison Checkbox - Redesigned for Mobile (Larger Hit Area) */}
            <div className="absolute top-3 left-3 z-10">
                <button 
                    onClick={handleCompareClick}
                    className={cn(
                        "p-2 rounded-xl border transition-all shadow-sm flex items-center gap-1.5",
                        isCompareSelected 
                            ? "bg-primary-600 border-primary-500 text-white" 
                            : "bg-white/90 backdrop-blur-md border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-500"
                    )}
                    aria-label={isCompareSelected ? "Remove from comparison" : "Add to comparison"}
                >
                    <div className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                        isCompareSelected ? "bg-white border-white" : "border-slate-300"
                    )}>
                        {isCompareSelected && <Check className="w-3.5 h-3.5 text-primary-600 font-black" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider pr-1">Compare</span>
                </button>
            </div>

            {/* Header / Image Section - No Background, Direct Image */}
            <div className={cn(
                "relative px-6 pt-8 pb-6 flex flex-col items-center justify-center",
                isList ? "w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100" : "border-b border-slate-100"
            )}>
                {/* Product Image - Direct Display with Shadow */}
                <div className="w-full max-w-[280px] aspect-[1.6/1] rounded-xl overflow-hidden mb-4 shadow-lg hover:shadow-xl transition-shadow relative">
                    {product.image_url ? (
                        <Image 
                            src={product.image_url} 
                            alt={product.name}
                            width={imageConfig.defaultWidth}
                            height={imageConfig.defaultHeight}
                            className="w-full h-full object-cover rounded-xl"
                            sizes={imageSizes}
                            quality={imageConfig.quality}
                            priority={imageConfig.priority}
                            loading={imageConfig.loading}
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2YxZjVmOSIvPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNCIgZmlsbD0iIzBkOTQ4OCIvPjwvc3ZnPg=="
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-xl">
                            <span className="text-5xl font-bold text-slate-400">{product.name.charAt(0)}</span>
                        </div>
                    )}
                </div>

                {/* Verified Badge */}
                {product.is_verified && (
                    <Badge variant="outline" className="gap-1 bg-white border-primary-200 text-primary-700 text-[10px] font-medium shadow-sm">
                        <ShieldCheck className="w-3 h-3 fill-success-100" />
                        Verified
                    </Badge>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{product.provider_name}</p>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary-700 transition-colors mb-2">
                                {product.name}
                            </h3>
                            {/* Best For Badge */}
                            {product.bestFor && (
                                <BestForBadge category={product.bestFor} size="sm" />
                            )}
                        </div>
                        {/* Rating Star */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-accent-50 px-2 py-1 rounded-lg border border-accent-100">
                                <Star className="w-3.5 h-3.5 text-accent-500 fill-accent-500 mr-1" />
                                <span className="font-bold text-slate-900 text-sm">{product.rating.overall}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                    {/* Key Features Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {product.key_features.slice(0, 4).map((feat, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] text-slate-500 mb-0.5">{feat.label}</p>
                                <p className="font-semibold text-slate-900 text-sm truncate">{feat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust Score Indicator */}
                    <div className="flex items-center gap-3 bg-slate-50/50 rounded-lg p-2 mb-4 border border-slate-100">
                        <div className={cn("text-xs font-bold px-2 py-0.5 rounded-full ring-1 bg-white", getTrustColor(product.rating.trust_score))}>
                            {product.rating.trust_score}% Trust
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                            Based on data completeness & verification
                        </p>
                    </div>

                    {/* Pros (List Layout only or if ample space) */}
                    {(isList && product.pros.length > 0) && (
                        <ul className="space-y-1 mt-2">
                            {product.pros.slice(0, 2).map((pro, i) => (
                                <li key={i} className="flex items-start text-xs text-slate-600">
                                    <Check className="w-3.5 h-3.5 text-primary-500 mr-2 mt-0.5 shrink-0" />
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>

                <CardFooter className="pt-0 gap-3 border-t border-slate-50 p-4 bg-slate-50/30 flex-col items-stretch">
                    {/* Decision-Focused CTA Buttons */}
                    <div className="flex gap-3">
                        <DecisionCTA
                            text="Compare Details"
                            href={getProductUrl(product)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-9"
                            showIcon={false}
                        />
                        <DecisionCTA
                            text={product.category === 'credit_card' ? "Apply Instantly" : 
                                  product.category === 'mutual_fund' ? "Start SIP Now" :
                                  product.category === 'loan' ? "Check Eligibility" :
                                  product.category === 'insurance' ? "Get Protected" :
                                  "Apply Now"}
                            href={getAffiliateUrl(product)}
                            productId={product.id}
                            variant="primary"
                            size="sm"
                            className="flex-1 text-xs h-9"
                            isExternal={!!product.affiliate_link}
                            showIcon={true}
                        />
                    </div>
                    
                    {/* Affiliate Disclosure - FTC Compliance */}
                    <AffiliateDisclosure 
                        variant="button" 
                        className="mt-1" 
                        hasAffiliateLink={!!product.affiliate_link}
                    />
                </CardFooter>
            </div>
        </Card>
    );
}
