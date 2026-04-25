/**
 * Credit Cards Hub — Server Component (v3)
 *
 * Highest-revenue page on the site (affiliate driver). Goal: NerdWallet-
 * better product list + Indian-context credibility signals.
 *
 * What this page does that NerdWallet doesn't:
 *   - Persona-led routing (First card / Cashback / Travel / Premium)
 *     deeplinking to the find-your-card quiz with the intent preset.
 *   - Editorial Credit Team byline + Organization JSON-LD on the hub.
 *   - WeeklyChanges editorial ticker — what changed in the card market
 *     this week.
 *   - ContextualTicker — live category-aware data strip at the top.
 *
 * NOT here (per locked architectural principle, 2026-04-25 PM):
 *   - Platform stats ("X cards tracked", "Y banks") — those are admin
 *     dashboard concerns, not user-facing. Counts on a public page
 *     read as platform-bragging, not user value. /llms.txt + admin
 *     dashboard hold the inventory; this page tells users what to do.
 *
 * Tokens — strict v3. Surfaces: surface-ink (hero/credibility),
 * bg-canvas (browse + tools), border-ink-12 (cards), indian-gold
 * (eyebrows + accents), authority-green (verified states), no
 * blue/purple/pink/cyan/teal/sky, rounded-sm max, no shadow-lg.
 */

import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, ArrowUpRight } from "lucide-react";
import { getCreditCardsServer } from "@/lib/products/get-credit-cards-server";
import CreditCardsClient from "./CreditCardsClient";
import WeeklyChanges from "@/components/common/WeeklyChanges";
import ContextualTicker from "@/components/common/ContextualTicker";
import { logger } from "@/lib/logger";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";
import RatingExplainer from "@/components/products/RatingExplainer";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { getEditorialHubs } from "@/lib/content/editorial-hubs";
import { TEAM_MEMBERS } from "@/lib/data/team";
import { deskOrganizationSchema } from "@/lib/content/desk-schema";
import { DeskByline } from "@/components/articles/DeskByline";
import CategoryFAQ from "@/components/routing/CategoryFAQ";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Credit Cards in India 2026 — Compare & Apply",
  description:
    "Compare credit cards from every major Indian bank. Filter by rewards, cashback, travel, fee, and CIBIL score. Independent ratings — no paid placements.",
  alternates: { canonical: generateCanonicalUrl("/credit-cards") },
  openGraph: {
    title: "Best Credit Cards in India 2026",
    description:
      "Filter by rewards / cashback / travel / fee. Independent ratings — no paid placements.",
    url: generateCanonicalUrl("/credit-cards"),
    type: "website",
  },
};

export default async function CreditCardsPage() {
  let assets: unknown[] = [];
  try {
    assets = await getCreditCardsServer();
  } catch (error) {
    logger.error(
      "[CreditCardsPage] Failed to load credit cards",
      error instanceof Error ? error : undefined,
    );
    assets = [];
  }

  const [personas, comparisons, tools] = await Promise.all([
    getEditorialHubs("credit-cards-personas"),
    getEditorialHubs("credit-cards-comparisons"),
    getEditorialHubs("credit-cards-tools"),
  ]);

  const creditDesk = TEAM_MEMBERS.find((m) => m.slug === "credit-team");
  const deskSchema = creditDesk ? deskOrganizationSchema(creditDesk) : null;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best Credit Cards in India 2026",
    description:
      "Compare credit cards from every major Indian bank. Independent ratings — no paid placements.",
    url: generateCanonicalUrl("/credit-cards"),
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: "https://investingpro.in",
      logo: {
        "@type": "ImageObject",
        url: "https://investingpro.in/logo.png",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: generateCanonicalUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Credit Cards",
          item: generateCanonicalUrl("/credit-cards"),
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {deskSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(deskSchema) }}
        />
      )}

      {/* ── Contextual ticker — what's new in cards this week ─────── */}
      <ContextualTicker category="credit-cards" />

      {/* ── Hero — ink ────────────────────────────────────────────── */}
      <section className="surface-ink pt-10 pb-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              <li>
                <Link
                  href="/"
                  className="hover:text-indian-gold transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-3 h-3" />
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Credit Cards</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-5">
            Independent ratings · No paid placements
          </div>

          <h1 className="font-display font-black text-[44px] md:text-[68px] lg:text-[80px] leading-[0.98] tracking-tight text-canvas max-w-[1000px]">
            Best credit cards{" "}
            <span className="text-indian-gold italic">in India.</span>
          </h1>

          <p className="mt-7 font-serif text-[19px] md:text-[21px] leading-[1.55] text-canvas max-w-[740px]">
            Filter by reward rate, cashback category, travel benefits, or annual
            fee. Ranked on outcomes you can verify — not on what pays us most.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/credit-cards/find-your-card"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
            >
              Find my card · 3 questions
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/credit-cards/compare"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-canvas-15 text-canvas font-mono text-[12px] uppercase tracking-wider rounded-sm hover:border-indian-gold hover:text-indian-gold transition-colors"
            >
              Compare side-by-side
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Advertiser disclosure + Desk byline strip ─────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-5">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <DeskByline category="credit_cards" />
          <AdvertiserDisclosure variant="expandable" />
        </div>
      </section>

      {/* ── Personas — canvas ─────────────────────────────────────── */}
      {personas.length > 0 && (
        <section className="bg-canvas py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              Pick your spend pattern
            </div>
            <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-3">
              Why are you getting a card?
            </h2>
            <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
              The right card depends on what you actually buy. Be honest with
              yourself — answer one of these and we&apos;ll filter the deck.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {personas.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
                >
                  <span className="font-mono text-[22px] font-black text-indian-gold leading-none">
                    {p.accent ?? "·"}
                  </span>
                  <h3 className="mt-5 font-display text-[20px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-ink-60 leading-[1.55]">
                    {p.tagline}
                  </p>
                  <div className="mt-5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink group-hover:text-indian-gold transition-colors">
                    Find my match <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main product list ───────────────────────────────────── */}
      <section className="bg-canvas border-t border-ink-12">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <CreditCardsClient initialAssets={assets as never} />
        </div>
      </section>

      {/* ── Editorial velocity ──────────────────────────────────── */}
      <section className="bg-canvas border-t-2 border-ink-12 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <WeeklyChanges category="credit-cards" />
        </div>
      </section>

      {/* ── Tools — canvas ──────────────────────────────────────── */}
      {tools.length > 0 && (
        <section className="bg-canvas border-t border-ink-12 py-14">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              Tools
            </div>
            <h2 className="font-display font-black text-[32px] md:text-[40px] leading-[1.05] text-ink tracking-tight mb-10">
              Helper kit
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group block bg-white border border-ink-12 rounded-sm p-5 hover:border-indian-gold transition-colors"
                >
                  <span className="font-mono text-[20px] font-black text-indian-gold leading-none">
                    {t.accent ?? "·"}
                  </span>
                  <h3 className="mt-4 font-display text-[16px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-[12px] text-ink-60 leading-[1.5]">
                    {t.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Popular comparisons — canvas ─────────────────────────── */}
      {comparisons.length > 0 && (
        <section className="bg-canvas py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              The fights worth running
            </div>
            <h2 className="font-display font-black text-[32px] md:text-[40px] leading-[1.05] text-ink tracking-tight mb-10">
              Popular comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {comparisons.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex items-start gap-4 bg-white border border-ink-12 rounded-sm p-5 hover:border-indian-gold transition-colors"
                >
                  <span className="font-mono text-[10px] font-black text-indian-gold border border-indian-gold/40 px-2 py-1 mt-0.5 flex-shrink-0">
                    {c.accent ?? "VS"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[16px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[12px] text-ink-60 leading-[1.55]">
                      {c.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How we rate — canvas ──────────────────────────────── */}
      <section className="bg-canvas border-t border-ink-12 py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Methodology
          </div>
          <h2 className="font-display font-black text-[32px] md:text-[40px] leading-[1.05] text-ink tracking-tight mb-3">
            How we rate
          </h2>
          <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
            Every card on this page is evaluated against the same 23-point
            framework. We disclose every input. No bank pays for higher
            placement — disclosed in our advertiser policy above.
          </p>

          <div className="grid grid-cols-3 gap-5 mb-10">
            <div className="bg-white border border-ink-12 rounded-sm p-5">
              <div className="font-mono text-[28px] font-black text-indian-gold leading-none">
                23
              </div>
              <div className="mt-3 font-display text-[16px] font-black text-ink">
                Data points per card
              </div>
              <p className="mt-2 text-[12px] text-ink-60 leading-[1.5]">
                Rewards, fees, interest, benefits, eligibility
              </p>
            </div>
            <div className="bg-white border border-ink-12 rounded-sm p-5">
              <div className="font-mono text-[28px] font-black text-indian-gold leading-none">
                Daily
              </div>
              <div className="mt-3 font-display text-[16px] font-black text-ink">
                Update frequency
              </div>
              <p className="mt-2 text-[12px] text-ink-60 leading-[1.5]">
                Bank websites + RBI disclosures
              </p>
            </div>
            <div className="bg-white border border-ink-12 rounded-sm p-5">
              <div className="font-mono text-[28px] font-black text-indian-gold leading-none">
                ₹0
              </div>
              <div className="mt-3 font-display text-[16px] font-black text-ink">
                Paid placements
              </div>
              <p className="mt-2 text-[12px] text-ink-60 leading-[1.5]">
                No bank pays for higher rank
              </p>
            </div>
          </div>

          <div className="bg-white border border-ink-12 rounded-sm p-6">
            <RatingExplainer variant="inline" category="credit_card" />
          </div>
        </div>
      </section>

      {/* ── FAQ — DB-driven ────────────────────────────────────── */}
      <CategoryFAQ urlCategory="credit-cards" variant="canvas" />

      {/* ── Not sure yet — ink ─────────────────────────────────── */}
      <section className="surface-ink py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
            Still browsing
          </div>
          <h2 className="font-display font-black text-[26px] md:text-[32px] text-canvas leading-tight mb-8">
            Three more ways in
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link
              href="/credit-cards/find-your-card"
              className="group block bg-indian-gold text-ink rounded-sm p-6 hover:bg-indian-gold/90 transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                Personalised
              </div>
              <h3 className="mt-3 font-display text-[20px] font-black leading-tight">
                Take the card finder quiz
              </h3>
              <p className="mt-2 text-[12px] opacity-80">
                3 questions · 30 seconds · no email needed
              </p>
              <div className="mt-5 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                Start <ArrowUpRight className="w-3 h-3" />
              </div>
            </Link>
            <Link
              href="/credit-cards/compare"
              className="group block border border-canvas-15 rounded-sm p-6 hover:border-indian-gold transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
                Side-by-side
              </div>
              <h3 className="mt-3 font-display text-[20px] font-black text-canvas leading-tight group-hover:text-indian-gold transition-colors">
                Compare 2–3 cards
              </h3>
              <p className="mt-2 text-[12px] text-canvas-70">
                Pick from the list, see the differences inline
              </p>
              <div className="mt-5 font-mono text-[10px] uppercase tracking-wider text-canvas-70 flex items-center gap-1">
                Open compare <ArrowUpRight className="w-3 h-3" />
              </div>
            </Link>
            <Link
              href="/credit-cards/learn"
              className="group block border border-canvas-15 rounded-sm p-6 hover:border-indian-gold transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold">
                The basics
              </div>
              <h3 className="mt-3 font-display text-[20px] font-black text-canvas leading-tight group-hover:text-indian-gold transition-colors">
                Read the credit card guide
              </h3>
              <p className="mt-2 text-[12px] text-canvas-70">
                CIBIL, fees, reward types — all explained
              </p>
              <div className="mt-5 font-mono text-[10px] uppercase tracking-wider text-canvas-70 flex items-center gap-1">
                Read more <ArrowUpRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
