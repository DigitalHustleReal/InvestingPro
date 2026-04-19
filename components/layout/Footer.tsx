"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

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
      { label: "Corrections", href: "/corrections" },
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
  const pathname = usePathname();
  const [openCol, setOpenCol] = useState<number | null>(null);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="surface-ink pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Main grid — 5 columns desktop, accordion mobile */}
        <div className="hidden md:grid md:grid-cols-5 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-label text-indian-gold mb-4">{col.title}</h3>
              <ul className="space-y-[10px]">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-canvas-70 hover:text-canvas transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden space-y-0 divide-y divide-canvas-15">
          {COLUMNS.map((col, i) => (
            <div key={col.title}>
              <button
                onClick={() => setOpenCol(openCol === i ? null : i)}
                className="w-full flex items-center justify-between min-h-[48px] py-3 cursor-pointer"
              >
                <span className="text-label text-indian-gold">{col.title}</span>
                <ChevronDown
                  className={`w-4 h-4 text-canvas-70 transition-transform ${
                    openCol === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openCol === i && (
                <ul className="pb-4 space-y-[10px]">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block text-[14px] text-canvas-70 hover:text-canvas transition-colors min-h-[44px] flex items-center"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-canvas-15">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Logo + tagline */}
            <div>
              <div className="flex items-center gap-0.5">
                <span className="text-[20px] font-display font-black text-canvas">
                  Investing
                </span>
                <span className="text-[20px] font-display font-black text-indian-gold">
                  Pro
                </span>
              </div>
              <p className="text-[13px] text-canvas-70 mt-1">
                India&apos;s Independent Finance Platform
              </p>
            </div>

            {/* Copyright */}
            <span className="text-mono-sm font-mono text-canvas-70">
              &copy; {new Date().getFullYear()} InvestingPro.in
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8">
          <p className="text-mono-sm font-mono text-canvas-70 leading-[18px] max-w-[800px]">
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
