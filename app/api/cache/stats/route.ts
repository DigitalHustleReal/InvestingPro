/**
 * Cache Statistics API
 * GET /api/cache/stats
 * 
 * Returns cache hit rate and performance metrics
 */

import { NextResponse } from 'next/server';
import { cacheMonitor } from '@/lib/cache/cache-monitor';
import { cacheService } from '@/lib/cache/cache-service';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const GET = createAPIWrapper('/api/cache/stats', {
  rateLimitType: 'authenticated',
  trackMetrics: false,
})(
  async () => {
    try {
      const cacheStats = await cacheService.getStats();
      const monitorMetrics = cacheMonitor.getAllMetrics();

      return NextResponse.json({
        success: true,
        cache: {
          enabled: cacheStats.enabled,
          keys: cacheStats.keys,
        },
        metrics: monitorMetrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  }
);
