# Frontend Decoupling Audit Report

**Date:** January 15, 2026  
**Status:** In Progress

---

## 📊 Summary

**Total Components Audited:** 11  
**Components Using Direct Supabase:** 11  
**Components Migrated:** 0  
**Migration Progress:** 0%

---

## 🔍 Components Requiring Migration

### 1. Admin Components (6)

#### `components/admin/CategorySelect.tsx`
- **Usage:** Fetches categories, creates new categories
- **Supabase Calls:**
  - `supabase.from('categories').select('*')`
  - `supabase.from('categories').insert(...)`
- **Migration:** Create `/api/admin/categories` endpoint
- **Priority:** HIGH

#### `components/admin/TagInput.tsx`
- **Usage:** Fetches tags, creates new tags
- **Supabase Calls:**
  - `supabase.from('tags').select('*')`
  - `supabase.from('tags').insert(...)`
- **Migration:** Create `/api/admin/tags` endpoint
- **Priority:** HIGH

#### `components/admin/GlobalSearch.tsx`
- **Usage:** Global search across articles, products
- **Supabase Calls:** Multiple queries
- **Migration:** Use `/api/search` endpoint
- **Priority:** MEDIUM

#### `components/admin/StockImageSearch.tsx`
- **Usage:** Search stock images
- **Supabase Calls:** Image search queries
- **Migration:** Create `/api/admin/images/search` endpoint
- **Priority:** LOW

#### `components/admin/MediaLibraryPicker.tsx`
- **Usage:** Media library management
- **Supabase Calls:** Multiple media queries
- **Migration:** Create `/api/admin/media` endpoints
- **Priority:** MEDIUM

#### `components/admin/OneClickArticleGenerator.tsx`
- **Usage:** Article generation
- **Supabase Calls:** Article creation
- **Migration:** Use `/api/articles/generate` endpoint
- **Priority:** HIGH

### 2. Engagement Components (3)

#### `components/engagement/LeadMagnet.tsx`
- **Usage:** Lead capture
- **Supabase Calls:** Newsletter subscription
- **Migration:** Use `/api/newsletter` endpoint
- **Priority:** HIGH

#### `components/engagement/ContextualLeadMagnet.tsx`
- **Usage:** Contextual lead capture
- **Supabase Calls:** Newsletter subscription
- **Migration:** Use `/api/newsletter` endpoint
- **Priority:** HIGH

#### `components/engagement/LeadMagnetPopup.tsx`
- **Usage:** Popup lead capture
- **Supabase Calls:** Newsletter subscription
- **Migration:** Use `/api/newsletter` endpoint
- **Priority:** HIGH

### 3. Review Components (1)

#### `components/reviews/ProductReviews.tsx`
- **Usage:** Product reviews, auth check
- **Supabase Calls:**
  - `supabase.auth.getUser()`
  - Review queries (via `api.entities.reviews`)
- **Migration:** 
  - Use `/api/auth/me` for auth check
  - Use `/api/reviews` endpoints
- **Priority:** HIGH

### 4. Other Components (1)

#### `components/monetization/LeadMagnet.tsx`
- **Usage:** Lead capture
- **Supabase Calls:** Newsletter subscription
- **Migration:** Use `/api/newsletter` endpoint
- **Priority:** MEDIUM

---

## 🚀 Migration Priority

### High Priority (Must Migrate)
1. `components/admin/CategorySelect.tsx`
2. `components/admin/TagInput.tsx`
3. `components/admin/OneClickArticleGenerator.tsx`
4. `components/engagement/LeadMagnet.tsx`
5. `components/engagement/ContextualLeadMagnet.tsx`
6. `components/engagement/LeadMagnetPopup.tsx`
7. `components/reviews/ProductReviews.tsx`

### Medium Priority
8. `components/admin/GlobalSearch.tsx`
9. `components/admin/MediaLibraryPicker.tsx`
10. `components/monetization/LeadMagnet.tsx`

### Low Priority
11. `components/admin/StockImageSearch.tsx`

---

## 📋 Required API Endpoints

### To Be Created

1. **Categories API**
   - `GET /api/admin/categories` - List categories
   - `POST /api/admin/categories` - Create category

2. **Tags API**
   - `GET /api/admin/tags` - List tags
   - `POST /api/admin/tags` - Create tag

3. **Auth API**
   - `GET /api/auth/me` - Get current user

4. **Media API**
   - `GET /api/admin/media` - List media
   - `POST /api/admin/media` - Upload media
   - `GET /api/admin/media/search` - Search media

5. **Images API**
   - `GET /api/admin/images/search` - Search stock images

### Already Exists

- ✅ `/api/newsletter` - Newsletter subscription
- ✅ `/api/search` - Global search
- ✅ `/api/reviews` - Reviews (partial)

---

## 🎯 Migration Strategy

1. **Phase 1:** Create missing API endpoints
2. **Phase 2:** Migrate high-priority components
3. **Phase 3:** Migrate medium-priority components
4. **Phase 4:** Migrate low-priority components
5. **Phase 5:** Remove Supabase client from frontend

---

## ✅ Next Steps

1. Create missing API endpoints
2. Start migrating high-priority components
3. Test each migration thoroughly
4. Update documentation

---

**Last Updated:** January 15, 2026
