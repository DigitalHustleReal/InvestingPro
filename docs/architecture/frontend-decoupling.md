# Frontend Decoupling Guide

This document describes the frontend decoupling strategy and migration guide.

## 🎯 Overview

Frontend components should **never** directly access Supabase or the database. All data access must go through API endpoints.

**Benefits:**
- ✅ Frontend decoupled from database
- ✅ Consistent error handling
- ✅ Rate limiting and security
- ✅ Caching support
- ✅ Easier testing
- ✅ Better scalability

---

## 📋 Migration Status

### Components Using Direct Supabase (To Migrate)

1. **Admin Components:**
   - `components/admin/CategorySelect.tsx`
   - `components/admin/TagInput.tsx`
   - `components/admin/GlobalSearch.tsx`
   - `components/admin/StockImageSearch.tsx`
   - `components/admin/MediaLibraryPicker.tsx`
   - `components/admin/OneClickArticleGenerator.tsx`

2. **Engagement Components:**
   - `components/engagement/LeadMagnet.tsx`
   - `components/engagement/ContextualLeadMagnet.tsx`
   - `components/engagement/LeadMagnetPopup.tsx`

3. **Review Components:**
   - `components/reviews/ProductReviews.tsx`

---

## 🚀 Using the API Client

### Basic Usage

```typescript
import { api } from '@/lib/api/client';

// Get articles
const { data, error } = await api.articles.list({
    page: 1,
    limit: 10,
    category: 'mutual-funds',
});

if (error) {
    console.error('Failed to fetch articles:', error);
    return;
}

console.log('Articles:', data?.items);
```

### With React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

function ArticlesList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['articles'],
        queryFn: async () => {
            const response = await api.articles.list({ page: 1, limit: 10 });
            if (!response.success) {
                throw new Error(response.error?.message);
            }
            return response.data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {data?.items.map(article => (
                <div key={article.id}>{article.title}</div>
            ))}
        </div>
    );
}
```

### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

function CreateArticle() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => api.articles.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
    });

    const handleSubmit = (formData: any) => {
        mutation.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
}
```

---

## 🔄 Migration Examples

### Before (Direct Supabase)

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published');
```

### After (API Client)

```typescript
import { api } from '@/lib/api/client';

const response = await api.articles.list({ status: 'published' });
if (!response.success) {
    console.error(response.error);
    return;
}
const articles = response.data?.items;
```

---

## 📊 Available API Endpoints

### Articles
- `api.articles.list(params)` - Get articles
- `api.articles.getById(id)` - Get article by ID
- `api.articles.getBySlug(slug)` - Get article by slug
- `api.articles.create(data)` - Create article
- `api.articles.update(id, data)` - Update article
- `api.articles.delete(id)` - Delete article

### Products
- `api.products.list(params)` - Get products
- `api.products.getById(id)` - Get product by ID
- `api.products.getBySlug(slug)` - Get product by slug
- `api.products.search(query, params)` - Search products

### Reviews
- `api.reviews.list(productId, params)` - Get reviews
- `api.reviews.create(data)` - Create review
- `api.reviews.update(id, data)` - Update review

### Analytics
- `api.analytics.track(event, data)` - Track event
- `api.analytics.trackProductView(productId, data)` - Track product view
- `api.analytics.trackAffiliateClick(productId, articleId)` - Track affiliate click

### Newsletter
- `api.newsletter.subscribe(email)` - Subscribe to newsletter

### Bookmarks
- `api.bookmarks.list()` - Get bookmarks
- `api.bookmarks.add(articleId)` - Add bookmark
- `api.bookmarks.remove(articleId)` - Remove bookmark

### Search
- `api.search.search(query, params)` - Search articles and products

---

## ✅ Migration Checklist

For each component:

- [ ] Remove `import { createClient } from '@/lib/supabase/client'`
- [ ] Add `import { api } from '@/lib/api/client'`
- [ ] Replace Supabase queries with API client calls
- [ ] Update error handling to use API response format
- [ ] Test component functionality
- [ ] Update TypeScript types if needed

---

## 🎯 Best Practices

1. **Always check response.success:**
   ```typescript
   const response = await api.articles.list();
   if (!response.success) {
     // Handle error
     return;
   }
   // Use response.data
   ```

2. **Use React Query for caching:**
   ```typescript
   const { data } = useQuery({
     queryKey: ['articles'],
     queryFn: () => api.articles.list(),
   });
   ```

3. **Handle errors gracefully:**
   ```typescript
   if (response.error) {
     toast.error(response.error.message);
     return;
   }
   ```

4. **Type your responses:**
   ```typescript
   interface Article {
     id: string;
     title: string;
     // ...
   }

   const response = await api.articles.getById(id);
   const article = response.data as Article;
   ```

---

## 📈 Next Steps

- ✅ API client created
- ✅ Basic endpoints implemented
- 🔄 Migrate components (in progress)
- 🔄 Add more API endpoints as needed
- 🔄 Remove Supabase client from frontend

---

**Questions?** Check the code in `lib/api/client.ts`
