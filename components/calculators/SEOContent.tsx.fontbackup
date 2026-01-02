"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Info, TrendingUp, ShieldCheck, Calculator, ArrowRight } from "lucide-react";
import Link from 'next/link';

interface SEOContentProps {
    calculatorType: 'sip' | 'swp' | 'lumpsum' | 'fd' | 'emi' | 'tax' | 'retirement' | 'inflation' | 'ppf' | 'nps' | 'goal';
}

const seoContent = {
    sip: {
        title: "SIP Calculator India - Calculate SIP Returns with Inflation Adjustment",
        h1: "SIP Calculator - Calculate Systematic Investment Plan Returns Online",
        intro: "Use our free SIP calculator to calculate returns on your Systematic Investment Plan (SIP) investments. Our advanced SIP calculator includes inflation adjustment to show real returns, helping you make informed investment decisions for your financial goals.",
        benefits: [
            "Calculate SIP returns with accurate compound interest formula",
            "View inflation-adjusted real returns for better planning",
            "Compare multiple SIP scenarios side-by-side",
            "Plan your financial goals with SIP investment calculator",
            "Free SIP calculator with no registration required"
        ],
        howItWorks: [
            {
                step: "1",
                title: "Enter Monthly SIP Amount",
                description: "Input your monthly SIP investment amount (minimum ₹500). You can invest any amount from ₹500 to ₹1,00,000 per month."
            },
            {
                step: "2",
                title: "Set Investment Period",
                description: "Choose your investment tenure from 1 year to 30 years. Longer investment periods typically yield higher returns due to compounding."
            },
            {
                step: "3",
                title: "Expected Return Rate",
                description: "Enter expected annual return rate (typically 10-15% for equity mutual funds). Our calculator uses compound interest formula for accurate calculations."
            },
            {
                step: "4",
                title: "View Results",
                description: "Get instant results showing total invested amount, returns earned, and maturity value. Enable inflation adjustment to see real purchasing power."
            }
        ],
        faqs: [
            {
                q: "How does SIP calculator work?",
                a: "SIP calculator uses compound interest formula to calculate future value of your monthly investments. Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r), where P is monthly investment, r is monthly return rate, and n is number of months."
            },
            {
                q: "What is the best SIP amount to invest?",
                a: "The best SIP amount depends on your financial goals, income, and risk tolerance. Generally, investing 20-30% of your monthly income in SIPs is recommended. Start with ₹5,000-10,000 per month and increase gradually."
            },
            {
                q: "How much SIP to invest for ₹1 crore?",
                a: "To accumulate ₹1 crore, you need to invest approximately ₹15,000-20,000 per month for 20 years at 12% annual return. Use our SIP calculator to find the exact amount based on your investment period and expected returns."
            },
            {
                q: "Is SIP calculator accurate?",
                a: "Yes, our SIP calculator uses the standard compound interest formula used by mutual fund companies. However, actual returns may vary based on market conditions. The calculator provides estimates based on your expected return rate."
            },
            {
                q: "What is inflation-adjusted SIP calculator?",
                a: "Inflation-adjusted SIP calculator shows real returns after accounting for inflation. For example, if your SIP grows to ₹50 lakhs in 20 years but inflation is 6%, your real purchasing power would be equivalent to ₹15.6 lakhs today."
            }
        ],
        keywords: "SIP calculator, SIP calculator India, SIP returns calculator, SIP investment calculator, SIP maturity calculator, SIP calculator online, calculate SIP returns, SIP calculator with inflation, free SIP calculator, SIP calculator 2024"
    },
    swp: {
        title: "SWP Calculator - Systematic Withdrawal Plan Calculator India",
        h1: "SWP Calculator - Calculate Monthly Withdrawals from Your Investment",
        intro: "Use our free SWP (Systematic Withdrawal Plan) calculator to plan your monthly withdrawals from your investment corpus. Calculate how long your corpus will last, plan retirement withdrawals, and see the impact of inflation on your withdrawal amount.",
        benefits: [
            "Calculate monthly SWP withdrawals from your corpus",
            "Plan retirement income with systematic withdrawals",
            "See inflation-adjusted withdrawal amounts",
            "Check corpus sustainability and exhaustion timeline",
            "Free SWP calculator with detailed projections"
        ],
        howItWorks: [
            {
                step: "1",
                title: "Enter Initial Corpus",
                description: "Input your total investment corpus amount. This is the lump sum amount you want to withdraw from systematically."
            },
            {
                step: "2",
                title: "Set Monthly Withdrawal",
                description: "Enter the monthly withdrawal amount you need. This should be based on your monthly expenses and financial requirements."
            },
            {
                step: "3",
                title: "Expected Return Rate",
                description: "Enter expected annual return rate on your remaining corpus. Higher returns help sustain withdrawals longer."
            },
            {
                step: "4",
                title: "View Projection",
                description: "See how long your corpus will last, total amount withdrawn, and remaining corpus. Enable inflation adjustment for realistic planning."
            }
        ],
        faqs: [
            {
                q: "What is SWP calculator?",
                a: "SWP (Systematic Withdrawal Plan) calculator helps you calculate monthly withdrawals from your investment corpus while maintaining the remaining balance. It shows how long your corpus will last based on withdrawal amount and expected returns."
            },
            {
                q: "How much can I withdraw monthly from ₹1 crore?",
                a: "From ₹1 crore corpus, you can withdraw approximately ₹50,000-60,000 per month for 20 years at 12% annual return. Higher returns allow higher withdrawals. Use our SWP calculator to find the exact amount."
            },
            {
                q: "What is the safe withdrawal rate?",
                a: "The safe withdrawal rate is typically 4% of your corpus annually (about 0.33% monthly). This ensures your corpus lasts 25-30 years. However, Indian investors often withdraw 6-8% annually depending on returns."
            },
            {
                q: "Should I use SWP for retirement?",
                a: "Yes, SWP is ideal for retirement planning as it provides regular monthly income while keeping your corpus invested. It's better than withdrawing lump sum as it maintains growth potential."
            }
        ],
        keywords: "SWP calculator, systematic withdrawal plan calculator, SWP calculator India, retirement withdrawal calculator, monthly withdrawal calculator, SWP calculator online"
    },
    lumpsum: {
        title: "Lumpsum Calculator - Calculate One-Time Investment Returns",
        h1: "Lumpsum Investment Calculator - Calculate Returns on One-Time Investment",
        intro: "Calculate returns on your lumpsum (one-time) investment with our free lumpsum calculator. Plan your investment strategy, compare lumpsum vs SIP, and see inflation-adjusted real returns for better financial planning.",
        benefits: [
            "Calculate returns on one-time investments",
            "Compare lumpsum vs SIP investment strategies",
            "View inflation-adjusted real returns",
            "Plan your investment goals with lumpsum calculator",
            "Free lumpsum calculator with detailed projections"
        ],
        keywords: "lumpsum calculator, lumpsum investment calculator, one-time investment calculator, lumpsum returns calculator, lumpsum calculator India"
    },
    fd: {
        title: "FD Calculator - Fixed Deposit Calculator India 2024",
        h1: "Fixed Deposit Calculator - Calculate FD Maturity Amount & Interest",
        intro: "Calculate Fixed Deposit (FD) maturity amount and interest earned with our free FD calculator. Compare quarterly, monthly, and annual compounding frequencies, see inflation-adjusted returns, and find the best FD rates in India.",
        benefits: [
            "Calculate FD maturity amount accurately",
            "Compare compounding frequencies (quarterly, monthly, annual)",
            "See inflation-adjusted real returns",
            "Find best FD rates from top banks",
            "Free FD calculator with tax calculations"
        ],
        keywords: "FD calculator, fixed deposit calculator, FD calculator India, FD interest calculator, FD maturity calculator, best FD calculator"
    },
    emi: {
        title: "EMI Calculator - Home Loan, Car Loan, Personal Loan EMI Calculator",
        h1: "EMI Calculator - Calculate Loan EMI Online",
        intro: "Calculate your loan EMI (Equated Monthly Installment) for home loans, car loans, personal loans, and education loans. Our EMI calculator shows principal vs interest breakdown, total interest paid, and amortization schedule.",
        benefits: [
            "Calculate EMI for all types of loans",
            "See principal vs interest breakdown",
            "View detailed amortization schedule",
            "Compare multiple loan offers",
            "Free EMI calculator with prepayment options"
        ],
        keywords: "EMI calculator, loan EMI calculator, home loan EMI calculator, car loan EMI calculator, personal loan EMI calculator, EMI calculator India"
    },
    tax: {
        title: "Income Tax Calculator India 2024-25 - Old vs New Tax Regime",
        h1: "Income Tax Calculator - Calculate Income Tax for FY 2024-25",
        intro: "Calculate your income tax for FY 2024-25 using our free income tax calculator. Compare old tax regime vs new tax regime, see tax savings, and find out which regime is better for you.",
        benefits: [
            "Calculate income tax for FY 2024-25",
            "Compare old vs new tax regime",
            "See tax savings with deductions",
            "Find best tax regime for your income",
            "Free tax calculator with detailed breakdown"
        ],
        keywords: "income tax calculator, tax calculator India, income tax calculator 2024-25, old vs new tax regime calculator, tax calculator online"
    },
    retirement: {
        title: "Retirement Calculator India - Plan Your Retirement Corpus",
        h1: "Retirement Calculator - Calculate Retirement Corpus Required",
        intro: "Plan your retirement with our comprehensive retirement calculator. Calculate retirement corpus required, see if you're on track, find shortfall or surplus, and plan your SIP investments to achieve your retirement goals.",
        benefits: [
            "Calculate retirement corpus required",
            "See if you're on track for retirement",
            "Find shortfall or surplus in retirement planning",
            "Plan SIP investments for retirement",
            "Free retirement calculator with inflation adjustment"
        ],
        keywords: "retirement calculator, retirement planning calculator, retirement corpus calculator, retirement calculator India, how much to save for retirement"
    },
    inflation: {
        title: "Inflation Calculator - Calculate Real Returns After Inflation",
        h1: "Inflation-Adjusted Returns Calculator - Calculate Real Returns",
        intro: "Calculate real returns on your investments after accounting for inflation. Our inflation calculator shows nominal vs real value, inflation erosion, and helps you understand the true purchasing power of your investments.",
        benefits: [
            "Calculate real returns after inflation",
            "See inflation impact on your investments",
            "Compare nominal vs real value",
            "Plan investments considering inflation",
            "Free inflation calculator with projections"
        ],
        keywords: "inflation calculator, inflation-adjusted returns calculator, real returns calculator, inflation impact calculator, purchasing power calculator"
    },
    ppf: {
        title: "PPF Calculator - Public Provident Fund Calculator India",
        h1: "PPF Calculator - Calculate PPF Maturity Amount",
        intro: "Calculate Public Provident Fund (PPF) maturity amount with our free PPF calculator. Plan your PPF investments, see maturity value, and understand tax benefits under Section 80C.",
        benefits: [
            "Calculate PPF maturity amount",
            "Plan PPF investments for 15 years",
            "See tax benefits under 80C",
            "Compare PPF with other investments",
            "Free PPF calculator with tax calculations"
        ],
        keywords: "PPF calculator, public provident fund calculator, PPF calculator India, PPF maturity calculator, PPF interest calculator"
    },
    nps: {
        title: "NPS Calculator - National Pension System Calculator India",
        h1: "NPS Calculator - Calculate NPS Corpus at Retirement",
        intro: "Calculate your National Pension System (NPS) corpus at retirement with our free NPS calculator. Plan your NPS contributions, see retirement corpus, and understand withdrawal rules (60% withdrawable, 40% annuitized).",
        benefits: [
            "Calculate NPS corpus at retirement",
            "Plan monthly NPS contributions",
            "See tax benefits under 80CCD",
            "Understand NPS withdrawal rules",
            "Free NPS calculator with projections"
        ],
        keywords: "NPS calculator, national pension system calculator, NPS calculator India, NPS retirement calculator, NPS corpus calculator"
    },
    goal: {
        title: "Goal Planning Calculator - Calculate SIP Required for Financial Goals",
        h1: "Goal Planning Calculator - Plan Your Financial Goals",
        intro: "Calculate required SIP amount to achieve your financial goals with our goal planning calculator. Plan for home purchase, children's education, retirement, or any financial goal.",
        benefits: [
            "Calculate SIP required for financial goals",
            "Plan multiple financial goals",
            "See goal progress over time",
            "Compare different SIP scenarios",
            "Free goal planning calculator"
        ],
        keywords: "goal planning calculator, financial goal calculator, SIP goal calculator, goal calculator India, financial planning calculator"
    }
};

export function SEOContent({ calculatorType }: SEOContentProps) {
    const content = seoContent[calculatorType];

    return (
        <div className="space-y-8 mt-12">
            {/* SEO-Optimized Introduction */}
            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-slate-50 to-white">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">{content.h1}</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">{content.intro}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <p className="text-slate-700 font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* How It Works Section */}
            {'howItWorks' in content && content.howItWorks && (
                <Card className="border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black text-slate-900">How to Use {content.title.split(' - ')[0]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {content.howItWorks.map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-2 top-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-sm">
                                        {step.step}
                                    </div>
                                    <div className="pl-6">
                                        <h3 className="font-black text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* FAQ Section */}
            {'faqs' in content && content.faqs && (
                <Card className="border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Info className="w-6 h-6 text-teal-600" />
                            Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {content.faqs.map((faq, idx) => (
                                <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-slate-200">
                                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-teal-600">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 leading-relaxed pt-2">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            {/* Related Calculators */}
            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50">
                <CardHeader>
                    <CardTitle className="text-2xl font-black text-slate-900">Related Calculators</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['EMI Calculator', 'FD Calculator', 'Tax Calculator', 'Retirement Calculator'].map((calc) => (
                            <Link
                                key={calc}
                                href={`/calculators?type=${calc.toLowerCase().replace(' ', '-')}`}
                                className="p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Calculator className="w-4 h-4 text-teal-600 group-hover:text-teal-700" />
                                    <span className="font-semibold text-slate-900 group-hover:text-teal-600">{calc}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SEO Keywords Meta (Hidden but for SEO) */}
            <div className="hidden">
                <p>{content.keywords}</p>
            </div>
        </div>
    );
}

