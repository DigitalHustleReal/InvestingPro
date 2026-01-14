/**
 * Metrics Collector
 * Collects and aggregates application metrics
 */

import { performanceMonitor } from '@/lib/performance/performance-monitor';
import { queryAnalyzer } from '@/lib/performance/query-analyzer';
import { cacheService } from '@/lib/cache';
import { logger } from '@/lib/logger';

export interface ApplicationMetrics {
  timestamp: string;
  api: {
    requests: {
      total: number;
      errors: number;
      p50: number;
      p95: number;
      p99: number;
    };
  };
  database: {
    queries: {
      total: number;
      slow: number;
      average: number;
      byTable: Record<string, number>;
    };
  };
  cache: {
    enabled: boolean;
    keys?: number;
    hitRate?: number;
  };
  performance: {
    operations: Record<string, {
      count: number;
      average: number;
      p95: number;
      p99: number;
    }>;
  };
}

class MetricsCollector {
  private apiRequestCount = 0;
  private apiErrorCount = 0;
  private readonly maxMetrics = 10000;

  /**
   * Record API request
   */
  recordAPIRequest(success: boolean, duration: number): void {
    this.apiRequestCount++;
    if (!success) {
      this.apiErrorCount++;
    }

    // Keep metrics in performance monitor
    performanceMonitor.record('api.request', duration, { success });

    // Reset counters periodically
    if (this.apiRequestCount > this.maxMetrics) {
      this.apiRequestCount = 0;
      this.apiErrorCount = 0;
    }
  }

  /**
   * Get comprehensive metrics
   */
  async getMetrics(): Promise<ApplicationMetrics> {
    const apiStats = performanceMonitor.getStats('api.request');
    const dbStats = queryAnalyzer.getStats();
    const cacheStats = await cacheService.getStats();
    const perfSummary = performanceMonitor.getSummary();

    return {
      timestamp: new Date().toISOString(),
      api: {
        requests: {
          total: this.apiRequestCount,
          errors: this.apiErrorCount,
          p50: apiStats?.p50 || 0,
          p95: apiStats?.p95 || 0,
          p99: apiStats?.p99 || 0,
        },
      },
      database: {
        queries: {
          total: dbStats.total,
          slow: dbStats.slow,
          average: dbStats.average,
          byTable: dbStats.byTable,
        },
      },
      cache: {
        enabled: cacheStats.enabled,
        keys: cacheStats.keys,
      },
      performance: Object.entries(perfSummary).reduce((acc, [key, stats]) => {
        acc[key] = {
          count: stats.count,
          average: stats.average,
          p95: stats.p95,
          p99: stats.p99,
        };
        return acc;
      }, {} as Record<string, any>),
    };
  }

  /**
   * Get metrics summary for dashboard
   */
  async getSummary(): Promise<{
    health: 'healthy' | 'degraded' | 'unhealthy';
    api: { requests: number; errorRate: number; avgLatency: number };
    database: { queries: number; slowQueries: number; avgLatency: number };
    cache: { enabled: boolean; hitRate?: number };
  }> {
    const metrics = await this.getMetrics();
    const errorRate = metrics.api.requests.total > 0
      ? (metrics.api.requests.errors / metrics.api.requests.total) * 100
      : 0;

    // Determine health status
    let health: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (errorRate > 5 || metrics.database.queries.slow > 10) {
      health = 'degraded';
    }
    if (errorRate > 10 || metrics.database.queries.slow > 50) {
      health = 'unhealthy';
    }

    return {
      health,
      api: {
        requests: metrics.api.requests.total,
        errorRate,
        avgLatency: metrics.api.requests.p50,
      },
      database: {
        queries: metrics.database.queries.total,
        slowQueries: metrics.database.queries.slow,
        avgLatency: metrics.database.queries.average,
      },
      cache: {
        enabled: metrics.cache.enabled || false,
      },
    };
  }
}

// Export singleton instance
export const metricsCollector = new MetricsCollector();
