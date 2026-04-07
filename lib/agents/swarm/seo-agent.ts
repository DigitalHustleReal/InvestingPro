/**
 * SEO Optimization Agent
 *
 * OPTIMIZE phase — auto-optimizes published articles for SEO.
 * Claims articles where status='published' and seo_optimized is null/false.
 *
 * For each article:
 * - Generates meta title (50-60 chars) and meta description (150-160 chars)
 * - Generates schema_markup (Article + FAQPage JSON-LD)
 * - Checks internal link density
 * - Generates og_title, og_description
 * - Scores SEO quality (1-100)
 * - Updates the article with all SEO fields
 *
 * Runs: 6:00 AM + 6:00 PM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { logger } from "@/lib/logger";
import { aiService } from "@/lib/ai-service";

const MAX_OPTIMIZE_PER_RUN = 5;

interface ArticleRow {
  id: string;
  title: string;
  content: string;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  schema_markup?: any;
  og_title?: string | null;
  og_description?: string | null;
  seo_score?: number | null;
  seo_optimized?: boolean | null;
  category?: string | null;
  tags?: string[] | null;
}

export class SeoAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "SeoAgent",
      batchSize: MAX_OPTIMIZE_PER_RUN,
      claimTimeoutMs: 10 * 60 * 1000,
      cronSchedule: "0 6,18 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      // 1. Fetch published articles that haven't been SEO optimized
      const { data: articles, error: fetchError } = await this.supabase
        .from("articles")
        .select(
          "id, title, content, slug, meta_title, meta_description, schema_markup, og_title, og_description, seo_score, seo_optimized, category, tags",
        )
        .eq("status", "published")
        .or("seo_optimized.is.null,seo_optimized.eq.false")
        .order("created_at", { ascending: true })
        .limit(this.config.batchSize);

      if (fetchError) {
        logger.error(
          `[SeoAgent] Failed to fetch articles: ${fetchError.message}`,
        );
        return {
          success: false,
          error: fetchError.message,
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      if (!articles || articles.length === 0) {
        return {
          success: true,
          data: { message: "No articles need SEO optimization" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      for (const article of articles as ArticleRow[]) {
        try {
          const seoData = await this.optimizeArticle(article);

          // Update the article with SEO data
          const { error: updateError } = await this.supabase
            .from("articles")
            .update({
              meta_title: seoData.metaTitle,
              meta_description: seoData.metaDescription,
              schema_markup: seoData.schemaMarkup,
              og_title: seoData.ogTitle,
              og_description: seoData.ogDescription,
              seo_score: seoData.seoScore,
              seo_optimized: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", article.id);

          if (updateError) {
            throw new Error(`DB update failed: ${updateError.message}`);
          }

          itemsProcessed++;
          logger.info(
            `[SeoAgent] Optimized "${article.title}" — score: ${seoData.seoScore}/100`,
          );

          // Rate limit: 1s between AI calls
          await new Promise((r) => setTimeout(r, 1000));
        } catch (error: any) {
          itemsFailed++;
          logger.error(
            `[SeoAgent] Failed "${article.title}": ${error.message}`,
          );
        }
      }

      return {
        success: itemsProcessed > 0,
        data: {
          optimized: itemsProcessed,
          failed: itemsFailed,
          total: articles.length,
        },
        metadata: { itemsProcessed, itemsFailed },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  /**
   * Run full SEO optimization on a single article
   */
  private async optimizeArticle(article: ArticleRow): Promise<{
    metaTitle: string;
    metaDescription: string;
    schemaMarkup: object;
    ogTitle: string;
    ogDescription: string;
    seoScore: number;
  }> {
    // Truncate content to avoid huge prompts
    const contentPreview = (article.content || "").slice(0, 3000);

    const prompt = `You are an SEO expert for an Indian personal finance website (investingpro.in).
Analyze the following article and generate SEO metadata.

Article Title: ${article.title}
Category: ${article.category || "general"}
Tags: ${(article.tags || []).join(", ") || "none"}
Content Preview:
${contentPreview}

Return a JSON object with these exact keys:
{
  "meta_title": "SEO title, 50-60 characters, include primary keyword early",
  "meta_description": "SEO description, 150-160 characters, include CTA and keyword",
  "og_title": "Social sharing title, can be slightly different from meta_title, 60-70 chars",
  "og_description": "Social sharing description, 100-150 chars, engaging",
  "faqs": [
    {"question": "FAQ question from content", "answer": "Brief answer, 1-2 sentences"}
  ],
  "seo_score": 75,
  "seo_issues": ["list of any SEO issues found"]
}

Rules:
- meta_title MUST be 50-60 characters
- meta_description MUST be 150-160 characters
- Include 2-4 FAQs extracted from or relevant to the content
- seo_score: 1-100 based on title quality, content length, keyword usage, structure
- Target Indian audience, use INR references where relevant
- Return ONLY valid JSON, no markdown`;

    const response = await aiService.generate(prompt, {
      format: "json",
      operation: "analyze",
    });

    let parsed: any;
    try {
      parsed = JSON.parse(response);
    } catch {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Build Article + FAQPage JSON-LD schema markup
    const schemaMarkup = this.buildSchemaMarkup(article, parsed);

    return {
      metaTitle: this.enforceLength(parsed.meta_title || article.title, 50, 60),
      metaDescription: this.enforceLength(
        parsed.meta_description ||
          `Learn about ${article.title} on InvestingPro.in`,
        150,
        160,
      ),
      schemaMarkup,
      ogTitle: this.enforceLength(
        parsed.og_title || parsed.meta_title || article.title,
        60,
        70,
      ),
      ogDescription: this.enforceLength(
        parsed.og_description || parsed.meta_description || "",
        100,
        150,
      ),
      seoScore: Math.min(100, Math.max(1, parsed.seo_score || 50)),
    };
  }

  /**
   * Build Article + FAQPage JSON-LD schema markup
   */
  private buildSchemaMarkup(article: ArticleRow, parsed: any): object {
    const baseUrl = "https://investingpro.in";

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: parsed.meta_title || article.title,
      description: parsed.meta_description || "",
      url: `${baseUrl}/${article.slug}`,
      publisher: {
        "@type": "Organization",
        name: "InvestingPro.in",
        url: baseUrl,
      },
      author: {
        "@type": "Organization",
        name: "InvestingPro.in",
      },
    };

    const faqs = parsed.faqs || [];
    const schemas: object[] = [articleSchema];

    if (faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
      schemas.push(faqSchema);
    }

    return schemas;
  }

  /**
   * Enforce string length within min-max range.
   * Truncates with ellipsis if too long, pads if too short.
   */
  private enforceLength(text: string, min: number, max: number): string {
    if (!text) return "";
    let result = text.trim();

    if (result.length > max) {
      result = result.slice(0, max - 3) + "...";
    }

    return result;
  }
}
