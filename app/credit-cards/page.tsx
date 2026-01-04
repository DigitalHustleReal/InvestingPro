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

const CreditCardsPage = () => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

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

    const categories = [
        { id: 'all', label: 'All Cards', icon: Sparkles },
        { id: 'travel', label: 'Travel & Lounge', icon: Plane },
        { id: 'cashback', label: 'Shopping & Cashback', icon: ShoppingBag },
        { id: 'premium', label: 'Premium & Metal', icon: Gem },
    ];

    const filteredAssets = activeCategory === 'all'
        ? assets
        : assets.filter(asset => {
            const type = asset.metadata?.type || asset.type || '';
            return type.toLowerCase().includes(activeCategory);
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
           network: a.metadata?.network,
           type: a.metadata?.type
        },
        // Transform JSON features key-value to array
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

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
                 <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-indigo-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-teal-500/20" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 text-center lg:text-left">
                            <Badge className="mb-6 px-4 py-1.5 bg-indigo-50 rounded-full text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 font-semibold tracking-wide uppercase text-[11px] inline-flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5" fill="currentColor" />
                                India's #1 Card Comparison Engine
                            </Badge>
                            
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]">
                                Find Your Perfect <br className="hidden lg:block" />
                                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">Credit Match</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Compare 50+ premium cards across Reward Rates, Lounge Access, and Annual Fees. 
                                Unbiased analysis for the smart Indian investor.
                            </p>

                             <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 w-full sm:w-auto transition-all hover:scale-105">
                                    Compare Now
                                </Button>
                                <Button variant="outline" className="h-14 px-8 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-semibold text-lg w-full sm:w-auto">
                                    Check Eligibility
                                </Button>
                            </div>
                        </div>

                        {/* Visual Helper */}
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-none perspective-1000 hidden md:block">
                             <div className="relative w-full aspect-[1.586/1] rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl shadow-indigo-500/30 flex flex-col justify-between p-8 md:p-10 text-white transform rotate-y-[-12deg] rotate-x-[10deg] transition-all duration-700 hover:rotate-0 hover:scale-105 z-10 backdrop-blur-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] pointer-events-none" />
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-12 bg-amber-400 rounded-lg shadow-inner opacity-80" />
                                    <Zap className="w-10 h-10 text-white/80" />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-mono tracking-widest text-white/90">•••• •••• •••• 8842</div>
                                    <div className="flex justify-between items-end pt-4">
                                        <div className="text-lg font-medium tracking-wide">SHIV PRATAP</div>
                                        <div className="text-lg font-medium tracking-wide">12/29</div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="sticky top-[72px] z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-y border-slate-200 dark:border-slate-800 py-4 transition-colors duration-300">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto gap-2 no-scrollbar">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? "default" : "ghost"}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rounded-full px-6 h-10 text-sm font-medium transition-all whitespace-nowrap
                                    ${activeCategory === cat.id
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <cat.icon size={16} className="mr-2" />
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <main className="container mx-auto px-4 py-16">
                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT COLUMN: CARDS LIST */}
                    <div className="lg:col-span-3 space-y-6">
                         <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Recommendations</h2>
                            <span className="text-sm text-slate-500">{filteredAssets.length} cards found</span>
                        </div>

                        {loading ? (
                             <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-64 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl" />
                                ))}
                             </div>
                        ) : richProducts.length > 0 ? (
                            richProducts.map((product) => (
                                <RichProductCard 
                                    key={product.id} 
                                    product={product} 
                                    layout="list"
                                />
                            ))
                        ) : (
                            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No cards available yet</h3>
                                <p className="text-slate-500">The editorial team is curating the best picks.</p>
                                <Button className="mt-4" variant="outline" asChild>
                                    <Link href="/admin/products">Go to Admin to Add Products</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT WIDGETS */}
                    <div className="space-y-6">
                        <Card className="bg-indigo-600 text-white border-0 rounded-[2rem] overflow-hidden relative shadow-2xl">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                            <CardContent className="p-8 text-center relative z-10">
                                <BarChart3 className="w-10 h-10 mx-auto mb-4 text-indigo-200" />
                                <h3 className="text-xl font-bold mb-2">Compare</h3>
                                <p className="text-indigo-100 text-sm mb-6">Compare up to 3 cards side-by-side.</p>
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold h-10 rounded-xl">
                                    Start
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                 </div>
            </main>
        </div>
    );
};

export default CreditCardsPage;
