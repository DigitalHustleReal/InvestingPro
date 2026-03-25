"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { CheckCircle, X, Shield, Eye, ArrowRight, Info } from "lucide-react";

// ─── SCORING MATRIX DATA (matches lib/products/scoring-rules.ts exactly) ──────

const MATRIX = [
  {
    id: "credit-cards",
    name: "Credit Cards",
    icon: "💳",
    scale: "0–10",
    factors: [
      { name: "Travel Benefits", weight: 35, color: "bg-green-500", description: "Reward rate + Lounge access score + card type bonus. Reward rate: 5% = 10pts. Lounge: unlimited = 10pts, 4 visits = 6pts." },
      { name: "Rewards Power", weight: 35, color: "bg-blue-500", description: "Reward rate score (70%) + shopping card bonus. Covers cashback, points, miles." },
      { name: "Cost Efficiency", weight: 30, color: "bg-amber-500", description: "Annual fee impact. ₹0 fee = 10/10. ₹500 = 9/10. ₹5,000 = 0/10. Formula: max(0, 10 − fee/500)." },
    ],
    userAdjustable: true,
    adjustableNote: "Weights shift based on your preference (Balanced / Travel / Low Fees / Shopping)",
    sampleCalc: {
      product: "HDFC Regalia (example)",
      inputs: { rewardRate: "4 pts/₹150", annualFee: 2500, loungeAccess: "12 visits/year" },
      output: 7.2,
    }
  },
  {
    id: "mutual-funds",
    name: "Mutual Funds",
    icon: "📈",
    scale: "0–10",
    factors: [
      { name: "3-Year Returns", weight: 50, color: "bg-green-500", description: "3Y CAGR. Formula: min(10, returns3Y / 2.5). So 25% CAGR = 10/10, 12.5% = 5/10, <0% = 0." },
      { name: "Expense Ratio", weight: 30, color: "bg-blue-500", description: "Lower is better. Formula: max(0, 10 − expenseRatio × 5). 0% = 10, 1% = 5, 2% = 0." },
      { name: "Fund Rating", weight: 20, color: "bg-purple-500", description: "AMFI/Morningstar star rating converted to 0–10. Formula: stars × 2. 5★ = 10, 3★ = 6." },
    ],
    userAdjustable: false,
    sampleCalc: null,
  },
  {
    id: "loans",
    name: "Loans (Personal / Home)",
    icon: "🏦",
    scale: "0–10",
    factors: [
      { name: "Affordability", weight: 50, color: "bg-green-500", description: "Interest rate vs 8.5% baseline. Every 1% above 8.5% = −1.5pts. 8.5% = 10/10, 15% = 0.25/10." },
      { name: "Processing Cost", weight: 30, color: "bg-amber-500", description: "Processing fee. 0% = 10, 1% = 7, 3% = 1. Formula: max(0, 10 − fee% × 3)." },
      { name: "Tenure Flexibility", weight: 20, color: "bg-blue-500", description: "Max repayment period. 5yr = 7.5, 7yr+ = 10. Formula: min(10, tenure_years × 1.5)." },
    ],
    userAdjustable: false,
    sampleCalc: null,
  },
  {
    id: "fixed-deposits",
    name: "Fixed Deposits",
    icon: "🏛️",
    scale: "0–10",
    factors: [
      { name: "Interest Rate", weight: 50, color: "bg-green-500", description: "Rate vs 5.5% floor. Formula: min(10, (rate − 5.5) × 2.5). 9.5% = 10/10, 7.5% = 5/10." },
      { name: "Tenure Range", weight: 20, color: "bg-blue-500", description: "Max − Min tenure flexibility in months. 5yr range = 10/10." },
      { name: "Bank Safety", weight: 20, color: "bg-amber-500", description: "SBI = 10, Nationalised = 9, Private = 7.5, Small Finance = 6, NBFC = 4. All covered under DICGC ₹5L insurance." },
      { name: "Early Exit Penalty", weight: 10, color: "bg-purple-500", description: "Premature withdrawal penalty. 0% penalty = 10/10, 2.5% = 0. Formula: max(0, 10 − penalty% × 4)." },
    ],
    userAdjustable: false,
    sampleCalc: null,
  },
  {
    id: "demat-accounts",
    name: "Demat Accounts",
    icon: "📊",
    scale: "0–10",
    factors: [
      { name: "Brokerage Cost", weight: 40, color: "bg-green-500", description: "Flat fee model: ₹0 = 10, ₹20 = 8, ₹40 = 6. Percentage model: 0.1% = 8, 0.3% = 4, 0.5% = 0." },
      { name: "Annual Charges", weight: 25, color: "bg-amber-500", description: "AMC per year. ₹0 = 10, ₹300 = 5.7, ₹700+ = 0. Formula: max(0, 10 − AMC/70)." },
      { name: "Platform Quality", weight: 20, color: "bg-blue-500", description: "App Store rating (out of 5) × 1.2 + free research bonus (+3) + free MF bonus (+1)." },
      { name: "Feature Set", weight: 15, color: "bg-purple-500", description: "IPO application, free mutual funds, DP charge below ₹13/scrip, and base feature points." },
    ],
    userAdjustable: false,
    sampleCalc: null,
  },
  {
    id: "insurance",
    name: "Term Insurance",
    icon: "🛡️",
    scale: "0–10",
    factors: [
      { name: "Claim Settlement", weight: 35, color: "bg-green-500", description: "IRDAI annual claim settlement ratio. 99.5%+ = 9.5/10, 95% = 5/10. Formula: (ratio − 90) × 2." },
      { name: "Premium Value", weight: 30, color: "bg-blue-500", description: "Sum assured / annual premium. 1000× = 10/10, 500× = 5/10. Measures how much cover per rupee paid." },
      { name: "Insurer Strength", weight: 25, color: "bg-amber-500", description: "IRDAI solvency ratio. 1.5 = 3.5/10, 2.0 = 7/10, 2.4+ = 10/10. Formula: (ratio − 1.0) × 7." },
      { name: "Coverage Depth", weight: 10, color: "bg-purple-500", description: "Coverage age (85yr+ = 8pts), critical illness rider (+2pts), premium waiver rider (+1pt)." },
    ],
    userAdjustable: false,
    sampleCalc: null,
  },
];

// ─── Rule: no affiliate influence ─────────────────────────────────────────────

const RULES = [
  { type: "do", text: "Rank by objective score — same formula for all products, paid or unpaid" },
  { type: "do", text: "Include products with zero affiliate deal if they score well" },
  { type: "do", text: "Show all fees, including those we earn nothing from" },
  { type: "do", text: "Label affiliate links with tracked URLs; non-affiliate links open directly" },
  { type: "do", text: "Update rankings when product terms change — both positive and negative" },
  { type: "dont", text: "Accept payment to improve a product's ranking position" },
  { type: "dont", text: "Remove negative data from a listing for a fee" },
  { type: "dont", text: "Write undisclosed sponsored editorial" },
  { type: "dont", text: "Suppress comparisons that favour competitor products" },
  { type: "dont", text: "Use affiliate commission as a primary tiebreaker (only at equal scores)" },
];

// ─── Live Credit Card Demo ────────────────────────────────────────────────────

function LiveCCDemo() {
  const [annualFee, setAnnualFee] = useState(0);
  const [rewardRatePct, setRewardRatePct] = useState(5);
  const [loungeVisits, setLoungeVisits] = useState(8);

  // Mirror scoring-rules.ts logic exactly
  const getRewardScore = (r: number) => Math.min(r * 2, 10);
  const getLoungeScore = (v: number) => v === 0 ? 0 : Math.min(v * 1.5, 10);
  const feeScore = annualFee === 0 ? 10 : Math.max(0, 10 - annualFee / 500);
  const travelScore = getRewardScore(rewardRatePct) * 0.4 + getLoungeScore(loungeVisits) * 0.4;
  const rewardScore = getRewardScore(rewardRatePct) * 0.7;
  const overall = (travelScore * 0.35 + rewardScore * 0.35 + feeScore * 0.30);
  const overallClamped = Math.max(0, Math.min(10, overall));

  const bar = (score: number) => (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${score * 10}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-700 w-8 text-right">{score.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label className="text-sm">Annual Fee</Label>
            <span className="text-sm font-bold text-primary">₹{annualFee.toLocaleString("en-IN")}</span>
          </div>
          <Slider min={0} max={5000} step={250} value={[annualFee]} onValueChange={([v]) => setAnnualFee(v)} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label className="text-sm">Reward Rate</Label>
            <span className="text-sm font-bold text-primary">{rewardRatePct}%</span>
          </div>
          <Slider min={0} max={10} step={0.5} value={[rewardRatePct]} onValueChange={([v]) => setRewardRatePct(v)} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label className="text-sm">Lounge Visits / year</Label>
            <span className="text-sm font-bold text-primary">{loungeVisits}</span>
          </div>
          <Slider min={0} max={20} value={[loungeVisits]} onValueChange={([v]) => setLoungeVisits(v)} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-green-50 rounded-xl text-center mb-2">
          <p className="text-xs text-slate-500 mb-1">InvestingPro Score</p>
          <p className="text-5xl font-black text-primary">{overallClamped.toFixed(1)}</p>
          <p className="text-xs text-slate-400">out of 10</p>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Travel Benefits</span><span>35%</span>
            </div>
            {bar(travelScore)}
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Rewards Power</span><span>35%</span>
            </div>
            {bar(rewardScore)}
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Cost Efficiency</span><span>30%</span>
            </div>
            {bar(feeScore)}
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center">Live calculation — same formula as the ranking page</p>
      </div>
    </div>
  );
}

// ─── Factor Weight Bar ────────────────────────────────────────────────────────

function FactorRow({ factor }: { factor: typeof MATRIX[0]["factors"][0] }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-6 h-6 rounded flex-shrink-0" style={{}} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{factor.name}</span>
          <span className="text-sm font-bold text-primary">{factor.weight}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
          <div
            className={`h-full rounded-full ${factor.color}`}
            style={{ width: `${factor.weight}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{factor.description}</p>
      </div>
    </div>
  );
}

// ─── Main page component ─────────────────────────────────────────────────────

export function ScoringMatrixPage() {
  const [activeVertical, setActiveVertical] = useState("credit-cards");
  const active = MATRIX.find((m) => m.id === activeVertical) ?? MATRIX[0];

  return (
    <div className="space-y-10">

      {/* Matrix Overview Table */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complete Scoring Matrix</h2>
        <p className="text-slate-500 text-sm mb-5">Every factor, every weight. No hidden variables.</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Category</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Factor 1</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Factor 2</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Factor 3</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">Factor 4</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">User-Adjustable?</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => setActiveVertical(row.id)}
                  className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors
                    ${activeVertical === row.id ? "bg-green-50 dark:bg-green-950" : i % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50/50 dark:bg-slate-900/50"}
                    hover:bg-green-50/60 dark:hover:bg-green-950/40`}
                >
                  <td className="px-5 py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {row.icon} {row.name}
                  </td>
                  {[0, 1, 2, 3].map((fi) => (
                    <td key={fi} className="px-5 py-3 text-slate-600 dark:text-slate-400">
                      {row.factors[fi] ? (
                        <span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{row.factors[fi].name}</span>
                          <span className="ml-1 text-xs font-bold text-primary">({row.factors[fi].weight}%)</span>
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">—</span>
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-center">
                    {row.userAdjustable
                      ? <span className="inline-flex items-center gap-1 text-green-700 font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Yes</span>
                      : <span className="text-slate-400 text-xs">Fixed formula</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <Info className="w-3 h-3" /> Click any row for the detailed formula breakdown below.
        </p>
      </section>

      {/* Detail panel for active vertical */}
      <section>
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <span className="text-2xl">{active.icon}</span> {active.name} — Scoring Breakdown
              </CardTitle>
              {active.userAdjustable && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  ⚙️ Weights adjustable by preference
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-5 divide-y divide-slate-100 dark:divide-slate-800">
            {active.factors.map((f) => <FactorRow key={f.name} factor={f} />)}

            {active.userAdjustable && (
              <div className="pt-4">
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex gap-2 items-start">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{active.adjustableNote}. All presets are symmetric — we don&apos;t favour any product regardless of which preset you choose.</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Live Demo */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Live Score Calculator — Credit Cards</h2>
        <p className="text-slate-500 text-sm mb-5">
          This is the exact formula from our source code. Adjust any input and watch the score compute in real time.
        </p>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="pt-6">
            <LiveCCDemo />
          </CardContent>
        </Card>
      </section>

      {/* What we do / don't do */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Our Commitments</h2>
        <p className="text-slate-500 text-sm mb-5">
          These are non-negotiable rules that govern how scores translate to rankings.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border border-green-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-3"><CardTitle className="text-base text-green-800 dark:text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> We do</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {RULES.filter((r) => r.type === "do").map((r) => (
                  <li key={r.text} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{r.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border border-red-200 shadow-sm rounded-2xl">
            <CardHeader className="pb-3"><CardTitle className="text-base text-red-700 dark:text-red-400 flex items-center gap-2"><X className="w-4 h-4" /> We never do</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {RULES.filter((r) => r.type === "dont").map((r) => (
                  <li key={r.text} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />{r.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tiebreaker rule */}
      <section>
        <Card className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 shadow-sm rounded-2xl">
          <CardContent className="pt-5">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-300 mb-1">Tiebreaker Rule</p>
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  When two products have identical scores, the one with the higher affiliate commission appears second —
                  not first. Commercial relationships never break ties in our favour. Products ranked #1 earn that position
                  by formula alone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Source reference */}
      <section className="pb-4">
        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <Eye className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              The formulas on this page match the production scoring engine at{" "}
              <code className="text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">lib/products/scoring-rules.ts</code>.
              If you spot a discrepancy, please{" "}
              <Link href="/contact-us" className="text-primary underline underline-offset-2">report it</Link>.
            </p>
          </div>
          <Link href="/methodology" className="flex items-center gap-1 text-sm text-primary font-semibold whitespace-nowrap hover:underline">
            Full methodology <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
