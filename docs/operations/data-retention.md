# Data Retention & Archival Policy

This document describes the data retention policies and archival procedures.

## 🎯 Overview

To maintain database performance and comply with data retention requirements, old data is automatically archived or deleted according to retention policies.

---

## 📊 Retention Policies

### Articles
- **Retention:** 2 years
- **Action:** Archive to S3 (cold storage)
- **Status:** Only archived articles are archived (status = 'archived')
- **Restore:** Yes, via restore function

### Analytics Data
- **Retention:** 1 year
- **Action:** Delete permanently
- **Tables:** `article_analytics`, `article_views`, `affiliate_clicks`
- **Restore:** No (permanent deletion)

### Workflow Instances
- **Retention:** 6 months
- **Action:** Archive to S3, then delete from database
- **Status:** Only completed/failed/cancelled workflows
- **Restore:** No (archived to S3 only)

### System Events/Logs
- **Retention:** 30 days
- **Action:** Delete permanently
- **Table:** `system_events`
- **Restore:** No (permanent deletion)

---

## 🚀 Archival Process

### Automatic Archival

Archival runs weekly via cron job:
- **Endpoint:** `/api/cron/archive-data`
- **Schedule:** Weekly (Sunday 2 AM UTC)
- **Authentication:** Bearer token (`CRON_SECRET`)

### Manual Archival

Run the archival script directly:

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE_KEY=...
export AWS_ACCESS_KEY_ID=... # Optional
export AWS_SECRET_ACCESS_KEY=... # Optional
export AWS_S3_ARCHIVE_BUCKET=... # Optional

# Run script
npm run ts-node scripts/archive-old-data.ts
```

---

## 📦 Archive Storage

### S3 Archive Structure

```
s3://bucket-name/
  archives/
    articles/
      2026-01-15/
        {uuid}.json
    workflows/
      2026-01-15/
        {uuid}.json
```

### Archive File Format

```json
{
  "timestamp": "2026-01-15T02:00:00.000Z",
  "articles": [...],
  "metadata": {
    "count": 100,
    "retentionPolicy": {
      "archiveAfterDays": 730
    }
  }
}
```

---

## 🔄 Restore Procedures

### Restore Archived Article

```sql
-- Restore from archive table
SELECT restore_archived_article('archive-uuid');

-- Or restore from S3 manually
-- 1. Download archive file from S3
-- 2. Extract article data
-- 3. Insert into articles table
```

### Restore from S3

```typescript
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Download archive file
const s3Client = new S3Client({...});
const archive = await s3Client.send(
    new GetObjectCommand({
        Bucket: 'archive-bucket',
        Key: 'archives/articles/2026-01-15/uuid.json',
    })
);

// Parse and restore
const data = JSON.parse(await archive.Body.transformToString());
// Insert articles back into database
```

---

## 📈 Monitoring

### Archival Metrics

Monitor archival success via:
- **Logs:** Check application logs for archival results
- **Database:** Query archive tables for counts
- **S3:** Check S3 bucket for archive files

### Health Checks

```sql
-- Check archive table sizes
SELECT 
    'articles_archive' as table_name,
    COUNT(*) as count,
    MIN(archived_at) as oldest_archive,
    MAX(archived_at) as newest_archive
FROM articles_archive
UNION ALL
SELECT 
    'workflow_instances_archive' as table_name,
    COUNT(*) as count,
    MIN(archived_at) as oldest_archive,
    MAX(archived_at) as newest_archive
FROM workflow_instances_archive;
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional (for S3 archival)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_ARCHIVE_BUCKET=archive-bucket-name

# Cron job authentication
CRON_SECRET=your-secret-token
```

### Retention Policy Configuration

Edit `scripts/archive-old-data.ts`:

```typescript
const RETENTION_POLICIES = {
    articles: {
        archiveAfterDays: 730, // 2 years
        enabled: true,
    },
    // ... other policies
};
```

---

## 🎯 Best Practices

1. **Test archival process:**
   - Run on staging first
   - Verify S3 uploads
   - Test restore procedures

2. **Monitor archive sizes:**
   - Set alerts for archive table growth
   - Monitor S3 storage costs

3. **Document restore procedures:**
   - Keep restore scripts updated
   - Document S3 bucket structure

4. **Regular audits:**
   - Verify archival is running
   - Check for failed archives
   - Review retention policies annually

---

## 🔒 Security

### Archive Access

- **Archive tables:** Admin-only read access
- **S3 archives:** Private bucket with IAM policies
- **Cron endpoint:** Protected by `CRON_SECRET`

### Data Privacy

- **PII:** Ensure no PII in archived data
- **Encryption:** S3 archives encrypted at rest
- **Access logs:** Monitor S3 access logs

---

## 📊 Database Schema

### Archive Tables

- `articles_archive` - Archived articles
- `workflow_instances_archive` - Archived workflows

### Archive Functions

- `archive_article(uuid)` - Archive single article
- `archive_workflow_instance(uuid)` - Archive single workflow
- `restore_archived_article(uuid)` - Restore archived article

---

## 📈 Next Steps

- ✅ Archive tables created
- ✅ Archival script implemented
- ✅ Cron endpoint created
- ✅ Restore procedures documented
- 🔄 **Next:** Task 9.2 - Database Monitoring & Optimization

---

**Questions?** Check the code in `scripts/archive-old-data.ts` and `supabase/migrations/20260118_archive_tables.sql`
