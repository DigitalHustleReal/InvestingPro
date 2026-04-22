// InvestingPro Homepage — v3 Bold Redesign, engagement-driven editorial flow
// Reference: brainstorm.md §1 + Phase 2 spec
//
// Narrative order (11 sections):
//   1. Hero              — who we are + rotating question
//   2. TrustBar          — live data ticker (immediate credibility)
//   3. RateComparison    — immediate value (best rates today)
//   4. TopPicks          — editor verdict cards
//   5. FindYourFit       — 3-step interactive wizard ← VALUE-ADDING UX
//   6. ExploreCategories — category navigator (SEO + discoverability)
//   7. CalculatorSpotlight — free tools
//   8. LifeStageHub      — curated bundles per life moment ← VALUE-ADDING UX
//   9. Editorial         — latest research (E-E-A-T)
//  10. TrustMethodology  — "How We Rate" 6-criteria (brainstorm §7)
//  11. NewsletterTrust   — conversion before footer
//
// REMOVED from homepage (components kept, just unmounted):
//   - MarketPulse (redundant with Editorial)
//   - BrandMarquee (decorative)
//   - TrustStats (vanity — users don't care about inventory; replaced with
//     FindYourFit + LifeStageHub which actually help users decide)
//   - MoreResources (replaced with LifeStageHub — same discovery intent,
//     stronger UX, life-stage cards with curated bundles)

export const revalidate = 300; // ISR: 5 minutes

import React, { Suspense } from "react";
import { Metadata } from "next";
import Hero from "@/components/v2/home/Hero";
import TrustBar from "@/components/v2/home/TrustBar";
import RateComparison from "@/components/v2/home/RateComparison";
import TopPicks from "@/components/v2/home/TopPicks";
import FindYourFit from "@/components/v2/home/FindYourFit";
import ExploreCategories from "@/components/v2/home/ExploreCategories";
import CalculatorSpotlight from "@/components/v2/home/CalculatorSpotlight";
import LifeStageHub from "@/components/v2/home/LifeStageHub";
import Editorial from "@/components/v2/home/Editorial";
import TrustMethodology from "@/components/v2/home/TrustMethodology";
import NewsletterTrust from "@/components/v2/home/NewsletterTrust";

export const metadata: Metadata = {
  title: "InvestingPro — India's Independent Financial Comparison Platform",
  description:
    "Compare credit cards, mutual funds, loans, and more across 50+ Indian banks. Independent research, AI-powered recommendations, 75 free calculators. No paid rankings.",
  openGraph: {
    title: "InvestingPro — India's Independent Financial Comparison Platform",
    description:
      "Compare credit cards, mutual funds, loans, insurance, and more. Free. Independent. Updated daily.",
    url: "https://investingpro.in",
    type: "website",
    locale: "en_IN",
  },
};

function SectionSkeleton() {
  return (
    <div className="py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-5 w-20 bg-ink/5 rounded mb-2 animate-pulse" />
        <div className="h-7 w-64 bg-ink/5 rounded mb-7 animate-pulse" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border-2 border-ink/10 rounded-sm p-4 space-y-3 animate-pulse"
            >
              <div className="h-4 bg-ink/5 rounded w-1/3" />
              <div className="h-5 bg-ink/5 rounded w-3/4" />
              <div className="h-3 bg-ink/5 rounded w-full" />
              <div className="h-3 bg-ink/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "InvestingPro",
    url: "https://investingpro.in",
    description: "India's independent financial comparison platform",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://investingpro.in/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. Hero — rotating questions + constellation */}
      <Hero />

      {/* 2. Live data ticker — immediate credibility */}
      <TrustBar />

      {/* 3. Find smarter rates — tabbed deposit/loan comparison */}
      <RateComparison />

      {/* 4. Top-rated products — editor's verdict cards */}
      <Suspense fallback={<SectionSkeleton />}>
        <TopPicks />
      </Suspense>

      {/* 5. Find Your Fit — 3-step interactive wizard (engagement + conversion) */}
      <FindYourFit />

      {/* 6. Category navigator — SEO + discoverability */}
      <ExploreCategories />

      {/* 7. Calculator spotlight — free tools */}
      <CalculatorSpotlight />

      {/* 8. Life Stage Hub — curated bundles (replaces passive MoreResources) */}
      <LifeStageHub />

      {/* 9. Latest research — editorial E-E-A-T */}
      <Suspense fallback={<SectionSkeleton />}>
        <Editorial />
      </Suspense>

      {/* 10. How We Rate — 6-criteria methodology (brainstorm Phase 2 §7) */}
      <TrustMethodology />

      {/* 11. Newsletter — conversion before footer */}
      <NewsletterTrust />
    </>
  );
}
