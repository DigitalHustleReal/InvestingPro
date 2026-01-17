# Build Size Analysis
**InvestingPro CMS - Bundle Optimization Guide**

**Last Updated:** 2026-01-XX  
**Version:** 1.0

---

## Overview

This document tracks build size metrics and optimization opportunities for the InvestingPro CMS.

## Running Build Analysis

### Analyze Build Size

```bash
# Run Next.js build analyzer
ANALYZE=true npm run build
```

This generates:
- `/.next/analyze/` directory with bundle analysis
- Interactive HTML report showing bundle sizes
- Module breakdown by size

### Manual Analysis

```bash
# Build and check output
npm run build

# Check .next/static directory sizes
du -sh .next/static/chunks/*
du -sh .next/static/css/*

# Find large files
find .next/static -type f -size +100k -exec ls -lh {} \;
```

---

## Current Bundle Sizes

### Target Sizes (Best Practice)

- **First Load JS:** < 200 KB (gzipped)
- **Total JS:** < 500 KB (gzipped)
- **Total CSS:** < 50 KB (gzipped)
- **Images:** < 500 KB total per page

### Measurement Date: 2026-01-XX

```
Page: /
- First Load JS: ~XXX KB (gzipped)
- Total JS: ~XXX KB (gzipped)
- CSS: ~XXX KB (gzipped)

Page: /admin
- First Load JS: ~XXX KB (gzipped)
- Total JS: ~XXX KB (gzipped)
- CSS: ~XXX KB (gzipped)
```

---

## Optimization Strategies

### 1. Code Splitting

#### Dynamic Imports

**Before:**
```typescript
import HeavyComponent from '@/components/HeavyComponent';

export default function Page() {
  return <HeavyComponent />;
}
```

**After:**
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // If component doesn't need SSR
});

export default function Page() {
  return <HeavyComponent />;
}
```

#### Route-Based Splitting

Next.js automatically splits by route. Ensure:
- Pages use `export default` correctly
- Shared components are in appropriate locations

### 2. Tree Shaking

#### Use Named Imports

**Bad:**
```typescript
import * as lodash from 'lodash';
const value = lodash.get(obj, 'path');
```

**Good:**
```typescript
import get from 'lodash/get';
const value = get(obj, 'path');
```

#### Avoid Barrel Exports

**Bad:**
```typescript
// lib/index.ts
export * from './module1';
export * from './module2';
export * from './module3';
```

**Good:**
```typescript
// Import directly
import { func1 } from '@/lib/module1';
import { func2 } from '@/lib/module2';
```

### 3. Bundle Analysis

#### Large Dependencies

**Known Large Packages:**
- `@tiptap/*` - Rich text editor (~200 KB)
- `chart.js` - Charting library (~150 KB)
- `framer-motion` - Animation library (~100 KB)
- `@sentry/nextjs` - Error tracking (~50 KB)

**Optimization:**
- Use dynamic imports for heavy libraries
- Consider lighter alternatives
- Lazy load on user interaction

#### Example: Lazy Load Tiptap

```typescript
const Editor = dynamic(
  () => import('@/components/editor/ArticleEditor'),
  { ssr: false, loading: () => <EditorSkeleton /> }
);
```

### 4. Image Optimization

#### Next.js Image Component

**Always use:**
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  placeholder="blur" // For blur placeholder
  loading="lazy" // Lazy load below fold
/>
```

#### Image Formats

- **WebP:** Preferred (smaller, good quality)
- **AVIF:** Best (smallest, newer browsers)
- **JPEG/PNG:** Fallback

#### Image Sizes

- **Hero Images:** Max 1920px width
- **Article Images:** Max 1200px width
- **Thumbnails:** Max 400px width

### 5. CSS Optimization

#### Remove Unused CSS

```bash
# Use PurgeCSS (if using Tailwind)
# Already configured in tailwind.config.js
```

#### Critical CSS

Extract critical CSS for above-the-fold content:
```typescript
// Automatically handled by Next.js
// Ensure CSS is component-scoped when possible
```

### 6. Third-Party Scripts

#### Defer Non-Critical Scripts

```typescript
// Use next/script with strategy
import Script from 'next/script';

<Script
  src="https://example.com/analytics.js"
  strategy="afterInteractive" // or "lazyOnload"
/>
```

#### Remove Unused Scripts

- Only include analytics on production
- Load external libraries via CDN (cached)
- Use Subresource Integrity (SRI) for security

---

## Optimization Checklist

### Code Splitting
- [ ] Heavy components use dynamic imports
- [ ] Admin components separated from public pages
- [ ] Editor components lazy-loaded
- [ ] Chart/visualization libraries lazy-loaded

### Dependencies
- [ ] Review package.json for unused dependencies
- [ ] Replace heavy libraries with lighter alternatives
- [ ] Use tree-shaking friendly imports
- [ ] Avoid duplicate dependencies

### Images
- [ ] All images use Next.js Image component
- [ ] Images optimized (WebP/AVIF)
- [ ] Appropriate image sizes
- [ ] Lazy loading for below-fold images

### CSS
- [ ] Unused CSS removed (PurgeCSS)
- [ ] Critical CSS extracted
- [ ] CSS minified in production

### Scripts
- [ ] Non-critical scripts deferred
- [ ] Analytics scripts loaded after page load
- [ ] Third-party scripts minimized

---

## CI/CD Integration

### Bundle Size Limits

Add to CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
- name: Check bundle size
  run: |
    npm run build
    npm run analyze
    # Fail if bundle size exceeds limits
    node scripts/check-bundle-size.js
```

### Bundle Size Check Script

```javascript
// scripts/check-bundle-size.js
const MAX_FIRST_LOAD_JS = 200 * 1024; // 200 KB
const MAX_TOTAL_JS = 500 * 1024; // 500 KB

// Read bundle size from .next/analyze/
// Fail if exceeds limits
```

---

## Monitoring

### Regular Reviews

- **Weekly:** Review bundle size after major changes
- **Monthly:** Full bundle analysis
- **Per Release:** Verify bundle size before production

### Metrics Tracking

Track these metrics over time:
- First Load JS size
- Total JS size
- Largest modules
- Unused code percentage

---

## Quick Wins

### Immediate Optimizations

1. **Lazy load editor components**
   ```typescript
   const Editor = dynamic(() => import('@/components/editor/ArticleEditor'));
   ```

2. **Lazy load chart libraries**
   ```typescript
   const Chart = dynamic(() => import('@/components/charts/Chart'));
   ```

3. **Optimize images**
   - Convert to WebP
   - Resize to appropriate dimensions
   - Use Next.js Image component

4. **Remove unused dependencies**
   ```bash
   npm run depcheck
   # Review and remove unused packages
   ```

---

## Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Bundle Phobia](https://bundlephobia.com/) - Check package sizes
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)

---

## Next Steps

1. Run initial bundle analysis
2. Document baseline sizes
3. Identify optimization opportunities
4. Implement optimizations incrementally
5. Monitor bundle size over time

---

**Remember:** Bundle size is a balance between features and performance. Optimize where it makes sense, but don't sacrifice user experience for a few KB! ⚡
