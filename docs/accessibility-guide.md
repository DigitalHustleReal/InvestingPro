# Accessibility Development Guide

## 🛡️ The 7-Layer Defense System

We use a comprehensive system to prevent accessibility issues. Here's how to work within it.

---

## 🚀 Quick Rules for Developers

1. **Buttons:** NEVER use `<div>` or `<span>` for buttons. Use `<button>` or `<AccessibleButton>`.
2. **Icons:** Icon-only buttons MUST have `aria-label`.
3. **Forms:** All inputs MUST have a label (visible or `aria-label`).
4. **Colors:** Use ONLY design system colors (`text-slate-300`, `text-gray-600`).
5. **Images:** All images MUST have `alt` text.

---

## 🛠️ Tools & Workflows

### 1. VS Code Snippets

Type these prefixes to get accessible code:
- `a11y-button` → Accessible button component
- `a11y-input` → Accessible form input
- `a11y-image` → Image with alt text

### 2. Linting (Automatic)

ESLint will catch issues as you type:
- 🔴 **Error:** Missing alt text
- 🔴 **Error:** Low contrast colors
- 🔴 **Error:** Missing labels

### 3. Pre-Commit Check

When you commit, we automatically run:
- Linting for accessibility
- Type checking
- Design system validation

**If the check fails:**
1. Read the error message
2. Fix the accessibility issue
3. Commit again

### 4. Continuous Integration

Every Pull Request is tested with:
- Lighthouse CI (must score 95+)
- axe-core audits
- ESLint checks

---

## 🧩 Component Library

### AccessibleButton

```tsx
import { AccessibleButton } from '@/templates/AccessibleButton';

// ✅ Correct
<AccessibleButton 
  onClick={save} 
  ariaLabel="Save changes"
  variant="primary"
>
  Save
</AccessibleButton>
```

### FormInput

```tsx
import { FormInput } from '@/components/admin/FormInput';

// ✅ Correct
<FormInput
  label="Email Address"
  autoComplete="email"
  required
  error={errors.email}
/>
```

---

## 🧪 Testing Checklist

Before opening a PR, perform these 3 checks:

1. **Keyboard Test**
   - Can you tab to every interactive element?
   - Can you trigger actions with Enter/Space?
   - Is the focus indicator always visible?

2. **Screen Reader Test** (optional but recommended)
   - Enable VoiceOver/NVDA
   - Can you navigate the page?
   - Do images have descriptions?

3. **Automated Test**
   ```bash
   npm run test:a11y
   ```

---

## 🎨 Design System Colors

**Allowed:**
- Dark Mode Text: `text-slate-200`, `text-slate-300` (min)
- Light Mode Text: `text-gray-900`, `text-gray-700`, `text-gray-600` (min)

**Forbidden:**
- ❌ `text-slate-400` (Too low contrast)
- ❌ `text-gray-400` (Too low contrast)
- ❌ `text-gray-300` (Too low contrast)

---

## ❓ Troubleshooting

**Q: My build failed with "Low Contrast".**
A: You likely used a forbidden color. Switch to `text-slate-300` or `text-gray-600`.

**Q: ESLint complains about "click-events-have-key-events".**
A: You added `onClick` to a `div`. Change it to a `<button>` or add `role="button"` and `tabIndex={0}`.

**Q: What if I have a decorative image?**
A: Use `alt=""` (empty string) to hide it from screen readers.
