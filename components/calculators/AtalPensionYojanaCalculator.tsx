"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, Calendar, Shield, Users } from "lucide-react";
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

// Official APY contribution chart (monthly contribution in INR)
// Rows: age (18-40), Columns: pension ₹1K/₹2K/₹3K/₹4K/₹5K
const APY_CHART: Record<number, number[]> = {
  18: [42, 84, 126, 168, 210],
  19: [46, 92, 138, 183, 228],
  20: [50, 100, 150, 198, 248],
  21: [54, 108, 162, 215, 269],
  22: [59, 117, 177, 234, 292],
  23: [64, 127, 192, 254, 318],
  24: [70, 139, 208, 277, 346],
  25: [76, 151, 226, 301, 376],
  26: [82, 164, 246, 327, 409],
  27: [90, 178, 268, 356, 446],
  28: [97, 194, 292, 388, 485],
  29: [106, 212, 318, 423, 529],
  30: [116, 231, 347, 462, 577],
  31: [126, 252, 379, 504, 630],
  32: [138, 276, 414, 551, 689],
  33: [151, 302, 453, 602, 752],
  34: [165, 330, 495, 659, 824],
  35: [181, 362, 543, 722, 902],
  36: [198, 396, 594, 792, 990],
  37: [218, 436, 654, 870, 1087],
  38: [240, 480, 720, 957, 1196],
  39: [264, 528, 792, 1054, 1318],
  40: [291, 582, 873, 1164, 1454],
};

const PENSION_OPTIONS = [1000, 2000, 3000, 4000, 5000];
const CORPUS_AT_60: Record<number, number> = {
  1000: 170000,
  2000: 340000,
  3000: 510000,
  4000: 680000,
  5000: 850000,
};

function getContribution(age: number, pensionIndex: number): number {
  const chart = APY_CHART[age];
  if (chart) return chart[pensionIndex];
  // Interpolate for any missing age (shouldn't happen with full chart)
  const ages = Object.keys(APY_CHART)
    .map(Number)
    .sort((a, b) => a - b);
  let lower = ages[0];
  let upper = ages[ages.length - 1];
  for (let i = 0; i < ages.length - 1; i++) {
    if (age >= ages[i] && age <= ages[i + 1]) {
      lower = ages[i];
      upper = ages[i + 1];
      break;
    }
  }
  const lv = APY_CHART[lower][pensionIndex];
  const uv = APY_CHART[upper][pensionIndex];
  const ratio = (age - lower) / (upper - lower || 1);
  return Math.round(lv + ratio * (uv - lv));
}

export function AtalPensionYojanaCalculator() {
  const [currentAge, setCurrentAge] = useState(25);
  const [pensionIndex, setPensionIndex] = useState(4); // default ₹5000
  const [gender, setGender] = useState<"male" | "female">("male");

  const desiredPension = PENSION_OPTIONS[pensionIndex];

  const result = useMemo(() => {
    const monthlyContribution = getContribution(currentAge, pensionIndex);
    const yearsToContribute = 60 - currentAge;
    const totalMonths = yearsToContribute * 12;
    const totalAmountPaid = monthlyContribution * totalMonths;
    const corpus = CORPUS_AT_60[desiredPension];
    const pensionPerMonth = desiredPension;

    // Tax benefit: contribution qualifies under 80CCD(1B) — extra ₹50,000 deduction
    const annualContribution = monthlyContribution * 12;
    const taxBenefit80CCD = Math.min(annualContribution, 50000);
    // Assuming 30% tax bracket for illustration
    const taxSaved = Math.round(taxBenefit80CCD * 0.3);

    // Growth chart: cumulative contributions vs estimated corpus growth
    const chartData = [];
    for (let year = 1; year <= yearsToContribute; year++) {
      const cumulativeContrib = monthlyContribution * 12 * year;
      // Approximate corpus growth (assuming ~8% annual return which APY roughly targets)
      const rate = 0.08 / 12;
      const months = year * 12;
      const estimatedCorpus =
        monthlyContribution *
        ((Math.pow(1 + rate, months) - 1) / rate) *
        (1 + rate);
      chartData.push({
        year: `Y${year}`,
        contributed: Math.round(cumulativeContrib),
        corpus: Math.round(estimatedCorpus),
      });
    }

    return {
      monthlyContribution,
      totalAmountPaid,
      corpus,
      pensionPerMonth,
      yearsToContribute,
      annualContribution,
      taxBenefit80CCD,
      taxSaved,
      chartData,
    };
  }, [currentAge, pensionIndex, desiredPension]);

  // Comparison table: all 5 pension options for current age
  const comparisonTable = useMemo(() => {
    return PENSION_OPTIONS.map((pension, idx) => {
      const contrib = getContribution(currentAge, idx);
      const years = 60 - currentAge;
      const total = contrib * years * 12;
      return {
        pension,
        monthlyContribution: contrib,
        totalPaid: total,
        corpus: CORPUS_AT_60[pension],
      };
    });
  }, [currentAge]);

  // What-if scenarios: joining at different ages
  const scenarios = useMemo(() => {
    const ages = [18, 25, 35];
    return ages.map((age) => {
      const contrib = getContribution(age, pensionIndex);
      const years = 60 - age;
      const total = contrib * years * 12;
      const isCurrentAge = age === currentAge;
      return {
        label: `Join at ${age}`,
        description: `${formatINR(contrib)}/mo for ${years} years`,
        value: formatINR(total),
        subtext: isCurrentAge
          ? "Your current age"
          : age < currentAge
            ? "Less monthly, more years"
            : "Higher monthly, fewer years",
        type:
          age <= 20
            ? ("conservative" as const)
            : age <= 30
              ? ("moderate" as const)
              : ("aggressive" as const),
      };
    });
  }, [pensionIndex, currentAge]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `${formatINR(result.monthlyContribution)}/month se ${formatINR(desiredPension)} lifetime pension milegi — 60 ke baad har mahine guaranteed income.`,
    );
    ins.push(
      `80CCD(1B) se ${formatINR(result.taxBenefit80CCD)} extra tax deduction — yeh Section 80C ke upar hai. 30% bracket mein ${formatINR(result.taxSaved)}/year bachega.`,
    );
    ins.push(
      `Spouse ko bhi pension milegi after death — same amount. Nominee ko corpus (${formatINR(result.corpus)}) milega. Family fully covered hai.`,
    );
    if (currentAge <= 25) {
      ins.push(
        `Aap sahi time pe join kar rahe ho! ${currentAge} pe start karna matlab lowest contribution aur maximum benefit. Jitna late, utna zyada pay karna padega.`,
      );
    }
    if (currentAge >= 35) {
      ins.push(
        `Late start matlab zyada contribution — ${formatINR(result.monthlyContribution)}/mo. Agar 18 pe start kiya hota toh sirf ${formatINR(getContribution(18, pensionIndex))}/mo lagta. Phir bhi, abhi join karna best decision hai.`,
      );
    }
    return ins;
  }, [result, desiredPension, currentAge, pensionIndex]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      {/* Mobile-first: Result on top */}
      <div className="lg:hidden">
        <ResultCard
          title="Monthly Contribution"
          value={formatINR(result.monthlyContribution)}
          ratingLabel={`Pension: ${formatINR(desiredPension)}/mo from age 60`}
          ratingType="positive"
          metrics={[
            {
              label: "Years to Pay",
              value: `${result.yearsToContribute} years`,
            },
            { label: "Total Paid", value: formatINR(result.totalAmountPaid) },
            { label: "Corpus at 60", value: formatINR(result.corpus) },
            {
              label: "Tax Saved/Year",
              value: formatINR(result.taxSaved),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            APY Details
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Your Current Age"
              icon={Calendar}
              value={currentAge}
              onChange={setCurrentAge}
              min={18}
              max={40}
              step={1}
              suffix=" years"
            />
            <SliderInput
              label="Desired Monthly Pension"
              icon={IndianRupee}
              value={pensionIndex}
              onChange={setPensionIndex}
              min={0}
              max={4}
              step={1}
              formatDisplay={(v) => `${formatINR(PENSION_OPTIONS[v])}/month`}
            />
            {/* Gender toggle */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink mb-2">
                <Users className="w-4 h-4 text-authority-green" />
                Gender
              </label>
              <div className="flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      gender === g
                        ? "bg-authority-green text-white"
                        : "bg-gray-100 text-ink-60 hover:bg-gray-200"
                    }`}
                  >
                    {g === "male" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-60 mt-1">
                Same contribution for both — spouse gets pension after death
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Monthly Contribution"
              value={formatINR(result.monthlyContribution)}
              ratingLabel={`Pension: ${formatINR(desiredPension)}/mo from age 60`}
              ratingType="positive"
              metrics={[
                {
                  label: "Years to Pay",
                  value: `${result.yearsToContribute} years`,
                },
                {
                  label: "Total Paid",
                  value: formatINR(result.totalAmountPaid),
                },
                { label: "Corpus at 60", value: formatINR(result.corpus) },
                {
                  label: "Tax Saved/Year",
                  value: formatINR(result.taxSaved),
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      {/* Comparison table: all pension options for current age */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-display font-semibold text-ink mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-authority-green" />
          All Pension Options at Age {currentAge}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left py-2 px-3 text-ink-60 font-medium">
                  Pension/Month
                </th>
                <th className="text-right py-2 px-3 text-ink-60 font-medium">
                  Contribution/Month
                </th>
                <th className="text-right py-2 px-3 text-ink-60 font-medium">
                  Total Paid
                </th>
                <th className="text-right py-2 px-3 text-ink-60 font-medium">
                  Corpus at 60
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row) => (
                <tr
                  key={row.pension}
                  className={`border-b border-gray-50 ${
                    row.pension === desiredPension
                      ? "bg-action-green/10"
                      : "hover:bg-canvas"
                  }`}
                >
                  <td className="py-2.5 px-3 font-display font-semibold text-ink">
                    {formatINR(row.pension)}
                    {row.pension === desiredPension && (
                      <span className="ml-2 text-[10px] bg-authority-green text-white px-1.5 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink">
                    {formatINR(row.monthlyContribution)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-ink">
                    {formatINR(row.totalPaid)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-authority-green">
                    {formatINR(row.corpus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart: Contribution growth to corpus */}
      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Contribution vs Estimated Corpus Growth
        </h3>
        <div className="h-[240px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chartData}>
              <defs>
                <linearGradient id="apyContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="apyCorpus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#166534" stopOpacity={0} />
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
                dataKey="contributed"
                stroke="#d97706"
                strokeWidth={2}
                fill="url(#apyContrib)"
                name="Total Contributed"
              />
              <Area
                type="monotone"
                dataKey="corpus"
                stroke="#166534"
                strokeWidth={2}
                fill="url(#apyCorpus)"
                name="Estimated Corpus"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-ink/5">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: "#d97706" }}
            />
            <div>
              <p className="text-[11px] text-ink-60">Total Contributed</p>
              <p className="text-sm font-display font-bold text-ink">
                {formatINR(result.totalAmountPaid)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: "#166534" }}
            />
            <div>
              <p className="text-[11px] text-ink-60">Corpus at 60</p>
              <p className="text-sm font-display font-bold text-ink">
                {formatINR(result.corpus)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="atal-pension-yojana" variant="strip" />
      </div>
    </div>
  );
}
