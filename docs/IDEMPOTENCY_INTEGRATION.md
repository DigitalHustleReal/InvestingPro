# Idempotency Integration Guide

## Overview

The InvestingPro platform has idempotency middleware (`lib/middleware/idempotency.ts`) but it's not yet applied to critical API endpoints. This guide shows how to integrate it.

---

## Current State

**Idempotency Middleware:** ✅ Exists at `lib/middleware/idempotency.ts`

**API Wrapper:** Most endpoints use `createAPIWrapper` from `lib/middleware/api-wrapper.ts`

**Status:** Middleware exists but not integrated into endpoints

---

## Critical Endpoints Requiring Idempotency

### High Priority (Prevent Duplicate Operations)

1. **Article Generation**
   - `/api/articles/generate-comprehensive` - Prevents duplicate article creation
   - `/api/cms/bulk-generate` - Prevents duplicate bulk operations

2. **Workflow Operations**
   - `/api/workflows/start` - Prevents duplicate workflow starts
   - `/api/workflows/schedule` - Prevents duplicate scheduling

3. **Automation Control**
   - `/api/v1/admin/automation/pause` - Prevents duplicate pause commands
   - `/api/v1/admin/automation/resume` - Prevents duplicate resume commands

### Medium Priority

4. **Content Operations**
   - `/api/social/generate` - Prevents duplicate social posts
   - `/api/titles/generate` - Prevents duplicate title generation

5. **Analytics**
   - `/api/analytics/track` - Prevents duplicate event tracking
   - `/api/affiliate/track` - Prevents duplicate affiliate tracking

---

## Integration Methods

### Method 1: Modify `createAPIWrapper` (Recommended)

Add idempotency support directly to the API wrapper:

```typescript
// lib/middleware/api-wrapper.ts

import { withIdempotency } from './idempotency';

export function createAPIWrapper(
    path: string,
    options: {
        rateLimitType?: string;
        trackMetrics?: boolean;
        idempotent?: boolean; // NEW OPTION
        idempotencyTTL?: number; // NEW OPTION
    } = {}
) {
    return (handler: any) => {
        let wrappedHandler = handler;
        
        // Apply idempotency if requested
        if (options.idempotent) {
            wrappedHandler = withIdempotency(wrappedHandler, {
                ttl: options.idempotencyTTL || 3600
            });
        }
        
        // Apply other middleware (rate limiting, metrics, etc.)
        // ... existing code
        
        return wrappedHandler;
    };
}
```

**Usage:**
```typescript
// app/api/articles/generate-comprehensive/route.ts
export const POST = createAPIWrapper('/api/articles/generate-comprehensive', {
    rateLimitType: 'ai',
    trackMetrics: true,
    idempotent: true, // Enable idempotency
    idempotencyTTL: 86400 // 24 hours
})(
    // ... handler
);
```

---

### Method 2: Wrap Individual Endpoints

Apply `withIdempotency` directly to critical endpoints:

```typescript
// app/api/articles/generate-comprehensive/route.ts
import { withIdempotency } from '@/lib/middleware/idempotency';

export const POST = withIdempotency(
    createAPIWrapper('/api/articles/generate-comprehensive', {
        rateLimitType: 'ai',
        trackMetrics: true,
    })(
        // ... handler
    ),
    { ttl: 86400 } // 24 hours
);
```

---

## Client-Side Integration

Clients must send `Idempotency-Key` header:

```typescript
// Example: Generate article with idempotency
async function generateArticle(topic: string) {
    const idempotencyKey = `article-${topic}-${Date.now()}`;
    
    const response = await fetch('/api/articles/generate-comprehensive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({ topic })
    });
    
    return response.json();
}
```

**Helper Function:**
```typescript
// lib/utils/idempotency.ts
export function generateIdempotencyKey(operation: string, params?: Record<string, any>): string {
    const timestamp = Date.now();
    const paramsHash = params ? JSON.stringify(params) : '';
    return `${operation}-${paramsHash}-${timestamp}`;
}
```

---

## Testing Idempotency

### Test Script

```typescript
// scripts/test-idempotency.ts
import { generateIdempotencyKey } from '@/lib/utils/idempotency';

async function testIdempotency() {
    const key = generateIdempotencyKey('article-generation', { topic: 'test' });
    
    console.log('Test 1: First request (should create article)');
    const response1 = await fetch('http://localhost:3000/api/articles/generate-comprehensive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': key
        },
        body: JSON.stringify({ topic: 'Test Article' })
    });
    const result1 = await response1.json();
    console.log('Response 1:', result1);
    
    console.log('\nTest 2: Duplicate request (should return cached response)');
    const response2 = await fetch('http://localhost:3000/api/articles/generate-comprehensive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': key
        },
        body: JSON.stringify({ topic: 'Test Article' })
    });
    const result2 = await response2.json();
    console.log('Response 2:', result2);
    console.log('X-Idempotent-Replayed header:', response2.headers.get('X-Idempotent-Replayed'));
    
    // Verify responses are identical
    console.log('\nVerification:');
    console.log('Responses identical:', JSON.stringify(result1) === JSON.stringify(result2));
    console.log('Second response was replayed:', response2.headers.get('X-Idempotent-Replayed') === 'true');
}

testIdempotency().catch(console.error);
```

**Run test:**
```bash
npx tsx scripts/test-idempotency.ts
```

---

## Implementation Checklist

### Phase 1: Infrastructure (1 hour)
- [ ] Add `idempotent` option to `createAPIWrapper`
- [ ] Create `generateIdempotencyKey` helper function
- [ ] Test idempotency middleware with sample endpoint

### Phase 2: Critical Endpoints (2 hours)
- [ ] Enable idempotency for article generation endpoints
- [ ] Enable idempotency for workflow endpoints
- [ ] Enable idempotency for automation control endpoints
- [ ] Test each endpoint with duplicate requests

### Phase 3: Client Integration (1 hour)
- [ ] Add idempotency key generation to admin panel
- [ ] Update API client to include idempotency keys
- [ ] Document idempotency usage for developers

### Phase 4: Monitoring (1 hour)
- [ ] Add metrics for idempotent request rate
- [ ] Add logging for cached responses
- [ ] Set up alerts for high idempotent replay rate

---

## Success Criteria

- ✅ All critical endpoints support idempotency
- ✅ Duplicate requests return cached responses
- ✅ `X-Idempotent-Replayed: true` header present on cached responses
- ✅ No duplicate articles created from retry attempts
- ✅ Redis cache stores responses for configured TTL
- ✅ Test script passes all idempotency checks

---

## Monitoring

### Metrics to Track

1. **Idempotent Request Rate**
   - Percentage of requests with `Idempotency-Key` header
   - Target: >80% for critical endpoints

2. **Cache Hit Rate**
   - Percentage of idempotent requests served from cache
   - Indicates retry behavior

3. **Duplicate Prevention**
   - Number of duplicate operations prevented
   - Measure cost savings from prevented duplicate AI calls

### Logs to Monitor

```typescript
// Example log entries
logger.info('Idempotent request - returning cached response', {
    key: idempotencyKey,
    path: request.nextUrl.pathname,
    cacheAge: cacheAgeSeconds
});

logger.info('Cached idempotent response', {
    key: idempotencyKey,
    path: request.nextUrl.pathname,
    ttl: 3600
});
```

---

## Troubleshooting

### Issue: Idempotency not working

**Symptoms:** Duplicate requests create duplicate resources

**Checks:**
1. Verify `Idempotency-Key` header is being sent
2. Check Redis is available and connected
3. Verify idempotency middleware is applied to endpoint
4. Check logs for idempotency errors

**Solution:**
```bash
# Check Redis connection
redis-cli ping

# Check idempotency cache keys
redis-cli keys "idempotency:*"

# Check specific key
redis-cli get "idempotency:/api/articles/generate:your-key-here"
```

### Issue: Cached responses too old

**Symptoms:** Stale data returned from cache

**Solution:** Adjust TTL based on endpoint:
- Article generation: 24 hours (86400s)
- Workflow operations: 1 hour (3600s)
- Analytics tracking: 5 minutes (300s)

---

## Next Steps

1. **Immediate:** Implement Method 1 (modify `createAPIWrapper`)
2. **Week 1:** Enable idempotency for all critical endpoints
3. **Week 2:** Monitor idempotent request rate and cache hit rate
4. **Month 1:** Expand to all POST/PUT/PATCH endpoints

---

## References

- Idempotency Middleware: `lib/middleware/idempotency.ts`
- API Wrapper: `lib/middleware/api-wrapper.ts`
- Production Readiness Audit: `PRODUCTION_READINESS_AUDIT.md`
