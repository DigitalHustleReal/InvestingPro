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
    List
} from "lucide-react";
import Link from 'next/link';
import { FilterSidebar } from "@/components/mutual-funds/FilterSidebar";
import { FundTable } from "@/components/mutual-funds/FundTable";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";

const FUND_CATEGORIES = ["All", "Equity", "Debt", "Hybrid", "ELSS", "Index"];

const riskColors: Record<string, string> = {
    "Low": "bg-green-50 text-green-700 border-green-100",
    "Low to Moderate": "bg-teal-50 text-teal-700 border-teal-100",
    "Moderate": "bg-blue-50 text-blue-700 border-blue-100",
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

    useEffect(() => {
        loadFunds();
    }, []);

    const handleCompareToggle = (id: string) => {
        // This page still uses selectedForCompare locally in some spots, 
        // but RichProductCard (when used) will use context.
        // For FundTable, we'll need to update it to use context too or pass context down.
    };

    const loadFunds = async () => {
        setLoading(true);
        try {
            const data = await api.entities.MutualFund.list();
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
            } else {
                // NO MOCK DATA - show empty state
                setFunds([]);
                logger.warn('No mutual funds found in database');
            }
        } catch (error) {
            logger.error('Error loading mutual funds', error as Error);
            // NO MOCK DATA - show error state
            setFunds([]);
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


    const totalPages = Math.ceil(filteredFunds.length / itemsPerPage);
    const paginatedFunds = filteredFunds.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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

            {/* Authority Hero Section */}
            <div className="bg-slate-900 border-b border-white/5 pt-28 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                     <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[140px] -translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <Badge className="mb-6 bg-slate-800 text-emerald-400 border-emerald-500/20 px-4 py-1.5 uppercase tracking-widest text-xs font-bold">
                        Alpha Discovery v2.0
                    </Badge>
                     <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                        Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Perfect Fund</span>
                    </h1>
                     <div className="relative group max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <Input
                            placeholder="Data Search: Fund Name, ISIN, or Manager Code..."
                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder:text-slate-400 focus:border-emerald-500/50 transition-all font-medium"
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
                                Showing <span className="font-bold text-slate-900 dark:text-white">{filteredFunds.length}</span> Funds
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
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
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-teal-500/10 flex items-center justify-center text-teal-600 font-bold text-xl group-hover/card:scale-110 transition-transform">
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
                                                                    <p className={`text-xl font-bold ${ret.trend ? 'text-emerald-600' : 'text-slate-900'}`}>{ret.value}%</p>
                                                                    {ret.trend ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-slate-400" />}
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
                        {!loading && filteredFunds.length > itemsPerPage && (
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

        </div>
        </PageErrorBoundary>
    );
}
