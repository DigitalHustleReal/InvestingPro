# InvestingPro Design System - Quick Reference

## 🎨 Colors

### Primary (Emerald - Growth & Money)
```tsx
bg-primary-50   // #ecfdf5 - Lightest background
bg-primary-100  // #d1fae5 - Light background
bg-primary-500  // #10b981 - Main brand color ⭐
bg-primary-600  // #059669 - Hover state
bg-primary-900  // #064e3b - Darkest
```

### Secondary (Blue - Trust)
```tsx
bg-secondary-500  // #3b82f6 - Main blue
bg-secondary-600  // #2563eb - Hover
```

### Accent (Amber - Highlights)
```tsx
bg-accent-500  // #f59e0b - Badges, awards
```

### Dark Theme
```tsx
bg-dark-bg      // #0B1221 - Header background
bg-dark-surface // #111827 - Card background
```

---

## 📝 Typography

### Font Families
```tsx
font-sans  // Inter (body text)
font-mono  // JetBrains Mono (code, numbers)
```

### Font Sizes
```tsx
text-xs    // 12px - Labels, captions
text-sm    // 14px - Body small
text-base  // 16px - Body ⭐
text-lg    // 18px - Subheadings
text-xl    // 20px - Headings
text-2xl   // 24px - Section titles
text-4xl   // 36px - Page titles
text-6xl   // 60px - Hero headings
```

### Font Weights
```tsx
font-medium    // 500 - Body emphasis
font-semibold  // 600 - Buttons, labels
font-bold      // 700 - Headings
font-black     // 900 - Hero text
```

---

## 📏 Spacing (8px Grid)

```tsx
p-2   // 8px
p-4   // 16px ⭐ (Most common)
p-6   // 24px - Card padding
p-8   // 32px - Section padding
p-12  // 48px - Large sections
```

---

## 🎭 Components

### Buttons
```tsx
// Primary CTA
<Button className="btn-primary">Apply Now</Button>

// Secondary
<Button className="btn-secondary">Learn More</Button>

// Outline
<Button className="btn-outline">Compare</Button>

// Ghost
<Button className="btn-ghost">Cancel</Button>
```

### Cards
```tsx
// Standard card
<div className="data-card">...</div>

// Featured card (with gradient)
<div className="data-card-featured">...</div>

// Glassmorphism
<div className="glass-card">...</div>
<div className="glass-card-dark">...</div>
```

### Badges
```tsx
<span className="badge badge-success">Popular</span>
<span className="badge badge-warning">Limited Time</span>
<span className="badge badge-premium">Best Overall</span>
```

### Gradients
```tsx
className="gradient-primary"    // Emerald gradient
className="gradient-secondary"  // Blue gradient
className="gradient-dark"       // Navy gradient
className="gradient-mesh"       // Multi-color mesh
```

---

## 🎬 Animations

### Fade In
```tsx
className="animate-fade-in"
```

### Slide Up
```tsx
className="animate-slide-up"
```

### Scale In
```tsx
className="animate-scale-in"
```

### Shimmer (Loading)
```tsx
<div className="shimmer h-20 w-full rounded-lg"></div>
```

---

## 🔲 Borders & Shadows

### Border Radius
```tsx
rounded-lg   // 16px - Cards
rounded-xl   // 24px - Large cards
rounded-2xl  // 32px - Hero elements
rounded-full // Pills, badges
```

### Shadows
```tsx
shadow-sm   // Subtle
shadow-md   // Standard ⭐
shadow-lg   // Elevated
shadow-xl   // Modals
shadow-primary    // Emerald glow
shadow-secondary  // Blue glow
```

---

## 📱 Responsive Utilities

### Breakpoints
```tsx
sm:   // ≥ 640px  (Tablet)
md:   // ≥ 768px  (Tablet landscape)
lg:   // ≥ 1024px (Desktop) ⭐
xl:   // ≥ 1280px (Large desktop)
2xl:  // ≥ 1536px (Wide screen)
```

### Example
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 1 col mobile, 2 col tablet, 4 col desktop */}
</div>
```

---

## 🎯 Common Patterns

### Hero Section
```tsx
<section className="bg-dark-bg text-white pt-24 pb-32 relative overflow-hidden">
  <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
  <div className="container mx-auto px-6 relative z-10">
    <h1 className="text-6xl font-black">Hero Title</h1>
  </div>
</section>
```

### Product Card
```tsx
<div className="data-card group">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-bold text-lg group-hover:text-primary-600">Product Name</h3>
    <span className="badge badge-success">Popular</span>
  </div>
  <p className="text-gray-600 mb-6">Description...</p>
  <Button className="btn-primary w-full">Apply Now</Button>
</div>
```

### Stat Widget
```tsx
<div className="stat-card">
  <div className="stat-label">Total Users</div>
  <div className="stat-value">50,000+</div>
  <div className="stat-change-positive">
    <TrendingUp className="w-4 h-4" />
    <span>+12% this month</span>
  </div>
</div>
```

### Comparison Table Row
```tsx
<div className="grid grid-cols-4 border-b">
  <div className="comparison-cell font-semibold">Annual Fee</div>
  <div className="comparison-cell">₹0</div>
  <div className="comparison-cell comparison-cell-highlight">₹500</div>
  <div className="comparison-cell">₹999</div>
</div>
```

---

## ✅ Do's and Don'ts

### ✅ Do
- Use emerald for success/money actions
- Use navy for headers and dark sections
- Maintain 8px spacing grid
- Add hover states to all interactive elements
- Use semantic HTML (h1, nav, main, footer)

### ❌ Don't
- Mix too many colors (stick to palette)
- Use red for CTAs (use emerald)
- Forget mobile responsiveness
- Skip loading states
- Use absolute positioning excessively

---

## 🚀 Quick Start Template

```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-dark-bg text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Page Title</h1>
          <p className="text-gray-400 text-lg">Description</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cards */}
          <div className="data-card">
            <h3 className="font-bold mb-2">Card Title</h3>
            <p className="text-gray-600">Content...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Color Combinations

### Primary CTAs
```tsx
bg-primary-600 text-white hover:bg-primary-700
```

### Secondary CTAs
```tsx
bg-secondary-600 text-white hover:bg-secondary-700
```

### Outline Buttons
```tsx
border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-700
```

### Success Messages
```tsx
bg-primary-50 border border-primary-200 text-primary-700
```

### Warning Messages
```tsx
bg-accent-50 border border-accent-200 text-accent-700
```

---

**Pro Tip**: Use the browser DevTools to inspect existing components and copy their classes!
