"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  Wallet,
  AlertTriangle,
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

export function PersonalLoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(3);
  const [processingFee, setProcessingFee] = useState(2);

  const calcEMI = (P: number, rate: number, yrs: number) => {
    const r = rate / 100 / 12;
    const n = yrs * 12;
    return r > 0
      ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : P / n;
  };

  const result = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = tenure * 12;
    const emi = calcEMI(loanAmount, interestRate, tenure);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;
    const procFee = loanAmount * (processingFee / 100);
    const effectiveCost = totalInterest + procFee;
    const disbursed = loanAmount - procFee;

    const yearlyData = [];
    let balance = loanAmount;
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
      yearlyData.push({
        year: `Y${year}`,
        principal: Math.round(totalPP),
        balance: Math.round(Math.max(0, balance)),
      });
    }

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      procFee: Math.round(procFee),
      effectiveCost: Math.round(effectiveCost),
      disbursed: Math.round(disbursed),
      yearlyData,
    };
  }, [loanAmount, interestRate, tenure, processingFee]);

  const scenarios = useMemo(() => {
    const e1 = calcEMI(loanAmount, 10.5, tenure);
    const e2 = calcEMI(loanAmount, interestRate, tenure);
    const e3 = calcEMI(loanAmount, 18, tenure);
    return [
      {
        label: "Bank Rate (10.5%)",
        description: "CIBIL 750+, top employer",
        value: `${formatINR(e1)}/mo`,
        subtext: `Save ${formatINR((e2 - e1) * tenure * 12)} vs current`,
        type: "conservative" as const,
      },
      {
        label: `Your Rate (${interestRate}%)`,
        description: "Current selection",
        value: `${formatINR(e2)}/mo`,
        subtext: `Total: ${formatINR(e2 * tenure * 12)}`,
        type: "moderate" as const,
      },
      {
        label: "NBFC Rate (18%)",
        description: "Low CIBIL / digital lender",
        value: `${formatINR(e3)}/mo`,
        subtext: `Extra ${formatINR((e3 - e2) * tenure * 12)} cost`,
        type: "aggressive" as const,
      },
    ];
  }, [loanAmount, interestRate, tenure]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `True cost: You borrow ${formatINR(loanAmount)} but receive ${formatINR(result.disbursed)} after ${processingFee}% fee. Total repayment: ${formatINR(result.totalPayment)}.`,
    );
    if (interestRate > 14) {
      ins.push(
        `At ${interestRate}%, you're likely with an NBFC. CIBIL 750+ qualifies for bank rates around 10.5-12%. Improving score by 50 points could save ${formatINR(Math.round(result.totalInterest * 0.3))}.`,
      );
    }
    const creditCardCost = loanAmount * 0.36 * tenure; // 36% APR
    ins.push(
      `This loan costs ${formatINR(result.totalInterest)} in interest. Credit card EMI for the same would cost ${formatINR(Math.round(creditCardCost))} — personal loan saves ${formatINR(Math.round(creditCardCost - result.totalInterest))}.`,
    );
    return ins;
  }, [result, loanAmount, interestRate, tenure, processingFee]);

  const pieData = [
    { name: "Principal", value: loanAmount, color: "#166534" },
    { name: "Interest", value: result.totalInterest, color: "#dc2626" },
    { name: "Processing Fee", value: result.procFee, color: "#d97706" },
  ].filter((d) => d.value > 0);

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
              min={50000}
              max={4000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Interest Rate"
              icon={Percent}
              value={interestRate}
              onChange={setInterestRate}
              min={8}
              max={36}
              step={0.25}
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
              formatDisplay={(v) => `${v} Yr${v > 1 ? "s" : ""} (${v * 12} mo)`}
            />
            <SliderInput
              label="Processing Fee"
              icon={Wallet}
              value={processingFee}
              onChange={setProcessingFee}
              min={0}
              max={5}
              step={0.25}
              formatDisplay={(v) =>
                `${v}% (${formatINR((loanAmount * v) / 100)})`
              }
            />
          </div>
          {interestRate > 18 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
              <AlertTriangle size={14} className="inline mr-1" />
              <strong>Warning:</strong> Rates above 18% are typically from
              NBFCs/digital lenders. CIBIL 750+ qualifies for 10-14% bank rates.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <ResultCard
            title="Monthly EMI"
            value={formatINR(result.emi)}
            ratingLabel={`Total cost: ${formatINR(result.effectiveCost)}`}
            ratingType={
              interestRate <= 14
                ? "positive"
                : interestRate <= 20
                  ? "neutral"
                  : "negative"
            }
            metrics={[
              { label: "Disbursed", value: formatINR(result.disbursed) },
              {
                label: "Total Interest",
                value: formatINR(result.totalInterest),
              },
              { label: "Processing Fee", value: formatINR(result.procFee) },
              { label: "Total Payment", value: formatINR(result.totalPayment) },
            ]}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Repayment Schedule
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="plBalV2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="plPrV2" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#plBalV2)"
                  name="Outstanding"
                />
                <Area
                  type="monotone"
                  dataKey="principal"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#plPrV2)"
                  name="Paid"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Pie inline */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
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
          title="Better Rate Options"
          matchCriteria="Compare 60+ lenders"
        />
      </div>
    </div>
  );
}
