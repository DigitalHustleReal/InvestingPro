import React from "react";
import type { Metadata } from "next";
import { CarLoanEMICalculator } from "@/components/calculators/CarLoanEMICalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Car Loan EMI Calculator India 2026 — Calculate Monthly EMI + True Cost | InvestingPro",
  description:
    "Free car loan EMI calculator with depreciation analysis. See true ownership cost including interest, down payment optimization, and car value vs loan balance chart. Compare tenure options.",
  keywords:
    "car loan EMI calculator, car loan calculator India, car loan interest rate 2026, vehicle loan EMI, car finance calculator, car loan down payment, car depreciation calculator",
  openGraph: {
    title: "Car Loan EMI Calculator India 2026",
    description:
      "Calculate car loan EMI with true ownership cost and depreciation analysis.",
    url: "https://investingpro.in/calculators/car-loan-emi",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/car-loan-emi" },
};

export default function CarLoanEMIPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Car Loan EMI Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/car-loan-emi",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the car loan interest rate in India 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Car loan rates range from 7.5% (SBI for new cars) to 16% (used cars from NBFCs). New car: SBI 8.5%, HDFC 8.75%, ICICI 8.75%. Used car: 2-3% higher. Electric vehicles get 0.5-1% discount at most banks.",
        },
      },
      {
        "@type": "Question",
        name: "What should be the ideal down payment for a car loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Minimum 20% down payment recommended (most banks require 10-15%). Higher down payment (30%+) reduces EMI, total interest, and loan-to-value ratio. Banks offer better rates for 30%+ down payment. For used cars, 25-30% down payment is standard.",
        },
      },
      {
        "@type": "Question",
        name: "Is it better to take 3-year or 7-year car loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "3-year loan has higher EMI but lowest total interest. 7-year loan has low EMI but you pay 2-3x more interest. Best balance: 5 years — affordable EMI without excessive interest. Never take a car loan longer than 5 years for new cars.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a car depreciate in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Indian cars lose roughly 15% value per year. A ₹10L car is worth ₹5.7L after 3 years, ₹4.4L after 5 years, and ₹3.2L after 7 years. Luxury cars depreciate faster (20-25%/year). This is why car loans are bad investments — you pay interest on a depreciating asset.",
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
            Car Loan EMI Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your car loan EMI with true ownership cost analysis. See
            how depreciation, interest, and down payment affect your total
            spending. No car is an investment — know the real cost before you
            buy.
          </p>
        </div>
        <CarLoanEMICalculator />
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
            url="https://investingpro.in/calculators/car-loan-emi"
            title="Car Loan EMI Calculator — True Ownership Cost"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "loans",
              slug: "car-loan-emi",
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
