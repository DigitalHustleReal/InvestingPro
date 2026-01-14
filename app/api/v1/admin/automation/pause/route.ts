/**
 * Pause Automation API
 * Phase 1: Critical Security & Stability
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiVersioning } from '@/lib/middleware/api-versioning';
import { pauseAutomation } from '@/lib/automation/control-center';
import { logger } from '@/lib/logger';

export const POST = withApiVersioning(async (
    request: NextRequest,
    version: string
) => {
    try {
        await pauseAutomation();
        
        return NextResponse.json({
            success: true,
            message: 'Automation paused successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Failed to pause automation', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            {
                error: {
                    code: 'PAUSE_AUTOMATION_ERROR',
                    message: 'Failed to pause automation'
                }
            },
            { status: 500 }
        );
    }
});
