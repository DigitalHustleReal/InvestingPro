"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, BarChart3, Percent, ArrowRightLeft } from "lucide-react";
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

type TradeType = "delivery" | "intraday" | "futures" | "options";

const BROKER_PLANS = {
  zerodha: {
    name: "Zerodha",
    delivery: 0,
    intraday: 20,
    futures: 20,
    options: 20,
    label: "Flat ₹20",
  },
  groww: {
    name: "Groww",
    delivery: 0,
    intraday: 20,
    futures: 20,
    options: 20,
    label: "Flat ₹20",
  },
  traditional: {
    name: "Traditional Broker",
    delivery: 0.5,
    intraday: 0.05,
    futures: 0.05,
    options: 100,
    label: "% Based",
  },
};

export function BrokerageCalculator() {
  const [tradeValue, setTradeValue] = useState(100000);
  const [tradesPerMonth, setTradesPerMonth] = useState(20);
  const [tradeType, setTradeType] = useState<TradeType>("intraday");
  const [brokerageRate, setBrokerageRate] = useState(20); // flat per order

  const result = useMemo(() => {
    // Flat fee broker (Zerodha/Groww style)
    const flatBrokerage =
      tradeType === "delivery"
        ? 0
        : Math.min(brokerageRate, tradeValue * 0.0025);
    const flatPerTrade = flatBrokerage;

    // Traditional broker (percentage based)
    const tradPct =
      tradeType === "delivery"
        ? 0.5
        : tradeType === "intraday"
          ? 0.05
          : tradeType === "futures"
            ? 0.05
            : 0;
    const tradBrokerage =
      tradeType === "options" ? 100 : (tradeValue * tradPct) / 100;

    // Statutory charges (same for all brokers)
    const stt =
      tradeType === "delivery"
        ? tradeValue * 0.001
        : tradeType === "intraday"
          ? tradeValue * 0.00025
          : tradeType === "futures"
            ? tradeValue * 0.000125
            : tradeValue * 0.0005; // options on premium
    const exchangeCharge = tradeValue * 0.0000345; // NSE
    const gst = (flatBrokerage + exchangeCharge) * 0.18;
    const sebiCharge = tradeValue * 0.000001;
    const stampDuty =
      tradeType === "delivery"
        ? tradeValue * 0.00015
        : tradeType === "intraday"
          ? tradeValue * 0.00003
          : tradeValue * 0.00002;

    const totalPerTradeFlat =
      flatPerTrade + stt + exchangeCharge + gst + sebiCharge + stampDuty;
    const tradGst = (tradBrokerage + exchangeCharge) * 0.18;
    const totalPerTradeTrad =
      tradBrokerage + stt + exchangeCharge + tradGst + sebiCharge + stampDuty;

    const monthlyFlat = totalPerTradeFlat * tradesPerMonth;
    const monthlyTrad = totalPerTradeTrad * tradesPerMonth;
    const yearlyFlat = monthlyFlat * 12;
    const yearlyTrad = monthlyTrad * 12;
    const yearlySavings = yearlyTrad - yearlyFlat;

    // Breakeven: at what trade value does flat = percentage
    const breakeven = tradPct > 0 ? brokerageRate / (tradPct / 100) : 0;

    // Impact on returns (yearly charges as % of capital)
    const capitalDeployed = tradeValue * tradesPerMonth * 12;
    const chargesAsPercent =
      capitalDeployed > 0 ? (yearlyFlat / capitalDeployed) * 100 : 0;

    // Monthly chart data
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      flat: Math.round(totalPerTradeFlat * tradesPerMonth * (i + 1)),
      traditional: Math.round(totalPerTradeTrad * tradesPerMonth * (i + 1)),
    }));

    return {
      flatBrokerage: Math.round(flatPerTrade),
      tradBrokerage: Math.round(tradBrokerage),
      stt: Math.round(stt),
      exchangeCharge: Math.round(exchangeCharge * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      stampDuty: Math.round(stampDuty * 100) / 100,
      sebiCharge: Math.round(sebiCharge * 100) / 100,
      totalPerTradeFlat: Math.round(totalPerTradeFlat),
      totalPerTradeTrad: Math.round(totalPerTradeTrad),
      monthlyFlat: Math.round(monthlyFlat),
      monthlyTrad: Math.round(monthlyTrad),
      yearlyFlat: Math.round(yearlyFlat),
      yearlyTrad: Math.round(yearlyTrad),
      yearlySavings: Math.round(yearlySavings),
      breakeven: Math.round(breakeven),
      chargesAsPercent: Math.round(chargesAsPercent * 100) / 100,
      monthlyData,
    };
  }, [tradeValue, tradesPerMonth, tradeType, brokerageRate]);

  const scenarios = useMemo(() => {
    const calcMonthly = (trades: number) => {
      const flat =
        tradeType === "delivery"
          ? 0
          : Math.min(brokerageRate, tradeValue * 0.0025);
      const stt =
        tradeType === "delivery"
          ? tradeValue * 0.001
          : tradeType === "intraday"
            ? tradeValue * 0.00025
            : tradeValue * 0.000125;
      const exc = tradeValue * 0.0000345;
      const gst = (flat + exc) * 0.18;
      const stamp =
        tradeType === "delivery" ? tradeValue * 0.00015 : tradeValue * 0.00003;
      return Math.round(
        (flat + stt + exc + gst + stamp + tradeValue * 0.000001) * trades,
      );
    };
    return [
      {
        label: "Casual (10/mo)",
        description: `${formatINR(calcMonthly(10))}/mo charges`,
        value: formatINR(calcMonthly(10) * 12),
        subtext: "Yearly trading charges",
        type: "conservative" as const,
      },
      {
        label: "Active (30/mo)",
        description: `${formatINR(calcMonthly(30))}/mo charges`,
        value: formatINR(calcMonthly(30) * 12),
        subtext: "Yearly trading charges",
        type: "moderate" as const,
      },
      {
        label: "Heavy (100/mo)",
        description: `${formatINR(calcMonthly(100))}/mo charges`,
        value: formatINR(calcMonthly(100) * 12),
        subtext: "Yearly trading charges",
        type: "aggressive" as const,
      },
    ];
  }, [tradeValue, tradeType, brokerageRate]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `Flat-fee broker se aap yearly ${formatINR(result.yearlySavings)} bachate hain vs traditional broker. ${tradesPerMonth * 12} trades/year ke liye yeh bahut bada fark hai.`,
    );
    if (tradeType === "delivery") {
      ins.push(
        `Delivery trades pe Zerodha/Groww zero brokerage lete hain. Sirf STT (${formatINR(result.stt)}) aur statutory charges lagti hain per trade.`,
      );
    }
    if (result.chargesAsPercent > 0.5) {
      ins.push(
        `Warning: Trading charges aapke capital ka ${result.chargesAsPercent}% kha rahi hain yearly. Trade size badhayein ya frequency kam karein — target < 0.5%.`,
      );
    } else {
      ins.push(
        `Trading charges aapke capital ka sirf ${result.chargesAsPercent}% hain yearly — yeh healthy range mein hai. Charges < 0.5% rakhein.`,
      );
    }
    if (result.breakeven > 0) {
      ins.push(
        `Breakeven point: ${formatINR(result.breakeven)} trade value pe flat aur percentage brokerage barabar hoti hai. Isse zyada value pe flat-fee broker sasta hai.`,
      );
    }
    return ins;
  }, [result, tradeType, tradesPerMonth]);

  const tradeTypes: { value: TradeType; label: string }[] = [
    { value: "delivery", label: "Delivery" },
    { value: "intraday", label: "Intraday" },
    { value: "futures", label: "F&O Futures" },
    { value: "options", label: "Options" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Total Charges Per Trade"
          value={formatINR(result.totalPerTradeFlat)}
          ratingLabel={`Save ${formatINR(result.yearlySavings)}/yr vs traditional`}
          ratingType={result.yearlySavings > 0 ? "positive" : "neutral"}
          metrics={[
            { label: "Brokerage", value: formatINR(result.flatBrokerage) },
            { label: "STT", value: formatINR(result.stt) },
            { label: "Monthly Cost", value: formatINR(result.monthlyFlat) },
            { label: "Yearly Cost", value: formatINR(result.yearlyFlat) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Trade Details
          </h2>
          <div className="space-y-5">
            {/* Trade Type Toggle */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Trade Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {tradeTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTradeType(t.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      tradeType === t.value
                        ? "bg-green-50 border-green-600 text-green-700"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <SliderInput
              label="Trade Value"
              icon={IndianRupee}
              value={tradeValue}
              onChange={setTradeValue}
              min={5000}
              max={1000000}
              step={5000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Trades Per Month"
              icon={ArrowRightLeft}
              value={tradesPerMonth}
              onChange={setTradesPerMonth}
              min={1}
              max={200}
              step={1}
              suffix=" trades"
            />
            {tradeType !== "delivery" && (
              <SliderInput
                label="Brokerage Per Order"
                icon={BarChart3}
                value={brokerageRate}
                onChange={setBrokerageRate}
                min={0}
                max={50}
                step={1}
                formatDisplay={(v) => `₹${v} flat`}
              />
            )}
          </div>

          {/* Charge Breakdown */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Per-Trade Breakdown (Flat-Fee Broker)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Brokerage</span>
                <span className="font-medium text-gray-900">
                  {formatINR(result.flatBrokerage)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">STT</span>
                <span className="font-medium text-gray-900">
                  {formatINR(result.stt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exchange Txn</span>
                <span className="font-medium text-gray-900">
                  ₹{result.exchangeCharge.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GST (18%)</span>
                <span className="font-medium text-gray-900">
                  ₹{result.gst.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stamp Duty</span>
                <span className="font-medium text-gray-900">
                  ₹{result.stampDuty.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SEBI Charges</span>
                <span className="font-medium text-gray-900">
                  ₹{result.sebiCharge.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-green-700">
                  {formatINR(result.totalPerTradeFlat)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Total Charges Per Trade"
              value={formatINR(result.totalPerTradeFlat)}
              ratingLabel={`Save ${formatINR(result.yearlySavings)}/yr vs traditional`}
              ratingType={result.yearlySavings > 0 ? "positive" : "neutral"}
              metrics={[
                { label: "Brokerage", value: formatINR(result.flatBrokerage) },
                { label: "STT", value: formatINR(result.stt) },
                { label: "Monthly Cost", value: formatINR(result.monthlyFlat) },
                { label: "Yearly Cost", value: formatINR(result.yearlyFlat) },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      {/* Flat vs Traditional Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Flat-Fee vs Traditional Broker — Cumulative Charges
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            See how much you save over 12 months
          </p>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.monthlyData}>
                <defs>
                  <linearGradient id="brFlat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="brTrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
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
                  dataKey="traditional"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fill="url(#brTrad)"
                  name="Traditional Broker"
                />
                <Area
                  type="monotone"
                  dataKey="flat"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#brFlat)"
                  name="Flat-Fee Broker"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <div>
                <p className="text-[11px] text-gray-400">
                  Flat-Fee (Zerodha/Groww)
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {formatINR(result.yearlyFlat)}/yr
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <div>
                <p className="text-[11px] text-gray-400">Traditional Broker</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatINR(result.yearlyTrad)}/yr
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductRecs
          category="demat-accounts"
          title="Best Demat Accounts"
          matchCriteria="Zero brokerage delivery"
        />
      </div>

      {/* Broker Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Broker Comparison —{" "}
          {tradeTypes.find((t) => t.value === tradeType)?.label} Trading
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-gray-500 font-medium">
                Broker
              </th>
              <th className="text-right py-2 text-gray-500 font-medium">
                Per Trade
              </th>
              <th className="text-right py-2 text-gray-500 font-medium">
                Monthly
              </th>
              <th className="text-right py-2 text-gray-500 font-medium">
                Yearly
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(BROKER_PLANS).map(([key, broker]) => {
              const brokerage =
                tradeType === "delivery"
                  ? 0
                  : key === "traditional"
                    ? tradeType === "options"
                      ? broker.options
                      : tradeValue * (broker[tradeType] / 100)
                    : Math.min(broker[tradeType], tradeValue * 0.0025);
              const stt =
                tradeType === "delivery"
                  ? tradeValue * 0.001
                  : tradeType === "intraday"
                    ? tradeValue * 0.00025
                    : tradeValue * 0.000125;
              const exc = tradeValue * 0.0000345;
              const gst = (brokerage + exc) * 0.18;
              const total =
                brokerage +
                stt +
                exc +
                gst +
                tradeValue * 0.000001 +
                (tradeType === "delivery"
                  ? tradeValue * 0.00015
                  : tradeValue * 0.00003);
              const monthly = total * tradesPerMonth;
              const yearly = monthly * 12;
              return (
                <tr key={key} className="border-b border-gray-50">
                  <td className="py-2.5 font-medium text-gray-900">
                    {broker.name}
                    <span className="text-xs text-gray-400 ml-1">
                      ({broker.label})
                    </span>
                  </td>
                  <td className="text-right py-2.5 text-gray-700">
                    {formatINR(Math.round(total))}
                  </td>
                  <td className="text-right py-2.5 text-gray-700">
                    {formatINR(Math.round(monthly))}
                  </td>
                  <td className="text-right py-2.5 font-semibold text-gray-900">
                    {formatINR(Math.round(yearly))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="brokerage" variant="strip" />
      </div>
    </div>
  );
}
