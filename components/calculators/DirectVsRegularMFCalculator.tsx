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

export function DirectVsRegularMFCalculator() {
  const [sipAmount, setSipAmount] = useState(25000);
  const [years, setYears] = useState(20);
  const [fundReturn, setFundReturn] = useState(14);
  const [regularExpenseRatio, setRegularExpenseRatio] = useState(1.8);
  const [directExpenseRatio, setDirectExpenseRatio] = useState(0.5);

  const result = useMemo(() => {
    const totalInvested = sipAmount * years * 12;

    // Net return = fund return - expense ratio
    const directNetReturn = fundReturn - directExpenseRatio;
    const regularNetReturn = fundReturn - regularExpenseRatio;

    const directFV = futureValueSIP(sipAmount, directNetReturn, years);
    const regularFV = futureValueSIP(sipAmount, regularNetReturn, years);

    const directGain = directFV - totalInvested;
    const regularGain = regularFV - totalInvested;

    const expenseRatioDiff = regularExpenseRatio - directExpenseRatio;
    const valueDiff = directFV - regularFV;
    const costOfRegular = valueDiff; // how much you lose by choosing regular

    // Percentage more wealth
    const percentMore =
      regularFV > 0 ? Math.round((valueDiff / regularFV) * 10000) / 100 : 0;

    // Annual cost leak in regular plan
    const avgCorpus = (totalInvested + regularFV) / 2;
    const annualCostLeak = Math.round((avgCorpus * expenseRatioDiff) / 100);

    return {
      totalInvested,
      directFV,
      regularFV,
      directGain,
      regularGain,
      directNetReturn: Math.round(directNetReturn * 100) / 100,
      regularNetReturn: Math.round(regularNetReturn * 100) / 100,
      expenseRatioDiff: Math.round(expenseRatioDiff * 100) / 100,
      valueDiff,
      costOfRegular,
      percentMore,
      annualCostLeak,
    };
  }, [sipAmount, years, fundReturn, regularExpenseRatio, directExpenseRatio]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Final Value",
        optionA: formatINR(result.directFV),
        optionB: formatINR(result.regularFV),
        winner: "A" as const,
      },
      {
        label: "Total Gain",
        optionA: formatINR(result.directGain),
        optionB: formatINR(result.regularGain),
        winner: "A" as const,
      },
      {
        label: "Net Return",
        optionA: `${result.directNetReturn}%`,
        optionB: `${result.regularNetReturn}%`,
        winner: "A" as const,
      },
      {
        label: "Expense Ratio",
        optionA: `${directExpenseRatio}%`,
        optionB: `${regularExpenseRatio}%`,
        winner: "A" as const,
      },
      {
        label: "Cost Over Time",
        optionA: "Lower",
        optionB: formatINR(result.costOfRegular),
        winner: "A" as const,
      },
      {
        label: "Advisor Support",
        optionA: "Self-managed",
        optionB: "Distributor helps",
        winner: "B" as const,
      },
      {
        label: "NAV",
        optionA: "Higher NAV",
        optionB: "Lower NAV",
        winner: "A" as const,
      },
      {
        label: "Ease of Access",
        optionA: "AMC / Kuvera / Coin",
        optionB: "Any distributor / bank",
        winner: "B" as const,
      },
    ],
    [result, directExpenseRatio, regularExpenseRatio],
  );

  const verdict = useMemo(
    () => ({
      winner: "A" as const,
      title: `Direct plan saves you ${formatINR(result.valueDiff)} over ${years} years`,
      description: `The ${result.expenseRatioDiff}% expense ratio difference compounds to ${formatINR(result.valueDiff)} (${result.percentMore}% more) over ${years} years. Direct plans always have higher NAV because no commission is paid. Use Kuvera, Zerodha Coin, or AMC websites to invest in direct plans.`,
    }),
    [result, years],
  );

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(sipAmount)}/month SIP mein Direct plan ${formatINR(result.valueDiff)} zyada deta hai ${years} saal mein. Ye sirf expense ratio ka fark hai — ${result.expenseRatioDiff}%.`,
    );
    ins.push(
      `Regular plan mein distributor ko trail commission milta hai (0.5-1.5% annually). Ye aapke returns se katta hai — aapko pata bhi nahi chalta.`,
    );
    ins.push(
      `Direct plan mein switch karna free hai — same AMC mein regular se direct plan mein move kar sakte ho. Capital gains tax lagega but long-term mein worth it hai.`,
    );
    if (years >= 15) {
      ins.push(
        `${years} saal mein compounding effect massive hai. ${result.expenseRatioDiff}% ka chhota sa fark ${formatINR(result.costOfRegular)} ka loss ban gaya. Isliye kehte hain — expense ratio matters!`,
      );
    }
    ins.push(
      `Free platforms: Kuvera (completely free), Zerodha Coin (₹50/month for demat), MFU Online, AMC website. Koi bhi use karo — direct plan lo.`,
    );
    return ins;
  }, [result, sipAmount, years]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            SIP & Fund Details
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
              label="Fund Return (Before Expense) %"
              icon={TrendingUp}
              value={fundReturn}
              onChange={setFundReturn}
              min={8}
              max={20}
              step={0.5}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Regular Plan Expense Ratio %"
              icon={Percent}
              value={regularExpenseRatio}
              onChange={setRegularExpenseRatio}
              min={1}
              max={2.5}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Direct Plan Expense Ratio %"
              icon={Percent}
              value={directExpenseRatio}
              onChange={setDirectExpenseRatio}
              min={0.1}
              max={1.5}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
          </div>
          <div className="mt-5 p-3 bg-action-green/10 border border-green-100 rounded-sm">
            <p className="text-xs text-green-800">
              <strong>Invested:</strong> {formatINR(result.totalInvested)} |{" "}
              <strong>ER diff:</strong> {result.expenseRatioDiff}%
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Direct Plan"
            titleB="Regular Plan"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.directFV)}
            valueLabelA="Final Corpus"
            valueB={formatINR(result.regularFV)}
            valueLabelB="Final Corpus"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators
          currentSlug="direct-vs-regular-mf"
          variant="strip"
        />
      </div>
    </div>
  );
}
