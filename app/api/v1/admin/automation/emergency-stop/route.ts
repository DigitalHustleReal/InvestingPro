/**
 * Emergency Stop API
 * Phase 1: Critical Security & Stability
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiVersioning } from '@/lib/middleware/api-versioning';
import { emergencyStop } from '@/lib/automation/control-center';
import { logger } from '@/lib/logger';

export const POST = withApiVersioning(async (
    request: NextRequest,
    version: string
) => {
    try {
        await emergencyStop();
        
        logger.warn('Emergency stop executed', {
            user: request.headers.get('x-user-id'),
            ip: request.headers.get('x-forwarded-for')
        });
        
        return NextResponse.json({
            success: true,
            message: 'Emergency stop executed - all automation paused',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Failed to execute emergency stop', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            {
                error: {
                    code: 'EMERGENCY_STOP_ERROR',
                    message: 'Failed to execute emergency stop'
                }
            },
            { status: 500 }
        );
    }
});
