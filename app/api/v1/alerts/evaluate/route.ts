/**
 * Alert Evaluation API
 * POST /api/v1/alerts/evaluate
 * 
 * Evaluates all alert rules and triggers notifications if conditions are met
 * 
 * Protected by ALERT_EVALUATION_TOKEN (for cron jobs)
 */

import { NextRequest, NextResponse } from 'next/server';
import { alertManager } from '@/lib/alerts/alert-manager';
import { getEnabledAlertRules } from '@/lib/alerts/rules';
import { logger } from '@/lib/logger';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const POST = createAPIWrapper('/api/v1/alerts/evaluate', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
})(
    async (req: NextRequest) => {
        // Check authorization token (for cron jobs)
        const authHeader = req.headers.get('authorization');
        const expectedToken = process.env.ALERT_EVALUATION_TOKEN;
        
        if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        try {
            const rules = getEnabledAlertRules();
            const triggeredAlerts: string[] = [];

            // Evaluate each rule
            for (const rule of rules) {
                try {
                    const triggered = await alertManager.evaluateRule(rule);
                    if (triggered) {
                        triggeredAlerts.push(rule.id);
                    }
                } catch (error) {
                    logger.error('Failed to evaluate alert rule', error as Error, {
                        ruleId: rule.id,
                    });
                }
            }

            const activeAlerts = alertManager.getActiveAlerts();

            return NextResponse.json({
                success: true,
                evaluated: rules.length,
                triggered: triggeredAlerts.length,
                triggeredRules: triggeredAlerts,
                activeAlerts: activeAlerts.length,
                alerts: activeAlerts.map(alert => ({
                    id: alert.id,
                    ruleId: alert.ruleId,
                    severity: alert.severity,
                    message: alert.message,
                    timestamp: alert.timestamp.toISOString(),
                    resolved: alert.resolved,
                })),
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            logger.error('Failed to evaluate alerts', error as Error);
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

/**
 * GET /api/v1/alerts/evaluate
 * Returns current alert status without triggering evaluation
 */
export const GET = createAPIWrapper('/api/v1/alerts/evaluate', {
    rateLimitType: 'authenticated',
    trackMetrics: false,
})(
    async () => {
        try {
            const activeAlerts = alertManager.getActiveAlerts();
            const rules = getEnabledAlertRules();

            return NextResponse.json({
                success: true,
                activeAlerts: activeAlerts.length,
                enabledRules: rules.length,
                alerts: activeAlerts.map(alert => ({
                    id: alert.id,
                    ruleId: alert.ruleId,
                    severity: alert.severity,
                    message: alert.message,
                    timestamp: alert.timestamp.toISOString(),
                    resolved: alert.resolved,
                })),
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            logger.error('Failed to get alerts', error as Error);
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
