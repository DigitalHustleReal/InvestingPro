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
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ResourceSection {
  icon: LucideIcon;
  label: string;
  desc: string;
  primaryLink: { label: string; href: string };
  links: { label: string; href: string; desc: string }[];
}

const SECTIONS: ResourceSection[] = [
  {
    icon: CreditCard,
    label: "Credit Cards",
    desc: "Discover the best credit cards for your spending pattern",
    primaryLink: { label: "Best credit cards", href: "/credit-cards" },
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
    desc: "Compare interest rates from 60+ banks and NBFCs",
    primaryLink: { label: "Best loan rates", href: "/loans" },
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
    desc: "Research mutual funds, stocks, and index funds independently",
    primaryLink: { label: "Best mutual funds", href: "/mutual-funds" },
    links: [
      {
        label: "SIP Calculator",
        desc: "See how ₹10K/month grows over 20 years",
        href: "/calculators/sip",
      },
      {
        label: "Fund overlap checker",
        desc: "Are your 5 funds actually the same fund?",
        href: "/mutual-funds/overlap-checker",
      },
      {
        label: "Index vs active funds",
        desc: "10 years of data — when does active win?",
        href: "/mutual-funds/compare/index-vs-active",
      },
    ],
  },
  {
    icon: Shield,
    label: "Insurance",
    desc: "Compare plans with real claim settlement data from IRDAI",
    primaryLink: { label: "Best insurance plans", href: "/insurance" },
    links: [
      {
        label: "How much term cover?",
        desc: "Calculate your family's actual coverage need",
        href: "/calculators/insurance",
      },
      {
        label: "Claim settlement data",
        desc: "Which insurers actually pay when it matters",
        href: "/insurance/claims",
      },
      {
        label: "Term vs whole life",
        desc: "Pure protection vs savings — the real math",
        href: "/insurance/compare/term-vs-whole-life",
      },
    ],
  },
  {
    icon: PiggyBank,
    label: "Banking & FDs",
    desc: "Find the best savings rates and fixed deposit options",
    primaryLink: { label: "Best FD rates", href: "/fixed-deposits" },
    links: [
      {
        label: "FD calculator",
        desc: "Calculate maturity amount for any tenure and rate",
        href: "/calculators/fd",
      },
      {
        label: "Senior citizen FDs",
        desc: "Extra 0.25-0.50% rates for senior citizens",
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
    desc: "Open the right trading account for your needs",
    primaryLink: { label: "Best demat accounts", href: "/demat-accounts" },
    links: [
      {
        label: "Discount vs full service",
        desc: "₹20/trade vs percentage-based — what's better?",
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
    desc: "Save more tax with the right regime and deductions",
    primaryLink: { label: "Tax calculator", href: "/calculators/tax" },
    links: [
      {
        label: "Old vs New regime",
        desc: "Which tax regime saves you more in FY26?",
        href: "/calculators/old-vs-new-tax",
      },
      {
        label: "Section 80C guide",
        desc: "Maximize your ₹1.5L deduction limit",
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
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-[28px] sm:text-[40px] font-medium leading-[1.08] tracking-tight text-ink mb-2">
          More <em className="italic text-authority-green">resources</em>
        </h2>
        <p className="text-sm text-gray-500 mb-10">
          Deep-dive into every financial category with our tools, guides, and
          comparisons.
        </p>

        <div className="divide-y divide-gray-200 border-y border-gray-200 rounded-xl overflow-hidden">
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon;
            const isOpen = openIdx === i;

            return (
              <div key={sec.label} className="bg-white">
                {/* Accordion header */}
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-gray-900">
                      {sec.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5 hidden sm:block">
                      {sec.desc}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-0">
                    {/* Primary link */}
                    <Link
                      href={sec.primaryLink.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 mb-5 transition-colors"
                    >
                      {sec.primaryLink.label}
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="h-px bg-gray-100 mb-5" />

                    {/* Sub-links with descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {sec.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all"
                        >
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-1">
                            <ArrowRight className="w-3.5 h-3.5 text-green-500" />
                            {link.label}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {link.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
