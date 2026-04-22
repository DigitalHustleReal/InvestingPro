"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Home, Receipt } from "lucide-react";
import { trackEvent } from "@/lib/analytics/posthog-service";

// Live, interactive mini-calculators — instant-value pattern.
// Each card shows a real computed result. User drags the slider,
// number updates live. No click required to see value.
// "Open calculator" link opens the full-featured version.

function fmtINR(n: number): string {
  if (!isFinite(n)) return "—";
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
  if (n >= 1000) return "₹" + Math.round(n / 1000) + "K";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// SIP Future Value (Annuity Due)
function sipCorpus(monthly: number, ratePct: number, years: number): number {
  const r = ratePct / 100 / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

// Loan EMI
function emi(principal: number, ratePct: number, years: number): number {
  const r = ratePct / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Simple tax comparison: Old vs New regime for a salary
// Assumes ₹1.5L 80C + ₹75K standard + ₹50K NPS in old regime (typical max)
function taxSaving(salary: number): { saves: number; winner: "old" | "new" } {
  const stdDed = 75000;
  // Old regime: slab rates with deductions
  function oldTax(s: number) {
    const gross = Math.max(0, s - stdDed - 150000 - 50000); // 80C + NPS
    let t = 0;
    if (gross > 250000) t += Math.min(250000, gross - 250000) * 0.05;
    if (gross > 500000) t += Math.min(500000, gross - 500000) * 0.2;
    if (gross > 1000000) t += (gross - 1000000) * 0.3;
    return t * 1.04; // cess
  }
  // New regime (FY25-26): slab rates, no deductions
  function newTax(s: number) {
    const gross = Math.max(0, s - stdDed);
    let t = 0;
    const slabs = [
      [300000, 0],
      [700000, 0.05],
      [1000000, 0.1],
      [1200000, 0.15],
      [1500000, 0.2],
      [Infinity, 0.3],
    ] as [number, number][];
    let prev = 0;
    for (const [upto, rate] of slabs) {
      if (gross > prev) {
        t += (Math.min(upto, gross) - prev) * rate;
      }
      prev = upto;
    }
    // 87A rebate up to ₹7L income
    if (gross <= 700000) t = 0;
    return t * 1.04;
  }
  const o = oldTax(salary);
  const n = newTax(salary);
  return { saves: Math.abs(o - n), winner: n < o ? "new" : "old" };
}

export default function CalculatorSpotlight() {
  // Default values chosen to show compelling results on first render
  const [sipMonthly, setSipMonthly] = useState(10000);
  const [emiAmount, setEmiAmount] = useState(5000000);
  const [taxSalary, setTaxSalary] = useState(1200000);

  const sipResult = sipCorpus(sipMonthly, 12, 20);
  const sipInvested = sipMonthly * 12 * 20;
  const emiMonthly = emi(emiAmount, 8.5, 20);
  const emiTotalInterest = emiMonthly * 12 * 20 - emiAmount;
  const tax = taxSaving(taxSalary);

  return (
    <section className="py-16 md:py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
              Free Tools · Drag to explore
            </div>
            <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
              Run the numbers{" "}
              <em className="italic text-indian-gold">before you commit.</em>
            </h2>
          </div>
          <Link
            href="/calculators"
            className="hidden sm:inline-flex font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
          >
            All 75 calculators &rarr;
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* SIP mini-calc */}
          <div className="bg-white border-2 border-ink/10 rounded-sm p-6 flex flex-col">
            <TrendingUp className="w-6 h-6 text-indian-gold mb-4" />
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              SIP Calculator
            </h3>
            <p className="text-[13px] text-ink-60 leading-relaxed mb-5">
              Monthly SIP at 12% p.a. for 20 years.
            </p>

            {/* LIVE RESULT — updates as slider drags */}
            <div className="bg-indian-gold/5 border border-indian-gold/20 rounded-sm p-4 mb-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-1">
                You&apos;ll have
              </div>
              <div className="font-mono text-[32px] font-bold text-ink leading-none tabular-nums">
                {fmtINR(sipResult)}
              </div>
              <div className="font-mono text-[11px] text-ink-60 mt-2">
                Invest {fmtINR(sipInvested)} · Gain{" "}
                <span className="text-action-green font-semibold">
                  {fmtINR(sipResult - sipInvested)}
                </span>
              </div>
            </div>

            {/* INTERACTIVE SLIDER */}
            <div className="mb-4 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="sip-slider"
                  className="font-mono text-[10px] uppercase tracking-wider text-ink-60"
                >
                  Monthly SIP
                </label>
                <span className="font-mono text-[13px] font-bold text-ink tabular-nums">
                  {fmtINR(sipMonthly)}
                </span>
              </div>
              <input
                id="sip-slider"
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={sipMonthly}
                onChange={(e) => setSipMonthly(Number(e.target.value))}
                className="w-full accent-indian-gold cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-ink-60/60 mt-1">
                <span>₹1K</span>
                <span>₹1L</span>
              </div>
            </div>

            <Link
              href="/calculators/sip"
              onClick={() =>
                trackEvent("homepage_calculator_cta_clicked", {
                  calculator: "sip",
                  source: "homepage_spotlight",
                })
              }
              className="font-mono text-[11px] uppercase tracking-wider text-action-green hover:text-authority-green"
            >
              Full calculator &rarr;
            </Link>
          </div>

          {/* EMI mini-calc */}
          <div className="bg-white border-2 border-ink/10 rounded-sm p-6 flex flex-col">
            <Home className="w-6 h-6 text-indian-gold mb-4" />
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              EMI Calculator
            </h3>
            <p className="text-[13px] text-ink-60 leading-relaxed mb-5">
              Home loan at 8.5% p.a. for 20 years.
            </p>

            <div className="bg-indian-gold/5 border border-indian-gold/20 rounded-sm p-4 mb-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-1">
                Monthly EMI
              </div>
              <div className="font-mono text-[32px] font-bold text-ink leading-none tabular-nums">
                ₹{Math.round(emiMonthly).toLocaleString("en-IN")}
              </div>
              <div className="font-mono text-[11px] text-ink-60 mt-2">
                Total interest{" "}
                <span className="text-warning-red font-semibold">
                  {fmtINR(emiTotalInterest)}
                </span>
              </div>
            </div>

            <div className="mb-4 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="emi-slider"
                  className="font-mono text-[10px] uppercase tracking-wider text-ink-60"
                >
                  Loan amount
                </label>
                <span className="font-mono text-[13px] font-bold text-ink tabular-nums">
                  {fmtINR(emiAmount)}
                </span>
              </div>
              <input
                id="emi-slider"
                type="range"
                min={500000}
                max={30000000}
                step={100000}
                value={emiAmount}
                onChange={(e) => setEmiAmount(Number(e.target.value))}
                className="w-full accent-indian-gold cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-ink-60/60 mt-1">
                <span>₹5L</span>
                <span>₹3 Cr</span>
              </div>
            </div>

            <Link
              href="/calculators/emi"
              onClick={() =>
                trackEvent("homepage_calculator_cta_clicked", {
                  calculator: "emi",
                  source: "homepage_spotlight",
                })
              }
              className="font-mono text-[11px] uppercase tracking-wider text-action-green hover:text-authority-green"
            >
              Full calculator &rarr;
            </Link>
          </div>

          {/* Tax mini-calc */}
          <div className="bg-white border-2 border-ink/10 rounded-sm p-6 flex flex-col">
            <Receipt className="w-6 h-6 text-indian-gold mb-4" />
            <h3 className="font-display font-bold text-lg text-ink mb-1">
              Old vs New Regime
            </h3>
            <p className="text-[13px] text-ink-60 leading-relaxed mb-5">
              FY 2025-26 comparison with typical deductions.
            </p>

            <div className="bg-indian-gold/5 border border-indian-gold/20 rounded-sm p-4 mb-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-1">
                {tax.winner === "new" ? "New regime saves" : "Old regime saves"}
              </div>
              <div className="font-mono text-[32px] font-bold text-ink leading-none tabular-nums">
                {fmtINR(tax.saves)}
              </div>
              <div className="font-mono text-[11px] text-ink-60 mt-2">
                {tax.winner === "new" ? "New" : "Old"} regime wins at this salary
              </div>
            </div>

            <div className="mb-4 mt-auto">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="tax-slider"
                  className="font-mono text-[10px] uppercase tracking-wider text-ink-60"
                >
                  Annual salary
                </label>
                <span className="font-mono text-[13px] font-bold text-ink tabular-nums">
                  {fmtINR(taxSalary)}
                </span>
              </div>
              <input
                id="tax-slider"
                type="range"
                min={500000}
                max={5000000}
                step={50000}
                value={taxSalary}
                onChange={(e) => setTaxSalary(Number(e.target.value))}
                className="w-full accent-indian-gold cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-ink-60/60 mt-1">
                <span>₹5L</span>
                <span>₹50L</span>
              </div>
            </div>

            <Link
              href="/calculators/old-vs-new-tax"
              onClick={() =>
                trackEvent("homepage_calculator_cta_clicked", {
                  calculator: "tax",
                  source: "homepage_spotlight",
                })
              }
              className="font-mono text-[11px] uppercase tracking-wider text-action-green hover:text-authority-green"
            >
              Full calculator &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
