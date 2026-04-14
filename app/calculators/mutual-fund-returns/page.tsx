import React from "react";
import type { Metadata } from "next";
import { MutualFundReturnsCalculator } from "@/components/calculators/MutualFundReturnsCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Mutual Fund Returns Calculator India 2026 — SIP + Lumpsum + Tax | InvestingPro",
  description:
    "Free mutual fund returns calculator with expense ratio impact, LTCG tax estimate, and Direct vs Regular plan comparison. Calculate SIP, lumpsum, or combined returns with year-wise growth chart.",
  keywords:
    "mutual fund calculator, mutual fund returns calculator India, SIP returns calculator, mutual fund CAGR calculator, expense ratio calculator, LTCG tax mutual fund, mutual fund investment calculator",
  openGraph: {
    title: "Mutual Fund Returns Calculator India 2026",
    description:
      "Calculate mutual fund returns with expense ratio, tax, and Direct vs Regular comparison.",
    url: "https://investingpro.in/calculators/mutual-fund-returns",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/mutual-fund-returns",
  },
};

export default function MutualFundReturnsPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Mutual Fund Returns Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/mutual-fund-returns",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a good return for mutual funds in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Historically: Large Cap Index funds average 12-13% CAGR over 10+ years. Mid Cap funds: 14-16%. Small Cap funds: 15-18% (with higher risk). Debt funds: 6-8%. Balanced/Hybrid: 9-11%. A 'good' return beats inflation (6-7%) significantly — anything above 10% for equity funds is considered acceptable over long periods.",
        },
      },
      {
        "@type": "Question",
        name: "How does expense ratio affect mutual fund returns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Expense ratio is the annual fee charged by the fund. A 1% expense ratio on a ₹10L portfolio costs ₹10,000/year. Over 20 years, the difference between 0.5% (direct/index) and 2% (regular/active) expense ratio on ₹10K/month SIP at 12% returns is approximately ₹12-15 lakh. Always prefer Direct Plans with lower expense ratios.",
        },
      },
      {
        "@type": "Question",
        name: "What is LTCG tax on mutual funds in India 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Equity Mutual Funds: Long-term (held >1 year) — 12.5% tax on gains above ₹1.25 lakh per year. Short-term (<1 year) — 20%. Debt Mutual Funds: Taxed at your income tax slab rate regardless of holding period (no LTCG benefit since April 2023). Always hold equity MFs for 1+ years and plan redemptions to stay within the ₹1.25L LTCG exemption.",
        },
      },
      {
        "@type": "Question",
        name: "SIP vs Lumpsum — which gives better returns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Historically, lumpsum beats SIP about 65-70% of the time because markets trend upward. However, SIP reduces timing risk (rupee cost averaging) and is easier for salaried individuals. Best strategy: combine both — invest lumpsum when markets drop 10%+ (from highs), maintain regular SIP for discipline.",
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
            Mutual Fund Returns Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate mutual fund returns for SIP, lumpsum, or combined
            investments. See the impact of expense ratio, estimate LTCG tax, and
            compare growth across Conservative, Moderate, and Aggressive
            scenarios.
          </p>
        </div>
        <MutualFundReturnsCalculator />
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
            url="https://investingpro.in/calculators/mutual-fund-returns"
            title="Mutual Fund Returns Calculator — SIP + Lumpsum + Tax"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "mutual-funds",
              slug: "mutual-fund-returns",
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
