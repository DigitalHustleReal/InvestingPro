/**
 * Resume Workflow API
 * POST /api/workflows/[id]/resume
 * 
 * Resumes a paused workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowService } from '@/lib/workflows/workflow-service';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { z } from 'zod';

const resumeSchema = z.object({
  stepResult: z.any().optional(),
});

export const POST = createAPIWrapper('/api/workflows/[id]/resume', {
  rateLimitType: 'authenticated',
  trackMetrics: true,
})(
  withValidation(resumeSchema)(
    async (
      request: NextRequest,
      body: z.infer<typeof resumeSchema> | undefined,
      query: unknown,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      try {
        const { id } = await params;
        const instance = await workflowService.resumePausedWorkflow(id, body?.stepResult);

        return NextResponse.json({
          success: true,
          instance,
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
  )
);
