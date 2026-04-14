"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Percent,
  Plane,
  Building2,
  Calendar,
  Globe,
  Landmark,
  Briefcase,
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

// Countries with DTAA with India
const dtaaCountries: Record<
  string,
  { name: string; fdRate: number; capitalGainsRate: number }
> = {
  us: { name: "USA", fdRate: 15, capitalGainsRate: 15 },
  uk: { name: "UK", fdRate: 15, capitalGainsRate: 15 },
  uae: { name: "UAE", fdRate: 12.5, capitalGainsRate: 0 },
  singapore: { name: "Singapore", fdRate: 15, capitalGainsRate: 0 },
  canada: { name: "Canada", fdRate: 15, capitalGainsRate: 15 },
  australia: { name: "Australia", fdRate: 15, capitalGainsRate: 15 },
  germany: { name: "Germany", fdRate: 10, capitalGainsRate: 10 },
  other: { name: "Other (No DTAA)", fdRate: 30, capitalGainsRate: 20 },
};

// New Tax Regime slabs (NRIs can use new regime too)
const newRegimeSlabs = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.1 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.2 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.3 },
];

function calcSlabTax(income: number, slabs: typeof newRegimeSlabs): number {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.min) break;
    const taxableInSlab = Math.min(income, slab.max) - slab.min;
    tax += taxableInSlab * slab.rate;
  }
  return tax;
}

export function NRITaxCalculator() {
  const [rentalIncome, setRentalIncome] = useState(300000);
  const [fdInterest, setFdInterest] = useState(200000);
  const [capitalGains, setCapitalGains] = useState(500000);
  const [salaryIndia, setSalaryIndia] = useState(0);
  const [nreInterest, setNreInterest] = useState(100000);
  const [nroInterest, setNroInterest] = useState(50000);
  const [daysInIndia, setDaysInIndia] = useState(60);
  const [country, setCountry] = useState<string>("us");

  const result = useMemo(() => {
    // Residential status
    const isNRI = daysInIndia < 182;
    const status = isNRI ? "Non-Resident (NRI)" : "Resident";

    // NRE interest is tax-free for NRIs
    const taxableNREInterest = isNRI ? 0 : nreInterest;

    // NRO interest is always taxable in India
    const taxableNROInterest = nroInterest;

    // Total India income (taxable)
    const totalTaxableIncome =
      rentalIncome +
      fdInterest +
      capitalGains +
      salaryIndia +
      taxableNREInterest +
      taxableNROInterest;

    // Standard deduction on rental (30%)
    const netRentalIncome = rentalIncome * 0.7;
    const adjustedTaxable =
      netRentalIncome +
      fdInterest +
      capitalGains +
      salaryIndia +
      taxableNREInterest +
      taxableNROInterest;

    // Tax calculation (New Regime for NRIs)
    // Separate LTCG on property at 20% with indexation
    const ltcgTax = capitalGains > 0 ? capitalGains * 0.2 : 0;
    const nonCGIncome = adjustedTaxable - capitalGains;
    const incomeTax = calcSlabTax(nonCGIncome, newRegimeSlabs);

    // Rebate: if non-CG income <= ₹12L
    const taxAfterRebate = nonCGIncome <= 1200000 ? 0 : incomeTax;

    const totalTax = taxAfterRebate + ltcgTax;
    const cess = totalTax * 0.04;
    const grossTax = Math.round(totalTax + cess);

    // TDS already deducted (NRI TDS rates are higher)
    const tdsOnRental = rentalIncome * 0.312; // 30% + cess for NRI
    const tdsOnFD = fdInterest * 0.312; // 30% + surcharge for NRI FD
    const tdsOnNRO = nroInterest * 0.312;
    const tdsCG = capitalGains * 0.208; // 20% + cess for LTCG
    const totalTDS = Math.round(tdsOnRental + tdsOnFD + tdsOnNRO + tdsCG);

    // DTAA benefit
    const dtaaInfo = dtaaCountries[country];
    const dtaaFDRate = dtaaInfo.fdRate / 100;
    const dtaaFDTax = fdInterest * dtaaFDRate;
    const normalFDTax = fdInterest * 0.3;
    const dtaaBenefit = Math.max(0, Math.round(normalFDTax - dtaaFDTax));

    // Tax after DTAA
    const taxAfterDTAA = Math.max(0, grossTax - dtaaBenefit);

    // Net tax payable (after TDS)
    const netPayable = Math.max(0, taxAfterDTAA - totalTDS);

    // Refund if TDS > tax
    const refund = totalTDS > taxAfterDTAA ? totalTDS - taxAfterDTAA : 0;

    const effectiveRate =
      totalTaxableIncome > 0 ? (taxAfterDTAA / totalTaxableIncome) * 100 : 0;

    return {
      isNRI,
      status,
      totalTaxableIncome,
      adjustedTaxable: Math.round(adjustedTaxable),
      incomeTax: Math.round(taxAfterRebate),
      ltcgTax: Math.round(ltcgTax),
      grossTax,
      cess: Math.round(cess),
      totalTDS,
      dtaaBenefit,
      dtaaCountry: dtaaInfo.name,
      taxAfterDTAA,
      netPayable: Math.round(netPayable),
      refund: Math.round(refund),
      effectiveRate: Math.round(effectiveRate * 10) / 10,
      taxableNREInterest,
      nreInterest,
    };
  }, [
    rentalIncome,
    fdInterest,
    capitalGains,
    salaryIndia,
    nreInterest,
    nroInterest,
    daysInIndia,
    country,
  ]);

  const scenarios = useMemo(() => {
    const calcScenario = (rental: number, fd: number, cg: number) => {
      const net = rental * 0.7 + fd;
      const tax = calcSlabTax(net, newRegimeSlabs);
      const afterRebate = net <= 1200000 ? 0 : tax;
      const cgTax = cg * 0.2;
      const total = afterRebate + cgTax;
      return Math.round(total + total * 0.04);
    };
    return [
      {
        label: "Rental Only",
        description: "₹5L rental income",
        value: formatINR(calcScenario(500000, 0, 0)),
        subtext: "30% standard deduction applies",
        type: "conservative" as const,
      },
      {
        label: "FD Interest Only",
        description: "₹3L FD interest",
        value: formatINR(calcScenario(0, 300000, 0)),
        subtext: "TDS at 30% for NRIs",
        type: "moderate" as const,
      },
      {
        label: "Mixed Income",
        description: "₹5L rent + ₹3L FD + ₹10L CG",
        value: formatINR(calcScenario(500000, 300000, 1000000)),
        subtext: "Property sale + rental + FD",
        type: "aggressive" as const,
      },
    ];
  }, []);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.isNRI) {
      ins.push(
        `NRE FD interest completely tax-free hai! Aapka ₹${(nreInterest / 1000).toFixed(0)}K NRE interest pe zero tax. NRO interest (₹${(nroInterest / 1000).toFixed(0)}K) pe 30% TDS lagega.`,
      );
    } else {
      ins.push(
        `Warning: ${daysInIndia} days India mein — aap Resident ho gaye! NRE interest bhi ab taxable hai. 182 days se kam rakhein NRI status ke liye.`,
      );
    }
    ins.push(
      `DTAA benefit (${result.dtaaCountry}): ${formatINR(result.dtaaBenefit)} bachega double taxation se. Tax residency certificate (TRC) zaroori hai claim karne ke liye.`,
    );
    if (result.refund > 0) {
      ins.push(
        `TDS zyada kata hai (${formatINR(result.totalTDS)}) actual tax (${formatINR(result.taxAfterDTAA)}) se. ITR file karein — ${formatINR(result.refund)} refund milega!`,
      );
    }
    ins.push(
      `182 days se zyada India mein toh Resident ho jaoge — NRE interest bhi taxable, DTAA benefit limited. Trip planning carefully karein.`,
    );
    return ins;
  }, [result, daysInIndia, nreInterest, nroInterest]);

  const pieData = [
    { name: "Rental Income", value: rentalIncome, color: "#166534" },
    { name: "FD Interest", value: fdInterest, color: "#22c55e" },
    { name: "Capital Gains", value: capitalGains, color: "#d97706" },
    { name: "NRO Interest", value: nroInterest, color: "#059669" },
    ...(salaryIndia > 0
      ? [{ name: "Salary", value: salaryIndia, color: "#15803d" }]
      : []),
  ];

  const taxPieData = [
    {
      name: "Take-Home",
      value: Math.max(0, result.totalTaxableIncome - result.taxAfterDTAA),
      color: "#22c55e",
    },
    { name: "Tax Payable", value: result.taxAfterDTAA, color: "#dc2626" },
    ...(result.dtaaBenefit > 0
      ? [{ name: "DTAA Saving", value: result.dtaaBenefit, color: "#d97706" }]
      : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Residential Status Banner */}
      <div
        className={`border rounded-2xl p-4 flex items-start gap-3 ${
          result.isNRI
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <Plane
          className={`w-5 h-5 mt-0.5 shrink-0 ${result.isNRI ? "text-green-600" : "text-amber-600"}`}
        />
        <div className="text-xs">
          <p
            className={`font-semibold mb-1 ${result.isNRI ? "text-green-800" : "text-amber-800"}`}
          >
            Residential Status: {result.status}
          </p>
          <p className={result.isNRI ? "text-green-700" : "text-amber-700"}>
            {result.isNRI
              ? `${daysInIndia} days in India (< 182 days). NRE interest is tax-free. Higher TDS rates apply on NRO/FD.`
              : `${daysInIndia} days in India (>= 182 days). You are treated as Resident. All global income may be taxable.`}
          </p>
        </div>
      </div>

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Tax After DTAA"
          value={formatINR(result.taxAfterDTAA)}
          ratingLabel={`Effective rate: ${result.effectiveRate}%`}
          ratingType={result.refund > 0 ? "positive" : "neutral"}
          metrics={[
            {
              label: "Total India Income",
              value: formatINR(result.totalTaxableIncome),
            },
            { label: "Income Tax", value: formatINR(result.incomeTax) },
            { label: "LTCG Tax", value: formatINR(result.ltcgTax) },
            { label: "DTAA Benefit", value: formatINR(result.dtaaBenefit) },
            { label: "TDS Deducted", value: formatINR(result.totalTDS) },
            {
              label: result.refund > 0 ? "Refund Due" : "Net Payable",
              value: formatINR(
                result.refund > 0 ? result.refund : result.netPayable,
              ),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            NRI Income Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Rental Income (India)"
              icon={Building2}
              value={rentalIncome}
              onChange={setRentalIncome}
              min={0}
              max={3000000}
              step={25000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="FD Interest (NRO/Regular)"
              icon={Landmark}
              value={fdInterest}
              onChange={setFdInterest}
              min={0}
              max={2000000}
              step={10000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Capital Gains (Property/Shares)"
              icon={IndianRupee}
              value={capitalGains}
              onChange={setCapitalGains}
              min={0}
              max={10000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Salary from India"
              icon={Briefcase}
              value={salaryIndia}
              onChange={setSalaryIndia}
              min={0}
              max={5000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="NRE Account Interest"
              icon={IndianRupee}
              value={nreInterest}
              onChange={setNreInterest}
              min={0}
              max={1000000}
              step={10000}
              formatDisplay={(v) =>
                `${formatINR(v)} ${result.isNRI ? "(Tax-Free)" : "(Taxable)"}`
              }
            />
            <SliderInput
              label="NRO Account Interest"
              icon={IndianRupee}
              value={nroInterest}
              onChange={setNroInterest}
              min={0}
              max={500000}
              step={5000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Days Spent in India"
              icon={Plane}
              value={daysInIndia}
              onChange={setDaysInIndia}
              min={0}
              max={365}
              step={1}
              suffix=" days"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Residence (DTAA)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(dtaaCountries).map(([key, { name }]) => (
                  <button
                    key={key}
                    onClick={() => setCountry(key)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                      country === key
                        ? "bg-green-50 border-green-600 text-green-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Tax After DTAA"
              value={formatINR(result.taxAfterDTAA)}
              ratingLabel={`Effective rate: ${result.effectiveRate}%`}
              ratingType={result.refund > 0 ? "positive" : "neutral"}
              metrics={[
                {
                  label: "Total India Income",
                  value: formatINR(result.totalTaxableIncome),
                },
                { label: "Income Tax", value: formatINR(result.incomeTax) },
                { label: "LTCG Tax", value: formatINR(result.ltcgTax) },
                { label: "DTAA Benefit", value: formatINR(result.dtaaBenefit) },
                { label: "TDS Deducted", value: formatINR(result.totalTDS) },
                {
                  label: result.refund > 0 ? "Refund Due" : "Net Payable",
                  value: formatINR(
                    result.refund > 0 ? result.refund : result.netPayable,
                  ),
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Tax Breakdown
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxPieData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {taxPieData
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
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-gray-100">
            {taxPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <div>
                  <p className="text-[11px] text-gray-400">{d.name}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatINR(d.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Key NRI Tax Rules
          </h3>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p>
                NRI if stay in India &lt; 182 days. Only India-sourced income is
                taxable.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Landmark className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p>
                NRE FD interest: completely tax-free for NRIs. NRO interest:
                taxable at 30%.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Percent className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p>
                TDS rates higher for NRIs: 30% on FD/rental, 20% on LTCG. File
                ITR for refund.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Plane className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p>
                DTAA with 90+ countries prevents double taxation. Get Tax
                Residency Certificate (TRC).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="nri-tax" variant="strip" />
      </div>
    </div>
  );
}
