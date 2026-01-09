# INVESTINGPRO.IN — PLATFORM BIBLE
## The Single Source of Truth

**Version:** 2.0
**Last Updated:** January 7, 2026
**Document Type:** Core Reference Material
**Review Cycle:** Quarterly

---


> *This document is the definitive reference for the InvestingPro.in platform. All other documentation files are deprecated. When in doubt, refer here.*

---

# TABLE OF CONTENTS

1. [Vision & Mission](#1-vision--mission)
2. [Platform Overview](#2-platform-overview)
3. [Technology Architecture](#3-technology-architecture)
4. [Feature Inventory](#4-feature-inventory)
5. [Content Strategy & Taxonomy](#5-content-strategy--taxonomy)
6. [AI & Automation Systems](#6-ai--automation-systems)
7. [SEO Infrastructure](#7-seo-infrastructure)
8. [Monetization Architecture](#8-monetization-architecture)
9. [Security & Compliance](#9-security--compliance)
10. [Database Schema Reference](#10-database-schema-reference)
11. [API Reference](#11-api-reference)
12. [Admin CMS Guide](#12-admin-cms-guide)
13. [Operational Playbooks](#13-operational-playbooks)
14. [Quality Standards](#14-quality-standards)
15. [Strategic Roadmap 2026-2030](#15-strategic-roadmap-2026-2030)
16. [Risk Register](#16-risk-register)
17. [Appendices](#17-appendices)

---

# 1. VISION & MISSION

## 1.1 Vision Statement

> **By 2030, InvestingPro.in will be India's most trusted, most read, and most automated personal finance platform — the NerdWallet of India, built with superior AI, premium content, and product-first design.**

## 1.2 Mission Statement

> To democratize financial knowledge for every Indian by leveraging AI to produce expert-quality, unbiased, actionable personal finance content at unprecedented scale.

## 1.3 Core Values

| Value | Meaning |
|:---|:---|
| **Accuracy First** | We never sacrifice correctness for speed. Every fact is verifiable. |
| **User Obsession** | We build for the confused first-time investor, not the expert. |
| **Automation Mindset** | If a human does it twice, a machine should do it forever. |
| **Radical Transparency** | We disclose affiliate relationships and methodology openly. |
| **India-First** | Every example, every number, every recommendation is Indian context. |

## 1.4 Competitive Positioning

| Competitor | Their Focus | Our Differentiation |
|:---|:---|:---|
| NerdWallet (US) | US market, legacy SEO | India-first, AI-native, modern tech |
| BankBazaar | Lead generation, transactions | Content authority, no spam |
| PolicyBazaar | Insurance dominance | Full-stack finance coverage |
| Moneycontrol | News, market data | Tools, comparisons, actionable guides |
| ET Money | App-first, MF transactions | Content SEO, web-first, open platform |
| Groww/Zerodha | Trading platforms | Education + comparison, not transactions |

## 1.5 The Moat We Are Building

1. **AI Velocity**: Generate 100x more content than human-only teams
2. **Quality at Scale**: AI + Human QA ensures expert-level accuracy
3. **SEO Compounding**: First-mover advantage on 50,000+ keywords
4. **Trust Signals**: Editorial team with verifiable credentials
5. **Data Assets**: Proprietary comparison data, user behavior insights

---

# 2. PLATFORM OVERVIEW

## 2.1 What Is InvestingPro.in?

InvestingPro.in is a **headless finance intelligence engine** that:
- Researches financial topics automatically
- Generates expert-quality content using AI
- Optimizes content for SEO and user engagement
- Distributes across multiple channels
- Monetizes through affiliate partnerships and advertising

## 2.2 Platform Statistics (As of January 2026)

| Metric | Current Value |
|:---|:---|
| Total Pages | ~300 (estimated) |
| Calculators | 12 active |
| Product Categories | 9 major verticals |
| AI Providers Configured | 5 (Gemini, Groq, Mistral, OpenAI, Claude) |
| Database Tables | 50+ |
| Components | 378 files |
| API Endpoints | 64 routes |

## 2.3 User Segments

| Segment | Description | Primary Need |
|:---|:---|:---|
| **First-Time Investors** | Age 22-30, starting career, confused | "What should I invest in?" |
| **Credit Seekers** | Need loans/cards, comparing options | "Which card is best for me?" |
| **Tax Planners** | Salaried, want to save tax | "How do I save tax under 80C?" |
| **Insurance Shoppers** | Major life events (marriage, child) | "Which term plan is best?" |
| **Wealth Builders** | 35+, growing wealth, sophisticated | "How do I optimize my portfolio?" |

---

# 3. UI/UX & DESIGN SYSTEM

## 3.1 Design Philosophy

> **"Premium Authority Platform"** — Clean, trustworthy, data-rich. Inspired by Bloomberg Terminal meets NerdWallet simplicity.

### Design Principles

| Principle | Description |
|:---|:---|
| **Trust First** | Financial UI must feel secure, not flashy. Avoid gimmicks. |
| **Data Density** | Show more information per screen than competitors. |
| **Mobile Priority** | 70%+ of Indian traffic is mobile. Design mobile-first. |
| **Dark Mode Native** | Default to dark theme (reduced eye strain for data-heavy screens). |
| **Accessibility** | WCAG 2.1 AA compliance. Readable by all users. |

---

## 3.2 Color System

### Primary Palette: Trust Teal

The brand color represents **growth, stability, and trust** — the perfect intersection for a finance platform.

| Token | Hex | Usage |
|:---|:---|:---|
| `primary-50` | `#f0fdfa` | Subtle backgrounds, hover states |
| `primary-100` | `#ccfbf1` | Light backgrounds, badges |
| `primary-200` | `#99f6e4` | Borders, dividers |
| `primary-300` | `#5eead4` | Icons, accents |
| `primary-400` | `#2dd4bf` | Hover states |
| `primary-500` | `#14b8a6` | Secondary buttons |
| **`primary-600`** | **`#0d9488`** | **MAIN BRAND COLOR** — Primary buttons, headers |
| `primary-700` | `#0f766e` | Pressed states, dark accents |
| `primary-800` | `#115e59` | Footer background (light mode) |
| `primary-900` | `#134e4a` | Dark backgrounds |
| `primary-950` | `#042f2e` | Deepest dark mode surfaces |

**Usage Rule:** Use `primary-600` for all CTA buttons, main headers, and brand elements.

### Secondary Palette: Information Blue

Used for **links, information badges, and trust signals**.

| Token | Hex | Usage |
|:---|:---|:---|
| `secondary-500` | `#3b82f6` | Info badges, highlights |
| `secondary-600` | `#2563eb` | Links, clickable text |
| `secondary-700` | `#1d4ed8` | Hover on links |

**Usage Rule:** All text links use `secondary-600` (not primary-600).

### Accent Palette: Amber Gold

Used for **secondary CTAs, warnings, and premium highlights**.

| Token | Hex | Usage |
|:---|:---|:---|
| `accent-500` | `#f59e0b` | Secondary CTAs, highlights |
| `accent-600` | `#d97706` | Badges, premium markers |

### Semantic Colors

| Purpose | Token | Hex | Example |
|:---|:---|:---|:---|
| Success/Gains | `success-500` | `#10b981` | +2.5% gains, "Approved" |
| Warning | `warning-500` | `#f59e0b` | "Review Required" |
| Danger/Loss | `danger-500` | `#ef4444` | -1.2% loss, "Rejected" |
| Info | `info-500` | `#3b82f6` | "New Feature" |

### Neutral Palette: Stone

| Token | Hex | Usage |
|:---|:---|:---|
| `stone-50` | `#FAFAF9` | Page background (light mode) |
| `stone-100` | `#F5F5F4` | Card backgrounds |
| `stone-200` | `#E7E5E4` | Borders, dividers |
| `stone-500` | `#78716C` | Secondary text |
| `stone-700` | `#44403C` | Primary text (light mode) |
| `stone-900` | `#1C1917` | Headers (light mode) |

### Dark Mode Surface Tokens

| Token | Hex | Usage |
|:---|:---|:---|
| `surface-dark` | `#020617` | Page background (dark mode) |
| `surface-darker` | `#0f172a` | Card backgrounds (dark mode) |
| `surface-darkest` | `#0a0c10` | Deep backgrounds |

---

## 3.3 Typography

### Font Stack

| Type | Font | Fallback | Usage |
|:---|:---|:---|:---|
| Sans | Inter | system-ui, sans-serif | Body text, UI |
| Serif | Source Serif 4 | Georgia, serif | Article headlines (optional) |
| Mono | JetBrains Mono | Courier New | Code, data |

### Type Scale

| Class | Size | Weight | Usage |
|:---|:---|:---|:---|
| `text-xs` | 0.75rem (12px) | 400 | Captions, labels |
| `text-sm` | 0.875rem (14px) | 400 | Secondary text, metadata |
| `text-base` | 1rem (16px) | 400 | Body text |
| `text-lg` | 1.125rem (18px) | 500 | Lead paragraphs |
| `text-xl` | 1.25rem (20px) | 600 | Card titles |
| `text-2xl` | 1.5rem (24px) | 700 | Section headers |
| `text-3xl` | 1.875rem (30px) | 700 | Page titles |
| `text-4xl` | 2.25rem (36px) | 800 | Hero headlines |
| `text-5xl` | 3rem (48px) | 800 | Large hero text |

### Typography Rules

1. **Body Text:** `text-base text-stone-700 dark:text-slate-300`
2. **Headers:** `text-2xl font-bold text-stone-900 dark:text-slate-100`
3. **Links:** `text-secondary-600 dark:text-secondary-400`
4. **Muted Text:** `text-sm text-stone-500 dark:text-slate-400`

---

## 3.4 Spacing System

| Token | Value | Usage |
|:---|:---|:---|
| `space-1` | 4px | Icon padding, tight gaps |
| `space-2` | 8px | Inline elements |
| `space-3` | 12px | Form field gaps |
| `space-4` | 16px | Card padding (mobile) |
| `space-6` | 24px | Card padding (desktop) |
| `space-8` | 32px | Section gaps |
| `space-12` | 48px | Major section breaks |
| `space-16` | 64px | Hero sections (mobile) |
| `space-20` | 80px | Hero sections (desktop) |

### Spacing Rules

1. **Mobile Padding:** `px-4` (16px)
2. **Desktop Padding:** `px-6` or `px-8` (24-32px)
3. **Card Internal:** `p-4` mobile, `p-6` desktop
4. **Section Gap:** `py-12` or `py-16`

---

## 3.5 Border Radius

| Token | Value | Usage |
|:---|:---|:---|
| `rounded-sm` | 4px | Data tables, small inputs |
| `rounded` / `rounded-base` | 8px | Buttons, small cards |
| `rounded-lg` | 12px | Cards, panels |
| `rounded-xl` | 16px | Modals, hero sections |
| `rounded-full` | 9999px | Avatars, pills |

**Rule:** Finance UI stays conservative. Max radius = 16px (no 3rem circles).

---

## 3.6 Shadows

| Token | Usage |
|:---|:---|
| `shadow-sm` | Subtle card elevation |
| `shadow-base` / `shadow-md` | Standard cards |
| `shadow-lg` | Hover states |
| `shadow-xl` | Modals, dropdowns |
| `shadow-primary` | Teal-tinted shadow for brand buttons |
| `shadow-accent` | Amber-tinted shadow for secondary CTAs |

---

## 3.7 Component Design Patterns

### Buttons

| Type | Classes |
|:---|:---|
| Primary | `bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 font-semibold shadow-primary` |
| Secondary | `bg-white dark:bg-slate-800 border border-primary-600 text-primary-600 hover:bg-primary-50` |
| Ghost | `text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800` |
| Danger | `bg-danger-500 hover:bg-danger-600 text-white` |

### Cards

```html
<!-- Light Mode -->
<div class="bg-white border border-stone-200 rounded-lg shadow-sm p-6">

<!-- Dark Mode -->
<div class="bg-slate-900/50 border border-slate-700 rounded-lg shadow-lg p-6">

<!-- Glass Effect (Dark Mode) -->
<div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-6">
```

### Forms

```html
<input class="w-full px-4 py-3 border border-stone-200 dark:border-slate-700 
              rounded-lg bg-white dark:bg-slate-900 
              text-stone-900 dark:text-slate-100
              focus:ring-2 focus:ring-primary-500 focus:border-transparent
              placeholder-stone-400" />
```

### Badges

```html
<!-- Category Badge -->
<span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
  Credit Cards
</span>

<!-- Success Badge -->
<span class="px-2 py-0.5 bg-success-100 text-success-700 rounded text-xs font-medium">
  +2.5%
</span>
```

---

## 3.8 Page Layout Templates

### Homepage Layout

```
┌─────────────────────────────────────────────┐
│                  NAVBAR                      │
├─────────────────────────────────────────────┤
│                  HERO                        │
│         (Smart Advisor Widget)               │
├─────────────────────────────────────────────┤
│              QUICK TOOLS                     │
│        (Calculators, Popular Links)          │
├─────────────────────────────────────────────┤
│            FEATURED PRODUCTS                 │
│         (Top Picks by Category)              │
├─────────────────────────────────────────────┤
│           CATEGORY DISCOVERY                 │
│         (Grid of All Categories)             │
├─────────────────────────────────────────────┤
│             LATEST INSIGHTS                  │
│          (Recent Articles)                   │
├─────────────────────────────────────────────┤
│              TRUST SECTION                   │
│     (Trust badges, Partner logos)            │
├─────────────────────────────────────────────┤
│                  FOOTER                      │
└─────────────────────────────────────────────┘
```

### Article Layout

```
┌─────────────────────────────────────────────┐
│                  NAVBAR                      │
├───────────────────────┬─────────────────────┤
│                       │                      │
│     ARTICLE CONTENT   │      SIDEBAR         │
│     (Prose styling)   │   - Author Card      │
│                       │   - TOC              │
│                       │   - Related Articles │
│                       │   - Affiliate CTAs   │
│                       │                      │
├───────────────────────┴─────────────────────┤
│                  FOOTER                      │
└─────────────────────────────────────────────┘
```

### Calculator Layout

```
┌─────────────────────────────────────────────┐
│                  NAVBAR                      │
├─────────────────────────────────────────────┤
│               PAGE HEADER                    │
│     (Calculator Name + Description)          │
├───────────────────────┬─────────────────────┤
│                       │                      │
│    CALCULATOR INPUT   │    RESULTS PANEL     │
│    (Form Fields)      │    (Charts/Output)   │
│                       │                      │
├───────────────────────┴─────────────────────┤
│             EXPLANATION SECTION              │
│        (How it works, Formula, FAQs)         │
├─────────────────────────────────────────────┤
│                  FOOTER                      │
└─────────────────────────────────────────────┘
```

---

## 3.9 Dark Mode Specifications

**Default Theme:** Dark mode (set in `layout.tsx`)

### Color Mapping (Light → Dark)

| Element | Light Mode | Dark Mode |
|:---|:---|:---|
| Page Background | `bg-stone-50` | `bg-slate-950` |
| Card Background | `bg-white` | `bg-slate-900` or `bg-white/5` |
| Primary Text | `text-stone-900` | `text-slate-100` |
| Secondary Text | `text-stone-600` | `text-slate-400` |
| Borders | `border-stone-200` | `border-slate-700` |
| Links | `text-secondary-600` | `text-secondary-400` |
| Primary Button | `bg-primary-600` | Same (no change) |

### Glass Effect (Dark Mode Only)

```css
.glass-card {
  @apply bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl;
}
```

Use for: Hero cards, feature highlights, premium sections.

---

## 3.10 Responsive Breakpoints

| Breakpoint | Width | Usage |
|:---|:---|:---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Rules

1. Default styles = mobile
2. Add `md:` or `lg:` for larger screens
3. Touch targets: minimum 44x44px
4. No hover-only interactions (use focus states)

---

## 3.11 Animation Guidelines

| Animation | Duration | Easing | Usage |
|:---|:---|:---|:---|
| `fade-in` | 500ms | ease-in | Page load |
| `slide-up` | 400ms | cubic-bezier | Card reveal |
| `scale-in` | 300ms | cubic-bezier | Button press |
| `shimmer` | 1500ms | linear | Loading states |

**Rule:** Keep animations subtle. Finance users want speed, not spectacle.

---

## 3.12 Icon System

**Library:** Lucide React (`lucide-react`)

### Icon Sizes

| Size | Class | Usage |
|:---|:---|:---|
| Small | `w-4 h-4` | Inline with text |
| Medium | `w-5 h-5` | Buttons, list items |
| Large | `w-6 h-6` | Feature icons |
| Extra Large | `w-8 h-8` | Hero sections |

### Icon Colors

- **Default:** `text-stone-500 dark:text-slate-400`
- **Active:** `text-primary-600`
- **Danger:** `text-danger-500`
- **Success:** `text-success-500`

---

## 3.13 Known UI Issues (To Fix)

| Issue | Location | Fix |
|:---|:---|:---|
| Hardcoded indigo selection | `globals.css` line 8 | Change to `selection:bg-primary-500/30` |
| Some hex colors in components | Various files | Replace with `primary-*` tokens |
| Inconsistent dark mode | Some calculators | Audit and apply `dark:` variants |

---

## 3.14 Design System File Locations

| Purpose | File |
|:---|:---|
| Tailwind Config | `tailwind.config.ts` |
| Global Styles | `app/globals.css` |
| Theme Provider | `components/theme-provider.tsx` |
| Base UI Components | `components/ui/*.tsx` |
| Layout Components | `components/layout/*.tsx` |

---

## 3.15 Visual Content & Media

### Image Generation System

**Location:** `lib/images/`

| Service | File | Purpose |
|:---|:---|:---|
| AI Image Generator | `ai-image-generator.ts` | Generate custom images via AI |
| Featured Image Generator | `featured-image-generator.ts` | Auto-generate article hero images |
| Stock Image Service | `stock-image-service.ts` | Fetch from Pexels/Unsplash |
| Enhanced Stock Service | `stock-image-service-enhanced.ts` | Advanced stock image with fallbacks |

#### Featured Image Standards

| Element | Specification |
|:---|:---|
| Dimensions | 1200×630px (OG standard) |
| Format | WebP preferred, JPEG fallback |
| File Size | <200KB optimized |
| Style | Clean, professional, finance-themed |
| Fallback | Gradient placeholder with category icon |

#### Image Storage

- **Location:** Supabase Storage bucket
- **CDN:** Supabase CDN with automatic optimization
- **Alt Text:** Auto-generated via `api/auto-alt-text`

### In-Article Visuals

**Location:** `lib/visuals/`

| File | Purpose |
|:---|:---|
| `generator.ts` | Generate article infographics |
| `ImageService.ts` | Image fetching and processing |
| `types.ts` | Visual content type definitions |

#### Supported Visual Types

| Type | Usage | CSS Class |
|:---|:---|:---|
| Hero Image | Article header | `.featured-image` |
| Inline Images | Within content | `.prose img` |
| Infographics | Data visualization | `.infographic` |
| Charts | Dynamic data | React components |
| Comparison Tables | Product comparisons | `.comparison-grid` |

### Charts & Data Visualization

**Location:** `components/charts/`

| Component | File | Usage |
|:---|:---|:---|
| Portfolio Allocation | `PortfolioAllocationChart.tsx` | Pie/donut for asset allocation |
| SIP Returns | `SIPReturnsChart.tsx` | Line chart for SIP projections |
| Stock Price | `StockPriceChart.tsx` | Line chart for price history |

#### Chart Libraries

- **Primary:** Recharts (`recharts`)
- **Alternative:** Chart.js (`react-chartjs-2`)

#### Chart Color Palette

```typescript
const chartColors = {
  primary: '#0d9488',    // Teal
  secondary: '#3b82f6',  // Blue
  accent: '#f59e0b',     // Amber
  success: '#10b981',    // Green
  danger: '#ef4444',     // Red
  neutral: '#64748b',    // Gray
};
```

### Article Content Widgets

**Location:** `app/articles/[slug]/article-content.css`

| Widget | CSS Class | Purpose |
|:---|:---|:---|
| Key Takeaways | `.key-takeaways` | Summary box with checkmarks |
| Pro Tip | `.pro-tip` | Expert advice callout |
| Quick Verdict | `.quick-verdict` | TL;DR summary |
| Warning Box | `.warning-box` | Caution/disclaimer |
| Metric Card | `.metric-card` | Single data point display |
| Comparison Grid | `.comparison-grid` | Side-by-side comparison |
| Allocation Bar | `.allocation-bar` | Visual percentage bar |

#### Widget HTML Structure

**Key Takeaways:**
```html
<div class="key-takeaways">
  <h3>🎯 Key Takeaways</h3>
  <ul>
    <li>Point one with clear value</li>
    <li>Point two with actionable advice</li>
  </ul>
</div>
```

**Pro Tip:**
```html
<div class="pro-tip">
  <h4>💡 Pro Tip</h4>
  <p>Actionable expert advice here...</p>
</div>
```

**Warning Box:**
```html
<div class="warning-box">
  <h4>⚠️ Warning</h4>
  <p>Important caution or disclaimer...</p>
</div>
```

### Table Formatting

**Article Tables (Prose):**
```css
.prose table {
  /* Dark gradient header */
  /* Hover row highlight */
  /* 12px border radius */
  /* Box shadow elevation */
}
```

**Data Tables (Comparison):**
- Use `ComparisonTable.tsx` component
- Supports winner/loser highlighting
- Mobile responsive with horizontal scroll

### Known Visual Issues

| Issue | Location | Status |
|:---|:---|:---|
| Hardcoded colors in article-content.css | Line 9, 299, etc. | ⚠️ Needs migration to tokens |
| Some chart colors not from palette | Chart components | ⚠️ Needs audit |
| Featured image fallback inconsistent | Various pages | ⚠️ Needs standardization |
| Dark mode for article prose | article-content.css | ⚠️ Incomplete |

### Visual Content Generation Workflow

```
ARTICLE CREATION
      │
      ▼
[Content Generated] ──▶ [Featured Image Service]
      │                         │
      │                         ▼
      │                 [AI Image Generator]
      │                         │
      │                         ▼
      │                 [Upload to Supabase]
      │                         │
      ▼                         ▼
[Inline Visuals] ◀────── [Return Image URL]
      │
      ▼
[Chart Components if data]
      │
      ▼
[Publish with All Visuals]
```

---

# 4. TECHNOLOGY ARCHITECTURE

## 3.1 Tech Stack Summary

| Layer | Technology | Version | Purpose |
|:---|:---|:---|:---|
| **Frontend** | Next.js (App Router) | 16.x | SSR, ISR, SEO |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **UI Components** | Shadcn/ui + Radix | Latest | Accessible components |
| **Database** | Supabase (PostgreSQL) | Latest | Data persistence, RLS |
| **Authentication** | Supabase Auth | Latest | User management |
| **AI Providers** | Multi-provider | Various | Content generation |
| **Hosting** | Vercel | Latest | Edge deployment |
| **Analytics** | Custom + GA4 | - | User tracking |

## 3.2 Directory Structure

```
InvestingPro_App/
├── app/                    # Next.js App Router pages
│   ├── [category]/         # Dynamic category routes
│   ├── admin/              # Admin CMS (35 routes)
│   ├── api/                # API routes (64 endpoints)
│   ├── calculators/        # Financial calculators
│   ├── compare/            # Comparison engine
│   └── ...                 # Other page routes
├── components/             # React components (378 files)
│   ├── admin/              # Admin UI components
│   ├── common/             # Shared components
│   ├── home/               # Homepage sections
│   ├── monetization/       # Affiliate/Ad components
│   └── ui/                 # Shadcn base components
├── lib/                    # Core business logic (157 files)
│   ├── ai/                 # AI provider integrations
│   ├── automation/         # Content automation
│   ├── scraper/            # Data scrapers
│   ├── seo/                # SEO utilities
│   └── supabase/           # Database clients
├── scripts/                # Standalone automation scripts (92 files)
├── supabase/               # Database migrations (55 migrations)
└── types/                  # TypeScript definitions
```

## 3.3 Key Configuration Files

| File | Purpose |
|:---|:---|
| `next.config.ts` | Next.js configuration, security headers, redirects |
| `tailwind.config.ts` | Design system tokens, colors, typography |
| `middleware.ts` | Authentication, route protection |
| `.env.local` | Environment variables (secrets) |
| `package.json` | Dependencies, scripts |

## 3.4 Environment Variables Required

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers (at least one required)
GOOGLE_GEMINI_API_KEY=
GROQ_API_KEY=
MISTRAL_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Optional
NEXT_PUBLIC_BASE_URL=https://investingpro.in
NEXT_PUBLIC_GA_ID=
SERPAPI_KEY=
ALPHA_VANTAGE_API_KEY=
```

## 3.5 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           VERCEL EDGE NETWORK                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   Static CDN    │  │   Middleware    │  │   Serverless Functions  │  │
│  │   (ISR Cache)   │  │   (Auth Check)  │  │   (API Routes)          │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
          ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
          │  SUPABASE   │  │ AI PROVIDERS│  │  EXTERNAL   │
          │  PostgreSQL │  │ Gemini/GPT/ │  │    APIs     │
          │  + Storage  │  │ Claude/etc  │  │ (SerpAPI)   │
          └─────────────┘  └─────────────┘  └─────────────┘
```

---

# 4. FEATURE INVENTORY

## 4.1 User-Facing Features

### 4.1.1 Content Pages

| Feature | Route | Status | Description |
|:---|:---|:---|:---|
| Homepage | `/` | ✅ Active | Hero, advisor widget, featured products |
| Category Pages | `/[category]` | ✅ Active | Pillar pages for each vertical |
| Article Pages | `/article/[slug]` | ✅ Active | Long-form content |
| Product Pages | `/[category]/[slug]` | ✅ Active | Individual product reviews |
| Comparison Pages | `/compare` | ✅ Active | Side-by-side product comparison |
| Glossary | `/glossary` | ✅ Active | Financial terms dictionary |
| Author Pages | `/author/[slug]` | ✅ Active | AI persona profiles |

### 4.1.2 Calculators

| Calculator | Route | Status |
|:---|:---|:---|
| SIP Calculator | `/calculators/sip` | ✅ Active |
| EMI Calculator | `/calculators/emi` | ✅ Active |
| FD Calculator | `/calculators/fd` | ✅ Active |
| Tax Calculator | `/calculators/tax` | ✅ Active |
| Retirement Planner | `/calculators/retirement` | ✅ Active |
| PPF Calculator | `/calculators/ppf` | ✅ Active |
| NPS Calculator | `/calculators/nps` | ✅ Active |
| Lumpsum Calculator | `/calculators/lumpsum` | ✅ Active |
| SWP Calculator | `/calculators/swp` | ✅ Active |
| Goal Planner | `/calculators/goal-planning` | ✅ Active |
| Inflation Calculator | `/calculators/inflation-adjusted-returns` | ✅ Active |
| GST Calculator | `/calculators/gst` | ✅ Active |

### 4.1.3 Tools & Utilities

| Tool | Route | Status |
|:---|:---|:---|
| Product Search | `/search` | ✅ Active |
| Risk Profiler | `/risk-profiler` | ✅ Active |
| Recommendations | `/recommendations` | ✅ Active |
| Portfolio Tracker | `/portfolio` | ✅ Active |

## 4.2 Admin CMS Features

| Feature | Route | Status | Description |
|:---|:---|:---|:---|
| Dashboard | `/admin` | ✅ Active | Overview metrics |
| Articles Manager | `/admin/articles` | ✅ Active | CRUD for articles |
| Products Manager | `/admin/products` | ✅ Active | CRUD for products |
| Glossary Manager | `/admin/glossary` | ✅ Active | CRUD for terms |
| Authors Manager | `/admin/authors` | ✅ Active | AI persona management |
| Media Library | `/admin/media` | ✅ Active | Image management |
| AI Content Writer | `/admin/ai-writer` | ✅ Active | Generate content |
| SEO Tools | `/admin/seo` | ✅ Active | Meta optimization |
| Analytics | `/admin/analytics` | ✅ Active | Performance data |

## 4.3 API Endpoints Summary

### Content APIs
- `GET/POST /api/articles` — Article CRUD
- `GET/POST /api/products` — Product CRUD
- `GET/POST /api/glossary` — Glossary CRUD

### Automation APIs
- `POST /api/generate-articles` — Trigger AI generation
- `POST /api/pipeline/run` — Run content pipeline
- `GET /api/cron/strategy` — Scheduled strategy execution

### Utility APIs
- `POST /api/auto-tags` — Auto-generate tags
- `POST /api/auto-categorize` — Auto-categorize content
- `POST /api/seo/optimize` — Optimize SEO metadata

---

# 5. CONTENT STRATEGY & TAXONOMY

## 5.1 Category Architecture

```
InvestingPro.in
├── Credit Cards (/credit-cards)
│   ├── Best Credit Cards
│   ├── Rewards Cards
│   ├── Travel Cards
│   ├── Cashback Cards
│   └── Student Cards
├── Loans (/loans)
│   ├── Personal Loans
│   ├── Home Loans
│   ├── Car Loans
│   ├── Education Loans
│   └── Business Loans
├── Investing (/investing)
│   ├── Mutual Funds
│   ├── Stocks
│   ├── Fixed Deposits
│   ├── PPF & NPS
│   └── Gold
├── Insurance (/insurance)
│   ├── Term Insurance
│   ├── Health Insurance
│   ├── Car Insurance
│   └── Life Insurance
├── Banking (/banking)
│   ├── Savings Accounts
│   ├── Demat Accounts
│   └── Trading Accounts
├── Taxes (/taxes)
│   ├── Income Tax
│   ├── Tax Saving
│   └── ITR Filing
└── Small Business (/small-business)
    ├── Business Loans
    ├── Business Credit Cards
    └── GST & Compliance
```

## 5.2 Content Types & Standards

| Type | Word Count | Quality Tier | Update Frequency |
|:---|:---|:---|:---|
| Pillar Page | 3,000-5,000 | Human-Heavy | Quarterly |
| Product Review | 1,500-2,500 | AI + Human QA | On product change |
| Comparison | 2,000-3,000 | AI + Human QA | Monthly |
| Explainer Article | 1,000-1,500 | AI + Light QA | Annually |
| Glossary Term | 300-500 | Fully Automated | Set and forget |
| News/Update | 500-800 | AI + Quick QA | Real-time |

## 5.3 Content Targets by Year

| Content Type | 2026 | 2027 | 2028 | 2029 | 2030 |
|:---|:---|:---|:---|:---|:---|
| Pillar Pages | 31 | 50 | 75 | 90 | 100 |
| Product Reviews | 500 | 2,000 | 5,000 | 8,000 | 10,000 |
| Comparison Pages | 200 | 1,000 | 3,000 | 7,000 | 10,000 |
| Explainer Articles | 500 | 2,000 | 5,000 | 10,000 | 15,000 |
| Glossary Terms | 500 | 1,000 | 1,500 | 1,800 | 2,000 |
| **Total Pages** | **1,731** | **6,050** | **14,575** | **26,890** | **37,100** |

---

# 6. AI & AUTOMATION SYSTEMS

## 6.1 AI Service Architecture

**Primary File:** `lib/ai-service.ts`

### Provider Fallback Chain
```
Priority Order:
1. Groq (Llama 3.1 8B) → Fast, cost-effective
2. Mistral (Small) → Stable, European
3. OpenAI (GPT-4o-mini) → Industry standard
4. Claude (Haiku) → High quality
5. Gemini → Currently disabled (SDK issues)
```

### Core Methods
```typescript
// Text generation with fallback
aiService.generate(prompt, { format: 'text' | 'json' })

// Structured JSON output
aiService.generateJSON<T>(prompt)

// Domain-specific generators
aiService.generateProduct(name, category)
aiService.generateArticle(topic, keywords)

// Health check
aiService.getStatus() // Returns active providers
```

### Quality Controls
- JSON validation for structured output
- Markdown code block stripping
- Automatic fallback on provider failure
- Error logging via `lib/logger.ts`

## 6.2 Content Generation Pipeline

```
RESEARCH → GENERATE → QUALITY → OPTIMIZE → APPROVE → PUBLISH
   │          │          │          │          │         │
   ▼          ▼          ▼          ▼          ▼         ▼
Keywords   AI Draft   Plagiarism  Internal   Human    Database
SERP       SEO Meta   Fact-Check  Linking    QA       Sitemap
Gaps       Structure  Readability Schema     Edit     Index
```

## 6.3 Automation Scripts Inventory

| Script | Purpose | Trigger Method |
|:---|:---|:---|
| `master-content-generation.ts` | Orchestrated generation | Manual |
| `auto-content-strategy.ts` | Identify content gaps | Manual/Cron |
| `auto-generate-and-publish.ts` | End-to-end pipeline | Manual |
| `populate-products-ai.ts` | Product data population | Manual |
| `generate-glossary.ts` | Glossary term generation | Manual |
| `populate-all-products.ts` | Bulk product creation | Manual |

### Current State vs Target State

| Aspect | Current | Target |
|:---|:---|:---|
| Trigger | Manual script execution | Event-driven API/Cron |
| Scheduling | None | Vercel Cron every 6 hours |
| Human QA | Optional | Mandatory before publish |
| Feedback | None | GSC data → AI improvement |

## 6.4 AI Personas (Authors System)

**Schema:** `supabase/migrations/20260103_authors_system.sql`

| Persona | Role | Expertise | Categories |
|:---|:---|:---|:---|
| Arjun Sharma | Author | Banking, Credit Cards, Loans | credit-cards, loans, investing |
| Rajesh Mehta | Editor | Compliance, Fact-Checking | All categories |

### Auto-Assignment Logic
- New content auto-assigned author based on category
- Editor assigned via load balancing (least reviews)
- Author stats tracked per publication

---

# 7. SEO INFRASTRUCTURE

## 7.1 On-Page SEO Components

| Component | Location | Purpose |
|:---|:---|:---|
| SEOHead | `components/common/SEOHead.tsx` | Meta tags, OG tags, Twitter cards |
| Structured Data | Inline JSON-LD | Schema.org markup |
| Sitemap | `app/sitemap.ts` | Dynamic XML sitemap |
| Robots | `app/robots.ts` | Crawler directives |

## 7.2 Sitemap Coverage

Dynamic sitemap includes:
- Homepage (priority 1.0)
- Category pages (priority 0.9)
- Subcategory pages (priority 0.8)
- Calculator pages (priority 0.9)
- Articles (priority 0.7)
- Products (priority 0.8)
- Glossary terms (priority 0.7)
- Static pages (privacy, terms, etc.)

## 7.3 Schema.org Implementation

| Content Type | Schema | Status |
|:---|:---|:---|
| Organization | Organization | ✅ Complete |
| Articles | Article/NewsArticle | ✅ Complete |
| Products | Product/AggregateRating | ✅ Complete |
| Glossary | DefinedTerm | ✅ Complete |
| FAQs | FAQPage | ✅ Complete |
| Calculators | WebApplication | ⚠️ Partial |
| How-To Guides | HowTo | ⚠️ Partial |
| Comparisons | ItemList | ⚠️ Partial |

## 7.4 Internal Linking System

**Location:** `lib/linking/`

- `auto-linker.ts` — Automated link injection
- `link-analyzer.ts` — Link graph analysis
- `orphan-detector.ts` — Find unlinked pages
- `anchor-optimizer.ts` — Optimize anchor text

**Current State:** Partially implemented, not fully automated

## 7.5 SEO Targets

| Metric | Current | 2026 | 2027 | 2030 |
|:---|:---|:---|:---|:---|
| Indexed Pages | ~100 | 2,000 | 10,000 | 50,000 |
| Domain Authority | ~10 | 30 | 45 | 60+ |
| Monthly Organic | ~1K | 100K | 1M | 25M |
| #1 Rankings | ~5 | 100 | 500 | 5,000+ |

---

# 8. MONETIZATION ARCHITECTURE

## 8.1 Revenue Streams

| Stream | Status | Revenue Potential |
|:---|:---|:---|
| Affiliate Commissions | ✅ Components exist | ₹5-50/click |
| Lead Generation | ⚠️ Partial | ₹200-2000/lead |
| Display Advertising | ⚠️ Placeholder | ₹50-200 CPM |
| Sponsored Content | ❌ Not implemented | ₹50K-2L/article |
| Premium Subscriptions | ✅ Stripe integrated | ₹199-1999/month |

## 8.2 Monetization Components

| Component | Location | Purpose |
|:---|:---|:---|
| AdSlot | `components/monetization/AdSlot.tsx` | Display ad placements |
| ContextualAffiliateLink | `components/monetization/ContextualAffiliateLink.tsx` | Smart affiliate links |
| ContextualCTA | `components/monetization/ContextualCTA.tsx` | Dynamic CTAs |
| SmartContextualOffers | `components/monetization/SmartContextualOffers.tsx` | Personalized offers |
| LeadMagnet | `components/monetization/LeadMagnet.tsx` | Email capture |
| DisclosureBlock | `components/monetization/DisclosureBlock.tsx` | Compliance disclosure |

## 8.3 Priority Affiliate Partners

| Category | Partners |
|:---|:---|
| Credit Cards | HDFC, ICICI, Axis, SBI Card, Amex |
| Loans | Bajaj Finserv, HDFC, ICICI, Tata Capital |
| Insurance | PolicyBazaar, Digit, Acko |
| Investing | Zerodha, Groww, Upstox, Angel One |
| Banking | Kotak, IDFC First, Fi, Jupiter |

---

# 9. THIRD-PARTY INTEGRATIONS

## 9.1 Service Overview

| Service | Purpose | Location | Free Tier |
|:---|:---|:---|:---|
| Sentry | Error monitoring | `sentry.*.config.ts` | 5K errors/month |
| Resend | Transactional email | `lib/email/resend-service.ts` | 100 emails/day |
| Upstash Redis | Caching, rate limiting | `lib/cache/redis-service.ts` | 10K commands/day |
| PostHog | Product analytics | `lib/analytics/posthog-service.ts` | 1M events/month |
| Stripe | Payments | `lib/payments/stripe-service.ts` | Pay per transaction |
| Cloudinary | Image storage/CDN | `lib/images/cloudinary-service.ts` | 25K transforms/mo |
| Vercel Cron | Scheduled tasks | `vercel.json` | 1/day on Hobby |

## 9.2 Environment Variables Required

```env
# Sentry
NEXT_PUBLIC_SENTRY_DSN=

# Resend
RESEND_API_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 9.3 API Endpoints

| Endpoint | Method | Purpose |
|:---|:---|:---|
| `/api/health` | GET | Service status check |
| `/api/payments/checkout` | POST | Create Stripe checkout |
| `/api/payments/webhook` | POST | Stripe event handler |

## 9.4 Health Check Response

```json
{
  "status": "ok",
  "services": {
    "supabase": { "status": "ok", "latency": 45 },
    "redis": { "status": "ok", "latency": 12 },
    "stripe": { "status": "ok" },
    "sentry": { "status": "ok" },
    "resend": { "status": "not_configured" },
    "posthog": { "status": "ok" },
    "ai": { "status": "ok", "providers": ["groq", "mistral"] }
  }
}
```

## 8.4 Revenue Projections

| Year | Monthly Revenue | Annual Revenue |
|:---|:---|:---|
| 2026 | ₹50K-2L | ₹6L-24L |
| 2027 | ₹5-10L | ₹60L-1.2Cr |
| 2028 | ₹25-50L | ₹3-6Cr |
| 2029 | ₹1-2Cr | ₹12-24Cr |
| 2030 | ₹5Cr+ | ₹60Cr+ |

---

# 9. SECURITY & COMPLIANCE

## 9.1 Authentication

**Implementation:** Supabase Auth via middleware

### ⚠️ CRITICAL ISSUE: Auth Bypass

**File:** `middleware.ts`

```typescript
// DANGEROUS CODE - FIX IMMEDIATELY
if (!isProduction || !hasSupabaseConfig) {
    return response; // Bypasses all authentication
}
```

**Risk:** Admin panel open in non-production environments
**Fix:** Remove bypass, implement proper environment handling

## 9.2 Row Level Security (RLS)

All tables use RLS policies:
- Public read for published content
- Authenticated access for user data
- Service role for admin operations

## 9.3 Security Headers

Implemented in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 9.4 Compliance Checklist

| Requirement | Status |
|:---|:---|
| Affiliate Disclosure | ✅ Complete |
| Privacy Policy | ✅ Needs legal review |
| Terms of Service | ✅ Needs legal review |
| Cookie Consent | ✅ GDPR compliant |
| Investment Disclaimer | ⚠️ Needs enhancement |

---

# 10. DATABASE SCHEMA REFERENCE

## 10.1 Core Tables

### articles
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
content TEXT
category TEXT
status TEXT DEFAULT 'draft'
author_id UUID REFERENCES authors
editor_id UUID REFERENCES authors
published_date TIMESTAMP
seo_title TEXT
seo_description TEXT
views_count INTEGER DEFAULT 0
```

### products
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
product_type TEXT NOT NULL
provider_name TEXT
description TEXT
rating DECIMAL
features JSONB
pros TEXT[]
cons TEXT[]
affiliate_link TEXT
is_active BOOLEAN DEFAULT true
```

### authors
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
role TEXT NOT NULL
title TEXT NOT NULL
bio TEXT NOT NULL
credentials TEXT[]
is_ai_persona BOOLEAN DEFAULT true
ai_system_prompt TEXT
assigned_categories TEXT[]
active BOOLEAN DEFAULT true
```

### glossary_terms
```sql
id UUID PRIMARY KEY
term TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
definition TEXT NOT NULL
category TEXT
author_id UUID REFERENCES authors
status TEXT DEFAULT 'draft'
views_count INTEGER DEFAULT 0
```

## 10.2 Migration Location

All migrations: `supabase/migrations/`

Key files:
- `20260101_consolidated_schema.sql`
- `20260103_authors_system.sql`
- `20260103_content_automation_schema.sql`
- `20260104_affiliate_router.sql`

---

# 11. API REFERENCE

## 11.1 Content APIs

| Method | Endpoint | Purpose |
|:---|:---|:---|
| GET | `/api/articles` | List articles |
| POST | `/api/articles` | Create article |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |

## 11.2 Automation APIs

| Method | Endpoint | Purpose |
|:---|:---|:---|
| POST | `/api/generate-articles` | Trigger AI generation |
| POST | `/api/pipeline/run` | Run content pipeline |
| GET | `/api/cron/strategy` | Scheduled execution |

## 11.3 Utility APIs

| Method | Endpoint | Purpose |
|:---|:---|:---|
| POST | `/api/auto-tags` | Generate tags |
| POST | `/api/auto-categorize` | Categorize content |
| POST | `/api/seo/optimize` | Optimize SEO |

---

# 12. ADMIN CMS GUIDE

## 12.1 Access

**URL:** `/admin`
**Auth:** Required in production

## 12.2 Key Workflows

### Create Article
1. Go to `/admin/articles` → New Article
2. Fill title, category, content (or use AI Writer)
3. Review and edit
4. Set status to "Published"
5. Save

### Add Product
1. Go to `/admin/products` → New Product
2. Select type, fill details (or use AI Population)
3. Add affiliate links
4. Activate

### Generate AI Content
1. Go to `/admin/ai-writer`
2. Enter topic and keywords
3. Generate and review
4. Approve for publication

---

# 13. OPERATIONAL PLAYBOOKS

## 13.1 Daily Tasks

- Check error logs
- Review AI content queue
- Monitor traffic anomalies
- Process affiliate reports

## 13.2 Weekly Tasks

- Run content strategy analysis
- Keyword research update
- Performance review
- Backlink acquisition

## 13.3 Monthly Tasks

- Content refresh audit
- Security review
- Revenue reconciliation
- Competitor analysis

## 13.4 Quarterly Tasks

- Platform Bible review
- Strategy review
- Feature planning
- Compliance audit

---

# 14. QUALITY STANDARDS

## 14.1 Content Quality Checklist

### Accuracy
- [ ] All facts verifiable
- [ ] Numbers current (< 6 months)
- [ ] Sources cited
- [ ] No AI hallucinations

### SEO
- [ ] Primary keyword in title
- [ ] Meta description 150-160 chars
- [ ] Proper header hierarchy
- [ ] 3-5 internal links minimum
- [ ] Images have alt text

### User Experience
- [ ] Answers user intent
- [ ] Simple language (8th grade level)
- [ ] India-specific examples
- [ ] ₹ symbol used (not $)
- [ ] Clear CTA

### Compliance
- [ ] Affiliate disclosure present
- [ ] Investment disclaimer where needed

## 14.2 Performance Standards

| Metric | Target |
|:---|:---|
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Time to Interactive | <3.5s |
| Cumulative Layout Shift | <0.1 |

---

# 15. STRATEGIC ROADMAP 2026-2030

## Phase 1: Foundation (Q1-Q2 2026)

**Focus:** Stabilize platform, fix security

| Task | Priority |
|:---|:---|
| Fix middleware auth bypass | P0 |
| Move prompts to database | P0 |
| Convert scripts to cron | P1 |
| Build editorial QA dashboard | P1 |
| Implement click tracking | P2 |

**Target:** 500 pages, 10K monthly visitors

## Phase 2: Automation Factory (Q3-Q4 2026)

**Focus:** True autonomous content generation

**Target:** 2,000 pages, 100K monthly visitors

## Phase 3: Growth & Monetization (2027)

**Focus:** Scale content, activate revenue

**Target:** 10K pages, 1M monthly visitors, ₹10L+/month revenue

## Phase 4: Market Leadership (2028)

**Focus:** Mobile app, regional languages, B2B API

**Target:** 25K pages, 5M monthly visitors, ₹50L+/month revenue

## Phase 5: Hyper Growth (2029)

**Focus:** AI personalization, voice interface

**Target:** 40K pages, 15M monthly visitors, ₹1.5Cr+/month revenue

## Phase 6: Domination (2030)

**Focus:** Market leadership, exit options

**Target:** 50K+ pages, 25M+ monthly visitors, ₹5Cr+/month revenue

---

# 16. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|:---|:---|:---|:---|
| Google algorithm update | High | Critical | Diversify traffic sources |
| AI hallucination errors | Medium | High | Mandatory QA, fact-check |
| Regulatory changes | Medium | High | Legal review, compliance |
| Competition | High | Medium | Speed via automation |
| AI cost explosion | Medium | Medium | Cost tracking, optimization |
| Security breach | Low | Critical | Regular audits |

---

# 17. APPENDICES

## A. NPM Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run test         # Jest tests
```

## B. Useful Commands

```bash
npx tsx scripts/master-content-generation.ts
npx tsx scripts/populate-products-ai.ts
npx tsx scripts/check-tables.ts
```

## C. Key File Locations

| Purpose | Location |
|:---|:---|
| AI Service | `lib/ai-service.ts` |
| Database Client | `lib/supabase/client.ts` |
| Navigation | `lib/navigation/config.ts` |
| SEO Utilities | `lib/seo/` |
| Design System | `tailwind.config.ts` |

---

**END OF PLATFORM BIBLE**

*This is the single source of truth. Update quarterly.*
*Next review: April 1, 2026*
