import Link from 'next/link';
import { CreditCard, TrendingUp, Landmark, Shield, Building2, Calculator, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const CATEGORIES: { label: string; sub: string; href: string; icon: LucideIcon; color: string }[] = [
  { label: 'Credit Cards', sub: '500+ cards', href: '/credit-cards', icon: CreditCard, color: 'text-green-600' },
  { label: 'Mutual Funds', sub: '2,000+ funds', href: '/mutual-funds', icon: TrendingUp, color: 'text-blue-600' },
  { label: 'Loans', sub: '30+ lenders', href: '/loans', icon: Landmark, color: 'text-red-600' },
  { label: 'Insurance', sub: '20+ insurers', href: '/insurance', icon: Shield, color: 'text-green-600' },
  { label: 'Fixed Deposits', sub: '50+ banks', href: '/fixed-deposits', icon: Building2, color: 'text-amber-600' },
  { label: 'Calculators', sub: '25 free tools', href: '/calculators', icon: Calculator, color: 'text-green-600' },
];

export default function Hero() {
  return (
    <section className="relative py-12 md:py-16 lg:py-20 px-4 lg:px-8 text-center overflow-hidden">
      {/* Geometric grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgba(22,163,74,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Green radial glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(22,163,74,.06)_0%,rgba(22,163,74,.02)_40%,transparent_70%)] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 font-medium mb-5">
          <Shield size={13} className="text-green-600" />
          No paid rankings. Ever.
          <Link href="/methodology" className="text-green-600 ml-1">
            See how we rate →
          </Link>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] md:text-[44px] lg:text-[52px] font-bold text-[--v2-ink] leading-[1.1] tracking-tight mb-4">
          India&apos;s most trusted<br />
          <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            financial comparison
          </span>
          <br />platform
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-500 max-w-[560px] mx-auto mb-7 leading-relaxed">
          Compare 500+ credit cards, 2,000+ mutual funds, and 60+ loan products. Independent research. Free forever.
        </p>

        {/* Trust signals */}
        <div className="flex justify-center gap-4 md:gap-6 flex-wrap text-[13px] text-gray-600 mb-9">
          {['Independent ratings', 'Updated daily', '25 free calculators', 'No phone spam'].map((text) => (
            <span key={text} className="flex items-center gap-1.5">
              <Check size={14} className="text-green-600" strokeWidth={3} />
              {text}
            </span>
          ))}
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3 max-w-[840px] mx-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="group bg-white border border-gray-200 rounded-xl px-3 py-4 md:py-5 text-center transition-all duration-200 hover:border-green-500 hover:shadow-lg hover:shadow-green-900/[.06] hover:-translate-y-0.5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/[.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                <div className="relative">
                  <div className="flex justify-center mb-2">
                    <Icon size={22} className={cat.color} />
                  </div>
                  <div className="text-xs font-semibold text-[--v2-ink]">{cat.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{cat.sub}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
