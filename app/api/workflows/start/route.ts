/**
 * Start Workflow API
 * POST /api/workflows/start
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { workflowService } from '@/lib/workflows/workflow-service';
import { workflowRepository } from '@/lib/workflows/workflow-repository';
import { getWorkflowDefinition } from '@/lib/workflows/workflow-registry';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const startWorkflowSchema = z.object({
  workflowName: z.string().min(1),
  workflowVersion: z.string().optional(),
  context: z.record(z.any()).optional()
});

export const POST = createAPIWrapper('/api/workflows/start', {
  rateLimitType: 'authenticated',
  trackMetrics: true,
})(
  withValidation(startWorkflowSchema)(
    async (request: NextRequest, body: any) => {
      try {
        const { workflowName, workflowVersion, context } = body;

        // Try to get workflow definition from registry first
        let definition = getWorkflowDefinition(workflowName);

        // If not in registry, try database (for dynamically registered workflows)
        if (!definition) {
          definition = await workflowRepository.getDefinition(
            workflowName,
            workflowVersion
          );
        }

        if (!definition) {
          return NextResponse.json(
            { error: `Workflow definition not found: ${workflowName}` },
            { status: 404 }
          );
        }

        // Start workflow
        const instance = await workflowService.startWorkflow(definition, context || {});

        return NextResponse.json({
          success: true,
          instanceId: instance.id,
          state: instance.state,
          statusUrl: `/api/workflows/${instance.id}/status`
        });
      } catch (error) {
        logger.error('Workflow start error', error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    }
  )
);
