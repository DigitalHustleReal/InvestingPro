"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils/currency";
import { Gift, FileText, CheckCircle, Info } from "lucide-react";
import {
  calculateGratuity,
  GRATUITY_DEFAULTS,
  type GratuityInputs,
  type EmploymentType,
} from "@/lib/calculators/pension";

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string; desc: string }[] = [
  { value: "govt-central", label: "Central Govt", desc: "IAS/IPS/Railway/Defence civilian" },
  { value: "govt-state", label: "State Govt", desc: "State government employees" },
  { value: "private-covered", label: "Private (Act covered)", desc: "10+ employees, Gratuity Act applies" },
  { value: "private-uncovered", label: "Private (No Act)", desc: "Small firms, employer discretion" },
];

function SliderRow({
  label, value, min, max, step, onChange, format, hint,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string; hint?: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <div>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
          {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
        <span className="text-sm font-bold text-primary-600">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
      <div className="flex justify-between text-xs text-slate-400 mt-0.5">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "flex justify-between items-center py-2.5 px-3 rounded-lg",
      highlight ? "bg-primary-50 border border-primary-200" : "bg-slate-50 dark:bg-slate-800"
    )}>
      <span className={cn("text-sm", highlight ? "font-bold text-primary-700" : "text-slate-600 dark:text-slate-400")}>
        {label}
      </span>
      <span className={cn("font-bold text-right", highlight ? "text-primary-700" : "text-slate-900 dark:text-white")}>
        {value}
      </span>
    </div>
  );
}

export function GratuityCalculator() {
  const [inputs, setInputs] = useState<GratuityInputs>(GRATUITY_DEFAULTS);
  const set = (k: keyof GratuityInputs) => (v: number | EmploymentType) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => calculateGratuity(inputs), [inputs]);
  const isGovt = inputs.employmentType.startsWith("govt");

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Gratuity + Leave Encashment Calculator
              </CardTitle>
              <p className="text-sm text-slate-500">Retirement terminal benefits — all sectors</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Employment type */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Employment Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => set("employmentType")(t.value)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    inputs.employmentType === t.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  )}
                >
                  <p className={cn("text-sm font-semibold",
                    inputs.employmentType === t.value ? "text-primary-700" : "text-slate-800 dark:text-white"
                  )}>{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <SliderRow
              label="Basic + DA (₹/month)"
              hint="Last drawn basic salary + dearness allowance"
              value={inputs.basicSalary} min={15000} max={500000} step={2000}
              onChange={(v) => set("basicSalary")(v)} format={formatINR}
            />
            <SliderRow
              label="Years of Service"
              hint={inputs.employmentType === "private-covered" ? "Minimum 5 years required for gratuity" : "Completed years"}
              value={inputs.yearsOfService} min={1} max={40} step={1}
              onChange={(v) => set("yearsOfService")(v)} format={(v) => `${v} yrs`}
            />
            <SliderRow
              label="Earned Leave (EL) Balance"
              hint={isGovt ? "Max 300 days encashable at retirement" : "Days of EL available"}
              value={inputs.earnedLeaveDays} min={0} max={300} step={5}
              onChange={(v) => set("earnedLeaveDays")(v)} format={(v) => `${v} days`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gratuity */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary-600" />
              Gratuity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ResultRow label="Gross Gratuity" value={formatINR(r.gratuity)} />
            <ResultRow label="Tax-Exempt" value={formatINR(r.taxExemptGratuity)} />
            <ResultRow label="Taxable Amount" value={formatINR(r.taxableGratuity)} />
            <ResultRow label="Net Gratuity (Tax-free)" value={formatINR(r.taxExemptGratuity)} highlight />
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{r.gratuityNote}</p>
          </CardContent>
        </Card>

        {/* Leave Encashment */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Leave Encashment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ResultRow label="Gross Leave Pay" value={formatINR(r.leaveEncashment)} />
            <ResultRow label="Tax-Exempt" value={formatINR(r.taxExemptLeave)} />
            <ResultRow label="Taxable Amount" value={formatINR(r.taxableLeave)} />
            <ResultRow label="Net Leave Pay (Tax-free)" value={formatINR(r.taxExemptLeave)} highlight />
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{r.leaveNote}</p>
          </CardContent>
        </Card>
      </div>

      {/* Grand total */}
      <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Total Terminal Benefit", value: formatINR(r.totalBenefit) },
              { label: "Total Tax-Free", value: formatINR(r.totalTaxFree), sub: "in your pocket" },
              { label: "Total Taxable", value: formatINR(r.totalTaxable), sub: "add to income" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-primary-200 mb-1">{item.label}</p>
                <p className="text-xl font-bold text-white">{item.value}</p>
                {item.sub && <p className="text-xs text-primary-300 mt-0.5">{item.sub}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Things to Know</p>
          {[
            { icon: CheckCircle, text: "Gratuity is paid within 30 days of retirement — employer delay attracts interest at 10% p.a.", color: "text-green-500" },
            { icon: CheckCircle, text: "File Form I with your employer at retirement for gratuity claim. Use Appellate Authority if employer refuses.", color: "text-green-500" },
            { icon: Info, text: "Private sector leave encashment during service is fully taxable. Only at retirement/death is partial exemption available.", color: "text-blue-500" },
            { icon: Info, text: "Budget 2023 raised private sector leave encashment exemption limit to ₹25 lakh (from ₹3 lakh) — verify with your CA.", color: "text-blue-500" },
          ].map(({ icon: Icon, text, color }, i) => (
            <div key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", color)} />
              <span>{text}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400 text-center px-4">
        For educational purposes. Tax calculations depend on your income tax slab.
        Consult a CA for exact tax liability on gratuity and leave encashment.
      </p>
    </div>
  );
}
