"use client";

import React, { useState, useMemo } from "react";
import { IndianRupee, TrendingUp, Clock, Percent } from "lucide-react";
import { SliderInput } from "./shared/SliderInput";
import { VSComparisonLayout } from "./shared/VSComparisonLayout";
import { AIInsight } from "./shared/AIInsight";
import { TrustStrip } from "./shared/TrustStrip";
import { PopularCalculators } from "./shared/PopularCalculators";
import { formatINR } from "./shared/charts";

export function EPFvsVPFCalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [epfRate, setEpfRate] = useState(8.25);
  const [vpfPercent, setVpfPercent] = useState(50);
  const [yearsToRetirement, setYearsToRetirement] = useState(25);

  const result = useMemo(() => {
    const months = yearsToRetirement * 12;

    // --- EPF Contributions ---
    // Employee: 12% of basic to EPF
    // Employer: 12% of basic — split as 3.67% to EPF + 8.33% to EPS
    // EPS is capped at basic Rs 15,000, so EPS contribution = min(basic, 15000) * 8.33%
    // Employer EPF portion = total employer 12% - EPS portion
    const employeeEPF = basicSalary * 0.12;
    const epsCap = Math.min(basicSalary, 15000);
    const epsContribution = epsCap * 0.0833;
    const employerEPF = basicSalary * 0.12 - epsContribution;
    const totalMonthlyEPF = employeeEPF + employerEPF;

    // --- VPF: extra voluntary contribution (% of basic) ---
    const vpfMonthly = basicSalary * (vpfPercent / 100);

    // Total monthly contribution to PF account
    const totalMonthlyWithVPF = totalMonthlyEPF + vpfMonthly;

    // --- Tax-free limit: Rs 2.5L per year employee contribution ---
    // Employee contribution = employeeEPF + VPF
    const annualEmployeeContribution = (employeeEPF + vpfMonthly) * 12;
    const taxFreeLimit = 250000; // Rs 2.5L per year

    // --- Corpus calculation: compound monthly at EPF rate ---
    // EPF rate is annual, interest credited monthly
    const monthlyRate = epfRate / 100 / 12;

    // EPF-only corpus (no VPF)
    let epfCorpus = 0;
    for (let m = 0; m < months; m++) {
      epfCorpus += totalMonthlyEPF;
      epfCorpus *= 1 + monthlyRate;
    }

    // EPF + VPF corpus
    let totalCorpus = 0;
    for (let m = 0; m < months; m++) {
      totalCorpus += totalMonthlyWithVPF;
      totalCorpus *= 1 + monthlyRate;
    }

    const vpfExtraCorpus = totalCorpus - epfCorpus;

    // --- Tax on interest above Rs 2.5L employee contribution ---
    // Interest on employee contribution above Rs 2.5L is taxable at slab rate
    // Simplified: calculate what portion of total interest is taxable
    const totalInvestedEPF = totalMonthlyEPF * months;
    const totalInvestedWithVPF = totalMonthlyWithVPF * months;
    const epfInterest = epfCorpus - totalInvestedEPF;
    const totalInterest = totalCorpus - totalInvestedWithVPF;

    // Tax-free portion: interest earned on contributions within Rs 2.5L/year limit
    const taxFreeContributionPerMonth = Math.min(
      employeeEPF + vpfMonthly,
      taxFreeLimit / 12,
    );
    const taxableContributionPerMonth = Math.max(
      0,
      employeeEPF + vpfMonthly - taxFreeLimit / 12,
    );

    // Approximate taxable interest ratio
    const totalEmployeeContribution = (employeeEPF + vpfMonthly) * months;
    const taxableRatio =
      totalEmployeeContribution > 0
        ? (taxableContributionPerMonth * months) / totalEmployeeContribution
        : 0;
    const taxableInterest = Math.round(totalInterest * taxableRatio);
    const taxFreeInterest = totalInterest - taxableInterest;

    // EPF-only: check if employee contribution exceeds 2.5L
    const epfOnlyAnnualEmployee = employeeEPF * 12;
    const epfOnlyTaxableRatio =
      epfOnlyAnnualEmployee > taxFreeLimit
        ? (epfOnlyAnnualEmployee - taxFreeLimit) / epfOnlyAnnualEmployee
        : 0;
    const epfOnlyTaxableInterest = Math.round(
      epfInterest * epfOnlyTaxableRatio,
    );

    // Effective return (pre-tax CAGR on total contributions)
    const epfEffective =
      totalInvestedEPF > 0
        ? (
            (Math.pow(epfCorpus / totalInvestedEPF, 1 / yearsToRetirement) -
              1) *
            100
          ).toFixed(1)
        : "0";
    const totalEffective =
      totalInvestedWithVPF > 0
        ? (
            (Math.pow(
              totalCorpus / totalInvestedWithVPF,
              1 / yearsToRetirement,
            ) -
              1) *
            100
          ).toFixed(1)
        : "0";

    const isOverTaxFreeLimit = annualEmployeeContribution > taxFreeLimit;

    return {
      employeeEPF: Math.round(employeeEPF),
      employerEPF: Math.round(employerEPF),
      epsContribution: Math.round(epsContribution),
      totalMonthlyEPF: Math.round(totalMonthlyEPF),
      vpfMonthly: Math.round(vpfMonthly),
      totalMonthlyWithVPF: Math.round(totalMonthlyWithVPF),
      annualEmployeeContribution: Math.round(annualEmployeeContribution),
      epfCorpus: Math.round(epfCorpus),
      totalCorpus: Math.round(totalCorpus),
      vpfExtraCorpus: Math.round(vpfExtraCorpus),
      totalInvestedEPF: Math.round(totalInvestedEPF),
      totalInvestedWithVPF: Math.round(totalInvestedWithVPF),
      epfInterest: Math.round(epfInterest),
      totalInterest: Math.round(totalInterest),
      taxableInterest: Math.round(taxableInterest),
      taxFreeInterest: Math.round(taxFreeInterest),
      epfOnlyTaxableInterest,
      epfEffective,
      totalEffective,
      isOverTaxFreeLimit,
    };
  }, [basicSalary, epfRate, vpfPercent, yearsToRetirement]);

  const comparisonMetrics = useMemo(
    () => [
      {
        label: "Monthly Contribution",
        optionA: formatINR(result.totalMonthlyEPF),
        optionB: formatINR(result.totalMonthlyWithVPF),
        winner: "tie" as const,
      },
      {
        label: "Your Extra (VPF)",
        optionA: formatINR(0),
        optionB: formatINR(result.vpfMonthly),
        winner: result.vpfMonthly > 0 ? ("B" as const) : ("tie" as const),
      },
      {
        label: "Total Corpus",
        optionA: formatINR(result.epfCorpus),
        optionB: formatINR(result.totalCorpus),
        winner:
          result.totalCorpus > result.epfCorpus
            ? ("B" as const)
            : ("tie" as const),
      },
      {
        label: "Extra from VPF",
        optionA: "---",
        optionB: formatINR(result.vpfExtraCorpus),
        winner: result.vpfExtraCorpus > 0 ? ("B" as const) : ("tie" as const),
      },
      {
        label: "Tax-Free Interest",
        optionA: formatINR(result.epfInterest - result.epfOnlyTaxableInterest),
        optionB: formatINR(result.taxFreeInterest),
        winner:
          result.taxFreeInterest >
          result.epfInterest - result.epfOnlyTaxableInterest
            ? ("B" as const)
            : ("A" as const),
      },
      {
        label: "Taxable Interest",
        optionA: formatINR(result.epfOnlyTaxableInterest),
        optionB: formatINR(result.taxableInterest),
        winner:
          result.epfOnlyTaxableInterest < result.taxableInterest
            ? ("A" as const)
            : result.epfOnlyTaxableInterest > result.taxableInterest
              ? ("B" as const)
              : ("tie" as const),
      },
      {
        label: "Effective CAGR",
        optionA: `${result.epfEffective}%`,
        optionB: `${result.totalEffective}%`,
        winner:
          parseFloat(result.totalEffective) > parseFloat(result.epfEffective)
            ? ("B" as const)
            : parseFloat(result.totalEffective) <
                parseFloat(result.epfEffective)
              ? ("A" as const)
              : ("tie" as const),
      },
      {
        label: "Risk Level",
        optionA: "Sovereign (Govt backed)",
        optionB: "Sovereign (Same as EPF)",
        winner: "tie" as const,
      },
    ],
    [result],
  );

  const verdict = useMemo(() => {
    if (result.vpfMonthly === 0) {
      return {
        winner: "tie" as const,
        title: "No VPF contribution set",
        description:
          "Increase VPF percentage to see how much extra corpus you can build. VPF earns the same rate as EPF and is one of the safest investment options in India.",
      };
    }
    if (result.isOverTaxFreeLimit) {
      return {
        winner: "B" as const,
        title: `VPF adds ${formatINR(result.vpfExtraCorpus)} extra corpus`,
        description: `VPF builds ${formatINR(result.vpfExtraCorpus)} additional corpus at the same ${epfRate}% EPF rate. However, your annual employee contribution (${formatINR(result.annualEmployeeContribution)}) exceeds Rs 2.5L tax-free limit — interest on ${formatINR(result.taxableInterest)} will be taxable. Consider balancing VPF with other investments like ELSS or PPF.`,
      };
    }
    return {
      winner: "B" as const,
      title: `VPF adds ${formatINR(result.vpfExtraCorpus)} extra — fully tax-free!`,
      description: `VPF at ${vpfPercent}% of basic builds ${formatINR(result.vpfExtraCorpus)} additional corpus at ${epfRate}% guaranteed return. Your total annual employee contribution (${formatINR(result.annualEmployeeContribution)}) is within the Rs 2.5L tax-free limit. VPF is one of the best risk-free investments in India.`,
    };
  }, [result, epfRate, vpfPercent]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `Basic salary ${formatINR(basicSalary)} pe EPF contribution: Employee ${formatINR(result.employeeEPF)} + Employer ${formatINR(result.employerEPF)} = ${formatINR(result.totalMonthlyEPF)}/month. VPF extra: ${formatINR(result.vpfMonthly)}/month.`,
    );
    if (result.vpfMonthly > 0) {
      ins.push(
        `VPF ka fayda: ${formatINR(result.vpfExtraCorpus)} extra milega ${yearsToRetirement} saal mein — same ${epfRate}% guaranteed rate pe, government backed. No market risk!`,
      );
    }
    if (result.isOverTaxFreeLimit) {
      ins.push(
        `Dhyan do: Tumhara annual employee contribution ${formatINR(result.annualEmployeeContribution)} hai — Rs 2.5L se zyada hai. 2021 budget ke baad, Rs 2.5L se upar ke PF contribution ka interest taxable hai. VPF thoda kam karo ya NPS/ELSS mein diversify karo.`,
      );
    } else {
      ins.push(
        `Good news: Annual employee contribution ${formatINR(result.annualEmployeeContribution)} hai — Rs 2.5L limit ke andar hai. Saara interest tax-free milega! VPF badhane ki jagah hai.`,
      );
    }
    ins.push(
      `Pro tip: EPF/VPF pe ${epfRate}% guaranteed return milta hai — PPF se bhi zyada (7.1%). Lekin liquidity kam hai — retirement tak lock hota hai. Emergency fund alag rakho.`,
    );
    if (yearsToRetirement >= 20) {
      ins.push(
        `${yearsToRetirement} saal hai retirement mein — compounding ka magic dekhna! ${formatINR(result.totalMonthlyWithVPF)}/month se ${formatINR(result.totalCorpus)} ban jaayega. Patience is key.`,
      );
    }
    return ins;
  }, [result, basicSalary, epfRate, vpfPercent, yearsToRetirement]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inputs */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Salary & PF Details
          </h2>
          <div className="space-y-4">
            <SliderInput
              label="Basic Salary (Monthly)"
              icon={IndianRupee}
              value={basicSalary}
              onChange={setBasicSalary}
              min={10000}
              max={200000}
              step={5000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="EPF Interest Rate (%)"
              icon={Percent}
              value={epfRate}
              onChange={setEpfRate}
              min={7}
              max={9}
              step={0.25}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="VPF Extra Contribution (% of Basic)"
              icon={TrendingUp}
              value={vpfPercent}
              onChange={setVpfPercent}
              min={0}
              max={100}
              step={5}
              formatDisplay={(v) => `${v}%`}
            />
            <SliderInput
              label="Years to Retirement"
              icon={Clock}
              value={yearsToRetirement}
              onChange={setYearsToRetirement}
              min={1}
              max={35}
              step={1}
              formatDisplay={(v) => `${v} years`}
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <VSComparisonLayout
            titleA="EPF Only"
            titleB="EPF + VPF"
            colorA="#166534"
            colorB="#d97706"
            valueA={formatINR(result.epfCorpus)}
            valueLabelA="EPF Corpus"
            valueB={formatINR(result.totalCorpus)}
            valueLabelB="Total Corpus"
            metrics={comparisonMetrics}
            verdict={verdict}
          />
          <AIInsight insights={insights} />
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="epf-vs-vpf" variant="strip" />
      </div>
    </div>
  );
}
