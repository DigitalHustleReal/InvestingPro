/**
 * 🚀 SERP-FIRST CONTENT PIPELINE
 *
 * End-to-end orchestrator that chains:
 *   SERP Scraping → Competitor Analysis → Superior Outline →
 *   NerdWallet-Grade Article → Images/Infographics → Save → Distribute
 *
 * This pipeline generates content that is designed to OUTRANK
 * existing top results by analyzing what they have and doing more.
 */

import { logger } from "@/lib/logger";
import { scrapeSERP, type SerpAnalysis } from "@/lib/seo/serp-scraper";
import {
  generateSuperiorOutline,
  type ContentOutline,
} from "@/lib/seo/competitor-analyzer";
import { generateArticle } from "@/lib/ai/article-writer";
import { distributeContent } from "@/lib/automation/content-distribution";
import { aiService } from "@/lib/ai-service";

// ============================================================================
// TYPES
// ============================================================================

export type SerpPipelineStage =
  | "initializing"
  | "serp_scraping"
  | "competitor_analysis"
  | "outline_generation"
  | "content_generation"
  | "image_generation"
  | "saving"
  | "distributing"
  | "complete"
  | "error";

export interface SerpPipelineEvent {
  stage: SerpPipelineStage;
  message: string;
  data?: any;
  progress?: { current: number; total: number };
  timestamp: string;
}

export interface SerpPipelineOptions {
  keyword: string;
  category?: string;
  authorId?: string;
  authorName?: string;
  generateImages?: boolean;
  autoDistribute?: boolean; // Push to Telegram/Social/Email after save
  style?: "investopedia" | "nerdwallet" | "hybrid";
}

export interface SerpPipelineResult {
  success: boolean;
  keyword: string;
  serpAnalysis?: SerpAnalysis;
  outline?: ContentOutline;
  article?: {
    id: string;
    title: string;
    slug: string;
    wordCount: number;
    seoScore?: number;
    qualityScore?: number;
  };
  images?: {
    featured?: string;
    infographics?: string[];
  };
  distribution?: {
    telegram: boolean;
    twitter: boolean;
    linkedin: boolean;
    email: boolean;
  };
  timings: {
    serpMs: number;
    outlineMs: number;
    contentMs: number;
    imagesMs: number;
    saveMs: number;
    distributeMs: number;
    totalMs: number;
  };
  errors: string[];
}

type EmitFn = (event: SerpPipelineEvent) => void;

// ============================================================================
// MAIN PIPELINE
// ============================================================================

export async function runSerpContentPipeline(
  options: SerpPipelineOptions,
  emit?: EmitFn,
): Promise<SerpPipelineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const timings = {
    serpMs: 0,
    outlineMs: 0,
    contentMs: 0,
    imagesMs: 0,
    saveMs: 0,
    distributeMs: 0,
    totalMs: 0,
  };

  const {
    keyword,
    category = "personal-finance",
    authorId,
    authorName = "InvestingPro Editorial",
    generateImages = true,
    autoDistribute = false,
    style = "nerdwallet",
  } = options;

  const result: SerpPipelineResult = {
    success: false,
    keyword,
    timings,
    errors,
  };

  const emitEvent = (
    stage: SerpPipelineStage,
    message: string,
    data?: any,
    progress?: { current: number; total: number },
  ) => {
    const event: SerpPipelineEvent = {
      stage,
      message,
      data,
      progress,
      timestamp: new Date().toISOString(),
    };
    emit?.(event);
    logger.info(`[SERP Pipeline] ${stage}: ${message}`, data);
  };

  try {
    // ── Stage 1: SERP Scraping ─────────────────────────────────────
    emitEvent("serp_scraping", `Scraping SERP for "${keyword}"...`, null, {
      current: 1,
      total: 7,
    });
    const serpStart = Date.now();

    const serpAnalysis = await scrapeSERP(keyword);
    result.serpAnalysis = serpAnalysis;
    timings.serpMs = Date.now() - serpStart;

    emitEvent(
      "serp_scraping",
      `Found ${serpAnalysis.topResults.length} results. Analyzed ${serpAnalysis.pageAnalyses.length} pages. Avg word count: ${serpAnalysis.competitiveInsights.avgWordCount}`,
      {
        results: serpAnalysis.topResults.length,
        analyzed: serpAnalysis.pageAnalyses.length,
        difficulty: serpAnalysis.competitiveInsights.difficulty,
      },
    );

    // ── Stage 2: Competitor Analysis & Outline ─────────────────────
    emitEvent(
      "outline_generation",
      "Generating superior outline from competitor analysis...",
      null,
      { current: 2, total: 7 },
    );
    const outlineStart = Date.now();

    const outline = await generateSuperiorOutline(serpAnalysis, category);
    result.outline = outline;
    timings.outlineMs = Date.now() - outlineStart;

    emitEvent(
      "outline_generation",
      `Outline ready: "${outline.title}" — ${outline.sections.length} sections, ${outline.faqs.length} FAQs, target ${outline.targetWordCount} words`,
      {
        title: outline.title,
        sections: outline.sections.length,
        faqs: outline.faqs.length,
        targetWords: outline.targetWordCount,
        competitiveEdge: outline.competitiveEdge,
      },
    );

    // ── Stage 3: NerdWallet-Grade Content Generation ──────────────
    emitEvent(
      "content_generation",
      `Generating ${outline.targetWordCount}-word article with NerdWallet-grade quality...`,
      null,
      { current: 3, total: 7 },
    );
    const contentStart = Date.now();

    // Build enhanced source content from outline
    const outlineContext = buildOutlineContext(outline, serpAnalysis);

    const generatedArticle = await generateArticle({
      topic: outline.title,
      keywords: outline.keywords,
      category,
      style,
      tone: "authoritative-yet-accessible",
      targetAudience: "Indian Investors and Consumers",
      sourceContent: outlineContext,
      useRichPrompt: true,
    });

    timings.contentMs = Date.now() - contentStart;
    const contentWordCount = generatedArticle.content
      .split(/\s+/)
      .filter(Boolean).length;

    emitEvent(
      "content_generation",
      `Article generated: ${contentWordCount} words, quality score: ${generatedArticle.quality_score || "N/A"}`,
      {
        wordCount: contentWordCount,
        qualityScore: generatedArticle.quality_score,
        warnings: generatedArticle.quality_warnings,
        provider: generatedArticle.provider,
      },
    );

    // ── Stage 4: Image Generation ─────────────────────────────────
    let featuredImageUrl: string | undefined;
    const infographicUrls: string[] = [];

    if (generateImages) {
      emitEvent(
        "image_generation",
        "Generating featured image and infographics...",
        null,
        { current: 4, total: 7 },
      );
      const imageStart = Date.now();

      try {
        // Generate featured image
        const imagePrompt = `Professional financial article featured image for: "${outline.title}".
Style: Clean, modern, Indian financial context.
Colors: Emerald green (#10b981), amber (#f59e0b), white background.
Elements: Abstract financial charts, Indian currency symbols (₹), professional.
NO text, NO watermarks. Magazine-quality editorial image.`;

        const { aiImageGenerator } =
          await import("@/lib/images/ai-image-generator");
        const imageResult = await aiImageGenerator.generate({
          prompt: imagePrompt,
          style: "professional",
          size: "1792x1024",
          quality: "hd",
          brand_guidelines: true,
        });

        if (imageResult?.url) {
          featuredImageUrl = imageResult.url;
          emitEvent("image_generation", "Featured image generated", {
            url: featuredImageUrl,
          });
        }
      } catch (imgError) {
        errors.push(`Featured image generation failed: ${imgError}`);
        emitEvent(
          "image_generation",
          "Featured image generation failed — continuing without",
        );
      }

      timings.imagesMs = Date.now() - imageStart;
    }

    result.images = {
      featured: featuredImageUrl,
      infographics: infographicUrls,
    };

    // ── Stage 5: Save to Database ─────────────────────────────────
    emitEvent("saving", "Saving article to database...", null, {
      current: 5,
      total: 7,
    });
    const saveStart = Date.now();

    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      const slug = outline.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 100);

      const articleData = {
        title: generatedArticle.title || outline.title,
        slug,
        body_markdown: generatedArticle.content,
        body_html: "", // Will be rendered from markdown
        excerpt: generatedArticle.excerpt,
        seo_title: generatedArticle.seo_title || outline.seoTitle,
        seo_description:
          generatedArticle.seo_description || outline.seoDescription,
        tags: generatedArticle.tags || outline.keywords,
        category,
        status: "draft" as const,
        author_id: authorId || null,
        author_name: authorName,
        featured_image: featuredImageUrl || null,
        ai_generated: true,
        ai_metadata: {
          pipeline: "serp-first",
          keyword,
          serp_difficulty: serpAnalysis.competitiveInsights.difficulty,
          competitor_avg_words: serpAnalysis.competitiveInsights.avgWordCount,
          target_words: outline.targetWordCount,
          actual_words: contentWordCount,
          quality_score: generatedArticle.quality_score,
          sections: outline.sections.length,
          faqs: outline.faqs.length,
          provider: generatedArticle.provider,
          model: generatedArticle.model,
          usage: generatedArticle.usage,
          outline_strategy: outline.contentStrategy,
          competitive_edge: outline.competitiveEdge,
          generated_at: new Date().toISOString(),
        },
        schema_faq: generatedArticle.schema_faq || outline.faqs,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: savedArticle, error: saveError } = await supabase
        .from("articles")
        .insert(articleData)
        .select("id, title, slug")
        .single();

      if (saveError) {
        throw saveError;
      }

      result.article = {
        id: savedArticle.id,
        title: savedArticle.title,
        slug: savedArticle.slug,
        wordCount: contentWordCount,
        qualityScore: generatedArticle.quality_score,
      };

      timings.saveMs = Date.now() - saveStart;
      emitEvent("saving", `Article saved as draft: /articles/${slug}`, {
        id: savedArticle.id,
        slug,
      });

      // ── Stage 6: Auto-distribute ─────────────────────────────────
      if (autoDistribute && savedArticle.id) {
        emitEvent(
          "distributing",
          "Distributing to Telegram, social media, and email...",
          null,
          { current: 6, total: 7 },
        );
        const distStart = Date.now();

        try {
          const distResult = await distributeContent(savedArticle.id);
          result.distribution = {
            telegram: distResult.messaging?.telegram?.sent || false,
            twitter: distResult.socialMedia?.twitter || false,
            linkedin: distResult.socialMedia?.linkedin || false,
            email: distResult.email?.sent || false,
          };
          timings.distributeMs = Date.now() - distStart;
          emitEvent(
            "distributing",
            "Distribution complete",
            result.distribution,
          );
        } catch (distError) {
          errors.push(`Distribution failed: ${distError}`);
          emitEvent(
            "distributing",
            "Distribution failed — article saved as draft",
          );
        }
      }
    } catch (saveError: any) {
      errors.push(`Save failed: ${saveError.message}`);
      emitEvent("saving", `Save failed: ${saveError.message}`);
    }

    // ── Complete ──────────────────────────────────────────────────
    timings.totalMs = Date.now() - startTime;
    result.success = !!result.article?.id;

    emitEvent(
      "complete",
      result.success
        ? `Pipeline complete! "${result.article?.title}" — ${result.article?.wordCount} words in ${Math.round(timings.totalMs / 1000)}s`
        : "Pipeline completed with errors",
      {
        success: result.success,
        timings,
        articleId: result.article?.id,
      },
      { current: 7, total: 7 },
    );
  } catch (error: any) {
    timings.totalMs = Date.now() - startTime;
    errors.push(error.message);
    emitEvent("error", `Pipeline failed: ${error.message}`);
    logger.error("SERP Pipeline failed", error);
  }

  return result;
}

/**
 * Build context string from outline for the article writer
 */
function buildOutlineContext(
  outline: ContentOutline,
  serpAnalysis: SerpAnalysis,
): string {
  const parts: string[] = [];

  parts.push(`ARTICLE OUTLINE (follow this structure exactly):`);
  parts.push(`Title: ${outline.title}`);
  parts.push(`Target: ${outline.targetWordCount} words`);
  parts.push(`Strategy: ${outline.contentStrategy}`);
  parts.push("");

  parts.push("SECTIONS:");
  for (const section of outline.sections) {
    parts.push(
      `${"#".repeat(section.level)} ${section.heading} (~${section.targetWords} words)`,
    );
    parts.push(`  → ${section.description}`);
    if (section.includeTable) parts.push("  → INCLUDE: Comparison table");
    if (section.includeCalculatorCTA)
      parts.push("  → INCLUDE: Calculator CTA embed");
    if (section.includeInfobox) parts.push("  → INCLUDE: Expert tip box");
  }

  parts.push("");
  parts.push("EMBEDDED ELEMENTS TO INCLUDE:");
  for (const element of outline.embeddedElements) {
    parts.push(`- ${element.type}: ${element.details} (${element.placement})`);
  }

  parts.push("");
  parts.push("INTERNAL LINKS TO INCLUDE:");
  for (const link of outline.internalLinks) {
    parts.push(`- [${link.anchorText}](${link.targetUrl}) — ${link.context}`);
  }

  parts.push("");
  parts.push("FAQ SECTION (include these with schema markup):");
  for (const faq of outline.faqs) {
    parts.push(`Q: ${faq.question}`);
    parts.push(`A: ${faq.answer}`);
    parts.push("");
  }

  parts.push("");
  parts.push("COMPETITIVE EDGE (emphasize these advantages):");
  for (const edge of outline.competitiveEdge) {
    parts.push(`- ${edge}`);
  }

  // Add competitor insights
  if (serpAnalysis.competitiveInsights.contentGaps.length > 0) {
    parts.push("");
    parts.push("CONTENT GAPS TO EXPLOIT (competitors miss these):");
    for (const gap of serpAnalysis.competitiveInsights.contentGaps) {
      parts.push(`- ${gap}`);
    }
  }

  return parts.join("\n");
}

/**
 * Run pipeline for multiple keywords in batch
 */
export async function runBatchSerpPipeline(
  keywords: string[],
  options: Omit<SerpPipelineOptions, "keyword">,
  emit?: EmitFn,
): Promise<SerpPipelineResult[]> {
  const results: SerpPipelineResult[] = [];

  for (let i = 0; i < keywords.length; i++) {
    emit?.({
      stage: "initializing",
      message: `Processing keyword ${i + 1}/${keywords.length}: "${keywords[i]}"`,
      progress: { current: i + 1, total: keywords.length },
      timestamp: new Date().toISOString(),
    });

    const result = await runSerpContentPipeline(
      { ...options, keyword: keywords[i] },
      emit,
    );
    results.push(result);

    // Small delay between articles to avoid rate limits
    if (i < keywords.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return results;
}
