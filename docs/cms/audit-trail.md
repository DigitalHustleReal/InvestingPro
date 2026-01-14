# Comprehensive Audit Trail

This document describes the audit trail system for tracking all admin actions and system changes.

## 🎯 Overview

The audit trail system automatically logs all admin actions and system changes, providing:
- Complete history of all changes
- User attribution for every action
- Request context (IP, user agent, path)
- Change tracking (before/after states)
- Filtering and search capabilities

---

## 📋 What Gets Logged

### Automatic Logging

The system automatically logs:
- Article operations (create, update, delete, publish, unpublish)
- Workflow operations (start, stop, update)
- User management (create, update, delete, role changes)
- Product operations (create, update, delete)
- Category operations (create, update, delete)
- System actions (settings changes, bulk operations)

### Logged Information

Each audit log entry includes:
- **Entity Information:** Type and ID of affected entity
- **Action:** What action was performed
- **User Information:** Who performed the action
- **Change Details:** Before/after states (for updates)
- **Request Context:** IP address, user agent, API path
- **Metadata:** Severity, tags, timestamp

---

## 🔧 API Endpoints

### Get Audit Log Entries

```http
GET /api/v1/admin/audit-log?entity_type=article&action=update&limit=50&offset=0
```

**Query Parameters:**
- `entity_type` - Filter by entity type (article, workflow, user, etc.)
- `entity_id` - Filter by specific entity ID
- `user_id` - Filter by user ID
- `action` - Filter by action (create, update, delete, etc.)
- `severity` - Filter by severity (info, warning, error, critical)
- `tags` - Filter by tags (comma-separated)
- `start_date` - Filter by start date (ISO format)
- `end_date` - Filter by end date (ISO format)
- `limit` - Number of entries per page (default: 100)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "uuid",
        "entity_type": "article",
        "entity_id": "uuid",
        "action": "update",
        "action_details": "Updated article title and content",
        "user_id": "uuid",
        "user_email": "admin@example.com",
        "user_name": "Admin User",
        "old_values": { "title": "Old Title" },
        "new_values": { "title": "New Title" },
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "request_path": "/api/v1/articles/uuid",
        "request_method": "PUT",
        "severity": "info",
        "tags": ["article", "content"],
        "created_at": "2026-01-21T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0,
      "has_more": true
    }
  }
}
```

### Get Audit Statistics

```http
GET /api/v1/admin/audit-log/statistics?start_date=2026-01-01&end_date=2026-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_actions": 1250,
    "actions_by_type": {
      "article": 800,
      "workflow": 300,
      "user": 150
    },
    "actions_by_user": {
      "Admin User": 500,
      "Editor User": 300
    },
    "actions_by_severity": {
      "info": 1200,
      "warning": 40,
      "error": 10
    },
    "recent_activity": [...]
  }
}
```

---

## 💻 Usage Examples

### Logging Audit Events

```typescript
import { logArticleAction, logAuditEvent } from '@/lib/audit/audit-logger';

// Log article action
await logArticleAction('update', articleId, {
    action_details: 'Updated SEO metadata',
    old_values: { seo_title: 'Old Title' },
    new_values: { seo_title: 'New Title' },
    severity: 'info',
}, {
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0...',
    request_path: '/api/articles/123',
    request_method: 'PUT',
});

// Log custom audit event
await logAuditEvent({
    entity_type: 'workflow',
    entity_id: workflowId,
    action: 'start',
    action_details: 'Workflow started manually',
    severity: 'info',
    tags: ['workflow', 'automation'],
});
```

### Using Audit Middleware

```typescript
import { withAudit, createAuditContext } from '@/lib/middleware/audit';

export const PUT = withAudit(
    async (request: NextRequest, { params }) => {
        // Your handler logic
    },
    createAuditContext('article', {
        action: 'update',
        actionDetails: 'Article updated',
    })
);
```

### Viewing Audit Logs in UI

```typescript
import AuditLogViewer from '@/components/admin/AuditLogViewer';

<AuditLogViewer
    initialFilters={{
        entity_type: 'article',
        action: 'update',
    }}
/>
```

---

## 🔐 Permissions

### Viewing Audit Logs
- **Admins:** Can view all audit logs
- **Others:** Cannot view audit logs

### Logging Audit Events
- **System:** Automatically logs admin actions
- **Service Role:** Can log any audit event
- **Users:** Cannot directly log audit events

---

## 📊 Database Schema

### audit_log Table

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT NOT NULL,
    action_details TEXT,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    user_name TEXT,
    changes JSONB,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    request_path TEXT,
    request_method TEXT,
    severity TEXT DEFAULT 'info',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Functions

- `log_audit_event(...)` - Logs an audit event
- `get_audit_log(...)` - Retrieves audit log entries with filtering
- `get_audit_statistics(...)` - Returns audit log statistics

---

## 🎨 Best Practices

### 1. Logging Strategy
- ✅ Log all admin actions automatically
- ✅ Include meaningful action details
- ✅ Track before/after states for updates
- ✅ Use appropriate severity levels

### 2. Performance
- ✅ Audit logs are indexed for fast queries
- ✅ Use pagination for large result sets
- ✅ Filter by date range for better performance
- ✅ Archive old logs periodically

### 3. Privacy & Security
- ✅ IP addresses are logged (consider GDPR)
- ✅ User agents are logged
- ✅ Only admins can view audit logs
- ✅ Consider data retention policies

---

## 🔍 Troubleshooting

### Audit Logs Not Being Created

**Problem:** Actions aren't being logged.

**Solutions:**
1. Check that audit middleware is applied to routes
2. Verify user is authenticated and admin
3. Check database logs for function errors
4. Verify RLS policies allow insertion

### Performance Issues

**Problem:** Audit log queries are slow.

**Solutions:**
1. Use date range filters
2. Limit result set size
3. Use indexes (already created)
4. Consider archiving old logs

### Missing Information

**Problem:** Some fields are null in audit logs.

**Solutions:**
1. Check that context is passed correctly
2. Verify IP/user agent extraction
3. Ensure user information is available
4. Check function parameters

---

## 📈 Future Enhancements

- [ ] Export audit logs (CSV, JSON)
- [ ] Real-time audit log streaming
- [ ] Audit log retention policies
- [ ] Advanced search (full-text)
- [ ] Audit log alerts (critical actions)
- [ ] Audit log visualization (charts)

---

**Questions?** Check the code in `lib/audit/audit-logger.ts` and `supabase/migrations/20260121_audit_log.sql`
