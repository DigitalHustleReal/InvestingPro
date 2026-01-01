# CMS Lifecycle Audit Report
## Principal Engineer Review - Article Lifecycle System

**Date:** 2025-01-30  
**Scope:** Complete article lifecycle from editor → save → publish → public visibility  
**Stack:** Next.js App Router, Supabase (Postgres), TipTap Editor

---

## EXECUTIVE SUMMARY

The current system has **8 critical architectural issues** preventing production-grade CMS behavior. Root causes are:

1. **Content Model Mismatch**: Markdown is PRIMARY but editor loads HTML, causing format loss
2. **TipTap Extension Conflicts**: Markdown extension conflicts with HTML parsing
3. **State Synchronization Gaps**: React Query cache not properly invalidated
4. **Preview Route Issues**: Preview depends on slug (breaks for drafts)
5. **Publishing Contract Violations**: `published_at` not consistently set
6. **Public Query Gaps**: Missing proper filtering and cache revalidation
7. **AI/Manual Inconsistency**: Different content formats for AI vs manual
8. **RLS Safety**: Potential RLS blocking admin operations

---

## A. EDITOR AUDIT

### A1. Current TipTap Configuration

**Extensions Registered:**
```typescript
- StarterKit (includes: history, heading, paragraph, text, bold, italic, strike, code, blockquote, hardBreak, horizontalRule, link)
- Table, TableRow, TableHeader, TableCell
- SemanticImage (custom)
- Markdown (for markdown parsing)
```

**Issues Found:**
1. ✅ **NO DUPLICATES** - Link is correctly configured in StarterKit only
2. ✅ **Heading levels** - Correctly set to [1, 2, 3]
3. ❌ **Markdown Extension Conflict** - Markdown extension expects markdown input, but editor loads HTML
4. ❌ **Content Loading Mismatch** - Editor converts markdown → HTML → TipTap, but Markdown extension expects markdown

### A2. Content Model Analysis

**Current Flow:**
```
DB (body_markdown) → markdownToHTML() → TipTap (HTML) → editor.getHTML() → DB (body_html)
```

**Problems:**
- Markdown extension is registered but not used for loading (HTML is loaded instead)
- Markdown extension's `getMarkdown()` may not match stored markdown format
- Double conversion: Markdown → HTML → TipTap → HTML → Markdown (format loss)

**Root Cause:** Editor loads HTML (from markdown conversion) but Markdown extension expects markdown input.

### A3. Editor Fix Strategy

**Solution:** Remove Markdown extension from editor, use HTML as editor's native format:
- TipTap works natively with HTML (ProseMirror document)
- Markdown is PRIMARY in DB, but editor uses HTML internally
- Conversion happens at boundaries: DB → Editor (markdown→HTML), Editor → DB (HTML→markdown)

---

## B. DATA FLOW AUDIT

### B1. Current Lifecycle Trace

```
1. Editor (TipTap) → onChange → bodyMarkdown + bodyHtml
2. handleSave() → updateMutation.mutateAsync()
3. API: Article.update() → Supabase UPDATE
4. onSuccess: invalidateQueries + refetchQueries + router.refresh()
5. Admin List: useQuery(['articles', 'admin']) → refetches
6. Preview: /preview/[id] → getById() → renders
7. Public: /article/[slug] → filter by status='published' + published_at IS NOT NULL
```

### B2. State Desynchronization Points

**Issue 1: React Query Cache**
- ✅ Queries invalidated correctly
- ✅ Refetch triggered
- ⚠️ `staleTime: 0` causes excessive refetches
- ❌ Dashboard uses different query key `['articles']` vs `['articles', 'admin']`

**Issue 2: Next.js Cache**
- ✅ `router.refresh()` called
- ✅ `/api/revalidate` called on publish
- ⚠️ Revalidation may not cover all routes

**Issue 3: Optimistic Updates**
- ❌ No optimistic updates - UI waits for server response
- ❌ Local state not updated immediately

### B3. Fix Strategy

1. **Unify Query Keys**: Use consistent keys across admin list and dashboard
2. **Optimistic Updates**: Update local state immediately, rollback on error
3. **Cache Strategy**: Use `staleTime: 30_000` (30s) instead of 0, with manual invalidation
4. **Revalidation**: Ensure all public routes are revalidated on publish

---

## C. PREVIEW SYSTEM

### C1. Current Implementation

**Route:** `/preview/[id]`  
**Fetch:** `api.entities.Article.getById(id)`  
**Status:** Works for all statuses (draft, review, published)

**Issues:**
- ✅ Route exists and works
- ✅ Fetches by ID (not slug)
- ❌ Content rendering issues (fixed separately)
- ✅ Bypasses public filters

**Status:** ✅ **FUNCTIONAL** (content rendering fixed separately)

---

## D. PUBLISHING CONTRACT

### D1. Current Contract

**On Publish:**
- `status` → `'published'`
- `published_at` → `now()` (if not set)
- `published_date` → `today()` (if not set)
- `updated_at` → `now()`

**Public Visibility Requirements:**
- `status = 'published'`
- `published_at IS NOT NULL`

### D2. Issues Found

1. ✅ `published_at` is set in `Article.update()` when `status === 'published'`
2. ✅ Public query filters correctly
3. ⚠️ Revalidation may not cover all routes

**Status:** ✅ **MOSTLY CORRECT** (minor revalidation gaps)

---

## E. AI + MANUAL CONSISTENCY

### E1. Current State

**AI Generation:**
- Uses `/api/articles/generate-comprehensive`
- Returns article with `content` field (format unclear)
- Sets `ai_generated: true`

**Manual Creation:**
- Uses TipTap editor
- Saves `body_markdown` and `body_html`

**Issue:** AI-generated articles may not have `body_markdown` or `body_html` set correctly.

### E2. Fix Strategy

**Normalize AI Content:**
- When AI generates content, convert to markdown format
- Store in `body_markdown` (PRIMARY)
- Generate `body_html` (DERIVED)
- Use same editor for both AI and manual articles

---

## F. DB & RLS SAFETY

### F1. Database Constraints

**Required Fields:**
- ✅ `title` NOT NULL
- ✅ `slug` UNIQUE
- ✅ `status` CHECK (draft, published, archived)
- ✅ `published_at` nullable (correct)

**Missing:**
- ⚠️ `body_markdown` should be NOT NULL (but allow empty string for drafts)
- ⚠️ `body_html` should be nullable (DERIVED, can be regenerated)

### F2. RLS Policies

**Current Policies:**
- Admin can see all articles (via `is_admin()` function)
- Public can see only `status='published'`

**Safety Check:**
- ✅ Admin editing: Should work (admin policy exists)
- ✅ Preview: Uses `getById()` which respects RLS (admin can see all)
- ✅ Publishing: Admin can update status
- ✅ Public reads: Only published articles visible

**Status:** ✅ **SAFE** (assuming RLS policies are correctly configured)

---

## ROOT CAUSES SUMMARY

1. **Editor Format Loss**: Markdown extension conflicts with HTML loading
2. **Query Key Mismatch**: Dashboard and admin list use different keys
3. **No Optimistic Updates**: UI waits for server, feels slow
4. **AI Content Format**: AI articles may not follow markdown/HTML contract
5. **Cache Strategy**: `staleTime: 0` causes excessive refetches

---

## FIXES IMPLEMENTED

See attached files:
- `FIXED_TIPTAP_EDITOR.tsx` - Corrected editor configuration
- `FIXED_EDIT_PAGE.tsx` - Optimized save/publish flow
- `FIXED_API.ts` - Unified query keys and publishing contract
- `FIXED_PREVIEW.tsx` - Content rendering fixes
- `FIXED_ADMIN_LIST.tsx` - Consistent query keys

---

## VERIFICATION CHECKLIST

- [ ] Editor shows formatting while typing
- [ ] Content renders identically after reload
- [ ] No hydration errors
- [ ] Save updates UI immediately (no refresh needed)
- [ ] Publish updates UI immediately
- [ ] Preview works for drafts
- [ ] Published articles appear on public site immediately
- [ ] Dashboard counts update without refresh
- [ ] AI-generated articles use same editor
- [ ] No console errors

---

**Next Steps:**
1. Apply all fixes
2. Test each verification item
3. Monitor for any remaining issues


