import React from "react";
import type { Metadata } from "next";
import { PersonalLoanEMICalculator } from "@/components/calculators/PersonalLoanEMICalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "Personal Loan EMI Calculator India 2026 — Calculate EMI & True Cost | InvestingPro",
  description:
    "Free personal loan EMI calculator with true cost analysis. Includes processing fee impact, lender rate comparison (SBI, HDFC, Bajaj), prepayment penalty, and disbursement amount. CIBIL-based rate guidance.",
  keywords:
    "personal loan EMI calculator, personal loan calculator India, personal loan interest rate 2026, EMI calculator, SBI personal loan, HDFC personal loan, personal loan processing fee, personal loan prepayment",
  openGraph: {
    title: "Personal Loan EMI Calculator India 2026",
    description:
      "Calculate personal loan EMI with true cost including processing fee. Compare lender rates.",
    url: "https://investingpro.in/calculators/personal-loan-emi",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/personal-loan-emi",
  },
};

export default function PersonalLoanEMIPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Personal Loan EMI Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Calculate personal loan EMI with processing fee, lender comparison, and true cost analysis.",
    url: "https://investingpro.in/calculators/personal-loan-emi",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the personal loan interest rate in India 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Personal loan rates range from 10.49% (Axis Bank, CIBIL 800+) to 36% (digital lenders, low CIBIL). Major banks: SBI 11-14%, HDFC 10.5-21%, ICICI 10.75-19%, Bajaj Finance 11-39%. Rate depends on CIBIL score, salary, employer, and loan amount.",
        },
      },
      {
        "@type": "Question",
        name: "How much personal loan can I get on ₹50,000 salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With ₹50,000 monthly salary and no existing EMIs, you can get approximately ₹10-15 lakh personal loan. Banks allow EMI up to 40-50% of salary. With ₹50K salary, max EMI = ₹20-25K, which supports ~₹12L loan at 12% for 5 years.",
        },
      },
      {
        "@type": "Question",
        name: "What is processing fee on personal loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Processing fee is typically 1-3% of loan amount, deducted upfront from disbursement. On ₹5L loan with 2% fee, you receive only ₹4.9L but repay ₹5L + interest. Some banks offer zero processing fee during festivals. GST at 18% applies on the fee.",
        },
      },
      {
        "@type": "Question",
        name: "Can I prepay personal loan early?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. RBI mandates zero prepayment charges on floating-rate personal loans. For fixed-rate loans, banks charge 2-5% of outstanding amount as foreclosure fee. Always check your loan agreement. Prepaying after 6-12 months is usually penalty-free even for fixed rates.",
        },
      },
      {
        "@type": "Question",
        name: "Personal loan vs credit card EMI — which is cheaper?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Personal loan (10-14%) is MUCH cheaper than credit card EMI (24-42% APR). If you have credit card debt above ₹50K, take a personal loan to pay it off — you'll save 15-25% in interest. This is called debt consolidation.",
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
            Personal Loan EMI Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your personal loan EMI with true cost analysis. See actual
            disbursement after processing fee, compare lender rates, and
            understand prepayment options.
          </p>
        </div>
        <PersonalLoanEMICalculator />
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
            url="https://investingpro.in/calculators/personal-loan-emi"
            title="Personal Loan EMI Calculator — Calculate True Cost"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "loans",
              slug: "personal-loan-emi",
            }}
          />
        </div>
        <div className="mt-8">
          <div className="mt-8">
            <PopularCalculators
              currentSlug="personal-loan-emi"
              variant="strip"
            />
          </div>
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
