/**
 * Loans Hub — Server Component (v3)
 *
 * Locked principles applied (matching /credit-cards + /investing + /taxes):
 *   1. Surface-ink reserved for hero + final CTA only — everything else
 *      `bg-canvas` with border-ink-12 dividers (brainstorm.md §1).
 *   2. No platform-stat counts on user-facing pages — counts belong on
 *      /admin/dashboard. "{N}+ lenders" / "Updated daily" badges removed.
 *   3. Single horizontal product list (LoansClient handles its own
 *      list/grid toggle).
 *   4. DB-driven content via editorial_hubs + category_faqs +
 *      lib/data/team Lending Desk byline.
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, ArrowUpRight } from "lucide-react";
import { getLoansServer } from "@/lib/products/get-loans-server";
import { createServiceClient } from "@/lib/supabase/service";
import LoansClient from "./LoansClient";
import WeeklyChanges from "@/components/common/WeeklyChanges";
import CIBILSimulator from "@/components/tools/CIBILSimulator";
import ContextualTicker from "@/components/common/ContextualTicker";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { hreflangAlternates, localizedPath } from "@/lib/i18n/url";
import { getServerLocale } from "@/lib/i18n/server";
import { getEditorialHubs } from "@/lib/content/editorial-hubs";
import { TEAM_MEMBERS } from "@/lib/data/team";
import { deskOrganizationSchema } from "@/lib/content/desk-schema";
import { DeskByline } from "@/components/articles/DeskByline";
import CategoryFAQ from "@/components/routing/CategoryFAQ";
import { articleUrl } from "@/lib/routing/article-url";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const localizedCanonical = generateCanonicalUrl(
    localizedPath("/loans", locale),
  );
  return {
    title: "Best Loans in India 2026 — Compare Rates & Apply",
    description:
      "Compare personal, home, car, education, gold, and business loans from every major Indian bank and NBFC. Independent ratings — no paid placements.",
    alternates: {
      canonical: localizedCanonical,
      languages: hreflangAlternates("/loans"),
    },
    openGraph: {
      title: "Best Loans in India 2026",
      description:
        "Compare lenders. Filter by type, rate, tenure. Independent — no paid placements.",
      url: localizedCanonical,
      type: "website",
    },
  };
}

// CMS-MIGRATION: loan type tiles with current "from-rate" indicators.
// Should move to a `loan_type_quotes` DB table or live RBI/MCLR feed
// so editorial team can refresh after rate cycles. "Indicative" stamp
// keeps the staleness honest until the live feed lands.
const LOAN_TYPES = [
  { label: "Personal Loan", rateFrom: "10.5%", href: "/loans?type=personal" },
  { label: "Home Loan", rateFrom: "8.5%", href: "/loans?type=home" },
  { label: "Car Loan", rateFrom: "8.7%", href: "/loans?type=car" },
  { label: "Education Loan", rateFrom: "7.5%", href: "/loans?type=education" },
  { label: "Gold Loan", rateFrom: "7.0%", href: "/loans?type=gold" },
  { label: "Business Loan", rateFrom: "11.0%", href: "/loans?type=business" },
];
const LOAN_TYPES_AS_OF = "Apr 2026 · Indicative starting rates";

type LatestArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  read_time: string | number | null;
  published_at: string | null;
};

async function getLatestLoanArticles(): Promise<LatestArticle[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "slug, title, excerpt, category, featured_image, read_time, published_at",
    )
    .eq("status", "published")
    .in("category", [
      "loans",
      "personal-loans",
      "personal_loans",
      "home-loans",
      "car-loans",
      "education-loans",
      "small-business",
      "small_business",
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

export default async function LoansPage() {
  let loans: unknown[] = [];
  try {
    loans = await getLoansServer();
  } catch {
    loans = [];
  }

  const [personas, calculators, comparisons, tools, articles] =
    await Promise.all([
      getEditorialHubs("loans-personas"),
      getEditorialHubs("loans-calculators"),
      getEditorialHubs("loans-comparisons"),
      getEditorialHubs("loans-tools"),
      getLatestLoanArticles(),
    ]);

  const lendingDesk = TEAM_MEMBERS.find((m) => m.slug === "lending-desk");
  const deskSchema = lendingDesk ? deskOrganizationSchema(lendingDesk) : null;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best Loans in India 2026",
    description:
      "Compare personal, home, car, education, gold, and business loans from every major Indian bank and NBFC. Independent ratings — no paid placements.",
    url: generateCanonicalUrl("/loans"),
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
          name: "Loans",
          item: generateCanonicalUrl("/loans"),
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

      {/* ── Live ticker — what changed in the loan market ─────────── */}
      <ContextualTicker category="loans" />

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
              <li className="text-canvas">Loans</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-5">
            Independent ratings · No paid placements
          </div>

          <h1 className="font-display font-black text-[44px] md:text-[68px] lg:text-[80px] leading-[0.98] tracking-tight text-canvas max-w-[1000px]">
            Best loans{" "}
            <span className="text-indian-gold italic">in India.</span>
          </h1>

          <p className="mt-7 font-serif text-[19px] md:text-[21px] leading-[1.55] text-canvas max-w-[740px]">
            Compare rates, fees, prepayment terms, and tenure across every major
            Indian bank and NBFC. We show the true cost of borrowing — not just
            the headline rate.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/calculators/emi"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
            >
              Run my EMI · 30 seconds
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/loans/compare"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-canvas-15 text-canvas font-mono text-[12px] uppercase tracking-wider rounded-sm hover:border-indian-gold hover:text-indian-gold transition-colors"
            >
              Compare lenders
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Advertiser disclosure + Desk byline ─────────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-5">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <DeskByline category="loans" />
          <AdvertiserDisclosure variant="expandable" />
        </div>
      </section>

      {/* ── Loan types — canvas ─────────────────────────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold">
              Loan types · Starting rates
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
              {LOAN_TYPES_AS_OF}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {LOAN_TYPES.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className="group block bg-white border border-ink-12 rounded-sm p-4 hover:border-indian-gold transition-colors"
              >
                <div className="font-display text-[13px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                  {t.label}
                </div>
                <div className="mt-2 font-mono text-[14px] font-black text-indian-gold tabular-nums">
                  {t.rateFrom}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-ink-60 mt-0.5">
                  onwards
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
              Why are you borrowing?
            </div>
            <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-3">
              Pick your situation
            </h2>
            <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
              The right loan depends on what you&apos;re funding and how soon
              you can repay. Start with the closest match.
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
                    Show options <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main product list ─────────────────────────────────── */}
      <section className="bg-canvas border-t border-ink-12">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <LoansClient initialLoans={loans as never} />
        </div>
      </section>

      {/* ── Editorial velocity ───────────────────────────────── */}
      <section className="bg-canvas border-t-2 border-ink-12 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <WeeklyChanges category="loans" />
        </div>
      </section>

      {/* ── CIBIL simulator ──────────────────────────────────── */}
      <section className="bg-canvas border-t border-ink-12">
        <CIBILSimulator />
      </section>

      {/* ── Calculator picks — canvas ────────────────────────── */}
      {calculators.length > 0 && (
        <section className="bg-canvas border-t border-ink-12 py-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                  Run the numbers
                </div>
                <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight">
                  Loan calculators
                </h2>
              </div>
              <Link
                href="/loans/calculators"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All loan calculators <ArrowUpRight className="w-3 h-3" />
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

      {/* ── Tools — canvas ─────────────────────────────────── */}
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

      {/* ── Popular comparisons — canvas ───────────────────── */}
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
                  Latest lending analysis
                </h2>
              </div>
              <Link
                href="/loans/learn"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All loan articles <ArrowUpRight className="w-3 h-3" />
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
                    Lending Desk
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
      <CategoryFAQ urlCategory="loans" variant="canvas" />

      {/* ── Final CTA — ink ────────────────────────────────── */}
      <section className="surface-ink py-14">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              This week in Indian money
            </div>
            <h3 className="font-display font-black text-[26px] md:text-[32px] text-canvas leading-tight max-w-[640px]">
              Every Sunday — one rate change worth knowing, one loan trick banks
              won&apos;t volunteer.
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
