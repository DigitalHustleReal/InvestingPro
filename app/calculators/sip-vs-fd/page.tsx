import React from "react";
import type { Metadata } from "next";
import { SIPvsFDCalculator } from "@/components/calculators/SIPvsFDCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AutoInternalLinks from "@/components/common/AutoInternalLinks";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";

export const metadata: Metadata = {
  title:
    "SIP vs FD Calculator 2026 — Which Gives Better Returns? | InvestingPro",
  description:
    "Compare SIP and Fixed Deposit returns side by side. Factor in LTCG tax, inflation, lock-in period, and compounding to see which investment suits your goals. Updated for 2026 tax rules.",
  keywords:
    "SIP vs FD calculator, SIP vs fixed deposit, mutual fund vs FD returns, SIP returns calculator India, FD returns calculator, SIP or FD which is better, SIP vs FD comparison 2026, systematic investment plan calculator",
  openGraph: {
    title: "SIP vs FD Calculator 2026 — Which Gives Better Returns?",
    description:
      "Compare SIP and Fixed Deposit returns side by side. Factor in LTCG tax, inflation, and lock-in period.",
    url: "https://investingpro.in/calculators/sip-vs-fd",
    siteName: "InvestingPro.in",
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://investingpro.in/calculators/sip-vs-fd",
  },
};

export default function SIPvsFDPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SIP vs FD Calculator India",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    url: "https://investingpro.in/calculators/sip-vs-fd",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which gives better returns — SIP or Fixed Deposit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Historically, equity mutual fund SIPs have delivered 12-15% CAGR over 10+ years, while FDs offer 6-7.5% pre-tax returns. After adjusting for inflation (5-6%) and taxes, FD real returns are often near zero or negative. SIPs benefit from rupee cost averaging and compounding in equity markets, making them significantly better for long-term wealth creation (7+ years). However, FDs provide guaranteed returns and capital safety for short-term goals.",
        },
      },
      {
        "@type": "Question",
        name: "When is a Fixed Deposit better than SIP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FDs are better when: (1) Your investment horizon is less than 3 years — equity SIPs can give negative returns in short periods. (2) You need guaranteed, predictable returns — FDs have zero market risk. (3) You are in the lowest tax bracket — FD interest is taxed at your slab rate, so low-income investors pay less tax. (4) You need an emergency fund — FDs can be broken with a small penalty, while redeeming SIPs during a market crash locks in losses. (5) Senior citizens get 0.5% extra FD rate plus ₹50,000 TDS exemption under Section 80TTB.",
        },
      },
      {
        "@type": "Question",
        name: "How is tax calculated on SIP and FD returns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FD interest is added to your income and taxed at your slab rate (up to 30% + cess). TDS of 10% is deducted if interest exceeds ₹40,000/year (₹50,000 for senior citizens). For equity SIPs: LTCG above ₹1.25 lakh/year is taxed at 12.5% (holding period > 1 year). STCG (holding < 1 year) is taxed at 20%. For debt fund SIPs: gains are taxed at your income slab rate regardless of holding period (post-2023 rules). Tax-saving ELSS SIPs also qualify for Section 80C deduction up to ₹1.5 lakh.",
        },
      },
      {
        "@type": "Question",
        name: "What are the risks of SIP compared to FD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SIP risks include: (1) Market risk — equity values fluctuate; you can see negative returns for 1-3 year periods. (2) No guaranteed returns — unlike FDs, SIP returns depend on market performance. (3) Emotional risk — investors often panic-sell during corrections, locking in losses. (4) Fund manager risk — poor fund selection can underperform even FDs. FD risks include: (1) Inflation risk — 6% FD post-tax return minus 5-6% inflation = near-zero real return. (2) Reinvestment risk — when FD matures, new rates may be lower. (3) Bank default risk — deposits above ₹5 lakh per bank are not insured by DICGC.",
        },
      },
      {
        "@type": "Question",
        name: "Can I invest in both SIP and FD together?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, and most financial advisors recommend it. A common allocation strategy: keep 6 months of expenses in FDs or liquid funds as an emergency fund, use SIPs for long-term goals (5+ years) like retirement or children's education, and use short-term FDs for goals within 1-3 years like a vacation or down payment. The 50-30-20 approach works well: 50% in equity SIPs for growth, 30% in debt funds or FDs for stability, and 20% in tax-saving instruments (ELSS SIP or tax-saving FD).",
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
            SIP vs FD Calculator
          </h1>
          <p className="text-sm text-ink-60 mt-1.5 max-w-2xl">
            Compare SIP and Fixed Deposit returns side by side. Factor in LTCG
            tax, inflation, lock-in period, and compounding to find which
            investment suits your financial goals.
          </p>
        </div>
        <SIPvsFDCalculator />
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
            url="https://investingpro.in/calculators/sip-vs-fd"
            title="SIP vs FD Calculator — Which Gives Better Returns?"
          />
        </div>
        <div className="mt-8">
          <AutoInternalLinks
            context={{
              contentType: "calculator",
              category: "investment",
              slug: "sip-vs-fd",
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
