"use client";

import React, { useState } from 'react';
import AnimatedHero from "@/components/home/AnimatedHero";
import QuickToolsSection from "@/components/home/QuickToolsSection";
import LatestInsights from "@/components/home/LatestInsights";
import TrustSection from "@/components/home/TrustSection";
import SEOHead from "@/components/common/SEOHead";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

            {/* Section 1: Hero */}
            <AnimatedHero onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />

            {/* Section 2: Quick Tools */}
            <QuickToolsSection />

            {/* Section 3: Featured Products */}
            <FeaturedProducts />

            {/* Section 5: Latest Articles */}
            <LatestInsights />

            {/* Section 6: Trust */}
            <TrustSection />
        </main>
    );
}

