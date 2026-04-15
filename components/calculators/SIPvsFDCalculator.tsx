"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, TrendingUp, Clock, Percent } from "lucide-react";
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

export function SIPvsFDCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(50000);
  const [years, setYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);
  const [fdRate, setFdRate] = useState(7.5);
  const [taxSlabIndex, setTaxSlabIndex] = useState(2);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;

  const result = useMemo(() => {
    const months = years * 12;
    const totalInvested = monthlyAmount * months;

    // SIP: monthly compounding
    const monthlyRate = sipReturn / 100 / 12;
    const sipValue =
      monthlyAmount *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);
    const sipGains = sipValue - totalInvested;
    // LTCG on equity MF: 12.5% on gains above ₹1.25L/year (simplified)
    const sipTaxableGains = Math.max(0, sipGains - 125000);
    const sipTax = Math.round(sipTaxableGains * 0.125);
    const sipPostTax = Math.round(sipValue - sipTax);

    // FD: quarterly compounding, interest taxed yearly at slab rate
    // Simplified: compound quarterly, tax on annual interest
    const quarterlyRate = fdRate / 100 / 4;
    let fdCorpus = 0;
    for (let m = 0; m < months; m++) {
      fdCorpus += monthlyAmount;
      if ((m + 1) % 3 === 0) {
        fdCorpus *= 1 + quarterlyRate;
      }
    }
    const fdGains = fdCorpus - totalInvested;
    const fdTax = Math.round(fdGains * taxRate);
    const fdPostTax = Math.round(fdCorpus - fdTax);

    const winner =
      sipPostTax > fdPostTax ? "sip" : sipPostTax < fdPostTax ? "fd" : "tie";
    const diff = Math.abs(sipPostTax - fdPostTax);

    return {
      totalInvested,
      sipValue: Math.round(sipValue),
      sipGains: Math.round(sipGains),
      sipTax,
      sipPostTax,
      fdValue: Math.round(fdCorpus),
      fdGains: Math.round(fdGains),
      fdTax,
      fdPostTax,
      winner,
      diff,
    };
  }, [monthlyAmount, years, sipReturn, fdRate, taxRate]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Total Invested",
        optionA: formatINR(result.totalInvested),
        optionB: formatINR(result.totalInvested),
        winner: "tie" as const,
      },
      {
        label: "Gross Value",
        optionA: formatINR(result.sipValue),
        optionB: formatINR(result.fdValue),
        winner:
          result.sipValue > result.fdValue ? ("A" as const) : ("B" as const),
      },
      {
        label: "Total Gains",
        optionA: formatINR(result.sipGains),
        optionB: formatINR(result.fdGains),
        winner:
          result.sipGains > result.fdGains ? ("A" as const) : ("B" as const),
      },
      {
        label: "Tax Paid",
        optionA: formatINR(result.sipTax),
        optionB: formatINR(result.fdTax),
        winner:
          result.sipTax < result.fdTax
            ? ("A" as const)
            : result.sipTax > result.fdTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax Value",
        optionA: formatINR(result.sipPostTax),
        optionB: formatINR(result.fdPostTax),
        winner:
          result.sipPostTax > result.fdPostTax
            ? ("A" as const)
            : result.sipPostTax < result.fdPostTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Risk Level",
        optionA: "Moderate-High",
        optionB: "Very Low",
        winner: "B" as const,
      },
      {
        label: "Liquidity",
        optionA: "Anytime (T+2)",
        optionB: "Penalty on early exit",
        winner: "A" as const,
      },
      {
        label: "Inflation Hedge",
        optionA: "Yes (equity growth)",
        optionB: "No (fixed rate)",
        winner: "A" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "sip") {
      return {
        winner: "A" as const,
        title: `SIP gives ${formatINR(result.diff)} more after tax`,
        description: `Over ${years} years, SIP at ${sipReturn}% beats FD at ${fdRate}% by ${formatINR(result.diff)} post-tax. SIP also beats inflation, while FD often gives negative real returns after tax. Risk: SIP has short-term volatility but rewards patience.`,
      };
    } else if (result.winner === "fd") {
      return {
        winner: "B" as const,
        title: `FD gives ${formatINR(result.diff)} more after tax`,
        description: `At current rates, FD edges out SIP. This usually happens with very short time horizons or during bear markets. For 5+ year goals, SIP historically wins.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both options are nearly equal",
      description:
        "With these parameters, SIP and FD give similar returns. Consider your risk appetite — FD for safety, SIP for long-term growth potential.",
    };
  }, [result, years, sipReturn, fdRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(monthlyAmount)}/month × ${years} years = ${formatINR(result.totalInvested)} invested. SIP: ${formatINR(result.sipPostTax)} vs FD: ${formatINR(result.fdPostTax)} after tax.`,
    );
    if (result.winner === "sip") {
      ins.push(
        `SIP ka fayda: ${formatINR(result.diff)} zyada milega. Equity SIP pe LTCG tax sirf 12.5% hai ₹1.25L se upar — FD pe poora slab rate lagta hai (${taxRate * 100}%).`,
      );
    }
    if (years < 5) {
      ins.push(
        `${years} saal bahut kam hai SIP ke liye. Equity mein minimum 5-7 saal invest karein. Short term ke liye FD ya liquid fund better hai.`,
      );
    }
    if (fdRate > 8) {
      ins.push(
        `FD rate ${fdRate}% bahut achha hai — yeh special rate hai. Normal FD 6.5-7.5% hoti hai. Lock kar lo agar mil raha hai.`,
      );
    }
    ins.push(
      `Pro tip: SIP + FD dono rakho. Emergency fund FD mein (6 months expenses), baaki SIP mein. Yahi balanced approach hai.`,
    );
    return ins;
  }, [result, monthlyAmount, years, fdRate, taxRate]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inputs */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Investment Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Monthly Investment"
              icon={IndianRupee}
              value={monthlyAmount}
              onChange={setMonthlyAmount}
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
              min={1}
              max={30}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="Expected SIP Return (%)"
              icon={TrendingUp}
              value={sipReturn}
              onChange={setSipReturn}
              min={6}
              max={20}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="FD Interest Rate (%)"
              icon={Percent}
              value={fdRate}
              onChange={setFdRate}
              min={4}
              max={10}
              step={0.25}
              formatDisplay={(v) => `${v}%`}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tax Slab
              </label>
              <select
                value={taxSlabIndex}
                onChange={(e) => setTaxSlabIndex(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
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

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="SIP (Equity MF)"
            titleB="Fixed Deposit"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.sipPostTax)}
            valueLabelA="Post-Tax Value"
            valueB={formatINR(result.fdPostTax)}
            valueLabelB="Post-Tax Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="sip-vs-fd" variant="strip" />
      </div>
    </div>
  );
}
