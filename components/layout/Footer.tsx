"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useT, useLocale } from "@/lib/i18n/client";
import { localizedPath } from "@/lib/i18n/url";
import type { StringKey } from "@/lib/i18n/strings/en";

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
            href: "/investing/learn/ppf-vs-nps-which-is-better-for-retirement-savings",
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

const SOCIAL_CHANNELS = [
  {
    label: "InvestingPro India",
    platform: "on Telegram",
    href: "https://t.me/InvestingProIndia",
    svg: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-[14px] h-[14px] fill-current"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.464.141a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.329-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: "InvestingPro India",
    platform: "on WhatsApp",
    href: "https://whatsapp.com/channel/0029VbCSOFJ3gvWbAnDRuC2T",
    svg: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-[14px] h-[14px] fill-current"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
      </svg>
    ),
  },
];

// Legal + compliance block — separated below the main grid because
// regulators (SEBI, RBI) and search engines both reward explicit disclosures.
//
// `labelKey` resolves through `t()` when present so legal language
// localises with the rest of the chrome. Items without a key fall
// back to the English `label` until Phase 2b expands the strings file.
const LEGAL_LINKS: Array<{
  label: string;
  labelKey?: StringKey;
  href: string;
}> = [
  { label: "Privacy Policy", labelKey: "footer.privacy", href: "/privacy" },
  { label: "Terms of Service", labelKey: "footer.terms", href: "/terms" },
  {
    label: "Cookie Policy",
    labelKey: "footer.cookies",
    href: "/cookie-policy",
  },
  {
    label: "Advertiser Disclosure",
    labelKey: "footer.advertiserDisclosure",
    href: "/advertiser-disclosure",
  },
  {
    label: "Editorial Standards",
    labelKey: "footer.editorialStandards",
    href: "/about/editorial-standards",
  },
  { label: "How We Rate", href: "/about/methodology" },
  {
    label: "Corrections Policy",
    labelKey: "footer.corrections",
    href: "/corrections",
  },
  { label: "Security", labelKey: "footer.security", href: "/security" },
];

export default function Footer() {
  const pathname = usePathname();
  const [openCol, setOpenCol] = useState<number | null>(null);
  const t = useT();
  const locale = useLocale();
  const lp = (href: string) => localizedPath(href, locale);

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
                            href={lp(link.href)}
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
                              href={lp(link.href)}
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

        {/* Follow — broadcast channels (channels, not 1:1 chat) */}
        <div className="mt-12 pt-8 border-t border-canvas-15">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-1">
                Follow InvestingPro
              </div>
              <p className="text-[12px] text-canvas-70">
                Rate changes, rule updates, and picks — broadcast only, no spam.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_CHANNELS.map((channel) => (
                <a
                  key={channel.href}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-2 border border-canvas-15 rounded-sm text-[13px] text-canvas hover:text-indian-gold hover:border-indian-gold transition-colors"
                >
                  <span className="text-canvas-70 group-hover:text-indian-gold transition-colors">
                    {channel.svg}
                  </span>
                  <span className="font-medium">{channel.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-canvas-70 group-hover:text-indian-gold transition-colors">
                    {channel.platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip — logo + legal links + copyright */}
        <div className="mt-10 pt-8 border-t border-canvas-15">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Logo + tagline */}
            <div>
              <div className="flex items-center gap-0.5">
                <span className="text-[22px] font-display font-black text-canvas">
                  Investing
                </span>
                <span className="text-[22px] font-display font-black text-indian-gold">
                  Pro
                </span>
              </div>
              <p className="text-[12px] text-canvas-70 mt-1">
                India&apos;s Independent Finance Platform
              </p>
            </div>

            {/* Legal links grid */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={lp(link.href)}
                  className="text-[12px] text-canvas-70 hover:text-canvas transition-colors"
                >
                  {link.labelKey ? t(link.labelKey) : link.label}
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
              href={lp("/about/how-we-make-money")}
              className="text-indian-gold hover:underline"
            >
              {t("footer.howWeMakeMoney")}
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
