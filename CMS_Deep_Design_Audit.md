# CMS Deep Design System Audit

This report documents the current state of the InvestingPro Admin CMS design system, identifying inconsistencies, hardcoded values, and visibility issues.

## 1. Theme Inconsistency (The "Teal vs. Sky" Conflict)
There is a fundamental split between the defined "System of Record" and the actual implementation.

- **Defined Primary (`globals.css`):** Teal/Cyan (`#1CB7A8`).
- **Actual Primary (UI Components):** Sky/Blue (`#0ea5e9`).
- **Legacy Primary (WT Theme):** Navy (`#1F3B5C`) and Gold (`#D4AF37`).

> [!WARNING]
> Most primary actions (buttons, badges, highlights) currently use Tailwind's `sky-500` or `sky-600` classes instead of semantic `--primary` tokens.

## 2. Color System Breakdown

### Text Visibility Issues
The reported "low visibility" of gray text stems from several tertiary text tokens:
| Token | Hex/HSL | Contrast Level | Usage |
|-------|---------|----------------|-------|
| `text-slate-500` | `#64748b` | **Low** on White | Subtitles, labels, captions |
| `text-text-muted` | `#486581` | Medium | Secondary text |
| `text-text-dim` | `#777777` | **Very Low** | Auxiliary labels |
| `text-slate-400` | `#94a3b8` | **Unreadable** | Placeholders, icons |

### Hardcoded Hex Codes
Massive blocks of hex codes are applied in `globals.css` using specific app wrappers (`.admin-pro-app`, `.admin-wt-app`). These bypass Tailwind's utility system and create "frozen" styles that don't react to system-wide changes.

## 3. Component Standards

### Cards
Currently fragmented across three implementation styles:
1. **`AdminCard` Component:** Uses `bg-white/10` and `backdrop-blur`. (Glassmorphic)
2. **`AdminUIKit.StatCard`:** Uses `bg-white` and `border-slate-200`. (Clean SaaS)
3. **Generic Divs:** Many sections (e.g., in `ArticlesTable`) use `bg-white` and `border-slate-200` directly.

### Icons
- **Library:** `lucide-react`.
- **Standard Size:** `w-4 h-4` for inline/list icons and `w-6 h-6` for headers/cards.
- **Coloring:** Often hardcoded (e.g., `text-sky-500`, `text-slate-400`) instead of following a semantic pattern.

## 4. Layout System
- **Wrapper:** `AdminLayout` provides the sidebar/topbar structure.
- **Content:** `AdminPageContainer` enforces a `max-w-[1600px]` and `px-8` padding.
- **Grid:** Most dashboards use a standard `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4` for stats and a `grid-cols-1 xl:grid-cols-3` for the main content + sidebar layout.

## 5. Summary of Hardcoded vs. Semantic
| Element | Currently Follows | Recommended Fix |
|---------|-------------------|-----------------|
| **Primary Actions** | Hardcoded `sky-500` | Sync with semantic `--primary` |
| **Borders** | `border-slate-200` | Move to `--border` |
| **Backgrounds** | `bg-white` / `bg-slate-50` | Use `--background` and `--muted` |
| **Typography** | `text-slate-x00` | Strict use of `--foreground` and `--muted-foreground` |

---
**Conclusion:** The CMS effectively uses three competing styles. To achieve professional consistency, we must decide on one unified palette (ideally the Sky/Slate SaaS system) and migrate all hardcoded Tailwind slate classes to semantic CSS variables.
