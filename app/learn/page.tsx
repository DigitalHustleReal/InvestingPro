/**
 * Learn Hub — Server Component (v3)
 *
 * Cross-cutting personal-finance hub. Sits at /learn as the seventh
 * top-level URL category from the v3 lock — the "everything else that
 * doesn't fit a single product line" landing page. Anchors the
 * Editorial Team byline (the general desk that covers budgeting,
 * planning, debt, retirement strategy at the meta level).
 *
 * Locked principles (matching every other v3 hub):
 *   1. Surface-ink for hero + final CTA only (brainstorm.md §1)
 *   2. No platform-stat counts on user-facing pages
 *   3. DB-driven content via editorial_hubs + category_faqs +
 *      lib/data/team Editorial Team byline.
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, ArrowUpRight } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { hreflangAlternates, localizedPath } from "@/lib/i18n/url";
import { getServerLocale } from "@/lib/i18n/server";
import { getEditorialHubs } from "@/lib/content/editorial-hubs";
import { TEAM_MEMBERS } from "@/lib/data/team";
import { deskOrganizationSchema } from "@/lib/content/desk-schema";
import { DeskByline } from "@/components/articles/DeskByline";
import CategoryFAQ from "@/components/routing/CategoryFAQ";
import { articleUrl } from "@/lib/routing/article-url";

export const revalidate = 21600; // 6 hours

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const localizedCanonical = generateCanonicalUrl(
    localizedPath("/learn", locale),
  );
  return {
    title: "Personal Finance Basics — Learn the Money Skills",
    description:
      "Plain-English personal finance for India. Budgeting, debt, goals, retirement, behavioural traps. From the InvestingPro Editorial Team.",
    alternates: {
      canonical: localizedCanonical,
      languages: hreflangAlternates("/learn"),
    },
    openGraph: {
      title: "Personal Finance Basics — Learn the Money Skills",
      description:
        "Budgeting, debt, goals, retirement — explained in plain English. From the InvestingPro Editorial Team.",
      url: localizedCanonical,
      type: "website",
    },
  };
}

// Topic shortcuts — the seven everyday-finance themes that don't have a
// single product page. Each links into existing content paths.
const LEARN_TOPICS = [
  {
    label: "Budgeting",
    desc: "50/30/20, zero-based, envelope methods",
    href: "/articles?category=budgeting",
  },
  {
    label: "Emergency fund",
    desc: "How much, where to park it, when to use it",
    href: "/articles?category=personal-finance",
  },
  {
    label: "Debt freedom",
    desc: "Avalanche vs snowball, prepayment math",
    href: "/articles?category=personal-finance",
  },
  {
    label: "Goal planning",
    desc: "SIP needed for any goal — house, car, kid",
    href: "/calculators/goal-planning",
  },
  {
    label: "Retirement",
    desc: "FIRE, corpus sizing, 4% rule for India",
    href: "/calculators/retirement",
  },
  {
    label: "Behavioural traps",
    desc: "Why we overspend and what to do about it",
    href: "/articles?category=personal-finance",
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

async function getLatestLearnArticles(): Promise<LatestArticle[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("articles")
    .select(
      "slug, title, excerpt, category, featured_image, read_time, published_at",
    )
    .eq("status", "published")
    .in("category", [
      "personal-finance",
      "personal_finance",
      "tools",
      "general",
      "budgeting",
      "financial-planning",
      "financial_planning",
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

export default async function LearnPage() {
  const [personas, calculators, comparisons, tools, articles] =
    await Promise.all([
      getEditorialHubs("learn-personas"),
      getEditorialHubs("learn-calculators"),
      getEditorialHubs("learn-comparisons"),
      getEditorialHubs("learn-tools"),
      getLatestLearnArticles(),
    ]);

  const editorialDesk = TEAM_MEMBERS.find((m) => m.slug === "editorial-team");
  const deskSchema = editorialDesk
    ? deskOrganizationSchema(editorialDesk)
    : null;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Personal Finance — Learn the Money Skills",
    description:
      "Plain-English personal finance for India. Budgeting, debt, goals, retirement, behavioural traps.",
    url: generateCanonicalUrl("/learn"),
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
          name: "Learn",
          item: generateCanonicalUrl("/learn"),
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
              <li className="text-canvas">Learn</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-5">
            Money skills · Plain English · India context
          </div>

          <h1 className="font-display font-black text-[44px] md:text-[68px] lg:text-[80px] leading-[0.98] tracking-tight text-canvas max-w-[1000px]">
            Money, <span className="text-indian-gold italic">demystified.</span>
          </h1>

          <p className="mt-7 font-serif text-[19px] md:text-[21px] leading-[1.55] text-canvas max-w-[740px]">
            Budgeting, debt, goals, retirement, behavioural traps — the money
            skills nobody taught you in school, written for Indian salaries and
            Indian taxes. Free, no jargon, no sales pitch.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/calculators/financial-health-score"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indian-gold text-ink font-bold text-[14px] tracking-wide rounded-sm hover:bg-indian-gold/90 transition-colors"
            >
              Run my financial health score
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/glossary"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-canvas-15 text-canvas font-mono text-[12px] uppercase tracking-wider rounded-sm hover:border-indian-gold hover:text-indian-gold transition-colors"
            >
              Browse the glossary
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Desk byline ───────────────────────────────────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-5">
        <div className="max-w-[1280px] mx-auto px-6">
          <DeskByline category="general" />
        </div>
      </section>

      {/* ── Topics — canvas ───────────────────────────────────── */}
      <section className="bg-canvas border-b border-ink-12 py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-6">
            Money skills · Topics
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LEARN_TOPICS.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className="group block bg-white border border-ink-12 rounded-sm p-5 hover:border-indian-gold transition-colors"
              >
                <h3 className="font-display text-[20px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
                  {t.label}
                </h3>
                <p className="mt-2 text-[13px] text-ink-60 leading-[1.55]">
                  {t.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink group-hover:text-indian-gold transition-colors">
                  Learn more <ArrowUpRight className="w-3 h-3" />
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
              Where you are right now
            </div>
            <h2 className="font-display font-black text-[36px] md:text-[44px] leading-[1.05] text-ink tracking-tight mb-3">
              Pick your stage
            </h2>
            <p className="font-serif text-[17px] text-ink-60 max-w-[720px] mb-10">
              The right move at 25 isn&apos;t the right move at 55. Start where
              you actually are — not where you wish you were.
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
                    Start here <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
                  Money-skill calculators
                </h2>
              </div>
              <Link
                href="/learn/calculators"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All learn calculators <ArrowUpRight className="w-3 h-3" />
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
              Cross-cutting comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
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
                    <h3 className="font-display text-[18px] font-black text-ink leading-tight group-hover:text-authority-green transition-colors">
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
                  Latest money guides
                </h2>
              </div>
              <Link
                href="/learn/learn"
                className="font-mono text-[11px] uppercase tracking-wider text-ink-60 hover:text-indian-gold transition-colors inline-flex items-center gap-1"
              >
                All learn articles <ArrowUpRight className="w-3 h-3" />
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
                    Editorial Team
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

      {/* ── Glossary teaser — canvas ────────────────────────── */}
      <section className="bg-canvas border-t border-ink-12 py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
                Glossary · 101 terms
              </div>
              <h2 className="font-display font-black text-[28px] md:text-[36px] leading-[1.1] text-ink tracking-tight mb-4">
                Don&apos;t fake it. Look it up.
              </h2>
              <p className="font-serif text-[16px] text-ink-60 leading-[1.55] mb-6">
                Every Indian finance term you keep hearing — CIBIL, ULIP, NSC,
                ELSS, KYC, EBLR — explained in one or two plain-English
                sentences with a worked example.
              </p>
              <Link
                href="/glossary"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-canvas font-mono text-[11px] uppercase tracking-wider rounded-sm hover:bg-ink/90 transition-colors"
              >
                Open the glossary
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-white border border-ink-12 rounded-sm p-6">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-3">
                Sample entries
              </div>
              <ul className="space-y-3">
                {[
                  ["CIBIL", "/glossary/cibil-score"],
                  ["ELSS", "/glossary/elss"],
                  ["ULIP", "/glossary/ulip"],
                  ["EBLR", "/glossary/eblr"],
                  ["NSC", "/glossary/nsc"],
                ].map(([term, href]) => (
                  <li key={term}>
                    <Link
                      href={href}
                      className="font-display text-[16px] font-black text-ink hover:text-indian-gold transition-colors flex items-center justify-between"
                    >
                      <span>{term}</span>
                      <ArrowUpRight className="w-4 h-4 text-ink-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ — DB-driven ───────────────────────────────── */}
      <CategoryFAQ urlCategory="learn" variant="canvas" />

      {/* ── Final CTA — ink ────────────────────────────────── */}
      <section className="surface-ink py-14">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-3">
              This week in Indian money
            </div>
            <h3 className="font-display font-black text-[26px] md:text-[32px] text-canvas leading-tight max-w-[640px]">
              Every Sunday — one money skill worth practising, one trap worth
              avoiding.
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
