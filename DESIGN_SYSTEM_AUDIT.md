# 🎨 DESIGN SYSTEM AUDIT

## 1. 🌈 COLOR SYSTEM STATUS
**Status: SEMI-STRUCTURED**
- You have a Tailwind Config with `primary` (Emerald), `secondary` (Blue), and `accent` (Amber).
- **CRITICAL GAP**: You lack **Semantic Category Tokens**.
    - "Banking" uses Blue in one place, Teal in another.
    - "Investing" uses Green usually, but inconsistently.
    - There is no `text-banking` or `bg-investing-surface` token.

## 2. 🧩 COMPONENT CONSISTENCY
### **CategoryHero.tsx**
- **Hardcoded Gradients**: Defines its own color map (`teal`, `indigo`, etc.).
- **Inflexible**: If you want to change "Banking" from Blue to Violet globally, you have to edit every component manually.
- **Button Styling**: Hardcodes `text-teal-600` for the primary button, assuming the background is Teal. This breaks dynamic theming.

## 3. 📱 RESPONSIVENESS & ACCESSIBILITY
- **Typography Check**:
    - Uses `Inter` (Body) and `JetBrains Mono` (Code/Data). **Good**.
    - Font sizes scale well (`sm:`, `lg:` prefixes usage is robust).
- **Contrast**:
    - White text on Gradient backgrounds (600-700 weight) generally passes WCAG AA.
- **Dark Mode**:
    - Config has a manual `dark` palette.
    - **Risk**: Native Tailwind `dark:` classes might clash with your custom `colors.dark` object. Recommend using Tailwind's standard `darkMode: 'class'` and `dark:bg-slate-900`.

## 4. 🛠️ ACTION PLAN (Design Unification)

### **Phase 1: Define Semantic Tokens (Tailwind)**
Add these to `tailwind.config.ts`:
```ts
colors: {
    category: {
        banking: colors.blue,
        investing: colors.emerald,
        loans: colors.indigo,
        cards: colors.purple,
    }
}
```

### **Phase 2: Refactor Components**
Update `CategoryHero` to use `bg-gradient-to-br from-category-banking-600` instead of raw colors.

### **Phase 3: Centralize Theme**
Create `lib/theme.ts` to map slugs to colors:
```ts
export const CATEGORY_THEMES = {
    'banking': 'blue',
    'investing': 'emerald',
    // ...
}
```
Use this "Source of Truth" in all components.
