# Article Versioning & Rollback

This document describes the article versioning system and how to use it.

## 🎯 Overview

The versioning system automatically creates snapshots of articles whenever they are updated, allowing you to:
- View complete version history
- Rollback to any previous version
- Track who made changes and when
- See what changed between versions

---

## 📋 How It Works

### Automatic Versioning

Versions are created automatically when articles are updated. The system tracks changes to:
- Title
- Content
- Excerpt
- Status
- Category
- Tags
- SEO fields

**Note:** Minor updates (like `updated_at` timestamp) don't create new versions.

### Version Storage

Each version stores:
- Complete article state (all fields)
- Version number (sequential)
- Creation timestamp
- Creator (user who made the change)
- Optional change summary

---

## 🔧 API Endpoints

### Get Version History

```http
GET /api/v1/articles/:id/versions?limit=50&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "id": "uuid",
        "version_number": 3,
        "created_at": "2026-01-20T10:00:00Z",
        "created_by": "user-uuid",
        "created_by_name": "John Doe",
        "change_summary": "Updated title and content",
        "content_preview": {
          "title": "Article Title",
          "status": "published",
          "updated_at": "2026-01-20T10:00:00Z"
        }
      }
    ],
    "total": 10,
    "has_more": false
  }
}
```

### Rollback to Version

```http
POST /api/v1/articles/:id/rollback/:version
```

**Response:**
```json
{
  "success": true,
  "data": {
    "article_id": "uuid",
    "restored_to_version": 3,
    "new_version_id": "uuid"
  }
}
```

**Note:** Rolling back creates a new version, so you can rollback the rollback if needed.

---

## 💻 Usage Examples

### Using the Version Service

```typescript
import {
    createArticleVersion,
    restoreArticleVersion,
    getArticleVersionHistory,
} from '@/lib/cms/version-service';

// Manually create a version
const versionId = await createArticleVersion(
    articleId,
    'Updated SEO metadata'
);

// Get version history
const history = await getArticleVersionHistory(articleId, 50, 0);
console.log(`Total versions: ${history.total}`);

// Rollback to version 5
const result = await restoreArticleVersion(articleId, 5);
if (result.success) {
    console.log('Rolled back successfully');
}
```

### Using the UI Component

```typescript
import ArticleVersionHistory from '@/components/admin/ArticleVersionHistory';

<ArticleVersionHistory
    articleId={article.id}
    onRollback={() => {
        // Reload article data after rollback
        refetch();
    }}
/>
```

---

## 🔐 Permissions

### Viewing Versions
- **Admins:** Can view all article versions
- **Authors:** Can view versions of their own articles
- **Others:** Cannot view version history

### Rolling Back
- **Admins:** Can rollback any article
- **Authors:** Can rollback their own articles
- **Others:** Cannot rollback articles

---

## 📊 Database Schema

### article_versions Table

```sql
CREATE TABLE article_versions (
    id UUID PRIMARY KEY,
    article_id UUID REFERENCES articles(id),
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL, -- Full article state
    created_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    change_summary TEXT,
    UNIQUE(article_id, version_number)
);
```

### Functions

- `create_article_version(article_id, created_by, change_summary)` - Creates a version snapshot
- `restore_article_from_version(article_id, version_number)` - Restores article to a version
- `get_article_version_history(article_id, limit, offset)` - Gets version history

---

## 🎨 Best Practices

### 1. Version Management
- ✅ Versions are created automatically - no manual intervention needed
- ✅ Use change summaries for important updates
- ✅ Review version history before major rollbacks

### 2. Rollback Strategy
- ✅ Always test rollbacks in a staging environment first
- ✅ Rollback creates a new version - you can undo it
- ✅ Consider impact on published articles before rolling back

### 3. Performance
- ✅ Version history is paginated (default 50 per page)
- ✅ Old versions can be archived if needed
- ✅ Version content is stored as JSONB for efficient querying

---

## 🔍 Troubleshooting

### Versions Not Being Created

**Problem:** Updates aren't creating versions.

**Solutions:**
1. Check that the trigger is enabled: `SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_create_article_version';`
2. Verify changes are significant (not just timestamp updates)
3. Check database logs for trigger errors

### Rollback Fails

**Problem:** Rollback operation fails.

**Solutions:**
1. Verify version exists: `SELECT * FROM article_versions WHERE article_id = ? AND version_number = ?`
2. Check permissions (admin or author)
3. Verify article still exists
4. Check database logs for function errors

### Missing Version History

**Problem:** No versions shown for an article.

**Solutions:**
1. Check if article was created before versioning was enabled
2. Verify RLS policies allow viewing versions
3. Check user permissions (admin or author)

---

## 📈 Future Enhancements

- [ ] Version comparison (diff view)
- [ ] Version tagging (mark important versions)
- [ ] Bulk version operations
- [ ] Version export/import
- [ ] Automatic version cleanup (retention policy)

---

**Questions?** Check the code in `lib/cms/version-service.ts` and `supabase/migrations/20260120_article_versions.sql`
