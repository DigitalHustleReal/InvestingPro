# 🔗 Phase 2: Event Bus Integration Guide

**Date:** January 13, 2026  
**Status:** 📋 **INTEGRATION GUIDE**

---

## 🎯 Objective

Guide for integrating event publishing into services and components.

---

## 📋 Integration Checklist

### 1. Database Schema ✅

- ✅ Created `system_events` table migration
- ✅ Added indexes for performance
- ✅ Configured RLS policies
- ✅ Added archive function for old events

**Migration File:** `supabase/migrations/20260113_system_events.sql`

**To Apply:**
```bash
# Run migration via Supabase CLI or apply directly in Supabase dashboard
supabase migration up
```

---

### 2. Service Integration

#### ArticleService Integration

**Events to Publish:**
- `ARTICLE_CREATED` - When article is created
- `ARTICLE_UPDATED` - When article is updated
- `ARTICLE_PUBLISHED` - When article status changes to 'published'
- `ARTICLE_ARCHIVED` - When article is archived

**Integration Points:**
- After article creation in `article-generator.ts`
- After article update in admin routes
- After status change to 'published'
- After archive action

**Example:**
```typescript
import { eventPublisher, EventType } from '@/lib/events';

// After article creation
await eventPublisher.publish({
    type: EventType.ARTICLE_CREATED,
    source: 'ArticleService',
    payload: {
        articleId: article.id,
        title: article.title,
        slug: article.slug,
        authorId: article.author_id
    }
});
```

---

#### ProductService Integration

**Events to Publish:**
- `PRODUCT_CREATED` - When product is created
- `PRODUCT_UPDATED` - When product is updated

**Integration Points:**
- After product creation
- After product update

---

#### AI Agent Integration

**Events to Publish:**
- `CONTENT_GENERATION_STARTED` - When generation begins
- `CONTENT_GENERATION_COMPLETED` - When generation succeeds
- `CONTENT_GENERATION_FAILED` - When generation fails

**Integration Points:**
- `lib/automation/article-generator.ts` - Start/complete/fail
- `lib/automation/content-orchestrator.ts` - Orchestration events
- `lib/automation/cms-orchestrator.ts` - CMS workflow events

---

### 3. Cache Invalidation Integration

**Current:** Cache handlers are set up but need to be initialized.

**Setup:**
```typescript
// In app initialization or middleware
import { setupAllHandlers } from '@/lib/events/handlers';

// Setup all event handlers
setupAllHandlers();
```

**Cache Invalidation Events:**
- Publish `CACHE_INVALIDATED` event when:
  - Article is updated/published
  - Product is updated
  - Any cached data changes

---

## 🔄 Event Flow Examples

### Article Publication Flow

1. **Article Published** → `ARTICLE_PUBLISHED` event
2. **Cache Handler** → Invalidates article cache
3. **Analytics Handler** → Tracks publication
4. **Search Handler** (future) → Updates search index
5. **SEO Handler** (future) → Updates sitemap

### Content Generation Flow

1. **Generation Started** → `CONTENT_GENERATION_STARTED` event
2. **Generation Completed** → `CONTENT_GENERATION_COMPLETED` event
3. **Article Created** → `ARTICLE_CREATED` event
4. **Cache Handler** → Invalidates related caches
5. **Notification Handler** (future) → Sends notification

---

## 📊 Monitoring & Debugging

### View Events

```sql
-- Get recent events
SELECT * FROM system_events 
ORDER BY created_at DESC 
LIMIT 100;

-- Get events by type
SELECT * FROM system_events 
WHERE event_type = 'article.published'
ORDER BY created_at DESC;

-- Get events by source
SELECT * FROM system_events 
WHERE source = 'ArticleService'
ORDER BY created_at DESC;
```

### Event Statistics

```sql
-- Event counts by type
SELECT 
    event_type,
    COUNT(*) as count,
    MAX(created_at) as last_occurrence
FROM system_events
GROUP BY event_type
ORDER BY count DESC;
```

---

## 🚀 Next Steps

1. **Apply Migration**
   - Run migration in Supabase
   - Verify table creation
   - Test RLS policies

2. **Initialize Handlers**
   - Add `setupAllHandlers()` to app initialization
   - Test event publishing
   - Verify handler execution

3. **Integrate Services**
   - Add event publishing to ArticleService
   - Add event publishing to ProductService
   - Add event publishing to AI agents

4. **Test Integration**
   - Publish test events
   - Verify persistence
   - Verify handler execution
   - Monitor event flow

---

*Event Bus Integration Guide - January 13, 2026*
