"use client";

import React, { useState } from 'react';
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/common/SEOHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    Globe,
    Activity,
    Award,
    ArrowUpRight,
    ArrowRight,
    ChevronRight,
    Zap,
    Star,
    Users,
    Search,
    Building2,
    PieChart
} from "lucide-react";
import Link from 'next/link';

const marketIndices = [
    { name: "NIFTY 50", value: "22,419.95", change: "+0.82%", isUp: true },
    { name: "SENSEX", value: "73,876.82", change: "+0.75%", isUp: true },
    { name: "BANK NIFTY", value: "48,142.50", change: "-0.12%", isUp: false },
    { name: "NIFTY IT", value: "35,892.30", change: "+1.24%", isUp: true },
];

const topGainers = [
    { name: "Tata Motors", price: "â‚¹972.45", change: "+5.82%", sector: "Auto" },
    { name: "Wipro", price: "â‚¹487.20", change: "+4.15%", sector: "IT" },
    { name: "HDFC Life", price: "â‚¹612.35", change: "+3.92%", sector: "Insurance" },
    { name: "Bajaj Finance", price: "â‚¹7,234.50", change: "+3.45%", sector: "NBFC" },
];

const topLosers = [
    { name: "ITC", price: "â‚¹428.15", change: "-2.34%", sector: "FMCG" },
    { name: "Coal India", price: "â‚¹445.80", change: "-1.98%", sector: "Mining" },
    { name: "ONGC", price: "â‚¹278.45", change: "-1.56%", sector: "Oil & Gas" },
    { name: "Power Grid", price: "â‚¹312.20", change: "-1.23%", sector: "Power" },
];

export default function StocksPage() {
    const { data: ipoData = [], isLoading: ipoLoading } = useQuery({
        queryKey: ['ipos'],
        queryFn: () => api.entities.IPO.list()
    });

    const { data: brokers = [], isLoading: brokersLoading } = useQuery({
        queryKey: ['brokers'],
        queryFn: () => api.entities.Broker.list()
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <SEOHead
                title="Stock Market Central - Live IPOs & Analysis | InvestingPro"
                description="Track live Indian stock market, upcoming IPOs, and top gainers/losers. Compare best stock brokers like Zerodha, Groww, and Upstox."
            />

            {/* High-Impact Hero Section */}
            <div className="bg-slate-900 border-b border-white/5 pt-28 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[140px] -translate-y-1/2" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-600 rounded-full blur-[120px] translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="max-w-2xl text-center lg:text-left">
                            <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20 px-4 py-2 mb-8 rounded-full">
                                <Activity className="w-3.5 h-3.5 mr-2" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Real-time Market Delta</span>
                            </Badge>
                            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                                Precision <br /> <span className="text-primary-400">Equity Hub</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-10 font-medium leading-relaxed">
                                Professional-grade market tracking for retail power-traders. Monitor live IPO sentiments, breakouts, and benchmarking tools.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <Button className="rounded-2xl bg-primary-500 hover:bg-primary-600 text-slate-900 font-bold h-16 px-10 shadow-2xl shadow-primary-500/20 text-lg">
                                    Start Trading Now
                                    <ArrowUpRight className="ml-2 w-6 h-6" />
                                </Button>
                                <Button variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold h-16 px-10 text-lg">
                                    Watchlist Insights
                                </Button>
                            </div>
                        </div>

                        {/* Market Indices Widget */}
                        <div className="w-full lg:w-[460px] grid grid-cols-2 gap-4">
                            {marketIndices.map((index, i) => (
                                <Card key={i} className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:bg-white/10 transition-all cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-st">{index.name}</span>
                                            {index.isUp ? (
                                                <TrendingUp className="w-4 h-4 text-primary-400" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-rose-400" />
                                            )}
                                        </div>
                                        <p className="text-xl font-bold text-white mb-1 tracking-tight">{index.value}</p>
                                        <p className={`text-xs font-bold ${index.isUp ? 'text-primary-400' : 'text-rose-400'}`}>
                                            {index.change}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                {/* Market Movers Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                    <Card className="rounded-[3rem] border-0 shadow-2xl bg-white p-6 md:p-8 group overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Top Gainers</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intraday Powerhouses</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="rounded-xl font-semibold text- uppercase text-primary-600 tracking-widest">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {topGainers.map((stock, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-primary-100 hover:bg-white transition-all group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-semibold text- text-slate-400 group-hover/item:bg-primary-600 group-hover/item:text-white transition-colors">
                                            {stock.name.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{stock.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{stock.sector}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{stock.price}</p>
                                        <p className="text-xs font-bold text-primary-600">{stock.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] border-0 shadow-2xl bg-white p-6 md:p-8 group overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-600">
                                    <TrendingDown className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Top Losers</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Laggards</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="rounded-xl font-semibold text- uppercase text-rose-600 tracking-widest">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {topLosers.map((stock, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-rose-100 hover:bg-white transition-all group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-semibold text- text-slate-400 group-hover/item:bg-danger-600 group-hover/item:text-white transition-colors">
                                            {stock.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{stock.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{stock.sector}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{stock.price}</p>
                                        <p className="text-xs font-bold text-rose-600">{stock.change}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* IPO Tracker Section */}
                <div className="mb-24">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">IPO Mainboard Pulse</h2>
                            <p className="text-slate-500 font-bold mt-1 text-sm uppercase tracking-widest opacity-60">Live GMP & Subscription Levels</p>
                        </div>
                        <Link href="/calculators">
                            <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-8 font-semibold text- uppercase tracking-widest">IPO Lot Calculator</Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ipoLoading ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                <LoadingSpinner text="Benchmarking Live IPO Data..." />
                            </div>
                        ) : ipoData.map((ipo: any, idx: number) => (
                            <Card key={idx} className="rounded-[3rem] border-0 shadow-xl overflow-hidden group hover:shadow-2xl transition-all bg-white p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ipo.color || 'from-slate-800 to-slate-900'} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                                        {ipo.name.substring(0, 1)}
                                    </div>
                                    <Badge className={`border-0 rounded-xl px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${ipo.status === 'Open' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-400'}`}>
                                        {ipo.status}
                                    </Badge>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{ipo.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Premium Mainboard Issuer</p>

                                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl mb-8 border border-white">
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-st mb-1">Issue Price</p>
                                        <p className="font-semibold text- text-slate-900">{ipo.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-st mb-1">Subscription</p>
                                        <p className="font-semibold text- text-primary-600">{ipo.subscription}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-st mb-1">Lot Size</p>
                                        <p className="font-semibold text- text-slate-900">{ipo.lot}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-st mb-1">Listing Date</p>
                                        <p className="font-semibold text- text-slate-900">{ipo.listing}</p>
                                    </div>
                                </div>

                                <Button className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-secondary-600 dark:bg-primary-500 dark:hover:bg-secondary-500 text-white font-bold shadow-xl group/btn transition-all">
                                    Analyze GMP Analysis
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Broker Benchmarking */}
                <div className="mb-24">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Best Stock Brokers 2024</h2>
                            <p className="text-slate-500 font-bold mt-1 text-sm uppercase tracking-widest opacity-60">Conflict-Free Benchmarking</p>
                        </div>
                        <Link href="/demat-accounts">
                            <Button variant="ghost" className="font-semibold text-primary-600 uppercase tracking-widest text-">Compare 15+ Platforms <ChevronRight className="w-4 h-4" /></Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {brokersLoading ? (
                            <div className="col-span-full py-12 flex items-center justify-center">
                                <LoadingSpinner text="Scanning Brokerage Engines..." />
                            </div>
                        ) : brokers.slice(0, 4).map((broker: any, idx: number) => (
                            <Card key={idx} className="rounded-[3.5rem] border-0 shadow-2xl bg-white overflow-hidden group hover:-translate-y-1 transition-all p-8 lg:p-6 md:p-8">
                                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                                    <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${broker.color || 'from-slate-800 to-slate-900'} flex items-center justify-center text-white font-bold text-3xl shadow-2xl shrink-0 group-hover:rotate-6 transition-transform`}>
                                        {broker.logo}
                                    </div>
                                    <div className="text-center sm:text-left flex-1">
                                        <div className="flex items-center justify-center sm:justify-between mb-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{broker.name}</h3>
                                            <div className="hidden sm:flex items-center gap-1 bg-accent-50 px-3 py-1.5 rounded-xl border border-accent-100">
                                                <Star className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
                                                <span className="text-sm font-bold text-accent-700">{broker.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" />
                                                {broker.users} Verified Users
                                            </span>
                                            <Badge className="rounded-xl border-slate-100 bg-slate-50 text-slate-600 text-[9px] font-bold uppercase">{broker.bestFor}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid items-center grid-cols-2 gap-4 mb-10 p-6 bg-slate-50 rounded-[2.5rem] border border-white">
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-st mb-1">Equity Intraday</p>
                                        <p className="font-extrabold text-slate-900">{broker.pricing?.intraday || 'â‚¹20'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-st mb-1">Equity Delivery</p>
                                        <p className="font-bold text-primary-600">{broker.pricing?.equity || 'â‚¹0'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10 pl-2">
                                    {broker.pros?.slice(0, 3).map((pro: string, pIdx: number) => (
                                        <div key={pIdx} className="flex items-start gap-3">
                                            <Zap className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                                            <span className="text-sm font-bold text-slate-600 leading-tight">{pro}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full h-16 rounded-[1.5rem] bg-primary-600 hover:bg-secondary-600 dark:bg-primary-500 dark:hover:bg-secondary-500 text-white font-bold text-lg transition-all shadow-2xl active:scale-95">
                                    Open Paperless Account
                                    <ArrowUpRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Macro Wisdom Section */}
                <div className="bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 rounded-[4rem] p-16 lg:p-24 text-white overflow-hidden relative group shadow-2xl shadow-primary-500/20">
                    <Globe className="absolute -right-24 -bottom-24 w-96 h-96 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                    <div className="max-w-3xl relative z-10">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-10">Institutional View</Badge>
                        <h2 className="text-4xl lg:text-6xl font-bold mb-10 tracking-tight leading-tight">Master the <br /> <span className="text-white/90">Macro Variables</span></h2>
                        <p className="text-xl text-white/80 font-medium leading-relaxed mb-16">
                            Retail traders look at prices. Professionals look at "Liquidity Clusters" and "Macro Correlations." Track NIFTY 500 sentiment deltas across all global gateways.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-12">
                            {[
                                { icon: Activity, label: "FII Flow", value: "â‚¹2,450 Cr Net" },
                                { icon: Building2, label: "DII Flow", value: "â‚¹1,820 Cr Net" },
                                { icon: PieChart, label: "NIFTY PE", value: "22.45 (Optimal)" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/30">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
