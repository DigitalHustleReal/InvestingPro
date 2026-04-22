import React from "react";
import type { Metadata } from "next";
import { DividendYieldCalculator } from "@/components/calculators/DividendYieldCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Dividend Yield Calculator India 2026 — Calculate Yield, Income & Compare with FD | InvestingPro",
  description:
    "Free dividend yield calculator for Indian stocks. Calculate dividend yield %, total income, yield on cost with growth, and compare with FD post-tax returns. Supports blue chips, high-yield stocks, REITs & InvITs.",
  keywords:
    "dividend yield calculator, dividend calculator India, dividend income calculator, yield on cost calculator, dividend vs FD, REIT dividend yield, ITC dividend, Coal India dividend, dividend growth calculator",
  openGraph: {
    title: "Dividend Yield Calculator India 2026",
    description:
      "Calculate dividend yield, total income & compare with FD returns for Indian stocks.",
    url: "https://investingpro.in/calculators/dividend-yield",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/dividend-yield",
  },
};

export default function DividendYieldPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Dividend Yield Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/dividend-yield",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a good dividend yield for Indian stocks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For Indian stocks, 2-3% is typical for blue chips (ITC, Infosys). 4-6% is considered high yield (Coal India, Power Grid, ONGC). Above 7% is exceptional and found in REITs like Embassy REIT or InvITs like IndiGrid. Always verify sustainability — very high yields can signal the stock price has fallen sharply.",
        },
      },
      {
        "@type": "Question",
        name: "How is dividend yield calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dividend Yield = (Annual Dividend Per Share / Current Stock Price) × 100. For example, if a stock trades at ₹500 and pays ₹15 annual dividend, the yield is 3%. This is the current yield — yield on cost can be much higher if you bought the stock years ago at a lower price.",
        },
      },
      {
        "@type": "Question",
        name: "Are dividends taxable in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, since April 2020, dividends are taxable in the hands of the investor at their income tax slab rate. A 10% TDS is deducted if annual dividends exceed ₹5,000 from a single company. For high-income investors (30% bracket), the effective dividend return drops significantly vs tax-free options like ELSS or PPF.",
        },
      },
      {
        "@type": "Question",
        name: "Is dividend investing better than FD in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your risk appetite. FDs give guaranteed 7-7.5% pre-tax (4.9-5.25% post-tax for 30% bracket). Dividend stocks give 2-6% yield PLUS potential capital appreciation of 10-12% (Nifty long-term). However, dividends can be cut and stock prices can fall. For retirees wanting certainty, FDs are safer. For long-term investors, dividend growth stocks outperform.",
        },
      },
      {
        "@type": "Question",
        name: "What is yield on cost and why does it matter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yield on cost = (Current Annual Dividend / Original Purchase Price) × 100. If you bought a stock at ₹200 that now pays ₹20 dividend, your yield on cost is 10% even if the current yield (based on today's price of ₹500) is only 4%. This is why buying quality dividend growers early and holding long creates excellent income streams.",
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
          <h1 className="font-display font-black text-[32px] sm:text-[40px] text-ink tracking-tight leading-[1.1]">
            Dividend Yield Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Calculate dividend yield, total income over time, and yield on cost
            with dividend growth. Compare your dividend stocks with FD post-tax
            returns to see which generates better income.
          </p>
        </div>
        <DividendYieldCalculator />
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
            url="https://investingpro.in/calculators/dividend-yield"
            title="Dividend Yield Calculator — Compare Stocks vs FD"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "demat-accounts",
              slug: "dividend-yield",
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
