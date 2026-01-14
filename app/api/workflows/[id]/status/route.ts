/**
 * Get Workflow Status API
 * GET /api/workflows/:id/status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { workflowService } from '@/lib/workflows/workflow-service';
import { logger } from '@/lib/logger';

export const GET = createAPIWrapper('/api/workflows/[id]/status', {
  rateLimitType: 'authenticated',
  trackMetrics: true,
})(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const { id } = await params;

      // Get workflow instance
      const instance = await workflowService.getInstanceStatus(id);

      if (!instance) {
        return NextResponse.json(
          { error: 'Workflow instance not found' },
          { status: 404 }
        );
      }

      // Get execution history
      const history = await workflowService.getExecutionHistory(id);

      return NextResponse.json({
        success: true,
        instance: {
          id: instance.id,
          workflowId: instance.workflowId,
          state: instance.state,
          currentStep: instance.currentStep,
          completedSteps: instance.completedSteps,
          failedSteps: instance.failedSteps,
          startedAt: instance.startedAt,
          completedAt: instance.completedAt,
          error: instance.error
        },
        history: history.map(h => ({
          stepId: h.stepId,
          state: h.state,
          duration: h.duration,
          error: h.error,
          timestamp: h.timestamp
        }))
      });
    } catch (error) {
      logger.error('Workflow status error', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
);
