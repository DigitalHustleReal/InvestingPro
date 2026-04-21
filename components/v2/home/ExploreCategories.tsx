"use client";

import React from "react";
import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  PiggyBank,
  BarChart3,
  Shield,
  Building2,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Category {
  label: string;
  href: string;
  icon: LucideIcon;
  count: string;
  desc: string;
  subLinks: { label: string; href: string }[];
}

const CATEGORIES: Category[] = [
  {
    label: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
    count: "36 TESTED",
    desc: "Compare 36 cards across rewards, cashback, travel, and no-fee categories.",
    subLinks: [
      { label: "Best rewards cards", href: "/credit-cards?filter=rewards" },
      { label: "No annual fee cards", href: "/credit-cards?filter=no-fee" },
      { label: "Find your card", href: "/credit-cards/find-your-card" },
    ],
  },
  {
    label: "Mutual Funds",
    href: "/mutual-funds",
    icon: TrendingUp,
    count: "962 TRACKED",
    desc: "Track NAV, returns, and expense ratios across 40+ AMCs.",
    subLinks: [
      { label: "Top equity funds", href: "/mutual-funds?type=equity" },
      { label: "Index funds", href: "/mutual-funds?type=index" },
      { label: "SIP calculator", href: "/calculators/sip" },
    ],
  },
  {
    label: "Loans",
    href: "/loans",
    icon: Landmark,
    count: "60+ LENDERS",
    desc: "Personal, home, car, education, and gold loans from 60+ lenders.",
    subLinks: [
      { label: "Home loan rates", href: "/loans?type=home" },
      { label: "Personal loans", href: "/loans?type=personal" },
      { label: "EMI calculator", href: "/calculators/emi" },
    ],
  },
  {
    label: "Fixed Deposits",
    href: "/fixed-deposits",
    icon: PiggyBank,
    count: "50+ BANKS",
    desc: "Compare rates from 50+ banks including senior citizen and tax-saving FDs.",
    subLinks: [
      { label: "Highest FD rates", href: "/fixed-deposits?sort=rate" },
      { label: "Tax-saving FDs", href: "/fixed-deposits?filter=tax-saving" },
      { label: "FD calculator", href: "/calculators/fd" },
    ],
  },
  {
    label: "Demat Accounts",
    href: "/demat-accounts",
    icon: BarChart3,
    count: "15+ BROKERS",
    desc: "Compare brokerage charges, platforms, and features across brokers.",
    subLinks: [
      { label: "Discount brokers", href: "/demat-accounts?type=discount" },
      { label: "Compare brokers", href: "/demat-accounts/compare" },
      { label: "Brokerage calculator", href: "/calculators/brokerage" },
    ],
  },
  {
    label: "Insurance",
    href: "/insurance",
    icon: Shield,
    count: "100+ PLANS",
    desc: "Term, health, car insurance with verified claim settlement ratios.",
    subLinks: [
      { label: "Term life insurance", href: "/insurance?type=term" },
      { label: "Health insurance", href: "/insurance?type=health" },
      { label: "Coverage calculator", href: "/calculators/insurance" },
    ],
  },
  {
    label: "Tax Planning",
    href: "/calculators/tax",
    icon: Building2,
    count: "75 CALCS",
    desc: "Old vs New regime comparison, 80C optimizer, and HRA calculator.",
    subLinks: [
      { label: "Old vs New regime", href: "/calculators/old-vs-new-tax" },
      { label: "HRA calculator", href: "/calculators/hra" },
      { label: "Tax saving guide", href: "/articles/tax-saving-guide" },
    ],
  },
  {
    label: "PPF & NPS",
    href: "/ppf-nps",
    icon: Building2,
    count: "10+ SCHEMES",
    desc: "Compare PPF, NPS, and other post office schemes with calculators.",
    subLinks: [
      { label: "PPF calculator", href: "/calculators/ppf" },
      { label: "NPS calculator", href: "/calculators/nps" },
      {
        label: "PPF vs NPS",
        href: "/articles/ppf-vs-nps-which-is-better-for-retirement-savings",
      },
    ],
  },
];

export default function ExploreCategories() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
            Every category.{" "}
            <em className="italic text-indian-gold">Independently rated.</em>
          </h2>
          <p className="text-sm text-ink-60 mt-2">
            Pick a topic. We did the research so you don&apos;t have to.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                className="group bg-white border-2 border-ink/10 rounded-sm p-5 hover:border-ink/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indian-gold/10 rounded-sm flex items-center justify-center">
                    <Icon className="w-6 h-6 text-indian-gold" />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-60 border border-ink/15 px-1.5 py-0.5">
                    {cat.count}
                  </span>
                </div>

                <Link href={cat.href}>
                  <h3 className="font-display font-bold text-lg text-ink group-hover:text-authority-green transition-colors mb-1">
                    {cat.label}
                  </h3>
                </Link>
                <p className="text-[13px] text-ink-60 leading-relaxed mb-4">
                  {cat.desc}
                </p>

                <div className="space-y-2 pt-3 border-t border-gray-100">
                  {cat.subLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-action-green hover:text-authority-green transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
