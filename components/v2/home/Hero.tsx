import Link from "next/link";
import Image from "next/image";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  Shield,
  Building2,
  BarChart3,
  ArrowRight,
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
    <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Main hero — split layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — text content */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              India&apos;s Independent Finance Platform
            </div>

            {/* Headline */}
            <h1 className="text-[36px] sm:text-[48px] md:text-[56px] font-black leading-[1.05] tracking-tight text-gray-900 mb-6">
              Smart money decisions{" "}
              <span className="text-green-600">start here.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed mb-8">
              Compare credit cards, loans, mutual funds, and insurance from
              every major Indian provider. Independent research, real data, no
              paid rankings.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mb-8">
              {[
                { num: "1,000+", label: "Products" },
                { num: "228", label: "Articles" },
                { num: "75", label: "Calculators" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-gray-900">
                    {stat.num}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors rounded-lg"
              >
                Start Comparing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center px-7 py-3.5 border border-gray-300 text-gray-700 text-sm font-semibold hover:border-gray-400 transition-colors rounded-lg"
              >
                Read Our Research
              </Link>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-50">
              {/* Hero image — replace src with Grok image when ready */}
              <Image
                src="/images/hero-main.jpg"
                alt="Compare financial products on InvestingPro"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  // Hide image if not found, show gradient placeholder
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              {/* Floating stat cards over the image */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="text-xs text-gray-500">Best FD Rate Today</div>
                <div className="text-lg font-bold text-green-600">
                  9.10% p.a.
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="text-xs text-gray-500">Products Compared</div>
                <div className="text-lg font-bold text-gray-900">1,000+</div>
              </div>
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
                    <Icon className="w-4.5 h-4.5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {cat.count} tested
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
