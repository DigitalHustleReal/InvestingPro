"use client";

import React from 'react';
import SEOHead from "@/components/common/SEOHead";
import { SIPCalculatorWithInflation } from "@/components/calculators/SIPCalculatorWithInflation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SEOArticle } from "@/components/calculators/SEOArticle";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import AutoInternalLinks from '@/components/common/AutoInternalLinks';
import { generateSchema } from '@/lib/linking/schema';
import { generateCanonicalUrl } from '@/lib/linking/canonical';
import { generateBreadcrumbSchema } from '@/lib/linking/breadcrumbs';

export default function SIPCalculatorPage() {
    // Generate automated schema
    const breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Calculators', url: '/calculators' },
        { label: 'SIP Calculator', url: '/calculators/sip' },
    ];

    const calculatorSchema = generateSchema({
        pageType: 'calculator',
        title: 'SIP Calculator',
        description: 'Free SIP calculator to calculate returns on Systematic Investment Plans (SIP) with inflation adjustment.',
        url: '/calculators/sip',
        breadcrumbs,
        category: 'investing',
    });

    const structuredData = [
        calculatorSchema,
        generateBreadcrumbSchema(breadcrumbs),
        {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "SIP Calculator",
            "description": "Free SIP calculator to calculate returns on Systematic Investment Plans (SIP) with inflation adjustment. Calculate SIP maturity value, returns, and plan your financial goals.",
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
        }
    ];

    // Generate canonical URL
    const canonicalUrl = generateCanonicalUrl('/calculators/sip');

    // Generate automated internal links
    const linkingContext = {
        contentType: 'calculator' as const,
        category: 'investing',
        slug: 'sip',
        relatedCalculators: ['lumpsum', 'retirement'],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How does SIP calculator work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SIP calculator uses the compound interest formula to calculate the future value of your monthly investments. The formula used is: FV = P × [((1 + r)^n - 1) / r] × (1 + r), where P is your monthly investment amount, r is the monthly return rate (annual rate divided by 12), and n is the number of months. This formula accounts for the compounding effect, where returns are reinvested to generate additional returns over time."
                }
            },
            {
                "@type": "Question",
                "name": "What is the best SIP amount to invest?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best SIP amount depends on several factors including your monthly income, financial goals, expenses, and risk tolerance. Financial experts generally recommend investing 20-30% of your monthly income in SIPs. For beginners, starting with ₹5,000-10,000 per month is ideal. You can gradually increase this amount as your income grows."
                }
            },
            {
                "@type": "Question",
                "name": "How much SIP to invest for ₹1 crore?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To accumulate ₹1 crore, you need to invest approximately ₹15,000-20,000 per month for 20 years at 12% annual return. For 15 years, invest ₹30,000-35,000 per month. For 25 years, you can achieve ₹1 crore with ₹10,000-12,000 per month. The exact amount depends on your investment period and expected returns."
                }
            },
            {
                "@type": "Question",
                "name": "Is SIP calculator accurate?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our SIP calculator is highly accurate as it uses the standard compound interest formula employed by mutual fund companies and financial institutions. However, actual returns may vary based on real-world market conditions, fund performance, and economic factors. The calculator provides estimates based on your expected return rate assumption."
                }
            },
            {
                "@type": "Question",
                "name": "What is inflation-adjusted SIP calculator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An inflation-adjusted SIP calculator shows real returns after accounting for inflation's impact on purchasing power. For example, if your SIP grows to ₹50 lakhs in 20 years but inflation averages 6%, your real purchasing power would be equivalent to approximately ₹15.6 lakhs in today's terms. This helps you understand the true value of your investments."
                }
            },
            {
                "@type": "Question",
                "name": "Can I change my SIP amount?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, most mutual funds allow you to increase, decrease, or pause your SIP investments at any time. You can modify the SIP amount online through your mutual fund account or by contacting your fund house. However, it's important to avoid stopping SIPs during market downturns as this defeats the purpose of rupee cost averaging."
                }
            },
            {
                "@type": "Question",
                "name": "SIP calculator vs lumpsum calculator - which is better?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SIP calculator is ideal for regular monthly investments and is better for most investors because it removes the need for market timing and instills financial discipline. Lumpsum calculator is for one-time investments and can provide higher returns if invested at the right market timing. SIPs help average out market volatility through rupee cost averaging."
                }
            },
            {
                "@type": "Question",
                "name": "What is the minimum SIP amount?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The minimum SIP amount varies by mutual fund scheme, but most funds allow you to start with as low as ₹500 per month. Some funds have a minimum of ₹1,000 or ₹5,000 per month. Equity funds typically have lower minimums (₹500-1,000), while some debt or hybrid funds may require ₹5,000 or more."
                }
            },
            {
                "@type": "Question",
                "name": "How long should I invest in SIP?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The ideal SIP investment period depends on your financial goals. Most financial experts recommend at least 5-7 years for equity SIPs to ride out market volatility and benefit from rupee cost averaging. For long-term goals like retirement (20-30 years) or children's education (15-20 years), longer periods benefit more from compounding."
                }
            },
            {
                "@type": "Question",
                "name": "What is a good SIP return rate?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For equity mutual funds, historical returns average around 12-15% annually over 10+ year periods. Large-cap funds typically return 10-12%, mid-cap funds 12-15%, and small-cap funds 15-18% (with higher volatility). Balanced funds return around 10-12%, while debt funds return 6-8%. When using SIP calculator, use conservative estimates (10-12% for equity) for better planning."
                }
            }
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Use SIP Calculator",
        "description": "Step-by-step guide to calculate SIP returns using our free SIP calculator",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Enter Monthly SIP Amount",
                "text": "Input your monthly SIP investment amount (minimum ₹500). You can invest any amount from ₹500 to ₹1,00,000 per month."
            },
            {
                "@type": "HowToStep",
                "name": "Set Investment Period",
                "text": "Choose your investment tenure from 1 year to 30 years. Longer investment periods typically yield higher returns due to compounding."
            },
            {
                "@type": "HowToStep",
                "name": "Expected Return Rate",
                "text": "Enter expected annual return rate (typically 10-15% for equity mutual funds). Our calculator uses compound interest formula for accurate calculations."
            },
            {
                "@type": "HowToStep",
                "name": "View Results",
                "text": "Get instant results showing total invested amount, returns earned, and maturity value. Enable inflation adjustment to see real purchasing power."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title="SIP Calculator India 2024 - Calculate SIP Returns with Inflation Adjustment | InvestingPro"
                description="Free SIP calculator to calculate returns on Systematic Investment Plans (SIP). Calculate SIP maturity value, returns, and inflation-adjusted real returns. Plan your financial goals with accurate SIP projections. No registration required."
                structuredData={[structuredData, faqSchema, howToSchema]}
                url="https://investingpro.in/calculators/sip"
                image="https://investingpro.in/images/sip-calculator-og.png"
            />
            
            {/* Automated Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
                <AutoBreadcrumbs />
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="text-center mb-6">
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                        SIP Calculator - Calculate Systematic Investment Plan Returns
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-4">
                        Calculate returns on your SIP investments with our free SIP calculator. Includes inflation adjustment to show real returns and help you plan your financial goals.
                    </p>
                    
                    {/* Usage Counter & Last Updated */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-2">
                            <span className="font-semibold text-emerald-600">10,000+</span> users calculated this month
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    
                    {/* Social Share Buttons */}
                    <div className="flex justify-center">
                        <SocialShareButtons
                            title="SIP Calculator - Calculate Systematic Investment Plan Returns"
                            url="https://investingpro.in/calculators/sip"
                            description="Free SIP calculator with inflation adjustment. Calculate returns on your Systematic Investment Plan investments."
                        />
                    </div>
                </div>
            </div>

            {/* Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <SIPCalculatorWithInflation />
            </div>

            {/* SEO Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
                {/* Comprehensive SEO Article */}
                <SEOArticle calculatorType="sip" />

                {/* Automated Internal Links */}
                <AutoInternalLinks context={linkingContext} />

                {/* Expanded FAQ Section */}
                <Card className="border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Info className="w-6 h-6 text-teal-600" />
                            SIP Calculator - Frequently Asked Questions (FAQs)
                        </CardTitle>
                        <p className="text-slate-600 mt-2">Find answers to the most common questions about SIP calculator and SIP investments</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                {
                                    q: "How does SIP calculator work?",
                                    a: "SIP calculator uses the compound interest formula to calculate the future value of your monthly investments. The formula used is: FV = P × [((1 + r)^n - 1) / r] × (1 + r), where P is your monthly investment amount, r is the monthly return rate (annual rate divided by 12), and n is the number of months. This formula accounts for the compounding effect, where returns are reinvested to generate additional returns over time. Our calculator provides instant, accurate results without requiring any manual calculations."
                                },
                                {
                                    q: "What is the best SIP amount to invest?",
                                    a: "The best SIP amount depends on several factors including your monthly income, financial goals, expenses, and risk tolerance. Financial experts generally recommend investing 20-30% of your monthly income in SIPs. For beginners, starting with ₹5,000-10,000 per month is ideal. You can gradually increase this amount as your income grows. Use our SIP calculator to experiment with different amounts and see how they help you achieve your specific financial goals. Remember, consistency in investing is more important than the amount."
                                },
                                {
                                    q: "How much SIP to invest for ₹1 crore?",
                                    a: "To accumulate ₹1 crore, the SIP amount depends on your investment period and expected returns. For a 20-year investment period at 12% annual return, you need to invest approximately ₹15,000-20,000 per month. For 15 years at the same return, invest ₹30,000-35,000 per month. For 25 years, you can achieve ₹1 crore with ₹10,000-12,000 per month. Use our SIP calculator to find the exact amount based on your preferred investment period and realistic return expectations. The calculator shows year-by-year growth so you can track your progress."
                                },
                                {
                                    q: "Is SIP calculator accurate?",
                                    a: "Yes, our SIP calculator is highly accurate as it uses the standard compound interest formula employed by mutual fund companies and financial institutions. The formula accounts for monthly compounding and investments made at the beginning of each month. However, actual returns may vary based on real-world market conditions, fund performance, economic factors, and market volatility. The calculator provides estimates based on your expected return rate assumption. It's important to note that past performance doesn't guarantee future returns, and actual results may differ."
                                },
                                {
                                    q: "What is inflation-adjusted SIP calculator?",
                                    a: "An inflation-adjusted SIP calculator shows real returns after accounting for inflation's impact on purchasing power. For example, if your SIP grows to ₹50 lakhs in 20 years but inflation averages 6% during that period, your real purchasing power would be equivalent to approximately ₹15.6 lakhs in today's terms. This helps you understand the true value of your investments and whether your investment strategy needs adjustment. Our calculator includes an inflation adjustment toggle that shows both nominal and real returns, giving you a complete picture of your investment growth."
                                },
                                {
                                    q: "Can I change my SIP amount?",
                                    a: "Yes, most mutual funds allow you to increase, decrease, or pause your SIP investments at any time. You can modify the SIP amount online through your mutual fund account or by contacting your fund house. Some funds also allow you to add lump sum investments alongside your SIP. However, it's important to avoid stopping SIPs during market downturns as this defeats the purpose of rupee cost averaging. Use our SIP calculator to see the impact of changing SIP amounts on your final corpus and plan your investments accordingly."
                                },
                                {
                                    q: "SIP calculator vs lumpsum calculator - which is better?",
                                    a: "SIP and lumpsum calculators serve different purposes. SIP calculator is ideal for regular monthly investments and is better for most investors because it removes the need for market timing, instills financial discipline, and works well for those with regular income. Lumpsum calculator is for one-time investments and can provide higher returns if invested at the right market timing. SIPs help average out market volatility through rupee cost averaging, while lumpsum investments carry higher timing risk. We recommend using both calculators to compare strategies and potentially combining both approaches for optimal results."
                                },
                                {
                                    q: "How to calculate SIP returns manually?",
                                    a: "To calculate SIP returns manually, use the formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r), where P is monthly investment, r is monthly return rate (annual rate divided by 12), and n is number of months. First, convert your annual return to monthly (divide by 12 and then by 100). Then raise (1 + r) to the power of n, subtract 1, divide by r, multiply by P, and finally multiply by (1 + r). However, using our SIP calculator is much easier, faster, and provides instant results with detailed year-by-year breakdowns, charts, and inflation-adjusted values."
                                },
                                {
                                    q: "What is the minimum SIP amount?",
                                    a: "The minimum SIP amount varies by mutual fund scheme, but most funds allow you to start with as low as ₹500 per month. Some funds have a minimum of ₹1,000 or ₹5,000 per month. Equity funds typically have lower minimums (₹500-1,000), while some debt or hybrid funds may require ₹5,000 or more. Check with your specific fund house for their minimum SIP requirement. While you can start small, it's recommended to invest at least ₹5,000-10,000 per month for meaningful wealth creation over the long term."
                                },
                                {
                                    q: "How long should I invest in SIP?",
                                    a: "The ideal SIP investment period depends on your financial goals. For long-term goals like retirement (20-30 years) or children's education (15-20 years), longer periods benefit more from compounding. Most financial experts recommend at least 5-7 years for equity SIPs to ride out market volatility and benefit from rupee cost averaging. Short-term goals (1-3 years) are better served by debt funds or fixed deposits. Generally, the longer you invest, the more you benefit from compounding. Use our SIP calculator to see how different time periods impact your returns."
                                },
                                {
                                    q: "What is a good SIP return rate?",
                                    a: "A good SIP return rate depends on the type of mutual fund. For equity mutual funds, historical returns average around 12-15% annually over 10+ year periods. Large-cap funds typically return 10-12%, mid-cap funds 12-15%, and small-cap funds 15-18% (with higher volatility). Balanced or hybrid funds return around 10-12%, while debt funds return 6-8%. When using our SIP calculator, use conservative estimates (10-12% for equity) for better planning. Remember, past returns don't guarantee future performance, and actual returns vary based on market conditions."
                                },
                                {
                                    q: "Can I pause SIP temporarily?",
                                    a: "Yes, most mutual funds allow you to pause your SIP temporarily, typically for 1-6 months depending on the fund house. Some funds allow longer pause periods. You can resume your SIP after the pause period without any penalties. However, pausing SIP during market downturns is not recommended as you miss buying opportunities at lower prices. If you're facing financial constraints, consider reducing the SIP amount instead of pausing completely. Check with your fund house for their specific pause policy."
                                },
                                {
                                    q: "How does SIP help in rupee cost averaging?",
                                    a: "Rupee cost averaging is the key advantage of SIP investing. When you invest a fixed amount every month, you automatically buy more mutual fund units when prices (NAV) are low and fewer units when prices are high. Over time, this averages out your purchase cost, reducing the impact of market volatility. For example, if you invest ₹10,000 monthly, you might buy 100 units when NAV is ₹100, or 125 units when NAV drops to ₹80. This strategy works best in volatile markets and removes the need to time the market, making it ideal for most investors."
                                },
                                {
                                    q: "Is SIP good for long-term investment?",
                                    a: "Yes, SIP is excellent for long-term investment because it benefits from the power of compounding, rupee cost averaging, and disciplined investing. The longer you invest through SIP, the more your wealth multiplies due to compounding where returns generate additional returns. Long-term SIPs (10+ years) in equity funds have historically provided excellent returns. For example, ₹10,000 monthly SIP for 20 years at 12% return can grow to nearly ₹1 crore. SIPs are particularly effective for long-term goals like retirement, children's education, and wealth creation."
                                },
                                {
                                    q: "What happens if I stop SIP early?",
                                    a: "If you stop your SIP early, your investment continues to grow based on the amount already invested, but you lose the benefits of regular investing and rupee cost averaging. There are typically no penalties for stopping SIP, but you may face exit loads if you withdraw before the specified period (usually 1 year for equity funds). Stopping SIP during market downturns is particularly harmful as you miss buying opportunities. If you must stop, consider reducing the amount instead, or redirect funds to debt funds temporarily. Use our calculator to see the impact of stopping early on your final corpus."
                                },
                                {
                                    q: "How to increase SIP amount?",
                                    a: "You can increase your SIP amount in several ways. Most funds allow you to modify SIP amount online through their website or app. You can also set up a step-up SIP that automatically increases your investment by a fixed percentage or amount annually. Increasing SIP by 10-15% every year as your income grows is an excellent strategy to reach your goals faster. Some funds allow multiple SIPs in the same scheme, so you can start a new SIP with higher amount while keeping the old one. Check with your fund house for their specific procedure."
                                },
                                {
                                    q: "Can I have multiple SIPs?",
                                    a: "Yes, you can have multiple SIPs in the same fund or different funds. Many investors diversify by running multiple SIPs across different categories - for example, one SIP in large-cap fund, another in mid-cap, and one in small-cap. You can also have multiple SIPs in the same fund with different amounts or dates. This provides better diversification and flexibility. However, ensure you don't over-diversify - having 4-6 well-selected funds across categories is usually sufficient. Our SIP calculator can help you plan multiple SIPs for different goals."
                                },
                                {
                                    q: "What is step-up SIP?",
                                    a: "Step-up SIP (also called top-up SIP) automatically increases your monthly investment by a fixed amount or percentage annually. For example, if you start with ₹10,000 monthly SIP and set a 10% step-up, your SIP becomes ₹11,000 in year 2, ₹12,100 in year 3, and so on. This helps you invest more as your income grows without manually increasing each time. Step-up SIPs are powerful for long-term wealth creation. Our SIP calculator shows how step-up SIPs can significantly boost your final corpus compared to fixed SIP amounts."
                                },
                                {
                                    q: "Is SIP taxable?",
                                    a: "SIP investments themselves are not taxable, but returns are subject to capital gains tax when you redeem. For equity funds, short-term capital gains (held less than 1 year) are taxed at 15%, while long-term gains (held more than 1 year) up to ₹1 lakh are tax-free, and gains above ₹1 lakh are taxed at 10% without indexation. For debt funds, gains are taxed as per your income tax slab. ELSS SIPs provide tax deduction under Section 80C up to ₹1.5 lakh annually with a 3-year lock-in. Use our tax calculator to understand tax implications on your SIP returns."
                                },
                                {
                                    q: "Which mutual funds are best for SIP?",
                                    a: "The best mutual funds for SIP depend on your risk profile, investment horizon, and goals. For long-term goals (10+ years), equity funds are ideal. Diversified equity funds, index funds, and large-cap funds are good starting points. For moderate risk, balanced or hybrid funds work well. For short-term goals, debt funds are safer. Look for funds with consistent long-term performance (5+ years), low expense ratios, experienced fund managers, and good risk-adjusted returns. Avoid chasing funds with recent high returns. Our mutual funds comparison tool can help you select the right funds for your SIP."
                                },
                                {
                                    q: "What is the difference between SIP date and SIP amount?",
                                    a: "SIP date is the day of the month when your investment is automatically debited from your bank account and invested in the mutual fund. You can choose any date between 1st and 28th. SIP amount is the fixed sum you invest every month. While the date doesn't significantly impact long-term returns, some investors prefer dates after salary credit. The amount is more important - higher amounts lead to larger corpus over time. Our SIP calculator helps you determine the right amount based on your goals, while the date is more about personal convenience and cash flow management."
                                },
                                {
                                    q: "Can I start SIP with ₹500?",
                                    a: "Yes, you can start SIP with ₹500 per month in most equity mutual funds. This low entry point makes SIP accessible to investors of all income levels. Starting with ₹500 is better than not investing at all, but you'll need to increase it significantly over time to achieve meaningful financial goals. For example, ₹500 monthly for 20 years at 12% return grows to only about ₹5 lakhs. Use our SIP calculator to see how increasing the amount impacts your goals. Most experts recommend starting with at least ₹5,000-10,000 per month for serious wealth creation."
                                },
                                {
                                    q: "How does compounding work in SIP?",
                                    a: "Compounding in SIP means your returns generate additional returns over time. When you invest monthly, each investment starts earning returns, and those returns also earn returns in subsequent periods. For example, your first ₹10,000 investment compounds for the full investment period, while your last investment compounds for just one month. This is why long-term SIPs are so powerful - early investments have more time to compound. The formula FV = P × [((1 + r)^n - 1) / r] × (1 + r) accounts for this compounding effect. Our SIP calculator shows year-by-year how compounding accelerates your wealth growth."
                                },
                                {
                                    q: "What if I miss a SIP payment?",
                                    a: "If you miss a SIP payment due to insufficient funds or bank issues, most funds have a grace period (usually 1-3 months) before the SIP is cancelled. During this period, you can make good the missed payment. If the SIP is cancelled, you can restart it, but you may need to fill forms again. Some funds offer flexi-SIP where missed payments don't cancel the SIP. To avoid missing payments, ensure sufficient balance, set up auto-debit, and maintain a buffer in your account. Missing occasional payments won't significantly impact long-term returns, but consistency is key for SIP success."
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

                {/* External Authority Links */}
                <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <Info className="w-6 h-6 text-blue-600" />
                            Official Resources & Guidelines
                        </CardTitle>
                        <p className="text-slate-600 mt-2">Refer to these authoritative sources for official information about SIP investments and mutual funds in India.</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="https://www.sebi.gov.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">SEBI</p>
                                    <p className="text-xs text-slate-600">Securities and Exchange Board of India</p>
                                </div>
                            </a>
                            <a
                                href="https://www.amfiindia.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">AMFI</p>
                                    <p className="text-xs text-slate-600">Association of Mutual Funds in India</p>
                                </div>
                            </a>
                            <a
                                href="https://www.rbi.org.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">RBI</p>
                                    <p className="text-xs text-slate-600">Reserve Bank of India</p>
                                </div>
                            </a>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

