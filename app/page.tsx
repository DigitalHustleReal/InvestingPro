// InvestingPro Homepage — NerdWallet-parity redesign
// Clean white theme, interactive constellation hero, full section coverage

export const revalidate = 300; // ISR: 5 minutes

import React, { Suspense } from "react";
import { Metadata } from "next";
import Hero from "@/components/v2/home/Hero";
import TrustBar from "@/components/v2/home/TrustBar";
import RateComparison from "@/components/v2/home/RateComparison";
import MarketPulse from "@/components/v2/home/MarketPulse";
import TopPicks from "@/components/v2/home/TopPicks";
import CalculatorSpotlight from "@/components/v2/home/CalculatorSpotlight";
import ExploreCategories from "@/components/v2/home/ExploreCategories";
import BrandMarquee from "@/components/v2/home/BrandMarquee";
import TrustMethodology from "@/components/v2/home/TrustMethodology";
import NewsletterTrust from "@/components/v2/home/NewsletterTrust";
import Editorial from "@/components/v2/home/Editorial";
import MoreResources from "@/components/v2/home/MoreResources";
import PartnerLogos from "@/components/v2/home/PartnerLogos";
import TrustStats from "@/components/v2/home/TrustStats";

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
        <div className="h-5 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-7 w-64 bg-gray-200 rounded mb-7 animate-pulse" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-5 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
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

      {/* Hero — rotating questions + constellation */}
      <Hero />

      {/* Live data ticker */}
      <TrustBar />

      {/* Partner logos — disabled until real logo assets replace Clearbit */}
      {/* <PartnerLogos /> */}

      {/* Find smarter rates — tabbed deposit/loan comparison */}
      <RateComparison />

      {/* Editor's Picks — latest articles */}
      <Suspense fallback={<SectionSkeleton />}>
        <MarketPulse />
      </Suspense>

      {/* Top-rated products with scores */}
      <Suspense fallback={<SectionSkeleton />}>
        <TopPicks />
      </Suspense>

      {/* Calculator previews with live results */}
      <CalculatorSpotlight />

      {/* Category cards — NerdWallet-style with icons + sub-links */}
      <ExploreCategories />

      {/* Trust stats — why Indians trust us */}
      <TrustStats />

      {/* Brand marquee — scrolling trust signals */}
      <BrandMarquee />

      {/* Newsletter signup */}
      <NewsletterTrust />

      {/* Latest research — editorial grid */}
      <Suspense fallback={<SectionSkeleton />}>
        <Editorial />
      </Suspense>

      {/* More resources — NerdWallet-style accordion */}
      <MoreResources />
    </>
  );
}
