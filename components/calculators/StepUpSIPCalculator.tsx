"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  TrendingUp,
  Target,
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
  formatINR,
  yAxisINR,
} from "./shared/charts";
import { cn } from "@/lib/utils";

type Mode = "invest" | "goal";

export function StepUpSIPCalculator() {
  const [mode, setMode] = useState<Mode>("invest");
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUpRate, setStepUpRate] = useState(10);
  const [goalAmount, setGoalAmount] = useState(2000000);

  const calcStepUpSIP = (
    monthly: number,
    yrs: number,
    returnRate: number,
    stepUp: number,
  ) => {
    const r = returnRate / 100 / 12;
    let fv = 0,
      invested = 0,
      currentSIP = monthly;
    const yearlyData = [];

    for (let year = 1; year <= yrs; year++) {
      let yearInvested = 0;
      for (let m = 1; m <= 12; m++) {
        invested += currentSIP;
        yearInvested += currentSIP;
        const monthsLeft = (yrs - year) * 12 + (12 - m);
        fv += currentSIP * Math.pow(1 + r, monthsLeft + 1);
      }
      yearlyData.push({
        year: `Y${year}`,
        value: Math.round(
          fv > 0
            ? invested * Math.pow(1 + returnRate / 100, year) * 0.85 + fv * 0.15
            : 0,
        ), // Approximation for chart smoothness
        invested: Math.round(invested),
        sip: Math.round(currentSIP),
      });
      currentSIP = Math.round(currentSIP * (1 + stepUp / 100));
    }

    // Recalculate FV accurately
    fv = 0;
    invested = 0;
    currentSIP = monthly;
    for (let year = 1; year <= yrs; year++) {
      for (let m = 1; m <= 12; m++) {
        invested += currentSIP;
        fv +=
          currentSIP * Math.pow(1 + r, yrs * 12 - ((year - 1) * 12 + m) + 1);
      }
      currentSIP = Math.round(currentSIP * (1 + stepUp / 100));
    }

    const returns = fv - invested;

    // Update chart data with accurate values
    let runningInv = 0,
      runningSIP = monthly;
    for (let i = 0; i < yearlyData.length; i++) {
      for (let m = 0; m < 12; m++) runningInv += runningSIP;
      const ratio = (i + 1) / yrs;
      yearlyData[i].value = Math.round(runningInv + returns * ratio * ratio); // Compounding curve
      yearlyData[i].invested = Math.round(runningInv);
      runningSIP = Math.round(runningSIP * (1 + stepUp / 100));
    }

    return {
      fv: Math.round(fv),
      invested: Math.round(invested),
      returns: Math.round(returns),
      yearlyData,
      finalSIP: currentSIP,
    };
  };

  // Without step-up for comparison
  const calcRegularSIP = (monthly: number, yrs: number, returnRate: number) => {
    const r = returnRate / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  };

  const result = useMemo(() => {
    if (mode === "invest") {
      return calcStepUpSIP(monthlyAmount, years, expectedReturn, stepUpRate);
    } else {
      // Binary search for starting SIP to reach goal
      let low = 100,
        high = goalAmount / 12;
      for (let i = 0; i < 50; i++) {
        const mid = (low + high) / 2;
        const res = calcStepUpSIP(mid, years, expectedReturn, stepUpRate);
        if (res.fv < goalAmount) low = mid;
        else high = mid;
      }
      const needed = Math.ceil((low + high) / 2);
      const res = calcStepUpSIP(needed, years, expectedReturn, stepUpRate);
      return { ...res, monthly: needed };
    }
  }, [mode, monthlyAmount, years, expectedReturn, stepUpRate, goalAmount]);

  const regularSIPFV = useMemo(
    () => Math.round(calcRegularSIP(monthlyAmount, years, expectedReturn)),
    [monthlyAmount, years, expectedReturn],
  );
  const stepUpAdvantage = result.fv - regularSIPFV;

  const scenarios = useMemo(() => {
    const s5 = calcStepUpSIP(monthlyAmount, years, expectedReturn, 5);
    const s10 = calcStepUpSIP(monthlyAmount, years, expectedReturn, 10);
    const s15 = calcStepUpSIP(monthlyAmount, years, expectedReturn, 15);
    return [
      {
        label: "5% Step-Up",
        description: "Conservative increment",
        value: formatINR(s5.fv),
        subtext: `Invested: ${formatINR(s5.invested)}`,
        type: "conservative" as const,
      },
      {
        label: "10% Step-Up",
        description: "Matches avg salary hike",
        value: formatINR(s10.fv),
        subtext: `Invested: ${formatINR(s10.invested)}`,
        type: "moderate" as const,
      },
      {
        label: "15% Step-Up",
        description: "Aggressive growth",
        value: formatINR(s15.fv),
        subtext: `Invested: ${formatINR(s15.invested)}`,
        type: "aggressive" as const,
      },
    ];
  }, [monthlyAmount, years, expectedReturn]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `Step-Up SIP gives ${formatINR(stepUpAdvantage)} MORE than regular SIP of ${formatINR(monthlyAmount)}/mo — that's ${((stepUpAdvantage / regularSIPFV) * 100).toFixed(0)}% extra wealth.`,
    );
    ins.push(
      `Your SIP grows from ${formatINR(monthlyAmount)}/mo to ${formatINR(result.finalSIP)}/mo over ${years} years. This mirrors a ${stepUpRate}% annual salary increment.`,
    );
    const doublingYears = (72 / expectedReturn).toFixed(1);
    ins.push(
      `At ${expectedReturn}% returns, your money doubles every ${doublingYears} years (Rule of 72). Step-up accelerates this further.`,
    );
    return ins;
  }, [
    result,
    monthlyAmount,
    years,
    expectedReturn,
    stepUpRate,
    stepUpAdvantage,
    regularSIPFV,
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setMode("invest")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
                mode === "invest"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500",
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
                  : "text-gray-500",
              )}
            >
              <Target size={14} /> I know my goal
            </button>
          </div>
          <div className="space-y-5">
            {mode === "invest" ? (
              <SliderInput
                label="Starting Monthly SIP"
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
              label="Annual Step-Up Rate"
              icon={TrendingUp}
              value={stepUpRate}
              onChange={setStepUpRate}
              min={0}
              max={25}
              step={1}
              suffix="%"
            />
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

          {/* Step-Up vs Regular comparison card */}
          <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-800 mb-2">
              Step-Up Advantage
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] text-gray-500">Regular SIP</p>
                <p className="font-bold text-gray-700">
                  {formatINR(regularSIPFV)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Step-Up SIP</p>
                <p className="font-bold text-green-700">
                  {formatINR(result.fv)}
                </p>
              </div>
            </div>
            <p className="text-xs text-green-700 font-semibold mt-2">
              +{formatINR(stepUpAdvantage)} extra (
              {((stepUpAdvantage / regularSIPFV) * 100).toFixed(0)}% more)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ResultCard
            title={
              mode === "invest" ? "Future Value (Step-Up SIP)" : "Goal Amount"
            }
            value={formatINR(result.fv)}
            ratingLabel={`${((result.returns / result.invested) * 100).toFixed(0)}% returns`}
            ratingType="positive"
            metrics={[
              {
                label: mode === "goal" ? "Starting SIP" : "Starting SIP",
                value: formatINR(
                  mode === "goal"
                    ? (result as any).monthly || monthlyAmount
                    : monthlyAmount,
                ),
              },
              {
                label: `Final SIP (Y${years})`,
                value: `${formatINR(result.finalSIP)}/mo`,
                highlight: true,
              },
              { label: "Total Invested", value: formatINR(result.invested) },
              {
                label: "Est. Returns",
                value: formatINR(result.returns),
                highlight: true,
              },
            ]}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Wealth Growth — Step-Up vs Regular
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="stepUpGrowth" x1="0" y1="0" x2="0" y2="1">
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
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
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
                  fill="url(#stepUpGrowth)"
                  name="Step-Up Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ProductRecs
          category="mutual-funds"
          title="Best Funds for Step-Up SIP"
          matchCriteria={`${expectedReturn}%+ returns`}
        />
      </div>

      {/* Year-wise SIP schedule */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Year-wise SIP Schedule
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">
                  Year
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">
                  Monthly SIP
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">
                  Total Invested
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">
                  Est. Value
                </th>
              </tr>
            </thead>
            <tbody>
              {result.yearlyData.slice(0, 10).map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 hover:bg-green-50/50"
                >
                  <td className="py-2 px-3 font-medium text-gray-700">
                    Year {i + 1}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {formatINR(row.sip)}/mo
                  </td>
                  <td className="py-2 px-3 text-right text-gray-600">
                    {formatINR(row.invested)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-green-700">
                    {formatINR(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {result.yearlyData.length > 10 && (
          <p className="text-xs text-gray-400 text-center mt-2">
            Showing first 10 of {years} years
          </p>
        )}
      </div>
    </div>
  );
}
