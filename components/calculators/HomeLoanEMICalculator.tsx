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
  IndianRupee,
  Calendar,
  Percent,
  Home,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  PieChart as PieIcon,
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

export function HomeLoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [prepayment, setPrepayment] = useState(0);
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = tenure * 12;

    // EMI = P × r × (1+r)^n / ((1+r)^n - 1)
    const emi =
      r > 0
        ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : loanAmount / n;

    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;
    const interestToLoanRatio = totalInterest / loanAmount;

    // Year-wise amortization
    const yearlyData = [];
    let balance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let year = 1; year <= tenure; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;

      for (let month = 1; month <= 12; month++) {
        if (balance <= 0) break;
        const monthInterest = balance * r;
        const monthPrincipal = Math.min(emi - monthInterest, balance);
        balance -= monthPrincipal;
        yearPrincipal += monthPrincipal;
        yearInterest += monthInterest;

        // Annual prepayment at year end
        if (month === 12 && prepayment > 0) {
          balance = Math.max(0, balance - prepayment);
        }
      }

      totalPrincipalPaid += yearPrincipal;
      totalInterestPaid += yearInterest;

      yearlyData.push({
        year: `Y${year}`,
        principal: Math.round(totalPrincipalPaid),
        interest: Math.round(totalInterestPaid),
        balance: Math.round(Math.max(0, balance)),
        yearPrincipal: Math.round(yearPrincipal),
        yearInterest: Math.round(yearInterest),
      });

      if (balance <= 0) break;
    }

    // With prepayment: how many years saved
    const actualYears = yearlyData.length;
    const yearsSaved = tenure - actualYears;

    // Tax benefit under Sec 24(b): interest up to ₹2L + Sec 80C: principal up to ₹1.5L
    const annualInterest = totalInterest / tenure;
    const annualPrincipal = loanAmount / tenure;
    const sec24Benefit = Math.min(annualInterest, 200000);
    const sec80CBenefit = Math.min(annualPrincipal, 150000);
    const totalTaxBenefit = (sec24Benefit + sec80CBenefit) * 0.3; // At 30% bracket

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      interestToLoanRatio,
      yearlyData,
      yearsSaved,
      actualYears,
      sec24Benefit,
      sec80CBenefit,
      totalTaxBenefit: Math.round(totalTaxBenefit),
    };
  }, [loanAmount, interestRate, tenure, prepayment]);

  const pieData = [
    { name: "Principal", value: loanAmount, color: "#166534" },
    { name: "Interest", value: result.totalInterest, color: "#dc2626" },
  ];

  // Bank rate comparison
  const bankRates = [
    { bank: "SBI", rate: 8.5 },
    { bank: "HDFC", rate: 8.75 },
    { bank: "ICICI", rate: 8.75 },
    { bank: "Kotak", rate: 8.7 },
    { bank: "Axis", rate: 8.75 },
    { bank: "PNB", rate: 8.5 },
    { bank: "BoB", rate: 8.4 },
  ];

  const InputSection = () => (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <IndianRupee size={14} className="text-green-600" /> Loan Amount
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(loanAmount)}
          </span>
        </div>
        <Slider
          value={[loanAmount]}
          onValueChange={([v]) => setLoanAmount(v)}
          min={500000}
          max={50000000}
          step={100000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹5L</span>
          <span>₹5Cr</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Percent size={14} className="text-green-600" /> Interest Rate
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {interestRate}% p.a.
          </span>
        </div>
        <Slider
          value={[interestRate]}
          onValueChange={([v]) => setInterestRate(v)}
          min={6}
          max={15}
          step={0.05}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>6%</span>
          <span>15%</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-green-600" /> Loan Tenure
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {tenure} Years
          </span>
        </div>
        <Slider
          value={[tenure]}
          onValueChange={([v]) => setTenure(v)}
          min={1}
          max={30}
          step={1}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>1Y</span>
          <span>30Y</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-green-600" /> Annual
            Prepayment
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(prepayment)}/yr
          </span>
        </div>
        <Slider
          value={[prepayment]}
          onValueChange={([v]) => setPrepayment(v)}
          min={0}
          max={2000000}
          step={10000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹20L/yr</span>
        </div>
      </div>

      {prepayment > 0 && result.yearsSaved > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
          <Home size={14} className="inline mr-1" />
          <strong>
            Prepayment saves you {result.yearsSaved} year
            {result.yearsSaved > 1 ? "s" : ""}!
          </strong>{" "}
          Loan closes in {result.actualYears} years instead of {tenure}.
        </div>
      )}

      {/* Bank Rates Quick Reference */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          Current Home Loan Rates
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {bankRates.map((b) => (
            <div key={b.bank} className="flex justify-between text-[11px]">
              <span className="text-gray-500">{b.bank}</span>
              <span
                className={cn(
                  "font-semibold",
                  b.rate <= interestRate ? "text-green-600" : "text-gray-700",
                )}
              >
                {b.rate}%
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">
          Rates as of April 2026. Floating rate, linked to EBLR/RLLR.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="lg:hidden">
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setInputsExpanded(!inputsExpanded)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg mb-1">Home Loan EMI</CardTitle>
                <CardDescription className="text-xs">
                  Tap to adjust loan details
                </CardDescription>
              </div>
              {inputsExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </CardHeader>
          {inputsExpanded && (
            <CardContent className="pt-0">
              <InputSection />
            </CardContent>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="hidden lg:block lg:col-span-2">
          <Card className="border-border shadow-sm rounded-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Home size={20} className="text-green-600" /> Home Loan EMI
                Calculator
              </CardTitle>
              <CardDescription>
                Calculate EMI, total interest, and amortization schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InputSection />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {/* Main Result */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
                <div className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                  {formatCurrency(result.emi)}
                </div>
                <Badge
                  variant="outline"
                  className="mt-2 text-amber-700 bg-amber-50 border-amber-200 text-xs"
                >
                  Interest: {(result.interestToLoanRatio * 100).toFixed(0)}% of
                  principal
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-green-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Loan Amount</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(loanAmount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Total Interest</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Total Payment</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.totalPayment)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Tax Benefit/yr</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(result.totalTaxBenefit)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nudge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Did you know?</strong> You&apos;ll pay{" "}
            {formatCurrency(result.totalInterest)} in interest — that&apos;s{" "}
            {(result.interestToLoanRatio * 100).toFixed(0)}% of your loan
            amount.
            {interestRate > 8.5
              ? ` At current rates, switching to SBI (8.50%) could save you ${formatCurrency(Math.round(((result.emi * tenure * 12 * (interestRate - 8.5)) / 100) * 0.6))}.`
              : " You have a competitive rate. Consider prepaying to reduce total interest."}
          </div>

          {/* Amortization Chart */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 size={16} className="text-green-600" /> Loan Balance
                Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.yearlyData}>
                    <defs>
                      <linearGradient
                        id="hlBalance"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#dc2626"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#dc2626"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="hlPrincipal"
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
                        "",
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fill="url(#hlBalance)"
                      name="Outstanding"
                    />
                    <Area
                      type="monotone"
                      dataKey="principal"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="url(#hlPrincipal)"
                      name="Principal Paid"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Split + Tax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Principal vs Interest
                </CardTitle>
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
                      <span className="text-gray-600">
                        {d.name}: {formatCurrency(d.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info size={16} className="text-green-600" /> Tax Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        Sec 24(b) — Interest
                      </span>
                      <span className="font-semibold text-green-700">
                        {formatCurrency(result.sec24Benefit)}/yr
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Max ₹2L/year on self-occupied property
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        Sec 80C — Principal
                      </span>
                      <span className="font-semibold text-green-700">
                        {formatCurrency(result.sec80CBenefit)}/yr
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Max ₹1.5L/year (shared with other 80C investments)
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-amber-800">
                        Annual Tax Saved (30% bracket)
                      </span>
                      <span className="font-bold text-amber-800">
                        {formatCurrency(result.totalTaxBenefit)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Tax benefits only available under old regime. First-time
                    buyers get additional ₹50K under Sec 80EEA (conditions
                    apply).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
