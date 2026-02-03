# Vercel Deployment Guide - InvestingPro App

This guide helps you deploy the InvestingPro Next.js application to Vercel and troubleshoot common deployment errors.

## Project Summary

| Setting | Value |
|---------|-------|
| **Framework** | Next.js 16 |
| **Package Manager** | npm |
| **Build Command** | `npm run build` (uses `next build --webpack`) |
| **Output Directory** | `.next` (auto-detected by Vercel) |
| **Node Version** | 18.x or 20.x (recommended) |

---

## 1. Root Cause of Common Deployment Errors

### Error: "Ambiguous app routes detected"

**Cause:** Next.js cannot distinguish between dynamic route segments when multiple routes match the same URL pattern (e.g., `/[category]/[intent]` and `/[category]/[subcategory]`).

**Solution:** Ensure dynamic segments have unique patterns. The current structure uses:
- `app/[category]/page.tsx` - Category landing
- `app/[category]/[slug]/page.tsx` - Category + slug

These are distinct. If you add routes like `[intent]` or `[subcategory]` at the same level, use different static path segments (e.g., `/[category]/intent/[id]` instead of `/[category]/[intent]`).

### Error: "The middleware file convention is deprecated"

**Cause:** Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`.

**Solution:** The project uses `middleware.ts` for compatibility with Next.js 16.1.x. The deprecation is a warning only—builds succeed. Migrate to `proxy.ts` when upgrading to a newer Next.js version that fully supports it.

### Error: RevenueMetrics / totalConversions

**Cause:** The growth metrics API (`/api/growth/metrics`) uses `revenueMetrics.totalConversions`.

**Solution:** ✅ **Already implemented** - The `RevenueMetrics` interface in `lib/analytics/revenue-tracker.ts` includes `totalConversions` and the `getRevenueMetrics()` function returns it correctly.

---

## 2. Step-by-Step Deployment

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will auto-detect Next.js

### Step 2: Configure Build Settings

Vercel should auto-detect these. Verify in **Settings → General**:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | (leave default - Vercel handles Next.js) |
| Install Command | `npm install` |
| Node.js Version | 18.x or 20.x |

**Important:** The project uses `next build --webpack` (see `package.json`) for the `isomorphic-dompurify` webpack alias. Do not override the build command.

### Step 3: Set Environment Variables

Go to **Settings → Environment Variables** and add:

#### Required (Minimum for first deploy)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGc...` |

#### At least one AI provider (required by env validation)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key |
| `GROQ_API_KEY` | Groq API key |
| `MISTRAL_API_KEY` | Mistral API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |

#### Recommended for production

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Production URL (e.g., `https://investingpro.in`) |
| `INNGEST_EVENT_KEY` | Inngest event key (for workflows) |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `CRON_SECRET` | Secret for cron job authentication |
| `RESEND_API_KEY` | Resend for transactional emails |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry for error tracking |

#### Optional

| Variable | Description |
|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `STRIPE_SECRET_KEY` | Stripe payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary for images |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Step 4: Deploy

1. Click **Deploy**
2. Monitor the build logs for errors
3. First deploy may take 3-5 minutes

---

## 3. Vercel Configuration (vercel.json)

The project includes a minimal `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "crons": []
}
```

Vercel auto-detects Next.js, so most settings are optional. Add custom config only if needed:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

---

## 4. Common Deployment Issues

### Build fails with "Module not found"

- **Cause:** Missing dependency or incorrect import path
- **Fix:** Run `npm run build` locally first. Check `package.json` dependencies and ensure all imports use correct paths (`@/` alias)

### Build fails with environment variable errors

- **Cause:** `lib/env.ts` validates env vars. In production without vars, it logs warnings but doesn't block (deploy-first design)
- **Fix:** Add required vars in Vercel dashboard. Set `REQUIRE_STRICT_ENV=1` only when you want build to fail on missing vars

### Runtime errors after deploy

- **Cause:** Missing env vars, Supabase connection, or database migrations
- **Fix:** 
  1. Verify all required env vars are set in Vercel
  2. Run migrations: `npm run db:migrate` (or apply via Supabase dashboard)
  3. Check Vercel Function logs for specific errors

### Admin routes redirect to login in production

- **Cause:** Supabase auth not configured or `user_profiles` table missing
- **Fix:** Ensure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are set. Create admin user via `npm run deploy:create-admin`

### Images not loading

- **Cause:** Next.js Image component requires configured remote patterns
- **Fix:** Already configured in `next.config.ts` for Supabase, Unsplash, Cloudinary. Add new domains if needed.

---

## 5. Pre-Deploy Checklist

- [ ] All required env vars set in Vercel
- [ ] At least one AI provider configured
- [ ] Supabase project created and migrations applied
- [ ] `npm run build` succeeds locally
- [ ] `npm run type-check` passes
- [ ] No ambiguous route patterns in `app/` directory
- [ ] `middleware.ts` exists (required for auth and request handling)

---

## 6. Useful Commands

```bash
# Local build (matches Vercel)
npm run build

# Type check before deploy
npm run type-check

# Full validation
npm run deploy:validate

# Create admin user (run after first deploy)
npm run deploy:create-admin
```

---

## 7. Getting Help

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Build Logs:** Vercel Dashboard → Project → Deployments → [Deployment] → Building
