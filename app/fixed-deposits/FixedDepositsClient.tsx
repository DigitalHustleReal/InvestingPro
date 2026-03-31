"use client";

import React, { useState } from 'react';
import { Search, LayoutGrid, List, ArrowRight, ArrowUpDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { apiClient as api } from '@/lib/api-client';
import { useQuery } from "@tanstack/react-query";

export default function FixedDepositsClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'rate' | 'tenure' | 'bank'>('rate');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [visibleCount, setVisibleCount] = useState(6);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const toggleSort = (k: string) => { if (sortBy === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else { setSortBy(k as any); setSortDir('desc'); } };
    const SH = ({ label, k }: { label: string; k: string }) => (<button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 cursor-pointer hover:text-green-700 transition-colors">{label}<ArrowUpDown size={10} className={sortBy === k ? 'text-green-600' : 'text-gray-300'} /></button>);

    const { data: fdRates = [], isLoading } = useQuery({
        queryKey: ['fd-rates'],
        queryFn: async () => {
            try {
                const res = await api.entities.FixedDeposit?.list();
                return Array.isArray(res) ? res : (res as any)?.data || [];
            } catch { return []; }
        },
    });

    const filtered = fdRates.filter((fd: any) => (fd.name || fd.bankName || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const sorted = [...filtered].sort((a: any, b: any) => sortBy === 'rate' ? (b.interestRate || b.rate || 0) - (a.interestRate || a.rate || 0) : 0);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search banks..." className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search fixed deposits" />
                </div>
                <div className="flex items-center gap-2">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} aria-label="Sort FDs" className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer">
                        <option value="rate">Highest Rate</option>
                        <option value="tenure">Tenure</option>
                        <option value="bank">Bank Name</option>
                    </select>
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                        <button onClick={() => setViewMode('table')} aria-pressed={viewMode === 'table'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><List className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><LayoutGrid className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>


            {isLoading ? (
                <div className="py-16 text-center"><div className="inline-flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />Loading rates...</div></div>
            ) : sorted.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-xl border border-gray-200"><p className="text-gray-500">No FDs found.</p></div>
            ) : viewMode === 'table' ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Bank / NBFC" k="bank" /></th>
                            <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Regular Rate" k="rate" /></th>
                            <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Senior Rate</th>
                            <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Tenure" k="tenure" /></th>
                            <th className="text-right px-4 py-3" />
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {sorted.slice(0, visibleCount).map((fd: any) => (
                                <tr key={fd.id || fd.slug} className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-4 py-3"><p className="text-sm font-semibold text-gray-900">{fd.name || fd.bankName}</p><p className="text-[11px] text-gray-500">{fd.type || 'Fixed Deposit'}</p></td>
                                    <td className="px-3 py-3 text-right"><span className="text-sm font-bold text-green-600 tabular-nums">{fd.interestRate || fd.rate || 'N/A'}%</span></td>
                                    <td className="px-3 py-3 text-right"><span className="text-sm font-semibold text-gray-700 tabular-nums">{fd.seniorRate || fd.seniorCitizenRate || '—'}%</span></td>
                                    <td className="px-3 py-3 text-right"><span className="text-sm text-gray-600">{fd.tenure || fd.minTenure || 'N/A'}</span></td>
                                    <td className="px-4 py-3 text-right"><Link href={`/fixed-deposits/${fd.slug || fd.id}`} className="text-xs font-medium text-green-600 hover:text-green-700">Details →</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sorted.slice(0, visibleCount).map((fd: any) => (
                        <Link key={fd.id || fd.slug} href={`/fixed-deposits/${fd.slug || fd.id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{fd.name || fd.bankName}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{fd.type || 'Fixed Deposit'}</p>
                            <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-gray-100 text-center">
                                <div><p className="text-[9px] text-gray-400 uppercase">Regular</p><p className="text-lg font-bold text-green-600 tabular-nums">{fd.interestRate || fd.rate || 'N/A'}%</p></div>
                                <div><p className="text-[9px] text-gray-400 uppercase">Senior</p><p className="text-lg font-bold text-gray-700 tabular-nums">{fd.seniorRate || fd.seniorCitizenRate || '—'}%</p></div>
                                <div><p className="text-[9px] text-gray-400 uppercase">Tenure</p><p className="text-sm font-semibold text-gray-700">{fd.tenure || fd.minTenure || 'N/A'}</p></div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                                <span className="text-[11px] text-gray-500">{fd.taxSaving ? 'Tax saving u/s 80C' : 'Standard FD'}</span>
                                <span className="text-[11px] text-green-600 font-medium flex items-center gap-0.5">Details <ArrowRight size={10} /></span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {sorted.length > visibleCount && (
                <div className="pt-6 text-center">
                    <button onClick={() => setVisibleCount(p => p + 6)} className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors cursor-pointer">
                        Show more
                    </button>
                </div>
            )}
        </div>
    );
}
