"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  Shield,
  BarChart3,
  Building2,
  Receipt,
  Search as SearchIcon,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearch } from "@/components/search/SearchProvider";
import MegaMenu from "./MegaMenu";

interface NavCategory {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Navbar categories — aligned 2026-04-25 with the locked v3 URL category
 * lock (`URL_CATEGORIES` in `lib/routing/category-map.ts`). 6 money topics.
 *
 * Previously included "Demat Accounts" (sub-category, not a top-level
 * URL category) and pointed "Investing" at /mutual-funds (bug). Both
 * fixed below. `learn` is a cross-cutting hub reachable via mega-menu/
 * footer/in-content links — not a top-nav slot.
 */
const CATEGORIES: NavCategory[] = [
  { label: "Credit Cards", href: "/credit-cards", icon: CreditCard },
  { label: "Loans", href: "/loans", icon: Building2 },
  { label: "Banking", href: "/banking", icon: Landmark },
  { label: "Investing", href: "/investing", icon: TrendingUp },
  { label: "Insurance", href: "/insurance", icon: Shield },
  { label: "Taxes", href: "/taxes", icon: Receipt },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="surface-ink sticky top-0 z-50 border-b border-canvas-15">
        <nav className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-16">
            {/* Logo — Playfair 900, 22px */}
            <Link
              href="/"
              className="flex items-center gap-0.5 group flex-shrink-0"
            >
              <span className="text-[22px] font-display font-black tracking-tight text-canvas">
                Investing
              </span>
              <span className="text-[22px] font-display font-black tracking-tight text-indian-gold">
                Pro
              </span>
            </Link>

            {/* Desktop Nav — MegaMenu with hover dropdowns */}
            <MegaMenu />

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search icon */}
              <button
                onClick={openSearch}
                className="p-2 text-canvas-70 hover:text-canvas transition-colors cursor-pointer"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Compare CTA — Action Green, rounded-sm (6px) */}
              <Link
                href="/compare"
                className="hidden sm:inline-flex items-center gap-1.5 px-[18px] py-[10px] bg-action-green text-canvas text-[14px] font-semibold hover:bg-authority-green transition-colors rounded-sm"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Compare
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-canvas cursor-pointer"
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
        </nav>
      </header>

      {/* Mobile drawer — slides from right */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/60"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="surface-ink absolute right-0 top-0 h-full w-full sm:w-96 overflow-y-auto animate-in slide-in-from-right duration-250">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-canvas-15">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-0.5"
              >
                <span className="text-[22px] font-display font-black tracking-tight text-canvas">
                  Investing
                </span>
                <span className="text-[22px] font-display font-black tracking-tight text-indian-gold">
                  Pro
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-canvas-70 hover:text-canvas cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links — 44px min tap targets */}
            <div className="px-5 py-4">
              <div className="space-y-0">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = pathname.startsWith(cat.href);
                  return (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 min-h-[44px] py-3 border-b border-canvas-15 ${
                        isActive
                          ? "text-indian-gold"
                          : "text-canvas-70 hover:text-canvas"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[15px] font-medium">
                        {cat.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Secondary links */}
              <div className="mt-8 space-y-3">
                <Link
                  href="/articles"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 min-h-[44px] py-3 text-center bg-canvas-15 text-canvas rounded-sm text-[14px] font-semibold hover:bg-canvas/20 transition-colors"
                >
                  Read Articles
                </Link>
                <Link
                  href="/calculators"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 min-h-[44px] py-3 text-center border border-canvas-15 text-canvas rounded-sm text-[14px] font-semibold hover:bg-canvas-15 transition-colors"
                >
                  Calculators
                </Link>
                <Link
                  href="/compare"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 min-h-[44px] py-3 text-center bg-action-green text-canvas rounded-sm text-[14px] font-semibold hover:bg-authority-green transition-colors"
                >
                  Compare Products
                </Link>
              </div>

              {/* Trust signal */}
              <div className="mt-12 text-center">
                <p className="text-mono-sm font-mono text-canvas-70">
                  No paid rankings · Methodology disclosed · SEBI-compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
