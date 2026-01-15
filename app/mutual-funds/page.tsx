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
    ArrowUpRight,
    ShieldCheck,
    Building2,
    PieChart,
    LayoutGrid,
    List,
    ArrowRight,
    Sparkles
} from "lucide-react";
import Link from 'next/link';
import { FilterSidebar } from "@/components/mutual-funds/FilterSidebar";
import { FundTable } from "@/components/mutual-funds/FundTable";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";
import { SIPCalculator } from "@/components/calculators/SIPCalculator";
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

const FUND_CATEGORIES = ["All", "Equity", "Debt", "Hybrid", "ELSS", "Index"];

const riskColors: Record<string, string> = {
    "Low": "bg-success-50 text-success-700 border-success-100",
    "Low to Moderate": "bg-primary- text-primary- border-primary-",
    "Moderate": "bg-secondary-50 text-secondary-700 border-secondary-100",
    "Moderately High": "bg-accent-50 text-accent-700 border-accent-100",
    "High": "bg-accent-50 text-accent-700 border-accent-100",
    "Very High": "bg-danger-50 text-danger-700 border-danger-100",
};

import CategoryHeroCarousel from '@/components/common/CategoryHeroCarousel';
import ContextualNewsWidget from '@/components/news/ContextualNewsWidget';
import RatesWidget from '@/components/rates/RatesWidget';

const MF_SLIDES = [
    {
        id: '1',
        title: "Find Your Perfect Mutual Fund",
        subtitle: "Goal-Based Recommendations",
        description: "Get personalized fund recommendations based on your investment goals, risk profile, and timeline. Start SIP instantly.",
        ctaText: "Find My Perfect Fund",
        ctaLink: "/mutual-funds/find-your-fund",
        color: "from-green-600 to-emerald-500"
    },
    {
        id: '2',
        title: "Tax Saving ELSS",
        subtitle: "Save â‚¹46,800",
        description: "Invest in Equity Linked Savings Schemes and save tax under Section 80C. Best wealth creation + tax saving combo.",
        ctaText: "Explore ELSS",
        ctaLink: "?category=ELSS",
        color: "from-emerald-900 to-slate-900"
    },
    {
        id: '3',
        title: "Start SIP at â‚¹500",
        subtitle: "Beginner Friendly",
        description: "You don't need a lot of money to start. Build wealth with small, disciplined monthly investments.",
        ctaText: "Start SIP",
        ctaLink: "#sip-calculator",
        color: "from-purple-900 to-slate-900"
    }
];

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
                // Normalize Supabase Product to UI Fund structure
                const normalizedFunds = data.map((p: any) => {
                    return {
                        id: p.slug || p.id,
                        name: p.name,
                        // api.ts returns category: 'mutual_fund', type: p.category (e.g. 'Large Cap')
                        // So p.type is the sub-category like 'Large Cap'
                        category: p.type || 'Equity', 
                        type: 'Equity', // Hardcoded or derived? UI uses this for badge. 
                        
                        aum: p.aum, 
                        returns_1y: p.returns1Y,
                        returns_3y: p.returns3Y,
                        returns_5y: p.returns5Y,
                        rating: p.rating,
                        risk: p.riskLevel, 
                        expense_ratio: p.expenseRatio,
                        min_investment: p.minInvestment,
                        fund_house: p.providerName
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
                    title="Find Your Perfect Mutual Fund - Compare & Start SIP Instantly | InvestingPro"
                    description="Compare 1000+ mutual funds. Get personalized recommendations based on your goals, risk profile, and timeline. Make smart decisions and start SIP instantly."
                    structuredData={structuredData}
                />



            {/* Carousel Hero Section */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 pt-28 pb-12 relative overflow-hidden">
                <div className="container mx-auto px-4">
                     <AutoBreadcrumbs />
                     <CategoryHeroCarousel slides={MF_SLIDES} className="mb-12 shadow-2xl" />
                     
                     {/* Decision Engine CTA - Prominent */}
                     <div className="max-w-4xl mx-auto mb-12 relative z-20 -mt-20">
                         <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white shadow-2xl">
                             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                 <div className="flex-1">
                                     <div className="flex items-center gap-2 mb-3">
                                         <Sparkles className="w-6 h-6" />
                                         <span className="text-sm font-semibold uppercase tracking-wider text-green-100">Decision Engine</span>
                                     </div>
                                     <h2 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Mutual Fund</h2>
                                     <p className="text-green-100 text-lg">Get personalized recommendations based on your investment goals, risk profile, and timeline. Compare and start SIP instantly.</p>
                                 </div>
                                 <Link href="/mutual-funds/find-your-fund">
                                     <Button size="lg" className="bg-white text-green-700 font-bold hover:bg-green-50 h-14 px-8 text-lg">
                                         Find My Perfect Fund
                                         <ArrowRight className="w-5 h-5 ml-2" />
                                     </Button>
                                 </Link>
                             </div>
                         </div>
                     </div>

                     <div className="relative group max-w-xl mx-auto mb-12 z-20">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary- transition-colors" />
                        </div>
                        <Input
                            placeholder="Search funds (e.g. 'HDFC Equity', 'Large Cap')..."
                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 focus:border-primary- focus:ring-2 focus:ring-primary-/20 transition-all shadow-xl"
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
                         
                         {/* Marketing Widgets in Sidebar */}
                         <div className="mt-8 space-y-6">
                            <RatesWidget category="investing" title="Market Rates" />
                            <ContextualNewsWidget category="investing" title="Market News" />
                         </div>
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
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500/10 to-primary-/10 border border-primary-/10 flex items-center justify-center text-primary- font-bold text-xl group-hover/card:scale-110 transition-transform">
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
                                                                            className={`w-3 h-3 ${i < (fund.rating || 4) ? 'text-accent-400 fill-accent-400' : 'text-slate-200'}`}
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
                                                <div className="p-8 lg:w-72 bg-slate-50/50 group-hover/card:bg-primary-/30 transition-colors flex items-center justify-between lg:justify-center">
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
                                                        <Button className="w-full h-12 rounded-2xl bg-primary-600 hover:bg-secondary-600 dark:bg-primary-500 dark:hover:bg-secondary-500 text-white font-extrabold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 transition-all">
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

            {/* --- SIP CALCULATOR SECTION --- */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <Badge className="mb-4 bg-primary-50 text-primary-700 border-primary-200">Interactive Tool</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Plan Your SIP Journey
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Calculate how much your systematic investment can grow over time
                        </p>
                    </div>
                    <SIPCalculator />
                </div>
            </div>

            {/* --- EDUCATIONAL CONTENT HUB --- */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary- text-primary- border-primary-">Investor's Guide</Badge>
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
                                    <item.icon className="w-6 h-6 text-primary-" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* 2. Visual Guide Placeholder (Canva) */}
                    <div className="bg-gradient-to-br from-primary-600 to-blue-600 dark:from-primary-500 dark:to-blue-500 rounded-[3rem] overflow-hidden relative mb-24 text-white shadow-2xl shadow-primary-500/20">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="p-12 md:p-20 md:w-1/2 relative z-10">
                                <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">Power of Compounding</Badge>
                                <h3 className="text-4xl font-bold mb-6">Start Early to Retire Rich</h3>
                                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                                    Investing â‚¹5,000/month for 20 years can turn into â‚¹50 Lakhs. 
                                    Delaying by just 5 years can cost you over â‚¹25 Lakhs in returns.
                                </p>
                                <Button className="bg-white hover:bg-secondary-50 text-primary-600 font-bold h-12 px-8 rounded-xl shadow-lg transition-all">
                                    Start SIP Calculator
                                </Button>
                            </div>
                            <div className="md:w-1/2 bg-white/10 backdrop-blur-sm h-[400px] md:h-full flex items-center justify-center border-l border-white/20 border-dashed">
                                {/* PLACEHOLDER FOR CANVA IMAGE */}
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-white/40">
                                        <span className="text-xs text-white/60 font-mono">IMAGE</span>
                                    </div>
                                    <p className="text-white/60 font-mono text-sm">Use Content Injection<br/>"SIP Growth Chart"</p>
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
