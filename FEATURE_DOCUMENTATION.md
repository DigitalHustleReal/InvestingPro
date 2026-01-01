# InvestingPro CMS - Feature Documentation

## Overview

This document provides a comprehensive guide to all features implemented in the InvestingPro Content Management System. The platform includes content creation, analytics, search, monetization, and user engagement capabilities.

---

## Table of Contents

1. [Content Management](#1-content-management)
2. [Analytics & Insights](#2-analytics--insights)
3. [Search & Discovery](#3-search--discovery)
4. [Monetization Engine](#4-monetization-engine)
5. [User Engagement](#5-user-engagement)
6. [API Reference](#6-api-reference)
7. [Database Schema](#7-database-schema)
8. [Component Library](#8-component-library)

---

## 1. Content Management

### Article Service
**Location:** `lib/cms/article-service.ts`

Full CRUD operations for articles with:
- Draft/Published/Archived status workflow
- Slug-based lookups with preview token support
- Category and tag filtering
- SEO metadata management

### Content Factory
**Location:** `app/admin/content-factory/page.tsx`

AI-powered content generation:
- Select topics from curated list
- Generate complete articles with AI
- Edit and refine before publishing
- Auto-generates SEO metadata

---

## 2. Analytics & Insights

### Analytics Service
**Location:** `lib/analytics/service.ts`

```typescript
import { analyticsService } from '@/lib/analytics/service';

// Record a page view
await analyticsService.recordView(articleId, metadata);

// Get performance overview
const stats = await analyticsService.getOverview();
```

**Metrics tracked:**
- Total views
- Top performing articles
- Category breakdown
- View trends over time

### SEO Health Analyzer
**Location:** `lib/analytics/seo-analyzer.ts`

Analyzes articles across 6 dimensions:
- Title optimization (length, keywords)
- Meta description quality
- Heading structure
- Content length and readability
- Image alt text
- Internal/external links

**Usage:**
```typescript
import { seoAnalyzer } from '@/lib/analytics/seo-analyzer';

const report = await seoAnalyzer.analyze(article);
// Returns score (0-100), breakdown, issues, recommendations
```

### Admin Dashboards
- **Analytics Dashboard:** `/admin/analytics`
- **SEO Health Page:** `/admin/seo`

---

## 3. Search & Discovery

### Search Service
**Location:** `lib/search/service.ts`

```typescript
import { searchService } from '@/lib/search/service';

// Full-text search
const results = await searchService.search('mutual funds', { limit: 10 });

// Related articles
const related = await searchService.getRelatedArticles(articleId);

// Trending content
const trending = await searchService.getTrending(5);
```

### Command Palette (⌘K Search)
**Location:** `components/search/CommandPalette.tsx`

Premium keyboard-driven search UI:
- Press `⌘K` (Mac) or `Ctrl+K` (Windows) anywhere
- Debounced real-time search
- Keyboard navigation (↑↓ Enter Esc)
- Trending content when empty

**Integration:**
```tsx
// Already integrated in root layout via SearchProvider
// To trigger programmatically:
import { useSearch } from '@/components/search/SearchProvider';

const { openSearch } = useSearch();
<button onClick={openSearch}>Search</button>
```

### Search Page
**Route:** `/search`

Dedicated search results page with:
- Category filters
- Rich result cards
- Trending topics

---

## 4. Monetization Engine

### Affiliate Service
**Location:** `lib/monetization/affiliate-service.ts`

```typescript
import { affiliateService } from '@/lib/monetization/affiliate-service';

// Create trackable link
const link = await affiliateService.createLink({
    partnerId: 'uuid',
    name: 'Groww Signup',
    destinationUrl: 'https://groww.in/register'
});

// Get contextual links for a category
const links = await affiliateService.getContextualLinks('mutual-funds', 3);
```

### Trackable Redirect URLs
**Route:** `/go/[shortcode]`

When users click affiliate links:
1. System logs click with metadata (referrer, article source)
2. Redirects to destination URL
3. Stats visible in admin dashboard

**URL Format:**
- `/go/ABC123` - Direct redirect
- `/go/ABC123?article=uuid` - With article attribution

### Smart CTA Components
**Location:** `components/monetization/SmartCTA.tsx`

```tsx
import { SmartCTA, ApplyNowCTA } from '@/components/monetization';

// Manual CTA with tracking
<SmartCTA
    variant="gradient"
    href="https://partner.com"
    trackingId="ABC123"
    label="Apply Now"
    icon="arrow"
    isExternal
/>

// Preset CTA
<ApplyNowCTA 
    href="https://partner.com" 
    trackingId="ABC123" 
    product="Credit Card" 
/>
```

**Variants:** `primary`, `secondary`, `gradient`, `outline`, `premium`

### Contextual CTA
**Location:** `components/monetization/ContextualCTA.tsx`

Auto-fetches relevant affiliate links based on article category:

```tsx
<ContextualCTA 
    category="mutual-funds" 
    articleId={article.id}
    placement="end" // inline | sidebar | end
/>
```

### Affiliate Dashboard
**Route:** `/admin/affiliates`

Metrics displayed:
- Total clicks
- Conversions
- Revenue
- Conversion rate
- Top partners
- Top performing links

---

## 5. User Engagement

### Newsletter Service
**Location:** `lib/engagement/newsletter-service.ts`

```typescript
import { newsletterService } from '@/lib/engagement/newsletter-service';

// Subscribe (triggers verification email)
await newsletterService.subscribe({
    email: 'user@example.com',
    interests: ['mutual-funds', 'stocks'],
    frequency: 'weekly'
});

// Verify
await newsletterService.verify(token);
```

### Newsletter Widget
**Location:** `components/engagement/NewsletterWidget.tsx`

```tsx
import { NewsletterWidget } from '@/components/engagement';

// Premium card style
<NewsletterWidget variant="card" />

// Inline (for articles)
<NewsletterWidget variant="inline" />

// Top banner
<NewsletterWidget variant="banner" />

// Minimal form
<NewsletterWidget variant="minimal" />
```

### Bookmark System
**Location:** `lib/engagement/bookmark-service.ts`

```typescript
import { bookmarkService } from '@/lib/engagement/bookmark-service';

// Add bookmark
await bookmarkService.addBookmark(userId, articleId);

// Get user's bookmarks
const bookmarks = await bookmarkService.getUserBookmarks(userId);

// Track reading progress
await bookmarkService.updateProgress(userId, articleId, progress, readTime);
```

### Bookmark Button
**Location:** `components/engagement/BookmarkButton.tsx`

```tsx
import { BookmarkButton } from '@/components/engagement';

<BookmarkButton 
    articleId={article.id}
    variant="icon" // icon | button | text
    size="md" // sm | md | lg
/>
```

### Notification System
**Location:** `lib/engagement/notification-service.ts`

```typescript
import { notificationService } from '@/lib/engagement/notification-service';

// Create notification
await notificationService.createNotification({
    userId: 'uuid',
    type: 'new_article',
    title: 'New Article Published',
    message: 'Check out our latest guide...',
    link: '/articles/new-guide'
});
```

### Notification Bell
**Location:** `components/engagement/NotificationBell.tsx`

```tsx
import { NotificationBell } from '@/components/engagement';

// Add to navbar
<NotificationBell />
```

---

## 6. API Reference

### Search API
```
GET /api/search?q=query&limit=10&category=mutual-funds
GET /api/search?type=trending&limit=5
GET /api/search?type=related&articleId=uuid
GET /api/search?type=suggestions
```

### Analytics API
```
GET /api/admin/analytics?type=overview
GET /api/admin/analytics?type=article&articleId=uuid
GET /api/admin/analytics?type=seo&articleId=uuid
POST /api/admin/analytics { articleId, eventType }
```

### Affiliates API
```
GET /api/admin/affiliates?type=stats
GET /api/admin/affiliates?type=partners
GET /api/admin/affiliates?type=links
GET /api/admin/affiliates?type=contextual&category=mutual-funds
POST /api/admin/affiliates { action: 'create_link', partnerId, name, destinationUrl }
```

### Newsletter API
```
POST /api/newsletter { email, interests, frequency }
GET /api/newsletter?action=verify&token=xxx
GET /api/newsletter?action=count
DELETE /api/newsletter?email=xxx
```

### Bookmarks API
```
GET /api/bookmarks?articleId=uuid (check status)
GET /api/bookmarks?type=list
GET /api/bookmarks?type=stats
POST /api/bookmarks { articleId, notes }
DELETE /api/bookmarks { articleId }
```

### Notifications API
```
GET /api/notifications?limit=10
GET /api/notifications?countOnly=true
```

---

## 7. Database Schema

### Analytics Tables
- `article_views` - Page view events
- `article_analytics` - Aggregated metrics

### Monetization Tables
- `affiliate_partners` - Partner programs
- `affiliate_links` - Trackable short links
- `affiliate_clicks` - Click events

### Engagement Tables
- `newsletter_subscribers` - Email subscriptions
- `bookmarks` - Saved articles
- `reading_progress` - Read tracking
- `notifications` - User notifications
- `user_preferences` - Settings

**Migrations:**
- `supabase/migrations/20260101_analytics_schema.sql`
- `supabase/migrations/20260101_monetization_schema.sql`
- `supabase/migrations/20260101_engagement_schema.sql`

---

## 8. Component Library

### Engagement Components
```tsx
import { 
    NewsletterWidget, 
    BookmarkButton, 
    NotificationBell 
} from '@/components/engagement';
```

### Monetization Components
```tsx
import { 
    SmartCTA, 
    ApplyNowCTA, 
    AdSlot, 
    PromotionCard, 
    ComparisonWidget, 
    ContextualCTA 
} from '@/components/monetization';
```

### Search Components
```tsx
import CommandPalette from '@/components/search/CommandPalette';
import { SearchProvider, useSearch } from '@/components/search/SearchProvider';
import RelatedArticles from '@/components/articles/RelatedArticles';
```

### Admin Components
```tsx
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import SEOHealthWidget from '@/components/admin/SEOHealthWidget';
```

---

## Quick Start

### 1. Run Database Migrations
```bash
# Apply all migrations in order
supabase db push
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Admin Panel
Navigate to `/admin` to access:
- Content management
- Analytics dashboard
- SEO health checks
- Affiliate management

### 4. Test Search
Press `⌘K` (or `Ctrl+K`) anywhere to open the command palette.

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Site
NEXT_PUBLIC_URL=https://investingpro.in

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
```

---

*Last Updated: January 1, 2026*
