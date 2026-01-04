"use client";

import React, { useState, useEffect } from 'react';
import { 
    Calculator, 
    ArrowRight, 
    ShieldCheck, 
    PieChart, 
    Clock, 
    Info, 
    CheckCircle2, 
    ArrowDownCircle,
    BadgePercent,
    TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- Tax Calculator Component ---

const TaxHeroCalculator = () => {
    const [income, setIncome] = useState(1200000); // 12 Lakhs
    const [deductions, setDeductions] = useState(250000); // 1.5L (80C) + 50k (80D) + 50k (Standard)

    // Rough calculation for FY 2025-26
    const calculateTax = (inc: number, ded: number, type: 'old' | 'new') => {
        if (type === 'old') {
            const taxable = Math.max(0, inc - ded);
            let tax = 0;
            if (taxable <= 250000) return 0;
            if (taxable <= 500000) tax = (taxable - 250000) * 0.05;
            else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.20;
            else tax = 112500 + (taxable - 1000000) * 0.30;
            
            // Rebate u/s 87A for old regime is up to 5L
            if (taxable <= 500000) tax = 0;
            return tax * 1.04; // Cess
        } else {
            // New Regime (Budget 2024 Simplification)
            // 0-3L: NIL, 3-7L: 5%, 7-10L: 10%, 10-12L: 15%, 12-15L: 20%, Above 15L: 30%
            // Standard deduction of 75k in new regime
            const taxable = Math.max(0, inc - 75000);
            let tax = 0;
            if (taxable <= 300000) tax = 0;
            else if (taxable <= 700000) tax = (taxable - 300000) * 0.05;
            else if (taxable <= 1000000) tax = 20000 + (taxable - 700000) * 0.10;
            else if (taxable <= 1200000) tax = 50000 + (taxable - 1000000) * 0.15;
            else if (taxable <= 1500000) tax = 80000 + (taxable - 1200000) * 0.20;
            else tax = 140000 + (taxable - 1500000) * 0.30;

            // Rebate up to 7L taxable in new regime
            if (taxable <= 700000) tax = 0;
            return tax * 1.04;
        }
    };

    const oldTax = calculateTax(income, deductions, 'old');
    const newTax = calculateTax(income, deductions, 'new');
    const savings = Math.abs(oldTax - newTax);
    const recommended = newTax < oldTax ? 'New Regime' : 'Old Regime';

    return (
        <div className="w-full bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-0">
                {/* Inputs */}
                <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Tax Optimizer</h2>
                    </div>

                    <div className="space-y-10">
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-medium text-slate-400">Annual Income (CTC)</label>
                                <span className="text-lg font-bold text-white">₹ {(income / 100000).toFixed(1)} Lakhs</span>
                            </div>
                            <Slider 
                                value={[income]} 
                                min={300000} 
                                max={5000000} 
                                step={50000}
                                onValueChange={(val) => setIncome(val[0])}
                                className="py-2"
                            />
                            <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                <span>3L</span>
                                <span>50L</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-sm font-medium text-slate-400">Investments & Deductions (Old Regime)</label>
                                <span className="text-lg font-bold text-white">₹ {(deductions / 1000).toFixed(0)}k</span>
                            </div>
                            <Slider 
                                value={[deductions]} 
                                min={50000} 
                                max={500000} 
                                step={5000}
                                onValueChange={(val) => setDeductions(val[0])}
                                className="py-2"
                            />
                            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed italic">
                                *Includes 80C, 80D, HRA, etc. Standard deduction (₹50k) is automatically handled.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                        <Info className="w-5 h-5 text-indigo-400 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Calculations are based on FY 2025-26 rules. New regime now includes ₹75,000 standard deduction and Nil tax up to ₹7 Lakhs taxable income.
                        </p>
                    </div>
                </div>

                {/* Results */}
                <div className="p-8 lg:p-12 bg-slate-800/50">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Comparison View</h3>
                    
                    <div className="space-y-6">
                        {/* Old Regime Card */}
                        <div className={cn(
                            "p-6 rounded-2xl border transition-all duration-300",
                            recommended === 'Old Regime' ? "bg-teal-500/10 border-teal-500/30" : "bg-white/5 border-white/5"
                        )}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-slate-300">Old Tax Regime</span>
                                {recommended === 'Old Regime' && (
                                    <Badge className="bg-teal-500 text-white border-0">Best Choice</Badge>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-white">₹ {oldTax.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-slate-500 mt-1">Effective tax rate: {((oldTax / income) * 100).toFixed(1)}%</div>
                        </div>

                        {/* New Regime Card */}
                        <div className={cn(
                            "p-6 rounded-2xl border transition-all duration-300",
                            recommended === 'New Regime' ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]" : "bg-white/5 border-white/5"
                        )}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-slate-300">New Simplified Regime</span>
                                {recommended === 'New Regime' && (
                                    <Badge className="bg-indigo-500 text-white border-0">Best Choice</Badge>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-white">₹ {newTax.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-slate-500 mt-1">Effective tax rate: {((newTax / income) * 100).toFixed(1)}%</div>
                        </div>
                    </div>

                    {/* Recommendation Footer */}
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-slate-400 text-sm mb-2">You save approximately</p>
                        <div className="text-4xl font-black text-white mb-2">
                            ₹ {savings.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">in the {recommended}</p>
                        
                        <Button className="w-full mt-8 bg-white hover:bg-slate-100 text-slate-900 font-bold h-12 rounded-xl group">
                            Full Tax Breakdown
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function TaxesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-orange-100 selection:text-orange-900">
            {/* 1. Hero Section */}
            <section className="relative pt-12 pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <Badge className="mb-4 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20 px-4 py-1.5 rounded-full font-bold tracking-wide">
                            FINANCIAL YEAR 2025-26
                        </Badge>
                        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                            Save More. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Tax Less.</span>
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Stop overpaying taxes. Compare regimes, track deadlines, and optimize your 80C investments with India's most advanced tax toolkit.
                        </p>
                    </div>

                    {/* Tax Calculator Hub */}
                    <div className="max-w-5xl mx-auto">
                        <TaxHeroCalculator />
                    </div>
                </div>
            </section>

            {/* 2. Tax Saving Instruments (The Grid) */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Tax Saving Radar</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400">
                                Most people leave money on the table. Are you maximizing these deductuions?
                            </p>
                        </div>
                        <Button variant="outline" className="rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            Download Tax Checklist
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 80C Card */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="w-24 h-24 text-orange-500" />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-7 h-7 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Section 80C</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
                                Deductions up to ₹1.5 Lakhs through ELSS, PPF, Insurance premiums, and Home Loan principal.
                            </p>
                            <div className="flex items-center gap-2 group/btn cursor-pointer">
                                <span className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Explore Options</span>
                                <ChevronRight className="w-4 h-4 text-orange-500 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* 80D Card */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 relative overflow-hidden">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                                <BadgePercent className="w-7 h-7 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Health (80D)</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
                                Claim up to ₹1 Lakh for medical insurance premiums for you, your spouse, and senior citizen parents.
                            </p>
                            <div className="flex items-center gap-2 group/btn cursor-pointer">
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Calculators</span>
                                <ChevronRight className="w-4 h-4 text-emerald-500 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* 80CCD (NPS) Card */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                                <TrendingUp className="w-7 h-7 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">NPS (80CCD)</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
                                Additional deduction of ₹50,000 above the 80C limit specifically for National Pension Scheme.
                            </p>
                            <div className="flex items-center gap-2 group/btn cursor-pointer">
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">NPS Guide</span>
                                <ChevronRight className="w-4 h-4 text-blue-500 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Deadlines & Timeline */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Crucial Tax Deadlines</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400">Mark your calendars to avoid heavy penalties and interest.</p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { date: 'March 31', title: 'Investment Proof Submission', desc: 'Last day to complete your 80C investments for FY 2024-25.', color: 'bg-indigo-500' },
                                { date: 'July 31', title: 'ITR Filing Deadline', desc: 'Standard deadline for individual tax payers and salaried employees.', color: 'bg-orange-500' },
                                { date: 'Sept 30', title: 'Tax Audit Deadline', desc: 'Deadline for businesses and professionals requiring a tax audit.', color: 'bg-emerald-500' },
                                { date: 'Dec 31', title: 'Belated ITR Return', desc: 'Last chance to file your taxes with a penalty for late submission.', color: 'bg-rose-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex group">
                                    <div className="flex flex-col items-center mr-6">
                                        <div className={cn("w-4 h-4 rounded-full ring-4 ring-slate-100 dark:ring-slate-800", item.color)} />
                                        <div className="w-px h-full bg-slate-200 dark:bg-slate-800" />
                                    </div>
                                    <div className="pb-12">
                                        <span className="text-lg font-black text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.date}</span>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{item.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 mt-2">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FAQ / Guides Grid */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-black text-white mb-6 leading-tight">Master Tax Planning with Our Free Guides</h2>
                            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                                Our chartered accountants have written comprehensive blueprints to help you navigate complex tax laws effortlessly.
                            </p>
                            <div className="space-y-4">
                                {[
                                    "Guide to Real Estate & Capital Gains",
                                    "How to claim HRA without receipts",
                                    "Taxation for Cryptocurrency in India",
                                    "Best ELSS Mutual Funds for 2026"
                                ].map((guide, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                        <span className="font-semibold text-slate-200 group-hover:text-white">{guide}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px]" />
                            <div className="relative p-8 rounded-[40px] bg-slate-800 border border-white/10 shadow-2xl skew-y-3">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="CA" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">Ask a Tax Expert</div>
                                        <div className="text-xs text-slate-500">Response in {'<'} 2 hours</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-white/5 text-sm text-slate-300">
                                        "Which regime is better for 18L income with home loan?"
                                    </div>
                                    <div className="p-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/20 text-sm text-indigo-200 italic">
                                        "For your profile, the Old Regime saves you ₹42,000 specifically due to Section 24(b)..."
                                    </div>
                                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-12 rounded-xl mt-4">
                                        Start Live Consultation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Reuse lucide icons not imported
const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);
