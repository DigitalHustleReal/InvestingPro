/**
 * Database Monitoring Service
 * 
 * Tracks query performance, connection pool usage, and table sizes
 * Integrates with alerting system for proactive monitoring
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { alertManager } from '@/lib/alerts/alert-manager';
import { recordDBQuery } from '@/lib/metrics/prometheus';
import { createHash } from 'crypto';

export interface QueryPerformanceMetrics {
    queryHash: string;
    queryText: string;
    queryType?: string;
    tableName?: string;
    executionTimeMs: number;
    rowsReturned?: number;
    rowsAffected?: number;
}

export interface SlowQuery {
    queryHash: string;
    queryText: string;
    queryType?: string;
    tableName?: string;
    avgExecutionTimeMs: number;
    maxExecutionTimeMs: number;
    callCount: number;
    lastSeen: string;
}

export interface TableSizeInfo {
    tableName: string;
    tableSizeBytes: number;
    indexSizeBytes: number;
    totalSizeBytes: number;
    rowCount?: number;
}

export interface ConnectionPoolStats {
    databaseName: string;
    activeConnections: number;
    maxConnections: number;
    connectionUsagePercent: number;
}

export interface TableSizeGrowth {
    tableName: string;
    currentSizeBytes: number;
    size7DaysAgoBytes: number;
    growthBytes: number;
    growthPercent: number;
}

/**
 * Database Monitor Service
 */
export class DatabaseMonitor {
    private static instance: DatabaseMonitor;
    private slowQueryThresholdMs: number = 1000; // 1 second
    private connectionPoolThresholdPercent: number = 80;
    private tableGrowthThresholdPercent: number = 10;

    private constructor() {}

    static getInstance(): DatabaseMonitor {
        if (!DatabaseMonitor.instance) {
            DatabaseMonitor.instance = new DatabaseMonitor();
        }
        return DatabaseMonitor.instance;
    }

    /**
     * Log query performance
     */
    async logQueryPerformance(metrics: QueryPerformanceMetrics): Promise<void> {
        try {
            const supabase = createClient();

            // Record in Prometheus metrics
            recordDBQuery(
                metrics.tableName || 'unknown',
                metrics.queryType || 'unknown',
                metrics.executionTimeMs / 1000 // Convert to seconds
            );

            // Log to database if query is slow
            if (metrics.executionTimeMs >= this.slowQueryThresholdMs) {
                const { error } = await supabase.rpc('log_query_performance', {
                    p_query_hash: metrics.queryHash,
                    p_query_text: metrics.queryText.substring(0, 1000), // Limit length
                    p_query_type: metrics.queryType || null,
                    p_table_name: metrics.tableName || null,
                    p_execution_time_ms: metrics.executionTimeMs,
                    p_rows_returned: metrics.rowsReturned || null,
                    p_rows_affected: metrics.rowsAffected || null,
                });

                if (error) {
                    logger.error('Failed to log query performance', error);
                }

                // Trigger alert for very slow queries (>5s)
                if (metrics.executionTimeMs > 5000) {
                    await alertManager.triggerAlert('slow_query', {
                        queryHash: metrics.queryHash,
                        executionTimeMs: metrics.executionTimeMs,
                        tableName: metrics.tableName,
                    });
                }
            }
        } catch (error) {
            logger.error('Failed to log query performance', error instanceof Error ? error : new Error(String(error)));
        }
    }

    /**
     * Get slow queries from last 24 hours
     */
    async getSlowQueries(thresholdMs: number = this.slowQueryThresholdMs): Promise<SlowQuery[]> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase.rpc('get_slow_queries', {
                threshold_ms: thresholdMs,
            });

            if (error) {
                throw error;
            }

            return (data || []).map((q: any) => ({
                queryHash: q.query_hash,
                queryText: q.query_text,
                queryType: q.query_type,
                tableName: q.table_name,
                avgExecutionTimeMs: q.avg_execution_time_ms,
                maxExecutionTimeMs: q.max_execution_time_ms,
                callCount: q.call_count,
                lastSeen: q.last_seen,
            }));
        } catch (error) {
            logger.error('Failed to get slow queries', error instanceof Error ? error : new Error(String(error)));
            return [];
        }
    }

    /**
     * Get connection pool statistics
     */
    async getConnectionPoolStats(): Promise<ConnectionPoolStats | null> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase.rpc('get_connection_pool_stats');

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                return null;
            }

            const stats = data[0];
            const connectionStats: ConnectionPoolStats = {
                databaseName: stats.database_name,
                activeConnections: stats.active_connections,
                maxConnections: stats.max_connections,
                connectionUsagePercent: stats.connection_usage_percent,
            };

            // Trigger alert if connection pool usage is high
            if (connectionStats.connectionUsagePercent >= this.connectionPoolThresholdPercent) {
                await alertManager.triggerAlert('connection_pool_high', {
                    usagePercent: connectionStats.connectionUsagePercent,
                    activeConnections: connectionStats.activeConnections,
                    maxConnections: connectionStats.maxConnections,
                });
            }

            return connectionStats;
        } catch (error) {
            logger.error('Failed to get connection pool stats', error instanceof Error ? error : new Error(String(error)));
            return null;
        }
    }

    /**
     * Record table sizes
     */
    async recordTableSizes(): Promise<TableSizeInfo[]> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase.rpc('record_table_sizes');

            if (error) {
                throw error;
            }

            const tableSizes: TableSizeInfo[] = (data || []).map((t: any) => ({
                tableName: t.table_name,
                tableSizeBytes: t.table_size_bytes,
                indexSizeBytes: t.index_size_bytes,
                totalSizeBytes: t.total_size_bytes,
                rowCount: t.row_count,
            }));

            // Insert into history table
            for (const tableSize of tableSizes) {
                const { error: insertError } = await supabase
                    .from('table_size_history')
                    .insert({
                        table_name: tableSize.tableName,
                        table_size_bytes: tableSize.tableSizeBytes,
                        index_size_bytes: tableSize.indexSizeBytes,
                        total_size_bytes: tableSize.totalSizeBytes,
                        row_count: tableSize.rowCount,
                    });

                if (insertError) {
                    logger.error('Failed to record table size', insertError);
                }
            }

            return tableSizes;
        } catch (error) {
            logger.error('Failed to record table sizes', error instanceof Error ? error : new Error(String(error)));
            return [];
        }
    }

    /**
     * Get table size growth
     */
    async getTableSizeGrowth(): Promise<TableSizeGrowth[]> {
        try {
            const supabase = createClient();
            const { data, error } = await supabase.rpc('get_table_size_growth');

            if (error) {
                throw error;
            }

            const growth: TableSizeGrowth[] = (data || []).map((g: any) => ({
                tableName: g.table_name,
                currentSizeBytes: g.current_size_bytes,
                size7DaysAgoBytes: g.size_7_days_ago_bytes,
                growthBytes: g.growth_bytes,
                growthPercent: g.growth_percent,
            }));

            // Trigger alerts for tables with high growth
            for (const tableGrowth of growth) {
                if (tableGrowth.growthPercent >= this.tableGrowthThresholdPercent) {
                    await alertManager.triggerAlert('table_size_growth', {
                        tableName: tableGrowth.tableName,
                        growthPercent: tableGrowth.growthPercent,
                        growthBytes: tableGrowth.growthBytes,
                    });
                }
            }

            return growth;
        } catch (error) {
            logger.error('Failed to get table size growth', error instanceof Error ? error : new Error(String(error)));
            return [];
        }
    }

    /**
     * Get database performance summary
     */
    async getPerformanceSummary(): Promise<{
        slowQueries: SlowQuery[];
        connectionPool: ConnectionPoolStats | null;
        tableSizes: TableSizeInfo[];
        tableGrowth: TableSizeGrowth[];
    }> {
        const [slowQueries, connectionPool, tableSizes, tableGrowth] = await Promise.all([
            this.getSlowQueries(),
            this.getConnectionPoolStats(),
            this.recordTableSizes(),
            this.getTableSizeGrowth(),
        ]);

        return {
            slowQueries,
            connectionPool,
            tableSizes,
            tableGrowth,
        };
    }

    /**
     * Generate query hash for deduplication
     */
    static generateQueryHash(queryText: string): string {
        // Normalize query (remove whitespace, lowercase)
        const normalized = queryText
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

        return createHash('sha256').update(normalized).digest('hex').substring(0, 16);
    }
}

// Export singleton instance
export const databaseMonitor = DatabaseMonitor.getInstance();
