import React from "react";
import type { Metadata } from "next";
import { NPSvsPPFCalculator } from "@/components/calculators/NPSvsPPFCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "NPS vs PPF Calculator 2026 — Which Retirement Scheme is Better? | InvestingPro",
  description:
    "Compare NPS and PPF for retirement planning. Analyse returns, tax benefits under 80C/80CCD, lock-in periods, withdrawal rules, and corpus projection side by side. Updated for FY 2025-26.",
  keywords:
    "NPS vs PPF calculator, NPS vs PPF comparison, retirement planning India, NPS returns, PPF interest rate 2026, 80CCD deduction, which is better NPS or PPF, pension calculator India, PPF maturity calculator, NPS tier 1 vs PPF",
  openGraph: {
    title: "NPS vs PPF Calculator 2026 — Which Retirement Scheme is Better?",
    description:
      "Compare NPS and PPF side by side — returns, tax savings, lock-in, and withdrawal flexibility. Find the best retirement scheme for you.",
    url: "https://investingpro.in/calculators/nps-vs-ppf",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/nps-vs-ppf",
  },
};

export default function NPSvsPPFPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NPS vs PPF Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/nps-vs-ppf",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which is better for retirement — NPS or PPF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your risk appetite and retirement timeline. NPS invests in equity + debt (expected 9-12% CAGR) and is ideal if you want market-linked growth and a pension. PPF gives guaranteed 7.1% (FY 2025-26) with sovereign safety. For aggressive savers under 40, NPS typically builds a larger corpus. Conservative investors or those needing guaranteed returns should prefer PPF. Many financial planners recommend using both — max out PPF (₹1.5L/year) for safety and add NPS for the extra ₹50K tax deduction under 80CCD(1B).",
        },
      },
      {
        "@type": "Question",
        name: "How do NPS and PPF tax benefits compare?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF qualifies under Section 80C (up to ₹1.5 lakh). NPS gets the same 80C benefit PLUS an additional ₹50,000 deduction under Section 80CCD(1B) — a total of ₹2 lakh in deductions. If your employer contributes to NPS, that is deductible under 80CCD(2) up to 14% of basic salary (central govt) or 10% (others), over and above the ₹2L limit. PPF maturity is fully tax-free (EEE status). NPS corpus: 60% lump sum is tax-free on maturity, but the 40% mandatory annuity income is taxable as per slab.",
        },
      },
      {
        "@type": "Question",
        name: "Can I withdraw from NPS and PPF before maturity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF has a 15-year lock-in but allows partial withdrawals from the 7th year (up to 50% of balance at end of 4th preceding year). Premature closure is allowed after 5 years for specific reasons (illness, higher education) with a 1% interest penalty. NPS locks in until age 60 but permits partial withdrawal (up to 25% of own contributions) after 3 years for specific purposes like children's education, home purchase, or critical illness — maximum 3 times. Early exit from NPS before 60 requires purchasing an annuity with at least 80% of the corpus.",
        },
      },
      {
        "@type": "Question",
        name: "Does employer NPS contribution give extra tax benefit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Employer NPS contribution under Section 80CCD(2) is deductible over and above the ₹1.5L (80C) and ₹50K (80CCD(1B)) limits. Central government employees can claim up to 14% of basic salary; private sector employees up to 10%. For example, if your basic is ₹8 lakh and employer contributes 10% (₹80,000) to NPS, you save an additional ₹24,960 in tax (at 31.2% slab). This makes NPS the only instrument offering up to ₹2.5 lakh+ in total deductions. PPF has no employer contribution mechanism.",
        },
      },
      {
        "@type": "Question",
        name: "What returns can I expect from NPS vs PPF over 25 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PPF currently offers 7.1% p.a. (reviewed quarterly by the government). Investing ₹1.5 lakh/year for 25 years in PPF yields approximately ₹1.03 crore. NPS returns depend on asset allocation — aggressive (75% equity) has historically delivered 10-12% CAGR since inception (2009). At 10% CAGR, ₹1.5 lakh/year for 25 years grows to roughly ₹1.48 crore. However, NPS returns are market-linked and not guaranteed. The key difference: PPF corpus is fully tax-free; NPS requires 40% annuity purchase, and annuity income is taxable.",
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
            NPS vs PPF Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Compare National Pension System and Public Provident Fund side by
            side. See projected corpus, tax savings, and withdrawal flexibility
            to pick the right retirement scheme for your goals.
          </p>
        </div>
        <NPSvsPPFCalculator />
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
            url="https://investingpro.in/calculators/nps-vs-ppf"
            title="NPS vs PPF Calculator — Which Retirement Scheme is Better?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "retirement",
              slug: "nps-vs-ppf",
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
