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
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useT, useLocale } from "@/lib/i18n/client";
import { localizedPath } from "@/lib/i18n/url";
import type { StringKey } from "@/lib/i18n/strings/en";
import MegaMenu from "./MegaMenu";

interface NavCategory {
  /** Translation key for the visible label (chrome only). */
  labelKey: StringKey;
  /** Canonical English path — wrapped through `localizedPath()` at render. */
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
 *
 * `href` is the canonical (English) base path. `localizedPath(href,
 * currentLocale)` runs at render time so a Hindi user clicking "Loans"
 * from /hi/credit-cards lands on /hi/loans, not /loans.
 */
const CATEGORIES: NavCategory[] = [
  { labelKey: "nav.creditCards", href: "/credit-cards", icon: CreditCard },
  { labelKey: "nav.loans", href: "/loans", icon: Building2 },
  { labelKey: "nav.banking", href: "/banking", icon: Landmark },
  { labelKey: "nav.investing", href: "/investing", icon: TrendingUp },
  { labelKey: "nav.insurance", href: "/insurance", icon: Shield },
  { labelKey: "nav.taxes", href: "/taxes", icon: Receipt },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();
  const t = useT();
  const locale = useLocale();

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
              href={localizedPath("/", locale)}
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
              {/* Language switcher — desktop only */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* Search icon */}
              <button
                onClick={openSearch}
                className="p-2 text-canvas-70 hover:text-canvas transition-colors cursor-pointer"
                aria-label={t("nav.search")}
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Compare CTA — Action Green, rounded-sm (6px) */}
              <Link
                href={localizedPath("/compare", locale)}
                className="hidden sm:inline-flex items-center gap-1.5 px-[18px] py-[10px] bg-action-green text-canvas text-[14px] font-semibold hover:bg-authority-green transition-colors rounded-sm"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                {t("nav.compare")}
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-canvas cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? t("nav.close") : t("nav.menu")}
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
                href={localizedPath("/", locale)}
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
                aria-label={t("nav.close")}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links — 44px min tap targets */}
            <div className="px-5 py-4">
              <div className="space-y-0">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const localizedHref = localizedPath(cat.href, locale);
                  const isActive = pathname.startsWith(localizedHref);
                  return (
                    <Link
                      key={cat.href}
                      href={localizedHref}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 min-h-[44px] py-3 border-b border-canvas-15 ${
                        isActive
                          ? "text-indian-gold"
                          : "text-canvas-70 hover:text-canvas"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[15px] font-medium">
                        {t(cat.labelKey)}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Secondary links */}
              <div className="mt-8 space-y-3">
                <Link
                  href={localizedPath("/articles", locale)}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 min-h-[44px] py-3 text-center bg-canvas-15 text-canvas rounded-sm text-[14px] font-semibold hover:bg-canvas/20 transition-colors"
                >
                  {t("cta.allArticles")}
                </Link>
                <Link
                  href={localizedPath("/calculators", locale)}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 min-h-[44px] py-3 text-center border border-canvas-15 text-canvas rounded-sm text-[14px] font-semibold hover:bg-canvas-15 transition-colors"
                >
                  {t("section.cardCalculators")}
                </Link>
                <Link
                  href={localizedPath("/compare", locale)}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 min-h-[44px] py-3 text-center bg-action-green text-canvas rounded-sm text-[14px] font-semibold hover:bg-authority-green transition-colors"
                >
                  {t("nav.compare")}
                </Link>
              </div>

              {/* Mobile language switcher — Phase 2a wiring. Native script
                  labels on the buttons are self-explanatory; no extra heading
                  needed (and avoids guessing a translation key for "Language"
                  before Phase 2b ships native-reviewed strings). */}
              <div className="mt-8 pt-6 border-t border-canvas-15">
                <LanguageSwitcher isMobile />
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
