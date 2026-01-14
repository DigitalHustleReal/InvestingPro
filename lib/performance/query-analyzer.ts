/**
 * Query Performance Analyzer
 * Helps identify slow queries and optimization opportunities
 */

import { logger } from '@/lib/logger';
import { performanceMonitor } from './performance-monitor';

export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: number;
  table?: string;
  operation?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  metadata?: Record<string, any>;
}

class QueryAnalyzer {
  private slowQueryThreshold = 100; // 100ms threshold for slow queries
  private queries: QueryMetrics[] = [];
  private readonly maxQueries = 1000;

  /**
   * Record a query execution
   */
  recordQuery(
    query: string,
    duration: number,
    table?: string,
    operation?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
    metadata?: Record<string, any>
  ): void {
    const metric: QueryMetrics = {
      query,
      duration,
      timestamp: Date.now(),
      table,
      operation,
      metadata,
    };

    this.queries.push(metric);

    // Keep only last maxQueries
    if (this.queries.length > this.maxQueries) {
      this.queries.shift();
    }

    // Log slow queries
    if (duration > this.slowQueryThreshold) {
      logger.warn('Slow query detected', {
        query: this.sanitizeQuery(query),
        duration,
        table,
        operation,
        metadata,
      });

      // Also record in performance monitor
      performanceMonitor.record('database.query.slow', duration, {
        table,
        operation,
        query: this.sanitizeQuery(query),
      });
    }

    // Record all queries in performance monitor
    performanceMonitor.record('database.query', duration, {
      table,
      operation,
    });
  }

  /**
   * Get slow queries
   */
  getSlowQueries(threshold?: number): QueryMetrics[] {
    const limit = threshold || this.slowQueryThreshold;
    return this.queries.filter(q => q.duration > limit);
  }

  /**
   * Get queries by table
   */
  getQueriesByTable(table: string): QueryMetrics[] {
    return this.queries.filter(q => q.table === table);
  }

  /**
   * Get average query time by table
   */
  getAverageByTable(): Record<string, number> {
    const byTable: Record<string, { total: number; count: number }> = {};

    for (const query of this.queries) {
      if (query.table) {
        if (!byTable[query.table]) {
          byTable[query.table] = { total: 0, count: 0 };
        }
        byTable[query.table].total += query.duration;
        byTable[query.table].count += 1;
      }
    }

    const averages: Record<string, number> = {};
    for (const [table, data] of Object.entries(byTable)) {
      averages[table] = data.total / data.count;
    }

    return averages;
  }

  /**
   * Get query statistics
   */
  getStats(): {
    total: number;
    slow: number;
    average: number;
    byTable: Record<string, number>;
    slowQueries: QueryMetrics[];
  } {
    const total = this.queries.length;
    const slow = this.queries.filter(q => q.duration > this.slowQueryThreshold).length;
    const average = this.queries.length > 0
      ? this.queries.reduce((sum, q) => sum + q.duration, 0) / this.queries.length
      : 0;

    return {
      total,
      slow,
      average,
      byTable: this.getAverageByTable(),
      slowQueries: this.getSlowQueries(),
    };
  }

  /**
   * Clear all queries
   */
  clear(): void {
    this.queries = [];
  }

  /**
   * Sanitize query for logging (remove sensitive data)
   */
  private sanitizeQuery(query: string): string {
    // Remove potential sensitive data
    return query
      .replace(/password\s*=\s*'[^']*'/gi, "password = '***'")
      .replace(/token\s*=\s*'[^']*'/gi, "token = '***'")
      .substring(0, 200); // Limit length
  }
}

// Export singleton instance
export const queryAnalyzer = new QueryAnalyzer();

/**
 * Wrap a database query with performance tracking
 */
export async function trackQuery<T>(
  query: string,
  fn: () => Promise<T>,
  table?: string,
  operation?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
  metadata?: Record<string, any>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    queryAnalyzer.recordQuery(query, duration, table, operation, metadata);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    queryAnalyzer.recordQuery(query, duration, table, operation, {
      ...metadata,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
