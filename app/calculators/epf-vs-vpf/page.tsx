import React from "react";
import type { Metadata } from "next";
import { EPFvsVPFCalculator } from "@/components/calculators/EPFvsVPFCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "EPF vs VPF Calculator 2026 — Should You Increase PF Contribution? | InvestingPro",
  description:
    "Free EPF vs VPF comparison calculator. See how much extra corpus VPF builds at the same EPF rate. Covers employer split (3.67% EPF + 8.33% EPS), Rs 2.5L tax-free limit, and taxable interest on excess contributions.",
  keywords:
    "epf vs vpf calculator, vpf calculator, voluntary provident fund, epf vpf difference, vpf contribution limit, vpf tax benefit, vpf interest rate 2026, should I increase vpf, epf contribution calculator India",
  openGraph: {
    title: "EPF vs VPF Calculator 2026 — Is Extra PF Contribution Worth It?",
    description:
      "Compare EPF-only vs EPF+VPF corpus with tax-free limit analysis. See if increasing VPF makes sense for your salary.",
    url: "https://investingpro.in/calculators/epf-vs-vpf",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/epf-vs-vpf",
  },
};

export default function EPFvsVPFPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EPF vs VPF Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/epf-vs-vpf",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is VPF and how is it different from EPF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VPF (Voluntary Provident Fund) is an extension of EPF where you voluntarily contribute more than the mandatory 12% of basic salary. VPF earns the same interest rate as EPF (currently 8.25% for FY 2025-26). The key difference: EPF is mandatory at 12%, while VPF is voluntary up to 100% of basic salary. Both are government-backed and offer the same guaranteed returns.",
        },
      },
      {
        "@type": "Question",
        name: "Is VPF tax-free in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VPF contributions up to Rs 2.5 lakh per year (combined employee EPF + VPF) earn tax-free interest. From Budget 2021, interest earned on employee PF contributions exceeding Rs 2.5 lakh per year is taxable at your income tax slab rate. This means if your basic salary is above Rs 2.08 lakh/month, even regular EPF (12%) crosses the Rs 2.5L limit. VPF contributions qualify for Section 80C deduction up to Rs 1.5 lakh.",
        },
      },
      {
        "@type": "Question",
        name: "How is employer EPF contribution split?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Employer contributes 12% of basic salary, but it's split: 3.67% goes to your EPF account and 8.33% goes to EPS (Employee Pension Scheme). EPS contribution is capped at Rs 15,000 basic salary (max Rs 1,250/month to EPS). If your basic exceeds Rs 15,000, the excess employer contribution goes entirely to EPF. VPF has no employer matching — it's purely your voluntary extra contribution.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Rs 2.5 lakh tax-free limit on PF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "From April 2021, interest on employee PF contributions exceeding Rs 2.5 lakh per year is taxable. This applies to EPF + VPF combined employee contributions only (employer contribution is separate). For example, if you contribute Rs 4 lakh/year (EPF + VPF), interest on Rs 1.5 lakh (4L - 2.5L) is taxable at your slab rate. Government employees have a higher limit of Rs 5 lakh. Plan VPF contributions accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Can I withdraw VPF before retirement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "VPF follows the same withdrawal rules as EPF. You can make partial withdrawals for specific purposes: home purchase (after 5 years), medical emergency, education, or marriage. Full withdrawal is allowed if unemployed for 2+ months or at retirement (58 years). VPF withdrawn after 5 years of continuous service is tax-free. If withdrawn before 5 years, the employer's contribution and interest become taxable.",
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
            EPF vs VPF Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Compare EPF-only vs EPF + VPF (Voluntary Provident Fund). See how
            extra VPF contribution grows your retirement corpus at the same
            guaranteed EPF rate. Includes Rs 2.5L tax-free limit analysis and
            employer contribution split.
          </p>
        </div>
        <EPFvsVPFCalculator />
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
            url="https://investingpro.in/calculators/epf-vs-vpf"
            title="EPF vs VPF Calculator — Should You Increase PF Contribution?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "retirement",
              slug: "epf-vs-vpf",
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
