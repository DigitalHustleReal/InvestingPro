
"use client";

import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    TrendingUp,
    Search,
    CreditCard as CardIcon,
    Zap,
    Clock,
    Sparkles,
    Plane,
    ShoppingBag,
    ArrowRight,
    Gem,
    CheckCircle2,
    BarChart3
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/common/SEOHead";
import { api } from '@/lib/api';
import Link from 'next/link';
import { RichProductCard } from "@/components/products/RichProductCard";
import { RichProduct } from "@/types/rich-product";
import { FilterSidebar, CCFilterState } from '@/components/credit-cards/FilterSidebar';

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
        features: []
    });

    const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

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

    const handleCompareToggle = (id: string) => {
        setSelectedForCompare(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

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

        return searchMatch && issuerMatch && networkMatch && featureMatch;
    });

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
                title="Best Credit Cards in India 2026 | InvestingPro"
                description="Compare premium credit cards, discover hidden rewards, and find the lowest interest rates. Expert analysis of cards from HDFC, SBI, Axis, and more."
            />

            {/* Premium Dark Hero */}
            <div className="bg-slate-900 border-b border-white/5 pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                     <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[140px] -translate-y-1/2" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-indigo-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-400 font-semibold text-xs uppercase tracking-widest">Premium Rewards Collection</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                        Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Elite Privileges</span>
                    </h1>
                     <div className="relative group max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <Input
                            placeholder="Find your perfect card (e.g. 'HDFC Regalia', 'Travel')..."
                            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder:text-slate-400 focus:border-indigo-500/50 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Filter Sidebar */}
                    <div className="w-full lg:w-[300px] shrink-0">
                         <FilterSidebar filters={filters} setFilters={setFilters} />
                         
                         {/* Marketing Widgets in Sidebar */}
                         <div className="mt-8 space-y-6">
                            {/* Card Matcher Teaser */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
                                <div className="relative z-10">
                                    <div className="h-10 w-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
                                        <Zap className="w-6 h-6 text-yellow-300" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Not sure which card?</h3>
                                    <p className="text-indigo-100 text-sm mb-4">Take our 30-second quiz to find your perfect financial match.</p>
                                    <Button size="sm" className="w-full bg-white text-indigo-600 font-bold hover:bg-indigo-50">
                                        Start Quiz
                                    </Button>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        
                        {/* Status Bar */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Recommended Cards <span className="text-slate-400 font-medium text-sm ml-2">({filteredAssets.length})</span>
                            </h2>
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
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {richProducts.map((product) => (
                                    <RichProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onCompare={handleCompareToggle}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Compare Bar */}
            {selectedForCompare.length > 0 && (
                <div className="fixed bottom-8 inset-x-0 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-5">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-6 min-w-[320px] max-w-2xl">
                        <div className="flex -space-x-3 overflow-hidden">
                            {selectedForCompare.slice(0, 3).map((id) => {
                                const card = assets.find(a => a.id === id);
                                return (
                                    <div key={id} className="w-10 h-10 rounded-lg border-2 border-slate-900 bg-white flex items-center justify-center p-1 shadow-md">
                                        <img src={card?.image_url} alt="" className="w-full h-full object-contain" />
                                    </div>
                                );
                            })}
                            {selectedForCompare.length > 3 && (
                                <div className="w-10 h-10 rounded-lg border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                                    +{selectedForCompare.length - 3}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">{selectedForCompare.length} Cards Selected</p>
                            <p className="text-slate-400 text-[10px]">Add up to 4 cards to compare</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setSelectedForCompare([])}>
                                Clear
                            </Button>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 shadow-lg shadow-indigo-600/20" disabled={selectedForCompare.length < 2}>
                                Compare Now
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditCardsPage;
