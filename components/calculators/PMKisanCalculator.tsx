"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Sprout, TrendingUp } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
  formatINR,
  yAxisINR,
} from "./shared/charts";

const PM_KISAN_ANNUAL = 6000;
const PM_KISAN_INSTALLMENT = 2000;

export function PMKisanCalculator() {
  const [landHolding, setLandHolding] = useState(2);
  const [years, setYears] = useState(10);
  const [investmentType, setInvestmentType] = useState<
    "savings" | "sip" | "ppf"
  >("sip");

  const rates: Record<string, { label: string; rate: number }> = {
    savings: { label: "Savings Account (4%)", rate: 0.04 },
    sip: { label: "SIP / Equity MF (12%)", rate: 0.12 },
    ppf: { label: "PPF (7.1%)", rate: 0.071 },
  };

  const result = useMemo(() => {
    const totalReceived = PM_KISAN_ANNUAL * years;
    const monthlyInvestment = PM_KISAN_INSTALLMENT / 4; // ₹500/month equivalent (₹2000 every 4 months)
    const r = rates[investmentType].rate;

    // SIP future value: monthly compounding
    const mr = r / 12;
    const months = years * 12;
    let sipFV = 0;
    if (mr === 0) {
      sipFV = monthlyInvestment * months;
    } else {
      sipFV =
        monthlyInvestment * ((Math.pow(1 + mr, months) - 1) / mr) * (1 + mr);
    }

    // Calculate for all 3 options for comparison
    const calcSIP = (rate: number) => {
      const m = rate / 12;
      if (m === 0) return monthlyInvestment * months;
      return monthlyInvestment * ((Math.pow(1 + m, months) - 1) / m) * (1 + m);
    };

    const savingsFV = calcSIP(0.04);
    const sipEquityFV = calcSIP(0.12);
    const ppfFV = calcSIP(0.071);

    const wealthGain = sipFV - totalReceived;

    // Year-wise data
    const yearlyData = [];
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const received = PM_KISAN_ANNUAL * y;
      const invested =
        monthlyInvestment * ((Math.pow(1 + mr, m) - 1) / mr) * (1 + mr);
      yearlyData.push({
        year: `Y${y}`,
        received: Math.round(received),
        invested: Math.round(mr === 0 ? monthlyInvestment * m : invested),
      });
    }

    return {
      totalReceived,
      sipFV: Math.round(sipFV),
      wealthGain: Math.round(wealthGain),
      savingsFV: Math.round(savingsFV),
      sipEquityFV: Math.round(sipEquityFV),
      ppfFV: Math.round(ppfFV),
      monthlyInvestment,
      yearlyData,
    };
  }, [years, investmentType]);

  const scenarios = useMemo(() => {
    const calc = (rate: number, y: number) => {
      const mr = rate / 12;
      const m = y * 12;
      const monthly = PM_KISAN_INSTALLMENT / 4;
      if (mr === 0) return monthly * m;
      return monthly * ((Math.pow(1 + mr, m) - 1) / mr) * (1 + mr);
    };
    return [
      {
        label: "Savings Account (4%)",
        description: `${years} yrs @ 4% p.a.`,
        value: formatINR(calc(0.04, years)),
        subtext: `Total deposited: ${formatINR(PM_KISAN_ANNUAL * years)}`,
        type: "conservative" as const,
      },
      {
        label: "SIP / Equity MF (12%)",
        description: `${years} yrs @ 12% p.a.`,
        value: formatINR(calc(0.12, years)),
        subtext: "Best growth potential",
        type: "moderate" as const,
      },
      {
        label: "PPF (7.1%)",
        description: `${years} yrs @ 7.1% p.a.`,
        value: formatINR(calc(0.071, years)),
        subtext: "Tax-free returns, govt backed",
        type: "aggressive" as const,
      },
    ];
  }, [years]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `₹6,000/saal lagta kam hai, lekin ${years} saal SIP mein invest karein toh ${formatINR(result.sipEquityFV)} ban sakta hai! Power of compounding.`,
    );
    ins.push(
      `PM-KISAN se har 4 mahine ₹2,000 milta hai. Agar yeh ₹500/month SIP mein daalein toh ${years} saal mein ${formatINR(result.wealthGain)} ka extra wealth banta hai.`,
    );
    ins.push(
      `Eligibility: 2 hectare se kam zameen wale small/marginal farmers. Land records Aadhaar se linked hona chahiye. Family mein sirf ek member ko milta hai.`,
    );
    if (years >= 10) {
      ins.push(
        `${years} saal mein total ${formatINR(result.totalReceived)} milega PM-KISAN se. PPF mein daalna safe hai (${formatINR(result.ppfFV)}), SIP mein growth zyada (${formatINR(result.sipEquityFV)}).`,
      );
    }
    return ins;
  }, [result, years]);

  const pieData = [
    {
      name: "Total PM-KISAN Received",
      value: result.totalReceived,
      color: "#166534",
    },
    {
      name: "Investment Growth",
      value: Math.max(0, result.wealthGain),
      color: "#22c55e",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Investment Value"
          value={formatINR(result.sipFV)}
          ratingLabel={`PM-KISAN received: ${formatINR(result.totalReceived)}`}
          ratingType={
            result.wealthGain > result.totalReceived ? "positive" : "neutral"
          }
          metrics={[
            { label: "Annual Benefit", value: formatINR(PM_KISAN_ANNUAL) },
            { label: "Total Received", value: formatINR(result.totalReceived) },
            {
              label: "If Invested (SIP)",
              value: formatINR(result.sipEquityFV),
            },
            { label: "Wealth Gain", value: formatINR(result.wealthGain) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            PM-KISAN Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Land Holding"
              icon={Sprout}
              value={landHolding}
              onChange={setLandHolding}
              min={0.5}
              max={5}
              step={0.5}
              suffix=" hectares"
            />
            <SliderInput
              label="Years Receiving Benefit"
              icon={Calendar}
              value={years}
              onChange={setYears}
              min={1}
              max={20}
              step={1}
              suffix=" Yrs"
            />

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Investment Plan for PM-KISAN Money
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(rates).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setInvestmentType(key as "savings" | "sip" | "ppf")
                    }
                    className={`px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                      investmentType === key
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:bg-canvas"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Investment Value"
              value={formatINR(result.sipFV)}
              ratingLabel={`PM-KISAN received: ${formatINR(result.totalReceived)}`}
              ratingType={
                result.wealthGain > result.totalReceived
                  ? "positive"
                  : "neutral"
              }
              metrics={[
                { label: "Annual Benefit", value: formatINR(PM_KISAN_ANNUAL) },
                {
                  label: "Total Received",
                  value: formatINR(result.totalReceived),
                },
                {
                  label: "If Invested (SIP)",
                  value: formatINR(result.sipEquityFV),
                },
                { label: "Wealth Gain", value: formatINR(result.wealthGain) },
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
            PM-KISAN Received vs Investment Growth
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="pmkRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pmkInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
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
                  width={45}
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="received"
                  stroke="#166534"
                  strokeWidth={2}
                  fill="url(#pmkRec)"
                  name="PM-KISAN Received"
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#pmkInv)"
                  name="Investment Value"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-ink/5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <div>
                  <p className="text-[11px] text-ink-60">{d.name}</p>
                  <p className="text-sm font-display font-bold text-ink">
                    {formatINR(d.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            PM-KISAN Scheme Details
          </h3>
          <div className="space-y-3 text-xs text-ink-60">
            <div className="flex items-start gap-2">
              <IndianRupee className="w-4 h-4 text-action-green mt-0.5 shrink-0" />
              <p>
                ₹6,000/year in 3 installments of ₹2,000 each (Apr-Jul, Aug-Nov,
                Dec-Mar)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Sprout className="w-4 h-4 text-action-green mt-0.5 shrink-0" />
              <p>
                Eligible: Small & marginal farmer families with up to 2 hectares
                of cultivable land
              </p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-action-green mt-0.5 shrink-0" />
              <p>
                Direct Benefit Transfer (DBT) — money goes straight to
                Aadhaar-linked bank account
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-action-green mt-0.5 shrink-0" />
              <p>
                Launched Feb 2019. Over 11 crore farmers enrolled. No income tax
                on this benefit.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="pm-kisan" variant="strip" />
      </div>
    </div>
  );
}
