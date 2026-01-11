"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { LumpsumCalculatorWithInflation } from "@/components/calculators/LumpsumCalculatorWithInflation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function LumpsumCalculatorPage() {
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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Lumpsum Calculator India 2026 - Calculate One-Time Investment Returns | InvestingPro"
                description="Free lumpsum investment calculator with inflation adjustment. Calculate returns on one-time investments in mutual funds. Compare lumpsum vs SIP returns."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="Lumpsum Calculator"
                description="Calculate returns on one-time lumpsum investments with inflation adjustment"
                url="/calculators/lumpsum"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

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
