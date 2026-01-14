/**
 * Application Metrics API
 * GET /api/metrics
 * 
 * Returns comprehensive application metrics
 */

import { NextResponse } from 'next/server';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const GET = createAPIWrapper('/api/metrics', {
  rateLimitType: 'authenticated',
  trackMetrics: false, // Don't track metrics for metrics endpoint
})(
  async () => {
    try {
      const metrics = await metricsCollector.getMetrics();
      return NextResponse.json({
        success: true,
        metrics,
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
