/**
 * Alerts API
 * GET /api/alerts
 * 
 * Returns active alerts and system health status
 */

import { NextResponse } from 'next/server';
import { alertManager } from '@/lib/monitoring/alert-manager';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const GET = createAPIWrapper('/api/alerts', {
  rateLimitType: 'authenticated',
  trackMetrics: false,
})(
  async () => {
    try {
      // Check for new alerts
      await alertManager.checkAlerts();
      
      // Clear old alerts
      alertManager.clearOldAlerts();

      const activeAlerts = alertManager.getActiveAlerts();
      const criticalAlerts = alertManager.getAlertsBySeverity('critical');
      const highAlerts = alertManager.getAlertsBySeverity('high');

      return NextResponse.json({
        success: true,
        alerts: {
          total: activeAlerts.length,
          critical: criticalAlerts.length,
          high: highAlerts.length,
          all: activeAlerts,
        },
        timestamp: new Date().toISOString(),
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
