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
  iconBg: string;
  iconColor: string;
  desc: string;
  subLinks: { label: string; href: string }[];
}

const CATEGORIES: Category[] = [
  {
    label: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
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
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
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
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
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
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
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
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
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
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
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
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
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
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
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
          <h2 className="text-[28px] sm:text-[40px] font-medium leading-[1.08] tracking-tight text-ink">
            Every category.{" "}
            <em className="italic text-authority-green">
              Independently rated.
            </em>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Pick a topic. We did the research so you don&apos;t have to.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all"
              >
                <div
                  className={`w-12 h-12 ${cat.iconBg} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                </div>

                <Link href={cat.href}>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-1">
                    {cat.label}
                  </h3>
                </Link>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                  {cat.desc}
                </p>

                <div className="space-y-2 pt-3 border-t border-gray-100">
                  {cat.subLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-green-600 hover:text-green-700 transition-colors"
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
