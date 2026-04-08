# Admin UI/UX Overhaul — Conduit-Grade Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade InvestingPro admin UI/UX to match Conduit CMS quality — polished dark theme, glassmorphism, smooth animations, collapsible sidebar, real-time feel.

**Architecture:** The admin already has a theme file (`admin-theme.css`), layout components (`AdminLayout.tsx`, `AdminSidebar.tsx`), and 65+ pages. We upgrade the shared shell (sidebar, header, theme) so ALL pages inherit the polish without touching each page individually.

**Tech Stack:** Tailwind CSS 4, shadcn/ui, Radix UI, Framer Motion, Lucide icons, CSS variables

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `app/admin/admin-theme.css` | Modify | Add glassmorphism utilities, glow effects, gradient text, smooth transitions |
| `components/admin/AdminSidebar.tsx` | Modify | Collapsible sidebar with animation, logo area, collapse button |
| `components/admin/AdminLayout.tsx` | Modify | Update grid layout for collapsible sidebar, smooth transitions |
| `components/admin/AdminHeaderNav.tsx` | Modify | Polish header with glassmorphism, better category tabs |
| `components/admin/AdminPageContainer.tsx` | Modify | Add subtle entrance animations, consistent spacing |
| `components/admin/AdminPageHeader.tsx` | Modify | Gradient accents, polished typography |
| `app/admin/page.tsx` | Modify | Dashboard welcome banner, polished stat cards |

---

### Task 1: Upgrade Admin Theme CSS

**Files:**
- Modify: `app/admin/admin-theme.css`

- [ ] **Step 1: Add glassmorphism and glow utilities**

Add these utilities to `admin-theme.css` after the existing `.glass-hover` rules:

```css
/* Smooth transitions for all admin elements */
.admin-wealth-trust * {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass card with glow on hover */
.admin-wealth-trust .glass-card-glow:hover {
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.15),
                0 8px 32px rgba(0, 0, 0, 0.1);
}

.admin-wealth-trust.dark .glass-card-glow:hover {
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.25),
                0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Gradient text utility */
.admin-wealth-trust .admin-gradient-text {
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--info)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Sidebar collapsed state */
.admin-wealth-trust .sidebar-collapsed {
    width: 72px;
}

.admin-wealth-trust .sidebar-expanded {
    width: 260px;
}

/* Skeleton loader animation */
@keyframes admin-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.admin-wealth-trust .skeleton {
    background: linear-gradient(90deg, 
        hsl(var(--muted)) 25%, 
        hsl(var(--muted-foreground) / 0.1) 50%, 
        hsl(var(--muted)) 75%);
    background-size: 200% 100%;
    animation: admin-shimmer 1.5s infinite;
    border-radius: 0.5rem;
}

/* Custom scrollbar for admin */
.admin-wealth-trust ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.admin-wealth-trust ::-webkit-scrollbar-track {
    background: transparent;
}

.admin-wealth-trust ::-webkit-scrollbar-thumb {
    background: hsl(var(--border));
    border-radius: 3px;
}

.admin-wealth-trust ::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground));
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/admin-theme.css
git commit -m "style: admin theme — glassmorphism glow, gradient text, scrollbar, shimmer"
```

---

### Task 2: Collapsible Sidebar

**Files:**
- Modify: `components/admin/AdminSidebar.tsx`
- Modify: `components/admin/AdminLayout.tsx`

- [ ] **Step 1: Update AdminSidebar with collapse toggle**

Replace the AdminSidebar component with a version that:
- Accepts `collapsed` and `onToggle` props
- Shows only icons when collapsed (72px wide)
- Shows icons + labels when expanded (260px wide)
- Has a collapse/expand chevron button at the bottom
- Animates width transition (300ms cubic-bezier)
- Persists collapsed state in localStorage
- Tooltips on icons when collapsed (using title attribute)
- Logo/brand area at top that collapses to just icon

Key changes to the component:
- Add props: `collapsed: boolean`, `onToggle: () => void`
- Wrap labels in a span that hides when collapsed: `{!collapsed && <span>Label</span>}`
- Section titles hidden when collapsed
- User profile card shows only avatar when collapsed
- Chevron button at bottom toggles state

- [ ] **Step 2: Update AdminLayout grid for collapsible sidebar**

In AdminLayout.tsx, update:
- Add `sidebarCollapsed` state (persisted in localStorage)
- Pass `collapsed` and `onToggle` to AdminSidebar
- Update grid-cols to use dynamic width based on collapsed state
- Main content area fills remaining space with smooth transition

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminSidebar.tsx components/admin/AdminLayout.tsx
git commit -m "feat: collapsible admin sidebar with animation and persistence"
```

---

### Task 3: Polish Admin Header Navigation

**Files:**
- Modify: `components/admin/AdminHeaderNav.tsx`

- [ ] **Step 1: Read current AdminHeaderNav.tsx**

Understand the current category tabs/navigation pattern.

- [ ] **Step 2: Upgrade header with glassmorphism**

Update the header component:
- Add `backdrop-blur-md` and subtle border-b
- Category tabs with smooth underline animation on active
- Hover effects with subtle background transition
- Mobile hamburger with smooth drawer animation
- Add breadcrumb integration below tabs

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminHeaderNav.tsx
git commit -m "style: admin header — glassmorphism, smooth tab transitions"
```

---

### Task 4: Polish Dashboard Page

**Files:**
- Modify: `app/admin/page.tsx`

- [ ] **Step 1: Add welcome banner**

Add a welcome banner at top of dashboard:
- Time-aware greeting ("Good Morning/Afternoon/Evening")
- Subtitle: "Here's what's happening with your content"
- Gradient accent on the greeting text
- Quick action buttons: "Create Article", "View Analytics"

- [ ] **Step 2: Polish stat cards**

Update MetricBentoCard usage:
- Add `glass-card-glow` class for hover glow effect
- Ensure consistent spacing and border-radius
- Add subtle entrance animation (fade-up via Framer Motion)

- [ ] **Step 3: Commit**

```bash
git add app/admin/page.tsx
git commit -m "style: admin dashboard — welcome banner, polished stat cards"
```

---

### Task 5: Consistent Page Container Polish

**Files:**
- Modify: `components/admin/AdminPageContainer.tsx`
- Modify: `components/admin/AdminPageHeader.tsx`

- [ ] **Step 1: Read current AdminPageContainer and AdminPageHeader**

Understand current patterns and props.

- [ ] **Step 2: Add entrance animation to AdminPageContainer**

Wrap children in a Framer Motion `motion.div` with:
- `initial={{ opacity: 0, y: 8 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ duration: 0.2, ease: 'easeOut' }}`

This gives every admin page a subtle fade-up entrance.

- [ ] **Step 3: Polish AdminPageHeader**

- Add subtle gradient line under the header (2px, primary gradient)
- Ensure consistent typography (text-2xl font-bold for title, text-muted-foreground for description)
- Add optional icon prop rendering with colored background circle

- [ ] **Step 4: Commit**

```bash
git add components/admin/AdminPageContainer.tsx components/admin/AdminPageHeader.tsx
git commit -m "style: admin page container — entrance animation, header polish"
```

---

### Task 6: Verify and Fix Broken Links

**Files:**
- Read: `lib/admin/navigation-config.ts`
- Check: all paths in CATEGORIES and NAV_SECTIONS

- [ ] **Step 1: List all nav links**

Extract all `href` values from navigation-config.ts.

- [ ] **Step 2: Check each link has a corresponding page**

For each href, verify `app/admin/[path]/page.tsx` exists. List missing pages.

- [ ] **Step 3: Create placeholder pages for any missing routes**

For each missing page, create a minimal placeholder:
```tsx
'use client';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Construction } from 'lucide-react';

export default function PageName() {
    return (
        <AdminLayout>
            <AdminPageContainer>
                <AdminPageHeader title="Page Name" description="Coming soon" icon={Construction} />
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <div className="text-center">
                        <Construction className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Under Construction</p>
                        <p className="text-sm mt-1">This feature is being built.</p>
                    </div>
                </div>
            </AdminPageContainer>
        </AdminLayout>
    );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/
git commit -m "fix: add placeholder pages for all admin nav links — zero broken links"
```

---

### Task 7: Final Type Check and Push

- [ ] **Step 1: Run type check**

```bash
npm run type-check
```

Expected: 0 errors

- [ ] **Step 2: Push all changes**

```bash
git push origin master
```

---

## Execution Notes

- Tasks 1-5 are the visual overhaul (theme, sidebar, header, dashboard, pages)
- Task 6 is the broken links fix (critical for workflow)
- Task 7 is verification
- Each task is independent and can be committed separately
- Total estimated effort: ~45-60 minutes of implementation
- Can be split across sessions: Tasks 1-3 (session 1), Tasks 4-7 (session 2)
