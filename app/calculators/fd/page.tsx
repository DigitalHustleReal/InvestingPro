"use client";

import React from "react";
import Link from "next/link";
import SEOHead from "@/components/common/SEOHead";
import { FDCalculator } from "@/components/calculators/FDCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import { SEOArticle } from "@/components/calculators/SEOArticle";
import FinancialDisclaimer from "@/components/legal/FinancialDisclaimer";
import SocialShareButtons from "@/components/common/SocialShareButtons";
import CalculatorMarketplace from "@/components/calculators/CalculatorMarketplace";

export default function FDCalculatorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "FD Calculator",
    description:
      "Free Fixed Deposit (FD) calculator to calculate FD maturity amount and interest earned. Compare quarterly, monthly, and annual compounding. Includes inflation-adjusted returns.",
    provider: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
    },
    serviceType: "FinancialCalculator",
    areaServed: { "@type": "Country", name: "India" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How to calculate FD maturity amount?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FD maturity amount is calculated using compound interest formula: A = P Ã— (1 + r/n)^(nÃ—t), where P is principal, r is annual interest rate, n is compounding frequency, and t is tenure in years.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best FD interest rate in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FD interest rates in India range from 5.5% to 8% depending on the bank and tenure. Small finance banks and NBFCs typically offer higher rates (7-8%) compared to large banks (5.5-6.5%). Rates vary with tenure - longer tenures usually have higher rates.",
        },
      },
      {
        "@type": "Question",
        name: "FD calculator with tax deduction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FD interest is taxable as per your income tax slab. TDS of 10% is deducted if interest exceeds â‚¹40,000 annually (â‚¹50,000 for senior citizens). Our FD calculator shows interest before tax. Deduct tax based on your slab to get net returns.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEOHead
        title="FD Calculator India 2026 - Fixed Deposit Maturity & Interest Calculator | InvestingPro"
        description="Free FD calculator to calculate Fixed Deposit maturity amount and interest earned. Compare quarterly, monthly, annual compounding. Find best FD rates and calculate tax on FD interest. Includes inflation-adjusted returns."
        structuredData={[structuredData, faqSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
        <nav className="flex items-center gap-2 text-sm text-ink-60 dark:text-ink-60">
          <Link
            href="/"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/calculators"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Calculators
          </Link>
          <span>/</span>
          <span className="text-ink dark:text-white font-medium">
            FD Calculator
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-[36px] sm:text-[48px] lg:text-[56px] text-ink dark:text-white mb-4 leading-[1.05] tracking-tight">
            FD Calculator - Fixed Deposit Maturity & Interest Calculator
          </h1>
          <p className="text-xl text-ink-60 dark:text-ink-60 max-w-3xl mx-auto leading-relaxed">
            Calculate Fixed Deposit (FD) maturity amount and interest earned.
            Compare different compounding frequencies and see inflation-adjusted
            returns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <FDCalculator />
        <div className="mt-10">
          <CalculatorMarketplace
            category="fixed_deposit"
            sourcePage="fd-calculator"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* Comprehensive Content Section */}
        <div className="space-y-12">
          {/* What is FD Section */}
          <Card className="border-0 shadow-lg rounded-2xl bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-3xl font-display font-bold text-ink dark:text-white">
                What is Fixed Deposit (FD)?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                A <strong>Fixed Deposit (FD)</strong> is a financial instrument
                provided by banks and NBFCs which provides investors a higher
                rate of interest than a regular savings account, until the given
                maturity date. It is one of the safest investment options
                available in India.
              </p>
              <p className="text-lg leading-relaxed">
                You deposit a lump sum amount for a fixed tenure (ranging from 7
                days to 10 years) at a pre-agreed interest rate. Even if market
                rates fall later, your FD continues to earn the booked interest
                rate, providing <strong>guaranteed returns</strong> and capital
                safety.
              </p>
            </CardContent>
          </Card>

          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md rounded-2xl bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Guaranteed Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ink-60 dark:text-gray-300">
                  Unlike mutual funds or stocks, FD returns are fixed and
                  guaranteed. You know exactly how much you will get at
                  maturity.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md rounded-2xl bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
                  <Zap className="w-5 h-5" />
                  Capital Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ink-60 dark:text-gray-300">
                  Bank FDs are insured up to â‚¹5 Lakhs by DICGC (RBI
                  subsidiary). This makes them virtually risk-free for
                  conservative investors.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md rounded-2xl bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
                  <TrendingUp className="w-5 h-5" />
                  Liquidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ink-60 dark:text-gray-300">
                  You can close your FD prematurely (with a small penalty) or
                  take a loan against FD (up to 90% value) to meet emergency
                  needs without breaking it.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md rounded-2xl bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-accent-700 dark:text-accent-400">
                  <Info className="w-5 h-5" />
                  Flexible Interest Payouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ink-60 dark:text-gray-300">
                  Choose between Cumulative (payment at maturity) or
                  Non-Cumulative (monthly/quarterly/annual interest payout)
                  options based on your income needs.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formula Section */}
          <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-bold text-ink dark:text-white">
                How FD Interest is Calculated
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-ink-60 dark:text-gray-300">
                Most banks in India use <strong>Quarterly Compounding</strong>{" "}
                for Fixed Deposits. The formula used is:
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl font-mono text-center text-lg font-bold text-primary-700 dark:text-primary-400 border border-gray-200 dark:border-gray-700">
                A = P Ã— (1 + r/n)<sup>(n Ã— t)</sup>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-ink-60 dark:text-ink-60">
                <div>
                  <span className="font-display font-bold text-ink dark:text-white">
                    A
                  </span>{" "}
                  = Maturity Amount
                </div>
                <div>
                  <span className="font-display font-bold text-ink dark:text-white">
                    P
                  </span>{" "}
                  = Principal Amount
                </div>
                <div>
                  <span className="font-display font-bold text-ink dark:text-white">
                    r
                  </span>{" "}
                  = Annual Interest Rate (decimal)
                </div>
                <div>
                  <span className="font-display font-bold text-ink dark:text-white">
                    n
                  </span>{" "}
                  = Compounding Frequency (4 for quarterly)
                </div>
                <div>
                  <span className="font-display font-bold text-ink dark:text-white">
                    t
                  </span>{" "}
                  = Tenure in Years
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expanded FAQ Section */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold text-ink dark:text-white flex items-center gap-6 md:p-8">
              <Info className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              FD Calculator - Frequently Asked Questions (FAQs)
            </CardTitle>
            <p className="text-ink-60 dark:text-ink-60 mt-2">
              Find answers to the most common questions about FD calculator and
              fixed deposits in India
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                {
                  q: "How to calculate FD maturity amount?",
                  a: "FD maturity amount is calculated using compound interest formula: A = P Ã— (1 + r/n)^(nÃ—t), where P is principal amount, r is annual interest rate, n is compounding frequency (4 for quarterly, 12 for monthly, 1 for annual), and t is tenure in years. Our FD calculator does this automatically for you, showing accurate maturity amount based on your inputs.",
                },
                {
                  q: "What is the best FD interest rate in India?",
                  a: "FD interest rates in India range from 5.5% to 8% depending on the bank and tenure. Small finance banks and NBFCs typically offer higher rates (7-8%) compared to large banks (5.5-6.5%). Rates vary with tenure - longer tenures usually have higher rates. Senior citizens get 0.25-0.5% extra. Always compare rates from multiple banks before investing.",
                },
                {
                  q: "FD calculator with tax deduction?",
                  a: "FD interest is taxable as per your income tax slab. TDS of 10% is deducted at source if interest exceeds â‚¹40,000 annually (â‚¹50,000 for senior citizens). Our FD calculator shows interest before tax. Deduct tax based on your slab (5%, 20%, or 30%) to get net returns. Submit Form 15G/15H to avoid TDS if your total income is below taxable limit.",
                },
                {
                  q: "Which compounding frequency is better for FD?",
                  a: "Quarterly compounding typically gives slightly higher returns than annual compounding due to more frequent compounding. Monthly compounding gives even better returns. However, the difference is marginal (0.1-0.2% for same rate). Choose based on your cash flow needs and bank's offerings. Most banks offer quarterly compounding as default.",
                },
                {
                  q: "What is the minimum FD amount?",
                  a: "Minimum FD amount varies by bank, typically ranging from â‚¹1,000 to â‚¹5,000. Some banks allow FDs as low as â‚¹100 for online accounts. There's usually no maximum limit. Banks may offer higher rates for larger deposits (â‚¹1 crore+). Check with your specific bank for their minimum requirements.",
                },
                {
                  q: "Can I break FD before maturity?",
                  a: "Yes, you can break FD before maturity, but banks charge penalty (usually 0.5-1% on interest rate or loss of 1-3 months interest). Some banks offer flexible FDs with zero or lower penalties. Breaking FD early reduces your returns significantly. Consider your liquidity needs before investing in FD with long tenure.",
                },
                {
                  q: "Is FD interest taxable every year?",
                  a: "FD interest is taxable as per your income tax slab, but tax is due only when interest is paid or credited. For cumulative FDs, interest is credited at maturity, so tax is due in the maturity year. For non-cumulative FDs with periodic payouts, tax is due each year interest is paid. TDS is deducted annually if interest exceeds â‚¹40,000 (â‚¹50,000 for seniors).",
                },
                {
                  q: "FD vs savings account - which is better?",
                  a: "FD offers higher interest rates (6-8%) compared to savings account (3-4%), but money is locked for fixed period. Savings account offers liquidity but lower returns. For emergency fund, keep 3-6 months expenses in savings account. For goals 1+ year away, FD is better. Use both based on your needs - savings for liquidity, FD for higher returns.",
                },
                {
                  q: "Can I take loan against FD?",
                  a: "Yes, most banks offer loans against FD at interest rates 1-2% above FD rate. You can get up to 90-95% of FD value as loan. This is better than breaking FD as you retain FD benefits and pay lower interest than personal loans. Interest on loan against FD is tax-deductible if used for business purposes.",
                },
                {
                  q: "What happens if bank closes my FD bank?",
                  a: "FD deposits up to â‚¹5 lakhs are insured by Deposit Insurance and Credit Guarantee Corporation (DICGC). If bank closes, you'll receive insured amount (principal + interest up to â‚¹5L) from DICGC. For amounts above â‚¹5L, recovery depends on bank's assets. Choose banks with good ratings and consider splitting large FDs across multiple banks.",
                },
                {
                  q: "FD calculator for senior citizens?",
                  a: "Senior citizens (60+ years) get 0.25-0.5% extra interest on FDs. TDS limit is higher (â‚¹50,000 vs â‚¹40,000). Our FD calculator allows you to input any interest rate, so add 0.25-0.5% to regular rate for senior citizen calculations. Senior citizen rates typically range from 6.5% to 8.5% depending on bank and tenure.",
                },
                {
                  q: "How to calculate FD interest manually?",
                  a: "Use formula: A = P Ã— (1 + r/n)^(nÃ—t), where A = Maturity amount, P = Principal, r = Annual rate (as decimal), n = Compounding frequency, t = Time in years. For quarterly compounding: n=4, for monthly: n=12, for annual: n=1. Interest = A - P. However, using our FD calculator is much easier and provides instant accurate results.",
                },
                {
                  q: "Can I open FD online?",
                  a: "Yes, most banks allow opening FD online through net banking or mobile app. Process is quick and paperless. You can choose tenure, interest payout frequency, and get instant confirmation. Online FDs offer same rates as branch FDs. Some banks offer slightly higher rates for online FDs or waive processing fees.",
                },
                {
                  q: "FD vs recurring deposit (RD) - which is better?",
                  a: "FD is for lump sum investment, RD for regular monthly deposits. FD is better if you have lump sum money and want to invest at once. RD is better if you want to invest monthly from salary. FD typically offers slightly higher rates than RD for same tenure. Choose based on your cash flow - lump sum â†’ FD, monthly savings â†’ RD.",
                },
                {
                  q: "What is the maximum FD tenure?",
                  a: "Maximum FD tenure varies by bank, typically 5-10 years. Some banks offer FDs up to 20 years. Longer tenures usually have higher interest rates. However, very long tenures lock your money, reducing flexibility. Consider your goals - for 5+ year goals, longer tenure FD makes sense. For shorter goals, choose shorter tenure.",
                },
                {
                  q: "How to avoid TDS on FD?",
                  a: "Submit Form 15G (for individuals) or Form 15H (for senior citizens) to avoid TDS if your total income is below taxable limit. Form should be submitted before FD interest payment date. If TDS is already deducted, claim refund while filing ITR. Interest income is added to your total income and taxed as per your slab.",
                },
                {
                  q: "FD interest calculation method?",
                  a: "FD interest is calculated using compound interest formula. Interest compounds based on frequency - quarterly (every 3 months), monthly (every month), or annually (once a year). More frequent compounding = higher returns. Formula: A = P Ã— (1 + r/n)^(nÃ—t). Our FD calculator uses this formula for accurate calculations.",
                },
                {
                  q: "Can I change FD tenure after opening?",
                  a: "Generally, you cannot change FD tenure after opening. To change tenure, you need to break existing FD (with penalty) and open new FD with desired tenure. Some banks offer flexible FDs that allow changes, but rates may differ. Plan your tenure carefully before opening FD to avoid penalties.",
                },
                {
                  q: "FD for minors - how does it work?",
                  a: "Minors can have FDs opened by parents/guardians. Account operates until minor turns 18. Interest is clubbed with parent's income for tax purposes. Rates are same as regular FDs. FDs help save for child's future education, marriage, etc. Consider long-term FDs for children to benefit from higher rates and compounding.",
                },
                {
                  q: "What is auto-renewal in FD?",
                  a: "Auto-renewal means FD automatically renews at maturity at prevailing interest rates for same tenure. You receive maturity amount + interest, and new FD is created automatically. You can opt for auto-renewal when opening FD. Check if auto-renewal rates are competitive - you may get better rates by manually renewing.",
                },
                {
                  q: "FD vs PPF - which is better?",
                  a: "FD offers guaranteed returns (6-8%), liquidity (with penalty), and no tax deduction. PPF offers tax deduction under Section 80C, tax-free returns, but 15-year lock-in. For tax savings, PPF is better. For short-term goals and liquidity, FD is better. You can invest in both - PPF for long-term tax savings, FD for short-term goals.",
                },
                {
                  q: "How to calculate effective interest rate on FD?",
                  a: "Effective interest rate accounts for compounding. Formula: (1 + r/n)^n - 1, where r = annual rate, n = compounding frequency. For 7% annual rate with quarterly compounding: (1 + 0.07/4)^4 - 1 = 7.19% effective rate. Our FD calculator shows effective returns automatically, accounting for compounding frequency.",
                },
                {
                  q: "FD interest paid monthly vs quarterly?",
                  a: "Interest payout frequency affects total returns. Quarterly payout gives slightly higher returns than monthly due to compounding on interest. However, difference is minimal. Choose based on cash flow needs - if you need monthly income, choose monthly payout. If you want to reinvest, quarterly or cumulative (reinvested) is better.",
                },
                {
                  q: "Can I have multiple FDs?",
                  a: "Yes, you can have multiple FDs with same or different banks. This helps with liquidity - you can break one FD while others continue. Consider laddering strategy - open FDs with different maturity dates to have regular liquidity. Multiple FDs also help stay within DICGC insurance limit (â‚¹5L per bank).",
                },
                {
                  q: "FD calculator for tax saving FD?",
                  a: "Tax saving FD has 5-year lock-in, qualifies for Section 80C deduction up to â‚¹1.5L. Interest is taxable. Our FD calculator works for tax saving FDs - just set tenure to 5 years. Remember: Tax saving FD cannot be broken before 5 years, unlike regular FD. Compare returns with other 80C options like PPF, ELSS.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0"
                >
                  <h3 className="font-display font-bold text-ink dark:text-white mb-3 text-xl flex items-start gap-3">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                      Q{idx + 1}.
                    </span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg ml-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <SocialShareButtons
          title="FD Calculator India 2026 - Fixed Deposit Returns | InvestingPro"
          url="https://investingpro.in/calculators/fd"
          description="Free fd calculator india 2026 - fixed deposit returns - use this free tool from InvestingPro"
        />
        <FinancialDisclaimer variant="compact" className="mt-4" />
      </div>
    </div>
  );
}
