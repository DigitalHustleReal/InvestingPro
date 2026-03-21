"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { GoalPlanningCalculator } from "@/components/calculators/GoalPlanningCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function GoalPlanningCalculatorPage() {
    const faqs = [
        {
            question: "What is goal-based financial planning?",
            answer: "Goal-based planning means identifying specific financial goals (house, car, education, retirement) and creating investment plans to achieve them. Instead of random investing, you calculate how much to invest monthly/yearly to reach each goal by its target date, accounting for inflation and expected returns."
        },
        {
            question: "How to set realistic financial goals?",
            answer: "Follow SMART criteria: Specific (₹50L house), Measurable (track progress), Achievable (based on income), Relevant (aligns with priorities), Time-bound (in 10 years). Prioritize goals as short-term (<3 years), medium-term (3-7 years), long-term (>7 years). Account for inflation - ₹50L house today may cost ₹90L in 10 years at 6% inflation."
        },
        {
            question: "How much should I invest for my child's education?",
            answer: "Education costs inflate at 8-10% annually. For undergraduate degree costing ₹20L today, you'll need ₹40-50L in 15 years. For foreign education (₹50L today), you'll need ₹1-1.5Cr in 15 years. Start SIP early - ₹10,000/month for 15 years at 12% return gives ₹50L. Use our calculator for precise planning."
        },
        {
            question: "What investment options for different goal timelines?",
            answer: "Short-term (<3 years): Debt funds, FDs, liquid funds (6-8% returns). Medium-term (3-7 years): Balanced funds, debt funds (8-10%). Long-term (>7 years): Equity mutual funds, PPF, NPS (12-15%). Higher the timeline, more equity allocation for better inflation-beating returns. Shift to debt as goal approaches."
        },
        {
            question: "How to plan for multiple financial goals simultaneously?",
            answer: "Prioritize goals by urgency and importance. Allocate investments proportionally - e.g., 40% for retirement, 30% for child's education, 20% for house, 10% for emergency fund. Use separate SIPs for each goal. Review annually and rebalance. Start with high-priority goals if budget is limited, then add others as income grows."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Goal Planning Calculator India 2026 - Financial Goal Calculator | InvestingPro"
                description="Free goal planning calculator. Calculate investment needed for house, car, education, retirement goals. Plan multiple financial goals with SIP calculator."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="Goal Planning Calculator"
                description="Calculate investment required to achieve your financial goals"
                url="/calculators/goal-planning"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "Goal Planning Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Financial Goal Planning Calculator
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Plan your financial goals - house, car, education, retirement. Calculate how much to invest monthly to achieve your dreams.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <GoalPlanningCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            Goal Planning Calculator - Frequently Asked Questions
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

            {/* Share & Disclaimer */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <SocialShareButtons
                    title="Financial Goal Planning Calculator India | InvestingPro"
                    url="https://investingpro.in/calculators/goal-planning"
                    description="Free financial goal planning calculator india - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}