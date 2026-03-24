"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ChevronRight,
    CreditCard,
    Home,
    Car,
    Sparkles,
    Info,
    ArrowUpRight,
    Clock,
    ShieldCheck,
    BarChart3,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Score Band Config ────────────────────────────────────────────────────────

const SCORE_BANDS = [
    {
        min: 300, max: 549, label: 'Poor', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200',
        gauge: '#EF4444', description: 'High risk profile. Most lenders will decline applications.',
    },
    {
        min: 550, max: 649, label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200',
        gauge: '#F97316', description: 'Below average. Limited product options with higher interest rates.',
    },
    {
        min: 650, max: 699, label: 'Good', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
        gauge: '#D97706', description: 'Average profile. Standard products available at regular rates.',
    },
    {
        min: 700, max: 749, label: 'Very Good', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
        gauge: '#16A34A', description: 'Strong profile. Access to premium products and negotiated rates.',
    },
    {
        min: 750, max: 900, label: 'Excellent', color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200',
        gauge: '#166534', description: 'Top-tier profile. Best rates, instant approvals, premium credit cards.',
    },
];

const SCORE_FACTORS = [
    { name: 'Payment History', weight: 35, icon: Clock, tip: 'Never miss an EMI or credit card payment. Set up auto-pay.' },
    { name: 'Credit Utilisation', weight: 30, icon: BarChart3, tip: 'Keep usage below 30% of your credit limit across all cards.' },
    { name: 'Credit Age', weight: 15, icon: ShieldCheck, tip: 'Keep your oldest credit card active. Don\'t close old accounts.' },
    { name: 'Credit Mix', weight: 10, icon: CreditCard, tip: 'A mix of credit cards, home loan, and personal loan helps.' },
    { name: 'New Inquiries', weight: 10, icon: Zap, tip: 'Avoid applying for multiple loans/cards within a short period.' },
];

const PRODUCT_BY_BAND: Record<string, { cards: string[], loans: string[], tip: string }> = {
    'Poor': {
        cards: ['Secured Credit Card (against FD)', 'HDFC MoneyBack (entry-level)'],
        loans: ['Gold Loan (against collateral)', 'NBFC Personal Loan (higher rate)'],
        tip: 'Focus on improving score first. Take a secured card to rebuild history.',
    },
    'Fair': {
        cards: ['SBI SimplySAVE', 'HDFC MoneyBack', 'Axis MY Zone'],
        loans: ['Personal Loan at 18-24%', 'Home Loan with higher down payment'],
        tip: 'You qualify for basic cards. Pay on time for 6 months to unlock better products.',
    },
    'Good': {
        cards: ['HDFC Regalia First', 'SBI Card PRIME', 'ICICI Coral'],
        loans: ['Personal Loan at 12-18%', 'Home Loan at market rate'],
        tip: 'Good standing. Reduce credit utilisation below 30% to move to Very Good.',
    },
    'Very Good': {
        cards: ['HDFC Regalia', 'Axis Magnus', 'SBI Card ELITE'],
        loans: ['Personal Loan at 10-12%', 'Home Loan at competitive rates'],
        tip: 'Strong profile. Maintain this score and negotiate better rates with lenders.',
    },
    'Excellent': {
        cards: ['HDFC Infinia', 'Axis Reserve', 'Amex Platinum', 'ICICI Emeralde'],
        loans: ['Personal Loan at 9-10.5%', 'Home Loan at best available rate'],
        tip: 'Top-tier. You can negotiate rates and get instant approvals on premium products.',
    },
};

const FAQS = [
    {
        q: 'What is a CIBIL score and why does it matter?',
        a: 'A CIBIL score is a 3-digit number (300–900) calculated by TransUnion CIBIL that represents your creditworthiness. Banks and NBFCs check this score before approving any loan or credit card. A score above 750 gives you access to the best rates and instant approvals.',
    },
    {
        q: 'How often is my CIBIL score updated?',
        a: 'CIBIL scores are typically updated once a month as lenders report your payment activity to the bureau. After you make improvements (like paying off debt or clearing dues), your score may take 30-45 days to reflect those changes.',
    },
    {
        q: 'Does checking my own CIBIL score affect it?',
        a: 'No. Checking your own score is a "soft inquiry" and has zero impact on your score. Only "hard inquiries" (when a lender pulls your score during a loan/card application) can slightly lower your score temporarily.',
    },
    {
        q: 'How quickly can I improve my CIBIL score?',
        a: 'Small improvements are visible in 1-2 months. Significant improvement (50-100 points) typically takes 6-12 months of consistent on-time payments and reduced credit utilisation. Negative items like settled accounts or defaults take 7 years to age off.',
    },
    {
        q: 'What CIBIL score do I need for a home loan?',
        a: 'Most banks require a minimum CIBIL score of 650-700 for home loan approval. However, to get the best interest rates (0.25-0.50% lower), you need a score of 750 or above. HDFC, SBI, and Kotak all offer preferential rates for scores above 750.',
    },
];

// ─── Gauge SVG Component ──────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
    const min = 300;
    const max = 900;
    const percentage = (score - min) / (max - min);
    const circumference = 251; // PI * 80 (radius)

    const band = SCORE_BANDS.find(b => score >= b.min && score <= b.max) || SCORE_BANDS[0];

    return (
        <div className="relative w-56 h-28 mx-auto">
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                {/* Track */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#E2E8F0" strokeWidth="18" strokeLinecap="round" />
                {/* Band color segments */}
                {SCORE_BANDS.map((b, i) => {
                    const startPct = (b.min - min) / (max - min);
                    const endPct = (b.max - min) / (max - min);
                    const segOffset = circumference - (circumference * startPct);
                    const segLength = circumference * (endPct - startPct);
                    return (
                        <path
                            key={i}
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke={b.gauge}
                            strokeWidth="18"
                            strokeLinecap="butt"
                            strokeDasharray={`${segLength} ${circumference}`}
                            strokeDashoffset={segOffset}
                            opacity="0.25"
                        />
                    );
                })}
                {/* Active progress */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={band.gauge}
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * percentage)}
                    className="transition-all duration-700 ease-out"
                />
                {/* Needle dot */}
                <circle
                    cx={100 + 80 * Math.cos(Math.PI * (1 - percentage))}
                    cy={100 - 80 * Math.sin(Math.PI * (1 - percentage))}
                    r="6"
                    fill={band.gauge}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            {/* Score display */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <p className={cn('text-4xl font-black tabular-nums transition-colors duration-500', band.color)}>{score}</p>
                <p className={cn('text-xs font-bold uppercase tracking-widest mt-0.5', band.color)}>{band.label}</p>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CibilScoreHubPage() {
    const [inputScore, setInputScore] = useState(750);
    const [displayScore, setDisplayScore] = useState(750);

    useEffect(() => {
        const t = setTimeout(() => setDisplayScore(inputScore), 0);
        return () => clearTimeout(t);
    }, [inputScore]);

    const currentBand = SCORE_BANDS.find(b => displayScore >= b.min && displayScore <= b.max) || SCORE_BANDS[0];
    const products = PRODUCT_BY_BAND[currentBand.label];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="CIBIL Score — Check, Understand & Improve Your Credit Score | InvestingPro"
                description="Check your CIBIL score range (300–900), see which credit cards and loans you qualify for, and get a personalised improvement plan. Free, no impact on your score."
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: FAQS.map(f => ({
                        '@type': 'Question',
                        name: f.q,
                        acceptedAnswer: { '@type': 'Answer', text: f.a },
                    })),
                }}
            />

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-green-500 text-white pt-28 pb-20">
                <div className="container mx-auto px-4">
                    <AutoBreadcrumbs className="mb-6 text-white/60" />
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm">
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                    No impact on your score
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                    Understand Your<br />
                                    <span className="text-amber-300">CIBIL Score</span>
                                </h1>
                                <p className="text-white/85 text-lg mb-8 leading-relaxed">
                                    India's most important 3-digit number. Slide to your score and instantly
                                    see which cards and loans you qualify for — plus a personalised action plan.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/cibil-score/simulator">
                                        <Button className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold h-12 px-6 rounded-xl">
                                            Simulate My Score
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </Link>
                                    <Link href="/loans/eligibility-checker">
                                        <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 h-12 px-6 rounded-xl">
                                            Check Loan Eligibility
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Interactive gauge card */}
                            <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden">
                                <CardContent className="p-8">
                                    <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">
                                        Your CIBIL Score
                                    </p>
                                    <ScoreGauge score={displayScore} />
                                    <div className="mt-8 space-y-3">
                                        <input
                                            type="range"
                                            min={300}
                                            max={900}
                                            step={1}
                                            value={inputScore}
                                            onChange={e => setInputScore(Number(e.target.value))}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        />
                                        <div className="flex justify-between text-xs text-slate-400 font-medium">
                                            <span>300</span>
                                            <span>Poor</span>
                                            <span>Good</span>
                                            <span>Excellent</span>
                                            <span>900</span>
                                        </div>
                                    </div>
                                    <div className={cn('mt-4 p-3 rounded-xl text-sm', currentBand.bg, currentBand.border, 'border', currentBand.color)}>
                                        {currentBand.description}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16">

                {/* ── Affiliate disclosure ─────────────────────────────── */}
                <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />

                {/* ── Score bands ──────────────────────────────────────── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">CIBIL Score Ranges Explained</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {SCORE_BANDS.map(band => (
                            <div
                                key={band.label}
                                className={cn(
                                    'p-4 rounded-2xl border-2 cursor-pointer transition-all',
                                    band.bg, band.border,
                                    displayScore >= band.min && displayScore <= band.max
                                        ? 'scale-105 shadow-lg ring-2 ring-offset-2'
                                        : 'opacity-70 hover:opacity-100',
                                )}
                                style={{ ringColor: band.gauge }}
                                onClick={() => setInputScore(Math.round((band.min + band.max) / 2))}
                            >
                                <p className={cn('text-2xl font-black tabular-nums', band.color)}>
                                    {band.min}–{band.max}
                                </p>
                                <p className={cn('font-bold text-sm mt-1', band.color)}>{band.label}</p>
                                <p className="text-xs text-slate-600 mt-2 leading-snug">{band.description.split('.')[0]}.</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Products for current score ────────────────────────── */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            With a score of {displayScore} ({currentBand.label})
                        </h2>
                        <Badge className={cn(currentBand.bg, currentBand.border, currentBand.color, 'border text-xs font-bold')}>
                            {currentBand.label}
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-bold text-lg">Credit Cards You Qualify For</h3>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    {products.cards.map((card, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                            {card}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/credit-cards">
                                    <Button variant="outline" size="sm" className="w-full rounded-xl">
                                        Compare All Cards <ArrowUpRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Home className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-bold text-lg">Loans Available to You</h3>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    {products.loans.map((loan, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                            {loan}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/loans">
                                    <Button variant="outline" size="sm" className="w-full rounded-xl">
                                        Compare All Loans <ArrowUpRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    <div className={cn('mt-4 p-4 rounded-2xl border flex items-start gap-3', currentBand.bg, currentBand.border)}>
                        <Info className={cn('w-5 h-5 shrink-0 mt-0.5', currentBand.color)} />
                        <p className={cn('text-sm font-medium', currentBand.color)}>{products.tip}</p>
                    </div>
                </section>

                {/* ── Score factors ─────────────────────────────────────── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What Affects Your CIBIL Score</h2>
                    <p className="text-slate-500 mb-6">Five factors determine your score. Here's how much each one matters:</p>
                    <div className="space-y-4">
                        {SCORE_FACTORS.map(factor => {
                            const Icon = factor.icon;
                            return (
                                <Card key={factor.name} className="rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                                                <Icon className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-bold text-slate-900 dark:text-white">{factor.name}</p>
                                                    <span className="text-primary-700 font-black text-lg">{factor.weight}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                                                    <div
                                                        className="bg-primary-600 h-2 rounded-full transition-all duration-700"
                                                        style={{ width: `${factor.weight}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-slate-500 flex items-start gap-1.5">
                                                    <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-green-500" />
                                                    {factor.tip}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* ── Simulator CTA ─────────────────────────────────────── */}
                <section className="bg-gradient-to-br from-primary-700 to-primary-600 rounded-3xl p-8 text-white text-center">
                    <Badge className="bg-white/20 border-white/30 text-white mb-4">New Tool</Badge>
                    <h2 className="text-3xl font-bold mb-3">CIBIL Score Simulator</h2>
                    <p className="text-white/85 max-w-xl mx-auto mb-6">
                        Enter your payment history, credit utilisation, and other factors to get a realistic
                        estimate of your CIBIL score — no registration required.
                    </p>
                    <Link href="/cibil-score/simulator">
                        <Button className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold h-12 px-8 rounded-xl text-base">
                            Try the Simulator
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </section>

                {/* ── FAQ ───────────────────────────────────────────────── */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <Card key={i} className="rounded-2xl">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                                        <span className="text-primary-600 font-black shrink-0">Q.</span>
                                        {faq.q}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed pl-5">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <ComplianceDisclaimer variant="compact" />
            </div>
        </div>
    );
}
