"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Building, Landmark } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
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

type Scheme = "td" | "rd" | "mis" | "scss" | "nsc" | "kvp" | "ssy" | "ppf";

interface SchemeConfig {
  name: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  tenureYears: number;
  compounding: "quarterly" | "yearly" | "monthly";
  taxFree: boolean;
  section80C: boolean;
  description: string;
}

const SCHEMES: Record<Scheme, SchemeConfig> = {
  td: {
    name: "Time Deposit (1Y)",
    rate: 6.9,
    minAmount: 1000,
    maxAmount: 30000000,
    tenureYears: 1,
    compounding: "quarterly",
    taxFree: false,
    section80C: false,
    description: "1-5 year fixed deposits at post office",
  },
  rd: {
    name: "Recurring Deposit",
    rate: 6.7,
    minAmount: 100,
    maxAmount: 100000,
    tenureYears: 5,
    compounding: "quarterly",
    taxFree: false,
    section80C: false,
    description: "Monthly savings, 5 year lock-in",
  },
  mis: {
    name: "Monthly Income Scheme",
    rate: 7.4,
    minAmount: 1000,
    maxAmount: 900000,
    tenureYears: 5,
    compounding: "monthly",
    taxFree: false,
    section80C: false,
    description: "Monthly interest payout, max ₹9L (single)",
  },
  scss: {
    name: "Senior Citizen Savings",
    rate: 8.2,
    minAmount: 1000,
    maxAmount: 3000000,
    tenureYears: 5,
    compounding: "quarterly",
    taxFree: false,
    section80C: true,
    description: "60+ age, highest rate, max ₹30L",
  },
  nsc: {
    name: "National Savings Certificate",
    rate: 7.7,
    minAmount: 1000,
    maxAmount: 30000000,
    tenureYears: 5,
    compounding: "yearly",
    taxFree: false,
    section80C: true,
    description: "5 year lock-in, 80C benefit",
  },
  kvp: {
    name: "Kisan Vikas Patra",
    rate: 7.5,
    minAmount: 1000,
    maxAmount: 30000000,
    tenureYears: 10,
    compounding: "yearly",
    taxFree: false,
    section80C: false,
    description: "Doubles money in ~115 months",
  },
  ssy: {
    name: "Sukanya Samriddhi Yojana",
    rate: 8.2,
    minAmount: 250,
    maxAmount: 150000,
    tenureYears: 21,
    compounding: "yearly",
    taxFree: true,
    section80C: true,
    description: "Girl child, EEE tax status, 21 year",
  },
  ppf: {
    name: "Public Provident Fund",
    rate: 7.1,
    minAmount: 500,
    maxAmount: 150000,
    tenureYears: 15,
    compounding: "yearly",
    taxFree: true,
    section80C: true,
    description: "15 year, EEE tax, sovereign guarantee",
  },
};

export function PostOfficeSavingsCalculator() {
  const [scheme, setScheme] = useState<Scheme>("ppf");
  const [investmentAmount, setInvestmentAmount] = useState(150000);
  const [isMonthly, setIsMonthly] = useState(false);

  const config = SCHEMES[scheme];

  const result = useMemo(() => {
    const annualAmount = isMonthly ? investmentAmount * 12 : investmentAmount;
    const effectiveAmount = Math.min(annualAmount, config.maxAmount);
    const rate = config.rate / 100;
    const years = config.tenureYears;

    let maturityValue: number;
    let totalInvested: number;

    if (scheme === "rd") {
      // RD: monthly deposits with quarterly compounding
      const monthly = isMonthly ? investmentAmount : investmentAmount / 12;
      totalInvested = monthly * years * 12;
      const qr = config.rate / 400;
      const quarters = years * 4;
      maturityValue = 0;
      for (let m = 0; m < years * 12; m++) {
        const remainingQuarters = (years * 12 - m) / 3;
        maturityValue += monthly * Math.pow(1 + qr, remainingQuarters);
      }
    } else if (scheme === "mis") {
      // MIS: lumpsum deposit, monthly interest payout
      totalInvested = effectiveAmount;
      const monthlyInterest = Math.round((effectiveAmount * rate) / 12);
      const totalInterest = monthlyInterest * years * 12;
      maturityValue = effectiveAmount + totalInterest;
    } else {
      // Lumpsum or yearly: compound interest
      totalInvested = effectiveAmount * years;
      maturityValue = 0;
      for (let y = 0; y < years; y++) {
        maturityValue = (maturityValue + effectiveAmount) * (1 + rate);
      }
    }

    const totalReturns = maturityValue - totalInvested;
    const effectiveRate =
      totalInvested > 0
        ? (Math.pow(maturityValue / totalInvested, 1 / years) - 1) * 100
        : 0;

    // Tax calculation (if not tax-free)
    const taxOnInterest = config.taxFree ? 0 : Math.round(totalReturns * 0.3); // 30% slab
    const postTaxReturns = totalReturns - taxOnInterest;
    const postTaxValue = totalInvested + postTaxReturns;

    // 80C benefit
    const taxSaved80C = config.section80C
      ? Math.round(Math.min(effectiveAmount, 150000) * 0.3 * years)
      : 0;

    // Year-wise data
    const yearlyData = [];
    let cumValue = 0;
    for (let y = 1; y <= years; y++) {
      if (scheme === "mis") {
        cumValue = effectiveAmount + ((effectiveAmount * rate) / 12) * y * 12;
      } else {
        cumValue = (cumValue + effectiveAmount) * (1 + rate);
      }
      yearlyData.push({
        year: `Y${y}`,
        invested: Math.round(
          scheme === "mis" ? effectiveAmount : effectiveAmount * y,
        ),
        value: Math.round(cumValue),
      });
    }

    // Doubling time (Rule of 72)
    const doublingYears =
      rate > 0 ? Math.round((72 / config.rate) * 10) / 10 : 0;

    return {
      maturityValue: Math.round(maturityValue),
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns),
      effectiveRate: Math.round(effectiveRate * 100) / 100,
      taxOnInterest,
      postTaxValue: Math.round(postTaxValue),
      taxSaved80C,
      doublingYears,
      yearlyData,
      monthlyInterest:
        scheme === "mis" ? Math.round((effectiveAmount * rate) / 12) : 0,
    };
  }, [scheme, investmentAmount, isMonthly, config]);

  const scenarios = useMemo(() => {
    const schemeList: Scheme[] = ["ppf", "scss", "nsc"];
    return schemeList.map((s) => {
      const cfg = SCHEMES[s];
      const amount = Math.min(investmentAmount, cfg.maxAmount);
      let fv = 0;
      for (let y = 0; y < cfg.tenureYears; y++) {
        fv = (fv + amount) * (1 + cfg.rate / 100);
      }
      return {
        label: cfg.name,
        description: `${cfg.rate}% for ${cfg.tenureYears}Y`,
        value: formatINR(Math.round(fv)),
        subtext: cfg.taxFree ? "Tax-free (EEE)" : "Taxable",
        type:
          s === "ppf"
            ? ("conservative" as const)
            : s === "scss"
              ? ("moderate" as const)
              : ("aggressive" as const),
      };
    });
  }, [investmentAmount]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${config.name}: ${formatINR(result.totalInvested)} invest → ${formatINR(result.maturityValue)} maturity (${config.tenureYears} years at ${config.rate}%). Total interest: ${formatINR(result.totalReturns)}.`,
    );
    if (config.taxFree) {
      ins.push(
        `${config.name} tax-free hai (EEE status) — maturity amount pe koi tax nahi! Post-tax effective return: ${config.rate}% vs bank FD effective ~5% (after 30% tax).`,
      );
    } else {
      ins.push(
        `Interest taxable hai at slab rate. 30% slab pe effective return: ${(config.rate * 0.7).toFixed(1)}%. Tax-free options like PPF/SSY consider karein.`,
      );
    }
    if (config.section80C) {
      ins.push(
        `Section 80C benefit available — ₹1.5L tak deduction. Old Regime mein ${formatINR(result.taxSaved80C)} tax saved over ${config.tenureYears} years.`,
      );
    }
    ins.push(
      `Rule of 72: ${config.rate}% pe paisa ${result.doublingYears} saal mein double hota hai. Sovereign guarantee — zero risk.`,
    );
    return ins;
  }, [config, result]);

  const schemeOptions: { value: Scheme; label: string; rate: string }[] = [
    { value: "ppf", label: "PPF", rate: "7.1%" },
    { value: "ssy", label: "SSY", rate: "8.2%" },
    { value: "scss", label: "SCSS", rate: "8.2%" },
    { value: "nsc", label: "NSC", rate: "7.7%" },
    { value: "kvp", label: "KVP", rate: "7.5%" },
    { value: "mis", label: "MIS", rate: "7.4%" },
    { value: "td", label: "TD", rate: "6.9%" },
    { value: "rd", label: "RD", rate: "6.7%" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title="Maturity Value"
          value={formatINR(result.maturityValue)}
          ratingLabel={`${config.rate}% rate | ${config.taxFree ? "Tax-Free" : "Taxable"}`}
          ratingType={config.taxFree ? "positive" : "neutral"}
          metrics={[
            { label: "Invested", value: formatINR(result.totalInvested) },
            { label: "Interest Earned", value: formatINR(result.totalReturns) },
            { label: "Tenure", value: `${config.tenureYears} Years` },
            {
              label: config.taxFree ? "Tax Status" : "Post-Tax Value",
              value: config.taxFree
                ? "Tax-Free (EEE)"
                : formatINR(result.postTaxValue),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Post Office Scheme
          </h2>
          <div className="space-y-5">
            {/* Scheme Selector */}
            <div>
              <label className="text-xs font-medium text-ink-60 mb-2 block">
                Select Scheme
              </label>
              <div className="grid grid-cols-4 gap-2">
                {schemeOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setScheme(s.value)}
                    className={`px-2 py-2.5 text-center rounded-lg border transition-colors ${
                      scheme === s.value
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-xs font-semibold">{s.label}</div>
                    <div className="text-[10px] text-ink-60">{s.rate}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-60 mt-2">{config.description}</p>
            </div>

            <SliderInput
              label={scheme === "rd" ? "Monthly Deposit" : "Yearly Investment"}
              icon={IndianRupee}
              value={investmentAmount}
              onChange={setInvestmentAmount}
              min={config.minAmount}
              max={config.maxAmount}
              step={scheme === "rd" ? 100 : 1000}
              formatDisplay={formatINR}
            />

            {/* Scheme Info Card */}
            <div className="p-3 rounded-lg bg-canvas border border-ink/5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-60">Interest Rate</span>
                <span className="font-semibold text-authority-green">
                  {config.rate}% p.a.
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-60">Lock-in Period</span>
                <span className="font-medium text-ink">
                  {config.tenureYears} Years
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-60">Tax Status</span>
                <span
                  className={`font-medium ${config.taxFree ? "text-action-green" : "text-indian-gold"}`}
                >
                  {config.taxFree ? "Tax-Free (EEE)" : "Taxable at Slab"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-60">Section 80C</span>
                <span
                  className={`font-medium ${config.section80C ? "text-action-green" : "text-ink-60"}`}
                >
                  {config.section80C ? "Yes (up to ₹1.5L)" : "No"}
                </span>
              </div>
              {scheme === "mis" && (
                <div className="flex justify-between text-sm pt-2 border-t border-ink/10">
                  <span className="text-ink-60">Monthly Income</span>
                  <span className="font-bold text-authority-green">
                    {formatINR(result.monthlyInterest)}/mo
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Maturity Value"
              value={formatINR(result.maturityValue)}
              ratingLabel={`${config.rate}% rate | ${config.taxFree ? "Tax-Free" : "Taxable"}`}
              ratingType={config.taxFree ? "positive" : "neutral"}
              metrics={[
                { label: "Invested", value: formatINR(result.totalInvested) },
                {
                  label: "Interest Earned",
                  value: formatINR(result.totalReturns),
                },
                { label: "Tenure", value: `${config.tenureYears} Years` },
                {
                  label: config.taxFree ? "Tax Status" : "Post-Tax Value",
                  value: config.taxFree
                    ? "Tax-Free (EEE)"
                    : formatINR(result.postTaxValue),
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
            {config.name} — Growth Over {config.tenureYears} Years
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="poInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="poVal" x1="0" y1="0" x2="0" y2="1">
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
                  width={50}
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
                  fill="url(#poInv)"
                  name="Invested"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#poVal)"
                  name="Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Schemes Comparison */}
        <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            All Post Office Rates
          </h3>
          <div className="space-y-2">
            {schemeOptions.map((s) => {
              const cfg = SCHEMES[s.value];
              return (
                <button
                  key={s.value}
                  onClick={() => setScheme(s.value)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors ${
                    scheme === s.value
                      ? "bg-action-green/10 border border-green-200"
                      : "hover:bg-canvas"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium text-ink">{cfg.name}</p>
                    <p className="text-[11px] text-ink-60">
                      {cfg.tenureYears}Y •{" "}
                      {cfg.taxFree ? "Tax-Free" : "Taxable"}
                    </p>
                  </div>
                  <span className="font-bold text-authority-green">{cfg.rate}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="post-office-savings" variant="strip" />
      </div>
    </div>
  );
}
