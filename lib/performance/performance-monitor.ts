/**
 * Performance Monitor
 * Tracks and reports performance metrics
 */

import { logger } from '@/lib/logger';

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceStats {
  count: number;
  total: number;
  average: number;
  min: number;
  max: number;
  p50: number;
  p95: number;
  p99: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private readonly maxMetrics = 1000; // Keep last 1000 metrics per key

  /**
   * Record a performance metric
   */
  record(name: string, duration: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // Keep only last maxMetrics
    if (metrics.length > this.maxMetrics) {
      metrics.shift();
    }

    // Log slow operations
    if (duration > 1000) {
      logger.warn('Slow operation detected', { name, duration, metadata });
    }
  }

  /**
   * Get statistics for a metric
   */
  getStats(name: string): PerformanceStats | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const count = durations.length;
    const total = durations.reduce((sum, d) => sum + d, 0);
    const average = total / count;
    const min = durations[0];
    const max = durations[durations.length - 1];
    const p50 = durations[Math.floor(count * 0.5)];
    const p95 = durations[Math.floor(count * 0.95)];
    const p99 = durations[Math.floor(count * 0.99)];

    return {
      count,
      total,
      average,
      min,
      max,
      p50,
      p95,
      p99,
    };
  }

  /**
   * Get all metric names
   */
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  /**
   * Clear metrics for a specific name
   */
  clear(name: string): void {
    this.metrics.delete(name);
  }

  /**
   * Clear all metrics
   */
  clearAll(): void {
    this.metrics.clear();
  }

  /**
   * Get summary of all metrics
   */
  getSummary(): Record<string, PerformanceStats> {
    const summary: Record<string, PerformanceStats> = {};
    
    for (const name of this.metrics.keys()) {
      const stats = this.getStats(name);
      if (stats) {
        summary[name] = stats;
      }
    }

    return summary;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Performance decorator for async functions
 */
export function trackPerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        performanceMonitor.record(name, duration, { method: propertyKey });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        performanceMonitor.record(name, duration, { 
          method: propertyKey, 
          error: error instanceof Error ? error.message : String(error) 
        });
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Performance wrapper for async functions
 */
export async function withPerformanceTracking<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    performanceMonitor.record(name, duration, metadata);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    performanceMonitor.record(name, duration, { 
      ...metadata,
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
}
