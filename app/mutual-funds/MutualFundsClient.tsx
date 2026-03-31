"use client";

import React, { useState, useEffect } from 'react';
import { apiClient as api } from '@/lib/api-client';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search, Star, TrendingUp, TrendingDown, LayoutGrid, List, Building2, ArrowRight,
} from "lucide-react";
import Link from 'next/link';
import { FilterSidebar } from "@/components/mutual-funds/FilterSidebar";
import { FundTable } from "@/components/mutual-funds/FundTable";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";
import { logger } from "@/lib/logger";

export default function MutualFundsClient() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [funds, setFunds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("returns_3y");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [totalCount, setTotalCount] = useState(0);

    const [filters, setFilters] = useState<any>({
        minReturns: 0,
        maxExpenseRatio: 2.5,
        minAum: 0,
        riskLevels: [],
        categories: [],
        amcs: [],
        rating: 0,
    });

    const activeFiltersCount =
        (filters.riskLevels.length > 0 ? 1 : 0) +
        (filters.categories.length > 0 ? 1 : 0) +
        (filters.amcs.length > 0 ? 1 : 0);

    useEffect(() => { setCurrentPage(1); }, [sortBy, searchTerm, filters]);
    useEffect(() => { loadFunds(); }, [currentPage, sortBy, searchTerm]);

    const loadFunds = async () => {
        setLoading(true);
        try {
            const response = await api.entities.MutualFund.list({
                page: currentPage,
                limit: itemsPerPage,
                sortBy: `${sortBy}:desc`,
                searchTerm,
            });
            const data = response?.data;
            const count = response?.count;
            if (Array.isArray(data) && data.length > 0) {
                setFunds(data.map((p: any) => ({
                    id: p.id || p.slug,
                    name: p.name || "Unknown Fund",
                    category: p.category || 'Equity',
                    aum: p.aum || 'N/A',
                    returns_1y: p.returns1Y ?? 0,
                    returns_3y: p.returns3Y ?? 0,
                    returns_5y: p.returns5Y ?? 0,
                    rating: p.rating ?? 0,
                    risk: p.riskLevel || "Moderate",
                    expense_ratio: p.expenseRatio ?? 0,
                    min_investment: p.minInvestment || "₹500",
                    fund_house: p.providerName || "Unknown",
                })));
                setTotalCount(count || 0);
            } else {
                setFunds([]);
                setTotalCount(0);
            }
        } catch (error) {
            logger.error('[MutualFunds] Error loading funds', error as Error);
            setFunds([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const filteredFunds = (Array.isArray(funds) ? funds : []).filter((fund) => {
        const matchesRisk = filters.riskLevels.length === 0 || filters.riskLevels.includes(fund.risk || "");
        const matchesReturns = (fund.returns_3y || 0) >= filters.minReturns;
        const matchesExpense = (fund.expense_ratio || 0) <= filters.maxExpenseRatio;
        return matchesRisk && matchesReturns && matchesExpense;
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Filter Sidebar */}
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <FilterSidebar filters={filters} setFilters={setFilters} />
            </ResponsiveFilterContainer>

            {/* Results */}
            <div className="flex-1 w-full space-y-4">
                {/* Search + toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search funds..."
                            className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-green-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search mutual funds"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort funds by"
                            className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer"
                        >
                            <option value="returns_3y">Highest 3Y Returns</option>
                            <option value="returns_1y">Highest 1Y Returns</option>
                            <option value="rating">Best Rated</option>
                            <option value="low_risk">Lowest Risk</option>
                        </select>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                            <button onClick={() => setViewMode('table')} aria-pressed={viewMode === 'table'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><List className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><LayoutGrid className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-900">{filteredFunds.length}</span> of <span className="font-semibold text-gray-900">{totalCount}</span> funds
                </p>

                {/* Loading */}
                {loading ? (
                    <div className="py-16 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            Loading funds...
                        </div>
                    </div>
                ) : filteredFunds.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 font-medium">No funds match your filters.</p>
                        <Button variant="outline" className="mt-3" onClick={() => setFilters({ minReturns: 0, maxExpenseRatio: 2.5, minAum: 0, riskLevels: [], categories: [], amcs: [], rating: 0 })}>
                            Clear Filters
                        </Button>
                    </div>
                ) : viewMode === 'table' ? (
                    <FundTable funds={filteredFunds} />
                ) : (
                    /* Grid view — compact v2 cards */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredFunds.map((fund) => (
                            <Link key={fund.id} href={`/mutual-funds/${fund.id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-semibold text-gray-500 uppercase">{fund.category}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} className={i < (fund.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">{fund.name}</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><Building2 size={10} />{fund.fund_house}</p>
                                    </div>
                                    <Badge className={`text-[9px] font-bold px-2 py-0.5 flex-shrink-0 ${
                                        fund.risk === 'Low' ? 'bg-green-50 text-green-700 border-green-200' :
                                        fund.risk === 'High' || fund.risk === 'Very High' ? 'bg-red-50 text-red-700 border-red-200' :
                                        'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>{fund.risk}</Badge>
                                </div>
                                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                                    {[
                                        { label: '1Y', value: fund.returns_1y, up: fund.returns_1y > 0 },
                                        { label: '3Y', value: fund.returns_3y, up: fund.returns_3y > 0 },
                                        { label: '5Y', value: fund.returns_5y, up: fund.returns_5y > 0 },
                                        { label: 'Exp', value: fund.expense_ratio, isExpense: true },
                                    ].map((col) => (
                                        <div key={col.label} className="text-center">
                                            <p className="text-[9px] text-gray-400 uppercase font-medium">{col.label}</p>
                                            <p className={`text-sm font-bold tabular-nums ${col.isExpense ? 'text-gray-700' : col.up ? 'text-green-600' : 'text-red-500'}`}>
                                                {col.value}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                                    <span className="text-[11px] text-gray-500">Min SIP: {fund.min_investment}</span>
                                    <span className="text-[11px] text-green-600 font-medium group-hover:underline flex items-center gap-0.5">View Details <ArrowRight size={10} /></span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="rounded-lg"
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-500 px-3">Page {currentPage} of {totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="rounded-lg"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
