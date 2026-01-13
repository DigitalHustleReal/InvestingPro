"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import SmartCTA from './SmartCTA';
import { Sparkles, TrendingUp, Shield, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdSlotProps {
    variant?: 'inline' | 'sidebar' | 'banner' | 'native';
    placement?: string;
    category?: string;
    className?: string;
    // For native/contextual ads
    product?: {
        name: string;
        description: string;
        imageUrl?: string;
        cta: string;
        href: string;
        trackingId?: string;
        badge?: string;
        rating?: number;
    };
}

export default function AdSlot({
    variant = 'inline',
    placement = 'content',
    category,
    className,
    product
}: AdSlotProps) {

    // Native product promotion (highest value)
    if (product) {
        return (
            <Card className={cn(
                "overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
                variant === 'inline' && "my-8",
                variant === 'sidebar' && "sticky top-4",
                className
            )}>
                <div className="relative">
                    {/* Sponsored badge */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-full">
                            Sponsored
                        </span>
                    </div>
                    
                    {/* Product badge */}
                    {product.badge && (
                        <div className="absolute top-3 right-3 z-10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-accent-500 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                {product.badge}
                            </span>
                        </div>
                    )}

                    {/* Product image */}
                    {product.imageUrl && (
                        <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                    )}

                    {/* Content */}
                    <div className="p-6">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {product.name}
                        </h4>
                        
                        {product.rating && (
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={cn(
                                            "w-4 h-4",
                                            i < Math.floor(product.rating!) 
                                                ? "text-accent-400 fill-accent-400" 
                                                : "text-slate-300"
                                        )} 
                                    />
                                ))}
                                <span className="text-sm text-slate-500 ml-1">
                                    {product.rating.toFixed(1)}
                                </span>
                            </div>
                        )}
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            {product.description}
                        </p>

                        <SmartCTA
                            variant="gradient"
                            size="md"
                            href={product.href}
                            trackingId={product.trackingId}
                            label={product.cta}
                            icon="arrow"
                            isExternal
                            fullWidth
                        />
                    </div>
                </div>
            </Card>
        );
    }

    // Placeholder for ad networks (Google AdSense, etc.)
    return (
        <div className={cn(
            "bg-slate-100 dark:bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-400 text-sm",
            variant === 'inline' && "my-6 h-24",
            variant === 'sidebar' && "h-64",
            variant === 'banner' && "h-32 w-full",
            className
        )}>
            <span className="text-xs uppercase tracking-widest">Ad Slot: {placement}</span>
        </div>
    );
}

// Contextual promotion cards for articles
export function PromotionCard({
    title,
    description,
    ctaLabel,
    ctaHref,
    trackingId,
    icon: IconComponent = TrendingUp,
    theme = 'teal'
}: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    trackingId?: string;
    icon?: React.ComponentType<{ className?: string }>;
    theme?: 'teal' | 'indigo' | 'amber';
}) {
    const themeStyles = {
        teal: "from-primary-500/10 to-primary-600/10 border-primary-500/20",
        indigo: "from-primary-500/10 to-indigo-600/10 border-primary-500/20",
        amber: "from-accent-500/10 to-accent-600/10 border-accent-500/20"
    };

    const iconStyles = {
        teal: "text-primary-500",
        indigo: "text-primary-500",
        amber: "text-accent-500"
    };

    return (
        <Card className={cn(
            "p-6 bg-gradient-to-br border",
            themeStyles[theme]
        )}>
            <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-xl bg-white dark:bg-slate-900", iconStyles[theme])}>
                    <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
                    <SmartCTA
                        variant="primary"
                        size="sm"
                        href={ctaHref}
                        trackingId={trackingId}
                        label={ctaLabel}
                        icon="arrow"
                        isExternal={!!trackingId}
                    />
                </div>
            </div>
        </Card>
    );
}

// Comparison widget for product pages
export function ComparisonWidget({
    products
}: {
    products: {
        name: string;
        highlight: string;
        href: string;
        trackingId?: string;
        featured?: boolean;
    }[];
}) {
    return (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-500" />
                Quick Compare
            </h4>
            <div className="space-y-3">
                {products.map((product, idx) => (
                    <a
                        key={idx}
                        href={product.trackingId ? `/go/${product.trackingId}` : product.href}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className={cn(
                            "flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md",
                            product.featured 
                                ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-primary-500/10 dark:to-secondary-500/10 border-primary-200 dark:border-primary-500/20" 
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/5"
                        )}
                    >
                        <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                {product.name}
                                {product.featured && (
                                    <span className="text-[10px] font-bold uppercase bg-primary-500 text-white px-2 py-0.5 rounded-full">
                                        Top Pick
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-slate-500">{product.highlight}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                    </a>
                ))}
            </div>
        </Card>
    );
}
