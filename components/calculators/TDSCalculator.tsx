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
  Percent,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type IncomeType =
  | "salary"
  | "fd"
  | "rent"
  | "professional"
  | "commission"
  | "lottery";

interface TDSSection {
  code: string;
  name: string;
  type: IncomeType;
  defaultRate: number;
  noPanRate: number;
  threshold: number;
  thresholdSenior?: number;
  description: string;
}

const TDS_SECTIONS: TDSSection[] = [
  {
    code: "192",
    name: "Salary",
    type: "salary",
    defaultRate: 0,
    noPanRate: 20,
    threshold: 250000,
    description:
      "TDS on salary — deducted as per income tax slab rates by employer",
  },
  {
    code: "194A",
    name: "Interest on FD/RD",
    type: "fd",
    defaultRate: 10,
    noPanRate: 20,
    threshold: 40000,
    thresholdSenior: 50000,
    description: "TDS on interest from bank/post office deposits",
  },
  {
    code: "194I",
    name: "Rent Payment",
    type: "rent",
    defaultRate: 10,
    noPanRate: 20,
    threshold: 240000,
    description:
      "TDS on rent for land/building/furniture (10% for building, 2% for plant/machinery)",
  },
  {
    code: "194J",
    name: "Professional Fees",
    type: "professional",
    defaultRate: 10,
    noPanRate: 20,
    threshold: 30000,
    description: "TDS on professional/technical services fees",
  },
  {
    code: "194H",
    name: "Commission/Brokerage",
    type: "commission",
    defaultRate: 5,
    noPanRate: 20,
    threshold: 15000,
    description: "TDS on commission or brokerage payments",
  },
  {
    code: "194B",
    name: "Lottery/Game Winnings",
    type: "lottery",
    defaultRate: 30,
    noPanRate: 30,
    threshold: 10000,
    description:
      "TDS on winnings from lottery, crossword puzzle, card game, etc.",
  },
];

export function TDSCalculator() {
  const [selectedType, setSelectedType] = useState<IncomeType>("fd");
  const [amount, setAmount] = useState(500000);
  const [hasPAN, setHasPAN] = useState(true);
  const [isSenior, setIsSenior] = useState(false);
  const [hasForm15G, setHasForm15G] = useState(false);
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const section = TDS_SECTIONS.find((s) => s.type === selectedType)!;

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    const threshold =
      isSenior && section.thresholdSenior
        ? section.thresholdSenior
        : section.threshold;

    // Form 15G/15H exemption
    if (hasForm15G && (selectedType === "fd" || selectedType === "rent")) {
      return {
        tds: 0,
        effectiveRate: 0,
        netAmount: amount,
        threshold,
        isExempt: true,
        exemptReason: "Form 15G/15H submitted",
      };
    }

    // Below threshold
    if (amount <= threshold && selectedType !== "salary") {
      return {
        tds: 0,
        effectiveRate: 0,
        netAmount: amount,
        threshold,
        isExempt: true,
        exemptReason: `Below ₹${threshold.toLocaleString("en-IN")} threshold`,
      };
    }

    const rate = hasPAN ? section.defaultRate : section.noPanRate;

    // For salary, TDS is calculated on slab basis — simplified as avg rate
    let tds: number;
    if (selectedType === "salary") {
      // Simplified: estimate tax on salary using new regime slabs
      let tax = 0;
      const taxable = Math.max(0, amount - 75000); // Standard deduction
      const slabs = [
        { limit: 300000, rate: 0 },
        { limit: 700000, rate: 5 },
        { limit: 1000000, rate: 10 },
        { limit: 1200000, rate: 15 },
        { limit: 1500000, rate: 20 },
        { limit: Infinity, rate: 30 },
      ];
      let remaining = taxable;
      let prev = 0;
      for (const slab of slabs) {
        const amt = Math.min(remaining, slab.limit - prev);
        if (amt <= 0) break;
        tax += amt * (slab.rate / 100);
        remaining -= amt;
        prev = slab.limit;
      }
      if (taxable <= 700000) tax = 0;
      tds = tax + tax * 0.04; // + cess
    } else {
      tds = amount * (rate / 100);
    }

    const effectiveRate = amount > 0 ? (tds / amount) * 100 : 0;
    return {
      tds,
      effectiveRate,
      netAmount: amount - tds,
      threshold,
      isExempt: false,
      exemptReason: "",
    };
  }, [amount, selectedType, hasPAN, isSenior, hasForm15G, section]);

  const pieData = [
    {
      name: "Net Amount",
      value: Math.max(0, result.netAmount),
      color: "#166534",
    },
    ...(result.tds > 0
      ? [{ name: "TDS Deducted", value: result.tds, color: "#dc2626" }]
      : []),
  ];

  const InputSection = () => (
    <div className="space-y-5">
      {/* Income Type */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Income Type (TDS Section)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TDS_SECTIONS.map((s) => (
            <button
              key={s.type}
              onClick={() => setSelectedType(s.type)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all border text-left",
                selectedType === s.type
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-300",
              )}
            >
              <div className="font-semibold">{s.name}</div>
              <div
                className={cn(
                  "text-[10px]",
                  selectedType === s.type ? "text-green-100" : "text-gray-400",
                )}
              >
                Sec {s.code} · {s.defaultRate}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <IndianRupee size={14} className="text-green-600" />
            {selectedType === "salary" ? "Annual Salary" : "Payment Amount"}
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {formatCurrency(amount)}
          </span>
        </div>
        <Slider
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
          min={selectedType === "salary" ? 300000 : 10000}
          max={selectedType === "salary" ? 10000000 : 5000000}
          step={selectedType === "salary" ? 10000 : 5000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{selectedType === "salary" ? "₹3L" : "₹10K"}</span>
          <span>{selectedType === "salary" ? "₹1Cr" : "₹50L"}</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <label className="text-sm text-gray-700">
            PAN submitted to deductor?
          </label>
          <button
            onClick={() => setHasPAN(!hasPAN)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              hasPAN
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700",
            )}
          >
            {hasPAN ? "Yes" : "No (20% TDS)"}
          </button>
        </div>

        {selectedType === "fd" && (
          <>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="text-sm text-gray-700">
                Senior Citizen (60+)?
              </label>
              <button
                onClick={() => setIsSenior(!isSenior)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  isSenior
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600",
                )}
              >
                {isSenior ? "Yes (₹50K limit)" : "No (₹40K limit)"}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <label className="text-sm text-gray-700">
                Form 15G/15H submitted?
              </label>
              <button
                onClick={() => setHasForm15G(!hasForm15G)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  hasForm15G
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600",
                )}
              >
                {hasForm15G ? "Yes (No TDS)" : "No"}
              </button>
            </div>
          </>
        )}
      </div>

      {!hasPAN && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
          <AlertTriangle size={14} className="inline mr-1" />
          <strong>Warning:</strong> Without PAN, TDS is deducted at 20%
          regardless of income type. Submit PAN to your deductor immediately.
        </div>
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
                <CardTitle className="text-lg mb-1">TDS Calculator</CardTitle>
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
                <Receipt size={20} className="text-green-600" /> TDS Calculator
              </CardTitle>
              <CardDescription>
                Calculate Tax Deducted at Source under various sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InputSection />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {/* Main Result */}
          <Card
            className={cn(
              "shadow-sm rounded-xl",
              result.isExempt
                ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                : "border-red-200 bg-gradient-to-br from-red-50 to-orange-50",
            )}
          >
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">
                  TDS Amount (Section {section.code})
                </p>
                <div
                  className={cn(
                    "text-5xl md:text-6xl font-bold tracking-tight",
                    result.isExempt ? "text-green-700" : "text-red-600",
                  )}
                >
                  {result.isExempt ? "₹0" : formatCurrency(result.tds)}
                </div>
                {result.isExempt ? (
                  <Badge
                    variant="outline"
                    className="mt-2 text-green-700 bg-green-50 border-green-200 text-xs"
                  >
                    <ShieldCheck size={12} className="inline mr-1" />{" "}
                    {result.exemptReason}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="mt-2 text-red-700 bg-red-50 border-red-200 text-xs"
                  >
                    Effective Rate: {result.effectiveRate.toFixed(2)}%
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Gross Amount</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(amount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">TDS Deducted</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(result.tds)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Net You Receive</p>
                  <p className="text-sm font-bold text-green-700">
                    {formatCurrency(result.netAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
            <FileText size={14} className="inline mr-1" />
            <strong>Section {section.code}:</strong> {section.description}.{" "}
            Rate: {section.defaultRate}% (with PAN) / {section.noPanRate}%
            (without PAN). Threshold: ₹
            {result.threshold.toLocaleString("en-IN")}/year.
          </div>

          {/* Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payment Split</CardTitle>
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

            {/* All Sections Reference */}
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info size={16} className="text-green-600" /> TDS Rate Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {TDS_SECTIONS.map((s) => (
                    <div
                      key={s.code}
                      className={cn(
                        "flex items-center justify-between py-1.5 px-2 rounded text-xs",
                        s.type === selectedType
                          ? "bg-green-50 border border-green-200"
                          : "",
                      )}
                    >
                      <div>
                        <span className="font-semibold text-gray-700">
                          Sec {s.code}
                        </span>
                        <span className="text-gray-400 ml-1">{s.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-gray-900">
                          {s.defaultRate}%
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="text-red-600 font-semibold">
                          {s.noPanRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-[10px] text-gray-400 mt-2 text-center">
                    Left: with PAN | Right: without PAN
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Save TDS:</strong>{" "}
            {selectedType === "fd"
              ? "Submit Form 15G (below 60) or Form 15H (senior citizen) to your bank if your total income is below taxable limit. Zero TDS will be deducted."
              : selectedType === "salary"
                ? "Declare investments (80C, HRA, home loan) to your employer before January to reduce monthly TDS. Don't wait till March."
                : selectedType === "rent"
                  ? "Tenant must deduct TDS at 10% if annual rent exceeds ₹2,40,000. Use Form 26QC on TRACES portal."
                  : "Ensure your PAN is linked with Aadhaar. Inoperative PAN attracts 20% TDS instead of normal rates."}
          </div>
        </div>
      </div>
    </div>
  );
}
