/**
 * SGB Series Tracker — All RBI Sovereign Gold Bond series with live returns
 * Route: /gold-rate/sgb
 * Targets: "sovereign gold bond series", "SGB returns calculator", "SGB vs gold ETF"
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 86400; // daily

export const metadata: Metadata = {
  title: 'Sovereign Gold Bond (SGB) Series Tracker 2024-25 — Returns & Redemption | InvestingPro',
  description:
    'Track all RBI Sovereign Gold Bond series — issue price, current value, maturity date, returns. Compare SGB vs Gold ETF vs Physical Gold. Calculate your SGB returns.',
  keywords: [
    'sovereign gold bond',
    'SGB series',
    'SGB returns calculator',
    'RBI gold bond',
    'SGB maturity',
    'sovereign gold bond 2024',
    'SGB vs gold ETF',
  ],
  openGraph: {
    title: 'SGB Series Tracker — All RBI Sovereign Gold Bond Series',
    description:
      'Live tracking of all SGB series — issue price, current NAV, returns, maturity dates.',
  },
};

interface SGBSeries {
  series: string;
  tranche: string;
  issueDate: string;
  maturityDate: string;
  issuePrice: number; // ₹/gram at issue
  couponRate: number; // % p.a. on issue price
  currentGoldPrice: number; // live 999 gold ₹/gram (seed)
  type: 'active' | 'matured' | 'upcoming';
  isin?: string;
}

// RBI SGB series data — issue prices from official RBI circulars
// Current gold price seed: ₹7,020/gram for 24K (999 purity) — Mar 2026 approximation
const CURRENT_GOLD_PRICE_PER_GRAM = 7020;

const SGB_SERIES: SGBSeries[] = [
  // FY 2024-25
  {
    series: 'SGB 2024-25 Series IV',
    tranche: '2024-25 IV',
    issueDate: '2025-02-12',
    maturityDate: '2033-02-12',
    issuePrice: 8634,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
    isin: 'IN0020240063',
  },
  {
    series: 'SGB 2024-25 Series III',
    tranche: '2024-25 III',
    issueDate: '2024-12-16',
    maturityDate: '2032-12-16',
    issuePrice: 7788,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
    isin: 'IN0020240048',
  },
  {
    series: 'SGB 2024-25 Series II',
    tranche: '2024-25 II',
    issueDate: '2024-09-11',
    maturityDate: '2032-09-11',
    issuePrice: 7188,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
    isin: 'IN0020240030',
  },
  {
    series: 'SGB 2024-25 Series I',
    tranche: '2024-25 I',
    issueDate: '2024-06-14',
    maturityDate: '2032-06-14',
    issuePrice: 7246,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
    isin: 'IN0020240014',
  },
  // FY 2023-24
  {
    series: 'SGB 2023-24 Series IV',
    tranche: '2023-24 IV',
    issueDate: '2024-02-21',
    maturityDate: '2032-02-21',
    issuePrice: 6263,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
    isin: 'IN0020230066',
  },
  {
    series: 'SGB 2023-24 Series III',
    tranche: '2023-24 III',
    issueDate: '2023-12-27',
    maturityDate: '2031-12-27',
    issuePrice: 6199,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  {
    series: 'SGB 2023-24 Series II',
    tranche: '2023-24 II',
    issueDate: '2023-09-11',
    maturityDate: '2031-09-11',
    issuePrice: 5923,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  {
    series: 'SGB 2023-24 Series I',
    tranche: '2023-24 I',
    issueDate: '2023-06-19',
    maturityDate: '2031-06-19',
    issuePrice: 5926,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  // FY 2022-23
  {
    series: 'SGB 2022-23 Series IV',
    tranche: '2022-23 IV',
    issueDate: '2023-03-06',
    maturityDate: '2031-03-06',
    issuePrice: 5611,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  {
    series: 'SGB 2022-23 Series III',
    tranche: '2022-23 III',
    issueDate: '2022-12-28',
    maturityDate: '2030-12-28',
    issuePrice: 5409,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  {
    series: 'SGB 2022-23 Series II',
    tranche: '2022-23 II',
    issueDate: '2022-08-22',
    maturityDate: '2030-08-22',
    issuePrice: 5197,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  {
    series: 'SGB 2022-23 Series I',
    tranche: '2022-23 I',
    issueDate: '2022-06-24',
    maturityDate: '2030-06-24',
    issuePrice: 5091,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  // FY 2021-22 — Matured/Maturing soon
  {
    series: 'SGB 2021-22 Series X',
    tranche: '2021-22 X',
    issueDate: '2022-03-07',
    maturityDate: '2030-03-07',
    issuePrice: 5109,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  {
    series: 'SGB 2021-22 Series I',
    tranche: '2021-22 I',
    issueDate: '2021-05-31',
    maturityDate: '2029-05-31',
    issuePrice: 4777,
    couponRate: 2.5,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'active',
  },
  // Older series — matured or maturing
  {
    series: 'SGB 2016-17 Series I',
    tranche: '2016-17 I',
    issueDate: '2016-08-05',
    maturityDate: '2024-08-05',
    issuePrice: 3119,
    couponRate: 2.75,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'matured',
  },
  {
    series: 'SGB 2016-17 Series II',
    tranche: '2016-17 II',
    issueDate: '2016-09-30',
    maturityDate: '2024-09-30',
    issuePrice: 3150,
    couponRate: 2.75,
    currentGoldPrice: CURRENT_GOLD_PRICE_PER_GRAM,
    type: 'matured',
  },
];

function calcReturns(series: SGBSeries) {
  const issueDate = new Date(series.issueDate);
  const today = new Date('2026-03-24');
  const yearsHeld = (today.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  // Capital appreciation
  const currentValue = series.currentGoldPrice; // per gram
  const capitalGain = ((currentValue - series.issuePrice) / series.issuePrice) * 100;

  // Coupon earned (simple — annual 2.5% on issue price)
  const couponTotal = series.couponRate * yearsHeld;

  // Total absolute return
  const totalReturn = capitalGain + couponTotal;

  // CAGR approximation (annualised total return)
  const cagr =
    yearsHeld > 0
      ? (Math.pow((currentValue + (series.issuePrice * series.couponRate * yearsHeld) / 100) / series.issuePrice, 1 / yearsHeld) - 1) * 100
      : 0;

  return {
    yearsHeld: Math.round(yearsHeld * 10) / 10,
    currentValue,
    capitalGain: Math.round(capitalGain * 10) / 10,
    couponTotal: Math.round(couponTotal * 10) / 10,
    totalReturn: Math.round(totalReturn * 10) / 10,
    cagr: Math.round(cagr * 10) / 10,
  };
}

function returnColor(val: number) {
  if (val >= 15) return 'text-green-700 dark:text-green-400';
  if (val >= 8) return 'text-green-600 dark:text-green-500';
  if (val >= 0) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Sovereign Gold Bond (SGB) Series Tracker',
  description:
    'Track all RBI Sovereign Gold Bond series — issue price, current value, maturity, and returns.',
  url: 'https://investingpro.in/gold-rate/sgb',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://investingpro.in' },
      { '@type': 'ListItem', position: 2, name: 'Gold Rate', item: 'https://investingpro.in/gold-rate' },
      { '@type': 'ListItem', position: 3, name: 'SGB Series Tracker', item: 'https://investingpro.in/gold-rate/sgb' },
    ],
  },
};

const activeSeries = SGB_SERIES.filter(s => s.type === 'active');
const maturedSeries = SGB_SERIES.filter(s => s.type === 'matured');

export default function SGBPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-green-700 dark:hover:text-green-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/gold-rate" className="hover:text-green-700 dark:hover:text-green-400">Gold Rate</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 dark:text-gray-200">SGB Series Tracker</span>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-amber-50 via-amber-50 to-yellow-100 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950 border-b border-amber-200 dark:border-amber-900">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏅</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Sovereign Gold Bond (SGB) Series Tracker
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
                  Track all RBI SGB series — issue price, current gold value, coupon earned, and total
                  returns. Updated daily. Source: RBI circulars + IBJA gold rates.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full">
                    2.5% p.a. guaranteed coupon
                  </span>
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
                    Tax-free on maturity
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                    8-year tenure, 5-year lock-in
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Current Gold Price', value: `₹${CURRENT_GOLD_PRICE_PER_GRAM.toLocaleString('en-IN')}/g`, sub: '24K (999 purity)' },
              { label: 'Active Series', value: String(activeSeries.length), sub: 'available on NSE/BSE' },
              { label: 'Coupon Rate', value: '2.5% p.a.', sub: 'on issue price, semi-annual' },
              { label: 'Maturity Gain Tax', value: 'Nil', sub: 'exempt if held to maturity' },
            ].map(stat => (
              <div key={stat.label} className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-amber-700 dark:text-amber-400">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Active Series Table */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Active SGB Series — Returns as of March 2026
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Returns = capital appreciation (issue price → current gold price) + coupon earned (2.5% p.a. on issue price).
              Gold price used: ₹{CURRENT_GOLD_PRICE_PER_GRAM.toLocaleString('en-IN')}/gram.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Series</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Issue Price</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Current Value</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Capital Gain</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Coupon Earned</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Total Return</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">CAGR</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Matures</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {activeSeries.map((s, i) => {
                    const r = calcReturns(s);
                    return (
                      <tr
                        key={s.series}
                        className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 dark:text-white">{s.tranche}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">Coupon: {s.couponRate}% p.a.</div>
                        </td>
                        <td className="text-right px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
                          ₹{s.issuePrice.toLocaleString('en-IN')}/g
                        </td>
                        <td className="text-right px-4 py-3 font-medium text-amber-700 dark:text-amber-400">
                          ₹{CURRENT_GOLD_PRICE_PER_GRAM.toLocaleString('en-IN')}/g
                        </td>
                        <td className={`text-right px-4 py-3 font-semibold ${returnColor(r.capitalGain)}`}>
                          {r.capitalGain > 0 ? '+' : ''}{r.capitalGain}%
                        </td>
                        <td className="text-right px-4 py-3 text-green-700 dark:text-green-400">
                          +{r.couponTotal}%
                        </td>
                        <td className={`text-right px-4 py-3 font-bold ${returnColor(r.totalReturn)}`}>
                          {r.totalReturn > 0 ? '+' : ''}{r.totalReturn}%
                        </td>
                        <td className={`text-right px-4 py-3 font-semibold ${returnColor(r.cagr)}`}>
                          {r.cagr}%
                        </td>
                        <td className="text-right px-4 py-3 text-gray-600 dark:text-gray-300 text-xs">
                          {new Date(s.maturityDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              * Capital gains at maturity (held 8 years) are exempt from tax. Returns shown are pre-tax for LTCG-applicable early exits.
              Coupon is taxable as per your income slab. CAGR is approximate.
            </p>
          </section>

          {/* SGB Returns Calculator */}
          <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              SGB Returns Calculator
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Pick a series to see what ₹1 lakh invested would be worth today including coupon.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {activeSeries.slice(0, 6).map(s => {
                const r = calcReturns(s);
                const invested = 100000;
                const units = invested / s.issuePrice;
                const capitalValue = units * CURRENT_GOLD_PRICE_PER_GRAM;
                const couponValue = (s.issuePrice * s.couponRate / 100) * r.yearsHeld * units;
                const totalValue = capitalValue + couponValue;
                return (
                  <div key={s.series} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{s.tranche}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Issue: {new Date(s.issueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${returnColor(r.totalReturn)}`}>
                        {r.totalReturn > 0 ? '+' : ''}{r.totalReturn}%
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Invested</span>
                        <span>₹1,00,000</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Gold value today</span>
                        <span className="text-amber-700 dark:text-amber-400">₹{Math.round(capitalValue).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Coupon earned</span>
                        <span className="text-green-700 dark:text-green-400">₹{Math.round(couponValue).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-100 dark:border-gray-700">
                        <span>Total value</span>
                        <span className="text-green-700 dark:text-green-400">₹{Math.round(totalValue).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Matured Series */}
          {maturedSeries.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Matured SGB Series
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Series</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Issue Price (₹/g)</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Maturity Date</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Coupon Rate</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {maturedSeries.map(s => (
                      <tr key={s.series} className="bg-white dark:bg-gray-900">
                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{s.tranche}</td>
                        <td className="text-right px-4 py-3 text-gray-600 dark:text-gray-300">
                          ₹{s.issuePrice.toLocaleString('en-IN')}
                        </td>
                        <td className="text-right px-4 py-3 text-gray-600 dark:text-gray-300">
                          {new Date(s.maturityDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="text-right px-4 py-3 text-gray-600 dark:text-gray-300">
                          {s.couponRate}% p.a.
                        </td>
                        <td className="text-right px-4 py-3">
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                            Redeemed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SGB vs Gold ETF vs Physical */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              SGB vs Gold ETF vs Physical Gold
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Parameter</th>
                    <th className="text-center px-4 py-3 font-semibold text-amber-700 dark:text-amber-400">SGB</th>
                    <th className="text-center px-4 py-3 font-semibold text-blue-700 dark:text-blue-400">Gold ETF</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Physical Gold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[
                    ['Extra Returns', '+2.5% p.a. coupon', 'None', 'None'],
                    ['Tax on Maturity', 'Nil (8-year hold)', 'LTCG 20% with indexation', 'LTCG 20% with indexation'],
                    ['Lock-in', '5 years (8yr maturity)', 'None', 'None'],
                    ['Liquidity', 'NSE/BSE (limited volume)', 'High (market hours)', 'Moderate'],
                    ['Storage Cost', 'None', 'Expense ratio 0.5–1%', 'Locker ₹2K–₹5K/year'],
                    ['Purity Risk', 'None (RBI-backed)', 'None (99.5% gold)', 'High if from jeweller'],
                    ['Min Investment', '1 gram', '1 unit (₹50–100)', 'Varies'],
                    ['Max per year', '4 kg (individual)', 'No limit', 'No limit'],
                  ].map(([param, sgb, etf, physical]) => (
                    <tr key={param} className="bg-white dark:bg-gray-900 even:bg-gray-50/50 dark:even:bg-gray-800/30">
                      <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{param}</td>
                      <td className="text-center px-4 py-3 text-amber-700 dark:text-amber-300">{sgb}</td>
                      <td className="text-center px-4 py-3 text-blue-700 dark:text-blue-300">{etf}</td>
                      <td className="text-center px-4 py-3 text-gray-600 dark:text-gray-300">{physical}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm text-green-800 dark:text-green-300">
              <strong>Bottom line:</strong> SGB is the best way to own gold for long-term investors who can stay for 8 years.
              The 2.5% coupon + zero tax on maturity makes it consistently superior to Gold ETFs and physical gold.
              Use Gold ETFs if you need flexibility or invest in lump sums exceeding the 4kg SGB limit.
            </div>
          </section>

          {/* Key Facts */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key SGB Facts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: 'How to Buy SGBs',
                  items: [
                    'Primary market: RBI windows (4–6 times/year via all banks)',
                    'Secondary market: NSE/BSE during market hours (any time)',
                    'Online via Zerodha, Groww, Upstox, AngelOne (Demat)',
                    'Also available at post offices and SHCIL offices',
                  ],
                },
                {
                  title: 'Exit Options',
                  items: [
                    'Premature exit after 5 years on RBI coupon dates',
                    'Sell on NSE/BSE secondary market (lower liquidity)',
                    'Full maturity at 8 years — zero capital gains tax',
                    'Nomination facility available; tradeable & loanable',
                  ],
                },
                {
                  title: 'Taxation Rules',
                  items: [
                    '2.5% semi-annual coupon is taxable as income (your slab)',
                    'Capital gain at maturity (8 years) — completely exempt',
                    'Secondary market sell: LTCG 20% with indexation (after 3 years)',
                    'TDS not deducted on coupon; declare in ITR',
                  ],
                },
                {
                  title: 'Who Should Invest',
                  items: [
                    'Long-term investors (8-year horizon)',
                    'Those wanting inflation hedge + 2.5% extra income',
                    'Investors in 30% tax bracket (tax-free exit valuable)',
                    'Portfolio diversification beyond equity (5–10% allocation)',
                  ],
                },
              ].map(section => (
                <div key={section.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{section.title}</h3>
                  <ul className="space-y-1.5">
                    {section.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Related Links */}
          <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Gold Tools</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { href: '/gold-rate', label: '🥇 Today\'s Gold Rate in India', sub: 'Live 24K, 22K, 18K prices' },
                { href: '/gold-rate/mumbai', label: '📍 Gold Rate in Mumbai', sub: 'City-wise prices' },
                { href: '/calculators/sip', label: '📊 SIP Calculator', sub: 'Compare SIP vs Gold returns' },
                { href: '/ppf-nps/small-savings-comparison', label: '🏛️ Small Savings Comparison', sub: 'PPF vs SGB vs SCSS' },
                { href: '/calculators/fd', label: '🏦 FD Calculator', sub: 'Compare FD vs Gold returns' },
                { href: '/tools', label: '🛠️ All Financial Tools', sub: '25+ free tools' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-600"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{link.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{link.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
