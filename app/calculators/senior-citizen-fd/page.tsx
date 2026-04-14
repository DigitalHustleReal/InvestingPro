import React from "react";
import type { Metadata } from "next";
import { SeniorCitizenFDCalculator } from "@/components/calculators/SeniorCitizenFDCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Senior Citizen FD Calculator 2026 — Best FD Rates for 60+ | InvestingPro",
  description:
    "Free Senior Citizen FD calculator with bank-wise rate comparison. SBI, HDFC, ICICI, SFBs compared. Calculate monthly income, TDS, Section 80TTB benefit, and post-tax returns for retirees.",
  keywords:
    "senior citizen FD calculator, senior citizen FD rates 2026, best FD for senior citizens, senior citizen FD SBI, senior citizen FD interest rate, 80TTB exemption, senior FD monthly income",
  openGraph: {
    title: "Senior Citizen FD Calculator 2026 — Best Bank Rates Compared",
    description:
      "Calculate senior citizen FD returns with bank comparison. See monthly income, TDS, and 80TTB tax benefit.",
    url: "https://investingpro.in/calculators/senior-citizen-fd",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/senior-citizen-fd",
  },
};

export default function SeniorCitizenFDPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Senior Citizen FD Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/senior-citizen-fd",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What extra interest do senior citizens get on FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most banks offer 0.25% to 0.50% extra interest for senior citizens (60+ age) and sometimes 0.75% to 1% for super senior citizens (80+ age). For example, if SBI offers 7.0% for regular FD, senior citizens get 7.5%. Some Small Finance Banks offer up to 9% for senior citizens.",
        },
      },
      {
        "@type": "Question",
        name: "What is Section 80TTB for senior citizens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Section 80TTB allows senior citizens (60+) a deduction of up to ₹50,000 on interest income from bank FDs, post office deposits, and savings accounts. This means ₹50,000 interest is completely tax-free. Regular citizens only get ₹10,000 exemption under 80TTA (savings account interest only, not FD).",
        },
      },
      {
        "@type": "Question",
        name: "Which bank gives highest FD rate for senior citizens in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Small Finance Banks (SFBs) offer the highest rates: Unity SFB (8.5-9%), Suryoday SFB (8.25-8.75%), AU SFB (7.75-8%). Among major banks: Bajaj Finance (8.05-8.3%), HDFC Bank (7.0-7.5%), SBI (7.0-7.5%). Post Office SCSS (8.2%) is the highest government-backed option. Split deposits across banks to stay within ₹5L DICGC insurance per bank.",
        },
      },
      {
        "@type": "Question",
        name: "How to avoid TDS on senior citizen FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Submit Form 15H to your bank at the start of each financial year if your total income is below the taxable limit (₹3L for senior citizens under old regime, ₹7L under new regime). This prevents TDS deduction. Without Form 15H, banks deduct 10% TDS if interest exceeds ₹50,000/year. If TDS is already deducted, claim refund via ITR filing.",
        },
      },
      {
        "@type": "Question",
        name: "SCSS vs Bank FD — which is better for senior citizens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SCSS (Senior Citizen Savings Scheme) at 8.2% beats most bank FDs (6.5-7.5%). SCSS advantages: highest government-backed rate, Section 80C benefit, quarterly interest payout. SCSS disadvantages: ₹30L max limit, 5-year lock-in, only for 60+ (55+ for retired defense). Best strategy: invest ₹30L in SCSS first, remaining in high-rate SFB FDs.",
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
            Senior Citizen FD Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate FD returns with senior citizen extra rates. Compare SBI,
            HDFC, ICICI, SFBs side by side. See monthly income, TDS impact,
            Section 80TTB benefit, and inflation-adjusted real returns.
          </p>
        </div>
        <SeniorCitizenFDCalculator />
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
            url="https://investingpro.in/calculators/senior-citizen-fd"
            title="Senior Citizen FD Calculator — Best Bank Rates 2026"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "fixed-deposits",
              slug: "senior-citizen-fd",
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
