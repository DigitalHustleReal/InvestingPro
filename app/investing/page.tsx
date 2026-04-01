import React from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    Landmark,
    Coins,
    BarChart3,
    Gem,
    Building2,
    Shield,
    ShieldCheck,
    ChevronRight,
    Calculator,
    BookOpen,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import MethodologyBanner from '@/components/common/MethodologyBanner';

import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Best Investment Options in India (2026) — Compare & Plan | InvestingPro',
    description: 'Compare mutual funds, PPF, NPS, ELSS, demat accounts and fixed deposits. Honest, independent analysis to help you invest wisely.',
    alternates: { canonical: 'https://investingpro.in/investing' },
    openGraph: {
        title: 'Best Investment Options in India (2026) | InvestingPro',
        description: 'Compare mutual funds, PPF, NPS, ELSS and more. Independent analysis, no paid rankings.',
        url: 'https://investingpro.in/investing',
        siteName: 'InvestingPro',
        locale: 'en_IN',
        type: 'website',
    },
};

// ─── Sub-category hub cards ───────────────────────────────────────────────────

const INVESTING_CATEGORIES = [
    {
        label: 'Mutual Funds',
        description: 'Compare equity, debt, and hybrid funds. Filter by category, risk, and expense ratio.',
        href: '/mutual-funds',
        icon: TrendingUp,
        cta: 'Compare Mutual Funds',
        tags: ['Equity', 'Debt', 'Hybrid', 'Index'],
    },
    {
        label: 'PPF & NPS',
        description: 'Government-backed retirement and tax-saving schemes. Compare returns and contribution rules.',
        href: '/ppf-nps',
        icon: Coins,
        cta: 'Explore PPF & NPS',
        tags: ['Tax Saving', 'Section 80C', 'Retirement'],
    },
    {
        label: 'ELSS (Tax Saving Funds)',
        description: 'Equity-linked savings schemes offering Section 80C deductions with a 3-year lock-in.',
        href: '/mutual-funds/elss',
        icon: BarChart3,
        cta: 'Compare ELSS Funds',
        tags: ['80C', '3-Year Lock-in', 'Equity'],
    },
    {
        label: 'Demat Accounts',
        description: 'Compare brokerage charges, account fees, and platforms for stocks and ETF trading.',
        href: '/demat-accounts',
        icon: Building2,
        cta: 'Compare Demat Accounts',
        tags: ['Stocks', 'ETFs', 'Zero Brokerage'],
    },
    {
        label: 'Fixed Deposits',
        description: 'Compare FD interest rates across banks and NBFCs. Find the highest safe returns.',
        href: '/fixed-deposits',
        icon: ShieldCheck,
        cta: 'Compare FD Rates',
        tags: ['Safe Returns', 'Senior Citizen', 'Short-Term'],
    },
    {
        label: 'Gold Rate & Gold Bonds',
        description: 'Check today\'s gold price and compare Sovereign Gold Bonds, digital gold, and Gold ETFs.',
        href: '/gold-rate',
        icon: Gem,
        cta: 'View Gold Options',
        tags: ['Sovereign Gold Bond', 'Gold ETF', 'Digital Gold'],
    },
];

// ─── Calculator quick links ───────────────────────────────────────────────────

const CALCULATORS = [
    { label: 'SIP Calculator', href: '/calculators/sip', icon: Calculator },
    { label: 'PPF Calculator', href: '/calculators/ppf', icon: Calculator },
    { label: 'FD Calculator', href: '/calculators/fd', icon: Calculator },
    { label: 'SWP Calculator', href: '/calculators/swp', icon: Calculator },
    { label: 'Income Tax Calculator', href: '/calculators/tax', icon: Calculator },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_DATA = [
    {
        q: 'How much should I invest monthly?',
        a: 'A common starting point is 20% of your post-tax income. Even ₹500/month via SIP builds a habit. Increase contributions as income grows.',
    },
    {
        q: 'What is asset allocation?',
        a: 'Spreading your money across different asset types — equity, debt, gold — to balance risk and return. A younger investor might hold more equity; someone near retirement, more debt.',
    },
    {
        q: 'Is investing in stocks risky?',
        a: 'Individual stocks carry concentration risk. Mutual funds reduce this through diversification. Over long horizons (10+ years), diversified equity has historically outpaced inflation in India.',
    },
    {
        q: 'How are investment returns taxed in India?',
        a: 'Long-term equity gains (held >1 year) above ₹1.25 lakh are taxed at 10%. Short-term gains (<1 year) at 15%. Debt fund gains are taxed at your income tax slab rate.',
    },
    {
        q: 'What is the difference between direct and regular mutual funds?',
        a: 'Direct plans skip the distributor commission, so their expense ratio is lower and your returns are slightly higher over time. InvestingPro always shows direct plan data.',
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvestingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Best Investment Options in India (2026) | InvestingPro"
                description="Compare mutual funds, PPF, NPS, ELSS, demat accounts and FDs. Independent analysis, no paid rankings."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Investment Options in India',
                    description: 'Compare mutual funds, PPF, NPS, ELSS, demat accounts and fixed deposits.',
                    url: 'https://investingpro.in/investing',
                }}
            />

            {/* Hero */}
            <div className="bg-slate-50 dark:bg-slate-950 pt-8 pb-4">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Investment Options in India"
                        subtitle="Compare. Calculate. Invest wisely."
                        description="Independent comparison of mutual funds, PPF, NPS, ELSS, demat accounts and fixed deposits. No paid rankings, no sponsored placements."
                        primaryCta={{ text: 'Compare Mutual Funds', href: '/mutual-funds' }}
                        secondaryCta={{ text: 'SIP Calculator', href: '/calculators/sip' }}
                        badge="Independent Research"
                        variant="neutral"
                    />
                </div>
            </div>

            <MethodologyBanner />

            <main className="container mx-auto px-4 py-12 space-y-16">

                {/* ── Sub-category grid ─────────────────────────────────────── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Choose an Investment Category
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">
                        Select the product type you want to explore. Each section has filtered comparisons, data points, and guides.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {INVESTING_CATEGORIES.map(({ label, description, href, icon: Icon, cta, tags }) => (
                            <Link key={href} href={href} className="group">
                                <div className="h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-800 transition-all duration-200 p-6 flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-900/40 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/60 transition-colors">
                                            <Icon className="w-5 h-5 text-green-700 dark:text-green-400" strokeWidth={1.8} />
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-0.5 transition-all mt-1" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                            {label}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map(tag => (
                                            <span key={tag} className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                                        {cta} <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── Calculator quick links ────────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Calculator className="w-5 h-5 text-green-700 dark:text-green-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Investment Calculators</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {CALCULATORS.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 hover:border-green-500 hover:text-green-700 dark:hover:border-green-500 dark:hover:text-green-400 transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                        <Link
                            href="/calculators"
                            className="px-4 py-2 text-sm font-medium bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                        >
                            All Calculators →
                        </Link>
                    </div>
                </section>

                {/* ── Core asset classes (educational) ─────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen className="w-5 h-5 text-green-700 dark:text-green-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Understanding Asset Classes</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: 'Equity (Stocks & Funds)',
                                desc: 'Ownership in companies. Higher volatility, higher long-term return potential. Best for goals 5+ years away.',
                                icon: TrendingUp,
                            },
                            {
                                title: 'Fixed Income (Debt)',
                                desc: 'Loans to governments or corporates — bonds, FDs, debt mutual funds. Stable, lower returns. Good for capital preservation.',
                                icon: ShieldCheck,
                            },
                            {
                                title: 'Gold',
                                desc: 'Hedge against inflation and currency risk. Sovereign Gold Bonds, Gold ETFs, and digital gold are the structured options.',
                                icon: Gem,
                            },
                            {
                                title: 'Government Schemes',
                                desc: 'PPF, NPS, Sukanya Samriddhi Yojana — government-backed, tax-advantaged, long lock-in. Best for retirement and tax planning.',
                                icon: Shield,
                            },
                        ].map(({ title, desc, icon: Icon }) => (
                            <div key={title} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                                <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-3">
                                    <Icon className="w-4 h-4 text-green-700 dark:text-green-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FAQ ───────────────────────────────────────────────────── */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {FAQ_DATA.map((faq, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    {faq.q}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <AffiliateDisclosure />
            <ComplianceDisclaimer />
        </div>
    );
}
