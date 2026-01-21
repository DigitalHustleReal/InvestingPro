"use client";

import React from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getCategoryImageConfig, getCategoryImageSizes, type ProductCategory } from '@/lib/images/category-image-config';

export default function ContextualProducts({ category }: { category: string }) {
    // Map article categories to product categories
    const productCat = (category || 'credit_card').replace('-', '_') as ProductCategory;
    
    // Get image config for this category
    const imageConfig = getCategoryImageConfig(productCat);
    const imageSizes = getCategoryImageSizes(productCat);
    
    const { data: products, isLoading } = useQuery({
        queryKey: ['contextual-products', productCat],
        queryFn: async () => {
            const allProducts = await productService.getProducts(productCat as any);
            return allProducts.slice(0, 3);
        },
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    if (isLoading) {
        return (
            <div className="my-16 p-8 bg-slate-900 rounded-xl text-white border border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-center py-12">
                    <div className="text-slate-400">Loading recommendations...</div>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <div className="my-16 p-8 bg-slate-900 rounded-xl text-white border border-slate-700 shadow-2xl relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 bg-primary-500 rounded-lg">
                         <TrendingUp className="w-4 h-4 text-slate-900" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Expert Recommendations</h3>
                </div>
                <p className="text-slate-400 mb-8 max-w-lg text-sm">Based on the analysis in this article, these are currently the best {category.replace('-', ' ')} options in India for 2026.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.isArray(products) && products.map(p => (
                        <Card key={p.id} className="bg-slate-800/40 border-slate-700/50 p-6 flex flex-col hover:border-primary-500/50 transition-all group backdrop-blur-md">
                            <div className="flex justify-between items-start mb-5">
                                <div className="p-2 bg-white rounded-xl w-14 h-14 flex items-center justify-center shadow-inner overflow-hidden relative">
                                     {p.image_url ? (
                                        <Image 
                                            src={p.image_url} 
                                            alt={p.name}
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-contain"
                                            quality={imageConfig.quality}
                                            loading={imageConfig.loading}
                                        />
                                     ) : (
                                        <div className="w-full h-full bg-slate-100 rounded" />
                                     )}
                                </div>
                                <div className="text-accent-400 flex items-center gap-1.5 text-xs font-bold bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
                                    <Star className="w-3.5 h-3.5 fill-current" /> {p.rating}
                                </div>
                            </div>
                            
                            <h4 className="font-bold text-base mb-2 leading-tight group-hover:text-primary-400 transition-colors uppercase tracking-tight">{p.name}</h4>
                            <p className="text-[12px] text-slate-400 mb-6 line-clamp-2 leading-relaxed opacity-80">{p.description}</p>
                            
                            <div className="mt-auto">
                                <Link href={`/go/${p.slug}`} target="_blank">
                                    <Button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(20,184,166,0.2)] hover:shadow-[0_4px_20px_rgba(20,184,166,0.4)] transition-all">
                                        Check Eligibility
                                    </Button>
                                </Link>
                                <p className="text-[9px] text-center text-slate-500 mt-3 uppercase tracking-widest font-bold">Secure Partner Link</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
