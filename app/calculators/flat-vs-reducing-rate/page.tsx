import React from "react";
import type { Metadata } from "next";
import { FlatVsReducingCalculator } from "@/components/calculators/FlatVsReducingCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Flat vs Reducing Rate Calculator 2026 — Convert Flat to Reducing Interest Rate | InvestingPro",
  description:
    "Free flat vs reducing rate calculator. Convert flat interest rate to true reducing rate. See how much extra you pay with flat rate loans from NBFCs, car dealers, and fintech apps. India's most important loan calculator.",
  keywords:
    "flat vs reducing rate calculator, flat rate to reducing rate converter, NBFC flat rate, car loan flat rate, personal loan flat rate, reducing balance method, flat interest rate India, true interest rate calculator",
  openGraph: {
    title: "Flat vs Reducing Rate Calculator India 2026",
    description:
      "Convert flat rate to true reducing rate. Expose hidden costs of NBFC and car dealer loans.",
    url: "https://investingpro.in/calculators/flat-vs-reducing-rate",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/flat-vs-reducing-rate",
  },
};

export default function FlatVsReducingRatePage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Flat vs Reducing Rate Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/flat-vs-reducing-rate",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between flat and reducing interest rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Flat rate charges interest on the ORIGINAL loan amount throughout the tenure. Reducing rate (diminishing balance) charges interest only on the REMAINING balance, which decreases as you repay. A 10% flat rate is roughly equivalent to 17-18% reducing rate. Banks use reducing rate; NBFCs and car dealers often quote flat rate to make loans look cheaper.",
        },
      },
      {
        "@type": "Question",
        name: "How to convert flat rate to reducing rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The approximate formula is: Reducing Rate = Flat Rate × 2N / (N+1), where N is total loan months. For a 3-year loan: multiply flat rate by 1.85. For 5-year: multiply by 1.9. For 7-year: multiply by 1.93. Example: 8% flat rate on a 5-year loan = approximately 15.3% reducing rate.",
        },
      },
      {
        "@type": "Question",
        name: "Why do NBFCs use flat rate in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NBFCs quote flat rates because the number looks much lower and more attractive. A 10% flat rate sounds cheaper than 18% reducing rate, even though they cost the same. RBI mandates banks to quote reducing rates, but many NBFCs, car dealers, two-wheeler finance companies, and fintech apps still advertise flat rates. Always ask for the reducing rate before signing.",
        },
      },
      {
        "@type": "Question",
        name: "Which loans in India typically use flat rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Car loans from dealers (not banks), two-wheeler loans, personal loans from NBFCs (Bajaj Finance, Tata Capital), consumer durable loans (Bajaj EMI Card), gold loans from local lenders, and some fintech app loans. Banks like SBI, HDFC, ICICI always quote reducing rate. If someone quotes a rate that seems too good, it is probably flat rate.",
        },
      },
      {
        "@type": "Question",
        name: "How much extra do I pay with flat rate vs reducing rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "On a ₹5 lakh loan at 10% for 5 years: Flat rate total interest = ₹2,50,000. Reducing rate total interest = ₹1,37,000. You pay ₹1,13,000 extra — that is 82% more interest! The difference increases with longer tenures. This is why flat rate is the biggest hidden cost in Indian personal loans.",
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
            Flat vs Reducing Rate Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            NBFCs and car dealers quote &quot;flat rate&quot; that looks low but
            costs almost double. Convert flat rate to true reducing rate and see
            exactly how much extra you are paying. The most important calculator
            before taking any NBFC loan.
          </p>
        </div>
        <FlatVsReducingCalculator />
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
            url="https://investingpro.in/calculators/flat-vs-reducing-rate"
            title="Flat vs Reducing Rate Calculator — Expose Hidden Loan Costs"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "loans",
              slug: "flat-vs-reducing-rate",
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
