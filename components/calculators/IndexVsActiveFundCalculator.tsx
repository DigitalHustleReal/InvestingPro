"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Clock,
  TrendingUp,
  Percent,
  BarChart3,
} from "lucide-react";
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

export function IndexVsActiveFundCalculator() {
  const [sipAmount, setSipAmount] = useState(25000);
  const [years, setYears] = useState(15);
  const [indexReturn, setIndexReturn] = useState(12);
  const [activeReturn, setActiveReturn] = useState(14);
  const [indexExpense, setIndexExpense] = useState(0.2);
  const [activeExpense, setActiveExpense] = useState(1.5);

  const result = useMemo(() => {
    const totalInvested = sipAmount * years * 12;

    const indexNetReturn = indexReturn - indexExpense;
    const activeNetReturn = activeReturn - activeExpense;

    const indexFV = futureValueSIP(sipAmount, indexNetReturn, years);
    const activeFV = futureValueSIP(sipAmount, activeNetReturn, years);

    const indexGain = indexFV - totalInvested;
    const activeGain = activeFV - totalInvested;

    const diff = Math.abs(indexFV - activeFV);
    const winner =
      indexFV > activeFV ? "index" : activeFV > indexFV ? "active" : "tie";

    // Expense cost over time
    const avgCorpusIndex = (totalInvested + indexFV) / 2;
    const avgCorpusActive = (totalInvested + activeFV) / 2;
    const totalIndexExpense = Math.round(
      (avgCorpusIndex * indexExpense * years) / 100,
    );
    const totalActiveExpense = Math.round(
      (avgCorpusActive * activeExpense * years) / 100,
    );

    // What if active fund delivers index-like returns (most do over 10Y)
    const activeAtIndexReturn = futureValueSIP(
      sipAmount,
      indexReturn - activeExpense,
      years,
    );

    // % of active funds beating index (SPIVA data for India)
    const activeFundsBeatIndex = years >= 10 ? 15 : years >= 5 ? 25 : 40;

    return {
      totalInvested,
      indexFV,
      activeFV,
      indexGain,
      activeGain,
      indexNetReturn: Math.round(indexNetReturn * 100) / 100,
      activeNetReturn: Math.round(activeNetReturn * 100) / 100,
      diff,
      winner,
      totalIndexExpense,
      totalActiveExpense,
      activeAtIndexReturn,
      activeFundsBeatIndex,
    };
  }, [
    sipAmount,
    years,
    indexReturn,
    activeReturn,
    indexExpense,
    activeExpense,
  ]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Final Value",
        optionA: formatINR(result.indexFV),
        optionB: formatINR(result.activeFV),
        winner:
          result.indexFV > result.activeFV ? ("A" as const) : ("B" as const),
      },
      {
        label: "Net Return",
        optionA: `${result.indexNetReturn}%`,
        optionB: `${result.activeNetReturn}%`,
        winner:
          result.indexNetReturn > result.activeNetReturn
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Expense Ratio",
        optionA: `${indexExpense}%`,
        optionB: `${activeExpense}%`,
        winner: "A" as const,
      },
      {
        label: "Total Expense Paid",
        optionA: formatINR(result.totalIndexExpense),
        optionB: formatINR(result.totalActiveExpense),
        winner: "A" as const,
      },
      {
        label: "Consistency",
        optionA: "Tracks Nifty/Sensex",
        optionB: "Fund manager dependent",
        winner: "A" as const,
      },
      {
        label: `Beat Index (${years}Y)`,
        optionA: "Matches index",
        optionB: `Only ${result.activeFundsBeatIndex}% beat`,
        winner: "A" as const,
      },
      {
        label: "Fund Manager Risk",
        optionA: "Zero (rule-based)",
        optionB: "High (manager exits)",
        winner: "A" as const,
      },
      {
        label: "Alpha Potential",
        optionA: "No alpha",
        optionB: "Can outperform",
        winner: "B" as const,
      },
    ],
    [result, indexExpense, activeExpense, years],
  );

  const verdict = useMemo(() => {
    if (result.winner === "active") {
      return {
        winner: "B" as const,
        title: `Active fund wins by ${formatINR(result.diff)} (assuming ${activeReturn}% return)`,
        description: `IF your active fund delivers ${activeReturn}% consistently, it beats the index by ${formatINR(result.diff)}. BUT only ${result.activeFundsBeatIndex}% of active funds beat the index over ${years} years (SPIVA India data). If your active fund delivers index-like returns, you'd get only ${formatINR(result.activeAtIndexReturn)} vs index fund's ${formatINR(result.indexFV)}.`,
      };
    }
    return {
      winner: "A" as const,
      title: `Index fund wins by ${formatINR(result.diff)} due to lower costs`,
      description: `Even with ${activeReturn}% gross return, the ${activeExpense}% expense ratio drags active fund below the index. Most active funds fail to beat the index consistently. Nifty 50 + Nifty Next 50 index combo is enough for most investors.`,
    };
  }, [result, activeReturn, activeExpense, years]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `SPIVA India data: Only ${result.activeFundsBeatIndex}% active large-cap funds beat Nifty 50 over ${years} years. Matlab 100 mein se ${100 - result.activeFundsBeatIndex} funds index se bhi kam dete hain.`,
    );
    ins.push(
      `Expense ratio ka fark: Index fund mein ${formatINR(result.totalIndexExpense)} vs Active fund mein ${formatINR(result.totalActiveExpense)} total fee jaata hai ${years} saal mein. Ye ${formatINR(result.totalActiveExpense - result.totalIndexExpense)} extra cost hai.`,
    );
    ins.push(
      `Smart strategy: Core (70%) mein Index fund (Nifty 50 + Nifty Next 50) + Satellite (30%) mein 1-2 proven active mid-cap funds. Best of both worlds.`,
    );
    if (activeReturn - indexReturn <= 2) {
      ins.push(
        `Active fund sirf ${activeReturn - indexReturn}% zyada return de raha hai but ${activeExpense}% expense charge kar raha hai. Net mein index better ya equal hai.`,
      );
    }
    ins.push(
      `Top index funds: UTI Nifty 50 (0.18%), Motilal Nifty Next 50 (0.25%), Navi Nifty 50 (0.06%). Expense ratio lowest rakhein.`,
    );
    return ins;
  }, [result, activeReturn, indexReturn, activeExpense, years]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Fund Comparison
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Monthly SIP Amount"
              icon={IndianRupee}
              value={sipAmount}
              onChange={setSipAmount}
              min={500}
              max={500000}
              step={500}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Investment Period (Years)"
              icon={Clock}
              value={years}
              onChange={setYears}
              min={3}
              max={30}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="Index Fund Return %"
              icon={BarChart3}
              value={indexReturn}
              onChange={setIndexReturn}
              min={8}
              max={18}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Active Fund Return %"
              icon={TrendingUp}
              value={activeReturn}
              onChange={setActiveReturn}
              min={8}
              max={22}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Index Expense Ratio %"
              icon={Percent}
              value={indexExpense}
              onChange={setIndexExpense}
              min={0.05}
              max={0.5}
              step={0.05}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Active Expense Ratio %"
              icon={Percent}
              value={activeExpense}
              onChange={setActiveExpense}
              min={0.5}
              max={2.5}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Index Fund"
            titleB="Active Fund"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.indexFV)}
            valueLabelA="Final Corpus"
            valueB={formatINR(result.activeFV)}
            valueLabelB="Final Corpus"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators
          currentSlug="index-vs-active-fund"
          variant="strip"
        />
      </div>
    </div>
  );
}
