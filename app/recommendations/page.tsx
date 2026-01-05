"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { rankProducts, scoreCreditCard, ProductScore } from "@/lib/ranking/algorithm";
import { ProductCard } from "@/components/ui/ProductCard";
import { Trophy, TrendingUp, DollarSign, Users, Sparkles, ChevronRight } from "lucide-react";

export default function SmartRecommendationsPage() {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'travel' | 'cashback'>('all');

    const { data: cards = [], isLoading } = useQuery({
        queryKey: ['ranked-cards'],
        queryFn: async () => {
            const CREDIT_CARDS = await api.entities.CreditCard.list();
            // Calculate rankings
            const scores = rankProducts(CREDIT_CARDS, scoreCreditCard);

            // Combine cards with their scores
            return scores.map(score => ({
                card: CREDIT_CARDS.find(c => c.id === score.productId)!,
                score
            }));
        }
    });

    const filteredCards = selectedCategory === 'all'
        ? cards
        : cards.filter(({ card }) => card.type === selectedCategory);

    const getBadgeIcon = (badge?: string) => {
        switch (badge) {
            case 'best_overall': return <Trophy className="w-4 h-4" />;
            case 'best_value': return <DollarSign className="w-4 h-4" />;
            case 'most_popular': return <Users className="w-4 h-4" />;
            case 'editors_choice': return <Sparkles className="w-4 h-4" />;
            default: return null;
        }
    };

    const getBadgeColor = (badge?: string) => {
        switch (badge) {
            case 'best_overall': return 'bg-amber-500 text-white';
            case 'best_value': return 'bg-primary-500 text-white';
            case 'most_popular': return 'bg-secondary-500 text-white';
            case 'editors_choice': return 'bg-secondary-500 text-white';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0B1221] via-blue-900 to-[#0B1221] text-white pt-16 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                        <span className="text-emerald-400 font-bold uppercase text-sm tracking-wider">AI-Powered Rankings</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Best Credit Cards in India (2025)</h1>
                    <p className="text-gray-300 text-lg max-w-2xl">
                        Our algorithm analyzes fees, rewards, user reviews, and 20+ other factors to rank the best credit cards for you.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 -mt-12 relative z-20">

                {/* Category Filter */}
                <div className="flex gap-4 mb-8">
                    {[
                        { key: 'all', label: 'All Cards', icon: Trophy },
                        { key: 'travel', label: 'Travel Cards', icon: TrendingUp },
                        { key: 'cashback', label: 'Cashback Cards', icon: DollarSign }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-sm ${selectedCategory === key
                                ? 'bg-primary-600 text-white shadow-emerald-200'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Ranked Cards */}
                <div className="space-y-6">
                    {filteredCards.map(({ card, score }, index) => (
                        <div key={card.id} className="relative">
                            {/* Rank Badge */}
                            <div className="absolute -left-4 top-8 z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                            'bg-white text-gray-700 border-2 border-gray-300'
                                    }`}>
                                    #{index + 1}
                                </div>
                            </div>

                            {/* Award Badge */}
                            {score.badge && (
                                <div className="absolute -top-3 left-16 z-10">
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md ${getBadgeColor(score.badge)}`}>
                                        {getBadgeIcon(score.badge)}
                                        {score.badge.replace('_', ' ').toUpperCase()}
                                    </div>
                                </div>
                            )}

                            {/* Product Card */}
                            <div className="ml-8">
                                <ProductCard product={card} showCompare={false} />

                                {/* Score Breakdown */}
                                <div className="mt-4 bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-700">Our Score</span>
                                        <span className="text-2xl font-bold text-emerald-600">{score.totalScore}/100</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                        <div>
                                            <div className="text-gray-500 mb-1">Value</div>
                                            <div className="font-bold text-gray-900">{score.breakdown.valueScore}/40</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Popularity</div>
                                            <div className="font-bold text-gray-900">{score.breakdown.popularityScore}/30</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Features</div>
                                            <div className="font-bold text-gray-900">{score.breakdown.featureScore}/20</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Trust</div>
                                            <div className="font-bold text-gray-900">{score.breakdown.trustScore}/10</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Methodology */}
                <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Rank Credit Cards</h2>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">1. Value Score (40%)</h3>
                            <p>We compare annual fees against rewards, lounge access, and other benefits to calculate true value.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">2. Popularity Score (30%)</h3>
                            <p>Based on user ratings and review volume from verified sources like Trustpilot and Reddit.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">3. Feature Score (20%)</h3>
                            <p>Number and quality of features like welcome offers, insurance coverage, and exclusive perks.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">4. Trust Score (10%)</h3>
                            <p>Bank reputation, customer service quality, and claim settlement track record.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
