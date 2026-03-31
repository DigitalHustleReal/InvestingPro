import Link from 'next/link';

const ARTICLES = [
  {
    tag: 'Credit Cards', tagBg: 'bg-blue-600/80',
    gradient: 'from-[#1B2A4A] to-[#2C4A6A]',
    title: 'The hidden cost of "lifetime free" cards',
    excerpt: 'Lifetime free sounds great until you see the 0.5% reward rate and 3.5% forex markup. We did the math on 12 "free" cards.',
    time: '5 min', href: '/articles/hidden-cost-lifetime-free-cards',
  },
  {
    tag: 'Mutual Funds', tagBg: 'bg-green-600/80',
    gradient: 'from-[#14563B] to-[#1A6B4A]',
    title: 'Index funds vs active: the data is clear',
    excerpt: '10 years of data shows when active wins — and when you\'re paying fees for nothing.',
    time: '8 min', href: '/articles/index-vs-active-funds',
  },
  {
    tag: 'Tax', tagBg: 'bg-orange-600/80',
    gradient: 'from-[#92400E] to-[#B45309]',
    title: 'Old vs New regime: the breakpoint most get wrong',
    excerpt: 'Most tools ignore HRA, NPS, and employer PF. The real breakpoint is ₹14.2L, not ₹12L.',
    time: '6 min', href: '/articles/old-vs-new-tax-regime',
  },
];

export default function Editorial() {
  return (
    <section className="py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Research Desk</div>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              Honest analysis you won&apos;t find <span className="text-green-600">elsewhere</span>
            </h2>
          </div>
          <Link href="/articles" className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors">
            All articles →
          </Link>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((art) => (
            <Link key={art.title} href={art.href} className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5">
              <div className={`h-28 bg-gradient-to-br ${art.gradient} relative flex items-end p-3.5`} aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white ${art.tagBg}`}>
                  {art.tag}
                </span>
                <h3 className="text-[15px] font-semibold text-white leading-snug relative z-10">{art.title}</h3>
              </div>
              <div className="p-3.5">
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{art.excerpt}</p>
                <div className="mt-2 text-[11px] text-gray-500 flex gap-2">
                  <span>InvestingPro Research</span>
                  <span>{art.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
