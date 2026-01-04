
"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Star, ExternalLink, ArrowRight, Check, Info } from 'lucide-react';
import { RichProduct } from '@/types/rich-product';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RichProductCardProps {
    product: RichProduct;
    layout?: 'grid' | 'list';
    onCompare?: (id: string) => void;
}

export function RichProductCard({ product, layout = 'grid', onCompare }: RichProductCardProps) {
    const isList = layout === 'list';

    // Helper: Trust Score Color
    const getTrustColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500 ring-emerald-500/20';
        if (score >= 75) return 'text-teal-500 ring-teal-500/20';
        if (score >= 50) return 'text-yellow-500 ring-yellow-500/20';
        return 'text-red-500 ring-red-500/20';
    };

    return (
        <Card className={cn(
            "group relative overflow-hidden border-slate-200 transition-all hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5",
            isList ? "flex flex-col md:flex-row" : "flex flex-col"
        )}>
            {/* Trust Ribbon */}
            {product.trust_score >= 90 && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                        TOP RATED
                    </div>
                </div>
            )}

            {/* Header / Image Section */}
            <div className={cn(
                "relative bg-slate-50 p-6 flex flex-col items-center justify-center",
                isList ? "w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100" : "border-b border-slate-100"
            )}>
                {/* Logo Placeholder */}
                <div className="w-20 h-20 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center p-2 mb-3">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                        <span className="text-2xl font-bold text-slate-300">{product.name.charAt(0)}</span>
                    )}
                </div>

                {/* Verified Badge */}
                {product.is_verified && (
                    <Badge variant="outline" className="gap-1 bg-white/50 backdrop-blur border-emerald-200 text-emerald-700 text-[10px] font-medium">
                        <ShieldCheck className="w-3 h-3 fill-emerald-100" />
                        Verified
                    </Badge>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{product.provider_name}</p>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                                {product.name}
                            </h3>
                        </div>
                        {/* Rating Star */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                                <span className="font-bold text-slate-900 text-sm">{product.rating.overall}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                    {/* Key Features Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {product.key_features.slice(0, 4).map((feat, i) => (
                            <div key={i} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
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
                                    <Check className="w-3.5 h-3.5 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>

                <CardFooter className="pt-0 gap-3 border-t border-slate-50 p-4 bg-slate-50/30">
                    <Button variant="outline" className="flex-1 text-xs h-9 border-slate-200 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50" asChild>
                        <Link href={`/product/${product.slug}`}>
                            View Details
                        </Link>
                    </Button>
                    <Button className="flex-1 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-emerald-300 shadow-lg transition-all" asChild>
                        <Link href={product.affiliate_link || product.official_link || '#'} target="_blank">
                            Apply Now <ArrowRight className="w-3 h-3 ml-1.5" />
                        </Link>
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
}
