import React from "react";
import type { Metadata } from "next";
import { CAGRCalculator } from "@/components/calculators/CAGRCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "CAGR Calculator India 2026 — Calculate Compound Annual Growth Rate | InvestingPro",
  description:
    "Free CAGR calculator to calculate Compound Annual Growth Rate of your investments. Compare against Nifty 50, FD, Gold, and PPF benchmarks. No registration required.",
  keywords:
    "CAGR calculator, compound annual growth rate, CAGR formula, investment returns calculator, CAGR India, CAGR calculator online",
  openGraph: {
    title: "CAGR Calculator India 2026 — Compound Annual Growth Rate",
    description:
      "Calculate CAGR of your investments and compare with Nifty 50, FD, Gold returns. Free, instant, no signup.",
    url: "https://investingpro.in/calculators/cagr",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAGR Calculator India 2026",
    description:
      "Calculate Compound Annual Growth Rate of your investments. Compare vs Nifty, FD, Gold.",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/cagr",
  },
};

export default function CAGRCalculatorPage() {
  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Calculators", url: "/calculators" },
    { label: "CAGR Calculator", url: "/calculators/cagr" },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CAGR Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
    },
    description:
      "Calculate Compound Annual Growth Rate (CAGR) of your investments. Compare against Nifty 50, FD, Gold, PPF benchmarks.",
    url: "https://investingpro.in/calculators/cagr",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is CAGR?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CAGR (Compound Annual Growth Rate) is the mean annual growth rate of an investment over a specified period longer than one year. It smooths out volatility to show a constant rate of return. Formula: CAGR = (Final Value / Initial Value)^(1/n) - 1.",
        },
      },
      {
        "@type": "Question",
        name: "What is a good CAGR in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In India, a CAGR above 12% is considered good for equity investments (Nifty 50 averages ~12.5% over 10 years). For debt instruments like FDs, 7-8% is typical. Any investment that consistently beats inflation (5-6%) is generating real returns.",
        },
      },
      {
        "@type": "Question",
        name: "Is CAGR the same as average return?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Average return is the arithmetic mean of yearly returns, which can be misleading. CAGR accounts for compounding and gives the geometric mean — the actual annual rate at which the investment grew. CAGR is always lower than or equal to the average return.",
        },
      },
      {
        "@type": "Question",
        name: "How is CAGR different from absolute return?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolute return shows total percentage gain (e.g., 150% over 5 years) without considering time. CAGR converts this to an annualized rate (e.g., 20.11% per year for 5 years). CAGR is better for comparing investments of different durations.",
        },
      },
      {
        "@type": "Question",
        name: "Can CAGR be negative?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. If the final value is less than the initial value, CAGR will be negative, indicating your investment lost value. For example, if ₹1,00,000 became ₹80,000 over 3 years, the CAGR would be approximately -7.17%.",
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
            CAGR Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate Compound Annual Growth Rate of any investment. Compare
            your returns against Nifty 50, FD, Gold, and PPF benchmarks.
          </p>
        </div>

        <CAGRCalculator />

        {/* FAQ Section */}
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
            url="https://investingpro.in/calculators/cagr"
            title="CAGR Calculator - Calculate Your Investment Growth Rate"
          />
        </div>

        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investing",
              slug: "cagr",
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
