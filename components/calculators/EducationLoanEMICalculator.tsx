"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calendar,
  Percent,
  GraduationCap,
  Globe,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

type StudyType = "india" | "abroad";

export function EducationLoanEMICalculator() {
  const [studyType, setStudyType] = useState<StudyType>("india");
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [courseDuration, setCourseDuration] = useState(2);
  const [repaymentTenure, setRepaymentTenure] = useState(7);

  const calcEMI = (P: number, r: number, n: number) => {
    const mr = r / 100 / 12;
    const months = n * 12;
    if (mr === 0) return P / months;
    return (P * mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1);
  };

  const result = useMemo(() => {
    // During course: only interest accrues (moratorium)
    const moratoriumMonths = courseDuration * 12 + 6; // Course + 6 months grace
    const monthlyRate = interestRate / 100 / 12;
    const interestDuringCourse = loanAmount * monthlyRate * moratoriumMonths;
    const totalPrincipal = loanAmount + interestDuringCourse; // Amount after moratorium

    const emi = calcEMI(totalPrincipal, interestRate, repaymentTenure);
    const totalPayment = emi * repaymentTenure * 12;
    const totalInterest = totalPayment - loanAmount;
    const totalCost = totalPayment;

    // Sec 80E: interest deduction for 8 years from start of repayment
    const annualInterest = totalInterest / repaymentTenure;
    const sec80ESaving = Math.min(annualInterest, 500000) * 0.3; // 30% bracket, no cap on 80E

    const yearlyData = [];
    let balance = totalPrincipal;
    const r = interestRate / 100 / 12;
    let totalPP = 0;
    for (let year = 1; year <= repaymentTenure; year++) {
      let yp = 0;
      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const mi = balance * r;
        const mp = Math.min(emi - mi, balance);
        balance -= mp;
        yp += mp;
      }
      totalPP += yp;
      yearlyData.push({
        year: `Y${year}`,
        balance: Math.round(Math.max(0, balance)),
        paid: Math.round(totalPP),
      });
    }

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      interestDuringCourse: Math.round(interestDuringCourse),
      totalPrincipal: Math.round(totalPrincipal),
      moratoriumMonths,
      sec80ESaving: Math.round(sec80ESaving),
      yearlyData,
    };
  }, [loanAmount, interestRate, courseDuration, repaymentTenure]);

  const scenarios = useMemo(() => {
    const morM = courseDuration * 12 + 6;
    const mr = interestRate / 100 / 12;
    const calcScenario = (tenure: number) => {
      const idc = loanAmount * mr * morM;
      const tp = loanAmount + idc;
      const e = calcEMI(tp, interestRate, tenure);
      return {
        emi: e,
        total: e * tenure * 12,
        interest: e * tenure * 12 - loanAmount,
      };
    };
    const s5 = calcScenario(5);
    const s7 = calcScenario(7);
    const s10 = calcScenario(10);
    return [
      {
        label: "5 Year Repayment",
        description: `EMI: ${formatINR(s5.emi)}/mo`,
        value: formatINR(s5.interest),
        subtext: "Highest EMI, lowest interest",
        type: "conservative" as const,
      },
      {
        label: "7 Year Repayment",
        description: `EMI: ${formatINR(s7.emi)}/mo`,
        value: formatINR(s7.interest),
        subtext: "Balanced",
        type: "moderate" as const,
      },
      {
        label: "10 Year Repayment",
        description: `EMI: ${formatINR(s10.emi)}/mo`,
        value: formatINR(s10.interest),
        subtext: "Low EMI, most interest",
        type: "aggressive" as const,
      },
    ];
  }, [loanAmount, interestRate, courseDuration]);

  const insights = useMemo(() => {
    const ins: string[] = [];
    ins.push(
      `Course ke ${courseDuration} saal + 6 months grace period mein ${formatINR(result.interestDuringCourse)} interest accumulate hoga. Repayment tab shuru hoga jab job lage.`,
    );
    ins.push(
      `Section 80E mein education loan ke interest par UNLIMITED deduction milta hai — 8 saal tak. Estimated tax saving: ${formatINR(result.sec80ESaving)}/year at 30% bracket.`,
    );
    if (studyType === "abroad") {
      ins.push(
        `Abroad study loans (₹20L+) usually need collateral. SBI/BoB offer lowest rates for US/UK/Canada. Consider partial scholarship + loan combo to reduce burden.`,
      );
    } else {
      ins.push(
        `₹7.5L tak ke education loan mein collateral nahi chahiye. Interest subsidy available under Vidyalakshmi portal for economically weaker sections.`,
      );
    }
    return ins;
  }, [result, courseDuration, studyType, loanAmount]);

  const pieData = [
    { name: "Principal", value: loanAmount, color: "#166534" },
    {
      name: "Interest (during course)",
      value: result.interestDuringCourse,
      color: "#d97706",
    },
    {
      name: "Interest (repayment)",
      value: Math.max(0, result.totalInterest - result.interestDuringCourse),
      color: "#dc2626",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <TrustStrip />

      <div className="lg:hidden">
        <ResultCard
          title="Monthly EMI (after course)"
          value={formatINR(result.emi)}
          ratingLabel={`Repayment starts ${result.moratoriumMonths} months after loan`}
          ratingType="neutral"
          metrics={[
            { label: "Loan Amount", value: formatINR(loanAmount) },
            { label: "Total Interest", value: formatINR(result.totalInterest) },
            { label: "Total Repayment", value: formatINR(result.totalPayment) },
            {
              label: "Tax Saved (80E)",
              value: `${formatINR(result.sec80ESaving)}/yr`,
              highlight: true,
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-display font-semibold text-ink mb-5">
            Education Loan Details
          </h2>
          <div className="flex items-center gap-1 mb-5 p-1 bg-gray-100 rounded-sm">
            {(["india", "abroad"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setStudyType(t);
                  setLoanAmount(t === "abroad" ? 3000000 : 1000000);
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all",
                  studyType === t
                    ? "bg-white text-authority-green shadow-sm"
                    : "text-ink-60",
                )}
              >
                {t === "india" ? (
                  <>
                    <GraduationCap size={14} /> India
                  </>
                ) : (
                  <>
                    <Globe size={14} /> Abroad
                  </>
                )}
              </button>
            ))}
          </div>
          <div className="space-y-5">
            <SliderInput
              label="Loan Amount"
              icon={IndianRupee}
              value={loanAmount}
              onChange={setLoanAmount}
              min={studyType === "india" ? 100000 : 500000}
              max={studyType === "india" ? 4000000 : 15000000}
              step={50000}
              formatDisplay={formatINR}
            />
            <SliderInput
              label="Interest Rate"
              icon={Percent}
              value={interestRate}
              onChange={setInterestRate}
              min={6}
              max={14}
              step={0.1}
              suffix="% p.a."
            />
            <SliderInput
              label="Course Duration"
              icon={GraduationCap}
              value={courseDuration}
              onChange={setCourseDuration}
              min={1}
              max={5}
              step={1}
              formatDisplay={(v) => `${v} Year${v > 1 ? "s" : ""} + 6 mo grace`}
            />
            <SliderInput
              label="Repayment Tenure"
              icon={Calendar}
              value={repaymentTenure}
              onChange={setRepaymentTenure}
              min={3}
              max={15}
              step={1}
              suffix=" Yrs"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:block">
            <ResultCard
              title="Monthly EMI (after course)"
              value={formatINR(result.emi)}
              ratingLabel={`Repayment starts ${result.moratoriumMonths} months after loan`}
              ratingType="neutral"
              metrics={[
                { label: "Loan Amount", value: formatINR(loanAmount) },
                {
                  label: "Total Interest",
                  value: formatINR(result.totalInterest),
                },
                {
                  label: "Total Repayment",
                  value: formatINR(result.totalPayment),
                },
                {
                  label: "Tax Saved (80E)",
                  value: `${formatINR(result.sec80ESaving)}/yr`,
                  highlight: true,
                },
              ]}
            />
          </div>
          <AIInsight insights={insights} />
        </div>
      </div>

      <WhatIfScenarios scenarios={scenarios} />

      <div className="bg-white border border-ink/10 rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-sm font-display font-semibold text-ink mb-3">
          Loan Balance Over Repayment Period
        </h3>
        <div className="h-[240px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.yearlyData}>
              <defs>
                <linearGradient id="elBal" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="balance"
                stroke="#dc2626"
                strokeWidth={2}
                fill="url(#elBal)"
                name="Outstanding"
              />
              <Area
                type="monotone"
                dataKey="paid"
                stroke="#22c55e"
                strokeWidth={2}
                fill="none"
                strokeDasharray="6 4"
                name="Paid Off"
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
                <p className="text-[10px] text-ink-60">{d.name}</p>
                <p className="text-xs font-display font-bold text-ink">
                  {formatINR(d.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden">
        <PopularCalculators currentSlug="education-loan-emi" variant="strip" />
      </div>
    </div>
  );
}
