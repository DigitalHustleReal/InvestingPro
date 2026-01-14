/**
 * Workflow Debug API
 * GET /api/workflows/:id/debug
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { workflowMonitor } from '@/lib/workflows/workflow-monitor';
import { logger } from '@/lib/logger';

export const GET = createAPIWrapper('/api/workflows/[id]/debug', {
  rateLimitType: 'authenticated',
  trackMetrics: true,
})(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      const debugInfo = await workflowMonitor.debugWorkflow(id);

      if (!debugInfo.instance) {
        return NextResponse.json(
          { error: 'Workflow instance not found' },
          { status: 404 }
        );
      }

      const summary = await workflowMonitor.getExecutionSummary(id);

      return NextResponse.json({
        success: true,
        debug: debugInfo,
        summary
      });
    } catch (error) {
      logger.error('Workflow debug error', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
);
