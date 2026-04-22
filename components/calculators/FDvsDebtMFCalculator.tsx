"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Clock, Percent, TrendingUp } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { VSComparisonLayout } from "./shared/VSComparisonLayout";
import { AIInsight } from "./shared/AIInsight";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import { formatINR } from "./shared/charts";

const TAX_SLABS = [
  { label: "No Tax (0%)", rate: 0 },
  { label: "5% Slab", rate: 0.05 },
  { label: "20% Slab", rate: 0.2 },
  { label: "30% Slab", rate: 0.3 },
];

export function FDvsDebtMFCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [years, setYears] = useState(5);
  const [fdRate, setFdRate] = useState(7.5);
  const [debtMFReturn, setDebtMFReturn] = useState(7);
  const [taxSlabIndex, setTaxSlabIndex] = useState(2);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;

  const result = useMemo(() => {
    // FD: quarterly compounding, interest taxed yearly at slab rate
    const quarterlyRate = fdRate / 100 / 4;
    const quarters = years * 4;
    const fdGross = investmentAmount * Math.pow(1 + quarterlyRate, quarters);
    const fdGrossGains = fdGross - investmentAmount;
    // FD interest taxed every year at slab rate
    // Simplified: calculate effective post-tax return
    const fdEffectiveRate = fdRate * (1 - taxRate);
    const fdPostTax =
      investmentAmount * Math.pow(1 + fdEffectiveRate / 100 / 4, quarters);
    const fdTax = Math.round(fdGross - fdPostTax);

    // Debt MF: compounding, taxed at slab rate on redemption (post April 2023)
    const debtMFGross =
      investmentAmount * Math.pow(1 + debtMFReturn / 100, years);
    const debtMFGains = debtMFGross - investmentAmount;
    // Post April 2023: Debt MF gains taxed at slab rate (no indexation)
    const debtMFTax = Math.round(debtMFGains * taxRate);
    const debtMFPostTax = Math.round(debtMFGross - debtMFTax);

    const fdPostTaxRound = Math.round(fdPostTax);
    const winner =
      debtMFPostTax > fdPostTaxRound
        ? "debtmf"
        : debtMFPostTax < fdPostTaxRound
          ? "fd"
          : "tie";
    const diff = Math.abs(debtMFPostTax - fdPostTaxRound);

    // Effective post-tax CAGR
    const fdCAGR =
      fdPostTaxRound > 0
        ? (Math.pow(fdPostTaxRound / investmentAmount, 1 / years) - 1) * 100
        : 0;
    const debtMFCAGR =
      debtMFPostTax > 0
        ? (Math.pow(debtMFPostTax / investmentAmount, 1 / years) - 1) * 100
        : 0;

    return {
      investmentAmount,
      fdGross: Math.round(fdGross),
      fdGrossGains: Math.round(fdGrossGains),
      fdTax,
      fdPostTax: fdPostTaxRound,
      fdCAGR: Math.round(fdCAGR * 100) / 100,
      debtMFGross: Math.round(debtMFGross),
      debtMFGains: Math.round(debtMFGains),
      debtMFTax,
      debtMFPostTax,
      debtMFCAGR: Math.round(debtMFCAGR * 100) / 100,
      winner,
      diff,
    };
  }, [investmentAmount, years, fdRate, debtMFReturn, taxRate]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Investment",
        optionA: formatINR(result.investmentAmount),
        optionB: formatINR(result.investmentAmount),
        winner: "tie" as const,
      },
      {
        label: "Gross Value",
        optionA: formatINR(result.fdGross),
        optionB: formatINR(result.debtMFGross),
        winner:
          result.fdGross > result.debtMFGross ? ("A" as const) : ("B" as const),
      },
      {
        label: "Tax Paid",
        optionA: formatINR(result.fdTax),
        optionB: formatINR(result.debtMFTax),
        winner:
          result.fdTax < result.debtMFTax
            ? ("A" as const)
            : result.fdTax > result.debtMFTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax Value",
        optionA: formatINR(result.fdPostTax),
        optionB: formatINR(result.debtMFPostTax),
        winner:
          result.fdPostTax > result.debtMFPostTax
            ? ("A" as const)
            : result.fdPostTax < result.debtMFPostTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax CAGR",
        optionA: `${result.fdCAGR}%`,
        optionB: `${result.debtMFCAGR}%`,
        winner:
          result.fdCAGR > result.debtMFCAGR
            ? ("A" as const)
            : result.fdCAGR < result.debtMFCAGR
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Tax Timing",
        optionA: "Yearly (TDS on interest)",
        optionB: "On redemption only",
        winner: "B" as const,
      },
      {
        label: "Liquidity",
        optionA: "Penalty 0.5-1%",
        optionB: "T+1 day (exit load varies)",
        winner: "B" as const,
      },
      {
        label: "Risk",
        optionA: "Guaranteed (up to ₹5L DICGC)",
        optionB: "Low (credit + interest rate risk)",
        winner: "A" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "debtmf") {
      return {
        winner: "B" as const,
        title: `Debt MF gives ${formatINR(result.diff)} more after tax`,
        description: `Debt MF wins because tax is deferred to redemption — money compounds longer. FD interest is taxed every year, reducing the compounding base. Post-April 2023, both are taxed at slab rate, but Debt MF's deferral advantage remains.`,
      };
    } else if (result.winner === "fd") {
      return {
        winner: "A" as const,
        title: `FD gives ${formatINR(result.diff)} more after tax`,
        description: `FD wins because its higher rate (${fdRate}%) overcomes the tax deferral advantage of Debt MF (${debtMFReturn}%). FD also has zero credit risk up to ₹5L (DICGC insured).`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both options give similar returns",
      description:
        "With similar rates and slab taxation, the difference is minimal. Choose FD for safety, Debt MF for liquidity and diversification.",
    };
  }, [result, fdRate, debtMFReturn]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(investmentAmount)} pe ${years} saal mein — FD: ${formatINR(result.fdPostTax)} vs Debt MF: ${formatINR(result.debtMFPostTax)} after tax.`,
    );
    ins.push(
      `April 2023 ke baad Debt MF pe indexation benefit hat gaya. Ab dono pe slab rate (${taxRate * 100}%) se tax lagta hai. Phir bhi Debt MF mein tax deferral ka fayda hai.`,
    );
    if (taxRate >= 0.3) {
      ins.push(
        `30% slab mein ho toh FD bahut expensive hai tax-wise. ₹1L interest pe ₹30K tax + ₹1,200 TDS hassle. Debt MF mein redeem tab karo jab tax bracket low ho.`,
      );
    }
    if (investmentAmount > 500000) {
      ins.push(
        `${formatINR(investmentAmount)} ek bank mein mat rakho. DICGC sirf ₹5L tak cover karta hai. Split across banks ya Debt MF mein diversify karo.`,
      );
    }
    ins.push(
      `Pro tip: Short term (< 1 year) ke liye liquid fund, 1-3 years ke liye short-duration fund, 3+ years ke liye FD ya corporate bond fund consider karo.`,
    );
    return ins;
  }, [result, investmentAmount, years, taxRate]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Investment Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Investment Amount"
              icon={IndianRupee}
              value={investmentAmount}
              onChange={setInvestmentAmount}
              min={50000}
              max={10000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Investment Period (Years)"
              icon={Clock}
              value={years}
              onChange={setYears}
              min={1}
              max={10}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="FD Interest Rate (%)"
              icon={Percent}
              value={fdRate}
              onChange={setFdRate}
              min={5}
              max={9}
              step={0.25}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Debt MF Expected Return (%)"
              icon={TrendingUp}
              value={debtMFReturn}
              onChange={setDebtMFReturn}
              min={5}
              max={9}
              step={0.25}
              formatDisplay={(v) => `${v}%`}
            />
            <div>
              <label className="text-sm font-medium text-ink mb-1 block">
                Tax Slab
              </label>
              <select
                value={taxSlabIndex}
                onChange={(e) => setTaxSlabIndex(Number(e.target.value))}
                className="w-full rounded-lg border border-ink/10 px-3 py-2 text-sm bg-white"
              >
                {TAX_SLABS.map((s, i) => (
                  <option key={i} value={i}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Fixed Deposit"
            titleB="Debt Mutual Fund"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.fdPostTax)}
            valueLabelA="Post-Tax Value"
            valueB={formatINR(result.debtMFPostTax)}
            valueLabelB="Post-Tax Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="fd-vs-debt-mf" variant="strip" />
      </div>
    </div>
  );
}
