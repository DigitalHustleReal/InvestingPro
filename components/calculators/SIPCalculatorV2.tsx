"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Percent, Target } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import { ProductRecs } from "./shared/ProductRecs";
import { PopularCalculators } from "./shared/PopularCalculators";
import { TrustStrip } from "./shared/TrustStrip";
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

type Mode = "returns" | "goal";

export function SIPCalculatorV2() {
  const [mode, setMode] = useState<Mode>("returns");
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [goalAmount, setGoalAmount] = useState(2000000);

  const calcSIP = (monthly: number, yrs: number, rate: number) => {
    const r = rate / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return { fv: monthly * n, invested: monthly * n, returns: 0 };
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = monthly * n;
    return { fv, invested, returns: fv - invested };
  };

  const calcReverseSIP = (goal: number, yrs: number, rate: number) => {
    const r = rate / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return goal / n;
    return goal / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  };

  const result = useMemo(() => {
    if (mode === "returns") {
      const { fv, invested, returns } = calcSIP(
        monthlyAmount,
        years,
        expectedReturn,
      );
      return { fv, invested, returns, monthly: monthlyAmount };
    } else {
      const needed = calcReverseSIP(goalAmount, years, expectedReturn);
      const { invested } = calcSIP(needed, years, expectedReturn);
      return {
        fv: goalAmount,
        invested,
        returns: goalAmount - invested,
        monthly: Math.ceil(needed),
      };
    }
  }, [mode, monthlyAmount, years, expectedReturn, goalAmount]);

  const scenarios = useMemo(() => {
    const c = calcSIP(result.monthly, years, 8);
    const m = calcSIP(result.monthly, years, 12);
    const a = calcSIP(result.monthly, years, 15);
    return [
      {
        label: "Debt Funds (8%)",
        description: "Low risk · Stable",
        value: formatINR(c.fv),
        subtext: `₹${Math.round(c.returns / 100000)}L returns`,
        type: "conservative" as const,
      },
      {
        label: "Index Funds (12%)",
        description: "Medium risk",
        value: formatINR(m.fv),
        subtext: `₹${Math.round(m.returns / 100000)}L returns`,
        type: "moderate" as const,
      },
      {
        label: "Small-Cap (15%)",
        description: "High risk · High reward",
        value: formatINR(a.fv),
        subtext: `₹${Math.round(a.returns / 100000)}L returns`,
        type: "aggressive" as const,
      },
    ];
  }, [result.monthly, years]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    const doublingYears = (72 / expectedReturn).toFixed(1);
    ins.push(
      `At ${expectedReturn}% return, your money doubles every ${doublingYears} years. Compounding ka jaadu — jitna lamba invest karein, utna zyada faayda.`,
    );
    if (years >= 5) {
      const delay = calcSIP(result.monthly, years - 1, expectedReturn).fv;
      ins.push(
        `1 saal late start karne ka nuksan: ${formatINR(result.fv - delay)}. Kal se nahi, aaj se shuru karein!`,
      );
    }
    const fdFV = calcSIP(result.monthly, years, 7).fv;
    if (expectedReturn > 7) {
      ins.push(
        `Same amount FD mein rakhte toh ${formatINR(fdFV)} milta. SIP mein ${formatINR(result.fv - fdFV)} zyada — ${years} saal mein.`,
      );
    }
    return ins;
  }, [result, years, expectedReturn]);

  const chartData = useMemo(() => {
    const data = [];
    for (let y = 0; y <= years; y++) {
      const { fv, invested } = calcSIP(result.monthly, y, expectedReturn);
      data.push({
        year: y === 0 ? "Start" : `${y}Y`,
        value: Math.round(fv),
        invested: Math.round(invested),
      });
    }
    return data;
  }, [result.monthly, years, expectedReturn]);

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
    {
      name: "You Invest",
      value: Math.round(result.invested),
      color: "#166534",
    },
    {
      name: "You Earn",
      value: Math.round(Math.max(0, result.returns)),
      color: "#22c55e",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Trust Strip */}
      <TrustStrip />

      {/* ─── MOBILE-FIRST: Result on top, inputs below ──────────── */}

      {/* Result — shown FIRST on mobile (user sees answer immediately) */}
      <div className="lg:hidden">
        <ResultCard
          title={mode === "returns" ? "Total Value" : "Your Goal"}
          value={formatINR(result.fv)}
          ratingLabel={`${((result.returns / Math.max(result.invested, 1)) * 100).toFixed(0)}% wealth gain`}
          ratingType={result.returns > 0 ? "positive" : "negative"}
          metrics={[
            {
              label: mode === "goal" ? "SIP Required" : "Monthly SIP",
              value: `${formatINR(result.monthly)}/mo`,
              highlight: mode === "goal",
            },
            { label: "You Invest", value: formatINR(result.invested) },
            {
              label: "You Earn",
              value: formatINR(result.returns),
              highlight: true,
            },
          ]}
        />
      </div>

      {/* ─── Desktop: 3-column layout ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inputs — 5 cols on desktop, full width mobile */}
        <div className="lg:col-span-5 bg-white border-2 border-ink/10 rounded-sm p-5 shadow-none">
          {/* Clear mode labels */}
          <div className="flex items-center gap-1 mb-5 p-1 bg-ink/5 rounded-sm">
            <button
              onClick={() => setMode("returns")}
              className={cn(
                "flex-1 py-2.5 rounded-sm text-[13px] font-semibold transition-all",
                mode === "returns"
                  ? "bg-white text-authority-green shadow-none"
                  : "text-ink-60",
              )}
            >
              SIP Returns
            </button>
            <button
              onClick={() => setMode("goal")}
              className={cn(
                "flex-1 py-2.5 rounded-sm text-[13px] font-semibold transition-all",
                mode === "goal"
                  ? "bg-white text-authority-green shadow-none"
                  : "text-ink-60",
              )}
            >
              Goal Planning
            </button>
          </div>

          <div className="space-y-5">
            {mode === "returns" ? (
              <SliderInput
                label="Monthly SIP"
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
                label="I want to save"
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
              label="Time Period"
              icon={Calendar}
              value={years}
              onChange={setYears}
              min={1}
              max={30}
              step={1}
              suffix=" Yrs"
            />
            <SliderInput
              label="Expected Return"
              icon={Percent}
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={4}
              max={25}
              step={0.5}
              suffix="% p.a."
            />
          </div>
        </div>

        {/* Result + AI Insight — 4 cols on desktop, hidden on mobile (shown above) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title={mode === "returns" ? "Total Value" : "Your Goal"}
              value={formatINR(result.fv)}
              ratingLabel={`${((result.returns / Math.max(result.invested, 1)) * 100).toFixed(0)}% wealth gain`}
              ratingType={result.returns > 0 ? "positive" : "negative"}
              metrics={[
                {
                  label: mode === "goal" ? "SIP Required" : "Monthly SIP",
                  value: `${formatINR(result.monthly)}/mo`,
                  highlight: mode === "goal",
                },
                { label: "You Invest", value: formatINR(result.invested) },
                {
                  label: "You Earn",
                  value: formatINR(result.returns),
                  highlight: true,
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>

        {/* Sidebar — desktop only */}
        <div className="lg:col-span-3 hidden lg:block">
          <PopularCalculators currentSlug="sip" variant="sidebar" />
        </div>
      </div>

      {/* ─── What-If Scenarios (scrollable on mobile) ─────────── */}
      <WhatIfScenarios scenarios={scenarios} />

      {/* ─── Chart + Product Recs ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border-2 border-ink/10 rounded-sm p-4 sm:p-5 shadow-none">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Your Wealth Journey — {years} Years
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sipGrowthV3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E8E4DC"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  fontSize={11}
                  tick={{ fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  fontSize={11}
                  tick={{ fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={yAxisINR}
                  width={45}
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
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
                  fill="url(#sipGrowthV3)"
                  name="Total Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Inline legend — bigger, clearer */}
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-ink/5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <div>
                  <p className="text-[11px] text-ink-60">{d.name}</p>
                  <p className="text-sm font-display font-bold text-ink">
                    {formatINR(d.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ProductRecs
          category="mutual-funds"
          title="Top SIP Funds"
          matchCriteria={`${expectedReturn}%+ returns`}
        />
      </div>

      {/* ─── Year-wise Breakdown ─────────────────────────────── */}
      <div className="bg-white border-2 border-ink/10 rounded-sm p-4 sm:p-5 shadow-none">
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Year-by-Year Breakdown
        </h3>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left py-2 px-2 text-xs font-medium text-ink-60">
                  Year
                </th>
                <th className="text-right py-2 px-2 text-xs font-medium text-ink-60">
                  Invested
                </th>
                <th className="text-right py-2 px-2 text-xs font-medium text-ink-60">
                  Earned
                </th>
                <th className="text-right py-2 px-2 text-xs font-medium text-ink-60">
                  Total
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
                  className="border-b border-gray-50 hover:bg-action-green/10/50 transition-colors"
                >
                  <td className="py-2 px-2 font-medium text-ink">
                    Y{row.year}
                  </td>
                  <td className="py-2 px-2 text-right text-ink-60">
                    {formatINR(row.invested)}
                  </td>
                  <td className="py-2 px-2 text-right text-action-green font-medium">
                    +{formatINR(row.returns)}
                  </td>
                  <td className="py-2 px-2 text-right font-display font-bold text-ink">
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
            className="w-full mt-3 py-2.5 text-xs font-semibold text-action-green hover:text-authority-green hover:bg-action-green/10 rounded-sm transition-colors"
          >
            {showAllYears
              ? "Show less"
              : `All ${yearlyBreakdown.length} years →`}
          </button>
        )}
      </div>

      {/* Mobile: Popular calculators strip */}
      <div className="lg:hidden">
        <PopularCalculators currentSlug="sip" variant="strip" />
      </div>
    </div>
  );
}
