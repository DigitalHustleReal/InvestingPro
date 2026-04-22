"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Clock, Shield, TrendingUp, Percent } from "lucide-react";
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

export function NPSvsPPFCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(30000);
  const [yearsToRetirement, setYearsToRetirement] = useState(25);
  const [npsEquityPercent, setNpsEquityPercent] = useState(60);
  const [taxSlabIndex, setTaxSlabIndex] = useState(3);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;
  const PPF_RATE = 7.1;

  const result = useMemo(() => {
    const months = yearsToRetirement * 12;
    const annualInvestment = monthlyInvestment * 12;
    const totalInvested = monthlyInvestment * months;

    // NPS: blended return based on equity allocation
    // Equity: ~10%, Corporate bonds: ~8%, Govt bonds: ~7%
    const npsEquity = npsEquityPercent / 100;
    const npsDebt = 1 - npsEquity;
    const npsReturn = (npsEquity * 10 + npsDebt * 7.5) / 100;
    const npsMonthlyRate = npsReturn / 12;

    let npsCorpus = 0;
    for (let m = 0; m < months; m++) {
      npsCorpus = (npsCorpus + monthlyInvestment) * (1 + npsMonthlyRate);
    }

    // NPS: 60% lumpsum (40% tax-free), 40% must buy annuity
    const npsLumpsum = npsCorpus * 0.6;
    const npsAnnuityCorpus = npsCorpus * 0.4;
    // Lumpsum: fully tax-free on withdrawal
    const npsLumpsumTax = 0;
    // Annuity income taxed at slab rate (estimate annual pension at 6% of annuity corpus)
    const annualPension = npsAnnuityCorpus * 0.06;
    const npsAnnuityTaxPerYear = Math.round(annualPension * taxRate);

    // Tax benefit: 80CCD(1) within 80C ₹1.5L + 80CCD(1B) extra ₹50K
    const nps80CCD1B = Math.min(50000, annualInvestment);
    const nps80C = Math.min(150000, annualInvestment - nps80CCD1B);
    const npsTaxBenefitPerYear = Math.round((nps80CCD1B + nps80C) * taxRate);

    // PPF: max ₹1.5L/year, EEE
    const ppfAnnual = Math.min(annualInvestment, 150000);
    const ppfMonthly = ppfAnnual / 12;
    let ppfCorpus = 0;
    for (let y = 0; y < yearsToRetirement; y++) {
      ppfCorpus = (ppfCorpus + ppfAnnual) * (1 + PPF_RATE / 100);
    }
    const ppfTotalInvested = ppfAnnual * yearsToRetirement;
    const ppfTax = 0; // EEE
    const ppfPostTax = Math.round(ppfCorpus);

    // 80C benefit for PPF
    const ppfTaxBenefitPerYear = Math.round(ppfAnnual * taxRate);

    const npsPostTax = Math.round(npsLumpsum + npsAnnuityCorpus); // corpus value (pension is separate)
    const winner =
      npsPostTax > ppfPostTax ? "nps" : npsPostTax < ppfPostTax ? "ppf" : "tie";
    const diff = Math.abs(npsPostTax - ppfPostTax);

    return {
      totalInvested,
      npsCorpus: Math.round(npsCorpus),
      npsLumpsum: Math.round(npsLumpsum),
      npsAnnuityCorpus: Math.round(npsAnnuityCorpus),
      annualPension: Math.round(annualPension),
      npsAnnuityTaxPerYear,
      npsTaxBenefitPerYear,
      npsPostTax,
      npsReturn: Math.round(npsReturn * 10000) / 100,
      ppfCorpus: Math.round(ppfCorpus),
      ppfTotalInvested,
      ppfPostTax,
      ppfTaxBenefitPerYear,
      winner,
      diff,
    };
  }, [monthlyInvestment, yearsToRetirement, npsEquityPercent, taxRate]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Total Corpus",
        optionA: formatINR(result.npsCorpus),
        optionB: formatINR(result.ppfCorpus),
        winner:
          result.npsCorpus > result.ppfCorpus ? ("A" as const) : ("B" as const),
      },
      {
        label: "Lumpsum at Retirement",
        optionA: formatINR(result.npsLumpsum),
        optionB: formatINR(result.ppfPostTax),
        winner:
          result.npsLumpsum > result.ppfPostTax
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Monthly Pension",
        optionA: formatINR(Math.round(result.annualPension / 12)),
        optionB: "No pension",
        winner: "A" as const,
      },
      {
        label: "Tax on Maturity",
        optionA: "60% tax-free, pension taxed",
        optionB: "100% tax-free (EEE)",
        winner: "B" as const,
      },
      {
        label: "Extra 80CCD(1B)",
        optionA: `₹50K extra (saves ${formatINR(Math.round(50000 * taxRate))})`,
        optionB: "Not available",
        winner: "A" as const,
      },
      {
        label: "Lock-in",
        optionA: "Till 60 (strict)",
        optionB: "15 years (extendable)",
        winner: "B" as const,
      },
      {
        label: "Risk Level",
        optionA: `${npsEquityPercent}% equity exposure`,
        optionB: "Zero (Govt backed)",
        winner: "B" as const,
      },
      {
        label: "Annual Tax Saved",
        optionA: formatINR(result.npsTaxBenefitPerYear),
        optionB: formatINR(result.ppfTaxBenefitPerYear),
        winner:
          result.npsTaxBenefitPerYear > result.ppfTaxBenefitPerYear
            ? ("A" as const)
            : ("B" as const),
      },
    ],
    [result, npsEquityPercent, taxRate],
  );

  const verdict = useMemo(() => {
    if (result.winner === "nps") {
      return {
        winner: "A" as const,
        title: `NPS corpus is ${formatINR(result.diff)} higher`,
        description: `With ${npsEquityPercent}% equity allocation, NPS builds a larger corpus plus monthly pension of ${formatINR(Math.round(result.annualPension / 12))}. Extra ₹50K 80CCD(1B) deduction saves ${formatINR(Math.round(50000 * taxRate))}/year. But 40% must buy annuity — no full freedom.`,
      };
    } else if (result.winner === "ppf") {
      return {
        winner: "B" as const,
        title: `PPF gives ${formatINR(result.diff)} more in corpus`,
        description: `PPF wins on pure corpus size because it's fully tax-free (EEE). No forced annuity purchase. But no pension income — you manage the corpus yourself.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both build similar corpus",
      description:
        "NPS offers pension income + extra tax benefit. PPF offers full freedom + zero tax. Both are solid retirement options.",
    };
  }, [result, npsEquityPercent, taxRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(monthlyInvestment)}/month se ${yearsToRetirement} saal mein — NPS: ${formatINR(result.npsCorpus)} vs PPF: ${formatINR(result.ppfCorpus)}.`,
    );
    ins.push(
      `NPS ka extra fayda: 80CCD(1B) se ₹50K extra deduction milta hai — ${formatINR(Math.round(50000 * taxRate))}/year tax bachega. PPF mein yeh nahi milta.`,
    );
    if (npsEquityPercent >= 70) {
      ins.push(
        `NPS mein ${npsEquityPercent}% equity rakha hai — aggressive allocation hai. Returns zyada honge but volatility bhi. 50-60% equity balanced hai.`,
      );
    }
    ins.push(
      `Best strategy: NPS mein ₹50K dalo (80CCD(1B) ke liye), baaki PPF mein. Dono ka tax benefit lo. Retirement pe dono se income milegi.`,
    );
    return ins;
  }, [result, monthlyInvestment, yearsToRetirement, npsEquityPercent, taxRate]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Retirement Planning
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Monthly Investment"
              icon={IndianRupee}
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={1000}
              max={200000}
              step={1000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Years to Retirement"
              icon={Clock}
              value={yearsToRetirement}
              onChange={setYearsToRetirement}
              min={5}
              max={35}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="NPS Equity Allocation (%)"
              icon={TrendingUp}
              value={npsEquityPercent}
              onChange={setNpsEquityPercent}
              min={50}
              max={75}
              step={5}
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
            <div className="bg-action-green/10 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <Shield className="w-3.5 h-3.5 inline mr-1" />
                NPS blended return: ~{result.npsReturn}% | PPF: {PPF_RATE}%
                (govt fixed)
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="NPS"
            titleB="PPF"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.npsCorpus)}
            valueLabelA="Total Corpus"
            valueB={formatINR(result.ppfPostTax)}
            valueLabelB="Total Corpus"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="nps-vs-ppf" variant="strip" />
      </div>
    </div>
  );
}
