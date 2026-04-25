/**
 * FullArticleView — shared Server Component that renders an article body.
 * Consumed by both `/articles/[slug]` (legacy flat route) and
 * `/[category]/learn/[slug]` (NerdWallet-style nested route).
 *
 * Behavior-preserving extraction from app/articles/[slug]/page.tsx (Phase 3a Step 1).
 * No data fetching here — caller provides pre-fetched article + breadcrumbs + canonicalUrl.
 */

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import ArticleRenderer from "@/components/articles/ArticleRenderer";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { AuthorBadge } from "@/components/articles/AuthorBadge";
import { DeskByline } from "@/components/articles/DeskByline";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";
import TopPicksSidebar from "@/components/products/TopPicksSidebar";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import SidebarTableOfContents from "@/components/articles/SidebarTableOfContents";
import SidebarCalculatorCTA from "@/components/articles/SidebarCalculatorCTA";
import AISummaryBox from "@/components/articles/AISummaryBox";
import TableEnhancer from "@/components/articles/TableEnhancer";
import LiveRatesHydrator from "@/components/articles/LiveRateBadge";
import ArticleFeedback from "@/components/articles/ArticleFeedback";
import ArticleSources from "@/components/articles/ArticleSources";
import ArticleNewsletterInline from "@/components/articles/ArticleNewsletterInline";
import EmbeddedCalculator from "@/components/articles/EmbeddedCalculator";
import { ArticleClientShell } from "@/components/articles/ArticleClientShell";
import { generateBreadcrumbSchema } from "@/lib/linking/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/linking/breadcrumbs";
import { formatSlug } from "@/lib/utils";
import "@/components/articles/article-content.css";

/**
 * Permissive article shape — mirrors the untyped DB row consumed by the
 * original page.tsx. Keep in sync with `articles` table columns + the
 * left-joined `authors` row.
 */
export interface FullArticle {
  id: string;
  slug: string;
  title: string;
  status?: string;
  category?: string | null;
  excerpt?: string | null;
  meta_description?: string | null;
  body_html?: string | null;
  body_markdown?: string | null;
  content?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
  published_date?: string | null;
  updated_at?: string | null;
  read_time?: number | string | null;
  reading_time?: number | null;
  tags?: string[] | null;
  views?: number | null;
  schema_markup?: { articleSchema?: unknown; faqSchema?: unknown } | null;
  author_name?: string | null;
  author_role?: string | null;
  author_avatar?: string | null;
  author?: {
    name?: string;
    role?: string;
    photo_url?: string;
    slug?: string;
    bio?: string;
    credentials?: string[];
  } | null;
}

interface FullArticleViewProps {
  article: FullArticle;
  canonicalUrl: string;
  breadcrumbs: BreadcrumbItem[];
  isPreview: boolean;
}

export default function FullArticleView({
  article,
  canonicalUrl,
  breadcrumbs,
  isPreview,
}: FullArticleViewProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

  // NewsArticle schema for Google News eligibility
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt || article.meta_description || "",
    image: article.featured_image ? [article.featured_image] : [],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Organization",
      name: "InvestingPro",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "InvestingPro",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    articleSection: article.category || "Finance",
    keywords: (article.tags || []).join(", "),
    wordCount:
      typeof article.reading_time === "number"
        ? article.reading_time * 250
        : undefined,
    isAccessibleForFree: true,
  };

  const structuredData =
    article.schema_markup?.articleSchema ?? newsArticleSchema;
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = article.schema_markup?.faqSchema;

  const schemas = [structuredData, breadcrumbSchema, faqSchema].filter(Boolean);

  return (
    <>
      {/* Structured data */}
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <div className="min-h-screen bg-background relative">
        {/* Preview banner */}
        {isPreview && article.status !== "published" && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center">
            <p className="text-sm font-semibold text-amber-800">
              PREVIEW MODE — Status: {article.status}
              {article.id && (
                <a
                  href={`/admin/articles/${article.id}/edit`}
                  className="ml-3 underline hover:text-indian-gold"
                >
                  Edit Article ✏️
                </a>
              )}
            </p>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AutoBreadcrumbs />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
            {/* ── Main Content ─────────────────────────────────── */}
            <article className="lg:col-span-8 min-w-0">
              {/* Category badge */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-action-green bg-green-50 px-2.5 py-1 rounded-md">
                  {formatSlug(article.category || "")}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-[32px] sm:text-[40px] lg:text-[52px] text-ink dark:text-white mb-5 leading-[1.05] tracking-tight">
                {article.title}
              </h1>

              {/* Meta row — author + actions on one line, date/time below */}
              <div className="mb-8 pb-8 border-b border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <AuthorBadge
                    name={
                      article.author?.name ||
                      article.author_name ||
                      "InvestingPro Team"
                    }
                    role={
                      article.author?.role || article.author_role || undefined
                    }
                    avatarUrl={
                      article.author?.photo_url ||
                      article.author_avatar ||
                      undefined
                    }
                    slug={article.author?.slug}
                    bio={article.author?.bio}
                    credentials={article.author?.credentials}
                    size="md"
                    showRole
                  />
                  {/* Bookmark + Share inline with author */}
                  <ArticleClientShell
                    articleId={article.id}
                    articleTitle={article.title}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.updated_at &&
                    article.published_at &&
                    article.updated_at.slice(0, 10) !==
                      article.published_at.slice(0, 10)
                      ? `Updated ${new Date(article.updated_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`
                      : `Published ${new Date(article.published_at || article.published_date || article.updated_at || "").toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.read_time || "5"} min read
                  </span>
                </div>

                {/* Desk byline — auto-selects the right specialist desk from the article category.
                    Shown for all articles; complements AuthorBadge above. */}
                <DeskByline
                  category={article.category ?? undefined}
                  updatedAt={
                    article.updated_at || article.published_at || undefined
                  }
                />
              </div>

              {/* Featured image — shown immediately after meta, like NerdWallet */}
              {article.featured_image && (
                <div className="relative aspect-video w-full mb-8 overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}

              {/* AI Summary Box — collapsible quick read */}
              <AISummaryBox
                excerpt={article.excerpt ?? ""}
                category={article.category ?? undefined}
                readTime={
                  article.read_time !== null && article.read_time !== undefined
                    ? String(article.read_time)
                    : article.reading_time !== null &&
                        article.reading_time !== undefined
                      ? String(article.reading_time)
                      : undefined
                }
              />

              {/* Advertiser disclosure */}
              <AdvertiserDisclosure className="mb-8" />

              {/* Article body */}
              <div id="article-content" className="prose-article">
                <ArticleRenderer
                  body_html={article.body_html ?? undefined}
                  body_markdown={article.body_markdown ?? undefined}
                  content={article.content ?? undefined}
                />
                {/* Hydrate tables with sorting + scroll + live rates */}
                <TableEnhancer />
                <LiveRatesHydrator />

                {article.category && (
                  <EmbeddedCalculator category={article.category} />
                )}
              </div>

              {/* Newsletter capture — inline at article end */}
              <ArticleNewsletterInline
                category={article.category || ""}
                articleSlug={article.slug}
              />

              {/* Feedback */}
              <ArticleFeedback articleId={article.id} />

              {/* Article Sources — expandable citations for E-E-A-T */}
              <ArticleSources category={article.category || ""} />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-ink-60 uppercase tracking-wider mr-2">
                      Tags
                    </span>
                    {article.tags.map((tag: string) => (
                      <Link key={tag} href={`/tag/${tag}`}>
                        <span className="text-xs px-3 py-1.5 bg-gray-100 text-ink-60 rounded-lg hover:bg-green-50 hover:text-authority-green transition-colors cursor-pointer">
                          {tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related articles */}
              <div className="mt-10">
                <Suspense fallback={null}>
                  <RelatedArticles articleId={article.id} />
                </Suspense>
              </div>

              {/* Prev / next nav */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between gap-4">
                <Link
                  href="/articles"
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  ← All Articles
                </Link>
                {article.category && (
                  <Link
                    href={`/category/${article.category}`}
                    className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors capitalize"
                  >
                    More in {formatSlug(article.category)} →
                  </Link>
                )}
              </div>
            </article>

            {/* ── Sidebar ──────────────────────────────────────── */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24 space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none">
                {/* Table of Contents — scroll spy, highlights active */}
                <SidebarTableOfContents />

                {/* Calculator CTA — contextual per category */}
                <SidebarCalculatorCTA
                  category={article.category ?? undefined}
                />

                {/* Top product picks for this category */}
                {article.category && (
                  <Suspense fallback={null}>
                    <TopPicksSidebar category={article.category} />
                  </Suspense>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
