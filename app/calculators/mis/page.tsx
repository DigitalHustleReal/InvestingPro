"use client";


import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { MISCalculator } from "@/components/calculators/MISCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function MISCalculatorPage() {
    const faqs = [
        {
            question: "What is Post Office MIS (Monthly Income Scheme)?",
            answer: "Post Office Monthly Income Scheme (MIS) is a small savings scheme backed by the Government of India that offers guaranteed monthly income on your investment. It is a low-risk investment option with a fixed tenure of 5 years."
        },
        {
            question: "What is the current MIS interest rate?",
            answer: "As of Q4 FY 2025-26, the interest rate for Post Office MIS is 7.4% per annum. The interest is calculated annually but paid monthly to the investor."
        },
        {
            question: "What is the maximum investment limit in MIS?",
            answer: "The maximum investment limit is ₹9 Lakhs for a single account and ₹15 Lakhs for a joint account."
        },
        {
            question: "Is MIS interest taxable?",
            answer: "Yes, the monthly interest earned from MIS is added to your taxable income and taxed as per your income tax slab. There is no TDS deducted on MIS interest, but it is not tax-free."
        },
        {
            question: "Can I open a joint MIS account?",
            answer: "Yes, a joint account can be opened by up to 3 adults. However, the maximum investment limit for a joint account remains ₹15 Lakhs in total, regardless of the number of holders."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <SEOHead
                title="Post Office MIS Calculator 2026 - Monthly Income Scheme Calculator | InvestingPro"
                description="Calculate your monthly income from Post Office MIS Scheme. Current Interest Rate 7.4%. Check limit for Single vs Joint Accounts."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="MIS Calculator"
                description="Calculate Post Office Monthly Income Scheme payouts"
                url="/calculators/mis"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "MIS Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="font-display font-black text-[36px] sm:text-[48px] lg:text-[56px] text-ink dark:text-white mb-4 leading-[1.05] tracking-tight">
                        Post Office MIS Calculator
                    </h1>
                    <p className="text-xl text-ink-60 dark:text-ink-60 max-w-3xl mx-auto leading-relaxed">
                        Calculate guaranteed monthly income from the Post Office Monthly Income Scheme.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <MISCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-display font-bold text-ink dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            MIS FAQs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0">
                                    <h3 className="font-display font-bold text-ink dark:text-white mb-2 text-lg flex items-start gap-3">
                                        <span className="text-primary-600 font-bold">Q{idx + 1}.</span>
                                        <span>{faq.question}</span>
                                    </h3>
                                    <p className="text-ink-60 dark:text-ink-60 leading-relaxed ml-8">
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
                    title="Post Office MIS Calculator - Monthly Income Scheme | InvestingPro"
                    url="https://investingpro.in/calculators/mis"
                    description="Free post office mis calculator - monthly income scheme - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}