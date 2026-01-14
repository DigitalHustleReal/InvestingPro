/**
 * Metrics Collection Middleware
 * Tracks API performance, error rates, and throughput
 */

import { logger } from '@/lib/logger';

export interface APIMetrics {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    timestamp: string;
    correlationId?: string;
    userId?: string;
    error?: string;
}

// In-memory metrics store (for now - can be moved to Redis/Database later)
const metricsStore: APIMetrics[] = [];
const MAX_METRICS = 1000; // Keep last 1000 requests in memory

// Metrics aggregation
let metricsAggregation = {
    totalRequests: 0,
    totalErrors: 0,
    totalDuration: 0,
    requestsByStatus: {} as Record<number, number>,
    requestsByPath: {} as Record<string, number>,
    averageLatency: 0,
    p50Latency: 0,
    p95Latency: 0,
    p99Latency: 0,
    lastUpdated: new Date().toISOString(),
};

/**
 * Record API request metrics
 */
export function recordAPIMetrics(metrics: APIMetrics) {
    // Add to store
    metricsStore.push(metrics);
    
    // Keep only last MAX_METRICS
    if (metricsStore.length > MAX_METRICS) {
        metricsStore.shift();
    }

    // Update aggregation
    updateAggregation(metrics);

    // Log performance if slow
    if (metrics.duration > 1000) {
        logger.warn('Slow API request', {
            method: metrics.method,
            path: metrics.path,
            duration: metrics.duration,
            statusCode: metrics.statusCode,
        });
    }

    // Log errors
    if (metrics.statusCode >= 500) {
        logger.error('API error', new Error(metrics.error || 'Unknown error'), {
            method: metrics.method,
            path: metrics.path,
            statusCode: metrics.statusCode,
        });
    }
}

/**
 * Update metrics aggregation
 */
function updateAggregation(metrics: APIMetrics) {
    metricsAggregation.totalRequests++;
    
    if (metrics.statusCode >= 400) {
        metricsAggregation.totalErrors++;
    }

    metricsAggregation.totalDuration += metrics.duration;

    // Update status code counts
    if (!metricsAggregation.requestsByStatus[metrics.statusCode]) {
        metricsAggregation.requestsByStatus[metrics.statusCode] = 0;
    }
    metricsAggregation.requestsByStatus[metrics.statusCode]++;

    // Update path counts
    const pathKey = `${metrics.method} ${metrics.path}`;
    if (!metricsAggregation.requestsByPath[pathKey]) {
        metricsAggregation.requestsByPath[pathKey] = 0;
    }
    metricsAggregation.requestsByPath[pathKey]++;

    // Calculate percentiles (every 10 requests for performance)
    if (metricsAggregation.totalRequests % 10 === 0) {
        calculatePercentiles();
    }

    metricsAggregation.lastUpdated = new Date().toISOString();
}

/**
 * Calculate latency percentiles
 */
function calculatePercentiles() {
    if (metricsStore.length === 0) return;

    const durations = metricsStore
        .map(m => m.duration)
        .sort((a, b) => a - b);

    metricsAggregation.averageLatency = 
        metricsAggregation.totalDuration / metricsAggregation.totalRequests;
    metricsAggregation.p50Latency = durations[Math.floor(durations.length * 0.5)] || 0;
    metricsAggregation.p95Latency = durations[Math.floor(durations.length * 0.95)] || 0;
    metricsAggregation.p99Latency = durations[Math.floor(durations.length * 0.99)] || 0;
}

/**
 * Get current metrics aggregation
 */
export function getMetrics(): typeof metricsAggregation {
    // Recalculate percentiles before returning
    calculatePercentiles();
    return { ...metricsAggregation };
}

/**
 * Get recent metrics
 */
export function getRecentMetrics(limit: number = 100): APIMetrics[] {
    return metricsStore.slice(-limit);
}

/**
 * Get metrics by path
 */
export function getMetricsByPath(path: string): APIMetrics[] {
    return metricsStore.filter(m => m.path === path);
}

/**
 * Get error rate
 */
export function getErrorRate(): number {
    if (metricsAggregation.totalRequests === 0) return 0;
    return (metricsAggregation.totalErrors / metricsAggregation.totalRequests) * 100;
}

/**
 * Get throughput (requests per second)
 */
export function getThroughput(): number {
    // Calculate based on last 60 seconds
    const oneMinuteAgo = Date.now() - 60000;
    const recentRequests = metricsStore.filter(
        m => new Date(m.timestamp).getTime() > oneMinuteAgo
    );
    return recentRequests.length / 60; // requests per second
}

/**
 * Reset metrics (for testing)
 */
export function resetMetrics() {
    metricsStore.length = 0;
    metricsAggregation = {
        totalRequests: 0,
        totalErrors: 0,
        totalDuration: 0,
        requestsByStatus: {},
        requestsByPath: {},
        averageLatency: 0,
        p50Latency: 0,
        p95Latency: 0,
        p99Latency: 0,
        lastUpdated: new Date().toISOString(),
    };
}
