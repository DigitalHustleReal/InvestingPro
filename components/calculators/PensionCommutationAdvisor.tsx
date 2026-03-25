"use client";

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import {
  calculateCommutationCore,
  project30Years,
  buildInvestmentScenarios,
  calculateSmartScore,
  type CommutationInputs,
  type SmartScoreInputs,
  type CommutationTable,
} from "@/lib/calculators/pension-commutation";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const fmtL = (n: number) => {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  return `₹${fmt(n)}`;
};

const fmtM = (n: number) => `₹${fmt(n)}/mo`;

// ─── Default inputs ────────────────────────────────────────────────────────────

const DEFAULT_INPUTS: CommutationInputs = {
  basicPension: 50000,
  commutationPct: 40,
  retirementAge: 60,
  currentDAPercent: 50,
  commutationTable: "post2008",
  daGrowthRatePA: 4,
  cpcYearFromNow: 2,
  fitmentFactor: 2.2,
  expectedLifeYears: 30,
  investmentReturnPct: 8.2,
};

const DEFAULT_SCORE_INPUTS: SmartScoreInputs = {
  moneyUse: "safe-invest",
  healthStatus: "good",
  cpcProximity: "moderate",
  investmentDiscipline: "medium",
  existingLiabilities: "light",
  familyDependents: "some",
  retirementCorpusSufficiency: "adequate",
  yearsToRetirement: 0,
};

// ─── Reusable slider row ───────────────────────────────────────────────────────

function SliderRow({
  label, value, min, max, step = 1, suffix = "",
  onChange,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; suffix?: string; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <Label className="text-sm text-slate-700 dark:text-slate-300">{label}</Label>
        <span className="text-sm font-bold text-primary">{value}{suffix}</span>
      </div>
      <Slider
        min={min} max={max} step={step} value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="accent-primary"
      />
    </div>
  );
}

// ─── Tab 1: Core Calculator ────────────────────────────────────────────────────

function CoreTab({ inputs, onChange }: {
  inputs: CommutationInputs;
  onChange: (k: keyof CommutationInputs, v: number | string) => void;
}) {
  const core = useMemo(() => calculateCommutationCore(inputs), [inputs]);

  const breakeven = core.daAdjustedBreakevenMonths;
  const breakevenYrs = (breakeven / 12).toFixed(1);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Pension Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderRow
            label="Basic Pension (₹/month)"
            value={inputs.basicPension} min={10000} max={300000} step={1000}
            onChange={(v) => onChange("basicPension", v)}
          />
          <SliderRow
            label="Commutation %" suffix="%"
            value={inputs.commutationPct} min={0} max={40}
            onChange={(v) => onChange("commutationPct", v)}
          />
          <SliderRow
            label="Retirement Age" suffix=" yrs"
            value={inputs.retirementAge} min={56} max={63}
            onChange={(v) => onChange("retirementAge", v)}
          />
          <SliderRow
            label="DA at Retirement" suffix="%"
            value={inputs.currentDAPercent} min={0} max={120}
            onChange={(v) => onChange("currentDAPercent", v)}
          />
          <SliderRow
            label="Investment Return (lump sum)" suffix="%"
            value={inputs.investmentReturnPct} min={3} max={15} step={0.1}
            onChange={(v) => onChange("investmentReturnPct", v)}
          />

          <div className="space-y-1.5">
            <Label className="text-sm text-slate-700 dark:text-slate-300">Commutation Factor Table</Label>
            <Select
              value={inputs.commutationTable}
              onValueChange={(v) => onChange("commutationTable", v as CommutationTable)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post2008">Post-2008 (Central Govt CPDA — current)</SelectItem>
                <SelectItem value="pre2008">Pre-2008 (Some state govts)</SelectItem>
                <SelectItem value="6cpc">6th CPC Era (older references)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {/* Lump sum */}
        <Card className="border-0 shadow-md bg-green-50 dark:bg-green-950">
          <CardContent className="pt-5">
            <p className="text-sm text-green-700 dark:text-green-400 font-semibold mb-1">Lump Sum Received</p>
            <p className="text-4xl font-bold text-green-800 dark:text-green-300">{fmtL(core.commutedLumpSum)}</p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              Factor: {core.factor} × ₹{fmt(core.commutedPortion)}/mo × 12
            </p>
          </CardContent>
        </Card>

        {/* Monthly impact */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 mb-1">Full Pension</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{fmtM(core.fullPensionMonthly)}</p>
              <p className="text-xs text-slate-400">(basic + DA)</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-950">
            <CardContent className="pt-4">
              <p className="text-xs text-red-600 mb-1">After Commutation</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">{fmtM(core.reducedPensionMonthly)}</p>
              <p className="text-xs text-red-400">Monthly loss: {fmtM(core.monthlyLossNow)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Breakeven */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Nominal Breakeven</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {Math.round(core.nominalBreakevenMonths / 12)} yrs {core.nominalBreakevenMonths % 12} mo
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">DA-adjusted Breakeven</span>
              <span className="font-bold text-amber-600">{breakevenYrs} yrs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Required Return on Lump Sum</span>
              <span className="font-bold text-slate-800 dark:text-white">{core.requiredReturnToBreakEven}% p.a.</span>
            </div>
          </CardContent>
        </Card>

        {/* Investment coverage */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 mb-2">
              Investment income at <strong>{inputs.investmentReturnPct}%</strong>:
              <span className="font-bold text-primary ml-1">{fmtM(core.investmentMonthlyIncome)}</span>
            </p>
            <div className="relative h-3 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                style={{ width: `${core.investmentCoversPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Covers <strong>{core.investmentCoversPct}%</strong> of monthly pension loss
            </p>
          </CardContent>
        </Card>

        {/* Key insight box */}
        <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>The hidden cost:</strong> Your monthly loss of ₹{fmt(core.monthlyLossNow)} grows
            every year as DA rises. See the 30-Year Projection tab for the full picture.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: 30-Year Projection ─────────────────────────────────────────────────

function ProjectionTab({ inputs, onChange }: {
  inputs: CommutationInputs;
  onChange: (k: keyof CommutationInputs, v: number | string) => void;
}) {
  const data = useMemo(() => project30Years(inputs), [inputs]);

  // Find crossover year (cumulativeWith > cumulativeWithout)
  const crossover = data.find((d) => d.cumulativeDiff >= 0);

  const chartData = data.map((d) => ({
    age: d.age,
    "Without Commutation": Math.round(d.cumulativeWithout / 100000),
    "With Commutation": Math.round(d.cumulativeWith / 100000),
    "Monthly Loss": Math.round(d.monthlyLoss),
    cpc: d.cpcAppliedThisYear,
  }));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4">
          <div className="grid sm:grid-cols-4 gap-5">
            <SliderRow
              label="DA Growth (p.a.)" suffix="%" value={inputs.daGrowthRatePA}
              min={1} max={10} step={0.5} onChange={(v) => onChange("daGrowthRatePA", v)}
            />
            <SliderRow
              label="8th CPC in (years)" suffix=" yrs" value={inputs.cpcYearFromNow}
              min={0} max={10} onChange={(v) => onChange("cpcYearFromNow", v)}
            />
            <SliderRow
              label="Fitment Factor" suffix="×" value={inputs.fitmentFactor}
              min={1.5} max={3.5} step={0.1} onChange={(v) => onChange("fitmentFactor", v)}
            />
            <SliderRow
              label="Projection Years" suffix=" yrs" value={inputs.expectedLifeYears}
              min={10} max={40} onChange={(v) => onChange("expectedLifeYears", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Crossover callout */}
      {crossover ? (
        <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">
            <strong>Cumulative break-even: Age {crossover.age}</strong> (Year {crossover.year}).
            After this point, the lump sum + investment income has more than compensated for pension cuts.
          </p>
        </div>
      ) : (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            With these assumptions, commutation <strong>never breaks even</strong> in the projection period.
            Consider reducing commutation % or investing in higher-return instruments.
          </p>
        </div>
      )}

      {/* Cumulative chart */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cumulative Income: Commute vs Don&apos;t Commute</CardTitle>
          <p className="text-xs text-slate-500">in ₹ Lakhs — includes investment returns on lump sum</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} label={{ value: "Age", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip
                formatter={(v: number, name: string) => [`₹${v} Lakh`, name]}
                labelFormatter={(l) => `Age ${l}`}
              />
              <Legend />
              <Area type="monotone" dataKey="Without Commutation" stroke="#64748b" fill="#e2e8f0" strokeWidth={2} />
              <Area type="monotone" dataKey="With Commutation" stroke="#166534" fill="#dcfce7" strokeWidth={2} />
              {crossover && (
                <ReferenceLine x={crossover.age} stroke="#d97706" strokeDasharray="4 2"
                  label={{ value: "Break-even", fill: "#d97706", fontSize: 11 }} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly loss chart */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Pension Loss Over Time</CardTitle>
          <p className="text-xs text-slate-500">Grows as DA rises, jumps after Pay Commission</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${fmt(v)}`} />
              <Tooltip
                formatter={(v: number) => [`₹${fmt(v)}/mo`, "Monthly Loss"]}
                labelFormatter={(l) => `Age ${l}`}
              />
              <Line type="monotone" dataKey="Monthly Loss" stroke="#dc2626" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab 3: Investment Scenarios ───────────────────────────────────────────────

function ScenariosTab({ inputs }: { inputs: CommutationInputs }) {
  const core = useMemo(() => calculateCommutationCore(inputs), [inputs]);
  const scenarios = useMemo(
    () => buildInvestmentScenarios(core.commutedLumpSum, core.monthlyLossNow),
    [core]
  );

  const riskColor: Record<string, string> = {
    "Very Low": "bg-green-100 text-green-800",
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-amber-100 text-amber-800",
    High: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
        Lump sum to invest: <strong className="text-primary">{fmtL(core.commutedLumpSum)}</strong> ·
        Monthly loss to cover: <strong className="text-red-600">{fmtM(core.monthlyLossNow)}</strong>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((s) => (
          <Card key={s.name} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{s.name}</p>
                <Badge className={`text-xs shrink-0 ${riskColor[s.risk]}`}>{s.risk}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Return</span>
                <span className="font-bold text-primary">{s.ratePA}% p.a.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Monthly income</span>
                <span className="font-bold text-slate-800 dark:text-white">{fmtM(s.monthlyIncome)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Loss covered</span>
                  <span className={s.coversPct >= 100 ? "font-bold text-green-700" : "font-bold text-amber-700"}>
                    {s.coversPct}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${s.coversPct >= 100 ? "bg-green-500" : s.coversPct >= 70 ? "bg-amber-500" : "bg-red-400"}`}
                    style={{ width: `${Math.min(s.coversPct, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Value in 15 yrs</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{fmtL(s.valueAtYear15)}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">{s.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 4: PensionSmart Score ─────────────────────────────────────────────────

function SmartScoreTab() {
  const [sq, setSq] = useState<SmartScoreInputs>(DEFAULT_SCORE_INPUTS);

  const result = useMemo(() => calculateSmartScore(sq), [sq]);

  const scoreColor =
    result.color === "green" ? "text-green-700" :
    result.color === "amber" ? "text-amber-600" :
    result.color === "orange" ? "text-orange-600" : "text-red-600";

  const scoreBg =
    result.color === "green" ? "bg-green-50 border-green-200" :
    result.color === "amber" ? "bg-amber-50 border-amber-200" :
    result.color === "orange" ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200";

  function Q({
    label, field, options,
  }: {
    label: string;
    field: keyof SmartScoreInputs;
    options: { value: string; label: string }[];
  }) {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
        <Select
          value={sq[field] as string}
          onValueChange={(v) => setSq((prev) => ({ ...prev, [field]: v }))}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Questionnaire */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">7-Question Assessment</CardTitle>
          <p className="text-sm text-slate-500">Answer honestly — this drives the recommendation</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <Q label="What will you do with the lump sum?" field="moneyUse" options={[
            { value: "pay-debt-high", label: "Pay off high-interest debt (>10%)" },
            { value: "pay-debt-low", label: "Pay off home loan (<9%)" },
            { value: "property", label: "Buy land / property" },
            { value: "equity-invest", label: "Invest in equity MFs / stocks" },
            { value: "safe-invest", label: "Safe instruments (FD, SCSS, PMVVY)" },
            { value: "children-need", label: "Children education / wedding" },
            { value: "no-plan", label: "No specific plan yet" },
            { value: "savings-account", label: "Just keep in savings account" },
          ]} />
          <Q label="Your health status?" field="healthStatus" options={[
            { value: "excellent", label: "Excellent — family history 85+, no conditions" },
            { value: "good", label: "Good — average health" },
            { value: "moderate", label: "Moderate — some chronic conditions" },
            { value: "poor", label: "Poor — serious illness, shorter expectancy" },
          ]} />
          <Q label="How close is the next Pay Commission?" field="cpcProximity" options={[
            { value: "far", label: "Far — more than 3 years away" },
            { value: "moderate", label: "Moderate — 1–3 years" },
            { value: "near", label: "Near — less than 1 year" },
          ]} />
          <Q label="Investment discipline?" field="investmentDiscipline" options={[
            { value: "high", label: "High — will invest and not touch for 10+ years" },
            { value: "medium", label: "Medium — might invest, may withdraw if needed" },
            { value: "low", label: "Low — won't invest systematically" },
          ]} />
          <Q label="Existing liabilities?" field="existingLiabilities" options={[
            { value: "heavy", label: "Heavy — >₹20L high-interest debt" },
            { value: "moderate", label: "Moderate — ₹5–20L home loan" },
            { value: "light", label: "Light — <₹5L or almost none" },
            { value: "none", label: "None" },
          ]} />
          <Q label="Family dependents?" field="familyDependents" options={[
            { value: "many", label: "Many — spouse + children + parents" },
            { value: "some", label: "Some — spouse only" },
            { value: "none", label: "None — fully independent" },
          ]} />
          <Q label="Retirement corpus sufficiency?" field="retirementCorpusSufficiency" options={[
            { value: "insufficient", label: "Insufficient — NPS/PF won't sustain lifestyle" },
            { value: "adequate", label: "Adequate — will manage" },
            { value: "surplus", label: "Surplus — well-covered by other savings" },
          ]} />
        </CardContent>
      </Card>

      {/* Result */}
      <div className="space-y-4">
        {/* Score */}
        <Card className={`border shadow-md ${scoreBg}`}>
          <CardContent className="pt-6 text-center">
            <div className={`text-7xl font-black mb-2 ${scoreColor}`}>{result.score}</div>
            <div className="text-xs text-slate-500 mb-3">PensionSmart Score (out of 100)</div>
            <Badge className={`text-sm px-4 py-1 ${
              result.color === "green" ? "bg-green-600 text-white" :
              result.color === "amber" ? "bg-amber-500 text-white" :
              result.color === "orange" ? "bg-orange-500 text-white" :
              "bg-red-600 text-white"
            }`}>
              {result.label}
            </Badge>
            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Suggested: Commute <strong className={scoreColor}>{result.optimalPct}%</strong> of pension
            </p>
          </CardContent>
        </Card>

        {/* Pros */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <TrendingUp className="w-4 h-4" /> Reasons to Commute
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.reasons.pro.length > 0 ? (
              <ul className="space-y-1.5">
                {result.reasons.pro.map((r, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No strong reasons identified.</p>
            )}
          </CardContent>
        </Card>

        {/* Cons */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-red-600">
              <TrendingDown className="w-4 h-4" /> Reasons NOT to Commute
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.reasons.con.length > 0 ? (
              <ul className="space-y-1.5">
                {result.reasons.con.map((r, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No major concerns identified.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PensionCommutationAdvisor() {
  const [inputs, setInputs] = useState<CommutationInputs>(DEFAULT_INPUTS);

  const handleChange = (k: keyof CommutationInputs, v: number | string) => {
    setInputs((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="core">
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 h-auto flex-wrap gap-1 rounded-xl shadow-sm">
          <TabsTrigger value="core" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-sm">
            Core Calculator
          </TabsTrigger>
          <TabsTrigger value="projection" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-sm">
            30-Year Projection
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-sm">
            Investment Scenarios
          </TabsTrigger>
          <TabsTrigger value="score" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-sm">
            PensionSmart Score
          </TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="mt-6">
          <CoreTab inputs={inputs} onChange={handleChange} />
        </TabsContent>
        <TabsContent value="projection" className="mt-6">
          <ProjectionTab inputs={inputs} onChange={handleChange} />
        </TabsContent>
        <TabsContent value="scenarios" className="mt-6">
          <ScenariosTab inputs={inputs} />
        </TabsContent>
        <TabsContent value="score" className="mt-6">
          <SmartScoreTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
