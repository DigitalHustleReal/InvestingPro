/**
 * Analytics & Performance Agent
 *
 * OPTIMIZE phase — tracks article performance and identifies optimization opportunities.
 * Pure analytics agent — no AI calls needed.
 *
 * For each published article:
 * - Checks page_views, avg_time_on_page, bounce_rate from analytics_events
 * - Identifies underperforming articles (published > 7 days, views < 50)
 * - Identifies high-performing articles (views > 500 in first 7 days)
 * - Creates optimization suggestions in agent_suggestions:
 *   - "refresh_content" for articles with declining traffic
 *   - "promote_social" for high-performing articles not yet distributed
 *   - "update_seo" for articles with high impressions but low CTR
 * - Calculates aggregate stats: total views this week, top 5, avg quality score
 *
 * Runs: 3:30 AM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { logger } from "@/lib/logger";

interface ArticlePerformance {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  quality_score?: number;
  page_views: number;
  avg_time_on_page: number;
  bounce_rate: number;
  impressions: number;
  clicks: number;
  has_social_post: boolean;
}

export class AnalyticsAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "AnalyticsAgent",
      batchSize: 20,
      claimTimeoutMs: 10 * 60 * 1000,
      cronSchedule: "30 3 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let itemsProcessed = 0;
    let itemsFailed = 0;
    const suggestions: Array<{
      type: string;
      article_id: string;
      title: string;
    }> = [];

    try {
      // 1. Fetch published articles
      const { data: articles, error: articlesError } = await this.supabase
        .from("articles")
        .select("id, title, slug, published_at, quality_score")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(this.config.batchSize);

      if (articlesError) {
        logger.error(
          `${this.config.name}: Failed to fetch articles`,
          new Error(articlesError.message),
        );
        return {
          success: false,
          error: articlesError.message,
          metadata: { itemsProcessed: 0, itemsFailed: 1 },
          executionTime: Date.now() - startTime,
        };
      }

      if (!articles || articles.length === 0) {
        return {
          success: true,
          data: { message: "No published articles to analyze" },
          metadata: { itemsProcessed: 0, itemsFailed: 0 },
          executionTime: Date.now() - startTime,
        };
      }

      const now = new Date();
      const sevenDaysAgo = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const fourteenDaysAgo = new Date(
        now.getTime() - 14 * 24 * 60 * 60 * 1000,
      ).toISOString();

      // 2. Gather performance data for each article
      const performanceData: ArticlePerformance[] = [];

      for (const article of articles) {
        try {
          // Fetch analytics events for this article (last 7 days)
          const { data: events } = await this.supabase
            .from("analytics_events")
            .select("event_type, metadata")
            .eq("page_path", `/${article.slug}`)
            .gte("created_at", sevenDaysAgo);

          const pageViews =
            events?.filter((e: any) => e.event_type === "page_view").length ||
            0;

          // Calculate avg time on page from events with duration metadata
          const durationsMs = (events || [])
            .filter((e: any) => e.metadata?.time_on_page)
            .map((e: any) => e.metadata.time_on_page as number);
          const avgTimeOnPage =
            durationsMs.length > 0
              ? durationsMs.reduce((a: number, b: number) => a + b, 0) /
                durationsMs.length
              : 0;

          // Calculate bounce rate
          const totalSessions =
            events?.filter((e: any) => e.event_type === "page_view").length ||
            0;
          const bounces =
            events?.filter((e: any) => e.metadata?.is_bounce).length || 0;
          const bounceRate =
            totalSessions > 0 ? (bounces / totalSessions) * 100 : 0;

          // Check impressions/clicks (from GSC data if stored)
          const { data: searchData } = await this.supabase
            .from("analytics_events")
            .select("metadata")
            .eq("event_type", "search_impression")
            .eq("page_path", `/${article.slug}`)
            .gte("created_at", sevenDaysAgo);

          const impressions = searchData?.length || 0;
          const clicks =
            searchData?.filter((e: any) => e.metadata?.clicked).length || 0;

          // Check if article has been distributed on social
          const { data: socialPosts } = await this.supabase
            .from("social_posts")
            .select("id")
            .eq("article_id", article.id)
            .limit(1);

          const hasSocialPost = (socialPosts?.length || 0) > 0;

          performanceData.push({
            id: article.id,
            title: article.title,
            slug: article.slug,
            published_at: article.published_at,
            quality_score: article.quality_score,
            page_views: pageViews,
            avg_time_on_page: avgTimeOnPage,
            bounce_rate: bounceRate,
            impressions,
            clicks,
            has_social_post: hasSocialPost,
          });

          itemsProcessed++;
        } catch (err) {
          logger.warn(
            `${this.config.name}: Failed to analyze article ${article.id}`,
            { error: err },
          );
          itemsFailed++;
        }
      }

      // 3. Identify underperforming articles (published > 7 days, views < 50)
      const underperforming = performanceData.filter((a) => {
        const publishedDate = new Date(a.published_at);
        const daysSincePublish =
          (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSincePublish > 7 && a.page_views < 50;
      });

      // 4. Identify high-performing articles (views > 500 in first 7 days)
      const highPerforming = performanceData.filter((a) => {
        const publishedDate = new Date(a.published_at);
        const daysSincePublish =
          (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSincePublish <= 7 && a.page_views > 500;
      });

      // 5. Create optimization suggestions

      // "refresh_content" for underperforming / declining traffic articles
      for (const article of underperforming) {
        suggestions.push({
          type: "refresh_content",
          article_id: article.id,
          title: article.title,
        });
      }

      // "promote_social" for high-performing articles not yet distributed
      for (const article of highPerforming) {
        if (!article.has_social_post) {
          suggestions.push({
            type: "promote_social",
            article_id: article.id,
            title: article.title,
          });
        }
      }

      // "update_seo" for articles with high impressions but low CTR
      for (const article of performanceData) {
        if (article.impressions > 100 && article.clicks > 0) {
          const ctr = (article.clicks / article.impressions) * 100;
          if (ctr < 2) {
            suggestions.push({
              type: "update_seo",
              article_id: article.id,
              title: article.title,
            });
          }
        }
      }

      // 6. Write suggestions to agent_suggestions table
      if (suggestions.length > 0) {
        const suggestionRows = suggestions.map((s) => ({
          agent_name: this.config.name,
          suggestion_type: s.type,
          article_id: s.article_id,
          title: `${s.type}: ${s.title}`,
          description: this.getSuggestionDescription(s.type, s.title),
          status: "pending",
          priority:
            s.type === "update_seo" ? 8 : s.type === "refresh_content" ? 6 : 5,
          metadata: {
            generated_at: new Date().toISOString(),
            source: "analytics_agent",
          },
        }));

        const { error: insertError } = await this.supabase
          .from("agent_suggestions")
          .insert(suggestionRows);

        if (insertError) {
          logger.warn(`${this.config.name}: Failed to insert suggestions`, {
            error: insertError,
          });
        }
      }

      // 7. Calculate aggregate stats
      const totalViewsThisWeek = performanceData.reduce(
        (sum, a) => sum + a.page_views,
        0,
      );
      const top5Articles = [...performanceData]
        .sort((a, b) => b.page_views - a.page_views)
        .slice(0, 5)
        .map((a) => ({ title: a.title, views: a.page_views, slug: a.slug }));
      const qualityScores = performanceData
        .filter((a) => a.quality_score != null)
        .map((a) => a.quality_score!);
      const avgQualityScore =
        qualityScores.length > 0
          ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
          : 0;

      const report = {
        total_articles_analyzed: performanceData.length,
        total_views_this_week: totalViewsThisWeek,
        top_5_articles: top5Articles,
        avg_quality_score: Math.round(avgQualityScore * 10) / 10,
        underperforming_count: underperforming.length,
        high_performing_count: highPerforming.length,
        suggestions_created: suggestions.length,
        suggestion_breakdown: {
          refresh_content: suggestions.filter(
            (s) => s.type === "refresh_content",
          ).length,
          promote_social: suggestions.filter((s) => s.type === "promote_social")
            .length,
          update_seo: suggestions.filter((s) => s.type === "update_seo").length,
        },
      };

      return {
        success: true,
        data: report,
        metadata: {
          itemsProcessed,
          itemsFailed,
          report,
        },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  private getSuggestionDescription(type: string, title: string): string {
    switch (type) {
      case "refresh_content":
        return `Article "${title}" has fewer than 50 views after 7+ days. Consider refreshing the content with updated information, better headlines, or improved structure.`;
      case "promote_social":
        return `Article "${title}" is performing well (500+ views in first week) but hasn't been distributed on social media yet. Promote on Twitter/LinkedIn for additional reach.`;
      case "update_seo":
        return `Article "${title}" has high search impressions but CTR below 2%. Consider updating the meta title, meta description, and featured snippet targeting.`;
      default:
        return `Optimization opportunity identified for "${title}".`;
    }
  }
}
