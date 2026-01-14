/**
 * Alert Evaluation Endpoint
 * Evaluates all alert rules and triggers notifications if conditions are met
 * 
 * This endpoint should be called periodically (e.g., via cron job)
 */

import { NextRequest, NextResponse } from 'next/server';
import { alertManager } from '@/lib/alerts/alert-manager';
import { getEnabledAlertRules } from '@/lib/alerts/rules';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        // Verify authorization (optional - add API key check)
        const authHeader = request.headers.get('authorization');
        const expectedToken = process.env.ALERT_EVALUATION_TOKEN;
        
        if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const rules = getEnabledAlertRules();
        const results = [];

        for (const rule of rules) {
            try {
                const triggered = await alertManager.evaluateRule(rule);
                results.push({
                    ruleId: rule.id,
                    ruleName: rule.name,
                    triggered,
                });
            } catch (error) {
                logger.error('Failed to evaluate alert rule', error as Error, {
                    ruleId: rule.id,
                });
                results.push({
                    ruleId: rule.id,
                    ruleName: rule.name,
                    triggered: false,
                    error: (error as Error).message,
                });
            }
        }

        return NextResponse.json({
            success: true,
            evaluated: rules.length,
            triggered: results.filter(r => r.triggered).length,
            results,
        });
    } catch (error) {
        logger.error('Alert evaluation failed', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to check alert status
export async function GET() {
    const activeAlerts = alertManager.getActiveAlerts();
    
    return NextResponse.json({
        activeAlerts: activeAlerts.length,
        alerts: activeAlerts,
    });
}
