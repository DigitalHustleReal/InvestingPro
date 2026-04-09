import React from "react";
import type { Metadata } from "next";
import { RentVsBuyCalculator } from "@/components/calculators/RentVsBuyCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Rent vs Buy Calculator India 2026 — Should You Buy or Rent? | InvestingPro",
  description:
    "India's most comprehensive rent vs buy calculator. Includes stamp duty, maintenance, property appreciation, rent increase, and opportunity cost of investing. See which option builds more wealth over 5-25 years.",
  keywords:
    "rent vs buy calculator, rent or buy house India, rent vs buy comparison, should I buy house or rent, property investment calculator, rent vs EMI calculator, stamp duty calculator, house buying calculator India",
  openGraph: {
    title: "Rent vs Buy Calculator India 2026",
    description:
      "Buy a house or rent + invest? See which builds more wealth. India-specific with stamp duty.",
    url: "https://investingpro.in/calculators/rent-vs-buy",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/rent-vs-buy" },
};

export default function RentVsBuyPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rent vs Buy Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/rent-vs-buy",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is it better to rent or buy a house in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depends on 3 factors: (1) Price-to-rent ratio — if property costs more than 20x annual rent, renting is better. (2) How long you'll stay — buying makes sense only if you'll live there 7+ years. (3) Investment discipline — renting wins only if you actually invest the savings. In metros like Mumbai/Bangalore, renting often wins due to high property prices.",
        },
      },
      {
        "@type": "Question",
        name: "What is the hidden cost of buying a house in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stamp duty + registration: 7-8% of property value (₹5-6L on ₹80L flat). Maintenance: 1-2% of property value/year. Home loan interest: 80-120% of principal over 20 years. Property tax: ₹5-20K/year. Interior: ₹5-15L. Total hidden costs can be 100-150% of the property price.",
        },
      },
      {
        "@type": "Question",
        name: "How much should I earn to buy a house in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rule of thumb: property price should not exceed 5x your annual income. For ₹80L flat, you need ₹16L+ annual income. EMI should be under 40% of monthly take-home. With ₹1L/mo salary, max EMI should be ₹40K, which supports ~₹45-50L loan at 8.5% for 20 years.",
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
            Rent vs Buy Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            India&apos;s most honest rent vs buy analysis. Includes stamp duty
            (7%), maintenance (1%/year), property appreciation, rent escalation,
            and opportunity cost of investing the down payment. No bias — just
            math.
          </p>
        </div>
        <RentVsBuyCalculator />
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
            url="https://investingpro.in/calculators/rent-vs-buy"
            title="Rent vs Buy — Should You Buy or Rent in India?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "personal-finance",
              slug: "rent-vs-buy",
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
