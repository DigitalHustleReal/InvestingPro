import React from "react";
import type { Metadata } from "next";
import { SalaryCalculator } from "@/components/calculators/SalaryCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "Salary Calculator India 2026 — CTC to In-Hand Take Home | InvestingPro",
  description:
    "Free salary calculator to convert CTC to in-hand take home salary. Includes EPF, HRA exemption, professional tax, income tax under old and new regime. Complete salary breakup.",
  keywords:
    "salary calculator, CTC to in-hand calculator, take home salary calculator, salary breakup calculator, CTC calculator India, in-hand salary from CTC, salary after tax India",
  openGraph: {
    title: "Salary Calculator India 2026 — CTC to In-Hand",
    description:
      "Convert your CTC to monthly in-hand salary. EPF, tax, HRA exemption — complete breakdown.",
    url: "https://investingpro.in/calculators/salary",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/salary" },
};

export default function SalaryCalculatorPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Salary Calculator India — CTC to In-Hand",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Convert CTC to in-hand take home salary with complete breakup including EPF, HRA, tax, professional tax.",
    url: "https://investingpro.in/calculators/salary",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What percentage of CTC is in-hand salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Typically 60-75% of CTC is your in-hand salary. The rest goes to EPF (12% of basic), gratuity (~4.81%), professional tax (₹2,400/year), and income tax. Higher CTC means lower take-home percentage due to higher tax brackets.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between CTC and gross salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CTC (Cost to Company) includes everything: your salary + employer's EPF + gratuity + insurance + bonuses. Gross salary = CTC minus employer's contributions (EPF, gratuity). In-hand = Gross minus your deductions (employee EPF, tax, professional tax).",
        },
      },
      {
        "@type": "Question",
        name: "How is basic salary calculated from CTC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Basic salary is typically 40-50% of CTC. Most companies set it at 40% to optimize EPF contributions (lower basic = lower EPF). However, lower basic also means lower HRA exemption and gratuity. A basic of 50% is more tax-efficient for salaried employees in the old regime.",
        },
      },
      {
        "@type": "Question",
        name: "Which tax regime gives more in-hand salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New regime is better for most people with CTC below ₹15L (due to lower slabs and ₹75K standard deduction). Old regime is better if you have significant deductions: HRA (pay rent), 80C investments (₹1.5L), home loan interest (₹2L), NPS (₹50K extra). Use our calculator to compare both.",
        },
      },
      {
        "@type": "Question",
        name: "Is EPF deducted from CTC or salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both. Employee's 12% EPF is deducted from gross salary (reduces take-home). Employer's 12% EPF is part of CTC but doesn't appear in your payslip. So EPF costs 24% of basic: 12% from you + 12% from employer (8.33% to pension, 3.67% to PF).",
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
            Salary Calculator — CTC to In-Hand
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Convert your annual CTC to monthly in-hand take-home salary.
            Complete breakdown with EPF, HRA exemption, professional tax, and
            income tax under old and new regime.
          </p>
        </div>
        <SalaryCalculator />
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
            url="https://investingpro.in/calculators/salary"
            title="Salary Calculator — CTC to In-Hand Take Home"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "personal-finance",
              slug: "salary",
            }}
          />
        </div>
        <div className="mt-8">
          <div className="mt-8">
            <PopularCalculators currentSlug="salary" variant="strip" />
          </div>
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
