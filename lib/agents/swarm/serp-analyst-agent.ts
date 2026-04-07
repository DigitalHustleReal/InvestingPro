/**
 * SERP Analyst Agent
 *
 * ANALYZE phase — researches competitive landscape for queued topics.
 * Uses FREE sources only:
 * - Google Autocomplete (related keywords + People Also Ask)
 * - DuckDuckGo HTML scraping (top 10 results metadata)
 *
 * Enriches content_queue items with SERP data before the Writer picks them up.
 * Flow: content_queue (pending, has no serp_analysis_id) → analyze → serp_analyses → update content_queue
 * Runs: 3:00 AM + 3:00 PM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { getGoogleSuggestions } from "../providers/google-autocomplete";
import { logger } from "@/lib/logger";

const MAX_ANALYZE_PER_RUN = 8;

interface SerpResult {
  title: string;
  url: string;
  snippet: string;
}

export class SerpAnalystAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "SerpAnalystAgent",
      batchSize: MAX_ANALYZE_PER_RUN,
      claimTimeoutMs: 10 * 60 * 1000,
      cronSchedule: "0 3,15 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;

    try {
      // 1. Claim content_queue items that have no SERP analysis yet
      const { items } = await this.claimItems<any>("content_queue", {
        limit: this.config.batchSize,
        orderBy: "priority",
        filters: {},
      });

      // Filter to only items without serp_analysis_id
      const needsAnalysis = items.filter((item: any) => !item.serp_analysis_id);

      if (!needsAnalysis.length) {
        // Release any we claimed that already have analysis
        for (const item of items) {
          if (item.serp_analysis_id) {
            await this.supabase
              .from("content_queue")
              .update({
                status: "pending",
                assigned_agent: null,
                claimed_at: null,
              })
              .eq("id", item.id);
          }
        }

        return {
          success: true,
          data: { message: "No topics need SERP analysis" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
        };
      }

      for (const item of needsAnalysis) {
        try {
          await this.supabase
            .from("content_queue")
            .update({ status: "in_progress" })
            .eq("id", item.id);

          const topic = item.topic;

          // 2. Gather related keywords via Google Autocomplete
          const relatedKeywords = await this.getRelatedKeywords(topic);

          // 3. Scrape DuckDuckGo for competitive analysis
          const serpResults = await this.scrapeDuckDuckGo(topic);

          // 4. Extract competitive insights
          const insights = this.analyzeCompetition(
            serpResults,
            relatedKeywords,
          );

          // 5. Save to serp_analyses table
          const { data: savedAnalysis, error: saveError } = await this.supabase
            .from("serp_analyses")
            .insert({
              keyword: topic,
              search_engine: "duckduckgo",
              results: serpResults,
              related_keywords: relatedKeywords.map((k) => k.keyword),
              competitive_insights: insights,
              expires_at: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            })
            .select("id")
            .single();

          if (saveError) throw saveError;

          // 6. Link SERP analysis back to content_queue item
          await this.supabase
            .from("content_queue")
            .update({
              status: "pending", // Back to pending for Writer to pick up
              assigned_agent: null,
              claimed_at: null,
              serp_analysis_id: savedAnalysis.id,
              keywords: [
                ...(item.keywords || []),
                ...relatedKeywords.slice(0, 5).map((k) => k.keyword),
              ].slice(0, 10),
            })
            .eq("id", item.id);

          itemsProcessed++;
          logger.info(
            `[SerpAnalystAgent] Analyzed "${topic}": ${serpResults.length} results, ${relatedKeywords.length} keywords`,
          );

          // Rate limit: 500ms between searches
          await new Promise((r) => setTimeout(r, 500));
        } catch (error: any) {
          itemsFailed++;

          // Release back to pending so it can be retried
          await this.supabase
            .from("content_queue")
            .update({
              status: "pending",
              assigned_agent: null,
              claimed_at: null,
            })
            .eq("id", item.id);

          logger.error(
            `[SerpAnalystAgent] Failed "${item.topic}": ${error.message}`,
          );
        }
      }

      return {
        success: itemsProcessed > 0,
        data: {
          analyzed: itemsProcessed,
          failed: itemsFailed,
          total: needsAnalysis.length,
        },
        metadata: { itemsProcessed, itemsFailed },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  /**
   * Get related keywords via Google Autocomplete variations
   */
  private async getRelatedKeywords(
    topic: string,
  ): Promise<Array<{ keyword: string; relevance: number }>> {
    const allKeywords: Array<{ keyword: string; relevance: number }> = [];

    try {
      // Base suggestions
      const base = await getGoogleSuggestions(topic, "IN", "en");
      allKeywords.push(...base);

      // "How to" variation
      const howTo = await getGoogleSuggestions(`how to ${topic}`, "IN", "en");
      allKeywords.push(
        ...howTo.map((k) => ({ ...k, relevance: k.relevance - 5 })),
      );

      // "Best" variation
      const best = await getGoogleSuggestions(`best ${topic}`, "IN", "en");
      allKeywords.push(
        ...best.map((k) => ({ ...k, relevance: k.relevance - 5 })),
      );

      await new Promise((r) => setTimeout(r, 200));

      // "vs" variation for comparisons
      const vs = await getGoogleSuggestions(`${topic} vs`, "IN", "en");
      allKeywords.push(
        ...vs.map((k) => ({ ...k, relevance: k.relevance - 10 })),
      );
    } catch {
      // Partial results are fine
    }

    // Deduplicate
    const seen = new Set<string>();
    return allKeywords.filter((k) => {
      const lower = k.keyword.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }

  /**
   * Scrape DuckDuckGo HTML search for competitive analysis.
   * DuckDuckGo HTML version doesn't require API keys.
   */
  private async scrapeDuckDuckGo(query: string): Promise<SerpResult[]> {
    try {
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) return [];

      const html = await response.text();
      return this.parseDuckDuckGoHTML(html);
    } catch (error) {
      logger.warn(`[SerpAnalystAgent] DuckDuckGo scrape failed for "${query}"`);
      return [];
    }
  }

  /**
   * Parse DuckDuckGo HTML results page
   */
  private parseDuckDuckGoHTML(html: string): SerpResult[] {
    const results: SerpResult[] = [];

    // Match result blocks: <a class="result__a" href="...">title</a>
    // and <a class="result__snippet">snippet</a>
    const resultBlocks =
      html.match(/<div class="result[^"]*"[\s\S]*?<\/div>\s*<\/div>/g) || [];

    for (const block of resultBlocks.slice(0, 10)) {
      // Extract title
      const titleMatch = block.match(
        /<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/,
      );
      // Extract URL
      const urlMatch = block.match(
        /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>/,
      );
      // Extract snippet
      const snippetMatch = block.match(
        /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/,
      );

      if (titleMatch) {
        const title = titleMatch[1].replace(/<[^>]*>/g, "").trim();
        const url = urlMatch ? urlMatch[1] : "";
        const snippet = snippetMatch
          ? snippetMatch[1].replace(/<[^>]*>/g, "").trim()
          : "";

        if (title && url) {
          results.push({ title, url, snippet });
        }
      }
    }

    return results;
  }

  /**
   * Analyze competitive landscape from SERP results
   */
  private analyzeCompetition(
    serpResults: SerpResult[],
    relatedKeywords: Array<{ keyword: string; relevance: number }>,
  ): Record<string, any> {
    // Estimate competitor content characteristics from titles/snippets
    const avgTitleLength =
      serpResults.reduce((sum, r) => sum + r.title.length, 0) /
      (serpResults.length || 1);

    // Detect common patterns
    const hasListicles = serpResults.some(
      (r) => /\d+\s+(best|top|ways)/i.test(r.title) || /^\d+/.test(r.title),
    );
    const hasHowTo = serpResults.some((r) =>
      /how to|guide|tutorial/i.test(r.title),
    );
    const hasComparison = serpResults.some((r) =>
      /vs\.?|versus|compare|comparison/i.test(r.title),
    );
    const hasReview = serpResults.some((r) =>
      /review|rating|rated/i.test(r.title),
    );

    // Identify top domains
    const domains = serpResults
      .map((r) => {
        try {
          return new URL(r.url).hostname;
        } catch {
          return "";
        }
      })
      .filter(Boolean);

    const domainCounts: Record<string, number> = {};
    for (const d of domains) {
      domainCounts[d] = (domainCounts[d] || 0) + 1;
    }

    // Estimate difficulty based on competition
    const bigDomains = [
      "bankbazaar.com",
      "paisabazaar.com",
      "groww.in",
      "etmoney.com",
      "cleartax.in",
      "livemint.com",
      "moneycontrol.com",
      "economictimes.com",
      "financialexpress.com",
      "nerdwallet.com",
      "investopedia.com",
      "forbes.com",
    ];
    const bigDomainCount = domains.filter((d) =>
      bigDomains.some((bd) => d.includes(bd)),
    ).length;

    const difficulty =
      bigDomainCount >= 7
        ? "Very Hard"
        : bigDomainCount >= 4
          ? "Hard"
          : bigDomainCount >= 2
            ? "Medium"
            : "Easy";

    // Recommended content type
    let recommendedType = "guide";
    if (hasListicles) recommendedType = "listicle";
    if (hasComparison) recommendedType = "comparison";
    if (hasHowTo) recommendedType = "how-to";

    return {
      total_results: serpResults.length,
      avg_title_length: Math.round(avgTitleLength),
      content_types: {
        listicles: hasListicles,
        how_to: hasHowTo,
        comparison: hasComparison,
        review: hasReview,
      },
      recommended_type: recommendedType,
      top_domains: Object.entries(domainCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([domain, count]) => ({ domain, count })),
      difficulty,
      big_domain_count: bigDomainCount,
      related_keyword_count: relatedKeywords.length,
      target_word_count:
        difficulty === "Very Hard"
          ? 3500
          : difficulty === "Hard"
            ? 3000
            : difficulty === "Medium"
              ? 2500
              : 2000,
      avg_word_count: 2200, // Estimated for Indian finance niche
    };
  }
}
