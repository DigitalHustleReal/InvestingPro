"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils/currency";
import { Briefcase, CheckCircle, AlertTriangle, Info } from "lucide-react";
import {
  calculateEPS95,
  EPS95_DEFAULTS,
  type EPS95Inputs,
} from "@/lib/calculators/pension";

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

export function EPS95Calculator() {
  const [inputs, setInputs] = useState<EPS95Inputs>(EPS95_DEFAULTS);
  const set = (k: keyof EPS95Inputs) => (v: number | boolean) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => calculateEPS95(inputs), [inputs]);

  return (
    <div className="space-y-6">
      {/* Explainer */}
      <Card className="border border-blue-200 bg-blue-50 rounded-2xl">
        <CardContent className="p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 space-y-1">
            <p className="font-semibold">What is EPS-95?</p>
            <p className="text-xs leading-relaxed">
              Employee Pension Scheme 1995 is mandatory for all employees earning up to ₹15,000/month
              (basic + DA) enrolled in EPFO. Employer contributes 8.33% of basic pay (capped at ₹1,250/month)
              to EPS. After 10 years of contribution, you get a monthly pension for life.
            </p>
            <p className="text-xs font-semibold mt-1">
              2022 Supreme Court ruling: Employees can opt for higher pension based on actual basic
              salary instead of the ₹15,000 cap — but must pay the difference in contributions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                EPS-95 Pension Calculator
              </CardTitle>
              <p className="text-sm text-slate-500">Employee Pension Scheme — Private Sector EPFO</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <SliderRow
              label="Current Basic + DA"
              hint="Your full basic salary + dearness allowance"
              value={inputs.basicSalary} min={10000} max={200000} step={1000}
              onChange={(v) => set("basicSalary")(v)} format={formatINR}
            />
            <div>
              <div className="flex justify-between mb-1.5">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Pensionable Salary
                  </label>
                  <p className="text-xs text-slate-400">
                    {inputs.higherPensionOption ? "Actual salary (higher pension)" : "Capped at ₹15,000 (standard)"}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary-600">{formatINR(inputs.pensionableSalary)}</span>
              </div>
              <input type="range" min={6500} max={inputs.basicSalary} step={500}
                value={inputs.pensionableSalary}
                onChange={(e) => set("pensionableSalary")(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600" />
            </div>
            <SliderRow
              label="Total EPS-Covered Service"
              hint="Years contributing to EPFO under EPS"
              value={inputs.yearsOfService} min={1} max={35} step={1}
              onChange={(v) => set("yearsOfService")(v)} format={(v) => `${v} yrs`}
            />
            <SliderRow
              label="Service Before Nov 1995"
              hint="Years worked before EPS-95 started (past service)"
              value={inputs.pastServiceBefore1995} min={0} max={25} step={1}
              onChange={(v) => set("pastServiceBefore1995")(v)} format={(v) => `${v} yrs`}
            />
          </div>

          {/* Higher pension toggle */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <button
              onClick={() => set("higherPensionOption")(!inputs.higherPensionOption)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5",
                inputs.higherPensionOption ? "bg-amber-500" : "bg-slate-300"
              )}
            >
              <span className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                inputs.higherPensionOption && "translate-x-5"
              )} />
            </button>
            <div>
              <p className="text-sm font-semibold text-amber-800">Higher Pension Option (2022 Supreme Court)</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Enables pension on actual basic salary instead of ₹15,000 cap.
                Requires paying arrears of employer contribution difference to EPFO.
                Deadline to apply has passed — check with EPFO for current status.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4 animate-in fade-in duration-300">
        {!r.eligibility ? (
          <Card className="border-amber-200 bg-amber-50 rounded-2xl shadow-md">
            <CardContent className="p-6 flex gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-900">Not eligible for pension yet</p>
                <p className="text-sm text-amber-800 mt-1">{r.minimumPensionNote}</p>
                {r.withdrawalAmount > 0 && (
                  <p className="text-sm text-amber-800 mt-2">
                    EPS withdrawal amount: <span className="font-bold">{formatINR(r.withdrawalAmount)}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "EPS Pension", value: formatINR(r.monthlyPension), sub: "/month", accent: "text-primary-600" },
                    { label: "Past Service Pension", value: formatINR(r.pastServicePension), sub: "/month (pre-1995)" },
                    { label: "Total Monthly Pension", value: formatINR(r.totalMonthlyPension), sub: "/month for life", accent: "text-green-600" },
                    { label: "Family Pension (Spouse)", value: formatINR(r.familyPension), sub: "50% after death" },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                      <p className={cn("text-lg font-bold", item.accent ?? "text-slate-900 dark:text-white")}>{item.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                    </div>
                  ))}
                </div>

                {inputs.higherPensionOption && r.higherPensionBenefit > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-amber-800 font-medium">Extra from Higher Pension Option</span>
                    <span className="font-bold text-amber-700">+{formatINR(r.higherPensionBenefit)}/month</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Key Facts</p>
                <div className="space-y-2">
                  {[
                    { icon: CheckCircle, text: r.minimumPensionNote, color: "text-green-500" },
                    { icon: Info, text: r.taxNote, color: "text-blue-500" },
                    { icon: Info, text: "Pension starts from age 58 (or 50 for early pension at lower rate). You can defer to 60 for higher amount.", color: "text-blue-500" },
                    { icon: CheckCircle, text: "Nominate family members via Form 2 — ensures family pension without delay.", color: "text-green-500" },
                  ].map(({ icon: Icon, text, color }, i) => (
                    <div key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", color)} />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center px-4">
        EPS-95 calculations use EPFO formula: (Pensionable Salary × Pensionable Service) / 70.
        For exact pension statement, log in to EPFO Member Portal or use UAN portal.
      </p>
    </div>
  );
}
