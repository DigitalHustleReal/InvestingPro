# Deployment Scripts Summary

Quick reference for all deployment-related scripts and tools.

---

## 📦 Available Scripts

### 1. Environment Validation

**Script:** `scripts/setup-production.ts`

**Purpose:** Validates all environment variables are properly configured

**Usage:**
```bash
npx tsx scripts/setup-production.ts
```

**Checks:**
- All required environment variables present
- No placeholder values
- Security warnings (ADMIN_BYPASS_KEY not set)
- API key format validation

**When to use:** Before deployment, after setting up environment variables

---

### 2. Database Migration Validator

**Script:** `scripts/apply-migrations.ts`

**Purpose:** Validates all database schema files exist and provides migration guidance

**Usage:**
```bash
npx tsx scripts/apply-migrations.ts
```

**Checks:**
- All schema files present
- File sizes
- Migration order
- Provides SQL execution commands

**When to use:** Before applying database migrations

---

### 3. Admin User Creator

**Script:** `scripts/create-admin.ts`

**Purpose:** Creates an admin user with proper permissions

**Usage:**
```bash
npx tsx scripts/create-admin.ts
```

**Interactive prompts for:**
- Email address
- Password (min 8 characters)
- Display name

**When to use:** After database setup, before first login

---

### 4. Critical Flows Tester

**Script:** `scripts/test-critical-flows.ts`

**Purpose:** Tests critical user flows to ensure deployment readiness

**Usage:**
```bash
npx tsx scripts/test-critical-flows.ts
```

**Tests:**
- Database connection
- Fetch published articles
- Fetch active products
- Fetch glossary terms
- Fetch categories
- API health check
- CMS health check
- Anonymous user access
- Image service configuration
- AI service configuration

**When to use:** Before deployment, after configuration changes

---

## 🔄 Deployment Workflow

### Pre-Deployment (Local)

```bash
# 1. Validate environment
npx tsx scripts/setup-production.ts

# 2. Check migrations
npx tsx scripts/apply-migrations.ts

# 3. Build project
npm run build

# 4. Run tests (optional)
npm test
```

### Database Setup (Production)

```bash
# Apply migrations via Supabase CLI
supabase link --project-ref your-project-ref
supabase db push

# Or manually via Supabase Dashboard SQL Editor
# (See DATABASE_SETUP_GUIDE.md for details)
```

### Post-Database Setup

```bash
# Create admin user
npx tsx scripts/create-admin.ts

# Test critical flows
npx tsx scripts/test-critical-flows.ts
```

### Deploy to Hosting

```bash
# Vercel
vercel --prod

# Or push to git if auto-deploy configured
git push origin main
```

### Post-Deployment Verification

```bash
# Test critical flows against production
NEXT_PUBLIC_BASE_URL=https://your-domain.com npx tsx scripts/test-critical-flows.ts
```

---

## 📝 npm Scripts

Add these to `package.json` for easier access:

```json
{
  "scripts": {
    "deploy:check-env": "npx tsx scripts/setup-production.ts",
    "deploy:check-db": "npx tsx scripts/apply-migrations.ts",
    "deploy:create-admin": "npx tsx scripts/create-admin.ts",
    "deploy:test": "npx tsx scripts/test-critical-flows.ts",
    "deploy:validate": "npm run deploy:check-env && npm run deploy:check-db && npm run deploy:test"
  }
}
```

Then use:
```bash
npm run deploy:validate
```

---

## 🎯 Quick Start

**First-time deployment:**

```bash
# 1. Setup
cp env.production.template .env.production
# Fill in values

# 2. Validate
npx tsx scripts/setup-production.ts

# 3. Build
npm run build

# 4. Deploy database
supabase db push

# 5. Create admin
npx tsx scripts/create-admin.ts

# 6. Test
npx tsx scripts/test-critical-flows.ts

# 7. Deploy app
vercel --prod
```

---

## 🆘 Common Issues

### "tsx is not recognized"

**Solution:** Use `npx tsx` instead of `tsx`:
```bash
npx tsx scripts/setup-production.ts
```

### "Missing Supabase credentials"

**Solution:** Ensure environment variables are set:
```bash
export NEXT_PUBLIC_SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE_KEY=...
```

Or source `.env.local`:
```bash
set -a && source .env.local && set +a
```

### "Cannot connect to database"

**Solution:**
1. Verify Supabase credentials
2. Check RLS policies
3. Test connection manually

### "Test failed: API not running"

**Solution:** 
- For local testing: Start dev server first (`npm run dev`)
- For production: Deploy first, then test

---

## 📖 Related Documentation

- **Deployment Readiness Audit:** `docs/DEPLOYMENT_READINESS_AUDIT.md`
- **Database Setup Guide:** `docs/DATABASE_SETUP_GUIDE.md`
- **Full Deployment Guide:** `docs/DEPLOYMENT_GUIDE.md`
- **Environment Template:** `env.production.template`

---

*This is a living document. Update as scripts evolve.*
