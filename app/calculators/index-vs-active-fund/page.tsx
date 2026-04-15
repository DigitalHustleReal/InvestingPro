import React from "react";
import type { Metadata } from "next";
import { IndexVsActiveFundCalculator } from "@/components/calculators/IndexVsActiveFundCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Index Fund vs Active Fund Calculator 2026 — Which Beats the Market? | InvestingPro",
  description:
    "Compare index funds and actively managed funds. Expense ratio, alpha generation, long-term performance data. See which fund type gives better returns after costs over 10-30 years in India.",
  keywords:
    "index fund vs active fund calculator, index fund vs actively managed fund, passive vs active investing India, Nifty 50 index fund, expense ratio comparison, alpha after expenses, active fund underperformance, SPIVA India scorecard",
  openGraph: {
    title:
      "Index Fund vs Active Fund Calculator 2026 — Which Beats the Market?",
    description:
      "Compare index funds and actively managed funds. See which gives better returns after expenses over 10-30 years.",
    url: "https://investingpro.in/calculators/index-vs-active-fund",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/index-vs-active-fund",
  },
};

export default function IndexVsActiveFundPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Index Fund vs Active Fund Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/index-vs-active-fund",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do index funds beat active funds in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In the large-cap category, yes — increasingly so. The SPIVA India Scorecard shows that over a 5-year period, around 75-85% of large-cap active funds underperform the S&P BSE 100 index after expenses. However, in mid-cap and small-cap categories, active funds in India still have a better track record of outperformance compared to developed markets. This is because Indian mid/small-cap markets are less efficient, giving skilled fund managers more room to generate alpha. As markets mature, this edge is expected to narrow.",
        },
      },
      {
        "@type": "Question",
        name: "What is alpha and does it survive after expenses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Alpha is the excess return a fund generates over its benchmark index. For example, if Nifty 50 returns 12% and a fund returns 14%, the gross alpha is 2%. However, active funds charge higher expense ratios (typically 1.5%–2% for regular plans, 0.5%–1% for direct). After deducting expenses, the net alpha often shrinks to zero or turns negative. An active fund needs to generate at least 1%–1.5% gross alpha consistently just to match an index fund's net returns. Over 10+ years, very few active fund managers sustain this level of outperformance after costs.",
        },
      },
      {
        "@type": "Question",
        name: "What is tracking error in index funds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tracking error measures how closely an index fund replicates its benchmark. A Nifty 50 index fund should deliver returns very close to the Nifty 50 index. Tracking error arises from expense ratio (the biggest factor), cash holdings (funds must hold some cash for redemptions), rebalancing delays, and impact cost during trades. In India, well-managed index funds (UTI Nifty 50, HDFC Index Nifty 50) have tracking errors of 0.02%–0.10% annually. ETFs can have even lower tracking error but may trade at a premium/discount to NAV. Choose index funds with lowest tracking error and expense ratio — not just AUM size.",
        },
      },
      {
        "@type": "Question",
        name: "Should beginners choose index funds or active funds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For most beginners, index funds are the better starting point. Reasons: no need to research and select the 'right' fund manager, lowest expense ratios (0.1%–0.2% for direct plans), no risk of underperformance vs benchmark, simple to understand and monitor, and no style drift risk. A simple portfolio of Nifty 50 index fund + Nifty Next 50 index fund gives exposure to India's top 100 companies at minimal cost. As you gain experience and can evaluate fund manager track records, you can consider adding 1-2 proven active mid-cap funds for potential alpha.",
        },
      },
      {
        "@type": "Question",
        name: "Is a Nifty 50 index fund better than large-cap active funds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For most investors, yes. SEBI mandates that large-cap funds must invest at least 80% in top-100 stocks by market cap, severely limiting a fund manager's ability to pick different stocks from the index. After SEBI's 2018 categorisation rules, large-cap active funds have a smaller stock-picking universe, making it harder to generate alpha. A Nifty 50 direct index fund charges ~0.1% expense ratio vs 0.8%–1.5% for a large-cap active fund. Over 20 years, even a 0.5% annual expense difference on ₹1 crore can mean ₹25-40 lakh less in your corpus. Top index fund options: UTI Nifty 50 Index Fund (Direct), HDFC Index Fund Nifty 50 Plan (Direct), or Nifty 50 ETFs like Nippon Nifty BeES.",
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
            Index Fund vs Active Fund Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare index funds and actively managed funds head to head. See how
            expense ratios, alpha generation, and tracking error affect your
            long-term returns over 10-30 years.
          </p>
        </div>
        <IndexVsActiveFundCalculator />
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
            url="https://investingpro.in/calculators/index-vs-active-fund"
            title="Index Fund vs Active Fund Calculator — Which Beats the Market?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "mutual-funds",
              slug: "index-vs-active-fund",
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
