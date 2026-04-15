"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Clock, Shield, TrendingUp } from "lucide-react";
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

export function PPFvsELSSCalculator() {
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [years, setYears] = useState(15);
  const [elssReturn, setElssReturn] = useState(14);
  const [taxSlabIndex, setTaxSlabIndex] = useState(2);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;
  const PPF_RATE = 7.1;

  const result = useMemo(() => {
    const cappedInvestment = Math.min(annualInvestment, 150000);

    // PPF: annual compounding, 7.1% rate, 15-year lock-in, EEE (exempt-exempt-exempt)
    let ppfCorpus = 0;
    for (let y = 0; y < years; y++) {
      ppfCorpus = (ppfCorpus + cappedInvestment) * (1 + PPF_RATE / 100);
    }
    const ppfTotalInvested = cappedInvestment * years;
    const ppfGains = ppfCorpus - ppfTotalInvested;
    const ppfTax = 0; // EEE — fully tax-free
    const ppfPostTax = Math.round(ppfCorpus);

    // ELSS: annual investment, equity returns, 3-year lock-in per installment
    let elssCorpus = 0;
    const annualRate = elssReturn / 100;
    for (let y = 0; y < years; y++) {
      elssCorpus = (elssCorpus + cappedInvestment) * (1 + annualRate);
    }
    const elssTotalInvested = cappedInvestment * years;
    const elssGains = elssCorpus - elssTotalInvested;
    // LTCG: 12.5% on gains above ₹1.25L
    const elssTaxableGains = Math.max(0, elssGains - 125000);
    const elssTax = Math.round(elssTaxableGains * 0.125);
    const elssPostTax = Math.round(elssCorpus - elssTax);

    // 80C benefit (both qualify)
    const taxSaved80C = Math.round(cappedInvestment * taxRate);

    const winner =
      elssPostTax > ppfPostTax
        ? "elss"
        : elssPostTax < ppfPostTax
          ? "ppf"
          : "tie";
    const diff = Math.abs(elssPostTax - ppfPostTax);

    return {
      totalInvested: ppfTotalInvested,
      ppfCorpus: Math.round(ppfCorpus),
      ppfGains: Math.round(ppfGains),
      ppfTax,
      ppfPostTax,
      elssCorpus: Math.round(elssCorpus),
      elssGains: Math.round(elssGains),
      elssTax,
      elssPostTax,
      taxSaved80C,
      winner,
      diff,
    };
  }, [annualInvestment, years, elssReturn, taxRate]);

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
        optionA: formatINR(result.ppfCorpus),
        optionB: formatINR(result.elssCorpus),
        winner:
          result.ppfCorpus > result.elssCorpus
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Tax on Returns",
        optionA: "₹0 (EEE)",
        optionB: formatINR(result.elssTax),
        winner: "A" as const,
      },
      {
        label: "Post-Tax Value",
        optionA: formatINR(result.ppfPostTax),
        optionB: formatINR(result.elssPostTax),
        winner:
          result.ppfPostTax > result.elssPostTax
            ? ("A" as const)
            : result.ppfPostTax < result.elssPostTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Lock-in Period",
        optionA: "15 years",
        optionB: "3 years",
        winner: "B" as const,
      },
      {
        label: "Risk Level",
        optionA: "Zero (Govt backed)",
        optionB: "High (Equity)",
        winner: "A" as const,
      },
      {
        label: "80C Benefit",
        optionA: `Up to ₹1.5L`,
        optionB: `Up to ₹1.5L`,
        winner: "tie" as const,
      },
      {
        label: "Returns Type",
        optionA: "Fixed (7.1%)",
        optionB: "Market-linked",
        winner: "B" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "elss") {
      return {
        winner: "B" as const,
        title: `ELSS gives ${formatINR(result.diff)} more after tax`,
        description: `At ${elssReturn}% expected return, ELSS beats PPF by ${formatINR(result.diff)} despite LTCG tax. ELSS has only 3-year lock-in vs PPF's 15 years. Best for investors who can handle equity volatility.`,
      };
    } else if (result.winner === "ppf") {
      return {
        winner: "A" as const,
        title: `PPF gives ${formatINR(result.diff)} more after tax`,
        description: `PPF wins because of its tax-free (EEE) status and guaranteed returns. At lower ELSS returns, PPF's zero-tax advantage kicks in. Best for conservative investors.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both options are nearly equal",
      description:
        "PPF and ELSS give similar post-tax returns. PPF for safety, ELSS for liquidity and growth potential.",
    };
  }, [result, elssReturn]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `₹${(annualInvestment / 100000).toFixed(1)}L/year invest karne pe — PPF: ${formatINR(result.ppfPostTax)} vs ELSS: ${formatINR(result.elssPostTax)} after ${years} years.`,
    );
    ins.push(
      `Dono se 80C benefit milta hai — ${formatINR(result.taxSaved80C)}/year tax bachega ${TAX_SLABS[taxSlabIndex].label} mein.`,
    );
    if (result.winner === "elss") {
      ins.push(
        `ELSS mein 3 saal ka lock-in hai vs PPF ka 15 saal. Agar liquidity chahiye toh ELSS better hai. But PPF guaranteed hai — zero risk.`,
      );
    }
    if (years < 15) {
      ins.push(
        `PPF ka full maturity 15 saal hai. ${years} saal mein PPF se partial withdrawal hi milega (7th year se). ELSS se 3 saal baad redeem kar sakte ho.`,
      );
    }
    ins.push(
      `Smart move: Dono mein split karo — ₹75K PPF (safe) + ₹75K ELSS (growth). 80C ka ₹1.5L poora bharo.`,
    );
    return ins;
  }, [result, annualInvestment, years, taxSlabIndex]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Investment Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Annual Investment"
              icon={IndianRupee}
              value={annualInvestment}
              onChange={setAnnualInvestment}
              min={500}
              max={150000}
              step={5000}
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
              label="Expected ELSS Return (%)"
              icon={TrendingUp}
              value={elssReturn}
              onChange={setElssReturn}
              min={8}
              max={20}
              step={0.5}
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <Shield className="w-3.5 h-3.5 inline mr-1" />
                PPF rate: {PPF_RATE}% (govt fixed, revised quarterly). Max
                ₹1.5L/year under 80C.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="PPF"
            titleB="ELSS"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.ppfPostTax)}
            valueLabelA="Post-Tax Value"
            valueB={formatINR(result.elssPostTax)}
            valueLabelB="Post-Tax Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="ppf-vs-elss" variant="strip" />
      </div>
    </div>
  );
}
