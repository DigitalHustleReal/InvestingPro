import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  Shield,
  Building2,
  BarChart3,
  ArrowRight,
  Star,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORIES: {
  label: string;
  href: string;
  icon: LucideIcon;
  count: string;
}[] = [
  {
    label: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
    count: "36",
  },
  {
    label: "Mutual Funds",
    href: "/mutual-funds",
    icon: TrendingUp,
    count: "962",
  },
  { label: "Loans", href: "/loans", icon: Landmark, count: "28" },
  { label: "Insurance", href: "/insurance", icon: Shield, count: "50+" },
  {
    label: "Demat Accounts",
    href: "/demat-accounts",
    icon: Building2,
    count: "15",
  },
  {
    label: "Fixed Deposits",
    href: "/fixed-deposits",
    icon: BarChart3,
    count: "40+",
  },
];

export default function Hero() {
  return (
    <section className="bg-white">
      {/* Main hero — split layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div>
            <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-5">
              India&apos;s Independent Finance Platform
            </div>

            <h1 className="font-display text-[36px] sm:text-[44px] md:text-[52px] font-black leading-[1.08] tracking-tight text-gray-900 mb-5">
              Smart money decisions{" "}
              <span className="text-green-600">start here.</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-lg leading-relaxed mb-8">
              Compare credit cards, loans, mutual funds, and insurance from
              every major Indian provider. Independent research, no paid
              rankings.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-8">
              {[
                { num: "1,000+", label: "Products" },
                { num: "228", label: "Articles" },
                { num: "75", label: "Calculators" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-gray-900">
                    {s.num}
                  </div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/credit-cards"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors rounded-lg"
              >
                Start Comparing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/calculators"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 text-sm font-semibold hover:border-gray-400 transition-colors rounded-lg"
              >
                Try a Calculator
              </Link>
            </div>
          </div>

          {/* Right — live product comparison preview */}
          <div className="hidden lg:block">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Compare Products
                  </div>
                  <div className="text-sm font-bold text-gray-900 mt-0.5">
                    Credit Cards — Top Rated
                  </div>
                </div>
                <Link
                  href="/credit-cards"
                  className="text-xs text-green-600 font-semibold hover:underline"
                >
                  View all →
                </Link>
              </div>

              {/* Product cards */}
              <div className="space-y-3">
                {[
                  {
                    name: "SBI Cashback Card",
                    provider: "SBI Cards",
                    score: "4.8",
                    fee: "₹999/yr",
                    reward: "5% cashback",
                    best: true,
                  },
                  {
                    name: "HDFC Regalia Gold",
                    provider: "HDFC Bank",
                    score: "4.6",
                    fee: "₹2,500/yr",
                    reward: "4x rewards",
                    best: false,
                  },
                  {
                    name: "Axis Ace Credit Card",
                    provider: "Axis Bank",
                    score: "4.5",
                    fee: "₹499/yr",
                    reward: "2% cashback",
                    best: false,
                  },
                ].map((card) => (
                  <div
                    key={card.name}
                    className={`relative bg-white rounded-xl p-4 border ${card.best ? "border-green-300 ring-1 ring-green-100" : "border-gray-200"}`}
                  >
                    {card.best && (
                      <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                        Best Pick
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {card.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {card.provider}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                        <span className="text-sm font-bold text-green-700">
                          {card.score}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        {card.reward}
                      </div>
                      <div className="text-xs text-gray-400">{card.fee}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <Link
                href="/credit-cards"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Compare all 36 cards <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900">
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {cat.count} compared
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
