# ⚠️ Supabase Database Setup Required

**Status:** ❌ **NOT CONNECTED**  
**Issue:** Environment variables contain placeholder values

---

## 🔍 Current Situation

Your `.env.local` file contains **placeholder values**, not real Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co  ❌ Placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key                 ❌ Placeholder
```

**The database is NOT connected and will not work until you set up real credentials.**

---

## ✅ Quick Setup Guide

### Step 1: Create Supabase Project (5 minutes)

1. **Go to Supabase:**
   - Visit https://supabase.com
   - Sign up or log in

2. **Create New Project:**
   - Click "New Project"
   - Enter project name: `investingpro` (or your choice)
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

### Step 2: Get Your Credentials (2 minutes)

1. **In Supabase Dashboard:**
   - Go to **Settings** → **API**

2. **Copy These Values:**
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 3: Update Environment Variables (2 minutes)

1. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIzNDU2NywiZXhwIjoxOTYwODEwNTY3fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1MjM0NTY3LCJleHAiOjE5NjA4MTA1Njd9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Replace with your actual values from Supabase dashboard**

### Step 4: Run Database Migrations (5 minutes)

1. **Option A: Using Supabase Dashboard (Easiest)**
   - Go to Supabase Dashboard → **SQL Editor**
   - Copy contents of migration files:
     - `supabase/migrations/001_core_schema.sql`
     - `supabase/migrations/20250119_universal_asset_model.sql`
   - Paste and run each file

2. **Option B: Using Supabase CLI**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

### Step 5: Test Connection (1 minute)

```bash
# Test connection
node scripts/test-supabase-connection.js
```

**Expected Output:**
```
✅ Connection successful
✅ Table 'user_profiles' exists and is accessible
✅ Authentication service accessible
🎉 Supabase is properly configured and connected!
```

---

## 🚀 For Production (Vercel)

After setting up locally, also set in Vercel:

1. **Go to Vercel Dashboard:**
   - Your Project → **Settings** → **Environment Variables**

2. **Add All Three Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Select Environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Save and Redeploy**

---

## ✅ Verification

After setup, verify connection:

1. **Local Test:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/health
   # Should show: "database": { "connected": true }
   ```

2. **Production Test:**
   - Deploy to Vercel
   - Visit: `https://your-domain.com/api/health`
   - Check database status in response

---

## 📋 Checklist

- [ ] Supabase project created
- [ ] Credentials copied from Supabase dashboard
- [ ] `.env.local` updated with real values
- [ ] Database migrations run
- [ ] Connection test passes
- [ ] Environment variables set in Vercel
- [ ] Health check shows database connected

---

## 🆘 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Dashboard:** https://app.supabase.com
- **Connection Test Script:** `scripts/test-supabase-connection.js`
- **Status Document:** `SUPABASE_CONNECTION_STATUS.md`

---

**Current Status:** ❌ Not Connected - Setup Required  
**Estimated Setup Time:** 15-20 minutes  
**Priority:** High - Required for user authentication and data storage

