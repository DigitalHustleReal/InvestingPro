# Workflow API Endpoints

**Base Path:** `/api/workflows`

---

## Endpoints

### POST `/api/workflows/start`

Start a new workflow instance.

**Request Body:**
```json
{
  "workflowName": "article-publishing",
  "context": {
    "articleId": "uuid-here"
  }
}
```

**Response:**
```json
{
  "success": true,
  "instanceId": "workflow-instance-uuid"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/workflows/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflowName": "article-publishing",
    "context": { "articleId": "test-123" }
  }'
```

---

### GET `/api/workflows/[id]/status`

Get the status of a workflow instance.

**Response:**
```json
{
  "success": true,
  "instance": {
    "id": "instance-id",
    "workflowId": "workflow-id",
    "state": "running",
    "currentStep": "step-id",
    "completedSteps": ["step-1"],
    "failedSteps": [],
    "startedAt": "2026-01-14T10:00:00Z",
    "completedAt": null
  },
  "history": [
    {
      "stepId": "step-1",
      "state": "completed",
      "duration": 1500,
      "timestamp": "2026-01-14T10:00:05Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3000/api/workflows/{instanceId}/status
```

---

### POST `/api/workflows/state/transition`

Trigger a state transition for an entity.

**Request Body:**
```json
{
  "entityType": "article",
  "entityId": "uuid-here",
  "from": "draft",
  "to": "review",
  "action": "submit",
  "metadata": {
    "userId": "user-id",
    "notes": "Ready for review"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "State transitioned from draft to review"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/workflows/state/transition \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "article",
    "entityId": "article-123",
    "from": "draft",
    "to": "review",
    "action": "submit"
  }'
```

---

### GET `/api/workflows/metrics`

Get workflow metrics.

**Query Parameters:**
- `workflowId` (optional) - Filter by workflow ID
- `start` (optional) - Start date (ISO format)
- `end` (optional) - End date (ISO format)

**Response:**
```json
{
  "success": true,
  "metrics": {
    "total": 100,
    "byState": {
      "pending": 5,
      "running": 10,
      "completed": 80,
      "failed": 5,
      "cancelled": 0,
      "paused": 0
    },
    "averageDuration": 45000,
    "successRate": 80.0,
    "failureRate": 5.0
  }
}
```

**Example:**
```bash
curl "http://localhost:3000/api/workflows/metrics?workflowId=workflow-123&start=2026-01-01&end=2026-01-31"
```

---

### GET `/api/workflows/[id]/debug`

Debug a workflow instance.

**Response:**
```json
{
  "success": true,
  "debug": {
    "instance": {
      "id": "instance-id",
      "state": "failed",
      "error": "Step validation failed"
    },
    "issues": [
      "Failed steps: validate-article",
      "1 step(s) failed during execution"
    ],
    "recommendations": [
      "Review failed step errors in execution history",
      "Review error details in execution history"
    ]
  },
  "summary": {
    "instance": {...},
    "history": [...],
    "duration": null,
    "stepsCompleted": 0,
    "stepsFailed": 1
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/workflows/{instanceId}/debug
```

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found (workflow instance not found)
- `500` - Internal Server Error

---

## Authentication

All endpoints require authentication (rate limiting applied):
- Authenticated endpoints: Standard rate limits
- Public endpoints: Stricter rate limits

---

## Rate Limiting

- Authenticated: 100 requests/minute
- Public: 20 requests/minute

---

**Last Updated:** January 14, 2026
