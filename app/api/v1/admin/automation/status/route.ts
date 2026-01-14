/**
 * Automation Status API
 * Phase 1: Critical Security & Stability
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiVersioning } from '@/lib/middleware/api-versioning';
import { getAutomationStatus, getWorkflowStatuses } from '@/lib/automation/control-center';
import { logger } from '@/lib/logger';

export const GET = withApiVersioning(async (
    request: NextRequest,
    version: string
) => {
    try {
        const status = await getAutomationStatus();
        const workflows = await getWorkflowStatuses(50);
        
        return NextResponse.json({
            status,
            workflows,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Failed to get automation status', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            {
                error: {
                    code: 'AUTOMATION_STATUS_ERROR',
                    message: 'Failed to get automation status'
                }
            },
            { status: 500 }
        );
    }
});
