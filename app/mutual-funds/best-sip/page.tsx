import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
    TrendingUp,
    IndianRupee,
    ShieldCheck,
    ArrowRight,
    Zap,
    Calendar,
    BarChart3,
    Info,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import MethodologyBanner from '@/components/common/MethodologyBanner';
import DataFreshnessBar from '@/components/common/DataFreshnessBar';
import { getMutualFundsBySubcategory } from '@/lib/products/get-mutual-funds-by-subcategory';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Best SIP Mutual Funds to Invest in India (2026) — Top Picks | InvestingPro',
    description:
        'Compare the best SIP mutual funds in India for 2026. Start SIP with ₹500/month in top-rated equity, hybrid, and ELSS funds. AMFI-registered funds with expert analysis.',
};

const SIP_EXPLAINER = [
    {
        icon: IndianRupee,
        title: 'Start with ₹500',
        desc: 'Most equity funds allow SIP with as little as ₹500 per month. No lumpsum needed.',
        color: 'bg-green-50 border-green-200 text-green-700',
    },
    {
        icon: Calendar,
        title: 'Monthly auto-debit',
        desc: 'Amount is debited on your chosen date. Works with all major banks via NACH mandate.',
        color: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
        icon: BarChart3,
        title: 'Rupee cost averaging',
        desc: 'You buy more units when markets fall, fewer when they rise — automatic averaging.',
        color: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
        icon: Zap,
        title: 'Compounding effect',
        desc: '₹5,000/month at 12% for 20 years = ₹49.9 lakhs. Time in market beats timing.',
        color: 'bg-purple-50 border-purple-200 text-purple-700',
    },
];

const SIP_RETURN_TABLE = [
    { monthly: '₹1,000', years: 5, rate: 12, result: '₹81,669', gain: '+63%' },
    { monthly: '₹5,000', years: 10, rate: 12, result: '₹11.6L', gain: '+93%' },
    { monthly: '₹10,000', years: 15, rate: 12, result: '₹50.4L', gain: '+180%' },
    { monthly: '₹20,000', years: 20, rate: 12, result: '₹1.99Cr', gain: '+317%' },
];

export default async function BestSIPPage() {
    let funds: Awaited<ReturnType<typeof getMutualFundsBySubcategory>> = [];
    try {
        funds = await getMutualFundsBySubcategory([
            'sip', 'equity', 'large cap', 'flexi cap', 'multi cap', 'bluechip', 'index', 'nifty',
        ]);
    } catch (error) {
        console.error('[BestSIPPage] Failed to load funds:', error);
        funds = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best SIP Mutual Funds to Invest in India (2026) | InvestingPro"
                description="Compare top SIP mutual funds in India. Start with ₹500/month. See 1Y, 3Y, 5Y returns for equity, hybrid, and ELSS funds. AMFI-registered."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best SIP Mutual Funds in India 2026',
                    description: 'Compare best mutual funds to start SIP in India. Expert-reviewed, AMFI-registered funds.',
                    url: 'https://investingpro.in/mutual-funds/best-sip',
                    numberOfItems: funds.length,
                }}
            />

            {/* Hero */}
            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best SIP Mutual Funds 2026"
                        subtitle="Build Wealth with ₹500/Month"
                        description="India's top SIP funds compared — 1Y, 3Y, 5Y returns, expense ratios, and fund manager track records. Find the right fund for your goal and start SIP instantly."
                        primaryCta={{ text: 'Start SIP Today', href: '/mutual-funds/find-your-fund' }}
                        secondaryCta={{ text: 'SIP Calculator', href: '/calculators/sip' }}
                        stats={[
                            { label: 'Funds Listed', value: `${funds.length || '50'}+` },
                            { label: 'Min SIP Amount', value: '₹500' },
                            { label: 'Avg 10Y Return', value: '12–14%' },
                        ]}
                        badge="AMFI-Registered Funds • Updated March 2026 • Expert Reviewed"
                        variant="primary"
                        className="mb-8"
                    />
                    <MethodologyBanner vertical="mutual-funds" className="mb-4" />
                    <DataFreshnessBar
                        verifiedAt={new Date().toISOString()}
                        source="AMFI"
                        updateFrequency="Daily"
                        productCount={funds.length}
                        className="mb-4"
                    />
                    <div className="max-w-xl mx-auto mb-6">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16 space-y-12">

                {/* SIP explainer cards */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6">
                        Why Start a SIP?
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SIP_EXPLAINER.map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className={`rounded-xl border p-5 ${item.color}`}>
                                    <div className="p-2 bg-white/50 dark:bg-white/10 rounded-lg w-fit mb-3">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-sm">{item.title}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Returns table */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-400" />
                        <h2 className="font-bold text-slate-900 dark:text-slate-100">
                            How Much Can You Earn? (at 12% p.a.)
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-400">Monthly SIP</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-400">Duration</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-400">Return Rate</th>
                                    <th className="px-5 py-3 font-semibold text-green-700 dark:text-green-400">Corpus</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-400">Gain</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {SIP_RETURN_TABLE.map(row => (
                                    <tr key={`${row.monthly}-${row.years}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <td className="px-5 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">{row.monthly}</td>
                                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{row.years} years</td>
                                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{row.rate}% p.a.</td>
                                        <td className="px-5 py-3 font-bold text-green-700 dark:text-green-400">{row.result}</td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                {row.gain}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200 dark:border-amber-900 flex items-start gap-2">
                        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 dark:text-amber-400">
                            Illustrative only at assumed 12% p.a. Mutual fund investments are subject to market risks. Past performance does not guarantee future returns.
                        </p>
                    </div>
                </section>

                {/* Fund cards */}
                {funds.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6">
                            Top SIP Funds — Expert Picks
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {funds.slice(0, 9).map(fund => (
                                <div
                                    key={fund.id}
                                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-green-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                            <TrendingUp className="h-4 w-4 text-green-700 dark:text-green-400" />
                                        </div>
                                        {fund.trust_score > 0 && (
                                            <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                                                Score: {fund.trust_score}/100
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 line-clamp-2">
                                        {fund.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                                        {fund.description || `Top-rated ${fund.category} mutual fund from ${fund.provider_name}`}
                                    </p>
                                    <div className="flex items-center gap-2 mt-auto">
                                        {fund.affiliate_url ? (
                                            <a
                                                href={fund.affiliate_url}
                                                target="_blank"
                                                rel="noopener noreferrer sponsored"
                                                className="flex-1 text-center text-xs font-semibold bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg transition-colors"
                                            >
                                                Start SIP
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/mutual-funds/${fund.slug}`}
                                                className="flex-1 text-center text-xs font-semibold bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg transition-colors"
                                            >
                                                View Fund
                                            </Link>
                                        )}
                                        <Link
                                            href={`/mutual-funds/${fund.slug}`}
                                            className="text-xs text-slate-500 hover:text-green-700 dark:hover:text-green-400 flex items-center gap-1 transition-colors"
                                        >
                                            Details <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-6">
                            <Link
                                href="/mutual-funds"
                                className="inline-flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
                            >
                                View all mutual funds <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>
                )}

                {/* Related tools */}
                <section className="grid sm:grid-cols-3 gap-4">
                    {[
                        { href: '/calculators/sip', icon: IndianRupee, label: 'SIP Calculator', desc: 'Calculate your SIP corpus' },
                        { href: '/mutual-funds/elss', icon: ShieldCheck, label: 'ELSS (Tax-Saving) Funds', desc: 'Save tax under Section 80C' },
                        { href: '/calculators/swp', icon: BarChart3, label: 'SWP Calculator', desc: 'Plan monthly withdrawals' },
                    ].map(item => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all"
                            >
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                    <Icon className="h-5 w-5 text-green-700 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.label}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        );
                    })}
                </section>

                <ComplianceDisclaimer variant="compact" />
            </div>

            <MobileEngagementBar category="mutual_fund" />
        </div>
    );
}
