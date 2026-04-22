import React from "react";
import type { Metadata } from "next";
import { GoldInvestmentCalculator } from "@/components/calculators/GoldInvestmentCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Gold Investment Calculator 2026 — Physical vs Digital vs ETF vs SGB | InvestingPro",
  description:
    "Compare 4 ways to invest in gold: Physical Gold, Digital Gold, Gold ETF, and Sovereign Gold Bond. See making charges, annual costs, tax treatment, and effective CAGR side by side.",
  keywords:
    "gold investment calculator, gold calculator India, digital gold vs physical gold, sovereign gold bond calculator, gold ETF returns, SGB calculator, gold making charges, gold investment comparison",
  openGraph: {
    title: "Gold Investment Calculator 2026 — 4-Way Comparison",
    description:
      "Physical vs Digital vs ETF vs SGB. See which gold option gives best returns.",
    url: "https://investingpro.in/calculators/gold-investment",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/gold-investment",
  },
};

export default function GoldInvestmentPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gold Investment Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/gold-investment",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which is the best way to invest in gold in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sovereign Gold Bond (SGB) is the best option for long-term (8 years). Zero making charges + 2.5% annual interest + completely tax-free on maturity. For short-term (1-3 years), Digital Gold or Gold ETF is better due to higher liquidity. Physical gold jewellery is the worst investment due to 8-25% making charges.",
        },
      },
      {
        "@type": "Question",
        name: "What are the making charges on gold jewellery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Making charges range from 8% (plain bangles/chains) to 25% (designer/studded jewellery). Average is 12-18%. This means ₹1 lakh of jewellery contains only ₹82-88K worth of gold. When you sell, jewellers deduct another 5-10%. Effective loss: 15-30% on physical gold jewellery.",
        },
      },
      {
        "@type": "Question",
        name: "Is Sovereign Gold Bond tax-free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if held till maturity (8 years). Capital gains on SGB at maturity are 100% tax-free. You also earn 2.5% annual interest (taxable at slab rate). If sold before maturity (after 5 years on exchange), LTCG tax of 20% with indexation applies. SGB is the most tax-efficient gold investment.",
        },
      },
      {
        "@type": "Question",
        name: "How much gold should I have in my portfolio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Financial advisors recommend 5-10% of your portfolio in gold as a hedge against inflation and market crashes. Conservative investors: 10%. Aggressive investors: 5%. Gold is not for growth — it's for protection. Don't invest more than 15% in gold.",
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
            Gold Investment Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Compare Physical Gold vs Digital Gold vs Gold ETF vs Sovereign Gold
            Bond. See making charges, annual costs, tax treatment, and effective
            returns for each option side by side.
          </p>
        </div>
        <GoldInvestmentCalculator />
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
            url="https://investingpro.in/calculators/gold-investment"
            title="Gold Investment Calculator — 4-Way Comparison"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investing",
              slug: "gold-investment",
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
