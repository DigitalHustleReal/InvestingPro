import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PiggyBank, ArrowRight, ShieldCheck, TrendingUp,
  CheckCircle2, XCircle, Info, IndianRupee,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

export const revalidate = 604800; // weekly (rates change quarterly)

export const metadata: Metadata = {
  title: 'Small Savings Schemes Comparison 2025-26 — PPF vs SSY vs SCSS vs NSC | InvestingPro',
  description:
    'Compare all government small savings schemes: PPF, SSY, SCSS, NSC, KVP, POMIS, RD. Interest rates, tax benefits, lock-in periods — all in one table.',
};

interface Scheme {
  name: string;
  shortName: string;
  rate: number;        // % per annum
  compounding: string;
  minInvest: number;
  maxInvest: number | null;
  lockIn: string;
  taxOnInterest: 'exempt' | 'taxable' | 'tds';
  section80C: boolean;
  maturityTaxFree: boolean;
  eligibility: string;
  bestFor: string;
  rateAsOf: string;
  calcHref: string;
}

const SCHEMES: Scheme[] = [
  {
    name: 'Public Provident Fund',
    shortName: 'PPF',
    rate: 7.1,
    compounding: 'Annually',
    minInvest: 500,
    maxInvest: 150000,
    lockIn: '15 years',
    taxOnInterest: 'exempt',
    section80C: true,
    maturityTaxFree: true,
    eligibility: 'All Indian residents',
    bestFor: 'Long-term tax-free savings (EEE status)',
    rateAsOf: 'Q4 FY2025-26',
    calcHref: '/calculators/ppf',
  },
  {
    name: 'Sukanya Samriddhi Yojana',
    shortName: 'SSY',
    rate: 8.2,
    compounding: 'Annually',
    minInvest: 250,
    maxInvest: 150000,
    lockIn: '21 years (or marriage after 18)',
    taxOnInterest: 'exempt',
    section80C: true,
    maturityTaxFree: true,
    eligibility: 'Girl child below 10 years',
    bestFor: 'Highest safe return + EEE for daughters',
    rateAsOf: 'Q4 FY2025-26',
    calcHref: '/calculators/ssy',
  },
  {
    name: 'Senior Citizen Savings Scheme',
    shortName: 'SCSS',
    rate: 8.2,
    compounding: 'Quarterly',
    minInvest: 1000,
    maxInvest: 3000000,
    lockIn: '5 years (extendable 3yr)',
    taxOnInterest: 'tds',
    section80C: true,
    maturityTaxFree: false,
    eligibility: 'Age 60+ (55+ on VRS)',
    bestFor: 'Regular quarterly income for senior citizens',
    rateAsOf: 'Q4 FY2025-26',
    calcHref: '/calculators/scss',
  },
  {
    name: 'National Savings Certificate',
    shortName: 'NSC',
    rate: 7.7,
    compounding: 'Annually (credited to 80C)',
    minInvest: 1000,
    maxInvest: null,
    lockIn: '5 years',
    taxOnInterest: 'taxable',
    section80C: true,
    maturityTaxFree: false,
    eligibility: 'All Indian residents',
    bestFor: '80C investment with no upper limit',
    rateAsOf: 'Q4 FY2025-26',
    calcHref: '/calculators/nsc',
  },
  {
    name: 'Kisan Vikas Patra',
    shortName: 'KVP',
    rate: 7.5,
    compounding: 'Annually (money doubles)',
    minInvest: 1000,
    maxInvest: null,
    lockIn: '115 months (~9.6 years)',
    taxOnInterest: 'taxable',
    section80C: false,
    maturityTaxFree: false,
    eligibility: 'All Indian residents',
    bestFor: 'Doubling money in ~9.6 years',
    rateAsOf: 'Q4 FY2025-26',
    calcHref: '/calculators/kvp',
  },
  {
    name: 'Post Office MIS',
    shortName: 'POMIS',
    rate: 7.4,
    compounding: 'Monthly payout',
    minInvest: 1000,
    maxInvest: 900000,
    lockIn: '5 years',
    taxOnInterest: 'taxable',
    section80C: false,
    maturityTaxFree: false,
    eligibility: 'All Indian residents',
    bestFor: 'Fixed monthly income for 5 years',
    rateAsOf: 'Q4 FY2025-26',
    calcHref: '/calculators/mis',
  },
  {
    name: 'Post Office RD',
    shortName: 'PORD',
    rate: 6.7,
    compounding: 'Quarterly',
    minInvest: 100,
    maxInvest: null,
    lockIn: '5 years',
    taxOnInterest: 'taxable',
    section80C: false,
    maturityTaxFree: false,
    eligibility: 'All Indian residents',
    bestFor: 'Monthly savings habit, small amounts',
    rateAsOf: 'Q4 FY2025-26',
    calcHref: '/calculators/rd',
  },
];

const TAX_BADGE: Record<string, { label: string; color: string }> = {
  exempt: { label: 'Tax Free', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  taxable: { label: 'Taxable', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
  tds: { label: 'TDS applicable', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
};

export default function SmallSavingsPage() {
  const sortedByRate = [...SCHEMES].sort((a, b) => b.rate - a.rate);
  const top3 = sortedByRate.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="Small Savings Schemes 2025-26 — PPF vs SSY vs SCSS vs NSC vs KVP | InvestingPro"
        description="Compare all government small savings schemes rates Q4 FY2025-26. PPF 7.1%, SSY 8.2%, SCSS 8.2%, NSC 7.7%. Tax benefits, lock-in, and which to choose."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FinancialProduct',
          name: 'Indian Government Small Savings Schemes',
          url: 'https://investingpro.in/ppf-nps/small-savings-comparison',
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-green-200 [&_a]:text-green-300" />
          <div className="inline-flex items-center gap-2 bg-green-400/20 border border-green-400/30 text-green-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Government guaranteed · Q4 FY2025-26 rates · Ministry of Finance
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3">
            Small Savings Schemes
          </h1>
          <p className="text-green-100 text-lg max-w-xl">
            All government savings schemes compared — PPF, SSY, SCSS, NSC, KVP, POMIS. Which gives the best rate and tax benefit for you?
          </p>

          {/* Top 3 highlights */}
          <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl">
            {top3.map((s, i) => (
              <div key={s.shortName} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-green-200">#{i + 1} Highest Rate</span>
                  {s.section80C && <span className="text-xs bg-amber-400/30 text-amber-200 px-1.5 py-0.5 rounded">80C</span>}
                </div>
                <div className="font-bold text-white">{s.shortName}</div>
                <div className="text-3xl font-bold text-amber-300 font-display">{s.rate}%</div>
                <div className="text-xs text-green-200 mt-1">{s.compounding}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* Main comparison table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">
            All Schemes — Side-by-Side Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-green-50 dark:bg-green-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Scheme</th>
                  <th className="text-right py-3 px-4 font-semibold text-green-700">Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Lock-in</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Min / Max</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">80C?</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Interest Tax</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Best For</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {SCHEMES.map(s => (
                  <tr key={s.shortName} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{s.shortName}</div>
                      <div className="text-xs text-slate-500">{s.name}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xl font-bold text-green-700 dark:text-green-400 font-display tabular-nums">{s.rate}%</span>
                      <div className="text-xs text-slate-400">{s.compounding}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{s.lockIn}</td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                      <div>₹{s.minInvest.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-slate-400">{s.maxInvest ? `Max ₹${(s.maxInvest / 100000).toFixed(1)}L` : 'No max'}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {s.section80C
                        ? <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                        : <XCircle className="h-4 w-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TAX_BADGE[s.taxOnInterest].color}`}>
                        {TAX_BADGE[s.taxOnInterest].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-[160px]">{s.bestFor}</td>
                    <td className="py-3 px-4">
                      <Link href={s.calcHref}
                        className="text-xs font-semibold text-green-700 dark:text-green-400 hover:underline whitespace-nowrap">
                        Calculate →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Rates as of Q4 FY2025-26 (Jan–Mar 2026). Source: Ministry of Finance gazette notifications.</p>
        </section>

        {/* Decision guide */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-6">Which Scheme Should You Choose?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'For tax-free savings (all ages)', scheme: 'PPF', reason: 'EEE status — exempt at investment, growth, and withdrawal. 15-year horizon needed. Max ₹1.5L/year.', href: '/calculators/ppf', color: 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800' },
              { title: 'For your daughter\'s future', scheme: 'SSY', reason: 'Highest safe rate (8.2%) + EEE + 80C. Open before daughter turns 10. ₹250–₹1.5L/year.', href: '/calculators/ssy', color: 'border-pink-200 bg-pink-50 dark:bg-pink-900/10 dark:border-pink-800' },
              { title: 'For senior citizens (60+)', scheme: 'SCSS', reason: '8.2% quarterly payout — highest regular income scheme. ₹3L max deposit. 80C benefit.', href: '/calculators/scss', color: 'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800' },
              { title: 'For 80C without upper limit', scheme: 'NSC', reason: '7.7%, 5-year lock-in. No maximum investment. Accrued interest reinvests and qualifies for 80C.', href: '/calculators/nsc', color: 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800' },
              { title: 'To double your money', scheme: 'KVP', reason: '7.5% — money doubles in 115 months (~9.6 years). No 80C benefit but no upper limit.', href: '/calculators/kvp', color: 'border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800' },
              { title: 'For monthly fixed income', scheme: 'POMIS', reason: 'Post Office MIS pays monthly at 7.4%. Max ₹9L (₹15L joint). Good for retirees needing cash flow.', href: '/calculators/mis', color: 'border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800' },
            ].map(card => (
              <div key={card.scheme} className={`rounded-xl border p-5 ${card.color}`}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{card.title}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-2">{card.scheme}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{card.reason}</p>
                <Link href={card.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 hover:underline">
                  Calculate returns <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* EEE note */}
        <div className="flex items-start gap-3 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <strong>EEE Status explained:</strong> PPF and SSY have EEE (Exempt-Exempt-Exempt) tax status — the investment qualifies for 80C deduction, the interest earned is tax-free, and the maturity amount is also tax-free. This is the best possible tax treatment for any investment in India.
            <br /><br />
            <strong>SCSS interest is taxable</strong> but if your total income is below ₹3L (senior citizen) or ₹5L (super senior), you get 87A rebate and effectively pay zero tax. Always factor in your tax slab when comparing yields.
          </div>
        </div>

        {/* Related */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/taxes/old-vs-new-regime', title: 'Old vs New Tax Regime', desc: 'Which regime benefits from these 80C deductions?' },
            { href: '/ppf-nps/nps-returns', title: 'NPS vs PPF', desc: 'Extra ₹50K deduction under 80CCD(1B)' },
            { href: '/fixed-deposits', title: 'Best FD Rates', desc: 'Compare bank FDs vs small savings schemes' },
          ].map(t => (
            <Link key={t.href} href={t.href}
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{t.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
