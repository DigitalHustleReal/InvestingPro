import React from "react";
import type { Metadata } from "next";
import { ELSSCalculator } from "@/components/calculators/ELSSCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "ELSS Calculator India 2026 — Tax Saving Mutual Fund + 80C Benefit | InvestingPro",
  description:
    "Free ELSS (Tax Saving Mutual Fund) calculator. Calculate Section 80C tax savings, compare ELSS vs PPF vs Tax FD, see effective returns after tax benefit. Old vs New regime comparison.",
  keywords:
    "ELSS calculator, ELSS tax saving calculator, tax saving mutual fund calculator, Section 80C calculator, ELSS vs PPF, ELSS returns calculator, best ELSS fund India 2026, tax saving investment",
  openGraph: {
    title: "ELSS Calculator India 2026 — 80C Tax Savings + Returns",
    description:
      "Calculate ELSS mutual fund returns with 80C tax benefit. Compare ELSS vs PPF vs Tax-Saving FD.",
    url: "https://investingpro.in/calculators/elss",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/elss" },
};

export default function ELSSPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ELSS Tax Saving Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/elss",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is ELSS and how does it save tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ELSS (Equity Linked Savings Scheme) is a type of mutual fund that invests at least 80% in equities. It qualifies for Section 80C tax deduction up to ₹1.5 lakh per year under the Old Tax Regime. With a 30% tax slab, investing ₹1.5L in ELSS saves ₹46,800 in tax. ELSS has the shortest lock-in period (3 years) among all 80C options.",
        },
      },
      {
        "@type": "Question",
        name: "Is ELSS better than PPF for tax saving?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ELSS offers higher potential returns (12-16% CAGR historically) vs PPF (7.1%). ELSS has only 3-year lock-in vs PPF's 15 years. However, PPF returns are guaranteed and completely tax-free (EEE status), while ELSS returns are market-linked and LTCG above ₹1.25L is taxed at 12.5%. For long-term, ELSS typically gives 2-3x more wealth despite being taxed.",
        },
      },
      {
        "@type": "Question",
        name: "Does ELSS work under the New Tax Regime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, Section 80C deduction is NOT available under the New Tax Regime (introduced in Budget 2020, made default in 2023). If you're on the new regime, ELSS gives no tax benefit. However, ELSS is still a good equity investment due to its 3-year forced SIP discipline. If you invest ₹1.5L+ in 80C, the old regime may still be better for you.",
        },
      },
      {
        "@type": "Question",
        name: "What is the lock-in period for ELSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ELSS has a 3-year lock-in from date of each SIP installment (not from the first investment). Each monthly SIP has its own 3-year lock-in. After 3 years, units can be redeemed freely. This is the shortest lock-in among all Section 80C investments — PPF is 15 years, Tax FD is 5 years, NSC is 5 years.",
        },
      },
      {
        "@type": "Question",
        name: "How much should I invest in ELSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Maximum ₹1.5 lakh per year (Section 80C limit). As SIP: ₹12,500/month. If you already have EPF (employer PF), that counts toward 80C too — check your remaining 80C room. For example, if employer EPF is ₹1.8L/year, you've already exceeded 80C and ELSS tax benefit is zero. Invest in ELSS for equity exposure, not tax saving in that case.",
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
            ELSS Calculator (Tax Saving Mutual Fund)
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate ELSS mutual fund returns with Section 80C tax savings.
            Compare ELSS vs PPF vs Tax-Saving FD. See how much tax you save
            under Old vs New regime and your effective post-tax returns.
          </p>
        </div>
        <ELSSCalculator />
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
            url="https://investingpro.in/calculators/elss"
            title="ELSS Calculator — Tax Saving Mutual Fund Returns"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax-saving",
              slug: "elss",
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
