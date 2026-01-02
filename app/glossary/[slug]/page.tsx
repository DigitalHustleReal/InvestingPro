"use client";

import React, { Suspense } from 'react';
import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BookOpen, Calculator, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';
import { generateSchemaMarkup } from '@/lib/glossary/schema-markup';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import AutoInternalLinks from '@/components/common/AutoInternalLinks';
import { generateSchema } from '@/lib/linking/schema';
import { generateCanonicalUrl } from '@/lib/linking/canonical';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';
import { mapGlossaryCategoryToNavCategory } from '@/lib/linking/engine';

interface GlossaryDetailPageProps {
    params: Promise<{ slug: string }>;
}

function GlossaryDetailContent({ slug }: { slug: string }) {
    const { data: term, isLoading } = useQuery({
        queryKey: ['glossary-term', slug],
        queryFn: () => api.entities.Glossary.getBySlug(slug),
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text="Loading term definition..." />
            </div>
        );
    }

    if (!term) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Term Not Found</h1>
                    <p className="text-slate-600 mb-6">The glossary term you're looking for doesn't exist.</p>
                    <Link href="/glossary" className="text-teal-600 hover:text-teal-700 font-medium">
                        ← Back to Glossary
                    </Link>
                </div>
            </div>
        );
    }

    // Generate automated internal links
    const linkingContext = React.useMemo(() => ({
        contentType: 'glossary' as const,
        category: mapGlossaryCategoryToNavCategory(String(term.category || 'General')),
        slug: term.slug,
        relatedTerms: term.internal_links?.map((l: any) => l.url?.split('/').pop()).filter(Boolean) || [],
        relatedCalculators: term.related_calculators || [],
    }), [term]);

    // Generate schema markup
    const glossarySchema = generateSchemaMarkup({
        term: term.term,
        full_form: term.full_form,
        definition: term.definition,
        slug: term.slug,
        category: term.category,
        sources: term.sources || [],
    });

    // Generate automated schema
    const breadcrumbs = React.useMemo(() => [
        { label: 'Home', url: '/' },
        { label: 'Glossary', url: '/glossary' },
        { label: term.term, url: `/glossary/${term.slug}` },
    ], [term]);
    
    const autoSchema = React.useMemo(() => {
        try {
            return generateSchema({
                pageType: 'glossary',
                title: term.term,
                description: term.definition,
                url: `/glossary/${term.slug}`,
                breadcrumbs,
                category: term.category,
            });
        } catch (error) {
            return null;
        }
    }, [term, breadcrumbs]);

    // Combine schemas
    const schemaMarkup = [
        glossarySchema.main || glossarySchema,
        autoSchema,
        generateBreadcrumbSchema(breadcrumbs)
    ].filter(Boolean);

    // Generate canonical URL
    const canonicalUrl = generateCanonicalUrl(`/glossary/${term.slug}`);

    // Parse internal links
    const internalLinks = term.internal_links || [];

    return (
        <>
              <SEOHead
                  title={term.seo_title || `${term.term} - Definition & Meaning | InvestingPro`}
                  description={term.seo_description || term.definition?.substring(0, 160)}
                  url={canonicalUrl}
                  structuredData={schemaMarkup}
              />

              {/* Automated Breadcrumbs */}
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                  <AutoBreadcrumbs />
              </div>

            <article className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-6 h-6 text-teal-400" />
                            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">Glossary</Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {term.term}
                            {term.full_form && (
                                <span className="text-2xl text-slate-400 ml-3">({term.full_form})</span>
                            )}
                        </h1>
                        {term.pronunciation && (
                            <p className="text-slate-300 text-lg mb-6">Pronunciation: {term.pronunciation}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Category: {term.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                            {term.views > 0 && <span>• {term.views} views</span>}
                        </div>
                    </div>
                </section>

                {/* Definition Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Definition</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-slate-700 leading-relaxed text-lg">{term.definition}</p>
                        </div>
                    </div>
                </section>

                {/* Why It Matters Section */}
                {term.why_it_matters && (
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Why It Matters</h2>
                            <Card className="border-0 shadow-lg bg-teal-50">
                                <CardContent className="p-6">
                                    <p className="text-slate-700 leading-relaxed">{term.why_it_matters}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Example Section */}
                {term.example_numeric && (
                    <section className="py-16 bg-slate-50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Example</h2>
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="bg-slate-50 p-6 md:p-8 rounded-lg mb-4 font-mono text-lg">
                                        {term.example_numeric}
                                    </div>
                                    {term.example_text && (
                                        <p className="text-slate-700 leading-relaxed">{term.example_text}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Related Calculators */}
                {term.related_calculators && term.related_calculators.length > 0 && (
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Calculator className="w-6 h-6 text-teal-600" />
                                Related Calculators
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {term.related_calculators.map((calc: string, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={`/calculators/${calc}`}
                                        className="block p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Calculator className="w-5 h-5 text-teal-600" />
                                            <span className="font-medium text-slate-900">
                                                {calc.charAt(0).toUpperCase() + calc.slice(1)} Calculator
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Related Guides */}
                {term.related_guides && term.related_guides.length > 0 && (
                    <section className="py-16 bg-slate-50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-teal-600" />
                                Related Guides
                            </h2>
                            <div className="space-y-3">
                                {term.related_guides.map((guide: string, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={`/guides/${guide}`}
                                        className="block p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-white transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-teal-600" />
                                            <span className="font-medium text-slate-900">
                                                Guide: {guide.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Internal Links */}
                {internalLinks.length > 0 && (
                    <section className="py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Learn More</h2>
                            <div className="flex flex-wrap gap-3">
                                {internalLinks.map((link: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className="px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-medium transition-colors"
                                    >
                                        {link.text}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Sources Section */}
                {term.sources && term.sources.length > 0 && (
                    <section className="py-16 bg-slate-50 border-t border-slate-200">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                Sources
                            </h2>
                            <div className="space-y-3">
                                {term.sources.map((source: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200">
                                        <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 ${source.verified ? 'text-emerald-600' : 'text-slate-400'}`} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-slate-900">{source.name}</span>
                                                {source.type && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {source.type}
                                                    </Badge>
                                                )}
                                            </div>
                                            {source.url && (
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-teal-600 hover:text-teal-700 text-sm flex items-center gap-1"
                                                >
                                                    {source.url}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                  {/* Automated Internal Links */}
                  <section className="py-16 md:py-24 border-t border-slate-200">
                      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                          <AutoInternalLinks context={linkingContext} />
                      </div>
                  </section>
            </article>
        </>
    );
}

export default function GlossaryDetailPage({ params }: GlossaryDetailPageProps) {
    const { slug } = use(params);

    return (
        <PageErrorBoundary pageName="Glossary Detail">
            <Suspense fallback={<LoadingSpinner text="Loading term..." />}>
                <GlossaryDetailContent slug={slug} />
            </Suspense>
        </PageErrorBoundary>
    );
}

