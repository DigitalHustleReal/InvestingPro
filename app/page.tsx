// Server Component for ISR support

// ISR: Revalidate every 5 minutes (homepage has frequently changing content)
export const revalidate = 300;

// Rebuild trigger 1
import React, { Suspense } from 'react';
import HeroSplit from "@/components/home/HeroSplit";
import DiscoveryWizard from "@/components/home/DiscoveryWizard";
import SmartAdvisorWidget from "@/components/home/SmartAdvisorWidget";
import QuickToolsSection from "@/components/home/QuickToolsSection";
import LatestInsights from "@/components/home/LatestInsights";
import TrustSection from "@/components/home/TrustSection";
import SEOHead from "@/components/common/SEOHead";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import TrendingSection from "@/components/home/TrendingSection";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import HomepageOptimizations from "@/components/home/HomepageOptimizations";
import { STAT_STRINGS, STRUCTURED_DATA_STATS } from "@/lib/constants/platform-stats";

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

export default function Home() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "InvestingPro - Smart Financial Decisions Made Simple",
        "alternateName": "InvestingPro.in",
        "description": "Compare credit cards, loans, mutual funds, and government schemes. Get expert reviews and AI-powered recommendations to make smarter financial decisions.",
        "url": "https://investingpro.in",
        "slogan": "Compare. Decide. Apply. India's Smartest Financial Choices.",
        "aggregateRating": STRUCTURED_DATA_STATS.aggregateRating,
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "knowsAbout": ["Personal Finance", "Credit Cards", "Loans", "Mutual Funds", "Investment", "Government Schemes"],
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
            "offerCount": "10000+",
            "lowPrice": "0",
            "highPrice": "0",
            "priceCurrency": "INR"
        }
    };

    return (
        <>
            {/* Phase 3 Optimizations: Performance, Accessibility, Conversion Tracking */}
            <HomepageOptimizations />
            
            {/* Scroll Progress Indicator */}
            <ScrollProgressBar />
            
            <main 
                className="flex flex-col min-h-screen bg-white" 
                role="main" 
                aria-label="InvestingPro homepage"
                id="main-content"
            >
            <SEOHead
                title="InvestingPro - Compare Credit Cards, Loans & Mutual Funds | Make Smart Decisions"
                description="Compare credit cards, loans, mutual funds, and government schemes. Get AI-powered recommendations, expert reviews, and instant applications. Make smarter financial decisions."
                structuredData={structuredData}
            />

            {/* Hero Tier: Mission Critical - HERO 2.0 SPLIT DECISION ENGINE */}
            <CommandCenterSection name="Hero">
                <section data-section-name="Hero" aria-label="Hero section">
                    <HeroSplit />
                </section>
            </CommandCenterSection>

            {/* Intelligence Tier: Lead Generation - Advanced Smart Advisor */}
            <CommandCenterSection name="Smart Advisor">
                <SmartAdvisorWidget />
            </CommandCenterSection>

            {/* Product Tier: High-intent Selection (Resilient with fallbacks) */}
            <CommandCenterSection name="Featured Products">
                <section data-section-name="Featured Products" aria-label="Featured financial products">
                    <FeaturedProducts />
                </section>
            </CommandCenterSection>

            {/* Trending Tier: Market Insights - Drive Repeat Visits */}
            <CommandCenterSection name="Trending">
                <section data-section-name="Trending" aria-label="Trending market insights">
                    <TrendingSection />
                </section>
            </CommandCenterSection>

            {/* Editorial Tier: Authority & SEO - MOVED UP for better SEO and user flow */}
            <CommandCenterSection name="Latest Insights">
                <section data-section-name="Latest Insights" aria-label="Latest financial insights and articles">
                    <LatestInsights />
                </section>
            </CommandCenterSection>

            {/* Utility Tier: User Engagement - After learning for better flow */}
            <CommandCenterSection name="Quick Tools">
                <section data-section-name="Quick Tools" aria-label="Financial calculators and tools">
                    <QuickToolsSection />
                </section>
            </CommandCenterSection>

            {/* Discovery Tier: Navigation & SEO */}
            <CommandCenterSection name="Category Discovery">
                <section data-section-name="Category Discovery" aria-label="Explore financial categories">
                    <CategoryDiscovery />
                </section>
            </CommandCenterSection>

            {/* Trust Tier: Brand Credibility + Testimonials (MERGED) */}
            <CommandCenterSection name="Trust">
                <section data-section-name="Trust" aria-label="Trust signals and testimonials">
                    <TrustSection />
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
