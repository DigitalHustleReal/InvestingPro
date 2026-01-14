/**
 * Prometheus Metrics Collection
 * Exposes metrics in Prometheus format for scraping
 * 
 * Free and self-hosted - no external service needed
 */

import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create a registry for metrics
export const register = new Registry();

// Collect default Node.js metrics (CPU, memory, etc.)
if (typeof window === 'undefined') {
    collectDefaultMetrics({ register });
}

// ============================================
// API Metrics
// ============================================

export const httpRequestTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status_code'],
    registers: [register],
});

export const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'path', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [register],
});

export const httpRequestErrors = new Counter({
    name: 'http_request_errors_total',
    help: 'Total number of HTTP request errors',
    labelNames: ['method', 'path', 'status_code'],
    registers: [register],
});

// ============================================
// Database Metrics
// ============================================

export const dbQueryDuration = new Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['table', 'operation'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
    registers: [register],
});

export const dbQueryTotal = new Counter({
    name: 'db_queries_total',
    help: 'Total number of database queries',
    labelNames: ['table', 'operation'],
    registers: [register],
});

export const dbConnectionPool = new Gauge({
    name: 'db_connection_pool_size',
    help: 'Current database connection pool size',
    registers: [register],
});

// ============================================
// AI Provider Metrics
// ============================================

export const aiProviderRequests = new Counter({
    name: 'ai_provider_requests_total',
    help: 'Total number of AI provider requests',
    labelNames: ['provider', 'operation', 'status'],
    registers: [register],
});

export const aiProviderDuration = new Histogram({
    name: 'ai_provider_duration_seconds',
    help: 'Duration of AI provider requests in seconds',
    labelNames: ['provider', 'operation'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
    registers: [register],
});

export const aiProviderCost = new Counter({
    name: 'ai_provider_cost_total',
    help: 'Total cost of AI provider requests (in USD cents)',
    labelNames: ['provider', 'operation'],
    registers: [register],
});

// ============================================
// Workflow Metrics
// ============================================

export const workflowExecutions = new Counter({
    name: 'workflow_executions_total',
    help: 'Total number of workflow executions',
    labelNames: ['workflow_type', 'status'],
    registers: [register],
});

export const workflowDuration = new Histogram({
    name: 'workflow_duration_seconds',
    help: 'Duration of workflow executions in seconds',
    labelNames: ['workflow_type'],
    buckets: [1, 5, 10, 30, 60, 300, 600, 1800],
    registers: [register],
});

// ============================================
// Cache Metrics
// ============================================

export const cacheHits = new Counter({
    name: 'cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_type'],
    registers: [register],
});

export const cacheMisses = new Counter({
    name: 'cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_type'],
    registers: [register],
});

export const cacheSize = new Gauge({
    name: 'cache_size_bytes',
    help: 'Current cache size in bytes',
    labelNames: ['cache_type'],
    registers: [register],
});

// ============================================
// Business Metrics
// ============================================

export const articlesPublished = new Counter({
    name: 'articles_published_total',
    help: 'Total number of articles published',
    labelNames: ['status', 'source'],
    registers: [register],
});

export const affiliateClicks = new Counter({
    name: 'affiliate_clicks_total',
    help: 'Total number of affiliate clicks',
    labelNames: ['product_type'],
    registers: [register],
});

export const affiliateConversions = new Counter({
    name: 'affiliate_conversions_total',
    help: 'Total number of affiliate conversions',
    labelNames: ['product_type'],
    registers: [register],
});

// ============================================
// Helper Functions
// ============================================

/**
 * Record API request metrics
 */
export function recordAPIRequest(
    method: string,
    path: string,
    statusCode: number,
    durationSeconds: number
): void {
    const labels = {
        method: method.toUpperCase(),
        path: normalizePath(path),
        status_code: statusCode.toString(),
    };

    httpRequestTotal.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);

    if (statusCode >= 400) {
        httpRequestErrors.inc(labels);
    }
}

/**
 * Record database query metrics
 */
export function recordDBQuery(
    table: string,
    operation: string,
    durationSeconds: number
): void {
    const labels = { table, operation };
    dbQueryTotal.inc(labels);
    dbQueryDuration.observe(labels, durationSeconds);
}

/**
 * Record AI provider request metrics
 */
export function recordAIRequest(
    provider: string,
    operation: string,
    durationSeconds: number,
    costCents?: number,
    success: boolean = true
): void {
    const labels = {
        provider,
        operation,
        status: success ? 'success' : 'error',
    };

    aiProviderRequests.inc(labels);
    aiProviderDuration.observe({ provider, operation }, durationSeconds);

    if (costCents) {
        aiProviderCost.inc({ provider, operation }, costCents);
    }
}

/**
 * Record workflow execution metrics
 */
export function recordWorkflow(
    workflowType: string,
    durationSeconds: number,
    success: boolean
): void {
    const labels = {
        workflow_type: workflowType,
        status: success ? 'success' : 'failed',
    };

    workflowExecutions.inc(labels);
    workflowDuration.observe({ workflow_type: workflowType }, durationSeconds);
}

/**
 * Record cache metrics
 */
export function recordCacheHit(cacheType: string = 'default'): void {
    cacheHits.inc({ cache_type: cacheType });
}

export function recordCacheMiss(cacheType: string = 'default'): void {
    cacheMisses.inc({ cache_type: cacheType });
}

/**
 * Normalize path for metrics (remove IDs, etc.)
 */
function normalizePath(path: string): string {
    // Replace UUIDs and IDs with placeholders
    return path
        .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
        .replace(/\/\d+/g, '/:id')
        .replace(/\/[^/]+$/g, '/:id'); // Last segment if it looks like an ID
}

/**
 * Get metrics in Prometheus format
 */
export async function getMetrics(): Promise<string> {
    return register.metrics();
}
