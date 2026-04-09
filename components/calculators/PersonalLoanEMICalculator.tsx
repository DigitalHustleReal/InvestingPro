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
  Wallet,
  Info,
  ChevronDown,
  ChevronUp,
  BarChart3,
  AlertTriangle,
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

export function PersonalLoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(3);
  const [processingFee, setProcessingFee] = useState(2);
  const [inputsExpanded, setInputsExpanded] = useState(false);

  const formatCurrency = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const result = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = tenure * 12;
    const emi =
      r > 0
        ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : loanAmount / n;
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;
    const procFee = loanAmount * (processingFee / 100);
    const effectiveCost = totalInterest + procFee;
    const apr = (effectiveCost / loanAmount / tenure) * 100; // Simplified APR

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
      }
      totalPrincipalPaid += yearPrincipal;
      totalInterestPaid += yearInterest;
      yearlyData.push({
        year: `Y${year}`,
        principal: Math.round(totalPrincipalPaid),
        interest: Math.round(totalInterestPaid),
        balance: Math.round(Math.max(0, balance)),
      });
    }

    // Prepayment penalty estimate (typically 2-5% of outstanding)
    const prepayPenalty =
      balance > 0 ? balance * 0.04 : loanAmount * 0.5 * 0.04;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      procFee: Math.round(procFee),
      effectiveCost: Math.round(effectiveCost),
      apr: apr.toFixed(1),
      yearlyData,
      prepayPenalty: Math.round(prepayPenalty),
      disbursedAmount: Math.round(loanAmount - procFee),
    };
  }, [loanAmount, interestRate, tenure, processingFee]);

  const pieData = [
    { name: "Principal", value: loanAmount, color: "#166534" },
    { name: "Interest", value: result.totalInterest, color: "#dc2626" },
    { name: "Processing Fee", value: result.procFee, color: "#d97706" },
  ];

  const lenderRates = [
    { name: "SBI", rate: "11.0-14.0%", minRate: 11 },
    { name: "HDFC Bank", rate: "10.5-21.0%", minRate: 10.5 },
    { name: "ICICI Bank", rate: "10.75-19.0%", minRate: 10.75 },
    { name: "Bajaj Finance", rate: "11.0-39.0%", minRate: 11 },
    { name: "Axis Bank", rate: "10.49-22.0%", minRate: 10.49 },
    { name: "Kotak", rate: "10.99-36.0%", minRate: 10.99 },
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
          min={50000}
          max={4000000}
          step={10000}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹50K</span>
          <span>₹40L</span>
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
          min={8}
          max={36}
          step={0.25}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>8%</span>
          <span>36%</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Calendar size={14} className="text-green-600" /> Loan Tenure
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {tenure} Year{tenure > 1 ? "s" : ""} ({tenure * 12} months)
          </span>
        </div>
        <Slider
          value={[tenure]}
          onValueChange={([v]) => setTenure(v)}
          min={1}
          max={7}
          step={1}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>1Y</span>
          <span>7Y</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Wallet size={14} className="text-green-600" /> Processing Fee
          </label>
          <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
            {processingFee}% ({formatCurrency(result.procFee)})
          </span>
        </div>
        <Slider
          value={[processingFee]}
          onValueChange={([v]) => setProcessingFee(v)}
          min={0}
          max={5}
          step={0.25}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0%</span>
          <span>5%</span>
        </div>
      </div>

      {interestRate > 18 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
          <AlertTriangle size={14} className="inline mr-1" />
          <strong>Warning:</strong> Rates above 18% are typically from
          NBFCs/digital lenders. If your CIBIL is 750+, you qualify for bank
          rates around 10-14%. Check our lender comparison.
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          Lender Rates (April 2026)
        </p>
        <div className="space-y-1">
          {lenderRates.map((l) => (
            <div key={l.name} className="flex justify-between text-[11px]">
              <span className="text-gray-500">{l.name}</span>
              <span
                className={cn(
                  "font-semibold",
                  l.minRate <= interestRate
                    ? "text-green-600"
                    : "text-gray-700",
                )}
              >
                {l.rate}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">
          Rates depend on CIBIL score, income, and employer. CIBIL 750+ gets
          best rates.
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
                <CardTitle className="text-lg mb-1">
                  Personal Loan EMI
                </CardTitle>
                <CardDescription className="text-xs">
                  Tap to adjust
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
                <Wallet size={20} className="text-green-600" /> Personal Loan
                EMI
              </CardTitle>
              <CardDescription>
                Calculate EMI, total cost, and lender comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InputSection />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
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
                  Total Cost: {formatCurrency(result.effectiveCost)} (
                  {result.apr}% APR)
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-green-200">
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Disbursed</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.disbursedAmount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Total Interest</p>
                  <p className="text-sm font-bold text-red-600">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Processing Fee</p>
                  <p className="text-sm font-bold text-amber-700">
                    {formatCurrency(result.procFee)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-500">Total Payment</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(result.totalPayment)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>True Cost:</strong> You borrow {formatCurrency(loanAmount)}{" "}
            but receive only {formatCurrency(result.disbursedAmount)} (after{" "}
            {processingFee}% processing fee). Total repayment:{" "}
            {formatCurrency(result.totalPayment)}. Effective cost:{" "}
            {formatCurrency(result.effectiveCost)}.
            {interestRate > 14
              ? " Consider improving CIBIL score or checking balance transfer options for lower rates."
              : ""}
          </div>

          <Card className="border-border shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 size={16} className="text-green-600" /> Repayment
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.yearlyData}>
                    <defs>
                      <linearGradient
                        id="plBalance"
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
                        id="plPrincipal"
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
                        v >= 100000
                          ? `${(v / 100000).toFixed(0)}L`
                          : `${(v / 1000).toFixed(0)}K`
                      }
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        formatCurrency(Number(value)),
                        "",
                      ]}
                      contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fill="url(#plBalance)"
                      name="Outstanding"
                    />
                    <Area
                      type="monotone"
                      dataKey="principal"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="url(#plPrincipal)"
                      name="Principal Paid"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Cost Breakdown</CardTitle>
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
            <Card className="border-border shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Info size={16} className="text-green-600" /> Key Facts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">
                      Processing Fee Deducted
                    </span>
                    <span className="font-semibold text-amber-700">
                      -{formatCurrency(result.procFee)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Amount Disbursed</span>
                    <span className="font-semibold text-green-700">
                      {formatCurrency(result.disbursedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">
                      Prepayment Penalty (est.)
                    </span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(result.prepayPenalty)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-600">CIBIL for Best Rate</span>
                    <span className="font-semibold">750+</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  RBI mandates zero prepayment charges on floating-rate loans.
                  Fixed-rate loans may attract 2-5% penalty. GST at 18% applies
                  on processing fee.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
