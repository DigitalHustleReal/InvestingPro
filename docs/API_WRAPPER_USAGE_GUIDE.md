# 📘 API Wrapper Usage Guide

**Purpose:** How to use the API wrapper for new routes  
**Target:** Consistent API route implementation

---

## 🎯 Overview

The API wrapper (`lib/middleware/api-wrapper.ts`) combines:
- Rate limiting
- Metrics tracking
- Error handling
- Request validation (optional)
- Authentication (optional)

---

## 📝 Basic Usage

### Simple Route (No Validation)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';

export const GET = createAPIWrapper('/api/your-route', {
    rateLimitType: 'public',
    trackMetrics: true,
})(async (request: NextRequest) => {
    // Your handler code
    return NextResponse.json({ success: true });
});
```

---

## 🔒 With Validation

### Query Parameters Only

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { yourQuerySchema } from '@/lib/validation/schemas';

export const GET = createAPIWrapper('/api/your-route', {
    rateLimitType: 'public',
    trackMetrics: true,
})(
    withValidation(undefined, yourQuerySchema)(
        async (request: NextRequest, _body: unknown, query: any) => {
            // Query parameters are already validated
            const { page, limit } = query;
            
            // Your handler code
            return NextResponse.json({ success: true });
        }
    )
);
```

### Request Body Only

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { yourBodySchema } from '@/lib/validation/schemas';

export const POST = createAPIWrapper('/api/your-route', {
    rateLimitType: 'public',
    trackMetrics: true,
})(
    withValidation(yourBodySchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
            // Body is already validated
            const { email, name } = body;
            
            // Your handler code
            return NextResponse.json({ success: true });
        }
    )
);
```

### Both Body and Query

```typescript
export const POST = createAPIWrapper('/api/your-route', {
    rateLimitType: 'public',
    trackMetrics: true,
})(
    withValidation(yourBodySchema, yourQuerySchema)(
        async (request: NextRequest, body: any, query: any) => {
            // Both body and query validated
            // Your handler code
            return NextResponse.json({ success: true });
        }
    )
);
```

---

## 🔐 Rate Limit Types

### Public APIs
```typescript
rateLimitType: 'public'  // 100 req/min
```

**Use for:**
- Public article/product listings
- Search
- Newsletter signup
- Public content

---

### Authenticated APIs
```typescript
rateLimitType: 'authenticated'  // 1000 req/min
```

**Use for:**
- User bookmarks
- User preferences
- User data access

---

### Admin APIs
```typescript
rateLimitType: 'admin'  // 5000 req/min
```

**Use for:**
- Admin dashboard
- Admin analytics
- Admin operations

---

### AI APIs
```typescript
rateLimitType: 'ai'  // 10 req/min
```

**Use for:**
- Content generation
- AI-powered features
- Expensive operations

---

## ✅ Authentication

### Require Authentication

```typescript
export const GET = createAPIWrapper('/api/your-route', {
    rateLimitType: 'authenticated',
    requireAuth: true,  // Enables auth check
    trackMetrics: true,
})(async (request: NextRequest) => {
    // User is authenticated (checked by wrapper)
    // Your handler code
    return NextResponse.json({ success: true });
});
```

**Note:** Auth check implementation is ready but needs to be completed in `api-wrapper.ts`.

---

## 📊 Metrics Tracking

### Automatic Tracking

Metrics are automatically tracked when `trackMetrics: true`:

- API latency (p50, p95, p99)
- Error rates
- Throughput
- Request counts by status/path

**View metrics:**
- Dashboard: `/admin/metrics`
- API: `/api/metrics`

---

## 🚨 Error Handling

### Automatic Error Handling

Errors are automatically:
- Logged with correlation IDs
- Sent to Sentry
- Returned as standardized responses

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### Custom Error Handling

```typescript
try {
    // Your code
} catch (error) {
    logger.error('Custom error', error instanceof Error ? error : new Error(String(error)));
    throw error; // Let wrapper handle response
}
```

---

## 📋 Creating Validation Schemas

### Add to `lib/validation/schemas.ts`

```typescript
import { z } from 'zod';

export const yourRouteSchema = z.object({
    // Define your schema
    email: z.string().email(),
    name: z.string().min(1).max(100),
    age: z.number().int().min(0).max(120).optional(),
});
```

---

## 🎯 Complete Example

### Full-Featured Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { yourRouteSchema } from '@/lib/validation/schemas';
import { logger } from '@/lib/logger';

export const POST = createAPIWrapper('/api/your-route', {
    rateLimitType: 'public',
    trackMetrics: true,
    requireAuth: false, // Set to true if auth needed
})(
    withValidation(yourRouteSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
            try {
                // Body is already validated
                const { email, name } = body;
                
                // Your business logic
                logger.info('Processing request', { email });
                
                // Return response
                return NextResponse.json({ 
                    success: true,
                    data: { email, name }
                });
            } catch (error) {
                logger.error('Route error', error instanceof Error ? error : new Error(String(error)));
                throw error; // Let wrapper handle error response
            }
        }
    )
);
```

---

## ✅ Best Practices

### 1. Always Use Wrapper

**Do:**
```typescript
export const GET = createAPIWrapper('/api/route', {...})(...)
```

**Don't:**
```typescript
export async function GET(request: NextRequest) { ... }
```

---

### 2. Use Validation

**Do:**
- Validate all user input
- Use Zod schemas
- Return validation errors

**Don't:**
- Trust user input
- Skip validation
- Return generic errors

---

### 3. Error Handling

**Do:**
- Let wrapper handle errors
- Log errors with context
- Use correlation IDs

**Don't:**
- Catch and swallow errors
- Return custom error formats
- Skip error logging

---

### 4. Rate Limiting

**Do:**
- Choose appropriate rate limit type
- Monitor rate limit violations
- Adjust limits based on usage

**Don't:**
- Use 'public' for expensive operations
- Use 'ai' for simple operations
- Ignore rate limit errors

---

## 📖 Related Documentation

- **Validation Schemas:** `lib/validation/schemas.ts`
- **API Wrapper:** `lib/middleware/api-wrapper.ts`
- **Rate Limiting:** `lib/middleware/rate-limit.ts`
- **Metrics:** `lib/middleware/metrics.ts`

---

*Last Updated: January 13, 2026*
