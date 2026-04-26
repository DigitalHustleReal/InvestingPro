"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  Percent,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Trophy,
  Sparkles,
  CheckCircle2,
  Home,
  Car,
  GraduationCap,
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
import { toast } from "sonner";

export function KVPCalculator() {
  const [investment, setInvestment] = useState(50000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [inputsExpanded, setInputsExpanded] = useState(false);
  const [showAllYears, setShowAllYears] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("Report sent! Check your inbox.");
    }, 1500);
  };

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  // KVP doubles the investment
  const r = interestRate / 100;
  const exactYearsToDouble = Math.log(2) / Math.log(1 + r);
  const totalMonths = Math.ceil(exactYearsToDouble * 12);
  const doublingYears = Math.floor(totalMonths / 12);
  const doublingMonths = totalMonths % 12;
  const maturityAmount = investment * 2;

  // Year-by-year growth data (show 10 years)
  const displayYears = Math.max(10, doublingYears + 1);
  const yearlyData = Array.from({ length: displayYears }, (_, i) => {
    const yr = i + 1;
    const value = investment * Math.pow(1 + r, yr);
    const interest = value - investment;
    return {
      year: yr,
      interest: Math.round(interest),
      total: Math.round(value),
    };
  });

  const growthData = [
    { year: "Y0", value: Math.round(investment) },
    ...yearlyData.map((d) => ({ year: `Y${d.year}`, value: d.total })),
  ];

  const chartData = [
    { name: "Principal", value: Math.round(investment), color: "#166534" },
    {
      name: "Interest Earned",
      value: Math.round(maturityAmount - investment),
      color: "#16a34a",
    },
  ];

  const presets = [
    { label: "₹1,000", amount: 1000 },
    { label: "₹10,000", amount: 10000 },
    { label: "₹50,000", amount: 50000 },
    { label: "₹1 Lakh", amount: 100000 },
    { label: "₹5 Lakh", amount: 500000 },
  ];

  const inputSliders = (
    <div className="space-y-4">
      {/* Investment */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-semibold text-foreground">
            One-time Investment
          </Label>
          <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-28 border-0 bg-transparent p-0 text-right text-sm font-bold focus-visible:ring-0 text-foreground"
            />
          </div>
        </div>
        <Slider
          value={[investment]}
          onValueChange={(v) => setInvestment(v[0])}
          min={1000}
          max={1000000}
          step={1000}
          className="py-2"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Min: ₹1,000</span>
          <span>₹10 L</span>
        </div>
      </div>

      {/* Rate — optional expected rate slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-semibold text-foreground">
            Expected Rate (% p.a.)
          </Label>
          <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
            <Percent className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">
              {interestRate}%
            </span>
          </div>
        </div>
        <Slider
          value={[interestRate]}
          onValueChange={(v) => setInterestRate(v[0])}
          min={6}
          max={9}
          step={0.1}
          className="py-2"
        />
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>6%</span>
          <span className="bg-indian-gold/20 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
            Current Rate: 7.5% p.a.
          </span>
          <span>9%</span>
        </div>
      </div>

      {/* Info box */}
      <div className="p-4 bg-muted/50 rounded-sm border border-border flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-foreground mb-1">
            Money Doubling Scheme
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            At {interestRate}%, your KVP doubles in{" "}
            <span className="font-bold text-foreground">
              {doublingYears} years &amp; {doublingMonths} months
            </span>{" "}
            ({totalMonths} months total).
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* SECTION 1 — Mobile Collapsible */}
      <div className="lg:hidden">
        <Card className="border-border shadow-sm rounded-sm">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setInputsExpanded(!inputsExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">KVP Calculator</CardTitle>
                <CardDescription className="text-xs">
                  Tap to adjust inputs
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
              <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg mb-4">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">Invested</p>
                  <p className="text-xs font-bold text-foreground">
                    {formatCurrency(investment)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">Rate</p>
                  <p className="text-xs font-bold text-foreground">
                    {interestRate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground">
                    Doubles In
                  </p>
                  <p className="text-xs font-bold text-foreground">
                    {doublingYears}Y {doublingMonths}M
                  </p>
                </div>
              </div>
              {inputSliders}
            </CardContent>
          )}
        </Card>
      </div>

      {/* SECTION 2 — Desktop 2-col grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Input Card */}
        <Card className="hidden lg:block border-border shadow-sm rounded-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">KVP Calculator</CardTitle>
                <CardDescription>
                  Kisan Vikas Patra — Government guaranteed doubling scheme
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <Badge
                  variant="secondary"
                  className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Govt Guarantee
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-indian-gold/10 text-amber-700 border-indian-gold/30 text-[10px]"
                >
                  2x Returns
                </Badge>
              </div>
            </div>
            {/* Preset Scenarios */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                Quick Examples:
              </span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setInvestment(preset.amount)}
                  className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-md font-medium transition-colors border border-border"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{inputSliders}</CardContent>
        </Card>

        {/* Right: Results Card */}
        <Card
          id="calculator-results"
          className="order-first lg:order-none border-border shadow-sm rounded-sm bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardContent className="pt-4 sm:pt-6 relative z-10">
            {/* 3 stat boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                  INVESTED
                </p>
                <p className="text-base sm:text-lg font-extrabold text-foreground">
                  {formatCurrency(investment)}
                </p>
              </div>
              <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                  TIME TO DOUBLE
                </p>
                <p className="text-base sm:text-lg font-extrabold text-primary">
                  {doublingYears}Y {doublingMonths}M
                </p>
              </div>
              <div className="text-center p-6 md:p-8 sm:p-4 bg-card rounded-sm shadow-sm border border-border">
                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 sm:mb-2">
                  MATURITY
                </p>
                <p className="text-base sm:text-lg font-extrabold text-primary">
                  {formatCurrency(maturityAmount)}
                </p>
              </div>
            </div>
            {/* Months badge */}
            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs bg-muted px-3 py-1.5 rounded-full border border-border text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-primary" />
                {totalMonths} months total · 2x guaranteed
              </span>
            </div>
            {/* Pie chart */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[280px] h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      dataKey="value"
                      strokeWidth={0}
                      paddingAngle={5}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={
                        ((value: number | undefined) =>
                          value !== undefined
                            ? formatCurrency(value)
                            : "") as never
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 -mt-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3 — Bottom 2-col grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth Projection Chart */}
        <Card className="border-border shadow-sm rounded-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Growth Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient
                      id="colorKVPValue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--border))"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--border))"
                    tickFormatter={(v) =>
                      v >= 100000 ? `${(v / 100000).toFixed(0)}L` : String(v)
                    }
                  />
                  <Tooltip
                    formatter={
                      ((v: number | undefined) =>
                        v !== undefined ? formatCurrency(v) : "") as never
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#166534"
                    fill="url(#colorKVPValue)"
                    strokeWidth={2}
                    name="Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Year-by-Year Breakdown */}
        <Card className="border-border shadow-sm rounded-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Year-by-Year Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-primary-50 rounded-sm border border-primary-100">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    TOTAL INTEREST
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(Math.round(maturityAmount - investment))}
                  </p>
                </div>
                <div className="p-4 bg-primary-50 rounded-sm border border-primary-100">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    TOTAL MONTHS
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {totalMonths} months
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <div className="min-w-full">
                  <div className="overflow-hidden rounded-sm border border-border">
                    <table className="w-full min-w-full sm:min-w-[500px]">
                      <thead className="bg-muted border-b border-border">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Year
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Interest
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(showAllYears
                          ? yearlyData
                          : yearlyData.slice(0, 10)
                        ).map((row, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-3 py-2.5 text-sm font-semibold text-foreground">
                              Year {row.year}
                            </td>
                            <td className="px-3 py-2.5 text-sm text-right font-semibold text-primary">
                              {formatCurrency(row.interest)}
                            </td>
                            <td className="px-3 py-2.5 text-sm text-right font-medium text-muted-foreground">
                              {formatCurrency(row.total)}
                            </td>
                          </tr>
                        ))}
                        {!showAllYears && yearlyData.length > 10 && (
                          <tr
                            className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setShowAllYears(true)}
                          >
                            <td
                              colSpan={3}
                              className="px-3 py-3 text-xs text-center text-primary-600 font-bold"
                            >
                              Show {yearlyData.length - 10} more years...
                            </td>
                          </tr>
                        )}
                        {showAllYears && (
                          <tr
                            className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setShowAllYears(false)}
                          >
                            <td
                              colSpan={3}
                              className="px-3 py-3 text-xs text-center text-primary-600 font-bold"
                            >
                              Show Less
                            </td>
                          </tr>
                        )}
                        <tr className="bg-primary/10 border-t-2 border-primary/20">
                          <td className="px-3 py-3 text-sm font-bold text-foreground">
                            Maturity
                          </td>
                          <td className="px-3 py-3 text-sm text-right font-bold text-primary">
                            {formatCurrency(
                              Math.round(maturityAmount - investment),
                            )}
                          </td>
                          <td className="px-3 py-3 text-sm text-right font-bold text-primary">
                            {formatCurrency(maturityAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* What This Means */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 dark:from-emerald-950/30 dark:to-emerald-950/30 rounded-sm p-5 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Trophy className="w-24 h-24 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> What This Means
                </h3>
                <p className="text-lg font-medium text-emerald-900 dark:text-emerald-100 mb-3">
                  Your {formatCurrency(investment)} KVP will double to{" "}
                  {formatCurrency(maturityAmount)} in ~{totalMonths} months (
                  {doublingYears} years {doublingMonths} months) — a
                  government-guaranteed 2x return!
                </p>
                <div className="flex flex-wrap gap-2">
                  {maturityAmount >= 1000000 && (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                      <Home className="w-3 h-3" /> Home Down Payment
                    </span>
                  )}
                  {maturityAmount >= 500000 && (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                      <Car className="w-3 h-3" /> Vehicle Purchase
                    </span>
                  )}
                  {maturityAmount >= 200000 && (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                      <GraduationCap className="w-3 h-3" /> Education Fund
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">
                    <TrendingUp className="w-3 h-3" /> 100% Return Guaranteed
                  </span>
                </div>
              </div>

              {/* Lead Capture */}
              <div className="p-5 bg-card rounded-sm border border-border shadow-sm mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-600" />
                    Get Detailed Report (Free)
                  </h3>
                  <Badge className="bg-success-100 text-success-700 hover:bg-success-200 border-0 text-[10px]">
                    PDF
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Receive a complete KVP analysis with year-wise growth
                  projection, doubling timeline, and comparison with other
                  government schemes.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your email"
                    className="h-9 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button
                    size="sm"
                    className="h-9 bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  <Lock className="w-3 h-3 inline mr-1" /> No spam. Unsubscribe
                  anytime.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
