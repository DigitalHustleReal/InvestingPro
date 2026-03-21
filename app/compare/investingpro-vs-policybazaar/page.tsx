"use client";

import React from 'react';
import SEOHead from '@/components/common/SEOHead';
import CategoryHero from '@/components/common/CategoryHero';
import { Check, X, Minus, CreditCard, TrendingUp, Target, Zap } from 'lucide-react';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';

const COMPARISON_FEATURES = [
    {
        feature: "Primary Focus",
        investingPro: { value: "Credit Cards + Mutual Funds", highlight: true, desc: "Deep focus on decision-making for cards and funds" },
        policybazaar: { value: "Insurance", highlight: false, desc: "Primary focus on insurance products" }
    },
    {
        feature: "Credit Cards",
        investingPro: { value: "1000+ Cards", highlight: true, desc: "Decision engines, spending-based matching, instant apply" },
        policybazaar: { value: "Limited", highlight: false, desc: "Basic card listings, insurance-focused" }
    },
    {
        feature: "Mutual Funds",
        investingPro: { value: "1000+ Funds", highlight: true, desc: "Goal-based, risk-profiled, SIP recommendations" },
        policybazaar: { value: "Not Available", highlight: false, desc: "Insurance platform, no mutual funds" }
    },
    {
        feature: "Decision Tools",
        investingPro: { value: "Advanced", highlight: true, desc: "Personalized recommendations, eligibility checkers" },
        policybazaar: { value: "Basic", highlight: false, desc: "Simple comparison, sales-focused" }
    },
    {
        feature: "User Experience",
        investingPro: { value: "Decision-Focused", highlight: true, desc: "Compare. Decide. Apply. - Clear decision path" },
        policybazaar: { value: "Sales-Focused", highlight: false, desc: "Lead generation, agent calls" }
    },
    {
        feature: "Content Strategy",
        investingPro: { value: "Decision-Making", highlight: true, desc: "'Best card for X', actionable recommendations" },
        policybazaar: { value: "Product Listings", highlight: false, desc: "Product pages, agent-assisted sales" }
    }
];

export default function InvestingProVsPolicybazaarPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="InvestingPro vs Policybazaar: Credit Cards & Mutual Funds vs Insurance | InvestingPro"
                description="Compare InvestingPro and Policybazaar. InvestingPro focuses on credit cards and mutual funds with decision tools. Policybazaar focuses on insurance. Choose based on your needs."
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    
                    <CategoryHero
                        title="InvestingPro vs Policybazaar"
                        subtitle="Credit Cards & Mutual Funds vs Insurance"
                        description="InvestingPro helps you decide on credit cards and mutual funds with personalized recommendations. Policybazaar helps you buy insurance. Choose the platform that matches your financial needs."
                        primaryCta={{
                            text: "Find Your Perfect Card",
                            href: "/credit-cards/find-your-card"
                        }}
                        secondaryCta={{
                            text: "Start Investing",
                            href: "/mutual-funds/find-your-fund"
                        }}
                        stats={[
                            { label: "Credit Cards", value: "1000+" },
                            { label: "Mutual Funds", value: "1000+" },
                            { label: "Decision Tools", value: "Yes" }
                        ]}
                        badge="Credit Cards & Mutual Funds • Decision Tools • Instant Apply"
                        variant="primary"
                        className="mb-12"
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20">
                {/* Key Differentiator */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    Different Financial Products, Different Platforms
                                </h2>
                                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                    <strong className="text-slate-900 dark:text-white">InvestingPro</strong> specializes in <strong className="text-primary-600 dark:text-primary-400">credit cards and mutual funds</strong> with deep decision-making tools, personalized recommendations, and instant application links.
                                </p>
                                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
                                    <strong className="text-slate-900 dark:text-white">Policybazaar</strong> specializes in <strong className="text-slate-600 dark:text-slate-400">insurance products</strong> (life, health, motor) with agent-assisted sales and comprehensive insurance coverage.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="max-w-6xl mx-auto mb-16">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
                            <h2 className="text-2xl font-bold text-white text-center">
                                Feature Comparison
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white">Feature</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-primary-600 dark:text-primary-400">InvestingPro</th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400">Policybazaar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {COMPARISON_FEATURES.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-slate-900 dark:text-white">{item.feature}</div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${item.investingPro.highlight ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                                                    {item.investingPro.highlight ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                    <span>{item.investingPro.value}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-600 mt-2 max-w-xs mx-auto">
                                                    {item.investingPro.desc}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${item.policybazaar.highlight ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                                                    {item.policybazaar.highlight ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                    <span>{item.policybazaar.value}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-600 mt-2 max-w-xs mx-auto">
                                                    {item.policybazaar.desc}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* When to Choose Each */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose InvestingPro If</h3>
                        </div>
                        <ul className="space-y-3">
                            {[
                                "You're looking for credit cards or mutual funds",
                                "You want decision tools and personalized recommendations",
                                "You prefer instant application (no agent calls)",
                                "You want to compare 1000+ products side-by-side",
                                "You value decision-focused content and tools"
                            ].map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-300">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Choose Policybazaar If</h3>
                        </div>
                        <ul className="space-y-3">
                            {[
                                "You're looking for insurance products (life, health, motor)",
                                "You want agent-assisted guidance and support",
                                "You prefer talking to an advisor before buying",
                                "You need comprehensive insurance coverage",
                                "You want insurance-specific tools and calculators"
                            ].map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5 shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-300">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Card or Fund?</h2>
                    <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                        Get personalized recommendations for credit cards and mutual funds. Compare 1000+ products and apply instantly.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="/credit-cards/find-your-card" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors">
                            Find Your Perfect Card
                        </a>
                        <a href="/mutual-funds/find-your-fund" className="px-8 py-4 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors border-2 border-white/20">
                            Start Your Investment Journey
                        </a>
                    </div>
                </div>

                {/* Compliance Disclaimer */}
                <div className="max-w-4xl mx-auto mt-12">
                    <ComplianceDisclaimer variant="compact" />
                </div>
            </div>
        </div>
    );
}
