# ⚡ Performance Monitoring Setup

**Purpose:** Track Core Web Vitals and Real User Monitoring  
**Status:** Ready to implement

---

## 📋 Overview

Performance monitoring tracks:
- **Core Web Vitals:** LCP, FID, CLS, FCP, TTFB
- **Real User Monitoring (RUM):** User session tracking
- **Performance Metrics:** Page load times, API latency

---

## ✅ Implementation Status

### Created Files
- ✅ `lib/performance/web-vitals.ts` - Core Web Vitals tracking
- ✅ `components/performance/WebVitalsTracker.tsx` - React component

### Integration
- ✅ Added to `components/common/Analytics.tsx`
- ⏳ Needs: `npm install web-vitals`

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install web-vitals
```

### Step 2: Verify Integration

The `WebVitalsTracker` component is already integrated into `Analytics.tsx`.

**Verify it's working:**
1. Check browser console for Web Vitals logs
2. Check PostHog for `web_vital` events
3. Check `/api/analytics/track` for Web Vitals data

---

## 📊 What Gets Tracked

### Core Web Vitals

1. **LCP (Largest Contentful Paint)**
   - Measures loading performance
   - Good: < 2.5s
   - Poor: > 4.0s

2. **FID (First Input Delay)**
   - Measures interactivity
   - Good: < 100ms
   - Poor: > 300ms

3. **CLS (Cumulative Layout Shift)**
   - Measures visual stability
   - Good: < 0.1
   - Poor: > 0.25

4. **FCP (First Contentful Paint)**
   - Measures initial render
   - Good: < 1.8s
   - Poor: > 3.0s

5. **TTFB (Time to First Byte)**
   - Measures server response time
   - Good: < 800ms
   - Poor: > 1.8s

---

## 📈 Viewing Metrics

### PostHog Dashboard

1. Go to PostHog Dashboard
2. Navigate to Events
3. Filter by `web_vital` event
4. View metrics by page, device, etc.

### Analytics API

Web Vitals are sent to `/api/analytics/track` and stored in:
- `analytics_events` table
- PostHog (if configured)

### Custom Dashboard (Future)

Create admin dashboard page:
- `/admin/performance`
- Display Web Vitals trends
- Show performance scores
- Identify slow pages

---

## 🔧 Configuration

### Adjust Thresholds

Edit `lib/performance/web-vitals.ts`:

```typescript
const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    // ... adjust as needed
};
```

### Disable Tracking

Remove `WebVitalsTracker` from `Analytics.tsx` or set environment variable:

```bash
NEXT_PUBLIC_ENABLE_WEB_VITALS=false
```

---

## 📖 Related Documentation

- **Monitoring Setup Guide:** `docs/MONITORING_SETUP_GUIDE.md`
- **Production Hardening Plan:** `docs/AUDIT_RESULTS/08_PRODUCTION_HARDENING_PLAN.md`

---

*Last Updated: January 13, 2026*
