# RLS (Row Level Security) and Security Guide

## What is RLS?

**Row Level Security (RLS)** is a PostgreSQL feature that restricts which rows users can see or modify in a table. It's like having a bouncer at the door of your database - even if someone has access to the table, they can only see/modify rows they're allowed to.

## Why RLS is Important

### Without RLS:
- ❌ **Any authenticated user can see ALL data** (all articles, all user profiles, etc.)
- ❌ **Users can modify other users' data**
- ❌ **No protection against malicious queries**
- ❌ **Security vulnerabilities**

### With RLS:
- ✅ **Users only see their own data** (unless they're admins)
- ✅ **Public users only see published content**
- ✅ **Admins can see everything**
- ✅ **Protection against unauthorized access**

## What Happens If We Remove RLS?

### If RLS is DISABLED on a table:
1. **Anyone with database access can see ALL rows**
2. **No automatic filtering** - you'd have to filter in application code
3. **Security risk** - if someone gets database credentials, they see everything
4. **No protection** against SQL injection or malicious queries

### If RLS is ENABLED but NO policies exist:
1. **NO ONE can access the table** (not even admins!)
2. **All queries return empty** or fail
3. **Application breaks**

### If RLS is ENABLED with correct policies:
1. ✅ **Users see only what they should**
2. ✅ **Admins see everything**
3. ✅ **Public sees only published content**
4. ✅ **Secure by default**

## Current RLS Setup for InvestingPro

### Tables That NEED RLS:
1. **`user_profiles`** - Users should only see their own profile (admins see all)
2. **`articles`** - Public sees published, authors see their own, admins see all
3. **`reviews`** - Users see their own, public sees approved
4. **`portfolios`** - Users see only their own
5. **`affiliate_clicks`** - Users see their own clicks
6. **`calculator_results`** - Users see their own results

### Tables That Might NOT Need RLS:
1. **`products`** - If all products should be public
2. **`assets`** - If all assets should be public
3. **`categories`** - Usually public
4. **Reference data** - Usually public

## RLS Policy Patterns

### Pattern 1: Users See Own Data
```sql
CREATE POLICY "Users see own data" 
ON table_name FOR SELECT 
USING (auth.uid() = user_id);
```

### Pattern 2: Public Sees Published Only
```sql
CREATE POLICY "Public sees published" 
ON articles FOR SELECT 
USING (status = 'published');
```

### Pattern 3: Admins See Everything
```sql
-- Option A: Using function (no recursion)
CREATE POLICY "Admins see all" 
ON table_name FOR ALL 
USING (public.is_admin(auth.uid()));

-- Option B: Direct check (can cause recursion)
CREATE POLICY "Admins see all" 
ON table_name FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
```

## Common RLS Issues

### Issue 1: Infinite Recursion
**Problem:** Policy on `user_profiles` queries `user_profiles` itself
**Solution:** Use security definer function or check JWT claims

### Issue 2: Admin Can't See Data
**Problem:** Admin policy not working
**Solution:** Ensure admin role is set and policy uses correct check

### Issue 3: Users Can't See Their Own Data
**Problem:** Policy too restrictive
**Solution:** Add policy for users to see own data

## Recommended RLS Configuration

### For `user_profiles`:
- ✅ Users can SELECT their own profile
- ✅ Users can UPDATE their own profile
- ✅ Users can INSERT their own profile (for signup)
- ✅ Admins can SELECT/UPDATE all profiles

### For `articles`:
- ✅ Public can SELECT published articles
- ✅ Authors can SELECT/UPDATE their own articles
- ✅ Admins can SELECT/UPDATE/DELETE all articles
- ✅ Authenticated users can INSERT articles

### For `reviews`:
- ✅ Public can SELECT approved reviews
- ✅ Users can SELECT/INSERT their own reviews
- ✅ Admins can SELECT/UPDATE/DELETE all reviews

## How to Check Current RLS Status

```sql
-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS command,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## Security Best Practices

1. **Always enable RLS on sensitive tables** (user data, private content)
2. **Use security definer functions** to avoid recursion
3. **Test policies thoroughly** - ensure admins can access, users can't
4. **Document your policies** - know what each policy does
5. **Review policies regularly** - ensure they match your security requirements
6. **Don't disable RLS** unless you have a very good reason

## If You Want to Temporarily Disable RLS (NOT RECOMMENDED)

```sql
-- ⚠️ WARNING: This removes all security!
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- To re-enable:
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Only do this for:**
- Testing/debugging
- Migration scripts
- Temporary maintenance

**Never do this in production without understanding the security implications!**


