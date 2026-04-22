"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Lazy load Recharts to avoid SSR hydration issues
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), {
  ssr: false,
});
const Area = dynamic(() => import("recharts").then((m) => m.Area), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false },
);
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), {
  ssr: false,
});
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), {
  ssr: false,
});
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), {
  ssr: false,
});

// ─── Editable Input + Slider combo (Groww pattern) ─────────────────────────
function SliderInput({
  label,
  icon: Icon,
  value,
  onChange,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  formatDisplay,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  formatDisplay?: (v: number) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(value));

  const handleBlur = useCallback(() => {
    setEditing(false);
    const parsed = parseFloat(inputVal.replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed)) {
      onChange(Math.min(Math.max(parsed, min), max));
    } else {
      setInputVal(String(value));
    }
  }, [inputVal, min, max, onChange, value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleBlur();
    },
    [handleBlur],
  );

  const display = formatDisplay
    ? formatDisplay(value)
    : `${prefix}${value.toLocaleString("en-IN")}${suffix}`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-ink-60 flex items-center gap-2">
          <Icon size={15} className="text-action-green" />
          {label}
        </label>
        {editing ? (
          <input
            type="text"
            className="w-32 text-right text-sm font-semibold text-authority-green bg-action-green/10 border border-green-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-green-200"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <button
            onClick={() => {
              setEditing(true);
              setInputVal(String(value));
            }}
            className="text-sm font-bold text-authority-green bg-action-green/10 hover:bg-action-green/20 border border-green-200 rounded-lg px-3 py-1.5 transition-colors cursor-text"
          >
            {display}
          </button>
        )}
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
      <div className="flex justify-between text-[10px] text-ink-60 -mt-0.5">
        <span>
          {prefix}
          {min.toLocaleString("en-IN")}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString("en-IN")}
          {suffix}
        </span>
      </div>
    </div>
  );
}

// ─── Main Calculator ────────────────────────────────────────────────────────
export function CAGRCalculator() {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(250000);
  const [years, setYears] = useState(5);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
      return { cagr: 0, absoluteReturn: 0, absoluteReturnPct: 0 };
    }
    const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    const absoluteReturn = finalValue - initialValue;
    const absoluteReturnPct =
      ((finalValue - initialValue) / initialValue) * 100;
    return { cagr, absoluteReturn, absoluteReturnPct };
  }, [initialValue, finalValue, years]);

  const growthData = useMemo(() => {
    const data = [];
    const rate = result.cagr / 100;
    for (let y = 0; y <= years; y++) {
      data.push({
        year: `Y${y}`,
        value: Math.round(initialValue * Math.pow(1 + rate, y)),
        invested: initialValue,
      });
    }
    return data;
  }, [initialValue, years, result.cagr]);

  const pieData = [
    { name: "Initial Investment", value: initialValue, color: "#166534" },
    {
      name: "Growth",
      value: Math.max(0, finalValue - initialValue),
      color: "#22c55e",
    },
  ];

  const cagrRating =
    result.cagr >= 20
      ? { label: "Excellent", icon: ArrowUpRight, color: "text-action-green" }
      : result.cagr >= 12
        ? { label: "Good", icon: ArrowUpRight, color: "text-action-green" }
        : result.cagr >= 8
          ? { label: "Average", icon: Minus, color: "text-indian-gold" }
          : {
              label: "Below Avg",
              icon: ArrowDownRight,
              color: "text-red-500",
            };

  const benchmarks = [
    { name: "Nifty 50 (10Y)", cagr: 12.5 },
    { name: "Gold (10Y)", cagr: 10.5 },
    { name: "PPF", cagr: 7.1 },
    { name: "FD (SBI)", cagr: 7.0 },
    { name: "Inflation", cagr: 5.5 },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* ─── Top: Inputs + Result ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs — always visible, never collapsed */}
        <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-6">
            Enter Investment Details
          </h2>
          <div className="space-y-6">
            <SliderInput
              label="Initial Investment"
              icon={IndianRupee}
              value={initialValue}
              onChange={setInitialValue}
              min={1000}
              max={10000000}
              step={1000}
              formatDisplay={formatCurrency}
            />
            <SliderInput
              label="Final Value"
              icon={Target}
              value={finalValue}
              onChange={setFinalValue}
              min={1000}
              max={50000000}
              step={1000}
              formatDisplay={formatCurrency}
            />
            <SliderInput
              label="Investment Duration"
              icon={Calendar}
              value={years}
              onChange={setYears}
              min={1}
              max={30}
              step={1}
              suffix=" Yrs"
            />
          </div>
        </div>

        {/* Result Card — bold, Groww-style */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-ink-60 font-medium">Your CAGR</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl md:text-7xl font-extrabold text-authority-green tracking-tight leading-none">
                {result.cagr.toFixed(2)}%
              </span>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-sm font-semibold mb-2",
                  cagrRating.color,
                )}
              >
                <cagrRating.icon size={16} />
                {cagrRating.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-5 border-t border-green-200/60">
            <div>
              <p className="text-[11px] text-ink-60 font-medium">Invested</p>
              <p className="text-[15px] font-display font-bold text-ink mt-0.5">
                {formatCurrency(initialValue)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ink-60 font-medium">
                Final Value
              </p>
              <p className="text-[15px] font-bold text-authority-green mt-0.5">
                {formatCurrency(finalValue)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ink-60 font-medium">
                Absolute Return
              </p>
              <p className="text-[15px] font-bold text-authority-green mt-0.5">
                {result.absoluteReturnPct.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Inline nudge */}
          <p className="text-xs text-ink-60 mt-4 leading-relaxed">
            {result.cagr >= 15
              ? `Your investment beat Nifty 50's 10-year average (12.5%). Strong performance.`
              : result.cagr >= 8
                ? `Decent growth, but below equity averages. Consider diversifying into index funds.`
                : `At ${result.cagr.toFixed(1)}%, your money barely beats inflation. A SIP in Nifty 50 could do significantly better.`}
          </p>
        </div>
      </div>

      {/* ─── Middle: Chart + Donut ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Growth Chart — 2/3 width */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-action-green" />
            Growth Trajectory
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="cagrGrowthV2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(v: number) =>
                    v >= 10000000
                      ? `${(v / 10000000).toFixed(1)}Cr`
                      : v >= 100000
                        ? `${(v / 100000).toFixed(0)}L`
                        : `${(v / 1000).toFixed(0)}K`
                  }
                />
                <Tooltip
                  formatter={(value: any) => [
                    formatCurrency(Number(value)),
                    "Value",
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#166534"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  fill="none"
                  name="Invested"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#cagrGrowthV2)"
                  name="Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut — 1/3 width */}
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Investment Split
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
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 -mt-1">
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

      {/* ─── Bottom: Benchmarks + Formula ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Benchmark Comparison */}
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-4">
            Your CAGR vs Benchmarks
          </h3>
          <div className="space-y-3">
            {benchmarks.map((bm) => {
              const maxVal = Math.max(result.cagr, 25);
              return (
                <div key={bm.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-ink-60">{bm.name}</span>
                    <span className="text-xs font-semibold text-ink">
                      {bm.cagr}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gray-300 transition-all duration-500"
                      style={{
                        width: `${Math.min((bm.cagr / maxVal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {/* Your CAGR */}
            <div className="pt-3 border-t border-ink/5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-authority-green">
                  Your CAGR
                </span>
                <span className="text-xs font-bold text-authority-green">
                  {result.cagr.toFixed(2)}%
                </span>
              </div>
              <div className="h-2.5 bg-action-green/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-action-green transition-all duration-500"
                  style={{
                    width: `${Math.min((result.cagr / Math.max(result.cagr, 25)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-4">
            How CAGR is Calculated
          </h3>
          <div className="bg-canvas rounded-sm p-4 text-center mb-5">
            <p className="text-base font-mono text-ink tracking-wide">
              CAGR = (FV / IV)<sup className="text-xs">1/n</sup> − 1
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-action-green/10 rounded-sm p-3 text-center">
              <p className="text-[10px] text-ink-60 font-medium">FV / IV</p>
              <p className="text-base font-bold text-authority-green mt-1">
                {(finalValue / initialValue).toFixed(2)}x
              </p>
            </div>
            <div className="bg-action-green/10 rounded-sm p-3 text-center">
              <p className="text-[10px] text-ink-60 font-medium">
                Power (1/n)
              </p>
              <p className="text-base font-bold text-authority-green mt-1">
                {(1 / years).toFixed(3)}
              </p>
            </div>
            <div className="bg-action-green/10 rounded-sm p-3 text-center">
              <p className="text-[10px] text-ink-60 font-medium">CAGR</p>
              <p className="text-base font-bold text-authority-green mt-1">
                {result.cagr.toFixed(2)}%
              </p>
            </div>
          </div>
          <p className="text-[11px] text-ink-60 mt-4 leading-relaxed">
            CAGR smooths out investment returns over time, showing the constant
            annual rate needed to grow from initial to final value. Unlike
            absolute returns, it accounts for compounding — making it the best
            metric to compare investments of different durations.
          </p>
        </div>
      </div>
    </div>
  );
}
