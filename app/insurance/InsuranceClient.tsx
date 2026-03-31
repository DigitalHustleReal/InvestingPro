"use client";

import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, Shield, Heart, FileText, Car, Plane } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { apiClient as api } from '@/lib/api-client';
import { InsuranceFilterSidebar, InsuranceFilterState } from "@/components/insurance/FilterSidebar";
import { ResponsiveFilterContainer } from '@/components/products/ResponsiveFilterContainer';

export default function InsuranceClient() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [filters, setFilters] = useState<InsuranceFilterState>({
        maxPremium: 50000,
        minCover: 5000000,
        insurers: [],
        policyTypes: [],
    });

    useEffect(() => {
        (async () => {
            try {
                const data = await api.entities.Insurance?.list() || [];
                setAssets(Array.isArray(data) ? data : (data as any)?.data || []);
            } catch { setAssets([]); }
            finally { setLoading(false); }
        })();
    }, []);

    const filteredAssets = assets.filter((a) => {
        const name = (a.name || '').toLowerCase();
        const provider = (a.provider_name || a.providerName || '').toLowerCase();
        const searchMatch = name.includes(searchTerm.toLowerCase()) || provider.includes(searchTerm.toLowerCase());
        const insurerMatch = filters.insurers.length === 0 || filters.insurers.some((i: string) => provider.includes(i.toLowerCase()));
        const typeMatch = filters.policyTypes.length === 0 || filters.policyTypes.some((t: string) => (a.category || a.type || '').toLowerCase().includes(t.toLowerCase()));
        return searchMatch && insurerMatch && typeMatch;
    });

    const activeFiltersCount = (filters.insurers.length > 0 ? 1 : 0) + (filters.policyTypes.length > 0 ? 1 : 0);

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <InsuranceFilterSidebar filters={filters} setFilters={setFilters} />
            </ResponsiveFilterContainer>

            <div className="flex-1 w-full space-y-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Search insurance plans..." className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search insurance" />
                </div>

                <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{filteredAssets.length}</span> plans</p>

                {loading ? (
                    <div className="py-16 text-center"><div className="inline-flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />Loading plans...</div></div>
                ) : filteredAssets.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-xl border border-gray-200"><p className="text-gray-500">No plans match your filters.</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredAssets.map((plan: any) => (
                            <Link key={plan.id || plan.slug} href={`/insurance/${plan.slug || plan.id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{plan.name}</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">{plan.provider_name || plan.providerName}</p>
                                    </div>
                                    <Badge className="text-[9px] bg-green-50 text-green-700 border-green-200">{plan.category || plan.type || 'Insurance'}</Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                                    <div><p className="text-[9px] text-gray-400 uppercase">Cover</p><p className="text-sm font-semibold text-gray-900">{plan.specs?.coverAmount || plan.coverAmount || 'N/A'}</p></div>
                                    <div><p className="text-[9px] text-gray-400 uppercase">Premium</p><p className="text-sm font-semibold text-gray-900">{plan.specs?.premium || plan.premium || 'N/A'}</p></div>
                                    <div><p className="text-[9px] text-gray-400 uppercase">CSR</p><p className="text-sm font-semibold text-green-600">{plan.specs?.claimRatio || plan.claimSettlementRatio || 'N/A'}</p></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
