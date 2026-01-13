"use client";

import React, { useState } from 'react';
import { api } from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SEOHead from "@/components/common/SEOHead";
import {
    Building2,
    TrendingUp,
    Shield,
    Clock,
    Star,
    ArrowUpRight,
    IndianRupee,
    ChevronRight,
    ShieldCheck,
    Zap,
    Percent,
    Calculator,
    Info,
    ArrowRight,
} from "lucide-react";
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";

const tenures = ["1 Year", "2 Years", "3 Years", "5 Years"];

export default function FixedDepositsPage() {
    const [selectedTenure, setSelectedTenure] = useState<any>("1 Year");
    const [sortBy, setSortBy] = useState("rate");

    const { data: fdRates = [], isLoading } = useQuery({
        queryKey: ['fixed-deposits'],
        queryFn: () => api.entities.FixedDeposit.list()
    });

    const sortedRates = [...fdRates].sort((a: any, b: any) => {
        if (sortBy === "rate") return b.rates[selectedTenure] - a.rates[selectedTenure];
        if (sortBy === "bank") return a.bank.localeCompare(b.bank);
        return 0;
    });

    const highestRate = fdRates.length > 0 ? Math.max(...fdRates.map((fd: any) => fd.rates[selectedTenure])) : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingSpinner text="Fetching latest FD rates..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title="Best Fixed Deposit Rates in India 2024 - Compare Banks & NBFCs | InvestingPro"
                description="Compare FD interest rates from top Indian banks and NBFCs. Get the highest returns on your savings with 100% safety and DICGC insurance."
            />

            {/* Premium Dark Hero */}
            <div className="bg-slate-900 relative overflow-hidden pt-20 pb-32">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-600 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-accent-500/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-accent-500/20">
                            <ShieldCheck className="w-4 h-4 text-accent-500" />
                            <span className="text-accent-500 font-bold text-xs uppercase tracking-[0.2em]">Sovereign Safety Guarantee</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                            Grow Wealth with <span className="text-accent-500">Absolute Peace</span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed mb-10">
                            Compare the highest Fixed Deposit rates across 50+ Banks and NBFCs. Secure your future with guaranteed returns and zero market risk.
                        </p>
                        <div className="flex gap-4">
                            <Button className="rounded-2xl bg-accent-500 hover:bg-accent-600 text-white font-bold h-14 px-8 shadow-lg shadow-accent-500/20 text-lg">
                                Find Highest Rates
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Link href="/calculators">
                                <Button variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold h-14 px-8 text-lg">
                                    FD Calculator
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Stats Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Bank Max Yield", value: "7.85%", sub: "For Senior Citizens", icon: Percent, color: "bg-primary-600" },
                        { label: "NBFC Max Yield", value: "8.65%", sub: "Aggressive Returns", icon: Zap, color: "bg-accent-600" },
                        { label: "Insured Amount", value: "₹5 Lakh", sub: "DICGC per Bank", icon: Shield, color: "bg-primary-600" },
                        { label: "Minimum Lock-in", value: "7 Days", sub: "Maximum Liquidity", icon: Clock, color: "bg-secondary-600" },
                    ].map((stat, index) => (
                        <Card key={index} className="rounded-[2.5rem] border-0 shadow-2xl bg-white overflow-hidden group">
                            <CardContent className="p-6 flex items-center gap-6 md:p-8">
                                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                    <p className="text-lg font-extrabold text-slate-900 leading-none mb-1">{stat.value}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{stat.sub}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Marketplace Controls */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 mb-12 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                Desired Tenure
                            </span>
                            <Select value={selectedTenure} onValueChange={setSelectedTenure}>
                                <SelectTrigger className="w-48 bg-slate-50 border-0 rounded-xl h-12 font-bold focus:ring-accent-500">
                                    <SelectValue placeholder="Select Tenure" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tenures.map(tenure => (
                                        <SelectItem key={tenure} value={tenure}>{tenure}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="hidden md:block h-12 w-px bg-slate-100" />

                    <div className="flex-1 flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <TrendingUp className="w-3 h-3 text-primary-500" />
                            Best Market Opportunity
                        </div>
                        <p className="text-slate-900 font-bold text-xl">8.15% <span className="text-slate-400 text-sm font-bold">at Shriram Finance</span></p>
                    </div>

                    <div className="hidden md:block h-12 w-px bg-slate-100" />

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Refine List</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-52 bg-slate-50 border-0 rounded-xl h-12 font-bold">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rate">Highest Yield First</SelectItem>
                                <SelectItem value="bank">Alphabetical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Dynamic FD Grid */}
                <div className="space-y-6">
                    {sortedRates.map((fd: any, index: number) => (
                        <div
                            key={index}
                            className={`group bg-white rounded-[2.5rem] border-0 shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${fd.rates[selectedTenure] === highestRate ? 'ring-2 ring-accent-500' : ''}`}
                        >
                            <div className="p-8">
                                <div className="grid lg:grid-cols-4 gap-12 items-center">
                                    {/* Bank Identity */}
                                    <div className="lg:col-span-1 border-r border-slate-50 pr-8">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-16 h-16 rounded-[2rem] bg-gradient-to-br ${fd.color} flex items-center justify-center text-white text-3xl font-bold shadow-xl shrink-0`}>
                                                {fd.logo}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{fd.bank}</h3>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Badge className="bg-slate-100 text-slate-500 border-0 text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                                                        {fd.type}
                                                    </Badge>
                                                    {fd.featured && (
                                                        <Badge className="bg-primary-500/10 text-primary-600 border-0 text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                                                            <Star className="w-2.5 h-2.5 mr-1 fill-success-600" />
                                                            Top Pick
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Yield Breakdown */}
                                    <div className="lg:col-span-2">
                                        <div className="grid grid-cols-4 gap-6">
                                            {tenures.map(tenure => (
                                                <div
                                                    key={tenure}
                                                    className={`text-center p-4 rounded-3xl transition-all ${tenure === selectedTenure ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20 scale-110' : 'bg-slate-50/50 hover:bg-slate-50'}`}
                                                >
                                                    <p className={`text-[9px] font-bold uppercase tracking-tighter mb-1 ${tenure === selectedTenure ? 'text-white/70' : 'text-slate-400'}`}>{tenure}</p>
                                                    <p className="text-xl font-bold tracking-tight">{fd.rates[tenure]}%</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action & CTAs */}
                                    <div className="lg:col-span-1">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Senior Citizen</span>
                                                    <span className="text-sm font-extrabold text-primary-600">{fd.seniorCitizenBonus > 0 ? `+${fd.seniorCitizenBonus}% Extra` : 'Standard Rates'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Min Deposit</span>
                                                    <span className="text-sm font-extrabold text-slate-900">{fd.minDeposit}</span>
                                                </div>
                                            </div>
                                            <Button className="w-full rounded-2xl bg-slate-900 hover:bg-accent-500 text-white font-bold py-7 h-auto transition-all text-base shadow-xl active:scale-95 group/btn">
                                                Secure This Rate
                                                <ArrowUpRight className="w-5 h-5 ml-2 group-hover/btn:rotate-45 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-primary-500" />
                                            DICGC Insured (5L)
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="w-4 h-4 text-secondary-500" />
                                            Instant Liquidity Available
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors">
                                        View Detailed T&C
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Investor Education */}
                <div className="mt-24 grid md:grid-cols-2 gap-8">
                    <Card className="rounded-[3rem] border-0 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <CardHeader className="p-0 mb-8">
                            <Badge className="bg-accent-500 text-white mb-6 border-0 text-[10px] font-bold tracking-widest">Expert Advice</Badge>
                            <CardTitle className="text-3xl font-bold tracking-tight leading-tight">Mastering Fixed Income</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-accent-500 font-bold flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Guaranteed Capital
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">Unlike equities, FD returns are locked at the time of deposit. Your principal is shielded from market fluctuations and volatility.</p>
                            </div>
                            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">DICGC Scheme</p>
                                    <p className="text-xs text-white font-bold leading-relaxed">Insurance cover up to ₹5L per bank including principal + interest.</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Section 80C</p>
                                    <p className="text-xs text-white font-bold leading-relaxed">Tax Saver FDs offer deductions up to ₹1.5L yearly income.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[3rem] border-0 shadow-2xl bg-white p-6 md:p-8 overflow-hidden flex flex-col justify-between">
                        <div>
                            <CardHeader className="p-0 mb-10">
                                <div className="w-16 h-16 bg-secondary-50 rounded-[2rem] flex items-center justify-center mb-6">
                                    <Calculator className="w-8 h-8 text-primary-600" />
                                </div>
                                <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">Strategy: The FD Ladder</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-slate-600 font-medium mb-8 leading-relaxed">Don't lock all your funds in a single tenure. Use the "Laddering Strategy" for better liquidity and rate advantage.</p>
                                <div className="space-y-4 mb-8">
                                    {[
                                        { step: "01", text: "Divide your capital into 3 parts." },
                                        { step: "02", text: "Invest in 1Y, 3Y, and 5Y FDs respectively." },
                                        { step: "03", text: "Re-invest mature FDs at current highest rates." }
                                    ].map((s, i) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <span className="text-xl font-bold text-slate-200">{s.step}</span>
                                            <span className="text-sm font-extrabold text-slate-700">{s.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </div>
                        <Link href="/calculators">
                            <Button variant="outline" className="w-full rounded-2xl h-16 border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-all border-2">
                                Start Laddering Strategy
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
