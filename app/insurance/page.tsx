import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Shield, CalendarDays } from 'lucide-react';
import InsuranceClient from './InsuranceClient';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Best Insurance Plans in India (2026) — Compare & Buy | InvestingPro',
  description: 'Compare term life, health, car, and travel insurance from 20+ insurers. Check claim settlement ratios. Independent ratings.',
  openGraph: { title: 'Best Insurance Plans in India (2026)', url: 'https://investingpro.in/insurance' },
};

export default function InsurancePage() {
  const structuredData = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Best Insurance Plans India 2026', url: 'https://investingpro.in/insurance' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is the best term insurance plan in India?', acceptedAnswer: { '@type': 'Answer', text: 'Plans with high claim settlement ratios (>98%) and low premiums. LIC, HDFC Life, and ICICI Prudential consistently rank well.' } },
      { '@type': 'Question', name: 'How much health insurance cover do I need?', acceptedAnswer: { '@type': 'Answer', text: 'Minimum ₹10L for individuals, ₹25L for families in metros. Factor in medical inflation of 14% annually.' } },
    ] },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5"><ol className="flex items-center gap-1.5 text-[13px] text-gray-400"><li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li><li><ChevronRight size={12} /></li><li className="text-gray-700 font-medium">Insurance</li></ol></nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">Best Insurance Plans in India</h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">Compare term, health, life, car, and travel insurance. We track claim settlement ratios so you can choose with confidence.</p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-gray-500 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-green-600" />Claim data verified</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-green-600" />Updated quarterly</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All Plans','Term Life','Health','Life','Car','Travel','Bike'].map((p, i) => (
              <Link key={p} href={i === 0 ? '/insurance' : `/insurance?type=${p.toLowerCase().replace(' ', '-')}`} className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen"><div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8"><InsuranceClient /></div></section>
      <section className="bg-white border-t border-gray-200"><div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
        <h2 className="text-lg font-bold text-[--v2-ink] mb-5">Related Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ label: 'Coverage Calculator', desc: 'Find how much coverage you need', href: '/calculators/insurance' },{ label: 'Compare Plans', desc: 'Side-by-side insurer comparison', href: '/insurance/compare' },{ label: 'Claim Settlement Data', desc: 'Which insurers actually pay claims', href: '/insurance/claims' },{ label: 'Insurance Guide', desc: 'Everything you need to know', href: '/insurance/guides' }].map((t) => (
            <Link key={t.href} href={t.href} className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"><p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{t.label}</p><p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.desc}</p></Link>
          ))}
        </div>
      </div></section>
      <section className="bg-gray-50 border-t border-gray-200"><div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
        <h2 className="text-lg font-bold text-[--v2-ink] mb-5">Insurance FAQs</h2>
        <div className="space-y-2">
          {[
            { q: 'What is term insurance and do I need it?', a: 'Term insurance is pure life cover — it pays your family if you die during the policy term. If anyone depends on your income, you need it. It is the most affordable form of life insurance.' },
            { q: 'How much health insurance cover should I have?', a: 'Minimum ₹10L for individuals, ₹25L+ for families in metros. Medical inflation runs at 14% annually — what costs ₹5L today will cost ₹20L in 10 years.' },
            { q: 'What is claim settlement ratio and why does it matter?', a: 'CSR tells you what percentage of claims an insurer actually pays. Look for 95%+ CSR. We track this data for every insurer on our platform.' },
            { q: 'Should I buy insurance online or through an agent?', a: 'Online plans are typically 10-30% cheaper (no agent commission). The coverage is identical. We recommend buying directly from the insurer website.' },
            { q: 'Is health insurance tax deductible?', a: 'Yes. Premiums up to ₹25,000 (₹50,000 for senior citizens) qualify for Section 80D deduction. This applies to self, spouse, children, and parents.' },
            { q: 'How does InvestingPro rate insurance plans?', a: 'We evaluate on premium value, claim settlement ratio, network hospitals, coverage limits, exclusions, and customer reviews. No insurer pays for higher placement.' },
          ].map((f, i) => (
            <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">{f.q}<ChevronRight size={16} className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" /></summary><div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{f.a}</div></details>
          ))}
        </div>
      </div></section>
    </>
  );
}
