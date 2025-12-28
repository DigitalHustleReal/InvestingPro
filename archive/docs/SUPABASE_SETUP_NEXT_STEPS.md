# Supabase Setup - Next Steps

**Supabase URL Updated:** ✅ `https://txwxmbmbqltefwvilsii.supabase.co`

---

## ✅ Completed

- [x] Supabase URL set in `.env.local`

---

## ⏳ Still Required

### 1. Get Your Supabase API Keys

1. **Go to Supabase Dashboard:**
   - Visit: https://app.supabase.com
   - Login to your account
   - Select your project (or create one if needed)

2. **Get API Keys:**
   - Go to **Settings** → **API**
   - Copy these values:

#### Required Keys:

**Anon/Public Key:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- This is the `anon` `public` key
- Safe to expose in frontend code

**Service Role Key:**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- This is the `service_role` key
- **KEEP SECRET** - Only for server-side use
- Never expose in frontend

---

## 🔧 Update .env.local

Add/update these lines in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://txwxmbmbqltefwvilsii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Replace:**
- `your-anon-key-here` with your actual anon key from Supabase
- `your-service-role-key-here` with your actual service role key

---

## ✅ Verify Connection

After updating the keys, test the connection:

```bash
# Option 1: Run test script (if you have dotenv installed)
node scripts/test-supabase-connection.js

# Option 2: Start dev server and check health endpoint
npm run dev
# Then visit: http://localhost:3000/api/health
# Should show: "database": { "connected": true }
```

---

## 📋 Database Setup

After connection works, you'll need to:

1. **Run Migrations:**
   - Go to Supabase Dashboard → **SQL Editor**
   - Run the SQL files from `supabase/migrations/`:
     - `001_core_schema.sql`
     - `20250119_universal_asset_model.sql`

2. **Or use Supabase CLI:**
   ```bash
   supabase db push
   ```

---

## 🚀 For Production (Vercel)

After local setup works, also set in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Select: Production, Preview, Development
4. Save and redeploy

---

## 📝 Current Status

- ✅ Supabase URL: `https://txwxmbmbqltefwvilsii.supabase.co`
- ⏳ Anon Key: Need to add
- ⏳ Service Role Key: Need to add
- ⏳ Database Tables: Need to create

---

**Next Action:** Get your API keys from Supabase dashboard and update `.env.local`

