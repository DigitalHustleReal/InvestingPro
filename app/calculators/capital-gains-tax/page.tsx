import React from "react";
import type { Metadata } from "next";
import { CapitalGainsTaxCalculator } from "@/components/calculators/CapitalGainsTaxCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Capital Gains Tax Calculator India 2026 — LTCG + STCG for Stocks, MF, Property | InvestingPro",
  description:
    "Free capital gains tax calculator for India. Calculate LTCG and STCG on stocks, mutual funds, property, and gold. Updated for July 2024 budget changes — 12.5% LTCG, ₹1.25L exemption.",
  keywords:
    "capital gains tax calculator India, LTCG calculator, STCG calculator, capital gains tax on shares, mutual fund tax calculator, property capital gains, gold capital gains tax, LTCG exemption 2026",
  openGraph: {
    title: "Capital Gains Tax Calculator India 2026 — All Asset Types",
    description:
      "Calculate LTCG/STCG tax on stocks, MF, property, gold. Updated for Budget 2024 changes.",
    url: "https://investingpro.in/calculators/capital-gains-tax",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/capital-gains-tax",
  },
};

export default function CapitalGainsTaxPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Capital Gains Tax Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/capital-gains-tax",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the LTCG tax rate on shares in India 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "From July 2024 budget: LTCG on listed equity shares and equity mutual funds is 12.5% (up from 10%) on gains above ₹1.25 lakh per financial year. STCG rate is 20% (up from 15%). The holding period for LTCG is 12 months. 4% health and education cess applies on the tax amount.",
        },
      },
      {
        "@type": "Question",
        name: "How to calculate capital gains tax on property?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Property LTCG (held >24 months): Flat 12.5% tax without indexation (Budget July 2024 change — indexation benefit removed). STCG (<24 months): Taxed at your income tax slab rate. You can save property LTCG tax via Section 54 (buy new house within 2 years) or Section 54EC (invest up to ₹50L in specified bonds like NHAI/REC).",
        },
      },
      {
        "@type": "Question",
        name: "Is there any exemption on capital gains tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For equity/equity MF: ₹1.25 lakh LTCG per year is tax-free. For property: Section 54 (new house), Section 54EC (bonds). For all assets: Section 54F (reinvest in residential house). You can also offset current year capital losses against gains, and carry forward equity losses for 8 years.",
        },
      },
      {
        "@type": "Question",
        name: "How are debt mutual fund gains taxed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Since April 2023, debt mutual fund gains are taxed at your income tax slab rate regardless of holding period. There is no LTCG benefit or indexation for debt funds. This makes FDs and debt MFs comparable from a tax perspective. Only funds with 65%+ equity allocation get the favorable equity taxation.",
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
            Capital Gains Tax Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate LTCG and STCG tax on stocks, mutual funds, property, and
            gold. Updated for July 2024 budget — 12.5% LTCG rate, ₹1.25L
            exemption, no indexation on property. See tax-saving tips and
            exemptions.
          </p>
        </div>
        <CapitalGainsTaxCalculator />
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
            url="https://investingpro.in/calculators/capital-gains-tax"
            title="Capital Gains Tax Calculator India — LTCG + STCG"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax",
              slug: "capital-gains-tax",
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
