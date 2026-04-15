"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Clock, Shield, Percent, Baby, Lock } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { VSComparisonLayout } from "./shared/VSComparisonLayout";
import { AIInsight } from "./shared/AIInsight";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import { formatINR } from "./shared/charts";

export function SSYvsPPFCalculator() {
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [daughterAge, setDaughterAge] = useState(5);
  const [ssyRate, setSsyRate] = useState(8.2);
  const [ppfRate, setPpfRate] = useState(7.1);

  const result = useMemo(() => {
    // SSY: Deposits allowed for 15 years from account opening (max age 10 at opening).
    // Account matures when girl turns 21.
    // Partial withdrawal (50% of balance) allowed at age 18.
    const ssyDepositYears = 15;
    const ssyMaturityAge = 21;
    const ssyTotalYears = ssyMaturityAge - daughterAge;
    const ssyRateDecimal = ssyRate / 100;

    let ssyBalance = 0;
    const ssyTotalInvested = annualInvestment * ssyDepositYears;
    for (let y = 1; y <= ssyTotalYears; y++) {
      if (y <= ssyDepositYears) {
        ssyBalance += annualInvestment;
      }
      ssyBalance *= 1 + ssyRateDecimal;
    }
    const ssyMaturity = Math.round(ssyBalance);
    const ssyInterest = ssyMaturity - ssyTotalInvested;
    const ssyPartialAt18 = Math.round(ssyBalance * 0.5); // indicative

    // SSY 80C benefit: principal up to 1.5L per year
    const ssy80C = Math.min(annualInvestment, 150000);
    const ssy80CTotal = ssy80C * ssyDepositYears;

    // PPF: 15 year lock-in, extendable in 5-year blocks.
    // We compare over same investment horizon as SSY deposit period (15 years).
    const ppfYears = 15;
    const ppfRateDecimal = ppfRate / 100;
    const ppfTotalInvested = Math.min(annualInvestment, 150000) * ppfYears;
    const ppfAnnual = Math.min(annualInvestment, 150000); // PPF max 1.5L/year
    let ppfBalance = 0;
    for (let y = 1; y <= ppfYears; y++) {
      ppfBalance = (ppfBalance + ppfAnnual) * (1 + ppfRateDecimal);
    }
    const ppfMaturity = Math.round(ppfBalance);
    const ppfInterest = ppfMaturity - ppfTotalInvested;
    const ppf80C = Math.min(ppfAnnual, 150000);
    const ppf80CTotal = ppf80C * ppfYears;

    // Effective CAGR
    const ssyCAGR =
      ssyTotalInvested > 0
        ? (Math.pow(ssyMaturity / ssyTotalInvested, 1 / ssyTotalYears) - 1) *
          100
        : 0;
    const ppfCAGR =
      ppfTotalInvested > 0
        ? (Math.pow(ppfMaturity / ppfTotalInvested, 1 / ppfYears) - 1) * 100
        : 0;

    const winner =
      ssyMaturity > ppfMaturity
        ? "ssy"
        : ssyMaturity < ppfMaturity
          ? "ppf"
          : "tie";
    const diff = Math.abs(ssyMaturity - ppfMaturity);

    return {
      ssyTotalInvested,
      ssyMaturity,
      ssyInterest,
      ssyPartialAt18,
      ssy80CTotal,
      ssyTotalYears,
      ssyCAGR: Math.round(ssyCAGR * 100) / 100,
      ppfTotalInvested,
      ppfMaturity,
      ppfInterest,
      ppf80CTotal,
      ppfCAGR: Math.round(ppfCAGR * 100) / 100,
      winner,
      diff,
    };
  }, [annualInvestment, daughterAge, ssyRate, ppfRate]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Maturity Value",
        optionA: formatINR(result.ssyMaturity),
        optionB: formatINR(result.ppfMaturity),
        winner:
          result.ssyMaturity > result.ppfMaturity
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Total Invested",
        optionA: formatINR(result.ssyTotalInvested),
        optionB: formatINR(result.ppfTotalInvested),
        winner: "tie" as const,
      },
      {
        label: "Interest Earned",
        optionA: formatINR(result.ssyInterest),
        optionB: formatINR(result.ppfInterest),
        winner:
          result.ssyInterest > result.ppfInterest
            ? ("A" as const)
            : ("B" as const),
      },
      {
        label: "Interest Rate",
        optionA: `${ssyRate}% p.a.`,
        optionB: `${ppfRate}% p.a.`,
        winner: ssyRate > ppfRate ? ("A" as const) : ("B" as const),
      },
      {
        label: "Tax Status",
        optionA: "EEE (fully tax-free)",
        optionB: "EEE (fully tax-free)",
        winner: "tie" as const,
      },
      {
        label: "80C Benefit",
        optionA: `Up to ₹1.5L/year`,
        optionB: `Up to ₹1.5L/year`,
        winner: "tie" as const,
      },
      {
        label: "Maturity Period",
        optionA: `${result.ssyTotalYears} yrs (age 21)`,
        optionB: "15 years (extendable)",
        winner: result.ssyTotalYears <= 15 ? ("A" as const) : ("B" as const),
      },
      {
        label: "Liquidity",
        optionA: "Partial at 18, mature at 21",
        optionB: "Partial from 7th year",
        winner: "B" as const,
      },
      {
        label: "Eligibility",
        optionA: "Girl child only (max age 10)",
        optionB: "Any Indian resident",
        winner: "B" as const,
      },
      {
        label: "Safety",
        optionA: "Govt backed (sovereign)",
        optionB: "Govt backed (sovereign)",
        winner: "tie" as const,
      },
    ],
    [result, ssyRate, ppfRate],
  );

  const verdict = useMemo(() => {
    if (result.winner === "ssy") {
      return {
        winner: "A" as const,
        title: `SSY gives ${formatINR(result.diff)} more at maturity`,
        description: `Sukanya Samriddhi offers a higher interest rate (${ssyRate}% vs ${ppfRate}%) with the same EEE tax benefit. For a girl child, SSY is clearly the better choice. The only trade-off is restricted eligibility and longer lock-in till age 21.`,
      };
    } else if (result.winner === "ppf") {
      return {
        winner: "B" as const,
        title: `PPF gives ${formatINR(result.diff)} more at maturity`,
        description: `With current rates, PPF edges ahead. PPF also offers more flexibility — anyone can open it, partial withdrawals from year 7, and it's extendable in 5-year blocks indefinitely.`,
      };
    }
    return {
      winner: "tie" as const,
      title: "Both schemes give similar returns",
      description:
        "Both are EEE, government-backed, and safe. SSY has a higher rate but is restricted to girl child. PPF is more flexible.",
    };
  }, [result, ssyRate, ppfRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `Beti ki age ${daughterAge} saal hai — SSY mein ${result.ssyTotalYears} saal mein ${formatINR(result.ssyMaturity)} milega, PPF mein 15 saal mein ${formatINR(result.ppfMaturity)}.`,
    );
    ins.push(
      `SSY ka rate ${ssyRate}% hai jo PPF ke ${ppfRate}% se zyada hai. Beti ke liye SSY best option hai — 80C benefit bhi milega aur interest bhi zyada.`,
    );
    ins.push(
      `Dono mein EEE status hai — matlab invest, interest, aur maturity teeno pe zero tax. Paisa lagao, tension free raho.`,
    );
    ins.push(
      `Smart move: Beti ke naam SSY kholo (₹1.5L/year max), baaki savings apne naam PPF mein. Dono ka 80C benefit lo, family ka tax optimize karo.`,
    );
    return ins;
  }, [result, daughterAge, ssyRate, ppfRate]);

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
              min={250}
              max={150000}
              step={5000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Daughter's Current Age"
              icon={Baby}
              value={daughterAge}
              onChange={setDaughterAge}
              min={0}
              max={10}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
            <SliderInput
              label="SSY Interest Rate"
              icon={Percent}
              value={ssyRate}
              onChange={setSsyRate}
              min={7}
              max={10}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="PPF Interest Rate"
              icon={Percent}
              value={ppfRate}
              onChange={setPpfRate}
              min={6}
              max={9}
              step={0.1}
              formatDisplay={(v) => `${v}%`}
            />
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <Shield className="w-3.5 h-3.5 inline mr-1" />
                Both SSY & PPF are government-backed with EEE tax status. SSY
                rate is reviewed quarterly by the Ministry of Finance.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="SSY"
            titleB="PPF"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.ssyMaturity)}
            valueLabelA="SSY Maturity"
            valueB={formatINR(result.ppfMaturity)}
            valueLabelB="PPF Maturity"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="ssy-vs-ppf" variant="strip" />
      </div>
    </div>
  );
}
