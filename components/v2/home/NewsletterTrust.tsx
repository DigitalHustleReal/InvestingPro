"use client";

import Link from "next/link";

const TRUST_ITEMS = [
  {
    title: "How We Research",
    body: "AI analyzes 50+ bank websites daily. Every product scored on 23 data points. No bank pays for higher placement.",
    link: "/methodology",
    linkText: "Our methodology →",
  },
  {
    title: "How We Make Money",
    body: "Affiliate commission when you apply through our links. Never influences rankings or editorial content.",
    link: "/how-we-make-money",
    linkText: "Full disclosure →",
  },
  {
    title: "Who We Are",
    body: "Independent research platform built in India. NOT SEBI-registered advisors. All content for educational purposes.",
    link: "/about",
    linkText: "About us →",
  },
];

export default function NewsletterTrust() {
  return (
    <section className="relative py-12 md:py-16 px-4 lg:px-8 bg-gradient-to-br from-green-800 via-green-900 to-[--v2-ink] text-white overflow-hidden">
      {/* Geometric lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Diagonal accent line */}
      <div className="absolute top-[-50%] right-[-10%] w-px h-[200%] bg-gradient-to-b from-transparent via-[--v2-saffron]/15 to-transparent rotate-[30deg] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">
          {/* Newsletter */}
          <div className="mb-8 lg:mb-0">
            <div className="text-xs font-semibold text-[--v2-saffron] uppercase tracking-wider mb-2">
              Weekly Briefing
            </div>
            <h2 className="text-2xl font-bold mb-2 leading-tight">
              The Monday briefing for smarter money decisions
            </h2>
            <p className="text-[13px] text-white/40 leading-relaxed mb-4">
              Rate changes, new launches, one tax tip. 60 seconds. Free forever.
              No spam.
            </p>
            <form
              className="flex gap-2 max-w-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3.5 py-3 bg-white/[.08] border border-white/10 rounded-lg text-[13px] text-white placeholder:text-white/25 focus:border-[--v2-saffron] focus:outline-none transition-colors"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[--v2-saffron] text-white rounded-lg text-[13px] font-semibold whitespace-nowrap hover:bg-[--v2-saffron-dark] transition-colors cursor-pointer"
              >
                Subscribe →
              </button>
            </form>
          </div>

          {/* This week's preview */}
          <div className="bg-white/[.04] border border-white/[.08] rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-[--v2-saffron] font-semibold mb-1.5">
              This Week&apos;s Edition
            </div>
            <h3 className="text-sm font-medium mb-1">
              SBI cut FD rates. RBI held steady. Here&apos;s what to do.
            </h3>
            <p className="text-xs text-white/35 leading-relaxed">
              Lock FD at Shriram (8.35%) · Refinance if loan &gt;9% · 42 days to
              ELSS deadline
            </p>
          </div>
        </div>

        {/* Trust cards */}
        <div className="mt-10 pt-10 border-t border-white/[.06] grid gap-5 grid-cols-1 lg:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="pl-3.5 border-l-2 border-[--v2-saffron]"
            >
              <h3 className="text-[13px] font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">
                {item.body}
              </p>
              <Link
                href={item.link}
                className="inline-block mt-1.5 text-xs text-[--v2-saffron] font-medium"
              >
                {item.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
