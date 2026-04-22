import React from "react";
import type { Metadata } from "next";
import { DirectVsRegularMFCalculator } from "@/components/calculators/DirectVsRegularMFCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Direct vs Regular Mutual Fund Calculator 2026 — Expense Ratio Impact | InvestingPro",
  description:
    "Compare direct and regular mutual fund plans. See how expense ratio difference compounds over 10-30 years. Calculate the real cost of regular plans and how much more you earn with direct funds.",
  keywords:
    "direct vs regular mutual fund calculator, direct plan vs regular plan, expense ratio impact calculator, mutual fund expense ratio comparison, direct mutual fund savings, regular plan commission cost, mutual fund comparison India 2026",
  openGraph: {
    title:
      "Direct vs Regular Mutual Fund Calculator 2026 — Expense Ratio Impact",
    description:
      "Compare direct and regular mutual fund plans. See how expense ratio difference compounds over 10-30 years.",
    url: "https://investingpro.in/calculators/direct-vs-regular-mf",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/direct-vs-regular-mf",
  },
};

export default function DirectVsRegularMFPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Direct vs Regular Mutual Fund Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/direct-vs-regular-mf",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between direct and regular mutual fund plans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Direct plans are purchased directly from the AMC (e.g., via AMC website, Kuvera, Zerodha Coin) without any distributor or broker. Regular plans are sold through intermediaries like banks, MF distributors, or apps like Groww (regular option). The key difference is the expense ratio — regular plans include a distributor commission (trail commission of 0.5%–1.5%), making them more expensive. Both plans invest in the same portfolio with the same fund manager. Direct plans always have a higher NAV because less money is deducted as expenses.",
        },
      },
      {
        "@type": "Question",
        name: "How much more do you earn with direct mutual fund plans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The difference depends on the expense ratio gap and investment horizon. For a typical equity fund with a 0.5%–1% expense ratio difference, a ₹10 lakh investment over 20 years can result in ₹3–8 lakh more in direct plans. For example, at 12% return with 0.7% expense difference, ₹10 lakh becomes ~₹96.5 lakh (direct) vs ~₹85.7 lakh (regular) over 20 years — a difference of ₹10.8 lakh. The gap widens dramatically over longer periods due to compounding.",
        },
      },
      {
        "@type": "Question",
        name: "How do I switch from regular to direct mutual fund plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can switch from regular to direct by submitting a switch request through your AMC's website, app, or by visiting a CAMS/KFintech office. The process involves redeeming units from the regular plan and reinvesting in the direct plan of the same scheme. Note: This is treated as a redemption and fresh purchase for tax purposes — short-term or long-term capital gains tax applies based on your holding period. For equity funds held over 1 year, LTCG above ₹1.25 lakh is taxed at 12.5% (Budget 2024 rates). Plan the switch to minimize tax impact.",
        },
      },
      {
        "@type": "Question",
        name: "Who should choose direct mutual fund plans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Direct plans are ideal for investors who can select funds themselves using research tools, understand asset allocation and rebalancing, are comfortable using platforms like Kuvera, MF Central, or AMC websites, and want to maximize returns by eliminating distributor commissions. If you need hand-holding, portfolio reviews, or don't want to research funds, a good fee-only financial advisor (who charges a flat fee, not commission) is better than regular plans. Regular plans through banks are the most expensive option — banks earn 1%+ trail commission annually.",
        },
      },
      {
        "@type": "Question",
        name: "What is the typical expense ratio difference between direct and regular plans in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The expense ratio difference varies by fund category. For large-cap equity funds, the gap is typically 0.5%–0.8% (e.g., direct 0.5% vs regular 1.2%). For mid/small-cap funds, it can be 0.7%–1.5%. For debt funds, the gap is smaller at 0.2%–0.5%. Index funds have the smallest gap (0.1%–0.3%) since overall expenses are already low. SEBI's TER (Total Expense Ratio) slabs cap the maximum expense ratio based on AUM — larger funds must charge less. Always check the fund factsheet on AMFI or Value Research for exact figures.",
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
            Direct vs Regular Mutual Fund Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Compare direct and regular mutual fund plans side by side. See how
            the expense ratio difference compounds over 10-30 years and
            calculate how much more you earn with direct plans.
          </p>
        </div>
        <DirectVsRegularMFCalculator />
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
            url="https://investingpro.in/calculators/direct-vs-regular-mf"
            title="Direct vs Regular Mutual Fund Calculator — Expense Ratio Impact"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "mutual-funds",
              slug: "direct-vs-regular-mf",
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
