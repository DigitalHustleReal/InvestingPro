"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUp,
  ChevronDown,
  Lock,
  ShieldCheck,
  Award,
  Smartphone,
  Bell,
  TrendingUp,
  Calculator,
  Star,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { getFooterLinks } from "@/lib/navigation/utils";

/* Trust badges for dark bg */
function FooterBadge({
  icon,
  text,
}: {
  icon: "lock" | "shield" | "award";
  text: string;
}) {
  const Icon = icon === "lock" ? Lock : icon === "shield" ? ShieldCheck : Award;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[.06] border border-white/[.08]">
      <Icon size={11} className="text-green-400" />
      <span className="text-[10px] text-gray-400 font-medium">{text}</span>
    </div>
  );
}

const PRODUCTS = [
  { name: "Credit Cards", href: "/credit-cards" },
  { name: "Mutual Funds", href: "/mutual-funds" },
  { name: "Loans", href: "/loans" },
  { name: "Fixed Deposits", href: "/fixed-deposits" },
  { name: "Insurance", href: "/insurance" },
  { name: "PPF & NPS", href: "/ppf-nps" },
  { name: "Demat Accounts", href: "/demat-accounts" },
];

const COMPANY = [
  { name: "About Us", href: "/about" },
  { name: "How We Make Money", href: "/how-we-make-money" },
  { name: "Methodology", href: "/methodology" },
  { name: "Editorial Policy", href: "/editorial-policy" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact-us" },
  { name: "Blog", href: "/blog" },
];

const TRUST = [
  { name: "Editorial Methodology", href: "/editorial-methodology" },
  { name: "Our Team", href: "/authors" },
  { name: "Corrections Policy", href: "/corrections" },
  { name: "About Our Data", href: "/about-our-data" },
  { name: "Editorial Standards", href: "/about/editorial-standards" },
];

const LEGAL = [
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Sitemap", href: "/sitemap.xml" },
];

export function Footer() {
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [disclaimerExpanded, setDisclaimerExpanded] = React.useState(false);

  const footerData = React.useMemo(() => getFooterLinks(), []);
  const displayCalculators = React.useMemo(() => {
    const calcs = footerData.calculators.slice(0, 6);
    return [...calcs, { name: "Compare Products", href: "/compare" }];
  }, [footerData.calculators]);

  React.useEffect(() => {
    const toggle = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const linkClass =
    "text-[13px] text-gray-400 hover:text-green-400 transition-colors";
  const headingClass =
    "text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-4";

  return (
    <footer
      className="relative bg-[#0A1F14] dark:bg-[#071410] overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        {/* ── App teaser — distinct bg from main footer ── */}
        <div className="py-12 lg:py-14 -mx-4 lg:-mx-8 px-4 lg:px-8 bg-[#0F2B1C] border-b border-white/[.06]">
          <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-14 lg:items-center">
            {/* Left — copy + features */}
            <div className="mb-10 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[.06] border border-white/[.08] rounded-full mb-4">
                <Smartphone size={11} className="text-green-400" />
                <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight mb-3">
                Track, compare, and save —{" "}
                <span className="text-green-400">one app</span>
              </h3>
              <p className="text-[14px] text-white/40 leading-relaxed mb-6 max-w-md">
                Monitor your net worth across mutual funds, FDs, and PPF. Get
                instant rate alerts. Run calculators on the go.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm">
                {[
                  { icon: TrendingUp, label: "Net worth tracker" },
                  { icon: Bell, label: "Rate alerts" },
                  { icon: Calculator, label: "25+ calculators" },
                  { icon: Star, label: "Saved comparisons" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[.05] border border-white/[.06] flex items-center justify-center flex-shrink-0">
                      <f.icon size={13} className="text-green-400" />
                    </div>
                    <span className="text-[12px] text-white/60">{f.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    if (
                      typeof window !== "undefined" &&
                      (window as any).__pwaInstallPrompt
                    ) {
                      (window as any).__pwaInstallPrompt.prompt();
                      return;
                    }
                    window.location.href = "/downloads";
                  }}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Install Web App
                </button>
                <Link
                  href="/downloads"
                  className="px-5 py-2.5 bg-white/[.05] hover:bg-white/[.08] border border-white/[.08] text-white/70 text-sm font-medium rounded-xl transition-colors"
                >
                  Join waitlist
                </Link>
              </div>
            </div>

            {/* Right — phone mockup */}
            <div className="hidden lg:block">
              <div className="relative w-[320px]">
                <div className="absolute -inset-8 bg-green-500/[.04] rounded-[60px] blur-[30px] pointer-events-none" />
                <div className="relative rounded-[42px] bg-gradient-to-b from-[#2A2A2E] to-[#1A1A1E] p-[5px] shadow-2xl shadow-black/40">
                  <div className="rounded-[37px] overflow-hidden bg-white">
                    {/* Dynamic island */}
                    <div className="flex justify-center pt-2 bg-[#0A1F14]">
                      <div className="w-[90px] h-[24px] bg-black rounded-full" />
                    </div>
                    {/* Header */}
                    <div className="bg-[#0A1F14] px-5 pb-4 pt-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[14px] text-white font-bold tracking-tight">
                            InvestingPro
                          </p>
                          <p className="text-[10px] text-white/30 mt-0.5">
                            Your finances at a glance
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Bell size={14} className="text-green-400" />
                        </div>
                      </div>
                    </div>
                    {/* Net worth */}
                    <div className="mx-4 mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl">
                      <p className="text-[9px] text-green-600 font-semibold uppercase tracking-wider">
                        Net Worth
                      </p>
                      <p className="text-[22px] font-black text-gray-900 tracking-tight mt-0.5">
                        ₹24,85,200
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp size={11} className="text-green-600" />
                        <span className="text-[10px] font-semibold text-green-600">
                          +₹1,89,400 (+8.2%)
                        </span>
                      </div>
                      {/* Area chart — net worth growth */}
                      <div className="mt-3 -mx-1">
                        <svg
                          viewBox="0 0 260 60"
                          className="w-full h-auto"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="areaFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#16a34a"
                                stopOpacity="0.25"
                              />
                              <stop
                                offset="100%"
                                stopColor="#16a34a"
                                stopOpacity="0.02"
                              />
                            </linearGradient>
                          </defs>
                          {/* Area fill */}
                          <path
                            d="M0,48 C20,44 40,40 65,35 C90,30 110,28 130,22 C150,18 170,16 195,12 C220,9 240,6 260,4 L260,60 L0,60 Z"
                            fill="url(#areaFill)"
                          />
                          {/* Line */}
                          <path
                            d="M0,48 C20,44 40,40 65,35 C90,30 110,28 130,22 C150,18 170,16 195,12 C220,9 240,6 260,4"
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          {/* Current dot */}
                          <circle cx="260" cy="4" r="3" fill="#16a34a" />
                          <circle
                            cx="260"
                            cy="4"
                            r="5"
                            fill="#16a34a"
                            opacity="0.2"
                          />
                        </svg>
                        <div className="flex justify-between px-1 mt-0.5">
                          <span className="text-[7px] text-green-600/50">
                            Jan
                          </span>
                          <span className="text-[7px] text-green-600/50">
                            Jun
                          </span>
                          <span className="text-[7px] text-green-600/80 font-semibold">
                            Now
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-3 pt-3 border-t border-green-200/50">
                        {[
                          { l: "Mutual Funds", v: "₹14.2L", p: 57 },
                          { l: "Fixed Deposits", v: "₹6.8L", p: 27 },
                          { l: "PPF + NPS", v: "₹3.7L", p: 16 },
                        ].map((a) => (
                          <div key={a.l} className="flex-1">
                            <p className="text-[8px] text-green-700/50">
                              {a.l}
                            </p>
                            <p className="text-[10px] font-bold text-gray-900">
                              {a.v}
                            </p>
                            <div className="mt-1 h-1.5 bg-green-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${a.p}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Rate alerts */}
                    <div className="mx-4 mt-3 p-3.5 border border-gray-100 rounded-2xl">
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Rate Alerts
                      </p>
                      {[
                        {
                          b: "SBI",
                          t: "FD 1yr",
                          r: "6.90%",
                          d: "↓",
                          c: "text-red-500",
                        },
                        {
                          b: "HDFC",
                          t: "Home Loan",
                          r: "8.50%",
                          d: "—",
                          c: "text-gray-300",
                        },
                        {
                          b: "Axis",
                          t: "Savings",
                          r: "3.50%",
                          d: "↑",
                          c: "text-green-600",
                        },
                      ].map((r) => (
                        <div
                          key={r.b}
                          className="flex items-center justify-between py-1.5 border-t border-gray-50"
                        >
                          <span className="text-[10px] text-gray-600">
                            <span className="font-semibold text-gray-900">
                              {r.b}
                            </span>{" "}
                            {r.t}
                          </span>
                          <span className="text-[11px] font-bold text-gray-900">
                            {r.r} <span className={r.c}>{r.d}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5-column link grid ── */}
        <div className="py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo variant="light" size="md" showText />
            <p className="mt-4 text-[13px] text-gray-400 leading-relaxed max-w-[240px]">
              Independent financial product research and comparison for India.
            </p>
          </div>
          <div>
            <h4 className={headingClass}>Products</h4>
            <ul className="space-y-2">
              {PRODUCTS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={headingClass}>Tools</h4>
            <ul className="space-y-2">
              {displayCalculators.map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={headingClass}>Company</h4>
            <ul className="space-y-2">
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={headingClass}>Trust & Transparency</h4>
            <ul className="space-y-2">
              {TRUST.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={headingClass}>Legal</h4>
            <ul className="space-y-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="py-5 border-t border-white/[.06]">
          <div className="rounded-lg bg-white/[.03] border border-white/[.06] px-5 py-3.5">
            <button
              onClick={() => setDisclaimerExpanded(!disclaimerExpanded)}
              className="w-full flex items-center justify-between gap-4 text-left"
            >
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                Important Disclaimer — Not investment advice
              </span>
              <ChevronDown
                size={14}
                className={`text-gray-500 transition-transform flex-shrink-0 ${disclaimerExpanded ? "rotate-180" : ""}`}
              />
            </button>
            {disclaimerExpanded && (
              <div className="mt-3 pt-3 border-t border-white/[.06] space-y-2 text-xs text-gray-400 leading-relaxed">
                <p>
                  <strong className="text-gray-300">
                    InvestingPro.in is NOT a SEBI registered investment advisor,
                    financial advisor, or stockbroker.
                  </strong>{" "}
                  We are an independent research, education, and discovery
                  platform. Content, tools, and comparisons are for
                  informational and educational purposes only.
                </p>
                <p>
                  Nothing on this website constitutes a recommendation to buy,
                  sell, or hold any security or financial product. Past
                  performance does not guarantee future results. Consult a
                  SEBI-registered financial advisor before making investment
                  decisions.
                </p>
                <Link
                  href="/disclaimer"
                  className="inline-block text-green-400 hover:text-green-300 font-medium mt-1"
                >
                  Read full disclaimer →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Follow Us ── */}
        <div className="py-5 border-t border-white/[.06]">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
              Follow Us
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/InvestingProIN"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X (Twitter)"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[.06] border border-white/[.08] hover:bg-green-600/20 hover:border-green-500/30 transition-colors group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our WhatsApp Channel"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[.06] border border-white/[.08] hover:bg-green-600/20 hover:border-green-500/30 transition-colors group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://t.me/investingpro_in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join our Telegram channel"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[.06] border border-white/[.08] hover:bg-green-600/20 hover:border-green-500/30 transition-colors group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe on YouTube"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[.06] border border-white/[.08] hover:bg-green-600/20 hover:border-green-500/30 transition-colors group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="py-5 border-t border-white/[.06]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-gray-500 order-2 md:order-1">
              © {new Date().getFullYear()} InvestingPro.in. All rights reserved.
            </p>
            <div className="order-1 md:order-2 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[.04] border border-white/[.06]">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                Made with{" "}
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 inline-block"
                  fill="#ef4444"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>{" "}
                in India
              </span>
            </div>
            <div className="order-3 flex items-center gap-2">
              <FooterBadge icon="lock" text="Secure" />
              <FooterBadge icon="shield" text="Data Protected" />
              <FooterBadge icon="award" text="RBI Compliant" />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-4 leading-relaxed max-w-2xl mx-auto">
            Independent research platform · Not a SEBI registered advisor ·
            Educational purposes only
            <span className="mx-2 text-gray-700">|</span>
            Owned &amp; operated in India · Not affiliated with Investing.com
          </p>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 p-3 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all duration-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </footer>
  );
}
