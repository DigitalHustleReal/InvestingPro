"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/common/SEOHead";
import {
    Building2,
    Star,
    ArrowUpRight,
    Check,
    Users,
    Shield,
    Zap,
    Smartphone,
    Trophy,
    ArrowRight,
    Info,
    HelpCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function DematAccountsPage() {
    const { data: brokers = [], isLoading } = useQuery({
        queryKey: ['brokers'],
        queryFn: () => api.entities.Broker.list()
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <LoadingSpinner text="Analyzing top stock brokers..." />
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <SEOHead
                title="Best Demat Accounts in India 2024 - Compare Brokers | InvestingPro"
                description="Compare top stock brokers in India. side-by-side analysis of Zerodha, Groww, Upstox and more. Find the best demat account for your trading needs."
            />

            {/* Premium Hero */}
            <div className="bg-slate-900 relative overflow-hidden pt-20 pb-32">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-600 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/10">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-white font-bold text-xs uppercase tracking-[0.2em]">2024 Broker Awards</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Unlock the <span className="text-secondary-400">Indian Markets</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Compare India's leading stockbrokers. Save on brokerage, access world-class trading tools, and start your wealth journey today.
                    </p>
                </div>
            </div>

            {/* Trust Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: Users, label: "Active Investors", value: "3.5Cr+", color: "bg-primary-600", shadow: "shadow-blue-500/20" },
                        { icon: Zap, label: "Lowest Fees", value: "₹0 Delivery", color: "bg-primary-600", shadow: "shadow-primary-500/20" },
                        { icon: Shield, label: "SEBI Certified", value: "Fully Secure", color: "bg-secondary-600", shadow: "shadow-purple-500/20" },
                        { icon: Smartphone, label: "Digital KYC", value: "Paperless", color: "bg-amber-600", shadow: "shadow-amber-500/20" },
                    ].map((stat, index) => (
                        <Card key={index} className={`rounded-[2rem] border-0 shadow-2xl ${stat.shadow} bg-white overflow-hidden`}>
                            <CardContent className="p-6 flex items-center gap-6 md:p-8">
                                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                                    <p className="text-lg font-extrabold text-slate-900">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Broker Matrix */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Rated Brokers</h2>
                        <p className="text-slate-500 mt-2 font-medium">Ranked by performance, pricing, and user experience.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-full shadow-sm bg-white border-slate-200">
                            Sort by Rating
                        </Button>
                        <Button variant="outline" className="rounded-full shadow-sm bg-white border-slate-200">
                            Zero AMC Only
                        </Button>
                    </div>
                </div>

                <div className="space-y-8">
                    {brokers.map((broker: any, index: number) => (
                        <Card key={index} className={`rounded-[2.5rem] border-0 shadow-xl shadow-slate-200/50 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl ${broker.featured ? 'ring-2 ring-blue-500' : ''}`}>
                            {broker.featured && (
                                <div className="bg-gradient-to-r from-secondary-600 to-blue-700 text-white text-center py-2 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                                    <Star className="w-3 h-3 fill-white" />
                                    Editor's Premier Choice
                                </div>
                            )}

                            <CardContent className="p-8">
                                <div className="grid lg:grid-cols-4 gap-12">
                                    {/* Identity */}
                                    <div className="lg:col-span-1 border-r border-slate-100 pr-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-16 h-16 rounded-[2rem] bg-gradient-to-br ${broker.color} flex items-center justify-center text-white text-3xl font-bold shadow-xl`}>
                                                {broker.logo}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{broker.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-sm font-extrabold text-slate-900">{broker.rating}</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">({broker.reviews})</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold leading-relaxed italic mb-6">"{broker.tagline}"</p>
                                        <Badge className="bg-secondary-50 text-secondary-700 border-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                                            <Users className="w-3 h-3 mr-1.5" />
                                            {broker.users} Community
                                        </Badge>
                                    </div>

                                    {/* Pricing Matrix */}
                                    <div className="lg:col-span-1 py-2">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <Info className="w-3.5 h-3.5" />
                                            Brokerage Fee
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center group/fee">
                                                <span className="text-xs font-bold text-slate-500 group-hover/fee:text-slate-900 transition-colors uppercase tracking-tight">Delivery</span>
                                                <span className="font-extrabold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">{broker.pricing.equity}</span>
                                            </div>
                                            <div className="flex justify-between items-center group/fee">
                                                <span className="text-xs font-bold text-slate-500 group-hover/fee:text-slate-900 transition-colors uppercase tracking-tight">Account Opening</span>
                                                <span className="font-extrabold text-slate-900">{broker.pricing.accountOpening}</span>
                                            </div>
                                            <div className="flex justify-between items-center group/fee">
                                                <span className="text-xs font-bold text-slate-500 group-hover/fee:text-slate-900 transition-colors uppercase tracking-tight">F&O / Options</span>
                                                <span className="font-extrabold text-slate-900">{broker.pricing.options}</span>
                                            </div>
                                            <div className="flex justify-between items-center group/fee">
                                                <span className="text-xs font-bold text-slate-500 group-hover/fee:text-slate-900 transition-colors uppercase tracking-tight">Yearly AMC</span>
                                                <span className="font-extrabold text-slate-900">{broker.pricing.amc}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* High Yield Features */}
                                    <div className="lg:col-span-1 py-2">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <Check className="w-3.5 h-3.5" />
                                            Premium Insights
                                        </h4>
                                        <div className="space-y-3">
                                            {broker.pros.slice(0, 4).map((pro: string, pIndex: number) => (
                                                <div key={pIndex} className="flex items-start gap-3 p-2 rounded-xl transition-colors hover:bg-slate-50">
                                                    <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Check className="w-3 h-3 text-primary-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 leading-tight">{pro}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Transaction Panel */}
                                    <div className="lg:col-span-1 flex flex-col justify-center">
                                        <div className="bg-gradient-to-br from-primary-600 to-blue-600 dark:from-primary-500 dark:to-blue-500 rounded-[2rem] p-6 mb-4 text-white relative h-full flex flex-col justify-between overflow-hidden group/cta shadow-xl shadow-primary-500/20">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Tailored for</p>
                                                <p className="text-sm font-extrabold leading-tight mb-6">{broker.bestFor}</p>
                                            </div>
                                            <Button className="w-full rounded-2xl bg-white hover:bg-blue-50 text-primary-600 font-bold py-6 shadow-lg transition-all active:scale-95">
                                                Get Started
                                                <ArrowUpRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Knowledge Center */}
                <div className="mt-24 grid md:grid-cols-2 gap-8">
                    <Card className="rounded-[3rem] border-0 shadow-lg bg-gradient-to-br from-secondary-600 to-indigo-700 text-white overflow-hidden p-6 md:p-8 relative">
                        <Building2 className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10" />
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-2xl font-bold tracking-tight">The Modern Demat Guide</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-secondary-100 leading-relaxed font-medium mb-8">
                                A Demat (Dematerialized) account is the digital foundation of your financial journey. It holds your stocks, ETFs, and bonds in high-security electronic format.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    "SEBI Regulated",
                                    "Instant Liquidity",
                                    "Zero Paperwork",
                                    "Pan India Access"
                                ].map((l, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-md">
                                        <Check className="w-4 h-4 text-primary-400" />
                                        <span className="text-xs font-bold uppercase tracking-tight">{l}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[3rem] border-0 shadow-lg bg-white overflow-hidden p-6 md:p-8">
                        <CardHeader className="p-0 mb-8">
                            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-6 md:p-8">
                                <Zap className="w-7 h-7 text-amber-500" />
                                Fast Track Activation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-6">
                                {[
                                    { step: "01", text: "Select your preferred broker and download their mobile app." },
                                    { step: "02", text: "Upload Aadhaar, PAN & Bank proofs for instant digital KYC." },
                                    { step: "03", text: "Authenticate using e-Sign via mobile OTP verification." },
                                    { step: "04", text: "Receive unique BO-ID and start trading within 24 hours." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <span className="text-2xl font-bold text-slate-200 group-hover:text-secondary-500 transition-colors shrink-0 leading-none">{item.step}</span>
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 pt-8 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <HelpCircle className="w-5 h-5" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">For inquiries, please contact support.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
