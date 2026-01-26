"use client";

import React, { useState } from 'react';
import { Search, Zap, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";
import { FilterSidebar, CCFilterState } from '@/components/credit-cards/FilterSidebar';
import { ResponsiveFilterContainer } from '@/components/products/ResponsiveFilterContainer';
import { CreditCardTable } from '@/components/credit-cards/CreditCardTable';
import UniversalSidebar from '@/components/common/UniversalSidebar';
import { CompareTray } from "@/components/compare/CompareTray";

interface CreditCardsClientProps {
    initialAssets: RichProduct[];
}

export default function CreditCardsClient({ initialAssets }: CreditCardsClientProps) {
    // We initialise state with the Server Data
    // Note: In the original logic, 'assets' filters used raw DB shape, but here we passed RichProduct.
    // We will adapt the filter logic to simple RichProduct if needed, or re-map.
    // The previous 'assets' were raw from 'api.entities.CreditCard.list()' which mapped to 'generic asset-ish'.
    // Here initialAssets is ALREADY mapped to RichProduct.
    // So we just need to make sure filter logic works on RichProduct fields.
    
    // For simplicity, let's treat initialAssets as the source of truth
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filter State
    const [filters, setFilters] = useState<CCFilterState>({
        maxFee: 50000,
        minRewardRate: 0,
        networks: [],
        issuers: [],
        features: [],
        spendingCategories: [],
        creditScore: [],
        rewardsType: [],
        cardType: []
    });
    
    // View Mode State
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    // Filter Logic
    const filteredAssets = initialAssets.filter(asset => {
        const name = (asset.name || "").toLowerCase();
        const provider = (asset.provider_name || "").toLowerCase();
        const searchMatch = name.includes(searchTerm.toLowerCase()) || provider.includes(searchTerm.toLowerCase());
        
        // Issuer Filter
        const issuerMatch = filters.issuers.length === 0 || 
            filters.issuers.some(i => provider.includes(i.toLowerCase()));

        // Network Filter - look in specs or description
        const featuresStr = JSON.stringify(asset.features || {}).toLowerCase() + (asset.description || "").toLowerCase();
        const networkMatch = filters.networks.length === 0 || 
            filters.networks.some(n => featuresStr.includes(n.toLowerCase()));

        // Features Filter
        const featureMatch = filters.features.length === 0 || 
            filters.features.some(f => featuresStr.includes(f.toLowerCase()));

        // Spending Categories
        const spendingMatch = filters.spendingCategories.length === 0 || 
            filters.spendingCategories.some(category => {
                const term = category.toLowerCase().replace(/([a-z])([A-Z])/g, '$1$2');
                return featuresStr.includes(term) || name.includes(term) || (asset.bestFor?.toLowerCase() || "").includes(term);
            });
            
        // NEW: Card Type Filter (Rewards, Travel, etc.)
        const cardTypeMatch = filters.cardType.length === 0 ||
            filters.cardType.some(type => {
                const t = type.toLowerCase();
                 return featuresStr.includes(t) || name.includes(t) || (asset.category || "").toLowerCase().includes(t);
            });

        // NEW: Rewards Type Filter (Cashback, Miles, etc.)
        const rewardsTypeMatch = filters.rewardsType.length === 0 ||
            filters.rewardsType.some(type => {
                const t = type.toLowerCase();
                 return featuresStr.includes(t) || (asset.specs?.rewardsType || "").toLowerCase().includes(t);
            });

        // NEW: Credit Score Filter (Mocked Logic - assuming all are 'good' if not specified)
        // In real app, we check asset.creditScoreRequirement
        const scoreMatch = filters.creditScore.length === 0 || true; // Placeholder for now until data has scores

        // Fee logic
        // We need to parse specs.annualFee which might be "₹500" or "Free"
        // For now, simple check if we can parse it
        const annualFeeStr = asset.specs?.annualFee || "0";
        const annualFee = parseInt(annualFeeStr.replace(/[^0-9]/g, "")) || 0;
        const feeMatch = annualFee <= filters.maxFee;
        
        return searchMatch && issuerMatch && networkMatch && featureMatch && spendingMatch && cardTypeMatch && feeMatch && rewardsTypeMatch;
    });

    const activeFiltersCount = 
        (filters.issuers.length > 0 ? 1 : 0) + 
        (filters.networks.length > 0 ? 1 : 0) +
        (filters.features.length > 0 ? 1 : 0) +
        (filters.spendingCategories.length > 0 ? 1 : 0) +
        (filters.cardType.length > 0 ? 1 : 0) + 
        (filters.rewardsType.length > 0 ? 1 : 0);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
            {/* Filter Sidebar */}
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <FilterSidebar filters={filters} setFilters={setFilters} />
                    
                    {/* Marketing Widgets in Sidebar */}
                    <div className="mt-8 space-y-6">
                    {/* Card Matcher Teaser */}
                    <div className="bg-gradient-to-br from-primary-600 to-success-700 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-primary-500/20">
                        <div className="relative z-10">
                            <div className="h-10 w-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-accent-300" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Find Your Perfect Card</h3>
                            <p className="text-primary-100 text-sm mb-4">Get personalized recommendations based on your spending, lifestyle, and eligibility.</p>
                            <Link href="/credit-cards/find-your-card">
                                <Button size="sm" className="w-full bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/30">
                                    Find My Card
                                </Button>
                            </Link>
                        </div>
                    </div>
                    
                    
                    {/* NEW: Contextual Widgets (Universal Sidebar) */}
                    <UniversalSidebar category="credit_card" />
                    </div>
            </ResponsiveFilterContainer>

            {/* Results Grid */}
            <div className="flex-1">
                
                {/* Search Bar (Mobile only here, desktop is in Hero usually, but let's keep it here for functional parity) */}
                <div className="mb-6 lg:hidden">
                       <Input
                            placeholder="Search cards..."
                            className="w-full h-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                       />
                </div>

                {/* NEW: Trending Social Proof Section */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { label: "Trending This Week", value: "HDFC Regalia Gold", sub: "5.2k Views", icon: "🔥", color: "bg-orange-50 text-orange-600 dashed border-orange-200" },
                        { label: "Top Rated", value: "SBI Cashback", sub: "4.9/5 Rating", icon: "⭐", color: "bg-yellow-50 text-yellow-600 dashed border-yellow-200" },
                        { label: "Most Applied", value: "Axis Ace", sub: "1.2k Applications", icon: "🚀", color: "bg-blue-50 text-blue-600 dashed border-blue-200" }
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-2xl p-4 border ${stat.color} flex items-center gap-4`}>
                            <div className="text-2xl">{stat.icon}</div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider opacity-70">{stat.label}</div>
                                <div className="font-bold text-slate-900 leading-tight">{stat.value}</div>
                                <div className="text-xs opacity-80">{stat.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Bar with View Toggle */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Compare Cards <span className="text-slate-400 font-medium text-sm ml-2">({filteredAssets.length} found)</span>
                    </h2>
                    
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                viewMode === 'table'
                                    ? 'bg-primary-600 text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <TableIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Table</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-primary-600 text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden sm:inline">Cards</span>
                        </button>
                    </div>
                </div>

                {filteredAssets.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 font-medium">No cards match your specific filters.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'table' ? (
                            <CreditCardTable cards={filteredAssets} />
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {filteredAssets.map((product) => (
                                    <RichProductCard 
                                        key={product.id} 
                                        product={product} 
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <CompareTray />
        </div>
    );
}
