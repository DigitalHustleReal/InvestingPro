"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Percent,
  ArrowUpDown,
  Receipt,
  AlertTriangle,
} from "lucide-react";
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

export function CryptoTaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [salePrice, setSalePrice] = useState(500000);
  const [transactionFees, setTransactionFees] = useState(2000);
  const [numTransactions, setNumTransactions] = useState(50);
  const [totalTransactionValue, setTotalTransactionValue] = useState(2000000);

  const result = useMemo(() => {
    // Capital gain = Sale Price - Purchase Price (NO deduction for fees under Section 115BBH)
    const capitalGain = Math.max(0, salePrice - purchasePrice);

    // 30% flat tax on gains — no slab benefit
    const taxOnGain = capitalGain * 0.3;

    // 4% Health & Education Cess on tax
    const cess = taxOnGain * 0.04;

    // Total income tax
    const totalIncomeTax = taxOnGain + cess;

    // 1% TDS on transactions above ₹10,000 (Section 194S)
    const tdsDeducted = totalTransactionValue * 0.01;

    // Net tax payable (after TDS credit)
    const netTaxPayable = Math.max(0, totalIncomeTax - tdsDeducted);

    // Net profit after tax
    const netProfit = capitalGain - totalIncomeTax;

    // Effective tax rate on gains
    const effectiveTaxRate =
      capitalGain > 0 ? (totalIncomeTax / capitalGain) * 100 : 0;

    // Effective tax rate on total sale
    const effectiveOnSale =
      salePrice > 0 ? (totalIncomeTax / salePrice) * 100 : 0;

    return {
      capitalGain,
      taxOnGain: Math.round(taxOnGain),
      cess: Math.round(cess),
      totalIncomeTax: Math.round(totalIncomeTax),
      tdsDeducted: Math.round(tdsDeducted),
      netTaxPayable: Math.round(netTaxPayable),
      netProfit: Math.round(netProfit),
      effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
      effectiveOnSale: Math.round(effectiveOnSale * 10) / 10,
      transactionFees,
    };
  }, [
    purchasePrice,
    salePrice,
    transactionFees,
    numTransactions,
    totalTransactionValue,
  ]);

  const scenarios = useMemo(() => {
    const calcTax = (gain: number) => {
      const tax = gain * 0.3;
      const cess = tax * 0.04;
      return Math.round(tax + cess);
    };
    return [
      {
        label: "₹50K Gain",
        description: "Small crypto profit",
        value: formatINR(calcTax(50000)),
        subtext: `Net profit: ${formatINR(50000 - calcTax(50000))}`,
        type: "conservative" as const,
      },
      {
        label: "₹2L Gain",
        description: "Medium crypto profit",
        value: formatINR(calcTax(200000)),
        subtext: `Net profit: ${formatINR(200000 - calcTax(200000))}`,
        type: "moderate" as const,
      },
      {
        label: "₹10L Gain",
        description: "Large crypto profit",
        value: formatINR(calcTax(1000000)),
        subtext: `Net profit: ${formatINR(1000000 - calcTax(1000000))}`,
        type: "aggressive" as const,
      },
    ];
  }, []);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `30% flat tax hai — chahe aapki income ₹5L ho ya ₹50L. Crypto gains pe koi slab benefit nahi milta. Aapka tax: ${formatINR(result.totalIncomeTax)}.`,
    );
    ins.push(
      `Losses carry forward nahi kar sakte — yeh stocks se bilkul alag hai. Agar Bitcoin mein loss hua, toh usse Ethereum ke profit se set off nahi kar sakte.`,
    );
    ins.push(
      `1% TDS har transaction pe katta hai (Section 194S). Aapka estimated TDS: ${formatINR(result.tdsDeducted)}. Yeh ITR file karte waqt adjust hoga.`,
    );
    if (result.capitalGain > 0) {
      ins.push(
        `Transaction fees (${formatINR(transactionFees)}) ka deduction NAHI milta. Sirf acquisition cost minus kar sakte hain. Effective tax rate: ${result.effectiveTaxRate}%.`,
      );
    }
    return ins;
  }, [result, transactionFees]);

  const pieData = [
    {
      name: "Net Profit",
      value: Math.max(0, result.netProfit),
      color: "#22c55e",
    },
    { name: "Tax (30%)", value: result.taxOnGain, color: "#dc2626" },
    { name: "Cess (4%)", value: result.cess, color: "#f59e0b" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Important warning banner */}
      <div className="bg-indian-gold/10 border border-indian-gold/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-indian-gold mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800">
          <p className="font-semibold mb-1">
            India Crypto Tax Rules (Section 115BBH)
          </p>
          <p>
            Flat 30% tax on ALL crypto gains. No loss set-off. No deductions
            except acquisition cost. 1% TDS on transfers. Applicable from April
            1, 2022.
          </p>
        </div>
      </div>

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Total Tax on Crypto"
          value={formatINR(result.totalIncomeTax)}
          ratingLabel={`Effective rate: ${result.effectiveTaxRate}%`}
          ratingType={result.effectiveTaxRate > 30 ? "negative" : "neutral"}
          metrics={[
            { label: "Capital Gain", value: formatINR(result.capitalGain) },
            { label: "Tax (30%)", value: formatINR(result.taxOnGain) },
            { label: "Cess (4%)", value: formatINR(result.cess) },
            { label: "TDS Already Paid", value: formatINR(result.tdsDeducted) },
            {
              label: "Net Tax Payable",
              value: formatINR(result.netTaxPayable),
            },
            { label: "Net Profit", value: formatINR(result.netProfit) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Crypto Transaction Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Purchase Price (Cost of Acquisition)"
              icon={IndianRupee}
              value={purchasePrice}
              onChange={setPurchasePrice}
              min={10000}
              max={5000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Sale Price"
              icon={IndianRupee}
              value={salePrice}
              onChange={setSalePrice}
              min={10000}
              max={10000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Transaction Fees (Exchange)"
              icon={Receipt}
              value={transactionFees}
              onChange={setTransactionFees}
              min={0}
              max={50000}
              step={500}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Number of Transactions (Year)"
              icon={ArrowUpDown}
              value={numTransactions}
              onChange={setNumTransactions}
              min={1}
              max={500}
              step={1}
              suffix=" txns"
            />
            <SliderInput
              label="Total Transaction Value (Year)"
              icon={IndianRupee}
              value={totalTransactionValue}
              onChange={setTotalTransactionValue}
              min={50000}
              max={50000000}
              step={50000}
              formatDisplay={formatINR}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Total Tax on Crypto"
              value={formatINR(result.totalIncomeTax)}
              ratingLabel={`Effective rate: ${result.effectiveTaxRate}%`}
              ratingType={result.effectiveTaxRate > 30 ? "negative" : "neutral"}
              metrics={[
                { label: "Capital Gain", value: formatINR(result.capitalGain) },
                { label: "Tax (30%)", value: formatINR(result.taxOnGain) },
                { label: "Cess (4%)", value: formatINR(result.cess) },
                {
                  label: "TDS Already Paid",
                  value: formatINR(result.tdsDeducted),
                },
                {
                  label: "Net Tax Payable",
                  value: formatINR(result.netTaxPayable),
                },
                { label: "Net Profit", value: formatINR(result.netProfit) },
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
            Gain Breakdown
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData
                    .filter((d) => d.value > 0)
                    .map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
              </PieChart>
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
            India Crypto Tax Rules
          </h3>
          <div className="space-y-3 text-xs text-ink-60">
            <div className="flex items-start gap-2">
              <Percent className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p>
                Flat 30% tax on ALL crypto gains — no slab benefit, no
                exemptions (Section 115BBH)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-indian-gold mt-0.5 shrink-0" />
              <p>
                NO loss set-off — crypto losses cannot offset crypto gains or
                any other income
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Receipt className="w-4 h-4 text-action-green mt-0.5 shrink-0" />
              <p>
                1% TDS on transfers above ₹10,000 (Section 194S). Deducted by
                exchange automatically.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <IndianRupee className="w-4 h-4 text-action-green mt-0.5 shrink-0" />
              <p>
                Only deduction allowed: cost of acquisition. No deduction for
                transaction fees, internet, or hardware.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="crypto-tax" variant="strip" />
      </div>
    </div>
  );
}
