# API Contracts Documentation

## Overview

This document defines the API contracts for all InvestingPro platform endpoints.

---

## Base URL

- **Production**: `https://investingpro.in/api`
- **Staging**: `https://staging.investingpro.in/api`
- **Development**: `http://localhost:3000/api`

---

## Authentication

All admin endpoints require authentication via Supabase JWT token.

**Header:**
```
Authorization: Bearer <jwt_token>
```

---

## Common Response Format

### Success Response
```typescript
{
    success: true,
    data: any,
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        has_more: boolean;
    }
}
```

### Error Response
```typescript
{
    success: false,
    error: {
        code: string;
        message: string;
        details?: any;
    }
}
```

---

## Article APIs

### Create Article

**Endpoint:** `POST /api/v1/articles`

**Request:**
```typescript
{
    title: string;
    slug: string;
    category: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    language?: string;
}
```

**Response:**
```typescript
{
    success: true,
    data: {
        id: string;
        title: string;
        slug: string;
        status: 'draft';
        created_at: string;
    }
}
```

### Get Article

**Endpoint:** `GET /api/v1/articles/[id]`

**Response:**
```typescript
{
    success: true,
    data: {
        id: string;
        title: string;
        slug: string;
        content: string;
        status: string;
        category: string;
        // ... other fields
    }
}
```

### Update Article Status

**Endpoint:** `PATCH /api/v1/articles/[id]/status`

**Request:**
```typescript
{
    status: 'review' | 'published' | 'archived' | 'draft';
    reason?: string;
}
```

**Response:**
```typescript
{
    success: true,
    data: {
        id: string;
        status: string;
        updated_at: string;
    }
}
```

### Get Article Versions

**Endpoint:** `GET /api/v1/articles/[id]/versions`

**Response:**
```typescript
{
    success: true,
    data: {
        versions: Array<{
            id: string;
            version_number: number;
            created_at: string;
            created_by: string;
            change_summary?: string;
        }>;
        pagination: {
            total: number;
            limit: number;
            offset: number;
        };
    }
}
```

### Rollback Article Version

**Endpoint:** `POST /api/v1/articles/[id]/rollback/[version]`

**Response:**
```typescript
{
    success: true,
    data: {
        articleId: string;
        restoredVersion: number;
        newVersionId: string;
    }
}
```

---

## Workflow APIs

### Execute Workflow

**Endpoint:** `POST /api/v1/workflows/execute`

**Request:**
```typescript
{
    workflowId: string;
    context?: Record<string, any>;
}
```

**Response:**
```typescript
{
    success: true,
    data: {
        instanceId: string;
        workflowId: string;
        state: 'pending' | 'running' | 'completed' | 'failed';
        startedAt: string;
    }
}
```

### Get Workflow Status

**Endpoint:** `GET /api/v1/workflows/[id]`

**Response:**
```typescript
{
    success: true,
    data: {
        id: string;
        workflowId: string;
        state: string;
        completedSteps: string[];
        failedSteps: string[];
        currentStep?: string;
        startedAt: string;
        completedAt?: string;
        error?: string;
    }
}
```

---

## Budget APIs

### Get Budget Status

**Endpoint:** `GET /api/v1/budget/status`

**Response:**
```typescript
{
    success: true,
    data: {
        canGenerate: boolean;
        tokensRemaining: number;
        imagesRemaining: number;
        costRemaining: number;
        isPaused: boolean;
        reason?: string;
    }
}
```

### Set Daily Budget

**Endpoint:** `POST /api/v1/admin/budget/daily`

**Request:**
```typescript
{
    maxTokensPerDay?: number;
    maxImagesPerDay?: number;
    maxCostPerDay?: number;
}
```

**Response:**
```typescript
{
    success: true,
    data: {
        budget_date: string;
        max_tokens: number;
        max_images: number;
        max_cost_usd: number;
    }
}
```

### Get Cost Dashboard

**Endpoint:** `GET /api/v1/admin/cost-dashboard`

**Query Parameters:**
- `start_date` (optional): Start date for cost data
- `end_date` (optional): End date for cost data

**Response:**
```typescript
{
    success: true,
    data: {
        dailyBudget: {
            budget_date: string;
            max_cost_usd: number;
            cost_spent_usd: number;
            tokens_used: number;
            images_used: number;
            is_paused: boolean;
        };
        monthlyBudget: {
            budget_month: string;
            max_cost_usd: number;
            cost_spent_usd: number;
            is_paused: boolean;
        };
        providerBreakdown: Array<{
            provider: string;
            total_cost: number;
            total_tokens: number;
            operation_count: number;
        }>;
        projection: {
            current_month_cost: number;
            projected_monthly_cost: number;
            budget_limit: number;
            projected_over_budget: boolean;
        };
    }
}
```

---

## Prompt APIs

### List Prompts

**Endpoint:** `GET /api/v1/admin/prompts`

**Query Parameters:**
- `category` (optional): Filter by category
- `include_inactive` (optional): Include inactive prompts

**Response:**
```typescript
{
    success: true,
    data: Array<{
        id: string;
        name: string;
        slug: string;
        version: number;
        category: string;
        is_active: boolean;
        performance_score?: number;
        usage_count: number;
    }>;
}
```

### Create Prompt Version

**Endpoint:** `POST /api/v1/admin/prompts`

**Request:**
```typescript
{
    base_prompt_id: string;
    updates: {
        user_prompt_template?: string;
        system_prompt?: string;
        preferred_model?: string;
        temperature?: number;
        max_tokens?: number;
    };
}
```

**Response:**
```typescript
{
    success: true,
    data: {
        id: string;
        name: string;
        slug: string;
        version: number;
        // ... other fields
    }
}
```

### Get Prompt Performance

**Endpoint:** `GET /api/v1/admin/prompts/[id]/performance`

**Query Parameters:**
- `days` (optional): Number of days (default: 30)

**Response:**
```typescript
{
    success: true,
    data: {
        prompt: {
            id: string;
            name: string;
            version: number;
            performance_score?: number;
            quality_score?: number;
        };
        performance: Array<{
            id: string;
            latency_ms?: number;
            cost_usd?: number;
            success: boolean;
            quality_score?: number;
            created_at: string;
        }>;
        summary: {
            totalExecutions: number;
            successRate: number;
            avgQualityScore: number;
            avgLatencyMs: number;
            avgCostUSD: number;
        };
    }
}
```

---

## A/B Test APIs

### List A/B Tests

**Endpoint:** `GET /api/v1/admin/ab-tests`

**Query Parameters:**
- `status` (optional): Filter by status

**Response:**
```typescript
{
    success: true,
    data: Array<{
        id: string;
        name: string;
        prompt_slug: string;
        status: string;
        traffic_split: Record<string, number>;
        winner_version?: string;
        test_started_at?: string;
        test_ended_at?: string;
    }>;
}
```

### Create A/B Test

**Endpoint:** `POST /api/v1/admin/ab-tests`

**Request:**
```typescript
{
    prompt_slug: string;
    name: string;
    description?: string;
    traffic_split: Record<string, number>; // e.g., {"A": 50, "B": 50}
    min_sample_size?: number;
}
```

**Response:**
```typescript
{
    success: true,
    data: {
        id: string;
        name: string;
        prompt_slug: string;
        status: 'draft';
        traffic_split: Record<string, number>;
        min_sample_size: number;
    }
}
```

### Start A/B Test

**Endpoint:** `POST /api/v1/admin/ab-tests/[id]/start`

**Response:**
```typescript
{
    success: true,
    message: 'A/B test started successfully'
}
```

### Analyze A/B Test

**Endpoint:** `GET /api/v1/admin/ab-tests/[id]/analyze`

**Response:**
```typescript
{
    success: true,
    data: Array<{
        test_group: string;
        sample_size: number;
        avg_quality_score: number;
        avg_latency_ms: number;
        success_rate: number;
        avg_cost_usd: number;
        performance_score: number;
        is_winner: boolean;
    }>;
}
```

---

## Audit Log APIs

### Get Audit Log

**Endpoint:** `GET /api/v1/admin/audit-log`

**Query Parameters:**
- `entity_type` (optional): Filter by entity type
- `entity_id` (optional): Filter by entity ID
- `user_id` (optional): Filter by user
- `action` (optional): Filter by action
- `severity` (optional): Filter by severity
- `start_date` (optional): Start date
- `end_date` (optional): End date
- `limit` (optional): Page size (default: 100)
- `offset` (optional): Page offset (default: 0)

**Response:**
```typescript
{
    success: true,
    data: {
        entries: Array<{
            id: string;
            entity_type: string;
            entity_id?: string;
            action: string;
            user_name?: string;
            changes?: any;
            severity: string;
            created_at: string;
        }>;
        pagination: {
            total: number;
            limit: number;
            offset: number;
            has_more: boolean;
        };
    }
}
```

### Get Audit Statistics

**Endpoint:** `GET /api/v1/admin/audit-log/statistics`

**Query Parameters:**
- `start_date` (optional): Start date
- `end_date` (optional): End date

**Response:**
```typescript
{
    success: true,
    data: {
        total_actions: number;
        actions_by_type: Record<string, number>;
        actions_by_user: Record<string, number>;
        actions_by_severity: Record<string, number>;
        recent_activity: Array<{
            action: string;
            entity_type: string;
            user_name?: string;
            created_at: string;
        }>;
    }
}
```

---

## Health Check APIs

### Liveness Probe

**Endpoint:** `GET /api/health/liveness`

**Response:**
```typescript
{
    status: 'ok' | 'degraded' | 'down';
    timestamp: string;
}
```

### Readiness Probe

**Endpoint:** `GET /api/health/readiness`

**Response:**
```typescript
{
    status: 'ready' | 'not_ready';
    checks: {
        database: 'ok' | 'error';
        cache: 'ok' | 'error';
        ai_providers: 'ok' | 'error';
    };
    timestamp: string;
}
```

### Comprehensive Health Check

**Endpoint:** `GET /api/health`

**Response:**
```typescript
{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: {
        database: {
            status: 'ok' | 'error';
            latency_ms: number;
        };
        cache: {
            status: 'ok' | 'error';
            latency_ms: number;
        };
        ai_providers: {
            status: 'ok' | 'error';
            available_providers: number;
        };
    };
    timestamp: string;
}
```

---

## Metrics APIs

### Prometheus Metrics

**Endpoint:** `GET /api/metrics`

**Response:** Prometheus format metrics

---

## Error Codes

### Authentication Errors
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions

### Validation Errors
- `VALIDATION_ERROR` (400): Invalid request data
- `INVALID_TRANSITION` (400): Invalid state transition

### Resource Errors
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict

### Server Errors
- `INTERNAL_ERROR` (500): Internal server error
- `SERVICE_UNAVAILABLE` (503): Service unavailable

---

## Rate Limiting

- **Public APIs**: 100 requests/minute per IP
- **Admin APIs**: 1000 requests/minute per user
- **AI Generation**: Limited by budget governor

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `limit`: Number of items per page (default: 100, max: 1000)
- `offset`: Number of items to skip (default: 0)

**Response:**
```typescript
{
    data: any[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        has_more: boolean;
    }
}
```

---

## Versioning

APIs are versioned via URL path:
- `/api/v1/...` - Current stable version
- `/api/v2/...` - Future version (when available)

---

**See Also:**
- [System Design Documentation](../SYSTEM_DESIGN.md)
- [OpenAPI Documentation](./openapi.md)
- [Error Handling Documentation](../operations/error-handling.md)
