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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Category {
  label: string;
  href: string;
  icon: LucideIcon;
  headline: string;
  subLinks: { label: string; href: string }[];
}

const CATEGORIES: Category[] = [
  {
    label: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
    headline: "Find the right card for how you spend",
    subLinks: [
      { label: "Best rewards cards", href: "/credit-cards?filter=rewards" },
      { label: "No annual fee", href: "/credit-cards?filter=no-fee" },
      { label: "Travel cards", href: "/credit-cards?filter=travel" },
    ],
  },
  {
    label: "Mutual Funds",
    href: "/mutual-funds",
    icon: TrendingUp,
    headline: "Research funds with independent data",
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
    headline: "Compare rates across all lenders",
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
    headline: "Find the best FD rates today",
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
    headline: "Open the right demat for your needs",
    subLinks: [
      { label: "Discount brokers", href: "/demat-accounts?type=discount" },
      { label: "Compare brokers", href: "/demat-accounts/compare" },
    ],
  },
  {
    label: "Insurance",
    href: "/insurance",
    icon: Shield,
    headline: "Understand your options clearly",
    subLinks: [
      { label: "Term life", href: "/insurance?type=term" },
      { label: "Health insurance", href: "/insurance?type=health" },
    ],
  },
  {
    label: "PPF & NPS",
    href: "/ppf-nps",
    icon: Building2,
    headline: "Government-backed savings & retirement",
    subLinks: [
      {
        label: "PPF vs NPS",
        href: "/articles/ppf-vs-nps-which-is-better-for-retirement-savings",
      },
      { label: "PPF calculator", href: "/calculators/ppf" },
    ],
  },
];

export default function ExploreCategories() {
  return (
    <section className="py-16 md:py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="font-data text-[11px] uppercase tracking-[4px] text-[#D97706] mb-3">
            Explore
          </div>
          <h2 className="font-display text-[28px] sm:text-[36px] font-black leading-[1.0] tracking-tight text-[#0A1F14] dark:text-white">
            Every category.{" "}
            <span className="text-[#D97706]">Independently rated.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                className={`p-6 ${
                  i < CATEGORIES.length - 1
                    ? "border-b sm:border-r border-gray-200 dark:border-white/10"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#16A34A]" />
                </div>
                <Link href={cat.href}>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white hover:text-[#16A34A] transition-colors mb-1">
                    {cat.label}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-white/50 mb-4">
                  {cat.headline}
                </p>
                <div className="space-y-1.5">
                  {cat.subLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block font-data text-[11px] uppercase tracking-wider text-[#D97706] hover:text-[#B45309] transition-colors"
                    >
                      {sub.label} &rarr;
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
