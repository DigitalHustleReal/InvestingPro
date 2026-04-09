import React from "react";
import type { Metadata } from "next";
import { MarriageCostCalculator } from "@/components/calculators/MarriageCostCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Marriage Cost Calculator India 2026 — Wedding Budget Planner | InvestingPro",
  description:
    "Plan your Indian wedding budget by city, guests, and categories. See cost breakdown for food, venue, jewellery, photography. Calculate SIP needed to save for your dream wedding.",
  keywords:
    "marriage cost calculator India, wedding budget calculator, Indian wedding cost, shaadi budget planner, wedding cost by city, how much wedding costs India, wedding saving plan, marriage expense calculator",
  openGraph: {
    title: "Marriage Cost Calculator India 2026",
    description:
      "Plan your Big Fat Indian Wedding budget. Cost breakdown + SIP saving plan.",
    url: "https://investingpro.in/calculators/marriage-cost",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/marriage-cost",
  },
};

export default function MarriageCostPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Marriage Cost Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/marriage-cost",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does an Indian wedding cost in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Average Indian wedding costs: Metro (300 guests): ₹25-40L. Tier 2 (300 guests): ₹15-25L. Tier 3/Town (300 guests): ₹8-15L. These include venue, food, decoration, photography, clothing, and jewellery. Destination weddings can cost 2-3x more. Food is typically 35-40% of total cost.",
        },
      },
      {
        "@type": "Question",
        name: "How to save for a wedding in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start a dedicated SIP 2-3 years before. For a ₹25L wedding in 3 years: save ₹65K/month in equity mutual funds (12% return). Or ₹58K/month in debt funds (8% safer). Open a separate savings account called 'Wedding Fund' to track progress. Never take a personal loan for wedding — 12-18% interest adds ₹3-5L to the cost.",
        },
      },
      {
        "@type": "Question",
        name: "What is the biggest expense in an Indian wedding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Food & catering: 35-40% of total budget (₹800-2500 per plate in metros). Jewellery: 15-20% (₹3-8L depending on tradition). Venue: 10-15% (₹2-10L for premium halls). Photography: 5-8% (₹1-3L for professional team). Pro tip: cutting guest list by 100 saves ₹2-3L in food alone.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <AutoBreadcrumbs />
        <div className="mt-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Marriage Cost Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Plan your Big Fat Indian Wedding — or a smart intimate one. See cost
            breakdown by category, compare metro vs tier-2 vs small-town
            pricing, and calculate the SIP needed to fund it all stress-free.
          </p>
        </div>
        <MarriageCostCalculator />
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {(faqSchema.mainEntity || []).map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.name}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <SocialShareButtons
            url="https://investingpro.in/calculators/marriage-cost"
            title="Marriage Cost Calculator — Plan Your Indian Wedding Budget"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "personal-finance",
              slug: "marriage-cost",
            }}
          />
        </div>
        <div className="mt-8">
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
