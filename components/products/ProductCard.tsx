"use client";

import React from 'react';
import { Product } from '@/lib/products/product-service';
import { useCompare } from './CompareContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCompare, removeFromCompare, isInCompare } = useCompare();
    const isSelected = isInCompare(product.id);

    // Extract key feature for display (e.g. Annual Fee)
    const annualFee = product.features['annual_fee'];
    const rewardRate = product.features['reward_rate'] || product.features['intraday_brokerage'];

    return (
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow relative overflow-hidden group border-slate-200">
            {/* Compare Checkbox - Always visible on desktop, or top right */}
            <div className="absolute top-3 right-3 z-10 bg-white/95 p-1.5 rounded-lg shadow-sm backdrop-blur-sm border border-slate-100 flex items-center gap-2">
                <Checkbox 
                    id={`compare-${product.id}`}
                    checked={isSelected}
                    onCheckedChange={(c) => c ? addToCompare(product) : removeFromCompare(product.id)}
                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                />
                <label htmlFor={`compare-${product.id}`} className="text-xs font-medium text-slate-700 cursor-pointer select-none">
                    Compare
                </label>
            </div>

            {/* Image Area */}
            <div className="p-6 pb-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white min-h-[160px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="h-32 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <CardContent className="flex-1 p-5">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-slate-500">
                        {product.provider_name}
                    </Badge>
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5 ml-auto">
                        <Star className="w-3 h-3 fill-current" />
                        {product.rating}
                    </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">
                    {product.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                    {product.description}
                </p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs bg-slate-50 p-3 rounded-lg">
                    {annualFee && (
                        <div>
                            <span className="block text-slate-400">Annual Fee</span>
                            <span className="font-semibold text-slate-700">{annualFee}</span>
                        </div>
                    )}
                    {rewardRate && (
                        <div>
                            <span className="block text-slate-400">Rewards</span>
                            <span className="font-semibold text-slate-700">{rewardRate}</span>
                        </div>
                    )}
                </div>

                {/* Pros Snippet */}
                <div className="space-y-1 mb-2">
                    {product.pros.slice(0, 2).map((pro, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <Check className="w-3 h-3 text-teal-600 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{pro}</span>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 gap-3">
                <Link href={`/reviews/${product.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full">Details</Button>
                </Link>
                <Link href={product.affiliate_link || '#'} className="flex-1">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">Apply Now</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
