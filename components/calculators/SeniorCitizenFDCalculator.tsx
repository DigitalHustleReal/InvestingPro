"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Building2, Heart } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import { ProductRecs } from "./shared/ProductRecs";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  formatINR,
  yAxisINR,
} from "./shared/charts";

interface BankRate {
  name: string;
  rate1Y: number;
  rate3Y: number;
  rate5Y: number;
  seniorExtra: number;
  type: "public" | "private" | "sfb";
}

const BANK_RATES: BankRate[] = [
  {
    name: "SBI",
    rate1Y: 6.8,
    rate3Y: 7.0,
    rate5Y: 6.5,
    seniorExtra: 0.5,
    type: "public",
  },
  {
    name: "HDFC Bank",
    rate1Y: 6.6,
    rate3Y: 7.0,
    rate5Y: 7.0,
    seniorExtra: 0.5,
    type: "private",
  },
  {
    name: "ICICI Bank",
    rate1Y: 6.7,
    rate3Y: 7.0,
    rate5Y: 7.0,
    seniorExtra: 0.5,
    type: "private",
  },
  {
    name: "Post Office TD",
    rate1Y: 6.9,
    rate3Y: 7.0,
    rate5Y: 7.5,
    seniorExtra: 0.0,
    type: "public",
  },
  {
    name: "Unity SFB",
    rate1Y: 8.5,
    rate3Y: 8.0,
    rate5Y: 8.0,
    seniorExtra: 0.5,
    type: "sfb",
  },
  {
    name: "Suryoday SFB",
    rate1Y: 8.25,
    rate3Y: 8.0,
    rate5Y: 7.5,
    seniorExtra: 0.5,
    type: "sfb",
  },
  {
    name: "AU SFB",
    rate1Y: 7.5,
    rate3Y: 7.5,
    rate5Y: 7.25,
    seniorExtra: 0.5,
    type: "sfb",
  },
  {
    name: "Bajaj Finance",
    rate1Y: 7.75,
    rate3Y: 8.05,
    rate5Y: 7.5,
    seniorExtra: 0.25,
    type: "private",
  },
];

export function SeniorCitizenFDCalculator() {
  const [depositAmount, setDepositAmount] = useState(1000000);
  const [tenure, setTenure] = useState(3);
  const [interestRate, setInterestRate] = useState(7.5);
  const [isSenior, setIsSenior] = useState(true);
  const [payoutMode, setPayoutMode] = useState<
    "cumulative" | "monthly" | "quarterly"
  >("cumulative");
  const [taxSlab, setTaxSlab] = useState(30);

  const result = useMemo(() => {
    const rate = interestRate / 100;

    // Cumulative (quarterly compounding)
    const compoundingPeriods = 4; // quarterly
    const totalPeriods = tenure * compoundingPeriods;
    const periodRate = rate / compoundingPeriods;
    const maturityCumulative =
      depositAmount * Math.pow(1 + periodRate, totalPeriods);
    const totalInterestCumulative = maturityCumulative - depositAmount;

    // Monthly payout
    const monthlyInterest = Math.round((depositAmount * rate) / 12);
    const quarterlyInterest = Math.round((depositAmount * rate) / 4);
    const yearlyInterest = Math.round(depositAmount * rate);

    // Tax calculation
    // Section 80TTB: Senior citizens get ₹50,000 exemption on interest income
    const annualInterest =
      payoutMode === "cumulative"
        ? totalInterestCumulative / tenure
        : yearlyInterest;
    const exemption80TTB = isSenior ? 50000 : 0; // Regular citizens have 80TTA ₹10K
    const taxableInterest = Math.max(0, annualInterest - exemption80TTB);
    const annualTax = Math.round((taxableInterest * taxSlab) / 100);
    const tds = annualInterest > 50000 ? Math.round(annualInterest * 0.1) : 0; // TDS 10% if > ₹50K

    // Post-tax effective rate
    const postTaxReturn = annualInterest - annualTax;
    const effectiveRate =
      depositAmount > 0 ? (postTaxReturn / depositAmount) * 100 : 0;

    // Inflation-adjusted return (6% inflation)
    const realReturn = effectiveRate - 6;

    // Year-wise data
    const yearlyData = [];
    for (let y = 1; y <= Math.min(tenure, 10); y++) {
      const val =
        depositAmount * Math.pow(1 + periodRate, y * compoundingPeriods);
      yearlyData.push({
        year: `Y${y}`,
        invested: depositAmount,
        value: Math.round(val),
      });
    }

    // Compare banks
    const bankComparison = BANK_RATES.map((bank) => {
      const baseRate =
        tenure <= 1 ? bank.rate1Y : tenure <= 3 ? bank.rate3Y : bank.rate5Y;
      const effectiveRate = baseRate + (isSenior ? bank.seniorExtra : 0);
      const maturity =
        depositAmount * Math.pow(1 + effectiveRate / 400, tenure * 4);
      return {
        ...bank,
        effectiveRate,
        maturity: Math.round(maturity),
        interest: Math.round(maturity - depositAmount),
      };
    }).sort((a, b) => b.effectiveRate - a.effectiveRate);

    return {
      maturityValue: Math.round(maturityCumulative),
      totalInterest: Math.round(totalInterestCumulative),
      monthlyInterest,
      quarterlyInterest,
      yearlyInterest,
      annualTax,
      tds,
      effectiveRate: Math.round(effectiveRate * 100) / 100,
      realReturn: Math.round(realReturn * 100) / 100,
      exemption80TTB,
      yearlyData,
      bankComparison,
    };
  }, [depositAmount, tenure, interestRate, isSenior, payoutMode, taxSlab]);

  const scenarios = useMemo(
    () => [
      {
        label: "Monthly Income",
        description: `${formatINR(result.monthlyInterest)}/month`,
        value: formatINR(result.yearlyInterest),
        subtext: "Yearly interest income",
        type: "conservative" as const,
      },
      {
        label: "Cumulative",
        description: `${tenure}Y compounding`,
        value: formatINR(result.maturityValue),
        subtext: `Interest: ${formatINR(result.totalInterest)}`,
        type: "moderate" as const,
      },
      {
        label: "SCSS (8.2%)",
        description: "Post office scheme",
        value: formatINR(
          Math.round(depositAmount * Math.pow(1 + 8.2 / 400, tenure * 4)),
        ),
        subtext: "Govt guaranteed, 80C benefit",
        type: "aggressive" as const,
      },
    ],
    [result, depositAmount, tenure],
  );

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(depositAmount)} FD at ${interestRate}% for ${tenure}Y → Maturity: ${formatINR(result.maturityValue)}, Interest: ${formatINR(result.totalInterest)}.${isSenior ? " Senior citizen extra 0.5% included." : ""}`,
    );
    if (isSenior) {
      ins.push(
        `Section 80TTB: Senior citizens ko ₹50,000 tak interest income tax-free hai. Aapka taxable interest: ${formatINR(Math.max(0, result.yearlyInterest - 50000))}/year.`,
      );
    }
    if (result.realReturn < 0) {
      ins.push(
        `Warning: Inflation-adjusted return ${result.realReturn}% hai — FD se purchasing power kam ho rahi hai. Senior citizens ke liye SCSS (8.2%) ya SFB FDs (8-9%) consider karein.`,
      );
    }
    if (result.tds > 0) {
      ins.push(
        `TDS: ₹${result.tds}/year katega (10% on interest > ₹50K). Form 15H submit karein agar total income taxable nahi hai — TDS cut nahi hoga.`,
      );
    }
    const bestBank = result.bankComparison[0];
    if (bestBank.effectiveRate > interestRate) {
      ins.push(
        `Best rate: ${bestBank.name} at ${bestBank.effectiveRate}% — ${formatINR(bestBank.interest - result.totalInterest)} zyada milega! SFBs DICGC ₹5L insured hain.`,
      );
    }
    return ins;
  }, [result, depositAmount, interestRate, tenure, isSenior]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title={
            payoutMode === "cumulative" ? "Maturity Value" : "Monthly Income"
          }
          value={
            payoutMode === "cumulative"
              ? formatINR(result.maturityValue)
              : formatINR(result.monthlyInterest)
          }
          ratingLabel={`${interestRate}% p.a. | Post-tax: ${result.effectiveRate}%`}
          ratingType={result.realReturn > 0 ? "positive" : "neutral"}
          metrics={[
            { label: "Deposit", value: formatINR(depositAmount) },
            { label: "Total Interest", value: formatINR(result.totalInterest) },
            {
              label: "Monthly Income",
              value: `${formatINR(result.monthlyInterest)}/mo`,
            },
            {
              label: "Real Return (post-inflation)",
              value: `${result.realReturn}%`,
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            FD Details
          </h2>
          <div className="space-y-5">
            {/* Senior Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSenior(!isSenior)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isSenior ? "bg-action-green" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isSenior ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm text-ink flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-action-green" />
                Senior Citizen (60+ age, extra 0.25-0.5%)
              </span>
            </div>

            <SliderInput
              label="Deposit Amount"
              icon={IndianRupee}
              value={depositAmount}
              onChange={setDepositAmount}
              min={25000}
              max={20000000}
              step={25000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Tenure"
              icon={Calendar}
              value={tenure}
              onChange={setTenure}
              min={1}
              max={10}
              step={1}
              suffix=" Years"
            />
            <SliderInput
              label="Interest Rate"
              icon={Building2}
              value={interestRate}
              onChange={setInterestRate}
              min={5}
              max={9.5}
              step={0.1}
              suffix="% p.a."
            />

            {/* Payout Mode */}
            <div>
              <label className="text-xs font-medium text-ink-60 mb-2 block">
                Interest Payout
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "cumulative" as const, label: "Cumulative" },
                  { value: "monthly" as const, label: "Monthly" },
                  { value: "quarterly" as const, label: "Quarterly" },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPayoutMode(m.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      payoutMode === m.value
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:border-gray-300"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <SliderInput
              label="Your Tax Slab"
              icon={IndianRupee}
              value={taxSlab}
              onChange={setTaxSlab}
              min={0}
              max={30}
              step={5}
              suffix="%"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title={
                payoutMode === "cumulative"
                  ? "Maturity Value"
                  : "Monthly Income"
              }
              value={
                payoutMode === "cumulative"
                  ? formatINR(result.maturityValue)
                  : formatINR(result.monthlyInterest)
              }
              ratingLabel={`${interestRate}% p.a. | Post-tax: ${result.effectiveRate}%`}
              ratingType={result.realReturn > 0 ? "positive" : "neutral"}
              metrics={[
                { label: "Deposit", value: formatINR(depositAmount) },
                {
                  label: "Total Interest",
                  value: formatINR(result.totalInterest),
                },
                {
                  label: "Monthly Income",
                  value: `${formatINR(result.monthlyInterest)}/mo`,
                },
                {
                  label: "Real Return (post-inflation)",
                  value: `${result.realReturn}%`,
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            FD Growth — Cumulative ({tenure} Years)
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="scInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                  tickFormatter={yAxisINR}
                  width={55}
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#166534"
                  strokeWidth={2}
                  fill="url(#scInv)"
                  name="Deposit"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#scVal)"
                  name="Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ProductRecs
          category="fixed-deposits"
          title="Best Senior FD Rates"
          matchCriteria={`${interestRate}%+ for seniors`}
        />
      </div>

      {/* Bank Comparison Table */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-display font-semibold text-ink mb-1">
          {isSenior ? "Senior Citizen" : "Regular"} FD Rates — {tenure}Y Tenure
        </h3>
        <p className="text-xs text-ink-60 mb-3">
          Sorted by effective rate.{" "}
          {isSenior
            ? "Includes senior citizen extra 0.25-0.5%."
            : "Switch to Senior for extra rates."}
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/5">
              <th className="text-left py-2 text-ink-60 font-medium">Bank</th>
              <th className="text-center py-2 text-ink-60 font-medium">
                Type
              </th>
              <th className="text-center py-2 text-ink-60 font-medium">
                Rate
              </th>
              <th className="text-right py-2 text-ink-60 font-medium">
                Interest on {formatINR(depositAmount)}
              </th>
              <th className="text-right py-2 text-ink-60 font-medium">
                Maturity
              </th>
            </tr>
          </thead>
          <tbody>
            {result.bankComparison.map((bank, i) => (
              <tr
                key={i}
                className={`border-b border-gray-50 ${i === 0 ? "bg-action-green/10" : ""}`}
              >
                <td className="py-2.5 font-medium text-ink">
                  {bank.name}
                  {i === 0 && (
                    <span className="text-[10px] text-action-green ml-1 font-semibold">
                      BEST
                    </span>
                  )}
                </td>
                <td className="text-center py-2.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      bank.type === "sfb"
                        ? "bg-indian-gold/10 text-amber-700"
                        : bank.type === "private"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-action-green/10 text-authority-green"
                    }`}
                  >
                    {bank.type === "sfb"
                      ? "SFB"
                      : bank.type === "private"
                        ? "Private"
                        : "PSU/Govt"}
                  </span>
                </td>
                <td className="text-center py-2.5 font-semibold text-authority-green">
                  {bank.effectiveRate}%
                </td>
                <td className="text-right py-2.5 text-ink">
                  {formatINR(bank.interest)}
                </td>
                <td className="text-right py-2.5 font-display font-semibold text-ink">
                  {formatINR(bank.maturity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-ink-60 mt-2">
          * SFBs (Small Finance Banks) are RBI-regulated and deposits up to ₹5L
          are DICGC insured. Split large deposits across banks for full
          coverage.
        </p>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="senior-citizen-fd" variant="strip" />
      </div>
    </div>
  );
}
