"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

// Footer structure follows NerdWallet content pattern (not design):
// - 6 wide columns with sub-sections per column = ~60 SEO-valuable internal links
// - Deep-links to filtered listings and calc-specific pages for long-tail SEO
// - Legal/compliance block separated below, explicit about SEBI + affiliate model
// - Single source of truth: brainstorm.md §6 (content borrowed from NW, design ours)

const COLUMNS = [
  {
    title: "Credit Cards",
    sections: [
      {
        label: "By Category",
        links: [
          { label: "Best rewards cards", href: "/credit-cards?filter=rewards" },
          {
            label: "Best cashback cards",
            href: "/credit-cards?filter=cashback",
          },
          { label: "Best travel cards", href: "/credit-cards?filter=travel" },
          { label: "No annual fee cards", href: "/credit-cards?filter=no-fee" },
          { label: "Premium cards", href: "/credit-cards?filter=premium" },
        ],
      },
      {
        label: "By Issuer",
        links: [
          { label: "HDFC cards", href: "/credit-cards?issuer=hdfc" },
          { label: "ICICI cards", href: "/credit-cards?issuer=icici" },
          { label: "SBI cards", href: "/credit-cards?issuer=sbi" },
          { label: "Axis cards", href: "/credit-cards?issuer=axis" },
        ],
      },
      {
        label: "Tools",
        links: [
          { label: "Find your card", href: "/credit-cards/find-your-card" },
          { label: "Compare cards", href: "/credit-cards/compare" },
        ],
      },
    ],
  },
  {
    title: "Loans",
    sections: [
      {
        label: "By Type",
        links: [
          { label: "Home loans", href: "/loans?type=home" },
          { label: "Personal loans", href: "/loans?type=personal" },
          { label: "Car loans", href: "/loans?type=car" },
          { label: "Education loans", href: "/loans?type=education" },
          { label: "Gold loans", href: "/loans?type=gold" },
          { label: "Business loans", href: "/loans?type=business" },
        ],
      },
      {
        label: "Calculators",
        links: [
          { label: "EMI calculator", href: "/calculators/emi" },
          { label: "Home loan EMI", href: "/calculators/home-loan-emi" },
          { label: "Prepayment savings", href: "/calculators/loan-prepayment" },
          {
            label: "Balance transfer",
            href: "/calculators/loan-balance-transfer",
          },
        ],
      },
    ],
  },
  {
    title: "Investing",
    sections: [
      {
        label: "Mutual Funds",
        links: [
          { label: "Top equity funds", href: "/mutual-funds?type=equity" },
          { label: "Index funds", href: "/mutual-funds?type=index" },
          { label: "ELSS (tax-saving)", href: "/mutual-funds?type=elss" },
          { label: "Debt funds", href: "/mutual-funds?type=debt" },
          { label: "All mutual funds", href: "/mutual-funds" },
        ],
      },
      {
        label: "Demat & Trading",
        links: [
          { label: "Discount brokers", href: "/demat-accounts?type=discount" },
          { label: "Full-service brokers", href: "/demat-accounts?type=full" },
          { label: "Brokerage calculator", href: "/calculators/brokerage" },
        ],
      },
      {
        label: "Calculators",
        links: [
          { label: "SIP calculator", href: "/calculators/sip" },
          { label: "Lumpsum calculator", href: "/calculators/lumpsum" },
          { label: "SWP calculator", href: "/calculators/swp" },
          { label: "CAGR calculator", href: "/calculators/cagr" },
        ],
      },
    ],
  },
  {
    title: "Banking & Savings",
    sections: [
      {
        label: "Fixed Deposits",
        links: [
          { label: "Highest FD rates", href: "/fixed-deposits?sort=rate" },
          {
            label: "Senior citizen FDs",
            href: "/fixed-deposits?filter=senior",
          },
          {
            label: "Tax-saving FDs",
            href: "/fixed-deposits?filter=tax-saving",
          },
          { label: "FD calculator", href: "/calculators/fd" },
        ],
      },
      {
        label: "Accounts",
        links: [
          { label: "Best savings accounts", href: "/banking" },
          { label: "High-interest accounts", href: "/banking?sort=rate" },
          { label: "Salary accounts", href: "/banking?type=salary" },
        ],
      },
      {
        label: "Schemes",
        links: [
          { label: "PPF calculator", href: "/calculators/ppf" },
          { label: "NPS calculator", href: "/calculators/nps" },
          {
            label: "PPF vs NPS",
            href: "/articles/ppf-vs-nps-which-is-better-for-retirement-savings",
          },
        ],
      },
    ],
  },
  {
    title: "Taxes & Insurance",
    sections: [
      {
        label: "Tax Planning",
        links: [
          { label: "Old vs New regime", href: "/calculators/old-vs-new-tax" },
          { label: "Tax calculator", href: "/calculators/tax" },
          { label: "HRA calculator", href: "/calculators/hra" },
          { label: "Capital gains (LTCG)", href: "/calculators/ltcg" },
          { label: "80C optimizer", href: "/calculators/80c" },
        ],
      },
      {
        label: "Insurance",
        links: [
          { label: "Term life insurance", href: "/insurance?type=term" },
          { label: "Health insurance", href: "/insurance?type=health" },
          { label: "Car insurance", href: "/insurance?type=car" },
          { label: "Coverage calculator", href: "/calculators/insurance" },
        ],
      },
    ],
  },
  {
    title: "Learn & About",
    sections: [
      {
        label: "Resources",
        links: [
          { label: "All articles", href: "/articles" },
          { label: "Glossary", href: "/glossary" },
          {
            label: "Personal finance",
            href: "/articles?category=personal-finance",
          },
          {
            label: "Investing basics",
            href: "/articles?category=investing-basics",
          },
          { label: "All calculators", href: "/calculators" },
        ],
      },
      {
        label: "Company",
        links: [
          { label: "About us", href: "/about" },
          { label: "Editorial team", href: "/about/editorial-team" },
          { label: "How we make money", href: "/about/how-we-make-money" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
  },
];

// Legal + compliance block — separated below the main grid because
// regulators (SEBI, RBI) and search engines both reward explicit disclosures.
const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Advertiser Disclosure", href: "/advertiser-disclosure" },
  { label: "Editorial Standards", href: "/about/editorial-standards" },
  { label: "How We Rate", href: "/about/methodology" },
  { label: "Corrections Policy", href: "/corrections" },
  { label: "Security", href: "/security" },
];

export default function Footer() {
  const pathname = usePathname();
  const [openCol, setOpenCol] = useState<number | null>(null);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="surface-ink pt-16 pb-10">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Main grid — 6 columns desktop with sub-sections per column, accordion on mobile */}
        <div className="hidden md:grid md:grid-cols-6 gap-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display font-black text-[15px] text-indian-gold mb-5 tracking-tight">
                {col.title}
              </h3>
              <div className="space-y-5">
                {col.sections.map((section) => (
                  <div key={section.label}>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-canvas-70 mb-2">
                      {section.label}
                    </div>
                    <ul className="space-y-[8px]">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-[13px] text-canvas hover:text-indian-gold transition-colors"
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
                <span className="font-display font-black text-[15px] text-indian-gold">
                  {col.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-canvas-70 transition-transform ${
                    openCol === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openCol === i && (
                <div className="pb-4 space-y-4">
                  {col.sections.map((section) => (
                    <div key={section.label}>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-canvas-70 mb-2">
                        {section.label}
                      </div>
                      <ul className="space-y-[6px]">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="block text-[14px] text-canvas hover:text-indian-gold transition-colors min-h-[40px] flex items-center"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom strip — logo + legal links + copyright */}
        <div className="mt-14 pt-8 border-t border-canvas-15">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Logo + tagline */}
            <div>
              <div className="flex items-center gap-0.5">
                <span className="text-[22px] font-display font-black text-canvas">
                  Investing
                </span>
                <span className="text-[22px] font-display font-black text-canvas">
                  Pro
                </span>
                <span className="text-[22px] font-display font-black text-indian-gold">
                  .
                </span>
              </div>
              <p className="text-[12px] text-canvas-70 mt-1">Money, Decoded.</p>
            </div>

            {/* Legal links grid */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[12px] text-canvas-70 hover:text-canvas transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance / regulatory block — required, not decoration */}
        <div className="mt-8 pt-6 border-t border-canvas-15 space-y-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
            Regulatory & Compliance
          </div>

          <p className="font-mono text-[11px] text-canvas-70 leading-[18px] max-w-[920px]">
            <strong className="text-canvas">
              InvestingPro is not a SEBI-registered investment advisor.
            </strong>{" "}
            Content on this platform is for educational and informational
            purposes only and does not constitute investment advice,
            solicitation, or recommendation to buy, sell, or hold any security,
            instrument, or product. Past performance does not guarantee future
            results. Mutual fund investments are subject to market risks; read
            all scheme-related documents carefully. Please consult a
            SEBI-registered investment advisor before making any investment
            decision.
          </p>

          <p className="font-mono text-[11px] text-canvas-70 leading-[18px] max-w-[920px]">
            <strong className="text-canvas">Affiliate disclosure:</strong>{" "}
            InvestingPro may earn affiliate commissions when you apply for
            financial products through our links. This never influences our
            rankings, reviews, or recommendations — our editorial process is
            independent and documented. See our{" "}
            <Link
              href="/about/how-we-make-money"
              className="text-indian-gold hover:underline"
            >
              How We Make Money
            </Link>{" "}
            page for details. Rates, offers, and product availability are
            subject to change without notice; always verify with the issuer
            before applying.
          </p>

          <p className="font-mono text-[11px] text-canvas-70 leading-[18px] max-w-[920px]">
            <strong className="text-canvas">Jurisdiction:</strong> This platform
            is intended for residents of India. Financial products and services
            referenced are governed by Indian regulators — RBI (banking, loans,
            deposits), SEBI (mutual funds, securities), IRDAI (insurance), and
            PFRDA (pensions/NPS). International users: products may not be
            available in your jurisdiction.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-canvas-15">
            <span className="font-mono text-[11px] text-canvas-70">
              &copy; {new Date().getFullYear()} InvestingPro.in · All rights
              reserved
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              Last reviewed: Apr 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
