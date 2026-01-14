/**
 * Performance Metrics API
 * 
 * Endpoint to receive and store performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { withTracing } from '@/lib/middleware/tracing';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { getBudgetViolations, PERFORMANCE_BUDGETS } from '@/lib/performance/budgets';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PerformanceMetric {
    name: string;
    value: number;
    unit: 'bytes' | 'ms' | 'score';
    timestamp: number;
}

export const POST = withErrorHandler(
    withTracing(async (request: NextRequest) => {
        const body = await request.json();
        const { metrics } = body as { metrics: PerformanceMetric[] };

        if (!Array.isArray(metrics) || metrics.length === 0) {
            return NextResponse.json(
                { error: { code: 'VALIDATION_ERROR', message: 'Metrics array required' } },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Convert metrics to format for storage
        const metricsToStore = metrics.map(metric => ({
            name: metric.name,
            value: metric.value,
            unit: metric.unit,
            timestamp: new Date(metric.timestamp).toISOString(),
            user_agent: request.headers.get('user-agent') || '',
            url: request.headers.get('referer') || '',
        }));

        // Check for budget violations
        const metricsMap: Record<string, number> = {};
        metrics.forEach(metric => {
            metricsMap[metric.name] = metric.value;
        });

        const violations = getBudgetViolations(metricsMap, PERFORMANCE_BUDGETS);
        
        if (violations.length > 0) {
            logger.warn('Performance budget violations detected', {
                violations: violations.map(v => v.message),
            });

            // Store violations for alerting
            for (const violation of violations) {
                if (violation.budget.severity === 'error') {
                    // Could trigger alert here
                    logger.error('Performance budget exceeded', {
                        budget: violation.budget.name,
                        actual: violation.actual,
                        threshold: violation.budget.threshold,
                    });
                }
            }
        }

        // Store metrics (if you have a performance_metrics table)
        // For now, just log them
        logger.info('Performance metrics received', {
            count: metrics.length,
            violations: violations.length,
        });

        return NextResponse.json({
            success: true,
            received: metrics.length,
            violations: violations.length,
        });
    }, 'performance-metrics')
);
