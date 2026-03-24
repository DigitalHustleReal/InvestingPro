import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, RefreshCw, ArrowLeft, Coins, TrendingUp,
  ArrowRight, Scale, ShieldCheck, Gem,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  GOLD_RATE_CITIES, fetchGoldRate, getSeedRate,
  GOLD_PURITY_GUIDE, GOLD_52W,
} from '@/lib/data/gold-rate';

export const revalidate = 3600; // hourly ISR

interface Props { params: { city: string } }

export async function generateStaticParams() {
  return GOLD_RATE_CITIES.map(c => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityInfo = GOLD_RATE_CITIES.find(c => c.slug === params.city);
  if (!cityInfo) return {};
  const rate = getSeedRate(params.city);
  return {
    title: `Gold Rate Today in ${cityInfo.city} — 24K 22K 18K | InvestingPro`,
    description: `Today's gold rate in ${cityInfo.city}: 24K ₹${rate.rate24k.toLocaleString('en-IN')}/gram, 22K ₹${rate.rate22k.toLocaleString('en-IN')}/gram. Updated daily from IBJA.`,
  };
}

export default async function GoldRateCityPage({ params }: Props) {
  const cityInfo = GOLD_RATE_CITIES.find(c => c.slug === params.city);
  if (!cityInfo) notFound();

  const rate = await fetchGoldRate(params.city);

  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

  const isPositive = rate.change1d >= 0;

  // Nearby cities (same state)
  const nearbyCities = GOLD_RATE_CITIES
    .filter(c => c.state === cityInfo.state && c.slug !== params.city)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title={`Gold Rate Today in ${cityInfo.city} — 24K 22K 18K Price | InvestingPro`}
        description={`Aaj ${cityInfo.city} mein sone ka bhav: 24K ₹${rate.rate24k.toLocaleString('en-IN')}/gram, 22K ₹${rate.rate22k.toLocaleString('en-IN')}/gram, 18K ₹${rate.rate18k.toLocaleString('en-IN')}/gram. Updated daily.`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `Gold Rate Today in ${cityInfo.city}`,
          description: `Today's gold rate in ${cityInfo.city} — 24K, 22K, 18K prices`,
          url: `https://investingpro.in/gold-rate/${params.city}`,
          dateModified: new Date().toISOString(),
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://investingpro.in' },
              { '@type': 'ListItem', position: 2, name: 'Gold Rate', item: 'https://investingpro.in/gold-rate' },
              { '@type': 'ListItem', position: 3, name: `Gold Rate in ${cityInfo.city}`, item: `https://investingpro.in/gold-rate/${params.city}` },
            ],
          },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-700 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-amber-200 [&_a]:text-amber-300" />

          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RefreshCw className="h-3.5 w-3.5" />
            Updated daily · IBJA authenticated
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display mb-1">
            Gold Rate Today in {cityInfo.city}
          </h1>
          <p className="text-amber-200 mb-8">{today} · {cityInfo.state}</p>

          {/* Rate cards */}
          <div className="grid grid-cols-3 gap-3 max-w-2xl">
            {[
              { label: '24 Karat', sublabel: '99.9% pure', value: rate.rate24k, color: 'bg-yellow-400/20' },
              { label: '22 Karat', sublabel: '91.6% pure', value: rate.rate22k, color: 'bg-amber-400/20' },
              { label: '18 Karat', sublabel: '75% pure', value: rate.rate18k, color: 'bg-orange-400/20' },
            ].map(item => (
              <div key={item.label} className={`${item.color} backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center`}>
                <div className="text-xs font-semibold text-amber-200 mb-1">{item.label}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-display tabular-nums">
                  ₹{item.value.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-amber-300 mt-1">per gram · {item.sublabel}</div>
              </div>
            ))}
          </div>

          {rate.change1d !== 0 && (
            <div className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${isPositive ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
              {isPositive ? '+' : ''}₹{rate.change1d} ({rate.changePercent.toFixed(2)}%) vs yesterday
            </div>
          )}
        </div>
      </section>

      {/* 52-week range */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-700">
            {[
              { value: `₹${GOLD_52W.high24k.toLocaleString('en-IN')}`, label: '52W High (24K)' },
              { value: `₹${GOLD_52W.low24k.toLocaleString('en-IN')}`, label: '52W Low (24K)' },
              { value: `₹${GOLD_52W.high22k.toLocaleString('en-IN')}`, label: '52W High (22K)' },
              { value: `₹${GOLD_52W.low22k.toLocaleString('en-IN')}`, label: '52W Low (22K)' },
            ].map(s => (
              <div key={s.label} className="py-4 px-4 sm:px-8 text-center">
                <div className="text-lg font-bold text-amber-700 dark:text-amber-400 font-display tabular-nums">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-12">

        {/* Quantity calculator */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5 flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-600" />
            Gold Price in {cityInfo.city} — Different Quantities
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
                {[1, 2, 5, 8, 10, 20, 50, 100].map(grams => (
                  <tr key={grams} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300">{grams} gram{grams > 1 ? 's' : ''}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      {(rate.rate24k * grams).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      {(rate.rate22k * grams).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      {(rate.rate18k * grams).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Purity guide */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5 flex items-center gap-2">
            <Gem className="h-5 w-5 text-amber-600" />
            Gold Purity — Which Karat to Buy?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GOLD_PURITY_GUIDE.map(p => (
              <div key={p.karat} className={`rounded-xl border p-4 ${p.colour}`}>
                <div className="font-bold text-xl mb-1">{p.karat}</div>
                <div className="text-2xl font-bold font-display">{p.purity}</div>
                <div className="text-sm mt-1 opacity-80">{p.use}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby cities */}
        {nearbyCities.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
              Gold Rate in Other {cityInfo.state} Cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {nearbyCities.map(c => {
                const r = getSeedRate(c.slug);
                return (
                  <Link key={c.slug} href={`/gold-rate/${c.slug}`}
                    className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md transition-all text-center">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{c.city}</div>
                    <div className="text-amber-700 font-bold tabular-nums mt-1">₹{r.rate22k.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-500">22K/gram</div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back + all cities */}
        <div className="flex flex-wrap gap-3">
          <Link href="/gold-rate"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            All city gold rates
          </Link>
          <Link href="/mutual-funds"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 hover:underline">
            Compare Gold ETF funds
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
