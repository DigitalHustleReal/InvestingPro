
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input"; // Note: Search Input in Hero is non-functional in SSR unless wrapped, keeping visual or moving to Client
import SEOHead from "@/components/common/SEOHead";
import TopPicksRow from '@/components/credit-cards/TopPicksRow';
import CategoryHero from '@/components/common/CategoryHero';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import MobileEngagementBar from '@/components/common/MobileEngagementBar';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';

import { getCreditCardsServer } from '@/lib/products/get-credit-cards-server';
import CreditCardsClient from './CreditCardsClient';
import SEOContentBlock from '@/components/common/SEOContentBlock';
import { CREDIT_CARD_SEO_CONTENT } from '@/lib/content/seo-content';

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function CreditCardsPage() {
    // SSR Fetch with Safety Fallback (Defensive Programming)
    let assets = [];
    try {
        assets = await getCreditCardsServer();
        console.log(`[CreditCardsPage] Fetched ${assets?.length || 0} cards`);
    } catch (error) {
        // FAIL OPEN strategy: Log error but render page with empty assets
        console.error("[CreditCardsPage] CRITICAL: Failed to load credit cards:", error);
        assets = [];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Best Credit Cards in India (2025) - Compare & Apply Online | InvestingPro"
                description="Compare 100+ top credit cards in India. Get instant approval, check eligibility, and find cards with best rewards, cashback, and travel benefits. Apply now!"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "Best Credit Cards in India",
                    "description": "Compare and apply for the best credit cards in India based on rewards, cashback, and fees.",
                    "url": "https://investingpro.in/credit-cards",
                    "numberOfItems": assets.length
                }}
            />

            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
                 <div className="container mx-auto px-4">
                      <AutoBreadcrumbs />
                      
                      {/* Premium Authoritative Hero */}
                      <CategoryHero
                          title="Compare 1000+ Credit Cards"
                          subtitle="Make Smart Decisions. Apply Instantly."
                          description="Get personalized recommendations based on your spending pattern, lifestyle, and eligibility. Compare cards side-by-side and apply instantly with our affiliate partners."
                          primaryCta={{
                              text: "Find Your Perfect Card",
                              href: "/credit-cards/find-your-card"
                          }}
                          secondaryCta={{
                              text: "Compare All Cards",
                              href: "#compare"
                          }}
                          stats={[
                              { label: "Cards Compared", value: `${assets.length}+` }, // Dynamic count!
                              { label: "Instant Apply", value: "Yes" },
                              { label: "Decision Engine", value: "Active" }
                          ]}
                          badge="Helps You Decide • Expert-Reviewed • Instant Apply"
                          variant="primary"
                          className="mb-8"
                      />

                      {/* Pre-Launch Critical: Affiliate Disclosure above the fold */}
                      <div className="max-w-xl mx-auto mb-10">
                         <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                      </div>

                      {/* Search Bar - Visual Only (Real search is in Client Component below or needs Refactoring to use URL params) 
                          For now, we keep it as a visual entry point that scrolls to the list or we move logic to Client.
                          Ideally, this input should be in a Client Component.
                          Lets just leave a static placeholder for UI consistency or hide it.
                      */}
                 </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
                
                {/* Winners Podium - Guidance Layer */}
                <TopPicksRow />

                {/* Interactive Client Section (Filters, List, Search) */}
                <CreditCardsClient initialAssets={assets as any} />
             
            </div>

            {/* Compliance Disclaimer */}
            <div className="container mx-auto px-4 pb-8 space-y-12">
                <SEOContentBlock 
                    title={CREDIT_CARD_SEO_CONTENT.title}
                    content={CREDIT_CARD_SEO_CONTENT.content}
                />
                
                <ComplianceDisclaimer variant="compact" />
            </div>

            {/* Mobile Engagement Bar */}
            <MobileEngagementBar category="credit_card" />

        </div>
    );
};
