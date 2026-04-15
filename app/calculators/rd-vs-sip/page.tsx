import React from "react";
import type { Metadata } from "next";
import { RDvsSIPCalculator } from "@/components/calculators/RDvsSIPCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "RD vs SIP Calculator 2026 — Which Gives Better Returns? | InvestingPro",
  description:
    "Free RD vs SIP comparison calculator. Compare Recurring Deposit (quarterly compounding) with Equity SIP (monthly compounding). See post-tax returns, effective rate, and which is better for your goals. Indian tax rules applied.",
  keywords:
    "rd vs sip calculator, recurring deposit vs sip, rd or sip which is better, sip vs rd returns, rd vs mutual fund, rd interest rate 2026, sip returns calculator India, post office rd vs sip",
  openGraph: {
    title: "RD vs SIP Calculator 2026 — Recurring Deposit vs Equity SIP",
    description:
      "Compare RD and SIP side by side with post-tax returns, effective CAGR, and risk analysis. Updated for Indian tax rules.",
    url: "https://investingpro.in/calculators/rd-vs-sip",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/rd-vs-sip",
  },
};

export default function RDvsSIPPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RD vs SIP Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/rd-vs-sip",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which is better — RD or SIP for long-term investment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For long-term goals (5+ years), SIP in equity mutual funds historically gives 12-15% CAGR, far outperforming RD rates of 6-7.5%. SIP also has better tax treatment — LTCG of 12.5% above Rs 1.25L vs RD interest taxed at full slab rate (up to 30%). However, RD is risk-free and guaranteed, making it suitable for short-term goals (1-3 years) and emergency funds.",
        },
      },
      {
        "@type": "Question",
        name: "How is RD interest calculated in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RD interest is compounded quarterly in India. Each monthly installment earns interest from its deposit date to maturity. Banks use the quarterly compounding formula: A = P(1 + r/4)^(4n). RD interest is fully taxable at your income tax slab rate, and TDS is deducted if annual interest exceeds Rs 40,000 (Rs 50,000 for senior citizens).",
        },
      },
      {
        "@type": "Question",
        name: "Is SIP tax-free in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SIP in equity mutual funds is not entirely tax-free. Short-term capital gains (held < 1 year) are taxed at 20%. Long-term capital gains (held > 1 year) above Rs 1.25 lakh per year are taxed at 12.5%. Gains up to Rs 1.25 lakh per year are completely tax-free. This makes SIP significantly more tax-efficient than RD where interest is taxed at full slab rate.",
        },
      },
      {
        "@type": "Question",
        name: "Can I withdraw RD before maturity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can break an RD before maturity, but banks charge a penalty of 0.5-1% on the applicable interest rate. Some banks may also reduce the interest rate to the rate applicable for the actual tenure. In contrast, SIP in mutual funds can be redeemed anytime (T+2 settlement for equity funds) without any penalty, though exit load may apply within 1 year.",
        },
      },
      {
        "@type": "Question",
        name: "What is the current RD interest rate in India (2026)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, major banks offer RD rates between 6.5-7.5% for general citizens and 7-8% for senior citizens. Small finance banks and post office RD may offer up to 7.5-8.5%. Post Office RD rate is currently 6.7% (revised quarterly by government). Compare this with equity SIP historical returns of 12-15% CAGR over 10+ years.",
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
            RD vs SIP Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare Recurring Deposit and Equity SIP side by side. See post-tax
            maturity value, effective CAGR, tax impact, and risk level. RD uses
            quarterly compounding; SIP uses monthly compounding with LTCG tax
            rules.
          </p>
        </div>
        <RDvsSIPCalculator />
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
            url="https://investingpro.in/calculators/rd-vs-sip"
            title="RD vs SIP Calculator — Which Gives Better Returns?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investment",
              slug: "rd-vs-sip",
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
