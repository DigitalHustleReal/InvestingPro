"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Percent,
  FileText,
  AlertTriangle,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  formatINR,
} from "./shared/charts";
import { cn } from "@/lib/utils";

type IncomeType =
  | "salary"
  | "fd"
  | "rent"
  | "professional"
  | "commission"
  | "lottery";

const SECTIONS = [
  {
    code: "192",
    name: "Salary",
    type: "salary" as const,
    rate: 0,
    noPan: 20,
    threshold: 250000,
    desc: "TDS on salary — slab rate by employer",
  },
  {
    code: "194A",
    name: "FD/RD Interest",
    type: "fd" as const,
    rate: 10,
    noPan: 20,
    threshold: 40000,
    seniorThreshold: 50000,
    desc: "TDS on bank deposit interest",
  },
  {
    code: "194I",
    name: "Rent",
    type: "rent" as const,
    rate: 10,
    noPan: 20,
    threshold: 240000,
    desc: "TDS on rent (10% building, 2% machinery)",
  },
  {
    code: "194J",
    name: "Professional",
    type: "professional" as const,
    rate: 10,
    noPan: 20,
    threshold: 30000,
    desc: "TDS on professional/technical fees",
  },
  {
    code: "194H",
    name: "Commission",
    type: "commission" as const,
    rate: 5,
    noPan: 20,
    threshold: 15000,
    desc: "TDS on commission/brokerage",
  },
  {
    code: "194B",
    name: "Lottery",
    type: "lottery" as const,
    rate: 30,
    noPan: 30,
    threshold: 10000,
    desc: "TDS on lottery/game winnings",
  },
];

export function TDSCalculator() {
  const [selectedType, setSelectedType] = useState<IncomeType>("fd");
  const [amount, setAmount] = useState(500000);
  const [hasPAN, setHasPAN] = useState(true);
  const [isSenior, setIsSenior] = useState(false);
  const [hasForm15G, setHasForm15G] = useState(false);

  const section = SECTIONS.find((s) => s.type === selectedType)!;

  const result = useMemo(() => {
    const threshold =
      isSenior && section.seniorThreshold
        ? section.seniorThreshold
        : section.threshold;
    if (hasForm15G && (selectedType === "fd" || selectedType === "rent"))
      return {
        tds: 0,
        rate: 0,
        net: amount,
        exempt: true,
        reason: "Form 15G/15H submitted",
      };
    if (amount <= threshold && selectedType !== "salary")
      return {
        tds: 0,
        rate: 0,
        net: amount,
        exempt: true,
        reason: `Below ₹${threshold.toLocaleString("en-IN")} threshold`,
      };

    const r = hasPAN ? section.rate : section.noPan;
    let tds: number;
    if (selectedType === "salary") {
      let tax = 0;
      const taxable = Math.max(0, amount - 75000);
      const slabs = [
        { l: 300000, r: 0 },
        { l: 700000, r: 5 },
        { l: 1000000, r: 10 },
        { l: 1200000, r: 15 },
        { l: 1500000, r: 20 },
        { l: Infinity, r: 30 },
      ];
      let rem = taxable,
        prev = 0;
      for (const s of slabs) {
        const a = Math.min(rem, s.l - prev);
        if (a <= 0) break;
        tax += a * (s.r / 100);
        rem -= a;
        prev = s.l;
      }
      if (taxable <= 700000) tax = 0;
      tds = tax + tax * 0.04;
    } else {
      tds = amount * (r / 100);
    }

    return {
      tds,
      rate: amount > 0 ? (tds / amount) * 100 : 0,
      net: amount - tds,
      exempt: false,
      reason: "",
    };
  }, [amount, selectedType, hasPAN, isSenior, hasForm15G, section]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.exempt) {
      ins.push(
        `No TDS deducted — ${result.reason}. You still need to report this income in ITR.`,
      );
    } else {
      ins.push(
        `${formatINR(result.tds)} will be deducted as TDS under Section ${section.code}. You receive ${formatINR(result.net)}.`,
      );
    }
    if (selectedType === "fd" && !hasForm15G) {
      ins.push(
        `Submit Form ${isSenior ? "15H" : "15G"} to your bank at the start of financial year if total income is below taxable limit. This stops TDS entirely.`,
      );
    }
    if (!hasPAN) {
      ins.push(
        `Without PAN, TDS jumps to 20% regardless of section. Submit PAN to deductor immediately to get the normal ${section.rate}% rate.`,
      );
    }
    if (selectedType === "salary" && amount > 1500000) {
      ins.push(
        `At ${formatINR(amount)} salary, you're in 30% bracket. Declare HRA, 80C, NPS to employer before January to reduce monthly TDS.`,
      );
    }
    return ins;
  }, [result, selectedType, section, hasPAN, isSenior, hasForm15G, amount]);

  const pieData = [
    { name: "Net Amount", value: Math.max(0, result.net), color: "#166534" },
    ...(result.tds > 0
      ? [{ name: "TDS Deducted", value: result.tds, color: "#dc2626" }]
      : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            TDS Details
          </h2>

          {/* Section selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {SECTIONS.map((s) => (
              <button
                key={s.type}
                onClick={() => setSelectedType(s.type)}
                className={cn(
                  "px-3 py-2.5 rounded-sm text-xs font-medium transition-all border text-left",
                  selectedType === s.type
                    ? "bg-action-green text-white border-green-600"
                    : "bg-white text-ink-60 border-ink/10 hover:border-green-300",
                )}
              >
                <div className="font-semibold">{s.name}</div>
                <div
                  className={cn(
                    "text-[10px]",
                    selectedType === s.type
                      ? "text-green-100"
                      : "text-ink-60",
                  )}
                >
                  Sec {s.code} · {s.rate}%
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-5">
            <SliderInput
              label={
                selectedType === "salary" ? "Annual Salary" : "Payment Amount"
              }
              icon={IndianRupee}
              value={amount}
              onChange={setAmount}
              min={selectedType === "salary" ? 300000 : 10000}
              max={selectedType === "salary" ? 10000000 : 5000000}
              step={selectedType === "salary" ? 10000 : 5000}
              formatDisplay={formatINR}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2 mt-5">
            <div className="flex items-center justify-between p-3 bg-canvas rounded-sm">
              <span className="text-sm text-ink">PAN submitted?</span>
              <button
                onClick={() => setHasPAN(!hasPAN)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  hasPAN
                    ? "bg-action-green/20 text-authority-green"
                    : "bg-red-100 text-red-700",
                )}
              >
                {hasPAN ? "Yes" : "No (20% TDS)"}
              </button>
            </div>
            {selectedType === "fd" && (
              <>
                <div className="flex items-center justify-between p-3 bg-canvas rounded-sm">
                  <span className="text-sm text-ink">
                    Senior Citizen (60+)?
                  </span>
                  <button
                    onClick={() => setIsSenior(!isSenior)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      isSenior
                        ? "bg-action-green/20 text-authority-green"
                        : "bg-gray-200 text-ink-60",
                    )}
                  >
                    {isSenior ? "Yes (₹50K limit)" : "No (₹40K limit)"}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-canvas rounded-sm">
                  <span className="text-sm text-ink">
                    Form 15G/15H submitted?
                  </span>
                  <button
                    onClick={() => setHasForm15G(!hasForm15G)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      hasForm15G
                        ? "bg-action-green/20 text-authority-green"
                        : "bg-gray-200 text-ink-60",
                    )}
                  >
                    {hasForm15G ? "Yes (No TDS)" : "No"}
                  </button>
                </div>
              </>
            )}
          </div>

          {!hasPAN && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
              <AlertTriangle size={14} className="inline mr-1" /> Without PAN,
              TDS is 20% on everything. Submit PAN immediately.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <ResultCard
            title={`TDS (Section ${section.code})`}
            value={result.exempt ? "₹0" : formatINR(result.tds)}
            ratingLabel={
              result.exempt
                ? result.reason
                : `Effective: ${result.rate.toFixed(1)}%`
            }
            ratingType={result.exempt ? "positive" : "negative"}
            className={
              result.exempt
                ? undefined
                : "from-red-50 via-orange-50 to-red-100 border-red-200"
            }
            metrics={[
              { label: "Gross Amount", value: formatINR(amount) },
              { label: "TDS Deducted", value: formatINR(result.tds) },
              {
                label: "Net You Receive",
                value: formatINR(result.net),
                highlight: true,
              },
            ]}
          />
          <AIInsight insights={insights} />

          {/* Section info */}
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 text-sm text-blue-800">
            <FileText size={14} className="inline mr-1" />
            <strong>Sec {section.code}:</strong> {section.desc}. Rate:{" "}
            {section.rate}% (with PAN) / {section.noPan}% (without). Threshold:
            ₹{section.threshold.toLocaleString("en-IN")}/yr.
          </div>
        </div>
      </div>

      {/* TDS Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            TDS Rate Card — All Sections
          </h3>
          <div className="space-y-2">
            {SECTIONS.map((s) => (
              <div
                key={s.code}
                className={cn(
                  "flex items-center justify-between py-2.5 px-3 rounded-lg text-xs",
                  s.type === selectedType
                    ? "bg-action-green/10 border border-green-200"
                    : "hover:bg-canvas",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink w-12">
                    Sec {s.code}
                  </span>
                  <span className="text-ink-60">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-authority-green">{s.rate}%</span>
                  <span className="text-ink/20">|</span>
                  <span className="font-semibold text-red-600">{s.noPan}%</span>
                  <span className="text-ink/20">|</span>
                  <span className="text-ink-60">
                    ₹{s.threshold.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
            <div className="text-[10px] text-ink-60 text-center mt-2">
              With PAN | Without PAN | Annual Threshold
            </div>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Payment Split
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
        </div>
      </div>
    </div>
  );
}
