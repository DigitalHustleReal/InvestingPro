"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  Shield,
  Calculator,
  Building2,
  BarChart3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MegaMenu from "./MegaMenu";
import { useSearch } from "@/components/search/SearchProvider";

/* ─── Mobile menu data ─── */

interface MobileSection {
  label: string;
  icon: LucideIcon;
  href: string;
  sub?: { label: string; href: string }[];
}

const MOBILE_SECTIONS: MobileSection[] = [
  {
    label: "Credit Cards",
    icon: CreditCard,
    href: "/credit-cards",
    sub: [
      { label: "Best Credit Cards", href: "/credit-cards" },
      { label: "Rewards Cards", href: "/credit-cards?filter=rewards" },
      { label: "Cashback Cards", href: "/credit-cards?filter=cashback" },
      { label: "Travel Cards", href: "/credit-cards?filter=travel" },
      { label: "Compare Cards", href: "/credit-cards/compare" },
    ],
  },
  {
    label: "Banking",
    icon: Building2,
    href: "/banking",
    sub: [
      { label: "Savings Accounts", href: "/banking?type=savings" },
      { label: "Fixed Deposits", href: "/fixed-deposits" },
      { label: "Recurring Deposits", href: "/banking?type=rd" },
      { label: "FD Calculator", href: "/calculators/fd" },
    ],
  },
  {
    label: "Loans",
    icon: Landmark,
    href: "/loans",
    sub: [
      { label: "Personal Loans", href: "/loans?type=personal" },
      { label: "Home Loans", href: "/loans?type=home" },
      { label: "Car Loans", href: "/loans?type=car" },
      { label: "Education Loans", href: "/loans?type=education" },
      { label: "EMI Calculator", href: "/calculators/emi" },
    ],
  },
  {
    label: "Investing",
    icon: TrendingUp,
    href: "/investing",
    sub: [
      { label: "Mutual Funds", href: "/mutual-funds" },
      { label: "PPF & NPS", href: "/ppf-nps" },
      { label: "Stocks & IPOs", href: "/stocks" },
      { label: "SIP Calculator", href: "/calculators/sip" },
    ],
  },
  {
    label: "Insurance",
    icon: Shield,
    href: "/insurance",
    sub: [
      { label: "Term Insurance", href: "/insurance?type=term" },
      { label: "Health Insurance", href: "/insurance?type=health" },
      { label: "Life Insurance", href: "/insurance?type=life" },
      { label: "Car Insurance", href: "/insurance?type=car" },
    ],
  },
  {
    label: "Demat Accounts",
    icon: BarChart3,
    href: "/demat-accounts",
    sub: [
      { label: "Best Demat Accounts", href: "/demat-accounts" },
      { label: "Discount Brokers", href: "/demat-accounts?type=discount" },
      { label: "Compare Brokers", href: "/demat-accounts/compare" },
    ],
  },
];

/* ─── Navbar ─── */

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const { openSearch } = useSearch();

  if (pathname?.startsWith("/admin")) return null;

  const toggleMobileSection = (label: string) => {
    setExpandedMobile(expandedMobile === label ? null : label);
  };

  return (
    <>
      <nav
        className="h-14 bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto h-full flex items-center px-4 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold text-[--v2-ink] tracking-tight shrink-0"
          >
            Investing<span className="text-green-600">P₹o</span>
          </Link>

          {/* Desktop mega menu */}
          <MegaMenu />

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={openSearch}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-400 hover:border-gray-300 transition-colors cursor-pointer"
              aria-label="Open search (⌘K)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Search...
              <kbd className="hidden xl:inline text-[10px] px-1.5 py-0.5 bg-white rounded border border-gray-200 text-gray-400">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/compare"
              className="hidden sm:flex px-3.5 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-lg text-[13px] font-medium hover:border-gray-400 transition-colors"
            >
              Compare
            </Link>

            <Link
              href="/compare"
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg text-[13px] font-semibold hover:bg-green-700 transition-colors"
            >
              Compare Now
            </Link>

            {/* Mobile burger */}
            <button
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg text-gray-500 hover:bg-gray-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — accordion style */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-white z-40 overflow-y-auto pb-20">
          <div className="p-3">
            {MOBILE_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedMobile === section.label;
              const hasSub = section.sub && section.sub.length > 0;

              return (
                <div
                  key={section.label}
                  className="border-b border-gray-100 last:border-0"
                >
                  {hasSub ? (
                    <>
                      <button
                        onClick={() => toggleMobileSection(section.label)}
                        className="w-full flex items-center gap-3 px-3 py-3.5 text-left"
                      >
                        <Icon size={18} className="text-gray-400" />
                        <span className="flex-1 text-[15px] font-medium text-gray-800">
                          {section.label}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="pb-2 pl-10 space-y-0.5">
                          {section.sub!.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-3 py-3 text-[14px] text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={section.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5"
                    >
                      <Icon size={18} className="text-gray-400" />
                      <span className="text-[15px] font-medium text-gray-700">
                        {section.label}
                      </span>
                      <ChevronRight
                        size={14}
                        className="ml-auto text-gray-300"
                      />
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Bottom actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 px-1">
              <Link
                href="/calculators"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                All Calculators
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Compare Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
