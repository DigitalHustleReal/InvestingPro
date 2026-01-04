"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    AlertCircle,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Target,
    Building2,
    Sparkles,
    Activity,
    Info,
    RefreshCw,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOHead from "@/components/common/SEOHead";
import Link from 'next/link';

// IPO Data Interface matching our service
interface IPOData {
    id: string;
    companyName: string;
    issuePrice?: number;
    lotSize?: number;
    gmp?: number;
    estimatedListingPrice?: number;
    subscriptionQIB?: number;
    subscriptionNII?: number;
    subscriptionRetail?: number;
    openDate?: Date;
    closeDate?: Date;
    listingDate?: Date;
    issueSizeCr?: number;
    priceBand?: string;
    dataSource: string;
    lastUpdated: Date;
}


export default function IPOPage() {
    const [activeTab, setActiveTab] = useState('all');

    // Fetch IPO data using React Query
    const { data: apiResponse, isLoading, error, refetch, dataUpdatedAt } = useQuery({
        queryKey: ['ipo-data'],
        queryFn: async () => {
            const response = await fetch('/api/ipo/live');
            if (!response.ok) throw new Error('Failed to fetch IPO data');
            return response.json();
        },
        refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
        staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
    });

    const ipos: IPOData[] = apiResponse?.data || [];
    const lastUpdated = apiResponse?.lastUpdated ? new Date(apiResponse.lastUpdated) : new Date(dataUpdatedAt);

    // Utility functions
    const getIPOStatus = (ipo: IPOData): 'open' | 'upcoming' | 'closed' => {
        if (!ipo.openDate || !ipo.closeDate) return 'upcoming';
        const now = new Date();
        const openDate = new Date(ipo.openDate);
        const closeDate = new Date(ipo.closeDate);
        
        if (now >= openDate && now <= closeDate) return 'open';
        if (now < openDate) return 'upcoming';
        return 'closed';
    };

    const calculateOverallSubscription = (ipo: IPOData): number => {
        const qib = ipo.subscriptionQIB || 0;
        const nii = ipo.subscriptionNII || 0;
        const retail = ipo.subscriptionRetail || 0;
        // Weighted average: QIB 50%, NII 35%, Retail 15%
        return Math.round((qib * 0.5 + nii * 0.35 + retail * 0.15) * 100) / 100;
    };

    const formatCurrency = (amount?: number): string => {
        if (!amount) return '—';
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'open': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
            case 'upcoming': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20';
            case 'closed': return 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
            default: return 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
        }
    };

    const getGMPColor = (gmp?: number) => {
        if (!gmp) return 'text-slate-600 dark:text-slate-400';
        if (gmp > 0) return 'text-emerald-600 dark:text-emerald-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getSubscriptionColor = (value?: number) => {
        if (!value) return 'bg-slate-400';
        if (value >= 100) return 'bg-emerald-500';
        if (value >= 50) return 'bg-yellow-500';
        return 'bg-slate-400';
    };

    // Filter IPOs based on active tab
    const filteredIPOs = ipos.filter(ipo => {
        if (activeTab === 'all') return true;
        return getIPOStatus(ipo) === activeTab;
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading IPO data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Failed to Load Data</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            {error instanceof Error ? error.message : 'Unknown error occurred'}
                        </p>
                        <Button onClick={() => refetch()} className="bg-indigo-600 hover:bg-indigo-700">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <SEOHead
                title="IPO Calendar & Grey Market Premium (GMP) Tracker 2026 | InvestingPro"
                description="Track live IPO subscription status, Grey Market Premium (GMP), and get listing day predictions. Compare upcoming, open, and closed IPOs in India."
            />

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-indigo-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-purple-500/20" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-6 px-4 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 font-semibold uppercase tracking-wide text-[11px] inline-flex items-center gap-2 rounded-full">
                            <Activity className="w-3.5 h-3.5" />
                            Live Market Data
                        </Badge>
                        
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
                            IPO Calendar & <br className="hidden lg:block" />
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">GMP Tracker</span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Track Grey Market Premium (GMP), subscription status, and get data-driven listing predictions 
                            for all upcoming and current IPOs in India.
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            {[
                                { label: "Active IPOs", value: ipos.length.toString(), icon: Target, color: "emerald" },
                                { label: "Avg GMP", value: `+₹${Math.round(ipos.reduce((acc, ipo) => acc + (ipo.gmp || 0), 0) / (ipos.length || 1))}`, icon: TrendingUp, color: "teal" },
                                { label: "This Month", value: ipos.filter(ipo => {
                                    const listingDate = ipo.listingDate ? new Date(ipo.listingDate) : null;
                                    return listingDate && listingDate.getMonth() === new Date().getMonth();
                                }).length.toString(), icon: Calendar, color: "blue" },
                                { label: "Data Source", value: apiResponse?.source || 'Live', icon: CheckCircle2, color: "purple" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                                        <stat.icon size={14} /> {stat.label}
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Last Updated & Refresh */}
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Clock className="w-4 h-4" />
                                Last updated: {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN DASHBOARD --- */}
            <main className="container mx-auto px-4 pb-16">
                
                {/* Filter Tabs */}
                <div className="mb-8 flex justify-center">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                            <TabsTrigger value="all" className="data-[state=active]:bg-slate-900 dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-slate-900">
                                All IPOs
                            </TabsTrigger>
                            <TabsTrigger value="open" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                                Open Now
                            </TabsTrigger>
                            <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                Upcoming
                            </TabsTrigger>
                            <TabsTrigger value="closed" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white">
                                Recently Closed
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* IPO Cards Grid */}
                <div className="grid gap-6 mb-12">
                    {filteredIPOs.length === 0 ? (
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl">
                            <CardContent className="p-16 text-center">
                                <Info className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    No IPOs Found
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    No {activeTab !== 'all' ? activeTab : ''} IPOs available at the moment.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredIPOs.map((ipo) => {
                            const status = getIPOStatus(ipo);
                            const overallSubscription = calculateOverallSubscription(ipo);
                            const gmpPercent = ipo.issuePrice && ipo.gmp 
                                ? Math.round((ipo.gmp / ipo.issuePrice) * 100 * 100) / 100 
                                : 0;

                            return (
                                <Card key={ipo.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-xl rounded-3xl overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left: Company Info */}
                                    <div className="lg:w-72 p-8 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shrink-0">
                                                                {ipo.companyName.substring(0, 3).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{ipo.companyName}</h3>
                                                <Badge className={getStatusColor(status)}>
                                                    {status === 'open' && '🟢 '}
                                                    {status === 'upcoming' && '🔵 '}
                                                    {status === 'closed' && '⚪ '}
                                                                    {status.toUpperCase()}
                                                </Badge>
                                                <div className="mt-3 text-sm">
                                                    <div className="text-slate-500 dark:text-slate-400">Issue Price</div>
                                                                    <div className="font-bold text-slate-900 dark:text-white text-xl">{formatCurrency(ipo.issuePrice)}</div>
                                                                    <div className="text-xs text-slate-500 mt-1">Lot Size: {ipo.lotSize || '—'} shares</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: GMP & Subscription */}
                                    <div className="flex-1 p-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* GMP Section */}
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                                    <Info size={14} />
                                                    Grey Market Premium (GMP)
                                                </div>
                                                                <div className={`flex items-center gap-2 text-4xl font-bold mb-2 ${getGMPColor(ipo.gmp)}`}>
                                                                    {ipo.gmp && ipo.gmp > 0 ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
                                                                    ₹{Math.abs(ipo.gmp || 0)}
                                                </div>
                                                                <div className={`text-sm font-semibold ${getGMPColor(ipo.gmp)}`}>
                                                    {gmpPercent > 0 ? '+' : ''}{gmpPercent}% over issue price
                                                </div>
                                                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Expected Listing Price</div>
                                                                    <div className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(ipo.estimatedListingPrice)}</div>
                                                </div>
                                            </div>

                                            {/* Subscription Section */}
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                                    <BarChart3 size={14} />
                                                    Subscription Status
                                                </div>
                                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                                    {overallSubscription}x
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    {[
                                                                        { label: 'QIB (Institutions)', value: ipo.subscriptionQIB || 0 },
                                                                        { label: 'NII (High Net Worth)', value: ipo.subscriptionNII || 0 },
                                                                        { label: 'Retail (Individual)', value: ipo.subscriptionRetail || 0 }
                                                    ].map((cat, idx) => (
                                                        <div key={idx}>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-slate-500 dark:text-slate-400">{cat.label}</span>
                                                                <span className="font-semibold text-slate-900 dark:text-white">{cat.value}x</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full ${getSubscriptionColor(cat.value)} transition-all`}
                                                                    style={{ width: `${Math.min((cat.value / 200) * 100, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between text-sm">
                                                <div>
                                                    <div className="text-slate-500 dark:text-slate-400 mb-1">Opens</div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                                        {ipo.openDate ? new Date(ipo.openDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                    </div>
                                                </div>
                                                <div className="text-slate-300 dark:text-slate-700">→</div>
                                                <div>
                                                    <div className="text-slate-500 dark:text-slate-400 mb-1">Closes</div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                                        {ipo.closeDate ? new Date(ipo.closeDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                    </div>
                                                </div>
                                                <div className="text-slate-300 dark:text-slate-700">→</div>
                                                <div>
                                                    <div className="text-slate-500 dark:text-slate-400 mb-1">Listing</div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                                        {ipo.listingDate ? new Date(ipo.listingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="lg:w-48 p-8 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-center gap-3">
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">
                                            View Details
                                        </Button>
                                        <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                                            Set Alert
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        );
                    })
                    )}
                </div>

                {/* Educational Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl">
                        <CardContent className="p-8">
                            <Sparkles className="w-8 h-8 text-indigo-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">What is Grey Market Premium (GMP)?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                GMP is the price at which IPO shares trade in the unofficial "grey market" before listing. 
                                A positive GMP suggests strong demand, but it's not a guarantee of listing day gains.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl">
                        <CardContent className="p-8">
                            <BarChart3 className="w-8 h-8 text-purple-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Understanding Subscription Data</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                QIB (banks/funds), NII (wealthy investors), and Retail subscription numbers help gauge 
                                demand across investor segments. Higher subscription often indicates confidence.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
