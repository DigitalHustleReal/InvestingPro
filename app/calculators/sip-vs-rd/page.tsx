import React from "react";
import type { Metadata } from "next";
import { SIPvsRDCalculator } from "@/components/calculators/SIPvsRDCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "SIP vs RD Calculator 2026 — Mutual Fund SIP vs Recurring Deposit Comparison | InvestingPro",
  description:
    "Compare SIP (Systematic Investment Plan) vs RD (Recurring Deposit) returns after tax. See the power of compounding, wealth creation, tax efficiency, and risk levels side-by-side.",
  keywords:
    "SIP vs RD, SIP vs recurring deposit calculator, mutual fund SIP vs RD, which is better SIP or RD, SIP vs RD comparison 2026, monthly investment SIP or RD, SIP returns vs RD returns",
  openGraph: {
    title: "SIP vs RD Calculator 2026",
    description:
      "Mutual Fund SIP vs Recurring Deposit — compare post-tax wealth creation over 1-30 years.",
    url: "https://investingpro.in/calculators/sip-vs-rd",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/sip-vs-rd",
  },
};

export default function SIPvsRDPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SIP vs RD Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/sip-vs-rd",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is SIP better than RD for long-term investment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, for investment horizons of 5+ years, SIP in equity mutual funds historically delivers significantly higher returns than RD. Nifty 50 has returned ~12% CAGR over 15+ years, while RD rates are typically 6-7.5%. SIP also has better tax treatment — LTCG at 12.5% above ₹1.25L vs RD interest taxed at your full slab rate. However, SIP has market risk and short-term volatility.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between SIP and RD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SIP (Systematic Investment Plan) invests a fixed amount monthly in mutual funds — your returns depend on market performance and are not guaranteed. RD (Recurring Deposit) is a bank product where you deposit monthly at a fixed interest rate with guaranteed returns. SIP has higher return potential but comes with market risk. RD is safe but typically gives lower real returns after tax and inflation.",
        },
      },
      {
        "@type": "Question",
        name: "How is SIP taxed compared to RD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SIP in equity mutual funds (held > 1 year): Long-term capital gains (LTCG) taxed at 12.5% only on gains exceeding ₹1.25 lakh per year. Short-term (< 1 year): 20% STCG. RD interest is added to your income and taxed at your slab rate (up to 30%). This makes SIP significantly more tax-efficient for high-income earners.",
        },
      },
      {
        "@type": "Question",
        name: "Can I lose money in SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, SIP in equity mutual funds can give negative returns in the short term (1-3 years) during market downturns. However, historically, no equity SIP in a diversified index fund has given negative returns over a 7+ year period in India. The key is patience — SIP works best with 5-10+ year horizons. For shorter periods, RD or debt funds are safer.",
        },
      },
      {
        "@type": "Question",
        name: "Should I do both SIP and RD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, a balanced approach is ideal. Keep your emergency fund (6 months of expenses) in RD or liquid funds for safety and instant access. Invest the rest via SIP in equity mutual funds for long-term wealth creation. Many financial planners recommend a 70:30 ratio — 70% in SIP for growth and 30% in RD/FD for stability.",
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            SIP vs RD Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare Mutual Fund SIP vs Recurring Deposit. See post-tax wealth
            creation, the power of compounding, tax efficiency, and risk levels
            over 1-30 years.
          </p>
        </div>

        <SIPvsRDCalculator />

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
            url="https://investingpro.in/calculators/sip-vs-rd"
            title="SIP vs RD — Which Creates More Wealth?"
          />
        </div>

        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investing",
              slug: "sip-vs-rd",
            }}
          />
        </div>

        <div className="mt-8">
          <PopularCalculators currentSlug="sip-vs-rd" variant="strip" />
        </div>

        <FinancialDisclaimer />
      </div>
    </>
  );
}
