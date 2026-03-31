"use client";

import React, { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";
import { LoanFilterSidebar as FilterSidebar, LoanFilterState } from '@/components/loans/FilterSidebar';
import { ResponsiveFilterContainer } from '@/components/products/ResponsiveFilterContainer';

interface LoansClientProps {
    initialLoans: RichProduct[];
}

export default function LoansClient({ initialLoans }: LoansClientProps) {
    const [assets] = useState<RichProduct[]>(initialLoans);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [visibleCount, setVisibleCount] = useState(6);

    const [filters, setFilters] = useState<LoanFilterState>({
        maxRate: 15,
        maxProcessingFee: 2,
        loanTypes: [],
        banks: [],
    });

    const filteredAssets = assets.filter((asset) => {
        const name = (asset.name || "").toLowerCase();
        const provider = (asset.provider_name || "").toLowerCase();
        const searchMatch = name.includes(searchTerm.toLowerCase()) || provider.includes(searchTerm.toLowerCase());
        const bankMatch = filters.banks.length === 0 || filters.banks.some((b) => provider.includes(b.toLowerCase()));
        const type = (asset.specs?.type || '').toLowerCase();
        const typeMatch = filters.loanTypes.length === 0 || filters.loanTypes.some((t) => type.includes(t.toLowerCase()));
        return searchMatch && bankMatch && typeMatch;
    });

    useEffect(() => { setVisibleCount(6); }, [searchTerm, filters]);

    const visibleAssets = filteredAssets.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAssets.length;
    const activeFiltersCount = (filters.loanTypes.length > 0 ? 1 : 0) + (filters.banks.length > 0 ? 1 : 0) + (filters.maxRate < 15 ? 1 : 0);

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <FilterSidebar filters={filters} setFilters={setFilters} />
            </ResponsiveFilterContainer>

            <div className="flex-1 w-full space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search loans..." className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search loans" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><LayoutGrid className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('table')} aria-pressed={viewMode === 'table'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><List className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{visibleAssets.length}</span> of <span className="font-semibold text-gray-900">{filteredAssets.length}</span> loans</p>

                {filteredAssets.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 font-medium">No loans match your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {visibleAssets.map((product) => (
                            <RichProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="pt-6 text-center">
                        <Button onClick={() => setVisibleCount((p) => p + 6)} variant="outline" className="bg-white border-gray-200 hover:border-green-500 rounded-xl min-w-[200px]">
                            Show More ({filteredAssets.length - visibleCount} remaining)
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
