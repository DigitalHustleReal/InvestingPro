"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  Target,
  ArrowLeftRight,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import { ProductRecs } from "./shared/ProductRecs";
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
import { cn } from "@/lib/utils";

type Mode = "invest" | "goal";

export function SIPCalculatorV2() {
  const [mode, setMode] = useState<Mode>("invest");
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [goalAmount, setGoalAmount] = useState(2000000);

  // ─── Core SIP Math ────────────────────────────────────────────────
  const calcSIP = (monthly: number, yrs: number, rate: number) => {
    const r = rate / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return { fv: monthly * n, invested: monthly * n, returns: 0 };
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = monthly * n;
    return { fv, invested, returns: fv - invested };
  };

  // Reverse: given goal, find monthly SIP needed
  const calcReverseSIP = (goal: number, yrs: number, rate: number) => {
    const r = rate / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return goal / n;
    return goal / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  };

  const result = useMemo(() => {
    if (mode === "invest") {
      const { fv, invested, returns } = calcSIP(
        monthlyAmount,
        years,
        expectedReturn,
      );
      return { fv, invested, returns, monthly: monthlyAmount };
    } else {
      const needed = calcReverseSIP(goalAmount, years, expectedReturn);
      const { fv, invested, returns } = calcSIP(needed, years, expectedReturn);
      return {
        fv: goalAmount,
        invested,
        returns: goalAmount - invested,
        monthly: Math.ceil(needed),
      };
    }
  }, [mode, monthlyAmount, years, expectedReturn, goalAmount]);

  // ─── What-If Scenarios ────────────────────────────────────────────
  const scenarios = useMemo(() => {
    const conservative = calcSIP(result.monthly, years, 8);
    const moderate = calcSIP(result.monthly, years, 12);
    const aggressive = calcSIP(result.monthly, years, 15);
    return [
      {
        label: "Conservative",
        description: "Debt + Hybrid funds (8%)",
        value: formatINR(conservative.fv),
        subtext: `Returns: ${formatINR(conservative.returns)}`,
        type: "conservative" as const,
      },
      {
        label: "Moderate",
        description: "Large-cap index funds (12%)",
        value: formatINR(moderate.fv),
        subtext: `Returns: ${formatINR(moderate.returns)}`,
        type: "moderate" as const,
      },
      {
        label: "Aggressive",
        description: "Mid/Small-cap funds (15%)",
        value: formatINR(aggressive.fv),
        subtext: `Returns: ${formatINR(aggressive.returns)}`,
        type: "aggressive" as const,
      },
    ];
  }, [result.monthly, years]);

  // ─── AI Insights ──────────────────────────────────────────────────
  const insights = useMemo(() => {
    const ins: string[] = [];
    // Rule of 72
    const doublingYears = (72 / expectedReturn).toFixed(1);
    ins.push(
      `At ${expectedReturn}% CAGR, your money doubles every ${doublingYears} years (Rule of 72).`,
    );
    // Delay cost
    if (years >= 5) {
      const delayedFV = calcSIP(result.monthly, years - 1, expectedReturn).fv;
      const delayCost = result.fv - delayedFV;
      ins.push(
        `Starting 1 year late costs you ${formatINR(delayCost)}. Every year of delay gets more expensive.`,
      );
    }
    // FD comparison
    const fdFV = calcSIP(result.monthly, years, 7).fv;
    if (expectedReturn > 7) {
      ins.push(
        `SIP at ${expectedReturn}% gives ${formatINR(result.fv - fdFV)} more than an FD at 7% over ${years} years.`,
      );
    }
    return ins;
  }, [result, years, expectedReturn]);

  // ─── Chart Data ───────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const data = [];
    for (let y = 0; y <= years; y++) {
      const { fv, invested } = calcSIP(result.monthly, y, expectedReturn);
      data.push({
        year: `Y${y}`,
        value: Math.round(fv),
        invested: Math.round(invested),
      });
    }
    return data;
  }, [result.monthly, years, expectedReturn]);

  // ─── Year-wise Breakdown ──────────────────────────────────────────
  const [showAllYears, setShowAllYears] = useState(false);
  const yearlyBreakdown = useMemo(() => {
    const data = [];
    for (let y = 1; y <= years; y++) {
      const { fv, invested, returns } = calcSIP(
        result.monthly,
        y,
        expectedReturn,
      );
      data.push({
        year: y,
        invested: Math.round(invested),
        returns: Math.round(returns),
        total: Math.round(fv),
      });
    }
    return data;
  }, [result.monthly, years, expectedReturn]);

  const pieData = [
    { name: "Invested", value: Math.round(result.invested), color: "#166534" },
    { name: "Returns", value: Math.round(result.returns), color: "#22c55e" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ─── Top: Inputs + Result ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Mode Toggle — our differentiator #3 */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setMode("invest")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
                mode === "invest"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <IndianRupee size={14} /> I know my SIP
            </button>
            <button
              onClick={() => setMode("goal")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
                mode === "goal"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <Target size={14} /> I know my goal
            </button>
          </div>

          <div className="space-y-6">
            {mode === "invest" ? (
              <SliderInput
                label="Monthly SIP Amount"
                icon={IndianRupee}
                value={monthlyAmount}
                onChange={setMonthlyAmount}
                min={500}
                max={200000}
                step={500}
                formatDisplay={formatINR}
              />
            ) : (
              <SliderInput
                label="Target Goal Amount"
                icon={Target}
                value={goalAmount}
                onChange={setGoalAmount}
                min={100000}
                max={100000000}
                step={50000}
                formatDisplay={formatINR}
              />
            )}
            <SliderInput
              label="Investment Period"
              icon={Calendar}
              value={years}
              onChange={setYears}
              min={1}
              max={30}
              step={1}
              suffix=" Yrs"
            />
            <SliderInput
              label="Expected Return (p.a.)"
              icon={Percent}
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={4}
              max={25}
              step={0.5}
              suffix="%"
            />
          </div>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <ResultCard
            title={mode === "invest" ? "Future Value" : "Goal Amount"}
            value={formatINR(result.fv)}
            ratingLabel={`${((result.returns / result.invested) * 100).toFixed(0)}% returns`}
            ratingType={result.returns > 0 ? "positive" : "negative"}
            metrics={[
              {
                label: mode === "goal" ? "SIP Needed" : "Monthly SIP",
                value: formatINR(result.monthly),
                highlight: mode === "goal",
              },
              { label: "Total Invested", value: formatINR(result.invested) },
              {
                label: "Est. Returns",
                value: formatINR(result.returns),
                highlight: true,
              },
            ]}
          />
          {/* AI Insight — our differentiator #1 */}
          <AIInsight insights={insights} />
        </div>
      </div>

      {/* ─── What-If Scenarios — our differentiator #5 ──────────── */}
      <WhatIfScenarios scenarios={scenarios} />

      {/* ─── Chart + Product Recs ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Wealth Growth Over {years} Years
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sipGrowthV2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
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
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#166534"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  fill="none"
                  name="Invested"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#sipGrowthV2)"
                  name="Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Pie below chart */}
          <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-gray-100">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
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

        {/* Product Recs — our differentiator #2 */}
        <ProductRecs
          category="mutual-funds"
          title="Top Funds for SIP"
          matchCriteria={`Matching ${expectedReturn}% return`}
        />
      </div>

      {/* ─── Year-wise Breakdown ─────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Year-wise Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">
                  Year
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">
                  Invested
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">
                  Returns
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody>
              {(showAllYears
                ? yearlyBreakdown
                : yearlyBreakdown.slice(0, 5)
              ).map((row) => (
                <tr
                  key={row.year}
                  className="border-b border-gray-50 hover:bg-green-50/50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-gray-700">
                    Year {row.year}
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-600">
                    {formatINR(row.invested)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-green-600 font-medium">
                    {formatINR(row.returns)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                    {formatINR(row.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {yearlyBreakdown.length > 5 && (
          <button
            onClick={() => setShowAllYears(!showAllYears)}
            className="w-full mt-3 py-2 text-xs font-semibold text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            {showAllYears
              ? "Show less"
              : `Show all ${yearlyBreakdown.length} years`}
          </button>
        )}
      </div>
    </div>
  );
}
