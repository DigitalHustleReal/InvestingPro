import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, ArrowRight, BarChart3 } from 'lucide-react';
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
    title: 'Best Large Cap Mutual Funds India (2026) — Top Nifty 50 Funds | InvestingPro',
    description: 'Compare best large cap mutual funds in India. Stable returns from top 100 companies. Lower risk vs mid/small cap. Ideal for conservative equity investors.',
};

export default async function LargeCapPage() {
    let funds: Awaited<ReturnType<typeof getMutualFundsBySubcategory>> = [];
    try {
        funds = await getMutualFundsBySubcategory([
            'large cap', 'largecap', 'large-cap', 'bluechip', 'nifty 50', 'nifty100', 'top 100',
        ]);
    } catch (error) {
        console.error('[LargeCapPage] Failed to load funds:', error);
        funds = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Large Cap Mutual Funds India (2026) | InvestingPro"
                description="Compare best large cap mutual funds — top 100 Indian companies, stable returns, lower volatility. Ideal for long-term wealth creation with moderate risk."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Best Large Cap Mutual Funds India 2026',
                    url: 'https://investingpro.in/mutual-funds/large-cap',
                    numberOfItems: funds.length,
                }}
            />
            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Best Large Cap Mutual Funds"
                        subtitle="India's Blue-Chip Companies. Steady Growth."
                        description="Large cap funds invest in the top 100 companies by market cap — think Reliance, TCS, HDFC Bank. Lower volatility than mid/small cap. Ideal first equity investment."
                        primaryCta={{ text: 'Compare Large Cap Funds', href: '/mutual-funds' }}
                        secondaryCta={{ text: 'SIP Calculator', href: '/calculators/sip' }}
                        stats={[
                            { label: 'Funds Listed', value: `${funds.length || '15'}+` },
                            { label: 'Risk Level', value: 'Moderate' },
                            { label: 'Avg 10Y Return', value: '11–13%' },
                        ]}
                        badge="AMFI-Regulated • Top 100 Companies • Updated March 2026"
                        variant="primary"
                        className="mb-8"
                    />
                    <MethodologyBanner vertical="mutual-funds" className="mb-4" />
                    <DataFreshnessBar verifiedAt={new Date().toISOString()} source="AMFI" updateFrequency="Daily" productCount={funds.length} className="mb-4" />
                    <div className="max-w-xl mx-auto mb-6">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16 space-y-10">
                {/* Who should invest */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-700 dark:text-green-400" />
                        Who Should Invest in Large Cap Funds?
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
                        {[
                            'First-time equity investors moving from FDs',
                            'Investors with 5–7 year investment horizon',
                            'Risk-averse investors who still want equity growth',
                            'Portfolio anchor for aggressive mid/small cap exposure',
                        ].map(item => (
                            <div key={item} className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-600 shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Fund cards */}
                {funds.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">Top Large Cap Funds</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {funds.slice(0, 9).map(fund => (
                                <div key={fund.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-green-300 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg"><TrendingUp className="h-4 w-4 text-green-700" /></div>
                                        {fund.trust_score > 0 && <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold">Score: {fund.trust_score}</span>}
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 line-clamp-2">{fund.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{fund.description || `Large cap fund from ${fund.provider_name}`}</p>
                                    <div className="flex items-center gap-2">
                                        <Link href={fund.affiliate_url ?? `/mutual-funds/${fund.slug}`} target={fund.affiliate_url ? '_blank' : undefined} rel={fund.affiliate_url ? 'noopener noreferrer sponsored' : undefined} className="flex-1 text-center text-xs font-semibold bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg transition-colors">
                                            {fund.affiliate_url ? 'Invest Now' : 'View Fund'}
                                        </Link>
                                        <Link href={`/mutual-funds/${fund.slug}`} className="text-xs text-slate-500 hover:text-green-700 flex items-center gap-0.5">Details <ArrowRight className="h-3 w-3" /></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related */}
                <section className="grid sm:grid-cols-3 gap-4">
                    {[
                        { href: '/mutual-funds/mid-cap', icon: BarChart3, label: 'Mid Cap Funds', desc: 'Higher growth, moderate risk' },
                        { href: '/mutual-funds/best-sip', icon: TrendingUp, label: 'Best SIP Funds', desc: 'Top picks across categories' },
                        { href: '/calculators/sip', icon: ShieldCheck, label: 'SIP Calculator', desc: 'Project your corpus' },
                    ].map(item => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href} className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all">
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg"><Icon className="h-5 w-5 text-green-700 dark:text-green-400" /></div>
                                <div className="flex-1"><div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.label}</div><div className="text-xs text-slate-500">{item.desc}</div></div>
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
