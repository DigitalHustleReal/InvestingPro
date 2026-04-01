import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, MapPin, Coins, BarChart3,
  ArrowRight, RefreshCw, ShieldCheck, Scale, Gem,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import { GOLD_RATE_CITIES, getSeedRate, GOLD_PURITY_GUIDE, GOLD_52W } from '@/lib/data/gold-rate';

export const revalidate = 3600; // re-fetch hourly

export const metadata: Metadata = {
  title: 'Gold Rate Today in India — Aaj Sone Ka Bhav | InvestingPro',
  description:
    'Today\'s gold rate in India — 24K, 22K, 18K prices in all major cities. Updated daily from IBJA. Compare gold rates across 50 cities.',
};

const today = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
}).format(new Date());

export default function GoldRateIndexPage() {
  // Pre-render seed rates for hub page (ISR keeps them fresh hourly)
  const featuredCities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata',
    'ahmedabad', 'pune', 'jaipur', 'kochi', 'coimbatore', 'chandigarh']
    .map(slug => getSeedRate(slug));

  const mumbaiRate = getSeedRate('mumbai');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="Gold Rate Today in India 2026 — Aaj Sone Ka Bhav | InvestingPro"
        description="Live 24K, 22K & 18K gold rates for 50+ Indian cities today. Updated daily from IBJA. Compare SGB, ETF and physical gold."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Gold Rate Today in India',
          description: 'Today\'s gold price in India — 24K, 22K, 18K across all major cities',
          url: 'https://investingpro.in/gold-rate',
          dateModified: new Date().toISOString(),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-700 pt-24 pb-16">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-300/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <AutoBreadcrumbs className="mb-6 justify-center [&_*]:text-amber-200 [&_a]:text-amber-300" />
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <RefreshCw className="h-3.5 w-3.5" />
            Updated daily · IBJA authenticated · 50+ cities
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 font-display">
            Gold Rate Today in India
          </h1>
          <p className="text-amber-100 text-lg mb-2">Aaj Sone Ka Bhav — {today}</p>

          {/* Big rate card */}
          <div className="mt-8 inline-grid grid-cols-3 gap-px bg-white/20 rounded-2xl overflow-hidden max-w-lg w-full">
            {[
              { label: '24K (per gram)', value: `₹${mumbaiRate.rate24k.toLocaleString('en-IN')}` },
              { label: '22K (per gram)', value: `₹${mumbaiRate.rate22k.toLocaleString('en-IN')}` },
              { label: '18K (per gram)', value: `₹${mumbaiRate.rate18k.toLocaleString('en-IN')}` },
            ].map(item => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm px-5 py-4 text-center">
                <div className="text-2xl font-bold text-white font-display">{item.value}</div>
                <div className="text-xs text-amber-200 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-300 mt-3">Mumbai base rate · City rates vary by ₹50–₹200</p>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-700">
            {[
              { value: `₹${GOLD_52W.high24k.toLocaleString('en-IN')}`, label: '52-week high (24K/g)' },
              { value: `₹${GOLD_52W.low24k.toLocaleString('en-IN')}`, label: '52-week low (24K/g)' },
              { value: '50+', label: 'Cities covered' },
              { value: 'IBJA', label: 'Data source' },
            ].map(s => (
              <div key={s.label} className="py-4 px-4 sm:px-8 text-center">
                <div className="text-xl font-bold text-amber-700 dark:text-amber-400 font-display">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-14">

        {/* Featured cities grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">Gold Rate by City</h2>
              <p className="text-sm text-slate-500 mt-1">Tap a city for detailed 24K/22K/18K rates + history</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredCities.map(city => (
              <Link
                key={city.slug}
                href={`/gold-rate/${city.slug}`}
                className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg group-hover:bg-amber-100">
                    <MapPin className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{city.city}</div>
                    <div className="text-xs text-slate-500">{city.state}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    ₹{city.rate22k.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500">22K/gram</div>
                </div>
              </Link>
            ))}
          </div>
          {/* All cities link */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GOLD_RATE_CITIES.filter(c => !featuredCities.find(f => f.slug === c.slug)).slice(0, 8).map(city => (
              <Link
                key={city.slug}
                href={`/gold-rate/${city.slug}`}
                className="text-sm text-amber-700 dark:text-amber-400 hover:underline px-3 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-center"
              >
                {city.city}
              </Link>
            ))}
          </div>
        </section>

        {/* Purity guide */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6">Gold Purity Guide</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GOLD_PURITY_GUIDE.map(p => (
              <div key={p.karat} className={`rounded-xl border p-4 ${p.colour}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Gem className="h-4 w-4" />
                  <span className="font-bold text-lg">{p.karat}</span>
                </div>
                <div className="text-2xl font-bold font-display mb-1">{p.purity}</div>
                <div className="text-sm opacity-80">{p.use}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Investment comparison */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-600" />
            Physical Gold vs SGB vs Gold ETF
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Factor</th>
                  <th className="text-center py-2 px-4 font-semibold text-amber-700">Physical Gold</th>
                  <th className="text-center py-2 px-4 font-semibold text-green-700">SGB</th>
                  <th className="text-center py-2 px-4 font-semibold text-blue-700">Gold ETF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  ['Extra return', '—', '2.5%/yr interest', 'Fund expense ratio'],
                  ['Making charges', '8–25%', 'None', 'None'],
                  ['Storage cost', 'Locker required', 'None (demat)', 'None (demat)'],
                  ['Liquidity', 'Moderate', 'Low (8-yr lock)', 'High (exchange)'],
                  ['Min investment', 'Any gram', '1 gram = ₹1 unit', '~₹100–500/unit'],
                  ['Tax on gains', 'LTCG 12.5%', 'Tax-free on maturity', 'LTCG 12.5%'],
                  ['Best for', 'Gifting, jewellery', 'Long-term (8yr+)', 'Flexible investment'],
                ].map(([factor, phys, sgb, etf]) => (
                  <tr key={factor}>
                    <td className="py-2.5 pr-4 font-medium text-slate-700 dark:text-slate-300">{factor}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400">{phys}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400">{sgb}</td>
                    <td className="py-2.5 px-4 text-center text-slate-600 dark:text-slate-400">{etf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg text-sm text-green-800 dark:text-green-300">
            <strong>InvestingPro take:</strong> SGB is the best gold investment if you can lock in for 8 years — you get gold price appreciation + 2.5%/year interest, and maturity proceeds are completely tax-free. For flexibility, Gold ETF beats physical gold on every metric except gifting.
          </div>
        </section>

        {/* 10g and 100g rate table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-600" />
            Gold Rate for Different Quantities — Mumbai
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-amber-50 dark:bg-amber-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Quantity</th>
                  <th className="text-right py-3 px-4 font-semibold text-amber-700">24K (₹)</th>
                  <th className="text-right py-3 px-4 font-semibold text-yellow-700">22K (₹)</th>
                  <th className="text-right py-3 px-4 font-semibold text-orange-700">18K (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[1, 5, 8, 10, 50, 100].map(grams => (
                  <tr key={grams} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300">{grams} gram{grams > 1 ? 's' : ''}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      {(mumbaiRate.rate24k * grams).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      {(mumbaiRate.rate22k * grams).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      {(mumbaiRate.rate18k * grams).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related tools */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/fixed-deposits', icon: BarChart3, title: 'Best FD Rates', desc: 'Compare FD vs gold returns', color: 'bg-green-50 dark:bg-green-900/30', iconColor: 'text-green-700' },
            { href: '/mutual-funds', icon: TrendingUp, title: 'Gold ETF Funds', desc: 'Invest in gold via mutual funds', color: 'bg-blue-50 dark:bg-blue-900/30', iconColor: 'text-blue-700' },
            { href: '/calculators/sip', icon: Coins, title: 'SIP Calculator', desc: 'Calculate SIP returns vs gold', color: 'bg-amber-50 dark:bg-amber-900/30', iconColor: 'text-amber-700' },
          ].map(tool => (
            <Link key={tool.href} href={tool.href}
              className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md transition-all">
              <div className={`p-3 ${tool.color} rounded-xl`}>
                <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{tool.title}</div>
                <div className="text-xs text-slate-500">{tool.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
