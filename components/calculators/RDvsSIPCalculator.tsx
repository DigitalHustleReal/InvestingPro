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

export function RDvsSIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [years, setYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);
  const [rdRate, setRdRate] = useState(7.5);
  const [taxSlabIndex, setTaxSlabIndex] = useState(2);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;

  const result = useMemo(() => {
    const months = years * 12;
    const totalInvested = monthlyAmount * months;

    // --- SIP: monthly compounding (equity mutual fund) ---
    const sipMonthlyRate = sipReturn / 100 / 12;
    const sipValue =
      monthlyAmount *
      ((Math.pow(1 + sipMonthlyRate, months) - 1) / sipMonthlyRate) *
      (1 + sipMonthlyRate);
    const sipGains = sipValue - totalInvested;
    // LTCG on equity MF: 12.5% on gains above Rs 1.25L
    const sipTaxableGains = Math.max(0, sipGains - 125000);
    const sipTax = Math.round(sipTaxableGains * 0.125);
    const sipPostTax = Math.round(sipValue - sipTax);

    // --- RD: quarterly compounding ---
    // RD compounds quarterly. Each monthly deposit earns interest from its
    // deposit date to maturity. We simulate month-by-month accumulation
    // with quarterly compounding (interest added every 3 months).
    const quarterlyRate = rdRate / 100 / 4;
    let rdCorpus = 0;
    for (let m = 0; m < months; m++) {
      rdCorpus += monthlyAmount;
      if ((m + 1) % 3 === 0) {
        rdCorpus *= 1 + quarterlyRate;
      }
    }
    const rdGains = rdCorpus - totalInvested;
    // TDS on RD interest: taxed at slab rate (TDS deducted if interest > 40K/year)
    const rdTax = Math.round(rdGains * taxRate);
    const rdPostTax = Math.round(rdCorpus - rdTax);

    // Effective annual rate (post-tax CAGR)
    const sipEffective =
      totalInvested > 0 && years > 0
        ? ((Math.pow(sipPostTax / totalInvested, 1 / years) - 1) * 100).toFixed(
            1,
          )
        : "0";
    const rdEffective =
      totalInvested > 0 && years > 0
        ? ((Math.pow(rdPostTax / totalInvested, 1 / years) - 1) * 100).toFixed(
            1,
          )
        : "0";

    const winner =
      sipPostTax > rdPostTax ? "sip" : sipPostTax < rdPostTax ? "rd" : "tie";
    const diff = Math.abs(sipPostTax - rdPostTax);

    return {
      totalInvested,
      sipValue: Math.round(sipValue),
      sipGains: Math.round(sipGains),
      sipTax,
      sipPostTax,
      sipEffective,
      rdValue: Math.round(rdCorpus),
      rdGains: Math.round(rdGains),
      rdTax,
      rdPostTax,
      rdEffective,
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
          result.sipValue > result.rdValue ? ("A" as const) : ("B" as const),
      },
      {
        label: "Total Gains",
        optionA: formatINR(result.sipGains),
        optionB: formatINR(result.rdGains),
        winner:
          result.sipGains > result.rdGains ? ("A" as const) : ("B" as const),
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
        label: "Post-Tax Returns",
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
        label: "Effective Rate (CAGR)",
        optionA: `${result.sipEffective}%`,
        optionB: `${result.rdEffective}%`,
        winner:
          parseFloat(result.sipEffective) > parseFloat(result.rdEffective)
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Liquidity",
        optionA: "Anytime (T+2)",
        optionB: "Penalty on early exit",
        winner: "A" as const,
      },
      {
        label: "Risk Level",
        optionA: "Moderate-High",
        optionB: "Zero (Bank guaranteed)",
        winner: "B" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "sip") {
      return {
        winner: "A" as const,
        title: `SIP gives ${formatINR(result.diff)} more after tax`,
        description: `Over ${years} years, equity SIP at ${sipReturn}% beats RD at ${rdRate}% by ${formatINR(result.diff)} post-tax. SIP has LTCG tax of just 12.5% (above Rs 1.25L), while RD interest is fully taxable at your slab rate (${taxRate * 100}%). SIP also hedges against inflation.`,
      };
    } else if (result.winner === "rd") {
      return {
        winner: "B" as const,
        title: `RD gives ${formatINR(result.diff)} more after tax`,
        description: `At current rates, RD edges out SIP. This usually happens with short time horizons or conservative SIP return assumptions. For 5+ year goals, equity SIP historically outperforms.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both options are nearly equal",
      description:
        "With these parameters, SIP and RD give similar post-tax returns. Choose RD for guaranteed safety, SIP for long-term wealth creation potential.",
    };
  }, [result, years, sipReturn, rdRate, taxRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(monthlyAmount)}/month invest karo ${years} saal tak = ${formatINR(result.totalInvested)} total. SIP: ${formatINR(result.sipPostTax)} vs RD: ${formatINR(result.rdPostTax)} milega after tax.`,
    );
    if (result.winner === "sip") {
      ins.push(
        `SIP ka fayda: ${formatINR(result.diff)} zyada milega! RD pe interest poora taxable hai (${taxRate * 100}% slab), lekin SIP pe sirf 12.5% LTCG tax lagta hai Rs 1.25L ke upar.`,
      );
    }
    if (years < 5) {
      ins.push(
        `${years} saal bahut kam hai equity SIP ke liye. Short term mein market volatile hota hai. 3 saal se kam ke liye RD ya liquid fund better hai.`,
      );
    }
    if (rdRate >= 8) {
      ins.push(
        `RD rate ${rdRate}% kaafi achha hai — yeh special rate hoga. Normal bank RD 6.5-7.5% hoti hai. Agar mil raha hai toh lock karo.`,
      );
    }
    ins.push(
      `Pro tip: Emergency fund ke liye RD ya FD rakho (6 months expenses). Baaki long-term goals ke liye SIP karo. Dono ka combination best hai.`,
    );
    if (years >= 10) {
      ins.push(
        `${years} saal ka horizon hai — historically equity SIP ne 12-15% CAGR diya hai. RD inflation ko beat nahi karta after tax. Long term mein SIP clear winner hai.`,
      );
    }
    return ins;
  }, [result, monthlyAmount, years, rdRate, taxRate]);

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
              min={500}
              max={50000}
              step={500}
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
              min={6}
              max={9}
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
        <PopularCalculators currentSlug="rd-vs-sip" variant="strip" />
      </div>
    </div>
  );
}
