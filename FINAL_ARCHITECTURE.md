# CMS Architecture - Final Implementation

## UNIFIED CONTENT CONTRACT

```typescript
Article {
  id: string
  title: string
  slug: string                    // UNIQUE, stable, never changes after first save
  status: 'draft' | 'review' | 'published' | 'archived'
  body_markdown: string          // PRIMARY - source of truth
  body_html: string              // DERIVED - always generated from markdown
  content: string                // LEGACY - fallback only, deprecated
  excerpt?: string
  published_at?: string          // ISO timestamp - set on publish
  published_date?: string        // Date string (YYYY-MM-DD) - set on publish
  created_at: string
  updated_at: string
}
```

## DATA FLOW

### Load → Edit → Save → Publish

1. **LOAD** (Edit Page):
   - Fetch article by ID: `api.entities.Article.getById(id)`
   - Extract: `body_markdown` (PRIMARY) or `content` (fallback)
   - Normalize to HTML: `normalizeArticleBody(body_markdown)`
   - Set in TipTap editor: `editor.commands.setContent(normalizedHTML)`

2. **EDIT** (TipTap):
   - User edits in editor (HTML format internally)
   - On change: Extract HTML → Normalize → Convert to Markdown
   - Update state: `setBodyMarkdown(markdown)`, `setBodyHtml(html)`

3. **SAVE**:
   - Send to API: `{ body_markdown, body_html, ... }`
   - API normalizes and stores both
   - Optimistic update: Update React Query cache immediately
   - Invalidate: `['article', id]`, `['articles', 'admin']`
   - Refresh: `router.refresh()`

4. **PUBLISH**:
   - Set `status: 'published'`
   - Set `published_at: now()` (CRITICAL for public visibility)
   - Set `published_date: today()`
   - Revalidate public routes: `/articles/${slug}`, `/category/${category}`, `/articles`
   - Invalidate public queries: `['articles', 'public']`, `['articles', 'category']`

## TIPTAP EDITOR CONFIGURATION

**Extensions** (NO DUPLICATES):
- StarterKit (includes: headings, paragraphs, lists, bold, italic, links, blockquote, code, hardBreak)
- Table (with TableRow, TableHeader, TableCell)
- SemanticImage (custom)

**Initialization**:
- Key: `editor-${contentHash}` - forces re-init when content changes
- Content: Empty initially, set in useEffect after mount
- Prevents hydration mismatch

**Content Loading**:
- Memoized content source (prevents re-normalization)
- Only updates if content hash changed
- Prevents infinite loops

## CACHE STRATEGY

**Query Keys**:
- `['article', id]` - Single article
- `['articles', 'admin']` - Admin list (unified with dashboard)
- `['articles', 'public']` - Public listing
- `['articles', 'category', slug]` - Category listing

**Invalidation**:
- On save: Invalidate `['article', id]`, `['articles', 'admin']`
- On publish: Also invalidate `['articles', 'public']`, `['articles', 'category']`
- Optimistic updates: Update cache immediately, then confirm with server

## ROUTING

**Admin Routes**:
- `/admin/articles` - List (all statuses)
- `/admin/articles/[id]/edit` - Edit (by ID)
- `/preview/[id]` - Preview (by ID, any status)

**Public Routes**:
- `/articles` - Listing (published only)
- `/articles/[slug]` - Detail (published only, by slug)
- `/category/[slug]` - Category listing (published only)

**Guards**:
- Public routes: `status='published' AND published_at IS NOT NULL`
- Preview: No status check (uses ID)
- Admin: No status check (uses ID)

## FIXES IMPLEMENTED

1. ✅ Editor content loading - Memoized, key-based re-init
2. ✅ Save/publish flow - Optimistic updates, proper invalidation
3. ✅ Cache strategy - Unified keys, targeted invalidation
4. ✅ Routing - Proper guards, stable slugs
5. ✅ Content contract - Single source of truth (body_markdown)
6. ✅ Revalidation - Public routes revalidated on publish


