# Pre-Deployment Checklist for Vercel

## ✅ Critical Steps Before Deployment

### 1. Environment Variables Setup

Add these to **Vercel Dashboard → Settings → Environment Variables**:

#### Required Variables:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://txwxmbmbqltefwvilsii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d3htYm1icWx0ZWZ3dmlsc2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDYxMzEsImV4cCI6MjA4MTg4MjEzMX0.u1nopugkY7CpPEwbmOKnnWzD9F_pkyl9qn-5PFOX59Y
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI (for review sentiment analysis)
OPENAI_API_KEY=your_openai_api_key_here

# Cron Jobs Authentication
CRON_SECRET=generate_random_string_here

# Stripe (if using payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Node Environment
NODE_ENV=production
```

**⚠️ Important:**
- Set `CRON_SECRET` to a random secure string (e.g., use `openssl rand -hex 32`)
- Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard → Settings → API
- Add variables for **Production**, **Preview**, and **Development** environments

### 2. Database Schema Deployment

**Before deploying, run the complete schema in Supabase:**

1. Go to Supabase Dashboard → SQL Editor
2. Copy entire contents of `supabase/migrations/000_complete_schema.sql`
3. Paste and run in SQL Editor
4. Verify all tables are created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

### 3. Build Test

Test the build locally to catch errors:

```bash
# Install dependencies
npm install

# Run build
npm run build

# Test production build locally
npm run start
```

**Check for:**
- ✅ No TypeScript errors
- ✅ No missing dependencies
- ✅ All imports resolve correctly
- ✅ No hardcoded localhost URLs
- ✅ Environment variables are accessed correctly

### 4. Verify Cron Jobs Configuration

Check `vercel.json`:
- ✅ Cron paths are correct
- ✅ Schedules are set correctly
- ✅ `maxDuration` is appropriate (300s = 5 min)

**Note:** Vercel Cron requires:
- Project must be on a paid plan (Pro or Enterprise)
- Or use Vercel Cron Jobs (free tier has limitations)

### 5. Python Runtime for Scrapers

**⚠️ Important Issue:** Vercel doesn't natively support Python in serverless functions.

**Solutions:**

**Option A: Use Node.js to call external Python service**
- Deploy Python scrapers to a separate service (Railway, Render, etc.)
- Call via HTTP from Vercel cron jobs

**Option B: Rewrite scrapers in Node.js/TypeScript**
- Use Puppeteer/Playwright for browser automation
- Use Cheerio for HTML parsing
- More Vercel-friendly

**Option C: Use GitHub Actions for scraping**
- Run Python scrapers via GitHub Actions
- Schedule with cron syntax
- Update Supabase directly

**Recommended:** Start with Option C (GitHub Actions) for scraping, keep Vercel for the Next.js app.

### 6. API Routes Verification

Check these API routes work:
- ✅ `/api/health` - Health check endpoint
- ✅ `/api/cron/scrape-products` - Product scraper
- ✅ `/api/cron/scrape-reviews` - Review processor
- ✅ `/api/cron/scrape-rates` - Rate scraper
- ✅ `/api/cron/run-worker` - Master worker

**Test locally:**
```bash
# Start dev server
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health
```

### 7. Remove Local-Only Code

Check for:
- ❌ `localhost:3000` hardcoded URLs
- ❌ Local file system access (use Supabase instead)
- ❌ Development-only imports
- ❌ Console.log statements (use logger instead)

### 8. Supabase Connection Test

Verify Supabase connection works:

```bash
# Test connection script
node scripts/test-supabase-connection.js
```

Or visit: `https://your-domain.vercel.app/api/health`

### 9. Check Dependencies

Review `package.json`:
- ✅ All dependencies are production-ready
- ✅ No dev-only packages in production
- ✅ Python dependencies are in `lib/scraper/requirements.txt` (not in package.json)

### 10. Security Headers

Verify security headers are configured (check `next.config.js`):
- ✅ Security headers
- ✅ CORS settings
- ✅ Content Security Policy

### 11. Image Optimization

Check:
- ✅ All images use Next.js Image component
- ✅ External image domains are configured in `next.config.js`

### 12. Environment-Specific Configs

Ensure:
- ✅ Production URLs are used (not localhost)
- ✅ API endpoints use environment variables
- ✅ No hardcoded credentials

### 13. Error Handling

Verify:
- ✅ Error boundaries are in place
- ✅ API routes have proper error handling
- ✅ Logger is used instead of console.log

### 14. Performance

Check:
- ✅ Large files are optimized
- ✅ Unused code is removed
- ✅ Images are optimized
- ✅ Database queries are efficient

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Pre-deployment: Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Add Environment Variables

In Vercel project settings:
1. Go to **Settings → Environment Variables**
2. Add all variables from Step 1 above
3. Select environments (Production, Preview, Development)
4. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Check build logs for errors

### Step 5: Verify Deployment

1. Visit your deployed URL
2. Test key pages:
   - Homepage
   - Credit cards listing
   - Product detail pages
   - API health endpoint

### Step 6: Set Up Cron Jobs

**If using Vercel Cron:**
1. Go to **Settings → Cron Jobs** (if available)
2. Verify cron jobs are detected from `vercel.json`
3. Check execution logs

**If using GitHub Actions (Recommended for Python scrapers):**
1. Create `.github/workflows/scraper.yml`
2. Set up scheduled runs
3. Configure secrets in GitHub

## 🔧 Post-Deployment Tasks

### 1. Monitor Logs

- Check Vercel function logs
- Monitor error rates
- Watch for timeout issues

### 2. Test Cron Jobs

- Manually trigger cron endpoints
- Verify data is being scraped
- Check Supabase for updates

### 3. Set Up Monitoring

- Configure error tracking (Sentry, etc.)
- Set up uptime monitoring
- Create alerts for failures

### 4. Database Monitoring

- Monitor Supabase usage
- Check query performance
- Review RLS policies

## ⚠️ Known Issues & Solutions

### Issue: Python Scrapers Don't Work on Vercel

**Solution:** Use GitHub Actions for Python scrapers:
- Create `.github/workflows/scraper.yml`
- Run Python scripts on schedule
- Update Supabase directly

### Issue: Cron Jobs Not Running

**Solution:**
- Verify Vercel Pro plan (required for cron)
- Check `CRON_SECRET` is set
- Verify cron paths in `vercel.json`
- Check Vercel cron logs

### Issue: Environment Variables Not Loading

**Solution:**
- Verify variables are set in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables
- Use `process.env.VARIABLE_NAME` (not `import.meta.env`)

## 📋 Quick Checklist

- [ ] All environment variables added to Vercel
- [ ] Database schema deployed to Supabase
- [ ] Build passes locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] All API routes tested
- [ ] Supabase connection verified
- [ ] Cron jobs configured (or GitHub Actions set up)
- [ ] Python scrapers deployment strategy decided
- [ ] Security headers configured
- [ ] Error handling in place
- [ ] Logger configured (no console.log)
- [ ] Images optimized
- [ ] No hardcoded localhost URLs
- [ ] Production URLs configured

## 🎯 Recommended Deployment Strategy

1. **Phase 1: Deploy Next.js App**
   - Deploy to Vercel
   - Test all pages
   - Verify API routes

2. **Phase 2: Set Up Scrapers**
   - Use GitHub Actions for Python scrapers
   - Or deploy to separate service (Railway/Render)
   - Test scraping pipeline

3. **Phase 3: Enable Cron Jobs**
   - Set up Vercel cron (if on Pro plan)
   - Or use GitHub Actions scheduling
   - Monitor first few runs

4. **Phase 4: Monitor & Optimize**
   - Watch error rates
   - Optimize slow queries
   - Improve scraper reliability

---

**Ready to deploy?** Run through this checklist and you're good to go! 🚀

