/**
 * Acknowledge Alert API
 * POST /api/alerts/[id]/acknowledge
 * 
 * Acknowledges an alert
 */

import { NextRequest, NextResponse } from 'next/server';
import { alertManager } from '@/lib/monitoring/alert-manager';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const POST = createAPIWrapper('/api/alerts/[id]/acknowledge', {
  rateLimitType: 'authenticated',
  trackMetrics: false,
})(
  async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await props.params;
      const acknowledged = alertManager.acknowledgeAlert(id);

      if (!acknowledged) {
        return NextResponse.json(
          {
            success: false,
            error: 'Alert not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Alert acknowledged',
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
