# SEO Infrastructure

This document describes the SEO infrastructure and best practices.

## 🎯 Overview

The platform includes comprehensive SEO infrastructure:
- ✅ Auto-generated sitemap
- ✅ Robots.txt configuration
- ✅ Canonical URL management
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ Meta tags

---

## 📋 Sitemap

### Auto-Generated Sitemap

**Location:** `/sitemap.xml`

The sitemap is automatically generated and includes:
- Static pages (home, calculators, glossary)
- Category pages
- Articles (published only)
- Products (active only)
- Glossary terms

**Update Frequency:**
- Homepage: Daily
- Categories: Daily
- Articles: Monthly
- Products: Weekly

### Manual Sitemap Generation

The sitemap is generated on-demand when accessed. For large sites, consider:
- Caching the sitemap
- Generating sitemap index for multiple sitemaps
- Using sitemap generation service

---

## 🤖 Robots.txt

**Location:** `/robots.txt`

**Configuration:**
- Allows all crawlers
- Disallows `/api/`, `/admin/`, `/_next/`
- Points to sitemap

**Custom Rules:**
- Googlebot: Allows all except `/api/` and `/admin/`
- Other bots: Standard rules apply

---

## 🔗 Canonical URLs

### Usage

```typescript
import { generateCanonicalUrl } from '@/lib/seo/canonical';

const canonical = generateCanonicalUrl('/article/my-article');
// Returns: https://investingpro.in/article/my-article
```

### Automatic Canonical

Canonical URLs are automatically set via:
- Next.js Metadata API
- SEOHead component
- Server-side rendering

---

## 📊 Structured Data

### Article Structured Data

```typescript
import { generateArticleStructuredData } from '@/lib/seo/structured-data';

const structuredData = generateArticleStructuredData({
    title: 'Article Title',
    description: 'Article description',
    url: 'https://investingpro.in/article/slug',
    publishedDate: '2026-01-15',
    authorName: 'Author Name',
});
```

### Product Structured Data

```typescript
import { generateProductStructuredData } from '@/lib/seo/structured-data';

const structuredData = generateProductStructuredData({
    name: 'Product Name',
    description: 'Product description',
    url: 'https://investingpro.in/products/slug',
    brand: 'Brand Name',
    rating: 4.5,
    reviewCount: 100,
});
```

### Breadcrumb Structured Data

```typescript
import { generateBreadcrumbStructuredData } from '@/lib/seo/structured-data';

const breadcrumbs = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://investingpro.in' },
    { name: 'Category', url: 'https://investingpro.in/category' },
    { name: 'Article', url: 'https://investingpro.in/article/slug' },
]);
```

---

## 🏷️ Meta Tags

### Using Metadata API (Server Components)

```typescript
import { generateMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    return generateArticleMetadata({
        title: 'Article Title',
        description: 'Article description',
        slug: params.slug,
        publishedDate: '2026-01-15',
    });
}
```

### Using SEOHead Component (Client Components)

```typescript
import SEOHead from '@/components/common/SEOHead';

<SEOHead
    title="Article Title"
    description="Article description"
    url="https://investingpro.in/article/slug"
    structuredData={structuredData}
/>
```

---

## 📈 SEO Best Practices

### 1. Title Tags
- Keep under 60 characters
- Include brand name
- Use primary keyword
- Unique per page

### 2. Meta Descriptions
- Keep under 160 characters
- Include call-to-action
- Use primary keyword naturally
- Unique per page

### 3. Images
- Use descriptive alt text
- Optimize file sizes
- Use WebP format
- Include Open Graph images (1200x630px)

### 4. URLs
- Use descriptive slugs
- Keep URLs short
- Use hyphens, not underscores
- Lowercase only

### 5. Structured Data
- Use appropriate schema types
- Validate with Google Rich Results Test
- Keep data accurate and up-to-date

---

## 🔍 SEO Checklist

### Page-Level
- [ ] Unique title tag (< 60 chars)
- [ ] Unique meta description (< 160 chars)
- [ ] Canonical URL set
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [ ] Alt text on images
- [ ] Internal links
- [ ] Mobile-friendly

### Site-Level
- [ ] Sitemap.xml exists
- [ ] Robots.txt configured
- [ ] SSL certificate
- [ ] Fast page load (< 3s)
- [ ] Mobile responsive
- [ ] No broken links
- [ ] Proper redirects (301)

---

## 📊 SEO Monitoring

### Tools
- Google Search Console
- Google Analytics
- Lighthouse (performance + SEO)
- Schema.org Validator
- Rich Results Test

### Metrics to Track
- Organic traffic
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate
- Page load time
- Core Web Vitals

---

## 📈 Next Steps

- ✅ Sitemap auto-generated
- ✅ Robots.txt configured
- ✅ Canonical URLs managed
- ✅ Structured data generators created
- ✅ Metadata utilities created
- 🔄 **Next:** Verify structured data on all pages
- 🔄 **Next:** Add FAQ structured data where applicable

---

**Questions?** Check the code in `lib/seo/` directory
