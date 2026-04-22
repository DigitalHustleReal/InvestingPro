import React from "react";
import type { Metadata } from "next";
import { FreelancerTaxCalculator } from "@/components/calculators/FreelancerTaxCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Freelancer Tax Calculator India 2026 — Section 44ADA + GST + Old vs New Regime | InvestingPro",
  description:
    "Free freelancer tax calculator for India. Calculate tax under Section 44ADA presumptive scheme, compare old vs new regime, check GST liability, and get advance tax schedule. For self-employed professionals.",
  keywords:
    "freelancer tax calculator India, self employed tax calculator, Section 44ADA calculator, presumptive taxation, freelancer GST calculator, advance tax calculator, freelancer income tax 2026",
  openGraph: {
    title: "Freelancer Tax Calculator India 2026",
    description:
      "Calculate freelancer tax with 44ADA presumptive scheme, old vs new regime comparison, and GST liability.",
    url: "https://investingpro.in/calculators/freelancer-tax",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/freelancer-tax",
  },
};

export default function FreelancerTaxPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Freelancer Tax Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/freelancer-tax",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Section 44ADA for freelancers in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Section 44ADA is a presumptive taxation scheme for professionals (freelancers, consultants, doctors, lawyers, etc.) with gross receipts up to ₹75 lakh. Under 44ADA, 50% of gross income is treated as taxable profit — no need to maintain detailed books of accounts or get audited. This means if you earn ₹20L, only ₹10L is taxable.",
        },
      },
      {
        "@type": "Question",
        name: "Do freelancers need to pay GST in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GST registration is mandatory if your annual turnover exceeds ₹20 lakh (₹10 lakh for NE states). Professional services attract 18% GST. You can claim input tax credit on business expenses (internet, software, equipment). If turnover is below ₹20L, GST registration is optional but may be beneficial for input credits.",
        },
      },
      {
        "@type": "Question",
        name: "When should freelancers pay advance tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If your total tax liability exceeds ₹10,000 in a financial year, you must pay advance tax in 4 installments: 15% by June 15, 45% by September 15, 75% by December 15, and 100% by March 15. Late payment attracts interest at 1% per month under Section 234C. Under 44ADA, you can pay entire advance tax by March 15.",
        },
      },
      {
        "@type": "Question",
        name: "Is old or new tax regime better for freelancers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your deductions. New regime (2025-26) has lower slabs with no deductions. Old regime allows 80C (₹1.5L), HRA, LTA, NPS, and health insurance deductions. If your total deductions exceed ₹3-4L, old regime is usually better. For freelancers using 44ADA with minimal deductions, new regime often wins.",
        },
      },
      {
        "@type": "Question",
        name: "What expenses can freelancers claim in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under normal computation (not 44ADA), freelancers can claim: office rent, internet/phone bills, computer/equipment depreciation, software subscriptions, co-working space fees, travel for work, professional development courses, and health insurance premiums. Under 44ADA, no individual expense claims needed — flat 50% is deemed as expenses.",
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
            Freelancer Tax Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Calculate your freelancer income tax with Section 44ADA presumptive
            scheme, compare old vs new regime, check GST liability, and get your
            advance tax payment schedule. Built for Indian self-employed
            professionals.
          </p>
        </div>
        <FreelancerTaxCalculator />
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
            url="https://investingpro.in/calculators/freelancer-tax"
            title="Freelancer Tax Calculator India — 44ADA + GST + Advance Tax"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax",
              slug: "freelancer-tax",
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
