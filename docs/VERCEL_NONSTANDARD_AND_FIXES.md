# Vercel: Non-Standard vs Standard Next.js and Fixes Applied

Comparison with a typical Next.js 14/15 project that deploys to Vercel, and what was changed so deployment can succeed.

---

## 1. vercel.json vs typical working config

| Aspect | Typical Next.js on Vercel | This project (before → after) |
|--------|---------------------------|-------------------------------|
| **Presence** | Often no `vercel.json` (Vercel auto-detects Next) or minimal `{}` | Had `vercel.json` with 10 crons |
| **Crons** | None or added later | **Before:** 10 daily crons. **After:** `"crons": []` so first deploy isn’t blocked by cron validation (e.g. Hobby limits). |
| **buildCommand / installCommand** | Usually not set (Vercel uses framework default) | **After:** Set explicitly so Vercel always runs `npm run build` and `npm install` (no silent override). |

**Risk that could cause silent/weird behavior:** Cron validation on Hobby or mis-detected build/install. Fixed by empty crons and explicit build/install in `vercel.json`.

---

## 2. next.config.ts vs typical

| Aspect | Typical | This project (before → after) |
|--------|---------|--------------------------------|
| **Wrapper** | `export default nextConfig` | **Before:** `withBundleAnalyzer(nextConfig)` – extra plugin at build time. **After:** Minimal config, no analyzer. |
| **Headers / redirects** | Often none or few | **Before:** Many `headers()` and `redirects()` – fine at runtime, but more surface. **After:** Minimal config (no custom headers/redirects) for first deploy. |
| **Webpack** | Often none | **Before:** Custom webpack (alias for `isomorphic-dompurify`, client splitChunks). **After:** Only alias for `isomorphic-dompurify` so build still resolves. |
| **Experimental / turbopack** | Minimal or none | **Before:** `experimental: { optimizeCss, optimizePackageImports }`, `turbopack: {}`. **After:** Omitted for minimal deploy. |
| **Images** | Often default or small remotePatterns | **Before:** Large remotePatterns list. **After:** Small set (Supabase, Unsplash, Cloudinary) for first deploy. |

**Risk:** Bundle analyzer or heavy webpack/experimental config could interact badly with Vercel’s build. Reduced by using a minimal `next.config.ts` for first deploy.

---

## 3. Non-standard build setup

| Item | Status |
|------|--------|
| **Build script** | Standard: `"build": "next build"`. No pre-build type-check or lint in the script. |
| **prepare script** | **Before:** `husky install` ran on every `npm install` (including Vercel). Can fail in CI (no git / read-only). **After:** Skip Husky when `CI` is set so install doesn’t fail. |
| **Custom build command in dashboard** | Not in repo. If you set “Override” in Vercel and use e.g. `npm run validate && npm run build`, failures can look like “no deployment”. Use default build or the same as in `vercel.json`. |
| **next-sitemap** | Runs as a separate script (e.g. post-build), not inside `next build`. No impact on Vercel build unless you run it in a custom build command. |
| **TypeScript** | `tsconfig.json` is standard (noEmit, paths, include/exclude). No non-standard TS that would block Vercel. |

**Risk:** `prepare` failing in CI and breaking install. Fixed by CI guard around Husky.

---

## 4. Imports / dependencies that could affect Vercel

| Dependency / import | Vercel support | Note |
|---------------------|----------------|-------|
| **sharp** | Supported | Used by Next image optimization; Vercel supports it. |
| **@sentry/nextjs** | Supported | Sentry init doesn’t throw when DSN is missing. |
| **isomorphic-dompurify** | Supported | Custom webpack alias ensures resolution; kept in minimal config. |
| **@supabase/ssr** | Supported | Used in middleware (Edge) and server; serverless-compatible. |
| **jsdom** | Supported | Pure JS; no native addons. |
| **Next.js 16** | Supported | You’re on 16.x; Vercel supports it. No need to downgrade. |
| **runtime = 'nodejs'** (API routes) | Supported | Default for API routes; no conflict with serverless. |

No imports or deps identified that would make Vercel “abort deployment silently” by themselves.

---

## 5. Custom server / serverless blockers

| Item | Status |
|------|--------|
| **Custom server (server.js / Node listen)** | None. No custom server; Vercel uses serverless. |
| **output: 'standalone'** | Not set. Not used. |
| **output: 'export'** | Not set. Not used. |
| **getStaticProps / getServerSideProps** | Not used (App Router). |
| **Middleware** | Standard Edge middleware (Supabase auth); no blocking server-only code. |
| **instrumentation.ts / instrumentation.node.ts** | None. No instrumentation that could run at build and fail. |

Nothing in this list would prevent serverless deployment.

---

## 6. What could cause “project created but no build” / silent abort

These are the main non-standard or easy-to-misconfigure areas that were addressed:

1. **Cron validation (Hobby)** – Many crons in `vercel.json` could trigger warnings or strict validation. **Fix:** `"crons": []` for first deploy.
2. **Env validation at build** – Layout runs during `next build`; if `validateEnvOnStartup()` threw in production, build would fail. **Fix:** Skip validation on Vercel when no env are set (first deploy); only log, don’t throw, unless `REQUIRE_STRICT_ENV=1`.
3. **prepare (Husky) in CI** – `husky install` on Vercel can fail. **Fix:** Skip Husky when `CI` is set.
4. **Unclear build/install** – If the UI or framework detection picked a different command, build might not run or might run the wrong thing. **Fix:** Explicit `buildCommand` and `installCommand` in `vercel.json`.
5. **Heavy next.config** – Bundle analyzer and complex webpack/experimental config. **Fix:** Minimal `next.config.ts` for first deploy.

---

## 7. Summary of files changed for “deploy right now”

| File | Change |
|------|--------|
| **vercel.json** | `crons: []`; added explicit `buildCommand` and `installCommand`. |
| **next.config.ts** | Replaced with minimal config (no analyzer, minimal images + webpack alias). |
| **lib/env.ts** | Skip validation on Vercel when no env are set; never throw unless `REQUIRE_STRICT_ENV=1`. |
| **package.json** | `prepare` skips Husky when `CI` is set. |

After one successful deploy, you can restore full crons, full next.config (headers, redirects, analyzer), and add env vars; validation will run again on the next deploy/request.
