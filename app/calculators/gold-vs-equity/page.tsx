import React from "react";
import type { Metadata } from "next";
import { GoldVsEquityCalculator } from "@/components/calculators/GoldVsEquityCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Gold vs Equity Calculator 2026 — Which Investment Beats Inflation? | InvestingPro",
  description:
    "Compare gold and equity returns over 5-20 years. Analyse CAGR, volatility, tax treatment, and inflation hedging side by side. Find the right allocation for your portfolio with India-specific data.",
  keywords:
    "gold vs equity calculator, gold vs stocks India, gold vs nifty 50, sovereign gold bond vs index fund, gold vs equity returns, gold investment calculator, equity investment calculator, gold vs mutual fund, portfolio allocation gold equity, inflation hedge India",
  openGraph: {
    title: "Gold vs Equity Calculator 2026 — Which Investment Beats Inflation?",
    description:
      "Compare gold and equity returns over 5-20 years. CAGR, volatility, tax treatment, and inflation hedge analysis.",
    url: "https://investingpro.in/calculators/gold-vs-equity",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/gold-vs-equity",
  },
};

export default function GoldVsEquityPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gold vs Equity Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/gold-vs-equity",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which gives better long-term returns — gold or equity in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Over 20+ years, Indian equities (Nifty 50) have delivered 12-14% CAGR while gold has delivered 10-11% CAGR in INR terms. However, gold outperforms during global crises, high-inflation periods, and rupee depreciation. Equity wins in long secular bull markets. A balanced portfolio with 10-15% gold allocation historically delivers better risk-adjusted returns than 100% equity.",
        },
      },
      {
        "@type": "Question",
        name: "Should I invest in Sovereign Gold Bonds (SGB) or an index fund?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SGBs offer 2.5% annual interest on top of gold price appreciation, and capital gains are completely tax-free if held to maturity (8 years). Index funds tracking Nifty 50 have delivered ~12% CAGR but LTCG above ₹1.25 lakh is taxed at 12.5%. For gold exposure, SGBs are the most tax-efficient option. For wealth creation over 10+ years, index funds still have a higher expected return. Ideally, hold both — SGBs for stability and index funds for growth.",
        },
      },
      {
        "@type": "Question",
        name: "How is gold taxed vs equity in India (2026 rules)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Physical gold and gold ETFs/mutual funds: LTCG (held >24 months) taxed at 12.5% without indexation. STCG taxed at your income tax slab rate. Sovereign Gold Bonds: completely tax-free on capital gains if held to maturity (8 years); interest taxed at slab rate. Equity (shares/equity MFs): LTCG (held >12 months) above ₹1.25 lakh taxed at 12.5%. STCG taxed at 20%. SGBs have the best tax treatment among all gold and equity instruments.",
        },
      },
      {
        "@type": "Question",
        name: "What is the ideal gold-to-equity ratio in a portfolio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most financial advisors recommend 10-15% gold allocation for Indian investors. Conservative investors (age 50+) may go up to 20-25%. Young investors with 15+ year horizons should keep gold at 5-10% and allocate more to equity. Gold acts as a portfolio hedge — it tends to rise when equities fall (negative correlation during crises). During 2008 and 2020 crashes, gold rose 25-30% while Nifty fell 50%+ and 35% respectively.",
        },
      },
      {
        "@type": "Question",
        name: "Does gold actually beat inflation in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, gold has consistently beaten Indian CPI inflation over long periods. From 2000-2025, gold delivered ~11% CAGR in INR while average CPI inflation was 5-6%. Gold benefits from rupee depreciation — even when international gold prices are flat, INR gold prices rise as the rupee weakens. However, in short 3-5 year windows, gold can underperform inflation (e.g., 2013-2018). For reliable inflation hedging, hold gold for 7+ years.",
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
            Gold vs Equity Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare gold and equity investments side by side. Analyse CAGR,
            volatility, tax efficiency, and inflation protection over 5-20 years
            with India-specific data and post-tax returns.
          </p>
        </div>
        <GoldVsEquityCalculator />
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
            url="https://investingpro.in/calculators/gold-vs-equity"
            title="Gold vs Equity Calculator — Which Investment Beats Inflation?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investment",
              slug: "gold-vs-equity",
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
