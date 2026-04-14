import React from "react";
import type { Metadata } from "next";
import { NRITaxCalculator } from "@/components/calculators/NRITaxCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "NRI Tax Calculator India 2026 — DTAA + NRE/NRO + TDS Refund | InvestingPro",
  description:
    "Free NRI tax calculator for India income. Calculate tax on rental income, FD interest, capital gains with DTAA benefit. NRE interest tax-free. Check residential status, TDS refund eligibility.",
  keywords:
    "NRI tax calculator India, NRI income tax 2026, DTAA calculator, NRE NRO tax, NRI rental income tax, NRI capital gains tax India, NRI TDS refund, NRI residential status calculator",
  openGraph: {
    title: "NRI Tax Calculator India 2026",
    description:
      "Calculate NRI tax on India income with DTAA benefit, NRE/NRO interest, and TDS refund eligibility.",
    url: "https://investingpro.in/calculators/nri-tax",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/nri-tax" },
};

export default function NRITaxPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NRI Tax Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/nri-tax",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is NRE FD interest taxable in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, NRE (Non-Resident External) FD interest is completely tax-free in India for NRIs. This is one of the biggest tax advantages for NRIs. However, if your residential status changes to Resident (182+ days in India), NRE interest becomes taxable. NRO FD interest is always taxable at 30% with TDS.",
        },
      },
      {
        "@type": "Question",
        name: "How many days can an NRI stay in India without becoming Resident?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An NRI must stay less than 182 days in India during a financial year (April-March) to maintain NRI status. If you stay 182 days or more, you become a Resident and all your global income may become taxable in India. There's also a 60-day rule for Indian citizens — if you've been in India for 365+ days in the preceding 4 years, the limit is 60 days instead of 182.",
        },
      },
      {
        "@type": "Question",
        name: "What is DTAA and how does it help NRIs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DTAA (Double Taxation Avoidance Agreement) is a treaty between India and 90+ countries to prevent the same income from being taxed twice. For example, if India taxes FD interest at 30% but DTAA with USA caps it at 15%, you pay only 15%. To claim DTAA benefit, you need a Tax Residency Certificate (TRC) from your country of residence.",
        },
      },
      {
        "@type": "Question",
        name: "What is the TDS rate for NRIs on different incomes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NRI TDS rates are higher than resident rates: FD/NRO interest at 30% (plus surcharge and cess = ~31.2%), rental income at 30%, long-term capital gains on property at 20% (with indexation), short-term capital gains at 30%. NRIs should file ITR even if TDS is deducted to claim refunds if actual tax is lower.",
        },
      },
      {
        "@type": "Question",
        name: "Do NRIs need to file income tax return in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NRIs must file ITR in India if their total India income exceeds ₹2.5 lakh (basic exemption limit). Even if income is below this limit, filing is recommended to claim TDS refunds — banks deduct 30% TDS on NRO/FD interest, which may be more than actual tax liability. Filing also helps in claiming DTAA benefits.",
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
            NRI Tax Calculator India
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your India income tax as an NRI. Check residential status,
            DTAA benefit for your country, NRE/NRO interest taxation, TDS
            deducted vs actual liability, and refund eligibility.
          </p>
        </div>
        <NRITaxCalculator />
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
            url="https://investingpro.in/calculators/nri-tax"
            title="NRI Tax Calculator India — DTAA + NRE/NRO + TDS Refund"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax",
              slug: "nri-tax",
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
