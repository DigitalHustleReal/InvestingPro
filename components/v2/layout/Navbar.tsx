"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  Shield,
  BarChart3,
  Building2,
  Search,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";

interface NavCategory {
  label: string;
  href: string;
  icon: LucideIcon;
}

const CATEGORIES: NavCategory[] = [
  { label: "Credit Cards", href: "/credit-cards", icon: CreditCard },
  { label: "Banking", href: "/banking", icon: Landmark },
  { label: "Loans", href: "/loans", icon: Building2 },
  { label: "Investing", href: "/investing", icon: TrendingUp },
  { label: "Insurance", href: "/insurance", icon: Shield },
  { label: "Demat Accounts", href: "/demat-accounts", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-[#0A1F14] dark:bg-[#0A1F14] dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 group">
              <span className="font-display text-[22px] font-bold tracking-tight text-[#0A1F14] dark:text-white">
                Investing
              </span>
              <span className="font-display text-[22px] font-bold tracking-tight text-[#D97706]">
                P₹o
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {CATEGORIES.map((cat) => {
                const isActive = pathname.startsWith(cat.href);
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`px-3 py-2 font-data text-[11px] uppercase tracking-[2px] transition-colors ${
                      isActive
                        ? "text-[#16A34A] border-b-2 border-[#16A34A] -mb-[2px]"
                        : "text-[#0A1F14]/60 hover:text-[#0A1F14] dark:text-white/60 dark:hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={openSearch}
                className="flex items-center gap-2 px-3 py-1.5 border-2 border-[#0A1F14]/20 hover:border-[#0A1F14] text-[#0A1F14]/50 hover:text-[#0A1F14] transition-colors dark:border-white/20 dark:text-white/50 dark:hover:text-white dark:hover:border-white"
                aria-label="Search (Cmd+K)"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline font-data text-[11px]">
                  Search
                </span>
                <kbd className="hidden sm:inline font-data text-[10px] px-1 py-0.5 border border-[#0A1F14]/20 dark:border-white/20">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/compare"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-[#16A34A] text-white font-data text-[11px] uppercase tracking-[2px] hover:bg-[#166534] transition-colors"
              >
                Compare
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-[#0A1F14] dark:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#0A1F14] lg:hidden">
          <div className="pt-20 px-6">
            <div className="space-y-0">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = pathname.startsWith(cat.href);
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 border-b border-[#0A1F14]/10 dark:border-white/10 ${
                      isActive
                        ? "text-[#16A34A]"
                        : "text-[#0A1F14] dark:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-data text-sm uppercase tracking-[2px]">
                      {cat.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/articles"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-center bg-[#0A1F14] text-white dark:bg-white dark:text-[#0A1F14] font-data text-sm uppercase tracking-[2px]"
              >
                Read Articles
              </Link>
              <Link
                href="/calculators"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-center border-2 border-[#0A1F14] dark:border-white text-[#0A1F14] dark:text-white font-data text-sm uppercase tracking-[2px]"
              >
                Calculators
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-center bg-[#16A34A] text-white font-data text-sm uppercase tracking-[2px]"
              >
                Compare Products
              </Link>
            </div>

            <div className="mt-12 text-center">
              <p className="font-data text-[10px] uppercase tracking-[3px] text-[#0A1F14]/30 dark:text-white/30">
                No paid rankings · Methodology disclosed · SEBI-compliant
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
