import type { Metadata } from "next";
import React from "react";
import { HomeLoanVsSIPCalculator } from "@/components/calculators/HomeLoanVsSIPCalculator";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Home, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Home Loan vs SIP Calculator 2026 — Should You Prepay or Invest?",
  description:
    "Compare home loan prepayment vs SIP investment returns. Find the optimal strategy for your financial situation. Free calculator for Indian homeowners.",
  keywords:
    "home loan vs SIP calculator, prepay home loan or invest in SIP, home loan prepayment calculator India, SIP vs loan comparison",
  alternates: {
    canonical: "https://investingpro.in/calculators/home-loan-vs-sip",
  },
};

export default function HomeLoanVsSIPPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AutoBreadcrumbs />

        {/* Hero */}
        <div className="mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink dark:text-white mb-3">
            Home Loan vs SIP —{" "}
            <span className="text-primary-600 dark:text-primary-400">
              Which is smarter?
            </span>
          </h1>
          <p className="text-lg text-ink-60 dark:text-ink-60 max-w-2xl leading-relaxed">
            Got an extra ₹10,000/month? Should you prepay your home loan or
            invest in mutual fund SIPs? This calculator runs the numbers so you
            don't have to guess.
          </p>
        </div>

        {/* Calculator */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-sm">
          <HomeLoanVsSIPCalculator />
        </div>

        {/* Case cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-success-DEFAULT/10 flex items-center justify-center">
                  <Home className="w-4 h-4 text-success-DEFAULT" />
                </div>
                <h3 className="font-display font-bold text-ink dark:text-white">
                  Prepay When...
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Your loan interest rate is above 9%",
                  "You want guaranteed, risk-free savings",
                  "You're in 30% tax bracket (no interest deduction benefit)",
                  "Less than 10 years remaining on loan",
                  "You sleep better with less debt",
                ].map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-sm text-ink-60 dark:text-ink-60"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success-DEFAULT flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                </div>
                <h3 className="font-display font-bold text-ink dark:text-white">
                  Invest in SIP When...
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Loan interest ≤ 8.5% (home loan deduction available)",
                  "You have 15+ year investment horizon",
                  "You are disciplined — won't withdraw the SIP",
                  "You benefit from Section 24 interest deduction",
                  "Historical equity returns (12–14%) > loan rate",
                ].map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-sm text-ink-60 dark:text-ink-60"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-bold text-ink dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What rate of return should I assume for SIP?",
                a: "Historically, Nifty 50 index funds have returned ~12% CAGR over 15+ year periods. For conservative planning use 10–11%. For large-cap equity mutual funds, 10–12% is reasonable. Never assume past returns will repeat.",
              },
              {
                q: "Does prepaying a home loan save tax?",
                a: "Prepaying reduces your outstanding loan, which reduces future interest. Since Section 24(b) allows deduction of up to ₹2L on home loan interest for self-occupied property, prepaying reduces this deduction — it's a trade-off. For investment property, full interest is deductible.",
              },
              {
                q: "What's the breakeven loan rate vs SIP return?",
                a: "If your SIP is expected to deliver 12% and you are in the 30% tax bracket, your effective loan rate threshold is roughly 8.4% (12% × (1 – 0.30)). Below this rate, SIP wins. Above it, prepayment wins.",
              },
              {
                q: "Can I do both — prepay and invest in SIP?",
                a: "Absolutely. Many advisors recommend a hybrid approach: make one or two extra EMI payments per year (reduces tenure) while continuing SIPs. This balances debt reduction with wealth creation.",
              },
            ].map(({ q, a }, i) => (
              <Card
                key={i}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              >
                <CardContent className="p-6">
                  <h3 className="font-display font-semibold text-ink dark:text-white mb-2">
                    {q}
                  </h3>
                  <p className="text-sm text-ink-60 dark:text-ink-60 leading-relaxed">
                    {a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Share & Disclaimer */}
        <div className="mt-10 space-y-4">
          <SocialShareButtons
            title="Home Loan vs SIP Calculator 2026 | InvestingPro"
            url="https://investingpro.in/calculators/home-loan-vs-sip"
            description="Should you prepay your home loan or invest in SIP? Run the numbers free."
          />
          <FinancialDisclaimer variant="compact" />
        </div>
      </div>
    </main>
  );
}
