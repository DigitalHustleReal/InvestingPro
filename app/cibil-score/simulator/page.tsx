"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import Link from 'next/link';
import {
    Clock,
    BarChart3,
    ShieldCheck,
    CreditCard,
    Zap,
    ChevronRight,
    TrendingUp,
    RefreshCw,
    CheckCircle2,
    Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Score Calculation Logic ──────────────────────────────────────────────────

interface SimulatorInputs {
    paymentHistory: 'always' | 'mostly' | 'sometimes' | 'often';
    utilisation: number; // 0–100
    creditAge: 'over5y' | '2to5y' | '1to2y' | 'under1y';
    creditMix: 'both' | 'cardsOnly' | 'loansOnly' | 'none';
    recentInquiries: 0 | 1 | 2 | 3;
}

function calculateEstimatedScore(inputs: SimulatorInputs): { score: number; min: number; max: number } {
    let base = 300;

    // Payment History (35% → up to 210 pts)
    const paymentPts = { always: 210, mostly: 150, sometimes: 80, often: 20 };
    base += paymentPts[inputs.paymentHistory];

    // Credit Utilisation (30% → up to 180 pts)
    const util = inputs.utilisation;
    if (util <= 10) base += 180;
    else if (util <= 20) base += 160;
    else if (util <= 30) base += 130;
    else if (util <= 50) base += 80;
    else if (util <= 70) base += 40;
    else base += 10;

    // Credit Age (15% → up to 90 pts)
    const agePts = { over5y: 90, '2to5y': 65, '1to2y': 35, under1y: 10 };
    base += agePts[inputs.creditAge];

    // Credit Mix (10% → up to 60 pts)
    const mixPts = { both: 60, cardsOnly: 35, loansOnly: 30, none: 0 };
    base += mixPts[inputs.creditMix];

    // New Inquiries (10% → negative impact)
    const inquiryPenalty = [0, 20, 40, 60];
    base -= inquiryPenalty[inputs.recentInquiries];

    const score = Math.min(900, Math.max(300, Math.round(base)));
    return { score, min: Math.max(300, score - 30), max: Math.min(900, score + 30) };
}

function getScoreBand(score: number) {
    if (score >= 750) return { label: 'Excellent', color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200', gauge: '#166534' };
    if (score >= 700) return { label: 'Very Good', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', gauge: '#16A34A' };
    if (score >= 650) return { label: 'Good', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', gauge: '#D97706' };
    if (score >= 550) return { label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', gauge: '#F97316' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', gauge: '#EF4444' };
}

function getImprovementTips(inputs: SimulatorInputs): string[] {
    const tips: string[] = [];
    if (inputs.paymentHistory !== 'always') tips.push('Set up auto-pay for all EMIs and credit card bills — payment history is the biggest factor (35%).');
    if (inputs.utilisation > 30) tips.push(`Reduce credit card usage from ${inputs.utilisation}% to below 30% — pay down ₹${Math.round(inputs.utilisation * 1000)} per ₹1L limit.`);
    if (inputs.creditAge === 'under1y' || inputs.creditAge === '1to2y') tips.push('Keep your oldest credit account open. Credit age improves automatically over time — don\'t close old cards.');
    if (inputs.creditMix === 'none' || inputs.creditMix === 'cardsOnly') tips.push('A mix of credit products (credit card + a term loan) helps your score. Consider a small personal loan or home loan.');
    if (inputs.recentInquiries >= 2) tips.push('Stop applying for new credit for at least 6 months. Each hard inquiry drops your score by 5-10 points.');
    if (tips.length === 0) tips.push('Excellent habits! Maintain on-time payments and low utilisation to hold your score above 750.');
    return tips;
}

// ─── Score Gauge (mini) ───────────────────────────────────────────────────────

function MiniGauge({ score }: { score: number }) {
    const band = getScoreBand(score);
    const pct = (score - 300) / 600;
    const circ = 251;
    return (
        <div className="relative w-44 h-22 mx-auto">
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#E2E8F0" strokeWidth="18" strokeLinecap="round" />
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={band.gauge}
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ - circ * pct}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <p className={cn('text-3xl font-black tabular-nums transition-colors duration-500', band.color)}>{score}</p>
                <p className={cn('text-xs font-bold uppercase tracking-widest', band.color)}>{band.label}</p>
            </div>
        </div>
    );
}

// ─── Selector Component ───────────────────────────────────────────────────────

function OptionGroup<T extends string>({
    label, options, value, onChange, icon: Icon,
}: {
    label: string;
    options: { value: T; label: string; sub?: string }[];
    value: T;
    onChange: (v: T) => void;
    icon: React.ElementType;
}) {
    return (
        <div>
            <Label className="text-base font-bold mb-3 flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-600" />
                {label}
            </Label>
            <div className="grid grid-cols-2 gap-2">
                {options.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            'p-3 rounded-xl border-2 text-left transition-all text-sm',
                            value === opt.value
                                ? 'border-primary-500 bg-primary-50 text-primary-800'
                                : 'border-slate-200 hover:border-primary-300 text-slate-700',
                        )}
                    >
                        <p className="font-semibold">{opt.label}</p>
                        {opt.sub && <p className="text-xs opacity-70 mt-0.5">{opt.sub}</p>}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEFAULT_INPUTS: SimulatorInputs = {
    paymentHistory: 'always',
    utilisation: 25,
    creditAge: '2to5y',
    creditMix: 'both',
    recentInquiries: 0,
};

export default function CibilSimulatorPage() {
    const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS);
    const { score, min, max } = useMemo(() => calculateEstimatedScore(inputs), [inputs]);
    const band = getScoreBand(score);
    const tips = useMemo(() => getImprovementTips(inputs), [inputs]);

    const set = <K extends keyof SimulatorInputs>(key: K) => (val: SimulatorInputs[K]) =>
        setInputs(prev => ({ ...prev, [key]: val }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="CIBIL Score Simulator — Estimate Your Credit Score Instantly | InvestingPro"
                description="Answer 5 questions about your credit habits and get an estimated CIBIL score range with personalised tips to improve it. No registration. No impact on your score."
            />

            {/* Hero */}
            <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-green-500 text-white pt-28 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <AutoBreadcrumbs className="mb-6 text-white/60" />
                    <Badge className="bg-white/20 border-white/30 text-white mb-3">
                        <Zap className="w-3 h-3 mr-1.5" />
                        Instant • No Registration • No Credit Impact
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">CIBIL Score Simulator</h1>
                    <p className="text-white/85 text-lg max-w-2xl">
                        Tell us about your credit habits. We'll estimate your score range and show you
                        exactly what to fix to improve it.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl -mt-4 pb-20">
                <div className="grid md:grid-cols-5 gap-6 items-start">

                    {/* ── Input panel ────────────────────────────────── */}
                    <div className="md:col-span-3 space-y-6">
                        <Card className="rounded-3xl shadow-xl border-0">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Your Credit Profile</CardTitle>
                                <p className="text-sm text-slate-500">Answer honestly for the most accurate estimate.</p>
                            </CardHeader>
                            <CardContent className="space-y-7 pt-2">

                                <OptionGroup
                                    label="Payment History"
                                    icon={Clock}
                                    value={inputs.paymentHistory}
                                    onChange={set('paymentHistory')}
                                    options={[
                                        { value: 'always', label: 'Always on time', sub: '0 missed payments' },
                                        { value: 'mostly', label: 'Mostly on time', sub: '1–2 late in 2 years' },
                                        { value: 'sometimes', label: 'Sometimes late', sub: '3–5 late payments' },
                                        { value: 'often', label: 'Often late / default', sub: 'Settled/NPA accounts' },
                                    ]}
                                />

                                <div>
                                    <Label className="text-base font-bold mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-primary-600" />
                                        Credit Utilisation: <span className={cn('ml-1', inputs.utilisation > 50 ? 'text-red-600' : inputs.utilisation > 30 ? 'text-amber-600' : 'text-green-600')}>{inputs.utilisation}%</span>
                                    </Label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={inputs.utilisation}
                                        onChange={e => set('utilisation')(Number(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary-600 mb-2"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>0% (ideal)</span>
                                        <span className="text-green-600 font-medium">30% limit</span>
                                        <span className="text-red-600 font-medium">100% maxed</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Average % of credit limit used across all credit cards
                                    </p>
                                </div>

                                <OptionGroup
                                    label="Age of Oldest Credit Account"
                                    icon={ShieldCheck}
                                    value={inputs.creditAge}
                                    onChange={set('creditAge')}
                                    options={[
                                        { value: 'over5y', label: 'Over 5 years', sub: 'Long history' },
                                        { value: '2to5y', label: '2–5 years', sub: 'Established' },
                                        { value: '1to2y', label: '1–2 years', sub: 'Building history' },
                                        { value: 'under1y', label: 'Under 1 year', sub: 'Very new to credit' },
                                    ]}
                                />

                                <OptionGroup
                                    label="Credit Mix"
                                    icon={CreditCard}
                                    value={inputs.creditMix}
                                    onChange={set('creditMix')}
                                    options={[
                                        { value: 'both', label: 'Cards + Loans', sub: 'Best mix' },
                                        { value: 'cardsOnly', label: 'Credit cards only', sub: 'No active loans' },
                                        { value: 'loansOnly', label: 'Loans only', sub: 'No credit cards' },
                                        { value: 'none', label: 'No credit', sub: 'New to credit' },
                                    ]}
                                />

                                <OptionGroup
                                    label="Credit Applications in Last 12 Months"
                                    icon={Zap}
                                    value={String(inputs.recentInquiries) as any}
                                    onChange={v => set('recentInquiries')(Number(v) as 0 | 1 | 2 | 3)}
                                    options={[
                                        { value: '0', label: 'None', sub: 'No recent applications' },
                                        { value: '1', label: '1 application', sub: 'Minimal impact' },
                                        { value: '2', label: '2 applications', sub: 'Moderate impact' },
                                        { value: '3', label: '3 or more', sub: 'High impact on score' },
                                    ]}
                                />

                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl"
                                    onClick={() => setInputs(DEFAULT_INPUTS)}
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reset to Defaults
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Results panel (sticky) ──────────────────────── */}
                    <div className="md:col-span-2 space-y-4 md:sticky md:top-6">
                        <Card className="rounded-3xl shadow-xl border-0 overflow-hidden">
                            <div className="bg-gradient-to-br from-primary-700 to-primary-500 p-6 text-white text-center">
                                <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-4">
                                    Estimated CIBIL Score
                                </p>
                                <MiniGauge score={score} />
                                <p className="text-white/80 text-sm mt-3">Range: {min}–{max}</p>
                            </div>
                            <CardContent className="p-5 space-y-3">
                                <div className={cn('p-3 rounded-xl border text-sm', band.bg, band.border, band.color)}>
                                    <p className="font-semibold">{band.label} Profile</p>
                                    {score >= 750 && <p className="text-xs mt-1 opacity-80">Best rates and instant approvals available.</p>}
                                    {score >= 700 && score < 750 && <p className="text-xs mt-1 opacity-80">Good. A few improvements can push you to Excellent.</p>}
                                    {score < 700 && <p className="text-xs mt-1 opacity-80">See improvement tips below to boost your score.</p>}
                                </div>

                                <Link href="/loans/eligibility-checker" className="block">
                                    <Button className="w-full bg-primary-600 hover:bg-primary-700 rounded-xl h-11 text-sm font-bold">
                                        Check Loan Eligibility
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                                <Link href="/credit-cards" className="block">
                                    <Button variant="outline" className="w-full rounded-xl h-11 text-sm font-bold">
                                        Find Matching Cards
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Improvement tips */}
                        <Card className="rounded-2xl">
                            <CardContent className="p-5">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-3">
                                    <TrendingUp className="w-4 h-4 inline mr-1.5 text-green-500" />
                                    How to Improve
                                </h3>
                                <ul className="space-y-3">
                                    {tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-100 rounded-xl p-3">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            This is an estimate based on typical CIBIL scoring patterns. Your actual score may vary.
                            For your official score, visit <a href="https://www.cibil.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">CIBIL.com</a>.
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <ComplianceDisclaimer variant="compact" />
                </div>
            </div>
        </div>
    );
}
