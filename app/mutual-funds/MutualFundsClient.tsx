"use client";

import React, { useState, useEffect } from 'react';
import { apiClient as api } from '@/lib/api-client';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, TrendingUp, TrendingDown, LayoutGrid, List, Building2, ArrowRight, ArrowUpDown } from "lucide-react";
import Link from 'next/link';
import { FilterSidebar } from "@/components/mutual-funds/FilterSidebar";
import { ResponsiveFilterContainer } from "@/components/products/ResponsiveFilterContainer";
import { logger } from "@/lib/logger";

type SortKey = 'returns_1y' | 'returns_3y' | 'returns_5y' | 'expense_ratio' | 'rating' | 'name';
type SortDir = 'asc' | 'desc';

export default function MutualFundsClient() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [funds, setFunds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);
    const [sortKey, setSortKey] = useState<SortKey>('returns_3y');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const [filters, setFilters] = useState<any>({
        minReturns: 0, maxExpenseRatio: 2.5, minAum: 0, riskLevels: [], categories: [], amcs: [], rating: 0,
    });
    const activeFiltersCount = (filters.riskLevels.length > 0 ? 1 : 0) + (filters.categories.length > 0 ? 1 : 0) + (filters.amcs.length > 0 ? 1 : 0);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await api.entities.MutualFund.list({ page: 1, limit: 500, sortBy: 'returns_3y:desc', searchTerm: '' });
                const data = response?.data;
                if (Array.isArray(data) && data.length > 0) {
                    setFunds(data.map((p: any) => ({
                        id: p.id || p.slug, name: p.name || "Unknown Fund", category: p.category || 'Equity',
                        aum: p.aum || 'N/A', returns_1y: p.returns1Y ?? 0, returns_3y: p.returns3Y ?? 0, returns_5y: p.returns5Y ?? 0,
                        rating: p.rating ?? 0, risk: p.riskLevel || "Moderate", expense_ratio: p.expenseRatio ?? 0,
                        min_investment: p.minInvestment || "₹500", fund_house: p.providerName || "Unknown",
                    })));
                } else { setFunds([]); }
            } catch (error) { logger.error('[MutualFunds] Error', error as Error); setFunds([]); }
            finally { setLoading(false); }
        })();
    }, []);

    useEffect(() => { setVisibleCount(6); }, [searchTerm, filters, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const filtered = (Array.isArray(funds) ? funds : [])
        .filter((f) => {
            const searchMatch = (f.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (f.fund_house || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRisk = filters.riskLevels.length === 0 || filters.riskLevels.includes(f.risk || "");
            const matchesReturns = (f.returns_3y || 0) >= filters.minReturns;
            const matchesExpense = (f.expense_ratio || 0) <= filters.maxExpenseRatio;
            return searchMatch && matchesRisk && matchesReturns && matchesExpense;
        })
        .sort((a, b) => {
            const mul = sortDir === 'desc' ? -1 : 1;
            if (sortKey === 'name') return mul * (a.name || '').localeCompare(b.name || '');
            return mul * ((a[sortKey] || 0) - (b[sortKey] || 0));
        });

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    function SortHeader({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) {
        const active = sortKey === sortKeyName;
        return (
            <button onClick={() => toggleSort(sortKeyName)} className="inline-flex items-center gap-1 cursor-pointer hover:text-green-700 transition-colors">
                {label}
                <ArrowUpDown size={10} className={active ? 'text-green-600' : 'text-gray-300'} />
            </button>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <FilterSidebar filters={filters} setFilters={setFilters} />
            </ResponsiveFilterContainer>

            <div className="flex-1 w-full space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search funds..." className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search mutual funds" />
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                        <button onClick={() => setViewMode('table')} aria-pressed={viewMode === 'table'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><List className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><LayoutGrid className="w-4 h-4" /></button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-16 text-center"><div className="inline-flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />Loading funds...</div></div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">No funds match your filters.</p>
                        <button className="mt-3 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors cursor-pointer" onClick={() => setFilters({ minReturns: 0, maxExpenseRatio: 2.5, minAum: 0, riskLevels: [], categories: [], amcs: [], rating: 0 })}>Clear Filters</button>
                    </div>
                ) : viewMode === 'table' ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SortHeader label="Fund Name" sortKeyName="name" /></th>
                                <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SortHeader label="Rating" sortKeyName="rating" /></th>
                                <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SortHeader label="1Y" sortKeyName="returns_1y" /></th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SortHeader label="3Y" sortKeyName="returns_3y" /></th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SortHeader label="5Y" sortKeyName="returns_5y" /></th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SortHeader label="Exp." sortKeyName="expense_ratio" /></th>
                                <th className="text-right px-4 py-3" />
                            </tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {visible.map((fund) => (
                                    <tr key={fund.id} className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <Link href={`/mutual-funds/${fund.id}`} className="group">
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">{fund.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{fund.category}</span>
                                                    <span className="text-[10px] text-gray-400">{fund.fund_house}</span>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-3 py-3 text-center"><div className="flex gap-0.5 justify-center">{[...Array(5)].map((_, i) => <Star key={i} size={11} className={i < (fund.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}</div></td>
                                        <td className="px-3 py-3 text-center"><span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${fund.risk === 'Low' || fund.risk === 'Low to Moderate' ? 'bg-green-50 text-green-700' : fund.risk === 'High' || fund.risk === 'Very High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>{fund.risk}</span></td>
                                        <td className="px-3 py-3 text-right"><span className={`text-sm font-semibold tabular-nums ${fund.returns_1y >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fund.returns_1y}%</span></td>
                                        <td className="px-3 py-3 text-right"><span className={`text-sm font-bold tabular-nums ${fund.returns_3y >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fund.returns_3y}%</span></td>
                                        <td className="px-3 py-3 text-right"><span className={`text-sm font-semibold tabular-nums ${fund.returns_5y >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fund.returns_5y}%</span></td>
                                        <td className="px-3 py-3 text-right"><span className="text-sm text-gray-700 tabular-nums">{fund.expense_ratio}%</span></td>
                                        <td className="px-4 py-3 text-right"><Link href={`/mutual-funds/${fund.id}`} className="text-xs font-medium text-green-600 hover:text-green-700">Details →</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {visible.map((fund) => (
                            <Link key={fund.id} href={`/mutual-funds/${fund.id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-semibold text-gray-500 uppercase">{fund.category}</span>
                                            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < (fund.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}</div>
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">{fund.name}</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1"><Building2 size={10} />{fund.fund_house}</p>
                                    </div>
                                    <Badge className={`text-[9px] font-bold px-2 py-0.5 flex-shrink-0 ${fund.risk === 'Low' ? 'bg-green-50 text-green-700' : fund.risk === 'High' || fund.risk === 'Very High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{fund.risk}</Badge>
                                </div>
                                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                                    {[{ l: '1Y', v: fund.returns_1y }, { l: '3Y', v: fund.returns_3y }, { l: '5Y', v: fund.returns_5y }, { l: 'Exp', v: fund.expense_ratio, isExp: true }].map((c) => (
                                        <div key={c.l} className="text-center"><p className="text-[9px] text-gray-400 uppercase font-medium">{c.l}</p><p className={`text-sm font-bold tabular-nums ${c.isExp ? 'text-gray-700' : c.v >= 0 ? 'text-green-600' : 'text-red-500'}`}>{c.v}%</p></div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                                    <span className="text-[11px] text-gray-500">Min SIP: {fund.min_investment}</span>
                                    <span className="text-[11px] text-green-600 font-medium group-hover:underline flex items-center gap-0.5">Details <ArrowRight size={10} /></span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="pt-6 text-center">
                        <button onClick={() => setVisibleCount(p => p + 6)} className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors cursor-pointer">
                            Show more
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
