# 🔐 Environment Variables Guide

**Purpose:** Complete reference for all environment variables  
**Target:** Production deployment

---

## 📋 Environment Variable Categories

### 1. Supabase (Database & Auth)

**Required:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Purpose:**
- Database connection
- Authentication
- Row Level Security (RLS)

**Security:**
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` - Keep secret! Never expose to client
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Safe to expose (public)

---

### 2. Application Configuration

**Required:**
```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production
APP_VERSION=1.0.0
```

**Optional:**
```bash
SERVICE_NAME=investingpro-api
LOG_AGGREGATION_SERVICE=datadog  # or logrocket, better-stack
```

---

### 3. Redis (Upstash) - Rate Limiting

**Optional (for rate limiting):**
```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Purpose:**
- Distributed rate limiting
- Session storage
- Caching

**Note:** Rate limiting works without Redis but won't be distributed.

---

### 4. AI Providers

**At least one required:**
```bash
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
MISTRAL_API_KEY=...
DEEPSEEK_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GEMINI_API_KEY=...
```

**Purpose:**
- Content generation
- AI-powered features
- CMS automation

**Recommendation:** Use multiple providers for redundancy.

---

### 5. Analytics & Monitoring

**Sentry (Error Tracking):**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=your-sentry-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

**PostHog (Analytics):**
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Purpose:**
- Error tracking
- User analytics
- Performance monitoring

---

### 6. Email (Resend)

**Optional:**
```bash
RESEND_API_KEY=re_...
```

**Purpose:**
- Newsletter emails
- Transactional emails
- Email notifications

---

### 7. Payments (Stripe)

**Required (if using payments):**
```bash
STRIPE_SECRET_KEY=sk_live_...  # or sk_test_... for testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # or pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Purpose:**
- Payment processing
- Subscription management

---

### 8. Security

**Optional:**
```bash
ADMIN_BYPASS_KEY=generate-strong-random-key
```

**Purpose:**
- Admin access bypass (development only)
- ⚠️ **Never use in production!**

---

### 9. External Services (Optional)

**Log Aggregation:**
```bash
DATADOG_API_KEY=...
LOGROCKET_APP_ID=...
BETTER_STACK_API_KEY=...
```

**Uptime Monitoring:**
- Configured via external service (UptimeRobot/Pingdom)
- No environment variables needed

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

**Use:**
- Vercel Environment Variables
- GitHub Secrets (for CI/CD)
- `.env.local` (local development, gitignored)

**Never:**
- Commit `.env` files
- Hardcode secrets in code
- Share secrets in chat/email

---

### 2. Separate Environments

**Development:**
- Use test API keys
- Lower rate limits
- Debug mode enabled

**Staging:**
- Separate Supabase project
- Test Stripe keys
- Staging domain

**Production:**
- Production API keys
- Production database
- Production domain
- Security headers enabled

---

### 3. Rotate Keys Regularly

- Rotate API keys every 90 days
- Rotate database passwords every 180 days
- Revoke unused keys immediately

---

## 📝 Environment Variable Checklist

### Pre-Deployment

- [ ] All required variables set
- [ ] No placeholder values
- [ ] Production keys (not test keys)
- [ ] Secrets stored securely
- [ ] `.env.local` in `.gitignore`
- [ ] Vercel environment variables configured

### Post-Deployment

- [ ] Health checks passing
- [ ] Database connection working
- [ ] Authentication working
- [ ] External services connected
- [ ] No errors in logs

---

## 🧪 Validation

**Validate environment:**
```bash
npx tsx scripts/setup-production.ts
```

**This checks:**
- All required variables present
- No placeholder values
- API key formats valid
- Security warnings

---

## 📖 Related Documentation

- **Staging Setup:** `docs/STAGING_ENVIRONMENT_SETUP.md`
- **Deployment Runbook:** `docs/DEPLOYMENT_RUNBOOK.md`
- **Production Checklist:** `docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md`

---

*Last Updated: January 13, 2026*
