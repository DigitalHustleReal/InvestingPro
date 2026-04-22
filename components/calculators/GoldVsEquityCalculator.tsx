"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Clock, TrendingUp, Gem, BarChart3 } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { VSComparisonLayout } from "./shared/VSComparisonLayout";
import { AIInsight } from "./shared/AIInsight";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import { formatINR } from "./shared/charts";

function futureValueSIP(
  monthly: number,
  annualRate: number,
  years: number,
): number {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

export function GoldVsEquityCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(20000);
  const [years, setYears] = useState(15);
  const [goldReturn, setGoldReturn] = useState(10);
  const [equityReturn, setEquityReturn] = useState(12);

  const result = useMemo(() => {
    const totalInvested = monthlyInvestment * years * 12;

    // Gold
    const goldFV = futureValueSIP(monthlyInvestment, goldReturn, years);
    const goldGain = goldFV - totalInvested;
    // Gold LTCG: 12.5% on gains (after 3 years for physical, 1 year for gold ETF/MF)
    const goldTax = Math.round(goldGain * 0.125);
    const goldPostTax = goldFV - goldTax;

    // Equity
    const equityFV = futureValueSIP(monthlyInvestment, equityReturn, years);
    const equityGain = equityFV - totalInvested;
    // Equity LTCG: 12.5% on gains above ₹1.25L per year
    const equityExemption = 125000;
    const equityTaxableGain = Math.max(0, equityGain - equityExemption);
    const equityTax = Math.round(equityTaxableGain * 0.125);
    const equityPostTax = equityFV - equityTax;

    const diff = equityPostTax - goldPostTax;
    const winner = diff > 0 ? "equity" : diff < 0 ? "gold" : "tie";

    // CAGR post-tax
    const goldCAGR =
      totalInvested > 0
        ? (Math.pow(goldPostTax / totalInvested, 1 / years) - 1) * 100
        : 0;
    const equityCAGR =
      totalInvested > 0
        ? (Math.pow(equityPostTax / totalInvested, 1 / years) - 1) * 100
        : 0;

    return {
      totalInvested,
      goldFV,
      equityFV,
      goldTax,
      equityTax,
      goldPostTax,
      equityPostTax,
      goldGain,
      equityGain,
      diff: Math.abs(diff),
      winner,
      goldCAGR: Math.round(goldCAGR * 100) / 100,
      equityCAGR: Math.round(equityCAGR * 100) / 100,
    };
  }, [monthlyInvestment, years, goldReturn, equityReturn]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Final Value",
        optionA: formatINR(result.goldFV),
        optionB: formatINR(result.equityFV),
        winner:
          result.goldFV > result.equityFV
            ? ("A" as const)
            : result.equityFV > result.goldFV
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Total Gain",
        optionA: formatINR(result.goldGain),
        optionB: formatINR(result.equityGain),
        winner:
          result.goldGain > result.equityGain
            ? ("A" as const)
            : result.equityGain > result.goldGain
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Tax on Gains",
        optionA: formatINR(result.goldTax),
        optionB: formatINR(result.equityTax),
        winner:
          result.goldTax < result.equityTax
            ? ("A" as const)
            : result.equityTax < result.goldTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax Value",
        optionA: formatINR(result.goldPostTax),
        optionB: formatINR(result.equityPostTax),
        winner:
          result.goldPostTax > result.equityPostTax
            ? ("A" as const)
            : result.equityPostTax > result.goldPostTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax CAGR",
        optionA: `${result.goldCAGR}%`,
        optionB: `${result.equityCAGR}%`,
        winner:
          result.goldCAGR > result.equityCAGR
            ? ("A" as const)
            : result.equityCAGR > result.goldCAGR
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Volatility",
        optionA: "Low-Medium",
        optionB: "High",
        winner: "A" as const,
      },
      {
        label: "Liquidity",
        optionA: "Medium (Physical: Low)",
        optionB: "High (Instant sell)",
        winner: "B" as const,
      },
      {
        label: "Inflation Hedge",
        optionA: "Strong (crisis hedge)",
        optionB: "Long-term wealth",
        winner: "tie" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "equity") {
      return {
        winner: "B" as const,
        title: `Equity wins by ${formatINR(result.diff)} post-tax over ${years} years`,
        description: `With ${equityReturn}% returns, equity SIP creates ${formatINR(result.diff)} more wealth than gold after tax. Equity gets ₹1.25L LTCG exemption per year. But gold provides stability during market crashes — ideal to hold 10-15% in gold for portfolio diversification.`,
      };
    } else if (result.winner === "gold") {
      return {
        winner: "A" as const,
        title: `Gold wins by ${formatINR(result.diff)} post-tax over ${years} years`,
        description: `At ${goldReturn}% gold return vs ${equityReturn}% equity, gold comes out ahead after tax. This is unusual — gold typically trails equity over 15+ years. Consider increasing equity allocation for long-term wealth creation.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both assets deliver similar post-tax returns",
      description:
        "Rare scenario! Diversify — hold 70-80% in equity and 10-15% in gold (via SGB or Gold ETF). Gold hedges against equity crashes and currency depreciation.",
    };
  }, [result, years, equityReturn, goldReturn]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(monthlyInvestment)}/month pe ${years} saal mein Gold: ${formatINR(result.goldPostTax)} vs Equity: ${formatINR(result.equityPostTax)} (post-tax). Difference: ${formatINR(result.diff)}.`,
    );
    if (result.winner === "equity") {
      ins.push(
        `Equity long-term mein almost always gold ko beat karta hai. Sensex ne last 20 years mein ~12-14% CAGR diya vs Gold ka ~10-11%.`,
      );
    }
    ins.push(
      `Smart move: Portfolio mein 10-15% gold rakhein (SGB best — 2.5% interest + tax-free maturity). Baaki equity mein SIP karein.`,
    );
    if (years >= 20) {
      ins.push(
        `${years} saal ka horizon hai toh equity clear winner hai. Compounding effect ${years}+ years mein exponential hota hai.`,
      );
    }
    ins.push(
      `Physical gold avoid karein — making charges (8-25%) + locker rent + theft risk. Gold ETF ya SGB better options hain.`,
    );
    return ins;
  }, [result, monthlyInvestment, years]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inputs */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Investment Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Monthly Investment"
              icon={IndianRupee}
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={1000}
              max={500000}
              step={1000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Investment Period (Years)"
              icon={Clock}
              value={years}
              onChange={setYears}
              min={5}
              max={30}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="Gold Expected Return (%)"
              icon={Gem}
              value={goldReturn}
              onChange={setGoldReturn}
              min={5}
              max={18}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Equity Expected Return (%)"
              icon={BarChart3}
              value={equityReturn}
              onChange={setEquityReturn}
              min={8}
              max={20}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
          </div>
          <div className="mt-5 p-3 bg-action-green/10 border border-green-100 rounded-sm">
            <p className="text-xs text-green-800">
              <strong>Total Invested:</strong> {formatINR(result.totalInvested)}{" "}
              over {years} years
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Gold Investment"
            titleB="Equity (Index Fund)"
            colorA="#d97706"
            colorB="#166534"
            valueA={formatINR(result.goldPostTax)}
            valueLabelA="Post-Tax Value"
            valueB={formatINR(result.equityPostTax)}
            valueLabelB="Post-Tax Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="gold-vs-equity" variant="strip" />
      </div>
    </div>
  );
}
