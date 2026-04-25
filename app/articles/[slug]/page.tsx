/**
 * Article Detail Page — ISR Server Component (legacy flat URL)
 *
 * Architecture:
 *   - Server component with ISR (revalidate every hour)
 *   - generateStaticParams: pre-builds top 100 articles at deploy time
 *   - generateMetadata: full SEO tags server-side
 *   - Preview mode: handled via searchParams (no "use client" needed)
 *   - Render: delegates to <FullArticleView/> shared Server Component.
 *     The same component is used by /[category]/learn/[slug] (Phase 3a target).
 */

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import { generateCanonicalUrl } from "@/lib/linking/canonical";
import FullArticleView, {
  type FullArticle,
} from "@/components/articles/FullArticleView";
import type { BreadcrumbItem } from "@/lib/linking/breadcrumbs";

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

async function getArticle(
  slug: string,
  isPreview: boolean,
): Promise<FullArticle | null> {
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
    return (simple as FullArticle | null) ?? null;
  }

  return data as FullArticle;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug, false);
  if (!article) return { title: "Article Not Found" };

  const canonical = generateCanonicalUrl(`/articles/${article.slug}`);

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

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
    { label: "Articles", url: "/articles" },
    { label: article.title, url: `/articles/${article.slug}` },
  ];

  const canonicalUrl = generateCanonicalUrl(`/articles/${article.slug}`);

  return (
    <FullArticleView
      article={article}
      canonicalUrl={canonicalUrl}
      breadcrumbs={breadcrumbs}
      isPreview={isPreview}
    />
  );
}
