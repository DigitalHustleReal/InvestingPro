/**
 * Health Monitor Agent
 * 
 * Monitors system health:
 * - Agent execution success rates
 * - Budget status
 * - API provider health
 * - Error rates
 * - Performance metrics
 */

import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { BudgetGovernorAgent } from './budget-governor-agent';
import { logger } from '@/lib/logger';

export interface SystemHealth {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    agents: {
        name: string;
        successRate: number;
        avgExecutionTime: number;
        lastExecution?: Date;
        status: 'healthy' | 'degraded' | 'unhealthy';
    }[];
    budget: {
        status: 'ok' | 'warning' | 'critical';
        tokensRemaining: number;
        costRemaining: number;
        isPaused: boolean;
    };
    apiProviders: {
        provider: string;
        status: 'available' | 'degraded' | 'unavailable';
        lastCheck: Date;
    }[];
    errors: {
        count: number;
        recent: Array<{
            agent: string;
            error: string;
            timestamp: Date;
        }>;
    };
}

export class HealthMonitorAgent extends BaseAgent {
    private budgetAgent: BudgetGovernorAgent;
    
    constructor() {
        super('HealthMonitorAgent');
        this.budgetAgent = new BudgetGovernorAgent();
    }
    
    /**
     * Get overall system health
     */
    async getSystemHealth(): Promise<SystemHealth> {
        try {
            // Get agent execution stats (last 24 hours)
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
            
            const { data: executions } = await this.supabase
                .from('agent_executions')
                .select('agent_name, success, execution_time_ms, created_at')
                .gte('created_at', twentyFourHoursAgo.toISOString());
            
            // Calculate agent health
            const agentStats = new Map<string, {
                success: number;
                total: number;
                executionTimes: number[];
                lastExecution?: Date;
            }>();
            
            executions?.forEach(exec => {
                const name = exec.agent_name;
                if (!agentStats.has(name)) {
                    agentStats.set(name, { success: 0, total: 0, executionTimes: [] });
                }
                const stats = agentStats.get(name)!;
                stats.total++;
                if (exec.success) stats.success++;
                if (exec.execution_time_ms) stats.executionTimes.push(exec.execution_time_ms);
                const execDate = new Date(exec.created_at);
                if (!stats.lastExecution || execDate > stats.lastExecution) {
                    stats.lastExecution = execDate;
                }
            });
            
            const agents = Array.from(agentStats.entries()).map(([name, stats]) => {
                const successRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 100;
                const avgExecutionTime = stats.executionTimes.length > 0
                    ? stats.executionTimes.reduce((a, b) => a + b, 0) / stats.executionTimes.length
                    : 0;
                
                let status: 'healthy' | 'degraded' | 'unhealthy';
                if (successRate >= 95 && avgExecutionTime < 5000) {
                    status = 'healthy';
                } else if (successRate >= 80 && avgExecutionTime < 10000) {
                    status = 'degraded';
                } else {
                    status = 'unhealthy';
                }
                
                return {
                    name,
                    successRate,
                    avgExecutionTime,
                    lastExecution: stats.lastExecution,
                    status
                };
            });
            
            // Get budget status with timeout
            let budgetStatus;
            try {
                const budgetPromise = this.budgetAgent.checkBudget();
                const timeoutPromise = new Promise<any>((_, reject) => 
                    setTimeout(() => reject(new Error('Budget check timed out')), 2000)
                );
                budgetStatus = await Promise.race([budgetPromise, timeoutPromise]);
            } catch (e) {
                logger.warn('HealthMonitor: Budget check timed out or failed, using fallback', e);
                budgetStatus = {
                    canGenerate: true, // Fail open for health check display
                    tokensRemaining: 0,
                    imagesRemaining: 0,
                    costRemaining: 0,
                    isPaused: false,
                    reason: 'Budget check timed out'
                };
            }

            const budget = {
                status: budgetStatus.isPaused 
                    ? 'critical' as const
                    : (budgetStatus.costRemaining < 5 && budgetStatus.costRemaining > 0) // Fix logic for "warning"
                    ? 'warning' as const
                    : 'ok' as const,
                tokensRemaining: budgetStatus.tokensRemaining || 0,
                costRemaining: budgetStatus.costRemaining || 0,
                isPaused: budgetStatus.isPaused || false
            };
            
            // Get recent errors
            const { data: errors } = await this.supabase
                .from('agent_executions')
                .select('agent_name, error_message, created_at')
                .eq('success', false)
                .not('error_message', 'is', null)
                .order('created_at', { ascending: false })
                .limit(10);
            
            const recentErrors = (errors || []).map(e => ({
                agent: e.agent_name,
                error: e.error_message || 'Unknown error',
                timestamp: new Date(e.created_at)
            }));
            
            // Determine overall health
            const unhealthyAgents = agents.filter(a => a.status === 'unhealthy').length;
            const degradedAgents = agents.filter(a => a.status === 'degraded').length;
            
            let overall: 'healthy' | 'degraded' | 'unhealthy';
            if (unhealthyAgents > 0 || budget.status === 'critical') {
                overall = 'unhealthy';
            } else if (degradedAgents > 0 || budget.status === 'warning') {
                overall = 'degraded';
            } else {
                overall = 'healthy';
            }
            
            // API provider status (simplified - can be enhanced)
            const apiProviders = [
                { provider: 'ollama', status: 'available' as const, lastCheck: new Date() },
                { provider: 'deepseek', status: 'available' as const, lastCheck: new Date() },
                { provider: 'groq', status: 'available' as const, lastCheck: new Date() },
                { provider: 'openai', status: 'available' as const, lastCheck: new Date() }
            ];
            
            return {
                overall,
                agents,
                budget,
                apiProviders,
                errors: {
                    count: recentErrors.length,
                    recent: recentErrors
                }
            };
            
        } catch (error) {
            logger.error('HealthMonitorAgent: Failed to get system health', error as Error);
            throw error;
        }
    }
    
    /**
     * Check if system is healthy
     */
    async isHealthy(): Promise<boolean> {
        try {
            const health = await this.getSystemHealth();
            return health.overall === 'healthy' || health.overall === 'degraded';
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Execute agent task
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        const startTime = Date.now();
        
        try {
            const health = await this.getSystemHealth();
            
            return {
                success: true,
                data: health,
                executionTime: Date.now() - startTime,
                metadata: {
                    overall: health.overall,
                    agentCount: health.agents.length,
                    errorCount: health.errors.count
                }
            };
        } catch (error) {
            return this.handleError(error, context);
        }
    }
}
