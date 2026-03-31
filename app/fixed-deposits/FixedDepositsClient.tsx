"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { apiClient as api } from '@/lib/api-client';
import { useQuery } from "@tanstack/react-query";

export default function FixedDepositsClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<'rate' | 'tenure' | 'bank'>('rate');

    const { data: fdRates = [], isLoading } = useQuery({
        queryKey: ['fd-rates'],
        queryFn: async () => {
            try {
                const res = await api.entities.FixedDeposit?.list();
                return Array.isArray(res) ? res : (res as any)?.data || [];
            } catch { return []; }
        },
    });

    const filtered = fdRates.filter((fd: any) => {
        const name = (fd.name || fd.bankName || '').toLowerCase();
        return name.includes(searchTerm.toLowerCase());
    });

    const sorted = [...filtered].sort((a: any, b: any) => {
        if (sortBy === 'rate') return (b.interestRate || b.rate || 0) - (a.interestRate || a.rate || 0);
        return 0;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search banks..." className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search fixed deposits" />
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} aria-label="Sort FDs" className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer">
                    <option value="rate">Highest Rate</option>
                    <option value="tenure">Tenure</option>
                    <option value="bank">Bank Name</option>
                </select>
            </div>

            <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{sorted.length}</span> FDs</p>

            {isLoading ? (
                <div className="py-16 text-center"><div className="inline-flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />Loading rates...</div></div>
            ) : sorted.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-xl border border-gray-200"><p className="text-gray-500">No FDs found.</p></div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Bank / NBFC</th>
                            <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Regular Rate</th>
                            <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Senior Rate</th>
                            <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tenure</th>
                            <th className="text-right px-4 py-3" />
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {sorted.map((fd: any) => (
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
            )}
        </div>
    );
}
