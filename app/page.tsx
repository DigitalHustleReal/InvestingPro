"use client";

import React, { useState, useEffect } from 'react';
import AnimatedHero from "@/components/home/AnimatedHero";
import HomeContextualProducts from "@/components/home/HomeContextualProducts";
import GoalBasedDiscovery from "@/components/home/GoalBasedDiscovery";
import QuickToolsSection from "@/components/home/QuickToolsSection";
import TrustSection from "@/components/home/TrustSection";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import SEOHead from "@/components/common/SEOHead";
import MarketOverview from "@/components/market/MarketOverview";
// import { api } from "@/lib/api"; // broken integration

export default function Home() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                // Hack: Check user metadata or DB for onboarding status
                // For now, assume if user exists, check flag
                if (user && !user.user_metadata?.onboarding_completed) {
                   // setShowOnboarding(true); // Disable for now to avoid annoying popups during dev
                }
            } catch (error) {
                // Silently handle auth check failure
            }
        };
        checkOnboarding();
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "InvestingPro.in",
        "description": "India's Best Financial Platform. Compare investments, access terminal-grade tools, and optimize your wealth.",
        "url": "https://investingpro.in",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "5200"
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <SEOHead
                title="InvestingPro - India's High-Yield Financial Command Center"
                description="Compare mutual funds, credit cards, and loans with institutional-grade data. Access our Alpha Terminal for real-time opportunities and risk profiling."
                structuredData={structuredData}
            />

            {/* Section 1: Animated Hero with Category Selector Above */}
            <AnimatedHero onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />

            {/* Section 2: Market Pulse Overview */}
            <MarketOverview />

            {/* Section 3: Contextual Products - Dynamic based on category */}
            <HomeContextualProducts selectedCategory={selectedCategory} />

            {/* Section 4: Goal-Based Discovery */}
            <GoalBasedDiscovery />

            {/* Section 5: Quick Tools - Popular Calculators */}
            <QuickToolsSection />

            {/* Section 6: Trust & Social Proof */}
            <TrustSection />

            <OnboardingFlow
                open={showOnboarding}
                onComplete={() => setShowOnboarding(false)}
            />
        </main>
    );
}
