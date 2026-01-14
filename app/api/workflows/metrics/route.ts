/**
 * Workflow Metrics API
 * GET /api/workflows/metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { workflowMonitor } from '@/lib/workflows/workflow-monitor';
import { logger } from '@/lib/logger';

export const GET = createAPIWrapper('/api/workflows/metrics', {
  rateLimitType: 'authenticated',
  trackMetrics: true,
})(
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const workflowId = searchParams.get('workflowId');
      const startDate = searchParams.get('start');
      const endDate = searchParams.get('end');

      const timeRange = startDate && endDate
        ? { start: startDate, end: endDate }
        : undefined;

      const metrics = await workflowMonitor.getMetrics(workflowId || undefined, timeRange);

      return NextResponse.json({
        success: true,
        metrics
      });
    } catch (error) {
      logger.error('Workflow metrics error', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
);
