import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, AlertCircle, Download, ShieldCheck } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  STATES, getHolidaysForState, getUpcomingHolidays,
  HOLIDAY_TYPE_COLOR, HOLIDAY_TYPE_LABEL,
} from '@/lib/data/bank-holidays';

export const revalidate = 86400;

interface Props { params: { state: string } }

export async function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateInfo = STATES.find(s => s.slug === params.state);
  if (!stateInfo) return {};
  const year = new Date().getFullYear() >= 2026 ? 2026 : 2025;
  const count = getHolidaysForState(params.state, year as 2025 | 2026).length;
  return {
    title: `Bank Holidays ${year} in ${stateInfo.state} — Complete List | InvestingPro`,
    description: `All ${count} bank holidays in ${stateInfo.state} for ${year}. RTGS/NEFT closure dates, national + state holidays. Source: RBI.`,
  };
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));

const formatDay = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(new Date(iso));

export default function StateHolidaysPage({ params }: Props) {
  const stateInfo = STATES.find(s => s.slug === params.state);
  if (!stateInfo) notFound();

  const today = new Date().toISOString().split('T')[0];
  const year2025 = getHolidaysForState(params.state, 2025);
  const year2026 = getHolidaysForState(params.state, 2026);
  const upcoming = getUpcomingHolidays(params.state, 5);

  const displayYear = new Date().getFullYear() >= 2026 ? 2026 : 2025;
  const currentHolidays = displayYear === 2026 ? year2026 : year2025;
  const otherHolidays = displayYear === 2026 ? year2025 : year2026;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title={`Bank Holidays ${displayYear} in ${stateInfo.state} | InvestingPro`}
        description={`Complete bank holiday list for ${stateInfo.state} ${displayYear}. ${currentHolidays.length} holidays including national + state-specific. RTGS/NEFT closure schedule.`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Bank Holidays ${displayYear} in ${stateInfo.state}`,
          numberOfItems: currentHolidays.length,
          url: `https://investingpro.in/bank-holidays/${params.state}`,
          itemListElement: currentHolidays.slice(0, 10).map((h, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: h.name,
            description: formatDate(h.date),
          })),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 pt-24 pb-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-blue-200 [&_a]:text-blue-300" />

          <div className="inline-flex items-center gap-2 bg-blue-400/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Source: RBI Official Holiday Matrix
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display mb-2">
            Bank Holidays {displayYear} in {stateInfo.state}
          </h1>
          <p className="text-blue-200 mb-6">
            {currentHolidays.length} holidays · {currentHolidays.filter(h => h.rtgs).length} RTGS closures · {stateInfo.region} India
          </p>

          {/* Next upcoming */}
          {upcoming.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 max-w-lg">
              <div className="text-xs font-semibold text-blue-200 mb-2">Next holiday</div>
              <div className="text-white font-semibold">{upcoming[0].name}</div>
              <div className="text-blue-200 text-sm">{formatDate(upcoming[0].date)} · {formatDay(upcoming[0].date)}</div>
              {upcoming[0].rtgs && (
                <div className="mt-2 text-xs bg-red-500/20 text-red-200 inline-flex items-center gap-1 px-2 py-1 rounded">
                  <AlertCircle className="h-3 w-3" /> RTGS / NEFT closed this day
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Year tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 flex gap-6 py-3">
          <div className="text-sm text-slate-500 flex items-center gap-4">
            <span>Jump to year:</span>
            <Link href="#2025" className="font-semibold text-blue-700 dark:text-blue-400 hover:underline">2025 ({year2025.length})</Link>
            <Link href="#2026" className="font-semibold text-blue-700 dark:text-blue-400 hover:underline">2026 ({year2026.length})</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-12">

        {/* RTGS notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Note:</strong> IMPS works 24×7 on all holidays. UPI transactions are processed but settled next working day. For urgent ₹2L+ transfers, plan ahead to avoid RTGS closures.
          </p>
        </div>

        {/* 2025 table */}
        {[{ year: 2025, holidays: year2025 }, { year: 2026, holidays: year2026 }].map(({ year, holidays }) => (
          <section key={year} id={year.toString()}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Bank Holidays {year} — {stateInfo.state}
              <span className="ml-2 text-sm font-normal text-slate-500">({holidays.length} holidays)</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
                <thead className="bg-blue-50 dark:bg-blue-900/20">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Holiday</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Day</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">RTGS/NEFT</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">IMPS/UPI</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {holidays.map(h => (
                    <tr key={h.date}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${h.date === today ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}>
                      <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formatDate(h.date)}
                        {h.date === today && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Today</span>}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">{h.name}</td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{formatDay(h.date)}</td>
                      <td className="py-2.5 px-4 text-center">
                        {h.rtgs
                          ? <span className="text-red-600 dark:text-red-400 font-semibold text-xs">Closed</span>
                          : <span className="text-green-600 dark:text-green-400 font-semibold text-xs">Open</span>}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-xs">24×7</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${HOLIDAY_TYPE_COLOR[h.type]}`}>
                          {HOLIDAY_TYPE_LABEL[h.type]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Other states nearby */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display mb-4">
            Bank Holidays in Other {stateInfo.region} India States
          </h3>
          <div className="flex flex-wrap gap-2">
            {STATES
              .filter(s => s.region === stateInfo.region && s.slug !== params.state)
              .map(s => (
                <Link key={s.slug} href={`/bank-holidays/${s.slug}`}
                  className="text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                  {s.state}
                </Link>
              ))}
          </div>
        </section>

        <Link href="/bank-holidays"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          All states bank holidays
        </Link>
      </div>
    </div>
  );
}
