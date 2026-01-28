# CMS UI/UX - Remaining Tasks

**Date:** 2026-01-XX  
**Status:** Audit Complete - Remaining Items Identified

---

## ✅ Completed (From Audit)

1. ✅ **Form validation with inline errors** - Done in article editor
2. ✅ **Auto-save and unsaved changes warning** - Done in article editor
3. ✅ **Keyboard navigation and shortcuts** - Done (Cmd+K, Cmd+?, Cmd+N, Cmd+S, Cmd+P)
4. ✅ **Responsive sidebar (mobile menu)** - Done in AdminLayout
5. ✅ **Aria-labels and screen reader support** - Partially done (AdminSidebar, buttons)
6. ✅ **User-friendly error messages** - Done with formatErrorForUI (partial - need to apply everywhere)
7. ✅ **Skeleton loaders** - Done for article editor (need for article list)
8. ✅ **Publish confirmation** - Done in article editor

---

## 🚧 High Priority Remaining

### 1. Skeleton Loaders for Article List ⚠️

**Status:** Not Done  
**Priority:** High  
**File:** `app/admin/articles/page.tsx`

**Issue:**
- Article list page shows spinner during loading
- Should show `ArticleCardSkeleton` instead

**Fix:**
```typescript
import { ArticleListSkeleton } from '@/components/loading/ArticleCardSkeleton';

{isLoading ? (
    <ArticleListSkeleton count={5} />
) : (
    <ArticleList articles={articles} />
)}
```

**Time:** 15 minutes

---

### 2. Global Error Boundary ⚠️

**Status:** Not Done  
**Priority:** High  
**File:** `components/ErrorBoundary.tsx` (needs to be created)

**Issue:**
- No global error boundary for unhandled React errors
- Errors could crash the entire CMS

**Fix:**
- Create ErrorBoundary component
- Wrap AdminLayout or root layout

**Time:** 30 minutes

---

### 3. Replace All Error Messages ⚠️

**Status:** Partial (Only article editor done)  
**Priority:** High  
**Files:** Multiple admin pages (17 files found with toast.error)

**Issue:**
- Many pages still show technical error messages
- Need `formatErrorForUI()` everywhere

**Files to Update:**
- `app/admin/articles/page.tsx`
- `app/admin/page.tsx`
- `app/admin/articles/new/page.tsx`
- `app/admin/content-calendar/page.tsx`
- `app/admin/tags/page.tsx`
- `app/admin/authors/page.tsx`
- `app/admin/products/page.tsx`
- `app/admin/categories/page.tsx`
- `app/admin/review-queue/page.tsx`
- `app/admin/automation/batch/page.tsx`
- And 7 more files...

**Fix:**
```typescript
import { formatErrorForUI } from '@/lib/errors/user-friendly-messages';

// Replace:
toast.error(error.message);

// With:
toast.error(formatErrorForUI(error));
```

**Time:** 1-2 hours (need to check each file)

---

### 4. Responsive Tables (Card View on Mobile) ⚠️

**Status:** Not Done  
**Priority:** High  
**Files:** Article list, product list, etc.

**Issue:**
- Tables don't work well on mobile
- Should show card view on small screens

**Fix:**
- Convert table rows to cards on mobile
- Use `hidden md:table` for table, `md:hidden` for cards

**Time:** 2-3 hours

---

### 5. FormField for Excerpt in Inspector ⚠️

**Status:** Not Done  
**Priority:** High  
**File:** `components/admin/ArticleInspector.tsx`

**Issue:**
- Excerpt field in inspector doesn't have validation
- Should use FormField component like title

**Fix:**
- Replace Textarea with FormField + Textarea
- Add character count (max 300)
- Add validation

**Time:** 15 minutes

---

## 🎯 Medium Priority Remaining

### 6. Functional Global Search Backend ⚠️

**Status:** UI Done, Backend Missing  
**Priority:** Medium  
**File:** `app/api/search/route.ts` (needs to be created)

**Issue:**
- Global search UI (Cmd+K) exists but shows mock results
- Needs real search API endpoint

**Fix:**
- Create search API route
- Implement full-text search (Supabase Postgres)
- Search articles, products, categories

**Time:** 2-3 hours

---

### 7. Breadcrumbs on All Pages ⚠️

**Status:** Partial (AdminBreadcrumb exists but not used)  
**Priority:** Medium  

**Issue:**
- AdminBreadcrumb component exists but usage is inconsistent
- Not all pages have breadcrumbs

**Fix:**
- Add breadcrumbs to all admin pages
- Consistent placement (top of content)

**Time:** 1 hour

---

### 8. Draft Recovery (localStorage Backup) ⚠️

**Status:** Auto-save exists, but no localStorage backup  
**Priority:** Medium  
**File:** `app/admin/articles/[id]/edit/page.tsx`

**Issue:**
- Auto-save works, but if browser crashes, no recovery
- Should backup to localStorage as fallback

**Fix:**
- Save to localStorage on each change
- Recover on page load if no article saved

**Time:** 30 minutes

---

### 9. Empty States on All List Views ⚠️

**Status:** EmptyState component exists, but not used consistently  
**Priority:** Medium  

**Issue:**
- Some pages show nothing when empty
- Should show EmptyState component

**Files:**
- Article list (if no articles)
- Product list
- Category list
- Tag list

**Time:** 1 hour

---

### 10. Word Count & Reading Time in Editor ⚠️

**Status:** Not Done  
**Priority:** Medium  
**File:** `components/admin/ArticleEditor.tsx` or editor page

**Issue:**
- No word count visible while editing
- No estimated reading time

**Fix:**
- Add word count display in editor toolbar or inspector
- Calculate reading time (average 200 words/minute)

**Time:** 30 minutes

---

## 📋 Low Priority Remaining

### 11. Tooltips on Toolbar Buttons ⚠️

**Status:** Not Done  
**Priority:** Low  
**File:** `components/admin/ArticleEditor.tsx`

**Fix:**
- Add tooltips to all editor toolbar buttons
- Show keyboard shortcuts in tooltips

**Time:** 30 minutes

---

### 12. Skip-to-Content Link ⚠️

**Status:** Not Done  
**Priority:** Low  

**Fix:**
- Add skip navigation link at top of page
- Visible on focus, hidden otherwise

**Time:** 15 minutes

---

### 13. Color Contrast Verification ⚠️

**Status:** Not Verified  
**Priority:** Low  

**Fix:**
- Run contrast checker (axe DevTools, WAVE)
- Ensure WCAG AA compliance (4.5:1)

**Time:** 1 hour (testing)

---

## 📊 Summary

### Status Breakdown

| Priority | Completed | Remaining | Total |
|----------|-----------|-----------|-------|
| **High** | 3 | 5 | 8 |
| **Medium** | 1 | 5 | 6 |
| **Low** | 0 | 3 | 3 |
| **Total** | 4 | 13 | 17 |

### Completion Rate

**Overall: ~24% of remaining items complete**  
**High Priority: ~38% complete (3/8)**  
**Medium Priority: ~17% complete (1/6)**  
**Low Priority: 0% complete (0/3)**

---

## 🎯 Recommended Next Steps

### Immediate (This Week)
1. **Add skeleton loaders to article list** (15 min)
2. **Create global error boundary** (30 min)
3. **Replace error messages in article list page** (15 min)
4. **Add FormField to excerpt in inspector** (15 min)

**Total: ~1.5 hours**

### Short-term (Next Week)
5. **Replace all error messages** (1-2 hours)
6. **Make tables responsive** (2-3 hours)
7. **Add empty states** (1 hour)

**Total: ~4-6 hours**

### Medium-term (Next Sprint)
8. **Implement global search backend** (2-3 hours)
9. **Add breadcrumbs** (1 hour)
10. **Draft recovery with localStorage** (30 min)

**Total: ~3.5-4.5 hours**

---

## 💡 Quick Wins (Under 30 min each)

1. ✅ Skeleton loader for article list (15 min)
2. ✅ FormField for excerpt (15 min)
3. ✅ Error messages in article list (15 min)
4. ✅ Skip-to-content link (15 min)
5. ✅ Word count in editor (30 min)

**Total Quick Wins: ~1.5 hours**

---

**Last Updated:** 2026-01-XX
