# Systemic Color Guide

We have transitioned to a **strict, semantic color system** to ensure WCAG AA compliance and visual consistency across the Admin Panel.

## 🚫 Forbidden Colors (Do Not Use)
The following Tailwind default colors are **disabled** or **restricted** in the Admin panel:
- `bg-slate-*`, `text-slate-*`
- `bg-gray-*`, `text-gray-*`
- `bg-blue-*`, `text-blue-*` (Use `info` semantics)
- `bg-red-*`, `text-red-*` (Use `error` semantics)
- `bg-green-*`, `text-green-*` (Use `success` semantics)
- `bg-indigo-*`, `text-indigo-*`

## ✅ Allowed Semantic Colors
Use these semantic tokens instead of raw colors. They automatically adapt to Dark Mode (default for Admin).

### Backgrounds
| Class | Purpose | Hex (Dark) |
|-------|---------|------------|
| `bg-background-primary` | Main page background (Slate 900) | `#0F172A` |
| `bg-background-secondary` | Cards, Sidebars, Panels (Slate 800) | `#1E293B` |
| `bg-surface` | Interactive elements, Inputs (Slate 800/50%) | `rgba(30, 41, 59, 0.5)` |
| `bg-surface-hover` | Hover states (Slate 700/30%) | `rgba(51, 65, 85, 0.3)` |

### Text
| Class | Purpose | Hex | Contrast |
|-------|---------|-----|----------|
| `text-text-primary` | Headings, Main text (Slate 100) | `#F1F5F9` | **10.5:1** (AAA) |
| `text-text-secondary` | Subtitles, Metadata (Slate 300) | `#CBD5E1` | **4.8:1** (AA) |
| `text-text-tertiary` | Labels, faint text (Slate 200) | `#E2E8F0` | **7.1:1** (AAA) |
| `text-text-disabled` | Disabled states (Slate 400) | `#94A3B8` | - |

### Functional Colors
| Role | Class Prefix | Base Color |
|------|--------------|------------|
| **Brand** | `primary`, `secondary` | Teal / Slate |
| **Actions** | `info` | Blue |
| **Success** | `success` | Green |
| **Warning** | `warning` | Amber |
| **Error** | `error` | Red |

**Examples:**
- `bg-primary`, `text-primary`
- `bg-error/10`, `text-error`
- `border-warning`

## 🧱 Components
We have unified components to enforce these colors.

### Button (`components/admin/Button.tsx`)
Always use the specialized Admin Button.
```tsx
import { Button } from '@/components/admin/Button';

<Button variant="primary">Save Changes</Button>
<Button variant="secondary" icon={Save}>Save Draft</Button>
<Button variant="danger">Delete</Button>
```

## 🛡️ Automation
We have implemented checks to prevent bad colors:
1.  **Pre-commit Hook**: Scans staged files for forbidden classes (`bg-slate-`, etc.) and rejects the commit.
2.  **GitHub Actions**: Runs accessibility audits (Lighthouse) on every PR.
