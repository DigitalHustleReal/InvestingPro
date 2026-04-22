"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Receipt, Scale } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { ResultCard } from "./shared/ResultCard";
import { AIInsight } from "./shared/AIInsight";
import { WhatIfScenarios } from "./shared/WhatIfScenarios";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  formatINR,
} from "./shared/charts";

type AssetType =
  | "equity_shares"
  | "equity_mf"
  | "debt_mf"
  | "property"
  | "gold";

interface AssetConfig {
  label: string;
  stcgRate: number;
  ltcgRate: number;
  ltcgExemption: number;
  holdingPeriodMonths: number;
  indexation: boolean;
  surchargeApplicable: boolean;
}

const ASSET_CONFIGS: Record<AssetType, AssetConfig> = {
  equity_shares: {
    label: "Equity Shares (Listed)",
    stcgRate: 20,
    ltcgRate: 12.5,
    ltcgExemption: 125000,
    holdingPeriodMonths: 12,
    indexation: false,
    surchargeApplicable: true,
  },
  equity_mf: {
    label: "Equity Mutual Funds",
    stcgRate: 20,
    ltcgRate: 12.5,
    ltcgExemption: 125000,
    holdingPeriodMonths: 12,
    indexation: false,
    surchargeApplicable: true,
  },
  debt_mf: {
    label: "Debt Mutual Funds",
    stcgRate: 30, // slab rate (using 30% as proxy)
    ltcgRate: 30, // no LTCG benefit, taxed at slab
    ltcgExemption: 0,
    holdingPeriodMonths: 0, // always slab rate
    indexation: false,
    surchargeApplicable: false,
  },
  property: {
    label: "Real Estate / Property",
    stcgRate: 30, // slab rate
    ltcgRate: 12.5,
    ltcgExemption: 0,
    holdingPeriodMonths: 24,
    indexation: false, // removed from July 2024 budget
    surchargeApplicable: true,
  },
  gold: {
    label: "Gold / SGB / Gold ETF",
    stcgRate: 30, // slab rate for physical gold
    ltcgRate: 12.5,
    ltcgExemption: 0,
    holdingPeriodMonths: 24, // physical gold / ETF
    indexation: false,
    surchargeApplicable: true,
  },
};

export function CapitalGainsTaxCalculator() {
  const [assetType, setAssetType] = useState<AssetType>("equity_shares");
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [salePrice, setSalePrice] = useState(800000);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [taxSlab, setTaxSlab] = useState(30);

  const config = ASSET_CONFIGS[assetType];

  const result = useMemo(() => {
    const gain = salePrice - purchasePrice;
    if (gain <= 0) {
      return {
        gain: Math.round(gain),
        isLongTerm: false,
        taxableGain: 0,
        taxRate: 0,
        tax: 0,
        cess: 0,
        totalTax: 0,
        netGain: Math.round(gain),
        effectiveTaxRate: 0,
        postTaxAmount: Math.round(salePrice),
      };
    }

    const isLongTerm =
      config.holdingPeriodMonths > 0 &&
      holdingMonths >= config.holdingPeriodMonths;

    // Debt MFs always taxed at slab rate
    let taxRate: number;
    let taxableGain: number;

    if (assetType === "debt_mf") {
      taxRate = taxSlab;
      taxableGain = gain;
    } else if (isLongTerm) {
      taxRate = config.ltcgRate;
      taxableGain = Math.max(0, gain - config.ltcgExemption);
    } else {
      taxRate =
        assetType === "property" || assetType === "gold"
          ? taxSlab
          : config.stcgRate;
      taxableGain = gain;
    }

    const tax = Math.round((taxableGain * taxRate) / 100);
    const cess = Math.round(tax * 0.04); // 4% health & education cess
    const totalTax = tax + cess;
    const netGain = gain - totalTax;
    const effectiveTaxRate =
      gain > 0 ? Math.round((totalTax / gain) * 10000) / 100 : 0;

    return {
      gain: Math.round(gain),
      isLongTerm,
      taxableGain: Math.round(taxableGain),
      taxRate,
      tax,
      cess,
      totalTax,
      netGain: Math.round(netGain),
      effectiveTaxRate,
      postTaxAmount: Math.round(salePrice - totalTax),
    };
  }, [assetType, purchasePrice, salePrice, holdingMonths, config, taxSlab]);

  const scenarios = useMemo(() => {
    const calcTax = (sp: number) => {
      const g = sp - purchasePrice;
      if (g <= 0) return 0;
      const isLT =
        config.holdingPeriodMonths > 0 &&
        holdingMonths >= config.holdingPeriodMonths;
      let tg: number;
      let rate: number;
      if (assetType === "debt_mf") {
        rate = taxSlab;
        tg = g;
      } else if (isLT) {
        rate = config.ltcgRate;
        tg = Math.max(0, g - config.ltcgExemption);
      } else {
        rate =
          assetType === "property" || assetType === "gold"
            ? taxSlab
            : config.stcgRate;
        tg = g;
      }
      const t = Math.round((tg * rate) / 100);
      return t + Math.round(t * 0.04);
    };

    const sp1 = purchasePrice * 1.2;
    const sp2 = purchasePrice * 1.5;
    const sp3 = purchasePrice * 2;

    return [
      {
        label: "20% Gain",
        description: `Sale: ${formatINR(sp1)}`,
        value: formatINR(calcTax(sp1)),
        subtext: `Net: ${formatINR(sp1 - calcTax(sp1))}`,
        type: "conservative" as const,
      },
      {
        label: "50% Gain",
        description: `Sale: ${formatINR(sp2)}`,
        value: formatINR(calcTax(sp2)),
        subtext: `Net: ${formatINR(sp2 - calcTax(sp2))}`,
        type: "moderate" as const,
      },
      {
        label: "100% Gain (2x)",
        description: `Sale: ${formatINR(sp3)}`,
        value: formatINR(calcTax(sp3)),
        subtext: `Net: ${formatINR(sp3 - calcTax(sp3))}`,
        type: "aggressive" as const,
      },
    ];
  }, [purchasePrice, holdingMonths, config, assetType, taxSlab]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.gain <= 0) {
      ins.push(
        `Loss of ${formatINR(Math.abs(result.gain))}. Equity losses ko 8 saal tak carry forward kar sakte hain aur future LTCG/STCG se offset kar sakte hain (tax harvesting).`,
      );
      return ins;
    }

    ins.push(
      `${result.isLongTerm ? "Long-Term" : "Short-Term"} Capital Gain: ${formatINR(result.gain)}. Tax: ${formatINR(result.totalTax)} (effective rate: ${result.effectiveTaxRate}%). Net gain: ${formatINR(result.netGain)}.`,
    );

    if (!result.isLongTerm && config.holdingPeriodMonths > 0) {
      const monthsLeft = config.holdingPeriodMonths - holdingMonths;
      if (monthsLeft > 0 && monthsLeft <= 6) {
        const ltcgTax =
          assetType === "debt_mf"
            ? result.totalTax
            : Math.round(
                ((Math.max(0, result.gain - config.ltcgExemption) *
                  config.ltcgRate) /
                  100) *
                  1.04,
              );
        const saving = result.totalTax - ltcgTax;
        if (saving > 0) {
          ins.push(
            `Sirf ${monthsLeft} mahine aur hold karein toh LTCG rate lag jaayega — ${formatINR(saving)} tax bachega! STCG ${result.taxRate}% vs LTCG ${config.ltcgRate}%.`,
          );
        }
      }
    }

    if (assetType === "equity_shares" || assetType === "equity_mf") {
      if (result.isLongTerm && result.gain > 125000) {
        ins.push(
          `Tip: Har financial year mein ₹1.25L tak LTCG tax-free hai. Partial redemption se tax optimize karein — ₹1.25L har saal redeem karke zero tax dein.`,
        );
      }
    }

    if (assetType === "property") {
      ins.push(
        `Section 54: Naya ghar khareeden 2 saal mein toh LTCG tax exempt hai. Section 54EC: NHAI/REC bonds mein ₹50L tak invest karke tax bachayein.`,
      );
    }

    return ins;
  }, [result, assetType, holdingMonths, config]);

  const pieData =
    result.gain > 0
      ? [
          { name: "Net Gain", value: result.netGain, color: "#22c55e" },
          { name: "Tax + Cess", value: result.totalTax, color: "#dc2626" },
        ]
      : [];

  const assetOptions: { value: AssetType; label: string }[] = [
    { value: "equity_shares", label: "Stocks" },
    { value: "equity_mf", label: "Equity MF" },
    { value: "debt_mf", label: "Debt MF" },
    { value: "property", label: "Property" },
    { value: "gold", label: "Gold" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title="Capital Gains Tax"
          value={formatINR(result.totalTax)}
          ratingLabel={`${result.isLongTerm ? "LTCG" : "STCG"} @ ${result.taxRate}% | Effective: ${result.effectiveTaxRate}%`}
          ratingType={result.effectiveTaxRate < 15 ? "positive" : "neutral"}
          metrics={[
            { label: "Capital Gain", value: formatINR(result.gain) },
            { label: "Taxable Amount", value: formatINR(result.taxableGain) },
            { label: "Tax + Cess", value: formatINR(result.totalTax) },
            { label: "Net Gain", value: formatINR(result.netGain) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Transaction Details
          </h2>
          <div className="space-y-5">
            {/* Asset Type Toggle */}
            <div>
              <label className="text-xs font-medium text-ink-60 mb-2 block">
                Asset Type
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {assetOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAssetType(a.value)}
                    className={`px-2 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      assetType === a.value
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:border-gray-300"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <SliderInput
              label="Purchase Price (Total)"
              icon={IndianRupee}
              value={purchasePrice}
              onChange={setPurchasePrice}
              min={10000}
              max={10000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Sale Price (Total)"
              icon={IndianRupee}
              value={salePrice}
              onChange={setSalePrice}
              min={10000}
              max={10000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Holding Period"
              icon={Calendar}
              value={holdingMonths}
              onChange={setHoldingMonths}
              min={1}
              max={120}
              step={1}
              formatDisplay={(v) =>
                v >= 12 ? `${Math.floor(v / 12)}Y ${v % 12}M` : `${v} months`
              }
            />
            {(assetType === "debt_mf" ||
              assetType === "property" ||
              assetType === "gold") && (
              <SliderInput
                label="Your Tax Slab"
                icon={Receipt}
                value={taxSlab}
                onChange={setTaxSlab}
                min={0}
                max={30}
                step={5}
                suffix="%"
              />
            )}

            {/* Type Badge */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-canvas border border-ink/5">
              <Scale className="w-4 h-4 text-ink-60" />
              <div className="text-sm">
                <span
                  className={`font-semibold ${result.isLongTerm ? "text-authority-green" : "text-indian-gold"}`}
                >
                  {result.isLongTerm ? "Long-Term" : "Short-Term"} Capital Gain
                </span>
                {config.holdingPeriodMonths > 0 && (
                  <span className="text-ink-60 ml-1">
                    (LTCG threshold:{" "}
                    {config.holdingPeriodMonths >= 12
                      ? `${config.holdingPeriodMonths / 12}Y`
                      : `${config.holdingPeriodMonths}M`}
                    )
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Capital Gains Tax"
              value={formatINR(result.totalTax)}
              ratingLabel={`${result.isLongTerm ? "LTCG" : "STCG"} @ ${result.taxRate}% | Effective: ${result.effectiveTaxRate}%`}
              ratingType={result.effectiveTaxRate < 15 ? "positive" : "neutral"}
              metrics={[
                { label: "Capital Gain", value: formatINR(result.gain) },
                {
                  label: "Taxable Amount",
                  value: formatINR(result.taxableGain),
                },
                { label: "Tax + Cess", value: formatINR(result.totalTax) },
                { label: "Net Gain", value: formatINR(result.netGain) },
              ]}
            />
          </div>
          <AIInsight insights={insights} />

          {/* Tax Breakdown */}
          {result.gain > 0 && (
            <div className="bg-white border border-ink/10 rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-display font-semibold text-ink mb-3">
                Tax Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-60">Sale Price</span>
                  <span className="font-medium">{formatINR(salePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-60">Purchase Price</span>
                  <span className="font-medium">
                    - {formatINR(purchasePrice)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-ink/5">
                  <span className="font-medium text-ink">
                    Capital Gain
                  </span>
                  <span className="font-semibold text-authority-green">
                    {formatINR(result.gain)}
                  </span>
                </div>
                {config.ltcgExemption > 0 && result.isLongTerm && (
                  <div className="flex justify-between">
                    <span className="text-ink-60">LTCG Exemption</span>
                    <span className="font-medium text-action-green">
                      - {formatINR(config.ltcgExemption)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink-60">Taxable Gain</span>
                  <span className="font-medium">
                    {formatINR(result.taxableGain)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-60">Tax @ {result.taxRate}%</span>
                  <span className="font-medium text-red-600">
                    {formatINR(result.tax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-60">Health & Edu Cess (4%)</span>
                  <span className="font-medium text-red-600">
                    {formatINR(result.cess)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-ink/5">
                  <span className="font-display font-semibold text-ink">Total Tax</span>
                  <span className="font-bold text-red-600">
                    {formatINR(result.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-display font-semibold text-ink">
                    You Receive
                  </span>
                  <span className="font-bold text-authority-green">
                    {formatINR(result.postTaxAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      {/* Tax Rate Reference */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Capital Gains Tax Rates — India 2026 (Budget July 2024 Onwards)
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/5">
              <th className="text-left py-2 text-ink-60 font-medium">
                Asset
              </th>
              <th className="text-center py-2 text-ink-60 font-medium">
                LTCG Threshold
              </th>
              <th className="text-center py-2 text-ink-60 font-medium">
                STCG Rate
              </th>
              <th className="text-center py-2 text-ink-60 font-medium">
                LTCG Rate
              </th>
              <th className="text-center py-2 text-ink-60 font-medium">
                Exemption
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(ASSET_CONFIGS).map(([key, cfg]) => (
              <tr
                key={key}
                className={`border-b border-gray-50 ${key === assetType ? "bg-action-green/10" : ""}`}
              >
                <td className="py-2.5 font-medium text-ink">
                  {cfg.label}
                </td>
                <td className="text-center py-2.5 text-ink-60">
                  {cfg.holdingPeriodMonths === 0
                    ? "N/A (slab)"
                    : cfg.holdingPeriodMonths >= 12
                      ? `${cfg.holdingPeriodMonths / 12} year`
                      : `${cfg.holdingPeriodMonths}M`}
                </td>
                <td className="text-center py-2.5 text-indian-gold font-medium">
                  {cfg.stcgRate}%
                </td>
                <td className="text-center py-2.5 text-authority-green font-medium">
                  {cfg.ltcgRate}%
                </td>
                <td className="text-center py-2.5 text-ink-60">
                  {cfg.ltcgExemption > 0 ? formatINR(cfg.ltcgExemption) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-ink-60 mt-2">
          * Debt MF gains taxed at slab rate regardless of holding period (post
          April 2023). Property/Gold LTCG at 12.5% without indexation (post July
          2024 budget).
        </p>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="capital-gains-tax" variant="strip" />
      </div>
    </div>
  );
}
