"use client";

import React from 'react';
import { PillarPageData } from '@/lib/pillar/data-fetcher';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
    TrendingUp, 
    Users, 
    BarChart3, 
    Calculator, 
    FileText, 
    BookOpen,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';
import EmptyState from '@/components/common/EmptyState';
import CategoryHero from '@/components/category/CategoryHero';
import ContextualProducts from '@/components/category/ContextualProducts';

interface PillarPageTemplateProps {
    data: PillarPageData;
}

export default function PillarPageTemplate({ data }: PillarPageTemplateProps) {
    const { category, whatItIs, whoItIsFor, productComparison, relatedCalculators, latestGuides, glossaryHighlights } = data;

    const seoTitle = `${category.name} in India | Complete Guide | InvestingPro`;
    const seoDescription = `${category.description} Compare options, rates, and features from top providers.`;

    return (
        <PageErrorBoundary pageName={`${category.name} Pillar Page`}>
            <div className="min-h-screen bg-white">
                <SEOHead
                    title={seoTitle}
                    description={seoDescription}
                    structuredData={{
                        "@context": "https://schema.org",
                        "@type": "FinancialProduct",
                        "name": category.name,
                        "description": category.description,
                        "url": `https://investingpro.in/${category.slug}`,
                    }}
                />

                {/* Hero Section - Contextual Category Hero */}
                <CategoryHero category={category} />

                {/* Contextual Products Section */}
                <ContextualProducts categorySlug={category.slug} />

                {/* What It Is Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-primary-600" />
                                What Are {category.name}?
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
                                Who Are {category.name} For?
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
                                Product Comparison
                            </h2>
                            <Badge className="bg-primary-100 text-primary-700 text-sm font-bold">
                                {productComparison.totalProducts} Products
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
                                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                        {product.name}
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
                                description="Products for this category will appear here once they are added to the database."
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
                                                <p className="text-slate-600 text-sm">{calc.description}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Latest Guides */}
                {latestGuides.length > 0 && (
                    <section className="py-16 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary-600" />
                                Latest Guides
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {latestGuides.map((guide, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/article/${guide.slug}`}
                                        className="block"
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                    {guide.title}
                                                </h3>
                                                {guide.excerpt && (
                                                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                                                        {guide.excerpt}
                                                    </p>
                                                )}
                                                {guide.published_date && (
                                                    <p className="text-xs text-slate-600">
                                                        {new Date(guide.published_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Glossary Highlights */}
                {glossaryHighlights.length > 0 && (
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-primary-600" />
                                Key Terms to Know
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {glossaryHighlights.map((term, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/glossary/${term.slug}`}
                                        className="block"
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                    {term.term}
                                                </h3>
                                                <p className="text-slate-600 text-sm line-clamp-2">
                                                    {term.definition}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Subcategories */}
                {category.subcategories.length > 0 && (
                    <section className="py-16 bg-slate-50 border-t border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">
                                Explore {category.name} Types
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.subcategories.map((subcat, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/${category.slug}/${subcat.slug}`}
                                        className="block"
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                    {subcat.name}
                                                </h3>
                                                <p className="text-slate-600 text-sm mb-4">
                                                    {subcat.description}
                                                </p>
                                                <div className="flex items-center gap-2 text-primary-600 font-medium text-sm">
                                                    Learn More
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </PageErrorBoundary>
    );
}

