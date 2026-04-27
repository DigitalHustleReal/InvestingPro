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
import dynamic from "next/dynamic";
import { Metadata } from "next";

// ABOVE THE FOLD — eager imports (LCP critical)
import Hero from "@/components/v2/home/Hero";
import PromiseStrip from "@/components/v2/home/PromiseStrip";
import TrustBar from "@/components/v2/home/TrustBar";
import RateComparison from "@/components/v2/home/RateComparison";
import TopPicks from "@/components/v2/home/TopPicks";

// Server components (no JS shipped to client) — eager is fine, free
import Editorial from "@/components/v2/home/Editorial";
import TrustMethodology from "@/components/v2/home/TrustMethodology";

// BELOW THE FOLD — client components, dynamic-imported so their JS bundles
// don't ship in the initial homepage bundle. Mobile users on slow 4G see
// the skeleton while their browser fetches/parses these in idle time.
const FindYourFit = dynamic(() => import("@/components/v2/home/FindYourFit"), {
  loading: () => <SectionSkeleton />,
});
const ExploreCategories = dynamic(
  () => import("@/components/v2/home/ExploreCategories"),
  { loading: () => <SectionSkeleton /> },
);
const CalculatorSpotlight = dynamic(
  () => import("@/components/v2/home/CalculatorSpotlight"),
  { loading: () => <SectionSkeleton /> },
);
const LifeStageHub = dynamic(
  () => import("@/components/v2/home/LifeStageHub"),
  { loading: () => <SectionSkeleton /> },
);
const NewsletterTrust = dynamic(
  () => import("@/components/v2/home/NewsletterTrust"),
  { loading: () => <SectionSkeleton /> },
);

export const metadata: Metadata = {
  title: "Money, Decoded. — InvestingPro",
  description:
    "Money, Decoded. Compare credit cards, mutual funds, loans, and use 72 free calculators. Independent ratings, transparent methodology — for India.",
  alternates: { canonical: "https://www.investingpro.in" },
  openGraph: {
    title: "Money, Decoded. — InvestingPro",
    description:
      "Money, Decoded. Independent ratings on credit cards, mutual funds, loans + 72 calculators. Transparent methodology, zero paid placements.",
    url: "https://www.investingpro.in",
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
    url: "https://www.investingpro.in",
    description:
      "Money, Decoded. — India's transparent personal finance platform.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://www.investingpro.in/search?q={search_term_string}",
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

      {/* 1.5. Promise Strip — universal trust-signal section.
          Renders identically on desktop + mobile; answers the YMYL
          "why trust you?" question before any commercial CTA. */}
      <PromiseStrip />

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
