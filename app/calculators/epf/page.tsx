import React from "react";
import type { Metadata } from "next";
import { EPFCalculator } from "@/components/calculators/EPFCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import { TrustStrip } from "@/components/calculators/shared/TrustStrip";
import { PopularCalculators } from "@/components/calculators/shared/PopularCalculators";

export const metadata: Metadata = {
  title:
    "EPF Calculator India 2026 — Calculate PF Balance at Retirement | InvestingPro",
  description:
    "Free EPF calculator to estimate your Provident Fund corpus at retirement. Includes employer contribution (3.67%), salary increments, EPS pension estimate, and year-wise breakdown. EPFO rate: 8.25% for FY 2024-25.",
  keywords:
    "EPF calculator, PF calculator, provident fund calculator, EPF interest rate 2026, EPF retirement corpus, EPFO calculator, employee provident fund",
  openGraph: {
    title: "EPF Calculator India 2026 — PF Retirement Corpus",
    description:
      "Calculate your EPF maturity amount with salary increments. Current EPFO rate: 8.25%. Free, instant.",
    url: "https://investingpro.in/calculators/epf",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: "https://investingpro.in/calculators/epf" },
};

export default function EPFCalculatorPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EPF Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Calculate Employee Provident Fund (EPF) corpus at retirement with salary increments and employer contribution.",
    url: "https://investingpro.in/calculators/epf",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the current EPF interest rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EPFO declared 8.25% interest rate for FY 2024-25. This is applied on the monthly running balance. The rate is reviewed annually by the EPFO Central Board of Trustees and approved by the Ministry of Finance.",
        },
      },
      {
        "@type": "Question",
        name: "How is EPF calculated on salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Employee contributes 12% of Basic + DA to EPF. Employer also contributes 12%, but it's split: 8.33% goes to EPS (Employee Pension Scheme, max ₹15,000 salary) and 3.67% goes to EPF account. So total EPF contribution is 15.67% of Basic + DA per month.",
        },
      },
      {
        "@type": "Question",
        name: "Is EPF withdrawal taxable?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EPF withdrawal after 5 years of continuous service is completely tax-free. If withdrawn before 5 years, the employer's contribution and interest are taxable. Interest earned on EPF contributions above ₹2.5 lakh per year (₹5L for govt) is taxable from FY 2021-22.",
        },
      },
      {
        "@type": "Question",
        name: "What happens to EPF when I change jobs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can transfer your EPF balance to the new employer using the Universal Account Number (UAN). Transfer is done online via the EPFO portal. The balance continues to earn interest during transfer. Never withdraw EPF when changing jobs — you lose compounding benefits.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between EPF and EPS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EPF (Employee Provident Fund) is your savings account that earns 8.25% interest — you get a lump sum at retirement. EPS (Employee Pension Scheme) gives you a monthly pension after 58. Pension formula: (Pensionable Salary × Service Years) / 70. Maximum pensionable salary is ₹15,000/month.",
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
            EPF Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Calculate your Employee Provident Fund corpus at retirement.
            Includes employer contribution (3.67% to EPF), salary increments,
            and EPS pension estimate. Current EPFO rate: 8.25% p.a.
          </p>
        </div>

        <EPFCalculator />

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
            url="https://investingpro.in/calculators/epf"
            title="EPF Calculator - Calculate Your PF Retirement Corpus"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "personal-finance",
              slug: "epf",
            }}
          />
        </div>
        <div className="mt-8">
          <div className="mt-8">
            <PopularCalculators currentSlug="epf" variant="strip" />
          </div>
          <FinancialDisclaimer />
        </div>
      </div>
    </>
  );
}
