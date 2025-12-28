"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface GlossaryTemplateProps {
    term: string;
    slug: string;
    definition: string;
    whyItMatters: React.ReactNode;
    howItWorks: React.ReactNode;
    example: React.ReactNode;
    misunderstandings: Array<{ myth: string; fact: string }>;
    relatedTerms: Array<{ term: string; slug: string }>;
    categoryLinks: Array<{ label: string; href: string; description: string }>;
    visualConcept?: string; // Description for visual/graphic
    parentCategory: string;
}

export default function GlossaryTemplate({
    term,
    slug,
    definition,
    whyItMatters,
    howItWorks,
    example,
    misunderstandings,
    relatedTerms,
    categoryLinks,
    visualConcept,
    parentCategory
}: GlossaryTemplateProps) {
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term,
        "description": definition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": "InvestingPro Financial Glossary"
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title={`What Is ${term}? Definition and Explanation | InvestingPro`}
                description={definition}
                structuredData={structuredData}
                url={`https://investingpro.in/glossary/${slug}`}
            />
            
            {/* Breadcrumbs */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
                <nav className="flex items-center gap-2 text-sm text-slate-600">
                    <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/glossary" className="hover:text-teal-600 transition-colors">Glossary</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">{term}</span>
                </nav>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <article className="prose prose-slate max-w-none">
                    {/* Page Title */}
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">
                        What Is {term}?
                    </h1>

                    {/* Short Definition */}
                    <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-r-lg mb-8">
                        <p className="text-lg text-slate-800 leading-relaxed font-medium">
                            {definition}
                        </p>
                    </div>

                    {/* Why It Matters */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Why This Term Matters</h2>
                        <div className="text-slate-700 leading-relaxed">
                            {whyItMatters}
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <div className="text-slate-700 leading-relaxed">
                            {howItWorks}
                        </div>
                    </section>

                    {/* Simple Example */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Simple Example</h2>
                        <Card className="border-slate-200 bg-slate-50">
                            <CardContent className="p-6">
                                {example}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Common Misunderstandings */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Misunderstandings</h2>
                        <div className="space-y-4">
                            {misunderstandings.map((item, idx) => (
                                <Card key={idx} className="border-amber-200 bg-amber-50">
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                    <span className="text-red-600 font-bold text-sm">✗</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900 mb-1">{item.myth}</p>
                                                <p className="text-slate-700 text-sm leading-relaxed">{item.fact}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Related Terms */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Terms</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {relatedTerms.map((related, idx) => (
                                <Link
                                    key={idx}
                                    href={`/glossary/${related.slug}`}
                                    className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-slate-50 transition-colors group"
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors flex-shrink-0" />
                                    <span className="font-medium text-slate-900">{related.term}</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Where This Term Is Used */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Where This Term Is Used</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-slate-50 transition-colors group"
                                >
                                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-slate-900 mb-1">{link.label}</p>
                                        <p className="text-sm text-slate-600">{link.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <section className="mb-10">
                        <Card className="border-slate-300 bg-slate-100">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        This explanation is for informational purposes only and does not constitute financial, 
                                        investment, or tax advice. Please consult a qualified financial advisor before making 
                                        investment or financial decisions.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Last Reviewed */}
                    <div className="text-center text-sm text-slate-500 pt-8 border-t border-slate-200">
                        <p>Last reviewed: <span className="font-medium">December 2024</span></p>
                    </div>
                </article>
            </div>

            {/* Back to Glossary */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/glossary"
                    className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Glossary
                </Link>
            </div>
        </div>
    );
}




















