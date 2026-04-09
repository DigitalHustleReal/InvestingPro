"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  Home,
  TrendingUp,
  Info,
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

export function HomeLoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [prepayment, setPrepayment] = useState(0);

  const calcEMI = (P: number, r: number, n: number) => {
    const mr = r / 100 / 12;
    const months = n * 12;
    if (mr === 0) return P / months;
    return (P * mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1);
  };

  const result = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = tenure * 12;
    const emi = calcEMI(loanAmount, interestRate, tenure);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    const yearlyData = [];
    let balance = loanAmount;
    let totalPP = 0,
      totalIP = 0;
    for (let year = 1; year <= tenure; year++) {
      let yp = 0,
        yi = 0;
      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const mi = balance * r;
        const mp = Math.min(emi - mi, balance);
        balance -= mp;
        yp += mp;
        yi += mi;
        if (m === 12 && prepayment > 0)
          balance = Math.max(0, balance - prepayment);
      }
      totalPP += yp;
      totalIP += yi;
      yearlyData.push({
        year: `Y${year}`,
        principal: Math.round(totalPP),
        balance: Math.round(Math.max(0, balance)),
      });
      if (balance <= 0) break;
    }

    const actualYears = yearlyData.length;
    const yearsSaved = tenure - actualYears;
    const annualInterest = totalInterest / tenure;
    const sec24 = Math.min(annualInterest, 200000);
    const sec80C = Math.min(loanAmount / tenure, 150000);
    const taxBenefit = Math.round((sec24 + sec80C) * 0.3);

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      interestRatio: totalInterest / loanAmount,
      yearlyData,
      yearsSaved,
      actualYears,
      sec24,
      sec80C,
      taxBenefit,
    };
  }, [loanAmount, interestRate, tenure, prepayment]);

  const scenarios = useMemo(() => {
    const e1 = calcEMI(loanAmount, interestRate - 0.5, tenure);
    const e2 = calcEMI(loanAmount, interestRate, tenure);
    const e3 = calcEMI(loanAmount, interestRate + 0.5, tenure);
    return [
      {
        label: `${(interestRate - 0.5).toFixed(1)}% Rate`,
        description: "If rate drops 0.5%",
        value: `${formatINR(e1)}/mo`,
        subtext: `Save ${formatINR((e2 - e1) * tenure * 12)} total`,
        type: "conservative" as const,
      },
      {
        label: `${interestRate}% Rate`,
        description: "Current rate",
        value: `${formatINR(e2)}/mo`,
        subtext: `Total: ${formatINR(e2 * tenure * 12)}`,
        type: "moderate" as const,
      },
      {
        label: `${(interestRate + 0.5).toFixed(1)}% Rate`,
        description: "If rate rises 0.5%",
        value: `${formatINR(e3)}/mo`,
        subtext: `Extra ${formatINR((e3 - e2) * tenure * 12)} total`,
        type: "aggressive" as const,
      },
    ];
  }, [loanAmount, interestRate, tenure]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `You'll pay ${formatINR(result.totalInterest)} in interest — ${(result.interestRatio * 100).toFixed(0)}% of the loan. Total outgo: ${formatINR(result.totalPayment)} for a ${formatINR(loanAmount)} loan.`,
    );
    if (prepayment > 0 && result.yearsSaved > 0) {
      ins.push(
        `Prepaying ${formatINR(prepayment)}/year saves ${result.yearsSaved} year${result.yearsSaved > 1 ? "s" : ""} — loan closes in ${result.actualYears} years instead of ${tenure}.`,
      );
    } else {
      const savingsIf1L =
        calcEMI(loanAmount, interestRate, tenure) * tenure * 12 -
        calcEMI(loanAmount, interestRate, tenure - 2) * (tenure - 2) * 12;
      ins.push(
        `Prepaying just ₹1L/year could save you ~${formatINR(Math.abs(savingsIf1L))} and close the loan 2-3 years early.`,
      );
    }
    ins.push(
      `Tax benefit: ₹${(result.sec24 / 100000).toFixed(1)}L (Sec 24b interest) + ₹${(result.sec80C / 100000).toFixed(1)}L (Sec 80C principal) = ${formatINR(result.taxBenefit)}/year saved at 30% bracket.`,
    );
    return ins;
  }, [result, loanAmount, interestRate, tenure, prepayment]);

  const pieData = [
    { name: "Principal", value: loanAmount, color: "#166534" },
    { name: "Interest", value: result.totalInterest, color: "#dc2626" },
  ];

  const bankRates = [
    { bank: "SBI", rate: 8.5 },
    { bank: "HDFC", rate: 8.75 },
    { bank: "ICICI", rate: 8.75 },
    { bank: "Kotak", rate: 8.7 },
    { bank: "Axis", rate: 8.75 },
    { bank: "BoB", rate: 8.4 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Loan Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Loan Amount"
              icon={IndianRupee}
              value={loanAmount}
              onChange={setLoanAmount}
              min={500000}
              max={50000000}
              step={100000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Interest Rate"
              icon={Percent}
              value={interestRate}
              onChange={setInterestRate}
              min={6}
              max={15}
              step={0.05}
              suffix="% p.a."
            />
            <SliderInput
              label="Loan Tenure"
              icon={Calendar}
              value={tenure}
              onChange={setTenure}
              min={1}
              max={30}
              step={1}
              suffix=" Yrs"
            />
            <SliderInput
              label="Annual Prepayment"
              icon={TrendingUp}
              value={prepayment}
              onChange={setPrepayment}
              min={0}
              max={2000000}
              step={10000}
              formatDisplay={(v) => (v === 0 ? "None" : `${formatINR(v)}/yr`)}
            />
          </div>

          {/* Bank rates reference */}
          <div className="mt-5 bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Current Home Loan Rates (Apr 2026)
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {bankRates.map((b) => (
                <div key={b.bank} className="flex justify-between text-[11px]">
                  <span className="text-gray-500">{b.bank}</span>
                  <span
                    className={
                      b.rate <= interestRate
                        ? "font-semibold text-green-600"
                        : "text-gray-600"
                    }
                  >
                    {b.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ResultCard
            title="Monthly EMI"
            value={formatINR(result.emi)}
            ratingLabel={`Interest: ${(result.interestRatio * 100).toFixed(0)}% of principal`}
            ratingType={
              result.interestRatio < 0.8
                ? "positive"
                : result.interestRatio < 1.2
                  ? "neutral"
                  : "negative"
            }
            metrics={[
              { label: "Loan Amount", value: formatINR(loanAmount) },
              {
                label: "Total Interest",
                value: formatINR(result.totalInterest),
              },
              { label: "Total Payment", value: formatINR(result.totalPayment) },
              {
                label: "Tax Benefit/yr",
                value: formatINR(result.taxBenefit),
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
            Loan Balance Over Time
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="hlBalV2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hlPrinV2" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="balance"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fill="url(#hlBalV2)"
                  name="Outstanding"
                />
                <Area
                  type="monotone"
                  dataKey="principal"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#hlPrinV2)"
                  name="Principal Paid"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Pie inline */}
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

        <ProductRecs
          category="loans"
          title="Best Home Loan Rates"
          matchCriteria={`< ${interestRate}% available`}
        />
      </div>
    </div>
  );
}
