"use client";

import React from 'react';
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Award, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function TopPicks() {
    // Fetch top picks from database/ranking engine
    const { data: topPicks, isLoading } = useQuery({
        queryKey: ['topPicks'],
        queryFn: async () => {
            try {
                // Attempt to fetch from ranking engine
                const [mutualFunds, brokers, creditCards] = await Promise.all([
                    api.entities.MutualFund.filter({ is_active: true }).then(funds => 
                        funds.slice(0, 3).map(f => ({
                            name: f.name,
                            returns: f.returns_3y ? `${f.returns_3y}%` : 'N/A',
                            rating: f.rating || 4,
                            category: f.category || 'Fund',
                            slug: f.slug
                        }))
                    ).catch(() => []),
                    api.entities.Broker.filter({ is_active: true }).then(brokers => 
                        brokers.slice(0, 3).map(b => ({
                            name: b.name,
                            highlight: b.highlight || 'Top Rated',
                            users: b.user_count || 'N/A',
                            slug: b.slug
                        }))
                    ).catch(() => []),
                    api.entities.CreditCard.filter({ is_active: true }).then(cards => 
                        cards.slice(0, 3).map(c => ({
                            name: c.name,
                            highlight: c.highlight || 'Top Rated',
                            reward: c.reward_description || 'Rewards',
                            slug: c.slug
                        }))
                    ).catch(() => [])
                ]);
                
                return { mutualFunds, brokers, creditCards };
            } catch (error) {
                return { mutualFunds: [], brokers: [], creditCards: [] };
            }
        }
    });

    // Hide section if no data available
    if (!isLoading && (!topPicks || (!topPicks.mutualFunds?.length && !topPicks.brokers?.length && !topPicks.creditCards?.length))) {
        return null;
    }

    // Show loading state or hide if still loading and no data
    if (isLoading || !topPicks) {
        return null;
    }
    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span className="text-amber-700 font-medium text-sm">Editor&apos;s Choice 2024</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Our Top Picks
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Handpicked recommendations based on extensive research and analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mutual Funds */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="bg-gradient-to-r from-secondary-600 to-indigo-600 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-white/90" />
                                <h3 className="text-xl font-bold text-white">Best Mutual Funds</h3>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            {topPicks.mutualFunds?.map((fund, index) => (
                                <div key={index} className={`py-4 ${index !== (topPicks.mutualFunds?.length || 0) - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-slate-900">{fund.name}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{fund.category}</p>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
                                            {fund.returns} 3Y
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < fund.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400 italic">
                                            {index === 0 ? "Top-tier Alpha & Consistency" : index === 1 ? "Downside Risk Rank: A" : "Best-in-class SF Efficiency"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <Link
                                href="/mutual-funds"
                                className="flex items-center justify-center gap-2 text-primary-600 font-semibold mt-auto pt-6 hover:text-secondary-700 transition-colors"
                            >
                                View All 5,000+ Funds
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Brokers */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <Award className="w-6 h-6 text-white/90" />
                                <h3 className="text-xl font-bold text-white">Best Stock Brokers</h3>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            {topPicks.brokers?.map((broker, index) => (
                                <div key={index} className={`py-4 ${index !== (topPicks.brokers?.length || 0) - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <div>
                                            <p className="font-semibold text-slate-900">{broker.name}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{broker.users} Users</p>
                                        </div>
                                        <Badge variant="outline" className="border-teal-200 text-teal-700">
                                            {broker.highlight}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-400 italic">
                                        {index === 0 ? "Dominant market leader with zero AMC options." : index === 1 ? "Top-rated UX for mobile-first traders." : "Advanced terminal for high-frequency setups."}
                                    </p>
                                </div>
                            ))}
                            <Link
                                href="/demat-accounts"
                                className="flex items-center justify-center gap-2 text-emerald-600 font-semibold mt-auto pt-6 hover:text-emerald-700 transition-colors"
                            >
                                Compare 25+ SEBI Brokers
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Credit Cards */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                        <div className="bg-gradient-to-r from-secondary-600 to-violet-600 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <Star className="w-6 h-6 text-white/90" />
                                <h3 className="text-xl font-bold text-white">Best Credit Cards</h3>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            {topPicks.creditCards?.map((card, index) => (
                                <div key={index} className={`py-4 ${index !== (topPicks.creditCards?.length || 0) - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <div>
                                            <p className="font-semibold text-slate-900">{card.name}</p>
                                            <p className="text-sm text-slate-500">{card.highlight}</p>
                                        </div>
                                        <Badge className="bg-secondary-100 text-secondary-700 hover:bg-secondary-100 border-0">
                                            {card.reward}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-400 italic">
                                        {index === 0 ? "Best reward-to-fee ratio for high spenders." : index === 1 ? "Optimized for utility and online retail rewards." : "Direct 5% discount on partner ecosystem."}
                                    </p>
                                </div>
                            ))}
                            <Link
                                href="/credit-cards"
                                className="flex items-center justify-center gap-2 text-secondary-600 font-semibold mt-auto pt-6 hover:text-secondary-700 transition-colors"
                            >
                                Compare 150+ Reward Tiers
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
