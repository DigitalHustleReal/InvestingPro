# Error Handling Guide

This document describes the standardized error handling system.

## 🎯 Overview

The application uses a centralized error handling system that provides:
- ✅ Consistent error format across all APIs
- ✅ Automatic error mapping and logging
- ✅ Correlation IDs for tracing
- ✅ Retry strategies for recoverable errors
- ✅ Circuit breaker pattern for external services

---

## 📋 Error Types

### Client Errors (4xx)

```typescript
import {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    RateLimitError,
} from '@/lib/errors/types';

// Validation error
throw new ValidationError('Invalid email format', {
    field: 'email',
    value: 'invalid-email',
    reason: 'Must be a valid email address',
});

// Not found
throw new NotFoundError('Article', articleId);

// Unauthorized
throw new UnauthorizedError('Invalid or expired token');

// Forbidden
throw new ForbiddenError('You do not have permission to access this resource');

// Conflict
throw new ConflictError('Article slug already exists', {
    field: 'slug',
    existingId: existingArticle.id,
});

// Rate limit
throw new RateLimitError('Too many requests', 60); // retry after 60 seconds
```

### Server Errors (5xx)

```typescript
import {
    InternalError,
    ServiceUnavailableError,
    ExternalServiceError,
    DatabaseError,
    WorkflowError,
    AIProviderError,
    TimeoutError,
} from '@/lib/errors/types';

// Internal error
throw new InternalError('Failed to process request', originalError);

// Service unavailable
throw new ServiceUnavailableError('Service temporarily unavailable', 300);

// External service error
throw new ExternalServiceError('OpenAI', 'API rate limit exceeded', originalError);

// Database error
throw new DatabaseError('Connection pool exhausted', originalError);

// Workflow error
throw new WorkflowError(workflowId, 'Step failed', originalError);

// AI provider error
throw new AIProviderError('openai', 'Model not available', originalError);

// Timeout
throw new TimeoutError('AI generation', 30000);
```

---

## 🔧 Using Error Handler

### In API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/errors/handler';
import { NotFoundError, ValidationError } from '@/lib/errors/types';

export const GET = withErrorHandler(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        throw new ValidationError('Missing required parameter: id');
    }

    const article = await getArticle(id);
    if (!article) {
        throw new NotFoundError('Article', id);
    }

    return NextResponse.json({ article });
});
```

### Manual Error Handling

```typescript
import { handleError } from '@/lib/errors/handler';

export async function POST(request: NextRequest) {
    try {
        // Your logic here
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleError(error, request);
    }
}
```

---

## 🔄 Retry Strategies

### Basic Retry with Backoff

```typescript
import { retryWithBackoff } from '@/lib/errors/recovery';

const result = await retryWithBackoff(
    async () => {
        return await externalApiCall();
    },
    {
        maxRetries: 3,
        initialDelayMs: 1000,
        maxDelayMs: 10000,
        backoffMultiplier: 2,
    }
);
```

### Circuit Breaker

```typescript
import { CircuitBreaker } from '@/lib/errors/recovery';

const breaker = new CircuitBreaker(5, 60000); // 5 failures, 60s timeout

try {
    const result = await breaker.execute(async () => {
        return await externalApiCall();
    });
} catch (error) {
    // Circuit breaker is open - service unavailable
}
```

### Timeout Protection

```typescript
import { withTimeout } from '@/lib/errors/recovery';

const result = await withTimeout(
    async () => {
        return await slowOperation();
    },
    5000, // 5 second timeout
    'Operation took too long'
);
```

### Fallback Values

```typescript
import { withFallback } from '@/lib/errors/recovery';

const result = await withFallback(
    async () => await primaryOperation(),
    async () => await fallbackOperation(), // or static value
    true // log error
);
```

### Graceful Degradation

```typescript
import { gracefulDegradation } from '@/lib/errors/recovery';

const result = await gracefulDegradation(
    async () => await primaryService(),
    async () => await secondaryService(),
    true // log error
);
```

---

## 📊 Error Response Format

All errors follow this format:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid email format",
        "statusCode": 400,
        "correlationId": "abc-123-def-456",
        "requestId": "req-789",
        "details": {
            "field": "email",
            "value": "invalid-email",
            "reason": "Must be a valid email address"
        },
        "timestamp": "2026-01-15T10:30:00.000Z"
    }
}
```

### Response Headers

- `X-Correlation-ID`: Request correlation ID
- `X-Request-ID`: Unique request ID
- `X-Error-Code`: Error code for programmatic handling

---

## 🔍 Error Logging

All errors are automatically logged with:
- Error code and message
- Correlation ID and request ID
- Request path and method
- Error details
- Stack trace (in development)
- Retryability flag

Example log entry:
```json
{
    "level": "error",
    "message": "API Error",
    "code": "VALIDATION_ERROR",
    "statusCode": 400,
    "path": "/api/articles",
    "method": "POST",
    "correlationId": "abc-123",
    "requestId": "req-789",
    "details": { "field": "email" }
}
```

---

## ✅ Best Practices

1. **Use specific error types:**
   ```typescript
   // ✅ Good
   throw new NotFoundError('Article', id);
   
   // ❌ Bad
   throw new Error('Not found');
   ```

2. **Include correlation IDs:**
   - Automatically added by error handler
   - Use for tracing across services

3. **Mark retryable errors:**
   ```typescript
   // Automatically marked as retryable
   throw new ExternalServiceError('OpenAI', 'Rate limit', error);
   ```

4. **Use recovery strategies:**
   ```typescript
   // For external services
   await retryWithBackoff(() => externalCall());
   
   // For critical operations
   await gracefulDegradation(primary, fallback);
   ```

5. **Don't expose internal details:**
   - Error handler automatically hides stack traces in production
   - Only expose safe error messages

---

## 🎯 Error Code Reference

| Code | Status | Retryable | Description |
|------|--------|-----------|-------------|
| `VALIDATION_ERROR` | 400 | No | Invalid input |
| `NOT_FOUND` | 404 | No | Resource not found |
| `UNAUTHORIZED` | 401 | No | Authentication required |
| `FORBIDDEN` | 403 | No | Access denied |
| `CONFLICT` | 409 | No | Resource conflict |
| `RATE_LIMITED` | 429 | Yes | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | No | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Yes | Service temporarily unavailable |
| `EXTERNAL_SERVICE_ERROR` | 502 | Yes | External service error |
| `DATABASE_ERROR` | 500 | Yes | Database operation failed |
| `WORKFLOW_ERROR` | 500 | Yes | Workflow execution failed |
| `AI_PROVIDER_ERROR` | 502 | Yes | AI provider error |
| `TIMEOUT_ERROR` | 504 | Yes | Operation timed out |

---

## 📈 Next Steps

- ✅ Standardized error types implemented
- ✅ Error handler middleware created
- ✅ Recovery strategies available
- 🔄 **Next:** Task 6.2 - Health Checks & Readiness Probes

---

**Questions?** Check the code in `lib/errors/` directory
