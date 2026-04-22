import React from "react";
import type { Metadata } from "next";
import { SIPvsLumpsumComparisonCalculator } from "@/components/calculators/SIPvsLumpsumComparisonCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "SIP vs Lumpsum Comparison Calculator 2026 — Rupee Cost Averaging vs Day-1 Compounding | InvestingPro",
  description:
    "Compare SIP and lumpsum with risk-adjusted returns, rupee cost averaging analysis, best/worst case scenarios, and volatility-based verdict. Find which strategy wins for your investment amount.",
  keywords:
    "SIP vs lumpsum comparison, SIP vs lumpsum calculator, rupee cost averaging benefit, SIP or lumpsum which is better, lumpsum vs SIP risk, SIP vs one time investment, mutual fund SIP vs lumpsum India 2026",
  openGraph: {
    title: "SIP vs Lumpsum Comparison Calculator 2026 — Timing vs Averaging",
    description:
      "Risk-adjusted comparison with rupee cost averaging visualization. Best/worst case in low, medium, high volatility markets.",
    url: "https://investingpro.in/calculators/sip-vs-lumpsum-comparison",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/sip-vs-lumpsum-comparison",
  },
};

export default function SIPvsLumpsumComparisonPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SIP vs Lumpsum Comparison Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/sip-vs-lumpsum-comparison",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is rupee cost averaging and how does SIP benefit from it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rupee cost averaging means your SIP buys more mutual fund units when prices are low and fewer when prices are high. Over time, this averages out your purchase cost. For example, if NAV drops from 100 to 80, your SIP of Rs 10,000 buys 125 units instead of 100. When market recovers, those extra units generate higher returns. This is SIP's biggest advantage over lumpsum in volatile markets.",
        },
      },
      {
        "@type": "Question",
        name: "Does lumpsum always beat SIP in returns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In a steadily rising market, lumpsum mathematically always beats SIP because all your money compounds from Day 1. Historical data shows lumpsum outperforms SIP about 65-70% of the time over 10+ year periods. However, SIP outperforms during volatile periods, market corrections, and bear markets. The key difference is risk — SIP has lower downside risk due to averaging.",
        },
      },
      {
        "@type": "Question",
        name: "What is STP and why do experts recommend it over both SIP and lumpsum?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "STP (Systematic Transfer Plan) combines benefits of both strategies. You invest your lumpsum in a liquid/debt fund earning 6-7%, then auto-transfer a fixed amount to equity fund monthly. Your idle money earns returns while you get SIP-like averaging. STP gives roughly 0.5-1% higher returns than pure SIP because the un-invested portion keeps growing in debt fund.",
        },
      },
      {
        "@type": "Question",
        name: "How does market volatility affect SIP vs lumpsum decision?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In low volatility (large cap / index funds), lumpsum almost always wins. In medium volatility (flexi cap / mid cap), the difference narrows significantly. In high volatility (small cap / sectoral funds), SIP often wins due to aggressive averaging — buying many more units during sharp corrections. Choose SIP for volatile funds and lumpsum for stable, upward-trending markets.",
        },
      },
      {
        "@type": "Question",
        name: "I received a bonus of Rs 10 lakh — should I invest lumpsum or start SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a windfall like a bonus, the best approach is STP (Systematic Transfer Plan). Park Rs 10 lakh in a liquid fund and set up monthly transfers of Rs 80,000-1,00,000 to your equity fund over 10-12 months. If markets correct 10-15% during this period, you can accelerate the transfer. This gives you lumpsum returns on the idle portion plus SIP's averaging protection.",
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
            SIP vs Lumpsum Comparison Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Compare investment timing strategies with risk-adjusted returns,
            rupee cost averaging analysis, and volatility-based best/worst case
            scenarios. See which wins for your money.
          </p>
        </div>
        <SIPvsLumpsumComparisonCalculator />
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
            url="https://investingpro.in/calculators/sip-vs-lumpsum-comparison"
            title="SIP vs Lumpsum — Rupee Cost Averaging vs Day-1 Compounding"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investing",
              slug: "sip-vs-lumpsum-comparison",
            }}
          />
        </div>
        <div className="mt-8">
          <PopularCalculators
            currentSlug="sip-vs-lumpsum-comparison"
            variant="strip"
          />
        </div>
        <FinancialDisclaimer />
      </div>
    </>
  );
}
