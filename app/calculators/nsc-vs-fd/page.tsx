import React from "react";
import type { Metadata } from "next";
import { NSCvsFDCalculator } from "@/components/calculators/NSCvsFDCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "NSC vs FD Calculator 2026 — National Savings Certificate vs Fixed Deposit | InvestingPro",
  description:
    "Compare NSC and Fixed Deposit side by side. Analyse post-tax returns, 80C benefits, TDS impact, liquidity, and effective interest rates. Find whether NSC or FD is better for you. Updated FY 2025-26.",
  keywords:
    "NSC vs FD calculator, NSC vs fixed deposit, National Savings Certificate calculator, NSC interest rate 2026, FD vs NSC comparison, 80C tax saving, NSC maturity calculator, post office NSC, bank FD vs NSC, tax saver FD vs NSC",
  openGraph: {
    title:
      "NSC vs FD Calculator 2026 — National Savings Certificate vs Fixed Deposit",
    description:
      "Compare NSC and FD side by side — post-tax returns, 80C benefit, TDS impact, and liquidity. Find which fixed-income instrument is better for you.",
    url: "https://investingpro.in/calculators/nsc-vs-fd",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/nsc-vs-fd",
  },
};

export default function NSCvsFDPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NSC vs FD Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/nsc-vs-fd",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which gives better returns — NSC or FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on the FD rate your bank offers and your tax slab. NSC currently offers 7.7% (FY 2025-26) with annual compounding and a 5-year lock-in. If your bank FD rate is below 7.7%, NSC gives better pre-tax returns. However, NSC has a unique 80C advantage — the reinvested interest (years 1-4) also qualifies for Section 80C deduction, effectively giving a double tax benefit. For someone in the 30% tax bracket, NSC's effective post-tax return can be significantly higher than an equivalent FD, even if the FD rate is slightly higher.",
        },
      },
      {
        "@type": "Question",
        name: "How does the 80C double benefit of NSC work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NSC offers a unique double deduction under Section 80C. When you invest in NSC, the principal qualifies for 80C deduction (up to ₹1.5 lakh). The interest earned each year is deemed to be reinvested in NSC, and this reinvested interest also qualifies for 80C deduction in years 1 through 4. Only the 5th year's interest (which is paid out at maturity) does not get reinvested, so it doesn't qualify for 80C. This means your total 80C-eligible amount over 5 years is significantly more than just the principal. No other fixed-income instrument offers this double benefit.",
        },
      },
      {
        "@type": "Question",
        name: "Is TDS deducted on NSC interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, TDS is not deducted on NSC interest. The interest is taxable on an accrual basis — you need to declare it in your ITR each year, but no tax is deducted at source. For FDs, banks deduct 10% TDS if total interest across all FDs in a bank exceeds ₹40,000 per year (₹50,000 for senior citizens). If you don't file Form 15G/15H and your interest exceeds the threshold, TDS will be deducted from your FD. This gives NSC a cash-flow advantage — you have the full amount working for you until you file your tax return.",
        },
      },
      {
        "@type": "Question",
        name: "Can I break NSC or FD before maturity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NSC cannot be prematurely encashed except in extreme circumstances — death of the holder, court order, or forfeiture by a pledgee. There is no premature withdrawal facility for general investors. FDs can be broken before maturity at most banks, though you will lose 0.5-1% of the applicable interest rate as a penalty. Some banks offer no-penalty premature withdrawal on specific FD products. If liquidity is important to you, FD is the better choice. NSC should only be considered if you are certain you won't need the money for 5 years.",
        },
      },
      {
        "@type": "Question",
        name: "Which is safer — NSC or bank FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NSC is backed by the Government of India (sovereign guarantee) — there is zero default risk. Bank FDs are insured by DICGC up to ₹5 lakh per depositor per bank. If a bank fails, you are guaranteed only ₹5 lakh. For amounts above ₹5 lakh, NSC is strictly safer. However, for amounts under ₹5 lakh in a well-established bank, the risk difference is negligible. If you are investing a large amount (say ₹10-50 lakh) and safety is paramount, NSC is the better choice, though you will need to manage the liquidity constraint.",
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
            NSC vs FD Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare National Savings Certificate and Fixed Deposit side by side.
            See post-tax returns, 80C benefits, TDS impact, and liquidity to
            decide which fixed-income investment is right for you.
          </p>
        </div>
        <NSCvsFDCalculator />
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
            url="https://investingpro.in/calculators/nsc-vs-fd"
            title="NSC vs FD Calculator — Which Fixed-Income Investment is Better?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "savings",
              slug: "nsc-vs-fd",
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
