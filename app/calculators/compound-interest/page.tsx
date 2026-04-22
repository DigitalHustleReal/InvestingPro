"use client";


import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function CompoundInterestCalculatorPage() {
    const faqs = [
        {
            question: "What is Compound Interest?",
            answer: "Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. It is often referred to as 'interest on interest'."
        },
        {
            question: "What is the Compound Interest formula?",
            answer: "The formula is: A = P(1 + r/n)^(nt), where A is the future value, P is principal, r is the annual rate, n is the number of compounding periods per year, and t is the time in years."
        },
        {
            question: "Why is compounding powerful?",
            answer: "Compounding is powerful because your money grows exponentially over time. The interest you earn also starts earning interest, accelerating the growth of your wealth, especially over long periods."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <SEOHead
                title="Compound Interest Calculator - Power of Compounding | InvestingPro"
                description="Calculate compound interest with different frequencies (yearly, monthly, daily). Visualize the power of compounding growth."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="Compound Interest Calculator"
                description="Calculate Compound Interest growth over time"
                url="/calculators/compound-interest"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "Compound Interest" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="font-display font-black text-[36px] sm:text-[48px] lg:text-[56px] text-ink dark:text-white mb-4 leading-[1.05] tracking-tight">
                        Compound Interest Calculator
                    </h1>
                    <p className="text-xl text-ink-60 dark:text-ink-60 max-w-3xl mx-auto leading-relaxed">
                        See how your money grows exponentially with the power of compounding. Compare it with simple interest.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <CompoundInterestCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-display font-bold text-ink dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            Frequent Questions
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
                    title="Compound Interest Calculator India 2026 | InvestingPro"
                    url="https://investingpro.in/calculators/compound-interest"
                    description="Free compound interest calculator india 2026 - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}