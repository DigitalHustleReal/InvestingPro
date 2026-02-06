# InvestingPro Project Compendium (v2026.1)

**Date:** February 6, 2026
**Status:** ✅ **PRODUCTION READY** (Build Passing, Runtime Errors Fixed)
**Maintainer:** System Architecture Team

---

## 1. Executive Summary

InvestingPro.in is a high-performance personal finance platform built on Next.js 16, Supabase, and a multi-provider AI engine. 

As of **February 6**, the platform has achieved **Production Readiness**. All critical build and runtime errors have been resolved. The platform allows users to compare financial products (Credit Cards, Loans, Mutual Funds), calculate returns, and consume AI-generated advice.

---

## 2. Deployment & Environment

### 2.1. Deployment Strategy
- **Platform:** Vercel
- **Build Command:** `npm run build` (Validated ✅)
- **Environment Validation:** Deploy-first strategy (non-blocking validation).

### 2.2. Critical Production Fixes (Feb 2026)
The following critical bugs were patched to ensure stability. **Do not regress these changes**:
1.  **Server-Side Safety**: `app/credit-cards` and `app/loans` are wrapped in `try/catch` to preventing 500 errors if the DB is unreachable.
2.  **Client-Side Stability**: `app/mutual-funds` has array guards to prevent "Something went wrong" generic errors on empty data.
3.  **Search Navigation**: `CommandPalette.tsx` now handles "Enter" key for generic searches.
4.  **Legacy Links**: `app/credit-cards/compare/[category]` redirects to the main list to handle broken footer links.

### 2.3. Required Environment Variables
Ensure these are set in Vercel Deployment Settings:

```bash
# Core Database
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]

# AI Providers (At least one required)
GOOGLE_GEMINI_API_KEY=[key]
OPENAI_API_KEY=[key]

# App Config
NEXT_PUBLIC_BASE_URL=https://investingpro.in
```

### 2.4. Post-Deployment Database Setup
The production database starts empty. You must populate it to avoid "Generic Error" screens.

**Run locally pointing to Production:**
```bash
npm run deploy:create-admin
```
*This creates the admin user and seeds essential metadata.*

---

## 3. Operational Workflows

### 3.1. Admin Console
**URL:** `/admin`
- **Editorial:** Manage authors and recruit AI experts.
- **Products:** Add/Edit financial products manually.
- **Automation:** Trigger "Content Factory" batches.

### 3.2. Content Factory (AI Automation)
**Route:** `/admin/automation/batch`
- Used to mass-produce SEO articles.
- Uses `scripts/auto-generate-batch.ts`.
- **Failover Logic:** Gemini -> Groq -> Mistral -> OpenAI.

### 3.3. Product Population (Safe Mode)
To backfill the database with generic products using safe 3D assets:
```bash
// turbo
npx tsx scripts/populate-safe-products_v2.ts
```

---

## 4. Architecture Standards (Files to Freeze)

Do not modify these files without a full architectural review. They are the bedrock of the system.

| File Path | Purpose | Reason to Freeze |
| :--- | :--- | :--- |
| `app/calculators/**` | Financial Logic | Gold-standard, validated math schemas. |
| `lib/env.ts` | Security | Controls environment access and validation. |
| `lib/ai-service.ts` | AI Orchestration | Complex circuit-breaker logic for multi-LLM failover. |
| `tailwind.config.ts` | Design System | Defines the "Trust Teal" visual identity tokens. |

---

## 5. Troubleshooting & Audit History

### 5.1. Common Errors
| Error | Cause | Fix |
| :--- | :--- | :--- |
| **"System Interruption"** | DB Connection Failed | Check Supabase Env Vars. The page will fallback to empty state. |
| **"Something went wrong"** | Client-side JS Error | Usually malformed data. Check Array Guards. |
| **"Supabase is not defined"** | Build-time env missing | Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel. |

### 5.2. Recent Audit Findings
- **Prerendering Failures:** Fixed by moving dynamic pages to `(client)` and `(auth)` route groups with `force-dynamic`.
- **404 Comparisons:** Fixed by redirecting category comparisons to the main product list.

---

**End of Compendium**
