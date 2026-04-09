import React from "react";
import type { Metadata } from "next";
import { HomeLoanEMICalculator } from "@/components/calculators/HomeLoanEMICalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Home Loan EMI Calculator India 2026 — Calculate Monthly EMI | InvestingPro",
  description:
    "Free home loan EMI calculator with amortization schedule. Compare bank rates (SBI, HDFC, ICICI), see prepayment impact, and calculate tax benefits under Sec 24(b) and 80C. Accurate to the rupee.",
  keywords:
    "home loan EMI calculator, housing loan calculator, home loan interest rate 2026, EMI calculator for home loan, SBI home loan calculator, HDFC home loan EMI, home loan prepayment calculator, home loan tax benefit",
  openGraph: {
    title: "Home Loan EMI Calculator India 2026",
    description:
      "Calculate home loan EMI with bank rate comparison, prepayment savings, and tax benefits. Free, instant.",
    url: "https://investingpro.in/calculators/home-loan-emi",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/home-loan-emi",
  },
};

export default function HomeLoanEMIPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Home Loan EMI Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Calculate home loan EMI with amortization schedule, bank rate comparison, prepayment impact, and tax benefits.",
    url: "https://investingpro.in/calculators/home-loan-emi",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the current home loan interest rate in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of April 2026, home loan rates range from 8.40% to 9.00%. SBI offers 8.50%, HDFC Bank 8.75%, ICICI 8.75%, Bank of Baroda 8.40%. Rates are floating (linked to EBLR/RLLR) and change with RBI repo rate. Women borrowers typically get 0.05% discount.",
        },
      },
      {
        "@type": "Question",
        name: "How is home loan EMI calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P = loan amount, r = monthly interest rate (annual/12), n = total months. For a ₹50L loan at 8.5% for 20 years: EMI = ₹43,391. Total payment = ₹1.04 Cr (₹54L interest on ₹50L principal).",
        },
      },
      {
        "@type": "Question",
        name: "Should I prepay home loan or invest in SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If your home loan rate is below 9% and you're in the old tax regime (getting Sec 24(b) + 80C benefit), investing in equity SIP (12-15% CAGR) may give better returns than prepaying. But if you're in the new regime (no tax benefit), prepaying saves guaranteed 8.5% — compare with our Home Loan vs SIP calculator.",
        },
      },
      {
        "@type": "Question",
        name: "What tax benefits do I get on home loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under old regime: Sec 24(b) allows ₹2L/year deduction on interest for self-occupied property. Sec 80C allows ₹1.5L/year on principal repayment (shared with other 80C investments). First-time buyers get additional ₹50K under Sec 80EEA (for loans up to ₹35L, property up to ₹45L).",
        },
      },
      {
        "@type": "Question",
        name: "How much home loan can I get on my salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Banks typically offer 60x your monthly salary as home loan. With ₹50,000 salary, you can get ~₹30-35L loan. Your total EMI (including existing loans) should not exceed 50-55% of monthly income. A CIBIL score of 750+ gets you the best rates.",
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
            Home Loan EMI Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your monthly home loan EMI with amortization schedule.
            Compare bank rates, see prepayment savings, and calculate tax
            benefits under Section 24(b) and 80C.
          </p>
        </div>
        <HomeLoanEMICalculator />
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
            url="https://investingpro.in/calculators/home-loan-emi"
            title="Home Loan EMI Calculator — Calculate Your Monthly EMI"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "loans",
              slug: "home-loan-emi",
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
