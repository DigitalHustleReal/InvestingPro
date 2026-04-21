"use client";

import { useState } from "react";
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
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ResourceSection {
  icon: LucideIcon;
  label: string;
  desc: string;
  stat: string;
  statLabel: string;
  primaryLink: { label: string; href: string };
  links: { label: string; href: string; desc: string }[];
}

const SECTIONS: ResourceSection[] = [
  {
    icon: CreditCard,
    label: "Credit Cards",
    desc: "We've reviewed and rated 36 credit cards across rewards, cashback, travel, and no-fee categories to help you find the one that fits your spending.",
    stat: "36",
    statLabel: "cards compared",
    primaryLink: { label: "Best Credit Cards", href: "/credit-cards" },
    links: [
      {
        label: "Save money with cashback cards",
        desc: "Up to 5% cashback on everyday spending",
        href: "/credit-cards?filter=cashback",
      },
      {
        label: "Find your next credit card",
        desc: "Personalized recommendation in 30 seconds",
        href: "/credit-cards/find-your-card",
      },
      {
        label: "Compare cards side-by-side",
        desc: "See features, fees, and rewards compared",
        href: "/credit-cards/compare",
      },
    ],
  },
  {
    icon: Landmark,
    label: "Loans",
    desc: "Compare home, personal, car, education, and gold loan rates from 60+ lenders. See real EMI breakdowns before you apply.",
    stat: "8.35%",
    statLabel: "lowest home loan rate",
    primaryLink: { label: "Best Loan Rates", href: "/loans" },
    links: [
      {
        label: "Calculate your EMI",
        desc: "Get exact monthly payment before you apply",
        href: "/calculators/emi",
      },
      {
        label: "Home loan vs SIP",
        desc: "Should you prepay or invest the extra money?",
        href: "/calculators/home-loan-vs-sip",
      },
      {
        label: "Check loan eligibility",
        desc: "Know your chances before the hard inquiry",
        href: "/loans/eligibility-checker",
      },
    ],
  },
  {
    icon: TrendingUp,
    label: "Investing",
    desc: "Research mutual funds, stocks, and index funds with independent analysis. Track NAV, returns, and expense ratios across 40+ AMCs.",
    stat: "962",
    statLabel: "funds tracked",
    primaryLink: { label: "Best Mutual Funds", href: "/mutual-funds" },
    links: [
      {
        label: "SIP Calculator",
        desc: "See how \u20B910K/month grows over 20 years",
        href: "/calculators/sip",
      },
      {
        label: "Fund overlap checker",
        desc: "Are your 5 funds actually the same fund?",
        href: "/mutual-funds/overlap-checker",
      },
      {
        label: "Index vs active funds",
        desc: "10 years of data \u2014 when does active win?",
        href: "/mutual-funds/compare/index-vs-active",
      },
    ],
  },
  {
    icon: Shield,
    label: "Insurance",
    desc: "Compare term, health, and car insurance with verified claim settlement ratios from IRDAI. Know which insurers actually pay.",
    stat: "97%",
    statLabel: "top claim settlement",
    primaryLink: { label: "Best Insurance Plans", href: "/insurance" },
    links: [
      {
        label: "How much term cover?",
        desc: "Calculate your family\u2019s actual coverage need",
        href: "/calculators/insurance",
      },
      {
        label: "Claim settlement data",
        desc: "Which insurers actually pay when it matters",
        href: "/insurance/claims",
      },
      {
        label: "Term vs whole life",
        desc: "Pure protection vs savings \u2014 the real math",
        href: "/insurance/compare/term-vs-whole-life",
      },
    ],
  },
  {
    icon: PiggyBank,
    label: "Banking & FDs",
    desc: "Find the best savings rates and fixed deposit options from 50+ banks. Including senior citizen and tax-saving FDs.",
    stat: "9.10%",
    statLabel: "best FD rate",
    primaryLink: { label: "Best FD Rates", href: "/fixed-deposits" },
    links: [
      {
        label: "FD calculator",
        desc: "Calculate maturity amount for any tenure and rate",
        href: "/calculators/fd",
      },
      {
        label: "Senior citizen FDs",
        desc: "Extra 0.25\u20130.50% rates for senior citizens",
        href: "/fixed-deposits?filter=senior",
      },
      {
        label: "FD vs debt funds",
        desc: "After-tax returns compared across tenures",
        href: "/mutual-funds/compare/debt-vs-fd",
      },
    ],
  },
  {
    icon: BarChart3,
    label: "Demat Accounts",
    desc: "Open the right trading account for your needs. Compare brokerage charges, platforms, and features across discount and full-service brokers.",
    stat: "\u20B920",
    statLabel: "per trade (discount)",
    primaryLink: { label: "Best Demat Accounts", href: "/demat-accounts" },
    links: [
      {
        label: "Discount vs full service",
        desc: "\u20B920/trade vs percentage-based \u2014 what\u2019s better?",
        href: "/demat-accounts",
      },
      {
        label: "Brokerage calculator",
        desc: "Compare actual trading costs across brokers",
        href: "/calculators/brokerage",
      },
      {
        label: "Best for beginners",
        desc: "Simple platforms with learning resources",
        href: "/demat-accounts?type=beginners",
      },
    ],
  },
  {
    icon: Building2,
    label: "Tax Planning",
    desc: "Save more tax with the right regime and deductions. Updated for Budget 2026 with Old vs New regime comparison.",
    stat: "\u20B923K",
    statLabel: "avg. tax saved",
    primaryLink: { label: "Tax Calculator", href: "/calculators/tax" },
    links: [
      {
        label: "Old vs New regime",
        desc: "Which tax regime saves you more in FY26?",
        href: "/calculators/old-vs-new-tax",
      },
      {
        label: "Section 80C guide",
        desc: "Maximize your \u20B91.5L deduction limit",
        href: "/articles/section-80c",
      },
      {
        label: "HRA calculator",
        desc: "Claim your house rent allowance correctly",
        href: "/calculators/hra",
      },
    ],
  },
];

export default function MoreResources() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SECTIONS[activeIdx];
  const ActiveIcon = active.icon;

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-10">
          <div>
            <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink">
              More <em className="italic text-indian-gold">resources</em>
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Find additional information on credit cards, loans, insurance, and
              more.
            </p>
          </div>
        </div>

        {/* Two-column layout: tabs left, content right */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 md:gap-8">
          {/* Left: Tab list */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-0 border-b md:border-b-0 md:border-r border-gray-200 pb-0 md:pb-0 scrollbar-hide">
            {SECTIONS.map((sec, i) => {
              const Icon = sec.icon;
              const isActive = activeIdx === i;
              return (
                <button
                  key={sec.label}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-3 px-4 py-4 text-left whitespace-nowrap md:whitespace-normal border-b-2 md:border-b-0 md:border-l-3 transition-all cursor-pointer flex-shrink-0 ${
                    isActive
                      ? "border-green-600 md:border-green-600 bg-green-50/50 text-green-700"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="text-sm font-semibold">{sec.label}</span>
                  {isActive && (
                    <ArrowRight className="w-4 h-4 ml-auto hidden md:block text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Content panel */}
          <div className="pt-6 md:pt-0">
            {/* Featured card */}
            <div className="bg-canvas rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex items-start gap-6">
                {/* Stat highlight */}
                <div className="hidden sm:flex flex-col items-center justify-center w-28 h-28 bg-white rounded-xl border border-gray-100 flex-shrink-0">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-2">
                    <ActiveIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-black text-green-600 leading-none">
                    {active.stat}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 text-center leading-tight">
                    {active.statLabel}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink mb-2">
                    {active.desc}
                  </h3>
                  <Link
                    href={active.primaryLink.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors mt-3"
                  >
                    {active.primaryLink.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-0 divide-y divide-gray-100">
              {active.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 py-3.5 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                      {link.label}
                    </span>
                    <span className="text-sm text-gray-400 ml-2 hidden sm:inline">
                      {link.desc}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-green-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
