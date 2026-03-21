"use client";


import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { SCSSCalculator } from "@/components/calculators/SCSSCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function SCSSCalculatorPage() {
    const faqs = [
        {
            question: "What is Senior Citizen Savings Scheme (SCSS)?",
            answer: "The Senior Citizen Savings Scheme (SCSS) is a government-backed retirement benefits program. It allows senior citizens to invest a lump sum amount and earn regular quarterly interest income."
        },
        {
            question: "Who is eligible for SCSS?",
            answer: "An individual who has attained the age of 60 years or above is eligible. Retired civilian employees above 55 years and retired defense employees above 50 years are also eligible, subject to certain conditions."
        },
        {
            question: "What is the current SCSS interest rate?",
            answer: "As of Q4 FY 2025-26, the interest rate for SCSS is 8.2% per annum. The interest is paid on a quarterly basis on the 1st working day of April, July, October, and January."
        },
        {
            question: "What is the investment limit for SCSS?",
            answer: "The minimum investment is ₹1,000 and the maximum limit is ₹30 Lakhs. The investment must be in multiples of ₹1,000."
        },
        {
            question: "Does SCSS offer tax benefits?",
            answer: "Yes, investment in SCSS qualifies for tax deduction under Section 80C of the Income Tax Act, up to a limit of ₹1.5 Lakh per financial year. However, the interest earned is fully taxable."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="SCSS Calculator 2026 - Senior Citizen Savings Scheme Interest Calculator | InvestingPro"
                description="Calculate quarterly interest income from SCSS. Current interest rate 8.2%. Perfect for senior citizens looking for regular income."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="SCSS Calculator"
                description="Calculate Senior Citizen Savings Scheme quarterly interest payouts"
                url="/calculators/scss"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "SCSS Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        SCSS Calculator
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Plan your retirement income with the Senior Citizen Savings Scheme. Calculate your quarterly interest payouts instantly.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <SCSSCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            SCSS FAQs
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
                    title="SCSS Calculator - Senior Citizens Savings Scheme | InvestingPro"
                    url="https://investingpro.in/calculators/scss"
                    description="Free scss calculator - senior citizens savings scheme - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}