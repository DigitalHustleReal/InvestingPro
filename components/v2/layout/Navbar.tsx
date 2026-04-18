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
  Search as SearchIcon,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import MegaMenu from "./MegaMenu";

interface NavCategory {
  label: string;
  href: string;
  icon: LucideIcon;
}

const CATEGORIES: NavCategory[] = [
  { label: "Credit Cards", href: "/credit-cards", icon: CreditCard },
  { label: "Banking", href: "/banking", icon: Landmark },
  { label: "Loans", href: "/loans", icon: Building2 },
  { label: "Investing", href: "/mutual-funds", icon: TrendingUp },
  { label: "Insurance", href: "/insurance", icon: Shield },
  { label: "Demat Accounts", href: "/demat-accounts", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-[#0A1F14] dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-0.5 group flex-shrink-0"
            >
              <span className="text-[24px] font-bold tracking-tight text-gray-900 dark:text-white">
                Investing
              </span>
              <span className="text-[24px] font-bold tracking-tight text-green-600">
                Pro
              </span>
            </Link>

            {/* Desktop Nav — MegaMenu with hover dropdowns */}
            <MegaMenu />

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={openSearch}
                className="p-2 text-[#0A1F14]/50 hover:text-[#0A1F14] dark:text-white/50 dark:hover:text-white transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              <Link
                href="/compare"
                className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700 transition-colors rounded-lg"
              >
                <BarChart3 className="w-3.5 h-3.5" />
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
                    className={`flex items-center gap-4 px-4 py-4 border-b border-gray-100 ${
                      isActive ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[15px] font-medium">{cat.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/articles"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3.5 text-center bg-gray-900 text-white rounded-lg text-sm font-semibold"
              >
                Read Articles
              </Link>
              <Link
                href="/calculators"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3.5 text-center border border-gray-300 text-gray-900 rounded-lg text-sm font-semibold"
              >
                Calculators
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3.5 text-center bg-green-600 text-white rounded-lg text-sm font-semibold"
              >
                Compare Products
              </Link>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xs text-gray-300">
                No paid rankings · Methodology disclosed · SEBI-compliant
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
