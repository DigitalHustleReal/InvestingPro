/**
 * Shared Category Learn Hub — Server Component
 *
 * Used by both the dynamic /[category]/learn/page.tsx and the literal
 * overrides at /credit-cards/learn, /loans/learn, /insurance/learn
 * (which exist to defeat the [slug] conflict at those literal prefixes).
 *
 * Accepts a pre-validated `urlCategory` so the literal route files can
 * pass their hardcoded category without re-validating.
 */

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import {
  dbCategoriesForUrl,
  urlCategoryLabel,
  type UrlCategory,
} from "@/lib/routing/category-map";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { articleUrl } from "@/lib/routing/article-url";
import { TEAM_MEMBERS } from "@/lib/data/team";
import { deskOrganizationSchema } from "@/lib/content/desk-schema";
import { DeskByline } from "@/components/articles/DeskByline";
import CategoryFAQ from "./CategoryFAQ";

/**
 * Map url_category -> the desk slug that owns editorial quality for that
 * hub. Matches what DeskByline auto-selects for articles, but expressed
 * statically here so the hub emits a consistent Organization schema
 * regardless of how many articles are loaded.
 */
const HUB_DESK_SLUG: Record<UrlCategory, string> = {
  "credit-cards": "credit-team",
  loans: "lending-desk",
  banking: "banking-desk",
  investing: "investment-desk",
  insurance: "insurance-desk",
  taxes: "tax-desk",
  learn: "editorial-team",
};

type ArticleRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  read_time: string | number | null;
  published_at: string | null;
  category: string | null;
};

async function getCategoryContent(
  urlCategory: UrlCategory,
  limit = 48,
): Promise<{ articles: ArticleRow[]; total: number }> {
  const dbCats = dbCategoriesForUrl(urlCategory);
  if (dbCats.length === 0) return { articles: [], total: 0 };

  const supabase = createServiceClient();
  const [listRes, countRes] = await Promise.all([
    supabase
      .from("articles")
      .select(
        "slug, title, excerpt, featured_image, read_time, published_at, category",
      )
      .eq("status", "published")
      .in("category", dbCats)
      .order("published_at", { ascending: false })
      .limit(limit),
    supabase
      .from("articles")
      .select("slug", { count: "exact", head: true })
      .eq("status", "published")
      .in("category", dbCats),
  ]);
  return {
    articles: (listRes.data as ArticleRow[]) ?? [],
    total: countRes.count ?? 0,
  };
}

function formatReadTime(rt: string | number | null): string {
  if (!rt) return "";
  const n = typeof rt === "string" ? parseInt(rt, 10) : rt;
  return Number.isFinite(n) && n > 0 ? `${n} min read` : "";
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function CategoryLearnHub({
  urlCategory,
}: {
  urlCategory: UrlCategory;
}) {
  const label = urlCategoryLabel(urlCategory);
  const { articles, total } = await getCategoryContent(urlCategory);
  const [featured, ...rest] = articles;

  // Editorial desk responsible for this hub's content quality.
  const desk = TEAM_MEMBERS.find((m) => m.slug === HUB_DESK_SLUG[urlCategory]);
  const deskSchema = desk ? deskOrganizationSchema(desk) : null;

  // Hub's representative category for DeskByline auto-selection — use the
  // desk's first mapped category so the byline shows the same desk as
  // our static map.
  const hubCategorySeed = desk?.categories[0];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: label,
        item: generateCanonicalUrl(`/${urlCategory}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Articles",
        item: generateCanonicalUrl(`/${urlCategory}/learn`),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {deskSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(deskSchema) }}
        />
      )}

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
              <li>
                <Link
                  href={`/${urlCategory}`}
                  className="hover:text-indian-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">Articles</li>
            </ol>
          </nav>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-indian-gold mb-4">
            {label} · Editorial
          </div>
          <h1 className="font-display font-black text-[44px] md:text-[64px] lg:text-[76px] leading-[1.02] tracking-tight text-canvas max-w-[980px]">
            {label} <span className="text-indian-gold">explained.</span>
          </h1>
          <p className="mt-6 font-serif text-[18px] md:text-[20px] leading-[1.55] text-canvas-70 max-w-[740px]">
            Rupee examples, regulatory sources, and picks from the{" "}
            {label.toLowerCase()} desk.
          </p>
        </div>
      </section>

      {/* Desk byline — which editorial desk owns this hub's quality */}
      {desk && hubCategorySeed && (
        <section className="bg-canvas border-b border-ink-12 py-6">
          <div className="max-w-[1280px] mx-auto px-6">
            <DeskByline category={hubCategorySeed} />
          </div>
        </section>
      )}

      <section className="bg-canvas py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-[18px] text-ink-60">
                No articles published in this category yet.
              </p>
              <Link
                href="/articles"
                className="mt-6 inline-block font-mono text-[11px] uppercase tracking-wider text-indian-gold hover:underline"
              >
                Browse all articles →
              </Link>
            </div>
          ) : (
            <>
              {featured && (
                <Link
                  href={articleUrl(featured)}
                  className="group block mb-14 pb-14 border-b border-ink-12"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
                    {featured.featured_image && (
                      <div className="relative aspect-[16/10] bg-ink-12 overflow-hidden rounded-sm order-1 lg:order-none">
                        <Image
                          src={featured.featured_image}
                          alt={featured.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          priority
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-3">
                        Featured
                        {formatReadTime(featured.read_time)
                          ? ` · ${formatReadTime(featured.read_time)}`
                          : ""}
                      </div>
                      <h2 className="font-display text-[32px] md:text-[40px] font-black text-ink leading-[1.1] group-hover:text-indian-gold transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-5 font-serif text-[17px] text-ink-80 leading-[1.55] max-w-[580px]">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="mt-5 font-mono text-[11px] uppercase tracking-wider text-ink-60">
                        {formatDate(featured.published_at)}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  {rest.map((a) => (
                    <Link
                      key={a.slug}
                      href={articleUrl(a)}
                      className="group block"
                    >
                      {a.featured_image && (
                        <div className="relative aspect-[16/10] bg-ink-12 overflow-hidden rounded-sm mb-4">
                          <Image
                            src={a.featured_image}
                            alt={a.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-2">
                        {label}
                        {formatReadTime(a.read_time)
                          ? ` · ${formatReadTime(a.read_time)}`
                          : ""}
                      </div>
                      <h3 className="font-display text-[20px] font-black text-ink leading-[1.2] group-hover:text-indian-gold transition-colors">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="mt-3 text-[13px] text-ink-60 leading-[1.55] line-clamp-3">
                          {a.excerpt}
                        </p>
                      )}
                      <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink-60">
                        {formatDate(a.published_at)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Category FAQ — GEO-optimized Q&A block */}
      <CategoryFAQ urlCategory={urlCategory} variant="ink" />
    </>
  );
}

/**
 * Shared metadata builder used by all route files that render this hub.
 */
export function buildCategoryLearnMetadata(urlCategory: UrlCategory) {
  const label = urlCategoryLabel(urlCategory);
  return {
    title: `${label} — Articles, Guides & Explainers`,
    description: `In-depth ${label.toLowerCase()} guides for Indian readers. Deductions, calculators, worked examples, and editorial analysis.`,
    alternates: { canonical: generateCanonicalUrl(`/${urlCategory}/learn`) },
    openGraph: {
      title: `${label} — InvestingPro`,
      description: `Editorial coverage of ${label.toLowerCase()} topics with rupee examples and regulatory context.`,
      url: generateCanonicalUrl(`/${urlCategory}/learn`),
      type: "website" as const,
    },
  };
}
