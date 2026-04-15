import React from "react";
import type { Metadata } from "next";
import { FDvsDebtMFCalculator } from "@/components/calculators/FDvsDebtMFCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "FD vs Debt Mutual Fund Calculator 2026 — Which Earns More After Tax? | InvestingPro",
  description:
    "Compare Fixed Deposit and Debt Mutual Fund returns after tax. Understand FD TDS vs debt MF capital gains tax, indexation benefit removal, and which option gives better post-tax returns for your tax slab.",
  keywords:
    "FD vs debt mutual fund calculator, fixed deposit vs debt fund, FD vs debt MF after tax, debt mutual fund taxation 2026, FD TDS calculator, indexation benefit debt fund, which is better FD or debt fund, debt fund vs FD comparison India, post tax returns FD debt fund",
  openGraph: {
    title:
      "FD vs Debt Mutual Fund Calculator 2026 — Post-Tax Return Comparison",
    description:
      "Enter your amount, tenure, and tax slab to see whether FD or Debt Mutual Fund gives you more after tax. Updated for latest tax rules.",
    url: "https://investingpro.in/calculators/fd-vs-debt-mf",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/fd-vs-debt-mf",
  },
};

export default function FDvsDebtMFPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FD vs Debt Mutual Fund Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/fd-vs-debt-mf",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which gives better returns after tax — FD or Debt Mutual Fund?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your tax slab and holding period. For investors in the 30% tax bracket, FD interest is taxed at 30% + cess every year, reducing effective returns significantly (a 7.5% FD yields only ~5.2% post-tax). Since April 2023, debt mutual fund gains are also taxed at your slab rate regardless of holding period (indexation benefit removed for funds with <65% equity). However, debt MFs have a tax timing advantage — you pay tax only on redemption, not annually. This allows compounding on the full pre-tax amount, which can make debt MFs marginally better over 3+ years for high-slab investors.",
        },
      },
      {
        "@type": "Question",
        name: "How has debt mutual fund taxation changed since 2023?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "From 1 April 2023 (Finance Act 2023), debt mutual funds (with less than 65% equity allocation) lost the indexation benefit and long-term capital gains (LTCG) advantage. Earlier, holding debt funds for 3+ years gave LTCG at 20% with indexation — effectively 5-8% tax on gains. Now, all gains are taxed at your income tax slab rate regardless of holding period, just like FD interest. This major change made debt funds and FDs nearly equivalent on taxation. The only remaining advantage for debt MFs is deferred taxation — you pay tax only when you sell, not every year like FD TDS.",
        },
      },
      {
        "@type": "Question",
        name: "Is a Fixed Deposit safer than a Debt Mutual Fund?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, FDs are generally safer. Bank FDs are insured by DICGC up to ₹5 lakh per depositor per bank, and principal is guaranteed. Debt mutual funds carry credit risk (if underlying bonds default) and interest rate risk (NAV falls when rates rise). However, top-rated debt funds investing in government securities (gilt funds) or AAA-rated corporate bonds have very low credit risk. Liquid funds and overnight funds are extremely safe for short-term parking. For risk-averse investors, especially senior citizens, bank or post office FDs remain the safer choice. For those comfortable with minor NAV fluctuations, debt MFs offer better liquidity and no premature withdrawal penalty.",
        },
      },
      {
        "@type": "Question",
        name: "What is TDS on Fixed Deposits and how does it affect returns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Banks deduct TDS at 10% on FD interest exceeding ₹40,000/year (₹50,000 for senior citizens). If you don't provide PAN, TDS is 20%. TDS is deducted annually on accrued interest, even if the FD hasn't matured. This reduces your compounding power — you earn interest on a smaller base. For example, on a ₹10 lakh FD at 7.5% for 5 years, annual TDS of ~₹7,500 means you lose roughly ₹2,000-3,000 in compounding over the tenure. Debt mutual funds have no TDS — tax is paid only on redemption. This deferred taxation lets your entire corpus compound, giving debt MFs a slight edge over longer horizons.",
        },
      },
      {
        "@type": "Question",
        name: "Should senior citizens choose FD or Debt Mutual Fund?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Senior citizens generally benefit more from FDs. Banks offer 0.25-0.75% higher FD rates for seniors (e.g., 8-8.5% at small finance banks). They get a higher TDS threshold of ₹50,000 and can claim up to ₹50,000 deduction under Section 80TTB on interest income. Senior Citizen Savings Scheme (SCSS) at 8.2% and PM Vaya Vandana Yojana are even better. Debt MFs don't offer these extra benefits and have no guaranteed returns. However, senior citizens in the nil/5% tax bracket with surplus funds may benefit from debt MFs for liquidity — no lock-in and no premature withdrawal penalty unlike FDs.",
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
            FD vs Debt Mutual Fund Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Compare Fixed Deposit and Debt Mutual Fund returns after tax. Enter
            your investment amount, expected rates, tenure, and tax slab to see
            which option earns more. Updated for 2026 tax rules.
          </p>
        </div>
        <FDvsDebtMFCalculator />
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
            url="https://investingpro.in/calculators/fd-vs-debt-mf"
            title="FD vs Debt Mutual Fund Calculator — Which Earns More After Tax?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investment",
              slug: "fd-vs-debt-mf",
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
