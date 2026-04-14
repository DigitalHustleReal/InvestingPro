"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Percent,
  Calendar,
  Home,
  Building2,
  Wrench,
} from "lucide-react";
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

export function RealEstateROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState(7500000);
  const [stampDuty, setStampDuty] = useState(6);
  const [annualRent, setAnnualRent] = useState(240000);
  const [appreciationRate, setAppreciationRate] = useState(5);
  const [maintenanceMonthly, setMaintenanceMonthly] = useState(5000);
  const [holdingYears, setHoldingYears] = useState(10);
  const [loanRate, setLoanRate] = useState(8.5);

  const result = useMemo(() => {
    const stampDutyAmount = purchasePrice * (stampDuty / 100);
    const registrationCharges = purchasePrice * 0.01; // ~1% registration
    const totalAcquisitionCost =
      purchasePrice + stampDutyAmount + registrationCharges;
    const totalMaintenanceCost = maintenanceMonthly * 12 * holdingYears;

    // Equity SIP comparison: invest same amount monthly
    // Monthly SIP = EMI equivalent (purchase price / tenure months at loan rate)
    const monthlyLoanRate = loanRate / 100 / 12;
    const loanMonths = holdingYears * 12;
    const emi =
      monthlyLoanRate === 0
        ? totalAcquisitionCost / loanMonths
        : (totalAcquisitionCost *
            monthlyLoanRate *
            Math.pow(1 + monthlyLoanRate, loanMonths)) /
          (Math.pow(1 + monthlyLoanRate, loanMonths) - 1);
    const totalEMIPaid = emi * loanMonths;
    const totalLoanInterest = totalEMIPaid - totalAcquisitionCost;

    const yearlyData = [];
    let cumulativeRent = 0;
    let cumulativeMaintenance = 0;

    // Equity SIP: same monthly outflow (EMI + maintenance) invested at 12% CAGR
    const monthlyEquityInvestment = emi + maintenanceMonthly;
    const equityMonthlyRate = 0.12 / 12;

    for (let year = 1; year <= holdingYears; year++) {
      // Property value with appreciation
      const propertyValue =
        purchasePrice * Math.pow(1 + appreciationRate / 100, year);

      // Rental income (assume 5% annual rent increase)
      const yearRent = annualRent * Math.pow(1.05, year - 1);
      cumulativeRent += yearRent;
      cumulativeMaintenance += maintenanceMonthly * 12;

      // Net rental income after 30% tax (Indian rental income tax for >30% bracket)
      const netRentalCumulative = cumulativeRent * 0.7;

      // Equity SIP value at this point
      const equityMonths = year * 12;
      const equitySIPValue =
        equityMonthlyRate === 0
          ? monthlyEquityInvestment * equityMonths
          : monthlyEquityInvestment *
            ((Math.pow(1 + equityMonthlyRate, equityMonths) - 1) /
              equityMonthlyRate) *
            (1 + equityMonthlyRate);

      // Property total return = appreciation + net rent - maintenance - loan interest (proportional)
      const proportionalInterest = totalLoanInterest * (year / holdingYears);
      const propertyNetReturn =
        propertyValue -
        totalAcquisitionCost +
        netRentalCumulative -
        cumulativeMaintenance -
        proportionalInterest;

      yearlyData.push({
        year: `Y${year}`,
        propertyValue: Math.round(propertyValue),
        equitySIPValue: Math.round(equitySIPValue),
        netRentalIncome: Math.round(netRentalCumulative),
      });
    }

    const finalPropertyValue =
      purchasePrice * Math.pow(1 + appreciationRate / 100, holdingYears);
    const capitalGains = finalPropertyValue - purchasePrice;
    const totalRentalIncome = cumulativeRent;
    const netRentalIncome = totalRentalIncome * 0.7; // After tax
    const netRentalYield =
      ((annualRent - maintenanceMonthly * 12) / totalAcquisitionCost) * 100;

    // Total cost of ownership
    const totalOwnershipCost =
      stampDutyAmount +
      registrationCharges +
      totalMaintenanceCost +
      totalLoanInterest;
    const totalROI = capitalGains + netRentalIncome - totalOwnershipCost;
    const annualizedROI =
      (Math.pow(
        (finalPropertyValue + netRentalIncome) / totalAcquisitionCost,
        1 / holdingYears,
      ) -
        1) *
      100;

    // Equity SIP final value
    const equityMonths = holdingYears * 12;
    const equitySIPFinal =
      monthlyEquityInvestment *
      ((Math.pow(1 + equityMonthlyRate, equityMonths) - 1) /
        equityMonthlyRate) *
      (1 + equityMonthlyRate);
    const equityTotalInvested = monthlyEquityInvestment * equityMonths;

    return {
      totalAcquisitionCost: Math.round(totalAcquisitionCost),
      stampDutyAmount: Math.round(stampDutyAmount),
      emi: Math.round(emi),
      totalEMIPaid: Math.round(totalEMIPaid),
      totalLoanInterest: Math.round(totalLoanInterest),
      capitalGains: Math.round(capitalGains),
      totalRentalIncome: Math.round(totalRentalIncome),
      netRentalIncome: Math.round(netRentalIncome),
      netRentalYield: Math.round(netRentalYield * 100) / 100,
      totalOwnershipCost: Math.round(totalOwnershipCost),
      totalROI: Math.round(totalROI),
      annualizedROI: Math.round(annualizedROI * 100) / 100,
      finalPropertyValue: Math.round(finalPropertyValue),
      equitySIPFinal: Math.round(equitySIPFinal),
      equityTotalInvested: Math.round(equityTotalInvested),
      yearlyData,
    };
  }, [
    purchasePrice,
    stampDuty,
    annualRent,
    appreciationRate,
    maintenanceMonthly,
    holdingYears,
    loanRate,
  ]);

  const scenarios = useMemo(() => {
    const calc = (
      city: string,
      yieldPct: number,
      appRate: number,
      type: "conservative" | "moderate" | "aggressive",
    ) => {
      const rent = purchasePrice * (yieldPct / 100);
      const finalVal =
        purchasePrice * Math.pow(1 + appRate / 100, holdingYears);
      const totalReturn = finalVal - purchasePrice + rent * holdingYears * 0.7;
      const roi =
        (Math.pow(
          (finalVal + rent * holdingYears * 0.7) / (purchasePrice * 1.07),
          1 / holdingYears,
        ) -
          1) *
        100;
      return {
        label: city,
        description: `${yieldPct}% rental yield, ${appRate}% appreciation`,
        value: `${roi.toFixed(1)}% ROI`,
        subtext: `Total gain: ${formatINR(totalReturn)}`,
        type,
      };
    };
    return [
      calc("Mumbai (2-3% yield)", 2.5, 4, "conservative"),
      calc("Bangalore (3-4% yield)", 3.5, 6, "moderate"),
      calc("Tier-2 City (5-7% yield)", 6, 8, "aggressive"),
    ];
  }, [purchasePrice, holdingYears]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    if (result.netRentalYield < 3) {
      ins.push(
        `Net rental yield sirf ${result.netRentalYield}% hai — FD se bhi kam! Mumbai/Delhi mein yeh common hai. Property sirf appreciation ke liye kharidna padta hai.`,
      );
    } else {
      ins.push(
        `Net rental yield ${result.netRentalYield}% hai — decent for Indian real estate. Tier-2 cities mein 5-7% bhi possible hai.`,
      );
    }
    ins.push(
      `Property appreciation + rental = total ROI. Aapki property ${holdingYears}Y mein ${formatINR(result.finalPropertyValue)} hogi, lekin equity SIP mein same monthly investment se ${formatINR(result.equitySIPFinal)} milta. ${result.equitySIPFinal > result.finalPropertyValue + result.netRentalIncome ? "Equity wins!" : "Real estate wins with leverage!"}`,
    );
    ins.push(
      `Hidden costs: stamp duty ${formatINR(result.stampDutyAmount)} + loan interest ${formatINR(result.totalLoanInterest)} + maintenance ${formatINR(maintenanceMonthly * 12 * holdingYears)} = ${formatINR(result.totalOwnershipCost)} total. Yeh log ignore karte hain.`,
    );
    return ins;
  }, [result, holdingYears, maintenanceMonthly]);

  const pieData = [
    {
      name: "Capital Gains",
      value: Math.max(0, result.capitalGains),
      color: "#166534",
    },
    { name: "Net Rental", value: result.netRentalIncome, color: "#22c55e" },
    {
      name: "Ownership Cost",
      value: result.totalOwnershipCost,
      color: "#dc2626",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Net Rental Yield"
          value={`${result.netRentalYield}%`}
          ratingLabel={`Total ROI: ${formatINR(result.totalROI)} (${result.annualizedROI}% CAGR)`}
          ratingType={result.netRentalYield >= 3 ? "positive" : "neutral"}
          metrics={[
            {
              label: "Property Value (Final)",
              value: formatINR(result.finalPropertyValue),
            },
            { label: "Capital Gains", value: formatINR(result.capitalGains) },
            {
              label: "Net Rental Income",
              value: formatINR(result.netRentalIncome),
            },
            {
              label: "Equity SIP (Same EMI)",
              value: formatINR(result.equitySIPFinal),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Property Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Purchase Price"
              icon={Home}
              value={purchasePrice}
              onChange={setPurchasePrice}
              min={1000000}
              max={100000000}
              step={500000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Stamp Duty"
              icon={Building2}
              value={stampDuty}
              onChange={setStampDuty}
              min={3}
              max={10}
              step={0.5}
              suffix="%"
            />
            <SliderInput
              label="Annual Rental Income"
              icon={IndianRupee}
              value={annualRent}
              onChange={setAnnualRent}
              min={0}
              max={2400000}
              step={12000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Property Appreciation"
              icon={Percent}
              value={appreciationRate}
              onChange={setAppreciationRate}
              min={3}
              max={10}
              step={0.5}
              suffix="% p.a."
            />
            <SliderInput
              label="Monthly Maintenance"
              icon={Wrench}
              value={maintenanceMonthly}
              onChange={setMaintenanceMonthly}
              min={0}
              max={25000}
              step={500}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Holding Period"
              icon={Calendar}
              value={holdingYears}
              onChange={setHoldingYears}
              min={1}
              max={30}
              step={1}
              suffix=" Yrs"
            />
            <SliderInput
              label="Home Loan Rate"
              icon={Percent}
              value={loanRate}
              onChange={setLoanRate}
              min={7}
              max={12}
              step={0.25}
              suffix="% p.a."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Net Rental Yield"
              value={`${result.netRentalYield}%`}
              ratingLabel={`Total ROI: ${formatINR(result.totalROI)} (${result.annualizedROI}% CAGR)`}
              ratingType={result.netRentalYield >= 3 ? "positive" : "neutral"}
              metrics={[
                {
                  label: "Property Value (Final)",
                  value: formatINR(result.finalPropertyValue),
                },
                {
                  label: "Capital Gains",
                  value: formatINR(result.capitalGains),
                },
                {
                  label: "Net Rental Income",
                  value: formatINR(result.netRentalIncome),
                },
                {
                  label: "Equity SIP (Same EMI)",
                  value: formatINR(result.equitySIPFinal),
                },
              ]}
            />
          </div>

          {/* Ownership cost breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Total Cost of Ownership
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Stamp Duty + Registration",
                  value: result.stampDutyAmount + purchasePrice * 0.01,
                },
                { label: "Loan Interest", value: result.totalLoanInterest },
                {
                  label: "Maintenance",
                  value: maintenanceMonthly * 12 * holdingYears,
                },
                { label: "Monthly EMI", value: result.emi },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-900">
                    {formatINR(item.value)}
                    {item.label === "Monthly EMI" ? "/mo" : ""}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-red-600 font-semibold">
                  Total Hidden Cost
                </span>
                <span className="font-bold text-red-600">
                  {formatINR(result.totalOwnershipCost)}
                </span>
              </div>
            </div>
          </div>

          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Property Value vs Equity SIP Growth
          </h3>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearlyData}>
                <defs>
                  <linearGradient id="reProp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="reEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="reRent" x1="0" y1="0" x2="0" y2="1">
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
                  width={55}
                />
                <Tooltip
                  formatter={(value: any) => [formatINR(Number(value)), ""]}
                  contentStyle={{ borderRadius: "10px", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="propertyValue"
                  stroke="#166534"
                  strokeWidth={2}
                  fill="url(#reProp)"
                  name="Property Value"
                />
                <Area
                  type="monotone"
                  dataKey="equitySIPValue"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="url(#reEquity)"
                  name="Equity SIP Value"
                />
                <Area
                  type="monotone"
                  dataKey="netRentalIncome"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#reRent)"
                  name="Cumulative Rental Income"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-gray-100">
            {pieData.map((d) => (
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

        <ProductRecs
          category="loans"
          title="Best Home Loan Rates"
          matchCriteria={`< ${loanRate}%`}
        />
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="real-estate-roi" variant="strip" />
      </div>
    </div>
  );
}
