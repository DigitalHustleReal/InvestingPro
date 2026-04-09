"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Percent, ArrowLeftRight } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { AIInsight } from "./shared/AIInsight";
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

export function LumpsumVsSIPCalculator() {
  const [totalAmount, setTotalAmount] = useState(600000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  const monthlySIP = totalAmount / (years * 12);

  const calcLumpsum = (amount: number, rate: number, yrs: number) => {
    return amount * Math.pow(1 + rate / 100, yrs);
  };

  const calcSIP = (monthly: number, rate: number, yrs: number) => {
    const r = rate / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  };

  const result = useMemo(() => {
    const lumpsumFV = calcLumpsum(totalAmount, expectedReturn, years);
    const sipFV = calcSIP(monthlySIP, expectedReturn, years);
    const lumpsumReturns = lumpsumFV - totalAmount;
    const sipReturns = sipFV - totalAmount;
    const winner = lumpsumFV > sipFV ? "lumpsum" : "sip";
    const advantage = Math.abs(lumpsumFV - sipFV);

    const chartData = [];
    for (let y = 0; y <= years; y++) {
      chartData.push({
        year: `Y${y}`,
        lumpsum: Math.round(calcLumpsum(totalAmount, expectedReturn, y)),
        sip: Math.round(calcSIP(monthlySIP, expectedReturn, y)),
        invested: Math.round(y === 0 ? totalAmount : totalAmount), // Lumpsum invested day 1
        sipInvested: Math.round(monthlySIP * y * 12),
      });
    }

    return {
      lumpsumFV: Math.round(lumpsumFV),
      sipFV: Math.round(sipFV),
      lumpsumReturns: Math.round(lumpsumReturns),
      sipReturns: Math.round(sipReturns),
      winner,
      advantage: Math.round(advantage),
      chartData,
    };
  }, [totalAmount, years, expectedReturn, monthlySIP]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.winner === "lumpsum") {
      ins.push(
        `Lumpsum wins by ${formatINR(result.advantage)} because all your money compounds from Day 1. In a steadily rising market, lumpsum always beats SIP mathematically.`,
      );
      ins.push(
        `But SIP protects you from timing risk. If markets drop 20% after your lumpsum, you'd need 25% gain just to break even. SIP averages through the dip.`,
      );
    } else {
      ins.push(
        `SIP wins here because of rupee-cost averaging — you buy more units when markets dip, fewer when high. Over volatile periods, SIP can outperform lumpsum.`,
      );
    }
    ins.push(
      `Best strategy: Invest lumpsum in debt fund, start STP (Systematic Transfer Plan) of ${formatINR(monthlySIP)}/mo into equity. You get lumpsum returns on idle money + SIP's averaging benefit.`,
    );
    return ins;
  }, [result, monthlySIP]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <ArrowLeftRight size={18} className="text-green-600" /> Compare with
          Same Total Investment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SliderInput
            label="Total Investment Amount"
            icon={IndianRupee}
            value={totalAmount}
            onChange={setTotalAmount}
            min={10000}
            max={10000000}
            step={10000}
            formatDisplay={formatINR}
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
      </div>

      {/* Side-by-side Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={cn(
            "rounded-2xl p-6 shadow-sm border",
            result.winner === "lumpsum"
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 ring-2 ring-green-200"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">Lumpsum</p>
            {result.winner === "lumpsum" && (
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                WINNER
              </span>
            )}
          </div>
          <p className="text-4xl font-extrabold text-green-700">
            {formatINR(result.lumpsumFV)}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-green-200/50">
            <div>
              <p className="text-[10px] text-gray-500">Invested</p>
              <p className="text-sm font-bold">{formatINR(totalAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Returns</p>
              <p className="text-sm font-bold text-green-700">
                {formatINR(result.lumpsumReturns)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Entire {formatINR(totalAmount)} invested on Day 1
          </p>
        </div>

        <div
          className={cn(
            "rounded-2xl p-6 shadow-sm border",
            result.winner === "sip"
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 ring-2 ring-blue-200"
              : "bg-white border-gray-200",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              SIP ({formatINR(monthlySIP)}/mo)
            </p>
            {result.winner === "sip" && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                WINNER
              </span>
            )}
          </div>
          <p className="text-4xl font-extrabold text-blue-700">
            {formatINR(result.sipFV)}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-200/50">
            <div>
              <p className="text-[10px] text-gray-500">Invested</p>
              <p className="text-sm font-bold">{formatINR(totalAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Returns</p>
              <p className="text-sm font-bold text-blue-700">
                {formatINR(result.sipReturns)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {formatINR(monthlySIP)}/mo × {years * 12} months ={" "}
            {formatINR(totalAmount)}
          </p>
        </div>
      </div>

      {/* Difference callout */}
      <div
        className={cn(
          "rounded-xl px-5 py-4 text-sm font-medium",
          result.winner === "lumpsum"
            ? "bg-green-50 border border-green-200 text-green-800"
            : "bg-blue-50 border border-blue-200 text-blue-800",
        )}
      >
        <strong>
          {result.winner === "lumpsum" ? "Lumpsum" : "SIP"} wins by{" "}
          {formatINR(result.advantage)}
        </strong>{" "}
        — but read the AI insight below before deciding.
      </div>

      <AIInsight insights={insights} />

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Growth Comparison Over {years} Years
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chartData}>
              <defs>
                <linearGradient id="lsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
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
              />
              <Tooltip
                formatter={(value: any) => [formatINR(Number(value)), ""]}
                contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="lumpsum"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#lsGrad)"
                name="Lumpsum"
              />
              <Area
                type="monotone"
                dataKey="sip"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#sipGrad)"
                name="SIP"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-8 mt-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-0.5 bg-green-500 rounded" />
            <span className="text-gray-500">Lumpsum</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-0.5 bg-blue-500 rounded" />
            <span className="text-gray-500">SIP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            When to Choose What
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm font-bold text-green-800 mb-2">
                Choose Lumpsum When:
              </p>
              <ul className="text-xs text-green-700 space-y-1.5">
                <li>• Markets have corrected 15%+ (buying opportunity)</li>
                <li>• You received a bonus/inheritance/sale proceeds</li>
                <li>• Investment horizon is 7+ years</li>
                <li>• You can tolerate short-term volatility</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-bold text-blue-800 mb-2">
                Choose SIP When:
              </p>
              <ul className="text-xs text-blue-700 space-y-1.5">
                <li>• You earn monthly salary (disciplined investing)</li>
                <li>• Markets are at all-time highs</li>
                <li>• You&apos;re new to equity investing</li>
                <li>• You want to average out volatility</li>
              </ul>
            </div>
          </div>
        </div>
        <ProductRecs category="mutual-funds" title="Top Funds to Invest" />
      </div>
    </div>
  );
}
