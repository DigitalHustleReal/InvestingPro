"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
// Removed mock data import - using Supabase API
import ComparisonTable from "@/components/compare/ComparisonTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { CreditCard } from "@/types";
import { RichProduct } from "@/types/rich-product";

// Helper to map CreditCard to RichProduct
// Helper to map CreditCard to RichProduct & Comparison Props
const mapToRichProduct = (card: any): RichProduct & Record<string, any> => {
    const features = card.features || {};
    
    // Extract values for Comparison Table
    return {
        id: card.id,
        slug: card.slug,
        name: card.name,
        provider_name: card.provider || card.provider_name,
        category: 'credit_card',
        image_url: card.image_url,
        rating: {
            overall: Number(card.rating) || 4.5,
            trust_score: 90
        },
        features: features,
        key_features: Object.entries(features).map(([k,v]) => ({ label: k, value: String(v) })),
        description: card.description || '',
        pros: card.pros || [],
        cons: card.cons || [],
        bestFor: card.best_for,
        affiliate_link: card.affiliate_link || card.link,
        is_verified: true,
        updated_at: new Date().toISOString(),
        
        // Properties required by ComparisonTable (mapped from features)
        annualFee: features['Annual Fee'] || 'Nil',
        joiningFee: features['Joining Fee'] || 'Nil',
        rewardRate: features['Reward Rate'] || 'Check details',
        loungeAccess: features['Lounge Access'] || 'Check details',
        welcomeOffer: card.welcomeBonus || 'Check details',
        minCreditScore: '700+'
    };
};

function CreditCardCompareContent() {
    const searchParams = useSearchParams();
    const [selectedCards, setSelectedCards] = useState<RichProduct[]>([]);

    useEffect(() => {
        // Get card IDs from URL query params
        const cardIds = searchParams.get('cards')?.split(',') || [];
        
        // Fetch cards from API
        const fetchCards = async () => {
            const { api } = await import('@/lib/api');
            const allCards = await api.entities.CreditCard.list();
            const cards = allCards
                .filter((card: any) => cardIds.includes(card.id) || cardIds.includes(card.slug))
                .map(mapToRichProduct);
            setSelectedCards(cards);
        };
        
        if (cardIds.length > 0) {
            fetchCards();
        }
    }, [searchParams]);

    const handleRemove = (cardId: string) => {
        setSelectedCards(prev => prev.filter(c => c.id !== cardId));
    };

    // Fetch available cards from API
    const [availableCards, setAvailableCards] = useState<RichProduct[]>([]);
    
    useEffect(() => {
        const fetchAvailableCards = async () => {
            const { api } = await import('@/lib/api');
            const allCards = await api.entities.CreditCard.list();
            const filtered = allCards
                .filter((card: any) => !selectedCards.find(c => c.id === card.id))
                .map(mapToRichProduct);
            setAvailableCards(filtered);
        };
        fetchAvailableCards();
    }, [selectedCards]);

    return (
        <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="bg-card text-card-foreground py-12 border-b border-border pt-32">
                <div className="container mx-auto px-6">
                    <Link href="/credit-cards" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Credit Cards
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Compare Credit Cards</h1>
                    <p className="text-muted-foreground">Side-by-side comparison of features, fees, and rewards</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">

                {/* Add More Cards */}
                {selectedCards.length < 4 && (
                    <div className="mb-8">
                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-foreground">Add More Cards to Compare</h2>
                                <span className="text-sm text-muted-foreground">{selectedCards.length}/4 selected</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {availableCards.slice(0, 4).map((card) => (
                                    <button
                                        key={card.id}
                                        onClick={() => setSelectedCards(prev => [...prev, card])}
                                        className="p-6 md:p-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                            <span className="text-xs text-muted-foreground group-hover:text-primary font-medium">Add</span>
                                        </div>
                                        <p className="font-bold text-sm text-foreground mb-1">{card.name}</p>
                                        <p className="text-xs text-muted-foreground">{card.provider_name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Comparison Table */}
                <ComparisonTable products={selectedCards} onRemoveProduct={handleRemove} />

                {/* Help Section */}
                <div className="mt-12 bg-primary/5 rounded-xl p-8 border border-primary/10">
                    <h3 className="font-bold text-primary mb-4">How to Choose the Right Credit Card?</h3>
                    <div className="grid md:grid-cols-3 gap-6 text-sm text-foreground/80">
                        <div>
                            <h4 className="font-semibold mb-2">1. Identify Your Spending Pattern</h4>
                            <p>Travel frequently? Choose travel cards. Shop online? Go for cashback cards.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">2. Compare Annual Fees vs Benefits</h4>
                            <p>High fee cards often have better rewards. Calculate if the benefits justify the cost.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">3. Check Eligibility Criteria</h4>
                            <p>Ensure you meet the minimum credit score and income requirements.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreditCardComparePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading comparison...</p>
                </div>
            </div>
        }>
            <CreditCardCompareContent />
        </Suspense>
    );
}
