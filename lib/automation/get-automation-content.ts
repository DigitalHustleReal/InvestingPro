/**
 * Automation Content Retrieval Utilities
 * 
 * Helper functions to easily retrieve content from automation systems
 */

import { createClient } from "@/lib/supabase/server";
import { rssImportService } from "@/lib/rss-import/RSSImportService";

export interface AutomationContentSummary {
  rssFeeds: {
    total: number;
    active: number;
    paused: number;
  };
  rssItems: {
    total: number;
    pending: number;
    processed: number;
    articleGenerated: number;
  };
  generatedArticles: {
    total: number;
    published: number;
    draft: number;
  };
  keywordResearch: {
    total: number;
    articlesWithKeywords: number;
  };
  generatedImages: {
    total: number;
    active: number;
  };
  pipelineRuns: {
    total: number;
    running: number;
    completed: number;
    failed: number;
  };
}

/**
 * Get comprehensive automation content summary
 */
export async function getAutomationSummary(): Promise<AutomationContentSummary> {
  const supabase = await createClient();

  // Get RSS feeds summary
  const { count: totalFeeds } = await supabase
    .from('rss_feeds')
    .select('*', { count: 'exact', head: true });

  const { count: activeFeeds } = await supabase
    .from('rss_feeds')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: pausedFeeds } = await supabase
    .from('rss_feeds')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'paused');

  // Get RSS items summary
  const { count: totalItems } = await supabase
    .from('rss_feed_items')
    .select('*', { count: 'exact', head: true });

  const { count: pendingItems } = await supabase
    .from('rss_feed_items')
    .select('*', { count: 'exact', head: true })
    .eq('processing_status', 'pending');

  const { count: processedItems } = await supabase
    .from('rss_feed_items')
    .select('*', { count: 'exact', head: true })
    .eq('processing_status', 'processed');

  const { count: articleGeneratedItems } = await supabase
    .from('rss_feed_items')
    .select('*', { count: 'exact', head: true })
    .eq('processing_status', 'article_generated');

  // Get generated articles summary
  const { count: totalGeneratedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('ai_generated', true);

  const { count: publishedGeneratedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('ai_generated', true)
    .eq('status', 'published');

  const { count: draftGeneratedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('ai_generated', true)
    .eq('status', 'draft');

  // Get keyword research summary
  const { count: totalKeywords } = await supabase
    .from('keyword_research')
    .select('*', { count: 'exact', head: true });

  const { data: articlesWithKeywords } = await supabase
    .from('keyword_research')
    .select('article_id')
    .not('article_id', 'is', null);

  // Get generated images summary
  const { count: totalImages } = await supabase
    .from('generated_images')
    .select('*', { count: 'exact', head: true });

  const { count: activeImages } = await supabase
    .from('generated_images')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Get pipeline runs summary
  const { count: totalRuns } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true });

  const { count: runningRuns } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'running');

  const { count: completedRuns } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { count: failedRuns } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed');

  return {
    rssFeeds: {
      total: totalFeeds || 0,
      active: activeFeeds || 0,
      paused: pausedFeeds || 0,
    },
    rssItems: {
      total: totalItems || 0,
      pending: pendingItems || 0,
      processed: processedItems || 0,
      articleGenerated: articleGeneratedItems || 0,
    },
    generatedArticles: {
      total: totalGeneratedArticles || 0,
      published: publishedGeneratedArticles || 0,
      draft: draftGeneratedArticles || 0,
    },
    keywordResearch: {
      total: totalKeywords || 0,
      articlesWithKeywords: new Set(articlesWithKeywords?.map(k => k.article_id) || []).size,
    },
    generatedImages: {
      total: totalImages || 0,
      active: activeImages || 0,
    },
    pipelineRuns: {
      total: totalRuns || 0,
      running: runningRuns || 0,
      completed: completedRuns || 0,
      failed: failedRuns || 0,
    },
  };
}

/**
 * Get all pending RSS items ready for processing
 */
export async function getPendingRSSItems(limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from('rss_feed_items')
    .select(`
      *,
      rss_feeds (
        id,
        name,
        url,
        auto_generate_articles
      )
    `)
    .eq('processing_status', 'pending')
    .order('imported_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch pending RSS items: ${error.message}`);
  }

  return data || [];
}

/**
 * Get articles generated from RSS feeds
 */
export async function getRSSGeneratedArticles(limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from('articles')
    .select(`
      *,
      rss_source:rss_feed_items!generated_article_id (
        id,
        title,
        original_url,
        feed_id,
        rss_feeds (
          name,
          url
        )
      )
    `)
    .not('rss_feed_items.generated_article_id', 'is', null)
    .eq('ai_generated', true)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch RSS-generated articles: ${error.message}`);
  }

  return data || [];
}

/**
 * Get keyword research data for an article
 */
export async function getArticleKeywords(articleId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('keyword_research')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch keywords: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all automation content for a specific article
 */
export async function getArticleAutomationData(articleId: string) {
  const supabase = await createClient();

  // Get all automation data in parallel
  const [keywords, images, graphics, repurposed, rssSource] = await Promise.all([
    supabase.from('keyword_research').select('*').eq('article_id', articleId),
    supabase.from('generated_images').select('*').eq('article_id', articleId).eq('is_active', true),
    supabase.from('generated_graphics').select('*').eq('article_id', articleId),
    supabase.from('repurposed_content').select('*').eq('source_article_id', articleId),
    supabase
      .from('rss_feed_items')
      .select('*, rss_feeds(*)')
      .eq('generated_article_id', articleId)
      .maybeSingle(),
  ]);

  return {
    keywords: keywords.data || [],
    images: images.data || [],
    graphics: graphics.data || [],
    repurposedContent: repurposed.data || [],
    rssSource: rssSource.data || null,
  };
}

/**
 * Get recent pipeline runs
 */
export async function getRecentPipelineRuns(limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pipeline_runs')
    .select('*')
    .order('triggered_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch pipeline runs: ${error.message}`);
  }

  return data || [];
}

/**
 * Get RSS feed with items and statistics
 */
export async function getRSSFeedWithStats(feedId: string) {
  const supabase = await createClient();

  // Get feed
  const feed = await rssImportService.getFeed(feedId);
  if (!feed) {
    throw new Error('Feed not found');
  }

  // Get items by status
  const [allItems, pendingItems, processedItems, generatedItems] = await Promise.all([
    supabase.from('rss_feed_items').select('*', { count: 'exact', head: true }).eq('feed_id', feedId),
    supabase.from('rss_feed_items').select('*', { count: 'exact', head: true }).eq('feed_id', feedId).eq('processing_status', 'pending'),
    supabase.from('rss_feed_items').select('*', { count: 'exact', head: true }).eq('feed_id', feedId).eq('processing_status', 'processed'),
    supabase.from('rss_feed_items').select('*', { count: 'exact', head: true }).eq('feed_id', feedId).eq('processing_status', 'article_generated'),
  ]);

  // Get recent import jobs
  const jobs = await rssImportService.getImportJobs(feedId);

  return {
    feed,
    statistics: {
      totalItems: allItems.count || 0,
      pendingItems: pendingItems.count || 0,
      processedItems: processedItems.count || 0,
      generatedArticles: generatedItems.count || 0,
    },
    recentJobs: jobs.slice(0, 5), // Last 5 jobs
  };
}

/**
 * Export all automation content for backup/analysis
 */
export async function exportAutomationContent() {
  const supabase = await createClient();

  const [
    feeds,
    items,
    articles,
    keywords,
    images,
    graphics,
    repurposed,
    runs,
  ] = await Promise.all([
    supabase.from('rss_feeds').select('*'),
    supabase.from('rss_feed_items').select('*'),
    supabase.from('articles').select('*').eq('ai_generated', true),
    supabase.from('keyword_research').select('*'),
    supabase.from('generated_images').select('*'),
    supabase.from('generated_graphics').select('*'),
    supabase.from('repurposed_content').select('*'),
    supabase.from('pipeline_runs').select('*'),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    feeds: feeds.data || [],
    items: items.data || [],
    articles: articles.data || [],
    keywords: keywords.data || [],
    images: images.data || [],
    graphics: graphics.data || [],
    repurposedContent: repurposed.data || [],
    pipelineRuns: runs.data || [],
  };
}



