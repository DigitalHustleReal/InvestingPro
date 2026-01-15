# REVENUE DASHBOARD SPECIFICATION
**Date:** January 22, 2026  
**Objective:** Real-time revenue visibility for monetization optimization  
**Principle:** Revenue = truth. All decisions based on revenue data.

---

## DASHBOARD REQUIREMENTS

### Primary Metrics (Above Fold)

1. **Total Revenue**
   - Current month revenue
   - Previous month revenue
   - Growth percentage
   - Trend chart (last 30 days)

2. **Revenue by Category** (PRIMARY METRIC)
   - Credit Cards revenue
   - Mutual Funds revenue
   - Insurance revenue
   - Others revenue
   - Pie chart visualization

3. **Conversion Rates**
   - Overall conversion rate
   - Credit Cards conversion rate
   - Mutual Funds conversion rate
   - Trend over time

---

### Secondary Metrics (Below Fold)

4. **Top Converting Articles**
   - Article title
   - Revenue generated
   - Conversions
   - Conversion rate
   - Category (Credit Cards/Mutual Funds)

5. **Top Affiliate Partners**
   - Partner name
   - Revenue generated
   - Conversions
   - Commission rate
   - Category

6. **Revenue Trends**
   - Daily revenue (last 30 days)
   - Weekly revenue (last 12 weeks)
   - Monthly revenue (last 12 months)
   - Category breakdown

---

## API ENDPOINTS

### 1. Overall Revenue Dashboard
```
GET /api/v1/admin/revenue/dashboard
```

**Response:**
```typescript
{
  totalRevenue: {
    current: number;
    previous: number;
    growth: number; // percentage
  };
  revenueByCategory: {
    creditCards: number;
    mutualFunds: number;
    insurance: number;
    others: number;
  };
  conversionRates: {
    overall: number;
    creditCards: number;
    mutualFunds: number;
  };
  trends: {
    daily: Array<{ date: string; revenue: number }>;
    weekly: Array<{ week: string; revenue: number }>;
    monthly: Array<{ month: string; revenue: number }>;
  };
}
```

---

### 2. Revenue by Category
```
GET /api/v1/admin/revenue/by-category?category=credit-cards&startDate=2026-01-01&endDate=2026-01-31
```

**Response:**
```typescript
{
  category: string;
  revenue: number;
  conversions: number;
  conversionRate: number;
  topArticles: Array<{
    articleId: string;
    articleTitle: string;
    revenue: number;
    conversions: number;
  }>;
  topAffiliates: Array<{
    affiliateId: string;
    affiliateName: string;
    revenue: number;
    conversions: number;
  }>;
}
```

---

### 3. Revenue by Article
```
GET /api/v1/admin/revenue/by-article?articleId=xxx&startDate=2026-01-01&endDate=2026-01-31
```

**Response:**
```typescript
{
  articleId: string;
  articleTitle: string;
  revenue: number;
  conversions: number;
  conversionRate: number;
  clicks: number;
  affiliateBreakdown: Array<{
    affiliateId: string;
    affiliateName: string;
    revenue: number;
    conversions: number;
  }>;
}
```

---

### 4. Revenue by Affiliate Partner
```
GET /api/v1/admin/revenue/by-affiliate?affiliateId=xxx&startDate=2026-01-01&endDate=2026-01-31
```

**Response:**
```typescript
{
  affiliateId: string;
  affiliateName: string;
  revenue: number;
  conversions: number;
  conversionRate: number;
  commissionRate: number;
  categoryBreakdown: {
    creditCards: number;
    mutualFunds: number;
    insurance: number;
  };
  topArticles: Array<{
    articleId: string;
    articleTitle: string;
    revenue: number;
  }>;
}
```

---

## DATA SOURCES

### Revenue Data
- **Table:** `affiliate_clicks`
- **Fields:** `commission_earned`, `converted`, `product_type`, `article_id`
- **Calculation:** Sum of `commission_earned` where `converted = true`

### Conversion Data
- **Table:** `affiliate_clicks`
- **Fields:** `converted`, `product_type`, `article_id`
- **Calculation:** Count where `converted = true` / Total clicks

### Article Data
- **Table:** `articles`
- **Join:** `affiliate_clicks.article_id = articles.id`

### Affiliate Partner Data
- **Table:** `affiliate_products`
- **Join:** `affiliate_clicks.product_id = affiliate_products.id`

---

## IMPLEMENTATION PLAN

### Phase 1: Basic Dashboard (Week 1)
- [ ] Create API endpoints
- [ ] Create dashboard UI
- [ ] Display total revenue
- [ ] Display revenue by category

### Phase 2: Advanced Metrics (Week 2)
- [ ] Add top converting articles
- [ ] Add top affiliate partners
- [ ] Add conversion rates
- [ ] Add trend charts

### Phase 3: Optimization (Week 3)
- [ ] Add filters (date range, category)
- [ ] Add export functionality
- [ ] Add alerts (revenue drop, low conversion)
- [ ] Add recommendations (optimize low performers)

---

## SUCCESS CRITERIA

- ✅ Real-time revenue visibility
- ✅ Revenue by category (Credit Cards vs Mutual Funds)
- ✅ Content-to-revenue mapping
- ✅ Affiliate performance tracking
- ✅ Data-driven optimization

---

**Status:** Ready to implement  
**Priority:** CRITICAL (Week 1)  
**Owner:** Engineering + Product
