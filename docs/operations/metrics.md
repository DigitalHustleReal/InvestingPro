# Application Metrics Setup

This document describes how to set up and use Prometheus metrics for your application.

## 🎯 Overview

Prometheus metrics provide:
- ✅ Real-time performance data
- ✅ Historical trends
- ✅ Alerting capabilities
- ✅ **100% FREE** (self-hosted)

**Metrics Tracked:**
- API requests (rate, latency, errors)
- Database queries (duration, count)
- AI provider usage (costs, latency)
- Workflow executions
- Cache performance
- Business metrics (articles, clicks)

---

## 🚀 Quick Setup

### Step 1: Install Prometheus Client

```bash
npm install prom-client
```

### Step 2: Metrics Endpoint

Metrics are automatically exposed at:
```
GET /api/metrics
```

**Example:**
```bash
curl http://localhost:3000/api/metrics
```

---

## 📊 Available Metrics

### API Metrics

```
# Total HTTP requests
http_requests_total{method="GET",path="/api/articles",status_code="200"}

# Request duration (histogram)
http_request_duration_seconds{method="GET",path="/api/articles",status_code="200"}

# Request errors
http_request_errors_total{method="GET",path="/api/articles",status_code="500"}
```

### Database Metrics

```
# Query duration
db_query_duration_seconds{table="articles",operation="SELECT"}

# Query count
db_queries_total{table="articles",operation="SELECT"}

# Connection pool size
db_connection_pool_size
```

### AI Provider Metrics

```
# AI requests
ai_provider_requests_total{provider="openai",operation="generate",status="success"}

# AI request duration
ai_provider_duration_seconds{provider="openai",operation="generate"}

# AI costs (in USD cents)
ai_provider_cost_total{provider="openai",operation="generate"}
```

### Workflow Metrics

```
# Workflow executions
workflow_executions_total{workflow_type="content-generation",status="success"}

# Workflow duration
workflow_duration_seconds{workflow_type="content-generation"}
```

### Cache Metrics

```
# Cache hits
cache_hits_total{cache_type="default"}

# Cache misses
cache_misses_total{cache_type="default"}

# Cache size
cache_size_bytes{cache_type="default"}
```

---

## 🔧 Using Metrics in Code

### Record API Request

```typescript
import { recordAPIRequest } from '@/lib/metrics/prometheus';

// After handling request
recordAPIRequest('GET', '/api/articles', 200, 0.15); // duration in seconds
```

### Record Database Query

```typescript
import { recordDBQuery } from '@/lib/metrics/prometheus';

// After executing query
recordDBQuery('articles', 'SELECT', 0.05); // duration in seconds
```

### Record AI Provider Request

```typescript
import { recordAIRequest } from '@/lib/metrics/prometheus';

// After AI call
recordAIRequest('openai', 'generate', 2.5, 5); // duration, cost in cents
```

### Record Workflow

```typescript
import { recordWorkflow } from '@/lib/metrics/prometheus';

// After workflow completes
recordWorkflow('content-generation', 120, true); // duration, success
```

---

## 📈 Viewing Metrics

### Option 1: Direct Access (Simple)

```bash
# View metrics
curl http://localhost:3000/api/metrics

# Filter specific metric
curl http://localhost:3000/api/metrics | grep http_requests_total
```

### Option 2: Prometheus (Self-Hosted - FREE)

1. **Install Prometheus:**
   ```bash
   # Download from https://prometheus.io/download/
   # Or use Docker:
   docker run -d -p 9090:9090 prom/prometheus
   ```

2. **Configure Prometheus** (`prometheus.yml`):
   ```yaml
   scrape_configs:
     - job_name: 'investingpro-api'
       static_configs:
         - targets: ['localhost:3000']
       metrics_path: '/api/metrics'
   ```

3. **Access Prometheus UI:**
   - Go to http://localhost:9090
   - Query: `http_requests_total`
   - Query: `rate(http_requests_total[5m])`

### Option 3: Grafana Dashboard (FREE)

1. **Install Grafana:**
   ```bash
   docker run -d -p 3001:3000 grafana/grafana
   ```

2. **Add Prometheus as data source:**
   - URL: `http://prometheus:9090`
   - Access: Server

3. **Create dashboard:**
   - Import Prometheus metrics
   - Create visualizations

---

## 🎯 Prometheus Queries

### Request Rate (requests per second)

```
rate(http_requests_total[5m])
```

### Error Rate

```
rate(http_request_errors_total[5m]) / rate(http_requests_total[5m]) * 100
```

### P95 Latency

```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### AI Provider Costs (last hour)

```
increase(ai_provider_cost_total[1h]) / 100
```

### Cache Hit Rate

```
rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m])) * 100
```

---

## 🔧 Integration with Existing Code

### Automatic Integration

The existing `lib/middleware/metrics.ts` automatically records to Prometheus when you use `recordAPIMetrics()`.

### Manual Recording

For custom metrics, use the Prometheus helpers directly:

```typescript
import { recordAPIRequest, recordDBQuery, recordAIRequest } from '@/lib/metrics/prometheus';

// In your code
recordAPIRequest('POST', '/api/articles', 201, 0.25);
recordDBQuery('articles', 'INSERT', 0.1);
recordAIRequest('openai', 'generate', 2.0, 10, true);
```

---

## 📊 Admin Dashboard Integration

Add metrics to your admin dashboard:

```typescript
// In app/admin/metrics/page.tsx
import { getMetrics } from '@/lib/metrics/prometheus';

const metrics = await getMetrics();
// Display metrics in UI
```

---

## 🔒 Security

### Production Recommendations

1. **Add authentication** to `/api/metrics`:
   ```typescript
   // In app/api/metrics/route.ts
   const authHeader = request.headers.get('authorization');
   if (authHeader !== `Bearer ${process.env.METRICS_TOKEN}`) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

2. **IP whitelist** (if self-hosting Prometheus):
   ```typescript
   const clientIp = request.headers.get('x-forwarded-for');
   const allowedIPs = process.env.METRICS_ALLOWED_IPS?.split(',') || [];
   if (!allowedIPs.includes(clientIp)) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
   }
   ```

---

## 🎯 Best Practices

1. **Use labels wisely:**
   - Don't add high-cardinality labels (user IDs, etc.)
   - Use normalized paths (replace IDs with `:id`)

2. **Set appropriate buckets:**
   - Histogram buckets should match your expected values
   - Too many buckets = more memory

3. **Monitor metric cardinality:**
   - Too many unique label combinations = performance issues
   - Keep labels to essential dimensions

---

## 📈 Next Steps

- ✅ Prometheus metrics implemented
- 🔄 **Next:** Task 6.1 - Enhanced Error Handling
- ⏸️ Task 6.2 - Health Checks

---

**Questions?** Check the code in `lib/metrics/prometheus.ts` or `app/api/metrics/route.ts`
