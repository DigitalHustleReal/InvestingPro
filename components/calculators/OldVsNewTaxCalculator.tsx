"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Building2, Heart, Home, Shield } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { VSComparisonLayout } from "./shared/VSComparisonLayout";
import { AIInsight } from "./shared/AIInsight";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import { formatINR } from "./shared/charts";

// Old Regime slabs (AY 2026-27)
const oldSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: Infinity, rate: 0.3 },
];

// New Regime slabs (AY 2026-27, Budget 2024)
const newSlabs = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.1 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.2 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.3 },
];

function calcTax(income: number, slabs: typeof oldSlabs): number {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.min) break;
    const taxable = Math.min(income, slab.max) - slab.min;
    tax += taxable * slab.rate;
  }
  return Math.round(tax);
}

export function OldVsNewTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [hra, setHra] = useState(200000);
  const [section80C, setSection80C] = useState(150000);
  const [section80D, setSection80D] = useState(25000);
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);
  const [nps80CCD, setNps80CCD] = useState(50000);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const result = useMemo(() => {
    // Standard deduction
    const stdDeductionOld = 50000;
    const stdDeductionNew = 75000; // Increased in new regime

    // Old Regime
    const totalDeductionsOld =
      Math.min(section80C, 150000) +
      Math.min(section80D, 100000) +
      Math.min(hra, grossIncome * 0.5) +
      Math.min(homeLoanInterest, 200000) +
      Math.min(nps80CCD, 50000) +
      otherDeductions +
      stdDeductionOld;
    const taxableOld = Math.max(0, grossIncome - totalDeductionsOld);
    let taxOld = calcTax(taxableOld, oldSlabs);
    // Rebate u/s 87A: if taxable income <= ₹5L, rebate up to ₹12,500
    if (taxableOld <= 500000) taxOld = Math.max(0, taxOld - 12500);
    const cessOld = Math.round(taxOld * 0.04);
    const totalTaxOld = taxOld + cessOld;

    // New Regime
    const taxableNew = Math.max(0, grossIncome - stdDeductionNew);
    let taxNew = calcTax(taxableNew, newSlabs);
    // Rebate: if income <= ₹12L (marginal relief applied automatically)
    if (taxableNew <= 1200000) taxNew = 0;
    const cessNew = Math.round(taxNew * 0.04);
    const totalTaxNew = taxNew + cessNew;

    const savings = totalTaxOld - totalTaxNew;
    const winner = savings > 0 ? "new" : savings < 0 ? "old" : "tie";
    const savingsAmt = Math.abs(savings);

    // In-hand calculation
    const inHandOld = grossIncome - totalTaxOld;
    const inHandNew = grossIncome - totalTaxNew;

    // Effective tax rates
    const effectiveOld =
      grossIncome > 0
        ? Math.round((totalTaxOld / grossIncome) * 10000) / 100
        : 0;
    const effectiveNew =
      grossIncome > 0
        ? Math.round((totalTaxNew / grossIncome) * 10000) / 100
        : 0;

    // Breakeven: at what deductions level do they match
    // Simplified: old regime becomes better when deductions exceed ~₹3.75L for ₹12L+ income

    return {
      taxableOld,
      taxableNew,
      taxOld,
      taxNew,
      cessOld,
      cessNew,
      totalTaxOld,
      totalTaxNew,
      totalDeductionsOld,
      savings: savingsAmt,
      winner,
      inHandOld,
      inHandNew,
      effectiveOld,
      effectiveNew,
    };
  }, [
    grossIncome,
    hra,
    section80C,
    section80D,
    homeLoanInterest,
    nps80CCD,
    otherDeductions,
  ]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Taxable Income",
        optionA: formatINR(result.taxableOld),
        optionB: formatINR(result.taxableNew),
        winner:
          result.taxableOld < result.taxableNew
            ? ("A" as const)
            : result.taxableNew < result.taxableOld
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Income Tax",
        optionA: formatINR(result.taxOld),
        optionB: formatINR(result.taxNew),
        winner:
          result.taxOld < result.taxNew
            ? ("A" as const)
            : result.taxNew < result.taxOld
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Cess (4%)",
        optionA: formatINR(result.cessOld),
        optionB: formatINR(result.cessNew),
        winner:
          result.cessOld < result.cessNew
            ? ("A" as const)
            : result.cessNew < result.cessOld
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Total Tax",
        optionA: formatINR(result.totalTaxOld),
        optionB: formatINR(result.totalTaxNew),
        winner:
          result.totalTaxOld < result.totalTaxNew
            ? ("A" as const)
            : result.totalTaxNew < result.totalTaxOld
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Effective Rate",
        optionA: `${result.effectiveOld}%`,
        optionB: `${result.effectiveNew}%`,
        winner:
          result.effectiveOld < result.effectiveNew
            ? ("A" as const)
            : result.effectiveNew < result.effectiveOld
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "In-Hand",
        optionA: formatINR(result.inHandOld),
        optionB: formatINR(result.inHandNew),
        winner:
          result.inHandOld > result.inHandNew
            ? ("A" as const)
            : result.inHandNew > result.inHandOld
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Deductions",
        optionA: formatINR(result.totalDeductionsOld),
        optionB: "₹75K (Std only)",
        winner: "A" as const,
      },
      {
        label: "Flexibility",
        optionA: "Need proofs",
        optionB: "No proofs needed",
        winner: "B" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "old") {
      return {
        winner: "A" as const,
        title: `Old Regime saves you ${formatINR(result.savings)}/year`,
        description: `With ${formatINR(result.totalDeductionsOld)} in deductions (80C + HRA + 80D + NPS), Old Regime gives lower tax. You save ${formatINR(result.savings)} compared to New Regime. Keep all investment proofs ready.`,
      };
    } else if (result.winner === "new") {
      return {
        winner: "B" as const,
        title: `New Regime saves you ${formatINR(result.savings)}/year`,
        description: `Your deductions of ${formatINR(result.totalDeductionsOld)} aren't enough to beat the New Regime's lower slab rates. Switch to New Regime and save ${formatINR(result.savings)}. No proofs needed — simpler filing.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both regimes are equal for you",
      description:
        "Your deductions perfectly balance out the slab rate difference. Choose New Regime for simplicity (no proofs) or Old if you might increase deductions next year.",
    };
  }, [result]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(grossIncome)} income pe Old Regime tax: ${formatINR(result.totalTaxOld)} vs New Regime: ${formatINR(result.totalTaxNew)}. Difference: ${formatINR(result.savings)}.`,
    );
    if (result.winner === "old") {
      ins.push(
        `Aapke ${formatINR(result.totalDeductionsOld)} deductions strong hain. Old Regime mein rahein. 80C + HRA + NPS ka poora benefit le rahe ho.`,
      );
    } else {
      ins.push(
        `New Regime better hai kyunki deductions kam hain. Agar HRA claim nahi kar sakte ya home loan nahi hai, toh New Regime sahi hai.`,
      );
    }
    if (section80C < 150000) {
      ins.push(
        `80C limit puri nahi bhari. ${formatINR(150000 - section80C)} aur invest karein (ELSS/PPF/EPF) toh Old Regime aur better ho sakta hai.`,
      );
    }
    if (homeLoanInterest === 0) {
      ins.push(
        `Home loan nahi hai toh New Regime mostly better rehta hai. Home loan lene pe ₹2L interest deduction milta hai — tab Old Regime check karein.`,
      );
    }
    return ins;
  }, [result, grossIncome, section80C, homeLoanInterest]);

  // Slab-wise breakdown
  const slabBreakdown = useMemo(() => {
    const breakdown = [];
    for (const slab of newSlabs) {
      if (result.taxableNew <= slab.min) break;
      const taxable = Math.min(result.taxableNew, slab.max) - slab.min;
      const tax = Math.round(taxable * slab.rate);
      breakdown.push({
        range:
          slab.max === Infinity
            ? `Above ${formatINR(slab.min)}`
            : `${formatINR(slab.min)} - ${formatINR(slab.max)}`,
        rate: `${slab.rate * 100}%`,
        taxable: formatINR(taxable),
        tax: formatINR(tax),
      });
    }
    return breakdown;
  }, [result.taxableNew]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inputs — left side */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Your Income & Deductions
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Gross Annual Income"
              icon={IndianRupee}
              value={grossIncome}
              onChange={setGrossIncome}
              min={300000}
              max={5000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="HRA Exemption"
              icon={Home}
              value={hra}
              onChange={setHra}
              min={0}
              max={500000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Section 80C (EPF + ELSS + PPF + LIC)"
              icon={Shield}
              value={section80C}
              onChange={setSection80C}
              min={0}
              max={150000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Section 80D (Health Insurance)"
              icon={Heart}
              value={section80D}
              onChange={setSection80D}
              min={0}
              max={100000}
              step={5000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Home Loan Interest (Sec 24)"
              icon={Building2}
              value={homeLoanInterest}
              onChange={setHomeLoanInterest}
              min={0}
              max={200000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="NPS 80CCD(1B)"
              icon={Shield}
              value={nps80CCD}
              onChange={setNps80CCD}
              min={0}
              max={50000}
              step={5000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Other Deductions"
              icon={IndianRupee}
              value={otherDeductions}
              onChange={setOtherDeductions}
              min={0}
              max={200000}
              step={10000}
              formatDisplay={formatINR}
            />
          </div>
        </div>

        {/* Results — right side */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Old Regime"
            titleB="New Regime"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.totalTaxOld)}
            valueLabelA="Total Tax Payable"
            valueB={formatINR(result.totalTaxNew)}
            valueLabelB="Total Tax Payable"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      {/* New Regime Slab Breakdown */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          New Tax Regime Slab Breakdown — FY 2025-26
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/5">
              <th className="text-left py-2 text-ink-60 font-medium">
                Income Range
              </th>
              <th className="text-center py-2 text-ink-60 font-medium">
                Rate
              </th>
              <th className="text-right py-2 text-ink-60 font-medium">
                Taxable
              </th>
              <th className="text-right py-2 text-ink-60 font-medium">Tax</th>
            </tr>
          </thead>
          <tbody>
            {slabBreakdown.map((s, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-2 text-ink">{s.range}</td>
                <td className="text-center py-2 text-indian-gold font-medium">
                  {s.rate}
                </td>
                <td className="text-right py-2 text-ink-60">{s.taxable}</td>
                <td className="text-right py-2 font-display font-semibold text-ink">
                  {s.tax}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-ink-60 mt-2">
          * New Regime: Standard deduction ₹75,000. No HRA, 80C, 80D, home loan
          interest deductions. Rebate up to ₹12L taxable income.
        </p>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="old-vs-new-tax" variant="strip" />
      </div>
    </div>
  );
}
