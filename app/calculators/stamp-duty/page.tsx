import React from "react";
import type { Metadata } from "next";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Stamp Duty Calculator India 2026 — State-Wise Rates + Women Discount | InvestingPro",
  description:
    "Free stamp duty and registration charges calculator for all Indian states. Compare male vs female rates, see women's discount, and calculate total property registration cost with legal fees.",
  keywords:
    "stamp duty calculator, stamp duty calculator India, registration charges India, stamp duty Maharashtra, stamp duty Karnataka, stamp duty Delhi, property registration cost, stamp duty for women",
  openGraph: {
    title: "Stamp Duty Calculator India 2026 — All 18 States",
    description:
      "Calculate stamp duty + registration charges for any Indian state. Women get lower rates in 8 states.",
    url: "https://investingpro.in/calculators/stamp-duty",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/stamp-duty" },
};

export default function StampDutyPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Stamp Duty Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/stamp-duty",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is stamp duty on property in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stamp duty is a state government tax paid when registering a property. Rates vary by state (3.5% to 8%), owner's gender, property type, and location. It's calculated on the higher of agreement value or circle rate (government ready reckoner rate). Stamp duty + registration together cost 5-10% of property value.",
        },
      },
      {
        "@type": "Question",
        name: "Do women pay less stamp duty in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, several states offer lower stamp duty for women. Delhi: 4% for women vs 6% for men (saves 2%). Haryana: 5% vs 7%. Rajasthan: 5% vs 6%. Uttarakhand: 3.75% vs 5%. Maharashtra offers 1% concession for women buyers in Mumbai/Pune. Registering in wife's name can save ₹50,000-₹5,00,000 depending on property value.",
        },
      },
      {
        "@type": "Question",
        name: "Which state has the lowest stamp duty in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Goa has the lowest stamp duty at 3.5% for all genders. Next lowest: Gujarat at 4.9%, Jharkhand at 4%, and Uttarakhand at 3.75% for women. Kerala has the highest at 8% + 2% registration. Maharashtra, UP, and Tamil Nadu are among the most expensive at 6-7%.",
        },
      },
      {
        "@type": "Question",
        name: "Is stamp duty included in home loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, stamp duty and registration charges are NOT included in the home loan amount. Banks finance up to 80% of property value, but stamp duty (5-8%) and registration (1-2%) must be paid from your own funds. On a ₹50L property, you need ₹3-5L extra for these charges. Some banks offer top-up loans for stamp duty, but at higher interest rates.",
        },
      },
      {
        "@type": "Question",
        name: "Can I claim stamp duty tax deduction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, stamp duty and registration charges are eligible for tax deduction under Section 80C, up to ₹1.5 lakh in the financial year of purchase. This is part of the overall ₹1.5L limit shared with PF, ELSS, PPF, etc. The deduction is available only in the year of purchase, not spread over years.",
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
            Stamp Duty Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate stamp duty and registration charges for property purchase
            across all Indian states. See women&apos;s discount rates, compare
            states, and plan your total registration budget.
          </p>
        </div>
        <StampDutyCalculator />
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
            url="https://investingpro.in/calculators/stamp-duty"
            title="Stamp Duty Calculator — State-Wise Property Registration Cost"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "real-estate",
              slug: "stamp-duty",
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
