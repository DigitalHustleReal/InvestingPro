# Bold Redesign Phase 1: Design Tokens + Navbar + Footer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current design system foundation (fonts, colors, spacing, border-radius) and ship a redesigned navbar + footer that establishes the new "Editorially Bold" identity across every page.

**Architecture:** Update CSS variables in globals.css, swap fonts in layout.tsx, modify tailwind.config.ts color tokens, then rebuild Navbar and Footer components with the new design language. All existing page content inherits the new tokens automatically.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS 4, Google Fonts (Playfair Display, Inter, JetBrains Mono), Lucide icons, shadcn/ui primitives.

**Design Spec:** `docs/superpowers/specs/2026-04-17-bold-redesign-design.md`

---

### Task 1: Update Font Imports in Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace font imports**

Replace DM_Sans and DM_Mono with Playfair Display, Inter, and JetBrains Mono:

```tsx
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});
```

Update the `<body>` className to include all three font variables:
```tsx
<body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans`}>
```

Remove old DM_Sans and DM_Mono imports and variables.

- [ ] **Step 2: Verify fonts load**

Run: `npm run dev`
Open browser DevTools → Elements → check `<body>` has all 3 CSS variables.
Expected: `--font-inter`, `--font-playfair`, `--font-mono` present.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(redesign): swap fonts to Playfair Display + Inter + JetBrains Mono"
```

---

### Task 2: Update Design Tokens in globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add new design tokens**

Add these tokens inside the `:root` selector (after existing variables, before `.dark`):

```css
/* === BOLD REDESIGN TOKENS === */
--ink: #0A1F14;
--authority-green: #166534;
--action-green: #16A34A;
--indian-gold: #D97706;
--canvas: #FAFAF9;
--warning-red: #DC2626;

/* Typography */
--font-display: var(--font-playfair), Georgia, serif;
--font-body: var(--font-inter), system-ui, sans-serif;
--font-data: var(--font-mono), 'Courier New', monospace;

/* Spacing scale (4px base) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;

/* Border radius override — sharp corners */
--radius: 0px;
--radius-sm: 0px;
--radius-md: 0px;
--radius-lg: 0px;
```

Update the `.dark` selector to add dark mode variants:
```css
.dark {
  --ink: #FAFAF9;
  --canvas: #0A1F14;
  --authority-green: #16A34A;
  --action-green: #4ADE80;
  --indian-gold: #FBBF24;
}
```

- [ ] **Step 2: Override shadcn border-radius globally**

Add at the bottom of globals.css `@layer base`:

```css
@layer base {
  * {
    border-color: theme(colors.border);
  }
  /* Sharp corners globally — override shadcn defaults */
  [class*="rounded"] {
    border-radius: 0px !important;
  }
}
```

Note: The `!important` is intentional — this is a global design decision, not a per-component override. We want ALL cards, buttons, inputs to have 0px radius.

- [ ] **Step 3: Verify tokens work**

Run: `npm run dev`
Open browser → inspect any card/button → confirm border-radius is 0px.
Check DevTools → computed styles → verify `--ink`, `--canvas` etc. resolve.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(redesign): add bold design tokens — ink, gold, sharp corners"
```

---

### Task 3: Update Tailwind Config

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add font families**

In the `theme.extend.fontFamily` section:

```ts
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  display: ['var(--font-playfair)', 'Georgia', 'serif'],
  data: ['var(--font-mono)', 'Courier New', 'monospace'],
  mono: ['var(--font-mono)', 'Courier New', 'monospace'],
},
```

- [ ] **Step 2: Add semantic color tokens**

Add to `theme.extend.colors`:

```ts
ink: 'var(--ink)',
canvas: 'var(--canvas)',
'authority-green': 'var(--authority-green)',
'action-green': 'var(--action-green)',
'indian-gold': 'var(--indian-gold)',
'warning-red': 'var(--warning-red)',
```

- [ ] **Step 3: Override border-radius**

In `theme.extend`:

```ts
borderRadius: {
  DEFAULT: '0px',
  sm: '0px',
  md: '0px',
  lg: '0px',
  xl: '0px',
  '2xl': '0px',
  full: '9999px', // keep full for avatars/badges only
},
```

- [ ] **Step 4: Verify Tailwind classes work**

Run: `npm run dev`
Add `className="font-display text-ink bg-canvas"` to any test element.
Expected: Playfair Display font, ink-colored text, canvas background.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(redesign): update tailwind config — display/data fonts, ink/gold colors, 0px radius"
```

---

### Task 4: Redesign Navbar

**Files:**
- Modify: `components/v2/layout/Navbar.tsx` (293 lines → rewrite)

- [ ] **Step 1: Rewrite Navbar component**

Replace the entire content of `components/v2/layout/Navbar.tsx` with the new bold design:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Landmark,
  Shield,
  BarChart3,
  Building2,
  Search,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SearchProvider } from "@/components/search/SearchProvider";

interface NavCategory {
  label: string;
  href: string;
  icon: LucideIcon;
}

const CATEGORIES: NavCategory[] = [
  { label: "Credit Cards", href: "/credit-cards", icon: CreditCard },
  { label: "Banking", href: "/banking", icon: Landmark },
  { label: "Loans", href: "/loans", icon: Building2 },
  { label: "Investing", href: "/investing", icon: TrendingUp },
  { label: "Insurance", href: "/insurance", icon: Shield },
  { label: "Demat Accounts", href: "/demat-accounts", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-ink dark:bg-[#0A1F14] dark:border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 group">
              <span className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">
                Investing
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-indian-gold">
                P₹o
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {CATEGORIES.map((cat) => {
                const isActive = pathname.startsWith(cat.href);
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`
                      px-3 py-2 font-data text-xs uppercase tracking-widest transition-colors
                      ${isActive
                        ? "text-action-green border-b-2 border-action-green"
                        : "text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-white"
                      }
                    `}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <SearchProvider>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 border-2 border-ink/20 hover:border-ink text-ink/60 hover:text-ink transition-colors dark:border-white/20 dark:text-white/60 dark:hover:text-white dark:hover:border-white"
                  aria-label="Search (Cmd+K)"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline font-data text-xs">Search</span>
                  <kbd className="hidden sm:inline font-data text-[10px] px-1 py-0.5 border border-ink/20 dark:border-white/20">
                    ⌘K
                  </kbd>
                </button>
              </SearchProvider>

              <Link
                href="/compare"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-action-green text-white font-data text-xs uppercase tracking-wider hover:bg-authority-green transition-colors"
              >
                Compare
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-ink dark:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#0A1F14] lg:hidden">
          <div className="pt-20 px-6">
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = pathname.startsWith(cat.href);
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-4 px-4 py-4 border-b border-ink/10 dark:border-white/10
                      ${isActive ? "text-action-green" : "text-ink dark:text-white"}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-data text-sm uppercase tracking-wider">{cat.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/articles"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-center bg-ink text-white dark:bg-white dark:text-ink font-data text-sm uppercase tracking-wider"
              >
                Read Articles
              </Link>
              <Link
                href="/calculators"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-center border-2 border-ink dark:border-white text-ink dark:text-white font-data text-sm uppercase tracking-wider"
              >
                Calculators
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-center bg-action-green text-white font-data text-sm uppercase tracking-wider"
              >
                Compare Products
              </Link>
            </div>

            {/* Trust signal */}
            <div className="mt-12 text-center">
              <p className="font-data text-[10px] uppercase tracking-widest text-ink/40 dark:text-white/40">
                No paid rankings · Methodology disclosed · SEBI-compliant
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify navbar renders**

Run: `npm run dev`
Check desktop: Logo with gold P₹o, monospace category links, square search box, green Compare button.
Check mobile (390px): Hamburger → full-screen overlay with icon list.

- [ ] **Step 3: Commit**

```bash
git add components/v2/layout/Navbar.tsx
git commit -m "feat(redesign): bold navbar — Playfair logo, monospace nav, sharp edges"
```

---

### Task 5: Redesign Footer

**Files:**
- Modify: `components/layout/Footer.tsx` (586 lines → rewrite)

- [ ] **Step 1: Rewrite Footer component**

Replace the entire content of `components/layout/Footer.tsx` with:

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Credit Cards", href: "/credit-cards" },
      { label: "Loans", href: "/loans" },
      { label: "Mutual Funds", href: "/mutual-funds" },
      { label: "Insurance", href: "/insurance" },
      { label: "Demat Accounts", href: "/demat-accounts" },
      { label: "Fixed Deposits", href: "/fixed-deposits" },
      { label: "Banking", href: "/banking" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "All Articles", href: "/articles" },
      { label: "Glossary", href: "/glossary" },
      { label: "Personal Finance", href: "/articles?category=personal-finance" },
      { label: "Tax Planning", href: "/articles?category=tax" },
      { label: "Investing Basics", href: "/articles?category=investing-basics" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "SIP Calculator", href: "/calculators/sip" },
      { label: "EMI Calculator", href: "/calculators/emi" },
      { label: "FD Calculator", href: "/calculators/fd" },
      { label: "Tax Calculator", href: "/calculators/tax" },
      { label: "All Calculators", href: "/calculators" },
      { label: "Compare Products", href: "/compare" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Editorial Standards", href: "/about/editorial-standards" },
      { label: "How We Rate", href: "/about/methodology" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Advertiser Disclosure", href: "/advertiser-disclosure" },
      { label: "Security", href: "/security" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-ink text-white">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            "No paid rankings",
            "Methodology disclosed",
            "SEBI-compliant advice",
            "228+ researched articles",
          ].map((item) => (
            <span
              key={item}
              className="font-data text-[11px] uppercase tracking-widest text-white/50"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-data text-[11px] uppercase tracking-[3px] text-indian-gold mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold">
              Investing<span className="text-indian-gold">P₹o</span>
            </span>
            <span className="font-data text-[10px] text-white/40 uppercase tracking-wider">
              India&apos;s Independent Finance Platform
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-data text-[11px] text-white/40">
              &copy; {new Date().getFullYear()} InvestingPro.in
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 border border-white/20 hover:border-white transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="font-data text-[10px] text-white/30 leading-relaxed">
            InvestingPro.in is an independent comparison platform. We may earn affiliate commissions
            when you apply through our links. Our rankings and reviews are never influenced by
            compensation. All information is for educational purposes and does not constitute
            financial advice. Please consult a SEBI-registered advisor before making investment
            decisions. Rates and offers are subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify footer renders**

Run: `npm run dev`
Scroll to bottom: Ink background, gold section headers in monospace, trust bar at top, clean 5-column grid.
Check mobile: 2-column grid collapses properly.
Check dark mode: Verify contrast.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(redesign): bold footer — ink bg, gold monospace headers, trust bar"
```

---

### Task 6: Type Check + Visual Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run type check**

```bash
npm run type-check
```

Expected: 0 errors. If SearchProvider import fails, check `components/search/SearchProvider.tsx` exists. If not, wrap the search button without the provider.

- [ ] **Step 2: Run dev server and verify all pages**

```bash
npm run dev
```

Check these pages:
- `/` — Homepage should show new navbar + footer with sharp corners everywhere
- `/credit-cards` — Navbar active state on "Credit Cards"
- `/articles` — Content area should inherit 0px border-radius
- `/calculators` — Font-data class should apply to number displays

- [ ] **Step 3: Commit all remaining changes and push**

```bash
git add -A
git commit -m "feat(redesign): Phase 1 complete — design tokens, navbar, footer"
git push origin master
```

---

## Phase 1 Complete Checklist

- [ ] Playfair Display + Inter + JetBrains Mono fonts loading
- [ ] CSS variables: --ink, --canvas, --authority-green, --action-green, --indian-gold
- [ ] All border-radius globally set to 0px (sharp corners)
- [ ] Navbar: Playfair logo with gold P₹o, monospace nav links, square search
- [ ] Footer: Ink background, gold monospace section headers, trust bar
- [ ] Mobile nav: Full-screen overlay with category icons
- [ ] Dark mode: Tokens swap correctly
- [ ] Type check passes
- [ ] Deployed to production
