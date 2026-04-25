/**
 * Banking Hub — Server Component (v3)
 *
 * Locked principles applied (matching all other v3 hubs):
 *   1. Surface-ink reserved for hero + final CTA only — everything
 *      else `bg-canvas` with border-ink-12 dividers (brainstorm.md §1).
 *   2. No platform-stat counts on user-facing pages — counts go to
 *      /admin/dashboard. "50+ banks" / "Rates updated daily" / "DICGC
 *      insured" badge moved to inline editorial reassurance only.
 *   3. Single horizontal product list (SavingsAccountsClient handles
 *      its own list/grid toggle).
 *   4. DB-driven content via editorial_hubs + category_faqs +
 *      lib/data/team Banking Desk byline.
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, ArrowUpRight } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import SavingsAccountsClient from "./SavingsAccountsClient";
import WeeklyChanges from "@/components/common/WeeklyChanges";
import ContextualTicker from "@/components/common/ContextualTicker";
import { getSavingsAccountsServer } from "@/lib/products/get-savings-accounts-server";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { getEditorialHubs } from "@/lib/content/editorial-hubs";
import { TEAM_MEMBERS } from "@/lib/data/team";
import { deskOrganizationSchema } from "@/lib/content/desk-schema";
import { DeskByline } from "@/components/articles/DeskByline";
import CategoryFAQ from "@/components/routing/CategoryFAQ";
import { articleUrl } from "@/lib/routing/article-url";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Banking Products in India 2026 — Savings, FDs, RDs",
  description:
    "Compare savings account interest rates, fixed deposit rates, and recurring deposits from every major Indian bank and small finance bank. DICGC-insured up to ₹5L.",
  alternates: { canonical: generateCanonicalUrl("/banking") },
  openGraph: {
    title: "Best Banking Products in India 2026",
    description:
      "Compare savings, FD, RD rates. Sovereign + DICGC ₹5L coverage. Independent — no paid placements.",
    url: generateCanonicalUrl("/banking"),
    type: "website",
  },
};

// CMS-MIGRATION: banking product tiles. Could move to a `banking_types`
// reference table or to editorial_hubs placement='banking-types'.
const BANKING_PRODUCTS = [
  {
    label: "Savings accounts",
    desc: "Interest, min balance, UPI",
    href: "/banking?type=savings",
    rate: "Up to 7.0%",
    badge: "Popular",
  },
  {
    label: "Fixed deposits",
    desc: "Best rates · banks + NBFCs",
    href: "/fixed-deposits",
    rate: "Up to 8.35%",
    badge: "Popular",
  },
  {
    label: "Recurring deposits",
    desc: "Monthly · guaranteed return",
    href: "/banking?type=rd",
    rate: "Up to 7.5%",
  },
  {
    label: "Senior citizen FDs",
    desc: "+0.5% rate bonus, 60+",
    href: "/fixed-deposits?filter=senior",
    rate: "+0.50% bonus",
  },
  {
    label: "Tax-saving FDs",
    desc: "5y lock-in · 80C deduction",
    href: "/fixed-deposits?filter=tax-saving",
    rate: "Up to ₹1.5L",
  },
  {
    label: "Current accounts",
    desc: "Business banking + overdraft",
    href: "/banking?type=current",
    rate: "Zero balance",
  },
];

type LatestArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  read_time: string | number | null;
  published_at: string | null;
};

async function getLatestBankingArticles(): Promise<LatestArticle[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "slug, title, excerpt, category, featured_image, read_time, published_at",
    )
    .eq("status", "published")
    .in("category", [
      "banking",
      "fixed-deposits",
      "fixed_deposit",
      "savings-accounts",
      "post-office-savings",
    ])
    .order("published_at", { ascending: false })
    .limit(6);
  return (data as LatestArticle[]) ?? [];
}

function formatReadTime(rt: string | number | null): string {
  if (!rt) return "";
  const n = typeof rt === "string" ? parseInt(rt, 10) : rt;
  return Number.isFinite(n) && n > 0 ? `${n} min read` : "";
}

export default async function BankingPage() {
  let initialAccounts: unknown[] = [];
  try {
    initialAccounts = await getSavingsAccountsServer();
  } catch {
    initialAccounts = [];
  }

  const [personas, calculators, comparisons, tools, articles] =
    await Promise.all([
      getEditorialHubs("banking-personas"),
      getEditorialHubs("banking-calculators"),
      getEditorialHubs("banking-comparisons"),
      getEditorialHubs("banking-tools"),
      getLatestBankingArticles(),
    ]);

  const bankingDesk = TEAM_MEMBERS.find((m) => m.slug === "banking-desk");
  const deskSchema = bankingDesk ? deskOrganizationSchema(bankingDesk) : null;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Banking Products India 2026",
    description:
      "Compare savings, FD, RD rates from every major Indian bank and small finance bank. DICGC-insured. Independent ratings — no paid placements.",
    url: generateCanonicalUrl("/banking"),
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
          name: "Banking",
          item: generateCanonicalUrl("/banking"),
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

      {/* ContextualTicker still keyed on legacy "fixed-deposits" until
          its TICKER_DATA gets a top-level "banking" entry. Same for
          WeeklyChanges below. */}
      <ContextualTicker category="fixed-deposits" />

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
              <li className="text-canvas">Banking</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-5">
            DICGC-insured · Sovereign-backed schemes
          </div>

          <h1 className="font-display font-black text-[44px] md:text-[68px] lg:text-[80px] leading-[0.98] tracking-tight text-canvas max-w-[1000px]">
            Banking,{" "}
            <span className="text-indian-gold italic">that pays you back.</span>
          </h1>

          <p className="mt-7 font-serif text-[19px] md:text-[21px] leading-[1.55] text-canvas max-w-[740px]">
            Savings, FDs, and RDs compared on real post-tax returns — not the
            headline rate. Small finance banks, PSUs, NBFCs, post-office schemes
            — all on one screen, all DICGC or sovereign backed.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/calculators/fd"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
            >
              Run my FD return
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/fixed-deposits"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-canvas-15 text-canvas font-mono text-[12px] uppercase tracking-wider rounded-sm hover:border-indian-gold hover:text-indian-gold transition-colors"
            >
              Compare FD rates
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Desk byline ───────────────────────────────────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-5">
        <div className="max-w-[1280px] mx-auto px-6">
          <DeskByline category="banking" />
        </div>
      </section>

      {/* ── Banking products — canvas ─────────────────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-6">
            Banking products · Top rates
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BANKING_PRODUCTS.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="group block bg-white border border-ink-12 rounded-sm p-5 hover:border-indian-gold transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[18px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                    {p.label}
                  </h3>
                  {p.badge && (
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-indian-gold text-ink px-2 py-0.5 flex-shrink-0">
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[13px] text-ink-60 leading-[1.55]">
                  {p.desc}
                </p>
                <div className="mt-4 font-mono text-[14px] font-black text-indian-gold tabular-nums">
                  {p.rate}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personas — canvas ───────────────────────────────────── */}
      {personas.length > 0 && (
        <section className="bg-canvas py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              Where&apos;s your money sitting?
            </div>
            <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-3">
              Pick your stage
            </h2>
            <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
              The right banking mix at 25 isn&apos;t the right mix at 65. Start
              where you actually are.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {personas.map((p) => (
                <Link
                  key={`${p.placement}-${p.title}`}
                  href={p.href}
                  className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
                >
                  <span className="font-mono text-[20px] font-black text-indian-gold leading-none">
                    {p.accent ?? "·"}
                  </span>
                  <h3 className="mt-5 font-display text-[20px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-ink-60 leading-[1.55]">
                    {p.tagline}
                  </p>
                  <div className="mt-5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink group-hover:text-indian-gold transition-colors">
                    Show options <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Savings Accounts listing ──────────────────────────── */}
      {Array.isArray(initialAccounts) && initialAccounts.length > 0 && (
        <section className="bg-canvas border-t border-ink-12">
          <div className="max-w-[1280px] mx-auto px-6 py-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              Savings accounts
            </div>
            <h2 className="font-display font-black text-[28px] md:text-[36px] leading-[1.05] text-ink tracking-tight mb-8">
              Compare savings rates
            </h2>
            <SavingsAccountsClient initialAccounts={initialAccounts as never} />
          </div>
        </section>
      )}

      {/* ── Editorial velocity ───────────────────────────────── */}
      <section className="bg-canvas border-t-2 border-ink-12 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <WeeklyChanges category="fixed-deposits" />
        </div>
      </section>

      {/* ── Calculators — canvas ─────────────────────────────── */}
      {calculators.length > 0 && (
        <section className="bg-canvas border-t border-ink-12 py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                  Run the numbers
                </div>
                <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight">
                  Banking calculators
                </h2>
              </div>
              <Link
                href="/banking/calculators"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All banking calculators <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {calculators.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group block bg-white border border-ink-12 rounded-sm p-6 hover:border-indian-gold transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[22px] font-black text-indian-gold leading-none">
                      {c.accent ?? "·"}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-ink-60 group-hover:text-indian-gold transition-colors" />
                  </div>
                  <h3 className="mt-6 font-display text-[20px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
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
      )}

      {/* ── Tools — canvas ──────────────────────────────────── */}
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

      {/* ── Comparisons — canvas ─────────────────────────────── */}
      {comparisons.length > 0 && (
        <section className="bg-canvas border-t border-ink-12 py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              Decisions worth running
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

      {/* ── Latest articles — canvas ────────────────────────── */}
      {articles.length > 0 && (
        <section className="bg-canvas border-t border-ink-12 py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                  From the desk
                </div>
                <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight">
                  Latest banking analysis
                </h2>
              </div>
              <Link
                href="/banking/learn"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All banking articles <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <Link key={a.slug} href={articleUrl(a)} className="group block">
                  {a.featured_image ? (
                    <div className="relative aspect-[16/10] bg-ink-12 overflow-hidden rounded-sm mb-4">
                      <Image
                        src={a.featured_image}
                        alt={a.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-ink/5 rounded-sm mb-4" />
                  )}
                  <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-2">
                    Banking Desk
                    {formatReadTime(a.read_time)
                      ? ` · ${formatReadTime(a.read_time)}`
                      : ""}
                  </div>
                  <h3 className="font-display text-[20px] font-black text-ink leading-[1.2] group-hover:text-authority-green transition-colors">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="mt-3 text-[13px] text-ink-60 leading-[1.55] line-clamp-3">
                      {a.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ — DB-driven ───────────────────────────────── */}
      <CategoryFAQ urlCategory="banking" variant="canvas" />

      {/* ── Final CTA — ink ────────────────────────────────── */}
      <section className="surface-ink py-14">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              This week in Indian money
            </div>
            <h3 className="font-display font-black text-[26px] md:text-[32px] text-canvas leading-tight max-w-[640px]">
              Every Sunday — one rate change worth knowing, one banking trap
              banks won&apos;t volunteer.
            </h3>
          </div>
          <Link
            href="/#newsletter"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
          >
            Subscribe free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
