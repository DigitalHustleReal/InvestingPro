import Link from 'next/link';
import { Star, Check } from 'lucide-react';

const PICKS = [
  {
    pick: true,
    logo: 'SBI', logoGradient: 'from-[#1B2A4A] to-[#2C3E5A]',
    name: 'SBI Cashback Card', bank: 'State Bank of India',
    score: 88, scoreColor: 'border-green-500 text-green-700',
    highlight: '5%', highlightSub: 'Cashback on ALL online — no restrictions',
    tags: [{ label: 'Most Applied', color: 'bg-green-50 text-green-700', check: true }, { label: 'Online', color: 'bg-blue-50 text-blue-700' }, { label: 'LTF Option', color: 'bg-orange-50 text-orange-700' }],
    fee: '₹999', href: '/credit-cards/sbi-cashback',
  },
  {
    logo: 'ICICI', logoGradient: 'from-[#92400E] to-[#B45309]',
    name: 'Amazon Pay ICICI', bank: 'ICICI Bank',
    score: 91, scoreColor: 'border-green-500 text-green-700',
    highlight: '5%', highlightSub: 'On Amazon · 2% everywhere · Free forever',
    tags: [{ label: 'Lifetime Free', color: 'bg-gray-100 text-gray-500' }, { label: 'Amazon', color: 'bg-blue-50 text-blue-700' }],
    fee: '₹0', href: '/credit-cards/amazon-pay-icici',
  },
  {
    logo: 'HDFC', logoGradient: 'from-[#B45309] to-[#78350F]',
    name: 'HDFC Millennia', bank: 'HDFC Bank',
    score: 72, scoreColor: 'border-[--v2-saffron] text-[--v2-saffron-dark]',
    highlight: '5%', highlightSub: 'Amazon, Flipkart, Swiggy, Zomato',
    tags: [{ label: 'Millennials', color: 'bg-blue-50 text-blue-700' }, { label: 'Dining', color: 'bg-green-50 text-green-700' }],
    fee: '₹1,000', href: '/credit-cards/hdfc-millennia',
  },
];

export default function TopPicks() {
  return (
    <section className="py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">InvestingPro&apos;s Picks</div>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              Top-rated products this <span className="text-green-600">week</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Ranked by real outcomes — not what pays us most.</p>
          </div>
          <Link href="/credit-cards" className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors">
            All 500+ cards →
          </Link>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {PICKS.map((card) => (
            <div key={card.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-green-500 hover:shadow-lg hover:shadow-green-900/[.06] hover:-translate-y-0.5">
              {card.pick && (
                <div className="bg-[--v2-saffron-glow] px-4 py-1.5 text-[11px] font-semibold text-[--v2-saffron-dark] border-b border-orange-100">
                  <Star size={12} className="inline text-amber-600 fill-amber-500" /> Editor&apos;s Pick · March 2026
                </div>
              )}
              <div className="p-4 flex items-start gap-3">
                <div className={`w-12 h-[30px] rounded-md bg-gradient-to-br ${card.logoGradient} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                  {card.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[--v2-ink]">{card.name}</div>
                  <div className="text-[11px] text-gray-500">{card.bank}</div>
                </div>
                <div className={`w-9 h-9 rounded-full border-[2.5px] flex items-center justify-center text-xs font-bold shrink-0 ${card.scoreColor}`}>
                  {card.score}
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="font-serif italic text-2xl text-[--v2-ink]">{card.highlight}</div>
                <div className="text-xs text-gray-500 mt-0.5">{card.highlightSub}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.tags.map((tag) => (
                    <span key={tag.label} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tag.color}`}>
                      {(tag as any).check && <Check size={10} strokeWidth={3} />}
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Annual: <strong className="text-[--v2-ink]">{card.fee}</strong></span>
                <Link href={card.href} className="px-3.5 py-2.5 bg-green-600 text-white rounded-md text-xs font-semibold hover:bg-green-700 transition-colors">
                  Apply Now →
                </Link>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400">
                InvestingPro Research · 23 data points
              </div>
              {/* Score aria-label for accessibility */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
