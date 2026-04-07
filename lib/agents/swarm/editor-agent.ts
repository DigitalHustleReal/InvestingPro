/**
 * Editor Agent
 *
 * CREATE phase — quality checks and auto-improves articles.
 * Runs quality gates, readability checks, SEO optimization.
 * Articles scoring 85+ are auto-approved for publishing.
 *
 * Flow: editor_queue (pending) → quality check → fix issues → articles (review-ready)
 * Runs: 8:00 AM + 8:00 PM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { runQuickQualityCheck } from "@/lib/quality/quality-gates";
import { logger } from "@/lib/logger";

const AUTO_APPROVE_THRESHOLD = 85;
const MAX_FIX_ATTEMPTS = 2;

export class EditorAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "EditorAgent",
      batchSize: 5,
      claimTimeoutMs: 10 * 60 * 1000,
      cronSchedule: "0 8,20 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      // 1. Claim items from editor_queue
      const { items: editorItems } = await this.claimItems<any>(
        "editor_queue",
        {
          limit: this.config.batchSize,
          orderBy: "created_at",
        },
      );

      if (!editorItems.length) {
        return {
          success: true,
          data: { message: "No articles to edit" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      for (const item of editorItems) {
        try {
          // Update to in_progress
          await this.supabase
            .from("editor_queue")
            .update({ status: "in_progress" })
            .eq("id", item.id);

          // 2. Fetch the article
          const { data: article, error: fetchError } = await this.supabase
            .from("articles")
            .select(
              "id, title, body_markdown, seo_title, seo_description, excerpt, category, quality_score",
            )
            .eq("id", item.article_id)
            .single();

          if (fetchError || !article) {
            throw new Error(
              `Article ${item.article_id} not found: ${fetchError?.message}`,
            );
          }

          // 3. Run quality checks
          const content = article.body_markdown || "";
          const qc = runQuickQualityCheck(
            article.title || "",
            content,
            article.seo_description || article.excerpt || "",
          );

          const issues: string[] = [...qc.errors, ...qc.warnings];
          const fixes: string[] = [];

          // 4. Auto-fix common issues
          let updatedContent = content;
          let updatedSeoTitle = article.seo_title;
          let updatedSeoDescription = article.seo_description;

          // Fix: Missing or short SEO title
          if (
            !updatedSeoTitle ||
            updatedSeoTitle.length < 20 ||
            updatedSeoTitle.length > 65
          ) {
            updatedSeoTitle = `${article.title} | InvestingPro`.substring(
              0,
              60,
            );
            fixes.push("Fixed SEO title length");
          }

          // Fix: Missing or short SEO description
          if (!updatedSeoDescription || updatedSeoDescription.length < 50) {
            updatedSeoDescription = (
              article.excerpt ||
              article.title ||
              ""
            ).substring(0, 155);
            fixes.push("Fixed SEO description");
          }

          // Fix: Content too short — add a note (can't generate more in editor)
          const wordCount = content.split(/\s+/).filter(Boolean).length;
          if (wordCount < 500) {
            issues.push(
              `Content very short (${wordCount} words) — needs human review`,
            );
          }

          // Fix: Missing heading structure
          if (!content.includes("## ") && !content.includes("<h2")) {
            issues.push("No H2 headings found — article needs structure");
          }

          // 5. Calculate final quality score
          const finalQC = runQuickQualityCheck(
            article.title || "",
            updatedContent,
            updatedSeoDescription || "",
          );
          const qualityScore = finalQC.overallScore;

          // 6. Determine status
          const isAutoApproved = qualityScore >= AUTO_APPROVE_THRESHOLD;
          const needsHumanReview =
            qualityScore < 60 || item.attempt_count >= MAX_FIX_ATTEMPTS;
          const newStatus = isAutoApproved
            ? "review-ready"
            : needsHumanReview
              ? "draft"
              : "draft";

          // 7. Update article
          const articleUpdates: Record<string, any> = {
            seo_title: updatedSeoTitle,
            seo_description: updatedSeoDescription,
            quality_score: qualityScore,
            status: isAutoApproved ? "review-ready" : "draft",
            updated_at: new Date().toISOString(),
          };

          if (isAutoApproved) {
            articleUpdates.editorial_notes = {
              auto_approved: true,
              approved_at: new Date().toISOString(),
              quality_score: qualityScore,
              agent: "EditorAgent",
            };
          }

          await this.supabase
            .from("articles")
            .update(articleUpdates)
            .eq("id", article.id);

          // 8. Update editor_queue
          await this.completeItem("editor_queue", item.id, {
            issues_found: issues,
            fixes_applied: fixes,
            quality_before: item.quality_before || article.quality_score,
            quality_after: qualityScore,
          });

          itemsProcessed++;
          logger.info(
            `[EditorAgent] "${article.title}" — score: ${qualityScore}, status: ${newStatus}, fixes: ${fixes.length}`,
          );
        } catch (error: any) {
          itemsFailed++;
          await this.failItem("editor_queue", item.id, error.message);
          logger.error(
            `[EditorAgent] Failed article ${item.article_id}: ${error.message}`,
          );
        }
      }

      return {
        success: itemsProcessed > 0,
        data: { processed: itemsProcessed, failed: itemsFailed },
        metadata: { itemsProcessed, itemsFailed },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }
}
