"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { 
    Calculator,
    TrendingUp,
    Wallet,
    FileText,
    ArrowRight,
    Sparkles,
    Star,
    Users,
    Shield,
    Lock,
    PiggyBank,
    Target,
    Receipt,
    Home,
    Car,
    GraduationCap,
    IndianRupee,
    BarChart3,
    ChevronRight,
    Zap
} from "lucide-react";
import { DotPattern } from "@/components/common/Patterns";
import { cn } from "@/lib/utils";

// Calculator data for compact grid (excluding SIP which is hero)
const calculators = [
    {
        id: "emi",
        icon: Calculator,
        title: "EMI Calculator",
        shortTitle: "EMI",
        description: "Calculate loan EMIs instantly",
        href: "/calculators/emi",
        gradient: "from-blue-500 to-cyan-500",
        iconBg: "bg-blue-500",
        stats: { users: "2.3L", rating: 4.9 },
        popular: true,
    },
    {
        id: "tax",
        icon: FileText,
        title: "Tax Calculator",
        shortTitle: "Tax",
        description: "Income tax & savings",
        href: "/calculators/tax",
        gradient: "from-orange-500 to-amber-500",
        iconBg: "bg-orange-500",
        stats: { users: "1.5L", rating: 4.7 },
        popular: true,
    },
    {
        id: "fd",
        icon: PiggyBank,
        title: "FD Calculator",
        shortTitle: "FD",
        description: "Fixed deposit returns",
        href: "/calculators/fd",
        gradient: "from-violet-500 to-purple-500",
        iconBg: "bg-violet-500",
        stats: { users: "890K", rating: 4.6 },
        popular: false,
    },
    {
        id: "ppf",
        icon: Shield,
        title: "PPF Calculator",
        shortTitle: "PPF",
        description: "PPF maturity value",
        href: "/calculators/ppf",
        gradient: "from-rose-500 to-pink-500",
        iconBg: "bg-rose-500",
        stats: { users: "650K", rating: 4.7 },
        popular: false,
    },
    {
        id: "home-loan",
        icon: Home,
        title: "Home Loan",
        shortTitle: "Home Loan",
        description: "Home loan EMI & eligibility",
        href: "/calculators/home-loan",
        gradient: "from-sky-500 to-blue-500",
        iconBg: "bg-sky-500",
        stats: { users: "720K", rating: 4.8 },
        popular: true,
    },
    {
        id: "goal",
        icon: Target,
        title: "Goal Planning",
        shortTitle: "Goals",
        description: "Plan your financial goals",
        href: "/calculators/goal-planning",
        gradient: "from-indigo-500 to-blue-500",
        iconBg: "bg-indigo-500",
        stats: { users: "450K", rating: 4.5 },
        popular: false,
    },
];

// Hero SIP Calculator Component
function HeroSIPCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);

    const results = useMemo(() => {
        const n = timePeriod * 12; // months
        const r = expectedReturn / 100 / 12; // monthly rate
        
        // SIP Future Value formula: P * [(1+r)^n - 1] / r * (1+r)
        const futureValue = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const totalInvested = monthlyInvestment * n;
        const totalReturns = futureValue - totalInvested;
        
        return {
            futureValue: Math.round(futureValue),
            totalInvested: Math.round(totalInvested),
            totalReturns: Math.round(totalReturns),
            returnPercent: ((totalReturns / totalInvested) * 100).toFixed(0)
        };
    }, [monthlyInvestment, expectedReturn, timePeriod]);

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    // Calculate percentage for visual ring
    const returnRatio = (results.totalReturns / results.futureValue) * 100;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-[2px] shadow-2xl shadow-emerald-500/20">
            <div className="rounded-[22px] bg-white dark:bg-slate-900 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/50 to-transparent dark:from-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">SIP Calculator</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Plan your wealth journey</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Live Preview</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: Inputs */}
                        <div className="space-y-6">
                            {/* Monthly Investment */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Monthly Investment
                                    </label>
                                    <div className="flex items-center gap-1">
                                        <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                            {monthlyInvestment.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                                <Slider
                                    value={[monthlyInvestment]}
                                    onValueChange={([val]) => setMonthlyInvestment(val)}
                                    min={500}
                                    max={100000}
                                    step={500}
                                    className="w-full [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500 [&_.bg-primary]:bg-emerald-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>₹500</span>
                                    <span>₹1L</span>
                                </div>
                            </div>

                            {/* Expected Return */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Expected Annual Return
                                    </label>
                                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        {expectedReturn}%
                                    </span>
                                </div>
                                <Slider
                                    value={[expectedReturn]}
                                    onValueChange={([val]) => setExpectedReturn(val)}
                                    min={1}
                                    max={30}
                                    step={0.5}
                                    className="w-full [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500 [&_.bg-primary]:bg-emerald-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>1%</span>
                                    <span>30%</span>
                                </div>
                            </div>

                            {/* Time Period */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Investment Period
                                    </label>
                                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        {timePeriod} years
                                    </span>
                                </div>
                                <Slider
                                    value={[timePeriod]}
                                    onValueChange={([val]) => setTimePeriod(val)}
                                    min={1}
                                    max={40}
                                    step={1}
                                    className="w-full [&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500 [&_.bg-primary]:bg-emerald-500"
                                />
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>1 yr</span>
                                    <span>40 yrs</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Results */}
                        <div className="flex flex-col">
                            {/* Circular Visualization */}
                            <div className="flex-1 flex items-center justify-center py-4">
                                <div className="relative w-48 h-48">
                                    {/* Background ring */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            className="text-slate-100 dark:text-slate-800"
                                        />
                                        {/* Invested portion */}
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke="url(#investedGradient)"
                                            strokeWidth="12"
                                            strokeDasharray={`${(100 - returnRatio) * 5.53} 553`}
                                            strokeLinecap="round"
                                        />
                                        {/* Returns portion */}
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="none"
                                            stroke="url(#returnsGradient)"
                                            strokeWidth="12"
                                            strokeDasharray={`${returnRatio * 5.53} 553`}
                                            strokeDashoffset={`${-(100 - returnRatio) * 5.53}`}
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="investedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#0ea5e9" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                            <linearGradient id="returnsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#14b8a6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    {/* Center content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Value</span>
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(results.futureValue)}
                                        </span>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                                            +{results.returnPercent}% returns
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-sky-500" />
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Invested</span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(results.totalInvested)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Returns</span>
                                    </div>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(results.totalReturns)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Link href="/calculators/sip" className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all">
                                <BarChart3 className="mr-2 w-5 h-5" />
                                Advanced SIP Calculator
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/mutual-funds/top-sip" className="sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-semibold py-6 px-6 rounded-xl">
                                Top SIP Funds
                            </Button>
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 border-2 border-white dark:border-slate-900" />
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">1.8L+ users</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">used this calculator</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">4.8</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Compact Calculator Card Component (for grid)
function CompactCalculatorCard({ calculator }: { calculator: typeof calculators[0] }) {
    const Icon = calculator.icon;
    
    return (
        <Link href={calculator.href} className="group">
            <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg",
                        calculator.iconBg
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {calculator.title}
                            </h3>
                            {calculator.popular && (
                                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase rounded">
                                    Hot
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {calculator.description}
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                
                {/* Stats Row */}
                <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {calculator.stats.rating}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {calculator.stats.users}
                    </span>
                </div>
            </div>
        </Link>
    );
}

// Quick Access Link (for footer grid)
function QuickAccessLink({ calculator }: { calculator: typeof calculators[0] }) {
    const Icon = calculator.icon;
    
    return (
        <Link 
            href={calculator.href} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
        >
            <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center text-white",
                calculator.iconBg
            )}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {calculator.shortTitle}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
        </Link>
    );
}

// Main Component
export default function QuickToolsSection() {
    return (
        <section className="relative py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <DotPattern className="text-slate-200/80 dark:text-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
                {/* Decorative gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-900/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Free Financial Tools</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Calculate Your
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"> Financial Future</span>
                    </h2>
                    <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Plan smarter investments with our precision calculators trusted by 10L+ Indians
                    </p>
                </div>

                {/* Hybrid Layout: Hero SIP + Compact Grid */}
                <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 mb-12">
                    {/* Hero SIP Calculator - 3 columns */}
                    <div className="lg:col-span-3">
                        <HeroSIPCalculator />
                    </div>

                    {/* Compact Calculator Grid - 2 columns */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">More Calculators</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Explore our complete toolkit</p>
                        </div>
                        
                        {/* Top 3 calculators */}
                        {calculators.slice(0, 3).map((calculator) => (
                            <CompactCalculatorCard key={calculator.id} calculator={calculator} />
                        ))}
                        
                        {/* View All Button */}
                        <Link href="/calculators" className="block">
                            <Button 
                                variant="outline"
                                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 font-semibold py-6 rounded-xl transition-all"
                            >
                                View All 15+ Calculators
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Access Grid - All Other Calculators */}
                <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Access</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Jump to any calculator</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="hidden sm:inline">SEBI Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-blue-500" />
                                <span className="hidden sm:inline">100% Private</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {calculators.map((calculator) => (
                            <QuickAccessLink key={calculator.id} calculator={calculator} />
                        ))}
                    </div>
                </div>

                {/* Bottom Stats Bar */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:gap-16">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">10L+</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Users</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Star className="w-6 h-6 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">4.8/5</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">User Rating</p>
                        </div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">15+</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Free Calculators</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
