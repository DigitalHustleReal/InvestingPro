# 🚀 Staging Environment Setup Guide

**Purpose:** Create a staging environment for safe testing before production deployment  
**Target:** 90% Production Readiness

---

## 📋 Prerequisites

- Vercel account (or your hosting provider)
- Supabase account
- GitHub repository access
- Environment variables documented

---

## Step 1: Create Vercel Staging Project

### 1.1 Create New Vercel Project

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to existing project or create new
vercel link

# Create staging project
vercel env add NEXT_PUBLIC_VERCEL_ENV staging
```

### 1.2 Configure Vercel Project Settings

1. Go to Vercel Dashboard → Your Project → Settings
2. **General Settings:**
   - Project Name: `investingpro-staging`
   - Framework Preset: Next.js
   - Root Directory: `.` (or your root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Git Integration:**
   - Connect to GitHub repository
   - Production Branch: `main` or `master`
   - Preview Branches: `staging`, `develop`

4. **Environment Variables:**
   - Add all production variables (see checklist below)
   - Set environment to "Staging" for staging-specific values

---

## Step 2: Create Supabase Staging Database

### 2.1 Create New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. **Project Settings:**
   - Name: `investingpro-staging`
   - Database Password: Generate strong password (save it!)
   - Region: Choose closest to your staging server
   - Pricing Plan: Free tier is fine for staging

### 2.2 Apply Database Schema

```bash
# Link to staging project
supabase link --project-ref your-staging-project-ref

# Push schema
supabase db push

# Or manually via SQL Editor:
# 1. Go to SQL Editor in Supabase Dashboard
# 2. Run all schema files in order:
#    - supabase/migrations/001_initial_schema.sql
#    - supabase/migrations/002_cms_schema.sql
#    - supabase/migrations/003_portfolio_schema.sql
#    - etc.
```

### 2.3 Configure Row Level Security (RLS)

Ensure all RLS policies are applied:

```sql
-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ... (apply to all tables)

-- Create policies (see your schema files)
```

### 2.4 Seed Test Data (Optional)

```bash
# Create test admin user
npx tsx scripts/create-admin.ts

# Or manually via Supabase Dashboard → SQL Editor
```

---

## Step 3: Configure Environment Variables

### 3.1 Required Environment Variables

Create `.env.staging` file or configure in Vercel:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key

# Application
NEXT_PUBLIC_BASE_URL=https://investingpro-staging.vercel.app
NODE_ENV=staging
APP_VERSION=1.0.0-staging

# Redis (Upstash) - Optional for staging
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# AI Providers (Use lower rate limits for staging)
OPENAI_API_KEY=your-openai-key
GROQ_API_KEY=your-groq-key
MISTRAL_API_KEY=your-mistral-key

# Analytics & Monitoring
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Email (Resend)
RESEND_API_KEY=your-resend-key

# Payments (Stripe Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Security
ADMIN_BYPASS_KEY=generate-strong-random-key-for-staging
```

### 3.2 Vercel Environment Variables Setup

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable:
   - **Key:** Variable name
   - **Value:** Variable value
   - **Environment:** Select "Staging" (or "Preview" for all preview deployments)
3. Click "Save"

### 3.3 Environment Variable Validation

```bash
# Validate staging environment
NEXT_PUBLIC_BASE_URL=https://your-staging-url.vercel.app \
npx tsx scripts/setup-production.ts
```

---

## Step 4: Configure Domain (Optional)

### 4.1 Add Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add domain: `staging.investingpro.in` (or your staging domain)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 4.2 Update Environment Variables

Update `NEXT_PUBLIC_BASE_URL` to use custom domain:
```bash
NEXT_PUBLIC_BASE_URL=https://staging.investingpro.in
```

---

## Step 5: Deploy to Staging

### 5.1 Initial Deployment

```bash
# Deploy to staging
vercel --env staging

# Or push to staging branch (if auto-deploy configured)
git checkout -b staging
git push origin staging
```

### 5.2 Verify Deployment

1. Check deployment logs in Vercel Dashboard
2. Visit staging URL
3. Test health endpoints:
   - `https://your-staging-url.vercel.app/api/health`
   - `https://your-staging-url.vercel.app/api/health/detailed`
   - `https://your-staging-url.vercel.app/api/health/readiness`

---

## Step 6: Post-Deployment Setup

### 6.1 Create Admin User

```bash
# Set staging environment
export NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key

# Create admin
npx tsx scripts/create-admin.ts
```

### 6.2 Test Critical Flows

```bash
# Test against staging
NEXT_PUBLIC_BASE_URL=https://your-staging-url.vercel.app \
npx tsx scripts/test-critical-flows.ts
```

### 6.3 Verify Monitoring

1. Check Sentry for errors
2. Check PostHog for analytics
3. Check metrics dashboard: `/admin/metrics`
4. Verify health checks are working

---

## Step 7: Configure CI/CD for Staging

### 7.1 Update GitHub Actions

Create `.github/workflows/staging.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - staging
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod --env staging'
```

### 7.2 Add GitHub Secrets

Go to GitHub → Repository → Settings → Secrets → Actions:

- `VERCEL_TOKEN` - Get from Vercel Dashboard → Settings → Tokens
- `VERCEL_ORG_ID` - Get from Vercel Dashboard → Settings
- `VERCEL_PROJECT_ID` - Get from Vercel Dashboard → Project → Settings

---

## Step 8: Staging-Specific Configuration

### 8.1 Rate Limiting (Lower Limits)

Update `lib/middleware/rate-limit.ts` for staging:

```typescript
const limits = {
    public: { limit: 50, window: '1 m' }, // Lower for staging
    authenticated: { limit: 500, window: '1 m' },
    admin: { limit: 2500, window: '1 m' },
    ai: { limit: 5, window: '1 m' }, // Very strict for staging
};
```

### 8.2 Error Tracking

Ensure Sentry is configured for staging:

```typescript
// sentry.client.config.ts
environment: process.env.NODE_ENV === 'production' ? 'production' : 'staging',
```

### 8.3 Analytics

Use separate PostHog project for staging to avoid polluting production data.

---

## ✅ Staging Environment Checklist

- [ ] Vercel staging project created
- [ ] Supabase staging database created
- [ ] Database schema applied
- [ ] RLS policies configured
- [ ] All environment variables set
- [ ] Environment variables validated
- [ ] Custom domain configured (optional)
- [ ] Initial deployment successful
- [ ] Health checks passing
- [ ] Admin user created
- [ ] Critical flows tested
- [ ] Monitoring configured
- [ ] CI/CD pipeline configured
- [ ] Staging-specific rate limits set
- [ ] Error tracking working
- [ ] Analytics configured

---

## 🚨 Troubleshooting

### Deployment Fails

1. Check build logs in Vercel Dashboard
2. Verify all environment variables are set
3. Check Node.js version compatibility
4. Verify build command: `npm run build`

### Database Connection Issues

1. Verify Supabase URL and keys
2. Check RLS policies
3. Test connection manually:
   ```bash
   npx tsx scripts/test-critical-flows.ts
   ```

### Health Checks Failing

1. Check `/api/health/detailed` for specific service failures
2. Verify Redis connection (if configured)
3. Check Supabase connectivity
4. Review error logs in Vercel

---

## 📖 Related Documentation

- **Production Hardening Plan:** `docs/AUDIT_RESULTS/08_PRODUCTION_HARDENING_PLAN.md`
- **Deployment Guide:** `docs/DEPLOYMENT_GUIDE.md`
- **Environment Template:** `env.production.template`

---

*Last Updated: January 13, 2026*
