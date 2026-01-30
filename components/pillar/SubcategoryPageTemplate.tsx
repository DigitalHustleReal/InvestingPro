"use client";

import React from 'react';
import { SubcategoryPageData } from '@/lib/pillar/data-fetcher';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
    TrendingUp, 
    Users, 
    BarChart3, 
    Calculator, 
    BookOpen,
    ArrowRight,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';
import EmptyState from '@/components/common/EmptyState';

interface SubcategoryPageTemplateProps {
    data: SubcategoryPageData;
}

export default function SubcategoryPageTemplate({ data }: SubcategoryPageTemplateProps) {
    const { category, subcategory, whatItIs, whoItIsFor, productComparison, relatedCalculators, relatedGlossary } = data;

    const seoTitle = `${subcategory.name} in India | ${category.name} | InvestingPro`;
    const seoDescription = `${subcategory.description} Compare options, rates, and features.`;

    return (
        <PageErrorBoundary pageName={`${subcategory.name} Subcategory Page`}>
            <div className="min-h-screen bg-white">
                <SEOHead
                    title={seoTitle}
                    description={seoDescription}
                    structuredData={{
                        "@context": "https://schema.org",
                        "@type": "FinancialProduct",
                        "name": subcategory.name,
                        "description": subcategory.description,
                        "url": `https://investingpro.in/${category.slug}/${subcategory.slug}`,
                    }}
                />

                {/* Breadcrumb */}
                <section className="bg-slate-50 border-b border-slate-200 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-slate-600 hover:text-primary-600">Home</Link>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                            <Link href={`/${category.slug}`} className="text-slate-600 hover:text-primary-600">
                                {category.name}
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 font-medium">{subcategory.name}</span>
                        </div>
                    </div>
                </section>

                {/* Hero Section */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Link 
                                    href={`/${category.slug}`}
                                    className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                                >
                                    {category.name}
                                </Link>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                <Badge className="bg-primary-500/20 text-primary-400 border-primary-500/30">
                                    {subcategory.name}
                                </Badge>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                {subcategory.name} in India
                            </h1>
                            <p className="text-xl text-slate-300 leading-relaxed">
                                {subcategory.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* What It Is Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-primary-600" />
                                What Are {subcategory.name}?
                            </h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-slate-700 leading-relaxed text-lg">
                                    {whatItIs}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who It's For Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary-600" />
                                Who Are {subcategory.name} For?
                            </h2>
                            <Card className="border-0 shadow-lg bg-primary-50">
                                <CardContent className="p-8">
                                    <p className="text-slate-700 leading-relaxed text-lg">
                                        {whoItIsFor}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Product Comparison Summary */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-primary-600" />
                                Compare {subcategory.name}
                            </h2>
                            <Badge className="bg-primary-100 text-primary-700 text-sm font-bold">
                                {productComparison.totalProducts} Options
                            </Badge>
                        </div>

                        {productComparison.topProducts.length > 0 ? (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {productComparison.topProducts.map((product: any, idx: number) => (
                                        <Link
                                            key={product.id || idx}
                                            href={`/${category.slug}/${product.slug || product.id}`}
                                            className="block"
                                        >
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full">
                                                <CardContent className="p-6">
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                        {product.name}
                                                        {product.verification_status === 'verified' && (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 h-5 px-1.5 text-[10px]">
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mb-4">
                                                        {product.provider || 'Provider'}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-primary-600 font-medium text-sm">
                                                        View Details
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>

                                <Card className="border-0 shadow-lg bg-white">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Key Comparison Points</h3>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {productComparison.comparisonPoints.map((point, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
                                                    <span className="text-slate-700">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <EmptyState
                                title="No products available"
                                description="Products for this subcategory will appear here once they are added to the database."
                            />
                        )}
                    </div>
                </section>

                {/* Related Calculators */}
                {relatedCalculators.length > 0 && (
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <Calculator className="w-8 h-8 text-primary-600" />
                                Related Calculators
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedCalculators.map((calc, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/calculators/${calc.slug}`}
                                        className="block"
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full">
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <Calculator className="w-6 h-6 text-primary-600" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {calc.name}
                                                    </h3>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Related Glossary */}
                {relatedGlossary.length > 0 && (
                    <section className="py-16 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-primary-600" />
                                Related Terms
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {relatedGlossary.map((term, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/glossary/${term.slug}`}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors font-medium text-slate-900"
                                    >
                                        {term.term}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Back to Category */}
                <section className="py-16 md:py-24 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href={`/${category.slug}`}
                            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
                        >
                            ← Back to {category.name}
                        </Link>
                    </div>
                </section>
            </div>
        </PageErrorBoundary>
    );
}

