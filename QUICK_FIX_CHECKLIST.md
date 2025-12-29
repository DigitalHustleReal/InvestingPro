# Quick Fix Checklist - Admin Articles Not Showing

## ✅ Step 1: Verify Environment Variable is Loaded

Since you have `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, make sure:

1. **Dev server was restarted** after adding the key
   - Stop server (Ctrl+C)
   - Start again: `npm run dev`

2. **Verify the key is being read**:
   - Check server terminal for any "Missing SUPABASE_SERVICE_ROLE_KEY" errors
   - If you see this error, the server needs a restart

## ✅ Step 2: Test API Route Directly

Open in browser: `http://localhost:3000/api/admin/articles`

**Expected responses:**

✅ **Success** (articles exist):
```json
{
  "articles": [
    { "id": "...", "title": "...", "status": "draft", ... },
    ...
  ]
}
```

❌ **Unauthorized** (not logged in):
```json
{
  "error": "Unauthorized",
  "message": "Please log in to access admin articles"
}
```
→ **Solution**: Log in to your app first

❌ **Configuration Error**:
```json
{
  "error": "Configuration error",
  "message": "Missing SUPABASE_SERVICE_ROLE_KEY..."
}
```
→ **Solution**: Restart dev server

❌ **Database Error**:
```json
{
  "error": "Failed to fetch articles",
  "message": "...",
  "code": "..."
}
```
→ **Solution**: Check the error code and message

## ✅ Step 3: Check Server Logs

When you visit `/admin/articles`, check your **terminal where the dev server is running** for:

✅ **Success logs**:
```
Admin articles API: Successfully fetched 12 articles
```

❌ **Error logs**:
```
Failed to create admin client: Missing SUPABASE_SERVICE_ROLE_KEY...
Admin articles API query error: { message: "...", code: "..." }
```

## ✅ Step 4: Check Browser Console

Open DevTools (F12) → Console tab, look for:

✅ **Success**:
```
Admin articles fetched: 12
```

❌ **Errors**:
```
Error fetching admin articles: Failed to fetch articles: 401 Unauthorized
Error fetching admin articles: Failed to fetch articles: 500 Internal Server Error
```

## ✅ Step 5: Verify Articles Exist in Database

Run in Supabase SQL Editor:
```sql
-- Count total articles
SELECT COUNT(*) as total_articles FROM articles;

-- Count by status
SELECT status, COUNT(*) as count 
FROM articles 
GROUP BY status;

-- See sample articles
SELECT id, title, status, created_at 
FROM articles 
ORDER BY created_at DESC 
LIMIT 5;
```

**If count is 0**: Articles don't exist - you need to run your SQL insert files

**If count > 0**: Articles exist - the issue is with the API route or authentication

## 🔧 Most Common Issues

### Issue 1: Server Not Restarted
**Symptom**: API returns "Configuration error" even though key is in `.env.local`

**Fix**: 
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Issue 2: Not Logged In
**Symptom**: API returns "Unauthorized" (401)

**Fix**: 
- Log in to your application
- Or the code now allows access in development mode (just updated)

### Issue 3: No Articles in Database
**Symptom**: API returns `{"articles": []}` (empty array)

**Fix**: 
- Run your SQL insert files in Supabase SQL Editor
- Files to run: `draft_article_review_sample.sql`, `elss_articles_batch.sql`, etc.

### Issue 4: Wrong Service Role Key
**Symptom**: API returns database errors

**Fix**: 
- Get the correct key from Supabase Dashboard → Settings → API
- Make sure it's the `service_role` key (secret), not the `anon` key

## 📋 Quick Test Sequence

1. **Restart dev server** (if you haven't already)
2. **Visit**: `http://localhost:3000/api/admin/articles`
3. **Check response**:
   - If JSON with articles → ✅ Working! Check why page isn't showing them
   - If error → Check error message and fix accordingly
4. **Visit**: `http://localhost:3000/admin/articles`
5. **Check browser console** for errors
6. **Check server terminal** for logs

## 🚨 If Still Not Working

Share these details:

1. **API route response** (from step 2 above)
2. **Server terminal logs** (when visiting `/admin/articles`)
3. **Browser console errors** (F12 → Console)
4. **Article count** (from SQL query in step 5)

This will help pinpoint the exact issue!

