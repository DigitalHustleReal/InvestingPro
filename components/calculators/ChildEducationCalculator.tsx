"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  GraduationCap,
  Percent,
  Calendar,
  Baby,
  Wallet,
} from "lucide-react";
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

const EDUCATION_GOALS = [
  { label: "IIT B.Tech", cost: 1000000, ageAtStart: 18 },
  { label: "IIM MBA", cost: 2500000, ageAtStart: 22 },
  { label: "MBBS (Govt)", cost: 500000, ageAtStart: 18 },
  { label: "MBBS (Private)", cost: 8000000, ageAtStart: 18 },
  { label: "Abroad Undergrad", cost: 4000000, ageAtStart: 18 },
  { label: "Abroad Masters", cost: 3000000, ageAtStart: 22 },
  { label: "Private Engineering", cost: 1500000, ageAtStart: 18 },
] as const;

export function ChildEducationCalculator() {
  const [childAge, setChildAge] = useState(5);
  const [goalIndex, setGoalIndex] = useState(0);
  const [currentCost, setCurrentCost] = useState<number>(
    EDUCATION_GOALS[0].cost,
  );
  const [inflationRate, setInflationRate] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [existingSavings, setExistingSavings] = useState(0);

  const selectedGoal = EDUCATION_GOALS[goalIndex];
  const yearsToGoal = Math.max(1, selectedGoal.ageAtStart - childAge);

  const handleGoalChange = (index: number) => {
    setGoalIndex(index);
    setCurrentCost(EDUCATION_GOALS[index].cost);
  };

  const result = useMemo(() => {
    const futureCost =
      currentCost * Math.pow(1 + inflationRate / 100, yearsToGoal);

    // Future value of existing savings
    const existingFV =
      existingSavings * Math.pow(1 + expectedReturn / 100, yearsToGoal);
    const shortfall = Math.max(0, futureCost - existingFV);
    const surplus = Math.max(0, existingFV - futureCost);

    // SIP needed monthly for the shortfall
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = yearsToGoal * 12;
    let sipNeeded = 0;
    if (shortfall > 0 && monthlyRate > 0 && totalMonths > 0) {
      sipNeeded =
        (shortfall * monthlyRate) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    // Lumpsum needed today for the shortfall
    let lumpsumNeeded = 0;
    if (shortfall > 0) {
      lumpsumNeeded =
        shortfall / Math.pow(1 + expectedReturn / 100, yearsToGoal);
    }

    // Year-by-year savings growth vs target
    const yearlyData = [];
    let savingsBalance = existingSavings;
    for (let year = 0; year <= yearsToGoal; year++) {
      const targetAtYear =
        currentCost * Math.pow(1 + inflationRate / 100, year);
      yearlyData.push({
        year: `Age ${childAge + year}`,
        savings: Math.round(savingsBalance),
        target: Math.round(targetAtYear),
      });
      // Add 12 months of SIP + growth on existing balance
      const monthlyR = expectedReturn / 100 / 12;
      for (let m = 0; m < 12; m++) {
        savingsBalance = savingsBalance * (1 + monthlyR) + sipNeeded;
      }
    }

    return {
      futureCost: Math.round(futureCost),
      existingFV: Math.round(existingFV),
      shortfall: Math.round(shortfall),
      surplus: Math.round(surplus),
      sipNeeded: Math.round(sipNeeded),
      lumpsumNeeded: Math.round(lumpsumNeeded),
      yearsToGoal,
      yearlyData,
    };
  }, [
    currentCost,
    inflationRate,
    expectedReturn,
    existingSavings,
    yearsToGoal,
    childAge,
  ]);

  const scenarios = useMemo(() => {
    const calcSIP = (cost: number, ageStart: number) => {
      const years = Math.max(1, ageStart - childAge);
      const fc = cost * Math.pow(1 + inflationRate / 100, years);
      const existFV =
        existingSavings * Math.pow(1 + expectedReturn / 100, years);
      const gap = Math.max(0, fc - existFV);
      const mr = expectedReturn / 100 / 12;
      const months = years * 12;
      if (gap <= 0 || mr <= 0) return 0;
      return Math.round((gap * mr) / (Math.pow(1 + mr, months) - 1));
    };

    return [
      {
        label: "IIT B.Tech",
        description: `Future cost: ${formatINR(1000000 * Math.pow(1 + inflationRate / 100, Math.max(1, 18 - childAge)))}`,
        value: `${formatINR(calcSIP(1000000, 18))}/mo`,
        subtext: `${Math.max(1, 18 - childAge)} years to go`,
        type: "conservative" as const,
      },
      {
        label: "IIM MBA",
        description: `Future cost: ${formatINR(2500000 * Math.pow(1 + inflationRate / 100, Math.max(1, 22 - childAge)))}`,
        value: `${formatINR(calcSIP(2500000, 22))}/mo`,
        subtext: `${Math.max(1, 22 - childAge)} years to go`,
        type: "moderate" as const,
      },
      {
        label: "Abroad Undergrad",
        description: `Future cost: ${formatINR(4000000 * Math.pow(1 + inflationRate / 100, Math.max(1, 18 - childAge)))}`,
        value: `${formatINR(calcSIP(4000000, 18))}/mo`,
        subtext: `${Math.max(1, 18 - childAge)} years to go`,
        type: "aggressive" as const,
      },
    ];
  }, [childAge, inflationRate, expectedReturn, existingSavings]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${selectedGoal.label} ki current cost ${formatINR(currentCost)} hai, lekin ${yearsToGoal} saal baad education inflation (${inflationRate}%) ke baad yeh ${formatINR(result.futureCost)} ho jayegi. Jaldi start karna bohot zaroori hai.`,
    );
    if (childAge <= 5) {
      ins.push(
        `Aapne age 5 ya pehle start kiya — great decision! Age 10 pe start karte toh SIP almost double hota. Compounding ka magic time ke saath kaam karta hai.`,
      );
    } else if (childAge >= 10) {
      ins.push(
        `Age ${childAge} pe start karne se time kam hai. Agar age 5 pe start kiya hota, toh monthly SIP ${formatINR(result.sipNeeded)} se bohot kam hota. Ab aggressive saving zaroori hai.`,
      );
    }
    ins.push(
      `Beti ke liye Sukanya Samriddhi Yojana (SSY) consider karein — 8.2% guaranteed return, tax-free, ₹1.5L/year tak Section 80C benefit. Best risk-free option for daughters.`,
    );
    return ins;
  }, [result, selectedGoal, currentCost, yearsToGoal, inflationRate, childAge]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Monthly SIP Needed"
          value={formatINR(result.sipNeeded)}
          ratingLabel={`Future cost: ${formatINR(result.futureCost)}`}
          ratingType={
            result.surplus > 0
              ? "positive"
              : result.sipNeeded < 10000
                ? "positive"
                : "neutral"
          }
          metrics={[
            {
              label: "Current Cost (2026)",
              value: formatINR(currentCost),
            },
            {
              label: `Future Cost (${yearsToGoal}yr)`,
              value: formatINR(result.futureCost),
            },
            {
              label: "Lumpsum Needed Today",
              value: formatINR(result.lumpsumNeeded),
            },
            {
              label: result.surplus > 0 ? "Surplus" : "Shortfall",
              value: formatINR(
                result.surplus > 0 ? result.surplus : result.shortfall,
              ),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Education Plan Details
          </h2>
          <div className="space-y-5">
            {/* Education Goal Selector */}
            <div>
              <label className="text-xs font-medium text-ink-60 mb-2 block">
                Education Goal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EDUCATION_GOALS.map((goal, idx) => (
                  <button
                    key={goal.label}
                    onClick={() => handleGoalChange(idx)}
                    className={`text-left px-3 py-2 rounded-sm text-xs font-medium border transition-all ${
                      goalIndex === idx
                        ? "bg-action-green/10 border-green-500 text-green-800"
                        : "bg-white border-ink/10 text-ink-60 hover:border-gray-300"
                    }`}
                  >
                    <span className="block truncate">{goal.label}</span>
                    <span className="text-[10px] text-ink-60">
                      {formatINR(goal.cost)} (2026)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <SliderInput
              label="Child's Current Age"
              icon={Baby}
              value={childAge}
              onChange={setChildAge}
              min={0}
              max={15}
              step={1}
              suffix=" years"
            />
            <SliderInput
              label="Current Education Cost (2026)"
              icon={GraduationCap}
              value={currentCost}
              onChange={setCurrentCost}
              min={100000}
              max={10000000}
              step={100000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Education Inflation Rate"
              icon={Percent}
              value={inflationRate}
              onChange={setInflationRate}
              min={8}
              max={12}
              step={0.5}
              suffix="% p.a."
            />
            <SliderInput
              label="Expected Investment Return"
              icon={Percent}
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={8}
              max={15}
              step={0.5}
              suffix="% p.a."
            />
            <SliderInput
              label="Existing Savings for Education"
              icon={Wallet}
              value={existingSavings}
              onChange={setExistingSavings}
              min={0}
              max={5000000}
              step={50000}
              formatDisplay={formatINR}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Monthly SIP Needed"
              value={formatINR(result.sipNeeded)}
              ratingLabel={`Future cost: ${formatINR(result.futureCost)}`}
              ratingType={
                result.surplus > 0
                  ? "positive"
                  : result.sipNeeded < 10000
                    ? "positive"
                    : "neutral"
              }
              metrics={[
                {
                  label: "Current Cost (2026)",
                  value: formatINR(currentCost),
                },
                {
                  label: `Future Cost (${yearsToGoal}yr)`,
                  value: formatINR(result.futureCost),
                },
                {
                  label: "Lumpsum Needed Today",
                  value: formatINR(result.lumpsumNeeded),
                },
                {
                  label: result.surplus > 0 ? "Surplus" : "Shortfall",
                  value: formatINR(
                    result.surplus > 0 ? result.surplus : result.shortfall,
                  ),
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Savings Growth vs Education Cost
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="ceSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ceTarget" x1="0" y1="0" x2="0" y2="1">
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
                  width={45}
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#ceSavings)"
                  name="Your Savings"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="url(#ceTarget)"
                  name="Education Cost"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-ink/5">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#22c55e" }}
              />
              <div>
                <p className="text-[11px] text-ink-60">Your Savings</p>
                <p className="text-sm font-display font-bold text-ink">
                  {formatINR(
                    result.yearlyData[result.yearlyData.length - 1]?.savings ??
                      0,
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "#d97706" }}
              />
              <div>
                <p className="text-[11px] text-ink-60">Future Cost</p>
                <p className="text-sm font-display font-bold text-ink">
                  {formatINR(result.futureCost)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductRecs
          category="mutual-funds"
          title="Best Funds for Education"
          matchCriteria={`${expectedReturn}%+ returns`}
        />
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="child-education" variant="strip" />
      </div>
    </div>
  );
}
