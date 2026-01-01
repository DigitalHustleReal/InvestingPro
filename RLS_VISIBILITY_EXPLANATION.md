# RLS Visibility After Remediation - Articles Table

## Answer: YES - Admins Will See Draft/Review Articles

After applying `COMPLIANCE_REMEDIATION.sql`, the RLS policies work as follows:

---

## How RLS Policies Work Together

PostgreSQL RLS policies are combined with **OR** logic. If **any** policy allows access, the user can see the row.

### Articles Table Policies (After Remediation)

1. **"Public can view published articles"** (SELECT)
   - **Who**: Anonymous/public users
   - **What they see**: Only articles where `status = 'published'` AND `submission_status = 'approved'`
   - **Status visibility**: ❌ draft, ❌ review, ✅ published only

2. **"Users can view own submissions"** (SELECT)
   - **Who**: Authenticated users (authors)
   - **What they see**: Articles where `author_id = auth.uid()` (their own articles)
   - **Status visibility**: ✅ draft, ✅ review, ✅ published (all their own articles)

3. **"Admins can manage articles"** (ALL - includes SELECT)
   - **Who**: Users with `role = 'admin'` (from JWT or user_profiles)
   - **What they see**: **ALL articles regardless of status**
   - **Status visibility**: ✅ draft, ✅ review, ✅ published, ✅ archived

---

## Admin Visibility Breakdown

### Admin Can See:
- ✅ **Draft articles** (`status = 'draft'`)
- ✅ **Review articles** (`status = 'review'`)
- ✅ **Published articles** (`status = 'published'`)
- ✅ **Archived articles** (`status = 'archived'`)
- ✅ **Pending submissions** (`submission_status = 'pending'`)
- ✅ **Approved submissions** (`submission_status = 'approved'`)
- ✅ **Rejected submissions** (`submission_status = 'rejected'`)

### Admin Can Do:
- ✅ **SELECT** - View all articles
- ✅ **INSERT** - Create new articles
- ✅ **UPDATE** - Edit any article (change status, content, etc.)
- ✅ **DELETE** - Delete any article

---

## Policy Logic Flow

When an admin queries articles:

```
Admin SELECT query on articles table
    ↓
RLS evaluates policies:
    ↓
1. "Public can view published articles" → FALSE (admin is not public)
    ↓
2. "Users can view own submissions" → MAYBE (if admin authored some)
    ↓
3. "Admins can manage articles" → TRUE ✅ (admin role detected)
    ↓
Result: Admin sees ALL articles (draft, review, published, archived)
```

**Key Point**: The admin policy has **no status filter**, so it grants access to **all rows** for admins.

---

## Admin Dashboard Compatibility

Your admin dashboard code expects to see:

```typescript
// All articles
api.entities.Article.list('-created_date', 50)

// Pending submissions
api.entities.Article.filter({
    is_user_submission: true,
    submission_status: 'pending'
})
```

**After remediation**: ✅ Both queries will work for admins because:
- The admin policy allows SELECT on all articles
- No status filtering in the admin policy
- Admin can filter by any status in application code

---

## Regular Users (Non-Admin)

### Public Users (Not Logged In):
- ❌ Cannot see draft articles
- ❌ Cannot see review articles
- ✅ Can see published articles (if approved)

### Authenticated Users (Not Admin):
- ✅ Can see their own draft articles
- ✅ Can see their own review articles
- ✅ Can see their own published articles
- ❌ Cannot see other users' draft/review articles
- ✅ Can see published articles from anyone (via public policy)

---

## Verification Query

To verify admin can see draft/review articles, run:

```sql
-- As admin user, this should return draft/review articles
SELECT id, title, status, submission_status, author_id
FROM public.articles
WHERE status IN ('draft', 'review')
ORDER BY created_at DESC;
```

**Expected**: Admin should see all draft/review articles.

**If empty**: Check admin role detection:
```sql
-- Verify admin role
SELECT id, email, role FROM public.user_profiles WHERE id = auth.uid();
-- Should show role = 'admin'
```

---

## Important Notes

1. **Admin Role Detection**: The policy checks **both**:
   - JWT claim: `auth.jwt() ->> 'role' = 'admin'`
   - Database: `user_profiles.role = 'admin'`
   
   Ensure at least one is set for admin users.

2. **No Status Filtering**: The admin policy intentionally has no status filter to allow full visibility for moderation.

3. **Public Policy Still Active**: Public users are still restricted to published articles only.

4. **User Submissions**: Regular users can see their own submissions regardless of status, but not others'.

---

## Summary

✅ **YES** - After applying remediation SQL, admins will see:
- Draft articles
- Review articles  
- Published articles
- Archived articles
- All submission statuses (pending, approved, rejected)

The admin policy grants **unrestricted SELECT access** to all articles for users with admin role.


