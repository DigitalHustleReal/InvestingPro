import React from "react";
import type { Metadata } from "next";
import { PPFvsELSSCalculator } from "@/components/calculators/PPFvsELSSCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title: "PPF vs ELSS Calculator 2026 — Tax Saving Comparison",
  description:
    "Compare PPF and ELSS for Section 80C tax saving. Analyse lock-in period, returns, tax-free vs LTCG taxation, risk profile, and maturity value side by side. Updated for FY 2025-26.",
  keywords:
    "PPF vs ELSS calculator, PPF vs ELSS comparison, Section 80C tax saving, PPF returns calculator, ELSS returns calculator, tax saving investment India, PPF or ELSS which is better 2026, 80C deduction comparison",
  openGraph: {
    title: "PPF vs ELSS Calculator 2026 — Tax Saving Comparison",
    description:
      "Compare PPF and ELSS for Section 80C tax saving. Lock-in, returns, tax-free vs LTCG side by side.",
    url: "https://investingpro.in/calculators/ppf-vs-elss",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/ppf-vs-elss",
  },
};

export default function PPFvsELSSPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PPF vs ELSS Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/ppf-vs-elss",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between PPF and ELSS lock-in period?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF has a 15-year lock-in period with partial withdrawal allowed from the 7th year onwards (up to 50% of balance at end of 4th year). ELSS has the shortest lock-in among all Section 80C instruments — just 3 years from the date of each SIP instalment. This means ELSS gives you much higher liquidity. However, PPF can be extended in blocks of 5 years after maturity, making it ideal for long-term retirement planning with sovereign guarantee.",
        },
      },
      {
        "@type": "Question",
        name: "Which gives better returns — PPF or ELSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF currently offers 7.1% per annum (set by government, reviewed quarterly). Historically, PPF rates have ranged from 7-8.5% over the last decade. ELSS funds, being equity-linked, have delivered 12-18% CAGR over 10-year periods, though with significant volatility. Top ELSS funds like Mirae Asset Tax Saver, Quant ELSS, and Parag Parikh ELSS have delivered 15-20% returns over 5 years. However, ELSS returns are not guaranteed and can be negative in bad market years.",
        },
      },
      {
        "@type": "Question",
        name: "How is tax treatment different for PPF and ELSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF enjoys EEE (Exempt-Exempt-Exempt) status — investment up to ₹1.5 lakh qualifies for 80C deduction, interest earned is tax-free, and maturity amount is fully tax-free. ELSS gets EET treatment — investment qualifies for 80C deduction and there is no tax during the holding period, but LTCG above ₹1.25 lakh per year is taxed at 12.5% on redemption (after the 3-year lock-in). For a ₹1.5 lakh annual investment growing at 15% over 15 years, the LTCG tax on ELSS can be ₹3-5 lakh. Despite this, ELSS post-tax returns usually beat PPF for long horizons.",
        },
      },
      {
        "@type": "Question",
        name: "Is PPF safer than ELSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, PPF is significantly safer. PPF carries sovereign guarantee (backed by Government of India) with zero risk of capital loss. Returns are fixed for each quarter. ELSS invests in equities — your capital fluctuates daily with stock markets. In 2020 (COVID crash), many ELSS funds fell 30-40% before recovering. In 2008, ELSS funds lost up to 60%. However, no ELSS fund has delivered negative returns over any 10-year rolling period in Indian market history. Risk-averse investors, senior citizens, and those near retirement should prefer PPF. Young investors with 10+ year horizons benefit more from ELSS.",
        },
      },
      {
        "@type": "Question",
        name: "Can I invest in both PPF and ELSS for Section 80C?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the combined Section 80C limit is ₹1.5 lakh per financial year across all eligible instruments (PPF, ELSS, EPF, life insurance, NSC, SCSS, tax-saving FD, tuition fees, home loan principal). A popular strategy: invest ₹50,000-75,000 in PPF for guaranteed tax-free returns and safety, and the remaining ₹75,000-1,00,000 in ELSS via monthly SIP for higher growth potential. If your EPF contribution already covers a large portion of 80C, you may only need one of PPF or ELSS for the remaining limit.",
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
            PPF vs ELSS Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Compare PPF and ELSS for Section 80C tax saving. Analyse lock-in
            period, expected returns, tax-free vs LTCG taxation, and maturity
            value to pick the right tax-saving instrument.
          </p>
        </div>
        <PPFvsELSSCalculator />
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
            url="https://investingpro.in/calculators/ppf-vs-elss"
            title="PPF vs ELSS Calculator — Tax Saving Comparison"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "tax-saving",
              slug: "ppf-vs-elss",
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
