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
  Home,
  MapPin,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calculator,
  TrendingDown,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type CityType = "metro" | "non-metro";

export function HRACalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(18000);
  const [cityType, setCityType] = useState<CityType>("metro");
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    const annualBasic = (basicSalary + da) * 12;
    const annualHRA = hraReceived * 12;
    const annualRent = rentPaid * 12;

    // HRA exemption = MINIMUM of:
    // 1. Actual HRA received
    // 2. 50% of (Basic+DA) for metro / 40% for non-metro
    // 3. Rent paid - 10% of (Basic+DA)
    const rule1 = annualHRA;
    const rule2 = annualBasic * (cityType === "metro" ? 0.5 : 0.4);
    const rule3 = Math.max(0, annualRent - annualBasic * 0.1);

    const exemption = Math.min(rule1, rule2, rule3);
    const taxableHRA = Math.max(0, annualHRA - exemption);

    // Determine which rule is the limiting factor
    const limitingRule = exemption === rule1 ? 1 : exemption === rule2 ? 2 : 3;

    // Tax savings estimate (30% bracket)
    const taxSaved30 = exemption * 0.3;
    const taxSaved20 = exemption * 0.2;

    return {
      annualBasic,
      annualHRA,
      annualRent,
      rule1,
      rule2,
      rule3,
      exemption,
      taxableHRA,
      limitingRule,
      taxSaved30,
      taxSaved20,
      monthlyExemption: exemption / 12,
      monthlyTaxable: taxableHRA / 12,
    };
  }, [basicSalary, da, hraReceived, rentPaid, cityType]);

  const pieData = [
    { name: "Tax-Exempt HRA", value: result.exemption, color: "#166534" },
    ...(result.taxableHRA > 0
      ? [{ name: "Taxable HRA", value: result.taxableHRA, color: "#dc2626" }]
      : []),
  ];

  const ruleComparison = [
    { label: "Actual HRA Received", value: result.rule1, rule: 1 },
    {
      label: `${cityType === "metro" ? "50%" : "40%"} of Basic + DA`,
      value: result.rule2,
      rule: 2,
    },
    { label: "Rent - 10% of Basic + DA", value: result.rule3, rule: 3 },
  ];

  const InputSection = () => (
    <div className="space-y-5">
      {/* City Toggle */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          City Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["metro", "non-metro"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setCityType(type)}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-medium transition-all border",
                cityType === type
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-300",
              )}
            >
              {type === "metro" ? "Metro (50%)" : "Non-Metro (40%)"}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          Metro: Delhi, Mumbai, Chennai, Kolkata. Non-metro: All other cities.
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <IndianRupee size={14} className="text-green-600" /> Basic Salary
            (Monthly)
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(basicSalary)}
          </span>
        </div>
        <Slider
          value={[basicSalary]}
          onValueChange={([v]) => setBasicSalary(v)}
          min={10000}
          max={500000}
          step={1000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹10K</span>
          <span>₹5L</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Home size={14} className="text-green-600" /> HRA Received (Monthly)
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(hraReceived)}
          </span>
        </div>
        <Slider
          value={[hraReceived]}
          onValueChange={([v]) => setHraReceived(v)}
          min={0}
          max={200000}
          step={500}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹2L</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MapPin size={14} className="text-green-600" /> Rent Paid (Monthly)
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(rentPaid)}
          </span>
        </div>
        <Slider
          value={[rentPaid]}
          onValueChange={([v]) => setRentPaid(v)}
          min={0}
          max={200000}
          step={500}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹2L</span>
        </div>
      </div>

      {rentPaid > 100000 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <Info size={14} className="inline mr-1" />
          <strong>Note:</strong> Rent above ₹1,00,000/month requires
          landlord&apos;s PAN for tax exemption claim.
        </div>
      )}
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
                <CardTitle className="text-lg mb-1">HRA Calculator</CardTitle>
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
                <Home size={20} className="text-green-600" /> HRA Exemption
                Calculator
              </CardTitle>
              <CardDescription>
                Calculate tax-exempt HRA under Section 10(13A)
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
                  Annual HRA Exemption
                </p>
                <div className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                  {formatCurrency(result.exemption)}
                </div>
                <Badge
                  variant="outline"
                  className="mt-2 text-green-700 bg-green-50 border-green-200 text-xs"
                >
                  <ShieldCheck size={12} className="inline mr-1" />
                  Tax-free under Section 10(13A)
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-green-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Monthly Exempt</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(result.monthlyExemption)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Monthly Taxable</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(result.monthlyTaxable)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Tax Saved (30%)</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(result.taxSaved30)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rule Comparison — the key differentiator */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator size={16} className="text-green-600" />
                Three-Rule Comparison (Lowest Wins)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ruleComparison.map((r) => (
                  <div
                    key={r.rule}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border",
                      r.rule === result.limitingRule
                        ? "bg-green-50 border-green-300"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                        r.rule === result.limitingRule
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {r.rule}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{r.label}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          r.rule === result.limitingRule
                            ? "text-green-700"
                            : "text-gray-600",
                        )}
                      >
                        {formatCurrency(r.value)}
                      </p>
                      {r.rule === result.limitingRule && (
                        <span className="text-[10px] text-green-600 font-semibold">
                          LOWEST = EXEMPT
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nudge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Optimization Tip:</strong>{" "}
            {result.limitingRule === 3 && rentPaid < basicSalary * 0.5
              ? "Your rent is low relative to salary. Increasing rent (or getting rent receipts) would maximize HRA exemption."
              : result.limitingRule === 1
                ? "Your actual HRA is the bottleneck. Ask your employer to restructure salary with higher HRA component."
                : `Rule ${result.limitingRule} is limiting your exemption. In the new tax regime, HRA exemption is not available — compare both regimes.`}
          </div>

          {/* Split + Tax Savings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">HRA Split</CardTitle>
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

            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown size={16} className="text-green-600" /> Tax
                  Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">
                      If you&apos;re in 30% bracket
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(result.taxSaved30)}
                    </p>
                    <p className="text-[10px] text-gray-400">saved per year</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">
                      If you&apos;re in 20% bracket
                    </p>
                    <p className="text-xl font-bold text-gray-700">
                      {formatCurrency(result.taxSaved20)}
                    </p>
                    <p className="text-[10px] text-gray-400">saved per year</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  HRA exemption is only available under the old tax regime. New
                  regime (Section 115BAC) does not allow HRA deduction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
