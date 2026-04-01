import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ShieldCheck, AlertCircle, Download } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';
import {
  STATES, getHolidaysForState, getUpcomingHolidays,
  HOLIDAY_TYPE_COLOR, HOLIDAY_TYPE_LABEL,
} from '@/lib/data/bank-holidays';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Bank Holidays 2025-2026 India — All States | InvestingPro',
  description:
    'Complete list of bank holidays in India 2025 and 2026. State-wise bank holiday calendar with RTGS/NEFT closure dates. RBI official data.',
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

const formatDay = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(new Date(iso));

export default function BankHolidaysIndexPage() {
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear() as 2025 | 2026;
  const displayYear = currentYear >= 2026 ? 2026 : 2025;

  // National holidays for the hub view
  const nationalHolidays = getHolidaysForState('delhi', displayYear)
    .filter(h => h.type === 'national');

  // Upcoming across all states (Delhi as proxy for national)
  const upcoming = getUpcomingHolidays('delhi', 6);

  // Group states by region
  const regions = ['North', 'South', 'West', 'East', 'Central', 'Northeast'];
  const byRegion = regions.map(r => ({
    region: r,
    states: STATES.filter(s => s.region === r),
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="Bank Holidays 2025–2026 India — All States RBI Calendar | InvestingPro"
        description="Complete bank holiday list for India 2025 and 2026. All states. RTGS/NEFT closure dates. Source: RBI official holiday matrix."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Bank Holidays India 2025-2026',
          description: 'RBI official bank holiday calendar for all Indian states',
          url: 'https://investingpro.in/bank-holidays',
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-5 [&_*]:text-blue-200 [&_a]:text-blue-300" />

          <div className="inline-flex items-center gap-2 bg-blue-400/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Source: RBI Official Holiday Matrix · Updated annually
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3">
            Bank Holidays India
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-xl">
            2025 & 2026 holiday calendar for all states. Know when NEFT, RTGS, and clearing houses are closed before you transfer.
          </p>

          {/* Upcoming holidays strip */}
          {upcoming.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 max-w-2xl">
              <div className="text-sm font-semibold text-blue-200 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Bank Holidays (National)
              </div>
              <div className="space-y-2">
                {upcoming.map(h => (
                  <div key={h.date} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-xs bg-white/20 text-white px-2 py-1 rounded">
                        {new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </div>
                      <span className="text-sm text-white font-medium">{h.name}</span>
                      <span className="text-xs text-blue-200">{formatDay(h.date)}</span>
                    </div>
                    {h.rtgs && (
                      <span className="text-xs bg-red-500/20 text-red-200 px-2 py-0.5 rounded font-medium">RTGS closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-700">
            {[
              { value: nationalHolidays.length.toString(), label: `National holidays ${displayYear}` },
              { value: '25+', label: 'States covered' },
              { value: 'RBI', label: 'Official source' },
              { value: 'Free', label: 'iCal download' },
            ].map(s => (
              <div key={s.label} className="py-4 px-4 sm:px-8 text-center">
                <div className="text-xl font-bold text-blue-700 dark:text-blue-400 font-display">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-14">

        {/* RTGS notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Important:</strong> On national holidays, RTGS, NEFT, and IMPS operate differently. IMPS runs 24×7 regardless of holidays. NEFT/RTGS follow RBI holiday schedule. UPI works on most holidays — but settlement happens next business day.
          </div>
        </div>

        {/* National holidays table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            National Bank Holidays {displayYear}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-blue-50 dark:bg-blue-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Holiday</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Day</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">RTGS/NEFT</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">IMPS</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {nationalHolidays.map(h => (
                  <tr key={h.date} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${h.date === today ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}>
                    <td className="py-2.5 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatDate(h.date)}
                      {h.date === today && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Today</span>}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">{h.name}</td>
                    <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{formatDay(h.date)}</td>
                    <td className="py-2.5 px-4 text-center">
                      {h.rtgs
                        ? <span className="text-red-600 dark:text-red-400 font-medium">Closed</span>
                        : <span className="text-green-600 dark:text-green-400 font-medium">Open</span>}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="text-green-600 dark:text-green-400 font-medium">24×7</span>
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

        {/* States by region */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Bank Holidays by State
          </h2>
          <div className="space-y-8">
            {byRegion.filter(r => r.states.length > 0).map(({ region, states }) => (
              <div key={region}>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{region} India</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {states.map(s => {
                    const holidays = getHolidaysForState(s.slug, displayYear);
                    return (
                      <Link key={s.slug} href={`/bank-holidays/${s.slug}`}
                        className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-md transition-all">
                        <div>
                          <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{s.state}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{holidays.length} holidays</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transfer guide */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
            Which Transfer Methods Work on Bank Holidays?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { method: 'UPI', works: 'Yes — always', colour: 'bg-green-50 border-green-200 text-green-800', note: 'Settlement next business day' },
              { method: 'IMPS', works: 'Yes — 24×7', colour: 'bg-green-50 border-green-200 text-green-800', note: 'Immediate, including holidays' },
              { method: 'NEFT', works: 'Closed on RBI holidays', colour: 'bg-red-50 border-red-200 text-red-800', note: 'Resumes next working day' },
              { method: 'RTGS', works: 'Closed on RBI holidays', colour: 'bg-red-50 border-red-200 text-red-800', note: '₹2L+ only on working days' },
            ].map(item => (
              <div key={item.method} className={`rounded-xl border p-4 ${item.colour}`}>
                <div className="font-bold text-lg mb-1">{item.method}</div>
                <div className="font-semibold text-sm mb-1">{item.works}</div>
                <div className="text-xs opacity-80">{item.note}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
