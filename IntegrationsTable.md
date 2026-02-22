# InvestingPro Integrations & Credentials

| Service | Purpose | credential Variable(s) | Status | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | DB, Auth, Real-time | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | ✅ Configured | None |
| **OpenAI** | AI Content / Chatbot | `OPENAI_API_KEY` | ✅ Active | None |
| **Resend** | Transactional Email | `RESEND_API_KEY` | ✅ Active | Verify Domain in Resend Dashboard |
| **PostHog** | Product Analytics | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | ✅ Integrated | None |
| **Google Analytics** | Traffic Insights | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ✅ Integrated | None |
| **Sentry** | Error Monitoring | `NEXT_PUBLIC_SENTRY_DSN` | ✅ Integrated | Configure in `lib/logger.ts` |
| **Tawk.to** | Live Chat | `NEXT_PUBLIC_TAWK_PROPERTY_ID` | ✅ Active | Check widget visibility |
| **Inngest** | Background Jobs | `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY` | ⚠️ Optional | Add for automated article generation |
| **Cloudinary** | Image Hosting | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | ⚠️ Optional | Add for custom image management |
| **Stripe** | Monetization | `STRIPE_SECRET_KEY` | ⚠️ Optional | Required for Paid features (Phase 2) |

## How to Obtain Missing Credentials

1. **Supabase**: Login to [Supabase Dashboard](https://supabase.com) → Project Settings → API.
2. **Resend**: Login to [Resend](https://resend.com) → API Keys → Create new key.
3. **OpenAI**: Login to [OpenAI Platform](https://platform.openai.com) → Settings → API Keys.
4. **PostHog**: Login to [PostHog](https://posthog.com) → Project Settings → Project API Key.
5. **Sentry**: Login to [Sentry](https://sentry.io) → Settings → Projects → [Project Name] → Client Keys (DSN).
