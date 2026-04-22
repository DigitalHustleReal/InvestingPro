"use client";


import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { CalculatorSchema, FAQSchema, OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { KVPCalculator } from "@/components/calculators/KVPCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import FinancialDisclaimer from '@/components/legal/FinancialDisclaimer';
import SocialShareButtons from '@/components/common/SocialShareButtons';

export default function KVPCalculatorPage() {
    const faqs = [
        {
            question: "What is Kisan Vikas Patra (KVP)?",
            answer: "Kisan Vikas Patra (KVP) is a government-backed savings certificate scheme available at post offices and banks. Its primary feature is that it doubles your one-time investment over a specific period fixed by the government."
        },
        {
            question: "What is the current KVP doubling period?",
            answer: "As of Q4 FY 2025-26, the KVP interest rate is 7.5%, which means your money doubles in 115 months (9 years and 7 months)."
        },
        {
            question: "Is KVP taxable?",
            answer: "Yes, the interest earned on KVP is taxable. It is added to your annual income and taxed as per your income tax slab. Unlike SSY or PPF, KVP does not offer Section 80C tax deductions."
        },
        {
            question: "Can I encash KVP before maturity?",
            answer: "Yes, premature encashment is allowed after 2 years and 6 months (30 months) from the date of issue. Encashment is also allowed anytime in case of the death of the holder or by court order."
        },
        {
            question: "What is the minimum investment for KVP?",
            answer: "The minimum investment is ₹1,000, and you can invest in multiples of ₹100. There is no maximum limit on investment in KVP."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <SEOHead
                title="KVP Calculator 2026 - Kisan Vikas Patra Doubling Calculator | InvestingPro"
                description="Calculate KVP maturity date and amount. See when your money will double with current KVP 7.5% interest rate. Free Kisan Vikas Patra calculator."
            />

            {/* Schema Markup */}
            <CalculatorSchema
                name="KVP Calculator"
                description="Calculate Kisan Vikas Patra maturity doubling period"
                url="/calculators/kvp"
            />
            <FAQSchema faqs={faqs} />
            <OrganizationSchema />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                {/* Breadcrumb */}
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "KVP Calculator" }
                    ]} 
                />

                <div className="text-center mb-8 mt-6">
                    <h1 className="font-display font-black text-[36px] sm:text-[48px] lg:text-[56px] text-ink dark:text-white mb-4 leading-[1.05] tracking-tight">
                        KVP Calculator - Kisan Vikas Patra
                    </h1>
                    <p className="text-xl text-ink-60 dark:text-ink-60 max-w-3xl mx-auto leading-relaxed">
                        A government scheme that guarantees to double your money. Calculate exactly when your investment will mature.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <KVPCalculator />
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Card className="border-0 shadow-lg rounded-2xl dark:bg-gray-900 dark:border dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-display font-bold text-ink dark:text-white flex items-center gap-3">
                            <Info className="w-6 h-6 text-primary-600" />
                            KVP FAQs
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
                    title="KVP Calculator - Kisan Vikas Patra Returns | InvestingPro"
                    url="https://investingpro.in/calculators/kvp"
                    description="Free kvp calculator - kisan vikas patra returns - use this free tool from InvestingPro"
                />
                <FinancialDisclaimer variant="compact" className="mt-4" />
            </div>
        </div>
    );
}