/**
 * Resume Automation API
 * Phase 1: Critical Security & Stability
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiVersioning } from '@/lib/middleware/api-versioning';
import { resumeAutomation } from '@/lib/automation/control-center';
import { logger } from '@/lib/logger';

export const POST = withApiVersioning(async (
    request: NextRequest,
    version: string
) => {
    try {
        await resumeAutomation();
        
        return NextResponse.json({
            success: true,
            message: 'Automation resumed successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Failed to resume automation', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            {
                error: {
                    code: 'RESUME_AUTOMATION_ERROR',
                    message: 'Failed to resume automation'
                }
            },
            { status: 500 }
        );
    }
});
