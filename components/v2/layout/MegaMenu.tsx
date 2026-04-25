"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import {
  CreditCard,
  Landmark,
  TrendingUp,
  Shield,
  Calculator,
  Briefcase,
  Receipt,
  Wallet,
  ChevronRight,
  ArrowRight,
  Star,
  Flame,
  Sparkles,
  BarChart3,
  Home,
  Receipt as ReceiptIcon,
  PiggyBank,
  Building2,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Data types ─── */

interface SubItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: "popular" | "trending" | "new";
}

interface MenuColumn {
  heading: string;
  icon: LucideIcon;
  links: SubItem[];
}

interface Featured {
  label: string;
  href: string;
  desc: string;
  stat?: string;
  statLabel?: string;
}

interface MenuCategory {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  colorBg: string;
  desc: string;
  featured?: Featured;
  columns: MenuColumn[];
}

/* ─── Badge component ─── */

function Badge({ type }: { type: "popular" | "trending" | "new" }) {
  const config = {
    popular: { label: "Popular", class: "bg-canvas-15 text-canvas-70" },
    trending: {
      label: "Trending",
      class: "bg-amber-50 text-amber-700",
    },
    new: { label: "New", class: "bg-green-700/10 text-green-700" },
  };
  const c = config[type];
  return (
    <span
      className={`ml-1.5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded ${c.class}`}
    >
      {c.label}
    </span>
  );
}

/* ─── Menu data ─── */

const MENU: MenuCategory[] = [
  // 1. Credit Cards — highest search + revenue
  {
    label: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
    color: "text-green-600",
    colorBg: "bg-green-50",
    desc: "Compare cards from every major Indian bank",
    featured: {
      label: "Find Your Perfect Card",
      href: "/credit-cards/find-your-card",
      desc: "Answer 3 questions. Get a personalized recommendation in 30 seconds.",
      stat: "50+",
      statLabel: "banks compared",
    },
    columns: [
      {
        heading: "Best Cards",
        icon: Star,
        links: [
          {
            label: "Best Credit Cards",
            href: "/credit-cards",
            badge: "popular",
          },
          { label: "Best Rewards Cards", href: "/credit-cards?filter=rewards" },
          {
            label: "Best Cashback Cards",
            href: "/credit-cards?filter=cashback",
            badge: "trending",
          },
          { label: "Best Travel Cards", href: "/credit-cards?filter=travel" },
          { label: "Best Fuel Cards", href: "/credit-cards?filter=fuel" },
          { label: "No Annual Fee Cards", href: "/credit-cards?filter=no-fee" },
        ],
      },
      {
        heading: "Tools & Compare",
        icon: BarChart3,
        links: [
          {
            label: "Compare Cards Side-by-Side",
            href: "/credit-cards/compare",
          },
          { label: "Rewards Calculator", href: "/calculators?type=rewards" },
          { label: "Credit Card Reviews", href: "/credit-cards/reviews" },
          { label: "Credit Card Guide", href: "/credit-cards/guides" },
        ],
      },
    ],
  },
  // 2. Banking — user journey stage 1 (everyone needs a bank)
  {
    label: "Banking",
    href: "/banking",
    icon: Building2,
    color: "text-action-green",
    colorBg: "bg-green-50",
    desc: "Savings accounts, FDs, RDs — best rates from top banks",
    featured: {
      label: "FD Calculator",
      href: "/calculators/fd",
      desc: "Calculate maturity amount for any FD tenure and rate.",
      stat: "50+",
      statLabel: "banks compared",
    },
    columns: [
      {
        heading: "Bank Products",
        icon: Building2,
        links: [
          {
            label: "Savings Accounts",
            href: "/banking?type=savings",
            badge: "popular",
          },
          {
            label: "Fixed Deposits",
            href: "/fixed-deposits",
            icon: PiggyBank,
            badge: "popular",
          },
          { label: "Recurring Deposits", href: "/banking?type=rd" },
          { label: "Current Accounts", href: "/banking?type=current" },
          {
            label: "Senior Citizen FDs",
            href: "/fixed-deposits?filter=senior",
          },
          {
            label: "Tax-Saving FDs",
            href: "/fixed-deposits?filter=tax-saving",
          },
        ],
      },
      {
        heading: "Tools & Compare",
        icon: Calculator,
        links: [
          { label: "FD Calculator", href: "/calculators/fd", badge: "popular" },
          { label: "RD Calculator", href: "/calculators/rd" },
          { label: "Compare FD Rates", href: "/fixed-deposits/compare" },
          { label: "Banking Guide", href: "/banking/guides" },
        ],
      },
    ],
  },
  // 3. Loans — high revenue + search
  {
    label: "Loans",
    href: "/loans",
    icon: Landmark,
    color: "text-amber-600",
    colorBg: "bg-amber-50",
    desc: "Personal, home, car, education loans — lowest rates compared",
    featured: {
      label: "EMI Calculator",
      href: "/calculators/emi",
      desc: "Calculate EMI instantly. See prepayment savings.",
      stat: "60+",
      statLabel: "lenders compared",
    },
    columns: [
      {
        heading: "Loan Types",
        icon: Landmark,
        links: [
          {
            label: "Personal Loans",
            href: "/loans?type=personal",
            badge: "popular",
          },
          { label: "Home Loans", href: "/loans?type=home" },
          { label: "Car Loans", href: "/loans?type=car" },
          { label: "Education Loans", href: "/loans?type=education" },
          { label: "Gold Loans", href: "/loans?type=gold" },
          { label: "Business Loans", href: "/loans?type=business" },
        ],
      },
      {
        heading: "Tools & Guides",
        icon: Calculator,
        links: [
          {
            label: "EMI Calculator",
            href: "/calculators/emi",
            badge: "popular",
          },
          {
            label: "Eligibility Checker",
            href: "/loans/eligibility-checker",
            badge: "new",
          },
          { label: "Home Loan vs SIP", href: "/calculators/home-loan-vs-sip" },
          { label: "CIBIL Score Simulator", href: "/loans#cibil-simulator" },
        ],
      },
    ],
  },
  // 4. Investing — wealth building (MFs, PPF, Stocks)
  {
    label: "Investing",
    href: "/investing",
    icon: TrendingUp,
    color: "text-green-600",
    colorBg: "bg-green-50",
    desc: "Mutual funds, PPF, NPS, stocks — build wealth independently",
    featured: {
      label: "SIP Calculator",
      href: "/calculators/sip",
      desc: "See how ₹10K/month grows with inflation-adjusted projections.",
      stat: "40+",
      statLabel: "AMCs tracked",
    },
    columns: [
      {
        heading: "Investment Products",
        icon: TrendingUp,
        links: [
          {
            label: "Mutual Funds",
            href: "/mutual-funds",
            icon: TrendingUp,
            badge: "popular",
          },
          { label: "PPF & NPS", href: "/ppf-nps", icon: Building2 },
          { label: "ELSS Tax Saving", href: "/mutual-funds?type=elss" },
          { label: "Stocks & IPOs", href: "/stocks", badge: "trending" },
          { label: "Index Funds", href: "/mutual-funds?type=index" },
        ],
      },
      {
        heading: "Tools & Compare",
        icon: Calculator,
        links: [
          {
            label: "SIP Calculator",
            href: "/calculators/sip",
            badge: "popular",
          },
          { label: "PPF Calculator", href: "/calculators/ppf" },
          { label: "Retirement Planner", href: "/calculators/retirement" },
          { label: "Compare Funds", href: "/mutual-funds/compare" },
          {
            label: "Overlap Checker",
            href: "/mutual-funds/overlap-checker",
            badge: "new",
          },
        ],
      },
    ],
  },
  // 5. Insurance — protection
  {
    label: "Insurance",
    href: "/insurance",
    icon: Shield,
    color: "text-green-600",
    colorBg: "bg-green-50",
    desc: "Term, health, life, car insurance — claims data that matters",
    featured: {
      label: "Coverage Calculator",
      href: "/calculators/insurance",
      desc: "Find out how much coverage you actually need.",
      stat: "20+",
      statLabel: "insurers compared",
    },
    columns: [
      {
        heading: "Insurance Types",
        icon: Shield,
        links: [
          {
            label: "Term Insurance",
            href: "/insurance?type=term",
            badge: "popular",
          },
          {
            label: "Health Insurance",
            href: "/insurance?type=health",
            badge: "trending",
          },
          { label: "Life Insurance", href: "/insurance?type=life" },
          { label: "Car Insurance", href: "/insurance?type=car" },
          { label: "Travel Insurance", href: "/insurance?type=travel" },
        ],
      },
      {
        heading: "Tools & Guides",
        icon: Calculator,
        links: [
          { label: "Coverage Calculator", href: "/calculators/insurance" },
          { label: "Compare Plans", href: "/insurance/compare" },
          {
            label: "Claim Settlement Data",
            href: "/insurance/claims",
            badge: "new",
          },
          { label: "Insurance Guide", href: "/insurance/guides" },
        ],
      },
    ],
  },
  // 6. Taxes — high search-intent, especially Jan–Mar
  // (Replaced "Demat Accounts" 2026-04-25 — Demat is a sub-category of
  // Investing, not a top-level URL category. Taxes is locked in the v3
  // URL set and was missing from the desktop nav. Demat stays reachable
  // via Investing > Demat Accounts sub-link below.)
  {
    label: "Taxes",
    href: "/taxes",
    icon: Receipt,
    color: "text-indian-gold",
    colorBg: "bg-canvas",
    desc: "Old vs new regime, 80C, HRA, capital gains — worked in rupees",
    featured: {
      label: "Old vs New Regime Calculator",
      href: "/calculators/old-vs-new-tax",
      desc: "Find which regime saves you more — at your salary, with your deductions.",
      stat: "FY 26-27",
      statLabel: "slabs ready",
    },
    columns: [
      {
        heading: "Tax topics",
        icon: Receipt,
        links: [
          {
            label: "Old vs New Regime",
            href: "/taxes",
            badge: "popular",
          },
          {
            label: "Section 80C optimizer",
            href: "/calculators/80c",
          },
          { label: "HRA exemption", href: "/calculators/hra" },
          { label: "Capital gains (LTCG)", href: "/calculators/ltcg" },
          { label: "Income tax slabs", href: "/calculators/tax" },
          { label: "ITR filing guide", href: "/taxes/learn" },
        ],
      },
      {
        heading: "Tools & guides",
        icon: Calculator,
        links: [
          { label: "All tax calculators", href: "/taxes/calculators" },
          {
            label: "Tax-saving investments",
            href: "/taxes/learn",
            badge: "trending",
          },
          { label: "TDS calculator", href: "/calculators/tds" },
          { label: "GST calculator", href: "/calculators/gst" },
          { label: "Crypto tax", href: "/calculators/crypto-tax" },
        ],
      },
    ],
  },
];

/* ─── Component ─── */

export default function MegaMenu() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((index: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIndex(index);
    setActiveTab(0);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 200);
  }, []);

  const keepOpen = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isActive = (href: string) => {
    if (href === "/banking")
      return ["/banking", "/fixed-deposits"].some((p) =>
        pathname?.startsWith(p),
      );
    if (href === "/investing")
      return ["/mutual-funds", "/ppf-nps", "/stocks", "/investing"].some((p) =>
        pathname?.startsWith(p),
      );
    if (href === "/demat-accounts")
      return pathname?.startsWith("/demat-accounts");
    return pathname?.startsWith(href);
  };

  // Single mega panel for all categories (tab-based)
  const showPanel = openIndex !== null && openIndex < MENU.length;
  const currentCat = showPanel ? MENU[openIndex!] : null;

  return (
    <div className="hidden lg:flex items-center gap-0.5 ml-8 flex-1">
      {/* Category triggers */}
      {MENU.map((cat, i) => (
        <div
          key={cat.label}
          onMouseEnter={() => openMenu(i)}
          onMouseLeave={closeMenu}
        >
          <Link
            href={cat.href}
            aria-current={isActive(cat.href) ? "page" : undefined}
            aria-expanded={openIndex === i}
            aria-haspopup="true"
            className={`px-3.5 py-2.5 text-[14px] font-medium transition-colors whitespace-nowrap ${
              openIndex === i
                ? "text-[#D97706] font-semibold"
                : isActive(cat.href)
                  ? "text-[#D97706] font-semibold"
                  : "text-canvas-70 hover:text-indian-gold"
            }`}
          >
            {cat.label}
          </Link>
        </div>
      ))}

      {/* "More" removed — Small Business, Taxes, Personal Finance accessible via footer + search */}

      {/* ─── Scrim overlay ─── */}
      {showPanel && (
        <div
          className="fixed inset-0 top-16 bg-ink/10 z-40 transition-opacity duration-200"
          onMouseEnter={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* ─── Full-width mega panel ─── */}
      {showPanel && currentCat && (
        <div
          className="fixed left-0 right-0 top-16 z-50 pt-0"
          onMouseEnter={keepOpen}
          onMouseLeave={closeMenu}
        >
          <div className="surface-ink border-t border-canvas-15 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="flex min-h-[380px]">
                {/* Left — category tabs */}
                <div className="w-[200px] border-r border-canvas-15 py-5 pr-2 flex-shrink-0">
                  {MENU.map((cat, i) => {
                    const Icon = cat.icon;
                    const isTab = openIndex === i;
                    return (
                      <button
                        key={cat.label}
                        onMouseEnter={() => {
                          setOpenIndex(i);
                          setActiveTab(0);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                          isTab
                            ? "bg-canvas-15 font-semibold text-canvas"
                            : "hover:bg-canvas-15 text-canvas-70"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={
                            isTab ? "text-action-green" : "text-canvas-70"
                          }
                        />
                        <span
                          className={`text-[13px] ${isTab ? "text-canvas" : ""}`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Center — links in columns */}
                <div className="flex-1 py-5 px-6">
                  {/* Category header */}
                  <div className="mb-5 pb-3 border-b border-canvas-15">
                    <p className="text-lg font-bold text-canvas">
                      {currentCat.label}
                    </p>
                    <p className="text-[13px] text-canvas-70 mt-0.5">
                      {currentCat.desc}
                    </p>
                  </div>

                  {/* Two columns */}
                  <div className="grid grid-cols-2 gap-8">
                    {currentCat.columns.map((col) => {
                      const ColIcon = col.icon;
                      return (
                        <div key={col.heading}>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-action-green mb-3 flex items-center gap-1.5">
                            <ColIcon size={12} />
                            {col.heading}
                          </p>
                          <ul className="space-y-0">
                            {col.links.map((link) => {
                              const LinkIcon = link.icon;
                              return (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenIndex(null)}
                                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-[13px] text-canvas-70 hover:bg-canvas-15 hover:text-canvas transition-colors group"
                                  >
                                    {LinkIcon && (
                                      <LinkIcon
                                        size={14}
                                        className="text-canvas-70 group-hover:text-action-green transition-colors"
                                      />
                                    )}
                                    <span>{link.label}</span>
                                    {link.badge && <Badge type={link.badge} />}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right — featured tool card (no vanity inventory brags) */}
                {currentCat.featured && (
                  <div className="w-[240px] border-l border-canvas-15 p-5 flex-shrink-0">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-3 font-semibold">
                      Featured Tool
                    </div>
                    <div className="bg-canvas text-ink rounded-sm border-2 border-indian-gold p-4">
                      <p className="font-display font-bold text-[15px] mb-1 leading-tight">
                        {currentCat.featured.label}
                      </p>
                      <p className="text-[12px] text-ink-60 leading-relaxed mb-3">
                        {currentCat.featured.desc}
                      </p>
                      <Link
                        href={currentCat.featured.href}
                        onClick={() => setOpenIndex(null)}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline font-semibold"
                      >
                        Try it free <ArrowRight size={12} />
                      </Link>
                    </div>

                    {/* View all */}
                    <Link
                      href={currentCat.href}
                      onClick={() => setOpenIndex(null)}
                      className="mt-4 flex items-center gap-1.5 text-xs font-medium text-canvas-70 hover:text-action-green transition-colors"
                    >
                      View all {currentCat.label} <ChevronRight size={12} />
                    </Link>

                    {/* Methodology link */}
                    <Link
                      href="/methodology"
                      onClick={() => setOpenIndex(null)}
                      className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:underline"
                    >
                      Methodology disclosed →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
