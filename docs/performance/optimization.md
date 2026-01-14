# Performance Optimization Guide

This document describes performance optimization strategies and tools.

## 🎯 Performance Budgets

### Bundle Size Budgets
- **Initial JavaScript Bundle:** < 200KB
- **Total JavaScript Bundle:** < 500KB
- **Initial CSS Bundle:** < 50KB

### Performance Metrics
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3s
- **Total Blocking Time (TBT):** < 300ms
- **Cumulative Layout Shift (CLS):** < 0.1

### Lighthouse Scores
- **Performance:** ≥ 90
- **Accessibility:** ≥ 95
- **Best Practices:** ≥ 90
- **SEO:** ≥ 90

---

## 📦 Bundle Analysis

### Analyze Bundle Sizes

```bash
npm run build
npm run analyze
```

Or use the custom analyzer:

```bash
npm run build
node scripts/analyze-bundle.js
```

### Using @next/bundle-analyzer

The bundle analyzer is configured in `next.config.ts`. To use it:

```bash
ANALYZE=true npm run build
```

This will:
1. Build the application
2. Generate bundle analysis reports
3. Open interactive visualizations in your browser

---

## 🚀 Code Splitting

### Lazy Loading Components

Use the lazy loading utilities from `lib/performance/lazy-loading.ts`:

```typescript
import { LazyAdminDashboard, LazySIPCalculator } from '@/lib/performance/lazy-loading';

// Admin components (lazy loaded)
<LazyAdminDashboard />

// Calculator components (lazy loaded)
<LazySIPCalculator />
```

### Dynamic Imports

For custom lazy loading:

```typescript
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const HeavyComponent = lazy(() => import('@/components/HeavyComponent'));

function MyPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <HeavyComponent />
        </Suspense>
    );
}
```

### Preloading Critical Components

```typescript
import { preloadComponent } from '@/lib/performance/lazy-loading';

const preloadProps = preloadComponent(() => import('@/components/CriticalComponent'));

<button {...preloadProps}>
    Click me (component preloads on hover)
</button>
```

---

## 🖼️ Image Optimization

### Using Next.js Image Component

Always use Next.js `Image` component for automatic optimization:

```typescript
import Image from 'next/image';

<Image
    src="/image.jpg"
    alt="Description"
    width={800}
    height={600}
    loading="lazy"
    placeholder="blur"
/>
```

### Image Configuration

Images are automatically optimized via `next.config.ts`:
- AVIF and WebP formats
- Responsive sizes
- Lazy loading
- CDN caching

---

## 📊 Performance Monitoring

### Client-Side Monitoring

Performance monitoring is automatically initialized in `app/layout.tsx`:

```typescript
import { initPerformanceMonitoring } from '@/lib/performance/monitor';

// Automatically monitors:
// - Core Web Vitals (FCP, LCP, CLS, TBT)
// - Resource sizes
// - Budget violations
```

### Reporting Metrics

Metrics are automatically reported to `/api/performance/metrics`:
- Core Web Vitals
- Resource sizes
- Budget violations

---

## 🔍 Lighthouse CI

### Running Lighthouse CI

```bash
npm run lighthouse
```

### Configuration

Lighthouse CI is configured in `.lighthouserc.js`:
- Tests multiple URLs
- Enforces performance budgets
- Generates reports
- Can be integrated into CI/CD

### CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  run: npm run lighthouse
```

---

## 🎨 Best Practices

### 1. Code Splitting
- ✅ Lazy load admin components
- ✅ Lazy load heavy calculators
- ✅ Lazy load chart libraries
- ✅ Use dynamic imports for large dependencies

### 2. Image Optimization
- ✅ Use Next.js Image component
- ✅ Provide width and height
- ✅ Use appropriate formats (WebP, AVIF)
- ✅ Lazy load below-the-fold images

### 3. Bundle Optimization
- ✅ Remove unused dependencies
- ✅ Use tree-shaking
- ✅ Split vendor chunks
- ✅ Monitor bundle sizes

### 4. Caching
- ✅ Static assets cached for 1 year
- ✅ Images cached with stale-while-revalidate
- ✅ API responses cached where appropriate

### 5. Performance Monitoring
- ✅ Monitor Core Web Vitals
- ✅ Track bundle sizes
- ✅ Alert on budget violations
- ✅ Regular Lighthouse audits

---

## 📈 Performance Checklist

### Build-Time
- [ ] Bundle sizes within budgets
- [ ] No duplicate dependencies
- [ ] Code splitting enabled
- [ ] Tree-shaking working

### Runtime
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] TTI < 3s
- [ ] CLS < 0.1
- [ ] Images optimized
- [ ] Lazy loading working

### Monitoring
- [ ] Performance monitoring enabled
- [ ] Budget violations tracked
- [ ] Lighthouse CI passing
- [ ] Metrics dashboard available

---

## 🛠️ Tools

### Bundle Analysis
- `@next/bundle-analyzer` - Visual bundle analysis
- `scripts/analyze-bundle.js` - Custom bundle analyzer

### Performance Testing
- Lighthouse CI - Automated performance testing
- Chrome DevTools - Manual performance profiling
- WebPageTest - Real-world performance testing

### Monitoring
- Performance API - Browser performance metrics
- Custom monitoring - `/api/performance/metrics`
- Prometheus - Server-side metrics

---

## 📚 Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

**Questions?** Check the code in `lib/performance/` directory
