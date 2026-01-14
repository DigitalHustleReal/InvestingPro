/**
 * React Hook for Polling Job Status
 * 
 * Use this hook in your frontend components to track background job progress
 */

import { useState, useEffect, useCallback } from 'react';
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

interface UseJobStatusOptions {
    jobId: string | null;
    pollInterval?: number; // milliseconds, default 2000
    onComplete?: (result: any) => void;
    onError?: (error: string) => void;
    enabled?: boolean; // whether to start polling immediately
}

interface UseJobStatusReturn {
    status: JobStatus | null;
    data: JobStatusResponse | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    stopPolling: () => void;
}

/**
 * Hook to poll job status from the API
 */
export function useJobStatus(options: UseJobStatusOptions): UseJobStatusReturn {
    const {
        jobId,
        pollInterval = 2000,
        onComplete,
        onError,
        enabled = true
    } = options;

    const [status, setStatus] = useState<JobStatus | null>(null);
    const [data, setData] = useState<JobStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [polling, setPolling] = useState(false);

    const fetchStatus = useCallback(async () => {
        if (!jobId) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/jobs/${jobId}/status`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch job status: ${response.statusText}`);
            }

            const jobData: JobStatusResponse = await response.json();
            setData(jobData);
            setStatus(jobData.status);

            // Handle completion
            if (jobData.status === 'completed') {
                setPolling(false);
                if (onComplete && jobData.result) {
                    onComplete(jobData.result);
                }
            }

            // Handle failure
            if (jobData.status === 'failed') {
                setPolling(false);
                if (onError && jobData.error) {
                    onError(jobData.error);
                }
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            logger.error('Job status fetch error', err instanceof Error ? err : new Error(errorMessage));
            
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [jobId, onComplete, onError]);

    const stopPolling = useCallback(() => {
        setPolling(false);
    }, []);

    // Start polling when jobId is set and enabled
    useEffect(() => {
        if (!jobId || !enabled) {
            return;
        }

        // Initial fetch
        fetchStatus();

        // Start polling if not completed/failed
        if (status !== 'completed' && status !== 'failed') {
            setPolling(true);
        }

        // Polling interval
        const interval = setInterval(() => {
            if (polling && status !== 'completed' && status !== 'failed') {
                fetchStatus();
            }
        }, pollInterval);

        return () => {
            clearInterval(interval);
        };
    }, [jobId, enabled, polling, status, pollInterval, fetchStatus]);

    return {
        status,
        data,
        isLoading,
        error,
        refetch: fetchStatus,
        stopPolling
    };
}
