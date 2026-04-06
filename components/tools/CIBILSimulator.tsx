"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Info,
} from "lucide-react";

/* ─── Score calculation logic ─── */

interface Factors {
  paymentHistory: number; // 0-4 (missed payments in last 12mo)
  creditUtilization: number; // 0-100 (% of credit limit used)
  creditAge: number; // years
  totalAccounts: number; // active credit accounts
  recentInquiries: number; // hard inquiries in last 6mo
  existingLoans: number; // active loan count
}

function simulateScore(f: Factors): number {
  let score = 750; // base

  // Payment history (35% weight) — biggest impact
  score -= f.paymentHistory * 40; // each missed payment = -40

  // Credit utilization (30% weight)
  if (f.creditUtilization > 75) score -= 80;
  else if (f.creditUtilization > 50) score -= 40;
  else if (f.creditUtilization > 30) score -= 10;
  else score += 20; // low utilization = bonus

  // Credit age (15% weight)
  if (f.creditAge >= 7) score += 30;
  else if (f.creditAge >= 3) score += 10;
  else if (f.creditAge < 1) score -= 30;

  // Credit mix (10% weight)
  if (f.totalAccounts >= 3 && f.totalAccounts <= 8) score += 15;
  else if (f.totalAccounts > 10) score -= 10;
  else if (f.totalAccounts < 2) score -= 20;

  // Recent inquiries (10% weight)
  score -= f.recentInquiries * 15;

  // Active loans impact
  if (f.existingLoans > 3) score -= 20;

  return Math.max(300, Math.min(900, score));
}

function getScoreLabel(score: number): {
  label: string;
  color: string;
  textColor: string;
  desc: string;
} {
  if (score >= 750)
    return {
      label: "Excellent",
      color: "bg-green-500",
      textColor: "text-green-600",
      desc: "You qualify for the best loan rates and premium credit cards.",
    };
  if (score >= 700)
    return {
      label: "Good",
      color: "bg-green-400",
      textColor: "text-green-600",
      desc: "Most loans and credit cards are available to you.",
    };
  if (score >= 650)
    return {
      label: "Fair",
      color: "bg-amber-400",
      textColor: "text-amber-600",
      desc: "You may qualify for loans but at higher interest rates.",
    };
  if (score >= 600)
    return {
      label: "Poor",
      color: "bg-orange-500",
      textColor: "text-orange-600",
      desc: "Limited options. Consider secured cards to rebuild.",
    };
  return {
    label: "Very Poor",
    color: "bg-red-500",
    textColor: "text-red-600",
    desc: "Focus on clearing dues and reducing utilization first.",
  };
}

/* ─── Component ─── */

export default function CIBILSimulator() {
  const [factors, setFactors] = useState<Factors>({
    paymentHistory: 0,
    creditUtilization: 30,
    creditAge: 3,
    totalAccounts: 3,
    recentInquiries: 1,
    existingLoans: 1,
  });

  const [showResult, setShowResult] = useState(false);

  const score = useMemo(() => simulateScore(factors), [factors]);
  const scoreInfo = useMemo(() => getScoreLabel(score), [score]);
  const scorePercent = ((score - 300) / 600) * 100;

  const update = (key: keyof Factors, value: number) => {
    setFactors((prev) => ({ ...prev, [key]: value }));
    setShowResult(true);
  };

  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[--v2-ink]">
              CIBIL Score Simulator
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Estimate how your habits affect your credit score. This is a
              simulation — not your actual score.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Info size={12} />
            For educational purposes only
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            {/* Payment History */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-900">
                  Missed payments (last 12 months)
                </label>
                <span className="text-sm font-bold text-gray-900 tabular-nums">
                  {factors.paymentHistory}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={4}
                step={1}
                value={factors.paymentHistory}
                onChange={(e) =>
                  update("paymentHistory", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>None</span>
                <span>4+</span>
              </div>
            </div>

            {/* Credit Utilization */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-900">
                  Credit card utilization
                </label>
                <span className="text-sm font-bold text-gray-900 tabular-nums">
                  {factors.creditUtilization}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={factors.creditUtilization}
                onChange={(e) =>
                  update("creditUtilization", Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0% (ideal)</span>
                <span>30% (good)</span>
                <span>100% (bad)</span>
              </div>
            </div>

            {/* Credit Age */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-900">
                  Credit history age
                </label>
                <span className="text-sm font-bold text-gray-900 tabular-nums">
                  {factors.creditAge} years
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={1}
                value={factors.creditAge}
                onChange={(e) => update("creditAge", Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>New</span>
                <span>7+ years (great)</span>
              </div>
            </div>

            {/* Quick selectors row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-gray-500 uppercase font-medium">
                  Active accounts
                </label>
                <select
                  value={factors.totalAccounts}
                  onChange={(e) =>
                    update("totalAccounts", Number(e.target.value))
                  }
                  className="mt-1 w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={8}>8+</option>
                  <option value={12}>12+</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 uppercase font-medium">
                  Recent inquiries
                </label>
                <select
                  value={factors.recentInquiries}
                  onChange={(e) =>
                    update("recentInquiries", Number(e.target.value))
                  }
                  className="mt-1 w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5+</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 uppercase font-medium">
                  Active loans
                </label>
                <select
                  value={factors.existingLoans}
                  onChange={(e) =>
                    update("existingLoans", Number(e.target.value))
                  }
                  className="mt-1 w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={5}>5+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Score result */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <p className="text-[10px] text-gray-400 uppercase font-semibold mb-4">
              Estimated Score
            </p>

            {/* Score display */}
            <div className="text-center mb-4">
              <p className="text-[42px] font-black text-gray-900 tabular-nums leading-none">
                {score}
              </p>
              <p className={`text-sm font-bold mt-1 ${scoreInfo.textColor}`}>
                {scoreInfo.label}
              </p>
            </div>

            {/* Score bar */}
            <div className="relative h-3 bg-gradient-to-r from-red-500 via-amber-400 to-green-500 rounded-full mb-2">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-900 rounded-full shadow-sm transition-all duration-300"
                style={{ left: `calc(${scorePercent}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 mb-4">
              <span>300</span>
              <span>600</span>
              <span>750</span>
              <span>900</span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {scoreInfo.desc}
            </p>

            {/* Impact factors */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">
                What's affecting your score
              </p>
              {[
                {
                  label: "Payment history",
                  impact:
                    factors.paymentHistory === 0 ? "positive" : "negative",
                  weight: "35%",
                },
                {
                  label: "Credit utilization",
                  impact:
                    factors.creditUtilization <= 30
                      ? "positive"
                      : factors.creditUtilization <= 50
                        ? "neutral"
                        : "negative",
                  weight: "30%",
                },
                {
                  label: "Credit age",
                  impact: factors.creditAge >= 3 ? "positive" : "negative",
                  weight: "15%",
                },
                {
                  label: "Credit mix",
                  impact:
                    factors.totalAccounts >= 2 && factors.totalAccounts <= 8
                      ? "positive"
                      : "negative",
                  weight: "10%",
                },
                {
                  label: "Recent inquiries",
                  impact:
                    factors.recentInquiries <= 1 ? "positive" : "negative",
                  weight: "10%",
                },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600">
                    {f.label}{" "}
                    <span className="text-gray-400">({f.weight})</span>
                  </span>
                  {f.impact === "positive" ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : f.impact === "negative" ? (
                    <AlertTriangle size={14} className="text-red-500" />
                  ) : (
                    <Minus size={14} className="text-amber-500" />
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/calculators"
              className="mt-4 block text-center text-xs text-green-600 font-medium hover:text-green-700"
            >
              Learn how to improve your score →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
