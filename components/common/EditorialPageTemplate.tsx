"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Calendar, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";

interface EditorialPageTemplateProps {
    title: string;
    description: string;
    pageType: 'category' | 'subcategory' | 'guide' | 'calculator';
    breadcrumbs?: Array<{ label: string; href: string }>;
    children: React.ReactNode;
    relatedLinks?: Array<{ label: string; href: string; description?: string }>;
    glossaryTerms?: string[];
    lastReviewed?: Date;
    structuredData?: any;
}

export default function EditorialPageTemplate({
    title,
    description,
    pageType,
    breadcrumbs,
    children,
    relatedLinks = [],
    glossaryTerms = [],
    lastReviewed = new Date(),
    structuredData
}: EditorialPageTemplateProps) {
    
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title={title}
                description={description}
                structuredData={structuredData || faqSchema}
                url={`https://investingpro.in${typeof window !== 'undefined' ? window.location.pathname : ''}`}
            />
            
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
                    <nav className="flex items-center gap-2 text-sm text-slate-600">
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <Link href={crumb.href} className="hover:text-teal-600 transition-colors">
                                    {crumb.label}
                                </Link>
                                {idx < breadcrumbs.length - 1 && <span>/</span>}
                            </React.Fragment>
                        ))}
                        <span className="text-slate-900 font-medium">{title}</span>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>

            {/* Related Links Section */}
            {relatedLinks.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Card className="border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-slate-900">Related Reading</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {relatedLinks.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.href}
                                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">{link.label}</p>
                                            {link.description && (
                                                <p className="text-sm text-slate-600 mt-1">{link.description}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Glossary Terms */}
            {glossaryTerms.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="border-slate-200 shadow-sm rounded-2xl bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-600" />
                                Key Terms
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {glossaryTerms.map((term, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/glossary#${term.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                                    >
                                        {term}
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Last Reviewed */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-sm text-slate-500 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Last reviewed: {lastReviewed.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>
        </div>
    );
}




















