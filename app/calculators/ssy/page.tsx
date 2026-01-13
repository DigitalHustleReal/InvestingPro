"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { SSYCalculator } from "@/components/calculators/SSYCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function SSYCalculatorPage() {
    const faqs = [
        {
            question: "What is the SSY interest rate for 2026?",
            answer: "The current interest rate for Sukanya Samriddhi Yojana (SSY) is 8.2% per annum (as of Q4 FY 2024-25). The government reviews this rate quarterly. It is historically one of the highest-paying small savings schemes."
        },
        {
            question: "What are the SSY maturity rules?",
            answer: "An SSY account matures 21 years after the date of account opening. However, deposits are only required for the first 15 years. Partial withdrawal (up to 50%) is allowed for the girl's higher education after she turns 18. Premature closure is allowed for marriage after she turns 18."
        },
        {
            question: "What is the minimum and maximum deposit limit?",
            answer: "The minimum annual deposit is ₹250, and the maximum is ₹1.5 Lakh per financial year. You must deposit at least ₹250 every year to keep the account active. If you miss a deposit, you can reactivate the account by paying a penalty of ₹50."
        },
        {
            question: "How does the tax benefit work?",
            answer: "SSY falls under the EEE (Exempt-Exempt-Exempt) category. \n1. Investment: Tax deduction under Section 80C (up to ₹1.5L).\n2. Interest: The interest earned is tax-free.\n3. Maturity: The final maturity amount is also completely tax-free."
        },
        {
            question: "Can I open an SSY account for my daughter?",
            answer: "Yes, you can open an SSY account for a girl child below 10 years of age. A family can open a maximum of 2 SSY accounts (for 2 daughters). In case of twins/triplets, exceptions are made to allow more than 2 accounts."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="SSY Calculator 2026 - Sukanya Samriddhi Yojana Maturity Amount | InvestingPro"
                description="Calculate Sukanya Samriddhi Yojana (SSY) maturity amount. Current Interest Rate 8.2%. Tax-free returns calculator for girl child's future planning."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="SSY Calculator"
                description="Calculate SSY maturity amount and interest with current 8.2% interest rate"
                url="/calculators/ssy"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "SSY Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        SSY Calculator - Sukanya Samriddhi Yojana
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Secure your daughter's future with the highest government interest rate (8.2%). Calculate tax-free maturity returns accurately.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <SSYCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            SSY Calculator - Frequently Asked Questions
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
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed ml-8 whitespace-pre-line">
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
