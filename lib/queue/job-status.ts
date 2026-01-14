/**
 * Job Status Tracking Utilities
 * 
 * Helper functions for tracking and querying job status in Inngest
 */

import { logger } from '@/lib/logger';

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface JobStatusResponse {
    jobId: string;
    status: JobStatus;
    createdAt?: string;
    completedAt?: string;
    error?: string;
    result?: any;
}

/**
 * Get job status from Inngest or database
 * 
 * First tries to get from database (if job_status table exists),
 * otherwise falls back to placeholder
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
    logger.debug('Getting job status', { jobId });
    
    // Try to get from database first (if job_status table exists)
    try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from('job_status')
            .select('*')
            .eq('job_id', jobId)
            .single();
        
        if (data && !error) {
            return {
                jobId: data.job_id,
                status: data.status as JobStatus,
                createdAt: data.created_at,
                completedAt: data.completed_at,
                error: data.error || undefined,
                result: data.result || undefined
            };
        }
    } catch (error) {
        // Table might not exist yet, that's okay
        logger.debug('Job status table not available, using placeholder', { jobId });
    }
    
    // Fallback: Return placeholder
    // TODO: Implement Inngest API query if needed
    // Option: Query Inngest API (requires API key)
    // const response = await fetch(`https://api.inngest.com/v1/events/${jobId}`, {
    //     headers: {
    //         'Authorization': `Bearer ${process.env.INNGEST_API_KEY}`
    //     }
    // });
    
    return {
        jobId,
        status: 'queued', // Placeholder - will be updated when job_status table is populated
    };
}

/**
 * Store job status in database
 * 
 * Useful for tracking job progress without relying on Inngest API
 */
export async function storeJobStatus(
    jobId: string,
    status: JobStatus,
    metadata?: Record<string, any>,
    jobType?: string,
    result?: any,
    error?: string
): Promise<void> {
    logger.debug('Storing job status', { jobId, status, metadata, jobType });
    
    try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = createClient();
        
        const { error: dbError } = await supabase
            .from('job_status')
            .upsert({
                job_id: jobId,
                status,
                job_type: jobType,
                metadata: metadata || null,
                result: result || null,
                error: error || null,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'job_id'
            });
        
        if (dbError) {
            // Table might not exist yet, that's okay
            logger.debug('Failed to store job status (table may not exist)', { 
                jobId, 
                error: dbError.message 
            });
        }
    } catch (error) {
        // Table might not exist yet, that's okay
        logger.debug('Job status table not available', { 
            jobId, 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
}

/**
 * Create a job status endpoint handler
 * 
 * Use this in your API routes to provide job status
 */
export function createJobStatusHandler() {
    return async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
        const { id } = await params;
        const status = await getJobStatus(id);
        return Response.json(status);
    };
}
