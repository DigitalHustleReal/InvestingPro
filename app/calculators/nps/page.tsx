"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { NPSCalculator } from "@/components/calculators/NPSCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function NPSCalculatorPage() {
    const faqs = [
        {
            question: "What is NPS and how does it work?",
            answer: "National Pension System (NPS) is a government-sponsored pension scheme for retirement planning. You contribute regularly during working years, which is invested in equity, corporate bonds, and government securities. At retirement (60 years), you can withdraw 60% as lump sum (tax-free) and must use 40% to buy annuity for monthly pension."
        },
        {
            question: "What are NPS returns and charges?",
            answer: "NPS returns depend on asset allocation. Historical returns: Equity (E) - 12-14%, Corporate bonds (C) - 8-9%, Government securities (G) - 7-8%. Charges are very low: Fund management fee 0.01-0.09%, NPS Trust fee 0.005%. Total expense ratio is among the lowest in India, making NPS cost-effective for retirement planning."
        },
        {
            question: "What are the tax benefits of NPS?",
            answer: "NPS offers triple tax benefits: (1) Up to ₹1.5L deduction under Section 80C, (2) Additional ₹50,000 deduction under Section 80CCD(1B), (3) Employer contribution up to 10% of salary under Section 80CCD(2). Total tax saving potential: ₹2L+ annually. 60% lump sum withdrawal at maturity is tax-free."
        },
        {
            question: "Can I withdraw from NPS before retirement?",
            answer: "Partial withdrawals allowed after 3 years for specific needs (children's education, marriage, medical emergency, house purchase) - up to 25% of contributions, maximum 3 times. Premature exit allowed after 10 years with 80% going to annuity. Early exit before 10 years requires 80% annuity purchase."
        },
        {
            question: "NPS vs PPF vs EPF - which is better for retirement?",
            answer: "NPS offers highest potential returns (10-12%) with market-linked investments and lowest charges. PPF gives guaranteed 7.1% with complete safety. EPF offers 8.15% with employer contribution. NPS is best for long-term wealth creation, PPF for safety, EPF for salaried employees. Ideally, combine all three for diversified retirement planning."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="NPS Calculator India 2026 - National Pension System Calculator | InvestingPro"
                description="Free NPS calculator for retirement planning. Calculate NPS maturity amount, pension, and tax benefits. Plan your retirement corpus with NPS projections."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="NPS Calculator"
                description="Calculate NPS retirement corpus and monthly pension with tax benefits"
                url="/calculators/nps"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "NPS Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        NPS Calculator - National Pension System
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Calculate your NPS retirement corpus and monthly pension. Plan your retirement with tax-efficient NPS investments.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <NPSCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            NPS Calculator - Frequently Asked Questions
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
