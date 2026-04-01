import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, RefreshCw, TrendingUp, BarChart3, ArrowRight, Info } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  fetchMFNav, FEATURED_SCHEMES,
  formatReturn, returnColor,
} from '@/lib/data/mf-nav';

// Dynamic: calls external API (mfapi.in) per request — don't pre-build at deploy time
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface Props { params: { schemeCode: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = parseInt(params.schemeCode, 10);
  const scheme = FEATURED_SCHEMES.find(s => s.schemeCode === code);
  const name = scheme?.schemeName ?? `Fund ${code}`;
  return {
    title: `${name} — NAV & Returns | InvestingPro`,
    description: `Today's NAV, 1Y/3Y/5Y returns, and performance data for ${name}. Updated daily from AMFI.`,
  };
}

const RETURN_PERIODS = ['1w', '1m', '3m', '6m', '1y', '3y', '5y'] as const;
const PERIOD_LABELS: Record<string, string> = {
  '1w': '1 Week', '1m': '1 Month', '3m': '3 Months',
  '6m': '6 Months', '1y': '1 Year', '3y': '3 Years (CAGR)', '5y': '5 Years (CAGR)',
};

export default async function MFNavFundPage({ params }: Props) {
  const code = parseInt(params.schemeCode, 10);
  if (isNaN(code)) notFound();

  const fund = await fetchMFNav(code);
  if (!fund) {
    // Fallback: show basic info from seed
    const seed = FEATURED_SCHEMES.find(s => s.schemeCode === code);
    if (!seed) notFound();
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-slate-500 mb-4">NAV data temporarily unavailable.</div>
          <Link href="/mutual-funds/nav" className="text-blue-600 hover:underline text-sm">← Back to all NAVs</Link>
        </div>
      </div>
    );
  }

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

  // Mini sparkline data (last 30 points)
  const sparkData = fund.history.slice(0, 30).reverse();
  const minNav = Math.min(...sparkData.map(d => d.nav));
  const maxNav = Math.max(...sparkData.map(d => d.nav));
  const navRange = maxNav - minNav || 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title={`${fund.schemeName} NAV Today — ${fund.nav.toFixed(4)} | InvestingPro`}
        description={`${fund.schemeName} NAV today: ₹${fund.nav.toFixed(4)}. 1Y return: ${formatReturn(fund.returns['1y'])}. 3Y CAGR: ${formatReturn(fund.returns['3y'])}. Updated daily from AMFI.`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FinancialProduct',
          name: fund.schemeName,
          category: fund.schemeCategory,
          offers: {
            '@type': 'Offer',
            price: fund.nav.toFixed(4),
            priceCurrency: 'INR',
            priceValidUntil: new Date().toISOString().split('T')[0],
          },
          provider: { '@type': 'Organization', name: fund.fundHouse },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pt-24 pb-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-blue-200 [&_a]:text-blue-300" />

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs bg-blue-400/20 border border-blue-400/30 text-blue-200 px-2 py-1 rounded-full font-semibold">
              {fund.schemeSubCategory || fund.schemeCategory}
            </span>
            <span className="text-xs bg-blue-400/20 border border-blue-400/30 text-blue-200 px-2 py-1 rounded-full">
              {fund.schemeType}
            </span>
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-200">
              <RefreshCw className="h-3 w-3" />
              NAV as of {fund.navDate}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-1 max-w-2xl">
            {fund.schemeName}
          </h1>
          <p className="text-blue-200 text-sm mb-7">{fund.fundHouse}</p>

          <div className="flex flex-wrap items-end gap-6">
            <div>
              <div className="text-xs text-blue-300 mb-1">Today's NAV</div>
              <div className="text-5xl font-bold text-white font-display tabular-nums">
                ₹{fund.nav.toFixed(4)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['1y', '3y', '5y'] as const).map(p => (
                <div key={p} className="bg-white/10 rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-blue-200 mb-1">{PERIOD_LABELS[p]}</div>
                  <div className={`text-lg font-bold tabular-nums ${returnColor(fund.returns[p]).replace('text-', 'text-').replace('600', '300').replace('400', '300')}`}>
                    {formatReturn(fund.returns[p])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-10">

        {/* Full returns table */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Returns — All Periods
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  {RETURN_PERIODS.map(p => (
                    <th key={p} className="py-3 px-4 text-center font-semibold text-slate-600 dark:text-slate-400">
                      {PERIOD_LABELS[p]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {RETURN_PERIODS.map(p => (
                    <td key={p} className={`py-4 px-4 text-center font-bold text-lg tabular-nums ${returnColor(fund.returns[p])}`}>
                      {formatReturn(fund.returns[p])}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-xs text-slate-400">
            3Y and 5Y returns are annualised CAGR. 1W/1M/3M/6M/1Y are absolute returns. Source: AMFI via mfapi.in
          </div>
        </section>

        {/* Sparkline NAV history */}
        {sparkData.length > 5 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 font-display mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              NAV History — Last 30 Days
            </h2>
            <svg viewBox="0 0 600 120" className="w-full h-28" preserveAspectRatio="none">
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const pts = sparkData.map((d, i) => {
                  const x = (i / (sparkData.length - 1)) * 600;
                  const y = 110 - ((d.nav - minNav) / navRange) * 100;
                  return `${x},${y}`;
                });
                const polyline = pts.join(' ');
                const area = `0,110 ${polyline} 600,110`;
                return (
                  <>
                    <polygon points={area} fill="url(#navGrad)" />
                    <polyline points={polyline} fill="none" stroke="#3b82f6" strokeWidth="2" />
                  </>
                );
              })()}
            </svg>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>{sparkData[0]?.date}</span>
              <span>₹{minNav.toFixed(2)} — ₹{maxNav.toFixed(2)}</span>
              <span>{sparkData[sparkData.length - 1]?.date}</span>
            </div>
          </section>
        )}

        {/* InvestingPro note */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Note:</strong> Past returns are not a guarantee of future performance. Direct plans have lower expense ratios than regular plans — always invest in Direct plans for better long-term outcomes. Returns shown are point-to-point and may differ from scheme-disclosed returns due to data timing.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link href="/mutual-funds/nav"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            All fund NAVs
          </Link>
          <Link href="/calculators/sip"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 hover:underline">
            Calculate SIP returns
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/mutual-funds"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:underline">
            Compare all funds
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
