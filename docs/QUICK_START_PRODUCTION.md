# 🚀 Quick Start: Production Deployment

**Purpose:** Fast-track guide for deploying to production  
**Time:** 30 minutes

---

## ⚡ Pre-Flight Checklist (5 min)

```bash
# 1. Validate environment
npx tsx scripts/setup-production.ts

# 2. Test build
npm run build

# 3. Test critical flows
npx tsx scripts/test-critical-flows.ts
```

**All checks must pass before proceeding.**

---

## 🚀 Deploy (10 min)

### Option 1: Vercel CLI
```bash
vercel --prod
```

### Option 2: Git Push (Auto-Deploy)
```bash
git push origin main
```

### Option 3: Vercel Dashboard
1. Go to Vercel Dashboard
2. Select project
3. Click "Redeploy" or create new deployment

---

## ✅ Post-Deployment Verification (10 min)

### 1. Health Checks
```bash
curl https://your-domain.com/api/health
curl https://your-domain.com/api/health/detailed
```

**Expected:** Status "ok", all services "ok"

### 2. Critical Flows
```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com \
npx tsx scripts/test-critical-flows.ts
```

**Expected:** All tests passing

### 3. Metrics Dashboard
- Visit: `https://your-domain.com/admin/metrics`
- Verify: Metrics updating, no error spikes

### 4. Sentry
- Check Sentry dashboard
- Verify: Errors being captured

---

## 🆘 If Something Goes Wrong

### Quick Rollback
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Check Logs
- Vercel: Function logs
- Sentry: Error logs
- Metrics: `/admin/metrics`

### Emergency Contacts
- See: `docs/INCIDENT_RESPONSE_PLAYBOOK.md`

---

## 📖 Full Documentation

- **Deployment Runbook:** `docs/DEPLOYMENT_RUNBOOK.md`
- **Production Checklist:** `docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md`
- **Incident Response:** `docs/INCIDENT_RESPONSE_PLAYBOOK.md`

---

*Quick Start Guide - January 13, 2026*
