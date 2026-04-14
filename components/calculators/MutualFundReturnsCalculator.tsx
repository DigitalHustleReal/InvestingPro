"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Percent, TrendingUp } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import { ProductRecs } from "./shared/ProductRecs";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  formatINR,
  yAxisINR,
} from "./shared/charts";

type InvestmentMode = "lumpsum" | "sip" | "both";

export function MutualFundReturnsCalculator() {
  const [mode, setMode] = useState<InvestmentMode>("sip");
  const [sipAmount, setSipAmount] = useState(10000);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenure, setTenure] = useState(10);
  const [expenseRatio, setExpenseRatio] = useState(0.5);

  const result = useMemo(() => {
    const effectiveReturn = expectedReturn - expenseRatio;
    const monthlyRate = effectiveReturn / 100 / 12;
    const months = tenure * 12;

    // SIP calculation
    let sipFV = 0;
    let sipInvested = 0;
    if (mode === "sip" || mode === "both") {
      sipInvested = sipAmount * months;
      if (monthlyRate === 0) {
        sipFV = sipInvested;
      } else {
        sipFV =
          sipAmount *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);
      }
    }

    // Lumpsum calculation
    let lumpsumFV = 0;
    let lumpsumInvested = 0;
    if (mode === "lumpsum" || mode === "both") {
      lumpsumInvested = lumpsumAmount;
      lumpsumFV = lumpsumAmount * Math.pow(1 + effectiveReturn / 100, tenure);
    }

    const totalInvested = sipInvested + lumpsumInvested;
    const totalValue = Math.round(sipFV + lumpsumFV);
    const totalReturns = totalValue - Math.round(totalInvested);
    const absoluteReturn =
      totalInvested > 0
        ? ((totalValue - totalInvested) / totalInvested) * 100
        : 0;
    const cagr =
      totalInvested > 0
        ? (Math.pow(totalValue / totalInvested, 1 / tenure) - 1) * 100
        : 0;

    // Without expense ratio (direct plan equivalent comparison)
    const directMonthlyRate = expectedReturn / 100 / 12;
    let directSipFV = 0;
    let directLumpsumFV = 0;
    if (mode === "sip" || mode === "both") {
      directSipFV =
        directMonthlyRate === 0
          ? sipInvested
          : sipAmount *
            ((Math.pow(1 + directMonthlyRate, months) - 1) /
              directMonthlyRate) *
            (1 + directMonthlyRate);
    }
    if (mode === "lumpsum" || mode === "both") {
      directLumpsumFV =
        lumpsumAmount * Math.pow(1 + expectedReturn / 100, tenure);
    }
    const directValue = Math.round(directSipFV + directLumpsumFV);
    const expenseRatioCost = directValue - totalValue;

    // Year-wise data
    const yearlyData = [];
    for (let y = 1; y <= tenure; y++) {
      const yMonths = y * 12;
      let yInvested = 0;
      let yValue = 0;

      if (mode === "sip" || mode === "both") {
        yInvested += sipAmount * yMonths;
        yValue +=
          monthlyRate === 0
            ? sipAmount * yMonths
            : sipAmount *
              ((Math.pow(1 + monthlyRate, yMonths) - 1) / monthlyRate) *
              (1 + monthlyRate);
      }
      if (mode === "lumpsum" || mode === "both") {
        yInvested += lumpsumAmount;
        yValue += lumpsumAmount * Math.pow(1 + effectiveReturn / 100, y);
      }

      yearlyData.push({
        year: `Y${y}`,
        invested: Math.round(yInvested),
        value: Math.round(yValue),
      });
    }

    // Tax estimate (LTCG on equity MF: 12.5% above ₹1.25L, STCG: 20%)
    const ltcgExemption = 125000;
    const ltcgTax =
      tenure >= 1 ? Math.max(0, totalReturns - ltcgExemption) * 0.125 : 0;
    const stcgTax = tenure < 1 ? totalReturns * 0.2 : 0;
    const taxLiability = Math.round(tenure >= 1 ? ltcgTax : stcgTax);
    const postTaxValue = totalValue - taxLiability;

    return {
      totalInvested: Math.round(totalInvested),
      totalValue,
      totalReturns,
      absoluteReturn: Math.round(absoluteReturn * 100) / 100,
      cagr: Math.round(cagr * 100) / 100,
      expenseRatioCost: Math.round(expenseRatioCost),
      directValue,
      taxLiability,
      postTaxValue: Math.round(postTaxValue),
      yearlyData,
    };
  }, [mode, sipAmount, lumpsumAmount, expectedReturn, tenure, expenseRatio]);

  const scenarios = useMemo(() => {
    const calc = (ret: number) => {
      const eff = ret - expenseRatio;
      const mr = eff / 100 / 12;
      const months = tenure * 12;
      let val = 0;
      if (mode === "sip" || mode === "both") {
        val +=
          mr === 0
            ? sipAmount * months
            : sipAmount * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr);
      }
      if (mode === "lumpsum" || mode === "both") {
        val += lumpsumAmount * Math.pow(1 + eff / 100, tenure);
      }
      return Math.round(val);
    };
    return [
      {
        label: "Conservative (8%)",
        description: "Debt/Balanced Funds",
        value: formatINR(calc(8)),
        subtext: `Returns: ${formatINR(calc(8) - result.totalInvested)}`,
        type: "conservative" as const,
      },
      {
        label: "Moderate (12%)",
        description: "Large Cap/Index Funds",
        value: formatINR(calc(12)),
        subtext: `Returns: ${formatINR(calc(12) - result.totalInvested)}`,
        type: "moderate" as const,
      },
      {
        label: "Aggressive (15%)",
        description: "Mid/Small Cap Funds",
        value: formatINR(calc(15)),
        subtext: `Returns: ${formatINR(calc(15) - result.totalInvested)}`,
        type: "aggressive" as const,
      },
    ];
  }, [
    mode,
    sipAmount,
    lumpsumAmount,
    tenure,
    expenseRatio,
    result.totalInvested,
  ]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(result.totalInvested)} invest karke ${tenure} saal mein ${formatINR(result.totalValue)} milega — ${formatINR(result.totalReturns)} pure returns (${result.absoluteReturn}% absolute, ${result.cagr}% CAGR).`,
    );
    if (expenseRatio > 0.3) {
      ins.push(
        `Expense ratio ${expenseRatio}% hai — Direct plan switch karein toh ${formatINR(result.expenseRatioCost)} zyada milega! Regular vs Direct ka fark ${tenure} saal mein bahut bada hota hai.`,
      );
    }
    if (tenure >= 1 && result.totalReturns > 125000) {
      ins.push(
        `Tax: ₹1.25L tak LTCG exempt hai. Usse upar ${formatINR(result.taxLiability)} tax lagega (12.5%). Post-tax value: ${formatINR(result.postTaxValue)}.`,
      );
    }
    if (tenure >= 7) {
      ins.push(
        `${tenure} saal mein aapka paisa ${(result.totalValue / result.totalInvested).toFixed(1)}x ho gaya. Compounding ka jaadu time ke saath badhta hai — SIP band mat karna.`,
      );
    }
    return ins;
  }, [result, tenure, expenseRatio]);

  const pieData = [
    { name: "Invested", value: result.totalInvested, color: "#166534" },
    {
      name: "Returns",
      value: Math.max(0, result.totalReturns),
      color: "#22c55e",
    },
    { name: "Tax (est.)", value: result.taxLiability, color: "#dc2626" },
  ].filter((d) => d.value > 0);

  const modeOptions: { value: InvestmentMode; label: string }[] = [
    { value: "sip", label: "SIP" },
    { value: "lumpsum", label: "Lumpsum" },
    { value: "both", label: "SIP + Lumpsum" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title="Total Value"
          value={formatINR(result.totalValue)}
          ratingLabel={`CAGR: ${result.cagr}% | Returns: ${formatINR(result.totalReturns)}`}
          ratingType={result.cagr >= 10 ? "positive" : "neutral"}
          metrics={[
            { label: "Invested", value: formatINR(result.totalInvested) },
            { label: "Returns", value: formatINR(result.totalReturns) },
            { label: "Absolute Return", value: `${result.absoluteReturn}%` },
            { label: "Post-Tax Value", value: formatINR(result.postTaxValue) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Investment Details
          </h2>
          <div className="space-y-5">
            {/* Mode Toggle */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Investment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {modeOptions.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMode(m.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      mode === m.value
                        ? "bg-green-50 border-green-600 text-green-700"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {(mode === "sip" || mode === "both") && (
              <SliderInput
                label="Monthly SIP Amount"
                icon={IndianRupee}
                value={sipAmount}
                onChange={setSipAmount}
                min={500}
                max={200000}
                step={500}
                formatDisplay={formatINR}
              />
            )}
            {(mode === "lumpsum" || mode === "both") && (
              <SliderInput
                label="Lumpsum Amount"
                icon={IndianRupee}
                value={lumpsumAmount}
                onChange={setLumpsumAmount}
                min={10000}
                max={10000000}
                step={10000}
                formatDisplay={formatINR}
              />
            )}
            <SliderInput
              label="Expected Annual Return"
              icon={TrendingUp}
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={4}
              max={25}
              step={0.5}
              suffix="% p.a."
            />
            <SliderInput
              label="Investment Period"
              icon={Calendar}
              value={tenure}
              onChange={setTenure}
              min={1}
              max={30}
              step={1}
              suffix=" Yrs"
            />
            <SliderInput
              label="Expense Ratio"
              icon={Percent}
              value={expenseRatio}
              onChange={setExpenseRatio}
              min={0}
              max={2.5}
              step={0.1}
              suffix="%"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Total Value"
              value={formatINR(result.totalValue)}
              ratingLabel={`CAGR: ${result.cagr}% | Returns: ${formatINR(result.totalReturns)}`}
              ratingType={result.cagr >= 10 ? "positive" : "neutral"}
              metrics={[
                { label: "Invested", value: formatINR(result.totalInvested) },
                { label: "Returns", value: formatINR(result.totalReturns) },
                {
                  label: "Absolute Return",
                  value: `${result.absoluteReturn}%`,
                },
                {
                  label: "Post-Tax Value",
                  value: formatINR(result.postTaxValue),
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Investment Growth Over Time
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="mfInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mfVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  fontSize={11}
                  tick={{ fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  fontSize={11}
                  tick={{ fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={yAxisINR}
                  width={50}
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#166534"
                  strokeWidth={2}
                  fill="url(#mfInv)"
                  name="Invested"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#mfVal)"
                  name="Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-gray-100">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <div>
                  <p className="text-[11px] text-gray-400">{d.name}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatINR(d.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ProductRecs
          category="mutual-funds"
          title="Top Mutual Funds"
          matchCriteria={`${expectedReturn}%+ returns`}
        />
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="mutual-fund-returns" variant="strip" />
      </div>
    </div>
  );
}
