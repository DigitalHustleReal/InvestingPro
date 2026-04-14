"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Percent, Shield } from "lucide-react";
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
  formatINR,
  yAxisINR,
} from "./shared/charts";

type TaxRegime = "old" | "new";

export function ELSSCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(12500);
  const [expectedReturn, setExpectedReturn] = useState(14);
  const [tenure, setTenure] = useState(10);
  const [taxSlab, setTaxSlab] = useState(30);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const result = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = tenure * 12;
    const annualInvestment = monthlyInvestment * 12;

    // SIP future value
    const futureValue =
      monthlyRate === 0
        ? monthlyInvestment * months
        : monthlyInvestment *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);
    const totalInvested = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvested;

    // Tax savings under 80C (old regime only, max ₹1.5L)
    const eligible80C = Math.min(annualInvestment, 150000);
    const annualTaxSaved =
      regime === "old" ? Math.round((eligible80C * taxSlab) / 100) : 0;
    const totalTaxSaved = annualTaxSaved * tenure;

    // Effective cost (investment - tax saved)
    const effectiveCost = totalInvested - totalTaxSaved;
    const effectiveReturn =
      effectiveCost > 0
        ? ((futureValue - effectiveCost) / effectiveCost) * 100
        : 0;

    // LTCG tax on gains (12.5% above ₹1.25L exemption)
    const ltcgExemption = 125000;
    const taxableGain = Math.max(0, totalReturns - ltcgExemption);
    const ltcgTax = Math.round(taxableGain * 0.125);
    const postTaxValue = Math.round(futureValue) - ltcgTax;

    // Compare with other 80C options
    const ppfReturn = 7.1; // current PPF rate
    const ppfFV =
      monthlyRate === 0
        ? totalInvested
        : monthlyInvestment *
          ((Math.pow(1 + ppfReturn / 100 / 12, months) - 1) /
            (ppfReturn / 100 / 12)) *
          (1 + ppfReturn / 100 / 12);
    const fdReturn = 7.5; // tax-saving FD rate
    const fdFV =
      monthlyInvestment *
      ((Math.pow(1 + fdReturn / 100 / 12, months) - 1) /
        (fdReturn / 100 / 12)) *
      (1 + fdReturn / 100 / 12);

    // Year-wise data
    const yearlyData = [];
    for (let y = 1; y <= tenure; y++) {
      const yMonths = y * 12;
      const yInvested = monthlyInvestment * yMonths;
      const yValue =
        monthlyRate === 0
          ? yInvested
          : monthlyInvestment *
            ((Math.pow(1 + monthlyRate, yMonths) - 1) / monthlyRate) *
            (1 + monthlyRate);
      yearlyData.push({
        year: `Y${y}`,
        invested: Math.round(yInvested),
        value: Math.round(yValue),
        taxSaved: annualTaxSaved * y,
      });
    }

    return {
      futureValue: Math.round(futureValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
      annualTaxSaved,
      totalTaxSaved,
      effectiveCost: Math.round(effectiveCost),
      effectiveReturn: Math.round(effectiveReturn * 10) / 10,
      ltcgTax,
      postTaxValue,
      ppfFV: Math.round(ppfFV),
      fdFV: Math.round(fdFV),
      yearlyData,
      eligible80C,
    };
  }, [monthlyInvestment, expectedReturn, tenure, taxSlab, regime]);

  const scenarios = useMemo(() => {
    const calc = (ret: number) => {
      const mr = ret / 100 / 12;
      const months = tenure * 12;
      return Math.round(
        monthlyInvestment * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr),
      );
    };
    return [
      {
        label: "PPF (7.1%)",
        description: "Risk-free, tax-free returns",
        value: formatINR(result.ppfFV),
        subtext: `Lock-in: 15 years`,
        type: "conservative" as const,
      },
      {
        label: "ELSS (14%)",
        description: "Equity with tax benefit",
        value: formatINR(calc(14)),
        subtext: `Lock-in: 3 years only`,
        type: "moderate" as const,
      },
      {
        label: "Mid Cap MF (16%)",
        description: "Higher risk, no 80C",
        value: formatINR(calc(16)),
        subtext: `No lock-in, no tax saving`,
        type: "aggressive" as const,
      },
    ];
  }, [monthlyInvestment, tenure, result.ppfFV]);

  const insights = useMemo(() => {
    const ins: string[] = [];

    if (regime === "old") {
      ins.push(
        `ELSS mein ${formatINR(monthlyInvestment * 12)}/year invest karke ${formatINR(result.annualTaxSaved)} tax bachao (${taxSlab}% slab). ${tenure} saal mein total ${formatINR(result.totalTaxSaved)} tax saved!`,
      );
      ins.push(
        `Effective cost: ${formatINR(result.effectiveCost)} (investment minus tax savings). Effective return: ${result.effectiveReturn}% — PPF se bahut zyada.`,
      );
    } else {
      ins.push(
        `New tax regime mein 80C deduction nahi milta. ELSS ka tax benefit sirf Old Regime mein hai. Agar invest karna hai toh index fund consider karein — lower expense ratio, no lock-in.`,
      );
    }

    ins.push(
      `ELSS ka lock-in sirf 3 saal hai — PPF (15 saal) aur Tax FD (5 saal) se bahut kam. After 3 years, redeem karke fir se invest karein for next year's 80C.`,
    );

    if (monthlyInvestment * 12 < 150000) {
      const gap = 150000 - monthlyInvestment * 12;
      ins.push(
        `Aap 80C limit ka full use nahi kar rahe. ${formatINR(gap)} aur invest karein ELSS mein — ${formatINR(Math.round((gap * taxSlab) / 100))} extra tax bachega.`,
      );
    }

    return ins;
  }, [result, monthlyInvestment, tenure, taxSlab, regime]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title="Future Value"
          value={formatINR(result.futureValue)}
          ratingLabel={`Tax Saved: ${formatINR(result.totalTaxSaved)} | Returns: ${formatINR(result.totalReturns)}`}
          ratingType={result.annualTaxSaved > 0 ? "positive" : "neutral"}
          metrics={[
            { label: "Invested", value: formatINR(result.totalInvested) },
            { label: "Returns", value: formatINR(result.totalReturns) },
            { label: "Tax Saved/yr", value: formatINR(result.annualTaxSaved) },
            { label: "Post-Tax Value", value: formatINR(result.postTaxValue) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            ELSS Investment Details
          </h2>
          <div className="space-y-5">
            {/* Tax Regime Toggle */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Tax Regime
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRegime("old")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    regime === "old"
                      ? "bg-green-50 border-green-600 text-green-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Old Regime (80C)
                </button>
                <button
                  onClick={() => setRegime("new")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    regime === "new"
                      ? "bg-green-50 border-green-600 text-green-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  New Regime (No 80C)
                </button>
              </div>
            </div>

            <SliderInput
              label="Monthly SIP Amount"
              icon={IndianRupee}
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              min={500}
              max={50000}
              step={500}
              formatDisplay={(v) => `${formatINR(v)} (${formatINR(v * 12)}/yr)`}
            />
            <SliderInput
              label="Expected Return"
              icon={Percent}
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={8}
              max={20}
              step={0.5}
              suffix="% p.a."
            />
            <SliderInput
              label="Investment Period"
              icon={Calendar}
              value={tenure}
              onChange={setTenure}
              min={3}
              max={25}
              step={1}
              suffix=" Yrs"
            />
            {regime === "old" && (
              <SliderInput
                label="Your Tax Slab"
                icon={Shield}
                value={taxSlab}
                onChange={setTaxSlab}
                min={0}
                max={30}
                step={5}
                suffix="%"
              />
            )}

            {/* 80C Utilization Bar */}
            {regime === "old" && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-green-700 font-medium">
                    Section 80C Utilization
                  </span>
                  <span className="text-green-600">
                    {formatINR(result.eligible80C)} / ₹1.5L
                  </span>
                </div>
                <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (result.eligible80C / 150000) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Future Value"
              value={formatINR(result.futureValue)}
              ratingLabel={`Tax Saved: ${formatINR(result.totalTaxSaved)} | Returns: ${formatINR(result.totalReturns)}`}
              ratingType={result.annualTaxSaved > 0 ? "positive" : "neutral"}
              metrics={[
                { label: "Invested", value: formatINR(result.totalInvested) },
                { label: "Returns", value: formatINR(result.totalReturns) },
                {
                  label: "Tax Saved/yr",
                  value: formatINR(result.annualTaxSaved),
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
            ELSS Growth + Tax Savings Over Time
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="elInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="elVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="elTax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
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
                  fill="url(#elInv)"
                  name="Invested"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#elVal)"
                  name="Value"
                />
                {regime === "old" && (
                  <Area
                    type="monotone"
                    dataKey="taxSaved"
                    stroke="#d97706"
                    strokeWidth={2}
                    fill="url(#elTax)"
                    name="Tax Saved"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ProductRecs
          category="mutual-funds"
          title="Top ELSS Funds"
          matchCriteria="ELSS tax saving"
        />
      </div>

      {/* 80C Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Section 80C Options Compared — {formatINR(monthlyInvestment * 12)}/yr
          for {tenure} years
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-gray-500 font-medium">
                Option
              </th>
              <th className="text-center py-2 text-gray-500 font-medium">
                Returns
              </th>
              <th className="text-center py-2 text-gray-500 font-medium">
                Lock-in
              </th>
              <th className="text-center py-2 text-gray-500 font-medium">
                Risk
              </th>
              <th className="text-right py-2 text-gray-500 font-medium">
                Value in {tenure}Y
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 bg-green-50">
              <td className="py-2.5 font-medium text-gray-900">
                ELSS Mutual Fund
              </td>
              <td className="text-center py-2.5 text-gray-600">12-16%</td>
              <td className="text-center py-2.5 text-green-700 font-medium">
                3 years
              </td>
              <td className="text-center py-2.5 text-amber-600">High</td>
              <td className="text-right py-2.5 font-bold text-green-700">
                {formatINR(result.futureValue)}
              </td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 font-medium text-gray-900">PPF</td>
              <td className="text-center py-2.5 text-gray-600">7.1%</td>
              <td className="text-center py-2.5 text-gray-600">15 years</td>
              <td className="text-center py-2.5 text-green-600">Zero</td>
              <td className="text-right py-2.5 font-semibold text-gray-900">
                {formatINR(result.ppfFV)}
              </td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 font-medium text-gray-900">
                Tax-Saving FD
              </td>
              <td className="text-center py-2.5 text-gray-600">7.5%</td>
              <td className="text-center py-2.5 text-gray-600">5 years</td>
              <td className="text-center py-2.5 text-green-600">Zero</td>
              <td className="text-right py-2.5 font-semibold text-gray-900">
                {formatINR(result.fdFV)}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2">
          * ELSS returns are market-linked and not guaranteed. PPF returns are
          government-guaranteed. FD returns are taxable yearly.
        </p>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="elss" variant="strip" />
      </div>
    </div>
  );
}
