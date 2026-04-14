"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Percent, Calendar, AlertTriangle } from "lucide-react";
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
  BarChart,
  Bar,
  formatINR,
  yAxisINR,
} from "./shared/charts";

export function FlatVsReducingCalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [flatRate, setFlatRate] = useState(8);
  const [tenure, setTenure] = useState(3);

  const calcReducingEMI = (P: number, r: number, n: number) => {
    const mr = r / 100 / 12;
    const months = n * 12;
    if (mr === 0) return P / months;
    return (P * mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1);
  };

  const result = useMemo(() => {
    const months = tenure * 12;

    // Flat rate calculation
    const flatInterestTotal = loanAmount * (flatRate / 100) * tenure;
    const flatEMI = (loanAmount + flatInterestTotal) / months;
    const flatTotalPayment = flatEMI * months;

    // Approximate reducing rate: flat × 1.8 (standard industry approximation)
    // More precise: use the IRR approach
    // For flat rate loans, the true reducing rate is approximately flat × (n+1)/n × 12/(n+1)
    // Simplified: flat × 1.75 to 1.9 depending on tenure
    const approxReducingRate = (flatRate * (2 * months)) / (months + 1);

    // Reducing rate EMI at the SAME flat rate (to show the difference)
    const reducingEMI = calcReducingEMI(loanAmount, flatRate, tenure);
    const reducingTotalPayment = reducingEMI * months;
    const reducingInterestTotal = reducingTotalPayment - loanAmount;

    // Extra cost of flat rate
    const extraPaid = flatInterestTotal - reducingInterestTotal;
    const extraPercent = (extraPaid / reducingInterestTotal) * 100;

    // Monthly breakdown for chart
    const monthlyData = [];
    let flatBalance = loanAmount;
    let reducingBalance = loanAmount;
    const flatPrincipalPerMonth = loanAmount / months;
    const flatInterestPerMonth = flatInterestTotal / months;
    const reducingMonthlyRate = flatRate / 100 / 12;

    for (let m = 1; m <= months; m++) {
      // Flat: interest is constant every month
      const flatInt = flatInterestPerMonth;
      const flatPrin = flatPrincipalPerMonth;
      flatBalance -= flatPrin;

      // Reducing: interest decreases as principal is paid
      const redInt = reducingBalance * reducingMonthlyRate;
      const redPrin = reducingEMI - redInt;
      reducingBalance -= redPrin;

      // Sample every 3 months for chart readability
      if (m % 3 === 0 || m === 1 || m === months) {
        monthlyData.push({
          month: `M${m}`,
          flatInterest: Math.round(flatInt),
          flatPrincipal: Math.round(flatPrin),
          reducingInterest: Math.round(redInt),
          reducingPrincipal: Math.round(Math.max(0, redPrin)),
        });
      }
    }

    return {
      flatEMI: Math.round(flatEMI),
      reducingEMI: Math.round(reducingEMI),
      flatInterestTotal: Math.round(flatInterestTotal),
      reducingInterestTotal: Math.round(reducingInterestTotal),
      flatTotalPayment: Math.round(flatTotalPayment),
      reducingTotalPayment: Math.round(reducingTotalPayment),
      approxReducingRate: Math.round(approxReducingRate * 100) / 100,
      extraPaid: Math.round(extraPaid),
      extraPercent: Math.round(extraPercent),
      monthlyData,
    };
  }, [loanAmount, flatRate, tenure]);

  const scenarios = useMemo(() => {
    const calc = (flat: number) => {
      const months = tenure * 12;
      const flatInt = loanAmount * (flat / 100) * tenure;
      const flatE = (loanAmount + flatInt) / months;
      const trueReducing = (flat * (2 * months)) / (months + 1);
      const redE = calcReducingEMI(loanAmount, flat, tenure);
      const redInt = redE * months - loanAmount;
      const extra = flatInt - redInt;
      return { flatE, trueReducing, extra };
    };
    const s8 = calc(8);
    const s10 = calc(10);
    const s12 = calc(12);
    return [
      {
        label: `8% Flat Rate`,
        description: `True rate: ${s8.trueReducing.toFixed(1)}% reducing`,
        value: formatINR(s8.extra),
        subtext: "Extra interest you pay",
        type: "conservative" as const,
      },
      {
        label: `10% Flat Rate`,
        description: `True rate: ${s10.trueReducing.toFixed(1)}% reducing`,
        value: formatINR(s10.extra),
        subtext: "Extra interest you pay",
        type: "moderate" as const,
      },
      {
        label: `12% Flat Rate`,
        description: `True rate: ${s12.trueReducing.toFixed(1)}% reducing`,
        value: formatINR(s12.extra),
        subtext: "Extra interest you pay",
        type: "aggressive" as const,
      },
    ];
  }, [loanAmount, tenure]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${flatRate}% flat rate actually ${result.approxReducingRate.toFixed(1)}% reducing rate hai — NBFC ka sabse bada trick yahi hai. Always compare reducing rates, not flat.`,
    );
    ins.push(
      `Flat rate mein aap ${formatINR(result.extraPaid)} EXTRA interest de rahe hain (${result.extraPercent}% zyada). Same loan reducing rate pe lene se itna bachta hai.`,
    );
    ins.push(
      `RBI rule: banks must quote reducing rate. Lekin NBFCs, car dealers, aur fintech apps abhi bhi flat rate dikhate hain — low number attractive lagta hai but actual cost double hoti hai.`,
    );
    if (tenure >= 5) {
      ins.push(
        `${tenure} saal ki lambi tenure pe flat rate ka nuksan aur zyada hota hai. Short tenure (2-3Y) pe fark kam hota hai.`,
      );
    }
    return ins;
  }, [result, flatRate, tenure]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-900">
            Why This Matters
          </p>
          <p className="text-xs text-amber-700 mt-1">
            NBFCs and car dealers often quote &quot;flat rate&quot; which looks
            lower but costs significantly more. A 8% flat rate = ~14-15%
            reducing rate. This calculator exposes the true cost.
          </p>
        </div>
      </div>

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Extra Cost of Flat Rate"
          value={formatINR(result.extraPaid)}
          ratingLabel={`${result.extraPercent}% more interest vs reducing`}
          ratingType="negative"
          metrics={[
            { label: "Flat Rate EMI", value: formatINR(result.flatEMI) },
            {
              label: "Reducing Rate EMI",
              value: formatINR(result.reducingEMI),
            },
            {
              label: "True Reducing Rate",
              value: `${result.approxReducingRate}%`,
            },
            {
              label: "Flat Interest Total",
              value: formatINR(result.flatInterestTotal),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Loan Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Loan Amount"
              icon={IndianRupee}
              value={loanAmount}
              onChange={setLoanAmount}
              min={50000}
              max={5000000}
              step={25000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Flat Interest Rate"
              icon={Percent}
              value={flatRate}
              onChange={setFlatRate}
              min={5}
              max={15}
              step={0.25}
              suffix="% p.a. (flat)"
            />
            <SliderInput
              label="Loan Tenure"
              icon={Calendar}
              value={tenure}
              onChange={setTenure}
              min={1}
              max={7}
              step={1}
              suffix=" Yrs"
            />
          </div>

          {/* Conversion formula box */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-900 mb-2">
              Conversion Formula
            </p>
            <p className="text-sm text-green-800 font-mono">
              Reducing Rate = Flat Rate x 2N / (N+1)
            </p>
            <p className="text-xs text-green-600 mt-1">
              Where N = total months. For {tenure}Y loan: {flatRate}% x{" "}
              {2 * tenure * 12}/{tenure * 12 + 1} = {result.approxReducingRate}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Extra Cost of Flat Rate"
              value={formatINR(result.extraPaid)}
              ratingLabel={`${result.extraPercent}% more interest vs reducing`}
              ratingType="negative"
              metrics={[
                { label: "Flat Rate EMI", value: formatINR(result.flatEMI) },
                {
                  label: "Reducing Rate EMI",
                  value: formatINR(result.reducingEMI),
                },
                {
                  label: "True Reducing Rate",
                  value: `${result.approxReducingRate}%`,
                },
                {
                  label: "Flat Interest Total",
                  value: formatINR(result.flatInterestTotal),
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      {/* Side-by-side comparison table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Head-to-Head Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Parameter
                </th>
                <th className="text-right py-2 px-3 text-red-600 font-medium">
                  Flat Rate ({flatRate}%)
                </th>
                <th className="text-right py-2 px-3 text-green-700 font-medium">
                  Reducing Rate ({flatRate}%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-2.5 px-3 text-gray-700">Monthly EMI</td>
                <td className="py-2.5 px-3 text-right font-semibold text-red-600">
                  {formatINR(result.flatEMI)}
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-green-700">
                  {formatINR(result.reducingEMI)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-gray-700">Total Interest</td>
                <td className="py-2.5 px-3 text-right font-semibold text-red-600">
                  {formatINR(result.flatInterestTotal)}
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-green-700">
                  {formatINR(result.reducingInterestTotal)}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-gray-700">Total Payment</td>
                <td className="py-2.5 px-3 text-right font-semibold text-red-600">
                  {formatINR(result.flatTotalPayment)}
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-green-700">
                  {formatINR(result.reducingTotalPayment)}
                </td>
              </tr>
              <tr className="bg-amber-50">
                <td className="py-2.5 px-3 text-amber-900 font-semibold">
                  You Overpay
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-red-600">
                  {formatINR(result.extraPaid)}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-green-700">
                  -
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Interest vs Principal Split (Flat vs Reducing)
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.monthlyData}>
                <defs>
                  <linearGradient id="fvrFlat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fvrRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
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
                  dataKey="flatInterest"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fill="url(#fvrFlat)"
                  name="Flat: Interest/mo"
                />
                <Area
                  type="monotone"
                  dataKey="reducingInterest"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#fvrRed)"
                  name="Reducing: Interest/mo"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-600" />
              <div>
                <p className="text-[11px] text-gray-400">Flat Interest</p>
                <p className="text-sm font-bold text-gray-900">Constant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-600" />
              <div>
                <p className="text-[11px] text-gray-400">Reducing Interest</p>
                <p className="text-sm font-bold text-gray-900">Decreasing</p>
              </div>
            </div>
          </div>
        </div>

        <ProductRecs
          category="loans"
          title="Best Reducing Rate Loans"
          matchCriteria="reducing rate"
        />
      </div>

      <div className="lg:hidden">
        <PopularCalculators
          currentSlug="flat-vs-reducing-rate"
          variant="strip"
        />
      </div>
    </div>
  );
}
