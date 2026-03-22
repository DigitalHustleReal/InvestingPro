"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    ArrowLeft,
    Shield,
    Clock,
    TrendingUp,
    Loader2,
    Calendar,
    Globe,
    CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
    const params = useParams();
    const category = params?.category as string | undefined;
    const slug = params?.slug as string | undefined;

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productService.getProductBySlug(slug!),
        enabled: !!slug
    });

    if (!category || !slug) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Product URL</h1>
                    <p className="text-slate-500 mb-6">The product URL is malformed.</p>
                    <Link href="/products">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
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

    // Calculate category label only in the final return, after all safety checks
    // This ensures category is definitely defined
    const categoryLabel = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    console.log('[ProductDetailPage] Rendering with:', { category, slug, product: product?.name });

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
                        {/* Product Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl text-3xl">
                            {category === 'credit_card' && '💳'}
                            {category === 'mutual_fund' && '📈'}
                            {category === 'loan' && '💰'}
                            {category === 'insurance' && '🛡️'}
                            {category === 'broker' && '📊'}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-0">{categoryLabel}</Badge>
                                {product.verification_status === 'verified' && (
                                    <Badge className="bg-success-500/20 text-success-400 border-0 flex items-center gap-1">
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
                            
                            {/* Trust Score */}
                            <div className="flex items-center gap-4">
                                {product.trust_score && product.trust_score > 0 && (
                                    <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        <span className="text-xl font-bold text-white">{product.trust_score}</span>
                                        <span className="text-slate-400">/100</span>
                                    </div>
                                )}
                                {product.trust_score && product.trust_score >= 80 && (
                                    <div className="flex items-center gap-2 text-success-400">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Top Rated</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-3 md:items-end">
                            {(product.official_link || product.affiliate_link) && (
                                <a href={product.official_link || product.affiliate_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                                        <Globe className="w-4 h-4 mr-2" /> Visit Website
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

                        {/* Product Details */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Product Details</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">Provider</div>
                                        <div className="text-lg font-bold text-slate-900">{product.provider_name}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">Category</div>
                                        <div className="text-lg font-bold text-slate-900 capitalize">{product.category.replace('_', ' ')}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">Rating</div>
                                        <div className="text-lg font-bold text-slate-900">{product.rating.overall}/5</div>
                                    </div>
                                    {product.trust_score > 0 && (
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <div className="text-sm text-slate-500 mb-1">Trust Score</div>
                                            <div className="text-lg font-bold text-slate-900">{product.trust_score}/100</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* CTA Card */}
                        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-0 text-white">
                            <CardContent className="p-6 text-center">
                                <h3 className="text-xl font-bold mb-2">Interested?</h3>
                                <p className="text-emerald-100 text-sm mb-6">
                                    Learn more about {product.name}
                                </p>
                                {(product.official_link || product.affiliate_link) ? (
                                    <a href={product.official_link || product.affiliate_link} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50">
                                            <Globe className="w-4 h-4 mr-2" /> Visit Website
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
                                                ? 'bg-success-100' 
                                                : 'bg-slate-100'
                                        }`}>
                                            <Shield className={`w-4 h-4 ${
                                                product.verification_status === 'verified' 
                                                    ? 'text-success-600' 
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
                                    {product.updated_at && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">
                                                    {new Date(product.updated_at).toLocaleDateString('en-IN')}
                                                </div>
                                                <div className="text-xs text-slate-500">Last Updated</div>
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
