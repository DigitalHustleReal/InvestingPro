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
    <section className="bg-[#FAFAF9]">
      {/* Main hero — split layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — text content */}
          <div>
            {/* Eyebrow */}
            <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-6">
              India&apos;s Independent Finance Platform
            </div>

            {/* Headline — Playfair Display */}
            <h1 className="font-display text-[36px] sm:text-[48px] md:text-[56px] font-black leading-[1.05] tracking-tight text-[#0A1F14] mb-6">
              Smart money decisions{" "}
              <span className="text-[#D97706]">start here.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg text-[#0A1F14]/50 max-w-lg leading-relaxed mb-8">
              Compare credit cards, loans, mutual funds, and insurance from
              every major Indian provider. Independent research, real data, no
              paid rankings.
            </p>

            {/* Stats row — monospace */}
            <div className="flex items-center gap-8 mb-10 pb-10 border-b-2 border-[#0A1F14]/10">
              {[
                { num: "1,000+", label: "Products" },
                { num: "228", label: "Articles" },
                { num: "75", label: "Calculators" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-data text-2xl font-bold text-[#0A1F14]">
                    {stat.num}
                  </div>
                  <div className="font-data text-[10px] uppercase tracking-widest text-[#0A1F14]/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs — sharp corners */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#16A34A] text-white font-data text-sm uppercase tracking-[2px] hover:bg-[#166534] transition-colors"
              >
                Start Comparing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center px-7 py-3.5 border-2 border-[#0A1F14]/20 text-[#0A1F14] font-data text-sm uppercase tracking-[2px] hover:border-[#0A1F14] transition-colors"
              >
                Read Our Research
              </Link>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#166534]/5 to-[#D97706]/5">
              {/* Hero image — replace src with Grok image when ready */}
              <Image
                src="/images/hero-main.jpg"
                alt="Compare financial products on InvestingPro"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              {/* Floating stat cards — sharp, monospace */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg border-l-4 border-[#16A34A]">
                <div className="font-data text-[10px] uppercase tracking-widest text-[#0A1F14]/50">
                  Best FD Rate Today
                </div>
                <div className="font-data text-xl font-bold text-[#16A34A]">
                  9.10% p.a.
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg border-l-4 border-[#D97706]">
                <div className="font-data text-[10px] uppercase tracking-widest text-[#0A1F14]/50">
                  Products Compared
                </div>
                <div className="font-data text-xl font-bold text-[#0A1F14]">
                  1,000+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category strip — sharp corners, our design language */}
      <div className="border-y-2 border-[#0A1F14]/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group flex items-center gap-3 px-4 py-3 border-2 border-[#0A1F14]/10 hover:border-[#0A1F14]/30 transition-all"
                >
                  <Icon className="w-5 h-5 text-[#16A34A] group-hover:text-[#D97706] transition-colors" />
                  <div>
                    <div className="text-[13px] font-semibold text-[#0A1F14] group-hover:text-[#166534] transition-colors">
                      {cat.label}
                    </div>
                    <div className="font-data text-[10px] text-[#0A1F14]/40">
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
