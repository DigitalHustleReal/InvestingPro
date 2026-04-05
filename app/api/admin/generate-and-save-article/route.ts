import { NextRequest, NextResponse } from "next/server";
import { generateArticle } from "@/lib/ai/article-writer";
import { articleService } from "@/lib/cms/article-service";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { logger } from "@/lib/logger";

/**
 * POST /api/admin/generate-and-save-article
 * Generate one article via CMS and save to database (draft).
 * Body: { topic: string, keywords?: string[], tone?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error: adminAuthError } = await requireAdminApi();
    if (adminAuthError) return adminAuthError;

    const body = await request.json().catch(() => ({}));
    const topic =
      (body.topic as string)?.trim() ||
      "Best Credit Card for Digital Marketers in 2026";
    const keywords: string[] = Array.isArray(body.keywords)
      ? body.keywords
      : [
          "credit card",
          "digital marketers",
          "2026",
          "rewards",
          "cashback",
          "business credit card",
        ];
    const tone = (body.tone as string) || "educational";

    const generated = await generateArticle({
      topic,
      keywords,
      tone,
      targetAudience: "Digital marketers and freelancers in India",
    });

    const slug = generated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100);

    const result = await articleService.createArticle(
      { body_markdown: generated.content, body_html: "" },
      {
        title: generated.title,
        slug,
        excerpt: generated.excerpt,
        category: "credit-cards",
        tags: generated.tags,
        seo_title: generated.seo_title,
        seo_description: generated.seo_description,
        ai_generated: true,
        ai_metadata: generated.ai_metadata,
      },
    );

    logger.info("Article generated and saved via CMS", {
      id: result.id,
      title: result.title,
      slug: result.slug,
    });

    return NextResponse.json({
      success: true,
      article: {
        id: result.id,
        title: result.title,
        slug: result.slug,
        status: result.status,
      },
      viewUrl: `/articles/${result.slug}`,
    });
  } catch (error) {
    logger.error("Generate-and-save article failed", error as Error);
    return NextResponse.json(
      {
        error: "Failed to generate or save article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
