"use client";

import React from 'react';
import { GlossaryPageSchema } from '@/lib/content/schemas';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BookOpen, Calculator } from 'lucide-react';

interface GlossaryPageTemplateProps {
    content: GlossaryPageSchema;
}

export default function GlossaryPageTemplate({ content }: GlossaryPageTemplateProps) {
    const { sections, seo, internal_links } = content;

    return (
        <>
            <SEOHead
                title={seo.title}
                description={seo.description}
                structuredData={seo.structured_data}
            />

            <article className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-4">
                            <BookOpen className="w-8 h-8 text-teal-400" />
                            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">Glossary</Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            {sections.definition.term}
                            {sections.definition.full_form && (
                                <span className="text-2xl text-slate-400 ml-3">({sections.definition.full_form})</span>
                            )}
                        </h1>
                        {sections.definition.pronunciation && (
                            <p className="text-slate-300 text-lg mb-6">Pronunciation: {sections.definition.pronunciation}</p>
                        )}
                        <p className="text-xl text-slate-300 leading-relaxed">{sections.definition.definition}</p>
                    </div>
                </section>

                {/* Detailed Explanation */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Detailed Explanation</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-slate-700 leading-relaxed">{sections.detailed_explanation.content}</p>
                        </div>
                    </div>
                </section>

                {/* Examples Section */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Examples</h2>
                        <div className="space-y-6">
                            {sections.examples.examples.map((example, idx) => (
                                <Card key={idx} className="border border-slate-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold shrink-0">
                                                {idx + 1}
                                            </div>
                                            <p className="text-slate-700 leading-relaxed">{example.example}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Formula Section */}
                {sections.formula && (
                    <section className="py-16 bg-slate-50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Calculator className="w-6 h-6 text-teal-600" />
                                Formula
                            </h2>
                            <Card className="border-0 shadow-lg bg-white">
                                <CardContent className="p-6">
                                    <div className="bg-slate-50 p-4 rounded-lg mb-4">
                                        <code className="text-lg font-mono text-slate-900">{sections.formula.formula}</code>
                                    </div>
                                    <p className="text-slate-600">{sections.formula.explanation}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Related Terms */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Terms</h2>
                        <div className="flex flex-wrap gap-3">
                            {sections.related_terms.terms.map((term, idx) => (
                                <Link
                                    key={idx}
                                    href={term.url}
                                    className="px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-medium transition-colors"
                                >
                                    {term.term}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Internal Links */}
                {internal_links.length > 0 && (
                    <section className="py-12 bg-slate-50 border-t border-slate-200">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Learn More</h2>
                            <div className="flex flex-wrap gap-3">
                                {internal_links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className="text-teal-600 hover:text-teal-700 underline font-medium"
                                    >
                                        {link.text}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </article>
        </>
    );
}

