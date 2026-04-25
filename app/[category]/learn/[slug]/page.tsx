/**
 * Category-Nested Article Route — /[category]/learn/[slug]
 *
 * Phase 3a (canonical flip): this URL renders the article in full.
 * `/articles/[slug]` will 308 here when the article has a mapped category
 * (see app/articles/[slug]/page.tsx, Phase 3a Commit 3).
 */

import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import {
  categoryMatches,
  dbCategoryToUrl,
  isUrlCategory,
  urlCategoryLabel,
  type UrlCategory,
} from "@/lib/routing/category-map";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import FullArticleView, {
  type FullArticle,
} from "@/components/articles/FullArticleView";
import type { BreadcrumbItem } from "@/lib/linking/breadcrumbs";

export const revalidate = 3600;
export const dynamicParams = true;

// Pre-build top 100 articles across all categories at deploy time.
// Returns (category, slug) pairs derived from the DB so that build-time
// pre-rendering matches the actual canonical URLs.
export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("articles")
      .select("slug, category")
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(100);
    return (data || []).map((a: { slug: string; category: string | null }) => ({
      category: dbCategoryToUrl(a.category),
      slug: a.slug,
    }));
  } catch {
    return [];
  }
}

// React.cache dedupes across generateMetadata + default render in the
// same request. Returns the full row so FullArticleView gets everything.
const lookupArticle = cache(
  async (slug: string): Promise<FullArticle | null> => {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*, author:authors!left(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!data || error) {
      const { data: simple } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      return (simple as FullArticle | null) ?? null;
    }

    return data as FullArticle;
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  if (!isUrlCategory(category)) return { title: "Not Found" };

  const article = await lookupArticle(slug);
  if (!article || !categoryMatches(article.category, category)) {
    return { title: "Not Found" };
  }

  const canonical = generateCanonicalUrl(`/${category}/learn/${article.slug}`);

  return {
    title: (
      (article as { seo_title?: string }).seo_title || article.title
    ).replace(/\s*\|\s*InvestingPro\s*$/i, ""),
    description:
      (article as { seo_description?: string }).seo_description ||
      article.excerpt ||
      undefined,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      url: canonical,
      type: "article",
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at || undefined,
      images: article.featured_image
        ? [{ url: article.featured_image, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.featured_image ? [article.featured_image] : [],
    },
  };
}

export default async function CategoryLearnArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { category, slug } = await params;
  const { preview } = await searchParams;
  const isPreview = !!preview;

  // 1. URL category must be a recognized top-level
  if (!isUrlCategory(category)) {
    notFound();
  }

  // 2. Article must exist + be published (or in preview mode)
  const article = await lookupArticle(slug);
  if (!article) {
    notFound();
  }

  // 3. URL category must match the article's DB-derived URL category.
  //    Prevents /loans/learn/sip-calculator (which is investing).
  if (!categoryMatches(article.category, category as UrlCategory)) {
    notFound();
  }

  // Increment view count (fire & forget)
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

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
    { label: urlCategoryLabel(category as UrlCategory), url: `/${category}` },
    { label: "Learn", url: `/${category}/learn` },
    { label: article.title, url: `/${category}/learn/${article.slug}` },
  ];

  const canonicalUrl = generateCanonicalUrl(
    `/${category}/learn/${article.slug}`,
  );

  return (
    <FullArticleView
      article={article}
      canonicalUrl={canonicalUrl}
      breadcrumbs={breadcrumbs}
      isPreview={isPreview}
    />
  );
}

// Bound the dynamic params we'll accept at runtime to known URL categories,
// so a malformed /foo/learn/bar 404s without hitting Supabase.
// (isUrlCategory check above already does this; documenting for future me.)
