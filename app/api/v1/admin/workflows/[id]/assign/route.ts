/**
 * Assign Workflow API
 * Phase 1: Critical Security & Stability
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiVersioning } from '@/lib/middleware/api-versioning';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export const POST = withApiVersioning(async (
    request: NextRequest,
    version: string,
    { params }: { params: { id: string } }
) => {
    try {
        const { assignee_id } = await request.json();
        
        if (!assignee_id) {
            return NextResponse.json(
                {
                    error: {
                        code: 'MISSING_ASSIGNEE',
                        message: 'assignee_id is required'
                    }
                },
                { status: 400 }
            );
        }
        
        const supabase = await createClient();
        
        // Call the assign_workflow function
        const { data, error } = await supabase.rpc('assign_workflow', {
            workflow_instance_id: params.id,
            assignee_id
        });
        
        if (error) throw error;
        
        return NextResponse.json({
            success: true,
            message: 'Workflow assigned successfully',
            workflow_id: params.id,
            assignee_id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Failed to assign workflow', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            {
                error: {
                    code: 'ASSIGN_WORKFLOW_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to assign workflow'
                }
            },
            { status: 500 }
        );
    }
});
