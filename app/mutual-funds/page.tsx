"use client";

import React, { useState, useEffect } from 'react';
import { api } from "@/lib/api";
import SEOHead from "@/components/common/SEOHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import EmptyState from "@/components/common/EmptyState";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Star,
    TrendingUp,
    TrendingDown,
    Filter,
    ArrowUpRight,
    Info,
    ChevronRight,
    Zap,
    ShieldCheck,
    Building2,
    PieChart,
    Activity,
    BarChart3,
    Target,
    LayoutGrid,
    List,
    ArrowRight
} from "lucide-react";
import Link from 'next/link';
import { FilterSidebar } from "@/components/mutual-funds/FilterSidebar";
import { FundTable } from "@/components/mutual-funds/FundTable";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";

const FUND_CATEGORIES = ["All", "Equity", "Debt", "Hybrid", "ELSS", "Index"];

const riskColors: Record<string, string> = {
    "Low": "bg-green-50 text-green-700 border-green-100",
    "Low to Moderate": "bg-teal-50 text-teal-700 border-teal-100",
    "Moderate": "bg-secondary-50 text-secondary-700 border-secondary-100",
    "Moderately High": "bg-amber-50 text-amber-700 border-amber-100",
    "High": "bg-orange-50 text-orange-700 border-orange-100",
    "Very High": "bg-red-50 text-red-700 border-red-100",
};

export default function MutualFundsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table'); // Default to table for Pro users

    // Data State
    const [funds, setFunds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("returns_3y");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Enhanced Filter State
    const [filters, setFilters] = useState<any>({
        minReturns: 0,
        maxExpenseRatio: 2.5,
        minAum: 0,
        riskLevels: [],
        categories: [],
        amcs: [],
        rating: 0
    });

    const activeFiltersCount = 
        (filters.riskLevels.length > 0 ? 1 : 0) + 
        (filters.categories.length > 0 ? 1 : 0) +
        (filters.amcs.length > 0 ? 1 : 0);

    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadFunds();
    }, [currentPage, sortBy, searchTerm, selectedCategory]);

    const loadFunds = async () => {
        setLoading(true);
        try {
            const { data, count } = await api.entities.MutualFund.list({
                page: currentPage,
                limit: itemsPerPage,
                categoryType: selectedCategory,
                sortBy: `${sortBy}:desc`,
                searchTerm: searchTerm
            });

            if (data && data.length > 0) {
                // Normalize Supabase Product to UI Fund structure
                const normalizedFunds = data.map((p: any) => {
                    const f = p.features || {};
                    return {
                        id: p.slug || p.id,
                        name: p.name,
                        category: f.sub_category || 'Large Cap',
                        type: f.category || 'Equity',
                        aum: f.aum_crores ? `₹${f.aum_crores} Cr` : 'N/A',
                        returns_1y: parseFloat(f.returns_1y || '0'),
                        returns_3y: parseFloat(f.returns_3y || '0'),
                        returns_5y: parseFloat(f.returns_5y || '0'),
                        rating: p.rating || 4,
                        risk: f.risk_level || 'Moderate',
                        expense_ratio: parseFloat(f.expense_ratio || '0'),
                        min_investment: f.min_sip ? `₹${f.min_sip}` : '₹500',
                        fund_house: p.provider_name
                    };
                });
                setFunds(normalizedFunds);
                setTotalCount(count);
            } else {
                setFunds([]);
                setTotalCount(0);
                logger.warn('No mutual funds found in database');
            }
        } catch (error) {
            logger.error('Error loading mutual funds', error as Error);
            setFunds([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Apply Advanced Filters
    const filteredFunds = funds.filter(fund => {
        const matchesSearch = (fund.name || "").toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category Filter
        const matchesCategory = filters.categories.length === 0 || 
            filters.categories.includes(fund.category || "") || 
            (filters.categories.includes("Equity") && fund.type === "Equity"); // Simple mapping fallback

        // Risk Filter
        const matchesRisk = filters.riskLevels.length === 0 || 
            filters.riskLevels.includes(fund.risk || "");

        // Returns Filter (Min 3Y)
        const matchesReturns = (fund.returns_3y || 0) >= filters.minReturns;

        // Expense Ratio Filter
        const matchesExpense = (fund.expense_ratio || 0) <= filters.maxExpenseRatio;

        return matchesSearch && matchesCategory && matchesRisk && matchesReturns && matchesExpense;
    }).sort((a, b) => {
         if (sortBy === "returns_1y") return (b.returns_1y || 0) - (a.returns_1y || 0);
         if (sortBy === "returns_3y") return (b.returns_3y || 0) - (a.returns_3y || 0);
         if (sortBy === "returns_5y") return (b.returns_5y || 0) - (a.returns_5y || 0);
         if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
         return 0;
    });


    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const paginatedFunds = funds; // Already paginated from server

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": filteredFunds.slice(0, 5).map((fund, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
                "@type": "InvestmentFund",
                "name": fund.name,
                "description": fund.category,
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": fund.rating || 4,
                    "bestRating": 5
                }
            }
        }))
    };

    return (
        <PageErrorBoundary pageName="Mutual Funds Page">
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
                <SEOHead
                    title="Direct Mutual Funds: High-Fidelity Performance Analysis | InvestingPro"
                    description="Compare 5,000+ mutual funds with raw data, risk-adjusted scores, and expert picking algorithms. Institutional grade fund analysis for Indian investors."
                    structuredData={structuredData}
                />

            {/* Light Theme Hero Section - Consistent with Platform */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-28 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500 rounded-full blur-[140px] -translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200 px-4 py-1.5 uppercase tracking-widest text-xs font-bold">
                        Data-Driven Fund Analysis
                    </Badge>
                     <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Perfect Mutual Fund</span>
                    </h1>
                     <div className="relative group max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                        </div>
                        <Input
                            placeholder="Search by fund name, AMC, or category..."
                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left: Professional Filter Panel */}
                    <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                         <FilterSidebar filters={filters} setFilters={setFilters} />
                    </ResponsiveFilterContainer>

                    {/* Right: Results Ledger */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="text-sm text-slate-500 font-medium">
                                Showing <span className="font-bold text-slate-900 dark:text-white">{funds.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> Funds
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                                <Select value={sortBy} onValueChange={(val: string) => {
                                    setSortBy(val);
                                    setCurrentPage(1);
                                }}>
                                    <SelectTrigger className="w-[180px] h-10 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="returns_3y">Highest 3Y Returns</SelectItem>
                                        <SelectItem value="rating">Best Rated</SelectItem>
                                        <SelectItem value="low_risk">Lowest Risk</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-20 flex flex-col items-center gap-4">
                                <LoadingSpinner text="Decrypting fund performance metrics..." />
                            </div>
                        ) : paginatedFunds.length === 0 ? (
                            <EmptyState 
                                title="No Funds Found" 
                                description="Adjust your filters to broaden your search." 
                                actionLabel="Clear Filters"
                                onAction={() => setFilters({
                                    minReturns: 0,
                                    maxExpenseRatio: 2.5,
                                    minAum: 0,
                                    riskLevels: [],
                                    categories: [],
                                    amcs: [],
                                    rating: 0
                                })}
                            />
                        ) : (
                             viewMode === 'table' ? (
                                <FundTable funds={paginatedFunds} />
                            ) : (
                                <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
                                     {paginatedFunds.map((fund, index) => (
                                         <Card
                                            key={index}
                                            className="rounded-[2.5rem] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden hover:shadow-2xl transition-all duration-300 group/card relative"
                                        >
                                             {/* Compare Checkbox for Grid is handled via RichProductCard logic usually, 
                                                but here we are using a custom Card. 
                                                I'll remove the manual checkbox and suggest using RichProductCard later or update this one. */}

                                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-50">
                                                {/* Primary Identity */}
                                                <div className="p-8 flex-1">
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500/10 to-teal-500/10 border border-teal-500/10 flex items-center justify-center text-teal-600 font-bold text-xl group-hover/card:scale-110 transition-transform">
                                                            {(fund.name || "A").substring(0, 1)}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="bg-slate-900/5 text-slate-600 border-0 text-[10px] font-semibold uppercase tracking-st px-2 py-0.5">
                                                                    {fund.category}
                                                                </Badge>
                                                                <div className="flex gap-0.5 grayscale group-hover/card:grayscale-0 transition-all">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`w-3 h-3 ${i < (fund.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Link href={`/mutual-funds/${fund.id}`}>
                                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover/card:text-primary-600 transition-colors">
                                                                    {fund.name}
                                                                </h3>
                                                            </Link>
                                                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                                                                <Building2 className="w-3 h-3" />
                                                                {fund.fund_house}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge className={`${riskColors[fund.risk] || riskColors["Moderate"]} border text-[10px] uppercase font-bold tracking-widest px-3`}>
                                                            {fund.risk || "MODERATE"} RISK
                                                        </Badge>
                                                        <Badge variant="outline" className="border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-3">
                                                            AUM: {fund.aum || "N/A"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Yield Analytics */}
                                                <div className="p-8 lg:w-72 bg-slate-50/50 group-hover/card:bg-teal-50/30 transition-colors flex items-center justify-between lg:justify-center">
                                                    <div className="grid grid-cols-3 lg:grid-cols-1 gap-6 text-center w-full lg:w-auto">
                                                        {[
                                                            { label: "1Y Yield", value: fund.returns_1y, trend: fund.returns_1y > 0 },
                                                            { label: "3Y Yield", value: fund.returns_3y, trend: fund.returns_3y > 0 },
                                                            { label: "5Y Yield", value: fund.returns_5y, trend: fund.returns_5y > 0 }
                                                        ].map((ret, i) => (
                                                            <div key={i} className="space-y-1">
                                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-st">{ret.label}</p>
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <p className={`text-xl font-bold ${ret.trend ? 'text-primary-600' : 'text-slate-900'}`}>{ret.value}%</p>
                                                                    {ret.trend ? <TrendingUp className="w-4 h-4 text-primary-500" /> : <TrendingDown className="w-4 h-4 text-slate-400" />}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Action Hub */}
                                                <div className="p-8 lg:w-48 flex flex-row lg:flex-col items-center justify-center gap-4">
                                                    <Link href={`/mutual-funds/${fund.id}`} className="w-full">
                                                        <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 hover:bg-white text-slate-900 font-extrabold text-[11px] uppercase tracking-[0.2em]">
                                                            Verify
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/mutual-funds/${fund.id}`} className="w-full">
                                                        <Button className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-primary-600 text-white font-extrabold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10">
                                                            Allocate
                                                            <ArrowUpRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                     ))
                                }
                                </div>
                            )
                        )}

                        {/* Pagination Integration */}
                        {!loading && totalCount > itemsPerPage && (
                            <div className="pt-10">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    totalItems={filteredFunds.length}
                                    itemsPerPage={itemsPerPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- EDUCATIONAL CONTENT HUB --- */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-100">Investor's Guide</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Wealth Creation Made Simple</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            You don't need to be an expert to beat inflation. Understand the basics of asset allocation.
                        </p>
                    </div>

                    {/* 1. Types of Funds Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[
                            { title: "Equity Funds", desc: "Invests in stocks. High risk, high reward (12-15% avg returns). Ideal for long-term goals (>5 years).", icon: TrendingUp },
                            { title: "Debt Funds", desc: "Invests in bonds and government securities. Low risk, stable returns (6-8%). Better alternative to FDs.", icon: ShieldCheck },
                            { title: "ELSS Funds", desc: "Equity Linked Savings Scheme. Saves tax under Sec 80C. Lock-in period of 3 years. Best tax-saving option.", icon: PieChart }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                    <item.icon className="w-6 h-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* 2. Visual Guide Placeholder (Canva) */}
                    <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative mb-24 text-white">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="p-12 md:p-20 md:w-1/2 relative z-10">
                                <Badge className="mb-6 bg-teal-500/20 text-teal-300 border-teal-500/30">Power of Compounding</Badge>
                                <h3 className="text-4xl font-bold mb-6">Start Early to Retire Rich</h3>
                                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                    Investing ₹5,000/month for 20 years can turn into ₹50 Lakhs. 
                                    Delaying by just 5 years can cost you over ₹25 Lakhs in returns.
                                </p>
                                <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold h-12 px-8 rounded-xl">
                                    Start SIP Calculator
                                </Button>
                            </div>
                            <div className="md:w-1/2 bg-slate-800/50 h-[400px] md:h-full flex items-center justify-center border-l border-slate-700 border-dashed">
                                {/* PLACEHOLDER FOR CANVA IMAGE */}
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-500">
                                        <span className="text-xs text-slate-400 font-mono">IMAGE</span>
                                    </div>
                                    <p className="text-slate-400 font-mono text-sm">Use Content Injection<br/>"SIP Growth Chart"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. FAQ Accordion */}
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-center mb-10 text-slate-900 dark:text-white">Common Questions</h3>
                        <div className="space-y-4">
                            {[
                                { q: "Is it safe to invest in Mutual Funds?", a: "Mutual funds are subject to market risks, but they are regulated by SEBI. Choosing distinct fund houses and staying invested for the long term significantly reduces risk." },
                                { q: "What is Expense Ratio?", a: "The yearly fee charged by the fund house to manage money. Direct plans (like on InvestingPro) have lower expense ratios (0.5-1%) compared to Regular plans (1.5-2%)." },
                                { q: "Can I stop my SIP anytime?", a: "Yes, you can stop, pause, or increase your SIP amount at any time without penalty. However, exit loads may apply if you withdraw funds within 1 year." }
                            ].map((faq, i) => (
                                <details key={i} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 cursor-pointer">
                                    <summary className="font-bold text-slate-900 dark:text-white flex justify-between items-center list-none">
                                        {faq.q}
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed pl-0">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>
        </PageErrorBoundary>
    );
}
