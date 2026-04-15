"use client";

import Link from "next/link";
import { Calculator, ArrowRight, CheckCircle2 } from "lucide-react";

interface CalculatorInfo {
  name: string;
  description: string;
  href: string;
  bullets: string[];
}

const CALCULATOR_MAP: Record<string, CalculatorInfo> = {
  "credit-cards": {
    name: "EMI Calculator",
    description: "Calculate your credit card EMI conversion",
    href: "/calculators/emi",
    bullets: [
      "Convert large purchases into easy EMIs",
      "Compare tenure options (3, 6, 9, 12 months)",
      "See total interest you'll pay upfront",
    ],
  },
  tax: {
    name: "Old vs New Tax Regime",
    description: "Which regime saves you more?",
    href: "/calculators/old-vs-new-tax",
    bullets: [
      "Side-by-side comparison of both regimes",
      "Factors in Section 80C, HRA, NPS deductions",
      "Shows exact savings with recommended regime",
    ],
  },
  loans: {
    name: "Home Loan EMI Calculator",
    description: "Calculate your monthly EMI",
    href: "/calculators/home-loan-emi",
    bullets: [
      "Instant EMI for any loan amount & tenure",
      "See total interest vs principal breakup",
      "Compare prepayment savings scenarios",
    ],
  },
  "mutual-funds": {
    name: "SIP Calculator",
    description: "See how your SIP grows",
    href: "/calculators/sip",
    bullets: [
      "Project corpus for any monthly SIP amount",
      "Visualise the power of compounding over time",
      "Compare step-up SIP vs regular SIP",
    ],
  },
  "fixed-deposits": {
    name: "FD Calculator",
    description: "Compare FD returns across banks",
    href: "/calculators/fd",
    bullets: [
      "Calculate maturity amount for any bank FD",
      "Compare cumulative vs non-cumulative options",
      "See post-tax returns after TDS",
    ],
  },
  insurance: {
    name: "Term vs Endowment Calculator",
    description: "Compare premium and returns",
    href: "/calculators/term-vs-endowment",
    bullets: [
      "Compare term plan vs endowment premiums",
      "See how investing the difference grows",
      "Find the better option for your age & cover",
    ],
  },
  retirement: {
    name: "Retirement Calculator",
    description: "How much do you need?",
    href: "/calculators/retirement",
    bullets: [
      "Factor in inflation-adjusted expenses",
      "Account for EPF, NPS, and PPF contributions",
      "See your retirement readiness score",
    ],
  },
  stocks: {
    name: "Brokerage Calculator",
    description: "Compare broker charges",
    href: "/calculators/brokerage",
    bullets: [
      "Calculate exact charges per trade",
      "Compare Zerodha, Groww, Angel One fees",
      "See STT, GST, and stamp duty breakup",
    ],
  },
  "investing-basics": {
    name: "Compound Interest Calculator",
    description: "See the power of compounding",
    href: "/calculators/compound-interest",
    bullets: [
      "Visualise how your money multiplies over time",
      "Compare monthly, quarterly & annual compounding",
      "See the impact of starting early vs delaying",
    ],
  },
};

export default function EmbeddedCalculator({ category }: { category: string }) {
  const calc = CALCULATOR_MAP[category];
  if (!calc) return null;

  return (
    <div className="my-10 mx-auto max-w-2xl rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 border-l-4 border-l-green-600 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg bg-green-100 dark:bg-green-900/60">
          <Calculator className="w-5 h-5 text-green-700 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400 mb-1">
            Try Our Calculator
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-heading">
            {calc.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {calc.description}
          </p>

          <ul className="space-y-2 mb-5">
            {calc.bullets.map((bullet, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <Link
            href={calc.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
          >
            Try Calculator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
