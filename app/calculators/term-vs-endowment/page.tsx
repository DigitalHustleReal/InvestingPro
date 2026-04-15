import React from "react";
import type { Metadata } from "next";
import { TermVsEndowmentCalculator } from "@/components/calculators/TermVsEndowmentCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "Term Insurance vs Endowment Plan Calculator 2026 — Which is Better? | InvestingPro",
  description:
    "Compare term life insurance and endowment plans side by side. Analyse premiums, coverage, maturity returns, and the Buy Term Invest the Difference (BTID) strategy with real Indian insurer data.",
  keywords:
    "term insurance vs endowment plan, term vs endowment calculator, BTID strategy India, buy term invest difference, term insurance calculator, endowment plan calculator, LIC endowment vs term plan, life insurance comparison India, term plan vs money back policy, which life insurance is better",
  openGraph: {
    title:
      "Term Insurance vs Endowment Plan Calculator 2026 — Which is Better?",
    description:
      "Compare premiums, coverage, and maturity returns. See why BTID strategy beats endowment plans for most Indian families.",
    url: "https://investingpro.in/calculators/term-vs-endowment",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/term-vs-endowment",
  },
};

export default function TermVsEndowmentPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Term Insurance vs Endowment Plan Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/term-vs-endowment",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between term insurance and an endowment plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Term insurance is pure life cover — you pay a low premium and your family gets the sum assured only if you die during the policy term. There is no maturity benefit; if you survive, you get nothing back. An endowment plan combines life cover with savings — you pay a higher premium but receive a maturity amount (sum assured + bonuses) if you survive the term. For a 30-year-old male, ₹1 crore term cover costs ~₹10,000-12,000/year, while an endowment plan for the same cover costs ₹4-5 lakh/year.",
        },
      },
      {
        "@type": "Question",
        name: "Why is term insurance so much cheaper than endowment plans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Term insurance is cheaper because the insurer only pays out if you die during the term — statistically, most policyholders survive, so claims are rare. Endowment plans are expensive because the insurer must pay everyone at maturity — they invest your premium in low-risk government bonds (4-6% return) and keep a large chunk as fund management charges, agent commissions (30-40% of first-year premium), and admin costs. A ₹12,000/year term plan gives ₹1 crore cover, while a ₹5 lakh/year endowment gives the same cover but at 40x the cost.",
        },
      },
      {
        "@type": "Question",
        name: "What is BTID (Buy Term Invest the Difference) strategy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BTID means buying a cheap term plan for life cover and investing the premium difference in mutual funds or other instruments. Example: If an endowment costs ₹5,00,000/year and term costs ₹12,000/year, you invest the ₹4,88,000 difference in an equity mutual fund. At 12% CAGR over 25 years, the BTID corpus grows to ₹7.5+ crore — while the endowment maturity would be only ₹1.5-2 crore. BTID gives you higher life cover AND a significantly larger corpus, assuming you actually invest the difference and stay invested.",
        },
      },
      {
        "@type": "Question",
        name: "Is the maturity benefit of an endowment plan worth it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Endowment plans typically deliver 4-6% CAGR on maturity — barely beating inflation and far below equity mutual fund returns (12-14% CAGR) or even PPF (7.1%). LIC Jeevan Anand, one of India's most popular endowment plans, has historically delivered 5-5.5% returns including bonuses. After adjusting for inflation (5-6%), the real return is near zero. The maturity amount looks large in absolute terms but has poor purchasing power. The only advantage: forced savings discipline and guaranteed returns for extremely conservative investors.",
        },
      },
      {
        "@type": "Question",
        name: "Which is better for family protection — term plan or endowment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For pure family protection, term insurance is unambiguously better. A 30-year-old can get ₹1-2 crore cover for ₹10,000-20,000/year with a term plan. The same budget in an endowment plan would give only ₹3-5 lakh cover — utterly inadequate for a family. IRDAI recommends life cover of 10-15x annual income. If you earn ₹10 lakh/year, you need ₹1-1.5 crore cover — achievable only with a term plan at an affordable premium. Use term insurance for protection and mutual funds/PPF/NPS for wealth creation — do not mix insurance with investment.",
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
            Term Insurance vs Endowment Plan Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare term life insurance and endowment plans side by side. See
            premiums, coverage, maturity returns, and the Buy Term Invest the
            Difference (BTID) strategy with real Indian insurer data.
          </p>
        </div>
        <TermVsEndowmentCalculator />
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
            url="https://investingpro.in/calculators/term-vs-endowment"
            title="Term Insurance vs Endowment Plan Calculator — Which is Better?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "insurance",
              slug: "term-vs-endowment",
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
