import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';

export type PipelineStatus = 'triggered' | 'running' | 'completed' | 'failed' | 'cancelled';

export class PipelineLogger {
    private supabase;
    private runId: string | null = null;
    private pipelineType: string;

    constructor(pipelineType: string) {
        this.pipelineType = pipelineType;
        this.supabase = createServiceClient();
    }

    /**
     * Start a new pipeline run
     */
    async start(params: any = {}): Promise<string> {
        try {
            const { data, error } = await this.supabase
                .from('pipeline_runs')
                .insert({
                    pipeline_type: this.pipelineType,
                    status: 'running',
                    params,
                    started_at: new Date().toISOString()
                })
                .select('id')
                .single();

            if (error) throw error;
            
            this.runId = data.id as string;
            logger.info(`Pipeline ${this.pipelineType} started`, { runId: this.runId });
            return this.runId;
        } catch (error) {
            logger.error('Failed to start pipeline log', error as Error);
            // Fallback: Generate a local ID so automation doesn't crash, but logging won't work
            this.runId = crypto.randomUUID(); 
            return this.runId;
        }
    }

    /**
     * Log success with results
     */
    async complete(result: any) {
        if (!this.runId) return;

        try {
            await this.supabase
                .from('pipeline_runs')
                .update({
                    status: 'completed',
                    result,
                    completed_at: new Date().toISOString()
                })
                .eq('id', this.runId);
            
            logger.info(`Pipeline ${this.pipelineType} completed`, { runId: this.runId });
        } catch (error) {
            logger.error('Failed to complete pipeline log', error as Error);
        }
    }

    /**
     * Log failure
     */
    async fail(error: Error) {
        if (!this.runId) return;

        try {
            await this.supabase
                .from('pipeline_runs')
                .update({
                    status: 'failed',
                    error_message: error.message,
                    error_stack: error.stack,
                    completed_at: new Date().toISOString()
                })
                .eq('id', this.runId);
                
            logger.error(`Pipeline ${this.pipelineType} failed`, error, { runId: this.runId });
        } catch (logError) {
            logger.error('Failed to log pipeline failure', logError as Error);
        }
    }
}
