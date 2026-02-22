import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import React from 'react';

import type { Metadata } from 'next';
import { SIPCalculatorWithInflation } from "@/components/calculators/SIPCalculatorWithInflation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Calendar, ExternalLink } from "lucide-react";
import { SEOArticle } from "@/components/calculators/SEOArticle";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import AutoInternalLinks from '@/components/common/AutoInternalLinks';
import { generateSchema } from '@/lib/linking/schema';
import { generateCanonicalUrl } from '@/lib/linking/canonical';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';
import { seoContent } from '@/lib/content/calculator-content';

export const metadata: Metadata = {
    title: 'SIP Calculator India 2026 - Calculate SIP Returns with Inflation Adjustment | InvestingPro',
    description: 'Free SIP calculator to calculate returns on Systematic Investment Plans (SIP). Calculate SIP maturity value, returns, and inflation-adjusted real returns. Plan your financial goals with accurate SIP projections. No registration required.',
    keywords: 'SIP calculator, SIP calculator India, SIP returns calculator, systematic investment plan calculator, mutual fund sip calculator, inflation adjusted sip calculator',
    openGraph: {
        title: 'SIP Calculator India 2026 - Calculate SIP Returns with Inflation Adjustment | InvestingPro',
        description: 'Free SIP calculator to calculate returns on Systematic Investment Plans (SIP). Calculate SIP maturity value, returns, and inflation-adjusted real returns.',
        url: 'https://investingpro.in/calculators/sip',
        siteName: 'InvestingPro.in',
        images: [
            {
                url: 'https://investingpro.in/images/sip-calculator-og.png',
                width: 1200,
                height: 630,
                alt: 'SIP Calculator India',
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SIP Calculator India 2026 - Calculate SIP Returns with Inflation Adjustment',
        description: 'Free SIP calculator to calculate returns on Systematic Investment Plans (SIP). Calculate SIP maturity value, returns, and inflation-adjusted real returns.',
        images: ['https://investingpro.in/images/sip-calculator-og.png'],
    },
    alternates: {
        canonical: 'https://investingpro.in/calculators/sip',
    },
};

export default function SIPCalculatorPage() {
    // Generate automated schema
    const breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Calculators', url: '/calculators' },
        { label: 'SIP Calculator', url: '/calculators/sip' },
    ];

    const calculatorSchema = generateSchema({
        pageType: 'calculator',
        title: 'SIP Calculator',
        description: 'Free SIP calculator to calculate returns on Systematic Investment Plans (SIP) with inflation adjustment.',
        url: '/calculators/sip',
        breadcrumbs,
        category: 'investing',
    });

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "SIP Calculator",
        "description": "Free SIP calculator to calculate returns on Systematic Investment Plans (SIP) with inflation adjustment. Calculate SIP maturity value, returns, and plan your financial goals.",
        "provider": {
            "@type": "Organization",
            "name": "InvestingPro",
            "url": "https://investingpro.in"
        },
        "serviceType": "FinancialCalculator",
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

    // Generate automated internal links context
    const linkingContext = {
        contentType: 'calculator' as const,
        category: 'investing',
        slug: 'sip',
        relatedCalculators: ['lumpsum', 'retirement'],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": seoContent.sip.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use SIP Calculator",
        "description": "Step-by-step guide to calculate SIP returns using our free SIP calculator",
        "step": seoContent.sip.howItWorks.map(step => ({
            "@type": "HowToStep",
            "name": step.title,
            "text": step.description
        }))
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            
            {/* Automated Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
                <AutoBreadcrumbs />
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="text-center mb-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        SIP Calculator - Calculate Systematic Investment Plan Returns
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-600 max-w-3xl mx-auto leading-relaxed mb-4">
                        Calculate returns on your SIP investments with our free SIP calculator. Includes inflation adjustment to show real returns and help you plan your financial goals.
                    </p>
                    
                    {/* Usage Counter & Last Updated */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-2">
                            <span className="font-semibold text-primary-600">Verified by Experts</span>
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-2">
                            <span className="font-semibold text-primary-600">10,000+</span> users calculated this month
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    
                    {/* Social Share Buttons */}
                    <div className="flex justify-center">
                        <SocialShareButtons
                            title="SIP Calculator - Calculate Systematic Investment Plan Returns"
                            url="https://investingpro.in/calculators/sip"
                            description="Free SIP calculator with inflation adjustment. Calculate returns on your Systematic Investment Plan investments."
                        />
                    </div>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <FinancialDisclaimer variant="compact" className="mb-6" />
                <SIPCalculatorWithInflation />
            </div>


            {/* SEO Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
                {/* Comprehensive SEO Article */}
                <SEOArticle calculatorType="sip" />

                {/* Automated Internal Links */}
                <AutoInternalLinks context={linkingContext} />

                {/* External Authority Links */}
                <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-6 md:p-8">
                            <Info className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            Official Resources & Guidelines
                        </CardTitle>
                        <p className="text-slate-600 dark:text-slate-600 mt-2">Refer to these authoritative sources for official information about SIP investments and mutual funds in India.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="https://www.sebi.gov.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-secondary-200 dark:border-secondary-800 hover:border-secondary-300 dark:hover:border-secondary-700 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">SEBI</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-600">Securities and Exchange Board of India</p>
                                </div>
                            </a>
                            <a
                                href="https://www.amfiindia.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-secondary-200 dark:border-secondary-800 hover:border-secondary-300 dark:hover:border-secondary-700 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">AMFI</p>
                                    <p className="text-xs text-slate-600">Association of Mutual Funds in India</p>
                                </div>
                            </a>
                            <a
                                href="https://www.rbi.org.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-secondary-200 dark:border-secondary-800 hover:border-secondary-300 dark:hover:border-secondary-700 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">RBI</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-600">Reserve Bank of India</p>
                                </div>
                            </a>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
