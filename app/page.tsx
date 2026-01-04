'use client';

import React from 'react';
import AnimatedHero from "@/components/home/AnimatedHero";
import SmartAdvisorWidget from "@/components/home/SmartAdvisorWidget";
import QuickToolsSection from "@/components/home/QuickToolsSection";
import LatestInsights from "@/components/home/LatestInsights";
import TrustSection from "@/components/home/TrustSection";
import SEOHead from "@/components/common/SEOHead";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";

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
                title="InvestingP₹o - India's High-Yield Financial Command Center"
                description="Compare mutual funds, credit cards, and loans with institutional-grade data. Access our Alpha Terminal for real-time opportunities and risk profiling."
                structuredData={structuredData}
            />

            {/* Hero Tier: Mission Critical */}
            <CommandCenterSection name="Hero">
                <AnimatedHero />
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
