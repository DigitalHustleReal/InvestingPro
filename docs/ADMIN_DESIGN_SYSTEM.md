# Admin Design System (Standalone SaaS)

Consistent layout, spacing, colors, and components for the admin/CMS so it feels like one product.

## Layout & spacing

- **Page container:** Use `AdminPageContainer` on every admin page. It provides:
  - `max-w-[1600px]` + `mx-auto`
  - Horizontal: `px-4 sm:px-6 lg:px-8`
  - Vertical: `py-6 lg:py-8` (use `noPaddingY` for pages with their own header strip)
  - Section spacing: `space-y-8` (or `compact` for `space-y-6`)
- **Header nav & breadcrumb:** Same horizontal padding (`px-4 sm:px-6 lg:px-8`) and `max-w-[1600px] mx-auto`.
- **Top bar:** Same horizontal padding for alignment.

## Colors (admin-pro only)

Use **admin-pro** tokens only inside admin:

- **Backgrounds:** `bg-admin-pro-bg`, `bg-admin-pro-surface`, `bg-admin-pro-sidebar`, `bg-admin-pro-surface-hover`
- **Borders:** `border-admin-pro-border`, `border-admin-pro-border-light`
- **Text:** `text-admin-pro-text`, `text-admin-pro-text-muted`, `text-admin-pro-text-dim`
- **Accent:** `text-admin-pro-accent`, `bg-admin-pro-accent`, `bg-admin-pro-accent-subtle`, `border-admin-pro-accent`
- **Danger:** `text-admin-pro-danger`, `bg-admin-pro-danger-subtle`, `border-admin-pro-danger`

Avoid `primary-400`, `secondary-500`, `accent-500`, etc. in admin; globals map some of these to admin-pro, but prefer explicit admin-pro classes.

## Components

- **Cards:** Use `AdminUIKit` `ContentSection` or `Card` with admin-pro classes. Globals scope `[data-slot="card"]` and `.bg-card` to admin-pro surface/border.
- **Tables:** Use `AdminUIKit` `DataTable`, `TableHeader`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell` (they use admin-pro). Or plain `<table>`; globals style `thead`, `th`, `tbody tr`, `td` under `.admin-pro-app`.
- **Stat cards:** Use `AdminUIKit` `StatCard` (admin-pro styling).
- **Page header:** Use `AdminUIKit` `AdminPageHeader` (admin-pro icon/heading).
- **Badges:** Use `AdminUIKit` `StatusBadge` (admin-pro variants). Use `Badge` with admin-pro classes if needed.
- **Empty state:** Use `AdminUIKit` `EmptyState` (admin-pro).

## Adding a new admin page

1. Wrap content in `AdminPageContainer` (or `AdminPageContainer compact`).
2. Use `AdminPageHeader` for title/subtitle/actions.
3. Use `ContentSection`, `StatCard`, `DataTable`, etc. from AdminUIKit.
4. Use only admin-pro colors for custom UI (borders, text, backgrounds).

## Files

- **Layout/spacing:** `components/admin/AdminPageContainer.tsx`, `AdminLayout.tsx`, `AdminHeaderNav.tsx`, `AdminTopBar.tsx`
- **Theme overrides:** `app/globals.css` (`.admin-pro-app` block)
- **Tokens:** `tailwind.config.ts` → `theme.extend.colors.admin-pro`
- **UIKit:** `components/admin/AdminUIKit.tsx`
