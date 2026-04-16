/**
 * Article Detail Page — ISR Server Component
 *
 * Architecture:
 *   - Server component with ISR (revalidate every hour)
 *   - generateStaticParams: pre-builds top 100 articles at deploy time
 *   - generateMetadata: full SEO tags server-side
 *   - Preview mode: handled via searchParams (no "use client" needed)
 *   - Interactive islands: client components for bookmark, share, progress
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/service";
import ArticleRenderer from "@/components/articles/ArticleRenderer";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { AuthorBadge } from "@/components/articles/AuthorBadge";
import { AdvertiserDisclosure } from "@/components/common/AdvertiserDisclosure";
import TopPicksSidebar from "@/components/products/TopPicksSidebar";
// ContextualProducts removed — sidebar handles product recommendations
// SeamlessCTA and LeadMagnet removed — cluttered bottom section
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye } from "lucide-react";
import DifficultyBadge from "@/components/common/DifficultyBadge";
import TrustBadge from "@/components/common/TrustBadge";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
// generateSchema removed — using inline NewsArticle schema for Google News
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import { generateBreadcrumbSchema } from "@/lib/linking/breadcrumbs";
import SidebarTableOfContents from "@/components/articles/SidebarTableOfContents";
import SidebarCalculatorCTA from "@/components/articles/SidebarCalculatorCTA";
import { ArticleClientShell } from "./ArticleClientShell";
import ArticleFeedback from "@/components/articles/ArticleFeedback";
import MidArticleCapture from "@/components/articles/MidArticleCapture";
import EmbeddedCalculator from "@/components/articles/EmbeddedCalculator";
import InlineProductCard from "@/components/articles/InlineProductCard";
import LastUpdatedBadge from "@/components/articles/LastUpdatedBadge";
import "./article-content.css";

export const revalidate = 3600; // Revalidate every hour
export const dynamicParams = true; // Allow ISR for slugs not in generateStaticParams

// Pre-build the top 100 most-viewed articles at deploy time
export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("articles")
      .select("slug")
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(100);
    return (data || []).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

async function getArticle(slug: string, isPreview: boolean) {
  // Always use service client to bypass RLS — we filter by status ourselves
  const supabase = createServiceClient();

  const query = supabase
    .from("articles")
    .select("*, author:authors!left(*)") // left join — author_id may be null
    .eq("slug", slug);

  if (!isPreview) {
    query.eq("status", "published");
  }

  const { data, error } = await query.single();

  if (!data || error) {
    // Fallback: try without the join (if authors table not set up)
    const { data: simple } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    return simple ?? null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug, false);
  if (!article) return { title: "Article Not Found | InvestingPro" };

  const canonical = generateCanonicalUrl(`/articles/${article.slug}`);

  return {
    title: article.seo_title || `${article.title} | InvestingPro`,
    description: article.seo_description || article.excerpt,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonical,
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      images: article.featured_image
        ? [{ url: article.featured_image, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image] : [],
    },
  };
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = !!preview;
  const article = await getArticle(slug, isPreview);

  if (!article || (!isPreview && article.status !== "published")) {
    notFound();
  }

  // Increment view count asynchronously (fire & forget — doesn't block render)
  if (!isPreview) {
    const supabase = createServiceClient();
    try {
      await supabase
        .from("articles")
        .update({ views: (article.views || 0) + 1 })
        .eq("id", article.id);
    } catch {
      // Silently ignore view count errors
    }
  }

  const breadcrumbs = [
    { label: "Home", url: "/" },
    { label: "Articles", url: "/articles" },
    { label: article.title, url: `/articles/${article.slug}` },
  ];

  const canonicalUrl = generateCanonicalUrl(`/articles/${article.slug}`);
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
    wordCount: article.reading_time ? article.reading_time * 250 : undefined,
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
                  className="ml-3 underline hover:text-amber-600"
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
              {/* Category + trust badges */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[10px]">
                  {article.category?.replace(/-/g, " ")}
                </Badge>
                <DifficultyBadge level={article.difficulty || "beginner"} />
                <TrustBadge type="fact-checked" />
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-5 leading-[1.08] font-heading tracking-tight">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-7 leading-relaxed font-medium border-l-4 border-primary/30 pl-4">
                {article.excerpt}
              </p>

              {/* Meta row — author + actions on one line, date/time below */}
              <div className="mb-8 pb-8 border-b border-border space-y-4">
                <div className="flex items-center justify-between">
                  <AuthorBadge
                    name={
                      article.author?.name ||
                      article.author_name ||
                      "InvestingPro Team"
                    }
                    role={article.author?.role || article.author_role}
                    avatarUrl={
                      article.author?.photo_url || article.author_avatar
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
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
                  {(article.published_at || article.published_date) && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(
                        article.published_at || article.published_date,
                      ).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  <LastUpdatedBadge
                    publishedAt={article.published_at || article.published_date}
                    updatedAt={article.updated_at}
                  />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.read_time || "5"} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {(article.views || 0).toLocaleString("en-IN")} views
                  </span>
                </div>
              </div>

              {/* Featured image */}
              {article.featured_image && (
                <div className="relative aspect-video w-full mb-10 rounded-2xl overflow-hidden shadow-xl">
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

              {/* Advertiser disclosure */}
              <AdvertiserDisclosure className="mb-8" />

              {/* Article body */}
              <div id="article-content" className="prose-article">
                <ArticleRenderer
                  body_html={article.body_html}
                  body_markdown={article.body_markdown}
                  content={article.content}
                />

                {article.category && (
                  <EmbeddedCalculator category={article.category} />
                )}

                <MidArticleCapture
                  category={article.category}
                  articleId={article.id}
                />
                {article.category && (
                  <InlineProductCard
                    productType={article.category}
                    maxProducts={2}
                  />
                )}
              </div>

              <ArticleFeedback articleId={article.id} />

              {/* Tags */}
              {article.tags?.length > 0 && (
                <div className="mt-14 pt-8 border-t border-border">
                  <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string) => (
                      <Link key={tag} href={`/tag/${tag}`}>
                        <Badge
                          variant="secondary"
                          className="hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related articles + newsletter */}
              <div className="mt-14 space-y-10">
                <Suspense fallback={null}>
                  <RelatedArticles articleId={article.id} />
                </Suspense>
              </div>

              {/* Prev / next nav */}
              <div className="mt-14 pt-8 border-t flex justify-between gap-4">
                <Link
                  href="/articles"
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  ← All Articles
                </Link>
                {article.category && (
                  <Link
                    href={`/category/${article.category}`}
                    className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    More in {article.category.replace(/-/g, " ")} →
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
                <SidebarCalculatorCTA category={article.category} />

                {/* Top product picks for this category */}
                <Suspense fallback={null}>
                  <TopPicksSidebar category={article.category} />
                </Suspense>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
