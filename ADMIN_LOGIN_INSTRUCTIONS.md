# Admin Login Setup - Instructions

I've created login and signup pages for the admin panel. Here's how to use them:

## Pages Created

1. **`/admin/login`** - Admin login page
2. **`/admin/signup`** - Admin signup page (creates account and sets admin role)

## How to Use

### Option 1: Sign Up (If you don't have an account yet)

1. **Go to**: `http://localhost:3000/admin/signup`
2. **Enter**:
   - Full Name
   - Email (your admin email)
   - Password (minimum 6 characters)
3. **Click "Create Admin Account"**
4. The system will:
   - Create your Supabase auth user
   - Create your user_profiles entry
   - Set your role to 'admin' automatically
5. **You'll be redirected** to `/admin` dashboard

### Option 2: Log In (If you already created the user in Supabase Dashboard)

1. **Go to**: `http://localhost:3000/admin/login`
2. **Enter**:
   - Email (your admin email)
   - Password (the password you set in Supabase Dashboard)
3. **Click "Sign In"**
4. The system will:
   - Verify your credentials
   - Check if you have admin role
   - Redirect you to `/admin` if successful

## Important Notes

### If Signup Fails to Set Admin Role

If the automatic admin role assignment fails during signup:

1. **Run this SQL** (replace with your email):
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

2. **Then log in** at `/admin/login`

### If You Created User in Supabase Dashboard

If you already created the user in Supabase Dashboard:

1. **Set admin role** (if not already done):
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

2. **Log in** at `/admin/login` with your email and password

## Testing

After logging in:

1. ✅ You should be redirected to `/admin`
2. ✅ You should see the admin dashboard
3. ✅ Go to `/admin/articles` - should see all articles
4. ✅ Try creating a new article - should work

## Troubleshooting

### "Access denied. Admin role required."
- Your user_profiles.role is not set to 'admin'
- Run the SQL update query above

### "Login failed" or "Invalid credentials"
- Check your email and password
- If you created user in Supabase Dashboard, use that password
- You can reset password in Supabase Dashboard → Authentication → Users

### Can't access admin pages after login
- Check browser console for errors
- Verify RLS policies are applied (run `COMPLIANCE_REMEDIATION.sql` section 9)
- Check that user_profiles.role = 'admin'

## Next Steps

1. ✅ Sign up or log in at `/admin/login` or `/admin/signup`
2. ✅ Verify you can access `/admin/articles`
3. ✅ Test creating a new article
4. ✅ Verify draft/review articles are visible


