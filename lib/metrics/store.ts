
// import 'server-only'; // Removed to allow middleware usage if possible

export interface RequestLog {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    timestamp: string;
    ip?: string;
}

export interface MetricsSnapshot {
    totalRequests: number;
    totalErrors: number;
    averageLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    errorRate: string;
    throughput: string;
    requestsByStatus: Record<number, number>;
    requestsByPath: Record<string, number>;
    lastUpdated: string;
}

class MetricsStore {
    private static instance: MetricsStore;
    
    private requests: RequestLog[] = [];
    private readonly MAX_LOGS = 1000;
    
    // Aggregated counters
    private totalRequests = 0;
    private totalErrors = 0;
    private totalDuration = 0;
    private startTime = Date.now();
    
    private requestsByStatus: Record<number, number> = {};
    private requestsByPath: Record<string, number> = {};

    private constructor() {}

    public static getInstance(): MetricsStore {
        if (!MetricsStore.instance) {
            MetricsStore.instance = new MetricsStore();
        }
        return MetricsStore.instance;
    }

    public recordRequest(log: RequestLog) {
        // Add to logs
        this.requests.push(log);
        if (this.requests.length > this.MAX_LOGS) {
            this.requests.shift();
        }

        // Update aggregates
        this.totalRequests++;
        this.totalDuration += log.duration;
        
        if (log.statusCode >= 400) {
            this.totalErrors++;
        }

        // Status counts
        this.requestsByStatus[log.statusCode] = (this.requestsByStatus[log.statusCode] || 0) + 1;

        // Path counts (normalize path to avoid explosion)
        const normalizedPath = this.normalizePath(log.path);
        this.requestsByPath[normalizedPath] = (this.requestsByPath[normalizedPath] || 0) + 1;
    }

    public getRecentLogs(limit: number = 50): RequestLog[] {
        return this.requests.slice(-limit);
    }

    public getSnapshot(): MetricsSnapshot {
        const now = Date.now();
        const uptimeSeconds = (now - this.startTime) / 1000;
        
        // Calculate latency percentiles from recent window (approximation)
        // For better accuracy, we'd need a T-Digest or HDR Histogram, but sorting last 1000 is fine for this scale
        const recentDurations = this.requests.map(r => r.duration).sort((a, b) => a - b);
        
        return {
            totalRequests: this.totalRequests,
            totalErrors: this.totalErrors,
            averageLatency: this.totalRequests > 0 ? this.totalDuration / this.totalRequests : 0,
            p50Latency: this.getPercentile(recentDurations, 0.5),
            p95Latency: this.getPercentile(recentDurations, 0.95),
            p99Latency: this.getPercentile(recentDurations, 0.99),
            errorRate: this.totalRequests > 0 ? ((this.totalErrors / this.totalRequests) * 100).toFixed(2) : '0',
            throughput: (this.totalRequests / (uptimeSeconds || 1)).toFixed(2),
            requestsByStatus: this.requestsByStatus,
            requestsByPath: this.requestsByPath,
            lastUpdated: new Date().toISOString()
        };
    }

    private getPercentile(sorted: number[], p: number): number {
        if (sorted.length === 0) return 0;
        const index = Math.floor(sorted.length * p);
        return sorted[Math.min(index, sorted.length - 1)];
    }

    private normalizePath(path: string): string {
        // Simple normalization
        return path
            .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id') // UUID
            .replace(/\/admin\/product\/[^/]+/g, '/admin/product/:slug')
            .replace(/\d+/g, ':id');
    }
}

export const metricsStore = MetricsStore.getInstance();
