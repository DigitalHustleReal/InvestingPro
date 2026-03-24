import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Mail,
    Check,
    TrendingUp,
    IndianRupee,
    Shield,
    Bell,
    Star,
    ArrowRight,
    Users,
    BookOpen,
    Zap,
    ChevronRight,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import NewsletterSubscribe from '@/components/common/NewsletterSubscribe';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'InvestingPro Weekly — Free Personal Finance Newsletter for India',
    description:
        'Join InvestingPro Weekly. Get 5 actionable personal finance tips every Monday — interest rate changes, top credit card offers, SIP ideas, and tax-saving moves. Free forever.',
};

const RECENT_ISSUES = [
    {
        title: 'RBI Rate Cut: Which Home Loan Borrowers Benefit Most?',
        date: 'March 17, 2026',
        category: 'Loans',
        description: 'How the 25 bps cut flows to MCLR-linked vs repo-linked loans, and which banks have already passed it on.',
    },
    {
        title: '5 Credit Cards That Earn Points on UPI Payments',
        date: 'March 10, 2026',
        category: 'Credit Cards',
        description: 'Most cards exclude UPI — these five still reward every tap. Ranked by effective cashback rate.',
    },
    {
        title: 'SWP vs Dividend Plan: The Retirement Withdrawal Math',
        date: 'March 3, 2026',
        category: 'Mutual Funds',
        description: 'For a ₹1 crore portfolio targeting ₹50K/month, which approach gives more after tax?',
    },
    {
        title: 'Old vs New Tax Regime — Updated FY2026-27 Calculator',
        date: 'February 24, 2026',
        category: 'Tax',
        description: 'We ran the numbers for 8 salary slabs. New regime wins for most — here is exactly when it does not.',
    },
];

const WHAT_YOU_GET = [
    {
        icon: TrendingUp,
        title: 'Market Moves',
        description: 'RBI rate decisions, SEBI rule changes, FD rate shifts — what they mean for your money',
        color: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400',
    },
    {
        icon: IndianRupee,
        title: 'Best Offers This Week',
        description: 'Top credit card bonuses, FD rate hikes, and limited-time loan offers worth knowing about',
        color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400',
    },
    {
        icon: Zap,
        title: 'One Quick Win',
        description: 'A single action you can take this week to earn more, pay less, or build wealth faster',
        color: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400',
    },
    {
        icon: Shield,
        title: 'Scam Alert',
        description: 'The latest fraud tactics targeting Indian investors — with how to protect yourself',
        color: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400',
    },
    {
        icon: BookOpen,
        title: 'Deep Dive',
        description: 'One product category explained clearly — FD laddering, ELSS lock-in math, NPS tiers, etc.',
        color: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-900 dark:text-purple-400',
    },
    {
        icon: Bell,
        title: 'Rate Watch',
        description: 'Changes to home loan, FD, and credit card rates from the top 10 banks this week',
        color: 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
    },
];

export default function NewsletterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="InvestingPro Weekly — Free Personal Finance Newsletter for India"
                description="Get 5 actionable personal finance tips every Monday morning. RBI updates, best credit card offers, SIP ideas, and tax-saving moves — all explained simply. Free forever."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'NewsletterService',
                    name: 'InvestingPro Weekly',
                    description:
                        'Weekly personal finance newsletter for Indian investors — rate updates, product picks, and actionable tips.',
                    url: 'https://investingpro.in/newsletter',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
                }}
            />

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 pt-24 pb-20">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }}
                />
                <div className="absolute top-20 right-12 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4 max-w-3xl text-center">
                    <AutoBreadcrumbs className="mb-6 justify-center [&_*]:text-green-200 [&_a]:text-green-300" />

                    {/* Social proof badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6">
                        <Users className="h-3.5 w-3.5 text-amber-300" />
                        <span>Trusted by 12,000+ Indian investors</span>
                    </div>

                    {/* Newsletter icon */}
                    <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="h-8 w-8 text-amber-300" />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 font-display leading-tight">
                        InvestingPro{' '}
                        <span className="text-amber-300">Weekly</span>
                    </h1>
                    <p className="text-lg text-green-100 mb-2">
                        5 actionable personal finance tips, every Monday at 9 AM.
                    </p>
                    <p className="text-green-200 text-sm mb-10 max-w-lg mx-auto">
                        RBI rate changes, best credit card offers, SIP picks, tax moves — explained simply.
                        No fluff. No paid promotions in the editorial. Free forever.
                    </p>

                    {/* Subscribe form */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-lg mx-auto">
                        <NewsletterSubscribe variant="compact" />
                        <p className="mt-3 text-xs text-green-200">
                            No spam. Unsubscribe anytime. We respect your inbox.
                        </p>
                    </div>

                    {/* Stats row */}
                    <div className="mt-10 flex justify-center gap-8 text-center">
                        {[
                            { value: '12K+', label: 'Subscribers' },
                            { value: '47%', label: 'Open Rate' },
                            { value: 'Every Monday', label: 'Delivery' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div className="text-xl font-bold text-white font-display">{stat.value}</div>
                                <div className="text-xs text-green-300 mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-4xl py-16 space-y-16">
                {/* ── What you get ─────────────────────────────────────── */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                            What's in every issue
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
                            Six sections. Designed to be read in under 5 minutes.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {WHAT_YOU_GET.map(item => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className={`rounded-xl border p-5 ${item.color} bg-opacity-50`}
                                >
                                    <div className="flex items-center gap-2.5 mb-2.5">
                                        <div className="p-1.5 bg-white/50 dark:bg-white/10 rounded-lg">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                            {item.title}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Recent issues ─────────────────────────────────────── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                                Recent Issues
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                See what our readers got in their inbox this month
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {RECENT_ISSUES.map(issue => (
                            <div
                                key={issue.title}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4"
                            >
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-xl shrink-0">
                                    <Mail className="h-5 w-5 text-green-700 dark:text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                            {issue.category}
                                        </span>
                                        <span className="text-xs text-slate-400">{issue.date}</span>
                                    </div>
                                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                                        {issue.title}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {issue.description}
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0 mt-1" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Testimonials ─────────────────────────────────────── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 text-center">
                        What readers say
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            {
                                quote: "Best personal finance email I receive. Clear, actionable, India-specific. Not sponsored garbage.",
                                name: "Priya M.",
                                location: "Bangalore",
                                stars: 5,
                            },
                            {
                                quote: "The rate watch section alone has saved me thousands by switching my FD at the right time.",
                                name: "Arjun T.",
                                location: "Mumbai",
                                stars: 5,
                            },
                            {
                                quote: "Finally, a newsletter that explains finance without talking down to me. Subscribed for 8 months now.",
                                name: "Deepa K.",
                                location: "Hyderabad",
                                stars: 5,
                            },
                        ].map(t => (
                            <div
                                key={t.name}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                            >
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: t.stars }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-4 leading-relaxed">
                                    "{t.quote}"
                                </p>
                                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                    {t.name}
                                    <span className="font-normal text-slate-500 dark:text-slate-400 ml-1">
                                        · {t.location}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Final CTA ─────────────────────────────────────────── */}
                <section className="bg-gradient-to-br from-green-700 to-green-800 rounded-3xl p-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.4) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />
                    <div className="relative">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {[Check, Check, Check].map((Icon, i) => (
                                <div key={i} className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                    <Icon className="h-3 w-3 text-white" />
                                </div>
                            ))}
                        </div>
                        <h2 className="text-3xl font-bold text-white font-display mb-3">
                            Join 12,000+ smart Indian investors
                        </h2>
                        <p className="text-green-100 mb-8 max-w-md mx-auto text-sm">
                            Your first issue arrives next Monday. Unsubscribe anytime with one click.
                            We never sell your data.
                        </p>
                        <div className="max-w-sm mx-auto">
                            <NewsletterSubscribe variant="compact" />
                        </div>
                    </div>
                </section>

                {/* ── Browse our tools ─────────────────────────────────── */}
                <section className="grid sm:grid-cols-2 gap-4">
                    <Link
                        href="/calculators"
                        className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all"
                    >
                        <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                            <Zap className="h-5 w-5 text-green-700 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">Financial Calculators</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">SIP, EMI, PPF, Tax and more</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link
                        href="/credit-cards"
                        className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md transition-all"
                    >
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                            <IndianRupee className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">Compare Credit Cards</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">Find the best card for your lifestyle</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                </section>
            </div>
        </div>
    );
}
