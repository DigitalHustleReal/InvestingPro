"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  PiggyBank,
  BarChart3,
  Shield,
  Building2,
  Calculator,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

/* ─── category data ─── */

interface SubLink {
  label: string;
  href: string;
}

interface Category {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  color: string; // Tailwind bg class for icon
  colorText: string; // Tailwind text class for icon
  headline: string;
  description: string;
  cta: string;
  subLinks: SubLink[];
}

const CATEGORIES: Category[] = [
  {
    id: "credit-cards",
    label: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
    color: "bg-green-50",
    colorText: "text-green-600",
    headline: "Find the right credit card for how you spend",
    description:
      "Compare rewards, cashback, travel, and fuel cards from every major Indian bank. Filter by annual fee, income requirement, and card network. Every listing is editorially reviewed — no paid placements.",
    cta: "Explore credit cards",
    subLinks: [
      { label: "Best rewards cards", href: "/credit-cards?filter=rewards" },
      { label: "No annual fee cards", href: "/credit-cards?filter=no-fee" },
      { label: "Travel cards", href: "/credit-cards?filter=travel" },
    ],
  },
  {
    id: "mutual-funds",
    label: "Mutual Funds",
    href: "/mutual-funds",
    icon: TrendingUp,
    color: "bg-blue-50",
    colorText: "text-blue-600",
    headline: "Research mutual funds with independent data",
    description:
      "Browse equity, debt, hybrid, and index funds across all major AMCs. See historical returns, expense ratios, and risk grades side by side. Start a SIP comparison or explore thematic funds.",
    cta: "Explore mutual funds",
    subLinks: [
      { label: "Top equity funds", href: "/mutual-funds?type=equity" },
      { label: "Index funds", href: "/mutual-funds?type=index" },
      { label: "SIP calculator", href: "/calculators/sip" },
    ],
  },
  {
    id: "loans",
    label: "Loans",
    href: "/loans",
    icon: Landmark,
    color: "bg-red-50",
    colorText: "text-red-600",
    headline: "Compare loan rates across lenders",
    description:
      "Home loans, personal loans, and education loans from banks and NBFCs. Compare interest rates, processing fees, and eligibility. Use our EMI calculator to plan repayments before you apply.",
    cta: "Explore loans",
    subLinks: [
      { label: "Home loan rates", href: "/loans?type=home" },
      { label: "Personal loans", href: "/loans?type=personal" },
      { label: "EMI calculator", href: "/calculators/emi" },
    ],
  },
  {
    id: "fixed-deposits",
    label: "Fixed Deposits",
    href: "/fixed-deposits",
    icon: PiggyBank,
    color: "bg-amber-50",
    colorText: "text-amber-600",
    headline: "Find the best FD rates today",
    description:
      "Compare fixed deposit interest rates from banks and corporate issuers. See rates for different tenures, check senior citizen benefits, and understand TDS implications — all in one place.",
    cta: "Explore fixed deposits",
    subLinks: [
      { label: "Highest FD rates", href: "/fixed-deposits?sort=rate" },
      { label: "Tax-saving FDs", href: "/fixed-deposits?filter=tax-saving" },
      { label: "FD calculator", href: "/calculators/fd" },
    ],
  },
  {
    id: "demat-accounts",
    label: "Demat Accounts",
    href: "/demat-accounts",
    icon: BarChart3,
    color: "bg-purple-50",
    colorText: "text-purple-600",
    headline: "Open the right demat account for your needs",
    description:
      "Compare brokerage charges, platform features, and account opening fees across discount and full-service brokers. Whether you trade actively or invest passively, find the fit.",
    cta: "Explore demat accounts",
    subLinks: [
      { label: "Discount brokers", href: "/demat-accounts?type=discount" },
      {
        label: "Full-service brokers",
        href: "/demat-accounts?type=full-service",
      },
      { label: "Compare brokers", href: "/demat-accounts/compare" },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    href: "/insurance",
    icon: Shield,
    color: "bg-green-50",
    colorText: "text-green-600",
    headline: "Understand your insurance options clearly",
    description:
      "Term life, health, motor, and travel insurance compared on premium, coverage, and claim settlement ratio. We break down policy jargon so you can decide with confidence.",
    cta: "Explore insurance",
    subLinks: [
      { label: "Term life insurance", href: "/insurance?type=term" },
      { label: "Health insurance", href: "/insurance?type=health" },
      { label: "Insurance calculator", href: "/calculators/insurance" },
    ],
  },
  {
    id: "ppf-nps",
    label: "PPF & NPS",
    href: "/ppf-nps",
    icon: Building2,
    color: "bg-orange-50",
    colorText: "text-orange-600",
    headline: "Government-backed savings and retirement",
    description:
      "Public Provident Fund, National Pension System, Sukanya Samriddhi, and other sovereign schemes. Compare lock-in periods, tax benefits under 80C/80CCD, and projected maturity values.",
    cta: "Explore PPF & NPS",
    subLinks: [
      { label: "PPF calculator", href: "/calculators/ppf" },
      { label: "NPS calculator", href: "/calculators/nps" },
      { label: "Tax-saving options", href: "/ppf-nps?filter=80c" },
    ],
  },
  {
    id: "calculators",
    label: "Calculators",
    href: "/calculators",
    icon: Calculator,
    color: "bg-green-50",
    colorText: "text-green-600",
    headline: "Free financial calculators — no sign-up needed",
    description:
      "SIP, EMI, FD, PPF, retirement, tax — run the numbers before you commit. Every calculator shows the math behind the result. Bookmark and revisit anytime.",
    cta: "All calculators",
    subLinks: [
      { label: "SIP calculator", href: "/calculators/sip" },
      { label: "EMI calculator", href: "/calculators/emi" },
      { label: "Retirement planner", href: "/calculators/retirement" },
    ],
  },
];

/* ─── component ─── */

export default function ExploreCategories() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <section className="py-12 md:py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-2 mb-7">
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
              Explore
            </p>
            <h2 className="text-2xl md:text-[28px] font-bold text-[--v2-ink] tracking-tight">
              Every product,{" "}
              <span className="text-green-600">one platform</span>
            </h2>
          </div>
        </div>

        {/* Desktop: side-by-side layout */}
        <div className="hidden md:grid md:grid-cols-[280px_1fr] gap-0 border border-gray-200 rounded-xl overflow-hidden bg-white">
          {/* Left nav */}
          <nav
            className="border-r border-gray-200 bg-gray-50/60"
            role="tablist"
            aria-label="Product categories"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(cat.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150 border-l-[3px] ${
                    isActive
                      ? "border-l-green-600 bg-white text-[--v2-ink] font-semibold"
                      : "border-l-transparent text-gray-500 hover:bg-gray-50 hover:text-[--v2-ink]"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? cat.color : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? cat.colorText : "text-gray-400"}
                    />
                  </span>
                  <span className="text-sm">{cat.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-gray-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right panel */}
          <div
            role="tabpanel"
            aria-label={active.label}
            className="p-8 flex flex-col justify-between min-h-[420px]"
          >
            <div>
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${active.color} mb-5`}
              >
                <ActiveIcon size={22} className={active.colorText} />
              </div>
              <h3 className="text-xl font-bold text-[--v2-ink] mb-3 tracking-tight">
                {active.headline}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                {active.description}
              </p>
            </div>

            <div className="mt-8">
              <Link
                href={active.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {active.cta}
                <ArrowRight size={15} />
              </Link>

              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5">
                {active.subLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-green-600 font-medium hover:text-green-700 transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl transition-all duration-200 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}
                >
                  <Icon size={18} className={cat.colorText} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[--v2-ink]">
                    {cat.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {cat.headline}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-400 flex-shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
