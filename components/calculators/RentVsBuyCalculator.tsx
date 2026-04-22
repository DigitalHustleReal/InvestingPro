"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  Home,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
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

export function RentVsBuyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(8000000);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [rentIncrease, setRentIncrease] = useState(5);
  const [loanRate, setLoanRate] = useState(8.5);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [propertyAppreciation, setPropertyAppreciation] = useState(5);
  const [years, setYears] = useState(15);
  const [investmentReturn, setInvestmentReturn] = useState(12);

  const result = useMemo(() => {
    const dp = propertyPrice * (downPaymentPct / 100);
    const loanAmount = propertyPrice - dp;
    const stampDuty = propertyPrice * 0.07; // ~7% (stamp duty + registration)
    const totalBuyCost = dp + stampDuty;

    // EMI calculation
    const r = loanRate / 100 / 12;
    const n = Math.min(years, 20) * 12;
    const emi =
      r > 0
        ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : loanAmount / n;
    const totalEMI = emi * n;
    const totalInterest = totalEMI - loanAmount;

    // Maintenance: 1% of property value per year
    const annualMaintenance = propertyPrice * 0.01;
    const totalMaintenance = annualMaintenance * years;

    // Property value at end
    const propertyValueEnd =
      propertyPrice * Math.pow(1 + propertyAppreciation / 100, years);

    // Total cost of buying
    const totalBuyingCost = dp + stampDuty + totalInterest + totalMaintenance;
    // Net position: property value - total cost
    const buyNetWealth = propertyValueEnd - totalBuyingCost;

    // Renting: invest the down payment + stamp duty + (EMI - rent) difference in SIP
    let totalRentPaid = 0;
    let investmentCorpus = 0;
    let currentRent = monthlyRent;
    const sipReturn = investmentReturn / 100 / 12;

    const chartData = [];

    for (let year = 1; year <= years; year++) {
      const annualRent = currentRent * 12;
      totalRentPaid += annualRent;

      // Monthly savings if renting (EMI - rent, capped at 0)
      const monthlySaving = Math.max(0, emi - currentRent);

      // Grow investment corpus
      for (let m = 1; m <= 12; m++) {
        investmentCorpus = (investmentCorpus + monthlySaving) * (1 + sipReturn);
      }

      // Add the initial corpus (DP + stamp duty invested from day 1)
      const initialInvestment =
        totalBuyCost * Math.pow(1 + investmentReturn / 100, year);

      chartData.push({
        year: `Y${year}`,
        buyWealth: Math.round(
          propertyPrice * Math.pow(1 + propertyAppreciation / 100, year) -
            (totalBuyingCost * year) / years,
        ),
        rentWealth: Math.round(
          initialInvestment + investmentCorpus - totalRentPaid,
        ),
      });

      currentRent *= 1 + rentIncrease / 100;
    }

    const initialInvestmentFinal =
      totalBuyCost * Math.pow(1 + investmentReturn / 100, years);
    const rentNetWealth =
      initialInvestmentFinal + investmentCorpus - totalRentPaid;

    const winner = buyNetWealth > rentNetWealth ? "buy" : "rent";
    const advantage = Math.abs(buyNetWealth - rentNetWealth);

    return {
      dp,
      stampDuty,
      loanAmount,
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalMaintenance: Math.round(totalMaintenance),
      propertyValueEnd: Math.round(propertyValueEnd),
      totalBuyingCost: Math.round(totalBuyingCost),
      buyNetWealth: Math.round(buyNetWealth),
      totalRentPaid: Math.round(totalRentPaid),
      investmentCorpus: Math.round(investmentCorpus + initialInvestmentFinal),
      rentNetWealth: Math.round(rentNetWealth),
      winner,
      advantage: Math.round(advantage),
      chartData,
    };
  }, [
    propertyPrice,
    monthlyRent,
    rentIncrease,
    loanRate,
    downPaymentPct,
    propertyAppreciation,
    years,
    investmentReturn,
  ]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.winner === "buy") {
      ins.push(
        `Buying wins by ${formatINR(result.advantage)} over ${years} years. Property appreciation of ${propertyAppreciation}% p.a. is the key factor. Lekin yaad rakhein — property liquid nahi hai, bechne mein 3-6 mahine lagte hain.`,
      );
    } else {
      ins.push(
        `Renting + investing wins by ${formatINR(result.advantage)} over ${years} years. Down payment (${formatINR(result.dp)}) aur stamp duty (${formatINR(result.stampDuty)}) invest karke zyada paisa bana sakte hain at ${investmentReturn}% return.`,
      );
    }
    ins.push(
      `Stamp duty + registration = ${formatINR(result.stampDuty)} (7% of property price). Yeh paisa kabhi wapas nahi aata — buying ka hidden cost hai.`,
    );
    ins.push(
      `EMI ${formatINR(result.emi)}/mo vs current rent ${formatINR(monthlyRent)}/mo. Fark: ${formatINR(Math.abs(result.emi - monthlyRent))}/mo — isse invest karne ka option bhi consider karein.`,
    );
    return ins;
  }, [result, years, propertyAppreciation, investmentReturn, monthlyRent]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile result first */}
      <div className="lg:hidden">
        <div
          className={cn(
            "rounded-2xl p-5 shadow-sm border text-center",
            result.winner === "buy"
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
              : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300",
          )}
        >
          <p className="text-sm text-ink-60">
            {result.winner === "buy" ? "Buying" : "Renting + Investing"} wins by
          </p>
          <p
            className={cn(
              "text-4xl font-extrabold mt-1",
              result.winner === "buy" ? "text-authority-green" : "text-blue-700",
            )}
          >
            {formatINR(result.advantage)}
          </p>
          <p className="text-xs text-ink-60 mt-1">over {years} years</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5 flex items-center gap-2">
            <Home size={18} className="text-action-green" /> Property & Rent
            Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Property Price"
              icon={IndianRupee}
              value={propertyPrice}
              onChange={setPropertyPrice}
              min={2000000}
              max={50000000}
              step={500000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Monthly Rent (current)"
              icon={MapPin}
              value={monthlyRent}
              onChange={setMonthlyRent}
              min={5000}
              max={200000}
              step={1000}
              formatDisplay={formatINR}
            />
            <div className="grid grid-cols-2 gap-3">
              <SliderInput
                label="Rent Increase"
                icon={TrendingUp}
                value={rentIncrease}
                onChange={setRentIncrease}
                min={0}
                max={15}
                step={0.5}
                suffix="% p.a."
              />
              <SliderInput
                label="Down Payment"
                icon={Percent}
                value={downPaymentPct}
                onChange={setDownPaymentPct}
                min={10}
                max={50}
                step={5}
                suffix="%"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SliderInput
                label="Loan Rate"
                icon={Percent}
                value={loanRate}
                onChange={setLoanRate}
                min={6}
                max={12}
                step={0.1}
                suffix="%"
              />
              <SliderInput
                label="Property Growth"
                icon={TrendingUp}
                value={propertyAppreciation}
                onChange={setPropertyAppreciation}
                min={0}
                max={15}
                step={0.5}
                suffix="%"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SliderInput
                label="Time Period"
                icon={Calendar}
                value={years}
                onChange={setYears}
                min={5}
                max={25}
                step={1}
                suffix=" Yrs"
              />
              <SliderInput
                label="SIP Return"
                icon={Percent}
                value={investmentReturn}
                onChange={setInvestmentReturn}
                min={6}
                max={18}
                step={0.5}
                suffix="%"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Side-by-side cards */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-sm border p-4",
                result.winner === "buy"
                  ? "bg-action-green/10 border-green-300 ring-2 ring-green-200"
                  : "bg-white border-ink/10",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-ink">Buy</p>
                {result.winner === "buy" && (
                  <span className="text-[9px] font-bold text-authority-green bg-action-green/20 px-1.5 py-0.5 rounded">
                    WINS
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-authority-green">
                {formatINR(result.buyNetWealth)}
              </p>
              <div className="mt-2 space-y-1 text-[10px] text-ink-60">
                <div className="flex justify-between">
                  <span>Property Value</span>
                  <span className="text-ink">
                    {formatINR(result.propertyValueEnd)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost</span>
                  <span className="text-red-600">
                    -{formatINR(result.totalBuyingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>EMI</span>
                  <span>{formatINR(result.emi)}/mo</span>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "rounded-sm border p-4",
                result.winner === "rent"
                  ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                  : "bg-white border-ink/10",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-ink">
                  Rent + Invest
                </p>
                {result.winner === "rent" && (
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    WINS
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-blue-700">
                {formatINR(result.rentNetWealth)}
              </p>
              <div className="mt-2 space-y-1 text-[10px] text-ink-60">
                <div className="flex justify-between">
                  <span>Investment Corpus</span>
                  <span className="text-ink">
                    {formatINR(result.investmentCorpus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Rent Paid</span>
                  <span className="text-red-600">
                    -{formatINR(result.totalRentPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Rent</span>
                  <span>{formatINR(monthlyRent)}/mo</span>
                </div>
              </div>
            </div>
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Net Wealth: Buying vs Renting + Investing
        </h3>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chartData}>
              <defs>
                <linearGradient id="rvbBuy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rvbRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                dataKey="buyWealth"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#rvbBuy)"
                name="Buy"
              />
              <Area
                type="monotone"
                dataKey="rentWealth"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#rvbRent)"
                name="Rent + Invest"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-0.5 bg-action-green/100 rounded" />
            <span className="text-ink-60">Buy Property</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-0.5 bg-blue-500 rounded" />
            <span className="text-ink-60">Rent + Invest</span>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="rent-vs-buy" variant="strip" />
      </div>
    </div>
  );
}
