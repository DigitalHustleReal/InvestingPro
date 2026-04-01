"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils/currency";
import { Building2, TrendingUp, Shield, CheckCircle, Info, Scale } from "lucide-react";
import {
  calculateGovtPension,
  GOVT_PENSION_DEFAULTS,
  type GovtPensionInputs,
} from "@/lib/calculators/pension";

const PAY_LEVELS: { level: string; basicPay: number }[] = [
  { level: "Level 1 (MTS/Peon)", basicPay: 18000 },
  { level: "Level 2", basicPay: 19900 },
  { level: "Level 3", basicPay: 21700 },
  { level: "Level 4", basicPay: 25500 },
  { level: "Level 5", basicPay: 29200 },
  { level: "Level 6 (Graduate/SSC-CGL)", basicPay: 35400 },
  { level: "Level 7 (SSC/CHSL)", basicPay: 44900 },
  { level: "Level 8", basicPay: 47600 },
  { level: "Level 9", basicPay: 53100 },
  { level: "Level 10 (Group A/IAS entry)", basicPay: 56100 },
  { level: "Level 11", basicPay: 67700 },
  { level: "Level 12", basicPay: 78800 },
  { level: "Level 13 (Director)", basicPay: 123100 },
  { level: "Level 14 (Joint Secretary)", basicPay: 144200 },
  { level: "Level 15 (Additional Secretary)", basicPay: 182200 },
  { level: "Level 16 (Secretary)", basicPay: 205400 },
];

function SliderRow({
  label, value, min, max, step, onChange, format,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
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

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={cn("text-lg font-bold", accent ?? "text-slate-900 dark:text-white")}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export function GovtPensionCalculator() {
  const [inputs, setInputs] = useState<GovtPensionInputs>(GOVT_PENSION_DEFAULTS);
  const set = (k: keyof GovtPensionInputs) => (v: number | string) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => calculateGovtPension(inputs), [inputs]);
  const opsLumpSum = r.ops.commutedAmount + r.ops.gratuityAmount;
  const npsLumpSum = r.nps.lumpSumAmount + r.nps.gratuityAmount;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Government Pension Calculator
              </CardTitle>
              <p className="text-sm text-slate-500">OPS vs NPS — 7th Pay Commission</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Pay Level picker */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Pay Level (7th CPC)
            </label>
            <select
              value={inputs.basicPay}
              onChange={(e) => set("basicPay")(Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 dark:border-slate-700"
            >
              {PAY_LEVELS.map((l) => (
                <option key={l.level} value={l.basicPay}>
                  {l.level} — ₹{l.basicPay.toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <SliderRow label="DA %" value={inputs.daPercent} min={0} max={100} step={1}
              onChange={(v) => set("daPercent")(v)} format={(v) => `${v}%`} />
            <SliderRow label="Years of Service" value={inputs.yearsOfService} min={10} max={35} step={1}
              onChange={(v) => set("yearsOfService")(v)} format={(v) => `${v} yrs`} />
            <SliderRow label="Current Age" value={inputs.currentAge} min={22} max={55} step={1}
              onChange={(v) => set("currentAge")(v)} format={(v) => `${v} yrs`} />
            <SliderRow label="Commutation %" value={inputs.commutationPct} min={0} max={40} step={5}
              onChange={(v) => set("commutationPct")(v)} format={(v) => `${v}%`} />
            <SliderRow label="NPS Expected Return" value={inputs.expectedReturnPct} min={6} max={15} step={0.5}
              onChange={(v) => set("expectedReturnPct")(v)} format={(v) => `${v}%`} />
            <SliderRow label="Annuity Rate" value={inputs.annuityRatePct} min={4} max={9} step={0.25}
              onChange={(v) => set("annuityRatePct")(v)} format={(v) => `${v}%`} />
          </div>
        </CardContent>
      </Card>

      {/* OPS vs NPS Side-by-Side */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* OPS */}
        <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950 rounded-2xl shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-700" />
              <CardTitle className="text-lg font-bold text-green-900 dark:text-green-100">
                OPS — Old Pension Scheme
              </CardTitle>
            </div>
            <p className="text-xs text-green-700">Defined Benefit — Government guaranteed</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Basic Pension" value={formatINR(r.ops.reducedPension)} sub="/month" accent="text-green-700" />
              <StatCard label="With DA" value={formatINR(r.ops.totalMonthlyPension)} sub="/month" accent="text-green-700" />
              <StatCard label="After Commutation" value={formatINR(r.ops.reducedPensionAfterCommute)} sub="/month" />
              <StatCard label="Family Pension" value={formatINR(r.ops.familyPension)} sub="/month" />
            </div>
            <div className="border-t border-green-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-800">Commuted Lump Sum</span>
                <span className="font-bold text-green-900">{formatINR(r.ops.commutedAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-800">Retirement Gratuity</span>
                <span className="font-bold text-green-900">{formatINR(r.ops.gratuityAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-green-200 pt-2">
                <span className="text-green-800">Total Lump Sum</span>
                <span className="text-green-900">{formatINR(opsLumpSum)}</span>
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-3 text-xs text-green-800 space-y-1">
              <p className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> CGHS medical coverage for life</p>
              <p className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> DA revised twice a year (keeps pace with inflation)</p>
              <p className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Pension continues for spouse after death</p>
            </div>
          </CardContent>
        </Card>

        {/* NPS */}
        <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950 rounded-2xl shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <CardTitle className="text-lg font-bold text-blue-900 dark:text-blue-100">
                NPS — New Pension Scheme
              </CardTitle>
            </div>
            <p className="text-xs text-blue-700">Defined Contribution — market-linked</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Monthly Pension" value={formatINR(r.nps.monthlyPension)} sub="/month" accent="text-blue-700" />
              <StatCard label="NPS Corpus" value={formatINR(r.nps.totalCorpus)} sub="total" accent="text-blue-700" />
              <StatCard label="Tax-free Lump Sum" value={formatINR(r.nps.lumpSumAmount)} sub="60% of corpus" />
              <StatCard label="Annuity Corpus" value={formatINR(r.nps.annuityCorpus)} sub="40% mandatory" />
            </div>
            <div className="border-t border-blue-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-800">Tax-free Lump Sum</span>
                <span className="font-bold text-blue-900">{formatINR(r.nps.lumpSumAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-800">Retirement Gratuity</span>
                <span className="font-bold text-blue-900">{formatINR(r.nps.gratuityAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-blue-200 pt-2">
                <span className="text-blue-800">Total Lump Sum</span>
                <span className="text-blue-900">{formatINR(npsLumpSum)}</span>
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3 text-xs text-blue-800 space-y-1">
              <p className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Pension amount depends on market returns</p>
              <p className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Higher lump sum potential</p>
              <p className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Annuity income is taxable (unlike OPS partially exempt)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verdict */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-600" /> OPS vs NPS — Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard
              label="Monthly Income (OPS)"
              value={formatINR(r.ops.totalMonthlyPension)}
              accent={r.comparison.monthlyIncomeAdvantage === "OPS" ? "text-green-600" : undefined}
            />
            <StatCard
              label="Monthly Income (NPS)"
              value={formatINR(r.nps.totalMonthlyIncome)}
              accent={r.comparison.monthlyIncomeAdvantage === "NPS" ? "text-blue-600" : undefined}
            />
            <StatCard
              label="Lump Sum (OPS)"
              value={formatINR(opsLumpSum)}
              accent={r.comparison.lumpSumAdvantage === "OPS" ? "text-green-600" : undefined}
            />
            <StatCard
              label="Lump Sum (NPS)"
              value={formatINR(npsLumpSum)}
              accent={r.comparison.lumpSumAdvantage === "NPS" ? "text-blue-600" : undefined}
            />
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <p className="font-semibold mb-1">InvestingPro Analysis</p>
            <p>{r.comparison.verdict}</p>
            <p className="mt-2 text-xs text-amber-700">
              Key consideration: OPS provides guaranteed inflation-linked income (via DA revision).
              NPS provides higher lump sum but pension depends on annuity rates at retirement.
              For risk-averse employees: OPS. For those who can manage a corpus: NPS.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400 text-center px-4">
        Based on 7th Pay Commission rules. DA rate changes every 6 months — current value used.
        This is for educational purposes only — consult your Pay & Accounts Office for exact figures.
      </p>
    </div>
  );
}
