# Theme Usage Guidelines

**Date:** January 23, 2026  
**Purpose:** Developer reference for consistent theme color usage

---

## 🎨 COLOR HIERARCHY

### **Tier 1: Primary Brand Colors (90% of UI)**
- **Primary:** `#14b8a6` (Teal) - Main brand color
- **Secondary:** `#0ea5e9` (Sky Blue) - Info, trust, authority
- **Accent:** `#f59e0b` (Amber) - CTAs, highlights, energy

**Usage:**
- Primary: Main buttons, links, brand elements
- Secondary: Info sections, trust indicators, secondary actions
- Accent: Important CTAs, highlights, attention-grabbing elements

---

### **Tier 2: Semantic Status Colors**
- **Success:** `#10b981` (Emerald) - Success states, positive metrics
- **Warning:** `#f59e0b` (Amber) - Warnings, cautions
- **Danger:** `#ef4444` (Red) - Errors, destructive actions, losses
- **Info:** `#0ea5e9` (Sky Blue) - Informational messages

**Usage:**
- **ONLY** for status indicators, not for categories
- Success: Completed actions, positive trends
- Warning: Cautionary messages
- Danger: Errors, destructive actions, negative trends
- Info: Informational messages

---

### **Tier 3: Category Accents (<10%)**
- **Investing:** Success color (Emerald)
- **Protection:** Secondary color (Sky Blue)
- **Borrowing:** Primary color (Teal)
- **Planning:** Accent color (Amber)
- **Education:** Primary color (Teal)

**Usage:**
- Category badges, category-specific hero sections
- Should be consistent across the platform

---

## 📐 GRADIENT PATTERNS

### **Standard Pattern:**
```
from-{color}-500 to-{color}-700
```

**Examples:**
- `from-primary-500 to-primary-700` ✅
- `from-secondary-500 to-secondary-700` ✅
- `from-accent-500 to-accent-700` ✅

### **Acceptable Variations:**
- Category-specific gradients (CategoryHero): `from-success-500 to-primary-500` ✅
- Admin UI visual variety (AdminUIKit): `from-primary-500 to-success-500` ✅

### **Avoid:**
- Mixing semantic with brand in general UI: `from-success-500 to-primary-600` ❌
- Inconsistent gradient directions
- Hardcoded hex colors in gradients

---

## 🌓 DARK MODE

### **Text Colors:**
```tsx
// Always include dark mode variant
className="text-slate-900 dark:text-white"
className="text-slate-600 dark:text-slate-400"
```

### **Background Colors:**
```tsx
// Always include dark mode variant
className="bg-white dark:bg-slate-800"
className="bg-slate-50 dark:bg-slate-900"
```

### **Borders:**
```tsx
// Always include dark mode variant
className="border-slate-200 dark:border-slate-700"
```

---

## 🚫 WHAT TO AVOID

1. **Hardcoded Hex Colors:**
   - ❌ `#14b8a6` → ✅ `primary-500` or `text-primary-500`

2. **Generic Color Names:**
   - ❌ `blue-500` → ✅ `secondary-500`
   - ❌ `emerald-500` → ✅ `success-500`
   - ❌ `rose-500` → ✅ `danger-500`

3. **Semantic Colors for Categories:**
   - ❌ `bg-success-50` for "Investing" category → ✅ Use category color mapping

4. **Mixing Semantic with Brand:**
   - ❌ `from-success-500 to-primary-600` → ✅ `from-primary-500 to-primary-700`

---

## ✅ BEST PRACTICES

1. **Always use theme tokens** - Never hardcode colors
2. **Include dark mode variants** - All text, backgrounds, borders
3. **Use semantic colors only for status** - Not for categories
4. **Follow gradient patterns** - Standardize to from-X-500 to-X-700
5. **Consistent category colors** - Use category color mapping

---

## 📚 UTILITIES

### **Theme Color Utilities:**
- `lib/utils/theme-colors.ts` - Get theme colors programmatically
- `lib/utils/chart-colors.ts` - Standardized chart colors

### **Usage:**
```typescript
import { getThemeColor, getAssetColor } from '@/lib/utils/theme-colors';
import { CHART_COLORS, getAssetColor } from '@/lib/utils/chart-colors';

const primaryColor = getThemeColor('primary', 500);
const equityColor = getAssetColor('Equity');
```

---

*Last Updated: January 23, 2026*
