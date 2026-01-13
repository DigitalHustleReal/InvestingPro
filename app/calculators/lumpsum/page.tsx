"use client";

import Link from 'next/link';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { generateSchema } from '@/lib/linking/schema';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { LumpsumCalculatorWithInflation } from "@/components/calculators/LumpsumCalculatorWithInflation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Info, TrendingUp, Zap, CheckCircle2 } from "lucide-react";

export default function LumpsumCalculatorPage() {
    const breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Calculators', url: '/calculators' },
        { label: 'Lumpsum Calculator', url: '/calculators/lumpsum' },
    ];

    const calculatorSchema = generateSchema({
        pageType: 'calculator',
        title: 'Lumpsum Calculator',
        description: 'Free lumpsum investment calculator to calculate returns on one-time investments with inflation adjustment.',
        url: '/calculators/lumpsum',
        breadcrumbs,
        category: 'investing',
    });

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use Lumpsum Calculator",
        "description": "Step-by-step guide to calculate returns on your one-time investment using our free Lumpsum Calculator",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Enter Investment Amount",
                "text": "Input your total one-time investment amount (minimum ₹500)."
            },
            {
                "@type": "HowToStep",
                "name": "Set Investment Period",
                "text": "Choose your investment duration in years. Longer durations benefit more from compounding."
            },
            {
                "@type": "HowToStep",
                "name": "Expected Return Rate",
                "text": "Enter the expected annual return rate (typically 12-15% for equity mutual funds)."
            },
            {
                "@type": "HowToStep",
                "name": "Analyze Results",
                "text": "View your total projected value and returns. Use the inflation toggle to see real purchasing power."
            }
        ]
    };

    const financialServiceSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "Lumpsum Calculator",
        "description": "Free lumpsum investment calculator to calculate returns on one-time investments with inflation adjustment. Calculate maturity value and real returns.",
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

    const faqs = [
        {
            question: "What is lumpsum investment?",
            answer: "Lumpsum investment means investing a large amount of money in one go, rather than investing small amounts periodically. It's ideal when you have a significant corpus available (bonus, inheritance, sale proceeds) and want to invest it all at once in mutual funds or other investment instruments."
        },
        {
            question: "Lumpsum vs SIP - which is better?",
            answer: "Both have advantages. Lumpsum can give higher returns if invested at the right time (market lows), but carries timing risk. SIP averages out market volatility through rupee cost averaging and is better for regular investors. If you have a large corpus and market is at reasonable valuations, lumpsum works well. For regular income earners, SIP is more suitable."
        },
        {
            question: "How to calculate lumpsum returns?",
            answer: "Lumpsum returns are calculated using compound interest formula: FV = PV × (1 + r)^n, where FV is future value, PV is present value (investment amount), r is annual return rate, and n is number of years. Our calculator does this automatically and also shows inflation-adjusted returns."
        },
        {
            question: "What is a good return rate for lumpsum investment?",
            answer: "Expected returns depend on asset class. Equity mutual funds historically return 12-15% annually over 10+ years. Large-cap funds: 10-12%, Mid-cap: 12-15%, Small-cap: 15-18% (with higher volatility). Debt funds: 6-8%. Balanced funds: 10-12%. Use conservative estimates (10-12% for equity) when planning."
        },
        {
            question: "When is the best time for lumpsum investment?",
            answer: "Best time is when markets are at reasonable valuations or during corrections/crashes. However, timing the market is difficult. If you have a long investment horizon (10+ years), market timing matters less due to compounding. Alternatively, use Systematic Transfer Plan (STP) to gradually move lumpsum from debt to equity over 6-12 months."
        }
    ];

    const structuredData = [
        calculatorSchema,
        generateBreadcrumbSchema(breadcrumbs),
        financialServiceSchema,
        howToSchema
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Lumpsum Calculator India 2026 - Calculate One-Time Investment Returns | InvestingPro"
                description="Free lumpsum investment calculator with inflation adjustment. Calculate returns on one-time investments in mutual funds. Compare lumpsum vs SIP returns."
                structuredData={structuredData}
                url="https://investingpro.in/calculators/lumpsum"
            />

            {/* Schema Markup */}
            <FAQSchema faqs={faqs} />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "Lumpsum Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Lumpsum Investment Calculator
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Calculate returns on one-time lumpsum investments with inflation adjustment. Plan your investment goals with accurate projections.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <LumpsumCalculatorWithInflation />
            </div>

            {/* Comprehensive Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-12">
                {/* What is Lumpsum Section */}
                <Card className="border-0 shadow-lg rounded-2xl bg-white dark:bg-slate-900">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">What is Lumpsum Investment?</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed">
                            A <strong>Lumpsum Investment</strong> is when you invest a significant amount of money in a mutual fund scheme in one go. It is the opposite of SIP (Systematic Investment Plan). Lumpsum investments are typically made when you receive a large sum of money, such as a bonus, inheritance, or proceeds from property sale.
                        </p>
                        <p className="text-lg leading-relaxed">
                            The power of lumpsum investing lies in <strong>immediate capital deployment</strong>. Since the entire amount is invested from Day 1, the power of compounding starts working on the full corpus immediately, which can lead to higher absolute returns over long periods compared to staggering investments.
                        </p>
                    </CardContent>
                </Card>

                {/* Key Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
                                <TrendingUp className="w-5 h-5" />
                                Power of Compounding
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-300">
                                Your entire capital starts earning returns from the very first day. Over 10-15 years, this head start can create a massive difference in final corpus value.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-teal-50 to-white dark:from-slate-800 dark:to-slate-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-teal-700 dark:text-teal-400">
                                <Zap className="w-5 h-5" />
                                Convenience
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-300">
                                It's a one-time transaction. You don't need to worry about maintaining monthly bank balances or tracking mandated deduction dates like in SIPs.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-purple-700 dark:text-purple-400">
                                <CheckCircle2 className="w-5 h-5" />
                                Ideal for Windfalls
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-300">
                                Best way to deploy annual bonuses, gifts, or maturity proceeds from other investments to ensure they don't get spent on unnecessary expenses.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Lumpsum vs SIP Comparison Table */}
                <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Lumpsum vs SIP: Which is Better?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <th className="p-4 font-bold text-slate-900 dark:text-white w-1/3">Feature</th>
                                        <th className="p-4 font-bold text-primary-700 dark:text-primary-400 w-1/3">Lumpsum Investment</th>
                                        <th className="p-4 font-bold text-teal-700 dark:text-teal-400 w-1/3">SIP Investment</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600 dark:text-slate-300">
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">Market Timing</td>
                                        <td className="p-4">Crucial. Best done when markets are low.</td>
                                        <td className="p-4">Not relevant. Works in all market conditions.</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">Risk Profile</td>
                                        <td className="p-4">Higher short-term risk due to market volatility.</td>
                                        <td className="p-4">Lower risk due to Rupee Cost Averaging.</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">Ideal For</td>
                                        <td className="p-4">Investors with large surplus cash.</td>
                                        <td className="p-4">Salaried individuals with monthly savings.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">Performance</td>
                                        <td className="p-4">Can outperform SIP in rising markets.</td>
                                        <td className="p-4">Performs well in volatile/falling markets.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            Lumpsum Calculator - Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border-b border-slate-200 dark:border-slate-800 pb-6 last:border-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg flex items-start gap-3">
                                        <span className="text-primary-600 font-bold">Q{idx + 1}.</span>
                                        <span>{faq.question}</span>
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed ml-8">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
