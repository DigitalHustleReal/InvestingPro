import React from "react";
import type { Metadata } from "next";
import { LumpsumVsSIPCalculator } from "@/components/calculators/LumpsumVsSIPCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "Lumpsum vs SIP Calculator 2026 — Which Gives Better Returns? | InvestingPro",
  description:
    "Compare lumpsum investment vs SIP with the same total amount. Visual growth chart, side-by-side returns, AI-powered recommendation on when to choose each strategy.",
  keywords:
    "lumpsum vs SIP, SIP vs lumpsum calculator, which is better SIP or lumpsum, lumpsum vs SIP comparison, mutual fund lumpsum vs SIP, SIP or one time investment",
  openGraph: {
    title: "Lumpsum vs SIP Calculator 2026",
    description:
      "Same amount, two strategies. Visual comparison with AI recommendation.",
    url: "https://investingpro.in/calculators/lumpsum-vs-sip",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/lumpsum-vs-sip",
  },
};

export default function LumpsumVsSIPPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lumpsum vs SIP Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/lumpsum-vs-sip",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is lumpsum better than SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mathematically, lumpsum gives higher returns in a steadily rising market because all your money compounds from Day 1. However, SIP protects against timing risk and volatility. For salaried individuals, SIP is more practical. For windfall amounts (bonus, inheritance), lumpsum or STP is better.",
        },
      },
      {
        "@type": "Question",
        name: "What is STP and why is it better than both?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "STP (Systematic Transfer Plan) is the best of both worlds. You invest lumpsum in a debt fund (earning ~7%), then auto-transfer a fixed amount to equity fund monthly. Your idle money earns returns while you get SIP's averaging benefit. Most fund houses offer STP with ₹1,000 minimum.",
        },
      },
      {
        "@type": "Question",
        name: "Can I do both SIP and lumpsum in same fund?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can have a running SIP of ₹5,000/mo AND make additional lumpsum investments during market corrections. Most platforms (Groww, Zerodha Coin, Kuvera) allow this. This 'SIP + opportunistic lumpsum' strategy is what many financial advisors recommend.",
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
        <TrustStrip />
        <div className="mt-4 mb-6">
          <h1 className="font-display font-black text-[32px] sm:text-[40px] text-ink tracking-tight leading-[1.1]">
            Lumpsum vs SIP Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Same total investment, two strategies. See which gives better
            returns with visual comparison and AI-powered recommendation.
          </p>
        </div>
        <LumpsumVsSIPCalculator />
        <div className="mt-10">
          <h2 className="text-xl font-display font-bold text-ink mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {(faqSchema.mainEntity || []).map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-ink hover:bg-gray-50 transition-colors">
                  {faq.name}
                  <span className="text-ink-60 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-ink-60 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <SocialShareButtons
            url="https://investingpro.in/calculators/lumpsum-vs-sip"
            title="Lumpsum vs SIP — Which Gives Better Returns?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investing",
              slug: "lumpsum-vs-sip",
            }}
          />
        </div>
        <div className="mt-8">
          <div className="mt-8">
            <PopularCalculators currentSlug="lumpsum-vs-sip" variant="strip" />
          </div>
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
