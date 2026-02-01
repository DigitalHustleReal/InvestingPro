# Admin Design Tokens (Wealth & Trust)

**Single source of truth** for CMS/admin colors. Use these **only** for admin UI (`/admin/*` and `components/admin/*`). Defined in `tailwind.config.ts` under `theme.extend.colors.wt`. See also `docs/audits/CMS_COLOR_AUDIT_REPORT.md`.

## Backgrounds

| Class | Use |
|-------|-----|
| `bg-wt-bg` | Page background |
| `bg-wt-surface` | Cards, panels, inputs, sidebar |
| `bg-wt-surface-hover` | Row/list hover, button secondary hover |
| `bg-wt-card` | Secondary panels (e.g. contextual sidebar) |

## Borders

| Class | Use |
|-------|-----|
| `border-wt-border` | Default borders |
| `border-wt-border-light` | Subtle dividers, hover borders |

## Text

| Class | Use |
|-------|-----|
| `text-wt-text` | Primary text |
| `text-wt-text-muted` | Secondary text, labels |
| `text-wt-text-dim` | Tertiary, hints |

## Header / Nav

| Class | Use |
|-------|-----|
| `bg-wt-nav` | Top bar background |
| `text-white` | Text on nav (top bar) |
| `text-white/85` | Muted text on nav |
| `hover:bg-white/10` | Nav link hover (on navy) |

## Primary (Gold)

| Class | Use |
|-------|-----|
| `bg-wt-gold` | Primary buttons, active emphasis |
| `hover:bg-wt-gold-hover` | Primary button hover |
| `text-wt-gold` | Gold text (e.g. active tab) |
| `bg-wt-gold-subtle` | Active tab/sidebar background |
| `border-wt-gold/30` | Gold borders (badges, focus) |

**Primary button:** `bg-wt-gold hover:bg-wt-gold-hover text-wt-nav` or `text-white` (choose one app-wide).

## Semantic

| Class | Use |
|-------|-----|
| `text-wt-green`, `bg-wt-green-subtle` | Success, positive |
| `text-wt-orange`, `bg-wt-orange-subtle` | Warning |
| `text-wt-danger`, `bg-wt-danger-subtle` | Error, delete |
| `hover:text-wt-nav` | Link hover (navy) |
| `hover:text-wt-danger` | Destructive link hover |

## Focus (forms)

Use global `.admin-wt-app` focus in `globals.css`, or `focus:ring-wt-gold focus:border-wt-gold` for custom controls.
