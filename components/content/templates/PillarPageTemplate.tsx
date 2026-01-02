"use client";

import React from 'react';
import { PillarPageSchema } from '@/lib/content/schemas';
import SEOHead from '@/components/common/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react';

interface PillarPageTemplateProps {
    content: PillarPageSchema;
}

export default function PillarPageTemplate({ content }: PillarPageTemplateProps) {
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
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{sections.hero.headline}</h1>
                        <p className="text-xl text-slate-300 mb-8">{sections.hero.subheadline}</p>
                        {sections.hero.cta_text && (
                            <Link href={sections.cta.cta_url}>
                                <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl">
                                    {sections.hero.cta_text}
                                </button>
                            </Link>
                        )}
                    </div>
                </section>

                {/* Overview Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-slate-700 leading-relaxed">{sections.overview.content}</p>
                            {sections.overview.key_statistics && (
                                <div className="grid md:grid-cols-3 gap-6 mt-8">
                                    {sections.overview.key_statistics.map((stat, idx) => (
                                        <Card key={idx} className="border-0 shadow-sm">
                                            <CardContent className="p-6 text-center">
                                                <div className="text-3xl font-bold text-teal-600 mb-2">{stat.value}</div>
                                                <div className="text-sm text-slate-600">{stat.label}</div>
                                                {stat.source && (
                                                    <div className="text-xs text-slate-400 mt-2">Source: {stat.source}</div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Key Features</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sections.key_features.features.map((feature, idx) => (
                                <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                        <p className="text-slate-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How It Works</h2>
                        <div className="space-y-8">
                            {sections.how_it_works.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                            {step.step_number}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Types/Variants Section */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Types & Variants</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {sections.types_variants.variants.map((variant, idx) => (
                                <Card key={idx} className="border border-slate-200">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{variant.name}</h3>
                                        <p className="text-slate-600 mb-4">{variant.description}</p>
                                        <Badge variant="outline" className="text-xs">
                                            Best for: {variant.use_case}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pros & Cons Section */}
                <section className="py-16 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Pros & Cons</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-emerald-600 mb-6 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Advantages
                                    </h3>
                                    <ul className="space-y-3">
                                        {sections.pros_cons.pros.map((pro, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                                <span className="text-slate-700">{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-rose-600 mb-6 flex items-center gap-2">
                                        <XCircle className="w-5 h-5" />
                                        Considerations
                                    </h3>
                                    <ul className="space-y-3">
                                        {sections.pros_cons.cons.map((con, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                                <span className="text-slate-700">{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {sections.faq.questions.map((faq, idx) => (
                                <Card key={idx} className="border border-slate-200">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                                            <HelpCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                                            {faq.question}
                                        </h3>
                                        <p className="text-slate-600 ml-8">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-br from-teal-600 to-blue-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">{sections.cta.headline}</h2>
                        <p className="text-xl text-teal-100 mb-8">{sections.cta.description}</p>
                        <Link href={sections.cta.cta_url}>
                            <button className="bg-white text-teal-600 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2">
                                {sections.cta.cta_text}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Internal Links Section */}
                {internal_links.length > 0 && (
                    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Related Content</h2>
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

