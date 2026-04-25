/**
 * 404 Page — v3 redesign (Server Component)
 *
 * Turns a dead end into a useful landing. Shows:
 * - The 6 most trafficked calculators
 * - 3 high-conversion money hubs
 * - 3 "Did you know" data hooks (rupee-accurate, FY 2026-27)
 *
 * No client JS — all static, zero hydration cost.
 */

import Link from "next/link";
import { ArrowUpRight, Home, Search } from "lucide-react";

const TOP_CALCULATORS = [
  {
    slug: "sip",
    title: "SIP calculator",
    tagline: "Project mutual-fund returns",
    accent: "₹",
  },
  {
    slug: "emi",
    title: "EMI calculator",
    tagline: "Loan monthly payment",
    accent: "₹",
  },
  {
    slug: "hra",
    title: "HRA exemption",
    tagline: "Metro vs non-metro, 3-part rule",
    accent: "₹",
  },
  {
    slug: "old-vs-new-tax",
    title: "Old vs new regime",
    tagline: "Find out which saves more",
    accent: "%",
  },
  {
    slug: "fd",
    title: "FD calculator",
    tagline: "Maturity + interest payout",
    accent: "₹",
  },
  {
    slug: "ltcg",
    title: "LTCG calculator",
    tagline: "Post-2024 ₹1.25L threshold",
    accent: "%",
  },
];

const TOP_HUBS = [
  {
    href: "/credit-cards",
    title: "Credit cards",
    tagline: "Compare rewards, cashback, premium and no-fee cards",
  },
  {
    href: "/investing/learn",
    title: "Investing guides",
    tagline: "Mutual funds, stocks, NPS, PPF — explained with examples",
  },
  {
    href: "/taxes",
    title: "Tax planning",
    tagline: "Old vs new regime, 80C optimizer, LTCG rules",
  },
];

// "Did you know" hooks — rupee-accurate anchor facts that turn a 404
// into a teaching moment. Update annually after Budget.
const DATA_HOOKS = [
  {
    headline: "₹10,000 / month SIP at 12% for 20 years",
    value: "₹99.9 L",
    note: "That's the power of compounding. Calculator: /calculators/sip",
  },
  {
    headline: "Old vs new regime — at ₹12 L income, deductions > ₹2.5 L",
    value: "Old wins",
    note: "Below that threshold, new regime is cheaper. Run it yourself.",
  },
  {
    headline: "LTCG threshold jumped post-Budget 2024 from ₹1 L to",
    value: "₹1.25 L",
    note: "Equity LTCG above this now taxed at 12.5%, not 10%.",
  },
];

export default function NotFound() {
  return (
    <>
      {/* Hero — ink */}
      <section className="surface-ink pt-16 pb-14">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-indian-gold mb-5">
            404 · Page not found
          </div>
          <h1 className="font-display font-black text-[52px] md:text-[76px] lg:text-[92px] leading-[0.98] tracking-tight text-canvas max-w-[980px]">
            Lost in the <span className="text-indian-gold">numbers?</span>
          </h1>
          <p className="mt-7 font-serif text-[19px] md:text-[21px] leading-[1.55] text-canvas-70 max-w-[720px]">
            That URL either moved, never existed, or was typo&apos;d.
            Here&apos;s where most people go next — plus three money facts worth
            knowing while you&apos;re here.
          </p>

          {/* Inline search hint */}
          <div className="mt-9 inline-flex items-center gap-3 px-5 py-3 border border-canvas-15 rounded-sm font-mono text-[11px] uppercase tracking-wider text-canvas-70">
            <Search className="w-3.5 h-3.5" />
            Tip — URL structure is{" "}
            <span className="text-canvas">
              /&#123;credit-cards|loans|banking|investing|insurance|taxes|learn&#125;/&#123;...&#125;
            </span>
          </div>
        </div>
      </section>

      {/* Did-you-know strip — canvas */}
      <section className="bg-canvas py-14 border-b border-ink-12">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            While you&apos;re here — 3 things to know
          </div>
          <h2 className="font-display font-black text-[28px] md:text-[36px] leading-[1.1] text-ink tracking-tight mb-10">
            Did you know?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            {DATA_HOOKS.map((h, i) => (
              <div key={i} className="border-l-2 border-indian-gold pl-5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-2">
                  Fact {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-[18px] font-black text-ink leading-tight mb-3">
                  {h.headline}
                </div>
                <div className="font-mono text-[28px] font-black text-indian-gold leading-none mb-3">
                  {h.value}
                </div>
                <p className="text-[13px] text-ink-60 leading-[1.55]">
                  {h.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top calculators — canvas */}
      <section className="bg-canvas py-14">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                Most-run numbers
              </div>
              <h2 className="font-display font-black text-[28px] md:text-[36px] leading-[1.1] text-ink tracking-tight">
                Popular calculators
              </h2>
            </div>
            <Link
              href="/calculators"
              className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
            >
              All calculators <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOP_CALCULATORS.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[22px] font-black text-indian-gold leading-none">
                    {c.accent}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-ink-60 group-hover:text-indian-gold transition-colors" />
                </div>
                <h3 className="mt-6 font-display text-[20px] font-black text-ink leading-tight group-hover:text-indian-gold transition-colors">
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] text-ink-60 leading-[1.5]">
                  {c.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top hubs — ink */}
      <section className="surface-ink py-14">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Dig in
          </div>
          <h2 className="font-display font-black text-[28px] md:text-[36px] leading-[1.1] text-canvas tracking-tight mb-10">
            Browse by category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TOP_HUBS.map((h) => (
              <Link
                key={h.href}
                href={h.href}
                className="group block border border-canvas-15 rounded-sm p-6 hover:border-indian-gold transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
                    Hub
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-canvas-70 group-hover:text-indian-gold transition-colors" />
                </div>
                <h3 className="mt-6 font-display text-[22px] font-black text-canvas leading-tight group-hover:text-indian-gold transition-colors">
                  {h.title}
                </h3>
                <p className="mt-2 text-[13px] text-canvas-70 leading-[1.5]">
                  {h.tagline}
                </p>
              </Link>
            ))}
          </div>

          {/* CTA row */}
          <div className="mt-12 pt-8 border-t border-canvas-15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="font-serif text-[16px] text-canvas-70">
              Still stuck? The homepage is a good place to start over.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
