"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, HelpCircle } from "lucide-react";

// ─── Rating criteria config ────────────────────────────────────────────────
// Weights are expressed as percentages (must sum to 100).
// categoryOverrides let you pass different criteria per product type.

export interface RatingCriterion {
  label: string;
  weight: number; // 0–100 (percentage)
  description?: string;
}

const DEFAULT_CRITERIA: RatingCriterion[] = [
  {
    label: "Fees & charges",
    weight: 30,
    description: "Annual fee, joining fee, hidden charges, interest rate",
  },
  {
    label: "Features & benefits",
    weight: 25,
    description: "Rewards, cashback, lounge access, insurance, perks",
  },
  {
    label: "Customer experience",
    weight: 20,
    description: "App quality, support responsiveness, grievance resolution",
  },
  {
    label: "Eligibility & accessibility",
    weight: 15,
    description: "Income threshold, credit score requirement, ease of approval",
  },
  {
    label: "Value for money",
    weight: 10,
    description: "Overall ROI relative to fees paid",
  },
];

const CATEGORY_CRITERIA: Record<string, RatingCriterion[]> = {
  credit_card: DEFAULT_CRITERIA,
  mutual_fund: [
    {
      label: "Returns (1Y/3Y/5Y)",
      weight: 40,
      description:
        "Absolute and benchmark-relative returns across time periods",
    },
    {
      label: "Expense ratio",
      weight: 20,
      description: "Total expense ratio — lower is better",
    },
    {
      label: "Risk-adjusted returns",
      weight: 20,
      description: "Sharpe ratio and volatility relative to category",
    },
    {
      label: "Fund size (AUM)",
      weight: 10,
      description: "Assets under management — proxy for stability",
    },
    {
      label: "Fund manager track record",
      weight: 10,
      description: "Manager tenure and historical consistency",
    },
  ],
  loan: [
    {
      label: "Interest rate",
      weight: 40,
      description: "Effective annual rate — lower is better",
    },
    {
      label: "Processing & hidden fees",
      weight: 20,
      description: "Processing fee, prepayment penalty, foreclosure charges",
    },
    {
      label: "Loan amount & tenure",
      weight: 15,
      description: "Range of amounts available and maximum repayment period",
    },
    {
      label: "Eligibility",
      weight: 15,
      description: "Minimum salary, credit score, and documentation required",
    },
    {
      label: "Lender trust",
      weight: 10,
      description: "RBI regulation, grievance history, customer ratings",
    },
  ],
  insurance: [
    {
      label: "Claim settlement ratio",
      weight: 35,
      description:
        "Percentage of claims paid vs filed — from IRDAI annual report",
    },
    {
      label: "Premium affordability",
      weight: 25,
      description: "Premium amount relative to sum assured and coverage",
    },
    {
      label: "Coverage & benefits",
      weight: 20,
      description: "Sum assured, riders, add-ons, exclusions, waiting period",
    },
    {
      label: "Customer experience",
      weight: 10,
      description: "Complaint ratio, app quality, claim process ease",
    },
    {
      label: "Insurer financial strength",
      weight: 10,
      description: "Solvency ratio, AUM, years of operation",
    },
  ],
  fixed_deposit: [
    {
      label: "Interest rate",
      weight: 40,
      description: "Offered rate for general and senior citizen categories",
    },
    {
      label: "Bank/NBFC safety",
      weight: 25,
      description:
        "RBI-regulated bank vs NBFC, DICGC insurance coverage (₹5L limit)",
    },
    {
      label: "Tenure flexibility",
      weight: 15,
      description: "Range of tenures offered and premature withdrawal penalty",
    },
    {
      label: "Tax benefits",
      weight: 10,
      description: "Section 80C eligibility for tax-saving FDs",
    },
    {
      label: "Ease of booking",
      weight: 10,
      description: "Online booking, auto-renewal, interest payout options",
    },
  ],
  demat_account: [
    {
      label: "Brokerage charges",
      weight: 35,
      description:
        "Per-trade brokerage for equity delivery, intraday, F&O, currency",
    },
    {
      label: "Platform & tools",
      weight: 25,
      description: "Trading platform quality, charting, research, mobile app",
    },
    {
      label: "Account charges",
      weight: 15,
      description: "AMC, DP charges, pledge charges, fund transfer fees",
    },
    {
      label: "Product range",
      weight: 15,
      description:
        "Stocks, MF, IPO, bonds, ETFs, commodities, currency — breadth of offerings",
    },
    {
      label: "Regulatory compliance",
      weight: 10,
      description: "SEBI registration, NSE/BSE membership, investor grievances",
    },
  ],
  ppf_nps: [
    {
      label: "Returns & interest rate",
      weight: 30,
      description:
        "Current government-declared rate (PPF) or fund performance (NPS)",
    },
    {
      label: "Tax benefits",
      weight: 30,
      description:
        "Section 80C, 80CCD(1B) deduction, EEE status, annuity taxation",
    },
    {
      label: "Lock-in & liquidity",
      weight: 20,
      description: "Lock-in period, partial withdrawal rules, exit options",
    },
    {
      label: "Safety & government backing",
      weight: 10,
      description: "Sovereign guarantee (PPF) or PFRDA regulation (NPS)",
    },
    {
      label: "Ease of operation",
      weight: 10,
      description:
        "Online access, contribution flexibility, account portability",
    },
  ],
};

// ─── Props ──────────────────────────────────────────────────────────────────

interface RatingExplainerProps {
  /** "tooltip" renders a small [?] trigger; "inline" renders the full card */
  variant: "tooltip" | "inline";
  /** Product category — drives which criteria are shown */
  category?:
    | "credit_card"
    | "mutual_fund"
    | "loan"
    | "insurance"
    | "fixed_deposit"
    | "demat_account"
    | "ppf_nps";
  /** Pass custom criteria to override defaults */
  criteria?: RatingCriterion[];
  className?: string;
}

// ─── Shared progress bar ─────────────────────────────────────────────────────

function WeightBar({ weight }: { weight: number }) {
  return (
    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 rounded-full"
        style={{ width: `${weight}%` }}
      />
    </div>
  );
}

// ─── Tooltip variant ─────────────────────────────────────────────────────────

function RatingTooltip({ criteria }: { criteria: RatingCriterion[] }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="How we rate this product"
            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:text-green-600 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="w-72 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl z-50"
        >
          <div className="space-y-3">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                How we rate this product
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                5-point scale based on objective data
              </p>
            </div>

            <div className="space-y-2.5">
              {criteria.map((c) => (
                <div key={c.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] text-gray-700 dark:text-gray-300 font-medium">
                      {c.label}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 tabular-nums">
                      {c.weight}%
                    </span>
                  </div>
                  <WeightBar weight={c.weight} />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
              <Link
                href="/methodology"
                className="block text-[11px] text-green-600 hover:text-green-700 font-medium"
              >
                Full methodology &rarr;
              </Link>
              <Link
                href="/how-we-make-money"
                className="block text-[11px] text-green-600 hover:text-green-700 font-medium"
              >
                How we make money &rarr;
              </Link>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Inline variant ──────────────────────────────────────────────────────────

function RatingInline({
  criteria,
  className = "",
}: {
  criteria: RatingCriterion[];
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            How We Rate Products
          </h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Our ratings are based on objective analysis of publicly available
            data. No partner pays for a higher ranking.
          </p>
        </div>
        <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      </div>

      {/* Criteria with weight bars */}
      <div className="space-y-3 mb-5">
        {criteria.map((c) => (
          <div key={c.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {c.label}
              </span>
              <span className="text-xs font-semibold text-gray-500 tabular-nums">
                {c.weight}%
              </span>
            </div>
            <WeightBar weight={c.weight} />
            {expanded && c.description && (
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {c.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Toggle details */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-xs text-green-600 hover:text-green-700 font-medium mb-4 transition-colors"
      >
        {expanded ? "Hide details" : "Show criteria details"}
      </button>

      {/* Independence statement */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Editorial independence:
          </span>{" "}
          Our editorial team operates independently from our commercial
          partnerships. Ratings are updated regularly. Compensation from
          partners does not influence our scores.
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Link
          href="/methodology"
          className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Read our full methodology &rarr;
        </Link>
        <Link
          href="/how-we-make-money"
          className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          How we make money &rarr;
        </Link>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function RatingExplainer({
  variant,
  category,
  criteria,
  className,
}: RatingExplainerProps) {
  const resolved: RatingCriterion[] =
    criteria ??
    (category ? CATEGORY_CRITERIA[category] : undefined) ??
    DEFAULT_CRITERIA;

  if (variant === "tooltip") {
    return <RatingTooltip criteria={resolved} />;
  }

  return <RatingInline criteria={resolved} className={className} />;
}
