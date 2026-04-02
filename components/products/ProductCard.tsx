"use client";

import React from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products/product-service';
import { useCompare } from '@/contexts/CompareContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Star, Check } from 'lucide-react';
import Link from 'next/link';
import { getProductUrl, getAffiliateUrl } from '@/lib/utils/product-urls';
import VerificationBadge, { LastUpdated } from '../trust/VerificationBadge';
import { getCategoryImageConfig, type ProductCategory } from '@/lib/images/category-image-config';

export default function ProductCard({ product }: { product: Product }) {
    const { addProduct, removeProduct, isSelected } = useCompare();
    const selected = isSelected(product.id);
    // Cast Product to the RichProduct shape expected by CompareContext
    const richProduct = product as unknown as Parameters<typeof addProduct>[0];

    // Get category-specific image config
    const imageConfig = getCategoryImageConfig((product.category || 'mutual_fund') as ProductCategory);

    // Extract key feature for display (e.g. Annual Fee)
    const annualFee = product.features?.['annual_fee'];
    const rewardRate = product.features?.['reward_rate'] || product.features?.['intraday_brokerage'];

    return (
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow relative overflow-hidden group border-gray-200">
            {/* Compare Checkbox - Always visible on desktop, or top right */}
            <div className="absolute top-3 right-3 z-10 bg-white/95 p-1.5 rounded-lg shadow-sm backdrop-blur-sm border border-gray-100 flex items-center gap-2">
                <Checkbox 
                    id={`compare-${product.id}`}
                    checked={selected}
                    onCheckedChange={(c) => c ? addProduct(richProduct) : removeProduct(product.id)}
                    className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
                />
                <label htmlFor={`compare-${product.id}`} className="text-xs font-medium text-gray-700 cursor-pointer select-none">
                    Compare
                </label>
            </div>

            {/* Image Area */}
            <div className="p-6 pb-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white min-h-[160px] relative">
                {product.image_url ? (
                    <Image 
                        src={product.image_url} 
                        alt={product.name}
                        width={128}
                        height={128}
                        className="h-32 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        quality={imageConfig.quality}
                        loading={imageConfig.loading}
                    />
                ) : (
                    <div className="h-32 w-32 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">{product.name.charAt(0)}</span>
                    </div>
                )}
            </div>

            <CardContent className="flex-1 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-gray-500">
                        {product.provider_name}
                    </Badge>
                    <div className="flex items-center text-accent-500 text-xs font-bold gap-0.5 ml-auto">
                        <Star className="w-3 h-3 fill-current" />
                        {typeof product.rating === 'object' ? product.rating.overall : product.rating}
                    </div>
                </div>
                
                {/* Verification Badge */}
                <div className="mb-2">
                    <VerificationBadge 
                        verificationStatus={product.verification_status || 'pending'}
                        productId={product.id}
                        size="sm"
                    />
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                    {product.description}
                </p>

                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs bg-gray-50 p-3 rounded-lg">
                    {annualFee && (
                        <div>
                            <span className="block text-gray-600">Annual Fee</span>
                            <span className="font-semibold text-gray-700">{annualFee}</span>
                        </div>
                    )}
                    {rewardRate && (
                        <div>
                            <span className="block text-gray-600">Rewards</span>
                            <span className="font-semibold text-gray-700">{rewardRate}</span>
                        </div>
                    )}
                </div>

                {/* Pros Snippet */}
                <div className="space-y-1 mb-2">
                    {product.pros.slice(0, 2).map((pro, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <Check className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{pro}</span>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-6 md:p-8 pt-0 gap-3 flex-col">
                <div className="flex gap-3 w-full">
                    <Link href={getProductUrl(product)} className="flex-1">
                        <Button variant="outline" className="w-full">Details</Button>
                    </Link>
                    <Link href={getAffiliateUrl(product)} className="flex-1" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-primary-dark hover:bg-primary-800 text-white font-semibold shadow-md hover:shadow-lg transition-all h-10">
                            Apply Now
                        </Button>
                    </Link>
                </div>
                
                {/* Last Updated Timestamp */}
                <div className="w-full pt-2 border-t border-gray-100 flex items-center justify-between">
                    <LastUpdated variant="subtle" />
                    <Link href="/editorial-policy" className="text-[10px] text-gray-600 hover:text-primary-600 transition-colors">
                        How we rate
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
