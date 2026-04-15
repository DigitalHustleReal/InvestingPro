import React from "react";
import type { Metadata } from "next";
import { OldVsNewTaxCalculator } from "@/components/calculators/OldVsNewTaxCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Old vs New Tax Regime Calculator 2026 — Which Saves More Tax? | InvestingPro",
  description:
    "Free old vs new tax regime comparison calculator. Enter income and deductions — see which regime saves you more tax. Updated for FY 2025-26 with ₹12L rebate, ₹75K standard deduction, and side-by-side slab comparison.",
  keywords:
    "old vs new tax regime calculator, old regime vs new regime, income tax calculator India 2026, tax regime comparison, which tax regime is better, old tax regime calculator, new tax regime calculator, section 80C tax saving",
  openGraph: {
    title: "Old vs New Tax Regime Calculator 2026 — Side-by-Side Comparison",
    description:
      "Enter income and deductions to see which tax regime saves you more. Updated for FY 2025-26.",
    url: "https://investingpro.in/calculators/old-vs-new-tax",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/old-vs-new-tax",
  },
};

export default function OldVsNewTaxPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Old vs New Tax Regime Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/old-vs-new-tax",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which is better — Old or New Tax Regime in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your deductions. If your total deductions (80C + HRA + 80D + home loan + NPS) exceed ₹3.75-4 lakh, the Old Regime is usually better. If deductions are less, the New Regime wins due to lower slab rates and ₹12L rebate. Salaried individuals with home loans and HRA often benefit from Old Regime. Others should switch to New.",
        },
      },
      {
        "@type": "Question",
        name: "What is the standard deduction in new tax regime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In the New Tax Regime (FY 2025-26), standard deduction is ₹75,000 (increased from ₹50,000 in Budget 2024). In the Old Regime, it remains ₹50,000. The New Regime also offers a rebate making income up to ₹12 lakh effectively tax-free (after standard deduction of ₹75K, taxable income up to ₹12L gets full rebate).",
        },
      },
      {
        "@type": "Question",
        name: "Can I switch between Old and New tax regime every year?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Salaried employees: Yes, you can switch between Old and New regime every financial year when filing ITR. Business/professional income: You can switch only once — if you opt for Old Regime after being in New, you cannot switch back. No prior intimation to employer is needed for switching; choose at ITR filing time.",
        },
      },
      {
        "@type": "Question",
        name: "What deductions are NOT available in New Tax Regime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New Regime does NOT allow: Section 80C (₹1.5L — PF, ELSS, PPF, LIC), HRA exemption, Section 80D (health insurance premium), Home loan interest under Section 24 (₹2L), Section 80E (education loan interest), LTA, 80CCD (NPS extra ₹50K), 80TTA/80TTB (savings interest). Only standard deduction of ₹75K and employer NPS contribution (Sec 80CCD(2)) are available.",
        },
      },
      {
        "@type": "Question",
        name: "Is New Tax Regime default from FY 2023-24?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, New Tax Regime is the default since FY 2023-24 (AY 2024-25). If you don't explicitly opt for Old Regime, New Regime applies automatically. To choose Old Regime, you must select it when filing ITR. For salaried employees, you can inform your employer for TDS deduction under Old Regime, but final choice is made at ITR filing.",
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
            Old vs New Tax Regime Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare Old and New income tax regimes side by side. Enter your
            income and deductions to see which saves you more tax. Updated for
            FY 2025-26 with ₹12L rebate and ₹75K standard deduction.
          </p>
        </div>
        <OldVsNewTaxCalculator />
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
            url="https://investingpro.in/calculators/old-vs-new-tax"
            title="Old vs New Tax Regime Calculator — Which Saves More?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax",
              slug: "old-vs-new-tax",
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
