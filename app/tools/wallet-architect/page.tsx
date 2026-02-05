"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { apiClient as api } from '@/lib/api-client';
import { RichProduct } from '@/types/rich-product';
import { calculateBestCards, SpendProfile, CardResult } from '@/lib/tools/wallet-math';
import { Loader2, Zap, Wallet, Plane, ShoppingCart, Fuel, Globe, Utensils } from "lucide-react";
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import { RichProductCard } from '@/components/products/RichProductCard';
import SEOHead from "@/components/common/SEOHead";

export default function WalletArchitectPage() {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<RichProduct[]>([]);
    const [results, setResults] = useState<CardResult[]>([]);
    
    // Spend Profile State
    const [profile, setProfile] = useState<SpendProfile>({
        groceries: 5000,
        dining: 3000,
        travel: 0,
        fuel: 2000,
        online: 5000,
        utilities: 2000,
        other: 5000
    });

    const totalSpend = Object.values(profile).reduce((a, b) => a + b, 0);

    // Initial Data Fetch
    useEffect(() => {
        const loadCards = async () => {
             const data = await api.entities.CreditCard.list();
             // Convert to RichProduct
             const richCards: RichProduct[] = data.map((c: any) => ({
                 id: c.id,
                 slug: c.slug,
                 name: c.name,
                 category: 'credit_card',
                 provider_name: c.provider,
                 image_url: c.image_url,
                 description: c.description,
                 rating: { overall: c.rating, trust_score: 90 },
                 features: c.features,
                 key_features: [],
                 pros: [],
                 cons: [],
                 is_verified: true,
                 updated_at: new Date().toISOString()
             }));
             setCards(richCards);
        };
        loadCards();
    }, []);

    const handleOptimize = () => {
        setLoading(true);
        // Simulate "Thinking" time for effect
        setTimeout(() => {
            const calculated = calculateBestCards(profile, cards);
            setResults(calculated.slice(0, 3)); // Top 3
            setLoading(false);
            
            // Scroll to results
            const element = document.getElementById('results-section');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
             <SEOHead
                title="Wallet Architect - Credit Card Combo Optimizer | InvestingPro"
                description="Mathematically optimize your wallet. Find the perfect credit card combination to maximize rewards based on your monthly spending."
            />

            <div className="pt-24 pb-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                     <AutoBreadcrumbs />
                     <CategoryHero
                        title="Wallet Architect"
                        subtitle="Build Your Perfect Card Combo"
                        description="Don't just guess. Let our AI analyze your spending patterns to find the credit cards that give you maximum returns."
                        variant="primary"
                        badge="New • AI Powered"
                        primaryCta={{
                            text: "Start Optimization",
                            href: "#results-section"
                        }}
                        stats={[
                            { label: "Optimization Logic", value: "Advanced" },
                            { label: "Cards Analyzed", value: "50+" },
                            { label: "Potential Upside", value: "₹25k+" }
                        ]}
                     />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Input Section */}
                <div className="lg:col-span-5 space-y-8">
                    <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 sticky top-24">
                        <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-xl p-6">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <Wallet className="w-6 h-6" />
                                Your Monthly Spend
                            </CardTitle>
                            <p className="text-primary-100 text-sm opacity-90">Adjust sliders to match your lifestyle</p>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            
                            <SpendInput 
                                label="Groceries & Supermarket" 
                                icon={ShoppingCart}
                                value={profile.groceries} 
                                onChange={(v: number) => setProfile({...profile, groceries: v})} 
                            />
                            <SpendInput 
                                label="Dining & Food Delivery" 
                                icon={Utensils}
                                value={profile.dining} 
                                onChange={(v: number) => setProfile({...profile, dining: v})} 
                            />
                            <SpendInput 
                                label="Travel (Flights/Hotels)" 
                                icon={Plane}
                                value={profile.travel} 
                                onChange={(v: number) => setProfile({...profile, travel: v})} 
                                max={100000}
                            />
                            <SpendInput 
                                label="Online Shopping" 
                                icon={Globe}
                                value={profile.online} 
                                onChange={(v: number) => setProfile({...profile, online: v})} 
                            />
                            <SpendInput 
                                label="Fuel & Commute" 
                                icon={Fuel}
                                value={profile.fuel} 
                                onChange={(v: number) => setProfile({...profile, fuel: v})} 
                            />

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-500 font-medium">Total Monthly Spend</span>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{totalSpend.toLocaleString()}</span>
                                </div>
                                <Button 
                                    size="lg" 
                                    className="w-full bg-accent-600 hover:bg-accent-700 text-white font-bold h-14 text-lg shadow-lg shadow-accent-500/20"
                                    onClick={handleOptimize}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                                    ) : (
                                        <><Zap className="w-5 h-5 mr-2 fill-current" /> Calculate Best Combo</>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div id="results-section" className="lg:col-span-7 space-y-8">
                    {results.length > 0 ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                            <div className="bg-gradient-to-br from-success-50 to-emerald-50 dark:from-success-900/20 dark:to-emerald-900/20 p-6 rounded-3xl border border-success-100 dark:border-success-900/30 flex items-center justify-between">
                                <div>
                                    <p className="text-success-800 dark:text-success-300 font-bold uppercase tracking-widest text-xs mb-1">Your Projected Annual Savings</p>
                                    <h3 className="text-4xl font-black text-success-700 dark:text-success-400">₹{results[0].netBenefit.toLocaleString()}</h3>
                                </div>
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <TrendingUpIcon className="w-6 h-6 text-success-600" />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recommended Power Cards</h3>
                            
                            <div className="space-y-6">
                                {results.map((result, idx) => (
                                    <div key={result.card.id} className="relative">
                                        {idx === 0 && (
                                            <div className="absolute -top-3 left-6 z-10 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                #1 Best Match
                                            </div>
                                        )}
                                        <RichProductCard product={result.card} layout="list" />
                                        <div className="mt-2 ml-4 flex gap-4 text-xs text-slate-500">
                                            <span>Est. Rewards: <strong className="text-success-600">₹{result.totalRewardValue}/yr</strong></span>
                                            <span>Net Benefit: <strong className="text-primary-600">₹{result.netBenefit}/yr</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                                <Wallet className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Optimize?</h3>
                            <p className="max-w-md mx-auto">Enter your spending details on the left, and we'll calculate the mathematically perfect card combination for you.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

// Sub-component for input slider
function SpendInput({ label, value, onChange, icon: Icon, max = 50000 }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                    <Icon className="w-4 h-4 text-slate-400" />
                    {label}
                </div>
                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold w-24 text-right">
                    ₹{value.toLocaleString()}
                </div>
            </div>
            <Slider 
                value={[value]} 
                max={max} 
                step={500} 
                onValueChange={(v: number[]) => onChange(v[0])}
                className="py-2"
            />
        </div>
    );
}

function TrendingUpIcon(props: any) {
    return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      )
}
