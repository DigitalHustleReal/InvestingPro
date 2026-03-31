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
import { CompareTray } from "@/components/compare/CompareTray";
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
            // Derive popularity from match score + index position (deterministic, no Math.random)
            const popularity = matchScore * 100 + (asset.rating?.overall || 4) * 500;
            const trending = matchScore >= 8 && feeVal <= 1000; 
            
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

    const [visibleCount, setVisibleCount] = useState(6);
    const displayedAssets = scoredAssets.slice(0, visibleCount);
    const hasMore = visibleCount < scoredAssets.length;

    React.useEffect(() => {
        setVisibleCount(6);
    }, [filters, searchTerm, weights]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Filter Sidebar */}
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <FilterSidebar filters={filters} setFilters={setFilters} />
                    <div className="mt-4 p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2.5">
                            <Zap className="w-4 h-4 text-green-200" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">Find Your Perfect Card</h3>
                        <p className="text-green-200 text-[11px] mb-3 leading-relaxed">Answer 3 questions, get a personalized recommendation.</p>
                        <Link href="/credit-cards/find-your-card">
                            <Button size="sm" className="w-full bg-white text-green-700 font-semibold hover:bg-green-50 rounded-lg text-xs">
                                Find My Card →
                            </Button>
                        </Link>
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
                            aria-label="Search credit cards"
                       />
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
                    <h2 className="text-lg font-bold text-[--v2-ink]">
                        Compare Cards <span className="text-gray-500 font-medium text-sm ml-2">({filteredAssets.length} found)</span>
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            aria-label="Sort cards by"
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 cursor-pointer"
                        >
                            <option value="match">Best Match</option>
                            <option value="popularity">Most Applied</option>
                            <option value="trending">Trending</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                aria-pressed={viewMode === 'table'}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                                    viewMode === 'table'
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <TableIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Table</span>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                aria-pressed={viewMode === 'grid'}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                                    viewMode === 'grid'
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Cards</span>
                            </button>
                        </div>
                    </div>
                </div>

                {filteredAssets.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 font-medium">No cards match your filters. Try broadening your criteria.</p>
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
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                    size="lg"
                                    variant="outline"
                                    className="bg-white border-gray-200 hover:bg-gray-50 hover:border-green-500 min-w-[240px] rounded-xl"
                                >
                                    Show More Cards ({filteredAssets.length - visibleCount} remaining)
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">
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
