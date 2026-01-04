"use client";

import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    TrendingDown,
    Calculator,
    Percent,
    Wallet,
    Home,
    Car,
    GraduationCap,
    Gem,
    Briefcase,
    CheckCircle2,
    ArrowRight,
    Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';

const loanTypes = [
    { id: 'personal', label: 'Personal', icon: Wallet, rate: '10.5%+' },
    { id: 'home', label: 'Home', icon: Home, rate: '8.50%+' },
    { id: 'car', label: 'Car', icon: Car, rate: '8.75%+' },
    { id: 'education', label: 'Education', icon: GraduationCap, rate: '9.50%+' },
    { id: 'gold', label: 'Gold', icon: Gem, rate: '9.00%+' },
    { id: 'business', label: 'Business', icon: Briefcase, rate: '12.0%+' },
];

export default function LoansPage() {
    // Calculator State
    const [amount, setAmount] = useState(500000);
    const [tenure, setTenure] = useState(3); // Years
    const [rate, setRate] = useState(10.5);
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
        const r = rate / 12 / 100;
        const n = tenure * 12;
        const e = amount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
        setEmi(Math.round(e));
    }, [amount, tenure, rate]);

    const formatRupee = (num: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            <SEOHead
                title="Compare Best Loans in India 2026 | InvestingPro"
                description="Instant approval loans with lowest interest rates. Calculate EMI, compare Personal, Home, and Car loans from HDFC, SBI, ICICI."
            />

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 bg-slate-50 dark:bg-slate-950">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-emerald-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-blue-500/20" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Hero Text */}
                        <div className="flex-1 text-center lg:text-left">
                            <Badge className="mb-6 px-4 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 font-semibold uppercase tracking-wide text-[11px] inline-flex items-center gap-2 rounded-full">
                                <TrendingDown className="w-3.5 h-3.5" />
                                Lowest Interest Rates Guaranteed
                            </Badge>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
                                Fund Your Dreams <br className="hidden lg:block" />
                                <span className="text-emerald-600 dark:text-emerald-400">Instantly</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Compare 30+ lenders for Personal, Home, and Car loans.
                                Digital approval in <span className="font-semibold text-slate-900 dark:text-white">5 minutes</span>.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 w-full sm:w-auto transition-all hover:scale-105">
                                    Compare Rates
                                </Button>
                                <Button variant="outline" className="h-14 px-8 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-semibold text-lg w-full sm:w-auto">
                                    Check Eligibility
                                </Button>
                            </div>

                             <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
                                {[
                                    { label: "Lenders", value: "30+", icon: ShieldCheck },
                                    { label: "Starting ROI", value: "8.50%", icon: Percent },
                                    { label: "Disbursal", value: "24hrs", icon: CheckCircle2 }
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                            <stat.icon size={14} /> {stat.label}
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Calculator Widget */}
                        <div className="flex-1 w-full max-w-md lg:max-w-lg">
                            <Card className="rounded-[2.5rem] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-500/10 overflow-hidden relative">
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500" />
                                
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Calculator className="w-5 h-5 text-emerald-500" />
                                            Quick EMI Estimator
                                        </h3>
                                        <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-700">Live Rates</Badge>
                                    </div>

                                    {/* Amount Slider */}
                                    <div className="mb-8">
                                        <div className="flex justify-between mb-4">
                                            <label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Loan Amount</label>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">{formatRupee(amount)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="50000"
                                            max="5000000"
                                            step="10000"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                                            <span>₹50K</span>
                                            <span>₹50L</span>
                                        </div>
                                    </div>

                                    {/* Tenure Slider */}
                                    <div className="mb-8">
                                        <div className="flex justify-between mb-4">
                                            <label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tenure (Years)</label>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">{tenure} Years</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="30"
                                            step="1"
                                            value={tenure}
                                            onChange={(e) => setTenure(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                         <div className="flex justify-between mt-2 text-xs text-slate-400">
                                            <span>1 Yr</span>
                                            <span>30 Yrs</span>
                                        </div>
                                    </div>

                                    {/* Result Box */}
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-6">
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monthly Approx EMI</div>
                                            <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                {formatRupee(emi)}
                                            </div>
                                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                                                @ {rate}% Interest Rate
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                                        Check My Eligibility
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LOAN TYPES GRID --- */}
            <main className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Solution</h2>
                    <p className="text-slate-600 dark:text-slate-400">Tailored financial products for every need.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {loanTypes.map((type) => (
                        <Link href={`/loans?type=${type.id}`} key={type.id}>
                            <Card className="hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer group hover:-translate-y-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 flex items-center justify-center mb-4 transition-colors">
                                        <type.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white mb-1">{type.label}</div>
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{type.rate}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Additional Sections can go here (Testimonials, Steps etc) */}
                
            </main>
        </div>
    );
}
