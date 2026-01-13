
"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    CreditCard as CardIcon,
    Zap,
    Sparkles,
    Plane,
    ShoppingBag,
    ArrowRight,
    BookOpen
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
import { ResponsiveFilterContainer } from '@/components/products/ResponsiveFilterContainer';
import { CreditCardTable } from '@/components/credit-cards/CreditCardTable';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import CreditCardRewardsCalculator from '@/components/calculators/CreditCardRewardsCalculator';

import CategoryHeroCarousel from '@/components/common/CategoryHeroCarousel';
import ContextualNewsWidget from '@/components/news/ContextualNewsWidget';
import RatesWidget from '@/components/rates/RatesWidget';

const HERO_SLIDES = [
    {
        id: '1',
        title: "Best Credit Cards for 2026",
        subtitle: "Editor's Choice",
        description: "Maximize your rewards with our top-rated picks for travel, shopping, and cashback. Verified by experts.",
        ctaText: "Compare Best Cards",
        ctaLink: "#compare",
        color: "from-slate-900 to-slate-800"
    },
    {
        id: '2',
        title: "Lifetime Free Cards",
        subtitle: "Zero Fees",
        description: "Enjoy premium benefits without paying a single rupee in annual fees. Perfect for first-time users.",
        ctaText: "View Free Cards",
        ctaLink: "?type=lifetime_free",
        color: "from-emerald-900 to-slate-900"
    },
    {
        id: '3',
        title: "Travel in Style",
        subtitle: "Luxury Perks",
        description: "Free airport lounge access, air miles, and travel insurance with India's best travel credit cards.",
        ctaText: "Explore Travel Cards",
        ctaLink: "?type=travel",
        color: "from-blue-900 to-slate-900"
    }
];

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

        return searchMatch && issuerMatch && networkMatch && featureMatch;
    });

    // Count active filters for mobile badge
    const activeFiltersCount = 
        (filters.issuers.length > 0 ? 1 : 0) + 
        (filters.networks.length > 0 ? 1 : 0) +
        (filters.features.length > 0 ? 1 : 0);

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
                title="Best Credit Cards in India 2026 | InvestingPro"
                description="Compare premium credit cards, discover hidden rewards, and find the lowest interest rates. Expert analysis of cards from HDFC, SBI, Axis, and more."
            />



            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                 <div className="container mx-auto px-4">
                      {/* New Dynamic Carousel Hero */}
                      <CategoryHeroCarousel slides={HERO_SLIDES} className="mb-12 shadow-2xl" />
                      
                      {/* Search Bar (Moved out of Hero) */}
                      <div className="max-w-xl mx-auto mb-12 relative group z-20 -mt-20">
                           <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-stone-400 group-focus-within:text-primary-600 transition-colors" />
                           </div>
                           <Input
                                placeholder="Find your perfect card (e.g. 'HDFC Regalia', 'Travel')..."
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
                                        <Zap className="w-6 h-6 text-yellow-300" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Not sure which card?</h3>
                                    <p className="text-primary-100 text-sm mb-4">Take our 30-second quiz to find your perfect financial match.</p>
                                    <Button size="sm" className="w-full bg-white text-primary-700 font-bold hover:bg-primary-50">
                                        Start Quiz
                                    </Button>
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
                                Recommended Cards <span className="text-slate-400 font-medium text-sm ml-2">({filteredAssets.length})</span>
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
             
            {/* --- REWARDS CALCULATOR SECTION --- */}
            <div className="container mx-auto px-4 pb-16">
                <div className="text-center mb-8">
                    <Badge className="mb-4 bg-primary-50 text-primary-700 border-primary-200">Smart Recommendations</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Which Card Earns You the Most?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Answer a few questions about your spending habits to get personalized card recommendations
                    </p>
                </div>
                <CreditCardRewardsCalculator />
            </div>

            {/* --- EDUCATIONAL CONTENT HUB --- */}
            <div className="container mx-auto px-4 pb-24">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-primary- dark:bg-primary-/30 text-primary- dark:text-primary-">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Credit Card Knowledge Hub</h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Maximize rewards and build credit history.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Visual Guide Placeholder */}
                    <div className="lg:col-span-1">
                         <div className="sticky top-24 bg-slate-900 text-white p-8 rounded-[2rem] overflow-hidden relative min-h-[400px] flex flex-col justify-center items-center text-center">
                            {/* Placeholder Content */}
                            <div className="z-10 relative">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                    <Sparkles className="w-10 h-10 text-primary-" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Rewards Matrix</h3>
                                <p className="text-slate-300 mb-8 max-w-[200px] mx-auto">Visual guide to choosing the right card based on your spending.</p>
                                <div className="border border-dashed border-slate-600 rounded-xl p-4 bg-slate-800/50">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Image Placeholder</p>
                                </div>
                            </div>
                            
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Types of Cards */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                            <CardContent className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <CardIcon className="w-5 h-5 text-primary-" />
                                    Types of Credit Cards
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            title: "Travel Cards",
                                            desc: "Earn miles/points on booking flights & hotels. Comes with lounge access.",
                                            icon: Plane
                                        },
                                        {
                                            title: "Shopping Cards",
                                            desc: "Cashback or reward points on online/offline shopping (Amazon/Flipkart).",
                                            icon: ShoppingBag
                                        },
                                        {
                                            title: "Fuel Cards",
                                            desc: "Surcharge waiver and extra points on fuel spends at specific petrol pumps.",
                                            icon: Zap
                                        },
                                        {
                                            title: "Lifetime Free",
                                            desc: "No joining or annual fee. Best for beginners or low spenders.",
                                            icon: ShieldCheck
                                        }
                                    ].map((type, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary- dark:bg-primary-/20 flex items-center justify-center text-primary- dark:text-primary- mt-1">
                                                <type.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{type.title}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{type.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ Accordion */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white px-2">Frequently Asked Questions</h3>
                            {[
                                {
                                    q: "What is CIBIL Score required?",
                                    a: "Most premium cards require 750+. However, entry-level cards are available for 700+ or against Fixed Deposit (Secured Cards)."
                                },
                                {
                                    q: "How to avoid Paying Interest?",
                                    a: "Always pay the 'Total Amount Due' before the due date. Paying only 'Minimum Due' attracts heavy interest (36-42% p.a.)."
                                },
                                {
                                    q: "What is 'No Cost EMI'?",
                                    a: "It means the interest amount is given as a discount, so you pay only the product price in installments. Careful of processing fees."
                                },
                                {
                                    q: "Annual Fee Waiver?",
                                    a: "Most cards waive the annual fee if you cross a spending milestone (e.g., Spend ₹1 Lakh in a year) to reverse the fee."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex justify-between items-center group cursor-pointer">
                                        {faq.q}
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary- transition-colors" />
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
                </div>
            </div>


        </div>
    );
};

export default CreditCardsPage;
