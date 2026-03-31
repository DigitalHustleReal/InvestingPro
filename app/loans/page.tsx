import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Shield, CalendarDays } from 'lucide-react';
import { getLoansServer } from '@/lib/products/get-loans-server';
import LoansClient from './LoansClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Best Loans in India (2026) — Compare Rates & Apply | InvestingPro',
  description: 'Compare personal loans, home loans, car loans, and education loans from 60+ lenders. Lowest interest rates, instant eligibility check, EMI calculator.',
  openGraph: {
    title: 'Best Loans in India (2026) — Compare Rates & Apply',
    description: 'Compare 60+ lenders. Independent research, lowest rates, instant apply.',
    url: 'https://investingpro.in/loans',
  },
};

export default async function LoansPage() {
  let loans: any[] = [];
  try { loans = await getLoansServer(); } catch { loans = []; }
  const count = loans.length > 0 ? loans.length : 60;

  const structuredData = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Best Loans in India 2026', url: 'https://investingpro.in/loans', numberOfItems: count },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is the lowest home loan interest rate in India?', acceptedAnswer: { '@type': 'Answer', text: 'As of 2026, SBI offers home loans starting at 8.50%. Rates vary by lender, loan amount, and credit score.' } },
      { '@type': 'Question', name: 'How is EMI calculated?', acceptedAnswer: { '@type': 'Answer', text: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate, and n is tenure in months.' } },
      { '@type': 'Question', name: 'Does checking loan eligibility affect my credit score?', acceptedAnswer: { '@type': 'Answer', text: 'Soft inquiries (eligibility checks) do not affect your score. Only formal applications trigger hard inquiries.' } },
    ] },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-gray-400">
              <li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li>
              <li><ChevronRight size={12} /></li>
              <li className="text-gray-700 font-medium">Loans</li>
            </ol>
          </nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">Best Loans in India</h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">Compare {count}+ loan products from top banks and NBFCs. Filter by type, rate, and tenure. Independent ratings.</p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-gray-500 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-green-600" />Independent ratings</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-green-600" />Updated daily</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All Loans','Personal','Home','Car','Education','Gold','Business'].map((p, i) => (
              <Link key={p} href={i === 0 ? '/loans' : `/loans?type=${p.toLowerCase()}`} className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8">
          <LoansClient initialLoans={loans} />
        </div>
      </section>
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">Related Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{ label: 'EMI Calculator', desc: 'Calculate monthly EMI for any loan', href: '/calculators/emi' },{ label: 'Eligibility Checker', desc: 'Check if you qualify before applying', href: '/loans/eligibility-checker' },{ label: 'Home Loan vs SIP', desc: 'Should you prepay or invest?', href: '/calculators/home-loan-vs-sip' },{ label: 'Compare Loans', desc: 'Side-by-side lender comparison', href: '/loans/compare' }].map((t) => (
              <Link key={t.href} href={t.href} className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{t.label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-[--v2-ink] mb-5">Loan FAQs</h2>
          <div className="space-y-2">
            {[
              { q: 'What is the lowest home loan interest rate in India?', a: 'As of 2026, SBI offers home loans starting at 8.50%. Rates vary by lender, loan amount, and credit score. Use our comparison tool to find the best rate for your profile.' },
              { q: 'How is EMI calculated?', a: 'EMI depends on three factors: principal amount, interest rate, and tenure. Use our EMI calculator to get an exact figure with amortization schedule.' },
              { q: 'Does checking loan eligibility affect my credit score?', a: 'Soft inquiries (eligibility checks on our platform) do not affect your score. Only formal loan applications trigger hard inquiries.' },
              { q: 'What credit score do I need for a personal loan?', a: 'Most banks require 700+ for personal loans. Some NBFCs accept 650+. Higher scores get lower interest rates.' },
              { q: 'Should I prepay my loan or invest the money?', a: 'If your loan rate exceeds expected investment returns (after tax), prepay. Use our Home Loan vs SIP calculator to compare.' },
              { q: 'How does InvestingPro compare loans?', a: 'We evaluate loans on 18 data points including interest rate, processing fee, prepayment charges, tenure flexibility, and eligibility criteria. No lender pays for higher placement.' },
            ].map((f, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">{f.q}<ChevronRight size={16} className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" /></summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
