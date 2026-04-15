import React from "react";
import type { Metadata } from "next";
import { POFDvsBankFDCalculator } from "@/components/calculators/POFDvsBankFDCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "Post Office FD vs Bank FD Calculator 2026 — Which Is Safer & Better? | InvestingPro",
  description:
    "Compare Post Office FD vs Bank FD side-by-side. Sovereign guarantee vs DICGC, post-tax returns, 80C eligibility, senior citizen benefits. Find the best FD for your money.",
  keywords:
    "post office FD vs bank FD, PO FD calculator, post office fixed deposit rate 2026, bank FD vs post office FD comparison, sovereign guarantee FD, DICGC limit, 80C tax saving FD, senior citizen FD rates",
  openGraph: {
    title: "Post Office FD vs Bank FD Calculator 2026",
    description:
      "Sovereign guarantee vs DICGC. Compare post-tax returns, safety, and 80C benefits.",
    url: "https://investingpro.in/calculators/po-fd-vs-bank-fd",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/po-fd-vs-bank-fd",
  },
};

export default function POFDvsBankFDPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Post Office FD vs Bank FD Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/po-fd-vs-bank-fd",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Post Office FD safer than Bank FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Post Office FD has sovereign guarantee from the Government of India — your entire deposit is 100% safe regardless of amount. Bank FDs are covered by DICGC insurance only up to ₹5 lakh per bank per depositor. For amounts above ₹5 lakh, Post Office FD is significantly safer.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Post Office FD interest rate in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of April 2026, Post Office Time Deposit rates are: 1 year — 6.9%, 2 years — 7.0%, 3 years — 7.1%, 5 years — 7.5%. The 5-year PO FD also qualifies for Section 80C tax deduction up to ₹1.5 lakh. Rates are reviewed quarterly by the government.",
        },
      },
      {
        "@type": "Question",
        name: "Is TDS deducted on Post Office FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, from April 2023, TDS is deducted on Post Office FD interest if it exceeds ₹40,000 per year (₹50,000 for senior citizens). Earlier, PO deposits were exempt from TDS. You can submit Form 15G/15H to avoid TDS if your total income is below the taxable limit.",
        },
      },
      {
        "@type": "Question",
        name: "Do senior citizens get extra interest on Post Office FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, Post Office FDs do not offer additional interest for senior citizens — rates are the same for all age groups. However, most banks offer 0.25% to 0.75% extra for senior citizens. For seniors, SCSS (Senior Citizens Savings Scheme) at post office offers 8.2% and is often a better choice than PO FD.",
        },
      },
      {
        "@type": "Question",
        name: "Can I break Post Office FD before maturity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Post Office FD cannot be broken within 6 months. After 6 months but before 1 year, you get the Post Office Savings Account rate (4%). After 1 year, you can withdraw with a 1-2% penalty on interest. Bank FDs generally have more flexible premature withdrawal — typically 0.5-1% penalty.",
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
            Post Office FD vs Bank FD Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare sovereign-backed Post Office FD with Bank FD. See post-tax
            returns, safety ratings, 80C eligibility, and senior citizen
            benefits side-by-side.
          </p>
        </div>

        <POFDvsBankFDCalculator />

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
            url="https://investingpro.in/calculators/po-fd-vs-bank-fd"
            title="Post Office FD vs Bank FD — Which Is Safer & Better?"
          />
        </div>

        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "fixed-deposits",
              slug: "po-fd-vs-bank-fd",
            }}
          />
        </div>

        <div className="mt-8">
          <PopularCalculators currentSlug="po-fd-vs-bank-fd" variant="strip" />
        </div>

        <FinancialDisclaimer />
      </div>
    </>
  );
}
