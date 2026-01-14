# Request/Response Validation with Zod

This document describes the Zod-based validation system for API endpoints.

## 🎯 Overview

All API endpoints use Zod schemas for:
- ✅ Type-safe request validation
- ✅ Automatic error responses (400)
- ✅ Consistent error format
- ✅ Type inference for TypeScript

---

## 🚀 Usage

### Basic Validation Middleware

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withZodValidation } from '@/lib/middleware/zod-validation';
import { createArticleSchema, articleQuerySchema } from '@/lib/validation/api-schemas';
import { withErrorHandler } from '@/lib/errors/handler';

export const POST = withErrorHandler(
    withZodValidation({
        body: createArticleSchema,
        query: articleQuerySchema,
    })(async (request, { body, query }) => {
        // body and query are fully typed and validated
        const article = await createArticle(body);
        return NextResponse.json({ article });
    })
);
```

### Validate Body Only

```typescript
import { withZodValidation } from '@/lib/middleware/zod-validation';
import { createArticleSchema } from '@/lib/validation/api-schemas';

export const POST = withZodValidation({
    body: createArticleSchema,
})(async (request, { body }) => {
    // body is typed as CreateArticleInput
    return NextResponse.json({ success: true });
});
```

### Validate Query Parameters

```typescript
import { withZodValidation } from '@/lib/middleware/zod-validation';
import { articleQuerySchema } from '@/lib/validation/api-schemas';

export const GET = withZodValidation({
    query: articleQuerySchema,
})(async (request, { query }) => {
    // query is typed as ArticleQuery
    const articles = await getArticles(query);
    return NextResponse.json({ articles });
});
```

### Validate Route Parameters

```typescript
import { withZodValidation } from '@/lib/middleware/zod-validation';
import { articleParamsSchema } from '@/lib/validation/api-schemas';

export const GET = withZodValidation({
    params: articleParamsSchema,
})(async (request, { params }, routeParams) => {
    // params.id is typed as string (UUID)
    const article = await getArticle(params.id);
    return NextResponse.json({ article });
});
```

### Manual Validation

```typescript
import { getValidatedBody, getValidatedQuery } from '@/lib/middleware/zod-validation';
import { createArticleSchema } from '@/lib/validation/api-schemas';

export const POST = async (request: NextRequest) => {
    const body = await getValidatedBody(request, createArticleSchema);
    const query = getValidatedQuery(request, articleQuerySchema);
    
    // Use validated data
    return NextResponse.json({ success: true });
};
```

---

## 📋 Available Schemas

### Article Schemas

```typescript
import {
    createArticleSchema,
    updateArticleSchema,
    articleQuerySchema,
    articleParamsSchema,
    articleSlugParamsSchema,
} from '@/lib/validation/api-schemas';
```

### Product Schemas

```typescript
import {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
    productParamsSchema,
} from '@/lib/validation/api-schemas';
```

### Review Schemas

```typescript
import {
    createReviewSchema,
    updateReviewSchema,
    reviewQuerySchema,
    reviewParamsSchema,
} from '@/lib/validation/api-schemas';
```

### Portfolio Schemas

```typescript
import {
    createPortfolioSchema,
    updatePortfolioSchema,
    portfolioQuerySchema,
    portfolioParamsSchema,
} from '@/lib/validation/api-schemas';
```

### AI Generation Schemas

```typescript
import {
    generateArticleSchema,
    bulkGenerateSchema,
    generateTitleSchema,
} from '@/lib/validation/api-schemas';
```

---

## 🔍 Error Response Format

Validation errors return 400 status with:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "title: String must contain at least 10 character(s); slug: Invalid slug format",
        "statusCode": 400,
        "correlationId": "abc-123",
        "requestId": "req-789",
        "details": {
            "fieldCount": 2,
            "errors": [
                {
                    "path": ["title"],
                    "message": "String must contain at least 10 character(s)",
                    "code": "too_small"
                },
                {
                    "path": ["slug"],
                    "message": "Invalid slug format",
                    "code": "invalid_string"
                }
            ]
        },
        "timestamp": "2026-01-15T10:30:00.000Z"
    }
}
```

---

## ✅ Best Practices

1. **Always validate input:**
   ```typescript
   // ✅ Good
   export const POST = withZodValidation({
       body: createArticleSchema,
   })(handler);
   
   // ❌ Bad
   export const POST = async (request: NextRequest) => {
       const body = await request.json(); // No validation!
   };
   ```

2. **Use type inference:**
   ```typescript
   import type { CreateArticleInput } from '@/lib/validation/api-schemas';
   
   // Type is automatically inferred from schema
   const article: CreateArticleInput = body;
   ```

3. **Combine with error handling:**
   ```typescript
   export const POST = withErrorHandler(
       withZodValidation({ body: schema })(handler)
   );
   ```

4. **Use appropriate schemas:**
   - `createSchema` for POST requests
   - `updateSchema` for PUT/PATCH requests
   - `querySchema` for GET requests
   - `paramsSchema` for route parameters

---

## 🎯 Schema Examples

### Article Creation

```typescript
const schema = z.object({
    title: z.string().min(10).max(200),
    content: z.string().min(500),
    category: z.enum(['mutual-funds', 'credit-cards', ...]),
    tags: z.array(z.string()).max(20).optional(),
});
```

### Query Parameters

```typescript
const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    search: z.string().max(200).optional(),
    sort: z.enum(['newest', 'oldest', 'popular']).default('newest').optional(),
});
```

### Route Parameters

```typescript
const paramsSchema = z.object({
    id: z.string().uuid(),
});
```

---

## 📈 Next Steps

- ✅ Zod validation implemented
- ✅ Comprehensive schemas created
- ✅ Middleware integrated with error handling
- 🔄 **Next:** Task 8.2 - Caching Strategy Implementation

---

**Questions?** Check the code in `lib/validation/` and `lib/middleware/zod-validation.ts`
