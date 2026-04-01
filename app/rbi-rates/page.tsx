import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingDown, TrendingUp, Minus, ShieldCheck, Calendar,
  ArrowRight, BarChart3, Globe, Banknote, AlertCircle,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  POLICY_RATES, INFLATION_DATA, FOREX_RATES,
  WALR_DATA, MPC_SCHEDULE_2026, GDP_DATA,
} from '@/lib/data/rbi-rates';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'RBI Repo Rate, CPI Inflation & Forex Rates Today | InvestingPro',
  description:
    'Live RBI repo rate, reverse repo, CRR, SLR, CPI inflation, and forex reference rates. Source: RBI DBIE portal. Updated on every MPC meeting.',
};

const TrendIcon = ({ trend, change }: { trend: string; change?: number }) => {
  if (trend === 'down') return (
    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-semibold">
      <TrendingDown className="h-3.5 w-3.5" />
      {change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : 'Cut'}
    </span>
  );
  if (trend === 'up') return (
    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-semibold">
      <TrendingUp className="h-3.5 w-3.5" />
      {change !== undefined ? `+${change}%` : 'Hike'}
    </span>
  );
  return <span className="inline-flex items-center gap-1 text-slate-500 text-xs"><Minus className="h-3 w-3" /> Unchanged</span>;
};

export default function RBIRatesPage() {
  const latestCPI = INFLATION_DATA[0];
  const repoRate = POLICY_RATES.find(r => r.name === 'Repo Rate')!;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="RBI Repo Rate Today, CPI Inflation & Forex | InvestingPro"
        description="Current RBI repo rate (6.25%), reverse repo, CRR, SLR, CPI inflation (4.26%), and USD/INR forex rates. All from RBI DBIE. Explained simply."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'RBI Rates Dashboard',
          description: 'RBI policy rates, inflation, and forex — official DBIE data',
          url: 'https://investingpro.in/rbi-rates',
          dateModified: new Date().toISOString(),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-16 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-green-200 [&_a]:text-green-300" />

          <div className="inline-flex items-center gap-2 bg-green-400/20 border border-green-400/30 text-green-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Source: RBI DBIE Portal · MoSPI · Updated Mar 2026
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3">
            RBI Rates Dashboard
          </h1>
          <p className="text-green-100 text-lg mb-8 max-w-xl">
            Official repo rate, inflation, forex — all from RBI's database. The authoritative source for Indian monetary policy data.
          </p>

          {/* Top 3 key rates */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl">
            {[
              { label: 'Repo Rate', value: `${repoRate.value}%`, sub: 'Feb 2026 · -25bps', color: 'bg-green-400/20' },
              { label: 'CPI Inflation', value: `${latestCPI.cpi}%`, sub: latestCPI.period, color: 'bg-blue-400/20' },
              { label: 'USD/INR', value: `₹${FOREX_RATES[0].rate}`, sub: 'RBI Ref Rate', color: 'bg-amber-400/20' },
            ].map(item => (
              <div key={item.label} className={`${item.color} backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center`}>
                <div className="text-xs font-semibold text-green-200 mb-1">{item.label}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-display">{item.value}</div>
                <div className="text-xs text-green-300 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-14">

        {/* Impact on you callout */}
        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
          <AlertCircle className="h-5 w-5 text-green-700 shrink-0 mt-0.5" />
          <div className="text-sm text-green-900 dark:text-green-200">
            <strong>What the Feb 2026 repo cut means for you:</strong> RBI cut rates by 25bps to 6.25% — the first cut since May 2020. Home loan borrowers on floating rates should see EMIs fall ₹200–₹600/month on a ₹50L loan. FD rates will likely fall 20–40bps over the next quarter. Lock FDs now before banks revise rates down.
          </div>
        </div>

        {/* Policy rates grid */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <Banknote className="h-6 w-6 text-green-700" />
            RBI Policy Rates — Feb 2026
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POLICY_RATES.map(rate => (
              <div key={rate.name} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{rate.name}</div>
                  <TrendIcon trend={rate.trend} change={rate.change} />
                </div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-400 font-display tabular-nums mb-2">
                  {rate.value}{rate.unit}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{rate.description}</p>
                <div className="mt-3 text-xs text-slate-400">Updated: {new Date(rate.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WALR/WALDR */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-700" />
            Weighted Average Lending & Deposit Rates
            <span className="text-sm font-normal text-slate-500">({WALR_DATA.asOfMonth})</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="text-center p-5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">WALR (Fresh Loans)</div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 font-display">{WALR_DATA.walr}%</div>
              <div className="text-sm text-slate-500 mt-1">Avg rate banks charge on new loans</div>
            </div>
            <div className="text-center p-5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">WALDR (Term Deposits)</div>
              <div className="text-4xl font-bold text-green-700 dark:text-green-400 font-display">{WALR_DATA.waldr}%</div>
              <div className="text-sm text-slate-500 mt-1">Avg rate banks pay on fixed deposits</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 text-center">Source: RBI DBIE · {WALR_DATA.asOfMonth}</p>
        </section>

        {/* Inflation */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            CPI Inflation — Monthly Trend
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-blue-50 dark:bg-blue-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Period</th>
                  <th className="text-right py-3 px-4 font-semibold text-blue-700">CPI Headline</th>
                  <th className="text-right py-3 px-4 font-semibold text-orange-700">Food Inflation</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Core Inflation</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">vs RBI Target (4%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {INFLATION_DATA.map((row, i) => (
                  <tr key={row.period} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${i === 0 ? 'font-semibold' : ''}`}>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {row.period}
                      {i === 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Latest</span>}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums">
                      <span className={row.cpi > 6 ? 'text-red-600' : row.cpi > 4 ? 'text-amber-600' : 'text-green-700'}>{row.cpi}%</span>
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-orange-600">{row.foodInflation}%</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">{row.coreInflation}%</td>
                    <td className="py-2.5 px-4">
                      {row.cpi <= 4
                        ? <span className="text-xs text-green-600 font-medium">Within target ✓</span>
                        : row.cpi <= 6
                          ? <span className="text-xs text-amber-600 font-medium">Tolerance band</span>
                          : <span className="text-xs text-red-600 font-medium">Above band</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Source: MoSPI. RBI target: 4% ± 2% (tolerance band 2%–6%)</p>
        </section>

        {/* Forex */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-indigo-600" />
            RBI Reference Exchange Rates
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FOREX_RATES.map(fx => (
              <div key={fx.code} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{fx.code}</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-display tabular-nums">₹{fx.rate}</div>
                <div className="text-sm text-slate-500 mt-1">{fx.currency}</div>
                <div className="text-xs text-slate-400 mt-2">per 1 {fx.code}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Source: RBI reference rate published daily at 12:30 PM IST. Not for commercial transactions.</p>
        </section>

        {/* MPC schedule */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-700" />
            MPC Meeting Schedule 2026
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MPC_SCHEDULE_2026.map(meeting => (
              <div key={meeting.dates}
                className={`rounded-xl border p-4 ${meeting.status === 'done'
                  ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
                <div className={`text-sm font-semibold mb-1 ${meeting.status === 'done' ? 'text-slate-600 dark:text-slate-400' : 'text-green-800 dark:text-green-300'}`}>
                  {meeting.dates}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">{meeting.decision}</div>
                {meeting.status === 'done'
                  ? <span className="mt-2 inline-block text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">Completed</span>
                  : <span className="mt-2 inline-block text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">Upcoming</span>}
              </div>
            ))}
          </div>
        </section>

        {/* GDP */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-4">
            GDP Growth Projections
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            {[
              { label: 'FY 2025-26 Estimate', value: `${GDP_DATA.fy2526Estimate}%`, color: 'text-green-700' },
              { label: 'FY 2024-25 Actual', value: `${GDP_DATA.fy2425Actual}%`, color: 'text-blue-700' },
              { label: 'FY 2023-24 Actual', value: `${GDP_DATA.fy2324Actual}%`, color: 'text-slate-700' },
            ].map(item => (
              <div key={item.label}>
                <div className={`text-3xl font-bold font-display ${item.color}`}>{item.value}</div>
                <div className="text-xs text-slate-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center">Source: {GDP_DATA.source}</p>
        </section>

        {/* Related tools */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/fixed-deposits', icon: BarChart3, title: 'Best FD Rates', desc: 'FD rates after repo cut — banks revising down', color: 'bg-green-50 dark:bg-green-900/30', iconColor: 'text-green-700' },
            { href: '/loans/home-loan', icon: Banknote, title: 'Home Loan Rates', desc: 'Compare floating rate home loans post-cut', color: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-700' },
            { href: '/calculators/emi', icon: TrendingDown, title: 'EMI Calculator', desc: 'See how much your EMI drops after rate cut', color: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-700' },
          ].map(tool => (
            <Link key={tool.href} href={tool.href}
              className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all">
              <div className={`p-3 ${tool.color} rounded-xl`}>
                <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{tool.title}</div>
                <div className="text-xs text-slate-500">{tool.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
