# Performance Audit Guide - Phase 2, Task 2.2
**Date:** January 23, 2026  
**Priority:** HIGH  
**Estimated Time:** 4 hours  
**Owner:** Engineering / DevOps  

---

## 📊 CURRENT PERFORMANCE CONFIGURATION

### ✅ Positive Findings:
1. **Lighthouse CI:** Configured (`.lighthouserc.js`) with targets:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 90+
   - SEO: 90+

2. **Next.js Image Optimization:**
   - Enabled: `unoptimized: false`
   - Modern formats: AVIF, WebP
   - Device sizes configured
   - Cache TTL: 60 seconds

3. **Font Loading:**
   - Uses `display: 'swap'` (prevents FOIT)
   - Google Fonts (Inter, Source Serif 4, JetBrains Mono)

4. **Compression:**
   - `compress: true` in Next.js config

5. **Code Splitting:**
   - Dynamic imports found in API routes
   - Suspense boundaries used

### ⚠️ Areas to Check:
1. **Image Usage:** Need to verify all images use Next.js `Image` component
2. **Bundle Size:** Need to check JavaScript bundle sizes
3. **Render-Blocking Resources:** Need to verify CSS/JS blocking
4. **Third-Party Scripts:** Need to check analytics/tracking scripts
5. **Font Loading:** Verify font subset optimization

---

## 🔍 PERFORMANCE AUDIT STEPS

### STEP 1: Run Lighthouse Audits (1 hour)

#### 1.1 Install Lighthouse CLI (if needed)
```bash
npm install -g @lhci/cli
```

#### 1.2 Run Local Lighthouse Audit
```bash
# Start production build
npm run build
npm run start

# In another terminal, run Lighthouse CI
npm run lighthouse

# OR run manual Lighthouse audits
npx lighthouse http://localhost:3000 --view
npx lighthouse http://localhost:3000/credit-cards --view
npx lighthouse http://localhost:3000/mutual-funds --view
npx lighthouse http://localhost:3000/article/[sample-slug] --view
```

#### 1.3 Document Baseline Scores

**Test Pages:**
- [ ] Homepage (`/`)
- [ ] Credit Cards (`/credit-cards`)
- [ ] Mutual Funds (`/mutual-funds`)
- [ ] Sample Article (`/article/[slug]`)

**Document for Each Page:**

| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|------|-------------|---------------|----------------|-----|-----|-----|-----|-----|
| Homepage | ___/100 | ___/100 | ___/100 | ___/100 | ___ms | ___ms | ___ms | ___ |
| Credit Cards | ___/100 | ___/100 | ___/100 | ___/100 | ___ms | ___ms | ___ms | ___ |
| Mutual Funds | ___/100 | ___/100 | ___/100 | ___/100 | ___ms | ___ms | ___ms | ___ |
| Article | ___/100 | ___/100 | ___/100 | ___/100 | ___ms | ___ms | ___ms | ___ |

**Targets:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+
- FCP: <1,500ms
- LCP: <2,500ms
- TBT: <300ms
- CLS: <0.1

---

### STEP 2: Identify Critical Issues (30 min)

#### 2.1 Check Lighthouse Recommendations

For each page that scores <90 in Performance:

**Common Issues to Look For:**
1. **Images:**
   - [ ] Unoptimized images (not using Next.js Image)
   - [ ] Missing `width`/`height` attributes
   - [ ] Images not lazy loaded
   - [ ] Large image files (>1MB)

2. **JavaScript:**
   - [ ] Large bundle size (>500KB)
   - [ ] Unused JavaScript
   - [ ] Render-blocking scripts
   - [ ] Third-party scripts loading synchronously

3. **CSS:**
   - [ ] Unused CSS
   - [ ] Render-blocking stylesheets
   - [ ] Large CSS files (>50KB)

4. **Fonts:**
   - [ ] Fonts not preloaded
   - [ ] Font display not optimized
   - [ ] Too many font families

5. **Network:**
   - [ ] Missing compression (gzip/brotli)
   - [ ] Missing HTTP/2
   - [ ] Too many requests

#### 2.2 Prioritize Issues

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Large images | HIGH | LOW | BLOCKER |
| Render-blocking JS | HIGH | MEDIUM | HIGH |
| Unoptimized images | HIGH | LOW | HIGH |
| Large bundle size | MEDIUM | MEDIUM | MEDIUM |
| Unused CSS | MEDIUM | LOW | MEDIUM |
| Font loading | LOW | LOW | LOW |

---

### STEP 3: Fix Critical Issues (2 hours)

#### 3.1 Fix Image Optimization (30 min)

**Checklist:**
- [ ] Verify all images use `next/image` component
- [ ] Add `loading="lazy"` for below-fold images
- [ ] Add `priority` for above-fold images (hero)
- [ ] Ensure all images have `width` and `height`
- [ ] Convert large images to WebP/AVIF

**Files to Check:**
- `components/home/HeroSection.tsx`
- `app/article/[slug]/page.tsx`
- `app/blog/page.tsx`
- `app/credit-cards/page.tsx`
- `components/products/RichProductCard.tsx`

**Example Fix:**
```tsx
// ❌ Before
<img src={imageUrl} alt={title} />

// ✅ After
import Image from 'next/image';
<Image 
    src={imageUrl} 
    alt={title}
    width={400}
    height={300}
    loading="lazy"
    quality={80}
/>
```

#### 3.2 Optimize JavaScript Bundle (45 min)

**Actions:**
- [ ] Run bundle analyzer: `npm run analyze`
- [ ] Check for large dependencies
- [ ] Implement dynamic imports for heavy components
- [ ] Remove unused dependencies

**Bundle Analysis:**
```bash
# Enable bundle analyzer
ANALYZE=true npm run build

# Check output in `.next/analyze/` folder
```

**Dynamic Import Example:**
```tsx
// ❌ Before
import HeavyComponent from '@/components/HeavyComponent';

// ✅ After
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
    loading: () => <LoadingSpinner />,
    ssr: false // if client-only
});
```

**Components to Consider Dynamic Importing:**
- Charts/Graphs
- Calculators (if heavy)
- Admin components
- Third-party widgets

#### 3.3 Fix Render-Blocking Resources (30 min)

**CSS Optimization:**
- [ ] Check for critical CSS extraction
- [ ] Verify Tailwind purging works
- [ ] Remove unused CSS classes

**JavaScript Optimization:**
- [ ] Move analytics scripts to end of body
- [ ] Defer non-critical scripts
- [ ] Use async/defer attributes

**Font Optimization:**
- [ ] Preload critical fonts
- [ ] Verify `display: 'swap'` is set
- [ ] Consider subset fonts (already using subsets)

**Example Fix in `app/layout.tsx`:**
```tsx
// ✅ Add font preload
<link
    rel="preload"
    href="/fonts/inter.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
/>
```

#### 3.4 Optimize Third-Party Scripts (15 min)

**Analytics:**
- [ ] Verify Google Analytics loads asynchronously
- [ ] Consider deferring analytics until page load
- [ ] Use `strategy: 'afterInteractive'` for Next.js Script component

**Example:**
```tsx
import Script from 'next/script';

<Script
    src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
    strategy="afterInteractive"
/>
```

---

### STEP 4: Re-test and Verify (30 min)

#### 4.1 Re-run Lighthouse Audits

```bash
# Re-run after fixes
npm run build
npm run start
npm run lighthouse
```

#### 4.2 Verify All Targets Met

- [ ] Performance: 90+ ✅
- [ ] Accessibility: 95+ ✅
- [ ] Best Practices: 90+ ✅
- [ ] SEO: 90+ ✅
- [ ] FCP: <1,500ms ✅
- [ ] LCP: <2,500ms ✅
- [ ] TBT: <300ms ✅
- [ ] CLS: <0.1 ✅

#### 4.3 Document Improvements

**Before/After Comparison:**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Performance | ___/100 | ___/100 | +___ |
| LCP | ___ms | ___ms | -___ms |
| FCP | ___ms | ___ms | -___ms |
| Bundle Size | ___KB | ___KB | -___KB |

---

## 🛠️ QUICK WINS (Low Effort, High Impact)

### 1. Enable Compression ✅ (Already Enabled)
- `compress: true` in `next.config.ts` ✅

### 2. Optimize Images (15 min)
- [ ] Convert all `<img>` to Next.js `Image` component
- [ ] Add lazy loading to below-fold images
- [ ] Add `priority` to hero images

### 3. Remove Unused CSS (15 min)
- [ ] Run Tailwind purge (should auto-purge)
- [ ] Verify no large CSS files in bundle

### 4. Optimize Fonts (10 min)
- [ ] Already using `display: 'swap'` ✅
- [ ] Already using subsets ✅
- [ ] Consider font preload (optional)

---

## 🔧 TOOLS & COMMANDS

### Bundle Analysis
```bash
# Analyze bundle size
ANALYZE=true npm run build

# Check output
ls .next/analyze/
```

### Lighthouse CI
```bash
# Run Lighthouse CI
npm run lighthouse

# Or manual audit
npx lighthouse http://localhost:3000 --view
npx lighthouse http://localhost:3000 --json > lighthouse-report.json
```

### Performance Testing
```bash
# Build for production
npm run build

# Start production server
npm run start

# Test on production build (not dev mode)
```

---

## 📝 AUDIT CHECKLIST

### Pre-Audit Setup
- [ ] Production build created (`npm run build`)
- [ ] Production server running (`npm run start`)
- [ ] Lighthouse CLI installed
- [ ] Test pages identified

### Audit Execution
- [ ] Homepage audited
- [ ] Credit Cards page audited
- [ ] Mutual Funds page audited
- [ ] Article page audited
- [ ] Scores documented

### Issue Identification
- [ ] Critical issues listed
- [ ] Issues prioritized
- [ ] Fix plan created

### Fixes Applied
- [ ] Image optimization done
- [ ] Bundle size optimized
- [ ] Render-blocking resources fixed
- [ ] Third-party scripts optimized

### Re-testing
- [ ] Re-audited all pages
- [ ] All targets met (90+)
- [ ] Improvements documented

---

## ✅ ACCEPTANCE CRITERIA

**Task Complete When:**
- ✅ All pages score 90+ in Performance
- ✅ All pages score 95+ in Accessibility
- ✅ All pages score 90+ in Best Practices
- ✅ All pages score 90+ in SEO
- ✅ LCP <2,500ms (all pages)
- ✅ FCP <1,500ms (all pages)
- ✅ TBT <300ms (all pages)
- ✅ CLS <0.1 (all pages)

---

## 📊 EXPECTED RESULTS

### Target Scores:
- **Performance:** 90-100
- **Accessibility:** 95-100
- **Best Practices:** 90-100
- **SEO:** 90-100

### Target Metrics:
- **FCP:** <1,500ms
- **LCP:** <2,500ms
- **TBT:** <300ms
- **CLS:** <0.1
- **Speed Index:** <3,000ms

---

## 🎯 NEXT STEPS AFTER AUDIT

1. **Document Findings:**
   - Save Lighthouse reports
   - Create before/after comparison
   - Document fixes applied

2. **Set Up Monitoring:**
   - Enable PerformanceMonitor component (currently commented out)
   - Set up Lighthouse CI in GitHub Actions
   - Monitor performance over time

3. **Continuous Improvement:**
   - Run audits monthly
   - Monitor Core Web Vitals
   - Track performance regressions

---

**Last Updated:** January 23, 2026  
**Status:** Ready for Execution  
**Estimated Completion:** 4 hours
