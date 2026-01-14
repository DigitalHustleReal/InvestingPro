/**
 * Health Checker
 * Comprehensive health checking for all system components
 */

import { createClient } from '@/lib/supabase/client';
import { getRedisClient } from '@/lib/cache/redis-client';
import { logger } from '@/lib/logger';
import { CircuitBreaker } from '@/lib/errors/recovery';
import { getMetrics } from '@/lib/middleware/metrics';

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ComponentHealth {
    status: HealthStatus;
    latency_ms?: number;
    error?: string;
    details?: Record<string, any>;
}

export interface SystemHealth {
    status: HealthStatus;
    timestamp: string;
    uptime_seconds: number;
    version?: string;
    components: {
        database: ComponentHealth;
        cache?: ComponentHealth;
        ai_providers: ComponentHealth;
        workflows?: ComponentHealth;
        metrics?: ComponentHealth;
    };
    circuit_breakers?: Record<string, {
        state: 'closed' | 'open' | 'half-open';
    }>;
}

export class HealthChecker {
    private circuitBreakers: Map<string, CircuitBreaker> = new Map();

    /**
     * Register a circuit breaker for monitoring
     */
    registerCircuitBreaker(name: string, breaker: CircuitBreaker): void {
        this.circuitBreakers.set(name, breaker);
    }

    /**
     * Check database health
     */
    async checkDatabase(): Promise<ComponentHealth> {
        const start = Date.now();
        try {
            const supabase = createClient();
            
            // Simple query to verify connectivity
            const { data, error } = await supabase
                .from('articles')
                .select('id')
                .limit(1);
            
            if (error) {
                throw error;
            }
            
            const latency = Date.now() - start;
            
            return {
                status: latency < 1000 ? 'healthy' : latency < 3000 ? 'degraded' : 'unhealthy',
                latency_ms: latency,
                details: {
                    connected: true,
                    response_time: latency,
                },
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                latency_ms: Date.now() - start,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Check cache health
     */
    async checkCache(): Promise<ComponentHealth> {
        const start = Date.now();
        try {
            const redis = getRedisClient();
            
            if (!redis) {
                return {
                    status: 'degraded', // Cache is optional
                    latency_ms: Date.now() - start,
                    error: 'Redis client not available',
                    details: {
                        configured: false,
                    },
                };
            }
            
            // Ping test
            await redis.ping();
            
            const latency = Date.now() - start;
            
            return {
                status: latency < 100 ? 'healthy' : latency < 500 ? 'degraded' : 'unhealthy',
                latency_ms: latency,
                details: {
                    connected: true,
                    response_time: latency,
                },
            };
        } catch (error) {
            return {
                status: 'degraded', // Cache failures don't make system unhealthy
                latency_ms: Date.now() - start,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Check AI providers health
     */
    async checkAIProviders(): Promise<ComponentHealth> {
        const start = Date.now();
        
        try {
            const providers = {
                openai: !!process.env.OPENAI_API_KEY,
                gemini: !!process.env.GOOGLE_GEMINI_API_KEY,
                groq: !!process.env.GROQ_API_KEY,
                mistral: !!process.env.MISTRAL_API_KEY,
            };
            
            const configuredProviders = Object.entries(providers)
                .filter(([_, configured]) => configured)
                .map(([name]) => name);
            
            const anyConfigured = configuredProviders.length > 0;
            const multipleConfigured = configuredProviders.length > 1;
            
            // Check circuit breaker states
            const breakerStates: Record<string, string> = {};
            this.circuitBreakers.forEach((breaker, name) => {
                breakerStates[name] = breaker.getState();
            });
            
            return {
                status: anyConfigured 
                    ? (multipleConfigured ? 'healthy' : 'degraded')
                    : 'unhealthy',
                latency_ms: Date.now() - start,
                details: {
                    configured: configuredProviders,
                    count: configuredProviders.length,
                    circuit_breakers: breakerStates,
                },
                error: anyConfigured ? undefined : 'No AI providers configured',
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                latency_ms: Date.now() - start,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Check workflows health
     */
    async checkWorkflows(): Promise<ComponentHealth> {
        const start = Date.now();
        
        try {
            const supabase = createClient();
            
            // Check for stuck workflows (running for more than 1 hour)
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            
            const { data, error } = await supabase
                .from('workflows')
                .select('id, status, updated_at')
                .eq('status', 'running')
                .lt('updated_at', oneHourAgo)
                .limit(10);
            
            if (error) {
                throw error;
            }
            
            const stuckWorkflows = data?.length || 0;
            const latency = Date.now() - start;
            
            return {
                status: stuckWorkflows === 0 
                    ? 'healthy' 
                    : stuckWorkflows < 5 
                    ? 'degraded' 
                    : 'unhealthy',
                latency_ms: latency,
                details: {
                    stuck_workflows: stuckWorkflows,
                    threshold: 5,
                },
                error: stuckWorkflows > 0 
                    ? `${stuckWorkflows} workflow(s) appear to be stuck`
                    : undefined,
            };
        } catch (error) {
            return {
                status: 'degraded', // Workflow checks are informational
                latency_ms: Date.now() - start,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Check metrics system health
     */
    async checkMetrics(): Promise<ComponentHealth> {
        const start = Date.now();
        
        try {
            const metrics = getMetrics();
            
            const latency = Date.now() - start;
            const errorRate = metrics.totalRequests > 0
                ? (metrics.totalErrors / metrics.totalRequests) * 100
                : 0;
            
            return {
                status: errorRate < 5 
                    ? 'healthy' 
                    : errorRate < 10 
                    ? 'degraded' 
                    : 'unhealthy',
                latency_ms: latency,
                details: {
                    total_requests: metrics.totalRequests,
                    error_rate: errorRate.toFixed(2),
                    avg_latency_ms: metrics.averageLatency,
                },
            };
        } catch (error) {
            return {
                status: 'degraded', // Metrics failures don't make system unhealthy
                latency_ms: Date.now() - start,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Get comprehensive system health
     */
    async getSystemHealth(): Promise<SystemHealth> {
        const startTime = Date.now();
        
        try {
            // Run all checks in parallel
            const [database, cache, aiProviders, workflows, metrics] = await Promise.all([
                this.checkDatabase(),
                this.checkCache(),
                this.checkAIProviders(),
                this.checkWorkflows(),
                this.checkMetrics(),
            ]);
            
            // Collect circuit breaker states
            const circuitBreakerStates: Record<string, { state: string }> = {};
            this.circuitBreakers.forEach((breaker, name) => {
                circuitBreakerStates[name] = {
                    state: breaker.getState(),
                };
            });
            
            // Determine overall status
            const statuses = [
                database.status,
                aiProviders.status,
                workflows.status,
            ];
            
            // Cache and metrics are optional, so degraded is acceptable
            const criticalStatuses = statuses.filter(s => s === 'unhealthy');
            const degradedStatuses = statuses.filter(s => s === 'degraded');
            
            let overallStatus: HealthStatus;
            if (criticalStatuses.length > 0) {
                overallStatus = 'unhealthy';
            } else if (degradedStatuses.length > 0 || cache.status === 'degraded' || metrics.status === 'degraded') {
                overallStatus = 'degraded';
            } else {
                overallStatus = 'healthy';
            }
            
            return {
                status: overallStatus,
                timestamp: new Date().toISOString(),
                uptime_seconds: Math.floor(process.uptime()),
                version: process.env.npm_package_version || '1.0.0',
                components: {
                    database,
                    cache,
                    ai_providers: aiProviders,
                    workflows,
                    metrics,
                },
                circuit_breakers: Object.keys(circuitBreakerStates).length > 0 
                    ? circuitBreakerStates 
                    : undefined,
            };
        } catch (error) {
            logger.error('Health check failed', error as Error);
            
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                uptime_seconds: Math.floor(process.uptime()),
                components: {
                    database: {
                        status: 'unhealthy',
                        error: 'Health check system failure',
                    },
                    ai_providers: {
                        status: 'unhealthy',
                        error: 'Health check system failure',
                    },
                },
            };
        }
    }

    /**
     * Quick liveness check (just verify process is running)
     */
    async checkLiveness(): Promise<boolean> {
        try {
            // Just verify process is alive
            return process.uptime() >= 0;
        } catch {
            return false;
        }
    }

    /**
     * Readiness check (verify critical dependencies)
     */
    async checkReadiness(): Promise<{ ready: boolean; reason?: string }> {
        try {
            const database = await this.checkDatabase();
            
            if (database.status === 'unhealthy') {
                return {
                    ready: false,
                    reason: `Database is ${database.status}: ${database.error}`,
                };
            }
            
            const aiProviders = await this.checkAIProviders();
            
            if (aiProviders.status === 'unhealthy') {
                return {
                    ready: false,
                    reason: `AI providers are ${aiProviders.status}: ${aiProviders.error}`,
                };
            }
            
            return { ready: true };
        } catch (error) {
            return {
                ready: false,
                reason: error instanceof Error ? error.message : String(error),
            };
        }
    }
}

// Export singleton instance
export const healthChecker = new HealthChecker();
