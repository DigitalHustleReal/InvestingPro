# Load Testing Scripts

This directory contains load testing configurations for InvestingPro.

## Available Tools

### 1. Artillery (Recommended for CI/CD)

Artillery is a modern load testing toolkit that works well in CI pipelines.

**Install:**
```bash
npm install -g artillery
```

**Run locally:**
```bash
# Default (localhost:3000)
artillery run scripts/load-test/artillery.yml

# Against staging
artillery run scripts/load-test/artillery.yml --target https://staging.investingpro.in

# Against production (use with caution)
artillery run scripts/load-test/artillery.yml --target https://investingpro.in
```

**Test Phases:**
1. Warm up: 30s at 5 req/s
2. Ramp up: 60s from 10 to 50 req/s
3. Sustained: 120s at 50 req/s
4. Spike: 30s at 100 req/s
5. Cool down: 30s at 10 req/s

**Thresholds:**
- p95 latency: < 500ms
- p99 latency: < 1000ms
- Error rate: < 1%

---

### 2. k6 (For Advanced Scenarios)

k6 is a powerful load testing tool by Grafana Labs.

**Install:**
```bash
# macOS
brew install k6

# Windows (with Chocolatey)
choco install k6
```

**Run:**
```bash
# Basic test
k6 run scripts/load-test/k6-basic.js

# API test
k6 run scripts/load-test/k6-api.js

# With custom base URL
k6 run --env BASE_URL=https://staging.investingpro.in scripts/load-test/k6-api.js
```

**Available k6 Scripts:**
- `k6-basic.js` - Simple homepage test
- `k6-api.js` - API endpoints test
- `k6-article.js` - Article pages test
- `k6-homepage.js` - Homepage specific test
- `k6-spike.js` - Spike test for sudden traffic

---

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Homepage TTFB | < 200ms | < 500ms |
| API Response | < 100ms | < 300ms |
| Article Page | < 300ms | < 1000ms |
| Error Rate | < 0.1% | < 1% |
| Concurrent Users | 100 | 500 |

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Load Test
  run: |
    npm install -g artillery
    artillery run scripts/load-test/artillery.yml --target ${{ secrets.STAGING_URL }}
```

### Pre-deployment Check

```bash
# Run quick load test before deploying to production
artillery run scripts/load-test/artillery.yml \
  --target https://staging.investingpro.in \
  --quiet \
  --output report.json

# Check if thresholds passed
artillery report report.json
```

---

## Interpreting Results

### Good Results ✅
- p95 < 500ms
- Error rate < 1%
- Steady response times under load

### Warning Signs ⚠️
- Response times increasing linearly with load
- Error rate creeping up
- Timeouts during spike tests

### Red Flags 🚨
- p95 > 1000ms
- Error rate > 5%
- Connection failures
- 502/503 errors

---

## Tips

1. **Always test staging first** - Never load test production without testing staging
2. **Start small** - Begin with 10 concurrent users and scale up
3. **Monitor during tests** - Watch Vercel metrics, Supabase dashboard, Sentry
4. **Test at off-peak hours** - Especially for production
5. **Document baseline** - Record normal performance before changes
