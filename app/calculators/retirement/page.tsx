"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function RetirementCalculatorPage() {
    const faqs = [
        {
            question: "How much corpus do I need for retirement?",
            answer: "A general rule is to have 25-30 times your annual expenses as retirement corpus. For example, if your annual expenses are ₹10 lakhs, you need ₹2.5-3 crores. This assumes 4% withdrawal rate and accounts for inflation. Our calculator helps you determine the exact amount based on your lifestyle, age, and expected returns."
        },
        {
            question: "At what age should I start retirement planning?",
            answer: "Start as early as possible - ideally in your 20s or 30s. Starting at 25 vs 35 can make a difference of crores due to compounding. Even if you're in your 40s or 50s, it's not too late. The key is to start now and invest consistently. Earlier you start, smaller monthly investments needed to reach your goal."
        },
        {
            question: "What is the 4% withdrawal rule for retirement?",
            answer: "The 4% rule suggests withdrawing 4% of your retirement corpus annually, adjusted for inflation. For ₹1 crore corpus, withdraw ₹4 lakhs in year 1, then increase by inflation each year. This strategy aims to make your corpus last 30+ years. However, adjust based on your specific situation, returns, and life expectancy."
        },
        {
            question: "How to calculate retirement corpus with inflation?",
            answer: "Account for inflation to determine real purchasing power. If you need ₹50,000/month today and retire in 20 years at 6% inflation, you'll need ₹1.6 lakhs/month then. For 25 years post-retirement, you'll need approximately ₹6-7 crores. Our calculator does this automatically with inflation-adjusted projections."
        },
        {
            question: "What are the best investment options for retirement?",
            answer: "Diversify across: (1) Equity mutual funds for growth (12-15% returns), (2) PPF/EPF for safety (7-8%), (3) NPS for tax benefits (10-12%), (4) Fixed income for stability (6-8%). In your 20s-40s, keep 70-80% in equity. Gradually shift to debt as you near retirement. Maintain 40-50% equity even post-retirement for inflation protection."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <SEOHead
                title="Retirement Calculator India 2026 - Plan Your Retirement Corpus | InvestingPro"
                description="Free retirement planning calculator. Calculate retirement corpus needed, monthly SIP required, and post-retirement income. Plan your financial freedom with accurate projections."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="Retirement Calculator"
                description="Calculate retirement corpus requirements and monthly investment needed"
                url="/calculators/retirement"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "Retirement Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Retirement Planning Calculator
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Calculate how much you need for retirement and how to get there. Plan your financial independence with inflation-adjusted projections.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <RetirementCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            Retirement Calculator - Frequently Asked Questions
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
                    title="Retirement Calculator India - Plan Your Retirement | InvestingPro"
                    url="https://investingpro.in/calculators/retirement"
                    description="Free retirement calculator india - plan your retirement - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}