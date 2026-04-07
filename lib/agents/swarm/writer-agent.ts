/**
 * Writer Agent
 *
 * CREATE phase — generates full NerdWallet-grade articles from queued topics.
 * Uses the existing article-writer.ts with category-specific rich prompts.
 *
 * Flow: content_queue (pending) → generate article → articles (draft) → editor_queue
 * Runs: 6:30 AM + 6:30 PM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { generateArticle } from "@/lib/ai/article-writer";
import { logger } from "@/lib/logger";

export class WriterAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "WriterAgent",
      batchSize: 3, // 3 articles per run (respects Vercel timeout + AI costs)
      claimTimeoutMs: 15 * 60 * 1000, // 15 min (articles take time)
      cronSchedule: "30 6,18 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      // 1. Claim topics from content_queue
      const { items: topics } = await this.claimItems<any>("content_queue", {
        limit: this.config.batchSize,
        orderBy: "priority",
        filters: {},
      });

      if (!topics.length) {
        return {
          success: true,
          data: { message: "No topics in queue" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      // 2. Check for SERP analysis data (optional enrichment)
      for (const topic of topics) {
        try {
          // Update status to in_progress
          await this.supabase
            .from("content_queue")
            .update({ status: "in_progress" })
            .eq("id", topic.id);

          // Check for cached outline
          let outlineContext = "";
          if (topic.outline_id) {
            const { data: outline } = await this.supabase
              .from("article_outlines")
              .select("*")
              .eq("id", topic.outline_id)
              .single();
            if (outline?.outline) {
              outlineContext = this.buildOutlineContext(outline);
            }
          }

          // Check for cached SERP analysis
          if (topic.serp_analysis_id) {
            const { data: serp } = await this.supabase
              .from("serp_analyses")
              .select("competitive_insights")
              .eq("id", topic.serp_analysis_id)
              .single();
            if (serp?.competitive_insights) {
              const insights = serp.competitive_insights;
              outlineContext += `\n\nCOMPETITOR INSIGHTS:\n- Avg word count: ${insights.avg_word_count || 2000}\n- Target: ${insights.target_word_count || 2500} words\n- Difficulty: ${insights.difficulty || "Medium"}\n`;
            }
          }

          // 3. Generate the article
          const article = await generateArticle({
            topic: topic.topic,
            keywords: topic.keywords || [topic.topic],
            category: topic.category || "personal-finance",
            style: "nerdwallet",
            tone: "authoritative-yet-accessible",
            targetAudience: "Indian Investors and Consumers",
            sourceContent: outlineContext || undefined,
            useRichPrompt: true,
          });

          // 4. Generate slug
          const slug = topic.topic
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .substring(0, 100);

          // Check slug uniqueness
          const { data: existing } = await this.supabase
            .from("articles")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

          const finalSlug = existing
            ? `${slug}-${Date.now().toString(36)}`
            : slug;

          const wordCount = article.content.split(/\s+/).filter(Boolean).length;

          // 5. Save to articles table
          const { data: savedArticle, error: saveError } = await this.supabase
            .from("articles")
            .insert({
              title: article.title || topic.topic,
              slug: finalSlug,
              body_markdown: article.content,
              body_html: "",
              excerpt: article.excerpt,
              seo_title: article.seo_title,
              seo_description: article.seo_description,
              tags: article.tags || topic.keywords,
              category: topic.category || "personal-finance",
              status: "draft",
              primary_keyword: topic.topic,
              secondary_keywords: topic.keywords?.slice(1) || [],
              word_count: wordCount,
              reading_time: Math.ceil(wordCount / 250),
              quality_score: article.quality_score || null,
              ai_generated: true,
              is_ai_generated: true,
              schema_markup: article.schema_faq?.length
                ? {
                    "@type": "FAQPage",
                    mainEntity: article.schema_faq.map((faq) => ({
                      "@type": "Question",
                      name: faq.question,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                      },
                    })),
                  }
                : null,
              ai_metadata: {
                pipeline: "swarm-writer",
                source_agent: "WriterAgent",
                topic: topic.topic,
                content_queue_id: topic.id,
                quality_score: article.quality_score,
                quality_warnings: article.quality_warnings,
                provider: article.provider,
                model: article.model,
                usage: article.usage,
                generated_at: new Date().toISOString(),
              },
            })
            .select("id, title, slug")
            .single();

          if (saveError) throw saveError;

          // 6. Queue for editor review
          await this.enqueue("editor_queue", [
            {
              article_id: savedArticle.id,
              editor_action: "full_review",
              status: "pending",
              quality_before: article.quality_score || null,
            },
          ]);

          // 7. Update content_queue
          await this.completeItem("content_queue", topic.id, {
            article_id: savedArticle.id,
          });

          itemsProcessed++;
          logger.info(
            `[WriterAgent] Article created: "${savedArticle.title}" (${wordCount} words)`,
          );
        } catch (error: any) {
          itemsFailed++;
          await this.failItem("content_queue", topic.id, error.message);
          logger.error(
            `[WriterAgent] Failed topic "${topic.topic}": ${error.message}`,
          );
        }
      }

      return {
        success: itemsProcessed > 0,
        data: {
          processed: itemsProcessed,
          failed: itemsFailed,
          total: topics.length,
        },
        metadata: { itemsProcessed, itemsFailed },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  private buildOutlineContext(outline: any): string {
    const parts: string[] = [];
    parts.push(`ARTICLE OUTLINE (follow this structure):`);
    parts.push(`Title: ${outline.title}`);
    parts.push(`Target: ${outline.target_word_count} words`);

    if (outline.outline?.sections) {
      parts.push("\nSECTIONS:");
      for (const section of outline.outline.sections) {
        parts.push(
          `${"#".repeat(section.level || 2)} ${section.heading} (~${section.targetWords || 300} words)`,
        );
        if (section.description) parts.push(`  → ${section.description}`);
        if (section.includeTable) parts.push("  → INCLUDE: Comparison table");
        if (section.includeCalculatorCTA)
          parts.push("  → INCLUDE: Calculator CTA");
      }
    }

    if (outline.faqs?.length) {
      parts.push("\nFAQ SECTION:");
      for (const faq of outline.faqs) {
        parts.push(`Q: ${faq.question}`);
        parts.push(`A: ${faq.answer}\n`);
      }
    }

    if (outline.competitive_edge?.length) {
      parts.push("\nCOMPETITIVE EDGE:");
      for (const edge of outline.competitive_edge) {
        parts.push(`- ${edge}`);
      }
    }

    return parts.join("\n");
  }
}
