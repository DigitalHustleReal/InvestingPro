# Vercel Deployment Readiness Report — InvestingPro App

**Generated:** Deployment audit  
**Framework:** Next.js 16.1.1 (React 19.2.3)  
**Verdict:** **NO** — Fix critical issues below before deploying.

---

## 1. Framework and version

| Item | Value |
|------|--------|
| Framework | Next.js |
| Version | **16.1.1** (from `package.json`) |
| React | 19.2.3 |
| Node (CI) | 18 (from `.github/workflows/deploy.yml`) |
| Build tool | Next.js default (Turbopack/Webpack per config) |

**Build command (use this on Vercel):** `npm run build` → runs `next build`.

---

## 2. Environment variables used (with file locations)

All `process.env.*` usages found in the codebase, grouped by purpose.  
**Add these in Vercel Project → Settings → Environment Variables** (Production + Preview as needed).

### Required for deployment (app will fail or misbehave without these)

| Variable | Used in (representative) | Notes |
|----------|--------------------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/*`, `lib/env.ts`, many API routes, admin pages | Required by `lib/env.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase/*`, admin, MediaLibraryPicker | Required by `lib/env.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/service.ts`, cron routes, analytics, batch, affiliate postback | Required by `lib/env.ts` |

### Required in production (validated by `lib/env.ts` / startup)

| Variable | Used in | Notes |
|----------|---------|--------|
| `INNGEST_EVENT_KEY` | Inngest setup, verify script, env schema | Production recommended |
| `INNGEST_SIGNING_KEY` | Inngest setup, verify script | Production recommended |
| `CRON_SECRET` | All `/api/cron/*` routes, automation triggers, rankings sync | Protect cron endpoints |
| `RESEND_API_KEY` | `app/api/cron/email-sequences`, `lib/email/sequences.ts`, contact | Email flows |
| `NEXT_PUBLIC_SENTRY_DSN` | `lib/monitoring/sentry.ts`, layout, logger | Error tracking |

### At least one AI provider required (env validation)

| Variable | Used in |
|----------|---------|
| `OPENAI_API_KEY` | `lib/api.ts`, `lib/ai-service.ts`, `lib/ai/*`, generate/save article, batch, translate, auto-alt, auto-tags, auto-categorize, products generate-image |
| `GOOGLE_GEMINI_API_KEY` or `GEMINI_API_KEY` | `lib/api.ts`, `lib/ai-service.ts`, multi-provider, prototypes |
| `GROQ_API_KEY` | `lib/api.ts`, `lib/ai-service.ts`, multi-provider |
| `MISTRAL_API_KEY` | `lib/api.ts`, `lib/ai-service.ts`, multi-provider |
| `ANTHROPIC_API_KEY` | `lib/ai-service.ts`, multi-provider |
| `DEEPSEEK_API_KEY` | `lib/ai/providers/multi-provider.ts` |

### Public / base URL (needed for links, sitemap, payments, cron callbacks)

| Variable | Used in |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Content repurpose, distribution, daily content generation, create-admin script, serp-tracker, link-checker |
| `NEXT_PUBLIC_SITE_URL` | `app/feed.xml`, scraper trigger route, embeddable widget |
| `NEXT_PUBLIC_BASE_URL` | `app/sitemap.ts`, `app/robots.ts`, payments checkout success/cancel URLs, cron sitemap-ping, create-admin, test-critical-flows |
| `APP_URL` | Scripts (generate-one-article-cms, etc.) — optional for Vercel |
| `NEXT_PUBLIC_API_URL` | Scripts (populate-products-ai) — optional |

Set **NEXT_PUBLIC_BASE_URL** and **NEXT_PUBLIC_SITE_URL** (and **NEXT_PUBLIC_APP_URL** if you use those features) to your production URL (e.g. `https://investingpro.in`). Payments and sitemap depend on `NEXT_PUBLIC_BASE_URL`.

### Optional integrations (feature-specific)

| Variable | Used in |
|----------|---------|
| `SUPPORT_EMAIL` | `app/api/contact/route.ts` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_GA_ID` | `app/layout.tsx` (Google Analytics) |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | `lib/analytics/posthog-service.tsx` |
| `AFFILIATE_POSTBACK_SECRET` | `app/api/affiliate/postback/route.ts` |
| `TELEGRAM_CONTENT_CHANNELS`, `WHATSAPP_CONTENT_CHANNELS` | `lib/automation/content-distribution.ts` |
| `DATA_UPDATE_NOTIFICATION_ENABLED`, `DATA_UPDATE_TELEGRAM_CHATS`, `DATA_UPDATE_WHATSAPP_NUMBERS` | `app/api/cron/weekly-data-update/route.ts` |
| `REVENUE_REPORT_TELEGRAM_CHATS`, `REVENUE_REPORT_WHATSAPP_NUMBERS` | `app/api/cron/daily-revenue-report/route.ts` |
| `RESEND_FROM_EMAIL` | Email sequences, cron email |
| `OPENAI_MODEL`, `OPENAI_VISION_MODEL` | `lib/api.ts`, auto-alt-text |
| `GEMINI_MODEL` | `lib/api.ts`, test scripts |
| `MISTRAL_MODEL` | `lib/ai-service.ts` |
| `GSC_API_KEY`, `GSC_SITE_URL`, `SERPAPI_API_KEY` | `app/api/analytics/rankings/sync`, `lib/analytics/rankings-tracker.ts`, `lib/seo/serp-tracker.ts` |
| `GOOGLE_SEARCH_CONSOLE_CLIENT_ID`, `GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET`, `GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN`, `GOOGLE_SEARCH_CONSOLE_SITE_URL` | `lib/seo/gsc-api.ts` |
| `GSC_PROPERTY_URL`, `GSC_SERVICE_ACCOUNT_KEY` | `lib/analytics/gsc-trends.ts` |
| `PEXELS_API_KEY`, `NEXT_PUBLIC_PEXELS_API_KEY` | `lib/integrations/stockImages/pexels.ts`, `app/api/stock-photos/route.ts`, `lib/images/stock-image-service-enhanced.ts` |
| `UNSPLASH_ACCESS_KEY`, `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | `lib/media/image-manager.ts`, `lib/integrations/stockImages/unsplash.ts`, stock-image-service-enhanced |
| `PIXABAY_API_KEY`, `FREEPIK_API_KEY` | `lib/images/stock-image-service-enhanced.ts`, `app/api/stock-photos/route.ts` |
| `GENERATE_IMAGES` | `lib/media/image-manager.ts` |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | `lib/cache/redis-service.ts`, `lib/cache/cache-service.ts`, `lib/middleware/rate-limit.ts` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | `lib/images/cloudinary-service.ts`, test-critical-flows |
| `STRIPE_SECRET_KEY` (or Stripe env used by stripe-service) | Payments (stripe-service) |
| `REPLICATE_API_TOKEN` | `lib/visuals/featured-image-generator.ts` |
| `CUELINKS_API_KEY` | `scripts/sync-affiliate-products.ts` |
| `ALERT_EVALUATION_TOKEN` | `app/api/v1/alerts/evaluate/route.ts` |
| `ALERT_EMAIL`, `ALERT_EMAIL_FROM`, `ADMIN_EMAIL` | `lib/alerts/alert-manager.ts` |
| `AXIOM_API_KEY`, `AXIOM_DATASET`, `AXIOM_OTLP_ENDPOINT` | `lib/tracing/opentelemetry.ts`, `lib/alerts/axiom-client.ts`, `lib/logging/initialize.ts` |
| `OTEL_ENABLED`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_EXPORTER_OTLP_HEADERS` | `lib/tracing/opentelemetry.ts` |
| `SERVICE_NAME`, `SERVICE_VERSION` | `lib/tracing/opentelemetry.ts` |
| `FIELD_ENCRYPTION_KEY` or `ENCRYPTION_KEY` | `lib/encryption/field-encryption.ts` |
| `SEO_TARGET_KEYWORDS` | `app/api/cron/seo-rankings-update/route.ts` |
| `OLLAMA_URL` | `lib/ai/providers/multi-provider.ts` (defaults to localhost — dev only) |
| `TOGETHER_API_KEY`, `HUGGINGFACE_API_KEY` | `lib/ai/providers/multi-provider.ts` |
| `GOOGLE_ADS_API_KEY`, `UBERSUGGEST_FREE_API_KEY`, `UBERSUGGEST_API_KEY`, `AHREFS_API_KEY`, `SEMRUSH_API_KEY` | `lib/seo/keyword-api-client.ts`, `lib/seo/providers/free-keyword-providers.ts` |
| `ANALYZE` | `next.config.ts` (bundle analyzer — optional) |
| `NODE_ENV` | Set by Vercel; used in many files for dev vs prod behavior |

---

## 3. Complete list for Vercel (.env format)

Copy this template and fill in values in Vercel (or use as `.env.example`; do not commit real values).

```env
# ========== REQUIRED ==========
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# At least one AI provider
OPENAI_API_KEY=

# Production
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# ========== PRODUCTION RECOMMENDED ==========
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
CRON_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_SENTRY_DSN=

# ========== OPTIONAL ==========
SUPPORT_EMAIL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
AFFILIATE_POSTBACK_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_FROM_EMAIL=
OPENAI_MODEL=
GEMINI_MODEL=
GOOGLE_GEMINI_API_KEY=
GROQ_API_KEY=
MISTRAL_API_KEY=
ANTHROPIC_API_KEY=
DEEPSEEK_API_KEY=
PEXELS_API_KEY=
UNSPLASH_ACCESS_KEY=
PIXABAY_API_KEY=
FREEPIK_API_KEY=
GSC_API_KEY=
GSC_SITE_URL=
SERPAPI_API_KEY=
GOOGLE_SEARCH_CONSOLE_CLIENT_ID=
GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET=
GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN=
GOOGLE_SEARCH_CONSOLE_SITE_URL=
GSC_PROPERTY_URL=
GSC_SERVICE_ACCOUNT_KEY=
STRIPE_SECRET_KEY=
REPLICATE_API_TOKEN=
ALERT_EVALUATION_TOKEN=
ALERT_EMAIL=
ALERT_EMAIL_FROM=
ADMIN_EMAIL=
FIELD_ENCRYPTION_KEY=
SEO_TARGET_KEYWORDS=
TELEGRAM_CONTENT_CHANNELS=
WHATSAPP_CONTENT_CHANNELS=
DATA_UPDATE_NOTIFICATION_ENABLED=
DATA_UPDATE_TELEGRAM_CHATS=
DATA_UPDATE_WHATSAPP_NUMBERS=
REVENUE_REPORT_TELEGRAM_CHATS=
REVENUE_REPORT_WHATSAPP_NUMBERS=
OTEL_ENABLED=
OTEL_EXPORTER_OTLP_ENDPOINT=
AXIOM_API_KEY=
AXIOM_DATASET=
AXIOM_OTLP_ENDPOINT=
SERVICE_NAME=
SERVICE_VERSION=
```

---

## 4. Packages: imports vs package.json

- **Conclusion:** All imports sampled from `app/`, `lib/`, and `components/` use either:
  - `next/*`, `react`, `@/...` (path alias), or
  - packages that appear in `package.json` (e.g. `@supabase/ssr`, `@tanstack/react-query`, `lucide-react`, `sonner`, `zod`, etc.).
- No missing production dependency was found.  
- **Action:** Run `npm ci` and `npm run build` locally once to confirm; Vercel will use `package.json` and lockfile.

---

## 5. Hardcoded localhost URLs

| Location | Usage | Deployment impact |
|----------|--------|-------------------|
| `app/api/automation/scraper/trigger/route.ts` | `process.env.NEXT_PUBLIC_SITE_URL \|\| 'http://localhost:3000'` | **Fix:** Set `NEXT_PUBLIC_SITE_URL` in Vercel so production never falls back to localhost. |
| `app/api/cron/daily-content-generation/route.ts` | `process.env.NEXT_PUBLIC_APP_URL \|\| 'http://localhost:3000'` | Same: set `NEXT_PUBLIC_APP_URL`. |
| `lib/api/client.ts` | `process.env.NEXT_PUBLIC_APP_URL \|\| 'http://localhost:3000'` | Same: set `NEXT_PUBLIC_APP_URL`. |
| `lib/ai/providers/multi-provider.ts` | `OLLAMA_URL \|\| 'http://localhost:11434'` | OK for dev; in production don’t use Ollama or set `OLLAMA_URL`. |
| `middleware.ts`, `lib/tenant/tenant-context.ts` | `'localhost'`, `'127.0.0.1'` in allowed hostnames | OK — used for tenant detection, not as app URL. |
| `scripts/*`, `__tests__/*`, `.lighthouserc.js`, `jest.*.js` | Various `localhost:3000` in scripts/tests | Not used by Vercel build or server; no change required for deployment. |
| `lib/api/openapi-generator.ts` | Fallback `'http://localhost:3000'` | Set `NEXT_PUBLIC_APP_URL` so production doesn’t use localhost. |

**Action:** Ensure **NEXT_PUBLIC_SITE_URL**, **NEXT_PUBLIC_APP_URL**, and **NEXT_PUBLIC_BASE_URL** are set in Vercel to your production domain so no runtime code falls back to localhost.

---

## 6. Build configuration

| Item | Status |
|------|--------|
| Build command | `npm run build` → `next build` |
| Output | Default Next.js (no `output: 'export'`) — correct for Vercel |
| `next.config.ts` | Present; images, headers, redirects, webpack config — OK |
| `vercel.json` | Present; crons only — no conflict with build |
| Node version | 18 in GitHub Actions; set **Node.js Version** to 18.x in Vercel if needed |

**Correct build command:** `npm run build`  
**Install command (default):** `npm install` or `npm ci` (Vercel uses lockfile).

---

## 7. .gitignore

| Entry | Status |
|-------|--------|
| `.env*` | Present — env files ignored |
| `node_modules` | Covered by `/node_modules` |
| `.next` | Covered by `/.next/` (includes `.next/dist`) |

No change required for deployment.

---

## 8. Issues that can cause deployment to fail or must be fixed

### Critical (must fix before deploy)

1. **Hardcoded API keys in source (security + deployment)**  
   - **File:** `lib/images/stock-image-service-enhanced.ts`  
   - **Lines:** 67–69  
   - **Issue:** Fallback values for `PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY`, and `PIXABAY_API_KEY` are hardcoded. These keys are exposed in the repo and can be rate-limited or revoked.  
   - **Fix:** Remove the fallback strings. Use only `process.env.PEXELS_API_KEY` etc., and if missing, skip or throw a clear error (no default keys).

2. **Production env validation can throw on startup**  
   - **File:** `lib/env.ts`  
   - **Issue:** In production, missing required vars (Supabase, or all AI providers) leads to warnings/errors and can block startup.  
   - **Fix:** Ensure at least the three required Supabase vars and one AI provider are set in Vercel. Optionally add production-only vars (Inngest, CRON_SECRET, RESEND, SENTRY) so startup validation passes.

3. **Payments / sitemap / cron callbacks depend on base URL**  
   - **Issue:** `app/api/payments/checkout/route.ts` and sitemap/cron use `NEXT_PUBLIC_BASE_URL`. If unset, checkout redirects and links can be wrong.  
   - **Fix:** Set `NEXT_PUBLIC_BASE_URL` (and `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL`) in Vercel to the production URL.

### High (should fix)

4. **Cron routes protected by `CRON_SECRET`**  
   - If `CRON_SECRET` is not set in Vercel, some cron routes may allow unauthenticated access or behave differently. Set `CRON_SECRET` in Vercel and use it in Vercel Cron (or external scheduler) as Bearer token.

5. **Inngest**  
   - Production startup expects `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`. If you use Inngest in production, set these in Vercel.

### Medium (recommended)

6. **Sentry**  
   - `NEXT_PUBLIC_SENTRY_DSN` recommended for production; otherwise errors are only logged.

7. **Resend**  
   - Contact form and email sequences need `RESEND_API_KEY` (and optionally `RESEND_FROM_EMAIL`).

8. **Cloudinary**  
   - `scripts/setup-production.ts` marks Cloudinary as required for production; if you use image uploads, set `CLOUDINARY_*` in Vercel.

---

## 9. Step-by-step fixes

### Fix 1: Remove hardcoded API keys

**File:** `lib/images/stock-image-service-enhanced.ts`

- Replace:
  - `process.env.PEXELS_API_KEY || 'PwXCmeo4jefIBHvVQO1yBKuPoD2OKyvxvnup0N68wotIq5cldWdyRqlR'`
  - `process.env.UNSPLASH_ACCESS_KEY || 'IUrwmrGaNkIyc_xurixdcaR0b5fBtiqErUiXL3eqruU'`
  - `process.env.PIXABAY_API_KEY || '49964802-81f83edc4f18ee975423b511f'`
- With:
  - `process.env.PEXELS_API_KEY`
  - `process.env.UNSPLASH_ACCESS_KEY`
  - `process.env.PIXABAY_API_KEY`
- Ensure callers handle missing keys (e.g. skip Pexels/Unsplash/Pixabay or return empty) and do not pass hardcoded keys.

### Fix 2: Set required env in Vercel

1. Vercel → Project → Settings → Environment Variables.
2. Add for **Production** (and Preview if you want same behavior):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - At least one of: `OPENAI_API_KEY`, `GOOGLE_GEMINI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY`
   - `NEXT_PUBLIC_BASE_URL` = e.g. `https://investingpro.in` or `https://your-app.vercel.app`
   - `NEXT_PUBLIC_SITE_URL` = same as base URL
   - `NEXT_PUBLIC_APP_URL` = same (if you use app links in emails/cron)
   - `CRON_SECRET` (strong random string)
3. For production features, add: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN` as needed.

### Fix 3: No localhost in production

- After setting the three URL env vars above, no runtime code should use localhost in production. Re-run a quick grep for `localhost` in `app/` and `lib/` and confirm all are either behind env or in dev-only branches.

### Fix 4: Verify build locally

```bash
npm ci
npm run build
```

- Fix any TypeScript or lint errors. Ensure no import is missing from `package.json`.

---

## 10. Final verdict

**Is the codebase deployment-ready for Vercel?**

### **YES** (after recommended actions)

**Recommended actions completed in code:**

1. **Security:** Hardcoded API keys removed from `lib/images/stock-image-service-enhanced.ts`.
2. **Production URLs:** `getServerPublicUrl()` added in `lib/env.ts`; scraper trigger, daily content cron, and API client use it so production never calls localhost. Payments checkout validates `NEXT_PUBLIC_BASE_URL` in production (or uses `VERCEL_URL`).
3. **Docs:** `.env.example` updated with full Vercel list; `docs/DEPLOY_CHECKLIST.md` added for pre-deploy steps.

**You still need to:**

- Set required env vars in Vercel (Supabase ×3, one AI key, base URLs). See `docs/DEPLOY_CHECKLIST.md`.
- Add `CRON_SECRET` (and Inngest/Resend/Sentry if used).
- Run `npm ci && npm run build` locally once; then deploy.

---

## Quick checklist before first deploy

- [x] Remove hardcoded API keys from `lib/images/stock-image-service-enhanced.ts`
- [x] Production never uses localhost for server callbacks (getServerPublicUrl, payments)
- [ ] Add required env vars in Vercel (Supabase ×3, one AI key, base URLs)
- [ ] Add `CRON_SECRET` (and Inngest/Resend/Sentry if used)
- [ ] Run `npm ci && npm run build` locally and fix any errors
- [ ] Deploy; then test login, one API route, and payment redirect (if applicable)

See **docs/DEPLOY_CHECKLIST.md** for the full pre-deploy checklist.
