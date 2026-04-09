import React from "react";
import type { Metadata } from "next";
import { GratuityCalculator } from "@/components/calculators/GratuityCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Gratuity Calculator India 2026 — Calculate Gratuity Online | InvestingPro",
  description:
    "Free gratuity calculator for Indian employees. Calculate gratuity under Payment of Gratuity Act 1972 for private sector and government employees. Includes tax treatment and year-wise breakdown.",
  keywords:
    "gratuity calculator, gratuity calculation formula, gratuity calculator India, gratuity act 1972, gratuity for private employee, gratuity for govt employee, gratuity tax exemption",
  openGraph: {
    title: "Gratuity Calculator India 2026 — Payment of Gratuity Act",
    description:
      "Calculate your gratuity amount using the official formula. Private sector (÷26) and government (÷30) formulas. Tax-free up to ₹25 lakh.",
    url: "https://investingpro.in/calculators/gratuity",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gratuity Calculator India 2026",
    description:
      "Calculate gratuity under Payment of Gratuity Act. Private & govt formulas.",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/gratuity",
  },
};

export default function GratuityCalculatorPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gratuity Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Calculate gratuity under Payment of Gratuity Act 1972 for private and government employees in India.",
    url: "https://investingpro.in/calculators/gratuity",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the gratuity formula for private employees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gratuity = (15 × Last Drawn Salary × Years of Service) / 26. Here, Last Drawn Salary = Basic Pay + Dearness Allowance. The divisor 26 represents working days in a month. Minimum 5 years of continuous service is required.",
        },
      },
      {
        "@type": "Question",
        name: "What is the maximum gratuity limit in India 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The maximum gratuity limit is ₹25,00,000 (₹25 lakh) as per the Payment of Gratuity (Amendment) Act, 2018. Any amount exceeding this is taxable. This applies to both private and government employees.",
        },
      },
      {
        "@type": "Question",
        name: "Is gratuity taxable in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For government employees, gratuity is fully exempt from tax up to ₹25 lakh. For private employees covered under the Gratuity Act, the least of these is exempt: actual gratuity, ₹25 lakh, or the formula amount (15/26 × salary × years). Any excess is taxable at your slab rate.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get gratuity before 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Generally no — the Payment of Gratuity Act requires a minimum of 5 years of continuous service. However, gratuity can be paid before 5 years in case of death or disability of the employee. Some companies may also offer ex-gratia payments at their discretion.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between gratuity formula for private vs government?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Private sector uses 26 as the divisor (working days per month): Gratuity = 15 × Salary × Years / 26. Government sector uses 30 as the divisor (calendar days): Gratuity = 15 × Salary × Years / 30. This means private sector employees get slightly higher gratuity for the same salary and tenure.",
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
            Gratuity Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your gratuity under the Payment of Gratuity Act, 1972.
            Supports both private sector (÷26) and government (÷30) formulas.
            Tax-free up to ₹25 lakh.
          </p>
        </div>

        <GratuityCalculator />

        {/* FAQ */}
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
            url="https://investingpro.in/calculators/gratuity"
            title="Gratuity Calculator - Calculate Your Gratuity Amount"
          />
        </div>

        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "personal-finance",
              slug: "gratuity",
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
