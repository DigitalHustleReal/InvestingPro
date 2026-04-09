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
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Briefcase,
  PiggyBank,
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

export function EPFCalculator() {
  const [basicSalary, setBasicSalary] = useState(30000);
  const [da, setDa] = useState(0);
  const [currentAge, setCurrentAge] = useState(28);
  const [retirementAge, setRetirementAge] = useState(58);
  const [currentEPFBalance, setCurrentEPFBalance] = useState(200000);
  const [annualIncrement, setAnnualIncrement] = useState(5);
  const [epfRate, setEpfRate] = useState(8.25); // FY 2024-25 rate
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    const yearsToRetirement = Math.max(retirementAge - currentAge, 1);
    const monthlyRate = epfRate / 100 / 12;

    // EPF contribution: 12% of (Basic + DA) from employee, 12% from employer
    // Employer's 12%: 8.33% goes to EPS (pension), 3.67% goes to EPF
    // So total EPF contribution = employee 12% + employer 3.67% = 15.67% of (Basic+DA)
    let totalEmployeeContribution = 0;
    let totalEmployerEPF = 0;
    let totalInterest = 0;
    let balance = currentEPFBalance;
    let currentBasic = basicSalary + da;

    const yearlyData = [];

    for (let year = 1; year <= yearsToRetirement; year++) {
      const monthlyBasic = currentBasic;
      const employeeMonthly = monthlyBasic * 0.12;
      const employerEPFMonthly = monthlyBasic * 0.0367; // 3.67% to EPF
      const totalMonthly = employeeMonthly + employerEPFMonthly;

      let yearInterest = 0;

      for (let month = 1; month <= 12; month++) {
        balance += totalMonthly;
        const monthInterest = balance * monthlyRate;
        balance += monthInterest;
        yearInterest += monthInterest;
      }

      totalEmployeeContribution += employeeMonthly * 12;
      totalEmployerEPF += employerEPFMonthly * 12;
      totalInterest += yearInterest;

      yearlyData.push({
        year: `Y${year}`,
        age: currentAge + year,
        balance: Math.round(balance),
        contributions: Math.round(
          totalEmployeeContribution + totalEmployerEPF + currentEPFBalance,
        ),
        interest: Math.round(totalInterest),
      });

      // Annual increment
      currentBasic = currentBasic * (1 + annualIncrement / 100);
    }

    const totalContributions =
      totalEmployeeContribution + totalEmployerEPF + currentEPFBalance;

    // EPS pension estimate (simplified)
    // Pension = (Pensionable Salary × Pensionable Service) / 70
    // Max pensionable salary: ₹15,000/mo
    const pensionableSalary = Math.min(basicSalary + da, 15000);
    const pensionableService = Math.min(yearsToRetirement, 35);
    const monthlyPension = Math.round(
      (pensionableSalary * pensionableService) / 70,
    );

    return {
      maturityAmount: Math.round(balance),
      totalEmployeeContribution: Math.round(totalEmployeeContribution),
      totalEmployerEPF: Math.round(totalEmployerEPF),
      totalInterest: Math.round(totalInterest),
      currentEPFBalance,
      totalContributions: Math.round(totalContributions),
      yearlyData,
      yearsToRetirement,
      monthlyPension,
      wealthMultiplier: balance / totalContributions,
    };
  }, [
    basicSalary,
    da,
    currentAge,
    retirementAge,
    currentEPFBalance,
    annualIncrement,
    epfRate,
  ]);

  const pieData = [
    {
      name: "Your Contribution",
      value: result.totalEmployeeContribution,
      color: "#166534",
    },
    { name: "Employer EPF", value: result.totalEmployerEPF, color: "#16a34a" },
    { name: "Interest Earned", value: result.totalInterest, color: "#86efac" },
    ...(result.currentEPFBalance > 0
      ? [
          {
            name: "Existing Balance",
            value: result.currentEPFBalance,
            color: "#d97706",
          },
        ]
      : []),
  ];

  const InputSection = () => (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <IndianRupee size={14} className="text-green-600" />
            Basic Salary + DA (Monthly)
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(basicSalary + da)}
          </span>
        </div>
        <Slider
          value={[basicSalary]}
          onValueChange={([v]) => setBasicSalary(v)}
          min={5000}
          max={300000}
          step={1000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹5K</span>
          <span>₹3L</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-green-600" />
            Current Age
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {currentAge} yrs
          </span>
        </div>
        <Slider
          value={[currentAge]}
          onValueChange={([v]) => setCurrentAge(v)}
          min={18}
          max={55}
          step={1}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>18</span>
          <span>55</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Briefcase size={14} className="text-green-600" />
            Retirement Age
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {retirementAge} yrs
          </span>
        </div>
        <Slider
          value={[retirementAge]}
          onValueChange={([v]) => setRetirementAge(v)}
          min={45}
          max={65}
          step={1}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>45</span>
          <span>65</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <PiggyBank size={14} className="text-green-600" />
            Current EPF Balance
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(currentEPFBalance)}
          </span>
        </div>
        <Slider
          value={[currentEPFBalance]}
          onValueChange={([v]) => setCurrentEPFBalance(v)}
          min={0}
          max={5000000}
          step={10000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹50L</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-green-600" />
            Annual Salary Increment
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {annualIncrement}%
          </span>
        </div>
        <Slider
          value={[annualIncrement]}
          onValueChange={([v]) => setAnnualIncrement(v)}
          min={0}
          max={20}
          step={0.5}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0%</span>
          <span>20%</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Percent size={14} className="text-green-600" />
            EPF Interest Rate
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {epfRate}% p.a.
          </span>
        </div>
        <Slider
          value={[epfRate]}
          onValueChange={([v]) => setEpfRate(v)}
          min={6}
          max={12}
          step={0.05}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>6%</span>
          <span>12%</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <Info size={14} className="inline mr-1" />
        <strong>Current Rate:</strong> EPFO declared 8.25% for FY 2024-25.
        Employee contributes 12%, employer contributes 12% (8.33% to EPS + 3.67%
        to EPF).
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Mobile */}
      <div className="lg:hidden">
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setInputsExpanded(!inputsExpanded)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg mb-1">EPF Calculator</CardTitle>
                <CardDescription className="text-xs">
                  Tap to adjust inputs
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
                <PiggyBank size={20} className="text-green-600" />
                EPF Calculator
              </CardTitle>
              <CardDescription>
                Calculate your EPF corpus at retirement with salary increments
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
                <p className="text-sm text-gray-500 mb-1">
                  EPF Corpus at Retirement
                </p>
                <div className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                  {formatCurrency(result.maturityAmount)}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="text-green-700 bg-green-50 border-green-200 text-xs"
                  >
                    <ShieldCheck size={12} className="inline mr-1" />
                    {result.wealthMultiplier.toFixed(1)}x wealth multiplier
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-amber-700 bg-amber-50 border-amber-200 text-xs"
                  >
                    Retire at {retirementAge}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-green-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Your Contribution</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.totalEmployeeContribution)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Employer EPF</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.totalEmployerEPF)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Interest Earned</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">EPS Pension</p>
                  <p className="text-sm font-bold text-amber-700">
                    {formatCurrency(result.monthlyPension)}/mo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nudge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Insight:</strong>{" "}
            {result.totalInterest >
            result.totalEmployeeContribution + result.totalEmployerEPF
              ? `Interest (${formatCurrency(result.totalInterest)}) exceeds your total contributions! Compounding is doing the heavy lifting.`
              : `Your contributions make up ${((result.totalContributions / result.maturityAmount) * 100).toFixed(0)}% of the corpus. The longer you stay, the more interest dominates.`}{" "}
            EPS pension of {formatCurrency(result.monthlyPension)}/mo is capped
            at ₹15,000 pensionable salary.
          </div>

          {/* Growth Chart */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                EPF Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={result.yearlyData.filter(
                      (_, i) =>
                        i %
                          (result.yearsToRetirement > 25
                            ? 5
                            : result.yearsToRetirement > 15
                              ? 3
                              : 2) ===
                          0 || i === result.yearlyData.length - 1,
                    )}
                  >
                    <defs>
                      <linearGradient
                        id="epfBalance"
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
                      dataKey="contributions"
                      stroke="#166534"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      fill="none"
                      name="Contributions"
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="url(#epfBalance)"
                      name="Total Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Corpus Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Corpus Breakdown</CardTitle>
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
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {pieData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-1.5 text-[10px]"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contribution Breakdown */}
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info size={16} className="text-green-600" />
                  Monthly Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Basic + DA</p>
                    <p className="font-bold">
                      {formatCurrency(basicSalary + da)}/mo
                    </p>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Employee (12%)</span>
                    <span className="font-semibold">
                      {formatCurrency((basicSalary + da) * 0.12)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">
                      Employer to EPF (3.67%)
                    </span>
                    <span className="font-semibold">
                      {formatCurrency((basicSalary + da) * 0.0367)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">
                      Employer to EPS (8.33%)
                    </span>
                    <span className="font-semibold text-amber-700">
                      {formatCurrency((basicSalary + da) * 0.0833)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 font-semibold text-green-700">
                    <span>Total to EPF/mo</span>
                    <span>{formatCurrency((basicSalary + da) * 0.1567)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  EPS contribution (8.33%) goes to pension fund, not EPF. Max
                  EPS salary: ₹15,000/mo. Current EPF rate: {epfRate}% p.a.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
