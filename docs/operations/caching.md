# Caching Strategy

This document describes the caching strategy for the application.

## 🎯 Overview

Caching is used to:
- ✅ Reduce database load
- ✅ Improve response times
- ✅ Lower costs
- ✅ Handle traffic spikes

**Cache Layer:** Redis (Upstash)
**Cache Strategy:** TTL-based with tag invalidation

---

## 📊 Cache TTL Strategies

### Articles
- **TTL:** 5 minutes
- **Reason:** Frequently updated content
- **Tags:** `articles`, `article:{id}`, `article:slug:{slug}`

### Products
- **TTL:** 10 minutes
- **Reason:** Less frequently updated
- **Tags:** `products`, `product:{type}:{id}`

### SEO Metadata
- **TTL:** 1 hour
- **Reason:** Rarely changes
- **Tags:** `seo`

### Keyword Research
- **TTL:** 1 day
- **Reason:** Expensive to compute
- **Tags:** `keywords`

### Search Results
- **TTL:** 5 minutes
- **Reason:** Frequently changing
- **Tags:** `search`

### Analytics
- **TTL:** 1 minute
- **Reason:** Real-time data
- **Tags:** `analytics`

---

## 🚀 Usage

### Using Cache Service

```typescript
import { cacheService } from '@/lib/cache/cache-service';
import { cacheKeyGenerators, cacheStrategies } from '@/lib/cache/cache-strategies';

// Get with cache
const article = await cacheService.getOrSet(
    cacheKeyGenerators.article.byId(id),
    async () => {
        // Fetch from database
        return await fetchArticle(id);
    },
    {
        ttl: cacheStrategies.article.ttl,
        tags: cacheStrategies.article.tags,
    }
);
```

### Manual Caching

```typescript
import { cacheService } from '@/lib/cache/cache-service';
import { cacheKeyGenerators, cacheStrategies } from '@/lib/cache/cache-strategies';

// Check cache
const cacheKey = cacheKeyGenerators.article.bySlug(slug);
const cached = await cacheService.get<ArticleData>(cacheKey, 'article');

if (cached) {
    return cached;
}

// Fetch and cache
const article = await fetchArticle(slug);
await cacheService.set(cacheKey, article, {
    ttl: cacheStrategies.article.ttl,
    tags: cacheStrategies.article.tags,
});

return article;
```

### Cache Invalidation

```typescript
import { invalidateArticleCache } from '@/lib/cache/cache-invalidation';

// After updating article
await invalidateArticleCache(articleId);
// This invalidates:
// - article:{id}
// - article:slug:{slug}
// - articles list cache
```

---

## 🔍 Cache Key Patterns

### Articles
- `article:{id}` - Article by ID
- `article:slug:{slug}` - Article by slug
- `articles:list:{query}` - Article list

### Products
- `product:{type}:{id}` - Product by type and ID
- `products:{type}:{query}` - Product list

### Search
- `search:{query}:{filters}` - Search results

### SEO
- `seo:{path}` - SEO metadata
- `seo:sitemap` - Sitemap

---

## 📈 Cache Metrics

### Prometheus Metrics

Cache performance is tracked via Prometheus:
- `cache_hits_total{cache_type}` - Total cache hits
- `cache_misses_total{cache_type}` - Total cache misses
- `cache_size_bytes{cache_type}` - Cache size

### Cache Monitor

```typescript
import { cacheMonitor } from '@/lib/cache/cache-monitor';

// Get overall hit rate
const hitRate = cacheMonitor.getOverallHitRate();

// Get metrics by category
const metrics = cacheMonitor.getMetricsByCategory();
```

---

## ⚙️ Configuration

### Environment Variables

```env
# Redis (required for caching)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Cache Strategies

```typescript
import { cacheStrategies } from '@/lib/cache/cache-strategies';

// Use predefined strategy
const strategy = cacheStrategies.article; // TTL: 5 minutes

// Or define custom
const customStrategy = {
    ttl: 300, // 5 minutes
    tags: ['custom'],
};
```

---

## 🎯 Best Practices

1. **Use appropriate TTL:**
   - Frequently updated: 5 minutes
   - Rarely updated: 1 hour
   - Expensive to compute: 1 day

2. **Always invalidate on updates:**
   ```typescript
   await updateArticle(id, data);
   await invalidateArticleCache(id);
   ```

3. **Use cache tags:**
   - Enables bulk invalidation
   - Prevents stale data

4. **Monitor cache hit rate:**
   - Target: > 70%
   - Alert if < 50%

5. **Cache at the right level:**
   - Cache expensive operations
   - Don't cache user-specific data
   - Cache public data aggressively

---

## 🔒 Cache Invalidation

### Automatic Invalidation

Cache is automatically invalidated when:
- Article is updated
- Article is published
- Article is deleted
- Product is updated

### Manual Invalidation

```typescript
import { invalidateArticleCache, invalidateAllArticlesCache } from '@/lib/cache/cache-invalidation';

// Invalidate single article
await invalidateArticleCache(articleId);

// Invalidate all articles
await invalidateAllArticlesCache();

// Invalidate by tag
await cacheService.invalidateTag('articles');
```

---

## 📊 Cache Performance

### Target Metrics

- **Hit Rate:** > 70%
- **Average Response Time:** < 50ms (cached)
- **Cache Size:** Monitor via Prometheus

### Monitoring

```typescript
import { cacheMonitor } from '@/lib/cache/cache-monitor';

const metrics = cacheMonitor.getAllMetrics();
console.log(`Hit Rate: ${metrics.overall.hitRate}%`);
console.log(`Hits: ${metrics.overall.hits}`);
console.log(`Misses: ${metrics.overall.misses}`);
```

---

## 📈 Next Steps

- ✅ Cache service implemented
- ✅ TTL strategies defined
- ✅ Cache invalidation on updates
- ✅ Metrics integration
- 🔄 **Next:** Task 9.1 - Data Retention & Archival

---

**Questions?** Check the code in `lib/cache/` directory
