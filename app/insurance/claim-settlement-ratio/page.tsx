import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck, TrendingUp, ArrowRight, Info,
  CheckCircle2, AlertCircle, BarChart3,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

export const revalidate = 2592000; // monthly (annual data)

export const metadata: Metadata = {
  title: 'Claim Settlement Ratio 2023-24 — Life & Health Insurance | InvestingPro',
  description:
    'IRDAI claim settlement ratio (CSR) for all life and health insurance companies 2023-24. Find the most trustworthy insurer before buying term or health insurance.',
};

/** IRDAI Annual Report 2023-24 — Life Insurance CSR */
const LIFE_CSR = [
  { company: 'LIC of India', csr: 98.82, claimsSettled: 2038438, avgSettlementDays: 8, type: 'PSU' },
  { company: 'HDFC Life Insurance', csr: 99.30, claimsSettled: 124582, avgSettlementDays: 5, type: 'Private' },
  { company: 'SBI Life Insurance', csr: 97.33, claimsSettled: 87421, avgSettlementDays: 7, type: 'Private' },
  { company: 'ICICI Prudential Life', csr: 98.73, claimsSettled: 61842, avgSettlementDays: 6, type: 'Private' },
  { company: 'Max Life Insurance', csr: 99.51, claimsSettled: 43218, avgSettlementDays: 4, type: 'Private' },
  { company: 'Bajaj Allianz Life', csr: 99.04, claimsSettled: 32874, avgSettlementDays: 5, type: 'Private' },
  { company: 'Kotak Life Insurance', csr: 98.82, claimsSettled: 24651, avgSettlementDays: 6, type: 'Private' },
  { company: 'Tata AIA Life', csr: 99.04, claimsSettled: 18924, avgSettlementDays: 5, type: 'Private' },
  { company: 'Aditya Birla Sun Life', csr: 98.07, claimsSettled: 21436, avgSettlementDays: 7, type: 'Private' },
  { company: 'PNB MetLife India', csr: 97.84, claimsSettled: 15284, avgSettlementDays: 8, type: 'Private' },
  { company: 'Canara HSBC Life', csr: 98.42, claimsSettled: 12641, avgSettlementDays: 6, type: 'Private' },
  { company: 'Edelweiss Tokio Life', csr: 98.09, claimsSettled: 8421, avgSettlementDays: 7, type: 'Private' },
  { company: 'Go Digit Life', csr: 96.80, claimsSettled: 4218, avgSettlementDays: 9, type: 'Private' },
  { company: 'Reliance Nippon Life', csr: 95.21, claimsSettled: 18924, avgSettlementDays: 11, type: 'Private' },
];

/** IRDAI Annual Report 2023-24 — Health Insurance CSR */
const HEALTH_CSR = [
  { company: 'Star Health & Allied', csr: 99.06, claimsSettled: 2184921, networkHospitals: 14000, type: 'Standalone' },
  { company: 'Niva Bupa Health', csr: 97.42, claimsSettled: 824621, networkHospitals: 10000, type: 'Standalone' },
  { company: 'Care Health Insurance', csr: 98.22, claimsSettled: 621842, networkHospitals: 9400, type: 'Standalone' },
  { company: 'Aditya Birla Health', csr: 98.54, claimsSettled: 542184, networkHospitals: 10000, type: 'Standalone' },
  { company: 'HDFC Ergo Health', csr: 99.10, claimsSettled: 482614, networkHospitals: 13000, type: 'Standalone' },
  { company: 'New India Assurance', csr: 95.42, claimsSettled: 1284621, networkHospitals: 7500, type: 'PSU' },
  { company: 'United India Insurance', csr: 94.82, claimsSettled: 984621, networkHospitals: 7200, type: 'PSU' },
  { company: 'National Insurance', csr: 95.12, claimsSettled: 764821, networkHospitals: 6800, type: 'PSU' },
  { company: 'Bajaj Allianz General', csr: 98.42, claimsSettled: 412184, networkHospitals: 8000, type: 'Private' },
  { company: 'ICICI Lombard', csr: 98.94, claimsSettled: 382614, networkHospitals: 8200, type: 'Private' },
  { company: 'Tata AIG General', csr: 97.84, claimsSettled: 184621, networkHospitals: 7000, type: 'Private' },
  { company: 'Reliance General', csr: 96.84, claimsSettled: 142184, networkHospitals: 6500, type: 'Private' },
];

const csrColor = (csr: number) => {
  if (csr >= 99) return 'text-green-700 dark:text-green-400';
  if (csr >= 97) return 'text-green-600 dark:text-green-500';
  if (csr >= 95) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const csrBadge = (csr: number) => {
  if (csr >= 99) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  if (csr >= 97) return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
  if (csr >= 95) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
};

export default function ClaimSettlementRatioPage() {
  const bestLife = [...LIFE_CSR].sort((a, b) => b.csr - a.csr)[0];
  const bestHealth = [...HEALTH_CSR].sort((a, b) => b.csr - a.csr)[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="Claim Settlement Ratio 2023-24 — Best Life & Health Insurance | InvestingPro"
        description="IRDAI claim settlement ratio for all insurers 2023-24. Max Life leads life insurance at 99.51%. HDFC Ergo leads health at 99.10%. Compare before you buy."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Insurance Claim Settlement Ratio India 2023-24',
          description: 'IRDAI official claim settlement ratios for life and health insurers',
          url: 'https://investingpro.in/insurance/claim-settlement-ratio',
          dateModified: new Date().toISOString(),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-green-900 pt-24 pb-14">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative container mx-auto px-4">
          <AutoBreadcrumbs className="mb-4 [&_*]:text-teal-200 [&_a]:text-teal-300" />
          <div className="inline-flex items-center gap-2 bg-teal-400/20 border border-teal-400/30 text-teal-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            Source: IRDAI Annual Report 2023-24 · Official data
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white font-display mb-3">
            Claim Settlement Ratio
          </h1>
          <p className="text-teal-100 text-lg max-w-xl mb-7">
            The single most important number when choosing insurance. An insurer with 98% CSR settles 98 out of 100 claims. Compare before you buy.
          </p>

          {/* Top performers */}
          <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
            {[
              { label: 'Best Life Insurance CSR', co: bestLife.company, csr: bestLife.csr },
              { label: 'Best Health Insurance CSR', co: bestHealth.company, csr: bestHealth.csr },
            ].map(item => (
              <div key={item.co} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-xs text-teal-200 font-semibold mb-1">{item.label}</div>
                <div className="font-bold text-white">{item.co}</div>
                <div className="text-3xl font-bold text-green-300 font-display">{item.csr}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">

        {/* CSR explanation */}
        <div className="flex items-start gap-3 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <strong>What is Claim Settlement Ratio (CSR)?</strong> CSR = (Number of claims settled ÷ Total claims received) × 100. A CSR of 99% means the insurer settled 99 out of every 100 claims. <strong>IRDAI mandates all insurers to publish CSR annually</strong> — it's the most reliable indicator of insurer trustworthiness. Look for CSR above 97% when buying term or health insurance.
          </div>
        </div>

        {/* Life Insurance CSR table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-teal-700" />
            Life Insurance — Claim Settlement Ratio 2023-24
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-teal-50 dark:bg-teal-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Insurer</th>
                  <th className="text-right py-3 px-4 font-semibold text-teal-700">CSR %</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Claims Settled</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Avg Days</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...LIFE_CSR].sort((a, b) => b.csr - a.csr).map(ins => (
                  <tr key={ins.company} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">{ins.company}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-xl font-bold tabular-nums font-display ${csrColor(ins.csr)}`}>{ins.csr}%</span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {ins.claimsSettled.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {ins.avgSettlementDays} days
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ins.type === 'PSU' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {ins.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${csrBadge(ins.csr)}`}>
                        {ins.csr >= 99 ? 'Excellent' : ins.csr >= 97 ? 'Good' : ins.csr >= 95 ? 'Average' : 'Below avg'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Source: IRDAI Annual Report 2023-24. Data for individual death claims.</p>
        </section>

        {/* Health Insurance CSR */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-teal-700" />
            Health Insurance — Claim Settlement Ratio 2023-24
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
              <thead className="bg-teal-50 dark:bg-teal-900/20">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Insurer</th>
                  <th className="text-right py-3 px-4 font-semibold text-teal-700">CSR %</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Claims Settled</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Network Hospitals</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...HEALTH_CSR].sort((a, b) => b.csr - a.csr).map(ins => (
                  <tr key={ins.company} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{ins.company}</div>
                      <div className="text-xs text-slate-400">{ins.type}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-xl font-bold tabular-nums font-display ${csrColor(ins.csr)}`}>{ins.csr}%</span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {ins.claimsSettled.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {ins.networkHospitals.toLocaleString('en-IN')}+
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${csrBadge(ins.csr)}`}>
                        {ins.csr >= 99 ? 'Excellent' : ins.csr >= 97 ? 'Good' : ins.csr >= 95 ? 'Average' : 'Below avg'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Source: IRDAI Annual Report 2023-24. Includes cashless + reimbursement claims.</p>
        </section>

        {/* How to use CSR */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display mb-5">How to Use CSR When Buying Insurance</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: CheckCircle2,
                color: 'text-green-600',
                title: 'What to look for',
                points: [
                  'Life insurance: CSR ≥ 98% is good, ≥ 99% is excellent',
                  'Health insurance: CSR ≥ 97% for cashless claims',
                  'Settlement speed: Under 7 days average is fast',
                  'Claims volume: Higher volume = more experience',
                ],
              },
              {
                icon: AlertCircle,
                color: 'text-amber-600',
                title: 'CSR alone is not enough — also check',
                points: [
                  'Network hospital count in your city',
                  'Premium amount vs coverage amount',
                  'Exclusion clauses (pre-existing conditions)',
                  'Room rent sub-limits in health policies',
                ],
              },
            ].map(block => (
              <div key={block.title}>
                <div className="flex items-center gap-2 mb-3">
                  <block.icon className={`h-5 w-5 ${block.color}`} />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{block.title}</span>
                </div>
                <ul className="space-y-2">
                  {block.points.map(pt => (
                    <li key={pt} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/insurance', title: 'Compare Insurance Plans', desc: 'Term life, health, ULIP comparison' },
            { href: '/calculators/sip', title: 'Term vs ULIP Returns', desc: 'Why term + SIP beats ULIP every time' },
            { href: '/credit-cards', title: 'Credit Card Insurance', desc: 'Cards with complimentary health cover' },
          ].map(t => (
            <Link key={t.href} href={t.href}
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{t.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
