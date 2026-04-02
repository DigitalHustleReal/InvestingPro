
"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';

interface SmartContextualOffersProps {
    category?: string;
    limit?: number;
    title?: string;
}

export default function SmartContextualOffers({ 
    category = 'credit_card', 
    limit = 3,
    title = "Our Top Recommended Picks"
}: SmartContextualOffersProps) {
    
    const { data: products, isLoading } = useQuery({
        queryKey: ['smart-offers', category, limit],
        queryFn: async () => {
            // Using our unified API (which we just fixed)
            const all = await api.entities.AffiliateProduct.list('-clicks', limit);
            return (all || []).filter((p: any) => p.category === category && p.is_active !== false);
        },
        staleTime: 60000 // 1 minute
    });

    if (isLoading) {
        return (
            <div className="space-y-4 my-8">
                <Skeleton className="h-8 w-64 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) return null;

    const displayedProducts = products
        .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit);

    return (
        <div className="my-12 p-8 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-primary-400 fill-primary-400" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProducts.map((product: any) => (
                        <Card key={product.id} className="bg-slate-800/50 border-slate-700 hover:border-primary-500/50 transition-all group backdrop-blur-sm">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-6 md:p-8 bg-white rounded-lg w-12 h-12 flex items-center justify-center overflow-hidden">
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center text-accent-400 font-bold text-sm bg-slate-900/50 px-2 py-1 rounded-full border border-slate-700">
                                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                                        {product.rating || '4.5'}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-slate-600 mb-4 line-clamp-2 h-8">
                                    {product.description}
                                </p>

                                <div className="space-y-2 mb-6">
                                    {product.pros?.slice(0, 2).map((pro: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                                            <div className="w-1 h-1 rounded-full bg-primary-500" />
                                            <span className="truncate">{pro}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href={`/go/${product.slug}`} target="_blank" className="block">
                                    <Button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold h-10 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest bg-slate-900/50 py-3 rounded-xl border border-slate-800">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Editorial Disclosure: We may receive a commission for referrals</span>
                </div>
            </div>
        </div>
    );
}
