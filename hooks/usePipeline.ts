import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook for managing pipeline operations
 */
export function usePipeline() {
    const queryClient = useQueryClient();
    const [isTriggering, setIsTriggering] = useState<string | null>(null);

    /**
     * Trigger a pipeline run
     */
    const triggerPipeline = async (type: string, params: any = {}) => {
        setIsTriggering(type);
        try {
            const response = await fetch('/api/pipeline/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    pipeline_type: type, 
                    status: 'pending',
                    ...params 
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to trigger pipeline');
            }

            const data = await response.json();
            
            // Fire-and-forget: Trigger background processing immediately
            // This simulates a worker picking up the task without delaying the UI
            fetch('/api/cron/process-pipeline', {
                method: 'POST',
                headers: { 'x-internal-trigger': 'true' }
            }).catch(e => console.error('Background kickoff failed', e));

            queryClient.invalidateQueries({ queryKey: ['pipeline-runs'] });
            queryClient.invalidateQueries({ queryKey: ['pipeline-status'] });
            
            return data;
        } catch (error: any) {
            console.error('Pipeline error:', error);
            // We keep the error toast here as a safety net, or let the caller handle it.
            // But since handleTriggerPipeline uses toast.promise, let's keep it clean.
            throw error;
        } finally {
            setIsTriggering(null);
        }
    };

    return {
        triggerPipeline,
        isTriggering
    };
}
