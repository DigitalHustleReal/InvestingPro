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
  Briefcase,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Scale,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
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

type EmployeeType = "private" | "govt";

export function GratuityCalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(10000);
  const [yearsOfService, setYearsOfService] = useState(10);
  const [employeeType, setEmployeeType] = useState<EmployeeType>("private");
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    const lastDrawnSalary = basicSalary + da;

    // Gratuity Formula (Payment of Gratuity Act, 1972)
    // Private sector: Gratuity = (15 × Last Drawn Salary × Years of Service) / 26
    // Govt sector: Gratuity = (15 × Last Drawn Salary × Years of Service) / 30
    // Maximum gratuity: ₹25,00,000 (updated 2024)

    const divisor = employeeType === "govt" ? 30 : 26;
    const gratuity = (15 * lastDrawnSalary * yearsOfService) / divisor;
    const maxGratuity = 2500000;
    const cappedGratuity = Math.min(gratuity, maxGratuity);
    const isCapped = gratuity > maxGratuity;

    // Tax exemption: Gratuity up to ₹25L is tax-free for govt employees
    // For private: least of (actual gratuity, 15/26 formula, ₹25L) is exempt
    const taxExempt = Math.min(cappedGratuity, maxGratuity);
    const taxable = Math.max(0, gratuity - taxExempt);

    // Year-wise gratuity accrual
    const yearlyAccrual = [];
    for (let y = 1; y <= Math.min(yearsOfService, 40); y++) {
      const yearGratuity = (15 * lastDrawnSalary * y) / divisor;
      yearlyAccrual.push({
        year: `${y}Y`,
        gratuity: Math.min(yearGratuity, maxGratuity),
      });
    }

    return {
      lastDrawnSalary,
      gratuity,
      cappedGratuity,
      isCapped,
      taxExempt,
      taxable,
      yearlyAccrual,
      monthlyEquivalent: cappedGratuity / yearsOfService / 12,
    };
  }, [basicSalary, da, yearsOfService, employeeType]);

  // Pie data
  const pieData = [
    { name: "Tax-Free", value: result.taxExempt, color: "#166534" },
    ...(result.taxable > 0
      ? [{ name: "Taxable", value: result.taxable, color: "#dc2626" }]
      : []),
  ];

  const InputSection = () => (
    <div className="space-y-6">
      {/* Employee Type Toggle */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Employee Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["private", "govt"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setEmployeeType(type)}
              className={cn(
                "px-4 py-2.5 rounded-lg text-sm font-medium transition-all border",
                employeeType === type
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-300",
              )}
            >
              {type === "private" ? "Private Sector" : "Government"}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Salary */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <IndianRupee size={14} className="text-green-600" />
            Basic Salary (Monthly)
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(basicSalary)}
          </span>
        </div>
        <Slider
          value={[basicSalary]}
          onValueChange={([v]) => setBasicSalary(v)}
          min={5000}
          max={500000}
          step={1000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹5K</span>
          <span>₹5L</span>
        </div>
      </div>

      {/* DA */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Briefcase size={14} className="text-green-600" />
            Dearness Allowance (DA)
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(da)}
          </span>
        </div>
        <Slider
          value={[da]}
          onValueChange={([v]) => setDa(v)}
          min={0}
          max={200000}
          step={500}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹2L</span>
        </div>
      </div>

      {/* Years of Service */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-green-600" />
            Years of Service
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {yearsOfService} Years
          </span>
        </div>
        <Slider
          value={[yearsOfService]}
          onValueChange={([v]) => setYearsOfService(v)}
          min={5}
          max={40}
          step={1}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>5Y (minimum)</span>
          <span>40Y</span>
        </div>
      </div>

      {/* Eligibility Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
        <AlertTriangle size={14} className="inline mr-1" />
        <strong>Eligibility:</strong> Minimum 5 years of continuous service
        required. Applicable under Payment of Gratuity Act, 1972.
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Mobile Collapsible */}
      <div className="lg:hidden">
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setInputsExpanded(!inputsExpanded)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg mb-1">
                  Gratuity Calculator
                </CardTitle>
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

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="hidden lg:block lg:col-span-2">
          <Card className="border-border shadow-sm rounded-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scale size={20} className="text-green-600" />
                Gratuity Calculator
              </CardTitle>
              <CardDescription>
                Calculate gratuity under the Payment of Gratuity Act, 1972
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
                  Your Gratuity Amount
                </p>
                <div className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                  {formatCurrency(result.cappedGratuity)}
                </div>
                {result.isCapped && (
                  <Badge
                    variant="outline"
                    className="mt-2 text-amber-700 bg-amber-50 border-amber-200 text-xs"
                  >
                    Capped at ₹25L (actual: {formatCurrency(result.gratuity)})
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="mt-2 ml-2 text-green-700 bg-green-50 border-green-200 text-xs"
                >
                  <ShieldCheck size={12} className="inline mr-1" />
                  Tax-Free up to ₹25L
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-green-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Last Drawn Salary</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.lastDrawnSalary)}/mo
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Service Period</p>
                  <p className="text-sm font-bold text-gray-900">
                    {yearsOfService} Years
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">
                    Monthly Equivalent
                  </p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(result.monthlyEquivalent)}/mo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insight Nudge */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
            <strong>Did you know?</strong> Your gratuity of{" "}
            {formatCurrency(result.cappedGratuity)} is equivalent to{" "}
            {(result.cappedGratuity / result.lastDrawnSalary).toFixed(1)} months
            of your last drawn salary.
            {yearsOfService >= 20
              ? " With 20+ years of service, consider reinvesting this in a balanced mutual fund for retirement."
              : ` After ${40 - yearsOfService} more years, your gratuity could reach ${formatCurrency(Math.min((15 * result.lastDrawnSalary * 40) / (employeeType === "govt" ? 30 : 26), 2500000))}.`}
          </div>

          {/* Year-wise Growth */}
          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Gratuity Growth by Service Years
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.yearlyAccrual.filter(
                      (_, i) =>
                        i %
                          (yearsOfService > 20
                            ? 5
                            : yearsOfService > 10
                              ? 2
                              : 1) ===
                          0 || i === result.yearlyAccrual.length - 1,
                    )}
                  >
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
                        v >= 100000
                          ? `${(v / 100000).toFixed(0)}L`
                          : `${(v / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        formatCurrency(Number(value)),
                        "Gratuity",
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="gratuity"
                      fill="#16a34a"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tax Breakdown + Formula */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tax Breakdown */}
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tax Treatment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[160px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
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
                <div className="flex justify-center gap-4 mt-2">
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

            {/* Formula */}
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info size={16} className="text-green-600" />
                  Formula Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-3 text-center mb-3">
                  <p className="text-sm font-mono text-gray-700">
                    Gratuity = (15 &times; Salary &times; Years) /{" "}
                    {employeeType === "govt" ? "30" : "26"}
                  </p>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>15 (days per month considered)</span>
                    <span className="font-semibold">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Drawn Salary (Basic + DA)</span>
                    <span className="font-semibold">
                      {formatCurrency(result.lastDrawnSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Years of Service</span>
                    <span className="font-semibold">{yearsOfService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Divisor (
                      {employeeType === "govt"
                        ? "Govt: 30 days"
                        : "Private: 26 days"}
                      )
                    </span>
                    <span className="font-semibold">
                      {employeeType === "govt" ? 30 : 26}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold text-green-700">
                    <span>Gratuity Amount</span>
                    <span>{formatCurrency(result.cappedGratuity)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  Maximum limit: ₹25,00,000 under the Payment of Gratuity Act,
                  1972 (updated 2024).
                  {employeeType === "govt"
                    ? " Govt employees use 30 as divisor (calendar days)."
                    : " Private sector uses 26 as divisor (working days)."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
