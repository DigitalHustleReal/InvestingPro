"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Clock,
  Percent,
  ShieldCheck,
  UserCheck,
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

export function POFDvsBankFDCalculator() {
  const [investment, setInvestment] = useState(500000);
  const [poRate, setPoRate] = useState(7.5);
  const [bankRate, setBankRate] = useState(7.0);
  const [tenure, setTenure] = useState(5);
  const [taxSlabIndex, setTaxSlabIndex] = useState(2);
  const [isSenior, setIsSenior] = useState(false);

  const taxRate = TAX_SLABS[taxSlabIndex].rate;

  const result = useMemo(() => {
    // Senior citizen bonus: +0.5% at most banks, PO FD no senior benefit
    const effectiveBankRate = isSenior ? bankRate + 0.5 : bankRate;

    // PO FD: quarterly compounding
    const poQuarterlyRate = poRate / 100 / 4;
    const poQuarters = tenure * 4;
    const poMaturity = investment * Math.pow(1 + poQuarterlyRate, poQuarters);
    const poInterest = poMaturity - investment;

    // PO FD tax: TDS from Apr 2023 if interest > ₹40K (₹50K for senior)
    // Interest is taxed at slab rate
    const poTdsThreshold = isSenior ? 50000 : 40000;
    const poAnnualInterest = poInterest / tenure;
    const poTdsApplies = poAnnualInterest > poTdsThreshold;
    const poTax = Math.round(poInterest * taxRate);
    const poPostTax = Math.round(poMaturity - poTax);
    const poEffectiveRate =
      (Math.pow(poPostTax / investment, 1 / tenure) - 1) * 100;

    // 80C benefit: only for 5-year PO FD (Tax Saving FD)
    const po80CEligible = tenure === 5;
    const po80CBenefit = po80CEligible
      ? Math.round(Math.min(investment, 150000) * taxRate)
      : 0;

    // Bank FD: quarterly compounding
    const bankQuarterlyRate = effectiveBankRate / 100 / 4;
    const bankQuarters = tenure * 4;
    const bankMaturity =
      investment * Math.pow(1 + bankQuarterlyRate, bankQuarters);
    const bankInterest = bankMaturity - investment;

    // Bank FD tax: TDS if interest > ₹40K (₹50K senior)
    const bankTdsThreshold = isSenior ? 50000 : 40000;
    const bankAnnualInterest = bankInterest / tenure;
    const bankTdsApplies = bankAnnualInterest > bankTdsThreshold;
    const bankTax = Math.round(bankInterest * taxRate);
    const bankPostTax = Math.round(bankMaturity - bankTax);
    const bankEffectiveRate =
      (Math.pow(bankPostTax / investment, 1 / tenure) - 1) * 100;

    // Bank 80C: 5-year tax saver FD eligible
    const bank80CEligible = tenure === 5;
    const bank80CBenefit = bank80CEligible
      ? Math.round(Math.min(investment, 150000) * taxRate)
      : 0;

    // Premature penalty
    const poPenalty = tenure <= 1 ? "Not allowed" : "1-2% penalty";
    const bankPenalty = "0.5-1% penalty";

    const winner =
      poPostTax > bankPostTax ? "po" : poPostTax < bankPostTax ? "bank" : "tie";
    const diff = Math.abs(poPostTax - bankPostTax);

    return {
      investment,
      poMaturity: Math.round(poMaturity),
      poInterest: Math.round(poInterest),
      poTax,
      poPostTax,
      poEffectiveRate,
      po80CEligible,
      po80CBenefit,
      poTdsApplies,
      poPenalty,
      bankMaturity: Math.round(bankMaturity),
      bankInterest: Math.round(bankInterest),
      bankTax,
      bankPostTax,
      bankEffectiveRate,
      bank80CEligible,
      bank80CBenefit,
      bankTdsApplies,
      bankPenalty,
      effectiveBankRate,
      winner,
      diff,
    };
  }, [investment, poRate, bankRate, tenure, taxRate, isSenior]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Invested",
        optionA: formatINR(result.investment),
        optionB: formatINR(result.investment),
        winner: "tie" as const,
      },
      {
        label: "Maturity Value",
        optionA: formatINR(result.poMaturity),
        optionB: formatINR(result.bankMaturity),
        winner:
          result.poMaturity > result.bankMaturity
            ? ("A" as const)
            : result.poMaturity < result.bankMaturity
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Interest Earned",
        optionA: formatINR(result.poInterest),
        optionB: formatINR(result.bankInterest),
        winner:
          result.poInterest > result.bankInterest
            ? ("A" as const)
            : result.poInterest < result.bankInterest
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Tax Paid",
        optionA: formatINR(result.poTax),
        optionB: formatINR(result.bankTax),
        winner:
          result.poTax < result.bankTax
            ? ("A" as const)
            : result.poTax > result.bankTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Post-Tax Value",
        optionA: formatINR(result.poPostTax),
        optionB: formatINR(result.bankPostTax),
        winner:
          result.poPostTax > result.bankPostTax
            ? ("A" as const)
            : result.poPostTax < result.bankPostTax
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Effective Rate",
        optionA: `${result.poEffectiveRate.toFixed(2)}%`,
        optionB: `${result.bankEffectiveRate.toFixed(2)}%`,
        winner:
          result.poEffectiveRate > result.bankEffectiveRate
            ? ("A" as const)
            : result.poEffectiveRate < result.bankEffectiveRate
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Safety",
        optionA: "Sovereign (GOI)",
        optionB: "DICGC ₹5L",
        winner: "A" as const,
      },
      {
        label: "80C Benefit",
        optionA: result.po80CEligible ? "Yes (5yr)" : "No",
        optionB: result.bank80CEligible ? "Yes (5yr)" : "No",
        winner:
          result.po80CEligible && result.bank80CEligible
            ? ("tie" as const)
            : result.po80CEligible
              ? ("A" as const)
              : result.bank80CEligible
                ? ("B" as const)
                : ("tie" as const),
      },
      {
        label: "Premature Exit",
        optionA: result.poPenalty,
        optionB: result.bankPenalty,
        winner: "B" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.winner === "po") {
      return {
        winner: "A" as const,
        title: `Post Office FD gives ${formatINR(result.diff)} more after tax`,
        description: `With ${poRate}% rate and sovereign guarantee, PO FD beats Bank FD at ${bankRate}% by ${formatINR(result.diff)} post-tax over ${tenure} years. Plus, your entire amount has government guarantee — no ₹5L DICGC limit.`,
      };
    } else if (result.winner === "bank") {
      return {
        winner: "B" as const,
        title: `Bank FD gives ${formatINR(result.diff)} more after tax`,
        description: `Bank FD at ${result.effectiveBankRate}%${isSenior ? " (incl. senior citizen bonus)" : ""} beats PO FD at ${poRate}% by ${formatINR(result.diff)} post-tax. However, bank deposits above ₹5L don't have full guarantee.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both options give nearly equal returns",
      description:
        "Returns are similar — choose PO FD for sovereign safety or Bank FD for convenience and better premature withdrawal terms.",
    };
  }, [result, poRate, bankRate, tenure, isSenior]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(investment)} invest kiya ${tenure} saal ke liye. PO FD: ${formatINR(result.poPostTax)} vs Bank FD: ${formatINR(result.bankPostTax)} after tax.`,
    );
    if (result.winner === "po") {
      ins.push(
        `Post office mein sovereign guarantee hai — GOI ki guarantee, koi limit nahi. Bank mein sirf ₹5L tak DICGC cover hai. Safety ke liye PO FD best hai.`,
      );
    }
    if (isSenior) {
      ins.push(
        `Senior citizens ko bank FD mein +0.5% extra milta hai (${result.effectiveBankRate}% effective). PO FD mein senior citizen benefit nahi hai, par SCSS (8.2%) consider karo — better rate + 80C.`,
      );
    }
    if (tenure === 5) {
      ins.push(
        `5 saal ki PO FD aur Bank Tax Saver FD dono 80C eligible hain. ₹1.5L tak tax deduction mil sakti hai — ${formatINR(result.po80CBenefit)} tax bachega.`,
      );
    }
    if (investment > 500000) {
      ins.push(
        `${formatINR(investment)} invest kar rahe ho — Bank FD mein ₹5L se zyada risky hai (DICGC limit). Split karo multiple banks mein ya PO FD use karo for full safety.`,
      );
    }
    ins.push(
      `Pro tip: PO FD + Bank FD dono mein diversify karo. ₹5L tak Bank FD (better liquidity), baaki PO FD (sovereign guarantee).`,
    );
    return ins;
  }, [result, investment, tenure, isSenior]);

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
              label="Investment Amount"
              icon={IndianRupee}
              value={investment}
              onChange={setInvestment}
              min={1000}
              max={5000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="PO FD Rate (%)"
              icon={ShieldCheck}
              value={poRate}
              onChange={setPoRate}
              min={5}
              max={9}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Bank FD Rate (%)"
              icon={Percent}
              value={bankRate}
              onChange={setBankRate}
              min={4}
              max={9}
              step={0.25}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Tenure (Years)"
              icon={Clock}
              value={tenure}
              onChange={setTenure}
              min={1}
              max={10}
              step={1}
              formatDisplay={(v) => `${v} years`}
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
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setIsSenior(!isSenior)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium border transition-all ${
                  isSenior
                    ? "bg-action-green/10 border-green-300 text-authority-green"
                    : "bg-canvas border-ink/10 text-ink-60 hover:border-gray-300"
                }`}
              >
                <UserCheck size={16} />
                Senior Citizen (60+)
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="Post Office FD"
            titleB="Bank FD"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.poPostTax)}
            valueLabelA="Post-Tax Value"
            valueB={formatINR(result.bankPostTax)}
            valueLabelB="Post-Tax Value"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="po-fd-vs-bank-fd" variant="strip" />
      </div>
    </div>
  );
}
