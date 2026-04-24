# Phase 3a — Canonical Flip Plan

> The next session's blueprint. Extracted from `app/articles/[slug]/page.tsx`
> analysis in the 2026-04-24 session. Follow this exactly to flip canonical
> direction without regressing article rendering.

---

## Goal

Make `/[category]/learn/[slug]` the canonical URL for categorized articles
(228 live articles) and have `/articles/[slug]` 301-redirect to the new URL
when a category mapping exists.

Prerequisite for Phase 4 (GSC + Bing sitemap submission).

---

## Current state (as of 2026-04-24)

| Route | Behavior |
|---|---|
| `/articles/[slug]` | ISR Server Component — full render (300+ lines of JSX) |
| `/[category]/learn/[slug]` | Validates cat match → 308 redirect to `/articles/[slug]` |

**Target state:**

| Route | Behavior |
|---|---|
| `/articles/[slug]` | If article has a mapped category → 301 to `/[cat]/learn/[slug]`; else render |
| `/[category]/learn/[slug]` | Full render (same visual output as today's `/articles/[slug]`) |

---

## Extraction map — what to move

`app/articles/[slug]/page.tsx` — relevant render regions to extract into a
shared Server Component `components/articles/FullArticleView.tsx`:

### Imports that must travel with the extraction
- `next/link`, `next/image`, `next/navigation` (`notFound`)
- `@/lib/supabase/service` (`createServiceClient`)
- `@/components/articles/ArticleRenderer` — body HTML renderer
- `@/components/articles/RelatedArticles` — suspense-wrapped
- `@/components/articles/AuthorBadge` — author display
- `@/components/articles/DeskByline` — desk assignment
- `@/components/articles/SidebarTableOfContents`
- `@/components/articles/SidebarCalculatorCTA`
- `@/components/articles/AISummaryBox`
- `@/components/articles/TableEnhancer` — client island
- `@/components/articles/LiveRateBadge` as `LiveRatesHydrator` — client island
- `@/components/articles/ArticleFeedback`
- `@/components/articles/ArticleSources`
- `@/components/articles/ArticleNewsletterInline`
- `@/components/articles/EmbeddedCalculator`
- `@/components/articles/ReadingProgressBar`
- `@/components/products/TopPicksSidebar`
- `@/components/common/AutoBreadcrumbs`
- `@/components/common/AdvertiserDisclosure`
- `@/lib/linking/canonical`
- `@/lib/linking/breadcrumbs`
- `@/lib/utils` (`formatSlug`)
- `./ArticleClientShell` — bookmark + share client island (COLOCATED! move to components/articles/ or reference via absolute path)
- `./article-content.css` — COLOCATED CSS (move to components/articles/ or keep absolute import)
- `lucide-react` icons (Calendar, Clock)

### Props the shared component needs
```ts
type FullArticleViewProps = {
  article: Article;              // full DB row
  canonicalUrl: string;          // varies by call site
  breadcrumbs: BreadcrumbItem[]; // varies
  isPreview: boolean;
};
```

### JSX body (lines ~209–412 of current page.tsx)
Everything inside the outer fragment `<>` that wraps:
- Structured data scripts (NewsArticle, Breadcrumb, FAQ)
- Preview banner
- `div.min-h-screen.bg-background.relative`
  - `AutoBreadcrumbs`
  - 12-col grid with `article` + `TopPicksSidebar`
  - Body content (meta, image, summary, AdvertiserDisclosure, ArticleRenderer, tags, related, prev/next)

---

## Execution sequence

### Step 1 — Extract (no behavior change)
1. Move the colocated `ArticleClientShell.tsx` and `article-content.css` to `components/articles/` (update any imports that reference `./ArticleClientShell` → `@/components/articles/ArticleClientShell`).
2. Create `components/articles/FullArticleView.tsx` — Server Component exporting default. Move JSX body from `app/articles/[slug]/page.tsx` into it.
3. Move helper functions used inside the body (schema builders, breadcrumb formatter) into the same file or a nearby helper.
4. Update `app/articles/[slug]/page.tsx` to call `<FullArticleView article={article} canonicalUrl={...} breadcrumbs={...} isPreview={isPreview} />`.
5. **Checkpoint: type-check + visit 3 article URLs in preview. Must render identically.**

### Step 2 — Wire nested route (behavior change: nested URL renders)
1. Replace `app/[category]/learn/[slug]/page.tsx` body:
   - Keep category + slug validation via `categoryMatches`
   - Fetch the article (same `getArticle` logic)
   - Build breadcrumbs with the new category path
   - Render `<FullArticleView />` with `canonicalUrl = /[cat]/learn/[slug]`
2. Remove the `permanentRedirect` call and `export const dynamic = "force-dynamic"`.
3. Add `export const revalidate = 3600` and `generateStaticParams` (top 100 articles by views, bound per-category).
4. **Checkpoint: visit `/taxes/learn/hra-exemption-...` directly — must render full article content, not redirect.**

### Step 3 — Flip `/articles/[slug]` (behavior change: flat URL redirects)
1. In `app/articles/[slug]/page.tsx`, BEFORE render, check `article.category`:
   ```ts
   const urlCat = dbCategoryToUrl(article.category);
   // Only redirect when the article has a specific category (not 'learn' default).
   // Articles without a real category stay at /articles/[slug].
   if (article.category && urlCat !== 'learn' && !isPreview) {
     permanentRedirect(`/${urlCat}/learn/${article.slug}`);
   }
   ```
2. Update canonical URL emitted in `generateMetadata`: if category is set, canonical = `/[cat]/learn/[slug]`, else `/articles/[slug]`.
3. **Checkpoint: hit `/articles/hra-exemption-...` → expect 308 to `/taxes/learn/hra-exemption-...`.**

### Step 4 — Update sitemap (SEO: emit new URLs only)
In `app/sitemap.ts`:
- For each article with `dbCategoryToUrl(article.category) !== 'learn'`, emit `baseUrl/[cat]/learn/[slug]`.
- For articles without a real category mapping, keep emitting `/articles/[slug]`.
- Do NOT emit both — that'd cause duplicate-content signal.

### Step 5 — Update internal linkers
- `lib/linking/engine.ts` — auto-link generator should prefer nested URL format.
- `components/layout/Footer.tsx` — article links in columns (currently `/articles/[slug]` in some cells) should use nested.
- Any `<Link href="/articles/${slug}">` in shared components (like `RelatedArticles`) — replace with a helper `articleUrl(article)` that returns the canonical nested URL.

### Step 6 — Submit sitemap (manual, tracked)
Once all above ship + deploy is verified, move `docs/MANUAL_ACTIONS_TRACKER.md` Phase 4 items (GSC + Bing) from blocked to ready.

---

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Break article render during extraction | Step 1 is behavior-preserving — only JSX move, no logic change. Visit 3 live article URLs between each commit. |
| Infinite redirect loop (`/articles/X` → `/taxes/learn/X` → back) | The nested route's category validation means it'll only serve articles where DB category matches URL category. Step 3's redirect goes FROM flat TO nested; the nested route doesn't redirect back. Verify with curl manual-mode. |
| Preview mode in admin breaks after redirect | Skip the redirect when `isPreview` (line ~1 of the check in Step 3). |
| Images / client islands fail to hydrate inside shell | Server Components can render Client Components as children; just ensure they're imported in the shell file and wrapped in `<Suspense>` where relevant. |
| Stale sitemap + old internal links keep sending users to `/articles/[slug]` | Step 3's 308 catches everything. Internal link updates (Step 5) reduce redirect count for in-product navigation. |

---

## Commit split (for reviewability)

1. `refactor(articles): extract FullArticleView shared Server Component` — Steps 1–2 of §extraction-map (pure refactor)
2. `feat(phase3a): /[cat]/learn/[slug] renders article content` — Step 2 of execution (behavior change: nested URL works)
3. `feat(phase3a): /articles/[slug] -> /[cat]/learn/[slug] 308` — Step 3 (canonical flip)
4. `feat(phase3a): emit nested article URLs from sitemap` — Step 4
5. `refactor(linking): internal article links prefer nested URLs` — Step 5

Each commit verified by:
- type-check (pre-commit hook)
- visit 3 article URLs in preview (covering categorized + cross-cutting)
- curl the redirect chain (manual mode) — max 1 hop

---

## Definition of done

- [ ] `/taxes/learn/hra-exemption-...` → 200, renders full article
- [ ] `/articles/hra-exemption-...` → 308 → `/taxes/learn/hra-exemption-...`
- [ ] Canonical `<link rel="canonical">` points to nested URL
- [ ] Sitemap emits nested URLs only (verified via `curl /sitemap.xml | grep /articles/ | wc -l` ≈ 0 for categorized)
- [ ] No hydration errors in dev console on any article
- [ ] 3 sample articles spot-checked visually (tax, investing, banking)
- [ ] `docs/MANUAL_ACTIONS_TRACKER.md` Phase 4 items unblocked (user can submit to GSC)

Estimated effort: **4–6 hours of focused work**, split across the 5 commits above.
