/**
 * Job Queue Utilities
 * 
 * Helper functions for working with the job queue from the frontend
 */

export interface QueueJobResponse {
    success: boolean;
    message: string;
    jobId: string;
    status: 'queued';
    statusUrl?: string;
}

/**
 * Queue an article generation job
 */
export async function queueArticleGeneration(params: {
    topic: string;
    category?: string;
    targetKeywords?: string[];
    targetAudience?: string;
    contentLength?: string;
    wordCount?: number;
    prompt?: string;
}): Promise<QueueJobResponse> {
    const response = await fetch('/api/articles/generate-comprehensive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Queue a bulk generation job
 */
export async function queueBulkGeneration(params: {
    topics: string[];
    options?: Record<string, any>;
}): Promise<QueueJobResponse> {
    const response = await fetch('/api/cms/bulk-generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string): Promise<{
    jobId: string;
    status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
    createdAt?: string;
    completedAt?: string;
    error?: string;
    result?: any;
}> {
    const response = await fetch(`/api/jobs/${jobId}/status`);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Poll job status until completion or failure
 */
export async function pollJobStatus(
    jobId: string,
    options: {
        interval?: number; // milliseconds, default 2000
        timeout?: number; // milliseconds, default 5 minutes
        onProgress?: (status: string) => void;
    } = {}
): Promise<any> {
    const { interval = 2000, timeout = 5 * 60 * 1000, onProgress } = options;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        const poll = async () => {
            // Check timeout
            if (Date.now() - startTime > timeout) {
                reject(new Error('Job polling timeout'));
                return;
            }

            try {
                const status = await getJobStatus(jobId);

                if (onProgress) {
                    onProgress(status.status);
                }

                if (status.status === 'completed') {
                    resolve(status.result);
                } else if (status.status === 'failed') {
                    reject(new Error(status.error || 'Job failed'));
                } else {
                    // Continue polling
                    setTimeout(poll, interval);
                }
            } catch (error) {
                reject(error);
            }
        };

        poll();
    });
}
