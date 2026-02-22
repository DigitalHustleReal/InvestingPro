/**
 * Cron: Check Data Freshness
 * GET /api/cron/check-data-freshness
 *
 * Runs every hour (configure in vercel.json crons).
 * Checks whether financial product data is stale (not updated within its
 * allowed window) and fires alerts via alertManager when stale data is found.
 *
 * Secured by CRON_SECRET — same pattern as all other cron routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkDataFreshness } from '@/lib/monitoring/data-freshness';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime  = 'nodejs';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    logger.info('cron/check-data-freshness: starting');

    const report = await checkDataFreshness();

    logger.info('cron/check-data-freshness: complete', {
      healthy:         report.healthy,
      staleTableCount: report.staleTableCount,
      checkedAt:       report.checkedAt,
    });

    return NextResponse.json({
      success:         true,
      healthy:         report.healthy,
      checkedAt:       report.checkedAt,
      staleTableCount: report.staleTableCount,
      results:         report.results.map(r => ({
        table:            r.table,
        thresholdMinutes: r.thresholdMinutes,
        staleCount:       r.staleCount,
        oldestUpdatedAt:  r.oldestUpdatedAt,
        stale:            r.stale,
      })),
    }, {
      status: report.healthy ? 200 : 207, // 207 = partial — some tables stale
    });
  } catch (error) {
    logger.error('cron/check-data-freshness: unhandled error', error as Error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
