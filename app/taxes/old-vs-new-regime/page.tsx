"use client";

import React, { useState, useMemo } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calculator, TrendingDown, CheckCircle2, XCircle,
  ArrowRight, IndianRupee, Info, ShieldCheck, BarChart3,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  computeTax, computeBreakeven, TAX_DEDUCTIONS_GUIDE, DeductionInputs,
} from '@/lib/data/income-tax';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

const fmtPct = (n: number) => n.toFixed(2) + '%';

const INCOME_PRESETS = [
  { label: '₹6L', value: 600000 },
  { label: '₹8L', value: 800000 },
  { label: '₹10L', value: 1000000 },
  { label: '₹12L', value: 1200000 },
  { label: '₹15L', value: 1500000 },
  { label: '₹20L', value: 2000000 },
  { label: '₹30L', value: 3000000 },
  { label: '₹50L', value: 5000000 },
];

export default function OldVsNewRegimePage() {
  const [income, setIncome] = useState(1200000);
  const [ded, setDed] = useState<DeductionInputs>({
    section80C: 150000,
    section80D: 25000,
    hra: 0,
    homeLoanInterest: 0,
    nps80CCD1B: 50000,
    other80: 0,
  });

  const oldResult = useMemo(() => computeTax(income, ded, 'old'), [income, ded]);
  const newResult = useMemo(() => computeTax(income, ded, 'new'), [income, ded]);
  const breakeven = useMemo(() => computeBreakeven(income), [income]);

  const totalDed =
    Math.min(ded.section80C, 150000) +
    Math.min(ded.section80D, 50000) +
    ded.hra +
    Math.min(ded.homeLoanInterest, 200000) +
    Math.min(ded.nps80CCD1B, 50000) +
    ded.other80;

  const oldWins = oldResult.totalTax < newResult.totalTax;
  const saving = Math.abs(oldResult.totalTax - newResult.totalTax);
  const winner = oldWins ? 'old' : 'new';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="Old vs New Tax Regime 2025-26 — Which Saves More? | InvestingPro"
        description="Interactive old vs new tax regime calculator for FY 2025-26. Enter your income and deductions — see instantly which regime saves more. Includes 80C, HRA, home loan."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Old vs New Tax Regime Calculator',
          description: 'Compare old and new tax regime for FY 2025-26',
          url: 'https://investingpro.in/taxes/old-vs-new-regime',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-orange-800 to-amber-800 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-orange-200 [&_a]:text-orange-300" />
          <div className="inline-flex items-center gap-2 bg-orange-400/20 border border-orange-400/30 text-orange-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            FY 2025-26 · Finance Bill 2025 · New slabs included
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3">
            Old vs New Tax Regime
          </h1>
          <p className="text-orange-100 text-lg max-w-xl">
            Enter your income and deductions — see instantly which regime saves more for FY 2025-26.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-10 max-w-5xl">

        {/* Income selector */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Annual Gross Income (CTC / salary before tax)
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {INCOME_PRESETS.map(p => (
              <button key={p.value} onClick={() => setIncome(p.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${income === p.value
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-400'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Custom:</span>
            <div className="relative flex-1 max-w-xs">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                value={income}
                onChange={e => setIncome(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">= ₹{fmt(income)}</span>
          </div>
        </div>

        {/* Deductions (old regime) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Your Deductions (Old Regime only)
          </h2>
          <p className="text-xs text-slate-500 mb-5">These only reduce tax in the old regime. New regime ignores them (except standard deduction).</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'section80C', label: 'Section 80C', sublabel: 'EPF, PPF, ELSS, LIC, NSC', max: 150000 },
              { key: 'section80D', label: 'Section 80D', sublabel: 'Health insurance premium', max: 75000 },
              { key: 'hra', label: 'HRA Exemption', sublabel: 'If you pay rent', max: undefined },
              { key: 'homeLoanInterest', label: 'Home Loan Interest', sublabel: 'Section 24(b)', max: 200000 },
              { key: 'nps80CCD1B', label: 'NPS Extra (80CCD1B)', sublabel: 'Over and above 80C', max: 50000 },
              { key: 'other80', label: 'Other Deductions', sublabel: '80E, 80G, 80TTA etc.', max: undefined },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {field.label}
                  {field.max && <span className="ml-1 text-slate-400">(max ₹{fmt(field.max)})</span>}
                </label>
                <p className="text-xs text-slate-400 mb-1">{field.sublabel}</p>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="number"
                    value={ded[field.key as keyof DeductionInputs]}
                    onChange={e => setDed(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Total deductions: </span>
            <span className="font-bold text-orange-700 dark:text-orange-400">₹{fmt(totalDed)}</span>
          </div>
        </div>

        {/* Results comparison */}
        <div>
          {/* Winner banner */}
          <div className={`rounded-2xl p-5 mb-6 text-center ${winner === 'new'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}`}>
            <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${winner === 'new' ? 'text-green-600' : 'text-blue-600'}`}>
              Based on your numbers
            </div>
            <div className={`text-2xl font-bold font-display mb-1 ${winner === 'new' ? 'text-green-800 dark:text-green-300' : 'text-blue-800 dark:text-blue-300'}`}>
              {winner === 'new' ? 'New Regime' : 'Old Regime'} saves you more
            </div>
            <div className={`text-sm ${winner === 'new' ? 'text-green-700 dark:text-green-400' : 'text-blue-700 dark:text-blue-400'}`}>
              You save <strong>₹{fmt(saving)}/year</strong> {saving > 0 ? `by choosing the ${winner === 'new' ? 'new' : 'old'} regime` : '— both regimes are equal'}
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { result: oldResult, label: 'Old Regime', color: oldWins ? 'border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-slate-200 dark:border-slate-800', headerBg: 'bg-blue-50 dark:bg-blue-900/20', headerText: 'text-blue-800 dark:text-blue-300' },
              { result: newResult, label: 'New Regime', color: !oldWins ? 'border-green-400 ring-2 ring-green-200 dark:ring-green-800' : 'border-slate-200 dark:border-slate-800', headerBg: 'bg-green-50 dark:bg-green-900/20', headerText: 'text-green-800 dark:text-green-300' },
            ].map(({ result, label, color, headerBg, headerText }) => (
              <div key={label} className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden ${color}`}>
                <div className={`${headerBg} px-5 py-4 flex items-center justify-between`}>
                  <div>
                    <div className={`font-bold text-lg font-display ${headerText}`}>{label}</div>
                    <div className={`text-xs ${headerText} opacity-80`}>FY 2025-26</div>
                  </div>
                  {(label === 'Old Regime' ? oldWins : !oldWins) && (
                    <span className="text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
                      ✓ Best for you
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: 'Gross Income', value: `₹${fmt(income)}` },
                    { label: 'Standard Deduction', value: `−₹${fmt(label === 'Old Regime' ? 50000 : 75000)}` },
                    { label: 'Other Deductions', value: label === 'New Regime' ? 'Not applicable' : `−₹${fmt(totalDed)}` },
                    { label: 'Taxable Income', value: `₹${fmt(result.taxableIncome)}`, bold: true },
                    { label: 'Basic Tax', value: `₹${fmt(result.basicTax)}` },
                    { label: 'Surcharge', value: result.surcharge > 0 ? `₹${fmt(result.surcharge)}` : '—' },
                    { label: 'Cess (4%)', value: `₹${fmt(result.cess)}` },
                    { label: 'Total Tax', value: `₹${fmt(result.totalTax)}`, bold: true, highlight: true },
                    { label: 'Effective Rate', value: fmtPct(result.effectiveRate) },
                    { label: 'Take-home', value: `₹${fmt(result.takeHome)}`, bold: true },
                  ].map(row => (
                    <div key={row.label} className={`flex justify-between text-sm ${row.highlight ? 'pt-2 border-t border-slate-200 dark:border-slate-700' : ''}`}>
                      <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                      <span className={`tabular-nums ${row.bold ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'} ${row.highlight ? 'text-red-600 dark:text-red-400' : ''}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakeven insight */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Breakeven deduction for ₹{fmt(income)} income</div>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                At your income level, you need at least <strong>₹{fmt(breakeven)}</strong> in total deductions for the old regime to beat the new regime. You currently have <strong>₹{fmt(totalDed)}</strong> in deductions — {totalDed >= breakeven ? '✓ old regime wins' : 'below breakeven, new regime wins'}.
              </p>
            </div>
          </div>
        </div>

        {/* Deductions guide */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
            All Available Deductions — Old Regime
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-orange-50 dark:bg-orange-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Section</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Max Limit</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">What qualifies</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">New Regime?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {TAX_DEDUCTIONS_GUIDE.map(row => (
                  <tr key={row.section} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 font-mono font-semibold text-orange-700 dark:text-orange-400">{row.section}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {row.limit ? `₹${fmt(row.limit)}` : 'No limit'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{row.what}</td>
                    <td className="py-2.5 px-4 text-center">
                      {row.regimes === 'both'
                        ? <span className="text-green-600 font-semibold text-xs">✓ Yes</span>
                        : <span className="text-red-500 font-semibold text-xs">✗ No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick guide */}
        <section className="grid sm:grid-cols-2 gap-6">
          {[
            {
              title: 'Choose New Regime if…',
              color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
              titleColor: 'text-green-800 dark:text-green-300',
              icon: CheckCircle2,
              iconColor: 'text-green-600',
              points: [
                'Your total 80C+80D+HRA deductions < ₹2–3L',
                'You don\'t have a home loan or HRA',
                'Your income is ≤ ₹12L (zero tax via 87A rebate)',
                'You want simplicity — no investment-linked tax saving',
                'You prefer flexibility in investment choices',
              ],
            },
            {
              title: 'Choose Old Regime if…',
              color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
              titleColor: 'text-blue-800 dark:text-blue-300',
              icon: CheckCircle2,
              iconColor: 'text-blue-600',
              points: [
                'You have a home loan with ₹2L+ annual interest',
                'You pay high rent and claim HRA exemption',
                'You max out 80C + 80D + NPS (₹2.5L+ deductions)',
                'Your income is ₹15L+ with substantial deductions',
                'You have parents aged 60+ (₹50K 80D for parents)',
              ],
            },
          ].map(block => (
            <div key={block.title} className={`rounded-xl border p-5 ${block.color}`}>
              <div className={`font-bold text-base mb-4 ${block.titleColor}`}>{block.title}</div>
              <ul className="space-y-2">
                {block.points.map(pt => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <block.icon className={`h-4 w-4 shrink-0 mt-0.5 ${block.iconColor}`} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Related */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/calculators/tax', title: 'Full Tax Calculator', desc: 'Detailed tax computation with all slabs' },
            { href: '/ppf-nps/small-savings-comparison', title: '80C Investments Compared', desc: 'PPF vs ELSS vs NSC vs FD — best returns' },
            { href: '/ppf-nps/nps-returns', title: 'NPS Returns', desc: 'Save extra ₹50K with 80CCD(1B)' },
          ].map(tool => (
            <Link key={tool.href} href={tool.href}
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{tool.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{tool.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
