
"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    Sparkles,
    ArrowRight,
    Zap
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/common/SEOHead";
import { apiClient as api } from '@/lib/api-client';
import Link from 'next/link';
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";
import { FilterSidebar, CCFilterState } from '@/components/credit-cards/FilterSidebar';
import { ResponsiveFilterContainer } from '@/components/products/ResponsiveFilterContainer';
import { CreditCardTable } from '@/components/credit-cards/CreditCardTable';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';

import CategoryHero from '@/components/common/CategoryHero';
import ContextualNewsWidget from '@/components/news/ContextualNewsWidget';
import RatesWidget from '@/components/rates/RatesWidget';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import DecisionCTA from '@/components/common/DecisionCTA';

const CreditCardsPage = () => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filter State
    const [filters, setFilters] = useState<CCFilterState>({
        maxFee: 10000,
        minRewardRate: 0,
        networks: [],
        issuers: [],
        features: [],
        spendingCategories: [] // NEW: Spending categories filter
    });
    
    // View Mode State
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    useEffect(() => {
        const loadAssets = async () => {
            try {
                // Fetch generic products with category=credit_card
                const data = await api.entities.CreditCard.list();
                setAssets(data || []);
            } catch (err) {
                console.error("Failed to load cards", err);
            } finally {
                setLoading(false);
            }
        };
        loadAssets();
    }, []);

    // Filter Logic
    const filteredAssets = assets.filter(asset => {
        const name = (asset.name || "").toLowerCase();
        const provider = (asset.provider_name || asset.provider || "").toLowerCase();
        const searchMatch = name.includes(searchTerm.toLowerCase()) || provider.includes(searchTerm.toLowerCase());
        
        // Issuer Filter
        const issuerMatch = filters.issuers.length === 0 || 
            filters.issuers.some(i => provider.includes(i.toLowerCase()));

        // Network Filter
        const featuresStr = JSON.stringify(asset.features || {}).toLowerCase() + (asset.description || "").toLowerCase();
        const networkMatch = filters.networks.length === 0 || 
            filters.networks.some(n => featuresStr.includes(n.toLowerCase()));

        // Features Filter
        const featureMatch = filters.features.length === 0 || 
            filters.features.some(f => featuresStr.includes(f.toLowerCase()));

        // Spending Categories Filter (NEW)
        const spendingMatch = filters.spendingCategories.length === 0 || 
            filters.spendingCategories.some(category => {
                const categoryLower = category.toLowerCase();
                const cardType = (asset.type || asset.metadata?.type || "").toLowerCase();
                const bestFor = (asset.best_for || "").toLowerCase();
                
                // Map spending categories to card types/features
                // Normalize category key (handle camelCase "onlineShopping" -> "onlineshopping")
                const normalizedCategory = categoryLower.replace(/([a-z])([A-Z])/g, '$1$2').toLowerCase();
                
                const categoryMapping: Record<string, string[]> = {
                    "groceries": ["cashback", "shopping", "supermarket", "groceries"],
                    "travel": ["travel", "premium", "air miles", "lounge"],
                    "fuel": ["fuel", "petrol", "gas", "cashback"],
                    "onlineshopping": ["shopping", "cashback", "ecommerce", "online"],
                    "dining": ["dining", "restaurant", "food", "cashback"],
                    "entertainment": ["entertainment", "movie", "cinema", "cashback"]
                };
                
                const searchCategory = normalizedCategory.includes("online") ? "onlineshopping" : normalizedCategory;
                
                const matchingTerms = categoryMapping[searchCategory] || categoryMapping[normalizedCategory] || [categoryLower];
                return matchingTerms.some(term => 
                    featuresStr.includes(term) || 
                    cardType.includes(term) || 
                    bestFor.includes(term) ||
                    name.includes(term)
                );
            });

        return searchMatch && issuerMatch && networkMatch && featureMatch && spendingMatch;
    });

    // Count active filters for mobile badge
    const activeFiltersCount = 
        (filters.issuers.length > 0 ? 1 : 0) + 
        (filters.networks.length > 0 ? 1 : 0) +
        (filters.features.length > 0 ? 1 : 0) +
        (filters.spendingCategories.length > 0 ? 1 : 0); // NEW: Include spending categories

    // Transform generic DB asset to RichProduct
    const richProducts: RichProduct[] = filteredAssets.map(a => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        category: 'credit_card',
        provider_name: a.provider || "Bank",
        image_url: a.image_url,
        description: a.description || "",
        rating: {
           overall: a.rating || 4.5,
           trust_score: a.trust_score || 85,
           breakdown: {}
        },
        bestFor: a.best_for, // Database value
        specs: {
           network: a.metadata?.network || "Visa",
           type: a.metadata?.type || "Credit"
        },
        key_features: a.features 
            ? Object.entries(a.features).map(([k,v]) => ({ label: k, value: String(v) }))
            : [],
        features: a.features || {},
        pros: a.pros || [],
        cons: a.cons || [],
        is_verified: true,
        updated_at: a.updated_at || new Date().toISOString(),
        affiliate_link: a.affiliate_link || a.link,
        official_link: a.official_link
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Best Credit Cards in India (2025) - Compare & Apply Online | InvestingPro"
                description="Compare 100+ top credit cards in India. Get instant approval, check eligibility, and find cards with best rewards, cashback, and travel benefits. Apply now!"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "Best Credit Cards in India",
                    "description": "Compare and apply for the best credit cards in India based on rewards, cashback, and fees.",
                    "url": "https://investingpro.in/credit-cards",
                    "numberOfItems": filteredAssets.length
                }}
            />



            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                 <div className="container mx-auto px-4">
                      <AutoBreadcrumbs />
                      
                      {/* Premium Authoritative Hero */}
                      <CategoryHero
                          title="Compare 1000+ Credit Cards"
                          subtitle="Make Smart Decisions. Apply Instantly."
                          description="Get personalized recommendations based on your spending pattern, lifestyle, and eligibility. Compare cards side-by-side and apply instantly with our affiliate partners."
                          primaryCta={{
                              text: "Find Your Perfect Card",
                              href: "/credit-cards/find-your-card"
                          }}
                          secondaryCta={{
                              text: "Compare All Cards",
                              href: "#compare"
                          }}
                          stats={[
                              { label: "Cards Compared", value: "1000+" },
                              { label: "Instant Apply", value: "Yes" },
                              { label: "Decision Engine", value: "Active" }
                          ]}
                          badge="Helps You Decide • Expert-Reviewed • Instant Apply"
                          variant="primary"
                          className="mb-12"
                      />

                      {/* Search Bar */}
                      <div className="max-w-xl mx-auto mb-12 relative group z-20">
                           <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-stone-400 group-focus-within:text-primary-600 transition-colors" />
                           </div>
                           <Input
                                placeholder="Search cards (e.g. 'HDFC Regalia', 'Travel')..."
                                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary-500 shadow-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                           />
                      </div>
                 </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
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
                            
                            {/* NEW: Contextual Widgets */}
                            <ContextualNewsWidget category="credit_card" title="Card News" />
                            {/* <RatesWidget category="banking" title="Current Rates" /> */} 
                         </div>
                    </ResponsiveFilterContainer>

                    {/* Results Grid */}
                    <div className="flex-1">
                        
                        {/* Status Bar with View Toggle */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Compare Cards <span className="text-slate-400 font-medium text-sm ml-2">({filteredAssets.length} available)</span>
                            </h2>
                            
                            {/* View Toggle */}
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

                        {loading ? (
                             <div className="grid md:grid-cols-2 gap-6 animate-pulse">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]" />
                                ))}
                             </div>
                        ) : filteredAssets.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                <p className="text-slate-500 font-medium">No cards match your specific filters.</p>
                            </div>
                        ) : (
                            <>
                                {viewMode === 'table' ? (
                                    <CreditCardTable cards={filteredAssets} />
                                ) : (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        {richProducts.map((product) => (
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
                </div>
             
            {/* --- DECISION ENGINE CTA SECTION REMOVED --- */}
            </div>

            {/* Compliance Disclaimer */}
            <div className="container mx-auto px-4 pb-8">
                <ComplianceDisclaimer variant="compact" />
            </div>


        </div>
    );
};

export default CreditCardsPage;
