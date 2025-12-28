"use client";

import React from 'react';
import Link from 'next/link';
import SEOHead from "@/components/common/SEOHead";
import { SWPCalculator } from "@/components/calculators/SWPCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { SEOArticle } from "@/components/calculators/SEOArticle";

export default function SWPCalculatorPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "SWP Calculator",
        "description": "Free SWP (Systematic Withdrawal Plan) calculator to plan monthly withdrawals from your investment corpus. Calculate how long your corpus will last and plan retirement income.",
        "provider": {
            "@type": "Organization",
            "name": "InvestingPro",
            "url": "https://investingpro.in"
        },
        "serviceType": "FinancialCalculator",
        "areaServed": { "@type": "Country", "name": "India" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is SWP calculator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SWP (Systematic Withdrawal Plan) calculator helps you calculate monthly withdrawals from your investment corpus while maintaining the remaining balance. It shows how long your corpus will last based on withdrawal amount and expected returns."
                }
            },
            {
                "@type": "Question",
                "name": "How much can I withdraw monthly from ₹1 crore?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "From ₹1 crore corpus, you can withdraw approximately ₹50,000-60,000 per month for 20 years at 12% annual return. Higher returns allow higher withdrawals. Use our SWP calculator to find the exact amount."
                }
            },
            {
                "@type": "Question",
                "name": "What is the safe withdrawal rate?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The safe withdrawal rate is typically 4% of your corpus annually (about 0.33% monthly). This ensures your corpus lasts 25-30 years. However, Indian investors often withdraw 6-8% annually depending on returns."
                }
            },
            {
                "@type": "Question",
                "name": "Should I use SWP for retirement?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, SWP is ideal for retirement planning as it provides regular monthly income while keeping your corpus invested. It's better than withdrawing lump sum as it maintains growth potential."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title="SWP Calculator India 2024 - Systematic Withdrawal Plan Calculator | InvestingPro"
                description="Free SWP calculator to calculate monthly withdrawals from your investment corpus. Plan retirement income, check corpus sustainability, and see inflation-adjusted withdrawal amounts. Calculate how long your corpus will last."
                structuredData={[structuredData, faqSchema]}
            />
            
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
                <nav className="flex items-center gap-2 text-sm text-slate-600">
                    <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/calculators" className="hover:text-teal-600 transition-colors">Calculators</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">SWP Calculator</span>
                </nav>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                        SWP Calculator - Systematic Withdrawal Plan Calculator
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Calculate monthly withdrawals from your investment corpus with our free SWP calculator. Plan retirement income, see corpus sustainability, and check how long your investments will last.
                    </p>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <SWPCalculator />
            </div>

            {/* SEO Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
                {/* Comprehensive SEO Article */}
                <SEOArticle calculatorType="swp" />

                {/* Expanded FAQ Section */}
                <Card className="border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Info className="w-6 h-6 text-teal-600" />
                            SWP Calculator - Frequently Asked Questions (FAQs)
                        </CardTitle>
                        <p className="text-slate-600 mt-2">Find answers to the most common questions about SWP calculator and systematic withdrawal plans</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                {
                                    q: "What is SWP calculator?",
                                    a: "SWP (Systematic Withdrawal Plan) calculator is an online financial tool that helps you calculate monthly withdrawals from your investment corpus while maintaining the remaining balance. It shows how long your corpus will last based on withdrawal amount, expected returns, and withdrawal period. SWP is ideal for retirees who need regular monthly income from their investments. The calculator provides month-by-month projections showing corpus sustainability and exhaustion timeline."
                                },
                                {
                                    q: "How much can I withdraw monthly from ₹1 crore?",
                                    a: "From ₹1 crore corpus, you can withdraw approximately ₹50,000-60,000 per month for 20 years at 12% annual return. For 15 years, you can withdraw ₹70,000-80,000 per month. For 25 years, withdraw ₹40,000-50,000 per month. Higher returns allow higher withdrawals. The exact amount depends on your expected returns and withdrawal period. Use our SWP calculator to find the precise amount based on your specific corpus, expected returns, and withdrawal period."
                                },
                                {
                                    q: "What is the safe withdrawal rate?",
                                    a: "The safe withdrawal rate is typically 4% of your corpus annually (about 0.33% monthly). This ensures your corpus lasts 25-30 years assuming 6-7% inflation-adjusted returns. However, Indian investors often withdraw 6-8% annually depending on returns and corpus size. Conservative approach suggests 4-5% for longer periods (25+ years), while 6-7% works for shorter periods (15-20 years). The rate depends on expected returns, inflation, and your risk tolerance."
                                },
                                {
                                    q: "Should I use SWP for retirement?",
                                    a: "Yes, SWP is ideal for retirement planning as it provides regular monthly income while keeping your corpus invested. It's better than withdrawing lump sum as it maintains growth potential. SWP helps you avoid timing the market and provides disciplined withdrawal structure. It's particularly useful for retirees who need steady income. However, combine SWP with FDs (20-30%) for guaranteed income and emergency fund."
                                },
                                {
                                    q: "What happens if my corpus gets exhausted?",
                                    a: "If your withdrawal rate is too high or returns are lower than expected, your corpus may get exhausted before your planned period. Our SWP calculator shows you the exhaustion timeline and remaining corpus. To avoid this, reduce withdrawal amount, increase expected returns, or reduce withdrawal period. Always keep a buffer for unexpected expenses. Consider keeping 1-2 years expenses in emergency fund to avoid forced withdrawals during market downturns."
                                },
                                {
                                    q: "SWP vs Fixed Deposit - which is better for retirement?",
                                    a: "SWP from mutual funds typically offers higher returns (10-12%) compared to FDs (6-7%), allowing higher withdrawals and better inflation protection. However, FDs provide guaranteed returns while SWP returns vary with market. A balanced approach with both SWP (60-70%) and FDs (20-30%) is often recommended for retirement income. FDs provide stability and guaranteed income, while SWP offers growth potential."
                                },
                                {
                                    q: "How does inflation affect SWP withdrawals?",
                                    a: "Inflation erodes purchasing power of fixed withdrawals. If you withdraw ₹50,000 monthly today, in 20 years at 6% inflation, you'll need ₹1.6 lakhs monthly to maintain the same lifestyle. Our SWP calculator includes inflation adjustment that shows how much to increase withdrawals annually. Enable inflation adjustment to see realistic withdrawal needs and plan accordingly."
                                },
                                {
                                    q: "Can I change my SWP withdrawal amount?",
                                    a: "Yes, most mutual funds allow you to modify SWP withdrawal amounts, frequency, or pause withdrawals. You can increase, decrease, or stop withdrawals based on your changing needs. However, frequent changes can impact your planning. Use our SWP calculator to see the impact of changing withdrawal amounts on corpus sustainability before making changes."
                                },
                                {
                                    q: "What is the best mutual fund for SWP?",
                                    a: "For SWP, balanced or hybrid funds are ideal as they provide moderate returns (10-12%) with lower volatility than pure equity funds. Large-cap equity funds also work well. Avoid small-cap or sectoral funds for SWP as high volatility can affect withdrawal sustainability. Diversify across 3-4 funds for better risk management. Use funds with consistent long-term performance and low expense ratios."
                                },
                                {
                                    q: "How to calculate SWP manually?",
                                    a: "To calculate SWP manually, use the formula: Remaining Corpus = (Corpus × (1 + r)) - Withdrawal, where r is monthly return rate (annual rate ÷ 12). Repeat this calculation for each month until corpus is exhausted or period ends. However, using our SWP calculator is much easier and provides instant results with detailed year-by-year breakdowns, charts, and inflation-adjusted projections."
                                },
                                {
                                    q: "Is SWP taxable?",
                                    a: "SWP withdrawals from equity funds held for more than 1 year are tax-free up to ₹1 lakh annually. Gains above ₹1 lakh are taxed at 10% without indexation. Short-term gains (held less than 1 year) are taxed at 15%. For debt funds, gains are taxed as per your income tax slab. Plan withdrawals to maximize tax benefits. Use our tax calculator to understand tax implications."
                                },
                                {
                                    q: "What is the minimum corpus for SWP?",
                                    a: "There's no fixed minimum, but practical minimum is ₹10-20 lakhs for meaningful monthly income. With ₹10 lakhs at 12% return, you can withdraw ₹3,000-4,000 monthly for 20 years. For ₹50,000 monthly income, you need ₹1 crore corpus. Use our SWP calculator to determine minimum corpus needed for your desired monthly income."
                                },
                                {
                                    q: "Can I pause SWP withdrawals?",
                                    a: "Yes, most mutual funds allow you to pause SWP withdrawals temporarily. This helps during market downturns or when you don't need income. Pausing during market crashes allows corpus to recover. However, ensure you have alternative income sources during pause period. Check with your fund house for their specific pause policy and duration limits."
                                },
                                {
                                    q: "SWP vs Annuity - which is better?",
                                    a: "SWP offers higher returns (10-12%) and flexibility to change withdrawals, but returns vary with market. Annuities offer guaranteed lifetime income (5-6%) but are inflexible and lower returns. SWP is better for those who can handle market volatility and want growth potential. Annuities suit those who want guaranteed income regardless of market conditions. Many retirees use both strategies."
                                },
                                {
                                    q: "How to start SWP?",
                                    a: "To start SWP, you need a lumpsum investment in mutual funds. Choose balanced or large-cap funds with good track record. Set up SWP instruction with your fund house specifying withdrawal amount, frequency (monthly/quarterly), and date. Minimum withdrawal is usually ₹1,000-5,000 depending on fund. You can start SWP online through fund house website or app."
                                },
                                {
                                    q: "What if market crashes during SWP?",
                                    a: "Market crashes during SWP can reduce corpus value, potentially affecting withdrawal sustainability. To mitigate: 1) Keep 1-2 years expenses in emergency fund, 2) Diversify across funds, 3) Consider pausing withdrawals during severe crashes, 4) Start with conservative withdrawal rate (4-5%). Our SWP calculator shows impact of lower returns on corpus sustainability."
                                },
                                {
                                    q: "Can I have multiple SWPs?",
                                    a: "Yes, you can have multiple SWPs from different funds or same fund. This provides diversification and flexibility. For example, one SWP from equity fund for growth, another from debt fund for stability. You can also have different withdrawal amounts and dates. This helps manage cash flow and reduces risk from single fund performance."
                                },
                                {
                                    q: "What is bucket strategy for SWP?",
                                    a: "Bucket strategy divides corpus into buckets: 3-5 years expenses in debt/liquid funds (Bucket 1) for immediate withdrawals, rest in equity funds (Bucket 2) for growth. As Bucket 1 depletes, refill from Bucket 2. This provides stability while maintaining growth. It's more conservative than pure SWP and reduces market timing risk."
                                },
                                {
                                    q: "How often should I review my SWP?",
                                    a: "Review your SWP strategy annually. Check corpus performance, adjust withdrawal rate if needed, rebalance portfolio, and update for changing expenses. If corpus grows faster than expected, you can increase withdrawals. If it underperforms, reduce withdrawals or extend period. Regular reviews ensure your SWP remains sustainable throughout retirement."
                                },
                                {
                                    q: "Is SWP better than monthly dividends?",
                                    a: "SWP is generally better than monthly dividends because: 1) You control withdrawal amount, 2) Dividends are not guaranteed and can vary, 3) SWP allows you to withdraw from growth, not just dividends, 4) More tax-efficient (long-term gains tax-free up to ₹1L). However, dividends provide passive income without reducing corpus. Many investors use both strategies."
                                },
                                {
                                    q: "What is the maximum withdrawal period for SWP?",
                                    a: "There's no fixed maximum period for SWP. You can set it for any period - 10, 20, 30 years, or even lifetime. However, longer periods require lower withdrawal rates to ensure sustainability. For lifetime SWP, use 4% withdrawal rate. Our SWP calculator shows how different periods affect withdrawal amounts and corpus sustainability."
                                },
                                {
                                    q: "Can I increase SWP withdrawal amount?",
                                    a: "Yes, you can increase SWP withdrawal amount anytime through your fund house. However, higher withdrawals reduce corpus faster. Use our SWP calculator to see impact before increasing. Consider: 1) Current corpus performance, 2) Remaining withdrawal period, 3) Market conditions, 4) Future expense needs. Increase gradually, not suddenly."
                                },
                                {
                                    q: "What happens to remaining corpus after SWP period?",
                                    a: "After SWP period ends, remaining corpus (if any) stays in your mutual fund account. You can: 1) Continue SWP with new instructions, 2) Withdraw lump sum, 3) Let it grow for future needs, 4) Transfer to other funds. If corpus is exhausted before period ends, withdrawals stop automatically. Plan your SWP to ensure corpus lasts your desired period."
                                },
                                {
                                    q: "SWP vs Reverse Mortgage - which is better?",
                                    a: "SWP uses your investment corpus to generate income while maintaining ownership. Reverse mortgage uses your home equity to generate income but transfers ownership to bank. SWP is better if you have sufficient corpus and want to maintain asset ownership. Reverse mortgage suits those with limited corpus but valuable property. Both can be combined for comprehensive retirement income."
                                },
                                {
                                    q: "How to calculate SWP returns?",
                                    a: "SWP returns depend on fund performance. If your corpus grows from ₹1Cr to ₹1.2Cr over 5 years while withdrawing ₹6L annually, your effective return is approximately 8-10% after accounting for withdrawals. Use our SWP calculator to see projected returns based on expected fund performance. Actual returns vary with market conditions."
                                }
                            ].map((faq, idx) => (
                                <div key={idx} className="border-b border-slate-200 pb-8 last:border-0">
                                    <h3 className="font-black text-slate-900 mb-3 text-xl flex items-start gap-3">
                                        <span className="text-teal-600 font-black text-lg">Q{idx + 1}.</span>
                                        <span>{faq.q}</span>
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-lg ml-8">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

