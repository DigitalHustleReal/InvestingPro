"use client";

import React, { useState } from 'react';
import SEOHead from "@/components/common/SEOHead";
import { CategoryHero } from "@/components/common/CategoryHero";
import { CategoryCTA } from "@/components/common/CTAButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calculator,
    TrendingUp,
    PiggyBank,
    Home,
    Wallet,
    Receipt,
    TrendingDown,
    Coins,
    Shield,
    Target,
    BarChart3,
    CheckCircle2,
    Percent,
    Clock,
    Info
} from "lucide-react";
import Link from "next/link";
import { SWPCalculator } from "@/components/calculators/SWPCalculator";
import { InflationAdjustedCalculator } from "@/components/calculators/InflationAdjustedCalculator";
import { FDCalculator } from "@/components/calculators/FDCalculator";
import { TaxCalculator } from "@/components/calculators/TaxCalculator";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { SIPCalculatorWithInflation } from "@/components/calculators/SIPCalculatorWithInflation";
import { LumpsumCalculatorWithInflation } from "@/components/calculators/LumpsumCalculatorWithInflation";
import { EMICalculatorEnhanced } from "@/components/calculators/EMICalculatorEnhanced";
import { PPFCalculator } from "@/components/calculators/PPFCalculator";
import { NPSCalculator } from "@/components/calculators/NPSCalculator";
import { GoalPlanningCalculator } from "@/components/calculators/GoalPlanningCalculator";
import { GSTCalculator } from "@/components/calculators/GSTCalculator";

export default function CalculatorsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title="Free Financial Calculators India 2024 - SIP, SWP, EMI, Tax, Retirement Calculator | InvestingPro"
                description="Free financial calculators with inflation adjustment. Calculate SIP returns, SWP withdrawals, EMI for loans, income tax, retirement corpus, FD maturity, PPF, NPS and more. Best calculator tools for financial planning in India."
            />
            
            <CategoryHero
                title="Financial Tools"
                subtitle="Free Calculators & Tools"
                description="Plan your investments, calculate EMIs, taxes, and retirement with our comprehensive calculators. All calculators include inflation-adjusted projections."
                badge="12 Free Tools"
                badgeIcon={<Calculator className="w-3 h-3" />}
                gradient="teal"
                primaryCTA={{
                    href: "/calculators?type=sip",
                    text: "Start Calculating"
                }}
                secondaryCTA={{
                    href: "/credit-score",
                    text: "Check Credit Score"
                }}
                stats={[
                    { label: "Calculators", value: "12+", icon: <Calculator className="w-5 h-5" /> },
                    { label: "Inflation Adjusted", value: "All", icon: <Percent className="w-5 h-5" /> },
                    { label: "Free Forever", value: "100%", icon: <CheckCircle2 className="w-5 h-5" /> },
                    { label: "Updated Daily", value: "24/7", icon: <Clock className="w-5 h-5" /> }
                ]}
            />

            {/* Calculators */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Tabs defaultValue="sip" className="space-y-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">All Calculators</h2>
                        <p className="text-slate-600">Choose a calculator to get started</p>
                    </div>
                    <TabsList className="bg-white border border-slate-200 p-1.5 h-auto inline-flex flex-wrap rounded-xl shadow-sm gap-2">
                        <TabsTrigger value="sip" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            SIP
                        </TabsTrigger>
                        <TabsTrigger value="swp" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <TrendingDown className="w-4 h-4 mr-2" />
                            SWP
                        </TabsTrigger>
                        <TabsTrigger value="lumpsum" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <PiggyBank className="w-4 h-4 mr-2" />
                            Lumpsum
                        </TabsTrigger>
                        <TabsTrigger value="fd" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Coins className="w-4 h-4 mr-2" />
                            FD
                        </TabsTrigger>
                        <TabsTrigger value="emi" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Home className="w-4 h-4 mr-2" />
                            EMI
                        </TabsTrigger>
                        <TabsTrigger value="tax" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Receipt className="w-4 h-4 mr-2" />
                            Tax
                        </TabsTrigger>
                        <TabsTrigger value="retirement" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Target className="w-4 h-4 mr-2" />
                            Retirement
                        </TabsTrigger>
                        <TabsTrigger value="inflation" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Inflation
                        </TabsTrigger>
                        <TabsTrigger value="ppf" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Coins className="w-4 h-4 mr-2" />
                            PPF
                        </TabsTrigger>
                        <TabsTrigger value="nps" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Target className="w-4 h-4 mr-2" />
                            NPS
                        </TabsTrigger>
                        <TabsTrigger value="goal" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Target className="w-4 h-4 mr-2" />
                            Goal Planning
                        </TabsTrigger>
                        <TabsTrigger value="gst" className="px-4 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg transition-all text-sm">
                            <Receipt className="w-4 h-4 mr-2" />
                            GST
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="sip">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-600">Visit our dedicated SIP calculator page for comprehensive guides and FAQs.</p>
                                <Link href="/calculators/sip" className="text-teal-600 hover:text-teal-700 font-semibold">
                                    View Full Page →
                                </Link>
                            </div>
                            <SIPCalculatorWithInflation />
                        </div>
                    </TabsContent>

                    <TabsContent value="swp">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-600">Visit our dedicated SWP calculator page for comprehensive guides and FAQs.</p>
                                <Link href="/calculators/swp" className="text-teal-600 hover:text-teal-700 font-semibold">
                                    View Full Page →
                                </Link>
                            </div>
                            <SWPCalculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="lumpsum">
                        <LumpsumCalculatorWithInflation />
                    </TabsContent>

                    <TabsContent value="fd">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-600">Visit our dedicated FD calculator page for comprehensive guides and FAQs.</p>
                                <Link href="/calculators/fd" className="text-teal-600 hover:text-teal-700 font-semibold">
                                    View Full Page →
                                </Link>
                            </div>
                            <FDCalculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="emi">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-600">Visit our dedicated EMI calculator page for comprehensive guides and FAQs.</p>
                                <Link href="/calculators/emi" className="text-teal-600 hover:text-teal-700 font-semibold">
                                    View Full Page →
                                </Link>
                            </div>
                            <EMICalculatorEnhanced />
                        </div>
                    </TabsContent>

                    <TabsContent value="tax">
                        <TaxCalculator />
                    </TabsContent>

                    <TabsContent value="retirement">
                        <RetirementCalculator />
                    </TabsContent>

                    <TabsContent value="inflation">
                        <InflationAdjustedCalculator />
                    </TabsContent>

                    <TabsContent value="ppf">
                        <PPFCalculator />
                    </TabsContent>

                    <TabsContent value="nps">
                        <NPSCalculator />
                    </TabsContent>

                    <TabsContent value="goal">
                        <GoalPlanningCalculator />
                    </TabsContent>

                    <TabsContent value="gst">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-600">Visit our dedicated GST calculator page for comprehensive guides and FAQs.</p>
                                <Link href="/calculators/gst" className="text-teal-600 hover:text-teal-700 font-semibold">
                                    View Full Page →
                                </Link>
                            </div>
                            <GSTCalculator />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* SEO Content Section - All Calculators */}
                <section className="mt-16 space-y-12">
                    {/* Introduction */}
                    <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-slate-50 to-white">
                        <CardContent className="p-8 lg:p-12">
                            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6">
                                Free Financial Calculators India - Plan Your Financial Future
                            </h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                    Use our comprehensive suite of free financial calculators to plan your investments, loans, taxes, and retirement. 
                                    All calculators include inflation adjustment to show real returns, helping you make informed financial decisions. 
                                    Whether you're calculating SIP returns, planning loan EMIs, estimating tax liability, or planning for retirement, 
                                    our calculators provide accurate projections based on standard financial formulas.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                    Our financial calculators are trusted by thousands of users across India for accurate calculations. 
                                    We use the same formulas used by banks, mutual fund companies, and financial institutions, ensuring 
                                    you get reliable results. All calculators are completely free, require no registration, and provide 
                                    instant results with detailed breakdowns and visualizations.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                    {[
                                        "SIP Calculator - Calculate systematic investment plan returns",
                                        "SWP Calculator - Plan systematic withdrawal from corpus",
                                        "Lumpsum Calculator - Calculate one-time investment returns",
                                        "FD Calculator - Fixed deposit maturity calculator",
                                        "EMI Calculator - Loan EMI calculator for all loan types",
                                        "Tax Calculator - Income tax calculator for FY 2024-25",
                                        "Retirement Calculator - Plan your retirement corpus",
                                        "Inflation Calculator - Calculate real returns after inflation",
                                        "PPF Calculator - Public Provident Fund calculator",
                                        "NPS Calculator - National Pension System calculator",
                                        "Goal Planning Calculator - Plan financial goals with SIP",
                                        "GST Calculator - Calculate Goods and Services Tax"
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-slate-700 font-medium">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FAQ Section */}
                    <Card className="border-0 shadow-lg rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <Info className="w-6 h-6 text-teal-600" />
                                Financial Calculator FAQs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    {
                                        q: "Are these financial calculators free to use?",
                                        a: "Yes, all our financial calculators are completely free to use. There's no registration required, no hidden charges, and no limitations on usage. You can use any calculator as many times as you need to plan your finances."
                                    },
                                    {
                                        q: "How accurate are these calculators?",
                                        a: "Our calculators use standard financial formulas used by banks, mutual fund companies, and financial institutions. They provide accurate estimates based on your inputs. However, actual returns may vary based on market conditions. The calculators are designed to help you plan and make informed decisions."
                                    },
                                    {
                                        q: "What is inflation-adjusted calculator?",
                                        a: "Inflation-adjusted calculators show real returns after accounting for inflation. For example, if your investment grows to ₹50 lakhs in 20 years but inflation is 6%, your real purchasing power would be lower. Inflation-adjusted calculators help you understand the true value of your investments in today's terms."
                                    },
                                    {
                                        q: "Can I use these calculators on mobile?",
                                        a: "Yes, all our calculators are fully responsive and optimized for mobile devices. You can use them on smartphones, tablets, and desktops. The calculators are designed to work seamlessly across all devices and screen sizes."
                                    },
                                    {
                                        q: "Do I need to create an account to use calculators?",
                                        a: "No, you don't need to create an account or register to use any of our calculators. They're available for immediate use without any sign-up requirements. Simply select a calculator and start calculating."
                                    },
                                    {
                                        q: "How do these calculators compare to Groww or ET Money calculators?",
                                        a: "Our calculators offer similar accuracy with additional features like inflation adjustment, detailed visualizations, and comprehensive explanations. We also provide extensive FAQ sections and how-to guides to help you understand the calculations better."
                                    },
                                    {
                                        q: "Can I save my calculations?",
                                        a: "Currently, calculations are performed in real-time and results are displayed instantly. We're working on adding save functionality for future updates. For now, you can bookmark the page or take screenshots of your results."
                                    },
                                    {
                                        q: "Are the calculations updated for FY 2024-25?",
                                        a: "Yes, all our calculators are updated for the current financial year (FY 2024-25). Tax calculators include the latest tax slabs and rates. Interest rate calculators use current market rates. We regularly update our calculators to reflect the latest regulations and rates."
                                    }
                                ].map((faq, idx) => (
                                    <div key={idx} className="border-b border-slate-200 pb-6 last:border-0">
                                        <h3 className="font-black text-slate-900 mb-2 text-lg">{faq.q}</h3>
                                        <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Content */}
                    <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black text-slate-900">Related Financial Tools & Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { name: "Compare Credit Cards", href: "/credit-cards", desc: "Compare best credit cards" },
                                    { name: "Compare Loans", href: "/loans", desc: "Compare loan offers" },
                                    { name: "Compare Mutual Funds", href: "/mutual-funds", desc: "Compare mutual funds" },
                                    { name: "Check Credit Score", href: "/credit-score", desc: "Free credit score check" }
                                ].map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className="p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calculator className="w-4 h-4 text-teal-600 group-hover:text-teal-700" />
                                            <span className="font-semibold text-slate-900 group-hover:text-teal-600">{item.name}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{item.desc}</p>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Quick Access Tools */}
                <section className="mt-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-8">Quick Access Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CategoryCTA
                            href="/credit-score"
                            title="Credit Score Checker"
                            description="Check your credit score for free and get personalized recommendations"
                            badge="Free"
                            icon={<CheckCircle2 className="w-6 h-6" />}
                            variant="primary"
                        />
                        <CategoryCTA
                            href="/compare"
                            title="Compare Products"
                            description="Side-by-side comparison of financial products"
                            badge="Compare"
                            icon={<BarChart3 className="w-6 h-6" />}
                            variant="secondary"
                        />
                        <CategoryCTA
                            href="/calculators?type=tax"
                            title="Tax Calculator"
                            description="Calculate your income tax for old and new regime"
                            badge="2024-25"
                            icon={<Receipt className="w-6 h-6" />}
                            variant="primary"
                        />
                    </div>
                </section>

                {/* Why Choose Section */}
                <section className="bg-white py-16 mt-16 rounded-2xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">
                            Why Use Our Financial Calculators?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <CheckCircle2 className="w-8 h-8 text-teal-600" />,
                                    title: "100% Free",
                                    description: "All calculators are completely free with no hidden charges"
                                },
                                {
                                    icon: <Percent className="w-8 h-8 text-emerald-600" />,
                                    title: "Inflation Adjusted",
                                    description: "All calculators include inflation adjustment for real returns"
                                },
                                {
                                    icon: <Clock className="w-8 h-8 text-indigo-600" />,
                                    title: "Real-Time Calculations",
                                    description: "Instant results with accurate financial formulas"
                                }
                            ].map((feature, idx) => (
                                <Card key={idx} className="border-0 shadow-lg rounded-2xl">
                                    <CardContent className="p-8 text-center">
                                        <div className="flex justify-center mb-4">{feature.icon}</div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2">{feature.title}</h3>
                                        <p className="text-slate-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
