# InvestingPro Deployment Guide

**Platform:** InvestingPro  
**Date:** January 2026  
**Target:** Production Deployment

---

## 🎯 Overview

This guide walks you through deploying InvestingPro to production. Follow each step carefully to ensure a successful deployment.

---

## ✅ Pre-Deployment Checklist

Before starting deployment, ensure you have:

- [ ] Reviewed the `DEPLOYMENT_READINESS_AUDIT.md`
- [ ] Access to Supabase project (admin rights)
- [ ] Access to hosting platform (Vercel/Cloudflare/AWS)
- [ ] All required API keys and credentials
- [ ] Domain name and DNS access
- [ ] SSL certificate configured (or hosting platform handles it)

---

## 📋 Step-by-Step Deployment

### Step 1: Environment Setup

**Duration:** 15 minutes

1. Copy the environment template:

```bash
cp env.production.template .env.production
```

2. Fill in all required values (see `env.production.template` for full list)

3. Validate environment configuration:

```bash
tsx scripts/setup-production.ts
```

4. Fix any validation errors before proceeding.

**Critical Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BASE_URL`
- `OPENAI_API_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

### Step 2: Database Setup

**Duration:** 30-45 minutes

Follow the detailed guide in `DATABASE_SETUP_GUIDE.md`:

1. **Validate migrations:**

```bash
tsx scripts/apply-migrations.ts
```

2. **Apply migrations via Supabase CLI:**

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Or apply manually via Supabase Dashboard SQL Editor.

3. **Verify tables created:**

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

4. **Enable RLS and apply policies** (see `DATABASE_SETUP_GUIDE.md`)

---

### Step 3: Create Admin User

**Duration:** 5 minutes

1. Run the admin setup script:

```bash
tsx scripts/create-admin.ts
```

2. Follow the prompts to create your admin account

3. Verify you can log in at `/admin/login`

---

### Step 4: Test Critical Flows

**Duration:** 10 minutes

1. Run the critical flows test:

```bash
tsx scripts/test-critical-flows.ts
```

2. Ensure all tests pass

3. If tests fail, review errors and fix before deploying

**Tests include:**
- Database connection
- Fetch published content
- API health checks
- CMS health checks
- Authentication flows
- Service configurations

---

### Step 5: Build Production Bundle

**Duration:** 3-5 minutes

1. Clean previous builds:

```bash
rm -rf .next
```

2. Run production build:

```bash
npm run build
```

3. Verify build completes without errors

4. Check build output for warnings

---

### Step 6: Deploy to Hosting Platform

Choose your deployment platform:

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Set environment variables in Vercel Dashboard:**
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.production`
3. Deploy again to apply changes

#### Option B: Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy .next
```

#### Option C: AWS Amplify

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables
4. Deploy

---

### Step 7: Configure Domain & SSL

1. **Point domain to hosting:**
   - Add A/CNAME records in DNS provider
   - Wait for DNS propagation (can take up to 24 hours)

2. **Verify SSL certificate:**
   - Most platforms auto-provision SSL
   - Check certificate is valid at `https://your-domain.com`

3. **Update environment variable:**
   ```
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

4. **Redeploy to apply changes**

---

### Step 8: Post-Deployment Verification

**Duration:** 15 minutes

1. **Test homepage loads:**
   ```
   curl https://your-domain.com
   ```

2. **Test API endpoints:**
   ```
   curl https://your-domain.com/api/health
   curl https://your-domain.com/api/cms/health
   ```

3. **Test critical pages:**
   - `/` (homepage)
   - `/calculators/sip` (calculator page)
   - `/glossary` (glossary index)
   - `/admin/login` (admin login)

4. **Test admin access:**
   - Log in with admin credentials
   - Verify dashboard loads
   - Test content creation

5. **Test public content:**
   - View published articles
   - Browse products
   - Use calculators
   - Search functionality

6. **Test SEO:**
   - Visit `https://your-domain.com/sitemap.xml`
   - Visit `https://your-domain.com/robots.txt`
   - Check meta tags in page source

---

### Step 9: Set Up Monitoring

**Duration:** 20 minutes

1. **Sentry (Error Tracking):**
   - Configure `SENTRY_DSN` in environment
   - Verify errors are being captured
   - Set up alerts for critical errors

2. **Uptime Monitoring:**
   - Use Vercel Analytics, or
   - Set up external monitor (UptimeRobot, Pingdom)

3. **Performance Monitoring:**
   - Enable Vercel Speed Insights, or
   - Set up Google Analytics/PostHog

4. **Log Monitoring:**
   - Check deployment logs
   - Set up log aggregation (Logtail, Datadog)

---

### Step 10: Configure Cron Jobs

**Duration:** 10 minutes

Set up scheduled tasks for:

1. **Content Publishing:**
   ```
   /api/cron/publish-scheduled
   ```
   Schedule: Every hour

2. **Analytics Sync:**
   ```
   /api/cron/analytics-sync
   ```
   Schedule: Daily at 2 AM

3. **Sitemap Ping:**
   ```
   /api/cron/sitemap-ping
   ```
   Schedule: Daily at 3 AM

4. **Content Strategy:**
   ```
   /api/cron/content-strategy
   ```
   Schedule: Daily at 4 AM

**Vercel Cron:**
Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/analytics-sync",
      "schedule": "0 2 * * *"
    }
  ]
}
```

---

## 🔒 Security Checklist

After deployment, verify:

- [ ] HTTPS is enforced (no HTTP access)
- [ ] `ADMIN_BYPASS_KEY` is NOT set
- [ ] Supabase RLS policies are enabled
- [ ] API rate limiting is active
- [ ] Admin routes require authentication
- [ ] Sensitive data is not exposed in logs
- [ ] CORS is properly configured
- [ ] Environment variables are not exposed to client

---

## 🚀 Go Live Checklist

Before announcing launch:

- [ ] All tests passing
- [ ] Admin can create/edit content
- [ ] Public users can view content
- [ ] Calculators work correctly
- [ ] Search returns results
- [ ] Images load properly
- [ ] Forms submit successfully
- [ ] SSL certificate valid
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Google Analytics tracking
- [ ] Error monitoring active
- [ ] Uptime monitoring active
- [ ] Backup strategy in place

---

## 📊 Performance Optimization

Post-launch optimizations:

1. **Enable Caching:**
   - Configure CDN caching rules
   - Set appropriate cache headers
   - Use ISR for static content

2. **Image Optimization:**
   - Verify Next.js Image optimization working
   - Configure Cloudinary transformations
   - Enable lazy loading

3. **Database Optimization:**
   - Add indexes to frequently queried columns
   - Enable Supabase connection pooling
   - Monitor slow queries

4. **Bundle Optimization:**
   - Analyze bundle size: `npm run build --analyze`
   - Remove unused dependencies
   - Implement code splitting

---

## 🆘 Troubleshooting

### Build Fails

**Problem:** Build errors during deployment

**Solutions:**
1. Run `npm run build` locally to identify issues
2. Check TypeScript errors: `npm run type-check`
3. Verify all environment variables are set
4. Check Node.js version matches (v18+)

### Database Connection Fails

**Problem:** Cannot connect to Supabase

**Solutions:**
1. Verify Supabase credentials
2. Check IP whitelist in Supabase settings
3. Ensure RLS policies allow operations
4. Test connection: `tsx scripts/test-critical-flows.ts`

### 404 Errors on Deployment

**Problem:** Pages return 404 after deployment

**Solutions:**
1. Check Next.js routing configuration
2. Verify `next.config.ts` redirects
3. Clear hosting platform cache
4. Check trailing slash configuration

### Slow Performance

**Problem:** Site loads slowly

**Solutions:**
1. Enable CDN caching
2. Optimize images (compress, WebP format)
3. Reduce bundle size
4. Enable ISR for static pages
5. Check database query performance

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Internal Docs:** See `docs/` folder

---

## 🎉 Congratulations!

If you've completed all steps, your InvestingPro platform is now live! 🚀

### Next Steps:

1. Monitor error rates and performance
2. Begin content creation via CMS
3. Set up A/B testing
4. Implement analytics tracking
5. Plan content calendar
6. Monitor SEO rankings
7. Gather user feedback

---

*Last updated: January 2026*
