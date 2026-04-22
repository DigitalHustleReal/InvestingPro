"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Home,
  MapPin,
  Info,
  ShieldCheck,
  Calculator,
  TrendingDown,
} from "lucide-react";
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

type CityType = "metro" | "non-metro";

export function HRACalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(18000);
  const [cityType, setCityType] = useState<CityType>("metro");

  const result = useMemo(() => {
    const annualBasic = basicSalary * 12;
    const annualHRA = hraReceived * 12;
    const annualRent = rentPaid * 12;
    const rule1 = annualHRA;
    const rule2 = annualBasic * (cityType === "metro" ? 0.5 : 0.4);
    const rule3 = Math.max(0, annualRent - annualBasic * 0.1);
    const exemption = Math.min(rule1, rule2, rule3);
    const taxableHRA = Math.max(0, annualHRA - exemption);
    const limitingRule = exemption === rule1 ? 1 : exemption === rule2 ? 2 : 3;
    return {
      annualBasic,
      annualHRA,
      annualRent,
      rule1,
      rule2,
      rule3,
      exemption,
      taxableHRA,
      limitingRule,
      taxSaved30: exemption * 0.3,
      taxSaved20: exemption * 0.2,
    };
  }, [basicSalary, hraReceived, rentPaid, cityType]);

  const scenarios = useMemo(() => {
    const calcExemption = (rent: number) => {
      const ab = basicSalary * 12;
      return Math.min(
        hraReceived * 12,
        ab * (cityType === "metro" ? 0.5 : 0.4),
        Math.max(0, rent * 12 - ab * 0.1),
      );
    };
    return [
      {
        label: "Current Rent",
        description: `₹${rentPaid.toLocaleString("en-IN")}/mo`,
        value: formatINR(calcExemption(rentPaid)),
        subtext: `Tax saved: ${formatINR(calcExemption(rentPaid) * 0.3)}`,
        type: "moderate" as const,
      },
      {
        label: "+₹5K Rent",
        description: `₹${(rentPaid + 5000).toLocaleString("en-IN")}/mo`,
        value: formatINR(calcExemption(rentPaid + 5000)),
        subtext: `Tax saved: ${formatINR(calcExemption(rentPaid + 5000) * 0.3)}`,
        type: "aggressive" as const,
      },
      {
        label: "−₹5K Rent",
        description: `₹${Math.max(0, rentPaid - 5000).toLocaleString("en-IN")}/mo`,
        value: formatINR(calcExemption(Math.max(0, rentPaid - 5000))),
        subtext: `Tax saved: ${formatINR(calcExemption(Math.max(0, rentPaid - 5000)) * 0.3)}`,
        type: "conservative" as const,
      },
    ];
  }, [basicSalary, hraReceived, rentPaid, cityType]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    const ruleNames = [
      "Actual HRA received",
      cityType === "metro" ? "50% of Basic" : "40% of Basic",
      "Rent − 10% of Basic",
    ];
    ins.push(
      `Rule ${result.limitingRule} (${ruleNames[result.limitingRule - 1]}) limits your exemption at ${formatINR(result.exemption)}/year.`,
    );
    if (result.limitingRule === 3 && rentPaid < basicSalary * 0.5) {
      ins.push(
        `Your rent is low relative to salary. Increasing rent by ₹${Math.round(basicSalary * 0.5 - rentPaid).toLocaleString("en-IN")}/mo would maximize exemption.`,
      );
    }
    if (result.limitingRule === 1) {
      ins.push(
        `Your actual HRA is the bottleneck. Ask employer to restructure salary with higher HRA component — this costs them nothing extra.`,
      );
    }
    ins.push(
      `HRA exemption is only in old regime. In new regime, this entire ${formatINR(result.exemption)} becomes taxable. Compare both regimes before choosing.`,
    );
    return ins;
  }, [result, rentPaid, basicSalary, cityType]);

  const pieData = [
    { name: "Tax-Exempt", value: result.exemption, color: "#166534" },
    ...(result.taxableHRA > 0
      ? [{ name: "Taxable", value: result.taxableHRA, color: "#dc2626" }]
      : []),
  ];

  const ruleComparison = [
    { label: "Actual HRA Received", value: result.rule1, rule: 1 },
    {
      label: `${cityType === "metro" ? "50%" : "40%"} of Basic`,
      value: result.rule2,
      rule: 2,
    },
    { label: "Rent − 10% of Basic", value: result.rule3, rule: 3 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            HRA Details
          </h2>
          <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 rounded-sm">
            {(["metro", "non-metro"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setCityType(type)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                  cityType === type
                    ? "bg-white text-authority-green shadow-sm"
                    : "text-ink-60 hover:text-ink",
                )}
              >
                {type === "metro" ? "Metro (50%)" : "Non-Metro (40%)"}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-ink-60 -mt-4 mb-5">
            Metro: Delhi, Mumbai, Chennai, Kolkata only.
          </p>
          <div className="space-y-6">
            <SliderInput
              label="Basic Salary (Monthly)"
              icon={IndianRupee}
              value={basicSalary}
              onChange={setBasicSalary}
              min={10000}
              max={500000}
              step={1000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="HRA Received (Monthly)"
              icon={Home}
              value={hraReceived}
              onChange={setHraReceived}
              min={0}
              max={200000}
              step={500}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Rent Paid (Monthly)"
              icon={MapPin}
              value={rentPaid}
              onChange={setRentPaid}
              min={0}
              max={200000}
              step={500}
              formatDisplay={formatINR}
            />
          </div>
          {rentPaid > 100000 && (
            <div className="mt-4 bg-indian-gold/10 border border-indian-gold/30 rounded-lg p-3 text-xs text-amber-800">
              <Info size={14} className="inline mr-1" /> Rent above ₹1,00,000/mo
              requires landlord&apos;s PAN.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <ResultCard
            title="Annual HRA Exemption"
            value={formatINR(result.exemption)}
            ratingLabel="Tax-free under Sec 10(13A)"
            ratingType="positive"
            metrics={[
              {
                label: "Monthly Exempt",
                value: formatINR(result.exemption / 12),
                highlight: true,
              },
              {
                label: "Monthly Taxable",
                value: formatINR(result.taxableHRA / 12),
              },
              {
                label: "Tax Saved (30%)",
                value: formatINR(result.taxSaved30),
                highlight: true,
              },
            ]}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      {/* Three-Rule Comparison — key differentiator for HRA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <Calculator size={15} className="text-action-green" /> Three-Rule
            Comparison (Lowest Wins)
          </h3>
          <div className="space-y-3">
            {ruleComparison.map((r) => (
              <div
                key={r.rule}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-sm border transition-all",
                  r.rule === result.limitingRule
                    ? "bg-action-green/10 border-green-300 ring-2 ring-green-100"
                    : "bg-white border-ink/5",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    r.rule === result.limitingRule
                      ? "bg-action-green text-white"
                      : "bg-gray-100 text-ink-60",
                  )}
                >
                  {r.rule}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ink">{r.label}</p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-base font-bold",
                      r.rule === result.limitingRule
                        ? "text-authority-green"
                        : "text-ink-60",
                    )}
                  >
                    {formatINR(r.value)}
                  </p>
                  {r.rule === result.limitingRule && (
                    <span className="text-[10px] text-action-green font-semibold">
                      LOWEST = EXEMPT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            HRA Split
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
                <span className="text-ink-60">{d.name}</span>
              </div>
            ))}
          </div>

          {/* Tax savings at different brackets */}
          <div className="mt-5 pt-4 border-t border-ink/5 space-y-3">
            <div className="bg-action-green/10 rounded-lg p-3 text-center">
              <p className="text-[10px] text-ink-60">30% bracket</p>
              <p className="text-xl font-bold text-authority-green">
                {formatINR(result.taxSaved30)}
                <span className="text-xs font-normal text-ink-60">/yr</span>
              </p>
            </div>
            <div className="bg-canvas rounded-sm p-3 text-center">
              <p className="text-[10px] text-ink-60">20% bracket</p>
              <p className="text-lg font-bold text-ink">
                {formatINR(result.taxSaved20)}
                <span className="text-xs font-normal text-ink-60">/yr</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
