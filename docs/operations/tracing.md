# Distributed Tracing Setup

This document describes how to set up distributed tracing with OpenTelemetry and Axiom.

## 🎯 Overview

Distributed tracing tracks requests across your entire application, showing:
- API request flow
- Database queries
- AI service calls
- Workflow execution
- External API calls

**Benefits:**
- ✅ Debug slow requests
- ✅ Find bottlenecks
- ✅ Trace errors across services
- ✅ Understand request flow

---

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
npm install @opentelemetry/sdk-node @opentelemetry/api @opentelemetry/exporter-otlp-http @opentelemetry/auto-instrumentations-node @opentelemetry/resources @opentelemetry/semantic-conventions
```

### Step 2: Configure Environment Variables

Add to `.env.local` (or Vercel environment variables):

```env
# Enable OpenTelemetry tracing
OTEL_ENABLED=true

# Axiom OTLP endpoint (for traces)
AXIOM_OTLP_ENDPOINT=https://api.axiom.co/v1/traces

# Axiom API key (same as logging)
AXIOM_API_KEY=your-api-key-here

# Service information (optional)
SERVICE_NAME=investingpro-api
SERVICE_VERSION=1.0.0
```

### Step 3: Restart Application

Tracing is automatically initialized on app startup. No code changes needed!

---

## 📊 Viewing Traces in Axiom

1. **Go to Axiom Dashboard** → Traces
2. **Query traces:**
   - By correlation ID: `correlation.id = 'req-123'`
   - By user: `user.id = 'user-456'`
   - By route: `http.route = 'GET /api/articles'`
   - Errors only: `status.code = 'ERROR'`

3. **View trace details:**
   - See all spans in a request
   - View timing for each operation
   - Check attributes and events

---

## 🔧 Using Tracing in Code

### Automatic Instrumentation

Most operations are automatically traced:
- ✅ HTTP requests (Next.js API routes)
- ✅ Database queries (if using instrumented client)
- ✅ External HTTP calls (fetch, axios)

### Manual Tracing

For custom operations, use the tracing helpers:

```typescript
import { withSpan, addSpanEvent, setSpanAttribute } from '@/lib/tracing/opentelemetry';

// Wrap an operation
const result = await withSpan('process-payment', async (span) => {
    span.setAttribute('payment.amount', amount);
    span.setAttribute('payment.currency', 'USD');
    
    // Your code here
    const payment = await processPayment(data);
    
    addSpanEvent('payment.processed', {
        payment_id: payment.id,
    });
    
    return payment;
});
```

### Add Events to Current Span

```typescript
import { addSpanEvent, setSpanAttribute } from '@/lib/tracing/opentelemetry';

// Add event
addSpanEvent('cache.miss', { key: 'user-123' });

// Set attribute
setSpanAttribute('cache.hit', false);
```

---

## 🎯 Tracing API Routes

### Option 1: Use Tracing Middleware (Recommended)

```typescript
import { withTracing } from '@/lib/middleware/tracing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Handler automatically wrapped with tracing
    return withTracing(async (req) => {
        // Your route logic
        return NextResponse.json({ data: 'result' });
    }, 'GET /api/articles')(request);
}
```

### Option 2: Manual Span Creation

```typescript
import { withSpan } from '@/lib/tracing/opentelemetry';

export async function GET(request: NextRequest) {
    return withSpan('get-articles', async (span) => {
        span.setAttribute('article.count', 10);
        
        const articles = await getArticles();
        return NextResponse.json(articles);
    });
}
```

---

## 📈 Trace Attributes

Each span automatically includes:

- **HTTP attributes:**
  - `http.method` - Request method
  - `http.url` - Request URL
  - `http.status_code` - Response status
  - `http.duration_ms` - Request duration

- **Request context:**
  - `correlation.id` - Correlation ID
  - `request.id` - Request ID
  - `user.id` - User ID (if authenticated)

- **Service information:**
  - `service.name` - Service name
  - `service.version` - Service version
  - `deployment.environment` - Environment (production/staging/dev)

---

## 🔍 Querying Traces

### Find Traces by Correlation ID

```
correlation.id = 'req-123'
```

### Find Slow Requests (>1 second)

```
http.duration_ms > 1000
```

### Find Errors

```
status.code = 'ERROR'
```

### Find Traces for Specific User

```
user.id = 'user-456'
```

### Find Traces for Specific Route

```
http.route = 'GET /api/articles'
```

---

## 🎨 Trace Visualization

In Axiom dashboard, you can:

1. **View trace timeline:**
   - See all spans in chronological order
   - Identify slow operations
   - Find bottlenecks

2. **Drill down into spans:**
   - View span attributes
   - See events
   - Check errors

3. **Compare traces:**
   - Compare slow vs fast requests
   - Identify performance regressions

---

## 🔧 Configuration

### Disable Tracing

Set `OTEL_ENABLED=false` or remove the environment variable.

### Custom Endpoint

If not using Axiom, set `OTEL_EXPORTER_OTLP_ENDPOINT`:

```env
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-tracing-backend.com/v1/traces
```

### Sampling

By default, all traces are sent. To sample (reduce volume):

```typescript
// In lib/tracing/opentelemetry.ts
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

sdk = new NodeSDK({
    // ... other config
    sampler: new TraceIdRatioBasedSampler(0.1), // Sample 10% of traces
});
```

---

## 🚨 Best Practices

1. **Use correlation IDs:**
   - Automatically added by middleware
   - Links traces to logs

2. **Add meaningful attributes:**
   - Include relevant context
   - Don't add sensitive data

3. **Keep spans focused:**
   - One span per logical operation
   - Don't create too many nested spans

4. **Use events for milestones:**
   - Cache hits/misses
   - Important state changes
   - User actions

---

## 📊 Integration with Logging

Traces are automatically linked to logs via correlation IDs:

1. **Find logs for a trace:**
   - Get correlation ID from trace
   - Query logs: `['correlationId'] = 'req-123'`

2. **Find trace for a log:**
   - Get correlation ID from log
   - Query traces: `correlation.id = 'req-123'`

---

## 🎯 Next Steps

- ✅ Distributed tracing implemented
- 🔄 **Next:** Task 5.2 - Application Metrics
- ⏸️ Task 6.1 - Enhanced Error Handling

---

**Questions?** Check the code in `lib/tracing/opentelemetry.ts` or `lib/middleware/tracing.ts`
