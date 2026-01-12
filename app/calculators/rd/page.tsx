import React from 'react';
import { Metadata } from 'next';
import { RDCalculator } from "@/components/calculators/RDCalculator";
import SEOHead from "@/components/common/SEOHead";
import { generateSchema } from '@/lib/linking/schema';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export const metadata: Metadata = {
    title: 'RD Calculator 2026 - Recurring Deposit Maturity Amount | InvestingPro',
    description: 'Calculate RD maturity amount with our free Recurring Deposit Calculator. Uses monthly quarterly compounding formula used by Indian banks (SBI, HDFC, ICICI).',
};

export default function RDCalculatorPage() {
    const breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Calculators', url: '/calculators' },
        { label: 'RD Calculator', url: '/calculators/rd' },
    ];

    const calculatorSchema = generateSchema({
        pageType: 'calculator',
        title: 'RD Calculator',
        description: 'Free Recurring Deposit (RD) calculator to calculate maturity amount with quarterly compounding interest.',
        url: '/calculators/rd',
        breadcrumbs,
        category: 'finance',
    });

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use RD Calculator",
        "description": "Step-by-step guide to calculate RD maturity amount",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Enter Monthly Deposit",
                "text": "Input the amount you can deposit every month."
            },
            {
                "@type": "HowToStep",
                "name": "Set Tenure",
                "text": "Choose the duration of your RD in years."
            },
            {
                "@type": "HowToStep",
                "name": "Enter Interest Rate",
                "text": "Input the annual interest rate offered by your bank."
            },
            {
                "@type": "HowToStep",
                "name": "Check Returns",
                "text": "View the total maturity value and interest earned."
            }
        ]
    };

    const financialServiceSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "RD Calculator",
        "description": "Calculate Recurring Deposit (RD) maturity amount. Supports quarterly compounding logic used by Indian banks.",
        "provider": {
            "@type": "Organization",
            "name": "InvestingPro",
            "url": "https://investingpro.in"
        },
        "serviceType": "FinancialCalculator",
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    const faqs = [
        {
            question: "How is RD interest calculated?",
            answer: "In India, banks calculate RD interest using the quarterly compounding formula. The formula is complex because each monthly instalment earns interest for a different duration (e.g., first instalment for N months, last for 1 month). Our calculator handles this accurately."
        },
        {
            question: "Is RD interest taxable?",
            answer: "Yes, interest earned on RD is fully taxable as per your income tax slab. TDS (Tax Deducted at Source) is deducted by banks if interest exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year."
        },
        {
            question: "Can I prematurely withdraw RD?",
            answer: "Yes, most banks allow premature withdrawal but may charge a penalty (usually 1% lower interest rate than applicable for the period the deposit remained with the bank)."
        },
        {
            question: "RD vs SIP - which is better?",
            answer: "RD offers guaranteed, safe returns (approx 6-7%) and is ideal for risk-averse investors. SIP (in Equity Mutual Funds) offers market-linked returns (historically 12-15%) but carries higher risk. For long-term goals (>5 years), SIP typically beats RD."
        }
    ];

    const structuredData = [
        calculatorSchema,
        generateBreadcrumbSchema(breadcrumbs),
        financialServiceSchema,
        howToSchema
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="RD Calculator 2026 - Recurring Deposit Maturity Amount | InvestingPro"
                description="Calculate RD maturity amount with our free Recurring Deposit Calculator. Uses monthly quarterly compounding formula used by Indian banks (SBI, HDFC, ICICI)."
                structuredData={structuredData}
                url="https://investingpro.in/calculators/rd"
            />

            <FAQSchema faqs={faqs} />

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
                <Breadcrumb items={breadcrumbs} />
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                    RD <span className="text-primary-600">Calculator</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
                    Calculate the maturity value of your Recurring Deposit (RD) with our accurate calculator. 
                    Uses quarterly compounding logic followed by SBI, HDFC, ICICI, and other Indian banks.
                </p>

                <RDCalculator />

                {/* Content Section */}
                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What is a Recurring Deposit?</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            A Recurring Deposit (RD) is a special kind of Term Deposit offered by banks which helps people with regular incomes to deposit a fixed amount every month into their Recurring Deposit account and earn interest at the rate applicable to Fixed Deposits.
                        </p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6">Key Features</h3>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                            <li><strong>Disciplined Savings:</strong> Helps in building a habit of saving small amounts monthly.</li>
                            <li><strong>Guaranteed Returns:</strong> Interest rates are fixed for the entire tenure.</li>
                            <li><strong>Flexible Tenure:</strong> Usually ranges from 6 months to 10 years.</li>
                            <li><strong>Loan Facility:</strong> You can avail a loan against your RD corpus.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
