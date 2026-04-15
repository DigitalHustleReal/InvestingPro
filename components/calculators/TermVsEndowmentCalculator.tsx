"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Shield, Clock, Heart, TrendingUp } from "lucide-react";
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

export function TermVsEndowmentCalculator() {
  const [age, setAge] = useState(30);
  const [coverAmount, setCoverAmount] = useState(10000000); // ₹1Cr
  const [premiumBudget, setPremiumBudget] = useState(10000);
  const [sipReturn, setSipReturn] = useState(12);

  const result = useMemo(() => {
    const policyTerm = 65 - age; // till retirement
    const years = Math.min(policyTerm, 30);

    // Term Insurance: ~₹700-1000/month for ₹1Cr cover at age 30
    // Premium roughly increases 50% per 5 years of age
    const baseTermPremium = Math.round(
      (coverAmount / 10000000) * 700 * (1 + (age - 25) * 0.03),
    );
    const termMonthlyPremium = Math.max(500, baseTermPremium);

    // Endowment: Premium is ~10x term for much less cover
    // Typical endowment: ₹8000/month for ₹15-20L sum assured
    const endowmentCover = Math.round(premiumBudget * 20 * 12); // rough sum assured
    const endowmentMonthlyPremium = premiumBudget;

    // Term + SIP strategy: pay term premium, invest rest in SIP
    const sipAmount = Math.max(0, premiumBudget - termMonthlyPremium);
    const sipCorpus = futureValueSIP(sipAmount, sipReturn, years);
    const totalTermPaid = termMonthlyPremium * 12 * years;
    const termTotalWealth = sipCorpus; // SIP corpus + cover continues

    // Endowment maturity: ~4-5% CAGR typical
    const endowmentReturn = 5; // generous estimate
    const endowmentMaturity = Math.round(
      (endowmentMonthlyPremium *
        12 *
        years *
        Math.pow(1 + endowmentReturn / 100, years)) /
        Math.pow(1 + endowmentReturn / 100, years - 1),
    );
    // More accurate: endowment pays ~1.5-2x of total premium
    const totalEndowmentPaid = endowmentMonthlyPremium * 12 * years;
    const endowmentMaturityValue = Math.round(totalEndowmentPaid * 1.7); // ~5% CAGR effectively

    const wealthDiff = termTotalWealth - endowmentMaturityValue;
    const coverDiff = coverAmount - endowmentCover;

    return {
      years,
      termMonthlyPremium,
      endowmentMonthlyPremium,
      sipAmount,
      sipCorpus,
      totalTermPaid,
      totalEndowmentPaid,
      termTotalWealth,
      endowmentCover,
      endowmentMaturityValue,
      coverAmount,
      wealthDiff: Math.abs(wealthDiff),
      wealthWinner: wealthDiff > 0 ? "term" : "endowment",
      coverDiff,
    };
  }, [age, coverAmount, premiumBudget, sipReturn]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Life Cover",
        optionA: formatINR(result.coverAmount),
        optionB: formatINR(result.endowmentCover),
        winner: "A" as const,
      },
      {
        label: "Monthly Premium",
        optionA: formatINR(result.termMonthlyPremium),
        optionB: formatINR(result.endowmentMonthlyPremium),
        winner: "A" as const,
      },
      {
        label: "Maturity Value",
        optionA: `${formatINR(result.sipCorpus)} (SIP)`,
        optionB: formatINR(result.endowmentMaturityValue),
        winner:
          result.sipCorpus > result.endowmentMaturityValue
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Total Paid",
        optionA: formatINR(result.totalTermPaid),
        optionB: formatINR(result.totalEndowmentPaid),
        winner:
          result.totalTermPaid < result.totalEndowmentPaid
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Wealth Created",
        optionA: formatINR(result.termTotalWealth),
        optionB: formatINR(result.endowmentMaturityValue),
        winner:
          result.termTotalWealth > result.endowmentMaturityValue
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Returns",
        optionA: `${sipReturn}% (SIP) + cover`,
        optionB: "~4-5% (locked)",
        winner: "A" as const,
      },
      {
        label: "Flexibility",
        optionA: "SIP pause/stop anytime",
        optionB: "Locked (surrender penalty)",
        winner: "A" as const,
      },
      {
        label: "Tax Benefit",
        optionA: "80C (premium) + 10(10D)",
        optionB: "80C + 10(10D) maturity",
        winner: "tie" as const,
      },
    ],
    [result, sipReturn],
  );

  const verdict = useMemo(() => {
    if (result.wealthWinner === "term") {
      return {
        winner: "A" as const,
        title: `Term + SIP creates ${formatINR(result.wealthDiff)} more wealth`,
        description: `Term insurance at ${formatINR(result.termMonthlyPremium)}/month gives ${formatINR(result.coverAmount)} cover. Investing the remaining ${formatINR(result.sipAmount)}/month in SIP at ${sipReturn}% creates ${formatINR(result.sipCorpus)}. Endowment gives only ${formatINR(result.endowmentMaturityValue)} maturity with just ${formatINR(result.endowmentCover)} cover. Term + SIP always wins.`,
      };
    }
    return {
      winner: "A" as const,
      title: "Term + SIP is almost always better",
      description: `Even in this scenario, term insurance gives ${formatINR(result.coverAmount)} life cover vs endowment's ${formatINR(result.endowmentCover)}. Keep insurance and investment separate — it's the golden rule of personal finance.`,
    };
  }, [result, sipReturn]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `Age ${age} pe ${formatINR(result.coverAmount)} cover: Term sirf ${formatINR(result.termMonthlyPremium)}/month mein milta hai. Endowment mein same budget pe cover sirf ${formatINR(result.endowmentCover)}.`,
    );
    ins.push(
      `Golden Rule: Insurance aur investment ko mix mat karo. Term le lo, baaki paisa SIP mein daalo. ${result.years} saal mein ${formatINR(result.sipCorpus)} ban sakta hai.`,
    );
    ins.push(
      `Endowment ka real return 4-5% hota hai — FD se bhi kam. Agent commission 30-40% first year premium hota hai, isliye wo push karte hain.`,
    );
    if (age <= 35) {
      ins.push(
        `${age} ki age mein term lena sabse sahi hai — premium bahut low milega aur ${65 - age} saal tak cover milega. Delay karne pe premium 8-10% zyada hota hai har saal.`,
      );
    }
    ins.push(
      `Pro tip: Term insurance mein rider add karo — Critical Illness + Accidental Death. ₹200-300/month extra mein complete protection milti hai.`,
    );
    return ins;
  }, [result, age]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Your Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Your Age"
              icon={Heart}
              value={age}
              onChange={setAge}
              min={20}
              max={55}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="Life Cover Needed"
              icon={Shield}
              value={coverAmount}
              onChange={setCoverAmount}
              min={2500000}
              max={50000000}
              step={2500000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Monthly Premium Budget"
              icon={IndianRupee}
              value={premiumBudget}
              onChange={setPremiumBudget}
              min={2000}
              max={50000}
              step={500}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="SIP Expected Return (%)"
              icon={TrendingUp}
              value={sipReturn}
              onChange={setSipReturn}
              min={8}
              max={18}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
          </div>
          <div className="mt-5 p-3 bg-green-50 border border-green-100 rounded-xl">
            <p className="text-xs text-green-800">
              <strong>Strategy:</strong> Pay{" "}
              {formatINR(result.termMonthlyPremium)}/mo for term, invest{" "}
              {formatINR(result.sipAmount)}/mo in SIP
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Term + SIP"
            titleB="Endowment Plan"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.termTotalWealth)}
            valueLabelA="Total Wealth Created"
            valueB={formatINR(result.endowmentMaturityValue)}
            valueLabelB="Maturity Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="term-vs-endowment" variant="strip" />
      </div>
    </div>
  );
}
