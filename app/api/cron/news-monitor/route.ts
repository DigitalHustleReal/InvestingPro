/**
 * News Monitor Cron
 *
 * Polls all active news sources, detects new items, creates news_events rows.
 * Schedule: every 15 min (GitHub Actions: .github/workflows/cron-news-monitor.yml)
 *
 * Auth: Bearer CRON_SECRET header (same as all other cron routes)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { pollAllSources, RawNewsItem } from '@/lib/news/source-poller';
import { classifyItem } from '@/lib/news/event-classifier';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Auth check — same pattern as all other cron routes
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn('[NewsMonitor] Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const startMs = Date.now();

    // 1. Poll all active sources
    const newItems = await pollAllSources(supabase);

    if (!newItems.length) {
      return NextResponse.json({
        success: true,
        newEvents: 0,
        message: 'No new items from any source',
        durationMs: Date.now() - startMs,
      });
    }

    // 2. Fetch source metadata for classification (batch lookup)
    const sourceIds = [...new Set(newItems.map((i) => i.source_id))];
    const { data: sources } = await supabase
      .from('news_sources')
      .select('id, name, category_tags, base_importance')
      .in('id', sourceIds);

    const sourceMap = Object.fromEntries((sources ?? []).map((s: any) => [s.id, s]));

    let created = 0;
    let skippedLowImportance = 0;
    let skippedDuplicate = 0;
    let failed = 0;

    // 3. Classify and insert each new item
    for (const item of newItems) {
      const source = sourceMap[item.source_id];
      if (!source) continue;

      try {
        const classified = classifyItem(item, source);

        // Skip very low-importance items from general sources
        if (classified.importance_score < 3) {
          skippedLowImportance++;
          continue;
        }

        const { error } = await supabase.from('news_events').insert({
          source_id: item.source_id,
          source_name: item.source_name,
          source_url: item.item_url || item.source_url,
          headline: item.headline,
          summary: item.summary,
          raw_content: item.raw_content,
          category: classified.category,
          importance_score: classified.importance_score,
          item_url: item.item_url,
          status: 'detected',
          detected_at: item.published_at,
        });

        if (error) {
          if (error.code === '23505') {
            // Unique constraint violation — duplicate within same day
            skippedDuplicate++;
          } else {
            logger.warn(`[NewsMonitor] Insert failed: ${error.message}`);
            failed++;
          }
        } else {
          created++;
          logger.info(
            `[NewsMonitor] ✓ "${item.headline.substring(0, 60)}" ` +
              `(cat:${classified.category}, importance:${classified.importance_score})`
          );
        }
      } catch (err: any) {
        logger.error(`[NewsMonitor] Item processing failed: ${err.message}`);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      polled: newItems.length,
      newEvents: created,
      skippedLowImportance,
      skippedDuplicate,
      failed,
      durationMs: Date.now() - startMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('[NewsMonitor] Cron failed:', error);
    return NextResponse.json(
      { error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
