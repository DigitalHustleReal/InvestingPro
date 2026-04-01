import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Shield, CalendarDays } from 'lucide-react';
import PPFNPSClient from './PPFNPSClient';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'PPF, NPS & Government Schemes (2026) — Compare & Calculate | InvestingPro',
  description: 'Compare PPF, NPS, Sukanya Samriddhi, SCSS, KVP, and NSC. Current rates, tax benefits, lock-in periods. Free calculators for every scheme.',
  openGraph: { title: 'PPF, NPS & Government Schemes (2026)', url: 'https://investingpro.in/ppf-nps' },
};

export default function PPFNPSPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'PPF NPS Government Schemes India 2026',
      description: 'Compare PPF, NPS, Sukanya Samriddhi, SCSS, KVP, and NSC. Current rates, tax benefits, lock-in periods. Free calculators for every scheme.',
      url: 'https://investingpro.in/ppf-nps',
      publisher: {
        '@type': 'Organization',
        name: 'InvestingPro',
        url: 'https://investingpro.in',
        logo: { '@type': 'ImageObject', url: 'https://investingpro.in/logo.png' },
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://investingpro.in' },
          { '@type': 'ListItem', position: 2, name: 'PPF & NPS', item: 'https://investingpro.in/ppf-nps' },
        ],
      },
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is the current PPF interest rate?', acceptedAnswer: { '@type': 'Answer', text: 'PPF rate is 7.1% per annum (Q1 FY2026-27), compounded annually. Reviewed quarterly by the government.' } },
      { '@type': 'Question', name: 'Is NPS better than PPF for retirement?', acceptedAnswer: { '@type': 'Answer', text: 'NPS offers market-linked returns (10-12% historical) with additional ₹50K 80CCD(1B) deduction. PPF gives guaranteed 7.1% with full tax-free maturity. NPS is better for higher returns, PPF for safety.' } },
    ] },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-6 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5"><ol className="flex items-center gap-1.5 text-[13px] text-gray-400"><li><Link href="/" className="hover:text-green-600 transition-colors">Home</Link></li><li><ChevronRight size={12} /></li><li className="text-gray-700 font-medium">PPF & NPS</li></ol></nav>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-[32px] font-bold text-[--v2-ink] tracking-tight leading-tight">PPF, NPS & Government Schemes</h1>
              <p className="text-[15px] text-gray-500 mt-2 max-w-xl leading-relaxed">Compare sovereign savings schemes. Current rates, tax benefits under 80C/80CCD, lock-in periods, and projected maturity values.</p>
            </div>
            <div className="flex items-center gap-5 text-[12px] text-gray-500 flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-green-600" />Government-backed</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-green-600" />Rates updated quarterly</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All Schemes','PPF','NPS','Sukanya Samriddhi','SCSS','KVP','NSC'].map((p, i) => (
              <Link key={p} href={i === 0 ? '/ppf-nps' : `/ppf-nps?scheme=${p.toLowerCase().replace(/ /g, '-')}`} className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 min-h-screen"><div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8"><PPFNPSClient /></div></section>
      <section className="bg-white border-t border-gray-200"><div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
        <h2 className="text-lg font-bold text-[--v2-ink] mb-5">Related Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ label: 'PPF Calculator', desc: '15-year maturity projection', href: '/calculators/ppf' },{ label: 'NPS Calculator', desc: 'Retirement corpus + pension estimate', href: '/calculators/nps' },{ label: 'Tax Saving 80C', desc: 'Maximize your 80C deductions', href: '/ppf-nps?filter=80c' },{ label: 'Retirement Planner', desc: 'Full retirement planning tool', href: '/calculators/retirement' }].map((t) => (
            <Link key={t.href} href={t.href} className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all group"><p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{t.label}</p><p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.desc}</p></Link>
          ))}
        </div>
      </div></section>
      <section className="bg-gray-50 border-t border-gray-200"><div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
        <h2 className="text-lg font-bold text-[--v2-ink] mb-5">Government Scheme FAQs</h2>
        <div className="space-y-2">
          {[
            { q: 'What is the current PPF interest rate?', a: 'PPF rate is 7.1% per annum (Q1 FY2026-27), compounded annually. The rate is reviewed every quarter by the Ministry of Finance. PPF has a 15-year lock-in with partial withdrawal allowed from year 7.' },
            { q: 'Is NPS better than PPF for retirement?', a: 'NPS offers market-linked returns (10-12% historical equity returns) with additional ₹50,000 deduction under 80CCD(1B). PPF gives guaranteed 7.1% with fully tax-free maturity. NPS is better for higher returns; PPF for guaranteed safety.' },
            { q: 'What is Sukanya Samriddhi Yojana (SSY)?', a: 'SSY is a government savings scheme for the girl child. Current rate: 8.2%. Maximum deposit: ₹1.5L/year. Matures when girl turns 21. Fully tax-free (EEE status) and qualifies for 80C.' },
            { q: 'Can I withdraw from PPF before 15 years?', a: 'Partial withdrawal is allowed from year 7 (up to 50% of balance). Premature closure is only allowed after 5 years for medical emergencies or higher education. Loan against PPF is available from year 3.' },
            { q: 'What is the maximum 80C deduction for government schemes?', a: 'Total Section 80C deduction is ₹1.5L per year. This covers PPF, ELSS, SSY, NSC, tax-saving FDs, and life insurance premium combined. NPS gets additional ₹50K under 80CCD(1B).' },
            { q: 'How does InvestingPro compare government schemes?', a: 'We compare current interest rates, tax treatment (EEE/EET), lock-in periods, withdrawal flexibility, and projected maturity values. All data sourced from official government notifications.' },
          ].map((f, i) => (
            <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden"><summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">{f.q}<ChevronRight size={16} className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4" /></summary><div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{f.a}</div></details>
          ))}
        </div>
      </div></section>
    </>
  );
}
