// Server Component for ISR support

// ISR: Revalidate every 5 minutes (homepage has frequently changing content)
export const revalidate = 300;

// Rebuild trigger 1
import React, { Suspense } from 'react';
import HeroSplit from "@/components/home/HeroSplit";
import QuickToolsSection from "@/components/home/QuickToolsSection";
import LatestInsights from "@/components/home/LatestInsights";
import SEOHead from "@/components/common/SEOHead";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import HomepageOptimizations from "@/components/home/HomepageOptimizations";
import { STRUCTURED_DATA_STATS } from "@/lib/constants/platform-stats";

// Lazy load heavy components below the fold for better initial load performance
import StickyMobileCTA from "@/components/home/StickyMobileCTA";

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

/**
 * Homepage v3 — Streamlined from 8 sections → 5
 *
 * New order (optimized for conversion path):
 * 1. Hero — value prop + search + inline trust signals
 * 2. Category Discovery — immediate routing (moved from position 7)
 * 3. Featured Products — high-intent selection
 * 4. Quick Tools — calculators (moved from position 6)
 * 5. Latest Insights — editorial authority + SEO
 *
 * Removed:
 * - SmartAdvisorWidget (competed with hero search)
 * - TrendingSection (used mock data, not real)
 * - TrustSection (signals integrated into hero)
 * - ScrollProgressBar (not needed on homepage)
 */
export default function Home() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "InvestingPro - India's Most Trusted Finance Comparison Platform",
        "alternateName": "InvestingPro.in",
        "description": "Compare credit cards, loans, mutual funds, and insurance. Independent research, AI-powered recommendations, and free financial calculators for smart money decisions.",
        "url": "https://investingpro.in",
        "slogan": "India's Most Trusted Finance Comparison Platform",
        "aggregateRating": STRUCTURED_DATA_STATS.aggregateRating,
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "knowsAbout": ["Personal Finance", "Credit Cards", "Loans", "Mutual Funds", "Investment", "Insurance", "Fixed Deposits"],
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://investingpro.in/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        },
        "offers": {
            "@type": "AggregateOffer",
            "offerCount": "500+",
            "lowPrice": "0",
            "highPrice": "0",
            "priceCurrency": "INR"
        }
    };

    return (
        <>
            {/* Phase 3 Optimizations: Performance, Accessibility, Conversion Tracking */}
            <HomepageOptimizations />

            <main
                className="flex flex-col min-h-screen bg-background"
                role="main"
                aria-label="InvestingPro homepage"
                id="main-content"
            >
            <SEOHead
                title="InvestingPro - Compare Credit Cards, Loans & Mutual Funds | India's Trusted Platform"
                description="Compare 500+ credit cards, mutual funds, loans, and insurance products. Free calculators, independent rankings, and AI-powered recommendations. No paid rankings."
                structuredData={structuredData}
            />

            {/* 1. Hero — Value prop, search, trust signals */}
            <CommandCenterSection name="Hero">
                <section data-section-name="Hero" aria-label="Hero section">
                    <HeroSplit />
                </section>
            </CommandCenterSection>

            {/* 2. Category Discovery — Immediate routing to product categories */}
            <CommandCenterSection name="Category Discovery">
                <section data-section-name="Category Discovery" aria-label="Explore financial categories">
                    <CategoryDiscovery />
                </section>
            </CommandCenterSection>

            {/* 3. Featured Products — High-intent selection */}
            <CommandCenterSection name="Featured Products">
                <section data-section-name="Featured Products" aria-label="Featured financial products">
                    <FeaturedProducts />
                </section>
            </CommandCenterSection>

            {/* 4. Quick Tools — Calculators (high retention, viral sharing) */}
            <CommandCenterSection name="Quick Tools">
                <section data-section-name="Quick Tools" aria-label="Financial calculators and tools">
                    <QuickToolsSection />
                </section>
            </CommandCenterSection>

            {/* 5. Latest Insights — Editorial authority + SEO */}
            <CommandCenterSection name="Latest Insights">
                <section data-section-name="Latest Insights" aria-label="Latest financial insights and articles">
                    <LatestInsights />
                </section>
            </CommandCenterSection>

            {/* Sticky Mobile CTA - Lazy loaded, appears after scrolling */}
            <Suspense fallback={null}>
                <StickyMobileCTA />
            </Suspense>
        </main>
        </>
    );
}
