import Link from 'next/link';

const PULSE_ITEMS = [
  {
    tag: 'FD Rates', tagColor: 'bg-green-50 text-green-700',
    title: 'SBI cuts FD rates by 0.15% — lock in now?',
    take: 'Shriram Finance (8.35%) before next cut. Seniors get +0.5%.',
    date: 'Mar 29',
  },
  {
    tag: 'Credit Cards', tagColor: 'bg-blue-50 text-blue-700',
    title: 'Axis launches ACE Select — worth ₹999?',
    take: '12 lounges/year vs 8. Worth it only if you fly 6+ times.',
    date: 'Mar 28',
  },
  {
    tag: 'Tax', tagColor: 'bg-orange-50 text-orange-700',
    title: '42 days to save ₹46,800 under 80C',
    take: 'ELSS gives 12% avg returns with 3yr lock-in. Don\'t wait.',
    date: 'Mar 27',
  },
  {
    tag: 'Loans', tagColor: 'bg-red-50 text-red-700',
    title: 'RBI holds at 6.5% — EMI stays the same',
    take: 'Loan above 9%? Refinance. SBI offers 8.5% for transfers.',
    date: 'Mar 26',
  },
];

export default function MarketPulse() {
  return (
    <section className="relative py-12 md:py-16 px-4 lg:px-8 bg-[--v2-cream] overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(27,42,74,.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">This Week</div>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              What&apos;s moving your <span className="text-green-600">money</span>
            </h2>
          </div>
          <Link href="/articles" className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors">
            All updates →
          </Link>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {PULSE_ITEMS.map((item) => (
            <article
              key={item.title}
              className="bg-white border border-[--v2-cream-border] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide mb-2 ${item.tagColor}`}>
                {item.tag}
              </span>
              <h3 className="text-sm font-semibold text-[--v2-ink] leading-snug mb-1.5">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.take}</p>
              <div className="mt-2 text-[11px] text-gray-500">InvestingPro Research · {item.date}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
