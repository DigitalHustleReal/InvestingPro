import React from "react";
import type { Metadata } from "next";
import { EducationLoanEMICalculator } from "@/components/calculators/EducationLoanEMICalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Education Loan EMI Calculator India 2026 — India + Abroad | InvestingPro",
  description:
    "Free education loan EMI calculator with moratorium period, interest during course, Sec 80E tax benefit, and India vs abroad comparison. Calculate total cost of your degree including grace period.",
  keywords:
    "education loan EMI calculator, education loan calculator India, study loan calculator, abroad education loan, Sec 80E tax benefit, education loan interest rate, moratorium period education loan",
  openGraph: {
    title: "Education Loan EMI Calculator 2026",
    description:
      "Calculate education loan EMI with moratorium, Sec 80E tax benefit, India vs abroad.",
    url: "https://investingpro.in/calculators/education-loan-emi",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/education-loan-emi",
  },
};

export default function EducationLoanEMIPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Education Loan EMI Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/education-loan-emi",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the moratorium period in education loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Moratorium = course duration + 6 months (or 1 year after getting job, whichever is earlier). During this period, you don't pay EMI but interest accrues on the loan. After moratorium, EMI starts on the accumulated amount (principal + accrued interest). Some banks offer the option to pay interest during the course.",
        },
      },
      {
        "@type": "Question",
        name: "What is Section 80E tax benefit on education loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Section 80E allows UNLIMITED deduction on education loan INTEREST (not principal) for 8 years from the year you start repaying. Unlike 80C (capped at ₹1.5L), 80E has no upper limit. This makes education loans one of the most tax-efficient borrowings. Available for self, spouse, and children.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need collateral for education loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No collateral needed for loans up to ₹7.5 lakh (most banks). For ₹7.5-20 lakh, third-party guarantee may suffice. Above ₹20 lakh (typically abroad studies), collateral (property/FD) is mandatory. SBI, BoB, and Canara Bank have the highest collateral-free limits.",
        },
      },
      {
        "@type": "Question",
        name: "Education loan interest rate for abroad studies?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abroad education loan rates: SBI 8.5-10.5%, Bank of Baroda 8.35-9.85%, Axis Bank 13.7%, HDFC Credila 9-13.5%. Government banks are cheapest. Private lenders (Prodigy Finance, MPOWER) cater to specific countries but charge 11-14%. Always compare secured vs unsecured rates.",
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
            Education Loan EMI Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Calculate your education loan EMI including moratorium period
            (course + 6 months). See interest accumulation during study, Section
            80E tax benefit, and compare India vs abroad options.
          </p>
        </div>
        <EducationLoanEMICalculator />
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
            url="https://investingpro.in/calculators/education-loan-emi"
            title="Education Loan EMI Calculator — India + Abroad"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "loans",
              slug: "education-loan-emi",
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
