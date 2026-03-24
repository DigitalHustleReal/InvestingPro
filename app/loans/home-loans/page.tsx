import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
    TrendingDown,
    IndianRupee,
    ShieldCheck,
    ArrowRight,
    Calculator,
    AlertCircle,
    CheckCircle2,
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
import CibilCrossLink from '@/components/common/CibilCrossLink';
import { HomeLoanRateTable } from '@/components/common/RateWatchTable';
import { getLiveRates } from '@/lib/rates/get-live-rates';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Best Home Loan Rates India (2026) — All Banks Compared | InvestingPro',
    description:
        'Compare home loan rates from all major Indian banks. SBI from 8.35%, HDFC from 8.50%. See how your CIBIL score affects your rate. Calculate EMI instantly.',
};

const CIBIL_IMPACT_TABLE = [
    { range: '800+', label: 'Excellent', rate: '8.35–8.50%', emi60L: '₹51,783', totalInterest: '₹64.3L', tag: 'Best rates', color: 'text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950/30 dark:border-green-900' },
    { range: '750–799', label: 'Very Good', rate: '8.50–8.75%', emi60L: '₹52,493', totalInterest: '₹67.0L', tag: 'Good rates', color: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/30 dark:border-blue-900' },
    { range: '700–749', label: 'Good', rate: '8.75–9.25%', emi60L: '₹53,784', totalInterest: '₹71.1L', tag: 'Higher rate', color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/30 dark:border-amber-900' },
    { range: '650–699', label: 'Fair', rate: '9.25–10.00%', emi60L: '₹55,482', totalInterest: '₹77.2L', tag: 'Much higher', color: 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-950/30 dark:border-orange-900' },
    { range: 'Below 650', label: 'Poor', rate: 'Often rejected', emi60L: '—', totalInterest: '—', tag: 'Likely rejected', color: 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/30 dark:border-red-900' },
];

const PROCESS_STEPS = [
    { step: '01', title: 'Check your CIBIL', desc: 'Free check — no hard enquiry. Know your score before applying. 750+ gets you the best rate.', href: '/cibil-score' },
    { step: '02', title: 'Compare rates', desc: 'Use our live rate table above. Compare total cost, not just headline rate. Check processing fees too.', href: '#rate-table' },
    { step: '03', title: 'Calculate EMI', desc: 'Use our EMI calculator to find your comfortable repayment. 40% of take-home pay is the safe limit.', href: '/calculators/emi' },
    { step: '04', title: 'Apply & negotiate', desc: 'Apply to 2–3 banks simultaneously. Use competing offers to negotiate — banks often match the best rate.', href: '/loans' },
];

const COMMON_MISTAKES = [
    { mistake: 'Applying without checking CIBIL first', impact: 'Hard enquiries lower your score. Every rejection makes the next approval harder.' },
    { mistake: 'Comparing only headline rates', impact: 'Processing fees of 0.5–1% on ₹60L = ₹30,000–₹60,000 extra. Add to total cost.' },
    { mistake: 'Choosing maximum tenure for lower EMI', impact: '20yr vs 15yr on ₹50L at 8.5%: saves ₹7,000/mo EMI but pays ₹19L extra interest.' },
    { mistake: 'Not reading pre-payment penalty clause', impact: 'Floating rate loans: RBI mandates zero pre-payment penalty. Fixed rate: read the clause carefully.' },
    { mistake: 'Missing Section 24 + 80C dual benefit', impact: '₹2L deduction on interest (Sec 24B) + ₹1.5L on principal (80C) = ₹3.5L deduction every year.' },
];

export default async function HomeLoanPage() {
    let homeLoanRates: Awaited<ReturnType<typeof getLiveRates>>['homeLoanRates'] = [];
    let updatedAt = 'Today';

    try {
        const data = await getLiveRates();
        homeLoanRates = data.homeLoanRates;
        updatedAt = data.updatedAt;
    } catch (error) {
        console.error('[HomeLoanPage] Failed to load rates:', error);
    }

    const bestRate = homeLoanRates[0]?.rate ?? '8.35%';
    const bankCount = homeLoanRates.length || 8;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Home Loan Rates India (2026) — All Banks Compared | InvestingPro"
                description={`Compare home loan rates from ${bankCount} Indian banks. SBI from ${bestRate}. See CIBIL impact on your rate. Calculate EMI, compare total cost.`}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'FinancialProduct',
                    name: 'Home Loans in India',
                    description: 'Compare home loan interest rates from all major Indian banks. Updated daily.',
                    url: 'https://investingpro.in/loans/home-loans',
                    offers: homeLoanRates.slice(0, 3).map(r => ({
                        '@type': 'Offer',
                        name: `${r.bank} Home Loan`,
                        description: `Starting from ${r.rate} p.a.`,
                    })),
                }}
            />

            {/* Hero */}
            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs />
                    <CategoryHero
                        title="Home Loan Rates Today"
                        subtitle={`${bankCount} Banks Compared · Updated ${updatedAt}`}
                        description={`Starting from ${bestRate} p.a. Your actual rate depends on your CIBIL score — a difference of 100 CIBIL points can mean ₹9.8L extra interest on a ₹60L loan over 20 years.`}
                        primaryCta={{ text: 'Check Free CIBIL', href: '/cibil-score' }}
                        secondaryCta={{ text: 'Calculate EMI', href: '/calculators/emi' }}
                        stats={[
                            { label: 'Banks Compared', value: `${bankCount}` },
                            { label: 'Lowest Rate', value: bestRate },
                            { label: 'Disclosed Commission', value: '1–2%' },
                        ]}
                        badge="RBI Regulated · Commission Disclosed · Updated Daily"
                        variant="primary"
                        className="mb-8"
                    />
                    <MethodologyBanner vertical="loans" className="mb-4" />
                    <DataFreshnessBar
                        verifiedAt={new Date().toISOString()}
                        source="RBI"
                        updateFrequency="Daily"
                        productCount={bankCount}
                        className="mb-4"
                    />
                    <div className="max-w-xl mx-auto mb-6">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
                    <CibilCrossLink context="loans" className="mb-4" />
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16 space-y-12">

                {/* Live rate table */}
                <section id="rate-table">
                    <HomeLoanRateTable rates={homeLoanRates} updatedAt={updatedAt} />
                </section>

                {/* CIBIL impact on rate */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5 text-green-700 dark:text-green-400" />
                            How Your CIBIL Score Affects Your Home Loan Rate
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            On a ₹60L loan over 20 years — the difference between 700 and 800 CIBIL is{' '}
                            <strong className="text-red-600 dark:text-red-400">₹9.8 lakh extra interest.</strong>
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left">
                                    {['CIBIL Range', 'Profile', 'Rate Range', 'EMI (₹60L/20yr)', 'Total Interest', 'Status'].map(h => (
                                        <th key={h} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap text-sm">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {CIBIL_IMPACT_TABLE.map(row => (
                                    <tr key={row.range} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">{row.range}</td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm">{row.label}</td>
                                        <td className="px-4 py-3 font-mono font-semibold text-slate-800 dark:text-slate-200 text-sm">{row.rate}</td>
                                        <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300 text-sm">{row.emi60L}</td>
                                        <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300 text-sm">{row.totalInterest}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${row.color}`}>
                                                {row.tag}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 bg-green-50/40 dark:bg-green-950/10">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Improve your score before applying — 3 months of on-time payments can lift CIBIL by 15–30 points.
                        </p>
                        <Link href="/cibil-score" className="shrink-0 text-xs font-semibold text-green-700 dark:text-green-400 hover:underline flex items-center gap-1">
                            Check CIBIL free <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </section>

                {/* 4-step process */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6">
                        The 4-Step Home Loan Process
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PROCESS_STEPS.map(item => (
                            <Link
                                key={item.step}
                                href={item.href}
                                className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-green-300 hover:shadow-md transition-all"
                            >
                                <div className="text-3xl font-bold text-green-100 dark:text-green-900/40 font-display mb-3 select-none">{item.step}</div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-2">{item.title}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</div>
                                <div className="mt-3 text-xs text-green-700 dark:text-green-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Go <ArrowRight className="h-3 w-3" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Mistakes to avoid */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2 text-lg">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        5 Mistakes That Cost Indian Home Loan Borrowers Lakhs
                    </h2>
                    <div className="space-y-3">
                        {COMMON_MISTAKES.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-[11px] font-bold mt-0.5">
                                    {i + 1}
                                </span>
                                <div>
                                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.mistake}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.impact}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tax benefits */}
                <section className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg shrink-0">
                            <IndianRupee className="h-5 w-5 text-green-700 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-green-900 dark:text-green-200 mb-3">
                                Home Loan = ₹3.5L Tax Deduction Every Year
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {[
                                    { label: 'Section 24B — Interest', value: 'Up to ₹2L/year on interest paid (self-occupied property)' },
                                    { label: 'Section 80C — Principal', value: 'Up to ₹1.5L/year on principal repayment' },
                                    { label: 'Section 80EEA — First home', value: 'Extra ₹1.5L for first-time buyers (affordable housing)' },
                                    { label: 'HRA + Home Loan', value: 'Both claimable if you own home in a different city' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-start gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-green-900 dark:text-green-200 text-xs">{item.label}</div>
                                            <div className="text-xs text-green-700 dark:text-green-400">{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/calculators/tax" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-800 dark:text-green-300 hover:underline">
                                Calculate your tax saving with home loan <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Related tools */}
                <section className="grid sm:grid-cols-3 gap-4">
                    {[
                        { href: '/calculators/emi', icon: Calculator, label: 'EMI Calculator', desc: 'Monthly EMI for any rate & tenure' },
                        { href: '/cibil-score', icon: ShieldCheck, label: 'Free CIBIL Check', desc: 'Know your score before applying' },
                        { href: '/loans', icon: BarChart3, label: 'All Loan Products', desc: 'Personal, car, education loans' },
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

            <MobileEngagementBar category="loan" />
        </div>
    );
}
