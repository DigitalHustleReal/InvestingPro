/**
 * Cleanup Cron Job
 * 
 * Runs weekly on Sunday at 3 AM IST
 * Cleans up old drafts, orphaned media, and stale data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import redisService from '@/lib/cache/redis-service';

export async function GET(request: NextRequest) {
  const results: Record<string, any> = {};

  try {
    const supabase = await createClient();

    // 1. Delete very old drafts (older than 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { count: deletedDrafts } = await supabase
      .from('articles')
      .delete()
      .eq('status', 'draft')
      .lt('updated_at', ninetyDaysAgo.toISOString())
      .select('*', { count: 'exact', head: true });

    results.oldDraftsDeleted = deletedDrafts || 0;

    // 2. Clear stale cache entries
    if (redisService.isConfigured) {
      const clearedKeys = await redisService.invalidatePattern('cache:stale:*');
      results.cacheEntriesCleared = clearedKeys;
    }

    // 3. Log cleanup summary
    console.log('[CRON] Cleanup completed:', results);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cleanup: results,
    });
  } catch (error) {
    console.error('[CRON] Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}
