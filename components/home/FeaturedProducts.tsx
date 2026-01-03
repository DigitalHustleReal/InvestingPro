"use client";

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowRight, 
    Star, 
    TrendingUp, 
    Shield,
    CreditCard,
    LineChart,
    Banknote,
    Umbrella,
    BarChart3
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    credit_card: <CreditCard className="w-5 h-5" />,
    mutual_fund: <LineChart className="w-5 h-5" />,
    loan: <Banknote className="w-5 h-5" />,
    insurance: <Umbrella className="w-5 h-5" />,
    broker: <BarChart3 className="w-5 h-5" />,
};

export default function FeaturedProducts() {
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => productService.getFeaturedProducts(6),
        staleTime: 60000
    });

    if (isLoading) {
        return (
            <div className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-64 bg-slate-200 rounded mb-12" />
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Top Rated Financial Products
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Handpicked recommendations verified by our experts for maximum value and reliability.
                        </p>
                    </div>
                    <Link href="/products/credit_card" className="hidden md:flex items-center text-teal-600 font-medium hover:text-teal-700">
                        View all products <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <Link 
                            key={product.id} 
                            href={`/products/${product.category}/${product.slug}`}
                            className="group"
                        >
                            <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-sm overflow-hidden bg-white">
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                                {CATEGORY_ICONS[product.category] || <Star className="w-5 h-5" />}
                                            </div>
                                            {product.trust_score && product.trust_score >= 80 && (
                                                <Badge className="bg-amber-100 text-amber-700 border-0 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-amber-700" />
                                                    Top Rated
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-4 font-medium">
                                            by {product.provider_name}
                                        </p>
                                        
                                        <p className="text-slate-600 mb-6 line-clamp-2 min-h-[3rem]">
                                            {product.meta_description}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                                <span className="font-bold text-slate-900">{product.trust_score}/100</span>
                                                <span className="text-xs text-slate-500">Trust Score</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Verification Strip */}
                                    {product.verification_status === 'verified' && (
                                        <div className="bg-green-50 px-6 py-2 flex items-center gap-2 text-xs font-medium text-green-700 border-t border-green-100">
                                            <Shield className="w-3 h-3" />
                                            Verified by InvestingPro
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" className="w-full">
                        View all products <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
