# InvestingPro CMS – Full Audit (All Three Deliverables)

Reference: `cms_redesign_prompt.md`. This document delivers: **(1) Navigation audit**, **(2) Page/feature inventory by section**, **(3) Prioritized next steps**.

---

## Part 1: Navigation Audit

### 1.1 Sitemap (Admin Routes Tree)

```
/admin                          → Dashboard (key metrics, system health, recent activity)
/admin/login                    → Auth (no sidebar)
/admin/signup                   → Auth (no sidebar)

CONTENT (Header Nav: Content)
├── /admin/articles             → Article list (filter, search, publish, delete)
│   ├── /admin/articles/new     → New article
│   ├── /admin/articles/[id]/edit
│   └── /admin/articles/[id]/edit-refactored   [not in nav]
├── /admin/pillar-pages         → Pillar list
│   ├── /admin/pillar-pages/new
│   └── /admin/pillar-pages/[id]/edit
├── /admin/authors
├── /admin/categories
├── /admin/tags
├── /admin/media                → Media library (upload, grid)
└── /admin/content-calendar     → Planning

PLANNING (same Header group)
└── (Dashboard, Content Calendar – see above)

AUTOMATION (Header Nav: Automation)
├── /admin/content-factory     → Bulk AI generation (progress, pause/resume)
├── /admin/automation           → Hub (links to factory, calendar, review-queue)
│   └── /admin/automation/batch [not in nav]
├── /admin/ai-personas
├── /admin/pipeline-monitor     → Pipeline runs, metrics, research tab
└── /admin/review-queue         → Articles in “review” status
    └── /admin/review-queue/[id] → Single review

PIPELINE (Header Nav: Pipeline)
├── /admin/cms                  → CMS Dashboard (health, budget, links to subpages)
├── /admin/cms/budget
├── /admin/cms/generation
├── /admin/cms/health
└── /admin/cms/scrapers

INSIGHTS (Header Nav: Insights)
├── /admin/analytics            → Content Analytics (AnalyticsDashboard)
├── /admin/metrics
├── /admin/seo                  → SEO Health
├── /admin/seo/experiments
└── /admin/seo/rankings         [not in nav – page exists]

MONETIZATION (Header Nav: Monetization)
├── /admin/revenue
│   └── /admin/revenue/intelligence   [not in nav]
├── /admin/products
│   ├── /admin/products/new
│   ├── /admin/products/[id]
│   └── /admin/products/analytics     [different from /admin/product-analytics]
├── /admin/product-analytics   → Nav item (standalone)
├── /admin/affiliates
└── /admin/ads

SYSTEM (Header Nav: System)
├── /admin/design-system
├── /admin/editorial-qa
├── /admin/email-dashboard
├── /admin/growth-dashboard
├── /admin/performance-dashboard
├── /admin/social-dashboard
└── /admin/scrapers             → System-level scrapers (nav links here)

SETTINGS (Header Nav: Settings)
├── /admin/settings
├── /admin/settings/vault
└── /admin/guide                → User Guide

ORPHAN ROUTES (exist but not in nav config / sidebar)
├── /admin/autonomy             → Autonomy dashboard (confidence, auto-publish, pending review)
├── /admin/autonomy/settings
├── /admin/data-accuracy        → Scraper run stats, accuracy
├── /admin/ops-health           → (ops-focused health)
├── /admin/pipeline             → Pipeline “health” (article stats by status, failure rate) – distinct from pipeline-monitor
├── /admin/strategy
├── /admin/users                → User list (empty API: returns [])
└── /admin/workflows            → Workflow list (Supabase workflows), new, [id]
```

### 1.2 Page Inventory (URL → Purpose → Component)

| URL | Purpose | In Nav? |
|-----|---------|--------|
| `/admin` | Dashboard: KPIs, system health, recent activity, social/trends | Yes (Planning) |
| `/admin/articles` | List articles, filter by status, new/edit/delete/publish | Yes |
| `/admin/articles/new` | Create article | In-page link |
| `/admin/articles/[id]/edit` | Edit article | In-page link |
| `/admin/articles/[id]/edit-refactored` | Alternate edit UI | No |
| `/admin/pillar-pages` | List pillar pages, new/edit | Yes |
| `/admin/pillar-pages/new` | Create pillar | In-page |
| `/admin/pillar-pages/[id]/edit` | Edit pillar | In-page |
| `/admin/authors` | Authors | Yes |
| `/admin/categories` | Categories | Yes |
| `/admin/tags` | Tags | Yes |
| `/admin/media` | Media library, upload, storage info | Yes |
| `/admin/content-calendar` | Content calendar | Yes |
| `/admin/content-factory` | Bulk AI article generation, progress | Yes |
| `/admin/automation` | Hub with links to factory, calendar, review-queue | Yes |
| `/admin/automation/batch` | Batch automation | No |
| `/admin/ai-personas` | AI personas | Yes |
| `/admin/pipeline-monitor` | Pipeline runs, metrics, research | Yes |
| `/admin/review-queue` | Review queue list | Yes |
| `/admin/review-queue/[id]` | Single review | In-page |
| `/admin/cms` | CMS dashboard (health, budget, sub-links) | Yes |
| `/admin/cms/budget` | Budget | Yes |
| `/admin/cms/generation` | Generation | Yes |
| `/admin/cms/health` | Health | Yes |
| `/admin/cms/scrapers` | CMS scrapers | Yes |
| `/admin/analytics` | Content analytics dashboard | Yes |
| `/admin/metrics` | Metrics | Yes |
| `/admin/seo` | SEO health | Yes |
| `/admin/seo/experiments` | Experiments | Yes |
| `/admin/seo/rankings` | SEO rankings | No (page exists) |
| `/admin/revenue` | Revenue dashboard | Yes |
| `/admin/revenue/intelligence` | Revenue intelligence | No |
| `/admin/products` | Product catalog, new/[id] | Yes |
| `/admin/products/analytics` | Product analytics (nested) | No (nav has /product-analytics) |
| `/admin/product-analytics` | Product analytics (standalone) | Yes |
| `/admin/affiliates` | Affiliates | Yes |
| `/admin/ads` | Ads | Yes |
| `/admin/design-system` | Design system | Yes |
| `/admin/editorial-qa` | Editorial QA | Yes |
| `/admin/email-dashboard` | Email dashboard | Yes |
| `/admin/growth-dashboard` | Growth dashboard | Yes |
| `/admin/performance-dashboard` | Performance dashboard | Yes |
| `/admin/social-dashboard` | Social dashboard | Yes |
| `/admin/scrapers` | System scrapers | Yes |
| `/admin/settings` | General settings | Yes |
| `/admin/settings/vault` | Secure vault | Yes |
| `/admin/guide` | User guide | Yes |
| `/admin/autonomy` | Autonomy dashboard | No |
| `/admin/autonomy/settings` | Autonomy settings | No |
| `/admin/data-accuracy` | Data accuracy / scraper stats | No |
| `/admin/ops-health` | Ops health | No |
| `/admin/pipeline` | Pipeline health (article stats) | No |
| `/admin/strategy` | Strategy | No |
| `/admin/users` | User management (empty data) | No |
| `/admin/workflows` | Workflows CRUD, enable/disable | No |
| `/admin/workflows/new` | New workflow | No |
| `/admin/workflows/[id]` | Edit workflow | No |
| `/admin/login` | Login | Auth |
| `/admin/signup` | Signup | Auth |

### 1.3 Nav Config vs Routes

- **Linked and exist:** All sidebar items point to existing `page.tsx` routes.
- **Broken / wrong:** None; all nav hrefs resolve.
- **Missing from nav (orphans):**  
  `autonomy`, `autonomy/settings`, `data-accuracy`, `ops-health`, `pipeline`, `strategy`, `users`, `workflows` (and `workflows/new`, `workflows/[id]`), `revenue/intelligence`, `seo/rankings`, `articles/[id]/edit-refactored`, `automation/batch`, `products/analytics` (nav has `product-analytics` only).

### 1.4 User Flows (Key Tasks)

- **Create & publish article**  
  Header Content → Sidebar Articles → “New article” → `/admin/articles/new` → save → redirect to edit; from list, Publish or Edit. Flow is clear; version control/scheduling not evident in UI.

- **Run content pipeline (bulk generate)**  
  Header Automation → Content Factory → set count/phase → Start → stream progress. Links from Dashboard (“Start content run”) and Automation hub. Pipeline failures visible on dashboard; deep run history in Pipeline Monitor.

- **Approve/reject in review queue**  
  Header Automation → Review Queue → click article → `/admin/review-queue/[id]` → Approve/Reject with notes. Flow works; approval updates status and returns to list.

- **Manage products (monetization)**  
  Header Monetization → Product Catalog → New product / click row → `/admin/products/new` or `/admin/products/[id]`. Product analytics linked as separate nav item (`/admin/product-analytics`).

- **Check pipeline/system health**  
  Dashboard shows data-source status and pipeline failures; Pipeline → CMS Dashboard shows health/budget and links to Health, Scrapers, Generation, Budget. `/admin/pipeline` (orphan) is article-stats “pipeline health”; `/admin/pipeline-monitor` is run-level monitoring.

### 1.5 Navigation Pain Points

- **Orphan pages:** Autonomy, Data Accuracy, Ops Health, Pipeline (health), Strategy, Users, Workflows and Revenue Intelligence are reachable only by URL or in-page links, not from Header/Sidebar.
- **Duplicate/overlap:** “Pipeline” vs “Pipeline Monitor” vs “CMS Dashboard”; “Product analytics” as `/admin/product-analytics` vs `/admin/products/analytics`.
- **SEO:** “SEO Rankings” exists but is not in Insights nav (only SEO Health + Experiments).
- **Users:** Page exists but no nav; user management not discoverable.

---

## Part 2: Page/Feature Inventory by Section

*(Per prompt: primary use case, what exists, what prompt asks for, gap.)*

### Content

| Feature | Exists (current) | Prompt asks | Gap |
|--------|-------------------|-------------|-----|
| **Articles** | List, new, edit (and edit-refactored), publish, delete, filter by status; link to Content Factory | Creation, editing, publishing, version control, scheduling | No version history UI; no explicit scheduling in list/edit; edit-refactored not in nav. |
| **Pillar Pages** | List, new, edit | Special content types, templates, SEO | Templates/SEO for pillars not clearly surfaced. |
| **Authors** | Page exists | User management, permissions, profile | Likely list only; permissions/profile management unclear. |
| **Categories** | Page exists | Taxonomy, hierarchies, assignment | Depth of hierarchy/assignment UI not verified. |
| **Tags** | Page exists | Tag management, auto-tagging, tag clouds | Auto-tagging and tag clouds not verified. |
| **Media Library** | Upload, library, storage info; stats placeholders (-- ) | Upload, organization, search, CDN, image optimization | Search/organization/CDN/optimization not verified; stats not wired. |

### Planning

| Feature | Exists | Prompt asks | Gap |
|--------|--------|-------------|-----|
| **Dashboard** | KPIs, system health, data sources, pipeline summary, recent activity, social/trends, revenue placeholder | Metrics, real-time vs historical, customization | No widget customization; time range limited; revenue “connect analytics” placeholder. |
| **Content Calendar** | Page exists | Scheduling, calendar views, drag-and-drop, recurring | Calendar view and drag-and-drop not verified. |

### Automation

| Feature | Exists | Prompt asks | Gap |
|--------|--------|-------------|-----|
| **Content Factory** | Bulk generate, count/phase, stream progress, pause/resume | Automated generation, AI, templates | Templates/phase config could be clearer. |
| **Automation Hub** | Links to factory, calendar, review-queue | Workflow automation, triggers, actions | Hub is link list; no workflow builder. |
| **AI Personas** | Page exists | Writing styles, tone config | Not verified. |
| **Pipeline Monitor** | Runs list, metrics, research tab; polling | Real-time monitoring, error tracking | Good fit; error detail could be deeper. |
| **Review Queue** | List review-status articles, detail page approve/reject with notes | Content approval, moderation | Fits; bulk actions could help. |
| **Workflows** | Full CRUD, enable/disable, new/[id] (Supabase) | — | Exists but **not in nav**; conceptual overlap with “Automation Hub”. |

### Pipeline (CMS)

| Feature | Exists | Prompt asks | Gap |
|--------|--------|-------------|-----|
| **CMS Dashboard** | Health, budget, links to Budget/Generation/Health/Scrapers | System health, performance | Good. |
| **Budget** | API-driven | — | Exists. |
| **Generation** | Page exists | — | Exists. |
| **Health** | Page exists | — | Exists. |
| **Scrapers (CMS)** | Page exists | — | Exists. |
| **Pipeline (health)** | `/admin/pipeline` – article stats by status, failure rate | — | Orphan; overlaps naming with Pipeline Monitor/CMS. |

### Insights

| Feature | Exists | Prompt asks | Gap |
|--------|--------|-------------|-----|
| **Analytics** | Content analytics dashboard, auto-refresh | Traffic, engagement, reports | Good entry. |
| **Metrics** | Page exists | — | Exists. |
| **SEO Health** | Page exists | — | Exists. |
| **Experiments** | Page exists | — | Exists. |
| **SEO Rankings** | Page exists | — | **Not in nav.** |

### Monetization

| Feature | Exists | Prompt asks | Gap |
|--------|--------|-------------|-----|
| **Revenue** | Dashboard | — | Exists; Revenue Intelligence subpage is orphan. |
| **Product Catalog** | List, new, [id] | — | Exists. |
| **Product Analytics** | Standalone `/admin/product-analytics`; also `/admin/products/analytics` | — | Two routes; nav points to one. |
| **Affiliates** | Page exists | — | Exists. |
| **Ads** | Page exists | — | Exists. |

### System

| Feature | Exists | Prompt asks | Gap |
|--------|--------|-------------|-----|
| **Design System** | Page exists | — | Exists. |
| **Editorial QA** | Page exists | — | Exists. |
| **Email / Growth / Performance / Social** | Dashboards exist | — | Exist. |
| **Scrapers** | System-level scrapers page | — | Exists (distinct from CMS scrapers). |
| **Autonomy** | Dashboard + settings (confidence, auto-publish, pending review) | — | **Not in nav.** |
| **Data Accuracy** | Scraper run stats | — | **Not in nav.** |
| **Ops Health** | Page exists | — | **Not in nav.** |
| **Users** | List UI; API returns [] | User management, permissions | **Not in nav;** no real data source yet. |

### Settings

| Feature | Exists | Prompt asks | Gap |
|--------|--------|-------------|-----|
| **General** | `/admin/settings` | — | Exists. |
| **Secure Vault** | `/admin/settings/vault` | — | Exists. |
| **User Guide** | `/admin/guide` | — | Exists. |

---

## Part 3: Prioritized Next Steps

Ordered by impact and dependency (aligns with prompt and current state).

1. **Bring orphan routes into navigation (or deprecate)**  
   - Add to nav or a “More” area: **Workflows** (under Automation), **Autonomy** (+ settings), **Users**, **SEO Rankings** (under Insights), **Revenue Intelligence** (under Monetization).  
   - Decide and then either: add **Data Accuracy**, **Ops Health**, **Pipeline** (article health) to System or merge into existing pipeline/CMS pages; or remove/deprecate if redundant.  
   - Resolve **Product Analytics** duality: one canonical route and nav item; redirect or remove the other.

2. **Fix dashboard metrics and alerts**  
   - Replace placeholders (e.g. Media “--”, revenue “connect analytics”) with real data or clear “Connect X” actions.  
   - Make system health alert actionable (e.g. “View details” → pipeline/scraper health or error list).  
   - Add time-range selector and, if possible, simple sparklines or trend on KPI cards (per prompt).

3. **Content: articles and media**  
   - Add scheduling (publish date/time) to article create/edit if not present.  
   - Optionally expose version history (or “Revisions”) for articles.  
   - Wire Media Library stats (total files, storage, counts) to real data or hide/repurpose placeholders.

4. **Review queue and automation**  
   - Add bulk approve/reject (or “Select all in filter”) where it makes sense.  
   - Link Automation Hub to **Workflows** so workflow automation is discoverable; consider renaming for clarity (e.g. “Automation Hub” = quick links, “Workflows” = configure automations).

5. **Users and permissions**  
   - Connect Users page to a real source (e.g. Supabase auth or admin API).  
   - Introduce at least role labels (admin/editor/author) and document path to RBAC (per prompt).

6. **Information architecture and naming**  
   - Clarify “Pipeline” vs “Pipeline Monitor” vs “CMS Dashboard” in nav labels or tooltips.  
   - Consider grouping Autonomy, Data Accuracy, Ops Health under “Operations” or under System.

7. **UI/UX and design system**  
   - Apply admin-pro theme consistently to all admin pages (tables, cards, forms).  
   - Ensure alerts (dashboard, pipeline) use a single severity/pattern (critical/warning/info).  
   - Add breadcrumbs to every admin page if not already present.

8. **Documentation and help**  
   - Add contextual help or links from key screens (Dashboard, Content Factory, Review Queue) to User Guide or specific docs.  
   - Optional: command palette (e.g. “Go to Articles”, “Run generation”) for power users.

---

## Summary

- **Part 1:** Sitemap and page inventory are complete; all nav links work; ~12+ orphan or sub-routes exist. User flows for create article, run pipeline, review queue, and products are clear; gaps are versioning, scheduling, and discoverability of orphans.  
- **Part 2:** Content, Planning, Automation, Pipeline, Insights, Monetization, System, and Settings are inventoried; gaps are called out (versions, scheduling, media stats, nav for orphans, Users data source, Product Analytics duality).  
- **Part 3:** Top priorities are (1) nav for orphans and Product Analytics cleanup, (2) dashboard metrics and alerts, (3) content/media improvements, (4) review queue and automation discoverability, (5) users and permissions, then IA, UI consistency, and help.

This audit can be used as the single reference for the next sprint of CMS work aligned with `cms_redesign_prompt.md`.
