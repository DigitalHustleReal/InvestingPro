# InvestingPro Design System

**Version:** 1.0.0  
**Last Updated:** February 12, 2026  
**Status:** ✅ Active

---

## 🎨 Color System

### Admin Interface (Dark Mode - Always On)

The admin interface uses a **dark theme** optimized for extended use and reduced eye strain.

#### Background Colors
```tsx
// Primary backgrounds
bg-slate-900        // Main background (#0F172A)
bg-slate-900/95     // Translucent background with backdrop-blur
bg-slate-800        // Surface/card background (#1E293B)

// Interactive surfaces
bg-white/5          // Subtle surface
bg-white/10         // Hover state
bg-white/15         // Active/pressed state
```

#### Text Colors (WCAG AA Compliant)

```tsx
// ✅ WCAG AA Compliant (4.5:1+ on dark backgrounds)
text-white          // Primary headings (16:1 contrast)
text-slate-100      // Primary text (#F8FAFC, 10.5:1)
text-slate-200      // Secondary text (#E2E8F0, 7.1:1)
text-slate-300      // Tertiary text, labels (#CBD5E1, 4.8:1) ✅

// ❌ DO NOT USE for text on dark backgrounds
text-slate-400      // ONLY for disabled states (2.9:1) ❌
text-slate-500      // Fails contrast (2.2:1) ❌
```

**Contrast Ratios:**
| Color | On bg-slate-900 | WCAG AA | Status |
|-------|-----------------|---------|--------|
| `text-white` | 16:1 | ✅ AAA | Excellent |
| `text-slate-100` | 10.5:1 | ✅ AAA | Excellent |
| `text-slate-200` | 7.1:1 | ✅ AAA | Excellent |
| `text-slate-300` | 4.8:1 | ✅ AA | Good |
| `text-slate-400` | 2.9:1 | ❌ Fails | Disabled only |

#### Border Colors
```tsx
border-white/5      // Subtle borders
border-white/10     // Default borders
border-white/20     // Emphasized borders
```

#### Semantic Colors
```tsx
// Success
bg-emerald-500/10 text-emerald-400 border-emerald-500/20

// Warning  
bg-amber-500/10 text-amber-400 border-amber-500/20

// Error
bg-rose-500/10 text-rose-400 border-rose-500/20

// Info
bg-cyan-500/10 text-cyan-400 border-cyan-500/20

// Neutral
bg-slate-500/10 text-slate-300 border-slate-500/20
```

### Public Site (Light Mode)

```tsx
// Backgrounds
bg-white            // Main background
bg-slate-50         // Surface/card background
bg-slate-100        // Hover state

// Text
text-slate-900      // Primary text (11.5:1) ✅
text-slate-700      // Secondary text (6.1:1) ✅
text-slate-600      // Tertiary text (4.6:1) ✅

// Borders
border-slate-200    // Default borders
border-slate-300    // Emphasized borders
```

---

## 📦 Component Library

### Core Components

#### 1. FormInput
**Location:** `components/admin/FormInput.tsx`

**Usage:**
```tsx
import { FormInput } from '@/components/admin/FormInput';

<FormInput
  label="Article Title"
  placeholder="Enter title..."
  required
  error={errors.title}
  helperText="Max 60 characters"
/>
```

**Features:**
- ✅ Proper label association
- ✅ Error state styling
- ✅ Focus indicators
- ✅ Accessible placeholders
- ✅ WCAG AA compliant colors

---

#### 2. Card
**Location:** `components/admin/Card.tsx`

**Usage:**
```tsx
import { Card, CardSection } from '@/components/admin/Card';

<Card
  title="Analytics"
  description="View your performance metrics"
  actions={<Button>Refresh</Button>}
  variant="glass"
>
  <CardSection title="Overview">
    {/* Content */}
  </CardSection>
</Card>
```

**Variants:**
- `default` - Basic card with subtle background
- `glass` - Glassmorphism effect with backdrop blur
- `bordered` - Emphasized border

---

#### 3. DataTable
**Location:** `components/admin/DataTable.tsx`

**Usage:**
```tsx
import { DataTable, StatusBadge } from '@/components/admin/DataTable';

const columns = [
  { key: 'title', header: 'Title', sortable: true },
  { key: 'status', header: 'Status', render: (value) => (
    <StatusBadge status={value}>{value}</StatusBadge>
  )},
];

<DataTable
  data={articles}
  columns={columns}
  onRowClick={(row) => router.push(`/admin/articles/${row.id}`)}
  isLoading={isLoading}
/>
```

**Features:**
- ✅ Sortable columns
- ✅ Loading states
- ✅ Empty states
- ✅ Row click handlers
- ✅ Accessible headers

---

#### 4. Button (Existing)
**Location:** `components/ui/Button.tsx` (public) / `components/admin/system/AdminButton.tsx` (admin)

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg" loading={isSubmitting}>
  Save Changes
</Button>
```

**Variants:**
- `default` - Primary teal button
- `secondary` - Fintech blue
- `gradient` - Gradient effect
- `destructive` - Red for dangerous actions
- `outline` - Bordered button
- `ghost` - Transparent background
- `link` - Text link style

---

#### 5. AdminBadge
**Location:** `components/admin/system/AdminBadge.tsx`

**Usage:**
```tsx
import { AdminBadge } from '@/components/admin/system/AdminBadge';

<AdminBadge status="success">Published</AdminBadge>
<AdminBadge status="warning">Draft</AdminBadge>
<AdminBadge status="error">Failed</AdminBadge>
```

---

## 🎯 Usage Guidelines

### DO ✅

```tsx
// ✅ Use semantic color classes
<p className="text-slate-300">Secondary text</p>

// ✅ Use design system components
<FormInput label="Name" required />

// ✅ Use consistent spacing
<div className="space-y-4">

// ✅ Use proper contrast
<div className="bg-slate-900 text-slate-200">
```

### DON'T ❌

```tsx
// ❌ Don't use text-slate-400 on dark backgrounds
<p className="text-slate-400">Hard to read</p>

// ❌ Don't create inline button styles
<button className="px-4 py-2 bg-blue-500">

// ❌ Don't use arbitrary values without reason
<div className="text-[#999999]">

// ❌ Don't mix light/dark mode classes in admin
<div className="bg-white text-slate-900"> {/* Admin is always dark */}
```

---

## 🔧 Implementation Checklist

When creating a new admin component:

- [ ] Use `bg-slate-900` or `bg-slate-800` for backgrounds
- [ ] Use `text-slate-200` or `text-slate-300` for text (NOT slate-400)
- [ ] Use `border-white/10` for borders
- [ ] Add proper hover states (`hover:bg-white/10`)
- [ ] Include focus states for interactive elements
- [ ] Use existing components (FormInput, Card, DataTable, Button)
- [ ] Test keyboard navigation
- [ ] Verify contrast with browser dev tools

---

## 📏 Spacing Scale

```tsx
gap-1     // 4px - Tight spacing (icon + text)
gap-2     // 8px - Default gap
gap-3     // 12px - Form fields
gap-4     // 16px - Card sections
gap-6     // 24px - Major sections
gap-8     // 32px - Page sections

p-2       // 8px - Tight padding
p-4       // 16px - Default padding
p-6       // 24px - Card padding
p-8       // 32px - Page padding
```

---

## 🎭 Typography

```tsx
// Headings
text-2xl font-bold text-slate-200  // Page title
text-lg font-semibold text-slate-200  // Section title
text-sm font-semibold text-slate-300  // Subsection

// Body
text-sm text-slate-200  // Primary text
text-sm text-slate-300  // Secondary text
text-xs text-slate-300  // Small text, labels

// Special
text-[11px] font-bold uppercase tracking-wider text-slate-300  // Labels
font-inter  // Default font family
tabular-nums  // For numbers
```

---

## 🧪 Testing

### Contrast Checker Script

```bash
# Install dependency
npm install wcag-contrast

# Run contrast check
node scripts/check-contrast.js
```

### Manual Testing

1. **Visual Check:** Open admin in browser, verify all text is readable
2. **Keyboard Navigation:** Tab through all interactive elements
3. **Screen Reader:** Test with NVDA/JAWS (Windows) or VoiceOver (Mac)
4. **Lighthouse:** Run accessibility audit (target: 95+)

---

## 📚 Resources

**WCAG 2.1 Guidelines:**
- https://www.w3.org/WAI/WCAG21/quickref/

**Contrast Checker:**
- https://webaim.org/resources/contrastchecker/

**Color Palette:**
- See `tailwind.config.ts` lines 102-225

**Component Examples:**
- See `components/admin/` directory

---

## 🔄 Migration Guide

### Updating Old Components

**Before:**
```tsx
<div className="bg-white text-gray-900">
  <p className="text-gray-400">Secondary text</p>
</div>
```

**After:**
```tsx
<div className="bg-slate-900 text-slate-200">
  <p className="text-slate-300">Secondary text</p>
</div>
```

### Common Replacements

| Old | New | Reason |
|-----|-----|--------|
| `text-slate-400` | `text-slate-300` | Better contrast (4.8:1 vs 2.9:1) |
| `text-gray-400` | `text-slate-300` | Consistency + contrast |
| `border-gray-100` | `border-white/10` | Consistent with dark theme |
| `bg-gray-50` | `bg-white/5` | Glassmorphism effect |

---

## ✅ Accessibility Standards

**WCAG 2.1 Level AA Requirements:**
- Normal text: 4.5:1 minimum contrast
- Large text (18px+): 3:1 minimum contrast
- UI components: 3:1 minimum contrast

**Our Standards:**
- All text: 4.5:1+ (AA compliant)
- Headings: 7:1+ (AAA compliant)
- Interactive elements: Visible focus states
- Forms: Proper label association
- Tables: Clear headers and structure

---

## 📞 Support

**Questions?** Check existing components in `components/admin/` for examples.

**Found an issue?** Create a GitHub issue with:
- Component name
- Expected behavior
- Actual behavior
- Screenshot (if visual)

**Need a new component?** Follow this pattern:
1. Check if similar component exists
2. Use design system colors/spacing
3. Ensure WCAG AA compliance
4. Add to this documentation
