"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  IndianRupee,
  Calendar,
  Percent,
  Target,
  Copy,
  Download,
  Check,
  ExternalLink,
} from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  formatINR,
  yAxisINR,
} from "./shared/charts";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/posthog-service";

// Gold-standard SIP Calculator — matches the prototype user approved.
// Features: presets, amount-vs-goal modes, inline toggles (step-up,
// inflation, LTCG tax, stress test), donut composition, smooth area
// chart, scenario row, share-as-image, copy result, methodology link.
// v3 Bold Redesign tokens throughout.

type Mode = "returns" | "goal";

interface Preset {
  key: string;
  label: string;
  monthly: number;
  years: number;
  rate: number;
  mode: Mode;
  stepup?: boolean;
  stepupPct?: number;
  goal?: number;
}

// Persona presets — "I'm 25, saving for retirement" (user-focused, not
// "Scenario A"). Tone matches brainstorm editorial voice.
const PRESETS: Preset[] = [
  { key: "custom", label: "Custom (I'll pick my own numbers)", monthly: 5000, years: 10, rate: 12, mode: "returns" },
  { key: "sip-25-retirement", label: "I'm 25, saving for retirement", monthly: 5000, years: 35, rate: 12, mode: "returns" },
  { key: "sip-30-retirement", label: "I'm 30, saving for retirement", monthly: 10000, years: 30, rate: 12, mode: "returns" },
  { key: "sip-35-kids", label: "I'm 35, planning kids' education", monthly: 15000, years: 15, rate: 12, mode: "returns" },
  { key: "sip-40-kids", label: "I'm 40, planning kids' education", monthly: 25000, years: 10, rate: 11, mode: "returns" },
  { key: "sip-28-home", label: "I'm 28, saving for a home down-payment", monthly: 20000, years: 5, rate: 10, mode: "returns" },
  { key: "sip-45-catchup", label: "I'm 45, catching up for retirement", monthly: 40000, years: 15, rate: 12, mode: "returns", stepup: true, stepupPct: 8 },
  { key: "goal-1cr-15", label: "Goal: ₹1 Cr in 15 years", monthly: 25000, years: 15, rate: 12, mode: "goal", goal: 10000000 },
  { key: "goal-50l-10", label: "Goal: ₹50 L in 10 years", monthly: 20000, years: 10, rate: 12, mode: "goal", goal: 5000000 },
];

// ---------- MATH ----------
function sipCorpus(monthly: number, years: number, ratePct: number, stepupPct = 0) {
  const r = ratePct / 100 / 12;
  if (!stepupPct) {
    const n = years * 12;
    if (r === 0) return { fv: monthly * n, invested: monthly * n };
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return { fv, invested: monthly * n };
  }
  let corpus = 0;
  let invested = 0;
  let m = monthly;
  for (let y = 0; y < years; y++) {
    corpus = corpus * Math.pow(1 + r, 12);
    corpus += m * ((Math.pow(1 + r, 12) - 1) / r) * (1 + r);
    invested += m * 12;
    m = m * (1 + stepupPct / 100);
  }
  return { fv: corpus, invested };
}
function sipCorpusStress(monthly: number, years: number, ratePct: number, stepupPct: number, stressYear: number) {
  const r = ratePct / 100 / 12;
  let corpus = 0;
  let m = monthly;
  for (let y = 1; y <= years; y++) {
    if (y === stressYear) corpus = corpus * 0.7; // 30% drawdown
    corpus = corpus * Math.pow(1 + r, 12);
    corpus += m * ((Math.pow(1 + r, 12) - 1) / r) * (1 + r);
    if (stepupPct) m = m * (1 + stepupPct / 100);
  }
  return corpus;
}
function reverseSIP(goal: number, years: number, ratePct: number, stepupPct: number) {
  const trial = sipCorpus(1, years, ratePct, stepupPct).fv;
  return goal / trial;
}
function yearsToOneCr(monthly: number, ratePct: number, stepupPct: number) {
  for (let y = 1; y <= 50; y++) {
    if (sipCorpus(monthly, y, ratePct, stepupPct).fv >= 10000000) return y;
  }
  return null;
}

export function SIPCalculatorV2() {
  const [mode, setMode] = useState<Mode>("returns");
  const [preset, setPreset] = useState<string>("custom");
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [goalAmount, setGoalAmount] = useState(2000000);

  // Toggles
  const [stepup, setStepup] = useState(false);
  const [stepupPct, setStepupPct] = useState(10);
  const [inflation, setInflation] = useState(false);
  const [inflationPct, setInflationPct] = useState(6);
  const [tax, setTax] = useState(false);
  const [stress, setStress] = useState(false);
  const [stressYear, setStressYear] = useState(5);

  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Apply preset
  const applyPreset = (key: string) => {
    setPreset(key);
    const p = PRESETS.find((x) => x.key === key);
    if (!p || key === "custom") return;
    setMode(p.mode);
    setMonthlyAmount(p.monthly);
    setYears(p.years);
    setExpectedReturn(p.rate);
    if (p.goal) setGoalAmount(p.goal);
    setStepup(Boolean(p.stepup));
    if (p.stepupPct) setStepupPct(p.stepupPct);
    trackEvent("sip_calc_preset_applied", { preset: key });
  };

  const result = useMemo(() => {
    const stepupArg = stepup ? stepupPct : 0;
    if (mode === "returns") {
      const { fv, invested } = sipCorpus(monthlyAmount, years, expectedReturn, stepupArg);
      return { fv, invested, returns: fv - invested, monthly: monthlyAmount };
    } else {
      const needed = reverseSIP(goalAmount, years, expectedReturn, stepupArg);
      const { invested } = sipCorpus(needed, years, expectedReturn, stepupArg);
      return {
        fv: goalAmount,
        invested,
        returns: goalAmount - invested,
        monthly: Math.ceil(needed),
      };
    }
  }, [mode, monthlyAmount, years, expectedReturn, goalAmount, stepup, stepupPct]);

  // Tax adjustment: 10% LTCG on gains above ₹1L/yr (approximation across tenure)
  const taxOwed = tax ? Math.max(0, result.returns - 100000) * 0.1 : 0;
  const finalCorpus = result.fv - taxOwed;

  // Inflation-adjusted real value
  const realValue = inflation
    ? finalCorpus / Math.pow(1 + inflationPct / 100, years)
    : null;

  // Stress scenario
  const stressCorpus = stress
    ? sipCorpusStress(result.monthly, years, expectedReturn, stepup ? stepupPct : 0, stressYear)
    : null;
  const stressDelta = stressCorpus !== null ? result.fv - stressCorpus : 0;

  // Chart data
  const chartData = useMemo(() => {
    const data: Array<{ year: string; value: number; invested: number; stress?: number }> = [];
    for (let y = 0; y <= years; y++) {
      const { fv, invested } = sipCorpus(result.monthly, y, expectedReturn, stepup ? stepupPct : 0);
      const row: any = { year: y === 0 ? "Start" : `Y${y}`, value: Math.round(fv), invested: Math.round(invested) };
      if (stress && y > 0) {
        row.stress = Math.round(
          sipCorpusStress(result.monthly, y, expectedReturn, stepup ? stepupPct : 0, stressYear),
        );
      }
      data.push(row);
    }
    return data;
  }, [result.monthly, years, expectedReturn, stepup, stepupPct, stress, stressYear]);

  // Scenarios (3-rate comparison)
  const scenarios = useMemo(() => {
    const stepupArg = stepup ? stepupPct : 0;
    const c8 = sipCorpus(result.monthly, years, 8, stepupArg).fv;
    const c12 = sipCorpus(result.monthly, years, 12, stepupArg).fv;
    const c15 = sipCorpus(result.monthly, years, 15, stepupArg).fv;
    return [
      { rate: 8, label: "Debt · Low risk", value: c8 },
      { rate: 12, label: "Index · Medium", value: c12 },
      { rate: 15, label: "Small-cap · High risk", value: c15 },
    ];
  }, [result.monthly, years, stepup, stepupPct]);

  // Donut proportions
  const gainPct = Math.max(0, Math.min(1, result.returns / Math.max(result.fv, 1)));
  const investedPct = 1 - gainPct;
  const donutCircumference = 2 * Math.PI * 42;

  // Verdict lines
  const verdict = useMemo(() => {
    const lines: string[] = [];
    if (mode === "goal") {
      lines.push(
        `To reach ${formatINR(goalAmount)} in ${years} years at ${expectedReturn}%, invest ${formatINR(result.monthly)}/month.`,
      );
    } else {
      lines.push(
        `${formatINR(monthlyAmount)}/month for ${years} years at ${expectedReturn}% grows to ${formatINR(finalCorpus)} — ${formatINR(result.returns - taxOwed)} is pure compounding gain.`,
      );
    }
    if (years >= 2) {
      const oneYearLate = sipCorpus(result.monthly, Math.max(1, years - 1), expectedReturn, stepup ? stepupPct : 0).fv;
      lines.push(
        `Start 1 year late: you lose ${formatINR(result.fv - oneYearLate)}. Time matters more than any other lever.`,
      );
    }
    if (inflation && realValue) {
      lines.push(
        `In today's money, your ${formatINR(finalCorpus)} is worth ${formatINR(realValue)}. Inflation at ${inflationPct}% eats the rest.`,
      );
    }
    return lines;
  }, [mode, goalAmount, years, expectedReturn, result, monthlyAmount, finalCorpus, taxOwed, stepup, stepupPct, inflation, inflationPct, realValue]);

  const copyResult = useCallback(() => {
    const text = mode === "returns"
      ? `My SIP plan: ₹${monthlyAmount.toLocaleString("en-IN")}/month for ${years} yrs @ ${expectedReturn}% → ${formatINR(finalCorpus)}. Via investingpro.in/calculators/sip`
      : `My goal: ${formatINR(goalAmount)} in ${years} yrs @ ${expectedReturn}% needs ${formatINR(result.monthly)}/month. Via investingpro.in/calculators/sip`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      trackEvent("sip_calc_result_copied", { mode });
      setTimeout(() => setCopied(false), 1500);
    });
  }, [mode, monthlyAmount, years, expectedReturn, finalCorpus, goalAmount, result.monthly]);

  const shareAsImage = useCallback(async () => {
    if (!shareRef.current) return;
    setSharing(true);
    try {
      const h2c = (await import("html2canvas")).default;
      const canvas = await h2c(shareRef.current, {
        backgroundColor: "#FBF8F1",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      const ts = new Date().toISOString().slice(0, 10);
      link.download = `investingpro-sip-${ts}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackEvent("sip_calc_shared_as_image", { mode });
    } catch (e) {
      console.error("Share failed", e);
    } finally {
      setSharing(false);
    }
  }, [mode]);

  // ---------------- RENDER ----------------
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <TrustStrip />

      {/* PRESET ROW — persona-driven quick-start */}
      <div className="bg-white border-2 border-ink/10 rounded-sm p-4 sm:p-5">
        <label htmlFor="preset" className="font-mono text-[11px] uppercase tracking-wider text-indian-gold font-semibold mb-2 block">
          Quick start
        </label>
        <select
          id="preset"
          value={preset}
          onChange={(e) => applyPreset(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-ink/15 rounded-sm bg-white text-ink text-[14px] font-mono focus:outline-none focus:border-indian-gold cursor-pointer"
        >
          {PRESETS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* INPUTS */}
        <div className="lg:col-span-5 bg-white border-2 border-ink/10 rounded-sm p-5 sm:p-6">
          {/* Mode tabs */}
          <div className="flex gap-1 mb-5 p-1 bg-ink/5 rounded-sm">
            <button
              onClick={() => setMode("returns")}
              className={cn(
                "flex-1 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-wider font-semibold transition-all",
                mode === "returns" ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "text-ink-60",
              )}
            >
              I have an amount
            </button>
            <button
              onClick={() => setMode("goal")}
              className={cn(
                "flex-1 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-wider font-semibold transition-all",
                mode === "goal" ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "text-ink-60",
              )}
            >
              I have a goal
            </button>
          </div>

          <div className="space-y-5">
            {mode === "returns" ? (
              <SliderInput
                label="Monthly SIP"
                icon={IndianRupee}
                value={monthlyAmount}
                onChange={(v) => { setMonthlyAmount(v); setPreset("custom"); }}
                min={500}
                max={200000}
                step={500}
                formatDisplay={formatINR}
              />
            ) : (
              <SliderInput
                label="Target corpus"
                icon={Target}
                value={goalAmount}
                onChange={(v) => { setGoalAmount(v); setPreset("custom"); }}
                min={100000}
                max={100000000}
                step={50000}
                formatDisplay={formatINR}
              />
            )}
            <SliderInput
              label="Time period"
              icon={Calendar}
              value={years}
              onChange={(v) => { setYears(v); setPreset("custom"); }}
              min={1}
              max={40}
              step={1}
              suffix=" yrs"
            />
            <SliderInput
              label="Expected return"
              icon={Percent}
              value={expectedReturn}
              onChange={(v) => { setExpectedReturn(v); setPreset("custom"); }}
              min={4}
              max={25}
              step={0.5}
              suffix="% p.a."
            />
          </div>

          {/* INLINE TOGGLES — most-used */}
          <div className="mt-5 pt-5 border-t border-ink/10 space-y-3">
            <Toggle
              label="Step-up SIP each year"
              hint="Increase the SIP as your salary grows."
              on={stepup}
              onChange={(v) => { setStepup(v); setPreset("custom"); }}
            />
            {stepup && (
              <div className="ml-11">
                <SliderInput
                  label="Annual step-up"
                  icon={Percent}
                  value={stepupPct}
                  onChange={setStepupPct}
                  min={0}
                  max={20}
                  step={1}
                  suffix="%"
                />
              </div>
            )}
            <Toggle
              label="Adjust for inflation"
              hint="See your corpus in today's rupees."
              on={inflation}
              onChange={setInflation}
            />
            {inflation && (
              <div className="ml-11">
                <SliderInput
                  label="Inflation rate"
                  icon={Percent}
                  value={inflationPct}
                  onChange={setInflationPct}
                  min={3}
                  max={10}
                  step={0.5}
                  suffix="%"
                />
              </div>
            )}
          </div>

          {/* ADVANCED TOGGLES */}
          <div className="mt-5 pt-5 border-t border-ink/10">
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-3 font-semibold">
              Advanced · Most users skip these (they shouldn&apos;t)
            </div>
            <div className="space-y-3">
              <Toggle
                label="Subtract 10% LTCG tax"
                hint="On gains above ₹1L per FY. Most calculators hide this."
                on={tax}
                onChange={setTax}
              />
              <Toggle
                label="Stress test: simulate a 30% crash"
                hint="The question no other calculator asks."
                on={stress}
                onChange={setStress}
              />
              {stress && (
                <div className="ml-11 bg-warning-red/5 border border-warning-red/20 rounded-sm p-3">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-warning-red font-semibold flex justify-between mb-2">
                    <span>Crash hits in year</span>
                    <span className="tabular-nums">Y{stressYear}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={Math.max(1, years - 1)}
                    step={1}
                    value={stressYear}
                    onChange={(e) => setStressYear(Number(e.target.value))}
                    className="w-full accent-warning-red"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RESULT + DONUT */}
        <div className="lg:col-span-7 space-y-4">
          <div ref={shareRef} className="relative bg-indian-gold/5 border-2 border-ink/10 rounded-sm p-6 sm:p-7">
            <div className="absolute bottom-0 left-7 w-14 h-[3px] bg-indian-gold rounded-t" />
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-60 font-semibold mb-2">
                  {mode === "returns" ? "Projected Corpus" : "Required Monthly SIP"}
                </div>
                <div className="font-display font-black text-[42px] sm:text-[56px] lg:text-[64px] text-ink leading-none tracking-tight tabular-nums">
                  {mode === "goal" ? `${formatINR(result.monthly)}/mo` : formatINR(finalCorpus)}
                </div>
                <div className="font-mono text-[12px] text-ink-60 mt-3">
                  {mode === "returns" ? (
                    <>
                      Invest <strong className="text-ink tabular-nums">{formatINR(result.invested)}</strong>
                      {" · "}
                      Gain <strong className="text-action-green tabular-nums">{formatINR(result.returns - taxOwed)}</strong>
                      {tax && taxOwed > 0 && (
                        <>
                          {" · "}
                          Tax <strong className="text-warning-red tabular-nums">−{formatINR(taxOwed)}</strong>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Goal <strong className="text-ink tabular-nums">{formatINR(goalAmount)}</strong>
                      {" · "}
                      Invest total <strong className="text-ink tabular-nums">{formatINR(result.invested)}</strong>
                    </>
                  )}
                </div>

                {inflation && realValue && (
                  <div className="mt-3 pt-3 border-t border-dashed border-ink/20">
                    <div className="font-mono text-[11px] text-ink-60">
                      In today&apos;s money: <strong className="text-ink tabular-nums">{formatINR(realValue)}</strong>{" "}
                      <span className="text-ink-60/70">@ {inflationPct}% inflation</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Donut — gain/invested composition */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <svg viewBox="0 0 100 100" width="110" height="110" aria-label="Invested vs returns donut">
                  <circle cx="50" cy="50" r="42" fill="#F5F2EA" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="14"
                    strokeDasharray={`${investedPct * donutCircumference} ${donutCircumference}`}
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="14"
                    strokeDasharray={`${gainPct * donutCircumference} ${donutCircumference}`}
                    strokeDashoffset={-investedPct * donutCircumference}
                    transform="rotate(-90 50 50)"
                  />
                  <circle cx="50" cy="50" r="28" fill="#FBF8F1" />
                  <text x="50" y="49" textAnchor="middle" dominantBaseline="middle" fontFamily="Playfair Display, serif" fontSize="18" fontWeight="700" fill="#0A1F14">
                    {Math.round(gainPct * 100)}%
                  </text>
                  <text x="50" y="62" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" fill="#64748B" letterSpacing="1">
                    GAIN
                  </text>
                </svg>
                <div className="text-center">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-60">
                    <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
                    Invested
                    <span className="ml-auto font-mono tabular-nums text-ink">{Math.round(investedPct * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-60 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-action-green" />
                    Returns
                    <span className="ml-auto font-mono tabular-nums text-action-green">{Math.round(gainPct * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stress banner */}
          {stress && stressCorpus !== null && (
            <div className="bg-warning-red/5 border-l-4 border-warning-red rounded-sm p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-warning-red font-semibold mb-1">
                Stress Test Active
              </div>
              <p className="text-[13px] text-ink leading-relaxed">
                If the market drops 30% in <strong>year {stressYear}</strong>, your final corpus falls to{" "}
                <strong className="font-mono tabular-nums">{formatINR(stressCorpus)}</strong> — a{" "}
                <strong className="font-mono tabular-nums text-warning-red">{formatINR(stressDelta)}</strong> gap
                vs the smooth projection.
              </p>
            </div>
          )}

          {/* METRIC CARDS */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Wealth Multiplier"
              value={`${(result.fv / Math.max(result.invested, 1)).toFixed(2)}×`}
            />
            <MetricCard
              label="Years to ₹1 Cr"
              value={(() => {
                const y = yearsToOneCr(result.monthly, expectedReturn, stepup ? stepupPct : 0);
                return y ? `${y} yrs` : "> 50 yrs";
              })()}
            />
          </div>

          {/* VERDICT */}
          <div className="bg-white border-2 border-ink/10 rounded-sm p-5 sm:p-6">
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold font-semibold mb-3">
              The Verdict
            </div>
            <div className="space-y-2.5">
              {verdict.map((line, i) => (
                <p key={i} className="font-display text-[15px] text-ink leading-snug">
                  {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                    part.startsWith("**") ? (
                      <strong key={j} className="font-mono text-[14px] text-authority-green font-semibold">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <React.Fragment key={j}>{part}</React.Fragment>
                    ),
                  )}
                </p>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                SEBI-standard formula
              </span>
              <Link
                href="/about/methodology"
                className="font-mono text-[10px] uppercase tracking-wider text-indian-gold hover:underline font-semibold"
              >
                Methodology &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white border-2 border-ink/10 rounded-sm p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display font-bold text-lg text-ink">Wealth journey</h3>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-ink-60">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-[3px] bg-[#CBD5E1]" />
              Invested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-[3px] bg-action-green" />
              Projected
            </span>
            {stress && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-[3px] bg-warning-red border border-dashed" />
                After crash
              </span>
            )}
          </div>
        </div>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradCorpus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CBD5E1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#CBD5E1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" vertical={false} />
              <XAxis dataKey="year" fontSize={11} tick={{ fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis fontSize={11} tick={{ fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={yAxisINR} width={50} />
              <Tooltip
                contentStyle={{ borderRadius: "4px", border: "2px solid rgba(10,31,20,0.1)", fontSize: "12px" }}
                formatter={(v: any) => [formatINR(Number(v)), ""]}
              />
              <Area type="monotone" dataKey="value" stroke="#16A34A" strokeWidth={2} fill="url(#gradCorpus)" />
              <Area type="monotone" dataKey="invested" stroke="#94A3B8" strokeWidth={1.5} fill="url(#gradInvested)" />
              {stress && (
                <Area type="monotone" dataKey="stress" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 4" fill="transparent" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SCENARIOS */}
      <div className="bg-white border-2 border-ink/10 rounded-sm p-5 sm:p-6">
        <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold font-semibold mb-4">
          What if you picked a different fund category?
        </div>
        <div className="grid grid-cols-3 gap-3">
          {scenarios.map((s) => (
            <button
              key={s.rate}
              onClick={() => { setExpectedReturn(s.rate); setPreset("custom"); }}
              className={cn(
                "p-4 border-2 rounded-sm text-left transition-colors",
                expectedReturn === s.rate
                  ? "border-indian-gold bg-indian-gold/5"
                  : "border-ink/10 hover:border-ink/30",
              )}
            >
              <div className="font-mono text-[16px] font-bold text-ink tabular-nums">{s.rate}% p.a.</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mt-1">{s.label}</div>
              <div className="font-display font-bold text-lg text-authority-green mt-2 tabular-nums">
                {formatINR(s.value)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={shareAsImage}
          disabled={sharing}
          className="flex-1 flex items-center justify-center gap-2 bg-action-green hover:bg-authority-green text-canvas font-mono uppercase tracking-wider font-semibold text-[12px] px-6 py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {sharing ? "Generating…" : "Share as image"}
        </button>
        <button
          onClick={copyResult}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-ink/15 text-ink font-mono uppercase tracking-wider font-semibold text-[12px] px-6 py-3 rounded-sm hover:border-ink transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>

      <PopularCalculators currentSlug="sip" />
    </div>
  );
}

// ---- Sub-components ----
function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="w-full flex items-start gap-3 text-left group"
      aria-pressed={on}
    >
      <span
        className={cn(
          "mt-0.5 flex-shrink-0 w-9 h-5 rounded-full transition-colors relative",
          on ? "bg-action-green" : "bg-ink/20",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
            on ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-display font-semibold text-[14px] text-ink leading-tight">
          {label}
        </span>
        <span className="block text-[12px] text-ink-60 leading-snug mt-0.5">
          {hint}
        </span>
      </span>
    </button>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border-2 border-ink/10 rounded-sm p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">{label}</div>
      <div className="font-mono text-[22px] font-bold text-ink mt-1 tabular-nums">{value}</div>
    </div>
  );
}
