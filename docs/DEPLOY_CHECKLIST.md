# Pre-deploy checklist — InvestingPro (investingpro.in)

Use this before deploying the **whole platform** (public site + CMS) to Vercel.

---

## 1. Code (already done)

- [x] Hardcoded API keys removed from `lib/images/stock-image-service-enhanced.ts`
- [x] Production never uses localhost for server-side callbacks (`getServerPublicUrl()` in scraper trigger, daily content cron, API client)
- [x] Payments checkout validates `NEXT_PUBLIC_BASE_URL` in production (or uses `VERCEL_URL`)

---

## 2. Vercel environment variables

In **Vercel → Your project → Settings → Environment Variables**, add:

### Required (minimum for a working deploy)

| Variable | Example | Notes |
|----------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase service role (keep secret) |
| One AI provider | e.g. `OPENAI_API_KEY=sk-...` | At least one of: OPENAI, GOOGLE_GEMINI, GROQ, MISTRAL, ANTHROPIC, DEEPSEEK |
| `NEXT_PUBLIC_BASE_URL` | `https://investingpro.in` | Your production domain (or `https://your-app.vercel.app`) |
| `NEXT_PUBLIC_SITE_URL` | Same as base URL | Used for sitemap, feed, cron callbacks |
| `NEXT_PUBLIC_APP_URL` | Same as base URL | Used for internal fetch (daily content, scraper) |

### Production recommended

| Variable | Notes |
|----------|--------|
| `CRON_SECRET` | Strong random string; protect `/api/cron/*` routes |
| `INNGEST_EVENT_KEY` | If you use Inngest |
| `INNGEST_SIGNING_KEY` | If you use Inngest |
| `RESEND_API_KEY` | For contact form and email sequences |
| `NEXT_PUBLIC_SENTRY_DSN` | For error tracking |

### Optional (by feature)

- **Payments:** `STRIPE_SECRET_KEY`
- **Images:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Analytics:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_POSTHOG_KEY`
- **Cache/rate limit:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **SEO/rankings:** `GSC_API_KEY`, `SERPAPI_API_KEY`, etc.

Copy from `.env.example` for the full list.

---

## 3. Build

- **Build command:** `npm run build` (default on Vercel for Next.js)
- **Install command:** `npm install` or leave default (Vercel uses lockfile)
- **Node version:** 18.x (set in Vercel if needed)

---

## 4. Before first deploy

1. Run locally: `npm ci && npm run build` — fix any TypeScript or lint errors.
2. Set all required env vars in Vercel (step 2).
3. Deploy from Git (connect repo) or `vercel --prod`.
4. After deploy: test homepage, one article, login (if applicable), and payment redirect (if Stripe is used).

---

## 5. Verdict

After completing steps 1–4, the **whole platform (investingpro.in)** is deployment-ready.  
Full details: `docs/VERCEL_DEPLOYMENT_READINESS_REPORT.md`.
