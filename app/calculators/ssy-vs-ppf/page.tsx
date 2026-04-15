import React from "react";
import type { Metadata } from "next";
import { SSYvsPPFCalculator } from "@/components/calculators/SSYvsPPFCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "SSY vs PPF Calculator 2026 — Sukanya Samriddhi vs PPF Comparison | InvestingPro",
  description:
    "Compare Sukanya Samriddhi Yojana and PPF side by side. Analyse interest rates, maturity value, 80C tax benefits, lock-in period, and withdrawal rules. Find the best savings scheme for your daughter. Updated FY 2025-26.",
  keywords:
    "SSY vs PPF calculator, Sukanya Samriddhi vs PPF, SSY interest rate 2026, PPF interest rate 2026, SSY maturity calculator, girl child savings scheme, 80C deduction, EEE tax free, SSY vs PPF which is better, beti bachao savings",
  openGraph: {
    title: "SSY vs PPF Calculator 2026 — Sukanya Samriddhi vs PPF Comparison",
    description:
      "Compare SSY and PPF side by side — interest rates, maturity value, tax benefits, and liquidity. Find the best savings scheme for your daughter.",
    url: "https://investingpro.in/calculators/ssy-vs-ppf",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/ssy-vs-ppf",
  },
};

export default function SSYvsPPFPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SSY vs PPF Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/ssy-vs-ppf",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which is better for a girl child — SSY or PPF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sukanya Samriddhi Yojana (SSY) is specifically designed for the girl child and currently offers 8.2% interest (FY 2025-26), which is higher than PPF's 7.1%. Both have EEE (Exempt-Exempt-Exempt) tax status, meaning investment, interest, and maturity are all tax-free. SSY allows deposits for 15 years and matures when the girl turns 21. For a girl child, SSY is the clear winner due to the higher interest rate and government backing. However, SSY can only be opened for a girl child under 10 years of age, and a family can open a maximum of 2 SSY accounts (for 2 daughters).",
        },
      },
      {
        "@type": "Question",
        name: "Can I open both SSY and PPF for my daughter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can open both an SSY account and a PPF account for your daughter. Both qualify for Section 80C deduction, but the combined limit across all 80C instruments is ₹1.5 lakh per financial year. A smart strategy is to invest ₹1.5 lakh in SSY (higher rate) and open a PPF in your own name for additional ₹1.5 lakh deduction. This way, the family gets ₹3 lakh in total 80C deduction while maximizing returns through SSY's higher rate.",
        },
      },
      {
        "@type": "Question",
        name: "What is the maximum investment in SSY and PPF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both SSY and PPF have a maximum annual deposit limit of ₹1.5 lakh. The minimum deposit for SSY is ₹250 per year (failure to deposit minimum leads to a ₹50 penalty), while PPF requires a minimum of ₹500 per year. SSY deposits can be made for the first 15 years from account opening. PPF has a 15-year tenure, extendable in 5-year blocks with or without further contributions.",
        },
      },
      {
        "@type": "Question",
        name: "When can I withdraw money from SSY and PPF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SSY allows partial withdrawal of up to 50% of the balance at the end of the preceding financial year once the girl turns 18, for education or marriage expenses. The account matures when the girl turns 21. PPF allows partial withdrawal from the 7th financial year onwards (up to 50% of the balance at the end of the 4th preceding year). PPF can be prematurely closed after 5 years for specific reasons like serious illness or higher education, with a 1% interest penalty. PPF is more flexible for partial withdrawals.",
        },
      },
      {
        "@type": "Question",
        name: "How much will SSY and PPF give after 15 years with ₹1.5 lakh/year?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With ₹1.5 lakh annual investment for 15 years: SSY at 8.2% will give approximately ₹43.1 lakh at maturity (girl turns 21, assuming account opened at birth — total tenure ~21 years with deposits for 15 years). PPF at 7.1% will give approximately ₹40.7 lakh after 15 years. The SSY amount is higher because of (a) higher interest rate and (b) interest continues to accrue for the remaining years after deposits stop. Total invested in both cases is ₹22.5 lakh. Both maturity amounts are completely tax-free.",
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
            SSY vs PPF Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare Sukanya Samriddhi Yojana and Public Provident Fund side by
            side. See maturity value, interest earned, 80C tax benefits, and
            withdrawal flexibility to pick the best savings scheme for your
            daughter.
          </p>
        </div>
        <SSYvsPPFCalculator />
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
            url="https://investingpro.in/calculators/ssy-vs-ppf"
            title="SSY vs PPF Calculator — Which Savings Scheme is Better for Your Daughter?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "savings",
              slug: "ssy-vs-ppf",
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
