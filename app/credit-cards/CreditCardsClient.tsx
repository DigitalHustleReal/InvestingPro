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
import EligibilityPreChecker from '@/components/common/EligibilityPreChecker';
import ScorePreferenceToggle from '@/components/products/ScorePreferenceToggle';
import FilterPresets from '@/components/filters/FilterPresets';
import { ScoringWeights, scoreCreditCard } from '@/lib/products/scoring-rules';

interface CreditCardsClientProps {
    initialAssets: RichProduct[];
}

export default function CreditCardsClient({ initialAssets }: CreditCardsClientProps) {
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
    
    // Sort State - NEW
    const [sortBy, setSortBy] = useState<'match' | 'popularity' | 'trending' | 'rating'>('match');

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
                const term = category.toLowerCase().replace(/([a-z])([A-Z])/g, '$1 $2');
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

        // NEW: Credit Score Filter
        const scoreMatch = filters.creditScore.length === 0 || true; // Placeholder

        // Fee logic
        const annualFeeStr = asset.specs?.annualFee || "0";
        const annualFee = parseInt(annualFeeStr.replace(/[^0-9]/g, "")) || 0;
        const feeMatch = annualFee <= filters.maxFee;
        
        return searchMatch && issuerMatch && networkMatch && featureMatch && spendingMatch && cardTypeMatch && feeMatch && rewardsTypeMatch;
    });

    // ---------------------------------------------------------
    // DYNAMIC SCORING LOGIC (Tier 3)
    // ---------------------------------------------------------
    const [weights, setWeights] = useState<ScoringWeights>({ rewards: 0.35, fees: 0.30, travel: 0.35 });
    
    const scoredAssets = React.useMemo(() => {
        return filteredAssets.map(asset => {
            const rawFee = asset.features?.['annual_fee'] || asset.specs?.annualFee || "500";
            const feeVal = typeof rawFee === 'number' ? rawFee : parseInt(String(rawFee).replace(/[^0-9]/g, '')) || 0;
            const rawRate = asset.features?.['reward_rate'] || asset.specs?.rewardRate || "1%";
            
            const type = (asset.category === 'credit_card' ? (asset.bestFor || 'standard') : 'standard').toLowerCase();
            const normalizedType = type.includes('travel') ? 'travel' : 
                                   type.includes('shop') ? 'shopping' : 
                                   type.includes('free') ? 'lifetime_free' : 'standard';

            const dummyCard: any = {
                rewardRate: String(rawRate),
                loungeAccess: asset.features?.['lounge_access'] || "Nil",
                type: normalizedType,
                annualFee: feeVal
            };

            const scoreResult = scoreCreditCard(dummyCard, weights);
            const matchScore = Math.round(scoreResult.overall * 10); 
            const popularity = Math.floor(Math.random() * 10000) + 1000; 
            const trending = Math.random() > 0.7; 
            
            return { 
                ...asset, 
                matchScore, 
                scoreBreakdown: scoreResult.breakdown,
                rawScore: scoreResult.overall,
                popularity,
                trending
            };
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'popularity':
                    return (b.popularity || 0) - (a.popularity || 0);
                case 'trending':
                    return (b.trending ? 1000 : 0) - (a.trending ? 1000 : 0) + ((b.popularity || 0) - (a.popularity || 0));
                case 'rating':
                    return (b.rating?.overall || 0) - (a.rating?.overall || 0);
                case 'match':
                default:
                    return b.matchScore - a.matchScore;
            }
        });
    }, [filteredAssets, weights, sortBy]);

    // ---------------------------------------------------------

    const activeFiltersCount = 
        (filters.issuers.length > 0 ? 1 : 0) + 
        (filters.networks.length > 0 ? 1 : 0) +
        (filters.features.length > 0 ? 1 : 0) +
        (filters.spendingCategories.length > 0 ? 1 : 0) +
        (filters.cardType.length > 0 ? 1 : 0) + 
        (filters.rewardsType.length > 0 ? 1 : 0);

    const [visibleCount, setVisibleCount] = useState(12);
    const displayedAssets = scoredAssets.slice(0, visibleCount);
    const hasMore = visibleCount < scoredAssets.length;
    
    React.useEffect(() => {
        setVisibleCount(12);
    }, [filters, searchTerm, weights]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filter Sidebar */}
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <FilterSidebar filters={filters} setFilters={setFilters} />
                    <div className="mt-8 space-y-6">
                        <EligibilityPreChecker />
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
                        <UniversalSidebar category="credit_card" />
                    </div>
            </ResponsiveFilterContainer>

            {/* Results Grid */}
            <div className="flex-1 w-full">
                <div className="mb-6 lg:hidden">
                       <Input
                            placeholder="Search cards..."
                            className="w-full h-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                       />
                </div>

                <ScorePreferenceToggle 
                    currentWeights={weights} 
                    onWeightChange={setWeights} 
                />

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

                <FilterPresets 
                    onPresetClick={(presetFilters) => {
                        setFilters(prev => ({
                            ...prev,
                            ...presetFilters
                        }));
                    }}
                    className="mb-6"
                />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Compare Cards <span className="text-slate-600 font-medium text-sm ml-2">({filteredAssets.length} found)</span>
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="match">Best Match</option>
                            <option value="popularity">Most Applied</option>
                            <option value="trending">Trending</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-600 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white'
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
                                        : 'text-slate-600 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Cards</span>
                            </button>
                        </div>
                    </div>
                </div>

                {filteredAssets.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 font-medium">No cards match your specific filters.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'table' ? (
                            <CreditCardTable cards={displayedAssets} />
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {displayedAssets.map((product) => (
                                    <RichProductCard 
                                        key={product.id} 
                                        product={product} 
                                        matchScore={product.matchScore}
                                        scoreBreakdown={product.scoreBreakdown}
                                        rawScore={product.rawScore}
                                        isScored={true}
                                    />
                                ))}
                            </div>
                        )}

                        {hasMore && (
                            <div className="mt-12 text-center">
                                <Button 
                                    onClick={() => setVisibleCount(prev => prev + 12)}
                                    size="lg"
                                    variant="outline"
                                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 min-w-[200px]"
                                >
                                    Load More Cards (+{filteredAssets.length - visibleCount})
                                </Button>
                                <p className="text-xs text-slate-600 mt-3">
                                    Showing {visibleCount} of {filteredAssets.length} cards
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <CompareTray />
        </div>
    );
}
