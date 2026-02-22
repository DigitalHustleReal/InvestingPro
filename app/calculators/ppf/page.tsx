"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { PPFCalculator } from "@/components/calculators/PPFCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";


export default function PPFCalculatorPage() {
    const faqs = [
        {
            question: "What is PPF and how does it work?",
            answer: "Public Provident Fund (PPF) is a government-backed long-term savings scheme with tax benefits. It has a 15-year lock-in period (extendable in 5-year blocks), offers guaranteed returns (currently 7.1% p.a.), and provides triple tax exemption (EEE) - tax-free contributions, interest, and maturity amount."
        },
        {
            question: "What is the current PPF interest rate for 2026?",
            answer: "The PPF interest rate for Q4 FY 2025-26 (Jan-Mar 2026) is 7.1% per annum, compounded annually. The government reviews and announces PPF rates quarterly. Historical rates have ranged from 7.1% to 8.7% over the past decade."
        },
        {
            question: "What is the minimum and maximum PPF investment?",
            answer: "Minimum annual investment: ₹500. Maximum annual investment: ₹1.5 lakh. You can deposit in lump sum or up to 12 installments per year. Deposits made before 5th of month earn interest for that month. Maximum limit is per individual, not per account."
        },
        {
            question: "Can I withdraw money from PPF before maturity?",
            answer: "Partial withdrawals are allowed from 7th year onwards (up to 50% of balance at end of 4th year). Premature closure is allowed after 5 years for specific reasons (medical emergency, higher education). Loans against PPF are available from 3rd to 6th year at 1% above PPF rate."
        },
        {
            question: "Is PPF better than FD or mutual funds?",
            answer: "PPF offers guaranteed returns with complete tax exemption, making it ideal for risk-averse investors. FDs offer liquidity but taxable returns. Mutual funds offer higher potential returns (12-15%) but with market risk. PPF is best for long-term goals with assured returns and tax savings under Section 80C."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="PPF Calculator India 2026 - Public Provident Fund Maturity Calculator | InvestingPro"
                description="Free PPF calculator for 2026. Calculate PPF maturity amount, interest earned, and returns. Current PPF rate 7.1%. Plan your PPF investments with accurate projections."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="PPF Calculator"
                description="Calculate PPF maturity amount and returns with current interest rates"
                url="/calculators/ppf"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "PPF Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        PPF Calculator - Public Provident Fund
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Calculate your PPF maturity amount and returns. Current interest rate: 7.1% p.a. Plan your long-term savings with guaranteed returns.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <FinancialDisclaimer variant="compact" className="mb-6" />
                <PPFCalculator />
            </div>


            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            PPF Calculator - Frequently Asked Questions
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
                                    <p className="text-slate-600 dark:text-slate-600 leading-relaxed ml-8">
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
