"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, MapPin, Building2, Users } from "lucide-react";
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

type OwnerGender = "male" | "female" | "joint";

interface StateRate {
  name: string;
  male: number;
  female: number;
  joint: number;
  registration: number;
}

const STATE_RATES: Record<string, StateRate> = {
  maharashtra: {
    name: "Maharashtra",
    male: 6,
    female: 5,
    joint: 6,
    registration: 1,
  },
  karnataka: {
    name: "Karnataka",
    male: 5,
    female: 5,
    joint: 5,
    registration: 1,
  },
  delhi: { name: "Delhi", male: 6, female: 4, joint: 5, registration: 1 },
  tamilnadu: {
    name: "Tamil Nadu",
    male: 7,
    female: 7,
    joint: 7,
    registration: 1,
  },
  telangana: {
    name: "Telangana",
    male: 6,
    female: 6,
    joint: 6,
    registration: 0.5,
  },
  rajasthan: {
    name: "Rajasthan",
    male: 6,
    female: 5,
    joint: 6,
    registration: 1,
  },
  uttar_pradesh: {
    name: "Uttar Pradesh",
    male: 7,
    female: 6,
    joint: 7,
    registration: 1,
  },
  west_bengal: {
    name: "West Bengal",
    male: 7,
    female: 7,
    joint: 7,
    registration: 1,
  },
  gujarat: {
    name: "Gujarat",
    male: 4.9,
    female: 4.9,
    joint: 4.9,
    registration: 1,
  },
  madhya_pradesh: {
    name: "Madhya Pradesh",
    male: 7.5,
    female: 6.5,
    joint: 7,
    registration: 1,
  },
  kerala: { name: "Kerala", male: 8, female: 8, joint: 8, registration: 2 },
  haryana: { name: "Haryana", male: 7, female: 5, joint: 6, registration: 1 },
  punjab: { name: "Punjab", male: 7, female: 5, joint: 6, registration: 1 },
  andhra_pradesh: {
    name: "Andhra Pradesh",
    male: 5,
    female: 5,
    joint: 5,
    registration: 0.5,
  },
  bihar: { name: "Bihar", male: 6, female: 6, joint: 6, registration: 1 },
  goa: { name: "Goa", male: 3.5, female: 3.5, joint: 3.5, registration: 1 },
  jharkhand: {
    name: "Jharkhand",
    male: 4,
    female: 4,
    joint: 4,
    registration: 1,
  },
  uttarakhand: {
    name: "Uttarakhand",
    male: 5,
    female: 3.75,
    joint: 5,
    registration: 1,
  },
};

export function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [state, setState] = useState("maharashtra");
  const [gender, setGender] = useState<OwnerGender>("male");
  const [isFirstHome, setIsFirstHome] = useState(true);

  const stateRate = STATE_RATES[state];

  const result = useMemo(() => {
    const stampDutyPct = stateRate[gender];
    const registrationPct = stateRate.registration;

    // First-home discount (applicable in some states like Maharashtra for < ₹50L)
    let effectiveStampPct = stampDutyPct;
    if (
      isFirstHome &&
      state === "maharashtra" &&
      propertyValue <= 5000000 &&
      gender === "female"
    ) {
      effectiveStampPct = Math.max(stampDutyPct - 1, 0); // PMAY rebate
    }

    const stampDuty = Math.round((propertyValue * effectiveStampPct) / 100);
    const registration = Math.round((propertyValue * registrationPct) / 100);
    const gst =
      propertyValue <= 4500000
        ? Math.round(propertyValue * 0.01)
        : Math.round(propertyValue * 0.05); // Under construction only
    const legalFees = Math.round(Math.max(5000, propertyValue * 0.005)); // ~0.5% or min ₹5000
    const totalUpfront = stampDuty + registration;
    const totalWithExtras = totalUpfront + legalFees;

    // As percentage of property value
    const totalPct = Math.round((totalUpfront / propertyValue) * 10000) / 100;

    // Compare all states for this property value
    const stateComparison = Object.entries(STATE_RATES)
      .map(([key, sr]) => ({
        key,
        name: sr.name,
        stampDuty: Math.round((propertyValue * sr[gender]) / 100),
        registration: Math.round((propertyValue * sr.registration) / 100),
        total: Math.round(
          (propertyValue * (sr[gender] + sr.registration)) / 100,
        ),
        rate: sr[gender] + sr.registration,
      }))
      .sort((a, b) => a.total - b.total);

    const cheapestState = stateComparison[0];
    const costliestState = stateComparison[stateComparison.length - 1];

    return {
      stampDuty,
      stampDutyPct: effectiveStampPct,
      registration,
      registrationPct,
      legalFees,
      totalUpfront,
      totalWithExtras,
      totalPct,
      stateComparison,
      cheapestState,
      costliestState,
    };
  }, [propertyValue, state, gender, isFirstHome, stateRate]);

  const scenarios = useMemo(() => {
    const calc = (val: number) => {
      const sd = Math.round((val * stateRate[gender]) / 100);
      const reg = Math.round((val * stateRate.registration) / 100);
      return sd + reg;
    };
    return [
      {
        label: "₹30L Property",
        description: `Stamp Duty + Registration`,
        value: formatINR(calc(3000000)),
        subtext: `${stateRate[gender] + stateRate.registration}% of value`,
        type: "conservative" as const,
      },
      {
        label: "₹75L Property",
        description: `Stamp Duty + Registration`,
        value: formatINR(calc(7500000)),
        subtext: `${stateRate[gender] + stateRate.registration}% of value`,
        type: "moderate" as const,
      },
      {
        label: "₹1.5Cr Property",
        description: `Stamp Duty + Registration`,
        value: formatINR(calc(15000000)),
        subtext: `${stateRate[gender] + stateRate.registration}% of value`,
        type: "aggressive" as const,
      },
    ];
  }, [stateRate, gender]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${stateRate.name} mein ${formatINR(propertyValue)} property pe total stamp duty + registration: ${formatINR(result.totalUpfront)} (${result.totalPct}% of property value).`,
    );
    if (gender !== "female" && stateRate.female < stateRate.male) {
      const femaleSaving = Math.round(
        (propertyValue * (stateRate.male - stateRate.female)) / 100,
      );
      ins.push(
        `Tip: Wife ke naam se register karein — ${formatINR(femaleSaving)} bachega! ${stateRate.name} mein women ko ${stateRate.male - stateRate.female}% kam stamp duty lagti hai.`,
      );
    }
    if (result.cheapestState.key !== state) {
      ins.push(
        `Sabse sasta: ${result.cheapestState.name} (${formatINR(result.cheapestState.total)}). Sabse mehnga: ${result.costliestState.name} (${formatINR(result.costliestState.total)}). Difference: ${formatINR(result.costliestState.total - result.cheapestState.total)}.`,
      );
    }
    ins.push(
      `Stamp duty + registration home loan mein include nahi hota. Yeh upfront cash chahiye — plan accordingly.`,
    );
    return ins;
  }, [result, propertyValue, state, gender, stateRate]);

  const pieData = [
    { name: "Stamp Duty", value: result.stampDuty, color: "#166534" },
    { name: "Registration", value: result.registration, color: "#22c55e" },
    { name: "Legal Fees (est.)", value: result.legalFees, color: "#d97706" },
  ];

  const genderOptions: { value: OwnerGender; label: string }[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "joint", label: "Joint" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title="Total Registration Cost"
          value={formatINR(result.totalUpfront)}
          ratingLabel={`${result.totalPct}% of property value`}
          ratingType={result.totalPct < 7 ? "positive" : "neutral"}
          metrics={[
            {
              label: "Stamp Duty",
              value: `${formatINR(result.stampDuty)} (${result.stampDutyPct}%)`,
            },
            {
              label: "Registration",
              value: `${formatINR(result.registration)} (${result.registrationPct}%)`,
            },
            { label: "Legal Fees (est.)", value: formatINR(result.legalFees) },
            { label: "Grand Total", value: formatINR(result.totalWithExtras) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Property Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Property Value"
              icon={Building2}
              value={propertyValue}
              onChange={setPropertyValue}
              min={1000000}
              max={50000000}
              step={100000}
              formatDisplay={formatINR}
            />

            {/* State Selector */}
            <div>
              <label className="text-xs font-medium text-ink-60 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              >
                {Object.entries(STATE_RATES)
                  .sort((a, b) => a[1].name.localeCompare(b[1].name))
                  .map(([key, sr]) => (
                    <option key={key} value={key}>
                      {sr.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Gender Toggle */}
            <div>
              <label className="text-xs font-medium text-ink-60 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Owner Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {genderOptions.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGender(g.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      gender === g.value
                        ? "bg-action-green/10 border-green-600 text-authority-green"
                        : "bg-white border-ink/10 text-ink-60 hover:border-gray-300"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              {stateRate[gender] < stateRate.male && gender === "female" && (
                <p className="text-xs text-action-green mt-1.5">
                  Women get {stateRate.male - stateRate.female}% lower stamp
                  duty in {stateRate.name}
                </p>
              )}
            </div>

            {/* First Home Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFirstHome(!isFirstHome)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isFirstHome ? "bg-action-green" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isFirstHome ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm text-ink">First Home Purchase</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Total Registration Cost"
              value={formatINR(result.totalUpfront)}
              ratingLabel={`${result.totalPct}% of property value`}
              ratingType={result.totalPct < 7 ? "positive" : "neutral"}
              metrics={[
                {
                  label: "Stamp Duty",
                  value: `${formatINR(result.stampDuty)} (${result.stampDutyPct}%)`,
                },
                {
                  label: "Registration",
                  value: `${formatINR(result.registration)} (${result.registrationPct}%)`,
                },
                {
                  label: "Legal Fees (est.)",
                  value: formatINR(result.legalFees),
                },
                {
                  label: "Grand Total",
                  value: formatINR(result.totalWithExtras),
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      {/* Cost Breakdown + State Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-ink mb-3">
            Cost Breakdown
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatINR(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-ink-60">{d.name}</span>
                </div>
                <span className="font-medium text-ink">
                  {formatINR(d.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* State-wise comparison */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-display font-semibold text-ink mb-1">
            State-Wise Comparison for {formatINR(propertyValue)}
          </h3>
          <p className="text-xs text-ink-60 mb-3">
            {gender === "male"
              ? "Male"
              : gender === "female"
                ? "Female"
                : "Joint"}{" "}
            owner rates
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left py-2 text-ink-60 font-medium">
                  State
                </th>
                <th className="text-right py-2 text-ink-60 font-medium">
                  Rate
                </th>
                <th className="text-right py-2 text-ink-60 font-medium">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {result.stateComparison.slice(0, 10).map((s) => (
                <tr
                  key={s.key}
                  className={`border-b border-gray-50 ${s.key === state ? "bg-action-green/10" : ""}`}
                >
                  <td className="py-2 text-ink">
                    {s.name}
                    {s.key === state && (
                      <span className="text-xs text-action-green ml-1">
                        (selected)
                      </span>
                    )}
                  </td>
                  <td className="text-right py-2 text-ink-60">{s.rate}%</td>
                  <td className="text-right py-2 font-display font-semibold text-ink">
                    {formatINR(s.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="stamp-duty" variant="strip" />
      </div>
    </div>
  );
}
