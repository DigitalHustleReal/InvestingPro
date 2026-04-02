"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { TaxCalculator } from "@/components/calculators/TaxCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function TaxCalculatorPage() {
    const faqs = [
        {
            question: "How to calculate income tax for FY 2025-26?",
            answer: "Use our tax calculator to calculate income tax for FY 2025-26 (AY 2026-27). Enter your income, deductions under Section 80C, 80D, and other sections. The calculator will show tax liability under both old and new tax regimes, helping you choose the better option."
        },
        {
            question: "Which tax regime is better - old or new?",
            answer: "The better tax regime depends on your deductions. If you have significant deductions (80C, HRA, home loan interest), the old regime might be better. If you have minimal deductions, the new regime with lower tax rates could save more. Our calculator compares both regimes automatically."
        },
        {
            question: "What is the new tax regime for FY 2025-26?",
            answer: "The new tax regime for FY 2025-26 offers lower tax rates but doesn't allow most deductions and exemptions. Tax slabs: 0-3 lakhs (nil), 3-6 lakhs (5%), 6-9 lakhs (10%), 9-12 lakhs (15%), 12-15 lakhs (20%), above 15 lakhs (30%). Standard deduction of ₹50,000 is allowed."
        },
        {
            question: "Is this tax calculator accurate?",
            answer: "Yes, our tax calculator uses official income tax slabs and rates as per the Income Tax Act for FY 2025-26. It calculates tax liability accurately for both old and new regimes. However, for complex cases with multiple income sources or special deductions, consult a tax professional."
        },
        {
            question: "Can I switch between old and new tax regime?",
            answer: "Yes, salaried individuals can switch between old and new tax regimes every year. However, if you have business income, you can switch only once in your lifetime. Choose the regime that minimizes your tax liability each year using our calculator."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <SEOHead
                title="Income Tax Calculator India 2026 - FY 2025-26 (AY 2026-27) | InvestingPro"
                description="Free income tax calculator for FY 2025-26. Calculate tax under old vs new regime. Compare tax liability, get accurate results for salary, deductions, and exemptions."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="Income Tax Calculator"
                description="Calculate income tax for FY 2025-26 under old and new tax regimes"
                url="/calculators/tax"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "Tax Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Income Tax Calculator FY 2025-26
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Calculate your income tax liability for FY 2025-26 (AY 2026-27). Compare old vs new tax regime and choose the best option.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <TaxCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            Tax Calculator - Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg flex items-start gap-3">
                                        <span className="text-primary-600 font-bold">Q{idx + 1}.</span>
                                        <span>{faq.question}</span>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-8">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Share & Disclaimer */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <SocialShareButtons
                    title="Income Tax Calculator India 2025-26 | InvestingPro"
                    url="https://investingpro.in/calculators/tax"
                    description="Free income tax calculator india 2025-26 - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}