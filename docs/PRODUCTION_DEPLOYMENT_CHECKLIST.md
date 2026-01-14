# ✅ Production Deployment Checklist

**Purpose:** Pre-deployment verification to ensure 90% production readiness  
**Use Before:** Every production deployment

---

## 🔒 Security Checklist

### API Security
- [ ] All critical routes have API wrapper applied
- [ ] Rate limiting configured and tested
- [ ] Request validation schemas in place
- [ ] Input sanitization working
- [ ] Security headers configured (CSP, HSTS, XSS)

### Authentication & Authorization
- [ ] Admin routes protected
- [ ] User authentication working
- [ ] RLS policies configured
- [ ] API keys secured (no hardcoded keys)

### Data Protection
- [ ] Sensitive data encrypted
- [ ] PII handling compliant
- [ ] Database backups configured
- [ ] Error messages don't leak sensitive info

---

## 📊 Monitoring Checklist

### Health Checks
- [ ] `/api/health` responding
- [ ] `/api/health/detailed` showing all services
- [ ] `/api/health/readiness` passing
- [ ] `/api/health/liveness` passing

### Metrics & Logging
- [ ] Metrics dashboard accessible (`/admin/metrics`)
- [ ] Metrics collection working
- [ ] Structured logging enabled
- [ ] Correlation IDs tracking
- [ ] Sentry error tracking configured

### Alerts
- [ ] Sentry alerts configured
- [ ] Vercel notifications enabled
- [ ] Team notified of alert channels

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] No linter errors
- [ ] Security scans passed
- [ ] Build succeeds locally
- [ ] Environment variables validated

### Database
- [ ] All migrations applied
- [ ] Database schema up to date
- [ ] RLS policies configured
- [ ] Backup taken (if applicable)

### Configuration
- [ ] All environment variables set
- [ ] No placeholder values
- [ ] API keys valid
- [ ] Service credentials correct

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] Critical flows tested
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] Authentication working
- [ ] Admin features accessible

### Performance Testing
- [ ] Page load times acceptable
- [ ] API response times < 500ms (p95)
- [ ] No memory leaks
- [ ] Database queries optimized

### Security Testing
- [ ] Rate limiting working
- [ ] Input validation working
- [ ] XSS protection working
- [ ] CSRF protection (if applicable)

---

## 📝 Documentation Checklist

### Required Documentation
- [ ] Deployment runbook reviewed
- [ ] Incident response playbook accessible
- [ ] Monitoring setup guide available
- [ ] Environment variable checklist complete

### Team Readiness
- [ ] Team trained on deployment process
- [ ] Rollback procedures understood
- [ ] Emergency contacts documented
- [ ] On-call rotation established

---

## 🌐 External Services Checklist

### Required Services
- [ ] Supabase configured and tested
- [ ] Vercel deployment configured
- [ ] Sentry error tracking active
- [ ] PostHog analytics active

### Optional Services
- [ ] Log aggregation configured (if using)
- [ ] Uptime monitoring active (if using)
- [ ] Redis/Upstash configured (if using)

---

## ✅ Final Verification

### Health Check
```bash
curl https://your-domain.com/api/health/detailed
```
- [ ] Status: "ok"
- [ ] All services: "ok"
- [ ] Latency acceptable

### Critical Flows
```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com \
npx tsx scripts/test-critical-flows.ts
```
- [ ] All tests passing
- [ ] No errors

### Metrics Dashboard
- [ ] Accessible at `/admin/metrics`
- [ ] Metrics updating
- [ ] No error spikes

---

## 🚨 Go/No-Go Decision

### ✅ GO if:
- All security checks pass
- All monitoring checks pass
- All tests pass
- Health checks passing
- Team ready

### ❌ NO-GO if:
- Critical security issues
- Monitoring not working
- Tests failing
- Health checks failing
- Team not ready

---

## 📞 Emergency Contacts

- **On-Call Engineer:** [Contact]
- **Team Lead:** [Contact]
- **Vercel Support:** [Support URL]
- **Supabase Support:** [Support URL]

---

*Last Updated: January 13, 2026*
