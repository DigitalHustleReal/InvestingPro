import React from "react";
import type { Metadata } from "next";
import { TDSCalculator } from "@/components/calculators/TDSCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "TDS Calculator India 2026 — Calculate Tax Deducted at Source | InvestingPro",
  description:
    "Free TDS calculator for all sections — salary (192), FD interest (194A), rent (194I), professional fees (194J), commission (194H), lottery (194B). Check TDS rate with and without PAN.",
  keywords:
    "TDS calculator, TDS on salary, TDS on FD interest, TDS on rent, Section 194A, Section 192, TDS rate chart 2026, Form 15G, TDS without PAN",
  openGraph: {
    title: "TDS Calculator India 2026 — All Sections",
    description:
      "Calculate TDS on salary, FD, rent, professional fees. With/without PAN rates. Form 15G/15H support.",
    url: "https://investingpro.in/calculators/tds",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/tds" },
};

export default function TDSCalculatorPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TDS Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Calculate Tax Deducted at Source (TDS) for salary, FD, rent, professional fees, commission, and lottery under various Income Tax Act sections.",
    url: "https://investingpro.in/calculators/tds",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is TDS and who deducts it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TDS (Tax Deducted at Source) is tax collected by the payer (employer, bank, tenant) before paying you. The deductor deposits this TDS with the government on your behalf. You can claim credit for TDS when filing your ITR. It appears in Form 26AS and AIS.",
        },
      },
      {
        "@type": "Question",
        name: "What is the TDS rate on FD interest in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TDS on FD interest (Section 194A) is 10% if you've submitted PAN, and 20% without PAN. No TDS if annual interest is below ₹40,000 (₹50,000 for senior citizens). You can avoid TDS entirely by submitting Form 15G (below 60) or Form 15H (senior citizen) if your total income is below taxable limit.",
        },
      },
      {
        "@type": "Question",
        name: "How to avoid TDS on FD interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three ways: (1) Submit Form 15G/15H to your bank at start of financial year if total income is below taxable limit. (2) Split FDs across multiple banks to stay below ₹40K threshold per bank. (3) Invest in tax-saving FD (5-year lock-in) which offers 80C deduction but TDS still applies on interest.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if TDS is deducted but I don't owe tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "File your Income Tax Return (ITR) and claim a refund. The excess TDS will be refunded to your bank account, usually within 1-3 months of processing. Check Form 26AS on TRACES to verify all TDS credits before filing.",
        },
      },
      {
        "@type": "Question",
        name: "What is the penalty for not deducting TDS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you fail to deduct TDS: interest at 1% per month from the date TDS was deductible. If deducted but not deposited: interest at 1.5% per month + penalty up to the TDS amount. Late filing of TDS return: ₹200 per day (max = TDS amount). Plus prosecution under Section 276B.",
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
            TDS Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Calculate Tax Deducted at Source for salary, FD interest, rent,
            professional fees, commission, and lottery winnings. Covers all
            major TDS sections with PAN/no-PAN rates.
          </p>
        </div>
        <TDSCalculator />
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
            url="https://investingpro.in/calculators/tds"
            title="TDS Calculator — Tax Deducted at Source for All Sections"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax",
              slug: "tds",
            }}
          />
        </div>
        <div className="mt-8">
          <div className="mt-8">
            <PopularCalculators currentSlug="tds" variant="strip" />
          </div>
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
