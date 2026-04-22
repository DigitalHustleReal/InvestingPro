"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Percent, Gem, Scale } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
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
import { cn } from "@/lib/utils";

type GoldType = "physical" | "digital" | "etf" | "sgb";

const GOLD_OPTIONS: {
  type: GoldType;
  name: string;
  makingCharge: number;
  annualCost: number;
  taxBenefit: string;
  liquidity: string;
  extra: number;
}[] = [
  {
    type: "physical",
    name: "Physical Gold (Jewellery)",
    makingCharge: 15,
    annualCost: 0.5,
    taxBenefit: "LTCG after 3 years (20% with indexation)",
    liquidity: "Low — sell to jeweller at 10-15% discount",
    extra: 3,
  },
  {
    type: "digital",
    name: "Digital Gold (Paytm/PhonePe)",
    makingCharge: 3,
    annualCost: 0,
    taxBenefit: "LTCG after 3 years (20% with indexation)",
    liquidity: "High — sell anytime, instant credit",
    extra: 0,
  },
  {
    type: "etf",
    name: "Gold ETF (Mutual Fund)",
    makingCharge: 0,
    annualCost: 0.5,
    taxBenefit: "LTCG after 3 years (20% with indexation)",
    liquidity: "High — sell on stock exchange",
    extra: 0.5,
  },
  {
    type: "sgb",
    name: "Sovereign Gold Bond (RBI)",
    makingCharge: 0,
    annualCost: 0,
    taxBenefit:
      "TAX-FREE if held till maturity (8 years). 2.5% annual interest.",
    liquidity: "Medium — tradeable after 5 years, maturity 8 years",
    extra: 2.5,
  },
];

export function GoldInvestmentCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [years, setYears] = useState(5);
  const [goldReturn, setGoldReturn] = useState(10);

  const results = useMemo(() => {
    return GOLD_OPTIONS.map((opt) => {
      const effectiveInvestment =
        investmentAmount * (1 - opt.makingCharge / 100);
      const annualReturn = goldReturn - opt.annualCost + opt.extra;
      const fv = effectiveInvestment * Math.pow(1 + annualReturn / 100, years);
      const totalReturn = fv - investmentAmount;
      const effectiveReturn =
        ((fv / investmentAmount) ** (1 / years) - 1) * 100;

      return {
        ...opt,
        effectiveInvestment: Math.round(effectiveInvestment),
        fv: Math.round(fv),
        totalReturn: Math.round(totalReturn),
        effectiveReturn,
      };
    });
  }, [investmentAmount, years, goldReturn]);

  const bestOption = results.reduce(
    (best, r) => (r.fv > best.fv ? r : best),
    results[0],
  );

  const chartData = useMemo(() => {
    const data = [];
    for (let y = 0; y <= years; y++) {
      const row: any = { year: y === 0 ? "Start" : `${y}Y` };
      GOLD_OPTIONS.forEach((opt) => {
        const eff = investmentAmount * (1 - opt.makingCharge / 100);
        const ar = goldReturn - opt.annualCost + opt.extra;
        row[opt.type] = Math.round(eff * Math.pow(1 + ar / 100, y));
      });
      data.push(row);
    }
    return data;
  }, [investmentAmount, years, goldReturn]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    const sgb = results.find((r) => r.type === "sgb")!;
    const physical = results.find((r) => r.type === "physical")!;
    ins.push(
      `SGB (Sovereign Gold Bond) wins by ${formatINR(sgb.fv - physical.fv)} over physical gold. Reason: zero making charge + 2.5% annual interest + TAX-FREE on maturity.`,
    );
    ins.push(
      `Physical gold ka 15% making charge ka matlab: ₹${investmentAmount.toLocaleString("en-IN")} mein se sirf ₹${physical.effectiveInvestment.toLocaleString("en-IN")} gold khareedne mein jaata hai. Baaki jeweller ka profit hai.`,
    );
    if (years < 8) {
      ins.push(
        `SGB ka lock-in 8 saal hai. Agar ${years} saal ke liye invest kar rahe ho, toh Gold ETF ya Digital Gold zyada flexible hai — sell karo jab chaaho.`,
      );
    }
    return ins;
  }, [results, investmentAmount, years]);

  const colors: Record<GoldType, string> = {
    physical: "#d97706",
    digital: "#f59e0b",
    etf: "#22c55e",
    sgb: "#166534",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile: best option result first */}
      <div className="lg:hidden">
        <ResultCard
          title={`Best: ${bestOption.name.split("(")[0].trim()}`}
          value={formatINR(bestOption.fv)}
          ratingLabel={`${bestOption.effectiveReturn.toFixed(1)}% effective CAGR`}
          ratingType="positive"
          metrics={[
            { label: "You Invest", value: formatINR(investmentAmount) },
            {
              label: "You Get",
              value: formatINR(bestOption.fv),
              highlight: true,
            },
            { label: "Return", value: formatINR(bestOption.totalReturn) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5 flex items-center gap-2">
            <Gem size={18} className="text-indian-gold" /> Gold Investment Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Investment Amount"
              icon={IndianRupee}
              value={investmentAmount}
              onChange={setInvestmentAmount}
              min={10000}
              max={5000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Investment Period"
              icon={Calendar}
              value={years}
              onChange={setYears}
              min={1}
              max={15}
              step={1}
              suffix=" Yrs"
            />
            <SliderInput
              label="Gold Price Growth (p.a.)"
              icon={Percent}
              value={goldReturn}
              onChange={setGoldReturn}
              min={5}
              max={20}
              step={0.5}
              suffix="%"
            />
          </div>
          <p className="text-[10px] text-ink-60 mt-3">
            Gold 10-year CAGR: ~10.5%. SGB adds 2.5% interest on top. Making
            charges vary 8-25% for jewellery.
          </p>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title={`Best: ${bestOption.name.split("(")[0].trim()}`}
              value={formatINR(bestOption.fv)}
              ratingLabel={`${bestOption.effectiveReturn.toFixed(1)}% effective CAGR`}
              ratingType="positive"
              metrics={[
                { label: "You Invest", value: formatINR(investmentAmount) },
                {
                  label: "You Get",
                  value: formatINR(bestOption.fv),
                  highlight: true,
                },
                { label: "Return", value: formatINR(bestOption.totalReturn) },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      {/* 4-way comparison cards */}
      <div>
        <h3 className="text-sm font-display font-semibold text-ink mb-3 flex items-center gap-2">
          <Scale size={15} className="text-action-green" /> 4-Way Gold Comparison
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {results.map((r) => (
            <div
              key={r.type}
              className={cn(
                "rounded-sm border p-4 transition-all",
                r.type === bestOption.type
                  ? "bg-action-green/10 border-green-300 ring-2 ring-green-200"
                  : "bg-white border-ink/10",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[r.type] }}
                />
                {r.type === bestOption.type && (
                  <span className="text-[9px] font-bold text-authority-green bg-action-green/20 px-1.5 py-0.5 rounded">
                    BEST
                  </span>
                )}
              </div>
              <p className="text-xs font-display font-semibold text-ink mb-1">
                {r.name.split("(")[0].trim()}
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: colors[r.type] }}
              >
                {formatINR(r.fv)}
              </p>
              <div className="mt-2 space-y-1 text-[10px] text-ink-60">
                <div className="flex justify-between">
                  <span>Making/Entry</span>
                  <span className="font-semibold text-ink">
                    {r.makingCharge}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Cost</span>
                  <span className="font-semibold text-ink">
                    {r.annualCost}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Effective CAGR</span>
                  <span
                    className="font-semibold"
                    style={{ color: colors[r.type] }}
                  >
                    {r.effectiveReturn.toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-ink-60 mt-2 leading-relaxed">
                {r.taxBenefit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth chart */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Growth Comparison — {years} Years
        </h3>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
                dataKey="sgb"
                stroke="#166534"
                strokeWidth={2.5}
                fill="none"
                name="SGB"
              />
              <Area
                type="monotone"
                dataKey="etf"
                stroke="#22c55e"
                strokeWidth={2}
                fill="none"
                name="Gold ETF"
              />
              <Area
                type="monotone"
                dataKey="digital"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="none"
                strokeDasharray="4 4"
                name="Digital Gold"
              />
              <Area
                type="monotone"
                dataKey="physical"
                stroke="#d97706"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="8 4"
                name="Physical Gold"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-3 pt-3 border-t border-ink/5">
          {GOLD_OPTIONS.map((opt) => (
            <div
              key={opt.type}
              className="flex items-center gap-1.5 text-[11px]"
            >
              <div
                className="w-3 h-0.5 rounded"
                style={{ backgroundColor: colors[opt.type] }}
              />
              <span className="text-ink-60">
                {opt.name.split("(")[0].trim()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="gold-investment" variant="strip" />
      </div>
    </div>
  );
}
