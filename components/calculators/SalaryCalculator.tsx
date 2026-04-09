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
import { Switch } from "@/components/ui/switch";
import {
  IndianRupee,
  Briefcase,
  Home,
  Percent,
  Info,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  ShieldCheck,
  Receipt,
  Building2,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type TaxRegime = "old" | "new";

export function SalaryCalculator() {
  const [annualCTC, setAnnualCTC] = useState(1200000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [hraPercent, setHraPercent] = useState(20);
  const [specialAllowance, setSpecialAllowance] = useState(true);
  const [isMetro, setIsMetro] = useState(true);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("new");
  const [investments80C, setInvestments80C] = useState(150000);
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    const monthlyCTC = annualCTC / 12;
    const basic = annualCTC * (basicPercent / 100);
    const monthlyBasic = basic / 12;
    const hra = annualCTC * (hraPercent / 100);

    // EPF: 12% of basic (capped at ₹15,000 basic for PF purposes in some companies)
    const epfEmployee = basic * 0.12;
    const epfEmployer = basic * 0.12;

    // Professional Tax: ₹2,400/year for most states (₹200/month)
    const professionalTax = 2400;

    // Gratuity (employer cost): 4.81% of basic
    const gratuity = basic * 0.0481;

    // Special Allowance = CTC - Basic - HRA - Employer EPF - Gratuity
    const specialAllow = Math.max(
      0,
      annualCTC - basic - hra - epfEmployer - gratuity,
    );

    // Gross Salary = CTC - Employer EPF - Gratuity
    const grossSalary = annualCTC - epfEmployer - gratuity;

    // HRA Exemption (old regime only)
    const annualRent = monthlyRent * 12;
    const hraExemption =
      taxRegime === "old"
        ? Math.min(
            hra,
            basic * (isMetro ? 0.5 : 0.4),
            Math.max(0, annualRent - basic * 0.1),
          )
        : 0;

    // Taxable Income calculation
    let taxableIncome = grossSalary;

    if (taxRegime === "old") {
      // Old regime deductions
      const standardDeduction = 50000;
      taxableIncome -= standardDeduction;
      taxableIncome -= hraExemption;
      taxableIncome -= Math.min(investments80C, 150000); // 80C
      taxableIncome -= epfEmployee; // Already in 80C but counted separately for clarity
      // Note: EPF contribution is part of 80C limit
    } else {
      // New regime: only standard deduction of ₹75,000 (Budget 2024)
      const standardDeduction = 75000;
      taxableIncome -= standardDeduction;
    }

    taxableIncome = Math.max(0, taxableIncome);

    // Income Tax calculation
    let tax = 0;
    if (taxRegime === "new") {
      // New regime slabs (FY 2024-25+)
      // 0-3L: 0%, 3-7L: 5%, 7-10L: 10%, 10-12L: 15%, 12-15L: 20%, 15L+: 30%
      const slabs = [
        { limit: 300000, rate: 0 },
        { limit: 700000, rate: 0.05 },
        { limit: 1000000, rate: 0.1 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 },
      ];
      let remaining = taxableIncome;
      let prevLimit = 0;
      for (const slab of slabs) {
        const slabAmount = Math.min(remaining, slab.limit - prevLimit);
        if (slabAmount <= 0) break;
        tax += slabAmount * slab.rate;
        remaining -= slabAmount;
        prevLimit = slab.limit;
      }
      // Rebate u/s 87A: No tax if income <= ₹7L (new regime)
      if (taxableIncome <= 700000) tax = 0;
    } else {
      // Old regime slabs
      // 0-2.5L: 0%, 2.5-5L: 5%, 5-10L: 20%, 10L+: 30%
      const slabs = [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 },
      ];
      let remaining = taxableIncome;
      let prevLimit = 0;
      for (const slab of slabs) {
        const slabAmount = Math.min(remaining, slab.limit - prevLimit);
        if (slabAmount <= 0) break;
        tax += slabAmount * slab.rate;
        remaining -= slabAmount;
        prevLimit = slab.limit;
      }
      // Rebate u/s 87A: No tax if income <= ₹5L (old regime)
      if (taxableIncome <= 500000) tax = 0;
    }

    // Cess: 4% on tax
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    // Net Take-Home
    const annualTakeHome =
      grossSalary - epfEmployee - professionalTax - totalTax;
    const monthlyTakeHome = annualTakeHome / 12;

    return {
      monthlyCTC,
      basic,
      hra,
      epfEmployee,
      epfEmployer,
      gratuity,
      specialAllow,
      grossSalary,
      professionalTax,
      hraExemption,
      taxableIncome,
      tax,
      cess,
      totalTax,
      annualTakeHome,
      monthlyTakeHome,
      takeHomePercent: (annualTakeHome / annualCTC) * 100,
    };
  }, [
    annualCTC,
    basicPercent,
    hraPercent,
    isMetro,
    monthlyRent,
    taxRegime,
    investments80C,
    specialAllowance,
  ]);

  const pieData = [
    { name: "Take Home", value: result.annualTakeHome, color: "#166534" },
    { name: "Income Tax + Cess", value: result.totalTax, color: "#dc2626" },
    { name: "EPF (Employee)", value: result.epfEmployee, color: "#16a34a" },
    { name: "Prof. Tax", value: result.professionalTax, color: "#d97706" },
    { name: "EPF (Employer)", value: result.epfEmployer, color: "#86efac" },
    { name: "Gratuity", value: result.gratuity, color: "#a3e635" },
  ];

  const InputSection = () => (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <IndianRupee size={14} className="text-green-600" /> Annual CTC
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(annualCTC)}
          </span>
        </div>
        <Slider
          value={[annualCTC]}
          onValueChange={([v]) => setAnnualCTC(v)}
          min={300000}
          max={10000000}
          step={10000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹3L</span>
          <span>₹1Cr</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-gray-700">Basic %</label>
            <span className="text-xs font-bold text-green-700">
              {basicPercent}%
            </span>
          </div>
          <Slider
            value={[basicPercent]}
            onValueChange={([v]) => setBasicPercent(v)}
            min={20}
            max={60}
            step={1}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-gray-700">HRA %</label>
            <span className="text-xs font-bold text-green-700">
              {hraPercent}%
            </span>
          </div>
          <Slider
            value={[hraPercent]}
            onValueChange={([v]) => setHraPercent(v)}
            min={0}
            max={50}
            step={1}
          />
        </div>
      </div>

      {/* Tax Regime Toggle */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Tax Regime
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["new", "old"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTaxRegime(r)}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-all border",
                taxRegime === r
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-300",
              )}
            >
              {r === "new" ? "New Regime" : "Old Regime"}
            </button>
          ))}
        </div>
      </div>

      {taxRegime === "old" && (
        <>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Building2 size={14} className="text-green-600" /> Metro City?
            </label>
            <Switch checked={isMetro} onCheckedChange={setIsMetro} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Home size={14} className="text-green-600" /> Monthly Rent
              </label>
              <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                {formatCurrency(monthlyRent)}
              </span>
            </div>
            <Slider
              value={[monthlyRent]}
              onValueChange={([v]) => setMonthlyRent(v)}
              min={0}
              max={100000}
              step={500}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-600" /> 80C
                Investments
              </label>
              <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                {formatCurrency(investments80C)}
              </span>
            </div>
            <Slider
              value={[investments80C]}
              onValueChange={([v]) => setInvestments80C(v)}
              min={0}
              max={150000}
              step={5000}
            />
          </div>
        </>
      )}
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
                <CardTitle className="text-lg mb-1">
                  Salary Calculator
                </CardTitle>
                <CardDescription className="text-xs">
                  Tap to adjust CTC & components
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
                <Briefcase size={20} className="text-green-600" /> Salary
                Calculator
              </CardTitle>
              <CardDescription>
                CTC to In-Hand salary breakdown with tax
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
                  Monthly In-Hand Salary
                </p>
                <div className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                  {formatCurrency(result.monthlyTakeHome)}
                </div>
                <Badge
                  variant="outline"
                  className="mt-2 text-green-700 bg-green-50 border-green-200 text-xs"
                >
                  {result.takeHomePercent.toFixed(1)}% of CTC
                </Badge>
                <Badge
                  variant="outline"
                  className="mt-2 ml-2 text-gray-600 bg-gray-50 border-gray-200 text-xs"
                >
                  {taxRegime === "new" ? "New" : "Old"} Regime
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-green-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Annual CTC</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(annualCTC)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Annual Take-Home</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(result.annualTakeHome)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Total Tax</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(result.totalTax)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTC Breakdown Table */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt size={16} className="text-green-600" /> Complete Salary
                Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 text-sm">
                <div className="bg-green-50 rounded-lg p-2.5 flex justify-between font-semibold">
                  <span>Annual CTC</span>
                  <span>{formatCurrency(annualCTC)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5">
                  <span className="text-gray-600">
                    Basic Salary ({basicPercent}%)
                  </span>
                  <span>{formatCurrency(result.basic)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5">
                  <span className="text-gray-600">HRA ({hraPercent}%)</span>
                  <span>{formatCurrency(result.hra)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5">
                  <span className="text-gray-600">Special Allowance</span>
                  <span>{formatCurrency(result.specialAllow)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5 text-gray-400">
                  <span>(-) Employer EPF</span>
                  <span>-{formatCurrency(result.epfEmployer)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5 text-gray-400">
                  <span>(-) Gratuity</span>
                  <span>-{formatCurrency(result.gratuity)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 flex justify-between font-semibold border-t border-gray-200 mt-2">
                  <span>Gross Salary</span>
                  <span>{formatCurrency(result.grossSalary)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5 text-red-600">
                  <span>(-) Employee EPF</span>
                  <span>-{formatCurrency(result.epfEmployee)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5 text-red-600">
                  <span>(-) Professional Tax</span>
                  <span>-{formatCurrency(result.professionalTax)}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2.5 text-red-600">
                  <span>(-) Income Tax + Cess</span>
                  <span>-{formatCurrency(result.totalTax)}</span>
                </div>
                {taxRegime === "old" && result.hraExemption > 0 && (
                  <div className="flex justify-between py-1.5 px-2.5 text-green-600">
                    <span>(+) HRA Exemption (tax saved)</span>
                    <span>+{formatCurrency(result.hraExemption * 0.3)}</span>
                  </div>
                )}
                <div className="bg-green-100 rounded-lg p-3 flex justify-between font-bold text-green-800 border-t border-green-200 mt-2">
                  <span>Annual Take-Home</span>
                  <span>{formatCurrency(result.annualTakeHome)}</span>
                </div>
                <div className="bg-green-600 text-white rounded-lg p-3 flex justify-between font-bold text-lg">
                  <span>Monthly In-Hand</span>
                  <span>{formatCurrency(result.monthlyTakeHome)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTC Split Pie */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Where Your CTC Goes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData
                        .filter((d) => d.value > 0)
                        .map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value))}
                      contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {pieData
                  .filter((d) => d.value > 0)
                  .map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-1.5 text-[10px]"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-gray-600">
                        {d.name}: {((d.value / annualCTC) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
