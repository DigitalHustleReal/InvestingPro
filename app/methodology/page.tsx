import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import { Scale, TrendingUp, Shield, FileText, CheckCircle2, IndianRupee, Users, Eye, AlertCircle, ChevronRight } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'How We Rank Products & Editorial Independence | InvestingPro',
    description: 'InvestingPro is independently funded by affiliate partnerships. Our rankings are never influenced by who pays us — here\'s exactly how we score every product.',
};

/**
 * Methodology Page
 * 
 * Explains how rankings are calculated - transparent, reproducible, explainable.
 * This is CRITICAL for YMYL (Your Money Your Life) compliance.
 */
export default function MethodologyPage() {
    return (
        <>
            <SEOHead
                title="How We Rank Products & Editorial Independence | InvestingPro"
                description="InvestingPro is funded by affiliate partnerships. Our rankings are never influenced by who pays us — here's exactly how we score every product."
                url="https://investingpro.in/methodology"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'How We Rank Products — Editorial Independence',
                    url: 'https://investingpro.in/methodology',
                    description: 'Full transparency about our ranking methodology and editorial independence policy.',
                }}
            />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

                {/* ── Hero ──────────────────────────────────────────────── */}
                <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 pt-24 pb-16">
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                            backgroundSize: '36px 36px',
                        }}
                    />
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <AutoBreadcrumbs className="mb-6 justify-center [&_*]:text-green-200 [&_a]:text-green-300" />
                        <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                            <Shield className="h-3.5 w-3.5" />
                            Last updated: March 2026
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 font-display">
                            How We Rank Products
                        </h1>
                        <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
                            We earn money through affiliate links when you apply for a product. That never changes our rankings.
                            Here is exactly how every score is calculated — and the firewall that keeps editorial and commercial separate.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            {[
                                { icon: Eye, label: 'Rankings are never sold' },
                                { icon: Users, label: 'Independent editorial team' },
                                { icon: CheckCircle2, label: 'Methodology is public' },
                            ].map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.label} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white">
                                        <Icon className="h-4 w-4 text-amber-300 shrink-0" />
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

                    {/* ── How we make money ─────────────────────────────── */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900 px-6 py-4 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0" />
                            <h2 className="font-bold text-amber-900 dark:text-amber-300 text-lg">
                                How InvestingPro Makes Money
                            </h2>
                        </div>
                        <div className="p-6 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            <p>
                                InvestingPro is free to use. We earn revenue when you click an "Apply Now" button and the partner bank or institution
                                receives your application. This is called an affiliate or referral fee. The fee is paid by the partner — not by you —
                                and does not change the terms of any product you apply for.
                            </p>
                            <p>
                                Some products we list pay us more than others. Some products we list have no affiliate relationship at all. Both
                                appear in our rankings based purely on their score.
                            </p>
                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4 flex gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-700 dark:text-green-400 shrink-0 mt-0.5" />
                                <p className="text-green-800 dark:text-green-300">
                                    <strong>The rule:</strong> A product's ranking position is determined entirely by its objective score.
                                    Commercial relationships have zero influence on ranking order. This is non-negotiable.
                                </p>
                            </div>
                            <p>
                                We always display an affiliate disclosure banner on every product listing page. If a product in our list has an affiliate
                                link, it is marked with "Ad" or the Apply button links to a tracked URL. We never hide this.
                            </p>
                        </div>
                    </div>

                    {/* ── Editorial firewall ────────────────────────────── */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-700 dark:text-green-400" />
                            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Editorial Independence</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        title: 'We do NOT do',
                                        items: [
                                            'Accept payment to improve a product\'s ranking position',
                                            'Remove negative data from a product listing for a fee',
                                            'Write sponsored "editorial" content without clear disclosure',
                                            'Let advertiser relationships influence review content',
                                            'Suppress competitor comparisons that favour rivals',
                                        ],
                                        color: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
                                        iconColor: 'text-red-600',
                                        icon: '✗',
                                    },
                                    {
                                        title: 'We DO',
                                        items: [
                                            'Rank products by objective, published scoring criteria',
                                            'Include products with no affiliate deal if they score well',
                                            'Show all fees, including those we don\'t earn on',
                                            'Label all affiliate links and sponsored placements',
                                            'Update rankings when product terms change, good or bad',
                                        ],
                                        color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
                                        iconColor: 'text-green-700',
                                        icon: '✓',
                                    },
                                ].map(block => (
                                    <div key={block.title} className={`rounded-xl border p-5 ${block.color}`}>
                                        <div className="font-semibold text-slate-900 dark:text-slate-100 mb-3">{block.title}</div>
                                        <ul className="space-y-2">
                                            {block.items.map(item => (
                                                <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <span className={`font-bold shrink-0 ${block.iconColor}`}>{block.icon}</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Review team ───────────────────────────────────── */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="h-5 w-5 text-green-700 dark:text-green-400" />
                            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Our Review Process</h2>
                        </div>
                        <div className="grid sm:grid-cols-4 gap-4">
                            {[
                                { step: '01', title: 'Data Collection', desc: 'Product terms sourced directly from bank/issuer websites, RBI filings, and AMFI data.' },
                                { step: '02', title: 'Scoring', desc: 'Automated scoring against published criteria. Reviewers verify edge cases and flag anomalies.' },
                                { step: '03', title: 'Verification', desc: 'Rate data marked with a "last verified" date. Stale data (>30 days) is flagged for update.' },
                                { step: '04', title: 'Publish', desc: 'Rankings update automatically as scores change. Big changes trigger a manual editorial review.' },
                            ].map(item => (
                                <div key={item.step}>
                                    <div className="text-3xl font-bold text-green-100 dark:text-green-900 font-display mb-2">{item.step}</div>
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">{item.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Per-vertical quick links ──────────────────────── */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-4 flex items-center gap-2">
                            <IndianRupee className="h-5 w-5 text-green-700 dark:text-green-400" />
                            Scoring by Product Category
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                            Jump to the detailed scoring breakdown for each vertical:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {[
                                { label: 'Credit Cards', href: '/scoring-matrix#credit-cards', desc: 'Travel Benefits 35% · Rewards Power 35% · Cost Efficiency (fees) 30% — user-adjustable' },
                                { label: 'Mutual Funds', href: '/scoring-matrix#mutual-funds', desc: '3-Year Returns 50% · Expense Ratio 30% · Fund Rating 20%' },
                                { label: 'Loans', href: '/scoring-matrix#loans', desc: 'Affordability (rate) 50% · Processing Cost 30% · Tenure Flexibility 20%' },
                                { label: 'Fixed Deposits', href: '/scoring-matrix#fixed-deposits', desc: 'Interest Rate 50% · Tenure Range 20% · Bank Safety 20% · Early Exit Penalty 10%' },
                                { label: 'Demat Accounts', href: '/scoring-matrix#demat-accounts', desc: 'Brokerage Cost 40% · Annual Charges 25% · Platform Quality 20% · Features 15%' },
                                { label: 'Term Insurance', href: '/scoring-matrix#insurance', desc: 'Claim Settlement 35% · Premium Value 30% · Insurer Strength 25% · Coverage 10%' },
                            ].map(item => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all group"
                                >
                                    <div className="flex-1">
                                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-0.5">{item.label}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 mt-0.5 shrink-0" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Contact editorial team ────────────────────────── */}
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-amber-900 dark:text-amber-300 mb-1">
                                    Spotted an error or outdated rate?
                                </div>
                                <p className="text-sm text-amber-800 dark:text-amber-400 mb-3">
                                    We take accuracy seriously. If you find incorrect data on any listing, please tell us.
                                    Our editorial team aims to fix verified errors within 48 hours.
                                </p>
                                <Link
                                    href="/contact-us"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300 hover:underline"
                                >
                                    Contact the editorial team
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Existing methodology detail sections below: */}

                    {/* Core Principles */}
                    <Card className="mb-8 border-2 border-primary-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-6 md:p-8">
                                <Shield className="w-6 h-6 text-primary-600" />
                                Core Principles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Deterministic</h3>
                                        <p className="text-sm text-slate-600">
                                            Same inputs always produce the same outputs. Rankings are reproducible.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Transparent</h3>
                                        <p className="text-sm text-slate-600">
                                            All factors, weights, and calculations are publicly disclosed.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Explainable</h3>
                                        <p className="text-sm text-slate-600">
                                            Every score has a detailed breakdown showing how it was calculated.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">Independent</h3>
                                        <p className="text-sm text-slate-600">
                                            Rankings are NOT influenced by monetization, affiliate relationships, or advertising.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Credit Cards Methodology */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-6 md:p-8">
                                <Scale className="w-6 h-6 text-primary-600" />
                                Credit Cards Ranking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Factors & Weights</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Annual Fee (lower is better)</span>
                                            <span className="text-sm text-slate-600">25%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Rewards Rate (higher is better)</span>
                                            <span className="text-sm text-slate-600">30%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Features Count</span>
                                            <span className="text-sm text-slate-600">15%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Interest Rate (lower is better)</span>
                                            <span className="text-sm text-slate-600">10%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Eligibility (easier is better)</span>
                                            <span className="text-sm text-slate-600">10%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Provider Trust</span>
                                            <span className="text-sm text-slate-600">10%</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Calculation Method</h3>
                                    <p className="text-sm text-slate-600">
                                        Each factor is normalized to a 0-100 scale, then multiplied by its weight.
                                        The sum of all weighted scores gives the total score (0-100).
                                        Products are ranked by total score in descending order.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mutual Funds Methodology */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-6 md:p-8">
                                <TrendingUp className="w-6 h-6 text-primary-600" />
                                Mutual Funds Ranking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Factors & Weights</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Returns (3Y weighted 50%, 5Y 30%, 1Y 20%)</span>
                                            <span className="text-sm text-slate-600">40%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Expense Ratio (lower is better)</span>
                                            <span className="text-sm text-slate-600">20%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Risk-Adjusted Returns (Sharpe ratio)</span>
                                            <span className="text-sm text-slate-600">20%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">AUM (larger is better, stability)</span>
                                            <span className="text-sm text-slate-600">10%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Fund Manager Experience</span>
                                            <span className="text-sm text-slate-600">10%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Loans Methodology */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-6 md:p-8">
                                <FileText className="w-6 h-6 text-primary-600" />
                                Personal Loans Ranking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Factors & Weights</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Interest Rate (lower is better)</span>
                                            <span className="text-sm text-slate-600">40%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Processing Fee (lower is better)</span>
                                            <span className="text-sm text-slate-600">20%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Loan Amount Range (higher max is better)</span>
                                            <span className="text-sm text-slate-600">15%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Eligibility (easier is better)</span>
                                            <span className="text-sm text-slate-600">15%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                                            <span className="text-sm font-medium">Provider Trust</span>
                                            <span className="text-sm text-slate-600">10%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Sources */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Data Sources & Provenance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4">
                                All data used in rankings comes from verified sources with full provenance tracking:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span>Every numeric value has a source URL, fetched_at timestamp, and update frequency</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span>Data is refreshed according to update frequency (daily, weekly, monthly)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span>All sources are verified and publicly accessible</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span>Raw data snapshots are stored for audit trail</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Versioning */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Versioning & Updates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4">
                                Ranking configurations are versioned. When weights or methodology change:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span>A new version is created with updated weights</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span>Previous rankings remain stored for historical reference</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                    <span>All ranking calculations are timestamped and reproducible</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Disclaimer */}
                    <div className="mt-8 p-6 md:p-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl">
                        <p className="text-sm text-amber-900 dark:text-amber-300">
                            <strong>Important:</strong> Rankings are based on publicly available data and our transparent methodology.
                            Rankings are for informational purposes only and do not constitute financial advice.
                            Users should consult with a qualified financial advisor before making decisions.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
