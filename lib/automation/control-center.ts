/**
 * Automation Control Center
 * Phase 1: Critical Security & Stability
 * 
 * Centralized control for all automation workflows
 */

import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export interface AutomationStatus {
    isRunning: boolean;
    isPaused: boolean;
    runningWorkflows: number;
    failedWorkflows: number;
    stuckWorkflows: number;
    lastCycleTime?: string;
    nextCycleTime?: string;
}

export interface WorkflowStatus {
    id: string;
    workflowId: string;
    state: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
    startedAt: string;
    currentStep?: string;
    error?: string;
    duration?: number;
    isStuck: boolean;
}

/**
 * Get automation status
 */
export async function getAutomationStatus(): Promise<AutomationStatus> {
    const supabase = await createClient();
    
    try {
        // Get running workflows
        const { data: runningWorkflows } = await supabase
            .from('workflow_instances')
            .select('id, state, started_at')
            .in('state', ['running', 'pending'])
            .order('started_at', { ascending: false });
        
        // Get failed workflows (last 24 hours)
        const { data: failedWorkflows } = await supabase
            .from('workflow_instances')
            .select('id')
            .eq('state', 'failed')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
        // Identify stuck workflows (running > 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { data: stuckWorkflows } = await supabase
            .from('workflow_instances')
            .select('id')
            .eq('state', 'running')
            .lt('started_at', oneHourAgo);
        
        // Check if automation is paused (from system settings)
        const { data: settings } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'automation_paused')
            .single();
        
        const isPaused = settings?.value === 'true';
        
        return {
            isRunning: (runningWorkflows?.length || 0) > 0 && !isPaused,
            isPaused,
            runningWorkflows: runningWorkflows?.length || 0,
            failedWorkflows: failedWorkflows?.length || 0,
            stuckWorkflows: stuckWorkflows?.length || 0
        };
    } catch (error) {
        logger.error('Failed to get automation status', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}

/**
 * Get all workflow statuses
 */
export async function getWorkflowStatuses(limit: number = 50): Promise<WorkflowStatus[]> {
    const supabase = await createClient();
    
    try {
        const { data: workflows, error } = await supabase
            .from('workflow_instances')
            .select('id, workflow_id, state, started_at, current_step, error, completed_at')
            .order('started_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        return (workflows || []).map(wf => {
            const startedAt = new Date(wf.started_at);
            const duration = wf.completed_at 
                ? new Date(wf.completed_at).getTime() - startedAt.getTime()
                : Date.now() - startedAt.getTime();
            
            return {
                id: wf.id,
                workflowId: wf.workflow_id,
                state: wf.state as WorkflowStatus['state'],
                startedAt: wf.started_at,
                currentStep: wf.current_step || undefined,
                error: wf.error || undefined,
                duration: duration > 0 ? duration : undefined,
                isStuck: wf.state === 'running' && startedAt < oneHourAgo
            };
        });
    } catch (error) {
        logger.error('Failed to get workflow statuses', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}

/**
 * Pause all automation
 */
export async function pauseAutomation(): Promise<void> {
    const supabase = await createClient();
    
    try {
        // Set automation_paused flag
        const { error } = await supabase
            .from('system_settings')
            .upsert({
                key: 'automation_paused',
                value: 'true',
                updated_at: new Date().toISOString()
            });
        
        if (error) throw error;
        
        logger.info('Automation paused');
    } catch (error) {
        logger.error('Failed to pause automation', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}

/**
 * Resume automation
 */
export async function resumeAutomation(): Promise<void> {
    const supabase = await createClient();
    
    try {
        // Remove automation_paused flag
        const { error } = await supabase
            .from('system_settings')
            .update({ value: 'false' })
            .eq('key', 'automation_paused');
        
        if (error) throw error;
        
        logger.info('Automation resumed');
    } catch (error) {
        logger.error('Failed to resume automation', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}

/**
 * Emergency stop - pause automation and cancel running workflows
 */
export async function emergencyStop(): Promise<void> {
    const supabase = await createClient();
    
    try {
        // Pause automation
        await pauseAutomation();
        
        // Mark all running workflows as paused
        const { error } = await supabase
            .from('workflow_instances')
            .update({ state: 'paused' })
            .in('state', ['running', 'pending']);
        
        if (error) throw error;
        
        logger.warn('Emergency stop executed - all automation paused');
    } catch (error) {
        logger.error('Failed to execute emergency stop', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}

/**
 * Get automation metrics
 */
export async function getAutomationMetrics(days: number = 7) {
    const supabase = await createClient();
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    try {
        const { data: workflows } = await supabase
            .from('workflow_instances')
            .select('state, started_at, completed_at')
            .gte('started_at', startDate);
        
        const total = workflows?.length || 0;
        const completed = workflows?.filter(w => w.state === 'completed').length || 0;
        const failed = workflows?.filter(w => w.state === 'failed').length || 0;
        const successRate = total > 0 ? (completed / total) * 100 : 0;
        
        // Calculate average duration
        const completedWorkflows = workflows?.filter(w => w.state === 'completed' && w.completed_at) || [];
        const avgDuration = completedWorkflows.length > 0
            ? completedWorkflows.reduce((sum, w) => {
                const duration = new Date(w.completed_at!).getTime() - new Date(w.started_at).getTime();
                return sum + duration;
            }, 0) / completedWorkflows.length
            : 0;
        
        return {
            total,
            completed,
            failed,
            successRate: Math.round(successRate * 100) / 100,
            avgDurationMs: Math.round(avgDuration),
            avgDurationSeconds: Math.round(avgDuration / 1000)
        };
    } catch (error) {
        logger.error('Failed to get automation metrics', error instanceof Error ? error : new Error(String(error)));
        throw error;
    }
}
