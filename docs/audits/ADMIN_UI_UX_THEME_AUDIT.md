# InvestingPro Admin UI/UX Theme Audit

**Date:** 2026-01-31  
**Scope:** All admin routes (`/admin/*`) and `components/admin/*`  
**Intended theme:** **Wealth & Trust** (navy, gold, cream/white, green success, orange warning, red danger)

---

## 1. Intended Design System (Wealth & Trust)

| Token | Use | Hex/Value |
|-------|-----|-----------|
| **Background** | Page background | `wt-bg` #F9F9F9 |
| **Surface** | Cards, panels, inputs | `wt-surface` #FFFFFF |
| **Surface hover** | Row/list hover | `wt-surface-hover` #EEEEEE |
| **Card** | Secondary panels | `wt-card` #F5F5F5 |
| **Border** | Default borders | `wt-border` #DDDDDD |
| **Border light** | Subtle dividers | `wt-border-light` #E8E8E8 |
| **Text** | Primary text | `wt-text` #1A1A1A |
| **Text muted** | Secondary text | `wt-text-muted` #555555 |
| **Text dim** | Tertiary / hints | `wt-text-dim` #777777 |
| **Nav (header)** | Top bar, primary nav bg | `wt-nav` #1F3B5C |
| **Gold** | Primary actions, active states | `wt-gold` #D4AF37 |
| **Gold hover** | Primary button hover | `wt-gold-hover` #B8A028 |
| **Gold subtle** | Active tab/sidebar bg | `wt-gold-subtle` rgba(212,175,55,0.15) |
| **Green** | Success, positive | `wt-green` #2E7D32 |
| **Green subtle** | Success badges | `wt-green-subtle` |
| **Orange** | Warning | `wt-orange` #FF6B35 |
| **Orange subtle** | Warning badges | `wt-orange-subtle` |
| **Danger** | Error, delete | `wt-danger` #DC2626 |
| **Danger subtle** | Danger badges | `wt-danger-subtle` |

**Shell:** Admin shell uses class `admin-wt-app` (from `AdminShell` / `AdminLayout`). Global overrides in `app/globals.css` target `.admin-wt-app` for cards, tables, inputs (light theme).

---

## 2. Inconsistencies Found

### 2.1 Theme token mix (critical)

- **Semantic tokens (site-wide)** used inside admin instead of `wt-*`:
  - `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `bg-muted`, `bg-background`  
  - These follow the **public site** theme (light/dark) and can look wrong or flash when admin forces `[color-scheme:light]`.
- **Raw palettes** used in admin components instead of `wt-*`:
  - **Slate:** `text-slate-900`, `text-slate-600`, `bg-slate-50`, `border-slate-200`, etc. in many components (EnhancedAnalyticsDashboard, ExperimentDashboard, ReviewInterface, RevenuePredictionCard, EnhancedWordPressStyleCMS, ContentCalendarWidget loading state, and 30+ others).
  - **Teal (legacy):** `text-teal-600`, `hover:text-teal-700` in `app/admin/products/[id]/page.tsx`, `app/admin/pillar-pages/[id]/edit/page.tsx`.
- **Primary/secondary/danger (numeric)** used instead of Wealth & Trust:
  - `bg-primary-500`, `bg-primary-600`, `hover:bg-primary-700`, `text-primary-400`, `bg-danger-500`, `bg-secondary-600`, etc. in AutomationControls, BulkGenerationPanel, BudgetGovernorPanel, DarkThemeCMS, EnhancedWordPressStyleCMS, ScraperDashboard, WorkflowBuilder, and others.
- **Admin-pro (legacy dark)** still referenced only in **globals.css** (`.admin-pro-app`). The shell uses **`.admin-wt-app`**, so `.admin-pro-app` is **dead code** for admin and can be removed or kept only if a future dark admin theme reuses it.

### 2.2 Primary button text (default vs hover)

- **AdminUIKit ActionButton primary:** `text-wt-nav` (navy on gold). Contrast is acceptable.
- **ContentCalendarWidget** category/primary buttons: `text-white` on gold. Same intent (readable on gold) but **inconsistent** with AdminUIKit. Recommend standardising: either **all admin primary buttons** use `text-wt-nav` or **all** use `text-white` (and document in design tokens).

### 2.3 Hover states

- **Consistent (wt-*):** TopBar nav `hover:text-white hover:bg-white/10`, Sidebar/Breadcrumb/ContextualSidebar/TabNav `hover:bg-wt-surface-hover` / `hover:text-wt-text`, AdminUIKit tables `hover:bg-wt-surface-hover`, secondary/ghost `hover:bg-wt-surface-hover`.
- **Inconsistent:**
  - Many components use `hover:bg-slate-50`, `hover:bg-card/50`, `hover:bg-white/5`, `hover:bg-white/10`, `hover:bg-muted/20` instead of `hover:bg-wt-surface-hover`.
  - Links: mix of `hover:text-primary-400`, `hover:text-primary-600`, `hover:text-wt-nav`. Admin links should use `hover:text-wt-nav` or `hover:text-wt-gold`.

### 2.4 Focus states

- **globals.css** defines `.admin-wt-app input:focus` / `textarea:focus` with gold ring. Good.
- Many admin forms and inputs use `focus:ring-primary-500`, `focus:ring-2 focus:ring-primary-500`, `focus:border-primary-500`. These should use **gold** in admin (e.g. `focus:ring-wt-gold` or rely on global `.admin-wt-app` override). If shadcn/Input is used, ensure it receives admin focus styling via the global override.

### 2.5 Dark mode / semantic tokens

- Admin is **light-only** (`[color-scheme:light]`, `admin-wt-app`). Many components still use `dark:` variants (e.g. `dark:text-white`, `dark:bg-slate-900`, `dark:border-slate-800`). Those **never apply** in admin and add noise; they can be removed for admin-only components or kept only for shared components used on both site and admin.

### 2.6 Files by category

**Fully aligned with Wealth & Trust (wt-*):**  
AdminTopBar, AdminSidebar, AdminLayout, AdminBreadcrumb, AdminCategoryHeaderNav, AdminHeaderNav, AdminTabNavigation, AdminContextualSidebar, AdminUIKit, ContentCalendarWidget (main UI), content-calendar page, dashboard page (app/admin/page.tsx).

**Mixed (wt-* + slate/semantic):**  
ContentCalendarWidget (loading skeleton uses `border-slate-200`, `text-slate-500`, `text-slate-900`), AdminPageHeader (uses `border-border`, `text-foreground`), AdminUIKit icon (uses `text-foreground`).

**Legacy teal in admin routes:**  
`app/admin/products/[id]/page.tsx`, `app/admin/pillar-pages/[id]/edit/page.tsx`.

**Heavy slate/semantic/primary (need migration to wt-*):**  
EnhancedAnalyticsDashboard, ExperimentDashboard, ReviewInterface, RevenuePredictionCard, WorkflowBuilder, AdvancedMetricsTable, AnalyticsDashboard, AutomationControls, BudgetGovernorPanel, DarkThemeCMS, ContentPerformanceTracking, EnhancedWordPressStyleCMS, ScraperDashboard, ProductPerformanceTracking, BulkActionsBar, and most of the remaining 60+ admin components.

---

## 3. Recommendations

### 3.1 Single source of truth

- Add **`lib/admin/design-tokens.ts`** (or a short doc) listing the only tokens to use in admin: `wt-*` plus optional semantic aliases (e.g. `adminPrimary` → `wt-gold`) so primary buttons, links, and focus are consistent.

### 3.2 Standardise primary buttons

- **Primary (gold):** One rule for all admin: e.g. `bg-wt-gold hover:bg-wt-gold-hover` and either `text-wt-nav` or `text-white` (pick one and document).
- **Danger:** `bg-wt-danger` or `bg-wt-danger-subtle` + `text-wt-danger`; hover `hover:bg-wt-danger/90` or similar.
- Replace all `bg-primary-600`, `bg-teal-600`, `bg-emerald-600` in admin with the chosen primary/danger tokens.

### 3.3 Replace raw and semantic tokens in admin

- In **admin-only** components: replace `slate-*`, `gray-*`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border` with `wt-text`, `wt-text-muted`, `wt-surface`, `wt-border`, etc.
- In **shared** components (used on both site and admin): either pass a `theme` prop and use `wt-*` when `theme === 'admin'`, or keep semantic tokens and ensure admin globals (`.admin-wt-app`) override them sufficiently.

### 3.4 Hover and focus

- **Hover:** Use `hover:bg-wt-surface-hover`, `hover:text-wt-text`, `hover:border-wt-border-light` for neutral areas; `hover:bg-wt-gold-hover` for primary buttons; `hover:text-wt-nav` or `hover:text-wt-gold` for links.
- **Focus:** Rely on `.admin-wt-app` input/textarea focus in globals.css; for custom controls use `focus:ring-wt-gold` / `focus:border-wt-gold` where needed.

### 3.5 Cleanup

- Remove or repurpose **`.admin-pro-app`** in globals.css if admin will stay on Wealth & Trust only.
- In admin-only components, remove **`dark:`** classes that never apply, or move them behind a theme prop if you add dark admin later.

---

## 4. Quick reference: Do / Don’t

| Do | Don’t |
|----|--------|
| Use `wt-bg`, `wt-surface`, `wt-card` for backgrounds | Use `bg-card`, `bg-slate-*`, `bg-muted` in admin-only UI |
| Use `wt-text`, `wt-text-muted`, `wt-text-dim` for text | Use `text-foreground`, `text-muted-foreground`, `text-slate-*` in admin |
| Use `wt-border`, `wt-border-light` for borders | Use `border-border`, `border-slate-*` in admin |
| Use `wt-gold`, `wt-gold-hover`, `wt-gold-subtle` for primary/active | Use `bg-primary-500`, `bg-teal-600`, `text-primary-400` in admin |
| Use `wt-nav` for header and “on gold” text where needed | Use raw navy hex in admin |
| Use `wt-green`, `wt-orange`, `wt-danger` for status | Use `success-600`, `warning-500`, `danger-500` in admin |
| Use `hover:bg-wt-surface-hover`, `hover:text-wt-text` | Use `hover:bg-slate-50`, `hover:bg-card/50` in admin |
| Use `focus:ring-wt-gold` or global admin focus | Use `focus:ring-primary-500` in admin forms |

---

## 5. Next steps

1. Add **design tokens reference** (`lib/admin/design-tokens.ts` or `docs/cms/DESIGN_TOKENS.md`) and link to this audit.
2. Fix **critical paths:** primary/danger buttons and teal links in `products/[id]`, `pillar-pages/[id]/edit`, and any other admin pages still using teal/primary-600.
3. Migrate **high-traffic admin components** (e.g. dashboard, content calendar, review queue, media, settings) from slate/semantic to `wt-*`.
4. Optionally remove **`.admin-pro-app`** and **`dark:`** in admin-only components to reduce confusion and bundle size.
