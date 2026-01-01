# 🎨 UX & DESIGN AUDIT

## 1. 🌚 DARK MODE STATUS
**Status: BROKEN**
- `tailwind.config.ts` is missing `darkMode: 'class'`.
- **Result**: Toggling theme will likely do nothing or flash white/black.
- **Fix**: Add `darkMode: ['class']` to config.

## 2. 💀 SKELETON LOADING
**Status: NON-EXISTENT**
- Searched codebase for "Skeleton" -> 0 results.
- **Result**: Users see "Janky" loading (spinners or flashes of content).
- **Fix**: Install `shadcn/ui` Skeleton component and wrap `Suspense` boundaries.

## 3. 📖 READING EXPERIENCE
- **Typography**: Uses `prose-lg` (Good).
- **Contrast**: `text-slate-900` on white (Accessible).
- **Mobile**: Grid columns need to be `grid-cols-1` on mobile (Checked `ComparisonTable`, seemed responsive).

## 4. 🛠️ ACTION PLAN
1.  **Enforce Dark Mode**: Update `tailwind.config.ts`.
2.  **Add Skeletons**: Create `components/ui/skeleton.tsx` and implementation `ArticleSkeleton`.
3.  **Mobile Menu**: Verify the Hamburger Menu works (manual test needed).
