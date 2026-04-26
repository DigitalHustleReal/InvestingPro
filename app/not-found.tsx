import Link from "next/link";
import { Search, ArrowRight, Home } from "lucide-react";

/**
 * 404 — Page Not Found.
 * v3 design: ink hero, indian-gold accent, no gradients/glassmorphism/shadow-lg.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="surface-ink py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            404 · Page not found
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] leading-[1.05] tracking-tight text-canvas">
            That page doesn&apos;t exist.
          </h1>
          <p className="mt-6 font-serif text-[18px] md:text-[20px] leading-[1.55] text-canvas-70 max-w-[640px] mx-auto">
            The link may have moved or the page never existed. Try one of the
            most-visited sections below, or head back home.
          </p>
        </div>
      </section>

      {/* Suggestions */}
      <section className="bg-canvas py-14 md:py-20 border-t-2 border-ink-12">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
            Most-visited
          </div>
          <h2 className="font-display text-[28px] md:text-[34px] font-black text-ink leading-tight mb-8">
            Try these instead.
          </h2>

          <div className="space-y-3">
            {[
              {
                title: "Compare credit cards",
                desc: "81 cards from HDFC, ICICI, SBI, Axis, Amex and more — sortable by reward rate, fee, lounge access.",
                href: "/credit-cards",
              },
              {
                title: "Mutual fund explorer",
                desc: "565 AMFI-listed funds with real NAV, returns, and per-segment methodology rating.",
                href: "/mutual-funds",
              },
              {
                title: "Fixed deposit rates",
                desc: "Latest rates from 25+ banks including senior-citizen + women-specific offers.",
                href: "/fixed-deposits",
              },
              {
                title: "Loans hub",
                desc: "Personal, home, car, education, gold, and business loans — 56 lenders compared.",
                href: "/loans",
              },
              {
                title: "Glossary",
                desc: "101+ Indian-finance terms explained with examples and calculator links.",
                href: "/glossary",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group block border-2 border-ink-12 hover:border-ink p-5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[18px] md:text-[20px] font-bold text-ink mb-1 group-hover:text-indian-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-ink-80 leading-[1.5]">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-60 group-hover:text-indian-gold group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 pt-8 border-t-2 border-ink-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-5 py-3 bg-ink text-canvas hover:bg-authority-green transition-colors"
            >
              <Home className="w-3.5 h-3.5" /> Back to homepage
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
            >
              <Search className="w-3.5 h-3.5" /> Browse articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
