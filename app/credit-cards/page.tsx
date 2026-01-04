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

const CreditCardsPage = () => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const loadAssets = async () => {
            try {
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
        : assets.filter(asset => asset.metadata?.type?.toLowerCase() === activeCategory || asset.type === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Best Credit Cards in India 2026 | InvestingPro"
                description="Compare premium credit cards, discover hidden rewards, and find the lowest interest rates. Expert analysis of 50+ cards from HDFC, SBI, Axis, and more."
            />

            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 dark:bg-indigo-500/20" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 dark:bg-teal-500/20" />
                    <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-slate-200/50 dark:bg-slate-900/0 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Hero Text */}
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

                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-500 dark:text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                                    <span>Unbiased Data</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                                    <span>Updated Daily</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                                    <span>No Hidden fees</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual - 3D Card Animation */}
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-none perspective-1000 group">
                            {/* Animated Background Blob behind card */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-[60px] rounded-full animate-pulse" />

                            {/* The Card */}
                            <div className="relative w-full aspect-[1.586/1] rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl shadow-indigo-500/30 flex flex-col justify-between p-8 md:p-10 text-white transform rotate-y-[-12deg] rotate-x-[10deg] transition-all duration-700 group-hover:rotate-0 group-hover:scale-105 group-hover:shadow-indigo-500/50 z-10 backdrop-blur-xl">
                                {/* Gloss Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] pointer-events-none" />
                                
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-12 bg-gradient-to-r from-amber-200 to-amber-400 rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden">
                                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
                                         <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tighter">Chip</span>
                                    </div>
                                    <Zap className="w-10 h-10 text-white/80" strokeWidth={1.5} />
                                </div>

                                <div className="space-y-2 relative">
                                    <div className="text-2xl md:text-3xl font-mono tracking-widest text-white/90 shadow-sm">
                                        •••• •••• •••• 8842
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <div>
                                            <div className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Card Holder</div>
                                            <div className="text-lg font-medium tracking-wide">SHIV PRATAP</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Expires</div>
                                            <div className="text-lg font-medium tracking-wide">12/29</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Badge */}
                                <div className="absolute -right-6 -top-6 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2 animate-bounce transition-transform">
                                    <TrendingUp size={16} />
                                    <span>5% Cashback</span>
                                </div>
                            </div>

                            {/* Second Card (Behind) */}
                            <div className="absolute top-12 -right-8 w-full aspect-[1.586/1] rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-700 border border-white/10 shadow-xl -z-10 transform rotate-y-[-12deg] rotate-x-[10deg] translate-z-[-50px] opacity-60 scale-95 transition-all duration-700 group-hover:rotate-6 group-hover:translate-x-12 group-hover:opacity-80"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FILTER & STATS BAR --- */}
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
                    
                    <div className="relative w-full md:w-72">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                         <Input 
                            placeholder="Filter by bank..." 
                            className="pl-9 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 transition-all"
                         />
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <main className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   
                    {/* LEFT COLUMN: CARDS LIST */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Recommendations</h2>
                            <span className="text-sm text-slate-500">{filteredAssets.length} cards found</span>
                        </div>

                        {loading ? (
                             [...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl" />
                            ))
                        ) : filteredAssets.length > 0 ? (
                            filteredAssets.map((asset, i) => (
                                <Card key={i} className="group overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 rounded-3xl">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Card Image Section */}
                                            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-950/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 relative overflow-hidden group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 transition-colors">
                                                <div className="relative w-40 h-24 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 z-10">
                                                     {/* Mini Card Content */}
                                                     <div className="absolute top-2 right-2"><Sparkles className="w-3 h-3 text-white/50" /></div>
                                                     <div className="absolute bottom-2 left-3 text-[8px] text-white/80 font-mono tracking-widest">•••• 4242</div>
                                                </div>
                                                {/* Background Glow specific to card */}
                                                <div className="absolute w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                
                                                <div className="mt-6 text-center">
                                                    <div className="font-bold text-slate-900 dark:text-white text-sm">{asset.provider || "Bank"}</div>
                                                    <div className="text-xs text-slate-500">{asset.metadata?.network || "Visa Signature"}</div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{asset.name}</h3>
                                                       {asset.rewardRate && (
                                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold">
                                                                {asset.rewardRate} Return
                                                            </Badge>
                                                       )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4 my-6">
                                                        <div>
                                                            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Annual Fee</div>
                                                            <div className="font-semibold text-slate-900 dark:text-slate-200">
                                                                {asset.features?.annual_fee || (asset.annualFee ? `₹${asset.annualFee}` : "Free")}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Lounge Access</div>
                                                            <div className="font-semibold text-slate-900 dark:text-slate-200">
                                                                {asset.features?.lounge_access || "Included"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mt-auto pt-4 md:pt-0">
                                                    <Button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 font-bold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all">
                                                        Apply Now
                                                    </Button>
                                                    <Link href={`/credit-cards/${asset.slug || asset.id} || '#' `} className="flex-1">
                                                        <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl h-12 text-slate-600 dark:text-slate-300 font-semibold">
                                                            Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No cards found</h3>
                                <p className="text-slate-500">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: WIDGETS */}
                    <div className="space-y-8">
                        {/* Comparison Widget */}
                        <Card className="bg-indigo-600 text-white border-0 rounded-[2rem] overflow-hidden relative shadow-2xl shadow-indigo-600/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                            <CardContent className="p-8 text-center relative z-10">
                                <BarChart3 className="w-12 h-12 mx-auto mb-6 text-indigo-200" />
                                <h3 className="text-2xl font-bold mb-3">Compare Cards</h3>
                                <p className="text-indigo-100 mb-8 leading-relaxed">Select up to 3 cards to see a side-by-side feature breakdown.</p>
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold h-12 rounded-xl">
                                    Start Comparison
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Tips */}
                         <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm">
                            <CardContent className="p-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" /> 
                                    Pro Tips
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-1" />
                                        Always pay bills 2 days before due date to boost CIBIL.
                                    </li>
                                     <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-1" />
                                        Use 'Lifetime Free' cards for unused credit limits.
                                    </li>
                                     <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-1" />
                                        Check for devaluation updates every quarter.
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CreditCardsPage;
