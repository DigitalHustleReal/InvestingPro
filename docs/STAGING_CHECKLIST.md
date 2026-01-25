# Staging Deployment Checklist

## Pre-Deployment Verification

Complete this checklist before deploying to staging/production.

---

## 1. Environment Variables Verification

### Required Variables (Must Have)

| Variable | Description | Verified |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [ ] |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | [ ] |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | [ ] |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | [ ] |

### AI Providers (At Least One Required)

| Variable | Provider | Verified |
|----------|----------|----------|
| `GROQ_API_KEY` | Groq (Llama3) | [ ] |
| `MISTRAL_API_KEY` | Mistral AI | [ ] |
| `OPENAI_API_KEY` | OpenAI GPT-4 | [ ] |
| `ANTHROPIC_API_KEY` | Anthropic Claude | [ ] |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini | [ ] |

### Infrastructure Services

| Variable | Service | Verified |
|----------|---------|----------|
| `UPSTASH_REDIS_REST_URL` | Redis cache URL | [ ] |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token | [ ] |
| `INNGEST_EVENT_KEY` | Inngest event key | [ ] |
| `INNGEST_SIGNING_KEY` | Inngest signing key | [ ] |

### Optional but Recommended

| Variable | Purpose | Verified |
|----------|---------|----------|
| `CRON_SECRET` | Secure cron endpoints | [ ] |
| `SENTRY_DSN` | Error monitoring | [ ] |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics | [ ] |
| `RESEND_API_KEY` | Email service | [ ] |

---

## 2. Database Verification

### Pre-Deployment Checks

- [ ] Run pending migrations: `supabase db push`
- [ ] Verify RLS policies are enabled
- [ ] Check indexes exist for common queries
- [ ] Backup database before major changes
- [ ] Verify audit log table exists

### SQL Verification

```sql
-- Check RLS is enabled on key tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('articles', 'products', 'authors');

-- Verify indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';
```

---

## 3. Build Verification

### Local Build Test

```bash
# Clean install
rm -rf node_modules .next
npm ci

# Build check
npm run build

# Type check
npm run type-check

# Lint check
npm run lint

# Test suite
npm run test
```

### Expected Results

- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All tests pass

---

## 4. Smoke Tests

Run these tests immediately after deployment.

### Critical Path Tests

| Test | URL | Expected | Verified |
|------|-----|----------|----------|
| Homepage loads | `/` | 200 OK | [ ] |
| Article page | `/articles/[any-slug]` | 200 OK | [ ] |
| Credit cards | `/credit-cards` | 200 OK | [ ] |
| Mutual funds | `/mutual-funds` | 200 OK | [ ] |
| Health endpoint | `/api/health` | `{"status":"ok"}` | [ ] |
| Sitemap | `/sitemap.xml` | Valid XML | [ ] |
| Robots.txt | `/robots.txt` | Valid content | [ ] |

### Admin Tests (After Auth)

| Test | URL | Expected | Verified |
|------|-----|----------|----------|
| Admin dashboard | `/admin` | Accessible | [ ] |
| Article list | `/admin/articles` | Data loads | [ ] |
| CMS health | `/admin/cms/health` | Status shows | [ ] |

### API Tests

```bash
# Health check
curl https://[staging-url]/api/health

# Public articles
curl https://[staging-url]/api/articles?limit=5

# AI service status (if authenticated)
curl https://[staging-url]/api/admin/ai/status
```

---

## 5. Performance Verification

### Core Web Vitals

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.5s | PageSpeed Insights |
| FID | < 100ms | PageSpeed Insights |
| CLS | < 0.1 | PageSpeed Insights |

### Page Load Times

- [ ] Homepage: < 2s
- [ ] Article page: < 2s
- [ ] Product page: < 2s

---

## 6. Security Verification

### SSL/TLS

- [ ] HTTPS enforced
- [ ] Valid SSL certificate
- [ ] HSTS header present

### Headers

```bash
# Check security headers
curl -I https://[staging-url] | grep -E "(Strict-Transport|X-Frame|X-Content|Content-Security)"
```

### Authentication

- [ ] Admin routes require auth
- [ ] API routes validate tokens
- [ ] Rate limiting active

---

## 7. Monitoring Setup

### Verify Monitoring Active

- [ ] Sentry receiving errors
- [ ] PostHog tracking events
- [ ] Vercel analytics enabled
- [ ] Uptime monitoring configured

### Set Up Alerts

- [ ] Error rate > 1% alert
- [ ] Response time > 5s alert
- [ ] Downtime alert

---

## 8. Feature Flags

### Verify Feature States

| Feature | Expected State |
|---------|---------------|
| AI content generation | Enabled |
| Budget governor | Enabled |
| Rate limiting | Enabled |
| Cache stampede protection | Enabled |

---

## 9. Rollback Plan

### If Issues Detected

1. **Minor issues**: Fix forward
2. **Major issues**: Rollback deployment
   ```bash
   vercel rollback [deployment-url]
   ```
3. **Database issues**: See [MIGRATION_ROLLBACK.md](./MIGRATION_ROLLBACK.md)

### Emergency Contacts

| Role | Contact |
|------|---------|
| Lead Developer | [Contact] |
| DevOps | [Contact] |
| On-call | [Contact] |

---

## 10. Post-Deployment

### Immediate (Within 30 mins)

- [ ] All smoke tests pass
- [ ] No error spikes in Sentry
- [ ] Cache warming complete
- [ ] Search engines can crawl

### Next 24 Hours

- [ ] Monitor error rates
- [ ] Check user feedback
- [ ] Verify analytics flowing
- [ ] Review performance metrics

---

## Sign-Off

| Deployer | Date | Time | Environment |
|----------|------|------|-------------|
| _________ | _____ | _____ | Staging / Production |

### Notes

```
[Add deployment notes here]
```

---

## Quick Reference Commands

```bash
# Deploy to staging (Vercel)
vercel --prod --scope=staging

# View deployment logs
vercel logs [deployment-url]

# Rollback
vercel rollback

# Check environment
vercel env ls

# Run migrations
supabase db push --linked

# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```
