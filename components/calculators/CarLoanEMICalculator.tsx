"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  Car,
  TrendingDown,
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
  PieChart,
  Pie,
  Cell,
  formatINR,
  yAxisINR,
} from "./shared/charts";

export function CarLoanEMICalculator() {
  const [carPrice, setCarPrice] = useState(1000000);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(5);

  const calcEMI = (P: number, r: number, n: number) => {
    const mr = r / 100 / 12;
    const months = n * 12;
    if (mr === 0) return P / months;
    return (P * mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1);
  };

  const result = useMemo(() => {
    const dpAmount = carPrice * (downPayment / 100);
    const loanAmount = carPrice - dpAmount;
    const emi = calcEMI(loanAmount, interestRate, tenure);
    const totalPayment = emi * tenure * 12;
    const totalInterest = totalPayment - loanAmount;
    const totalCost = dpAmount + totalPayment; // True cost of owning the car

    // Depreciation: car loses ~15% value per year
    const depreciatedValue = carPrice * Math.pow(0.85, tenure);
    const depreciationLoss = carPrice - depreciatedValue;

    // Opportunity cost: if you invested the down payment in SIP instead
    const sipFV = dpAmount * Math.pow(1 + 0.12, tenure); // 12% equity returns
    const opportunityCost = sipFV - dpAmount;

    const yearlyData = [];
    let balance = loanAmount;
    const r = interestRate / 100 / 12;
    let totalPP = 0;
    for (let year = 1; year <= tenure; year++) {
      let yp = 0;
      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const mi = balance * r;
        const mp = Math.min(emi - mi, balance);
        balance -= mp;
        yp += mp;
      }
      totalPP += yp;
      const carValue = carPrice * Math.pow(0.85, year);
      yearlyData.push({
        year: `Y${year}`,
        balance: Math.round(Math.max(0, balance)),
        carValue: Math.round(carValue),
      });
    }

    return {
      loanAmount: Math.round(loanAmount),
      dpAmount: Math.round(dpAmount),
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      depreciatedValue: Math.round(depreciatedValue),
      depreciationLoss: Math.round(depreciationLoss),
      opportunityCost: Math.round(opportunityCost),
      yearlyData,
    };
  }, [carPrice, downPayment, interestRate, tenure]);

  const scenarios = useMemo(() => {
    const e3 = calcEMI(result.loanAmount, interestRate, 3);
    const e5 = calcEMI(result.loanAmount, interestRate, 5);
    const e7 = calcEMI(result.loanAmount, interestRate, 7);
    const t3 = e3 * 36 - result.loanAmount;
    const t5 = e5 * 60 - result.loanAmount;
    const t7 = e7 * 84 - result.loanAmount;
    return [
      {
        label: "3 Years",
        description: `EMI: ${formatINR(e3)}/mo`,
        value: formatINR(t3),
        subtext: "Lowest interest, highest EMI",
        type: "conservative" as const,
      },
      {
        label: "5 Years",
        description: `EMI: ${formatINR(e5)}/mo`,
        value: formatINR(t5),
        subtext: "Balanced choice",
        type: "moderate" as const,
      },
      {
        label: "7 Years",
        description: `EMI: ${formatINR(e7)}/mo`,
        value: formatINR(t7),
        subtext: "Low EMI, most interest",
        type: "aggressive" as const,
      },
    ];
  }, [result.loanAmount, interestRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `True cost of this car: ${formatINR(result.totalCost)} (price ${formatINR(carPrice)} + interest ${formatINR(result.totalInterest)}). Aap ${formatINR(result.totalInterest)} sirf interest mein de rahe hain.`,
    );
    ins.push(
      `${tenure} saal baad car ki value: ${formatINR(result.depreciatedValue)} (depreciation: ${formatINR(result.depreciationLoss)}). Car kharidna investment nahi hai — yeh kharcha hai.`,
    );
    if (downPayment < 30) {
      ins.push(
        `Down payment badhaye 30%+ tak. ${formatINR(carPrice * 0.3)} down payment dene se EMI ${formatINR(calcEMI(carPrice * 0.7, interestRate, tenure) - result.emi)} kam hoga aur total interest bhi bachega.`,
      );
    }
    return ins;
  }, [result, carPrice, downPayment, interestRate, tenure]);

  const pieData = [
    { name: "Down Payment", value: result.dpAmount, color: "#166534" },
    { name: "Loan Principal", value: result.loanAmount, color: "#22c55e" },
    { name: "Interest", value: result.totalInterest, color: "#dc2626" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Monthly EMI"
          value={formatINR(result.emi)}
          ratingLabel={`Total cost: ${formatINR(result.totalCost)}`}
          ratingType={
            result.totalInterest < result.loanAmount * 0.3
              ? "positive"
              : "neutral"
          }
          metrics={[
            { label: "Car Price", value: formatINR(carPrice) },
            { label: "Down Payment", value: formatINR(result.dpAmount) },
            { label: "Loan Amount", value: formatINR(result.loanAmount) },
            { label: "Total Interest", value: formatINR(result.totalInterest) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Car Loan Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Car Price (On-Road)"
              icon={Car}
              value={carPrice}
              onChange={setCarPrice}
              min={300000}
              max={5000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Down Payment"
              icon={IndianRupee}
              value={downPayment}
              onChange={setDownPayment}
              min={0}
              max={80}
              step={5}
              formatDisplay={(v) =>
                `${v}% (${formatINR((carPrice * v) / 100)})`
              }
            />
            <SliderInput
              label="Interest Rate"
              icon={Percent}
              value={interestRate}
              onChange={setInterestRate}
              min={7}
              max={16}
              step={0.1}
              suffix="% p.a."
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
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Monthly EMI"
              value={formatINR(result.emi)}
              ratingLabel={`Total cost: ${formatINR(result.totalCost)}`}
              ratingType={
                result.totalInterest < result.loanAmount * 0.3
                  ? "positive"
                  : "neutral"
              }
              metrics={[
                { label: "Car Price", value: formatINR(carPrice) },
                { label: "Down Payment", value: formatINR(result.dpAmount) },
                { label: "Loan Amount", value: formatINR(result.loanAmount) },
                {
                  label: "Total Interest",
                  value: formatINR(result.totalInterest),
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
            Loan Balance vs Car Value
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="clBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clVal" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="balance"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fill="url(#clBal)"
                  name="Loan Balance"
                />
                <Area
                  type="monotone"
                  dataKey="carValue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#clVal)"
                  name="Car Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-gray-100">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
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

        <ProductRecs
          category="loans"
          title="Best Car Loan Rates"
          matchCriteria={`< ${interestRate}%`}
        />
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="car-loan-emi" variant="strip" />
      </div>
    </div>
  );
}
