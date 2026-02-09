"use client";


import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { NSCCalculator } from "@/components/calculators/NSCCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function NSCCalculatorPage() {
    const faqs = [
        {
            question: "What is National Savings Certificate (NSC)?",
            answer: "NSC is a fixed-income investment scheme that you can open with any Post Office. It is a Government of India initiative to encourage small savings in the country. It comes with a fixed maturity period of 5 years."
        },
        {
            question: "What is the current NSC interest rate?",
            answer: "As of Q4 FY 2025-26, the interest rate for NSC (VIII Issue) is 7.7% per annum. The interest is compounded annually but payable at maturity. The Government revises the interest rates every quarter."
        },
        {
            question: "Is NSC interest taxable?",
            answer: "The interest earned on NSC is taxable under 'Income from Other Sources'. However, the interest earned for the first 4 years is deemed to be reinvested and hence qualifies for tax deduction under Section 80C (within the ₹1.5 Lakh limit). The interest earned in the 5th year is fully taxable."
        },
        {
            question: "What is the minimum and maximum investment?",
            answer: "The minimum investment amount is ₹1,000. There is no maximum limit for investment in NSC. You can invest any amount in multiples of ₹100."
        },
        {
            question: "Can I withdraw NSC before maturity?",
            answer: "Premature withdrawal from NSC is generally not allowed before the 5-year maturity period, except in specific cases like the death of the holder or a court order."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="NSC Calculator 2026 - National Savings Certificate Interest Calculator | InvestingPro"
                description="Calculate NSC maturity amount and interest earned. Current NSC Interest Rate 7.7%. 5-Year Lock-in with 80C Tax Benefits."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="NSC Calculator"
                description="Calculate National Savings Certificate maturity amount and tax-saving interest"
                url="/calculators/nsc"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "NSC Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        NSC Calculator - National Savings Certificate
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Calculate returns on your National Savings Certificate. Determine maturity value and interest accrued over the 5-year tenure.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <NSCCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            NSC Frequently Asked Questions
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
