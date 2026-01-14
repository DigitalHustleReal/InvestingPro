# OpenAPI Documentation

This document describes the OpenAPI/Swagger documentation system.

## 🎯 Overview

The API documentation is automatically generated from route handlers and Zod schemas, providing:
- ✅ Interactive API explorer
- ✅ Request/response examples
- ✅ Authentication documentation
- ✅ Error response formats

**Location:** `/api/docs` (interactive UI) or `/api/docs` (JSON spec)

---

## 🚀 Accessing Documentation

### Interactive UI

Visit `/api/docs` in your browser for the interactive Swagger UI.

### JSON Specification

Get the raw OpenAPI spec:
```bash
curl http://localhost:3000/api/docs
```

---

## 📋 Documented Endpoints

### Articles
- `GET /api/articles/public` - Get public articles
- `GET /api/articles/{id}` - Get article by ID
- `POST /api/articles` - Create article (admin)
- `PUT /api/articles/{id}` - Update article (admin)

### Health Checks
- `GET /api/health` - Comprehensive health check
- `GET /api/health/liveness` - Liveness probe
- `GET /api/health/readiness` - Readiness probe

### Metrics
- `GET /api/metrics` - Prometheus metrics

### Admin
- `GET /api/v1/admin/database/performance` - Database performance metrics

---

## 🔐 Authentication

### Bearer Token (JWT)

Most endpoints require authentication via Supabase JWT:

1. **Get token:** Login via Supabase Auth
2. **Use token:** Add to request header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### API Key (Service-to-Service)

Some endpoints support API key authentication:
```
X-API-Key: <your-api-key>
```

---

## 📊 Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "statusCode": 400,
    "correlationId": "abc-123",
    "details": {
      "fieldCount": 2,
      "errors": [
        {
          "path": ["title"],
          "message": "String must contain at least 10 character(s)",
          "code": "too_small"
        }
      ]
    },
    "timestamp": "2026-01-15T10:30:00.000Z"
  }
}
```

---

## 🔍 Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 📈 Next Steps

- ✅ OpenAPI spec generator implemented
- ✅ Interactive docs UI created
- ✅ Basic endpoints documented
- 🔄 **Next:** Add more endpoints to documentation
- 🔄 **Next:** Add request/response examples

---

**Questions?** Check the code in `lib/api/openapi-generator.ts` and `app/api/docs/`
