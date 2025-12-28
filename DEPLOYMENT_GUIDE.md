# Deployment Guide - InvestingPro Platform

**Status:** Ready for Production Deployment  
**Last Updated:** Now

---

## ✅ Pre-Deployment Checklist

### Build Verification
- [x] Build passes successfully ✅
- [x] All 73 pages generated ✅
- [x] No TypeScript errors ✅
- [x] No build warnings ✅

### Configuration
- [x] Security headers configured ✅
- [x] Image optimization enabled ✅
- [x] Error boundaries in place ✅
- [x] Logger implemented ✅

---

## 🚀 Step 1: Set Environment Variables in Vercel

### Required Variables

1. **Go to Vercel Dashboard:**
   - Navigate to your project
   - Settings → Environment Variables

2. **Add Required Variables:**

#### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Security Secrets (Required)
```
SCRAPER_SECRET=<generate with: openssl rand -hex 32>
CRON_SECRET=<generate with: openssl rand -hex 32>
```

#### Application URL (Required)
```
NEXT_PUBLIC_BASE_URL=https://investingpro.in
```

#### Stripe (Optional but Recommended)
```
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (same as above)
```

#### OpenAI (Optional)
```
OPENAI_API_KEY=sk-...
```

3. **Set Environment Scope:**
   - For each variable, select: Production, Preview, Development
   - Click "Save"

4. **Reference:**
   - See `ENV_VARIABLES_CHECKLIST.md` for complete list

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy via Git (Recommended)

1. **Push to Repository:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Vercel Auto-Deploy:**
   - Vercel will automatically detect the push
   - Start deployment automatically
   - Monitor in Vercel dashboard

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI (if not installed):**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

---

## 🚀 Step 3: Post-Deployment Verification

### Immediate Checks (Within 5 minutes)

1. **Homepage:**
   - [ ] Visit production URL
   - [ ] Verify homepage loads
   - [ ] Check for console errors

2. **Health Check:**
   - [ ] Visit `/api/health`
   - [ ] Verify returns `{"status":"ok"}`

3. **Key Pages:**
   - [ ] `/calculators` - Calculator listing
   - [ ] `/credit-cards` - Credit cards page
   - [ ] `/banking` - Banking page

4. **Calculators (Sample 3):**
   - [ ] `/calculators/sip` - SIP calculator
   - [ ] `/calculators/emi` - EMI calculator
   - [ ] `/calculators/fd` - FD calculator

5. **API Routes:**
   - [ ] `/api/health` - Health check
   - [ ] `/api/products/credit-cards/[slug]` - Product API

### Extended Verification (Within 30 minutes)

6. **All Calculators (11 total):**
   - [ ] `/calculators/sip`
   - [ ] `/calculators/swp`
   - [ ] `/calculators/lumpsum`
   - [ ] `/calculators/fd`
   - [ ] `/calculators/emi`
   - [ ] `/calculators/tax`
   - [ ] `/calculators/retirement`
   - [ ] `/calculators/inflation-adjusted-returns`
   - [ ] `/calculators/ppf`
   - [ ] `/calculators/nps`
   - [ ] `/calculators/goal-planning`

7. **Navigation:**
   - [ ] All main menu links work
   - [ ] Footer links work
   - [ ] Mobile navigation works

8. **SEO:**
   - [ ] `/sitemap.xml` accessible
   - [ ] `/robots.txt` accessible
   - [ ] Meta tags present on pages

---

## 🔍 Monitoring Setup

### Vercel Analytics
1. Go to Vercel Dashboard → Analytics
2. Enable Analytics (if not already)
3. Monitor:
   - Page views
   - Performance metrics
   - Error rates

### Error Tracking
1. Vercel automatically tracks errors
2. Check: Dashboard → Logs
3. Set up alerts for critical errors

### Uptime Monitoring (Optional)
1. Set up UptimeRobot or similar
2. Monitor:
   - Homepage: `https://investingpro.in`
   - Health: `https://investingpro.in/api/health`
   - Check every 5 minutes

---

## 🚨 Rollback Procedure

If deployment fails or issues occur:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

3. **Emergency:**
   - Disable broken feature
   - Push hotfix
   - Redeploy

---

## 📊 Post-Deployment Tasks

### Within 24 Hours:
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all calculators work
- [ ] Test user sign up/login
- [ ] Test Stripe checkout (test mode)
- [ ] Submit sitemap to Google Search Console

### Within 1 Week:
- [ ] Gather user feedback
- [ ] Fix any critical bugs
- [ ] Optimize performance based on metrics
- [ ] Review and improve SEO

---

## ✅ Deployment Checklist

### Pre-Deployment
- [x] Build passes ✅
- [x] Environment variables documented ✅
- [x] Security headers configured ✅
- [x] Error handling in place ✅
- [ ] Environment variables set in Vercel ⏳

### Deployment
- [ ] Code pushed to repository
- [ ] Vercel deployment triggered
- [ ] Deployment successful
- [ ] Domain configured

### Post-Deployment
- [ ] Homepage loads
- [ ] Health check works
- [ ] All calculators functional
- [ ] API routes respond
- [ ] No critical errors

---

## 🎯 Success Criteria

**Deployment is successful when:**
- ✅ Homepage loads in < 3 seconds
- ✅ All 11 calculators work
- ✅ API routes respond correctly
- ✅ No critical errors in logs
- ✅ Health check returns OK
- ✅ Sitemap accessible

---

## 📞 Support

**If Issues Occur:**
1. Check Vercel logs: Dashboard → Deployments → Logs
2. Check build logs: Dashboard → Deployments → Build Logs
3. Verify environment variables are set
4. Check Supabase connection (if applicable)
5. Review error tracking in Vercel

---

**Status:** Ready for Deployment  
**Confidence:** High  
**Estimated Deployment Time:** 15-30 minutes

