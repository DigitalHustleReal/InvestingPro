"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  IndianRupee,
  Calendar,
  Percent,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Target,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

export function CAGRCalculator() {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(250000);
  const [years, setYears] = useState(5);
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const formatPercent = (num: number) => `${num.toFixed(2)}%`;

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

  // Year-wise growth at calculated CAGR
  const growthData = useMemo(() => {
    const data = [];
    const rate = result.cagr / 100;
    for (let y = 0; y <= years; y++) {
      const value = initialValue * Math.pow(1 + rate, y);
      data.push({
        year: `Y${y}`,
        value: Math.round(value),
        invested: initialValue,
      });
    }
    return data;
  }, [initialValue, years, result.cagr]);

  // Pie data
  const pieData = [
    { name: "Initial Investment", value: initialValue, color: "#166534" },
    {
      name: "Growth",
      value: Math.max(0, finalValue - initialValue),
      color: "#16a34a",
    },
  ];

  // CAGR rating
  const cagrRating =
    result.cagr >= 20
      ? {
          label: "Excellent",
          color: "text-green-700 bg-green-50 border-green-200",
        }
      : result.cagr >= 15
        ? {
            label: "Very Good",
            color: "text-green-600 bg-green-50 border-green-200",
          }
        : result.cagr >= 12
          ? {
              label: "Good",
              color: "text-amber-700 bg-amber-50 border-amber-200",
            }
          : result.cagr >= 8
            ? {
                label: "Average",
                color: "text-orange-700 bg-orange-50 border-orange-200",
              }
            : {
                label: "Below Average",
                color: "text-red-700 bg-red-50 border-red-200",
              };

  // Benchmark comparison
  const benchmarks = [
    { name: "Nifty 50 (10Y avg)", cagr: 12.5 },
    { name: "FD (SBI)", cagr: 7.0 },
    { name: "Gold (10Y avg)", cagr: 10.5 },
    { name: "PPF", cagr: 7.1 },
    { name: "Inflation", cagr: 5.5 },
  ];

  const InputSection = () => (
    <div className="space-y-6">
      {/* Initial Value */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <IndianRupee size={14} className="text-green-600" />
            Initial Investment
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(initialValue)}
          </span>
        </div>
        <Slider
          value={[initialValue]}
          onValueChange={([v]) => setInitialValue(v)}
          min={1000}
          max={10000000}
          step={1000}
          className="mt-1"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹1K</span>
          <span>₹1Cr</span>
        </div>
      </div>

      {/* Final Value */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Target size={14} className="text-green-600" />
            Final Value
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(finalValue)}
          </span>
        </div>
        <Slider
          value={[finalValue]}
          onValueChange={([v]) => setFinalValue(v)}
          min={1000}
          max={50000000}
          step={1000}
          className="mt-1"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹1K</span>
          <span>₹5Cr</span>
        </div>
      </div>

      {/* Duration */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-green-600" />
            Investment Duration
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {years} {years === 1 ? "Year" : "Years"}
          </span>
        </div>
        <Slider
          value={[years]}
          onValueChange={([v]) => setYears(v)}
          min={1}
          max={30}
          step={1}
          className="mt-1"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>1Y</span>
          <span>30Y</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Mobile: Collapsible Inputs */}
      <div className="lg:hidden">
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setInputsExpanded(!inputsExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">CAGR Calculator</CardTitle>
                <CardDescription className="text-xs">
                  Tap to adjust values
                </CardDescription>
              </div>
              {inputsExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {inputsExpanded && (
            <CardContent className="space-y-4 pt-0">
              <InputSection />
            </CardContent>
          )}
        </Card>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs (Desktop) */}
        <div className="hidden lg:block lg:col-span-2">
          <Card className="border-border shadow-sm rounded-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 size={20} className="text-green-600" />
                CAGR Calculator
              </CardTitle>
              <CardDescription>
                Calculate Compound Annual Growth Rate of your investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InputSection />
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {/* Main Result Card — Groww-style large number */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Your CAGR</p>
                <div className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                  {formatPercent(result.cagr)}
                </div>
                <Badge
                  variant="outline"
                  className={cn("mt-3 text-xs font-semibold", cagrRating.color)}
                >
                  {cagrRating.label}
                </Badge>
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-green-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Initial</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(initialValue)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Final</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(finalValue)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Absolute Return</p>
                  <p className="text-sm font-bold text-green-700">
                    {result.absoluteReturnPct.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nudge */}
          {result.cagr > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
              <strong>Insight:</strong>{" "}
              {result.cagr >= 15
                ? `Your investment grew at ${formatPercent(result.cagr)} — beating Nifty 50's 10-year average of 12.5%. Impressive!`
                : result.cagr >= 8
                  ? `Your growth of ${formatPercent(result.cagr)} is decent but below equity market averages. Consider diversifying into mutual funds.`
                  : `At ${formatPercent(result.cagr)}, your money is barely beating inflation (5.5%). A SIP in index funds could significantly improve returns.`}
            </div>
          )}

          {/* Growth Chart */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                Growth Trajectory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient
                        id="cagrGrowth"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#16a34a"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#16a34a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="year"
                      fontSize={11}
                      tick={{ fill: "#999" }}
                    />
                    <YAxis
                      fontSize={11}
                      tick={{ fill: "#999" }}
                      tickFormatter={(v) =>
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
                      labelFormatter={(label) => `Year ${label}`}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="url(#cagrGrowth)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      stroke="#166534"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Investment Split — Donut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Investment Split</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] flex items-center justify-center">
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
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) =>
                          formatCurrency(Number(value))
                        }
                        contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  {pieData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benchmark Comparison */}
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">vs Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benchmarks.map((bm) => (
                    <div key={bm.name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">
                            {bm.name}
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {bm.cagr}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              result.cagr >= bm.cagr
                                ? "bg-green-500"
                                : "bg-gray-300",
                            )}
                            style={{
                              width: `${Math.min((bm.cagr / Math.max(result.cagr, 25)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Your CAGR bar */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-green-700">
                          Your CAGR
                        </span>
                        <span className="text-xs font-bold text-green-700">
                          {formatPercent(result.cagr)}
                        </span>
                      </div>
                      <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{
                            width: `${Math.min((result.cagr / 25) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CAGR Formula Explainer */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Info size={16} className="text-green-600" />
                How CAGR is Calculated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
                <p className="text-lg font-mono text-gray-700">
                  CAGR = (Final Value / Initial Value)
                  <sup>1/n</sup> - 1
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Final / Initial</p>
                  <p className="font-bold text-green-700">
                    {(finalValue / initialValue).toFixed(2)}x
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Power (1/n)</p>
                  <p className="font-bold text-green-700">
                    1/{years} = {(1 / years).toFixed(3)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">CAGR</p>
                  <p className="font-bold text-green-700">
                    {formatPercent(result.cagr)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                CAGR (Compound Annual Growth Rate) smooths out the return of an
                investment over time, showing the rate at which it would have
                grown if it grew at a steady rate. Unlike absolute returns, CAGR
                accounts for compounding and is the best way to compare
                investments of different durations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
