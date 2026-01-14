/**
 * Metrics Summary API
 * GET /api/metrics/summary
 * 
 * Returns high-level metrics summary for dashboards
 */

import { NextResponse } from 'next/server';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const GET = createAPIWrapper('/api/metrics/summary', {
  rateLimitType: 'authenticated',
  trackMetrics: false,
})(
  async () => {
    try {
      const summary = await metricsCollector.getSummary();
      return NextResponse.json({
        success: true,
        summary,
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
