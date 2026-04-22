"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Percent,
  Briefcase,
  Calendar,
  FileText,
  Receipt,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  formatINR,
  yAxisINR,
} from "./shared/charts";

// New Tax Regime FY 2025-26 slabs
const newRegimeSlabs = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.1 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.2 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.3 },
];

// Old Tax Regime slabs
const oldRegimeSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: Infinity, rate: 0.3 },
];

function calcSlabTax(income: number, slabs: typeof newRegimeSlabs): number {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.min) break;
    const taxableInSlab = Math.min(income, slab.max) - slab.min;
    tax += taxableInSlab * slab.rate;
  }
  return tax;
}

export function FreelancerTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1500000);
  const [expenses, setExpenses] = useState(300000);
  const [usePresumptive, setUsePresumptive] = useState(true);
  const [gstRegistered, setGstRegistered] = useState(false);
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState(0);

  const result = useMemo(() => {
    // Normal computation: Gross - Expenses = Taxable
    const normalTaxable = Math.max(0, grossIncome - expenses);

    // Presumptive (44ADA): 50% of gross income is taxable (for professionals < ₹75L)
    const presumptiveTaxable = grossIncome * 0.5;

    const taxableIncome = usePresumptive ? presumptiveTaxable : normalTaxable;

    // New regime tax
    const newTax = calcSlabTax(taxableIncome, newRegimeSlabs);
    // New regime rebate: if taxable income <= ₹12L, tax is 0 (marginal relief up to ₹12.75L)
    const newTaxAfterRebate = taxableIncome <= 1200000 ? 0 : newTax;
    const newCess = newTaxAfterRebate * 0.04;
    const newTotal = Math.round(newTaxAfterRebate + newCess);

    // Old regime tax (with ₹1.5L 80C deduction assumed)
    const oldDeductions = 150000; // Basic 80C
    const oldTaxable = Math.max(0, taxableIncome - oldDeductions);
    const oldTax = calcSlabTax(oldTaxable, oldRegimeSlabs);
    // Old regime rebate: if taxable <= ₹5L
    const oldTaxAfterRebate = oldTaxable <= 500000 ? 0 : oldTax;
    const oldCess = oldTaxAfterRebate * 0.04;
    const oldTotal = Math.round(oldTaxAfterRebate + oldCess);

    // Better regime
    const betterRegime = newTotal <= oldTotal ? "New Regime" : "Old Regime";
    const taxSaving = Math.abs(newTotal - oldTotal);
    const finalTax = Math.min(newTotal, oldTotal);

    // GST liability
    const gstLiable = grossIncome > 2000000;
    const gstAmount = gstLiable && gstRegistered ? grossIncome * 0.18 : 0;

    // Advance tax schedule (if tax > ₹10,000)
    const advanceTaxDue = finalTax > 10000;
    const advanceSchedule = [
      { date: "June 15", percent: 15, amount: Math.round(finalTax * 0.15) },
      { date: "Sept 15", percent: 45, amount: Math.round(finalTax * 0.45) },
      { date: "Dec 15", percent: 75, amount: Math.round(finalTax * 0.75) },
      { date: "Mar 15", percent: 100, amount: Math.round(finalTax) },
    ];

    // Net tax payable after advance tax
    const netPayable = Math.max(0, finalTax - advanceTaxPaid);

    // Effective tax rate
    const effectiveRate = grossIncome > 0 ? (finalTax / grossIncome) * 100 : 0;

    return {
      grossIncome,
      normalTaxable,
      presumptiveTaxable: Math.round(presumptiveTaxable),
      taxableIncome: Math.round(taxableIncome),
      newTotal,
      oldTotal,
      betterRegime,
      taxSaving,
      finalTax,
      gstLiable,
      gstAmount: Math.round(gstAmount),
      advanceTaxDue,
      advanceSchedule,
      netPayable,
      effectiveRate: Math.round(effectiveRate * 10) / 10,
    };
  }, [grossIncome, expenses, usePresumptive, gstRegistered, advanceTaxPaid]);

  const scenarios = useMemo(() => {
    const calc = (income: number) => {
      const taxable = income * 0.5; // Presumptive
      const tax = calcSlabTax(taxable, newRegimeSlabs);
      const afterRebate = taxable <= 1200000 ? 0 : tax;
      return Math.round(afterRebate + afterRebate * 0.04);
    };
    return [
      {
        label: "₹10L Income",
        description: "Presumptive (44ADA)",
        value: formatINR(calc(1000000)),
        subtext: `Taxable: ${formatINR(500000)} (50%)`,
        type: "conservative" as const,
      },
      {
        label: "₹25L Income",
        description: "Presumptive (44ADA)",
        value: formatINR(calc(2500000)),
        subtext: `Taxable: ${formatINR(1250000)} (50%)`,
        type: "moderate" as const,
      },
      {
        label: "₹50L Income",
        description: "Presumptive (44ADA)",
        value: formatINR(calc(5000000)),
        subtext: `Taxable: ${formatINR(2500000)} (50%)`,
        type: "aggressive" as const,
      },
    ];
  }, []);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (usePresumptive) {
      ins.push(
        `Section 44ADA: ₹${(grossIncome / 100000).toFixed(1)}L income pe sirf ${formatINR(result.presumptiveTaxable)} taxable hai (50%). Books maintain karne ki zarurat nahi, audit bhi nahi lagega (if < ₹75L).`,
      );
    } else {
      ins.push(
        `Normal computation mein actual expenses claim kar rahe hain. Agar expenses 50% se zyada hain toh yeh better hai, warna 44ADA try karein.`,
      );
    }
    ins.push(
      `${result.betterRegime} aapke liye ${formatINR(result.taxSaving)} sasta hai. Old regime mein 80C, HRA, LTA deductions milte hain. New regime mein lower slabs milte hain.`,
    );
    if (result.gstLiable) {
      ins.push(
        `GST registration mandatory hai — turnover ₹20L+ hai. GST: 18% on professional services. Input credit le sakte hain expenses pe.`,
      );
    }
    if (result.advanceTaxDue) {
      ins.push(
        `Advance tax bharein! ₹10,000+ tax liability hone pe 4 installments mein bharna padta hai (Jun 15, Sep 15, Dec 15, Mar 15). Late pe 1% per month interest (Section 234C).`,
      );
    }
    return ins;
  }, [result, grossIncome, usePresumptive]);

  const pieData = [
    {
      name: "Take-Home",
      value: Math.max(0, grossIncome - result.finalTax - result.gstAmount),
      color: "#22c55e",
    },
    { name: "Income Tax", value: result.finalTax, color: "#dc2626" },
    ...(result.gstAmount > 0
      ? [{ name: "GST", value: result.gstAmount, color: "#f59e0b" }]
      : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Income Tax"
          value={formatINR(result.finalTax)}
          ratingLabel={`${result.betterRegime} saves ${formatINR(result.taxSaving)}`}
          ratingType={result.effectiveRate < 15 ? "positive" : "neutral"}
          metrics={[
            { label: "Gross Income", value: formatINR(grossIncome) },
            { label: "Taxable Income", value: formatINR(result.taxableIncome) },
            { label: "New Regime Tax", value: formatINR(result.newTotal) },
            { label: "Old Regime Tax", value: formatINR(result.oldTotal) },
            { label: "Effective Rate", value: `${result.effectiveRate}%` },
            { label: "Net Payable", value: formatINR(result.netPayable) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Freelancer Income Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Annual Gross Income"
              icon={IndianRupee}
              value={grossIncome}
              onChange={setGrossIncome}
              min={300000}
              max={10000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Business Expenses"
              icon={Receipt}
              value={expenses}
              onChange={setExpenses}
              min={0}
              max={grossIncome * 0.8}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Advance Tax Already Paid"
              icon={IndianRupee}
              value={advanceTaxPaid}
              onChange={setAdvanceTaxPaid}
              min={0}
              max={result.finalTax}
              step={5000}
              formatDisplay={formatINR}
            />

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Tax Computation Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setUsePresumptive(true)}
                    className={`px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                      usePresumptive
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:bg-canvas"
                    }`}
                  >
                    Presumptive (44ADA)
                  </button>
                  <button
                    onClick={() => setUsePresumptive(false)}
                    className={`px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                      !usePresumptive
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:bg-canvas"
                    }`}
                  >
                    Normal (Actual Expenses)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  GST Registered?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setGstRegistered(true)}
                    className={`px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                      gstRegistered
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:bg-canvas"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setGstRegistered(false)}
                    className={`px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                      !gstRegistered
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:bg-canvas"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Income Tax"
              value={formatINR(result.finalTax)}
              ratingLabel={`${result.betterRegime} saves ${formatINR(result.taxSaving)}`}
              ratingType={result.effectiveRate < 15 ? "positive" : "neutral"}
              metrics={[
                { label: "Gross Income", value: formatINR(grossIncome) },
                {
                  label: "Taxable Income",
                  value: formatINR(result.taxableIncome),
                },
                { label: "New Regime Tax", value: formatINR(result.newTotal) },
                { label: "Old Regime Tax", value: formatINR(result.oldTotal) },
                { label: "Effective Rate", value: `${result.effectiveRate}%` },
                { label: "Net Payable", value: formatINR(result.netPayable) },
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
            Income Breakdown
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData
                    .filter((d) => d.value > 0)
                    .map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
              </PieChart>
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

        {/* Advance Tax Schedule */}
        <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Advance Tax Schedule
          </h3>
          {result.advanceTaxDue ? (
            <div className="space-y-3">
              {result.advanceSchedule.map((q) => (
                <div
                  key={q.date}
                  className="flex items-center justify-between p-2 bg-canvas rounded-sm"
                >
                  <div>
                    <p className="text-xs font-medium text-ink">
                      {q.date}
                    </p>
                    <p className="text-[11px] text-ink-60">
                      {q.percent}% cumulative
                    </p>
                  </div>
                  <p className="text-sm font-bold text-authority-green">
                    {formatINR(q.amount)}
                  </p>
                </div>
              ))}
              <p className="text-[11px] text-ink-60 mt-2">
                * Late payment attracts 1% per month interest under Section 234C
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-ink-60 p-3">
              <Calendar className="w-4 h-4 text-action-green" />
              <p>Tax liability under ₹10,000 — advance tax not required</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="freelancer-tax" variant="strip" />
      </div>
    </div>
  );
}
