"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  TrendingUp,
  Flame,
  Target,
  ShieldCheck,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
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
import { cn } from "@/lib/utils";

export function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(28);
  const [retireAge, setRetireAge] = useState(45);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySIP, setMonthlySIP] = useState(30000);
  const [preRetireReturn, setPreRetireReturn] = useState(12);
  const [postRetireReturn, setPostRetireReturn] = useState(8);
  const [inflation, setInflation] = useState(6);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);

  const result = useMemo(() => {
    const yearsToRetire = Math.max(retireAge - currentAge, 1);
    const yearsInRetirement = Math.max(lifeExpectancy - retireAge, 1);

    // Inflation-adjusted annual expense at retirement
    const annualExpenseNow = monthlyExpense * 12;
    const annualExpenseAtRetire =
      annualExpenseNow * Math.pow(1 + inflation / 100, yearsToRetire);
    const monthlyExpenseAtRetire = annualExpenseAtRetire / 12;

    // FIRE Number: corpus needed using 4% rule (adjusted for India: 3.5% withdrawal)
    // Or: PV of annuity for retirement years at real return
    const realReturn = (1 + postRetireReturn / 100) / (1 + inflation / 100) - 1;
    let fireNumber: number;
    if (realReturn <= 0) {
      fireNumber = annualExpenseAtRetire * yearsInRetirement;
    } else {
      fireNumber =
        (annualExpenseAtRetire *
          (1 - Math.pow(1 + realReturn, -yearsInRetirement))) /
        realReturn;
    }

    // How much corpus you'll build by retirement
    const r = preRetireReturn / 100 / 12;
    let corpus = currentSavings;
    const chartData = [
      {
        year: `Age ${currentAge}`,
        corpus: Math.round(corpus),
        target: Math.round(fireNumber),
      },
    ];

    for (let year = 1; year <= yearsToRetire; year++) {
      for (let m = 1; m <= 12; m++) {
        corpus = (corpus + monthlySIP) * (1 + r);
      }
      chartData.push({
        year: `Age ${currentAge + year}`,
        corpus: Math.round(corpus),
        target: Math.round(fireNumber),
      });
    }

    const surplus = corpus - fireNumber;
    const onTrack = surplus >= 0;

    // If not on track, calculate required SIP
    let requiredSIP = monthlySIP;
    if (!onTrack) {
      // Binary search for required SIP
      let low = monthlySIP,
        high = monthlyExpense * 10;
      for (let i = 0; i < 50; i++) {
        const mid = (low + high) / 2;
        let testCorpus = currentSavings;
        for (let y = 0; y < yearsToRetire * 12; y++) {
          testCorpus = (testCorpus + mid) * (1 + r);
        }
        if (testCorpus < fireNumber) low = mid;
        else high = mid;
      }
      requiredSIP = Math.ceil((low + high) / 2);
    }

    // Withdrawal rate
    const withdrawalRate = (annualExpenseAtRetire / fireNumber) * 100;

    return {
      fireNumber: Math.round(fireNumber),
      corpus: Math.round(corpus),
      surplus: Math.round(surplus),
      onTrack,
      requiredSIP: Math.round(requiredSIP),
      monthlyExpenseAtRetire: Math.round(monthlyExpenseAtRetire),
      annualExpenseAtRetire: Math.round(annualExpenseAtRetire),
      yearsToRetire,
      yearsInRetirement,
      withdrawalRate,
      chartData,
    };
  }, [
    currentAge,
    retireAge,
    monthlyExpense,
    currentSavings,
    monthlySIP,
    preRetireReturn,
    postRetireReturn,
    inflation,
    lifeExpectancy,
  ]);

  const scenarios = useMemo(() => {
    const calcFIRE = (retAge: number) => {
      const ytr = Math.max(retAge - currentAge, 1);
      const yir = Math.max(lifeExpectancy - retAge, 1);
      const aer = monthlyExpense * 12 * Math.pow(1 + inflation / 100, ytr);
      const rr = (1 + postRetireReturn / 100) / (1 + inflation / 100) - 1;
      const fn =
        rr <= 0 ? aer * yir : (aer * (1 - Math.pow(1 + rr, -yir))) / rr;
      return {
        fireNumber: Math.round(fn),
        monthlyExpense: Math.round(aer / 12),
      };
    };
    const s40 = calcFIRE(40);
    const s45 = calcFIRE(45);
    const s50 = calcFIRE(50);
    return [
      {
        label: "Retire at 40",
        description: `Need ${formatINR(s40.fireNumber)}`,
        value: `${formatINR(s40.monthlyExpense)}/mo`,
        subtext: "Aggressive FIRE",
        type: "aggressive" as const,
      },
      {
        label: "Retire at 45",
        description: `Need ${formatINR(s45.fireNumber)}`,
        value: `${formatINR(s45.monthlyExpense)}/mo`,
        subtext: "Standard FIRE",
        type: "moderate" as const,
      },
      {
        label: "Retire at 50",
        description: `Need ${formatINR(s50.fireNumber)}`,
        value: `${formatINR(s50.monthlyExpense)}/mo`,
        subtext: "Lean FIRE",
        type: "conservative" as const,
      },
    ];
  }, [currentAge, monthlyExpense, inflation, postRetireReturn, lifeExpectancy]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `FIRE Number: ${formatINR(result.fireNumber)}. Itna corpus chahiye taaki ${retireAge} se ${lifeExpectancy} tak ${formatINR(result.monthlyExpenseAtRetire)}/mo (inflation-adjusted) kharcha chal sake.`,
    );
    if (result.onTrack) {
      ins.push(
        `Badhai ho! Aap track par hain. ${formatINR(result.surplus)} surplus ke saath, aap ${retireAge - 1} tak bhi retire kar sakte hain.`,
      );
    } else {
      ins.push(
        `Abhi track par nahi hain. SIP ${formatINR(monthlySIP)} se badhakar ${formatINR(result.requiredSIP)}/mo karein — ya retirement age 50 tak karein.`,
      );
    }
    ins.push(
      `Withdrawal rate: ${result.withdrawalRate.toFixed(1)}%. India mein safe withdrawal rate 3-3.5% hai (US mein 4%). ${result.withdrawalRate > 4 ? "Aapka rate high hai — corpus badhayein." : "Aapka rate safe zone mein hai."}`,
    );
    return ins;
  }, [result, retireAge, monthlySIP, lifeExpectancy]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile: FIRE status first */}
      <div className="lg:hidden">
        <div
          className={cn(
            "rounded-2xl p-5 shadow-sm border text-center",
            result.onTrack
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
              : "bg-gradient-to-br from-red-50 to-orange-50 border-red-300",
          )}
        >
          <Flame
            size={24}
            className={
              result.onTrack ? "text-green-600 mx-auto" : "text-red-500 mx-auto"
            }
          />
          <p className="text-sm text-gray-500 mt-2">FIRE Number</p>
          <p
            className={cn(
              "text-4xl font-extrabold mt-1",
              result.onTrack ? "text-green-700" : "text-red-600",
            )}
          >
            {formatINR(result.fireNumber)}
          </p>
          <p className="text-xs mt-2">
            {result.onTrack
              ? `On track! Surplus: ${formatINR(result.surplus)}`
              : `Need ${formatINR(result.requiredSIP)}/mo SIP (currently ${formatINR(monthlySIP)})`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <Flame size={18} className="text-orange-500" /> FIRE Planning
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SliderInput
                label="Current Age"
                icon={Calendar}
                value={currentAge}
                onChange={setCurrentAge}
                min={20}
                max={50}
                step={1}
                suffix=" yrs"
              />
              <SliderInput
                label="Retire At"
                icon={Target}
                value={retireAge}
                onChange={setRetireAge}
                min={35}
                max={60}
                step={1}
                suffix=" yrs"
              />
            </div>
            <SliderInput
              label="Monthly Expenses"
              icon={IndianRupee}
              value={monthlyExpense}
              onChange={setMonthlyExpense}
              min={20000}
              max={500000}
              step={5000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Current Savings/Investments"
              icon={ShieldCheck}
              value={currentSavings}
              onChange={setCurrentSavings}
              min={0}
              max={50000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Monthly SIP"
              icon={IndianRupee}
              value={monthlySIP}
              onChange={setMonthlySIP}
              min={5000}
              max={500000}
              step={5000}
              formatDisplay={formatINR}
            />
            <div className="grid grid-cols-2 gap-3">
              <SliderInput
                label="Pre-Retire Return"
                icon={Percent}
                value={preRetireReturn}
                onChange={setPreRetireReturn}
                min={6}
                max={18}
                step={0.5}
                suffix="%"
              />
              <SliderInput
                label="Post-Retire Return"
                icon={Percent}
                value={postRetireReturn}
                onChange={setPostRetireReturn}
                min={4}
                max={12}
                step={0.5}
                suffix="%"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SliderInput
                label="Inflation"
                icon={TrendingUp}
                value={inflation}
                onChange={setInflation}
                min={3}
                max={10}
                step={0.5}
                suffix="%"
              />
              <SliderInput
                label="Life Expectancy"
                icon={Calendar}
                value={lifeExpectancy}
                onChange={setLifeExpectancy}
                min={70}
                max={95}
                step={1}
                suffix=" yrs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="FIRE Number"
              value={formatINR(result.fireNumber)}
              ratingLabel={
                result.onTrack
                  ? `On Track! Surplus: ${formatINR(result.surplus)}`
                  : `Gap: ${formatINR(Math.abs(result.surplus))}`
              }
              ratingType={result.onTrack ? "positive" : "negative"}
              metrics={[
                {
                  label: "Your Corpus",
                  value: formatINR(result.corpus),
                  highlight: result.onTrack,
                },
                {
                  label: "Monthly at Retire",
                  value: `${formatINR(result.monthlyExpenseAtRetire)}/mo`,
                },
                {
                  label: "Years to FIRE",
                  value: `${result.yearsToRetire} years`,
                },
                {
                  label: result.onTrack ? "Withdrawal Rate" : "Required SIP",
                  value: result.onTrack
                    ? `${result.withdrawalRate.toFixed(1)}%`
                    : `${formatINR(result.requiredSIP)}/mo`,
                  highlight: !result.onTrack,
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Your Journey to FIRE
        </h3>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chartData}>
              <defs>
                <linearGradient id="fireCorpus" x1="0" y1="0" x2="0" y2="1">
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
                fontSize={10}
                tick={{ fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                interval={Math.floor(result.yearsToRetire / 5)}
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
                dataKey="target"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="8 4"
                fill="none"
                name="FIRE Target"
              />
              <Area
                type="monotone"
                dataKey="corpus"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#fireCorpus)"
                name="Your Corpus"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-0.5 bg-green-500 rounded" />
            <span className="text-gray-500">Your Corpus</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-0.5 bg-red-500 rounded border-dashed" />
            <span className="text-gray-500">FIRE Target</span>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="fire" variant="strip" />
      </div>
    </div>
  );
}
