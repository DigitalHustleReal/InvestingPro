"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Briefcase,
  Scale,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import {
  BarChart,
  Bar,
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
import { cn } from "@/lib/utils";

type EmployeeType = "private" | "govt";

export function GratuityCalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(10000);
  const [yearsOfService, setYearsOfService] = useState(10);
  const [employeeType, setEmployeeType] = useState<EmployeeType>("private");

  const calcGratuity = (salary: number, years: number, type: EmployeeType) => {
    const divisor = type === "govt" ? 30 : 26;
    return (15 * salary * years) / divisor;
  };

  const result = useMemo(() => {
    const lastDrawn = basicSalary + da;
    const raw = calcGratuity(lastDrawn, yearsOfService, employeeType);
    const maxGratuity = 2500000;
    const capped = Math.min(raw, maxGratuity);
    const isCapped = raw > maxGratuity;
    const taxExempt = Math.min(capped, maxGratuity);
    const taxable = Math.max(0, raw - taxExempt);

    const yearlyAccrual = [];
    for (
      let y = 5;
      y <= Math.min(yearsOfService, 40);
      y += yearsOfService > 20 ? 5 : yearsOfService > 10 ? 2 : 1
    ) {
      yearlyAccrual.push({
        year: `${y}Y`,
        gratuity: Math.min(
          calcGratuity(lastDrawn, y, employeeType),
          maxGratuity,
        ),
      });
    }
    // Always include final year
    if (
      yearlyAccrual.length === 0 ||
      yearlyAccrual[yearlyAccrual.length - 1].year !== `${yearsOfService}Y`
    ) {
      yearlyAccrual.push({
        year: `${yearsOfService}Y`,
        gratuity: Math.min(raw, maxGratuity),
      });
    }

    return {
      lastDrawn,
      raw,
      capped,
      isCapped,
      taxExempt,
      taxable,
      yearlyAccrual,
      monthlyEquiv: capped / yearsOfService / 12,
    };
  }, [basicSalary, da, yearsOfService, employeeType]);

  // What-If: different service periods
  const scenarios = useMemo(() => {
    const lastDrawn = basicSalary + da;
    const y10 = Math.min(calcGratuity(lastDrawn, 10, employeeType), 2500000);
    const y20 = Math.min(calcGratuity(lastDrawn, 20, employeeType), 2500000);
    const y30 = Math.min(calcGratuity(lastDrawn, 30, employeeType), 2500000);
    return [
      {
        label: "10 Years",
        description: "Mid-career switch",
        value: formatINR(y10),
        subtext: `${(y10 / lastDrawn).toFixed(1)} months salary`,
        type: "conservative" as const,
      },
      {
        label: "20 Years",
        description: "Senior role",
        value: formatINR(y20),
        subtext: `${(y20 / lastDrawn).toFixed(1)} months salary`,
        type: "moderate" as const,
      },
      {
        label: "30 Years",
        description: "Full career",
        value: formatINR(y30),
        subtext: `${(y30 / lastDrawn).toFixed(1)} months salary`,
        type: "aggressive" as const,
      },
    ];
  }, [basicSalary, da, employeeType]);

  // AI Insights
  const insights = useMemo(() => {
    const ins: string[] = [];
    const monthsEquiv = (result.capped / result.lastDrawn).toFixed(1);
    ins.push(
      `Your gratuity of ${formatINR(result.capped)} equals ${monthsEquiv} months of your last drawn salary.`,
    );
    if (yearsOfService < 20) {
      const future = Math.min(
        calcGratuity(result.lastDrawn, 20, employeeType),
        2500000,
      );
      ins.push(
        `Staying till 20 years would increase gratuity to ${formatINR(future)} — ${formatINR(future - result.capped)} more.`,
      );
    }
    if (result.isCapped) {
      ins.push(
        `Your actual gratuity is ${formatINR(result.raw)} but capped at ₹25L by law. The excess ${formatINR(result.raw - 2500000)} is taxable at your slab rate.`,
      );
    } else {
      ins.push(
        `Your gratuity is fully tax-free under Section 10(10) — no tax on ${formatINR(result.capped)}.`,
      );
    }
    return ins;
  }, [result, yearsOfService, employeeType]);

  const pieData = [
    { name: "Tax-Free", value: result.taxExempt, color: "#166534" },
    ...(result.taxable > 0
      ? [{ name: "Taxable", value: result.taxable, color: "#dc2626" }]
      : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top: Inputs + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Employee Details
          </h2>

          {/* Employee Type Toggle */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-sm">
            {(["private", "govt"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setEmployeeType(type)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                  employeeType === type
                    ? "bg-white text-authority-green shadow-sm"
                    : "text-ink-60 hover:text-ink",
                )}
              >
                {type === "private" ? "Private (÷26)" : "Government (÷30)"}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <SliderInput
              label="Basic Salary (Monthly)"
              icon={IndianRupee}
              value={basicSalary}
              onChange={setBasicSalary}
              min={5000}
              max={500000}
              step={1000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Dearness Allowance (DA)"
              icon={Briefcase}
              value={da}
              onChange={setDa}
              min={0}
              max={200000}
              step={500}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Years of Service"
              icon={Calendar}
              value={yearsOfService}
              onChange={setYearsOfService}
              min={5}
              max={40}
              step={1}
              suffix=" Yrs"
            />
          </div>

          <div className="mt-4 bg-indian-gold/10 border border-indian-gold/30 rounded-lg p-3 text-xs text-amber-800">
            <AlertTriangle size={14} className="inline mr-1" />
            <strong>Eligibility:</strong> Minimum 5 years of continuous service
            required under Payment of Gratuity Act, 1972.
          </div>
        </div>

        <div className="space-y-4">
          <ResultCard
            title="Your Gratuity Amount"
            value={formatINR(result.capped)}
            ratingLabel={
              result.isCapped
                ? `Capped (actual: ${formatINR(result.raw)})`
                : "Tax-Free"
            }
            ratingType={result.isCapped ? "neutral" : "positive"}
            metrics={[
              {
                label: "Last Drawn Salary",
                value: `${formatINR(result.lastDrawn)}/mo`,
              },
              { label: "Service Period", value: `${yearsOfService} Years` },
              {
                label: "Monthly Equivalent",
                value: `${formatINR(result.monthlyEquiv)}/mo`,
                highlight: true,
              },
            ]}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      {/* What-If */}
      <WhatIfScenarios scenarios={scenarios} />

      {/* Chart + Tax Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-4">
            Gratuity Growth by Service Years
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.yearlyAccrual}>
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
                  formatter={(value: any) => [
                    formatINR(Number(value)),
                    "Gratuity",
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="gratuity" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Tax Treatment
          </h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
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
          <div className="flex justify-center gap-5">
            {pieData.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 text-[11px]"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-ink-60">
                  {d.name}: {formatINR(d.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Formula */}
          <div className="mt-5 pt-4 border-t border-ink/5">
            <p className="text-xs font-semibold text-ink mb-2">Formula</p>
            <div className="bg-canvas rounded-sm p-3 text-center">
              <p className="text-sm font-mono text-ink">
                15 × Salary × Years / {employeeType === "govt" ? "30" : "26"}
              </p>
            </div>
            <p className="text-[10px] text-ink-60 mt-2">
              Max limit: ₹25,00,000 (2024 amendment).{" "}
              {employeeType === "govt"
                ? "Govt uses 30 (calendar days)."
                : "Private uses 26 (working days)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
