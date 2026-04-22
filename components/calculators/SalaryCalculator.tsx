"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Briefcase,
  Home,
  Percent,
  ShieldCheck,
  Receipt,
  Building2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  formatINR,
} from "./shared/charts";
import { cn } from "@/lib/utils";

type TaxRegime = "old" | "new";

const calcTax = (taxable: number, regime: TaxRegime) => {
  let tax = 0;
  const slabs =
    regime === "new"
      ? [
          { l: 300000, r: 0 },
          { l: 700000, r: 0.05 },
          { l: 1000000, r: 0.1 },
          { l: 1200000, r: 0.15 },
          { l: 1500000, r: 0.2 },
          { l: Infinity, r: 0.3 },
        ]
      : [
          { l: 250000, r: 0 },
          { l: 500000, r: 0.05 },
          { l: 1000000, r: 0.2 },
          { l: Infinity, r: 0.3 },
        ];
  let rem = taxable,
    prev = 0;
  for (const s of slabs) {
    const a = Math.min(rem, s.l - prev);
    if (a <= 0) break;
    tax += a * s.r;
    rem -= a;
    prev = s.l;
  }
  const rebateLimit = regime === "new" ? 700000 : 500000;
  if (taxable <= rebateLimit) tax = 0;
  return tax;
};

export function SalaryCalculator() {
  const [annualCTC, setAnnualCTC] = useState(1200000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [hraPercent, setHraPercent] = useState(20);
  const [isMetro, setIsMetro] = useState(true);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("new");
  const [investments80C, setInvestments80C] = useState(150000);

  const result = useMemo(() => {
    const basic = annualCTC * (basicPercent / 100);
    const hra = annualCTC * (hraPercent / 100);
    const epfEmployee = basic * 0.12;
    const epfEmployer = basic * 0.12;
    const profTax = 2400;
    const gratuity = basic * 0.0481;
    const specialAllow = Math.max(
      0,
      annualCTC - basic - hra - epfEmployer - gratuity,
    );
    const grossSalary = annualCTC - epfEmployer - gratuity;

    const annualRent = monthlyRent * 12;
    const hraExemption =
      taxRegime === "old"
        ? Math.min(
            hra,
            basic * (isMetro ? 0.5 : 0.4),
            Math.max(0, annualRent - basic * 0.1),
          )
        : 0;

    let taxableIncome = grossSalary;
    if (taxRegime === "old") {
      taxableIncome -= 50000 + hraExemption + Math.min(investments80C, 150000);
    } else {
      taxableIncome -= 75000;
    }
    taxableIncome = Math.max(0, taxableIncome);

    const tax = calcTax(taxableIncome, taxRegime);
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const annualTakeHome = grossSalary - epfEmployee - profTax - totalTax;

    return {
      basic,
      hra,
      epfEmployee,
      epfEmployer,
      gratuity,
      specialAllow,
      grossSalary,
      profTax,
      hraExemption,
      taxableIncome,
      totalTax,
      annualTakeHome,
      monthlyTakeHome: annualTakeHome / 12,
      takeHomePct: (annualTakeHome / annualCTC) * 100,
    };
  }, [
    annualCTC,
    basicPercent,
    hraPercent,
    isMetro,
    monthlyRent,
    taxRegime,
    investments80C,
  ]);

  // Compare regimes
  const scenarios = useMemo(() => {
    const calcForRegime = (regime: TaxRegime) => {
      const basic = annualCTC * (basicPercent / 100);
      const hra = annualCTC * (hraPercent / 100);
      const epfEmp = basic * 0.12;
      const epfEr = basic * 0.12;
      const grat = basic * 0.0481;
      const gross = annualCTC - epfEr - grat;
      const annualRent = monthlyRent * 12;
      const hraEx =
        regime === "old"
          ? Math.min(
              hra,
              basic * (isMetro ? 0.5 : 0.4),
              Math.max(0, annualRent - basic * 0.1),
            )
          : 0;
      let taxable = gross;
      if (regime === "old")
        taxable -= 50000 + hraEx + Math.min(investments80C, 150000);
      else taxable -= 75000;
      taxable = Math.max(0, taxable);
      const tax = calcTax(taxable, regime);
      const total = tax + tax * 0.04;
      return gross - epfEmp - 2400 - total;
    };
    const newTH = calcForRegime("new");
    const oldTH = calcForRegime("old");
    const better = newTH >= oldTH ? "new" : "old";
    return [
      {
        label: "Old Regime",
        description: "HRA + 80C + 80D deductions",
        value: formatINR(oldTH / 12) + "/mo",
        subtext: `Annual: ${formatINR(oldTH)}`,
        type: (better === "old" ? "moderate" : "conservative") as any,
      },
      {
        label: "New Regime",
        description: "₹75K std deduction, lower slabs",
        value: formatINR(newTH / 12) + "/mo",
        subtext: `Annual: ${formatINR(newTH)}`,
        type: (better === "new" ? "moderate" : "conservative") as any,
      },
      {
        label: "Difference",
        description:
          better === "new" ? "New regime saves more" : "Old regime saves more",
        value: formatINR(Math.abs(newTH - oldTH)),
        subtext: `${better === "new" ? "New" : "Old"} wins by this much`,
        type: "aggressive" as const,
      },
    ];
  }, [
    annualCTC,
    basicPercent,
    hraPercent,
    isMetro,
    monthlyRent,
    investments80C,
  ]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `You take home ${result.takeHomePct.toFixed(0)}% of your CTC. The remaining ${(100 - result.takeHomePct).toFixed(0)}% goes to EPF (${formatINR(result.epfEmployee)}), tax (${formatINR(result.totalTax)}), and employer costs.`,
    );
    if (taxRegime === "old" && result.hraExemption > 0) {
      ins.push(
        `HRA exemption saves you ${formatINR(result.hraExemption * 0.3)}/year in tax. Without rent receipts, you'd pay this much more.`,
      );
    }
    if (annualCTC > 1500000) {
      ins.push(
        `At ${formatINR(annualCTC)} CTC, you're in the 30% bracket. Every ₹1L of deduction saves ₹31,200 (30% + 4% cess). Maximize 80C + NPS.`,
      );
    } else {
      ins.push(
        `Consider NPS for additional ₹50,000 deduction under Section 80CCD(1B) — saves ${formatINR(50000 * 0.2)} at 20% bracket.`,
      );
    }
    return ins;
  }, [result, taxRegime, annualCTC]);

  const pieData = [
    { name: "Take Home", value: result.annualTakeHome, color: "#166534" },
    { name: "Income Tax", value: result.totalTax, color: "#dc2626" },
    { name: "EPF (You)", value: result.epfEmployee, color: "#22c55e" },
    { name: "EPF (Employer)", value: result.epfEmployer, color: "#86efac" },
    { name: "Gratuity", value: result.gratuity, color: "#a3e635" },
    { name: "Prof. Tax", value: result.profTax, color: "#d97706" },
  ].filter((d) => d.value > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Salary Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Annual CTC"
              icon={IndianRupee}
              value={annualCTC}
              onChange={setAnnualCTC}
              min={300000}
              max={10000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <div className="grid grid-cols-2 gap-4">
              <SliderInput
                label="Basic %"
                icon={Percent}
                value={basicPercent}
                onChange={setBasicPercent}
                min={20}
                max={60}
                step={1}
                suffix="%"
              />
              <SliderInput
                label="HRA %"
                icon={Home}
                value={hraPercent}
                onChange={setHraPercent}
                min={0}
                max={50}
                step={1}
                suffix="%"
              />
            </div>

            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-sm">
              {(["new", "old"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTaxRegime(r)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    taxRegime === r
                      ? "bg-white text-authority-green shadow-sm"
                      : "text-ink-60 hover:text-ink",
                  )}
                >
                  {r === "new" ? "New Regime" : "Old Regime"}
                </button>
              ))}
            </div>

            {taxRegime === "old" && (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-ink-60 flex items-center gap-1.5">
                    <Building2 size={14} className="text-action-green" /> Metro
                    City?
                  </label>
                  <Switch checked={isMetro} onCheckedChange={setIsMetro} />
                </div>
                <SliderInput
                  label="Monthly Rent"
                  icon={Home}
                  value={monthlyRent}
                  onChange={setMonthlyRent}
                  min={0}
                  max={100000}
                  step={500}
                  formatDisplay={formatINR}
                />
                <SliderInput
                  label="80C Investments"
                  icon={ShieldCheck}
                  value={investments80C}
                  onChange={setInvestments80C}
                  min={0}
                  max={150000}
                  step={5000}
                  formatDisplay={formatINR}
                />
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <ResultCard
            title="Monthly In-Hand Salary"
            value={formatINR(result.monthlyTakeHome)}
            ratingLabel={`${result.takeHomePct.toFixed(0)}% of CTC`}
            ratingType={
              result.takeHomePct >= 70
                ? "positive"
                : result.takeHomePct >= 60
                  ? "neutral"
                  : "negative"
            }
            metrics={[
              { label: "Annual CTC", value: formatINR(annualCTC) },
              {
                label: "Annual Take-Home",
                value: formatINR(result.annualTakeHome),
                highlight: true,
              },
              { label: "Total Tax", value: formatINR(result.totalTax) },
            ]}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Table */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3 flex items-center gap-2">
            <Receipt size={15} className="text-action-green" /> Complete Salary
            Breakdown
          </h3>
          <div className="space-y-1 text-sm">
            <div className="bg-action-green/10 rounded-lg p-2.5 flex justify-between font-semibold">
              <span>Annual CTC</span>
              <span>{formatINR(annualCTC)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5">
              <span className="text-ink-60">Basic ({basicPercent}%)</span>
              <span>{formatINR(result.basic)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5">
              <span className="text-ink-60">HRA ({hraPercent}%)</span>
              <span>{formatINR(result.hra)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5">
              <span className="text-ink-60">Special Allowance</span>
              <span>{formatINR(result.specialAllow)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 text-ink-60">
              <span>(-) Employer EPF</span>
              <span>-{formatINR(result.epfEmployer)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 text-ink-60">
              <span>(-) Gratuity</span>
              <span>-{formatINR(result.gratuity)}</span>
            </div>
            <div className="bg-canvas rounded-sm p-2.5 flex justify-between font-semibold mt-2">
              <span>Gross Salary</span>
              <span>{formatINR(result.grossSalary)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 text-red-600">
              <span>(-) Employee EPF</span>
              <span>-{formatINR(result.epfEmployee)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 text-red-600">
              <span>(-) Professional Tax</span>
              <span>-{formatINR(result.profTax)}</span>
            </div>
            <div className="flex justify-between py-1.5 px-2.5 text-red-600">
              <span>(-) Income Tax + Cess</span>
              <span>-{formatINR(result.totalTax)}</span>
            </div>
            <div className="bg-action-green text-white rounded-lg p-3 flex justify-between font-bold text-base mt-2">
              <span>Monthly In-Hand</span>
              <span>{formatINR(result.monthlyTakeHome)}</span>
            </div>
          </div>
        </div>

        {/* CTC Pie */}
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Where CTC Goes
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatINR(Number(value))}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1 text-[10px]">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-ink-60">
                  {d.name} ({((d.value / annualCTC) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
