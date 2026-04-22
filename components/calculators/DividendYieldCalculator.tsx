"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  TrendingUp,
  Percent,
  Calendar,
  BarChart3,
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

export function DividendYieldCalculator() {
  const [stockPrice, setStockPrice] = useState(500);
  const [annualDividend, setAnnualDividend] = useState(12);
  const [numShares, setNumShares] = useState(100);
  const [dividendGrowth, setDividendGrowth] = useState(5);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);

  const result = useMemo(() => {
    const totalInvestment = stockPrice * numShares;
    const currentYield = (annualDividend / stockPrice) * 100;

    // FD comparison: 7% pre-tax, 30% tax bracket => ~4.9% post-tax
    const fdPostTaxRate = 0.049;

    const yearlyData = [];
    let cumulativeDividend = 0;
    let fdCumulative = 0;

    for (let year = 1; year <= investmentPeriod; year++) {
      const grownDividend =
        annualDividend * Math.pow(1 + dividendGrowth / 100, year - 1);
      const yearDividend = grownDividend * numShares;
      cumulativeDividend += yearDividend;

      // Stock appreciation assumed at 10% CAGR (Nifty long-term avg)
      const stockValue = totalInvestment * Math.pow(1.1, year);

      // FD: compound at post-tax rate
      fdCumulative = totalInvestment * (Math.pow(1 + fdPostTaxRate, year) - 1);

      const yieldOnCost = (grownDividend / stockPrice) * 100;

      yearlyData.push({
        year: `Y${year}`,
        cumulativeDividend: Math.round(cumulativeDividend),
        stockAppreciation: Math.round(stockValue - totalInvestment),
        fdReturns: Math.round(fdCumulative),
        yieldOnCost: Math.round(yieldOnCost * 100) / 100,
      });
    }

    const totalDividendIncome = cumulativeDividend;
    const finalYieldOnCost =
      ((annualDividend *
        Math.pow(1 + dividendGrowth / 100, investmentPeriod - 1)) /
        stockPrice) *
      100;
    const fdTotalReturn =
      totalInvestment * (Math.pow(1 + fdPostTaxRate, investmentPeriod) - 1);
    const stockAppreciation =
      totalInvestment * Math.pow(1.1, investmentPeriod) - totalInvestment;
    const totalReturn = totalDividendIncome + stockAppreciation;

    return {
      totalInvestment,
      currentYield,
      totalDividendIncome: Math.round(totalDividendIncome),
      finalYieldOnCost: Math.round(finalYieldOnCost * 100) / 100,
      fdTotalReturn: Math.round(fdTotalReturn),
      stockAppreciation: Math.round(stockAppreciation),
      totalReturn: Math.round(totalReturn),
      yearlyData,
    };
  }, [stockPrice, annualDividend, numShares, dividendGrowth, investmentPeriod]);

  const scenarios = useMemo(() => {
    const calc = (
      divPerShare: number,
      label: string,
      desc: string,
      type: "conservative" | "moderate" | "aggressive",
    ) => {
      const yld = (divPerShare / stockPrice) * 100;
      const totalDiv = divPerShare * numShares * investmentPeriod;
      return {
        label,
        description: desc,
        value: `${yld.toFixed(1)}% yield`,
        subtext: `Total dividends: ${formatINR(totalDiv)}`,
        type,
      };
    };
    return [
      calc(
        stockPrice * 0.025,
        "Blue Chips (2-3%)",
        "ITC, Coal India, ONGC type",
        "conservative",
      ),
      calc(
        stockPrice * 0.05,
        "High Yield (4-6%)",
        "PSU banks, Power Grid, NHPC",
        "moderate",
      ),
      calc(
        stockPrice * 0.08,
        "REITs/InvITs (7%+)",
        "Embassy REIT, IndiGrid InvIT",
        "aggressive",
      ),
    ];
  }, [stockPrice, numShares, investmentPeriod]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.currentYield < 2) {
      ins.push(
        `Dividend yield ${result.currentYield.toFixed(1)}% se kam hai — yeh growth stock hai, income stock nahi. Agar regular income chahiye toh 4%+ yield wale stocks dekhiye.`,
      );
    } else if (result.currentYield >= 2 && result.currentYield < 4) {
      ins.push(
        `${result.currentYield.toFixed(1)}% yield decent hai. Blue-chip stocks mein yeh normal range hai. Dividend + growth dono milta hai.`,
      );
    } else {
      ins.push(
        `${result.currentYield.toFixed(1)}% yield bahut accha hai! Lekin verify karo ki company sustainably pay kar sakti hai — high yield sometimes red flag hota hai.`,
      );
    }
    ins.push(
      `FD post-tax return: ${formatINR(result.fdTotalReturn)} in ${investmentPeriod}Y vs your total dividend income: ${formatINR(result.totalDividendIncome)}. ${result.totalDividendIncome > result.fdTotalReturn ? "Dividend stocks win!" : "FD is safer for pure income."}`,
    );
    if (dividendGrowth > 0) {
      ins.push(
        `${dividendGrowth}% dividend growth ke saath, ${investmentPeriod} saal baad yield on cost ${result.finalYieldOnCost.toFixed(1)}% ho jayega — yeh FD rate se double ho sakta hai. Patience pays off.`,
      );
    }
    return ins;
  }, [result, investmentPeriod, dividendGrowth]);

  const pieData = [
    { name: "Investment", value: result.totalInvestment, color: "#166534" },
    { name: "Dividends", value: result.totalDividendIncome, color: "#22c55e" },
    { name: "Stock Growth", value: result.stockAppreciation, color: "#d97706" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Current Dividend Yield"
          value={`${result.currentYield.toFixed(2)}%`}
          ratingLabel={`Total return: ${formatINR(result.totalReturn)}`}
          ratingType={result.currentYield >= 3 ? "positive" : "neutral"}
          metrics={[
            { label: "Investment", value: formatINR(result.totalInvestment) },
            {
              label: "Total Dividends",
              value: formatINR(result.totalDividendIncome),
            },
            {
              label: "Yield on Cost (Final)",
              value: `${result.finalYieldOnCost}%`,
            },
            {
              label: "FD Returns (Post-Tax)",
              value: formatINR(result.fdTotalReturn),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Dividend Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Stock Price"
              icon={IndianRupee}
              value={stockPrice}
              onChange={setStockPrice}
              min={10}
              max={10000}
              step={10}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Annual Dividend / Share"
              icon={TrendingUp}
              value={annualDividend}
              onChange={setAnnualDividend}
              min={1}
              max={200}
              step={1}
              formatDisplay={(v) => formatINR(v)}
            />
            <SliderInput
              label="Number of Shares"
              icon={BarChart3}
              value={numShares}
              onChange={setNumShares}
              min={1}
              max={10000}
              step={10}
              formatDisplay={(v) => v.toLocaleString("en-IN")}
            />
            <SliderInput
              label="Dividend Growth Rate"
              icon={Percent}
              value={dividendGrowth}
              onChange={setDividendGrowth}
              min={0}
              max={15}
              step={0.5}
              suffix="% p.a."
            />
            <SliderInput
              label="Investment Period"
              icon={Calendar}
              value={investmentPeriod}
              onChange={setInvestmentPeriod}
              min={1}
              max={20}
              step={1}
              suffix=" Yrs"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Current Dividend Yield"
              value={`${result.currentYield.toFixed(2)}%`}
              ratingLabel={`Total return: ${formatINR(result.totalReturn)}`}
              ratingType={result.currentYield >= 3 ? "positive" : "neutral"}
              metrics={[
                {
                  label: "Investment",
                  value: formatINR(result.totalInvestment),
                },
                {
                  label: "Total Dividends",
                  value: formatINR(result.totalDividendIncome),
                },
                {
                  label: "Yield on Cost (Final)",
                  value: `${result.finalYieldOnCost}%`,
                },
                {
                  label: "FD Returns (Post-Tax)",
                  value: formatINR(result.fdTotalReturn),
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
            Cumulative Dividends vs FD Returns
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="dyDiv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dyStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dyFD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
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
                  dataKey="cumulativeDividend"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#dyDiv)"
                  name="Cumulative Dividends"
                />
                <Area
                  type="monotone"
                  dataKey="stockAppreciation"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="url(#dyStock)"
                  name="Stock Appreciation"
                />
                <Area
                  type="monotone"
                  dataKey="fdReturns"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="url(#dyFD)"
                  name="FD Returns (Post-Tax)"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
          category="demat-accounts"
          title="Best Demat Accounts"
          matchCriteria="for dividends"
        />
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="dividend-yield" variant="strip" />
      </div>
    </div>
  );
}
