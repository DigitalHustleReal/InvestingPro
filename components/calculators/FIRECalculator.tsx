"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils/currency";
import {
  Flame,
  TrendingUp,
  Shield,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  IndianRupee,
} from "lucide-react";
import { calculateFIRE, FIRE_DEFAULTS, type FIREInputs } from "@/lib/calculators/fire";

const SLIDER_CONFIG = {
  currentAge:               { min: 18,  max: 55,    step: 1,     label: "Current Age",             suffix: "yrs" },
  retirementAge:            { min: 30,  max: 70,    step: 1,     label: "Target Retirement Age",   suffix: "yrs" },
  monthlyExpenses:          { min: 10000, max: 500000, step: 5000, label: "Monthly Expenses",      suffix: "" },
  currentSavings:           { min: 0,   max: 10000000, step: 50000, label: "Current Corpus",       suffix: "" },
  monthlySavings:           { min: 0,   max: 300000, step: 2000,  label: "Monthly Savings",        suffix: "" },
  expectedReturnPct:        { min: 6,   max: 18,    step: 0.5,   label: "Expected Return",         suffix: "% p.a." },
  inflationPct:             { min: 3,   max: 10,    step: 0.5,   label: "General Inflation",       suffix: "% p.a." },
  withdrawalRatePct:        { min: 2,   max: 6,     step: 0.25,  label: "Withdrawal Rate",         suffix: "% p.a." },
};

function SliderInput({
  field,
  value,
  onChange,
}: {
  field: keyof typeof SLIDER_CONFIG;
  value: number;
  onChange: (v: number) => void;
}) {
  const cfg = SLIDER_CONFIG[field];
  const isRupee = cfg.suffix === "";
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {cfg.label}
        </label>
        <span className="text-sm font-bold text-primary-600">
          {isRupee ? formatINR(value) : `${value}${cfg.suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-0.5">
        <span>{isRupee ? formatINR(cfg.min) : `${cfg.min}${cfg.suffix}`}</span>
        <span>{isRupee ? formatINR(cfg.max) : `${cfg.max}${cfg.suffix}`}</span>
      </div>
    </div>
  );
}

function CorpusBar({ value, target }: { value: number; target: number }) {
  const pct = Math.min((value / target) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Current trajectory</span>
        <span>{pct.toFixed(0)}% of target</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            pct >= 100 ? "bg-green-500" : pct >= 70 ? "bg-amber-400" : "bg-red-400"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function FIRECalculator() {
  const [inputs, setInputs] = useState<FIREInputs>(FIRE_DEFAULTS);

  const set = (field: keyof FIREInputs) => (v: number) =>
    setInputs((prev) => ({ ...prev, [field]: v }));

  const r = useMemo(() => calculateFIRE(inputs), [inputs]);

  const variantConfig = [
    { data: r.leanFire,    icon: Shield,    color: "border-blue-200 bg-blue-50",   accent: "text-blue-600",   badge: "bg-blue-600" },
    { data: r.regularFire, icon: Target,    color: "border-green-200 bg-green-50", accent: "text-green-600",  badge: "bg-green-600" },
    { data: r.fatFire,     icon: Flame,     color: "border-amber-200 bg-amber-50", accent: "text-amber-600",  badge: "bg-amber-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                FIRE Calculator — India
              </CardTitle>
              <p className="text-sm text-slate-500">
                India-specific: 6% inflation, 12% healthcare inflation, ₹ adjusted
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <SliderInput field="currentAge"        value={inputs.currentAge}        onChange={set("currentAge")} />
            <SliderInput field="retirementAge"     value={inputs.retirementAge}     onChange={set("retirementAge")} />
            <SliderInput field="monthlyExpenses"   value={inputs.monthlyExpenses}   onChange={set("monthlyExpenses")} />
            <SliderInput field="currentSavings"    value={inputs.currentSavings}    onChange={set("currentSavings")} />
            <SliderInput field="monthlySavings"    value={inputs.monthlySavings}    onChange={set("monthlySavings")} />
            <SliderInput field="expectedReturnPct" value={inputs.expectedReturnPct} onChange={set("expectedReturnPct")} />
            <SliderInput field="inflationPct"      value={inputs.inflationPct}      onChange={set("inflationPct")} />
            <SliderInput field="withdrawalRatePct" value={inputs.withdrawalRatePct} onChange={set("withdrawalRatePct")} />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4 animate-in fade-in duration-300">
        {/* Main Status Card */}
        <Card className={cn(
          "border rounded-2xl shadow-lg",
          r.isOnTrack ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
        )}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {r.isOnTrack
                ? <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                : <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
              }
              <div className="flex-1 min-w-0">
                <h3 className={cn("text-xl font-bold", r.isOnTrack ? "text-green-800" : "text-amber-800")}>
                  {r.isOnTrack ? "You're on track!" : "Corpus shortfall detected"}
                </h3>
                <p className="text-slate-700 text-sm mt-1">
                  {r.isOnTrack
                    ? `At ${inputs.retirementAge} you'll have ${formatINR(r.projectedCorpusAtRetirement)} — above your ${formatINR(r.fireCorpus)} FIRE target.`
                    : `You need ${formatINR(r.fireCorpus)} but are on track for ${formatINR(r.projectedCorpusAtRetirement)}. Shortfall: ${formatINR(r.corpusShortfall)}.`
                  }
                </p>
                <div className="mt-3">
                  <CorpusBar value={r.projectedCorpusAtRetirement} target={r.fireCorpus} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "FIRE Corpus Needed",       value: formatINR(r.fireCorpus),                     sub: `at ${inputs.withdrawalRatePct}% withdrawal` },
            { label: "Monthly at Retirement",    value: formatINR(r.inflationAdjustedExpenses),       sub: "inflation-adjusted" },
            { label: "Safe Monthly Withdrawal",  value: formatINR(r.safeMonthlyWithdrawal),           sub: "from FIRE corpus" },
            { label: "Earliest FIRE Age",        value: `${r.ageAtFire} yrs`,                         sub: `in ${r.yearsToFire} years` },
          ].map((item, i) => (
            <Card key={i} className="border-0 shadow-md rounded-xl">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FIRE Variants */}
        <div className="grid md:grid-cols-3 gap-4">
          {variantConfig.map(({ data, icon: Icon, color, accent, badge }) => (
            <Card key={data.label} className={cn("border rounded-2xl shadow-md", color)}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn("w-5 h-5", accent)} />
                  <span className="font-bold text-slate-900">{data.label}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{data.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Monthly budget</span>
                    <span className="font-bold text-slate-900">{formatINR(data.monthlyBudget)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Corpus needed</span>
                    <span className="font-bold text-slate-900">{formatINR(data.corpusNeeded)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Achievable at</span>
                    <Badge className={cn("text-xs", badge)}>
                      {data.achievableAge ? `Age ${data.achievableAge}` : "50+ years"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coast FIRE */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Coast FIRE
            </CardTitle>
            <p className="text-sm text-slate-500">
              The corpus you need TODAY so compounding alone takes you to FIRE — no more savings needed.
            </p>
          </CardHeader>
          <CardContent>
            {r.coastFire.alreadyCoasting ? (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800">You're already coasting!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your current corpus of {formatINR(inputs.currentSavings)} exceeds the Coast FIRE number
                    of {formatINR(r.coastFire.coastCorpus)}. Even if you stop saving today, your
                    portfolio will grow to your FIRE target by {inputs.retirementAge}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-xs text-slate-500">Coast FIRE Corpus</p>
                  <p className="text-xl font-bold text-primary-600 mt-1">
                    {formatINR(r.coastFire.coastCorpus)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">needed today</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-xs text-slate-500">Years to Coast Corpus</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {r.coastFire.yearsToCoastCorpus !== null
                      ? `${r.coastFire.yearsToCoastCorpus} years`
                      : "50+ years"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">at current savings rate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Retirement Phases */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Retirement Phases
            </CardTitle>
            <p className="text-sm text-slate-500">
              Your expenses won't be flat — here's a realistic three-phase view
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {r.phases.map((phase, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2"
                >
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{phase.label}</p>
                  <p className="text-xs text-slate-500">Age {phase.ageRange}</p>
                  <p className="text-lg font-bold text-primary-600">
                    {formatINR(phase.monthlyBudget)}<span className="text-xs font-normal text-slate-400">/mo</span>
                  </p>
                  <p className="text-xs text-slate-500">{phase.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* India-specific note */}
        <Card className="border border-blue-100 bg-blue-50 rounded-2xl shadow-sm">
          <CardContent className="p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 space-y-1">
              <p className="font-semibold">India-specific assumptions in this calculator:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>General inflation: 6% (vs 2.5% US/UK)</li>
                <li>Healthcare inflation: 12% (₹ healthcare costs double every ~6 years)</li>
                <li>Nifty 50 long-term return: ~12% nominal (used for accumulation)</li>
                <li>Withdrawal rate: {inputs.withdrawalRatePct}% — adjust to 3.5% for very early retirement (&lt;40)</li>
                <li>No Social Security equivalent — full self-funded retirement assumed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-slate-400 text-center px-4">
          For educational purposes only. Consult a SEBI-registered financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}
