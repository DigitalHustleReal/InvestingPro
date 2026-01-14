# Database Monitoring & Optimization

This document describes the database monitoring and optimization system.

## 🎯 Overview

Database monitoring tracks:
- ✅ Query performance (slow queries)
- ✅ Connection pool usage
- ✅ Table size growth
- ✅ Query patterns and optimization opportunities

**Integration:** Prometheus metrics, Alerting system, Admin dashboard

---

## 📊 Monitoring Features

### Slow Query Logging

Tracks queries that exceed threshold (default: 1 second):
- Logs query text, execution time, table name
- Aggregates slow queries for analysis
- Triggers alerts for very slow queries (>5s)

### Connection Pool Monitoring

Tracks database connection usage:
- Active connections vs max connections
- Connection pool usage percentage
- Alerts when usage exceeds 80%

### Table Size Tracking

Monitors table growth over time:
- Records table sizes daily
- Calculates growth percentage
- Alerts when growth exceeds 10% per week

---

## 🚀 Usage

### Query Performance Logging

```typescript
import { databaseMonitor, DatabaseMonitor } from '@/lib/monitoring/database-monitor';

// Log query performance
const queryHash = DatabaseMonitor.generateQueryHash(queryText);
await databaseMonitor.logQueryPerformance({
    queryHash,
    queryText,
    queryType: 'SELECT',
    tableName: 'articles',
    executionTimeMs: 1500,
    rowsReturned: 100,
});
```

### Get Slow Queries

```typescript
// Get slow queries from last 24 hours
const slowQueries = await databaseMonitor.getSlowQueries(1000); // Threshold: 1s

slowQueries.forEach(query => {
    console.log(`Query: ${query.queryText}`);
    console.log(`Avg time: ${query.avgExecutionTimeMs}ms`);
    console.log(`Calls: ${query.callCount}`);
});
```

### Get Connection Pool Stats

```typescript
const stats = await databaseMonitor.getConnectionPoolStats();

console.log(`Active: ${stats.activeConnections}`);
console.log(`Max: ${stats.maxConnections}`);
console.log(`Usage: ${stats.connectionUsagePercent}%`);
```

### Get Table Size Growth

```typescript
const growth = await databaseMonitor.getTableSizeGrowth();

growth.forEach(table => {
    if (table.growthPercent > 10) {
        console.log(`Table ${table.tableName} grew ${table.growthPercent}%`);
    }
});
```

---

## 📈 API Endpoints

### Performance Dashboard

**GET** `/api/v1/admin/database/performance`

Returns comprehensive database performance metrics:

```json
{
    "success": true,
    "data": {
        "slowQueries": [...],
        "connectionPool": {...},
        "tableSizes": [...],
        "tableGrowth": [...]
    }
}
```

### Record Table Sizes (Cron)

**GET/POST** `/api/cron/record-table-sizes`

Records current table sizes for growth tracking. Runs daily at 1 AM UTC.

---

## 🔍 Database Functions

### log_query_performance

Logs query performance metrics:

```sql
SELECT log_query_performance(
    'query-hash',
    'SELECT * FROM articles',
    'SELECT',
    'articles',
    1500.0, -- execution time in ms
    100,    -- rows returned
    NULL,   -- rows affected
    NULL,   -- connection_id
    NULL,   -- application_name
    NULL    -- user_id
);
```

### get_slow_queries

Returns slow queries from last 24 hours:

```sql
SELECT * FROM get_slow_queries(1000); -- Threshold: 1s
```

### get_connection_pool_stats

Returns connection pool statistics:

```sql
SELECT * FROM get_connection_pool_stats();
```

### get_table_size_growth

Returns table size growth over last 7 days:

```sql
SELECT * FROM get_table_size_growth();
```

### record_table_sizes

Records current table sizes:

```sql
SELECT * FROM record_table_sizes();
```

---

## 📊 Prometheus Metrics

Database metrics exposed via `/api/metrics`:

- `db_query_duration_seconds` - Query execution time histogram
- `db_queries_total` - Total query count
- `db_connection_pool_size` - Connection pool size gauge

### Example Queries

```promql
# Average query time by table
rate(db_query_duration_seconds_sum[5m]) / rate(db_query_duration_seconds_count[5m])

# Slow queries (>1s)
histogram_quantile(0.95, db_query_duration_seconds_bucket) > 1

# Connection pool usage
db_connection_pool_size / max_connections * 100
```

---

## 🚨 Alerts

### Slow Query Alert

- **Trigger:** Query execution time > 5 seconds
- **Severity:** Critical
- **Cooldown:** 15 minutes

### Connection Pool High

- **Trigger:** Connection pool usage > 80%
- **Severity:** Warning
- **Cooldown:** 30 minutes

### Table Size Growth

- **Trigger:** Table growth > 10% per week
- **Severity:** Warning
- **Cooldown:** 24 hours

---

## ⚙️ Configuration

### Environment Variables

```env
# No additional env vars required
# Uses existing Supabase connection
```

### Thresholds

Configure in `lib/monitoring/database-monitor.ts`:

```typescript
private slowQueryThresholdMs: number = 1000; // 1 second
private connectionPoolThresholdPercent: number = 80;
private tableGrowthThresholdPercent: number = 10;
```

---

## 🎯 Best Practices

1. **Monitor slow queries regularly:**
   - Review slow query summary weekly
   - Add indexes for frequently slow queries
   - Optimize query patterns

2. **Track connection pool:**
   - Monitor connection usage trends
   - Scale connection pool if needed
   - Investigate connection leaks

3. **Monitor table growth:**
   - Set up archival for large tables
   - Partition tables if needed
   - Clean up old data regularly

4. **Use query hashing:**
   - Normalize queries before hashing
   - Group similar queries together
   - Identify query patterns

---

## 📈 Optimization Tips

### Adding Indexes

Common indexes to add:

```sql
-- For article queries
CREATE INDEX IF NOT EXISTS idx_articles_status_created 
ON articles(status, created_at DESC);

-- For product searches
CREATE INDEX IF NOT EXISTS idx_products_category_active 
ON products(category, active) WHERE active = true;

-- For analytics queries
CREATE INDEX IF NOT EXISTS idx_article_views_date_article 
ON article_views(viewed_at DESC, article_id);
```

### Query Optimization

1. **Use EXPLAIN ANALYZE:**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM articles WHERE status = 'published';
   ```

2. **Avoid N+1 queries:**
   - Use JOINs instead of multiple queries
   - Use batch loading where possible

3. **Limit result sets:**
   - Use LIMIT and OFFSET
   - Paginate large result sets

---

## 📊 Database Tables

### query_performance_log

Stores individual query performance logs:
- `query_hash` - Hash of normalized query
- `query_text` - Full query text
- `execution_time_ms` - Execution time
- `table_name` - Table being queried

### slow_query_summary

Aggregated slow query summary:
- `query_hash` - Unique query identifier
- `avg_execution_time_ms` - Average execution time
- `call_count` - Number of times executed
- `last_seen` - Last occurrence timestamp

### table_size_history

Historical table size tracking:
- `table_name` - Table name
- `total_size_bytes` - Total size
- `recorded_at` - Recording timestamp

---

## 📈 Next Steps

- ✅ Slow query logging implemented
- ✅ Connection pool monitoring implemented
- ✅ Table size tracking implemented
- ✅ Alerts configured
- ✅ Performance dashboard API created
- 🔄 **Next:** Phase 4 - Polish & Documentation

---

**Questions?** Check the code in `lib/monitoring/database-monitor.ts` and `supabase/migrations/20260119_query_optimization.sql`
