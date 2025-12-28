# 🚀 Deployment Ready Checklist

## ✅ Pre-Deployment Status

### Completed ✅
- [x] Database schema created (`supabase/migrations/000_complete_schema.sql`)
- [x] Scraper system implemented (products, reviews, rates)
- [x] Cron jobs configured in `vercel.json`
- [x] GitHub Actions workflow created for Python scrapers
- [x] API updated to use Supabase (no mock data)
- [x] Pre-deployment check script created
- [x] All demo/mock data removed

### Required Before Deployment ⚠️

## 1. Environment Variables (CRITICAL)

Add these to **Vercel Dashboard → Settings → Environment Variables**:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://txwxmbmbqltefwvilsii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d3htYm1icWx0ZWZ3dmlsc2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDYxMzEsImV4cCI6MjA4MTg4MjEzMX0.u1nopugkY7CpPEwbmOKnnWzD9F_pkyl9qn-5PFOX59Y
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cron Authentication (Required)
CRON_SECRET=generate_random_secure_string_here

# OpenAI (Required for review sentiment analysis)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe (If using payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Optional
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**How to get SUPABASE_SERVICE_ROLE_KEY:**
1. Go to Supabase Dashboard → Settings → API
2. Copy "service_role" key (keep it secret!)

**How to generate CRON_SECRET:**
```bash
# On Mac/Linux
openssl rand -hex 32

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

## 2. Database Schema Deployment

**Before deploying, run the schema in Supabase:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy entire contents of `supabase/migrations/000_complete_schema.sql`
6. Paste and click **Run**
7. Verify tables are created:
   ```sql
   SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   Should return 25+ tables

## 3. GitHub Secrets (For Python Scrapers)

Add these to **GitHub Repository → Settings → Secrets and variables → Actions**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://txwxmbmbqltefwvilsii.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## 4. Test Build Locally

```bash
# Install dependencies
npm install

# Run build
npm run build

# Test production build
npm run start
```

**Check for:**
- ✅ No TypeScript errors
- ✅ No missing dependencies
- ✅ Build completes successfully
- ✅ No console errors

## 5. Vercel Deployment Steps

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### Step 2: Add Environment Variables
1. In project settings, go to **Environment Variables**
2. Add all variables from Step 1 above
3. Select environments: **Production**, **Preview**, **Development**
4. Click **Save**

### Step 3: Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Check build logs for errors

### Step 4: Verify Deployment
1. Visit your deployed URL
2. Test key pages:
   - Homepage: `https://your-app.vercel.app`
   - Health check: `https://your-app.vercel.app/api/health`
   - Credit cards: `https://your-app.vercel.app/credit-cards`

## 6. Post-Deployment Tasks

### Enable Cron Jobs

**Option A: Vercel Cron (Requires Pro Plan)**
- Cron jobs are automatically detected from `vercel.json`
- Check **Settings → Cron Jobs** in Vercel dashboard
- Verify jobs are scheduled correctly

**Option B: GitHub Actions (Recommended for Python)**
- Already configured in `.github/workflows/scraper.yml`
- Runs daily at 2:00 AM IST
- No additional setup needed (if secrets are configured)

### Test Scrapers

1. **Manual Test (GitHub Actions):**
   - Go to GitHub → Actions
   - Select "Data Scraper Pipeline"
   - Click "Run workflow" → "Run workflow"
   - Monitor execution logs

2. **Test API Endpoints:**
   ```bash
   # Health check
   curl https://your-app.vercel.app/api/health
   
   # Test cron endpoint (with auth)
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
        https://your-app.vercel.app/api/cron/scrape-products
   ```

### Monitor Logs

1. **Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Monitor function executions
   - Check for errors

2. **Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Monitor database queries
   - Check for RLS policy issues

## 7. Quick Verification Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] API health endpoint returns success
- [ ] Supabase connection works
- [ ] Product pages load (even if empty)
- [ ] No console errors in browser
- [ ] Build logs show no errors
- [ ] Environment variables are loaded
- [ ] Cron jobs are scheduled (or GitHub Actions run)

## 8. Common Issues & Solutions

### Issue: Build Fails
**Solution:**
- Check build logs in Vercel
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

### Issue: Environment Variables Not Loading
**Solution:**
- Verify variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Issue: Supabase Connection Fails
**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check Supabase project is active
- Verify RLS policies allow access

### Issue: Cron Jobs Not Running
**Solution:**
- Verify Vercel Pro plan (required for cron)
- Check `CRON_SECRET` is set
- Verify cron paths in `vercel.json`
- Use GitHub Actions as alternative

### Issue: Python Scrapers Don't Work
**Solution:**
- Vercel doesn't support Python natively
- Use GitHub Actions (already configured)
- Or deploy scrapers to separate service (Railway, Render)

## 9. Performance Optimization

After deployment:

1. **Monitor Performance:**
   - Check Vercel Analytics
   - Monitor function execution times
   - Watch for timeout errors

2. **Optimize Database:**
   - Add indexes for frequently queried fields
   - Review slow queries in Supabase
   - Optimize RLS policies

3. **Cache Strategy:**
   - Implement ISR for static pages
   - Use Supabase caching
   - Add CDN for assets

## 10. Security Checklist

- [ ] `CRON_SECRET` is set and secure
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is never exposed client-side
- [ ] RLS policies are configured correctly
- [ ] No sensitive data in client-side code
- [ ] API routes have proper authentication
- [ ] CORS is configured correctly

## 🎯 Ready to Deploy?

Run the pre-deployment check:
```bash
node scripts/pre-deploy-check.js
```

If all checks pass (except environment variables which need to be set in Vercel), you're ready!

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Check Supabase logs
3. Review error messages
4. Test locally first
5. Check environment variables

---

**Next Steps:**
1. ✅ Set environment variables in Vercel
2. ✅ Deploy database schema to Supabase
3. ✅ Deploy to Vercel
4. ✅ Configure GitHub secrets
5. ✅ Test and monitor

Good luck with your deployment! 🚀

