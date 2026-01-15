'use client';

import React from 'react';
import HeroSection from "@/components/home/HeroSection";
import SmartAdvisorWidget from "@/components/home/SmartAdvisorWidget";
import QuickToolsSection from "@/components/home/QuickToolsSection";
import LatestInsights from "@/components/home/LatestInsights";
import TrustSection from "@/components/home/TrustSection";
import SEOHead from "@/components/common/SEOHead";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import { STAT_STRINGS, STRUCTURED_DATA_STATS } from "@/lib/constants/platform-stats";

/**
 * Section wrapper that provides isolation.
 * If one vertical fails, the rest of the command center stays operational.
 */
function CommandCenterSection({ children, name }: { children: React.ReactNode, name: string }) {
    return (
        <PageErrorBoundary pageName={`Home Section: ${name}`}>
            {children}
        </PageErrorBoundary>
    );
}

export default function Home() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization", // Changed from FinancialService
        "name": "InvestingPro.in",
        "description": "India's Decision-Making Platform for Credit Cards & Investments. Compare, decide, and apply instantly.",
        "url": "https://investingpro.in",
        "aggregateRating": STRUCTURED_DATA_STATS.aggregateRating // Using imported constant
    };

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <SEOHead
                title="InvestingPro - Compare 1000+ Credit Cards & Mutual Funds. Make Smart Decisions. Apply Instantly."
                description="India's Decision-Making Platform for Credit Cards & Investments. Compare, decide, and apply instantly with real-time comparisons, expert reviews, and instant application links."
                structuredData={structuredData}
            />

            {/* Hero Tier: Mission Critical - UPDATED TO NEW DESIGN */}
            <CommandCenterSection name="Hero">
                <HeroSection />
            </CommandCenterSection>

            {/* Intelligence Tier: Lead Generation */}
            <CommandCenterSection name="Smart Advisor">
                <SmartAdvisorWidget />
            </CommandCenterSection>

            {/* Utility Tier: User Engagement */}
            <CommandCenterSection name="Quick Tools">
                <QuickToolsSection />
            </CommandCenterSection>

            {/* Product Tier: High-intent Selection (Resilient with fallbacks) */}
            <CommandCenterSection name="Featured Products">
                <FeaturedProducts />
            </CommandCenterSection>

            {/* Discovery Tier: Navigation & SEO */}
            <CommandCenterSection name="Category Discovery">
                <CategoryDiscovery />
            </CommandCenterSection>

            {/* Editorial Tier: Authority & SEO */}
            <CommandCenterSection name="Latest Insights">
                <LatestInsights />
            </CommandCenterSection>

            {/* Trust Tier: Brand Credibility */}
            <CommandCenterSection name="Trust">
                <TrustSection />
            </CommandCenterSection>
        </main>
    );
}
