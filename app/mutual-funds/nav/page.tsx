import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp, Search, ArrowRight, RefreshCw,
  ShieldCheck, BarChart3, Zap,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  FEATURED_SCHEMES, fetchMFNav, MF_CATEGORIES,
  formatReturn, returnColor, MFDetail,
} from '@/lib/data/mf-nav';

export const revalidate = 86400; // daily ISR

export const metadata: Metadata = {
  title: 'Mutual Fund NAV Today — All Schemes Live | InvestingPro',
  description:
    'Live mutual fund NAV for 16,000+ schemes. Daily updated from AMFI. See today\'s NAV, 1Y/3Y/5Y returns for top funds — large cap, mid cap, ELSS, index funds.',
};

export default async function MFNavHubPage() {
  // Fetch NAVs for featured schemes in parallel (limit to avoid rate limits)
  const navResults = await Promise.allSettled(
    FEATURED_SCHEMES.slice(0, 12).map(s => fetchMFNav(s.schemeCode))
  );

  const navData = navResults
    .map((r, i) => r.status === 'fulfilled' && r.value ? r.value : null)
    .filter(Boolean) as MFDetail[];

  // Deduplicate by schemeCode
  const seen = new Set<number>();
  const uniqueNav = navData.filter(d => {
    if (seen.has(d.schemeCode)) return false;
    seen.add(d.schemeCode);
    return true;
  });

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="Mutual Fund NAV Today — All Schemes | InvestingPro"
        description="Today's NAV for all 16,000+ mutual fund schemes in India. Updated daily from AMFI. 1Y, 3Y, 5Y returns for top funds."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Mutual Fund NAV Today',
          description: 'Live NAV for all mutual fund schemes — AMFI data',
          url: 'https://investingpro.in/mutual-funds/nav',
          dateModified: new Date().toISOString(),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-blue-200 [&_a]:text-blue-300" />

          <div className="inline-flex items-center gap-2 bg-blue-400/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <RefreshCw className="h-3.5 w-3.5" />
            Updated daily · AMFI official · 16,000+ schemes
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3">
            Mutual Fund NAV Today
          </h1>
          <p className="text-blue-100 text-lg mb-2">{todayStr}</p>
          <p className="text-blue-200 text-sm max-w-xl">
            Live NAV for all mutual fund schemes in India. Same data as Zerodha and Groww — sourced directly from AMFI.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-700">
            {[
              { value: '16,000+', label: 'Fund schemes' },
              { value: '44+', label: 'Fund houses' },
              { value: 'AMFI', label: 'Data source' },
              { value: 'Daily', label: 'NAV update' },
            ].map(s => (
              <div key={s.label} className="py-4 px-4 sm:px-8 text-center">
                <div className="text-xl font-bold text-blue-700 dark:text-blue-400 font-display">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Category quick-links */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {MF_CATEGORIES.map(cat => (
              <Link key={cat}
                href={`/mutual-funds/${cat.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 transition-all">
                {cat}
              </Link>
            ))}
            <Link href="/mutual-funds/elss"
              className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg text-sm font-semibold text-orange-700 dark:text-orange-400 hover:border-orange-400 transition-all">
              ELSS (Tax Saving 80C)
            </Link>
          </div>
        </section>

        {/* Live NAV table — top funds */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">Top Funds — Live NAV</h2>
              <p className="text-sm text-slate-500 mt-0.5">Direct Growth plans · AMFI source · Updated {todayStr}</p>
            </div>
          </div>

          {uniqueNav.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
                <thead className="bg-blue-50 dark:bg-blue-900/20">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Fund</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">NAV (₹)</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">1Y Return</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">3Y Return</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">5Y Return</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {uniqueNav.map(fund => (
                    <tr key={fund.schemeCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <Link href={`/mutual-funds/nav/${fund.schemeCode}`}
                          className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-400 line-clamp-2">
                          {fund.schemeName}
                        </Link>
                        <div className="text-xs text-slate-400 mt-0.5">{fund.fundHouse}</div>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                        ₹{fund.nav.toFixed(4)}
                      </td>
                      <td className={`py-3 px-4 text-right tabular-nums font-semibold ${returnColor(fund.returns['1y'])}`}>
                        {formatReturn(fund.returns['1y'])}
                      </td>
                      <td className={`py-3 px-4 text-right tabular-nums font-semibold ${returnColor(fund.returns['3y'])}`}>
                        {formatReturn(fund.returns['3y'])}
                      </td>
                      <td className={`py-3 px-4 text-right tabular-nums font-semibold ${returnColor(fund.returns['5y'])}`}>
                        {formatReturn(fund.returns['5y'])}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                          {fund.schemeSubCategory || fund.schemeCategory}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Fallback: show featured scheme links without live NAV
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURED_SCHEMES.slice(0, 12).map(s => (
                <Link key={s.schemeCode} href={`/mutual-funds/nav/${s.schemeCode}`}
                  className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-md transition-all">
                  <div>
                    <div className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-2">{s.schemeName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.fundHouse} · {s.schemeSubCategory}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* SIP Calculator CTA */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white font-display mb-2">Calculate SIP Returns</h2>
              <p className="text-blue-200 text-sm">See how ₹5,000/month SIP grows over 10, 15, 20 years at different return assumptions.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/calculators/sip"
                className="px-5 py-2.5 bg-white text-blue-900 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-colors">
                SIP Calculator
              </Link>
              <Link href="/mutual-funds/best-sip"
                className="px-5 py-2.5 bg-blue-700 text-white font-semibold text-sm rounded-xl hover:bg-blue-600 transition-colors border border-blue-600">
                Best SIP Funds
              </Link>
            </div>
          </div>
        </section>

        {/* What is NAV */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">What is NAV in Mutual Funds?</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <div>
              <p className="mb-3">
                <strong className="text-slate-900 dark:text-slate-100">NAV (Net Asset Value)</strong> is the per-unit price of a mutual fund scheme. It represents the market value of all securities held by the fund, divided by the total number of units outstanding.
              </p>
              <p>
                <strong>Formula:</strong> NAV = (Total Assets − Liabilities) ÷ Number of Units
              </p>
            </div>
            <div>
              <p className="mb-3">
                AMFI mandates all fund houses to publish NAV by 11 PM every business day. Direct plans always have a higher NAV than regular plans because they don't include distributor commission.
              </p>
              <p>
                <strong>Higher NAV ≠ expensive fund.</strong> A fund with NAV ₹500 isn't more expensive than NAV ₹20 — what matters is the percentage return, not the absolute price.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
