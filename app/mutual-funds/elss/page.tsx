import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
    ShieldCheck,
    IndianRupee,
    TrendingUp,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    Calculator,
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
    title: 'Best ELSS Tax Saving Mutual Funds India (2026) — Section 80C | InvestingPro',
    description:
        'Compare ELSS mutual funds to save up to ₹46,800 in tax under Section 80C. Shortest lock-in (3 years) among all 80C options. AMFI-registered funds, expert analysis.',
};

const ELSS_VS_OTHER = [
    { option: 'ELSS', lockIn: '3 years', returns: '12–14%* (market-linked)', tax80C: 'Yes', taxOnReturns: '12.5% LTCG above ₹1.25L' },
    { option: 'PPF', lockIn: '15 years', returns: '7.1% (fixed)', tax80C: 'Yes', taxOnReturns: 'Tax-free' },
    { option: 'NSC', lockIn: '5 years', returns: '7.7% (fixed)', tax80C: 'Yes', taxOnReturns: 'As per slab' },
    { option: 'Tax-Saver FD', lockIn: '5 years', returns: '6.5–7%', tax80C: 'Yes', taxOnReturns: 'As per slab' },
    { option: 'NPS Tier 1', lockIn: 'Till 60', returns: '9–11%*', tax80C: 'Yes (+ ₹50K extra)', taxOnReturns: '60% exempt on withdrawal' },
];

const ELSS_HIGHLIGHTS = [
    { icon: Clock, title: 'Shortest Lock-in', desc: '3 years vs 5–15 years for other 80C options', color: 'text-green-700 bg-green-50' },
    { icon: TrendingUp, title: 'Highest Return Potential', desc: 'Market-linked returns historically 12–14% p.a. over 10+ years', color: 'text-blue-700 bg-blue-50' },
    { icon: ShieldCheck, title: 'Section 80C Benefit', desc: 'Invest up to ₹1.5L — save up to ₹46,800 in tax', color: 'text-amber-700 bg-amber-50' },
    { icon: IndianRupee, title: 'Start with ₹500 SIP', desc: 'No need for lumpsum. SIP saves tax month by month', color: 'text-purple-700 bg-purple-50' },
];

export default async function ELSSPage() {
    let funds: Awaited<ReturnType<typeof getMutualFundsBySubcategory>> = [];
    try {
        funds = await getMutualFundsBySubcategory([
            'elss', 'tax saving', 'tax saver', 'equity linked savings', '80c', 'tax plan',
        ]);
    } catch (error) {
        console.error('[ELSSPage] Failed to load funds:', error);
        funds = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best ELSS Tax Saving Mutual Funds India (2026) — Section 80C | InvestingPro"
                description="Save up to ₹46,800 in tax with ELSS mutual funds under Section 80C. Lowest lock-in (3 years). Compare top ELSS funds with 1Y, 3Y, 5Y returns."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best ELSS Tax Saving Mutual Funds India 2026',
                    description: 'Compare ELSS funds for Section 80C tax saving. Expert-reviewed, AMFI-registered.',
                    url: 'https://investingpro.in/mutual-funds/elss',
                    numberOfItems: funds.length,
                }}
            />

            {/* Hero */}
            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best ELSS Tax Saving Funds"
                        subtitle="Save Tax. Grow Wealth. Both at Once."
                        description="ELSS is the only 80C investment that can grow your money at 12–14% while saving tax. Shortest lock-in of 3 years among all 80C instruments. Start SIP today."
                        primaryCta={{ text: 'Compare ELSS Funds', href: '/mutual-funds' }}
                        secondaryCta={{ text: 'Tax Saving Calculator', href: '/calculators/tax' }}
                        stats={[
                            { label: 'Funds Listed', value: `${funds.length || '20'}+` },
                            { label: 'Max 80C Deduction', value: '₹1.5L' },
                            { label: 'Tax Saving', value: '₹46,800' },
                        ]}
                        badge="AMFI-Registered • Section 80C Eligible • Updated March 2026"
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

                {/* Why ELSS */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6">
                        Why Choose ELSS for 80C?
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ELSS_HIGHLIGHTS.map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                                    <div className={`p-2 rounded-lg w-fit mb-3 ${item.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">{item.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ELSS vs other 80C */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-700 dark:text-green-400" />
                        <h2 className="font-bold text-slate-900 dark:text-slate-100">ELSS vs Other Section 80C Options</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                                    {['Option', 'Lock-in', 'Returns', '80C Eligible', 'Tax on Gains'].map(h => (
                                        <th key={h} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {ELSS_VS_OTHER.map((row, i) => (
                                    <tr
                                        key={row.option}
                                        className={`${i === 0 ? 'bg-green-50/50 dark:bg-green-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                                    >
                                        <td className={`px-4 py-3 font-semibold ${i === 0 ? 'text-green-800 dark:text-green-300' : 'text-slate-900 dark:text-slate-100'}`}>
                                            {row.option} {i === 0 && <span className="ml-1 text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded-full">Best</span>}
                                        </td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.lockIn}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.returns}</td>
                                        <td className="px-4 py-3">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{row.taxOnReturns}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/30 border-t text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        *Returns are historical averages. Market-linked returns are not guaranteed.
                    </div>
                </section>

                {/* Fund cards */}
                {funds.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6">
                            Top ELSS Funds — Expert Picks
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {funds.slice(0, 9).map(fund => (
                                <div
                                    key={fund.id}
                                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-green-300 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                            <ShieldCheck className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                                        </div>
                                        <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                                            80C Eligible
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 line-clamp-2">{fund.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                                        {fund.description || `ELSS fund from ${fund.provider_name}. 3-year lock-in. Section 80C eligible.`}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {fund.affiliate_url ? (
                                            <a
                                                href={fund.affiliate_url}
                                                target="_blank"
                                                rel="noopener noreferrer sponsored"
                                                className="flex-1 text-center text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg transition-colors"
                                            >
                                                Start SIP
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/mutual-funds/${fund.slug}`}
                                                className="flex-1 text-center text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg transition-colors"
                                            >
                                                View Fund
                                            </Link>
                                        )}
                                        <Link href={`/mutual-funds/${fund.slug}`} className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-0.5 transition-colors">
                                            Details <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Cross-links */}
                <section className="grid sm:grid-cols-3 gap-4">
                    {[
                        { href: '/calculators/tax', icon: Calculator, label: 'Income Tax Calculator', desc: 'Old vs New Regime comparison' },
                        { href: '/mutual-funds/best-sip', icon: TrendingUp, label: 'Best SIP Funds', desc: 'For goals beyond tax saving' },
                        { href: '/ppf-nps', icon: ShieldCheck, label: 'PPF & NPS', desc: 'Other 80C + 80CCD options' },
                    ].map(item => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md transition-all"
                            >
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                    <Icon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.label}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
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
