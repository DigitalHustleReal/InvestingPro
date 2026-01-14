/**
 * Schedule Workflow API
 * POST /api/workflows/schedule
 * 
 * Schedules a workflow to run at a specific time
 */

import { NextRequest, NextResponse } from 'next/server';
import { workflowService } from '@/lib/workflows/workflow-service';
import { workflowRegistry } from '@/lib/workflows/workflow-registry';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { z } from 'zod';

const scheduleSchema = z.object({
  workflowId: z.string(),
  context: z.record(z.any()).optional(),
  scheduleAt: z.string().datetime().optional(),
  scheduleIn: z.number().optional(), // milliseconds
  cron: z.string().optional(),
  timezone: z.string().optional(),
});

export const POST = createAPIWrapper('/api/workflows/schedule', {
  rateLimitType: 'authenticated',
  trackMetrics: true,
})(
  withValidation(scheduleSchema)(
    async (request: NextRequest, body: z.infer<typeof scheduleSchema> | undefined) => {
      if (!body) {
        return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
      }
      try {
        // Get workflow definition
        const definition = getWorkflowDefinition(body.workflowId);
        if (!definition) {
          return NextResponse.json(
            {
              success: false,
              error: `Workflow not found: ${body.workflowId}`,
            },
            { status: 404 }
          );
        }

        // Build schedule config
        const scheduleConfig: {
          scheduleAt?: Date;
          scheduleIn?: number;
          cron?: string;
          timezone?: string;
        } = {};

        if (body.scheduleAt) {
          scheduleConfig.scheduleAt = new Date(body.scheduleAt);
        }
        if (body.scheduleIn) {
          scheduleConfig.scheduleIn = body.scheduleIn;
        }
        if (body.cron) {
          scheduleConfig.cron = body.cron;
        }
        if (body.timezone) {
          scheduleConfig.timezone = body.timezone;
        }

        // Schedule workflow
        const scheduled = await workflowService.scheduleWorkflow(
          definition,
          body.context || {},
          scheduleConfig
        );

        return NextResponse.json({
          success: true,
          scheduled,
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
