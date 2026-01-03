"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    Star, 
    ExternalLink, 
    ArrowLeft,
    CheckCircle,
    XCircle,
    Shield,
    Clock,
    TrendingUp,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
    const params = useParams();
    const category = params.category as string;
    const slug = params.slug as string;

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productService.getProductBySlug(slug),
        enabled: !!slug
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
                    <p className="text-slate-500 mb-6">The product you're looking for doesn't exist.</p>
                    <Link href={`/products/${category}`}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const categoryLabel = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title={`${product.name} Review | InvestingPro`}
                description={product.description || `Complete review and analysis of ${product.name} from ${product.provider_name}.`}
            />

            {/* Hero */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link 
                        href={`/products/${category}`}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to {categoryLabel}
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-2xl bg-white p-3 flex items-center justify-center shadow-xl">
                            {product.image_url ? (
                                <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-teal-500 to-teal-600" />
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-teal-500/20 text-teal-400 border-0">{categoryLabel}</Badge>
                                {product.verification_status === 'verified' && (
                                    <Badge className="bg-green-500/20 text-green-400 border-0 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Verified
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                                {product.name}
                            </h1>
                            <p className="text-lg text-slate-400 mb-4">
                                by {product.provider_name}
                            </p>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-xl">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <span className="text-xl font-bold text-white">{product.rating?.toFixed(1)}</span>
                                    <span className="text-slate-400">/5</span>
                                </div>
                                {product.trust_score && product.trust_score >= 80 && (
                                    <div className="flex items-center gap-2 text-teal-400">
                                        <TrendingUp className="w-5 h-5" />
                                        <span className="font-medium">Top Rated</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-3 md:items-end">
                            {product.affiliate_link && (
                                <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto">
                                        Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </a>
                            )}
                            {product.official_link && (
                                <a href={product.official_link} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:text-white w-full md:w-auto">
                                        Official Website
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Overview</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    {product.description || `${product.name} is a ${categoryLabel.toLowerCase()} from ${product.provider_name}. This product offers competitive features and benefits for users looking for reliable financial solutions.`}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        {product.features && Object.keys(product.features).length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">Key Features</h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {Object.entries(product.features).map(([key, value]) => (
                                            <div key={key} className="p-4 bg-slate-50 rounded-xl">
                                                <div className="text-sm text-slate-500 capitalize mb-1">
                                                    {key.replace(/_/g, ' ')}
                                                </div>
                                                <div className="text-lg font-bold text-slate-900">
                                                    {String(value)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pros & Cons */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {product.pros && product.pros.length > 0 && (
                                <Card className="border-green-200">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" /> Pros
                                        </h3>
                                        <ul className="space-y-3">
                                            {product.pros.map((pro, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {product.cons && product.cons.length > 0 && (
                                <Card className="border-red-200">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                                            <XCircle className="w-5 h-5" /> Cons
                                        </h3>
                                        <ul className="space-y-3">
                                            {product.cons.map((con, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600">
                                                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Apply CTA Card */}
                        <Card className="bg-gradient-to-br from-teal-600 to-teal-700 border-0 text-white">
                            <CardContent className="p-6 text-center">
                                <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                                <p className="text-teal-100 text-sm mb-6">
                                    Get started with {product.name} today
                                </p>
                                {product.affiliate_link ? (
                                    <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-white text-teal-700 hover:bg-teal-50">
                                            Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                                        </Button>
                                    </a>
                                ) : (
                                    <Button className="w-full bg-white/20 hover:bg-white/30" disabled>
                                        Coming Soon
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Trust Indicators */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-900 mb-4">Trust & Verification</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            product.verification_status === 'verified' 
                                                ? 'bg-green-100' 
                                                : 'bg-slate-100'
                                        }`}>
                                            <Shield className={`w-4 h-4 ${
                                                product.verification_status === 'verified' 
                                                    ? 'text-green-600' 
                                                    : 'text-slate-400'
                                            }`} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 capitalize">
                                                {product.verification_status || 'Pending Review'}
                                            </div>
                                            <div className="text-xs text-slate-500">Verification Status</div>
                                        </div>
                                    </div>
                                    {product.last_verified_at && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">
                                                    {new Date(product.last_verified_at).toLocaleDateString('en-IN')}
                                                </div>
                                                <div className="text-xs text-slate-500">Last Verified</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
