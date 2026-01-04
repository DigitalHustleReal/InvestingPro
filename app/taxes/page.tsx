"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
    Calculator,
    TrendingDown,
    Wallet,
    FileText,
    Calendar,
    CheckCircle2,
    ArrowRight,
    Shield,
    PiggyBank,
    Home,
    Heart,
    Briefcase,
    GraduationCap,
    Target,
    Info,
    Sparkles,
    Clock,
    Award
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";

export default function TaxesPage() {
    const [annualIncome, setAnnualIncome] = useState(1000000);
    const [regime, setRegime] = useState<'old' | 'new'>('new');
    const [deductions, setDeductions] = useState(150000); // Section 80C
    
    // Tax calculation logic
    const calculateTax = (income: number, isOldRegime: boolean, deductions: number) => {
        let taxableIncome = income;
        
        if (isOldRegime) {
            // Old regime with deductions
            taxableIncome = Math.max(0, income - 50000 - deductions); // Standard deduction + 80C
        } else {
            // New regime (no deductions, but lower rates)
            taxableIncome = Math.max(0, income - 50000); // Only standard deduction
        }
        
        let tax = 0;
        
        if (isOldRegime) {
            // Old tax slabs
            if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
            if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
            if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
        } else {
            // New tax slabs (2024-25)
            if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
            if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.25;
            if (taxableIncome > 900000) tax += Math.min(taxableIncome - 900000, 300000) * 0.20;
            if (taxableIncome > 600000) tax += Math.min(taxableIncome - 600000, 300000) * 0.15;
            if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 300000) * 0.10;
        }
        
        // Add 4% cess
        tax = tax * 1.04;
        
        return Math.round(tax);
    };
    
    const oldRegimeTax = calculateTax(annualIncome, true, deductions);
    const newRegimeTax = calculateTax(annualIncome, false, 0);
    const recommendedRegime = oldRegimeTax < newRegimeTax ? 'old' : 'new';
    const savings = Math.abs(oldRegimeTax - newRegimeTax);

    const taxSavingInstruments = [
        {
            section: '80C',
            title: 'Tax Saving Investments',
            limit: '₹1,50,000',
            options: ['ELSS Mutual Funds', 'PPF', 'EPF', 'NSC', 'Tax Saver FD', 'Life Insurance Premium', 'Home Loan Principal'],
            icon: PiggyBank,
            color: 'emerald'
        },
        {
            section: '80D',
            title: 'Health Insurance',
            limit: '₹25,000 - ₹50,000',
            options: ['Self & Family Premium', 'Parents Premium', 'Preventive Health Checkup'],
            icon: Heart,
            color: 'rose'
        },
        {
            section: '80CCD(1B)',
            title: 'NPS Contribution',
            limit: '₹50,000',
            options: ['Additional NPS Investment', 'Over & Above 80C Limit'],
            icon: Wallet,
            color: 'blue'
        },
        {
            section: '24',
            title: 'Home Loan Interest',
            limit: '₹2,00,000',
            options: ['Self-Occupied Property', 'Interest on Home Loan'],
            icon: Home,
            color: 'amber'
        },
    ];

    const taxPlanningCards = [
        {
            title: 'For Salaried Employees',
            icon: Briefcase,
            tips: [
                'Submit investment proofs to employer',
                'Plan tax-saving investments early',
                'Check Form 16 before filing',
                'Claim HRA exemption if applicable'
            ],
            color: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'For Freelancers',
            icon: GraduationCap,
            tips: [
                'Pay advance tax quarterly',
                'Maintain GST compliance',
                'Claim business expenses',
                'Keep all income receipts'
            ],
            color: 'from-purple-500 to-pink-600'
        },
        {
            title: 'For Business Owners',
            icon: Target,
            tips: [
                'Separate business & personal expenses',
                'Maintain proper accounting books',
                'Claim depreciation on assets',
                'Hire tax consultant for complex cases'
            ],
            color: 'from-emerald-500 to-teal-600'
        },
    ];

    const filingDeadlines = [
        { date: 'Mar 31, 2026', event: 'Financial Year Ends', status: 'upcoming' },
        { date: 'Jun 15, 2026', event: '1st Advance Tax Payment', status: 'upcoming' },
        { date: 'Jul 31, 2026', event: 'ITR Filing (Individuals)', status: 'upcoming' },
        { date: 'Oct 31, 2026', event: 'ITR Filing (Audit Cases)', status: 'upcoming' },
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "Tax Planning & Savings Calculator - InvestingPro",
        "description": "Calculate income tax, compare old vs new tax regime, and discover tax-saving investment options. Free tax calculator for FY 2025-26.",
    };

    return (
        <main className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
            <SEOHead
                title="Tax Savings Calculator 2026 | Income Tax Planning India | InvestingPro"
                description="Free income tax calculator for FY 2025-26. Compare old vs new tax regime, discover tax-saving investments under 80C, 80D, NPS, and plan your taxes smartly."
                structuredData={structuredData}
            />

            {/* HERO SECTION - Interactive Tax Calculator */}
            <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Top Badge */}
                    <div className="flex justify-center mb-6">
                        <Badge className="px-4 py-2 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-100 dark:border-emerald-500/20 font-bold uppercase tracking-wide text-xs inline-flex items-center gap-2 rounded-full shadow-lg">
                            <Calculator className="w-4 h-4" />
                            FY 2025-26 Tax Calculator
                        </Badge>
                    </div>

                    {/* Main Headline */}
                    <div className="text-center mb-8 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                            Smart Tax Planning with{' '}
                            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                                Instant Calculator
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Compare old vs new tax regime, calculate your tax liability, and discover smart ways to save taxes legally.
                        </p>
                    </div>

                    {/* Interactive Calculator Card */}
                    <div className="max-w-5xl mx-auto">
                        <Card className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Calculator className="w-6 h-6" />
                                    Income Tax Calculator
                                </h2>
                                <p className="text-emerald-100 text-sm">
                                    Instantly calculate your tax and find the best regime for you
                                </p>
                            </div>

                            <CardContent className="p-8">
                                {/* Annual Income Slider */}
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                        Annual Income (CTC)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="300000"
                                            max="5000000"
                                            step="50000"
                                            value={annualIncome}
                                            onChange={(e) => setAnnualIncome(Number(e.target.value))}
                                            className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                        <div className="min-w-[140px] text-right">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                ₹{(annualIncome / 100000).toFixed(1)}L
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">per annum</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Deductions Slider (Old Regime Only) */}
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                        Tax Deductions (80C, 80D, etc.) - Old Regime Only
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="250000"
                                            step="10000"
                                            value={deductions}
                                            onChange={(e) => setDeductions(Number(e.target.value))}
                                            className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <div className="min-w-[140px] text-right">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                ₹{(deductions / 1000).toFixed(0)}k
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">deductions</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Regime Comparison */}
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    {/* Old Regime */}
                                    <Card className={`border-2 transition-all cursor-pointer ${
                                        recommendedRegime === 'old' 
                                            ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                        Old Tax Regime
                                                    </h3>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        With deductions & exemptions
                                                    </p>
                                                </div>
                                                {recommendedRegime === 'old' && (
                                                    <Badge className="bg-emerald-500 text-white text-xs">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        Best for You
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                                ₹{oldRegimeTax.toLocaleString('en-IN')}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                Annual tax liability
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-slate-600 dark:text-slate-400">Taxable Income:</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        ₹{(annualIncome - 50000 - deductions).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600 dark:text-slate-400">Deductions Used:</span>
                                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        ₹{deductions.toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* New Regime */}
                                    <Card className={`border-2 transition-all cursor-pointer ${
                                        recommendedRegime === 'new' 
                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                                        New Tax Regime
                                                    </h3>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        Lower rates, no deductions
                                                    </p>
                                                </div>
                                                {recommendedRegime === 'new' && (
                                                    <Badge className="bg-blue-500 text-white text-xs">
                                                        <Award className="w-3 h-3 mr-1" />
                                                        Best for You
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                                ₹{newRegimeTax.toLocaleString('en-IN')}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                Annual tax liability
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-slate-600 dark:text-slate-400">Taxable Income:</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        ₹{(annualIncome - 50000).toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600 dark:text-slate-400">Deductions Used:</span>
                                                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                                                        ₹0
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Savings Highlight */}
                                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <TrendingDown className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    You save with <strong>{recommendedRegime === 'old' ? 'Old' : 'New'} Regime</strong>
                                                </div>
                                                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    ₹{savings.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                            Download Report
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Tax-Saving Instruments */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Tax-Saving Investment Options
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Reduce your tax liability with these government-approved investment instruments
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {taxSavingInstruments.map((instrument, idx) => {
                            const Icon = instrument.icon;
                            return (
                                <Card key={idx} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                    <CardContent className="p-6">
                                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-${instrument.color}-100 dark:bg-${instrument.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-7 h-7 text-${instrument.color}-600 dark:text-${instrument.color}-400`} />
                                        </div>
                                        <Badge className="mb-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0">
                                            Section {instrument.section}
                                        </Badge>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                            {instrument.title}
                                        </h3>
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                                            {instrument.limit}
                                        </div>
                                        <div className="space-y-2">
                                            {instrument.options.map((option, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    <span>{option}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 3: Tax Planning Cards */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Tax Planning by Profile
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Personalized tax-saving strategies for your situation
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {taxPlanningCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                                    <CardContent className="p-8">
                                        <Icon className="w-12 h-12 text-slate-700 dark:text-slate-300 mb-4" />
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                            {card.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {card.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                                    <span className="text-slate-600 dark:text-slate-400">{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 4: Filing Deadlines */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Important Tax Deadlines
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Mark your calendar - Don't miss these critical dates
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
                            
                            <div className="space-y-8">
                                {filingDeadlines.map((deadline, idx) => (
                                    <div key={idx} className="relative flex items-start gap-6 pl-20">
                                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                            <Calendar className="w-7 h-7 text-white" />
                                        </div>
                                        <Card className="flex-1 border-2 border-slate-200 dark:border-slate-800">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                                                            {deadline.date}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                            {deadline.event}
                                                        </h3>
                                                    </div>
                                                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Upcoming
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
