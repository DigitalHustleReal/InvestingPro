/**
 * News Pipeline Cron
 *
 * Stateless stage advancer — runs 7 min after news-monitor to ensure fresh events
 * are available before pipeline processing begins.
 *
 * Schedule: 7,22,37,52 past each hour (GitHub Actions: cron-news-pipeline.yml)
 * Each run advances ALL eligible events by one stage (detected→screening→analyzing→writing→editing→publishing→published)
 *
 * Auth: Bearer CRON_SECRET header
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { runFullPipeline } from '@/lib/news/pipeline-runner';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    logger.warn('[NewsPipeline] Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const startMs = Date.now();
    const results = await runFullPipeline(supabase);
    const totalAdvanced = Object.values(results).reduce((a, b) => a + b, 0);

    logger.info(`[NewsPipeline] Run complete in ${Date.now() - startMs}ms: ${JSON.stringify(results)}`);

    return NextResponse.json({
      success: true,
      stages: results,
      totalAdvanced,
      durationMs: Date.now() - startMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('[NewsPipeline] Cron failed:', error);
    return NextResponse.json(
      { error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
