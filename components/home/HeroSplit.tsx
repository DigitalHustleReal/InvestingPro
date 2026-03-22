"use client";

import React from 'react';
import Link from "next/link";
import {
  ArrowRight, CreditCard, TrendingUp, Calculator,
  Search, CheckCircle2, Shield, BadgeCheck, Clock,
  ChevronRight, Landmark, PiggyBank, FileText
} from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * HeroSplit v3 — Mobile-first, green brand, real trust signals
 *
 * Key changes from v2:
 * - Removed fake social proof (50,000+ users, ₹12Cr saved)
 * - Replaced with real data signals (products tracked, data points per card)
 * - Green theme (forest green primary, mint accents)
 * - Removed gradient blobs, noise overlay, animated rainbow border
 * - Removed framer-motion dependency (CSS-only animations)
 * - Mobile-first: search prominent, quick action pills above fold
 * - Trust signals inline (not a separate section at the bottom)
 */

const QUICK_CATEGORIES = [
  { label: "Credit Cards", href: "/credit-cards", icon: CreditCard },
  { label: "SIP & Mutual Funds", href: "/mutual-funds", icon: TrendingUp },
  { label: "Loans", href: "/loans", icon: Landmark },
  { label: "Insurance", href: "/insurance", icon: Shield },
  { label: "Fixed Deposits", href: "/fixed-deposits", icon: PiggyBank },
  { label: "Calculators", href: "/calculators", icon: Calculator },
] as const;

const TRUST_SIGNALS = [
  { icon: BadgeCheck, text: "Free. Independent. No paid rankings." },
  { icon: Shield, text: "23 data points per product" },
  { icon: Clock, text: "Updated daily at 9 AM" },
] as const;

export default function HeroSplit() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50/80 via-white to-white dark:from-[#0A1F14] dark:via-[#0A1F14] dark:to-[#0D1B1A] pt-24 pb-12 lg:pt-32 lg:pb-20">
      {/* Subtle background — single gradient, no blobs/noise/grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-green-100/40 to-transparent dark:from-green-900/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Trust Banner — inline, above headline */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 lg:mb-10 animate-fade-in">
          {TRUST_SIGNALS.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <Icon className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left Column: Value Prop */}
          <div className="lg:w-1/2 text-center lg:text-left space-y-6">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              India&apos;s Most Trusted{' '}
              <span className="text-green-700 dark:text-green-400 italic">
                Finance Comparison
              </span>{' '}
              Platform
            </h1>

            {/* Data authority — what makes us credible (real, verifiable) */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed mx-auto lg:mx-0">
              Compare credit cards, mutual funds, loans & insurance —
              explained simply, ranked honestly, updated daily.
            </p>

            {/* Three benefit checkmarks */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-sm">
              {[
                "500+ financial products tracked",
                "Zero ads, fully transparent",
                "AI-powered recommendations"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-lg mt-6 mx-auto lg:mx-0">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-green-700 dark:text-green-400" />
              </div>
              <input
                type="text"
                placeholder="Search cards, funds, calculators..."
                className="w-full h-14 pl-12 pr-28 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium shadow-md text-base text-slate-900 dark:text-white placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`;
                  }
                }}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button
                  variant="default"
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl text-sm shadow-md active:scale-95 whitespace-nowrap h-10 px-4"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Popular search chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-xs text-slate-500">Popular:</span>
              {["Best Rewards Cards", "Tax Saving Funds", "SIP Calculator", "Home Loan EMI"].map((chip, i) => (
                <Link
                  key={i}
                  href={`/search?q=${encodeURIComponent(chip)}`}
                  className="px-3 py-1.5 text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-200/50 dark:border-green-800/50"
                >
                  {chip}
                </Link>
              ))}
            </div>

            {/* Real data authority strip (no fake user counts) */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Tracking 500+ products
              </span>
              <span className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
              <span>23 data points each</span>
              <span className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
              <span>Verified daily</span>
            </div>
          </div>

          {/* Right Column: Quick Category Cards */}
          <div className="lg:w-1/2 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_CATEGORIES.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href} className="group">
                  <div className="relative bg-white dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/60 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-800 transition-all duration-200 h-full">
                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/40 flex items-center justify-center mb-3 group-hover:bg-green-100 dark:group-hover:bg-green-900/60 transition-colors">
                      <Icon className="w-5 h-5 text-green-700 dark:text-green-400" strokeWidth={1.8} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      {label}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Compare now <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
