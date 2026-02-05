/**
 * State Transition API
 * POST /api/workflows/state/transition
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { workflowService } from '@/lib/workflows/workflow-service';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const stateTransitionSchema = z.object({
  entityType: z.enum(['article', 'workflow']),
  entityId: z.string().uuid(),
  from: z.string(),
  to: z.string(),
  action: z.string(),
  metadata: z.record(z.string(), z.any()).optional()
});

export const POST = createAPIWrapper('/api/workflows/state/transition', {
  rateLimitType: 'authenticated',
  trackMetrics: true,
})(
  withValidation(stateTransitionSchema, undefined)(
    async (request: NextRequest, body: any, _query: unknown) => {
      try {
        const { entityType, entityId, from, to, action, metadata } = body;

        // Execute state transition
        await workflowService.transitionContentState(
          entityType,
          entityId,
          from as any,
          to as any,
          action,
          undefined, // userId would come from auth
          metadata
        );

        return NextResponse.json({
          success: true,
          message: `State transitioned from ${from} to ${to}`
        });
      } catch (error) {
        logger.error('State transition error', error instanceof Error ? error : new Error(String(error)));
        
        if (error instanceof Error && error.message.includes('Invalid state transition')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
        
        throw error;
      }
    }
  )
);
