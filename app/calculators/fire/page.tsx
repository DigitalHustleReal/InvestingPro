import React from "react";
import type { Metadata } from "next";
import { FIRECalculator } from "@/components/calculators/FIRECalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "FIRE Calculator India 2026 — Financial Independence Retire Early | InvestingPro",
  description:
    "India-specific FIRE calculator. Calculate your FIRE number with Indian inflation (6%), safe withdrawal rate (3.5%), EPF, NPS, and SIP. See if you can retire at 40, 45, or 50. Accounts for healthcare costs.",
  keywords:
    "FIRE calculator India, financial independence retire early, FIRE number calculator, early retirement India, retire at 40, how much to retire India, FIRE movement India, retirement corpus calculator",
  openGraph: {
    title: "FIRE Calculator India 2026",
    description:
      "Can you retire at 40? Calculate your FIRE number with Indian inflation and investment returns.",
    url: "https://investingpro.in/calculators/fire",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/fire" },
};

export default function FIRECalculatorPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FIRE Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/fire",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the FIRE movement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FIRE (Financial Independence, Retire Early) is a lifestyle movement focused on aggressive saving and investing to retire decades before traditional age (60). The goal is to accumulate enough investments that passive income covers all expenses. In India, FIRE typically targets retirement at 40-50 with a corpus of 25-35x annual expenses.",
        },
      },
      {
        "@type": "Question",
        name: "What is a safe withdrawal rate for India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The global '4% rule' doesn't work well for India due to higher inflation (6% vs 2-3% in US). Indian FIRE planners recommend 3-3.5% withdrawal rate. This means you need 28-33x your annual expenses as corpus. Example: ₹6L annual expenses × 30 = ₹1.8 Cr FIRE number.",
        },
      },
      {
        "@type": "Question",
        name: "How much do I need to retire at 40 in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Assuming ₹50K/month expenses, 6% inflation, retiring at 40 and living till 85: you need approximately ₹4-5 Cr. This accounts for 45 years of inflation-adjusted withdrawals. With ₹1L/month expenses, you'd need ₹8-10 Cr. Start early — even ₹20K/month SIP from age 25 can build this corpus.",
        },
      },
      {
        "@type": "Question",
        name: "Does FIRE work in India with healthcare costs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Healthcare is the biggest risk for Indian FIRE. No employer insurance after retirement, and medical inflation runs 10-15% annually. Solution: (1) ₹1 Cr health insurance (super top-up costs ₹8-12K/year at 30), (2) Separate medical emergency fund of ₹20-30L, (3) Factor 10% annual healthcare inflation in your FIRE number.",
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
            FIRE Calculator — Retire Early India
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Can you retire at 40? Calculate your FIRE number with Indian
            inflation (6%), safe withdrawal rate (3.5%), and realistic
            post-retirement returns. See exactly how much SIP you need today.
          </p>
        </div>
        <FIRECalculator />
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
            url="https://investingpro.in/calculators/fire"
            title="FIRE Calculator — Can You Retire at 40 in India?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investing",
              slug: "fire",
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
