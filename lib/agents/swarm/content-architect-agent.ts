/**
 * Content Architect Agent
 *
 * ANALYZE phase — creates structured article outlines from SERP-enriched topics.
 * Uses AI to generate NerdWallet-grade article structure with:
 * - H2/H3 heading hierarchy
 * - Target word counts per section
 * - FAQ schema questions
 * - Competitive edge points
 * - Calculator/table/CTA placement suggestions
 *
 * Flow: content_queue (has serp_analysis_id, no outline_id) → outline → article_outlines → update content_queue
 * Runs: 4:00 AM + 4:00 PM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { aiService } from "@/lib/ai-service";
import { logger } from "@/lib/logger";

const MAX_OUTLINES_PER_RUN = 5;

export class ContentArchitectAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "ContentArchitectAgent",
      batchSize: MAX_OUTLINES_PER_RUN,
      claimTimeoutMs: 10 * 60 * 1000,
      cronSchedule: "0 4,16 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      // 1. Find content_queue items that have SERP analysis but no outline
      const { data: candidates, error: fetchError } = await this.supabase
        .from("content_queue")
        .select("*")
        .eq("status", "pending")
        .not("serp_analysis_id", "is", null)
        .is("outline_id", null)
        .order("priority", { ascending: false })
        .limit(this.config.batchSize);

      if (fetchError || !candidates?.length) {
        return {
          success: true,
          data: { message: "No topics need outlines" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      // Claim them
      const ids = candidates.map((c: any) => c.id);
      await this.supabase
        .from("content_queue")
        .update({
          status: "claimed",
          assigned_agent: this.config.name,
          claimed_at: new Date().toISOString(),
        })
        .in("id", ids)
        .eq("status", "pending");

      for (const item of candidates) {
        try {
          await this.supabase
            .from("content_queue")
            .update({ status: "in_progress" })
            .eq("id", item.id);

          // 2. Fetch SERP analysis data
          let serpInsights: Record<string, any> = {};
          if (item.serp_analysis_id) {
            const { data: serp } = await this.supabase
              .from("serp_analyses")
              .select("*")
              .eq("id", item.serp_analysis_id)
              .single();
            if (serp?.competitive_insights) {
              serpInsights = serp.competitive_insights;
            }
          }

          // 3. Generate outline via AI
          const outline = await this.generateOutline(
            item.topic,
            item.category || "personal-finance",
            item.keywords || [],
            serpInsights,
          );

          // 4. Save to article_outlines table
          const { data: savedOutline, error: saveError } = await this.supabase
            .from("article_outlines")
            .insert({
              topic: item.topic,
              title: outline.title,
              category: item.category,
              outline: {
                sections: outline.sections,
                intro: outline.intro,
                conclusion: outline.conclusion,
              },
              target_word_count: outline.targetWordCount,
              faqs: outline.faqs,
              competitive_edge: outline.competitiveEdge,
              content_queue_id: item.id,
            })
            .select("id")
            .single();

          if (saveError) throw saveError;

          // 5. Update content_queue with outline reference
          await this.supabase
            .from("content_queue")
            .update({
              status: "pending", // Back to pending for Writer
              assigned_agent: null,
              claimed_at: null,
              outline_id: savedOutline.id,
            })
            .eq("id", item.id);

          itemsProcessed++;
          logger.info(
            `[ContentArchitectAgent] Outline created for "${item.topic}" (${outline.sections.length} sections, ${outline.targetWordCount} words target)`,
          );
        } catch (error: any) {
          itemsFailed++;
          await this.supabase
            .from("content_queue")
            .update({
              status: "pending",
              assigned_agent: null,
              claimed_at: null,
            })
            .eq("id", item.id);

          logger.error(
            `[ContentArchitectAgent] Failed "${item.topic}": ${error.message}`,
          );
        }
      }

      return {
        success: itemsProcessed > 0,
        data: { outlined: itemsProcessed, failed: itemsFailed },
        metadata: { itemsProcessed, itemsFailed },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  private async generateOutline(
    topic: string,
    category: string,
    keywords: string[],
    serpInsights: Record<string, any>,
  ): Promise<{
    title: string;
    intro: string;
    sections: Array<{
      heading: string;
      level: number;
      targetWords: number;
      description: string;
      includeTable?: boolean;
      includeCalculatorCTA?: boolean;
    }>;
    conclusion: string;
    targetWordCount: number;
    faqs: Array<{ question: string; answer: string }>;
    competitiveEdge: string[];
  }> {
    const targetWords = serpInsights.target_word_count || 2500;
    const difficulty = serpInsights.difficulty || "Medium";
    const recommendedType = serpInsights.recommended_type || "guide";

    const prompt = `You are a senior content strategist for InvestingPro.in, an Indian personal finance platform.

Create a detailed article outline for: "${topic}"
Category: ${category}
Target audience: Indian investors and consumers
Difficulty: ${difficulty}
Recommended format: ${recommendedType}
Target word count: ${targetWords}
Related keywords: ${keywords.slice(0, 8).join(", ")}

${serpInsights.top_domains?.length ? `Top competing domains: ${serpInsights.top_domains.map((d: any) => d.domain).join(", ")}` : ""}

Requirements:
1. Create a NerdWallet-grade article structure
2. Include 5-8 H2 sections with clear purpose
3. Add H3 subsections where needed
4. Suggest where to include comparison tables
5. Suggest where to embed calculator CTAs (SIP, EMI, FD, tax calculators)
6. Include 4-6 FAQ questions with brief answers (for FAQ schema)
7. Add 3-5 competitive edge points (what makes our article better)
8. Each section should have a target word count

Respond in this exact JSON format:
{
  "title": "SEO-optimized title (50-60 chars)",
  "intro": "Brief description of the intro section approach",
  "sections": [
    {
      "heading": "H2 heading text",
      "level": 2,
      "targetWords": 300,
      "description": "What this section covers",
      "includeTable": false,
      "includeCalculatorCTA": false
    }
  ],
  "conclusion": "Brief description of conclusion approach",
  "targetWordCount": ${targetWords},
  "faqs": [
    {"question": "FAQ question?", "answer": "Brief 2-3 sentence answer"}
  ],
  "competitiveEdge": ["Point 1", "Point 2"]
}`;

    const response = await aiService.generate(prompt, {
      format: "json",
      operation: "generate",
      tier: "precision",
    });

    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON for outline");
    }

    return JSON.parse(jsonMatch[0]);
  }
}
