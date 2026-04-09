import React from "react";
import type { Metadata } from "next";
import { HRACalculator } from "@/components/calculators/HRACalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "HRA Exemption Calculator India 2026 — Calculate Tax-Free HRA | InvestingPro",
  description:
    "Free HRA exemption calculator for salaried employees in India. Calculate tax-free HRA under Section 10(13A) with three-rule comparison. Metro vs non-metro, rent receipts, tax savings breakdown.",
  keywords:
    "HRA calculator, HRA exemption calculator, house rent allowance calculator, HRA tax exemption, Section 10(13A), HRA calculation formula, HRA for metro city, rent receipt tax benefit",
  openGraph: {
    title: "HRA Exemption Calculator India 2026",
    description:
      "Calculate your HRA tax exemption. Three-rule comparison with optimization tips. Metro vs non-metro.",
    url: "https://investingpro.in/calculators/hra",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/hra" },
};

export default function HRACalculatorPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "HRA Exemption Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Calculate House Rent Allowance (HRA) tax exemption under Section 10(13A) for salaried employees in India.",
    url: "https://investingpro.in/calculators/hra",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is HRA exemption calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HRA exemption is the MINIMUM of three values: (1) Actual HRA received from employer, (2) 50% of Basic+DA for metro cities or 40% for non-metro, (3) Actual rent paid minus 10% of Basic+DA. The lowest of these three is your tax-exempt HRA under Section 10(13A).",
        },
      },
      {
        "@type": "Question",
        name: "Which cities are considered metro for HRA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only 4 cities qualify as metro for HRA exemption: Delhi (NCR), Mumbai, Chennai, and Kolkata. Employees in these cities get 50% of Basic+DA as the Rule 2 calculation. All other Indian cities (including Bangalore, Hyderabad, Pune) are classified as non-metro and get 40%.",
        },
      },
      {
        "@type": "Question",
        name: "Can I claim HRA if I live in my own house?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. HRA exemption requires you to actually pay rent and live in a rented accommodation. If you own the house you live in, you cannot claim HRA. However, you can claim HRA if you live in a rented house in one city while owning property in another city.",
        },
      },
      {
        "@type": "Question",
        name: "Is HRA available in the new tax regime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. HRA exemption under Section 10(13A) is NOT available in the new tax regime (Section 115BAC). If you choose the new regime, your entire HRA becomes taxable. Compare both regimes before deciding — use our Old vs New Tax Regime calculator.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need rent receipts for HRA claim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rent receipts are mandatory if annual rent exceeds ₹1,00,000. For rent above ₹1,00,000/month, you must also provide the landlord's PAN. Revenue stamps on receipts are recommended but not legally required. Keep lease agreement as supporting document.",
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
            HRA Exemption Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your tax-exempt House Rent Allowance under Section
            10(13A). Compare the three-rule formula and see exactly how much tax
            you save. Metro vs non-metro rates.
          </p>
        </div>

        <HRACalculator />

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
            url="https://investingpro.in/calculators/hra"
            title="HRA Exemption Calculator - Calculate Your Tax-Free HRA"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax",
              slug: "hra",
            }}
          />
        </div>
        <div className="mt-8">
          <div className="mt-8">
            <PopularCalculators currentSlug="hra" variant="strip" />
          </div>
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
