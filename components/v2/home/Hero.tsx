import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  Shield,
  Building2,
  BarChart3,
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
    <section className="bg-[#0A1F14] text-white">
      {/* Main hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-6">
            India&apos;s Most Opinionated Finance Platform
          </div>

          {/* Headline */}
          <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] font-black leading-[0.95] tracking-tight mb-6">
            We test products. <br className="hidden sm:block" />
            We crunch data. <br className="hidden sm:block" />
            <span className="text-[#D97706]">We tell you the truth.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10">
            228 researched articles. 75 free calculators. 1,000+ products
            compared. No paid rankings. Every opinion backed by disclosed
            methodology.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/compare"
              className="inline-flex items-center px-8 py-3 bg-[#16A34A] text-white font-data text-sm uppercase tracking-[2px] hover:bg-[#166534] transition-colors"
            >
              Start Comparing
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center px-8 py-3 border-2 border-white/30 text-white font-data text-sm uppercase tracking-[2px] hover:border-white transition-colors"
            >
              Read Our Research
            </Link>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group flex items-center gap-3 px-4 py-3 border border-white/10 hover:border-[#D97706]/50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#16A34A] group-hover:text-[#D97706] transition-colors" />
                  <div>
                    <div className="font-data text-[11px] uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
                      {cat.label}
                    </div>
                    <div className="font-data text-[10px] text-white/40">
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
