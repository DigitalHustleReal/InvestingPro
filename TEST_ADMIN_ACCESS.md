# Test Admin Access - Verification Steps

Your admin role is set! ✅ (id, email, role='admin')

Now let's verify everything works:

## Step 1: Test Article Visibility

1. **Log in** to your application with your admin email
2. **Go to** `/admin/articles`
3. **Check browser console** (F12) - you should see:
   ```
   Fetched articles: X articles
   Status breakdown: { draft: X, review: X, published: X, archived: X }
   ```
4. **You should see**:
   - All articles listed (draft, review, published, archived)
   - Status filter dropdown working
   - Search working

## Step 2: Test Article Creation

1. **Go to** `/admin/articles/new`
2. **Enter**:
   - Title: "Test Article"
   - Content: "This is a test"
3. **Click "Save"**
4. **Should**:
   - ✅ Save successfully (no "something went wrong" error)
   - ✅ Redirect to edit page
   - ✅ Show in articles list

## Step 3: Test Draft/Review Visibility

1. **Create a draft article** (status = 'draft')
2. **Go to** `/admin/articles`
3. **Filter by "Draft"** - should see your draft article
4. **Create a review article** (status = 'review')
5. **Filter by "Review"** - should see your review article

## Step 4: Verify RLS Policies

If articles still aren't visible, check RLS policies:

```sql
-- Check if admin policy exists
SELECT 
    polname,
    CASE polcmd
        WHEN '*' THEN 'ALL'
        WHEN 'r' THEN 'SELECT'
        ELSE polcmd::text
    END AS command
FROM pg_policy
WHERE polrelid = 'public.articles'::regclass
AND polname LIKE '%admin%';
```

Should see: `"Admins can manage articles"` with command `ALL`

## Troubleshooting

### If articles still not visible:

1. **Check browser console** for errors
2. **Check network tab** - look for failed requests to Supabase
3. **Verify you're logged in**:
   ```javascript
   // In browser console
   const { data } = await supabase.auth.getUser();
   console.log('Logged in as:', data.user?.email);
   ```

### If article creation still fails:

1. **Check browser console** for the actual error message
2. **Verify required fields**:
   - title (required)
   - slug (auto-generated)
   - content (required)
   - category (defaults to 'investing-basics')

### If RLS policy missing:

Run this from `COMPLIANCE_REMEDIATION.sql`:
- Section 9: "RLS Policies - Articles (if missing)"

## Success Indicators

✅ Admin role set: `role = 'admin'` in user_profiles  
✅ Can see all articles (draft, review, published)  
✅ Can create new articles  
✅ No "something went wrong" errors  
✅ Articles appear in list immediately after creation  

## Next Steps

Once everything works:
1. ✅ Create your first real article
2. ✅ Test moderation features
3. ✅ Test publishing workflow
4. ✅ Set up additional admin users if needed


