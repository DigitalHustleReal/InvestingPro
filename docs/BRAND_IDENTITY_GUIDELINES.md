# InvestingPro Brand Identity Guidelines

> **Vision:** India's Largest Personal Finance Platform  
> **Design Philosophy:** Trust Through Consistency, Growth Through Clarity

---

## Table of Contents

1. [Brand Essence](#brand-essence)
2. [3-Tier Color Architecture](#3-tier-color-architecture)
3. [Primary Brand Palette](#primary-brand-palette)
4. [Semantic Colors](#semantic-colors)
5. [Category Accents](#category-accents)
6. [Typography](#typography)
7. [Usage Guidelines](#usage-guidelines)
8. [Do's and Don'ts](#dos-and-donts)
9. [Implementation](#implementation)

---

## Brand Essence

### Our Promise
InvestingPro empowers every Indian to make confident financial decisions through clear, trustworthy, and accessible information.

### Brand Attributes
| Attribute | Expression |
|-----------|------------|
| **Trustworthy** | Consistent teal across all touchpoints |
| **Growth-Oriented** | Green for positive outcomes |
| **Accessible** | Clear hierarchy, no intimidating colors |
| **Premium** | Clean design, not cluttered |
| **Indian** | Culturally appropriate color psychology |

### Competitive Positioning
```
┌─────────────────────────────────────────────────────────────┐
│                      PREMIUM                                 │
│                         │                                    │
│    Bloomberg ●          │          ● InvestingPro            │
│                         │                                    │
│  COMPLEX ────────────────────────────────────── SIMPLE       │
│                         │                                    │
│    Moneycontrol ●       │          ● Zerodha                 │
│                         │                                    │
│                      BASIC                                   │
└─────────────────────────────────────────────────────────────┘

Our Position: Premium yet Accessible
```

---

## 3-Tier Color Architecture

### Why 3 Tiers?

India's largest platforms have **ONE recognizable color**:
- PhonePe = Purple
- Paytm = Blue  
- Zerodha = Blue/Teal
- HDFC = Red

**InvestingPro = Teal** (Trust + Growth)

### The Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: PRIMARY BRAND (90% of UI)                          │
│  ═══════════════════════════════════                        │
│  • Primary Teal - Signature color                           │
│  • Secondary Sky - Information, tech                        │
│  • Accent Amber - CTAs, highlights                          │
│  • Neutral Slate - Text, backgrounds                        │
│                                                             │
│  USE FOR: Headers, buttons, links, cards, navigation        │
├─────────────────────────────────────────────────────────────┤
│  TIER 2: SEMANTIC STATUS (Contextual)                       │
│  ════════════════════════════════════                       │
│  • Success Green - Gains, approvals                         │
│  • Warning Amber - Caution, attention                       │
│  • Danger Red - Losses, errors ONLY                         │
│  • Info Blue - Tips, information                            │
│                                                             │
│  USE FOR: Status indicators, gain/loss, form validation     │
├─────────────────────────────────────────────────────────────┤
│  TIER 3: CATEGORY ACCENTS (≤10% of UI)                      │
│  ═════════════════════════════════════                      │
│  • Subtle color hints for navigation                        │
│  • NEVER full-page color takeovers                          │
│  • Applied to: badges, icons, small accents                 │
│                                                             │
│  USE FOR: Category badges, hero accent dots, small icons    │
└─────────────────────────────────────────────────────────────┘
```

---

## Primary Brand Palette

### Primary: Trust Teal

Our signature color. Use for **90% of branded elements**.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | #F0FDFA | Light backgrounds |
| `primary-100` | #CCFBF1 | Hover states, subtle fills |
| `primary-200` | #99F6E4 | Borders, dividers |
| `primary-300` | #5EEAD4 | Soft accents |
| `primary-400` | #2DD4BF | Interactive elements |
| **`primary-500`** | **#14B8A6** | **Main brand color** ⭐ |
| `primary-600` | #0D9488 | Hover on primary |
| **`primary-700`** | **#0F766E** | **Strong/dark variant** |
| `primary-800` | #115E59 | Dark mode surfaces |
| `primary-900` | #134E4A | Dark mode backgrounds |

### Secondary: Sky Blue

Information, technology, trust reinforcement.

| Token | Hex | Usage |
|-------|-----|-------|
| **`secondary-500`** | **#0EA5E9** | **Info color** |
| `secondary-700` | #0369A1 | Strong variant |

### Accent: Amber Gold

Call-to-actions, highlights, important notices.

| Token | Hex | Usage |
|-------|-----|-------|
| **`accent-500`** | **#F59E0B** | **CTA highlights** |
| `accent-600` | #D97706 | Hover on accent |

### Neutral: Slate

Text, backgrounds, borders.

| Token | Hex | Usage |
|-------|-----|-------|
| `slate-50` | #F8FAFC | Page background (light) |
| `slate-200` | #E2E8F0 | Borders, dividers |
| `slate-500` | #64748B | Muted text |
| `slate-600` | #475569 | Secondary text |
| **`slate-900`** | **#0F172A** | **Primary text** |

---

## Semantic Colors

Use **ONLY** for status indication, **NEVER** for branding.

### Success: Emerald Green
```
#10B981 (500) - Positive states, gains, approvals
```

**Use for:**
- ✅ Portfolio gains (+12.5%)
- ✅ Form success messages
- ✅ Approval indicators
- ✅ Positive metrics

**Psychology:** Green = Growth, Money, Auspicious (Diwali, Weddings)

### Danger: Red
```
#EF4444 (500) - Negative states, losses, errors
```

**Use for:**
- ❌ Portfolio losses (-5.2%)
- ❌ Error messages
- ❌ Destructive actions
- ❌ Warning alerts

**NEVER use for:**
- ❌ Category theming (Stocks page)
- ❌ Navigation elements
- ❌ Badges or labels
- ❌ General UI elements

**Psychology:** Red in India = Loss, Danger, Stop. Using it for Stocks category would create anxiety.

---

## Category Accents

### Simplified 5-Category System

We reduced from 8 fragmented categories to **5 cohesive groups**:

```
┌──────────────────────────────────────────────────────────────┐
│  CATEGORY        │  ACCENT COLOR  │  PSYCHOLOGY              │
├──────────────────┼────────────────┼──────────────────────────┤
│  💰 Investing    │  Green #10B981 │  Growth, Prosperity      │
│  (MF, Stocks,    │                │  Auspicious in India     │
│   SIP, Equity)   │                │                          │
├──────────────────┼────────────────┼──────────────────────────┤
│  🛡️ Protection   │  Blue #0EA5E9  │  Trust, Security         │
│  (Insurance,     │                │  Banks use blue          │
│   Credit Cards)  │                │  for a reason            │
├──────────────────┼────────────────┼──────────────────────────┤
│  🏠 Borrowing    │  Teal #0D9488  │  Reliable, Accessible    │
│  (Loans, EMI,    │                │  Not luxury purple       │
│   Home Loans)    │                │  (middle-class friendly) │
├──────────────────┼────────────────┼──────────────────────────┤
│  📋 Planning     │  Amber #F59E0B │  Wisdom, Future          │
│  (Tax, Retire-   │                │  Golden years,           │
│   ment, Goals)   │                │  Prosperity              │
├──────────────────┼────────────────┼──────────────────────────┤
│  📚 Education    │  Teal #14B8A6  │  Brand consistency       │
│  (Guides, Basics,│                │  Foundation of           │
│   Calculators)   │                │  our platform            │
└──────────────────┴────────────────┴──────────────────────────┘
```

### How to Use Category Accents

**✅ Correct Usage (Subtle, <10%):**
```tsx
// Hero section - small accent dot
<div className="flex items-center gap-2">
  <span className="w-2 h-2 rounded-full bg-success-500" /> {/* Green dot for MF */}
  <h1>Mutual Funds</h1>
</div>

// Category badge
<span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs">
  Investing
</span>

// Progress indicator
<div className="h-1 bg-success-500 rounded" style={{ width: '65%' }} />
```

**❌ Incorrect Usage (Color Takeover):**
```tsx
// DON'T: Full green header
<header className="bg-success-600"> {/* NO! */}

// DON'T: Green buttons everywhere
<Button className="bg-success-500"> {/* NO! Use primary */}

// DON'T: Green navigation
<nav className="border-success-500"> {/* NO! */}
```

---

## Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-serif: 'Source Serif 4', Georgia, serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Hierarchy

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 | 3rem (48px) | 700 Bold | slate-900 |
| H2 | 2.25rem (36px) | 700 Bold | slate-900 |
| H3 | 1.5rem (24px) | 600 Semi | slate-900 |
| H4 | 1.25rem (20px) | 600 Semi | slate-800 |
| Body | 1rem (16px) | 400 Normal | slate-700 |
| Small | 0.875rem (14px) | 400 Normal | slate-600 |
| Caption | 0.75rem (12px) | 400 Normal | slate-500 |

---

## Usage Guidelines

### Buttons

```
PRIMARY ACTION:     bg-primary-500 text-white
                    hover:bg-primary-600
                    
SECONDARY ACTION:   bg-slate-100 text-slate-900
                    hover:bg-slate-200
                    
ACCENT/CTA:         bg-accent-500 text-white
                    hover:bg-accent-600
                    
DANGER ACTION:      bg-danger-500 text-white
                    (ONLY for destructive actions)
```

### Cards

```
LIGHT MODE:
  bg-white
  border border-slate-200
  shadow-sm
  rounded-xl

DARK MODE:
  bg-slate-900
  border border-slate-700
  shadow-sm
  rounded-xl
```

### Gradients

```
BRAND GRADIENT:     from-primary-700 to-secondary-500
                    Use for: Hero sections, feature highlights

SUBTLE GRADIENT:    from-primary-50 to-secondary-50
                    Use for: Card backgrounds, section dividers

CATEGORY GRADIENT:  from-{category} to-primary-500
                    Use for: Category hero accents (subtle)
```

---

## Do's and Don'ts

### ✅ DO

1. **Use Teal as signature color** - 90% of UI should be teal-based
2. **Apply category accents subtly** - Badges, dots, small highlights only
3. **Use Green for positive outcomes** - Gains, success, growth
4. **Maintain visual hierarchy** - Primary > Secondary > Accent
5. **Be consistent across pages** - Same navbar, footer, button styles
6. **Use Slate for neutrals** - Professional, modern, Indian-tech-friendly

### ❌ DON'T

1. **Use Red for categories** - Creates anxiety, negative psychology
2. **Create color takeover pages** - Each category shouldn't feel different
3. **Mix multiple category accents** - One accent per page maximum
4. **Use Purple for mass-market** - Feels luxury, alienates middle-class
5. **Override navigation colors** - Navbar should ALWAYS be brand consistent
6. **Use neon or off-brand colors** - Stick to the defined palette

---

## Implementation

### Tailwind Config Reference

```typescript
// tailwind.config.ts
colors: {
  primary: { 500: '#14B8A6', 700: '#0F766E', ... },
  secondary: { 500: '#0EA5E9', 700: '#0369A1', ... },
  accent: { 500: '#F59E0B', 600: '#D97706', ... },
  success: { 500: '#10B981', ... },
  danger: { 500: '#EF4444', ... },
  slate: { 50-950 scale },
}
```

### Using the Theme System

```typescript
import { 
  getCategoryAccent, 
  getThemePalette,
  getBrandColorSet 
} from '@/lib/theme/brand-theme';

// Get category accent
const accent = getCategoryAccent('mutual-funds'); // Returns 'investing' accent

// Get full palette
const palette = getThemePalette('light', 'mutual-funds');

// For image generation
const colors = getBrandColorSet('light', 'mutual-funds');
```

### CSS Custom Properties

```css
:root {
  --color-primary: #14B8A6;
  --color-primary-strong: #0F766E;
  --color-secondary: #0EA5E9;
  --color-accent: #F59E0B;
  --color-background: #F8FAFC;
  --color-text: #0F172A;
  --color-category-accent: var(--category-color, #14B8A6);
}
```

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────┐
│  INVESTINGPRO BRAND COLORS - QUICK REFERENCE               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  PRIMARY TEAL    ████████  #14B8A6  (90% of UI)           │
│  SECONDARY BLUE  ████████  #0EA5E9  (Info, tech)          │
│  ACCENT AMBER    ████████  #F59E0B  (CTAs)                │
│                                                            │
│  SUCCESS GREEN   ████████  #10B981  (Gains only)          │
│  DANGER RED      ████████  #EF4444  (Losses only)         │
│                                                            │
│  TEXT DARK       ████████  #0F172A  (Headings)            │
│  TEXT MUTED      ████████  #64748B  (Secondary)           │
│  BACKGROUND      ████████  #F8FAFC  (Page bg)             │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Remember: Consistency = Trust = Growth                    │
│  India's Largest Platform needs ONE recognizable color    │
└────────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Jan 2026 | Simplified to 3-tier system, 5 categories |
| 1.0 | Dec 2025 | Initial 8-category system |

---

*© InvestingPro - Building India's Most Trusted Finance Platform*
