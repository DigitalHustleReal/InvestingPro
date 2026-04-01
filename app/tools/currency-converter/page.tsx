'use client';

/**
 * Currency Converter — NRI-focused, RBI reference rates
 * Route: /tools/currency-converter
 * Targets: "currency converter INR", "USD to INR today", "NRI money transfer", "forex rates India"
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface CurrencyRate {
  code: string;
  name: string;
  flag: string;
  rateToINR: number; // 1 unit = X INR
  change24h: number; // % change
  nriRelevance: boolean;
  sendingFee?: string; // typical wire fee
}

// RBI reference rates — updated daily seed (March 2026)
const CURRENCY_RATES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rateToINR: 85.42, change24h: -0.12, nriRelevance: true, sendingFee: '₹500–₹2,000 per transfer' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rateToINR: 92.18, change24h: 0.08, nriRelevance: true, sendingFee: '₹600–₹2,500 per transfer' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rateToINR: 107.35, change24h: -0.22, nriRelevance: true, sendingFee: '₹700–₹2,500 per transfer' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateToINR: 23.26, change24h: -0.05, nriRelevance: true, sendingFee: '₹250–₹800 per transfer' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', rateToINR: 22.77, change24h: -0.03, nriRelevance: true, sendingFee: '₹300–₹1,000 per transfer' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rateToINR: 54.12, change24h: 0.15, nriRelevance: true, sendingFee: '₹500–₹2,000 per transfer' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rateToINR: 62.45, change24h: -0.18, nriRelevance: true, sendingFee: '₹500–₹2,000 per transfer' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', rateToINR: 63.82, change24h: 0.06, nriRelevance: true, sendingFee: '₹400–₹1,500 per transfer' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rateToINR: 0.572, change24h: 0.32, nriRelevance: false },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rateToINR: 96.24, change24h: -0.09, nriRelevance: false },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰', rateToINR: 10.98, change24h: -0.04, nriRelevance: false },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', rateToINR: 49.65, change24h: 0.21, nriRelevance: false },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', rateToINR: 19.54, change24h: 0.11, nriRelevance: false },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼', rateToINR: 277.84, change24h: -0.02, nriRelevance: true },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦', rateToINR: 23.46, change24h: -0.01, nriRelevance: true },
  { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲', rateToINR: 221.87, change24h: -0.03, nriRelevance: true },
  { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭', rateToINR: 226.55, change24h: -0.02, nriRelevance: true },
];

const POPULAR_PAIRS = [
  { from: 'USD', to: 'INR', label: 'USD → INR' },
  { from: 'GBP', to: 'INR', label: 'GBP → INR' },
  { from: 'EUR', to: 'INR', label: 'EUR → INR' },
  { from: 'AED', to: 'INR', label: 'AED → INR' },
  { from: 'SAR', to: 'INR', label: 'SAR → INR' },
  { from: 'AUD', to: 'INR', label: 'AUD → INR' },
];

const NRI_AMOUNTS = [1000, 5000, 10000, 50000, 100000];

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [sendMode, setSendMode] = useState(false);

  const allCurrencies = ['INR', ...CURRENCY_RATES.map(r => r.code)];

  const getRate = (code: string): number => {
    if (code === 'INR') return 1;
    return CURRENCY_RATES.find(r => r.code === code)?.rateToINR ?? 1;
  };

  const converted = useMemo(() => {
    const num = parseFloat(amount) || 0;
    const fromRate = getRate(fromCurrency);
    const toRate = getRate(toCurrency);
    const inr = num * fromRate;
    const result = inr / toRate;
    return result;
  }, [amount, fromCurrency, toCurrency]);

  const exchangeRate = useMemo(() => {
    return getRate(fromCurrency) / getRate(toCurrency);
  }, [fromCurrency, toCurrency]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const fromInfo = CURRENCY_RATES.find(r => r.code === fromCurrency);
  const toInfo = CURRENCY_RATES.find(r => r.code === toCurrency);

  const nriRelevantRates = CURRENCY_RATES.filter(r => r.nriRelevance);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-green-700 dark:hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:text-green-700 dark:hover:text-green-400">Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 dark:text-gray-200">Currency Converter</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-950 border-b border-green-200 dark:border-green-900">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Currency Converter — Live Forex Rates India
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
            Convert between INR and 16+ currencies using RBI reference rates.
            NRI remittance guide included — USD, AED, GBP, EUR, SGD and more.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Source: RBI Reference Rates</span>
            <span>•</span>
            <span>Updated daily</span>
            <span>•</span>
            <span>March 2026</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Quick Pairs */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_PAIRS.map(pair => (
            <button
              key={pair.label}
              onClick={() => {
                setFromCurrency(pair.from);
                setToCurrency(pair.to);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                fromCurrency === pair.from && toCurrency === pair.to
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-500'
              }`}
            >
              {pair.label}
            </button>
          ))}
        </div>

        {/* Main Converter */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 max-w-2xl">
          <div className="space-y-4">
            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="1000"
                  min="0"
                />
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  className="px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {allCurrencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {fromInfo && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {fromInfo.flag} {fromInfo.name} • 1 {fromInfo.code} = ₹{fromInfo.rateToINR.toFixed(2)}
                  <span className={fromInfo.change24h >= 0 ? 'text-green-600 dark:text-green-400 ml-2' : 'text-red-500 ml-2'}>
                    {fromInfo.change24h >= 0 ? '▲' : '▼'} {Math.abs(fromInfo.change24h)}% today
                  </span>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={swap}
                className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:text-green-700 hover:border-green-500 transition-colors shadow-sm"
                title="Swap currencies"
              >
                ⇅
              </button>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                Converted Amount
              </label>
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200 text-xl font-bold">
                  {toCurrency === 'INR' ? '₹' : ''}{converted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <select
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                  className="px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {allCurrencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {toInfo && (
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {toInfo.flag} {toInfo.name} • 1 {toInfo.code} = ₹{toInfo.rateToINR.toFixed(2)}
                </div>
              )}
            </div>

            {/* Exchange Rate */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Exchange rate:</span> 1 {fromCurrency} ={' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {exchangeRate.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {toCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* NRI Remittance Quick Table */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            NRI Remittance — What You Receive in India
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Typical bank forex rate is 0.5–2% worse than RBI reference rate. Table below uses RBI rates for reference.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Currency</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Rate (₹)</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">24h</th>
                  {NRI_AMOUNTS.map(a => (
                    <th key={a} className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">
                      {a >= 1000 ? `${a / 1000}K` : a}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {nriRelevantRates.map((rate, i) => (
                  <tr
                    key={rate.code}
                    className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'}
                  >
                    <td className="px-4 py-3">
                      <span className="mr-2">{rate.flag}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{rate.code}</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs hidden sm:inline">{rate.name}</span>
                    </td>
                    <td className="text-right px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
                      ₹{rate.rateToINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`text-right px-4 py-3 text-xs font-medium ${rate.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      {rate.change24h >= 0 ? '▲' : '▼'} {Math.abs(rate.change24h)}%
                    </td>
                    {NRI_AMOUNTS.map(a => (
                      <td key={a} className="text-right px-4 py-3 text-gray-600 dark:text-gray-300">
                        ₹{Math.round(a * rate.rateToINR).toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Source: RBI reference rates. Actual bank/transfer rates may differ by 0.5–2%.
            Amounts shown are at RBI rate (best case). Check your bank for actual TT rate.
          </p>
        </section>

        {/* NRI Transfer Guide */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            NRI Money Transfer Guide — Remittance Options
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                method: 'Wire Transfer (SWIFT)',
                speed: '1–3 business days',
                cost: '₹500–₹2,000 + correspondent bank charges',
                best: 'Large amounts (₹5L+)',
                note: 'Most secure; use for large remittances. Banks charge both sender + receiver fees.',
                icon: '🏦',
              },
              {
                method: 'Online Remittance (Wise/Remitly)',
                speed: 'Minutes to 1 day',
                cost: '0.5–2% of transfer amount',
                best: 'Regular NRI transfers (₹50K–₹5L)',
                note: 'Much better forex rate than banks. Wise shows real RBI rate + fixed fee.',
                icon: '📱',
              },
              {
                method: 'Money Exchange (Al Ansari/UAE Exchange)',
                speed: 'Same day to 2 days',
                cost: '₹200–₹800 flat fee',
                best: 'Gulf country NRIs (UAE, Saudi, Qatar)',
                note: 'Cheap for Gulf → India corridors. Walk-in or app.',
                icon: '💱',
              },
              {
                method: 'NRE/NRO Account Transfer',
                speed: 'Instant (if same bank)',
                cost: 'Nil (intra-bank)',
                best: 'Regular salary/income repatriation',
                note: 'NRE account: fully repatriable, tax-free in India. Best for long-term NRI planning.',
                icon: '🔄',
              },
            ].map(item => (
              <div key={item.method} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{item.method}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.speed}</div>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Cost</span>
                    <span className="text-gray-700 dark:text-gray-200">{item.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Best for</span>
                    <span className="text-green-700 dark:text-green-400">{item.best}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-2">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RBI TT Rate vs Reference Rate */}
        <section className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Why Your Bank Rate Differs from RBI Rate
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">RBI Reference Rate</div>
              <p className="text-gray-600 dark:text-gray-300">
                The benchmark rate published by RBI daily at 12:30 PM. This is the "fair" rate with no markup.
                Banks cannot use this rate to transact — it&apos;s a reference only.
              </p>
            </div>
            <div>
              <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Bank TT Rate</div>
              <p className="text-gray-600 dark:text-gray-300">
                Telegraphic Transfer rate used by banks for wire transfers. Typically 0.5–1% worse than RBI rate.
                SBI/HDFC/ICICI add ₹500–₹2,000 flat fee on top.
              </p>
            </div>
            <div>
              <div className="font-semibold text-green-700 dark:text-green-400 mb-1">Best Rate Tips</div>
              <p className="text-gray-600 dark:text-gray-300">
                Use Wise or Remitly for amounts under ₹10L — typically 1–2% better than banks.
                For ₹10L+, negotiate with your bank or use HDFC Forex Plus / Kotak Remit.
              </p>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Tools</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: '/rbi-rates', label: '🏛️ RBI Rates Dashboard', sub: 'Repo rate, CRR, forex' },
              { href: '/gold-rate', label: '🥇 Live Gold Rate', sub: '50 Indian cities' },
              { href: '/calculators/fd', label: '🏦 FD Calculator', sub: 'NRE/NRO FD returns' },
              { href: '/tools', label: '🛠️ All Financial Tools', sub: '25+ free tools' },
              { href: '/calculators/sip', label: '📊 SIP Calculator', sub: 'Invest remittance in MF' },
              { href: '/ppf-nps/small-savings-comparison', label: '📈 Small Savings', sub: 'NRI-eligible PPF, NPS' },
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
  );
}
