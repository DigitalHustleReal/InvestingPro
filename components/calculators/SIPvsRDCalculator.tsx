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

export function SIPvsRDCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [years, setYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);
  const [rdRate, setRdRate] = useState(7.0);
  const [taxSlabIndex, setTaxSlabIndex] = useState(2);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;

  const result = useMemo(() => {
    const months = years * 12;
    const totalInvested = monthlyAmount * months;

    // SIP: monthly compounding (equity mutual fund)
    const sipMonthlyRate = sipReturn / 100 / 12;
    const sipValue =
      monthlyAmount *
      ((Math.pow(1 + sipMonthlyRate, months) - 1) / sipMonthlyRate) *
      (1 + sipMonthlyRate);
    const sipGains = sipValue - totalInvested;

    // SIP tax: LTCG 12.5% on gains above ₹1.25L (equity MF held > 1 year)
    const sipExemption = 125000;
    const sipTaxableGains = Math.max(0, sipGains - sipExemption);
    const sipTax = Math.round(sipTaxableGains * 0.125);
    const sipPostTax = Math.round(sipValue - sipTax);
    const sipWealth = sipPostTax - totalInvested;

    // RD: quarterly compounding on cumulative deposits
    // RD interest is compounded quarterly
    const rdQuarterlyRate = rdRate / 100 / 4;
    let rdValue = 0;
    for (let m = 0; m < months; m++) {
      rdValue += monthlyAmount;
      // Compound quarterly
      if ((m + 1) % 3 === 0) {
        rdValue *= 1 + rdQuarterlyRate;
      }
    }
    const rdGains = rdValue - totalInvested;

    // RD tax: interest taxed at slab rate (like FD)
    const rdTax = Math.round(rdGains * taxRate);
    const rdPostTax = Math.round(rdValue - rdTax);
    const rdWealth = rdPostTax - totalInvested;

    // CAGR calculations
    const sipCAGR =
      totalInvested > 0
        ? (Math.pow(sipPostTax / totalInvested, 1 / years) - 1) * 100
        : 0;
    const rdCAGR =
      totalInvested > 0
        ? (Math.pow(rdPostTax / totalInvested, 1 / years) - 1) * 100
        : 0;

    const winner =
      sipPostTax > rdPostTax ? "sip" : sipPostTax < rdPostTax ? "rd" : "tie";
    const diff = Math.abs(sipPostTax - rdPostTax);

    // Multiplier
    const sipMultiplier = totalInvested > 0 ? sipPostTax / totalInvested : 0;
    const rdMultiplier = totalInvested > 0 ? rdPostTax / totalInvested : 0;

    return {
      totalInvested,
      sipValue: Math.round(sipValue),
      sipGains: Math.round(sipGains),
      sipTax,
      sipPostTax,
      sipWealth,
      sipCAGR,
      sipMultiplier,
      rdValue: Math.round(rdValue),
      rdGains: Math.round(rdGains),
      rdTax,
      rdPostTax,
      rdWealth,
      rdCAGR,
      rdMultiplier,
      winner,
      diff,
    };
  }, [monthlyAmount, years, sipReturn, rdRate, taxRate]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Total Invested",
        optionA: formatINR(result.totalInvested),
        optionB: formatINR(result.totalInvested),
        winner: "tie" as const,
      },
      {
        label: "Maturity Value",
        optionA: formatINR(result.sipValue),
        optionB: formatINR(result.rdValue),
        winner:
          result.sipValue > result.rdValue
            ? ("A" as const)
            : result.sipValue < result.rdValue
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Wealth Created",
        optionA: formatINR(result.sipWealth),
        optionB: formatINR(result.rdWealth),
        winner:
          result.sipWealth > result.rdWealth
            ? ("A" as const)
            : result.sipWealth < result.rdWealth
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Tax Paid",
        optionA: formatINR(result.sipTax),
        optionB: formatINR(result.rdTax),
        winner:
          result.sipTax < result.rdTax
            ? ("A" as const)
            : result.sipTax > result.rdTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax Value",
        optionA: formatINR(result.sipPostTax),
        optionB: formatINR(result.rdPostTax),
        winner:
          result.sipPostTax > result.rdPostTax
            ? ("A" as const)
            : result.sipPostTax < result.rdPostTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Money Multiplier",
        optionA: `${result.sipMultiplier.toFixed(1)}x`,
        optionB: `${result.rdMultiplier.toFixed(1)}x`,
        winner:
          result.sipMultiplier > result.rdMultiplier
            ? ("A" as const)
            : result.sipMultiplier < result.rdMultiplier
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
        label: "Tax Efficiency",
        optionA: "LTCG 12.5% (>₹1.25L)",
        optionB: "Slab rate on interest",
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
        title: `SIP creates ${formatINR(result.diff)} more wealth after tax`,
        description: `Over ${years} years, SIP at ${sipReturn}% expected return beats RD at ${rdRate}% by ${formatINR(result.diff)} post-tax. Your money grows ${result.sipMultiplier.toFixed(1)}x with SIP vs ${result.rdMultiplier.toFixed(1)}x with RD. SIP also has better tax treatment — LTCG 12.5% vs slab rate.`,
      };
    } else if (result.winner === "rd") {
      return {
        winner: "B" as const,
        title: `RD gives ${formatINR(result.diff)} more after tax`,
        description: `With these parameters, RD edges out SIP. This usually happens with short durations or conservative SIP return expectations. For 5+ year goals, equity SIP historically outperforms.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both options give nearly equal returns",
      description:
        "Returns are similar. Choose SIP for long-term wealth creation with higher volatility, or RD for guaranteed safe returns with no market risk.",
    };
  }, [result, years, sipReturn, rdRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(monthlyAmount)}/month × ${years} saal = ${formatINR(result.totalInvested)} invest kiya. SIP: ${formatINR(result.sipPostTax)} vs RD: ${formatINR(result.rdPostTax)} after tax.`,
    );

    if (result.winner === "sip" && result.diff > 100000) {
      ins.push(
        `Lambe time ke liye SIP best hai — ${formatINR(result.diff)} zyada milega! Equity SIP pe LTCG sirf 12.5% hai ₹1.25L ke upar, RD pe poora slab rate (${taxRate * 100}%) lagta hai.`,
      );
    }

    if (years <= 3) {
      ins.push(
        `${years} saal bahut kam hai SIP ke liye — market mein short term volatility hoti hai. 3 saal se kam ke goals ke liye RD ya liquid fund better hai. SIP ke liye minimum 5 saal rakho.`,
      );
    }

    if (years >= 10) {
      ins.push(
        `${years} saal mein compounding ka magic dikhta hai! SIP ne paisa ${result.sipMultiplier.toFixed(1)}x kar diya. RD mein sirf ${result.rdMultiplier.toFixed(1)}x hua — inflation beat nahi karta.`,
      );
    }

    if (sipReturn >= 15) {
      ins.push(
        `${sipReturn}% return expect kar rahe ho — yeh aggressive hai. Nifty 50 ka 15-year average ~12% hai. Small caps mein 15%+ possible hai par risk bhi zyada hai.`,
      );
    }

    ins.push(
      `Pro tip: SIP + RD dono rakho. Emergency fund (6 months expenses) RD mein, long-term goals SIP mein. Yahi balanced approach hai.`,
    );
    return ins;
  }, [result, monthlyAmount, years, sipReturn, taxRate]);

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
              label="Monthly Amount"
              icon={IndianRupee}
              value={monthlyAmount}
              onChange={setMonthlyAmount}
              min={500}
              max={100000}
              step={500}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Duration (Years)"
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
              min={8}
              max={18}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="RD Interest Rate (%)"
              icon={Percent}
              value={rdRate}
              onChange={setRdRate}
              min={5}
              max={8}
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

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="SIP (Equity MF)"
            titleB="Recurring Deposit"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.sipPostTax)}
            valueLabelA="Post-Tax Value"
            valueB={formatINR(result.rdPostTax)}
            valueLabelB="Post-Tax Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="sip-vs-rd" variant="strip" />
      </div>
    </div>
  );
}
