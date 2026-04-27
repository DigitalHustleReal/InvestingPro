"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, MapPin, Linkedin, Instagram } from "lucide-react";
import PWAInstallButton from "@/components/pwa/PWAInstallButton";

// ─── Brand constants ────────────────────────────────────────────────────────
// Single source of truth for NAP data — visible footer + LocalBusiness JSON-LD
// must always match. "Flat 4-12" is intentionally generic per Indian fintech
// founder-safety convention (see Paisabazaar, BankBazaar for same pattern).
const BRAND_ADDRESS = {
  street: "Flat 4-12, Viman Nagar, Lane 10, NAD",
  locality: "Visakhapatnam",
  region: "Andhra Pradesh",
  postal: "530009",
  country: "IN",
} as const;

const BRAND_EMAIL = "contact@investingpro.in";

// Social handles — used in visible footer + LocalBusiness sameAs JSON-LD.
// Update URLs here when real accounts are created; JSON-LD updates automatically.
const SOCIAL = [
  {
    name: "X",
    href: "https://x.com/investingpro_in",
    label: "Follow on X",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/investingpro_in",
    label: "Join Telegram channel",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://whatsapp.com/channel/investingpro",
    label: "WhatsApp updates",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/investingpro-in",
    label: "Follow on LinkedIn",
    svg: <Linkedin className="w-4 h-4" aria-hidden="true" />,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/investingpro_in",
    label: "Pinterest infographics",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/investingpro_in",
    label: "Follow on Instagram",
    svg: <Instagram className="w-4 h-4" aria-hidden="true" />,
  },
] as const;

// ─── Nav columns ─────────────────────────────────────────────────────────────
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

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Advertiser Disclosure", href: "/advertiser-disclosure" },
  { label: "Editorial Standards", href: "/about/editorial-standards" },
  { label: "How We Rate", href: "/about/methodology" },
  { label: "Corrections Policy", href: "/corrections" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Security", href: "/security" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

// ─── Mini homepage mockup ────────────────────────────────────────────────────
// Renders a pixel-accurate but scaled-down representation of the InvestingPro
// homepage inside the phone frame. Not a screenshot — pure HTML/CSS so it's
// always in sync with the brand identity and renders crisply on any DPI.
function HomepageMockup() {
  return (
    <div
      className="w-full h-full bg-[#FAFAF9] flex flex-col overflow-hidden"
      style={{ fontSize: "7px" }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-3 pt-2 pb-1"
        style={{ background: "#0A1F14" }}
      >
        <span className="font-mono text-[6px] text-[#FAFAF9] font-semibold">
          9:41
        </span>
        <div className="flex items-center gap-[3px]">
          {/* Signal bars */}
          <div className="flex items-end gap-[1.5px]">
            <div className="w-[2px] h-[3px] bg-[#FAFAF9] rounded-[0.5px]" />
            <div className="w-[2px] h-[4px] bg-[#FAFAF9] rounded-[0.5px]" />
            <div className="w-[2px] h-[5px] bg-[#FAFAF9] rounded-[0.5px]" />
            <div className="w-[2px] h-[6px] bg-[#FAFAF9] rounded-[0.5px]" />
          </div>
          {/* WiFi */}
          <svg viewBox="0 0 10 8" className="w-[8px] h-[6px] fill-[#FAFAF9]">
            <path d="M5 6.5a1 1 0 110 1 1 1 0 010-1zM5 4.2a3.3 3.3 0 012.35.97l.94-.94A4.6 4.6 0 005 3a4.6 4.6 0 00-3.29 1.23l.94.94A3.3 3.3 0 015 4.2zM5 1.5A6.5 6.5 0 0110 4l.7-.7A7.5 7.5 0 005 0 7.5 7.5 0 00-.7 3.3L0 4a6.5 6.5 0 015-2.5z" />
          </svg>
          {/* Battery */}
          <div className="flex items-center">
            <div className="w-[11px] h-[6px] border border-[#FAFAF9] rounded-[1px] relative">
              <div className="absolute inset-[1px] right-[2px] bg-[#FAFAF9] rounded-[0.5px]" />
            </div>
            <div className="w-[1.5px] h-[3px] bg-[#FAFAF9] rounded-r-[1px]" />
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div
        className="flex items-center justify-between px-3 py-[5px]"
        style={{ background: "#0A1F14" }}
      >
        <div className="flex items-center gap-[3px]">
          {/* IP monogram */}
          <div
            className="w-[14px] h-[14px] rounded-[2px] flex items-center justify-center"
            style={{ background: "#166534" }}
          >
            <span className="font-mono font-black text-[6px] text-[#FAFAF9]">
              IP
            </span>
          </div>
          <div className="flex items-baseline gap-0">
            <span className="font-sans font-black text-[7px] text-[#FAFAF9] leading-none">
              Investing
            </span>
            <span className="font-sans font-black text-[7px] text-[#FAFAF9] leading-none">
              Pro
            </span>
            <span
              className="font-sans font-black text-[7px] leading-none"
              style={{ color: "#D97706" }}
            >
              .
            </span>
          </div>
        </div>
        {/* Hamburger */}
        <div className="flex flex-col gap-[2px] pr-0.5">
          <div className="w-[10px] h-[1px] bg-[#FAFAF9] rounded" />
          <div className="w-[10px] h-[1px] bg-[#FAFAF9] rounded" />
          <div className="w-[7px] h-[1px] bg-[#FAFAF9] rounded" />
        </div>
      </div>

      {/* TrustBar ticker */}
      <div
        className="flex items-center gap-3 px-3 py-[3px] overflow-hidden"
        style={{
          background: "#0A1F14",
          borderBottom: "1px solid rgba(250,250,249,0.1)",
        }}
      >
        <span
          className="font-mono text-[5px] uppercase tracking-wide whitespace-nowrap"
          style={{ color: "#D97706" }}
        >
          LIVE
        </span>
        <div className="flex items-center gap-[6px] overflow-hidden">
          {[
            { label: "FD Rate", val: "9.10%" },
            { label: "Repo", val: "6.50%" },
            { label: "Savings", val: "7.25%" },
          ].map((d) => (
            <div
              key={d.label}
              className="flex items-center gap-[3px] whitespace-nowrap"
            >
              <span
                className="font-mono text-[5px] uppercase"
                style={{ color: "rgba(250,250,249,0.6)" }}
              >
                {d.label}
              </span>
              <span
                className="font-mono text-[5px] font-bold"
                style={{ color: "#16A34A" }}
              >
                {d.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero section */}
      <div className="px-3 pt-3 pb-2" style={{ background: "#0A1F14" }}>
        {/* Section label */}
        <div
          className="font-mono text-[5px] uppercase tracking-widest mb-1"
          style={{ color: "#D97706" }}
        >
          Money, Decoded.
        </div>
        {/* Headline */}
        <div
          className="font-serif font-black leading-[1.05] tracking-tight mb-2"
          style={{
            fontSize: "12px",
            color: "#FAFAF9",
            fontFamily: "Georgia, serif",
          }}
        >
          Which SIP makes
          <br />
          <span style={{ color: "#D97706" }}>₹1 Cr</span> fastest?
        </div>
        {/* CTA pill */}
        <div
          className="inline-flex items-center gap-[4px] px-2 py-[3px] rounded-[2px]"
          style={{ background: "#166534" }}
        >
          <span className="font-mono text-[5px] font-bold text-[#FAFAF9] uppercase tracking-wide">
            Calculate →
          </span>
        </div>
      </div>

      {/* Rate cards row */}
      <div className="px-3 py-2 flex gap-1.5" style={{ background: "#FAFAF9" }}>
        {[
          { label: "Best FD", val: "9.10%", sub: "Suryoday SFB" },
          { label: "Top CC", val: "5% CB", sub: "Axis Ace" },
        ].map((card) => (
          <div
            key={card.label}
            className="flex-1 p-[5px] border rounded-[2px]"
            style={{ borderColor: "rgba(10,31,20,0.12)", background: "#fff" }}
          >
            <div
              className="font-mono text-[5px] uppercase tracking-wide mb-[2px]"
              style={{ color: "rgba(10,31,20,0.5)" }}
            >
              {card.label}
            </div>
            <div
              className="font-mono font-black text-[9px] leading-none"
              style={{ color: "#16A34A" }}
            >
              {card.val}
            </div>
            <div
              className="font-mono text-[4.5px] mt-[2px]"
              style={{ color: "rgba(10,31,20,0.4)" }}
            >
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Category chips */}
      <div
        className="px-3 py-[5px] flex flex-wrap gap-[4px]"
        style={{
          background: "#FAFAF9",
          borderTop: "1px solid rgba(10,31,20,0.06)",
        }}
      >
        {["Cards", "MF", "Loans", "FD", "Tax", "Demat"].map((cat) => (
          <div
            key={cat}
            className="px-[5px] py-[2px] rounded-[1px] font-mono text-[5px] font-bold uppercase tracking-wide border"
            style={{
              borderColor: "rgba(10,31,20,0.2)",
              color: "#0A1F14",
              background: "#FAFAF9",
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Article preview cards */}
      <div
        className="flex-1 px-3 py-2 space-y-[5px]"
        style={{ background: "#FAFAF9" }}
      >
        <div
          className="font-mono text-[5px] uppercase tracking-widest mb-1"
          style={{ color: "#D97706" }}
        >
          This Week
        </div>
        {[
          { cat: "TAX", title: "New regime vs Old: 2024-25 verdict" },
          { cat: "MF", title: "Best ELSS funds to max 80C" },
        ].map((a) => (
          <div
            key={a.title}
            className="flex items-start gap-[5px] pb-[5px]"
            style={{ borderBottom: "1px solid rgba(10,31,20,0.06)" }}
          >
            <div
              className="flex-shrink-0 w-[8px] h-[8px] rounded-[1px] mt-[1px] font-mono text-[4px] flex items-center justify-center font-bold text-[#FAFAF9]"
              style={{ background: "#166534" }}
            >
              {a.cat[0]}
            </div>
            <div>
              <div
                className="font-mono text-[4.5px] font-bold uppercase tracking-wide mb-[1px]"
                style={{ color: "#D97706" }}
              >
                {a.cat}
              </div>
              <div
                className="text-[5.5px] font-sans leading-[1.3]"
                style={{ color: "#0A1F14", fontWeight: 600 }}
              >
                {a.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Home indicator */}
      <div
        className="flex justify-center pb-1.5 pt-1"
        style={{ background: "#FAFAF9" }}
      >
        <div
          className="w-[30px] h-[2px] rounded-full"
          style={{ background: "rgba(10,31,20,0.3)" }}
        />
      </div>
    </div>
  );
}

// ─── Newsletter capture strip ────────────────────────────────────────────────
function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "footer" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="border-b border-canvas-15 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Copy */}
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-1">
            Weekly insights · Free
          </div>
          <p className="font-display font-black text-[20px] md:text-[22px] text-canvas leading-tight tracking-tight">
            Money moves, decoded every Sunday.
          </p>
          <p className="text-[12px] text-canvas-70 mt-1">
            Rate changes, SEBI alerts, tax deadlines — one email, no noise.
          </p>
        </div>

        {/* Form */}
        {status === "success" ? (
          <div className="flex items-center gap-2 px-4 py-3 border border-action-green/40 rounded-sm">
            <span className="font-mono text-[11px] text-action-green uppercase tracking-wider">
              ✓ You&rsquo;re in. Check your inbox.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 md:min-w-[360px]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address for newsletter"
              className="flex-1 px-4 py-2.5 bg-canvas text-ink font-mono text-[12px] placeholder:text-ink-40 border border-canvas-15 rounded-sm outline-none focus:border-indian-gold transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 bg-indian-gold text-ink font-mono text-[11px] uppercase tracking-wider font-bold rounded-sm hover:bg-[#b45309] transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {status === "loading" ? "Sending…" : "Get insights →"}
            </button>
          </form>
        )}
      </div>
      {status === "error" && (
        <p className="font-mono text-[10px] text-warning-red mt-2">
          Something went wrong — try again or email us directly.
        </p>
      )}
    </div>
  );
}

// ─── Main footer ─────────────────────────────────────────────────────────────
export default function Footer() {
  const pathname = usePathname();
  const [openCol, setOpenCol] = useState<number | null>(null);
  const [complianceOpen, setComplianceOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="surface-ink pt-10 pb-10">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* ── 1. Newsletter strip ──────────────────────────────────────── */}
        <NewsletterStrip />

        {/* ── 2. Navigation grid ──────────────────────────────────────────
            6-column SEO inventory grid (~60 internal links).
            Desktop: always-visible grid.
            Mobile: accordion (tap column heading to expand).
        */}
        <div className="mt-12">
          {/* Desktop grid */}
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
                    className={`w-4 h-4 text-canvas-70 transition-transform ${openCol === i ? "rotate-180" : ""}`}
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
        </div>

        {/* ── 3. PWA install card ─────────────────────────────────────────
            Phone mockup (LEFT) + install CTA text (RIGHT) on desktop.
            Mobile: hides phone (users are on a phone — mockup is pointless),
            shows only the CTA text + install button.

            Phone shows a pixel-faithful mini render of the InvestingPro
            homepage — navbar, TrustBar, Hero, rate cards, category chips,
            article previews — so desktop users see exactly what they'll get.
        */}
        <div className="mt-14 pt-14 border-t border-canvas-15 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* LEFT — Phone mockup (desktop only) */}
          <div
            className="hidden md:flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative" style={{ perspective: "1200px" }}>
              {/* Subtle tilt for depth */}
              <div
                style={{
                  transform: "rotateY(-8deg) rotateX(4deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Phone shell */}
                <div
                  className="relative w-[210px] h-[420px] rounded-[38px] overflow-hidden shadow-2xl"
                  style={{
                    border: "7px solid #1a3527",
                    boxShadow:
                      "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                  }}
                >
                  {/* Notch cutout */}
                  <div className="absolute top-0 left-0 right-0 h-[10px] z-20 flex justify-center">
                    <div
                      className="w-[70px] h-[24px] rounded-b-[14px]"
                      style={{ background: "#1a3527" }}
                    />
                  </div>

                  {/* Side buttons — decorative */}
                  <div
                    className="absolute -right-[7px] top-[80px] w-[4px] h-[36px] rounded-r-[2px]"
                    style={{ background: "#1a3527" }}
                  />
                  <div
                    className="absolute -left-[7px] top-[60px] w-[4px] h-[24px] rounded-l-[2px]"
                    style={{ background: "#1a3527" }}
                  />
                  <div
                    className="absolute -left-[7px] top-[94px] w-[4px] h-[24px] rounded-l-[2px]"
                    style={{ background: "#1a3527" }}
                  />

                  {/* Screen */}
                  <div className="absolute inset-0 rounded-[32px] overflow-hidden">
                    <HomepageMockup />
                  </div>
                </div>

                {/* Reflection strip beneath phone */}
                <div
                  className="mt-3 mx-auto w-[140px] h-[12px] rounded-full blur-lg"
                  style={{ background: "rgba(22,163,74,0.2)" }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — CTA text (full width on mobile, right half on desktop) */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
              InvestingPro on your home screen
            </div>
            <h3 className="font-display font-black text-[28px] md:text-[32px] text-canvas leading-[1.05] tracking-tight mb-4">
              Offline calculators.
              <br className="hidden md:block" /> Zero install friction.
            </h3>

            {/* Feature list */}
            <ul className="space-y-2 mb-6">
              {[
                "72 calculators — work without internet",
                "Push alerts when repo rate or FD rates change",
                "No app store · No 200 MB download",
                "Instant from any browser — tap once",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <span className="font-mono text-[11px] text-action-green mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-[13px] text-canvas-70 leading-relaxed">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>

            <PWAInstallButton />

            <p className="font-mono text-[10px] text-canvas-70 mt-3 uppercase tracking-wider">
              Works on Android Chrome · iOS Safari · Desktop Chromium
            </p>
          </div>
        </div>

        {/* ── 4. Contact + Social band ────────────────────────────────────
            NAP data here matches LocalBusiness JSON-LD at the bottom.
            NAP consistency = local SEO ranking signal.
        */}
        <div className="mt-12 pt-12 border-t border-canvas-15 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address + Email */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
              Reach Us
            </div>
            <address className="not-italic">
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 text-canvas-70 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="text-[13px] text-canvas leading-relaxed">
                  {BRAND_ADDRESS.street}
                  <br />
                  {BRAND_ADDRESS.locality} – {BRAND_ADDRESS.postal}
                  <br />
                  {BRAND_ADDRESS.region}, India
                </div>
              </div>
              <div className="flex items-center gap-2.5 mt-3">
                <Mail
                  className="w-4 h-4 text-canvas-70 flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${BRAND_EMAIL}`}
                  className="text-[13px] text-canvas hover:text-indian-gold transition-colors"
                >
                  {BRAND_EMAIL}
                </a>
              </div>
            </address>
          </div>

          {/* Social */}
          <div className="space-y-3 md:text-right">
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
              Follow
            </div>
            <ul className="flex flex-wrap md:justify-end gap-2.5">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={s.label}
                    title={s.label}
                    className="inline-flex items-center justify-center w-10 h-10 border-2 border-canvas-15 rounded-sm text-canvas-70 hover:text-indian-gold hover:border-indian-gold transition-colors"
                  >
                    {s.svg}
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-mono text-[10px] uppercase tracking-wider text-canvas-70 leading-relaxed md:text-right max-w-[280px] md:ml-auto">
              Pinterest · infographics · Telegram · rate alerts · X · research
            </p>
          </div>
        </div>

        {/* ── 5. Bottom strip — logo + legal + copyright ──────────────── */}
        <div className="mt-12 pt-8 border-t border-canvas-15">
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
              <p className="text-[12px] text-canvas-70 mt-0.5">
                Money, Decoded.
              </p>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2">
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

        {/* ── 6. Compliance block ─────────────────────────────────────────
            Desktop: always-visible. Mobile: collapsed (tap to expand).
            Required for SEBI + affiliate model transparency. Not decoration.
        */}
        <div className="mt-8 pt-6 border-t border-canvas-15 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
              Regulatory & Compliance
            </div>
            <button
              type="button"
              onClick={() => setComplianceOpen((o) => !o)}
              aria-expanded={complianceOpen}
              aria-controls="footer-compliance-text"
              className="md:hidden inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-canvas-70 hover:text-canvas transition-colors"
            >
              {complianceOpen ? "Hide" : "Read full"}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${complianceOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div
            id="footer-compliance-text"
            className={`space-y-4 ${complianceOpen ? "block" : "hidden md:block"}`}
          >
            <p className="font-mono text-[11px] text-canvas-70 leading-[18px] max-w-[920px]">
              <strong className="text-canvas">
                InvestingPro is not a SEBI-registered investment advisor.
              </strong>{" "}
              Content on this platform is for educational and informational
              purposes only and does not constitute investment advice,
              solicitation, or recommendation to buy, sell, or hold any
              security, instrument, or product. Past performance does not
              guarantee future results. Mutual fund investments are subject to
              market risks; read all scheme-related documents carefully. Please
              consult a SEBI-registered investment advisor before making any
              investment decision.
            </p>

            <p className="font-mono text-[11px] text-canvas-70 leading-[18px] max-w-[920px]">
              <strong className="text-canvas">Affiliate disclosure:</strong>{" "}
              InvestingPro may earn affiliate commissions when you apply for
              financial products through our links. This never influences our
              rankings, reviews, or recommendations — our editorial process is
              independent and documented. See our{" "}
              <Link
                href="/about/how-we-make-money"
                className="text-indian-gold underline hover:no-underline"
              >
                How We Make Money
              </Link>{" "}
              page for details. Rates, offers, and product availability are
              subject to change without notice; always verify with the issuer
              before applying.
            </p>

            <p className="font-mono text-[11px] text-canvas-70 leading-[18px] max-w-[920px]">
              <strong className="text-canvas">Jurisdiction:</strong> This
              platform is intended for residents of India. Financial products
              and services referenced are governed by Indian regulators — RBI
              (banking, loans, deposits), SEBI (mutual funds, securities), IRDAI
              (insurance), and PFRDA (pensions/NPS). International users:
              products may not be available in your jurisdiction.
            </p>
          </div>

          {/* Copyright — always visible */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-canvas-15">
            <span className="font-mono text-[11px] text-canvas-70">
              &copy; {new Date().getFullYear()} InvestingPro.in · All rights
              reserved · Made in India · Andhra Pradesh
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              Last reviewed: Apr 2026
            </span>
          </div>
        </div>
      </div>

      {/* ── LocalBusiness JSON-LD (invisible — SEO) ──────────────────────
          NAP sourced from BRAND_ADDRESS/BRAND_EMAIL constants (never drift).
          sameAs = SOCIAL URLs for Knowledge Graph entity disambiguation.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: "InvestingPro",
            alternateName: "InvestingPro.in",
            url: "https://www.investingpro.in",
            logo: "https://www.investingpro.in/brand/wordmark-light-1024.png",
            description:
              "Money, Decoded. India's transparent personal finance comparison platform — credit cards, mutual funds, loans, fixed deposits, and 72 free calculators. Independent ratings, methodology disclosed.",
            address: {
              "@type": "PostalAddress",
              streetAddress: BRAND_ADDRESS.street,
              addressLocality: BRAND_ADDRESS.locality,
              addressRegion: BRAND_ADDRESS.region,
              postalCode: BRAND_ADDRESS.postal,
              addressCountry: BRAND_ADDRESS.country,
            },
            email: BRAND_EMAIL,
            areaServed: { "@type": "Country", name: "India" },
            knowsAbout: [
              "Personal Finance",
              "Credit Cards",
              "Mutual Funds",
              "Fixed Deposits",
              "Home Loans",
              "Personal Loans",
              "Tax Planning",
              "Retirement Planning",
              "Insurance",
            ],
            sameAs: SOCIAL.map((s) => s.href),
          }),
        }}
      />
    </footer>
  );
}
