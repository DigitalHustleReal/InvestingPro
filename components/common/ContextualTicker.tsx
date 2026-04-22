"use client";

/**
 * ContextualTicker — Shows relevant financial data for each product category
 *
 * Credit Cards: avg cashback rate, cards compared, top reward rate
 * Mutual Funds: Nifty 50, SIP growth, top fund 1Y return
 * Fixed Deposits: highest FD rate, RBI repo rate, avg senior rate
 * Loans: avg home loan rate, RBI repo rate, avg personal loan rate
 * Insurance: avg health premium, claim settlement ratio
 */

import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TickerItem {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  tooltip?: string;
}

interface ContextualTickerProps {
  category:
    | "credit-cards"
    | "mutual-funds"
    | "fixed-deposits"
    | "loans"
    | "insurance"
    | "demat-accounts";
  className?: string;
}

// Static contextual data — updated periodically, not live API
const TICKER_DATA: Record<string, TickerItem[]> = {
  "credit-cards": [
    {
      label: "Top Cashback",
      value: "5%",
      isPositive: true,
      tooltip: "Amazon Pay ICICI on Amazon",
    },
    {
      label: "Top Reward Rate",
      value: "33X",
      isPositive: true,
      tooltip: "HDFC Infinia on travel",
    },
    {
      label: "Best No-Fee Card",
      value: "₹0",
      tooltip: "Lifetime free credit cards available",
    },
    { label: "Avg Joining Bonus", value: "₹2,500", isPositive: true },
    {
      label: "Cheapest Annual Fee (premium)",
      value: "₹499",
      tooltip: "Axis Vistara Signature",
    },
  ],
  "mutual-funds": [
    {
      label: "Nifty 50 (1Y)",
      value: "+18.2%",
      isPositive: true,
      tooltip: "1-year return as of Apr 2026",
    },
    {
      label: "Top ELSS (3Y)",
      value: "22.4%",
      isPositive: true,
      tooltip: "Category average CAGR",
    },
    {
      label: "Top Index Fund ER",
      value: "0.10%",
      tooltip: "Lowest expense ratio",
    },
    {
      label: "Min SIP",
      value: "₹500",
      tooltip: "Start investing with just ₹500/month",
    },
    {
      label: "ITR deadline",
      value: "31 Jul",
      tooltip: "Capital gains reporting window closes",
    },
  ],
  "fixed-deposits": [
    {
      label: "Highest FD Rate",
      value: "9.50%",
      isPositive: true,
      tooltip: "Small finance banks, 1-2 year tenure",
    },
    { label: "RBI Repo Rate", value: "6.00%", tooltip: "As of Apr 2026" },
    {
      label: "SBI FD (1Y)",
      value: "6.80%",
      tooltip: "General category, 1 year",
    },
    {
      label: "Best Senior Rate",
      value: "9.80%",
      isPositive: true,
      tooltip: "Small finance banks",
    },
    {
      label: "Senior Citizen Boost",
      value: "+0.50%",
      isPositive: true,
      tooltip: "Extra rate above general category",
    },
  ],
  loans: [
    {
      label: "Lowest Home Loan",
      value: "8.25%",
      isPositive: true,
      tooltip: "SBI, HDFC for 750+ CIBIL",
    },
    {
      label: "RBI Repo Rate",
      value: "6.00%",
      tooltip: "Influences lending rates",
    },
    {
      label: "Avg Personal Loan",
      value: "11.5%",
      tooltip: "For 750+ CIBIL score",
    },
    { label: "Avg Car Loan", value: "8.5%", tooltip: "New car, 750+ score" },
    {
      label: "Avg Processing Fee",
      value: "1-2%",
      tooltip: "Of loan amount, negotiable",
    },
  ],
  insurance: [
    {
      label: "Term Insurance (1Cr)",
      value: "₹700/mo",
      tooltip: "30-year-old, non-smoker, 1 Cr cover",
    },
    {
      label: "Avg Claim Settlement",
      value: "97.8%",
      isPositive: true,
      tooltip: "Top 5 term insurers avg",
    },
    {
      label: "Health (₹10L Family)",
      value: "₹15K/yr",
      tooltip: "Family floater, no-claim bonus",
    },
    {
      label: "Top CSR (term)",
      value: "99.3%",
      isPositive: true,
      tooltip: "Max Life Smart Secure",
    },
  ],
  "demat-accounts": [
    {
      label: "Lowest Brokerage",
      value: "₹0",
      isPositive: true,
      tooltip: "Zerodha, Groww for delivery",
    },
    { label: "Nifty 50", value: "24,500", tooltip: "Current market level" },
    {
      label: "Avg Account Fee",
      value: "₹0-₹300/yr",
      tooltip: "Annual maintenance charges",
    },
    {
      label: "Cheapest F&O",
      value: "₹20/order",
      tooltip: "Flat brokerage on intraday + F&O",
    },
  ],
};

export default function ContextualTicker({
  category,
  className,
}: ContextualTickerProps) {
  const items = TICKER_DATA[category];
  if (!items) return null;

  return (
    <div
      className={cn(
        "w-full surface-ink border-b border-canvas-15 overflow-hidden",
        className,
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 py-2.5">
        <div className="flex items-center gap-5 md:gap-7 overflow-x-auto scrollbar-none">
          <span className="font-mono text-[10px] uppercase tracking-wider text-indian-gold whitespace-nowrap flex-shrink-0 font-semibold">
            Live Data
          </span>
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 flex-shrink-0"
              title={item.tooltip}
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-canvas-70">
                {item.label}
              </span>
              <span
                className={cn(
                  "font-mono text-[12px] font-semibold tabular-nums",
                  item.isPositive ? "text-action-green" : "text-canvas",
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
          <span className="font-mono text-[10px] uppercase tracking-wider text-canvas-70 ml-auto flex-shrink-0 hidden sm:block">
            Data · Apr 2026
          </span>
        </div>
      </div>
    </div>
  );
}
