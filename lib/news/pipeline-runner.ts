/**
 * News Pipeline Runner
 *
 * Stateless stage advancer called by /api/cron/news-pipeline every 15 min.
 * Each invocation advances ALL eligible events by one stage.
 *
 * Status flow:
 *   detected → screening → analyzing → writing → editing → publishing → published
 *
 * Key design: Calls generateArticle() directly — bypasses daily agent schedule.
 * Does NOT modify any existing swarm agent files.
 */
import { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { runSpikeScreening } from "./spike-screener";
import { runSerpAnalysis } from "./serp-budget";
import { getNewsArticleContext } from "./article-templates";
import { generateArticle } from "@/lib/ai/article-writer";

const MAX_RETRIES = 3;
const NEWS_QUALITY_GATE = 75; // Lower than editorial pipeline (85) — news speed matters

interface NewsEvent {
  id: string;
  source_id: string;
  source_name: string;
  source_url: string;
  headline: string;
  summary: string | null;
  raw_content: string | null;
  category: string;
  importance_score: number;
  trends_spike: boolean;
  gsc_spike: boolean;
  internal_spike: boolean;
  spike_count: number;
  serp_credit_used: boolean;
  serp_context: any;
  status: string;
  retry_count: number;
  article_id: string | null;
  detected_at: string;
  item_url: string | null;
}

function extractKeywordsFromEvent(event: NewsEvent): string[] {
  // Try to get keywords from ai_metadata or fall back to headline parsing
  const words = event.headline
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 6)
    .map((w) => w.toLowerCase());
  return [...new Set(words)];
}

async function incrementRetry(
  supabase: SupabaseClient,
  event: NewsEvent,
): Promise<void> {
  const newCount = (event.retry_count ?? 0) + 1;
  if (newCount >= MAX_RETRIES) {
    await supabase
      .from("news_events")
      .update({
        status: "skipped",
        skip_reason: `Failed after ${MAX_RETRIES} retries`,
      })
      .eq("id", event.id);
    logger.warn(
      `[Pipeline] Event ${event.id} skipped after ${MAX_RETRIES} retries`,
    );
  } else {
    await supabase
      .from("news_events")
      .update({ retry_count: newCount })
      .eq("id", event.id);
  }
}

// ── Stage: detected → screening ───────────────────────────────────────────

export async function processDetected(
  supabase: SupabaseClient,
): Promise<number> {
  const { data: events } = await supabase
    .from("news_events")
    .select("*")
    .eq("status", "detected")
    .order("importance_score", { ascending: false })
    .limit(10);

  if (!events?.length) return 0;
  let count = 0;

  for (const event of events as NewsEvent[]) {
    try {
      // Mark as screening
      await supabase
        .from("news_events")
        .update({ status: "screening", screening_at: new Date().toISOString() })
        .eq("id", event.id);

      const keywords = extractKeywordsFromEvent(event);
      const spikes = await runSpikeScreening(
        keywords,
        event.category,
        supabase,
      );
      const spikeCount =
        (spikes.trends_spike ? 1 : 0) +
        (spikes.gsc_spike ? 1 : 0) +
        (spikes.internal_spike ? 1 : 0);

      const shouldFastTrack = event.importance_score >= 7 || spikeCount >= 1;

      if (!shouldFastTrack) {
        // Route to daily content_queue instead
        await supabase
          .from("news_events")
          .update({
            status: "skipped",
            skip_reason:
              "No spike signals and importance < 7 — routed to daily queue",
            ...spikes,
          })
          .eq("id", event.id);

        // Insert into daily queue at normal priority (upsert ignores duplicates by topic)
        await supabase.from("content_queue").upsert(
          {
            topic: event.headline,
            keywords,
            category: event.category,
            priority: 5,
            status: "pending",
            source: "news_monitor",
          },
          { onConflict: "topic", ignoreDuplicates: true },
        );

        logger.info(
          `[Pipeline] "${event.headline.substring(0, 50)}" → daily queue (importance:${event.importance_score})`,
        );
      } else {
        await supabase
          .from("news_events")
          .update({
            status: "analyzing",
            analysis_at: new Date().toISOString(),
            ...spikes,
          })
          .eq("id", event.id);
        logger.info(
          `[Pipeline] "${event.headline.substring(0, 50)}" → analyzing (spikes:${spikeCount}, importance:${event.importance_score})`,
        );
      }
      count++;
    } catch (err: any) {
      logger.error(
        `[Pipeline] Screening failed for ${event.id}: ${err.message}`,
      );
      await incrementRetry(supabase, event);
    }
  }
  return count;
}

// ── Stage: analyzing → writing ────────────────────────────────────────────

export async function processAnalyzing(
  supabase: SupabaseClient,
): Promise<number> {
  const { data: events } = await supabase
    .from("news_events")
    .select("*")
    .eq("status", "analyzing")
    .order("importance_score", { ascending: false })
    .limit(5);

  if (!events?.length) return 0;
  let count = 0;

  for (const event of events as NewsEvent[]) {
    try {
      const keywords = extractKeywordsFromEvent(event);

      const serpResult = await runSerpAnalysis(
        keywords,
        event.importance_score,
        event.spike_count,
        supabase,
      );

      await supabase
        .from("news_events")
        .update({
          status: "writing",
          writing_at: new Date().toISOString(),
          serp_credit_used: serpResult.usedPaidApi,
          serp_context: {
            insights: serpResult.competitorInsights,
            relatedQueries: serpResult.relatedQueries,
            expandedKeywords: serpResult.keywords,
          },
        })
        .eq("id", event.id);

      logger.info(
        `[Pipeline] "${event.headline.substring(0, 50)}" → writing (SERP:${serpResult.usedPaidApi ? "paid" : "free"})`,
      );
      count++;
    } catch (err: any) {
      logger.error(
        `[Pipeline] Analysis failed for ${event.id}: ${err.message}`,
      );
      await incrementRetry(supabase, event);
    }
  }
  return count;
}

// ── Stage: writing → editing ──────────────────────────────────────────────

export async function processWriting(
  supabase: SupabaseClient,
): Promise<number> {
  const { data: events } = await supabase
    .from("news_events")
    .select("*")
    .eq("status", "writing")
    .order("importance_score", { ascending: false })
    .limit(3); // Articles take time — cap per run

  if (!events?.length) return 0;
  let count = 0;

  for (const event of events as NewsEvent[]) {
    try {
      const keywords = extractKeywordsFromEvent(event);
      const serpContext = event.serp_context?.insights ?? "";
      const expandedKeywords: string[] =
        event.serp_context?.expandedKeywords ?? keywords;

      // Build news-specific article context
      const newsContext = getNewsArticleContext({
        headline: event.headline,
        summary: event.summary ?? "",
        category: event.category,
        source_name: event.source_name,
        source_url: event.source_url,
        detected_at: event.detected_at,
        keywords: expandedKeywords,
        serp_context: serpContext,
      });

      // Generate article directly (bypasses daily swarm agent schedules)
      const article = await generateArticle({
        topic: event.headline,
        keywords: expandedKeywords,
        category: event.category,
        style: "nerdwallet",
        tone: "authoritative-yet-accessible",
        targetAudience: "Indian investors and salaried professionals",
        sourceContent: newsContext,
        useRichPrompt: true,
      });

      // Build unique slug
      const baseSlug = event.headline
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .substring(0, 75);
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      const wordCount = article.content.split(/\s+/).filter(Boolean).length;

      // Save article with news metadata
      const { data: savedArticle, error: saveError } = await supabase
        .from("articles")
        .insert({
          title: article.title,
          slug,
          body_markdown: article.content,
          body_html: "",
          excerpt: article.excerpt,
          seo_title: article.seo_title,
          seo_description: article.seo_description,
          tags: [...(article.tags ?? []), "news", event.category],
          category: event.category,
          status: "draft",
          primary_keyword: expandedKeywords[0] ?? event.headline.split(" ")[0],
          secondary_keywords: expandedKeywords.slice(1, 5),
          word_count: wordCount,
          reading_time: Math.ceil(wordCount / 250),
          quality_score: article.quality_score ?? 0,
          ai_generated: true,
          is_ai_generated: true,
          schema_markup: article.schema_faq?.length
            ? {
                "@type": "FAQPage",
                mainEntity: article.schema_faq.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
              }
            : null,
          ai_metadata: {
            pipeline: "news-intelligence",
            news_event_id: event.id,
            source_name: event.source_name,
            source_url: event.source_url,
            category: event.category,
            importance_score: event.importance_score,
            spike_count: event.spike_count,
            serp_credit_used: event.serp_credit_used,
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

      // Push to editor_queue
      await supabase.from("editor_queue").insert({
        article_id: savedArticle.id,
        editor_action: "news_review",
        status: "pending",
        quality_before: article.quality_score ?? 0,
      });

      // Advance event status
      await supabase
        .from("news_events")
        .update({
          status: "editing",
          editing_at: new Date().toISOString(),
          article_id: savedArticle.id,
        })
        .eq("id", event.id);

      logger.info(
        `[Pipeline] Written: "${savedArticle.title.substring(0, 60)}" (${wordCount}w, score:${article.quality_score})`,
      );
      count++;
    } catch (err: any) {
      logger.error(`[Pipeline] Writing failed for ${event.id}: ${err.message}`);
      await incrementRetry(supabase, event);
    }
  }
  return count;
}

// ── Stage: editing → publishing ───────────────────────────────────────────

export async function processEditing(
  supabase: SupabaseClient,
): Promise<number> {
  const { data: events } = await supabase
    .from("news_events")
    .select("id, article_id, retry_count, status")
    .eq("status", "editing")
    .not("article_id", "is", null)
    .limit(10);

  if (!events?.length) return 0;
  let count = 0;

  for (const event of events as any[]) {
    try {
      const { data: article } = await supabase
        .from("articles")
        .select("id, status, quality_score, title")
        .eq("id", event.article_id)
        .single();

      if (!article) continue;

      const qualityScore = article.quality_score ?? 0;

      if (qualityScore >= NEWS_QUALITY_GATE) {
        // Auto-approve: promote to review-ready
        await supabase
          .from("articles")
          .update({ status: "review-ready" })
          .eq("id", article.id);
        await supabase
          .from("news_events")
          .update({ status: "publishing" })
          .eq("id", event.id);
        logger.info(
          `[Pipeline] "${article.title?.substring(0, 50)}" approved (score:${qualityScore})`,
        );
      } else {
        await supabase
          .from("news_events")
          .update({
            status: "skipped",
            skip_reason: `Quality score ${qualityScore} below ${NEWS_QUALITY_GATE} threshold`,
          })
          .eq("id", event.id);
        logger.warn(
          `[Pipeline] Article ${article.id} rejected (score:${qualityScore})`,
        );
      }
      count++;
    } catch (err: any) {
      logger.error(
        `[Pipeline] Editing check failed for ${event.id}: ${err.message}`,
      );
    }
  }
  return count;
}

// ── Stage: publishing → published ─────────────────────────────────────────

export async function processPublishing(
  supabase: SupabaseClient,
): Promise<number> {
  const { data: events } = await supabase
    .from("news_events")
    .select("id, article_id, retry_count")
    .eq("status", "publishing")
    .not("article_id", "is", null)
    .limit(5);

  if (!events?.length) return 0;
  let count = 0;

  for (const event of events as any[]) {
    try {
      const { data: article } = await supabase
        .from("articles")
        .select("id, slug, title")
        .eq("id", event.article_id)
        .single();

      if (!article) continue;

      const now = new Date().toISOString();
      await supabase
        .from("articles")
        .update({
          status: "published",
          published_at: now,
        })
        .eq("id", article.id);

      await supabase
        .from("news_events")
        .update({
          status: "published",
          published_at: now,
        })
        .eq("id", event.id);

      // Non-blocking: ping IndexNow for fast Google indexing
      pingIndexNow(article.slug).catch(() => {});

      logger.info(
        `[Pipeline] Published: "${article.title?.substring(0, 60)}" (/articles/${article.slug})`,
      );
      count++;
    } catch (err: any) {
      logger.error(
        `[Pipeline] Publishing failed for ${event.id}: ${err.message}`,
      );
      await incrementRetry(supabase, {
        ...event,
        status: "publishing",
      } as NewsEvent);
    }
  }
  return count;
}

async function pingIndexNow(slug: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;
  const url = `https://www.investingpro.in/articles/${slug}`;
  await fetch(
    `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${key}`,
    { method: "GET", signal: AbortSignal.timeout(5_000) },
  );
}

// ── Main entry point ──────────────────────────────────────────────────────

export async function runFullPipeline(
  supabase: SupabaseClient,
): Promise<Record<string, number>> {
  // Run all stages concurrently — each stage filters by its own status
  const [detected, analyzing, writing, editing, publishing] = await Promise.all(
    [
      processDetected(supabase),
      processAnalyzing(supabase),
      processWriting(supabase),
      processEditing(supabase),
      processPublishing(supabase),
    ],
  );

  return { detected, analyzing, writing, editing, publishing };
}
