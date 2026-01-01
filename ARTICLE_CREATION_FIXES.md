# Article Creation & Visibility Fixes

## Issues Fixed

### 1. Article Creation Error ("Something went wrong")

**Problem**: The `api.entities.Article.create()` function was:
- Not returning the created article (only boolean)
- Not handling errors properly
- Missing required fields

**Fixes Applied**:
- ✅ Updated `Article.create()` to return the created article with `.select().single()`
- ✅ Added proper error handling with error messages
- ✅ Auto-populates required fields (author_id, author_name, category, status, etc.)
- ✅ Better error logging in the frontend

### 2. Articles Not Visible in Draft/Review Status

**Problem**: Admin users couldn't see draft/review articles because:
- RLS policies might not be detecting admin role correctly
- Queries weren't showing proper error messages

**Fixes Applied**:
- ✅ Added error logging to article list queries
- ✅ Added console logging to debug article fetching
- ✅ Added error toast notifications
- ✅ Improved error handling in queries

## Required Database Setup

### Ensure Admin Role is Set

The admin RLS policy checks for admin role in two ways:
1. JWT claim: `auth.jwt() ->> 'role' = 'admin'`
2. Database: `user_profiles.role = 'admin'`

**To set admin role in database**:
```sql
-- Check current user's role
SELECT id, email, role FROM user_profiles WHERE email = 'your-email@example.com';

-- Set admin role
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Verify RLS Policies

Run this query to check if admin policies exist:
```sql
SELECT 
    polname AS policy_name,
    polcmd AS command,
    pg_get_expr(polqual, polrelid) AS using_expression
FROM pg_policy 
WHERE polrelid = 'public.articles'::regclass
AND polname LIKE '%admin%';
```

Should see: `"Admins can manage articles"` policy with `FOR ALL` command.

## Testing Steps

### 1. Test Article Creation
1. Go to `/admin/articles/new`
2. Enter a title and content
3. Click "Save"
4. Should redirect to edit page (not show error)

### 2. Test Article Visibility
1. Go to `/admin/articles`
2. Check browser console for logs:
   - Should see: "Fetched articles: X articles"
   - Should see status breakdown with draft/review counts
3. Filter by status:
   - Select "Draft" - should show draft articles
   - Select "Review" - should show review articles

### 3. Verify Admin Role
1. Open browser console
2. Check if you're authenticated:
   ```javascript
   // In browser console
   const { data } = await supabase.auth.getUser();
   console.log('User:', data.user);
   ```
3. Check user_profiles role:
   ```sql
   SELECT id, email, role FROM user_profiles WHERE id = 'your-user-id';
   ```

## Debugging

### If Articles Still Not Visible

1. **Check RLS Policy**:
   ```sql
   -- Test as your user
   SET ROLE authenticated;
   SELECT * FROM articles WHERE status = 'draft' LIMIT 1;
   ```

2. **Check Admin Policy**:
   ```sql
   -- Verify policy exists
   SELECT * FROM pg_policy WHERE polrelid = 'articles'::regclass;
   ```

3. **Check Browser Console**:
   - Look for Supabase errors
   - Check network tab for failed requests
   - Look for RLS policy violation errors

### If Article Creation Still Fails

1. **Check Required Fields**:
   - title (required)
   - slug (required, auto-generated)
   - content (required)
   - category (required, defaults to 'investing-basics')

2. **Check RLS INSERT Policy**:
   ```sql
   -- Should allow authenticated users to insert
   SELECT * FROM pg_policy 
   WHERE polrelid = 'articles'::regclass 
   AND polcmd = 'a'; -- 'a' = INSERT
   ```

3. **Check Browser Console**:
   - Look for the actual error message
   - Check if it's an RLS violation or validation error

## Code Changes Summary

### lib/api.ts
- ✅ `Article.create()` now returns created article
- ✅ Auto-populates required fields
- ✅ Better error handling
- ✅ `Article.update()` now returns updated article
- ✅ Better error logging in `Article.list()`

### app/admin/articles/new/page.tsx
- ✅ Better error messages in mutation
- ✅ Handles missing article ID
- ✅ Console error logging

### app/admin/articles/page.tsx
- ✅ Added error handling in query
- ✅ Console logging for debugging
- ✅ Error toast notifications
- ✅ Status breakdown logging

## Next Steps

1. **Apply RLS Policies** (if not already applied):
   - Run `COMPLIANCE_REMEDIATION.sql` section 9 (Articles RLS Policies)

2. **Set Admin Role**:
   - Update your user_profiles.role to 'admin'

3. **Test**:
   - Create a new article
   - Verify it appears in the list
   - Check draft/review articles are visible

4. **Monitor Console**:
   - Check browser console for any errors
   - Check network tab for failed requests


