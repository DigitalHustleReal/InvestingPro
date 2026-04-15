"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Clock,
  Shield,
  Percent,
  Lock,
  TrendingUp,
} from "lucide-react";
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

export function NSCvsFDCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  const [nscRate, setNscRate] = useState(7.7);
  const [fdRate, setFdRate] = useState(7.5);
  const [taxSlabIndex, setTaxSlabIndex] = useState(3);
  const [fdTenure, setFdTenure] = useState(5);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;

  const result = useMemo(() => {
    // NSC: 5-year lock-in, interest compounds annually.
    // Interest is deemed reinvested and qualifies for 80C deduction (years 1-4).
    // Interest is taxable on accrual basis each year, but reinvested interest
    // gets 80C deduction (effectively only year-5 interest is taxable without 80C).
    const nscYears = 5;
    const nscRateDecimal = nscRate / 100;

    const nscMaturity = Math.round(
      investmentAmount * Math.pow(1 + nscRateDecimal, nscYears),
    );
    const nscTotalInterest = nscMaturity - investmentAmount;

    // NSC 80C benefit: Principal + reinvested interest (years 1-4)
    // Year 1-4 interest is deemed reinvested and qualifies under 80C
    let nsc80CTotal = Math.min(investmentAmount, 150000); // initial principal
    let nscAccrued = investmentAmount;
    let nscTaxableInterest = 0;
    for (let y = 1; y <= nscYears; y++) {
      const yearInterest = Math.round(nscAccrued * nscRateDecimal);
      if (y < nscYears) {
        // Years 1-4: interest is reinvested, qualifies for 80C
        nsc80CTotal += yearInterest;
      }
      // All interest is taxable on accrual basis
      nscTaxableInterest += yearInterest;
      nscAccrued += yearInterest;
    }
    const nscTaxOnInterest = Math.round(nscTaxableInterest * taxRate);
    const nscPostTaxMaturity = nscMaturity - nscTaxOnInterest;
    const nscEffectiveRate =
      investmentAmount > 0
        ? Math.round(
            (Math.pow(nscPostTaxMaturity / investmentAmount, 1 / nscYears) -
              1) *
              10000,
          ) / 100
        : 0;

    // FD: Quarterly compounding. TDS applies if interest > ₹40K (₹50K for seniors).
    const fdRateDecimal = fdRate / 100;
    const fdQuarterlyRate = fdRateDecimal / 4;
    const fdQuarters = fdTenure * 4;
    const fdMaturity = Math.round(
      investmentAmount * Math.pow(1 + fdQuarterlyRate, fdQuarters),
    );
    const fdTotalInterest = fdMaturity - investmentAmount;

    // FD interest is fully taxable at slab rate
    const fdTaxOnInterest = Math.round(fdTotalInterest * taxRate);
    const fdPostTaxMaturity = fdMaturity - fdTaxOnInterest;
    const fdEffectiveRate =
      investmentAmount > 0
        ? Math.round(
            (Math.pow(fdPostTaxMaturity / investmentAmount, 1 / fdTenure) - 1) *
              10000,
          ) / 100
        : 0;

    // FD 80C: Only 5-year tax-saver FD qualifies (up to ₹1.5L)
    const fd80C = fdTenure >= 5 ? Math.min(investmentAmount, 150000) : 0;

    // TDS threshold (₹40K for regular, simplified)
    const fdAnnualInterest = Math.round(fdTotalInterest / fdTenure);
    const fdTDSApplicable = fdAnnualInterest > 40000;

    const winner =
      nscPostTaxMaturity > fdPostTaxMaturity
        ? "nsc"
        : nscPostTaxMaturity < fdPostTaxMaturity
          ? "fd"
          : "tie";
    const diff = Math.abs(nscPostTaxMaturity - fdPostTaxMaturity);

    return {
      investmentAmount,
      nscMaturity,
      nscTotalInterest,
      nscTaxOnInterest,
      nscPostTaxMaturity,
      nscEffectiveRate,
      nsc80CTotal,
      nscTaxableInterest,
      fdMaturity,
      fdTotalInterest,
      fdTaxOnInterest,
      fdPostTaxMaturity,
      fdEffectiveRate,
      fd80C,
      fdTDSApplicable,
      fdAnnualInterest,
      winner,
      diff,
    };
  }, [investmentAmount, nscRate, fdRate, taxRate, fdTenure]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Maturity Value",
        optionA: formatINR(result.nscMaturity),
        optionB: formatINR(result.fdMaturity),
        winner:
          result.nscMaturity > result.fdMaturity
            ? ("A" as const)
            : result.nscMaturity < result.fdMaturity
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax Returns",
        optionA: formatINR(result.nscPostTaxMaturity),
        optionB: formatINR(result.fdPostTaxMaturity),
        winner:
          result.nscPostTaxMaturity > result.fdPostTaxMaturity
            ? ("A" as const)
            : result.nscPostTaxMaturity < result.fdPostTaxMaturity
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Effective Rate",
        optionA: `${result.nscEffectiveRate}% p.a.`,
        optionB: `${result.fdEffectiveRate}% p.a.`,
        winner:
          result.nscEffectiveRate > result.fdEffectiveRate
            ? ("A" as const)
            : result.nscEffectiveRate < result.fdEffectiveRate
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Tax on Interest",
        optionA: formatINR(result.nscTaxOnInterest),
        optionB: formatINR(result.fdTaxOnInterest),
        winner:
          result.nscTaxOnInterest < result.fdTaxOnInterest
            ? ("A" as const)
            : result.nscTaxOnInterest > result.fdTaxOnInterest
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "80C Benefit",
        optionA: `${formatINR(result.nsc80CTotal)} (principal + reinvested)`,
        optionB:
          result.fd80C > 0
            ? `${formatINR(result.fd80C)} (5yr tax-saver only)`
            : "Not eligible (< 5 yr)",
        winner:
          result.nsc80CTotal > result.fd80C ? ("A" as const) : ("tie" as const),
      },
      {
        label: "Lock-in Period",
        optionA: "5 years (no premature)",
        optionB:
          fdTenure >= 5
            ? `${fdTenure} years (penalty on early)`
            : `${fdTenure} years`,
        winner: "B" as const,
      },
      {
        label: "Liquidity",
        optionA: "No premature withdrawal",
        optionB: "Premature allowed (1% penalty)",
        winner: "B" as const,
      },
      {
        label: "TDS Deducted",
        optionA: "No TDS (taxed at filing)",
        optionB: result.fdTDSApplicable
          ? `Yes (interest > ₹40K/yr)`
          : "No (interest < ₹40K/yr)",
        winner: "A" as const,
      },
      {
        label: "Safety",
        optionA: "Govt backed (sovereign)",
        optionB: "Bank (DICGC up to ₹5L)",
        winner: "A" as const,
      },
    ],
    [result, fdTenure],
  );

  const verdict = useMemo(() => {
    if (result.winner === "nsc") {
      return {
        winner: "A" as const,
        title: `NSC gives ${formatINR(result.diff)} more post-tax`,
        description: `NSC wins with ${nscRate}% interest rate and a unique 80C double benefit — both principal and reinvested interest (years 1-4) qualify. No TDS deduction, sovereign safety, and higher post-tax effective return of ${result.nscEffectiveRate}%.`,
      };
    } else if (result.winner === "fd") {
      return {
        winner: "B" as const,
        title: `FD gives ${formatINR(result.diff)} more post-tax`,
        description: `At ${fdRate}%, the FD rate beats NSC's ${nscRate}%. FD also offers premature withdrawal flexibility and quarterly compounding. However, TDS kicks in if annual interest exceeds ₹40K.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both give similar post-tax returns",
      description:
        "NSC wins on 80C benefit and sovereign safety. FD wins on liquidity. Choose based on whether you need 80C deduction or flexibility.",
    };
  }, [result, nscRate, fdRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(investmentAmount)} invest karne pe — NSC: ${formatINR(result.nscPostTaxMaturity)} vs FD: ${formatINR(result.fdPostTaxMaturity)} post-tax milega.`,
    );
    ins.push(
      `NSC mein 80C ka double benefit milta hai — principal pe bhi aur reinvested interest pe bhi (year 1-4). FD mein sirf 5-year tax-saver FD pe 80C milta hai.`,
    );
    if (result.fdTDSApplicable) {
      ins.push(
        `FD mein TDS katega kyunki annual interest ${formatINR(result.fdAnnualInterest)} hai (₹40K se zyada). NSC mein TDS nahi kata — ITR file karte waqt tax pay karna hoga.`,
      );
    } else {
      ins.push(
        `FD mein TDS nahi katega kyunki annual interest ${formatINR(result.fdAnnualInterest)} hai (₹40K se kam). Lekin interest fully taxable hai slab rate pe.`,
      );
    }
    ins.push(
      `NSC 5 saal lock hai — premature withdrawal bilkul nahi milta. FD mein 1% penalty pe tod sakte ho. Emergency fund hai toh FD better, warna NSC.`,
    );
    return ins;
  }, [result, investmentAmount]);

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
              label="Investment Amount"
              icon={IndianRupee}
              value={investmentAmount}
              onChange={setInvestmentAmount}
              min={1000}
              max={5000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="NSC Interest Rate"
              icon={Percent}
              value={nscRate}
              onChange={setNscRate}
              min={6}
              max={10}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="FD Interest Rate"
              icon={Percent}
              value={fdRate}
              onChange={setFdRate}
              min={6}
              max={9}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="FD Tenure"
              icon={Clock}
              value={fdTenure}
              onChange={setFdTenure}
              min={1}
              max={10}
              step={1}
              formatDisplay={(v) => `${v} years`}
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
                NSC is sovereign-backed (Govt of India). FD is insured up to ₹5L
                by DICGC. NSC rate is set by Ministry of Finance quarterly.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="NSC"
            titleB="FD"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.nscPostTaxMaturity)}
            valueLabelA="Post-Tax Value"
            valueB={formatINR(result.fdPostTaxMaturity)}
            valueLabelB="Post-Tax Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="nsc-vs-fd" variant="strip" />
      </div>
    </div>
  );
}
