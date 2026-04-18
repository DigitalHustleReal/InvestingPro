"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Credit Cards", href: "/credit-cards" },
      { label: "Loans", href: "/loans" },
      { label: "Mutual Funds", href: "/mutual-funds" },
      { label: "Insurance", href: "/insurance" },
      { label: "Demat Accounts", href: "/demat-accounts" },
      { label: "Fixed Deposits", href: "/fixed-deposits" },
      { label: "Banking", href: "/banking" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "All Articles", href: "/articles" },
      { label: "Glossary", href: "/glossary" },
      {
        label: "Personal Finance",
        href: "/articles?category=personal-finance",
      },
      { label: "Tax Planning", href: "/articles?category=tax" },
      {
        label: "Investing Basics",
        href: "/articles?category=investing-basics",
      },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "SIP Calculator", href: "/calculators/sip" },
      { label: "EMI Calculator", href: "/calculators/emi" },
      { label: "FD Calculator", href: "/calculators/fd" },
      { label: "Tax Calculator", href: "/calculators/tax" },
      { label: "All Calculators", href: "/calculators" },
      { label: "Compare Products", href: "/compare" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Editorial Standards", href: "/about/editorial-standards" },
      { label: "How We Rate", href: "/about/methodology" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Advertiser Disclosure", href: "/advertiser-disclosure" },
      { label: "Security", href: "/security" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[--v2-canvas] border-t-2 border-[--v2-ink]/10">
      {/* Trust bar */}
      <div className="border-b-2 border-[--v2-ink]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            "No paid rankings",
            "Methodology disclosed",
            "SEBI-compliant advice",
            "228+ researched articles",
          ].map((item) => (
            <span
              key={item}
              className="font-data text-[11px] uppercase tracking-[3px] text-[--v2-ink]/30"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-data text-[11px] uppercase tracking-[3px] text-[#D97706] mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[--v2-ink]/50 hover:text-[--v2-ink] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-[--v2-ink]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-[--v2-ink]">
              Investing<span className="text-[#D97706]">P₹o</span>
            </span>
            <span className="font-data text-[10px] text-[--v2-ink]/30 uppercase tracking-[2px]">
              India&apos;s Independent Finance Platform
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-data text-[11px] text-[--v2-ink]/30">
              &copy; {new Date().getFullYear()} InvestingPro.in
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 border-2 border-[--v2-ink]/10 hover:border-[--v2-ink]/30 text-[--v2-ink]/40 hover:text-[--v2-ink] transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t-2 border-[--v2-ink]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="font-data text-[10px] text-[--v2-ink]/20 leading-relaxed">
            InvestingPro.in is an independent comparison platform. We may earn
            affiliate commissions when you apply through our links. Our rankings
            and reviews are never influenced by compensation. All information is
            for educational purposes and does not constitute financial advice.
            Please consult a SEBI-registered advisor before making investment
            decisions. Rates and offers are subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}
