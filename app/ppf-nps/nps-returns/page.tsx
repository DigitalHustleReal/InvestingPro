import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp, ShieldCheck, ArrowRight, Info,
  CheckCircle2, BarChart3, IndianRupee,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

export const revalidate = 604800; // weekly

export const metadata: Metadata = {
  title: 'NPS Returns 2025 — Fund Manager Comparison | InvestingPro',
  description:
    'NPS returns comparison across fund managers — Tier I Equity (E), Corporate Bond (C), Govt (G). SBI, LIC, HDFC, ICICI, Kotak, UTI, Aditya Birla NPS returns.',
};

/** PFRDA published returns — Tier I, Equity (E) scheme */
const NPS_RETURNS = [
  {
    fundManager: 'SBI Pension Funds',
    scheme: 'Tier I – E',
    returns: { '1y': 12.48, '3y': 14.21, '5y': 13.87, 'since': 11.92 },
    aum: 87420,
    rating: 4,
  },
  {
    fundManager: 'LIC Pension Fund',
    scheme: 'Tier I – E',
    returns: { '1y': 11.92, '3y': 13.65, '5y': 13.21, 'since': 11.44 },
    aum: 12850,
    rating: 3,
  },
  {
    fundManager: 'UTI Retirement Solutions',
    scheme: 'Tier I – E',
    returns: { '1y': 13.14, '3y': 14.89, '5y': 14.52, 'since': 12.38 },
    aum: 54320,
    rating: 5,
  },
  {
    fundManager: 'HDFC Pension Mgmt',
    scheme: 'Tier I – E',
    returns: { '1y': 12.87, '3y': 14.55, '5y': 14.18, 'since': 12.11 },
    aum: 62180,
    rating: 5,
  },
  {
    fundManager: 'ICICI Pru Pension Fund',
    scheme: 'Tier I – E',
    returns: { '1y': 12.64, '3y': 14.32, '5y': 14.05, 'since': 11.98 },
    aum: 48920,
    rating: 4,
  },
  {
    fundManager: 'Kotak Pension Fund',
    scheme: 'Tier I – E',
    returns: { '1y': 12.21, '3y': 13.98, '5y': 13.64, 'since': 11.72 },
    aum: 28640,
    rating: 4,
  },
  {
    fundManager: 'Aditya Birla Sun Life',
    scheme: 'Tier I – E',
    returns: { '1y': 11.84, '3y': 13.52, '5y': 13.18, 'since': 11.36 },
    aum: 19540,
    rating: 3,
  },
  {
    fundManager: 'Max Life Pension Fund',
    scheme: 'Tier I – E',
    returns: { '1y': 13.42, '3y': 15.12, '5y': 14.78, 'since': null },
    aum: 8920,
    rating: 5,
  },
];

/** Scheme-wise returns (E, C, G) — SBI as reference */
const SCHEME_COMPARISON = [
  {
    scheme: 'Equity (E)', risk: 'High', allocation: 'Up to 75% equity (auto)',
    return1y: 12.48, return5y: 13.87, return10y: 11.92,
    suitable: 'Age < 50, higher risk tolerance',
    color: 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800',
  },
  {
    scheme: 'Corporate Bond (C)', risk: 'Medium', allocation: '100% corporate bonds',
    return1y: 8.24, return5y: 8.91, return10y: 9.12,
    suitable: 'Age 50–55, balanced approach',
    color: 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800',
  },
  {
    scheme: 'Govt Securities (G)', risk: 'Low', allocation: '100% government bonds',
    return1y: 7.84, return5y: 8.42, return10y: 8.78,
    suitable: 'Age 55+, capital protection',
    color: 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800',
  },
  {
    scheme: 'Alternative Assets (A)', risk: 'Very High', allocation: 'REITs, InvITs, AIFs',
    return1y: 14.21, return5y: null, return10y: null,
    suitable: 'Age < 45, very high risk tolerance. Max 5%',
    color: 'border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800',
  },
];

export default function NPSReturnsPage() {
  const bestFundManager = NPS_RETURNS.reduce((a, b) =>
    b.returns['5y'] > a.returns['5y'] ? b : a);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="NPS Returns 2025 — Best Fund Manager Comparison | InvestingPro"
        description="NPS returns for all fund managers 2025. Tier I Equity scheme: UTI leads with 14.89% 3Y CAGR. Compare SBI, LIC, HDFC, ICICI, Kotak NPS performance."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'NPS Returns Comparison 2025',
          url: 'https://investingpro.in/ppf-nps/nps-returns',
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-indigo-200 [&_a]:text-indigo-300" />
          <div className="inline-flex items-center gap-2 bg-indigo-400/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Source: PFRDA · NPS Trust · All fund managers
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3">
            NPS Returns 2025
          </h1>
          <p className="text-indigo-100 text-lg max-w-xl">
            Compare NPS fund manager performance — Tier I Equity scheme. Find who's delivering the best CAGR for your retirement corpus.
          </p>

          {/* Top performer highlight */}
          <div className="mt-7 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 max-w-sm">
            <div className="text-xs text-indigo-200 font-semibold mb-1">Best 5Y CAGR (Tier I – E)</div>
            <div className="text-xl font-bold text-white">{bestFundManager.fundManager}</div>
            <div className="text-4xl font-bold text-amber-300 font-display mt-1">{bestFundManager.returns['5y']}%</div>
            <div className="text-xs text-indigo-200 mt-1">5-year CAGR</div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Fund manager comparison table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Fund Manager Returns — Tier I Equity (E) Scheme
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-indigo-50 dark:bg-indigo-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Fund Manager</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">1Y Return</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">3Y CAGR</th>
                  <th className="text-right py-3 px-4 font-semibold text-indigo-700">5Y CAGR</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Since inception</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">AUM (₹Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...NPS_RETURNS].sort((a, b) => b.returns['5y'] - a.returns['5y']).map((fm, i) => (
                  <tr key={fm.fundManager} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${i === 0 ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {i === 0 && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Top</span>}
                        {fm.fundManager}
                      </div>
                      <div className="text-xs text-slate-400">{fm.scheme}</div>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-medium text-green-700 dark:text-green-400">{fm.returns['1y']}%</td>
                    <td className="py-3 px-4 text-right tabular-nums font-medium text-green-700 dark:text-green-400">{fm.returns['3y']}%</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-lg text-indigo-700 dark:text-indigo-400">{fm.returns['5y']}%</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {fm.returns.since ? `${fm.returns.since}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {(fm.aum / 100).toFixed(0)}Cr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Returns as of Dec 2025. Source: PFRDA / NPS Trust. Past returns do not guarantee future performance.</p>
        </section>

        {/* Scheme types comparison */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
            NPS Scheme Types — E, C, G, A Compared
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SCHEME_COMPARISON.map(s => (
              <div key={s.scheme} className={`rounded-xl border p-5 ${s.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{s.scheme}</div>
                    <div className="text-xs text-slate-500">{s.allocation}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    s.risk === 'High' ? 'bg-red-100 text-red-700' :
                    s.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    s.risk === 'Very High' ? 'bg-red-200 text-red-800' :
                    'bg-green-100 text-green-700'}`}>
                    {s.risk}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: '1Y', value: s.return1y },
                    { label: '5Y CAGR', value: s.return5y },
                    { label: '10Y CAGR', value: s.return10y },
                  ].map(r => (
                    <div key={r.label} className="text-center">
                      <div className={`text-lg font-bold font-display ${r.value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                        {r.value ? `${r.value}%` : '—'}
                      </div>
                      <div className="text-xs text-slate-500">{r.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>Best for:</strong> {s.suitable}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NPS vs PPF vs ELSS */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
            NPS vs PPF vs ELSS — Head to Head
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Factor</th>
                  <th className="text-center py-2 px-4 font-semibold text-indigo-700">NPS</th>
                  <th className="text-center py-2 px-4 font-semibold text-green-700">PPF</th>
                  <th className="text-center py-2 px-4 font-semibold text-blue-700">ELSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  ['Expected return', '10–14% (equity)', '7.1% (fixed)', '12–16% (market)'],
                  ['Lock-in', 'Till 60 years', '15 years', '3 years'],
                  ['80C deduction', 'Yes (up to ₹1.5L)', 'Yes', 'Yes'],
                  ['Extra 80CCD(1B)', '₹50,000 extra', 'No', 'No'],
                  ['Tax on maturity', '60% tax-free, 40% annuity taxable', '100% tax-free', 'LTCG >₹1.25L at 12.5%'],
                  ['Liquidity', 'Low — partial withdrawal rules', 'Partial after 7yr', 'High after 3yr'],
                  ['Market risk', 'Yes (E scheme)', 'No', 'Yes'],
                  ['Best use', 'Retirement + extra ₹50K deduction', 'Tax-free long-term corpus', 'Tax saving + wealth creation'],
                ].map(([factor, nps, ppf, elss]) => (
                  <tr key={factor}>
                    <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-300">{factor}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400 text-xs">{nps}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400 text-xs">{ppf}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400 text-xs">{elss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 80CCD1B callout */}
        <div className="flex items-start gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-900 dark:text-indigo-200">
            <strong>The 80CCD(1B) advantage:</strong> NPS gives you an ADDITIONAL ₹50,000 deduction over and above the ₹1.5L 80C limit. At 30% tax bracket, this saves ₹15,000/year in tax. Over 20 years, that's ₹3L+ in tax savings alone — before accounting for investment returns.
          </div>
        </div>

        {/* Related */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/calculators/nps', title: 'NPS Calculator', desc: 'Calculate your retirement corpus at 60' },
            { href: '/ppf-nps/small-savings-comparison', title: 'Small Savings Comparison', desc: 'PPF, SSY, SCSS, NSC side-by-side' },
            { href: '/taxes/old-vs-new-regime', title: 'Old vs New Regime', desc: 'Does 80CCD(1B) benefit you in old regime?' },
          ].map(t => (
            <Link key={t.href} href={t.href}
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{t.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
