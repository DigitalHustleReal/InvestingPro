# Setup First Admin User - Step by Step

Since you haven't set up authentication yet, follow these steps:

## Option 1: Sign Up Through Your Application (Recommended)

1. **Start your Next.js app** (if not running):
   ```bash
   npm run dev
   ```

2. **Go to your sign-up page** (usually `/signup` or `/register`)

3. **Create an account** with your admin email

4. **After signing up**, run this SQL to set admin role:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

5. **Verify it worked**:
   ```sql
   SELECT id, email, role FROM user_profiles WHERE email = 'your-admin-email@example.com';
   ```

## Option 2: Create User Directly in Supabase Dashboard

1. **Go to Supabase Dashboard** → Authentication → Users

2. **Click "Add User"** or "Create User"

3. **Enter your admin email and password**

4. **After user is created**, run this SQL:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

5. **If user_profiles entry doesn't exist**, it should be created automatically by the `handle_new_user()` trigger, but if not, run:
   ```sql
   INSERT INTO user_profiles (id, email, role, full_name)
   SELECT 
       id,
       email,
       'admin',
       COALESCE(raw_user_meta_data->>'full_name', email)
   FROM auth.users
   WHERE email = 'your-admin-email@example.com'
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

## Option 3: Manual Creation (If Auth Not Working)

If authentication isn't set up yet, you can manually create the user_profiles entry:

1. **Get a UUID** (generate one or use an online UUID generator)

2. **Run this SQL**:
   ```sql
   -- First, create the auth user (if possible through dashboard)
   -- Then create/update user_profiles
   
   INSERT INTO user_profiles (id, email, role, full_name)
   VALUES (
       gen_random_uuid(),  -- Or use a specific UUID
       'your-admin-email@example.com',
       'admin',
       'Admin User'
   )
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

   **Note**: This won't work if there's a foreign key constraint to auth.users. In that case, you MUST create the auth user first.

## Verify Setup

After setting up, verify everything works:

```sql
-- Check user_profiles
SELECT id, email, role, full_name 
FROM user_profiles 
WHERE email = 'your-admin-email@example.com';

-- Should show role = 'admin'
```

## Test Admin Access

1. **Log in** to your application with the admin email
2. **Go to** `/admin/articles`
3. **You should see** all articles (draft, review, published)
4. **Try creating** a new article - it should work

## Important Notes

- **The `handle_new_user()` trigger** should automatically create a user_profiles entry when a user signs up
- **If the trigger doesn't exist**, run the trigger creation from `COMPLIANCE_REMEDIATION.sql` section 5
- **RLS policies** require either:
  - JWT claim with `role = 'admin'`, OR
  - `user_profiles.role = 'admin'`
  
  Setting `user_profiles.role = 'admin'` is the easiest way.

## Next Steps

1. ✅ Create user account (sign up)
2. ✅ Set admin role in user_profiles
3. ✅ Verify admin access works
4. ✅ Test article creation
5. ✅ Test viewing draft/review articles


