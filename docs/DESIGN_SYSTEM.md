# InvestingPro Design System Guide

> **Official Color & Component System**  
> Save this file: `docs/DESIGN_SYSTEM.md`  
> Last Updated: January 8, 2026

---

## 🎨 Color Foundation

### Brand Colors

**Primary (Trust Teal)**
- `primary-600` (#0d9488) — Main brand color, CTAs
- Use for: Primary buttons, links, active states

**Secondary (Information Blue)**
- `secondary-600` (#2563eb) — Authority, trust
- Use for: Secondary actions, info

**Success (Growth Green)**
- `success-500` (#10b981) — Positive outcomes
- Use for: Gains, completions

**Warning (Caution Amber)**
- `warning-500` (#f59e0b) — Moderate attention
- Use for: Warnings, pending states

**Danger (Alert Red)**
- `danger-500` (#ef4444) — Critical  
- Use for: Errors, losses

**Neutral (Slate)**
- `slate-50` to `slate-900` — Text, backgrounds

---

## 📦 Component Patterns

### Buttons

```tsx
// Primary CTA
<button className="bg-primary-600 hover:bg-primary-700 
                   text-white font-semibold px-6 py-3 rounded-lg">
  Get Started
</button>

// Secondary
<button className="bg-slate-100 hover:bg-slate-200 text-slate-900
                   dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100
                   px-6 py-3 rounded-lg">
  Learn More
</button>
```

### Cards

```tsx
// Standard
<div className="bg-white dark:bg-slate-800 
                border border-slate-200 dark:border-slate-700
                rounded-xl p-6 shadow-sm">
  Content
</div>

// Calculator Result Card
<div className="bg-gradient-to-br from-primary-50 to-success-50
                dark:from-slate-900 dark:to-slate-800
                border border-primary-100 dark:border-slate-700
                rounded-2xl p-8 shadow-lg">
  Results
</div>
```

### Typography

```tsx
// Heading
<h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
  Title
</h1>

// Body
<p className="text-base text-slate-700 dark:text-slate-300">
  Content
</p>

// Muted
<span className="text-sm text-slate-500 dark:text-slate-400">
  Helper text
</span>
```

### Forms

```tsx
// Input
<input className="w-full px-4 py-3 rounded-lg
                  bg-white dark:bg-slate-800
                  border border-slate-300 dark:border-slate-600
                  text-slate-900 dark:text-slate-100
                  placeholder:text-slate-400
                  focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20" />

// Slider
<div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
  <div className="h-2 rounded-full bg-primary-600" style={{width: '50%'}} />
</div>
```

### Badges

```tsx
// Info
<span className="bg-primary-50 text-primary-700 border border-primary-100
                 dark:bg-primary-950/50 dark:text-primary-400
                 px-2.5 py-1 rounded-full text-xs font-medium">
  Info
</span>

// Success
<span className="bg-success-50 text-success-700 
                 dark:bg-success-950/50 dark:text-success-400
                 px-2.5 py-1 rounded-full text-xs">
  Success
</span>
```

---

## 🌙 Dark Mode Rules

### Critical Rules

1. **Always provide dark mode variants** for:
   - Backgrounds (`dark:bg-*`)
   - Text colors (`dark:text-*`)
   - Borders (`dark:border-*`)

2. **Text contrast minimums:**
   - Body text: `text-slate-700` → `dark:text-slate-300`
   - Headings: `text-slate-900` → `dark:text-slate-50`
   - Muted: `text-slate-500` → `dark:text-slate-400`

3. **Result cards must use dark gradients:**
   ```tsx
   className="bg-gradient-to-br from-primary-50 to-success-50
              dark:from-slate-900 dark:to-slate-800"
   ```

---

## 📊 Chart Colors

```javascript
const CHART_COLORS = {
  invested: '#0d9488',    // primary-600
  returns: '#10b981',     // success-500
  total: '#2563eb',       // secondary-600
}
```

---

## ✅ Quick Reference

| Element | Light | Dark |
|---------|-------|------|
| Page BG | `bg-slate-50` | `bg-slate-900` |
| Card BG | `bg-white` | `bg-slate-800` |
| Border | `border-slate-200` | `border-slate-700` |
| Heading | `text-slate-900` | `text-slate-50` |
| Body | `text-slate-700` | `text-slate-300` |
| Muted | `text-slate-500` | `text-slate-400` |
| Primary Action | `bg-primary-600` | (same) |
| Success | `text-success-500` | (same) |
| Error | `text-danger-500` | (same) |

---

## 🚫 What NOT to Do

❌ Hardcoded hex colors: `bg-[#f3f4f6]`  
✅ Use tokens: `bg-stone-100`

❌ Missing dark mode: `text-slate-600`  
✅ With dark mode: `text-slate-600 dark:text-slate-400`

❌ Using old colors: `teal-*`, `emerald-*`  
✅ Use system colors: `primary-*`, `success-*`

---

**For questions, refer to: `/docs/DESIGN_SYSTEM.md`**
