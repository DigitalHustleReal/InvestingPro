# How to Find Your User Email

If the SQL queries return no rows, try these methods:

## Method 1: Check Your Browser/Application

1. **Look at your login email** - The email you used to sign up
2. **Check your Supabase dashboard**:
   - Go to Authentication > Users
   - Find your user account
   - Copy the email address

## Method 2: Check Application Code

If you're logged into the application:

1. Open browser console (F12)
2. Run this JavaScript:
   ```javascript
   // Get current user from Supabase
   const { data } = await supabase.auth.getUser();
   console.log('Your email:', data.user?.email);
   console.log('Your user ID:', data.user?.id);
   ```

3. Copy the email and user ID
4. Use them in the SQL scripts

## Method 3: Check Environment Variables

Your application might have a default admin email in:
- `.env.local`
- `.env`
- Environment configuration

## Method 4: Create Admin User Manually

If you can't find your user, you can create one:

1. **Get your user ID from the browser console** (Method 2)
2. **Run this SQL** (replace with your actual values):
   ```sql
   INSERT INTO user_profiles (id, email, role, full_name)
   VALUES (
       'your-user-id-from-console'::uuid,
       'your-email@example.com',
       'admin',
       'Your Name'
   )
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

## Method 5: Use Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Find your user account
4. Copy the **Email** and **UUID**
5. Use them in `SET_ADMIN_ROLE_SIMPLE.sql`

## Quick Test

After setting admin role, test it:

```sql
-- This should return your user with role = 'admin'
SELECT id, email, role 
FROM user_profiles 
WHERE email = 'your-email@example.com';
```

If it shows `role = 'admin'`, you're all set!


