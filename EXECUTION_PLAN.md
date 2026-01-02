# 🚀 STAGE-WISE EXECUTION PLAN - InvestingPro Design System
**Start Date**: 2026-01-02  
**Target Launch**: 2026-02-28 (8 weeks)  
**Approach**: Incremental, Non-Breaking Rollout  
**Priority**: User-Facing → Database → Internal Tools

---

## 📊 EXECUTION OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Foundation (Week 1-2)     | CRITICAL               │
│ ├─ Design tokens migration                                  │
│ ├─ Color/typography fixes                                   │
│ └─ Core component updates          [15h] ████████░░         │
├─────────────────────────────────────────────────────────────┤
│ PHASE 2: Fintech Compliance (Week 3-4) | HIGH               │
│ ├─ Regulatory components                                    │
│ ├─ Currency formatting                                      │
│ └─ Security indicators             [12h] ██████░░░░         │
├─────────────────────────────────────────────────────────────┤
│ PHASE 3: Component Library (Week 5-6) | MEDIUM              │
│ ├─ Comparison cards/tables                                  │
│ ├─ Calculator widgets                                       │
│ └─ Trust badges                    [16h] ████████░░         │
├─────────────────────────────────────────────────────────────┤
│ PHASE 4: Page Templates (Week 7-8) | MEDIUM                 │
│ ├─ Homepage redesign                                        │
│ ├─ Category/product pages                                   │
│ └─ Article templates               [20h] ██████████         │
└─────────────────────────────────────────────────────────────┘

TOTAL: 63 hours over 8 weeks (8h/week avg)
```

---

## 🎯 STAGE 1: FOUNDATION FIXES (Week 1-2)
**Goal**: Fix critical brand inconsistencies without breaking existing functionality  
**Duration**: 15 hours over 2 weeks  
**Priority**: 🔴 CRITICAL - Blocks everything else

### **Day 1-2: Design Token Migration** (4 hours)

#### **Task 1.1: Update Tailwind Config** (2h)
```typescript
// File: tailwind.config.ts

CURRENT STATE:
  ❌ 7 color families (emerald, blue, amber, + dark theme)
  ❌ Missing Stone neutrals
  ❌ Incomplete 8pt spacing grid

CHANGES:
  ✅ Replace primary Emerald → Teal
  ✅ Remove secondary Blue
  ✅ Add Stone neutral palette
  ✅ Complete 8pt spacing (add: 0.5, 1.5, 6, 12, 20)
  ✅ Add semantic colors (success, warning, danger, info)

ACTION:
  1. Backup current tailwind.config.ts
  2. Apply new color tokens (from DESIGN_SPECIFICATION.md)
  3. Add missing spacing values
  4. Update shadow definitions
  5. Test build: npm run build
```

**Deliverable**: Updated `tailwind.config.ts` with new design tokens  
**Validation**: Build succeeds, no TypeScript errors  
**Rollback**: Git revert if build fails

---

#### **Task 1.2: Font Integration** (1h)
```typescript
// Files: 
//   - app/layout.tsx (add font imports)
//   - tailwind.config.ts (font-family config)

CURRENT STATE:
  ✅ Inter (already using)
  ✅ JetBrains Mono (already using)
  ❌ Missing Source Serif 4 (for editorial)

CHANGES:
  1. Add Source Serif 4 to Google Fonts import
  2. Update tailwind config font family
  3. Create .serif CSS utility class

ACTION:
  // app/layout.tsx
  import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
  
  const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
  const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
  const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });
  
  // Apply to <body>
  className={`${inter.variable} ${mono.variable} ${serif.variable}`}
```

**Deliverable**: All 3 fonts loaded and available  
**Validation**: Inspect DevTools → Network → Fonts loaded  
**Time**: 1 hour

---

#### **Task 1.3: Create Migration Script** (1h)
```bash
# File: scripts/migrate-colors.js

PURPOSE: Automate find/replace of old color classes

SCRIPT LOGIC:
  1. Find all .tsx files in components/ and app/
  2. Replace:
     - primary-500 → primary-600 (darker teal)
     - secondary-* → primary-* (remove blue)
     - Emerald references → Teal where appropriate
  3. Create backup before changes
  4. Generate change log

RUN:
  node scripts/migrate-colors.js --dry-run  # Preview
  node scripts/migrate-colors.js --execute  # Apply
```

**Deliverable**: Automated migration script  
**Validation**: Dry-run shows expected changes  
**Safety**: Backup created before execution

---

### **Day 3-4: Typography Weight Fix** (3 hours)

#### **Task 1.4: Global Font Weight Replacement** (2h)
```bash
CURRENT STATE:
  ❌ font-black (900) used 447 times
  ❌ Looks amateurish, reduces legibility

CHANGES:
  ✅ font-black → font-bold (700) for headings
  ✅ font-black → font-semibold (600) for 10-13px labels
  ✅ Add tracking-tight to compensate

AUTOMATED APPROACH:
  # Create: scripts/fix-font-weights.js
  
  const replace = require('replace-in-file');
  
  const options = {
    files: ['components/**/*.tsx', 'app/**/*.tsx'],
    from: [
      /className="([^"]*?)font-black([^"]*?)text-(4xl|5xl|6xl)/g,
      /className="([^"]*?)font-black([^"]*?)text-(xs|sm|10px|11px)/g,
    ],
    to: [
      'className="$1font-bold tracking-tight$2text-$3',  // Large text
      'className="$1font-semibold$2text-$3',             // Small labels
    ],
  };
  
  replace(options).then(results => {
    console.log('Replaced:', results.filter(r => r.hasChanged));
  });

RUN:
  node scripts/fix-font-weights.js
```

**Deliverable**: All 447 instances reviewed/fixed  
**Validation**: Visual QA on homepage, category pages  
**Time**: 2 hours (1h script, 1h QA)

---

#### **Task 1.5: Typography Audit** (1h)
```typescript
MANUAL REVIEW:
  Files to check visually:
    1. components/home/AnimatedHero.tsx (hero headline)
    2. components/home/CategoryGrid.tsx (category titles)
    3. components/products/ProductCard.tsx (product names)
    4. All badge/label components (10-11px text)

BEFORE/AFTER:
  BEFORE: font-black text-6xl (900 weight, 72px)
  ↓
  AFTER: font-bold tracking-tight text-6xl (700 weight, tighter spacing)

VALIDATION:
  ✓ Still impactful (large size compensates for lighter weight)
  ✓ More professional (not shouting)
  ✓ Better legibility at small sizes
```

**Deliverable**: Documented before/after screenshots  
**Time**: 1 hour

---

### **Day 5-6: Hero Gradient Unification** (2 hours)

#### **Task 1.6: Single Brand Gradient** (1h)
```typescript
// File: components/home/AnimatedHero.tsx

CURRENT STATE (Lines 16-129):
  ❌ 8 different category gradients
  ❌ Confusing brand identity

CHANGES:
  1. Define single BRAND_GRADIENT constant
  2. Replace all 8 gradients
  3. Use category icons for differentiation

CODE:
  // Add at top of file
  const BRAND_GRADIENT = 'from-teal-600 via-emerald-600 to-cyan-700';
  
  // Replace all categoryHeroConfig gradients:
  const categoryHeroConfig = {
    'credit-cards': {
      icon: CreditCard,
      gradient: BRAND_GRADIENT,  // ← All the same now
      headline: '...',
      // ... rest
    },
    'loans': {
      icon: Wallet,
      gradient: BRAND_GRADIENT,  // ← Same
      // ...
    },
    // ... repeat for all 8 categories
  };
  
  // Remove gradient transition animation
  // Delete setIsAnimating() logic (lines 167-176)
```

**Deliverable**: Unified gradient across all categories  
**Validation**: Switch categories, gradient stays consistent  
**Time**: 1 hour

---

#### **Task 1.7: Category Badge Differentiation** (1h)
```typescript
// Instead of changing background, use colored icon badge

// Add to categoryHeroConfig:
const categoryHeroConfig = {
  'credit-cards': {
    icon: CreditCard,
    iconColor: 'text-indigo-400',  // ← Small accent
    gradient: BRAND_GRADIENT,
    // ...
  },
  // ...
};

// Update badge rendering:
<div className="inline-flex items-center gap-2 px-4 py-2 
                bg-white/20 backdrop-blur-sm rounded-full">
  <Icon className={`w-5 h-5 ${categoryConfig.iconColor}`} />
  <span className="text-sm font-semibold text-white">
    {category.name}
  </span>
</div>
```

**Deliverable**: Category differentiation via icon color, not background  
**Time**: 1 hour

---

### **Day 7-8: Component Updates** (6 hours)

#### **Task 1.8: Button Component Refactor** (2h)
```typescript
// File: components/ui/Button.tsx

CURRENT (Line 11):
  ❌ default: "bg-blue-600 text-white hover:bg-blue-700"

NEW:
  ✅ default: "bg-teal-600 text-white hover:bg-teal-700"
  ✅ Add gradient variant (controlled use)
  ✅ Add proper height (44px minimum)

CODE:
  const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    {
      variants: {
        variant: {
          default: "bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg",
          secondary: "border-2 border-teal-600 bg-white text-teal-600 hover:bg-teal-50",
          gradient: "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-lg",
          outline: "border-2 border-stone-300 text-stone-900 hover:bg-stone-50",
          ghost: "text-stone-700 hover:bg-stone-100",
          destructive: "bg-red-600 text-white hover:bg-red-700",
        },
        size: {
          sm: "h-10 px-4 text-sm",
          default: "h-11 px-6 text-base",  // 44px
          lg: "h-14 px-8 text-lg",         // 56px
        },
      },
    }
  );

MIGRATION:
  - Find all Button usages (127 instances)
  - Most: Keep variant="default" (auto-updates to teal)
  - Hero CTAs: Change to variant="gradient"
  - Secondary actions: variant="secondary"
```

**Deliverable**: Button component with new variants  
**Validation**: Storybook or visual test all variants  
**Time**: 2 hours

---

#### **Task 1.9: Card Component Standardization** (2h)
```typescript
// File: components/products/ProductCard.tsx

CURRENT STATE:
  ⚠ Inconsistent padding (16-48px mix)
  ⚠ Border radius varies
  ⚠ Hover effects not standardized

CHANGES:
  ✅ Padding: 24px (mobile), 32px (desktop)
  ✅ Border radius: 12px (all cards)
  ✅ Hover: Border teal-500, lift -4px, shadow-lg

CODE:
  <Card className="
    border border-stone-200
    hover:border-teal-500
    hover:shadow-lg
    hover:-translate-y-1
    transition-all duration-150
    p-6 md:p-8           // 24px mobile, 32px desktop
    rounded-xl           // 12px
  ">
    {/* content */}
  </Card>
```

**Deliverable**: Standardized card component  
**Files to update**: All card usages (~80 files)  
**Time**: 2 hours

---

#### **Task 1.10: Spacing Audit** (2h)
```typescript
SECTION SPACING STANDARDIZATION:

CURRENT:
  ⚠ Sections use py-12 (48px) inconsistently

NEW STANDARD:
  ✅ Mobile: py-16 (64px)
  ✅ Desktop: py-24 (96px)

FIND/REPLACE:
  <section className="py-12">
  ↓
  <section className="py-16 md:py-24">

FILES TO UPDATE:
  - app/page.tsx (homepage sections)
  - app/[category]/page.tsx (category pages)
  - components/home/* (all section components)

VALIDATION:
  Before: Sections feel cramped
  After: More breathing room, premium feel
```

**Deliverable**: Consistent section spacing  
**Time**: 2 hours (automated + visual QA)

---

### **STAGE 1 DELIVERABLES**

✅ **Week 1 Outputs**:
- [ ] Updated tailwind.config.ts with new tokens
- [ ] All 3 fonts loaded (Inter, Source Serif 4, JetBrains Mono)
- [ ] Migration scripts created and tested
- [ ] 447 font-black instances fixed
- [ ] Hero gradient unified (8 → 1)

✅ **Week 2 Outputs**:
- [ ] Button component refactored (Teal default)
- [ ] Card components standardized
- [ ] Section spacing consistent
- [ ] Before/after screenshots documented

**CHECKPOINT**: Visual regression testing
- Homepage loads without errors
- All buttons render in teal
- Hero gradient is consistent
- Typography looks professional (not too heavy)

**Authority Score After Stage 1**: 68 → 86 (+18 points)

---

## 🏦 STAGE 2: FINTECH COMPLIANCE (Week 3-4)
**Goal**: Add regulatory components and financial data standards  
**Duration**: 12 hours over 2 weeks  
**Priority**: 🔴 HIGH - Legal/regulatory requirement

### **Day 9-10: Regulatory Components** (4 hours)

#### **Task 2.1: Disclaimer Banner Component** (2h)
```typescript
// File: components/compliance/DisclaimerBanner.tsx

CREATE NEW COMPONENT:

interface DisclaimerBannerProps {
  variant: 'investment' | 'privacy' | 'general';
  sticky?: boolean;
}

export function DisclaimerBanner({ variant, sticky = false }: Props) {
  const content = {
    investment: {
      icon: '⚠',
      title: 'Investment Risk Disclaimer',
      text: 'Investment in financial products is subject to market risk. Past performance does not guarantee future results. Please read all scheme-related documents carefully before investing.',
      bg: 'bg-amber-50',
      border: 'border-amber-600',
      color: 'text-amber-900',
    },
    privacy: {
      icon: '🔒',
      title: 'Data Privacy',
      text: 'We use cookies to improve your experience. Your data is encrypted and never shared with third parties.',
      bg: 'bg-blue-50',
      border: 'border-blue-600',
      color: 'text-blue-900',
    },
    general: {
      icon: 'ⓘ',
      title: 'InvestingPro is not SEBI registered',
      text: 'We provide comparison and educational content only. Always consult with a certified financial advisor before making investment decisions.',
      bg: 'bg-stone-50',
      border: 'border-stone-400',
      color: 'text-stone-900',
    },
  };
  
  const config = content[variant];
  
  return (
    <div className={cn(
      "border-t-3 p-4",
      config.bg, `border-t-${config.border}`,
      sticky && "sticky bottom-0 z-50"
    )}>
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <span className="text-xl">{config.icon}</span>
        <div className="flex-1">
          <p className={cn("text-xs font-semibold mb-1", config.color)}>
            {config.title}
          </p>
          <p className={cn("text-xs leading-relaxed", config.color)}>
            {config.text}
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Placement**:
```typescript
// app/layout.tsx (global)
<DisclaimerBanner variant="general" sticky />

// Product pages (above "Invest Now" button)
<DisclaimerBanner variant="investment" />

// Forms (above submit)
<DisclaimerBanner variant="privacy" />
```

**Deliverable**: 3 disclaimer variants  
**Time**: 2 hours

---

#### **Task 2.2: Security Badges** (1h)
```typescript
// File: components/compliance/SecurityBadge.tsx

CREATE NEW COMPONENT:

export function SecurityBadge({ type }: { type: 'ssl' | 'privacy' | 'compliance' }) {
  const badges = {
    ssl: {
      icon: '🔒',
      text: 'Secure Connection',
      subtext: '256-bit SSL Encryption',
    },
    privacy: {
      icon: '✓',
      text: 'Data Protected',
      subtext: 'We never share your data',
    },
    compliance: {
      icon: '🏛',
      text: 'RBI Guidelines',
      subtext: 'Compliant Platform',
    },
  };
  
  const badge = badges[type];
  
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
      <span className="text-base">{badge.icon}</span>
      <div>
        <p className="text-xs font-semibold text-emerald-900">{badge.text}</p>
        <p className="text-[10px] text-emerald-700">{badge.subtext}</p>
      </div>
    </div>
  );
}
```

**Placement**: Footer, form pages  
**Time**: 1 hour

---

#### **Task 2.3: Expert Byline Component** (1h)
```typescript
// File: components/content/ExpertByline.tsx

interface ExpertBylineProps {
  name: string;
  credentials: string;  // "CFA, CFP"
  title: string;         // "Senior Financial Analyst"
  photoUrl: string;
  lastUpdated?: Date;
}

export function ExpertByline({ name, credentials, title, photoUrl, lastUpdated }: Props) {
  return (
    <div className="flex items-center gap-3 p-4 bg-stone-50 border-l-4 border-teal-600 rounded-lg">
      <img 
        src={photoUrl} 
        alt={name}
        className="w-12 h-12 rounded-full border-2 border-stone-200"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-stone-900">{name}</span>
          <span className="text-sm font-semibold text-teal-600">{credentials}</span>
        </div>
        <p className="text-sm text-stone-600">{title}</p>
        {lastUpdated && (
          <p className="text-xs text-stone-500 mt-1">
            Last updated: {lastUpdated.toLocaleDateString('en-IN')}
          </p>
        )}
      </div>
    </div>
  );
}
```

**Placement**: Top of reviews, articles  
**Time**: 1 hour

---

### **Day 11-12: Financial Data Formatting** (4 hours)

#### **Task 2.4: Currency Formatter Utility** (2h)
```typescript
// File: lib/utils/currency.ts

CREATE UTILITY FUNCTIONS:

/**
 * Format currency in Indian numbering system
 * @example formatINR(100000) => "₹1,00,000"
 * @example formatINR(5000000, { compact: true }) => "₹50L"
 */
export function formatINR(
  amount: number,
  options?: {
    compact?: boolean;
    decimals?: number;
  }
): string {
  const { compact = false, decimals = 0 } = options || {};
  
  // Compact notation for UI cards
  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
  }
  
  // Indian number system (lakhs/crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(amount);
}

/**
 * Format percentage with Indian conventions
 * @example formatPercentage(12.5) => "12.50%"
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format gains/losses with color indication
 */
export function formatGainLoss(amount: number): {
  formatted: string;
  color: string;
  icon: string;
} {
  const formatted = formatINR(amount, { decimals: 2 });
  const color = amount > 0 ? 'text-emerald-700' : amount < 0 ? 'text-red-700' : 'text-stone-900';
  const icon = amount > 0 ? '▲' : amount < 0 ? '▼' : '';
  
  return { formatted, color, icon };
}
```

**Deliverable**: Currency formatting utilities  
**Time**: 2 hours

---

#### **Task 2.5: Apply Currency Formatting** (2h)
```typescript
UPDATE ALL NUMBER DISPLAYS:

Files to update:
  - components/products/ProductCard.tsx (fees, amounts)
  - components/calculators/SIPCalculator.tsx (results)
  - components/comparison/ComparisonTable.tsx (all numbers)

BEFORE:
  <span className="text-2xl font-bold">₹500</span>

AFTER:
  import { formatINR } from '@/lib/utils/currency';
  
  // For key metrics (large display)
  <span className="text-2xl font-bold font-mono">
    {formatINR(product.annualFee)}
  </span>
  
  // For compact cards
  <span className="text-sm font-mono">
    {formatINR(product.annualFee, { compact: true })}
  </span>
  
  // For gains/losses
  const { formatted, color, icon } = formatGainLoss(product.returns);
  <span className={cn("font-mono font-medium", color)}>
    {icon} {formatted}
  </span>

VALIDATION:
  ✓ ₹1,00,000 (not ₹100,000)
  ✓ ₹50L on cards, ₹50,00,000 in tables
  ✓ Green for gains, red for losses
  ✓ Monospace font (perfect alignment)
```

**Deliverable**: All currency displays formatted correctly  
**Time**: 2 hours

---

### **Day 13-14: Testing & Documentation** (4 hours)

#### **Task 2.6: Compliance Documentation** (2h)
```markdown
CREATE: docs/COMPLIANCE.md

Content:
  1. Regulatory Requirements
     - SEBI disclaimer requirements
     - Privacy policy requirements
     - Data protection compliance
  
  2. Component Usage Guide
     - When to use DisclaimerBanner
     - Expert byline requirements
     - Security badge placement
  
  3. Currency Formatting Standards
     - Indian numbering system rules
     - When to use compact notation
     - Color coding for gains/losses
  
  4. Audit Checklist
     - [ ] Disclaimer on all product pages
     - [ ] Expert bylines on all reviews
     - [ ] Currency formatted consistently
     - [ ] Security badges in footer
```

**Deliverable**: Compliance documentation  
**Time**: 2 hours

---

#### **Task 2.7: Visual QA & Testing** (2h)
```typescript
TEST CHECKLIST:

Regulatory Components:
  - [ ] Disclaimer banner shows on homepage
  - [ ] Sticky disclaimer on comparison pages
  - [ ] Expert byline renders with photo
  - [ ] Security badges visible in footer

Currency Formatting:
  - [ ] ₹1,00,000 (not ₹100,000) everywhere
  - [ ] Compact notation on cards (₹50L)
  - [ ] Full notation in tables (₹50,00,000)
  - [ ] Green for gains, red for losses
  - [ ] Monospace font alignment perfect

Cross-Browser:
  - [ ] Chrome (latest)
  - [ ] Safari (latest)
  - [ ] Firefox (latest)
  - [ ] Mobile Chrome
  - [ ] Mobile Safari
```

**Deliverable**: QA test results documented  
**Time**: 2 hours

---

### **STAGE 2 DELIVERABLES**

✅ **Week 3 Outputs**:
- [ ] 3 disclaimer banner variants
- [ ] 3 security badge variants
- [ ] Expert byline component
- [ ] Currency formatting utilities

✅ **Week 4 Outputs**:
- [ ] All currency displays use Indian formatting
- [ ] Compliance documentation complete
- [ ] Visual QA passed

**CHECKPOINT**: Fintech compliance validation
- Disclaimers visible where required
- Currency formatted correctly (lakhs/crores)
- Expert credentials displayed
- Security indicators present

**Authority Score After Stage 2**: 86 → 91 (+5 points)

---

## 🧩 STAGE 3: COMPONENT LIBRARY (Week 5-6)
**Goal**: Build reusable, fintech-optimized components  
**Duration**: 16 hours over 2 weeks  
**Priority**: 🟡 MEDIUM - Enhances but not critical

### **Day 15-18: Comparison Components** (8 hours)

#### **Task 3.1: Comparison Card Component** (3h)
```typescript
// File: components/products/ComparisonCard.tsx

interface ComparisonCardProps {
  product: {
    id: string;
    name: string;
    provider: string;
    logo: string;
    rating: number;
    keyMetric: { label: string; value: string };
    features: string[];
    slug: string;
  };
  isSelected?: boolean;
  onCompareToggle?: (id: string) => void;
}

export function ComparisonCard({ product, isSelected, onCompareToggle }: Props) {
  return (
    <Card className={cn(
      "relative border transition-all duration-150",
      isSelected 
        ? "border-2 border-teal-600 bg-teal-50" 
        : "border-stone-200 hover:border-teal-500 hover:-translate-y-1"
    )}>
      {/* Selected badge */}
      {isSelected && (
        <Badge className="absolute top-4 right-4 bg-amber-500">
          Added to compare
        </Badge>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={product.logo} alt={product.name} className="w-16 h-16" />
          <div>
            <h3 className="text-xl font-bold text-stone-900">{product.name}</h3>
            <p className="text-sm text-stone-600">{product.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-5 h-5 fill-current" />
          <span className="font-bold">{product.rating}</span>
        </div>
      </div>
      
      {/* Key Metric */}
      <div className="bg-teal-50 border-l-4 border-teal-600 p-4 mb-4">
        <p className="text-xs text-teal-700 font-medium uppercase tracking-wide">
          {product.keyMetric.label}
        </p>
        <p className="text-3xl font-bold font-mono text-teal-700 mt-1">
          {product.keyMetric.value}
        </p>
      </div>
      
      {/* Features */}
      <ul className="space-y-2 mb-6">
        {product.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* CTAs */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onCompareToggle?.(product.id)}
        >
          {isSelected ? 'Remove' : 'Compare'}
        </Button>
        <Link href={`/reviews/${product.slug}`} className="flex-1">
          <Button size="sm" className="w-full">
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
```

**Deliverable**: Production-ready comparison card  
**Time**: 3 hours

---

#### **Task 3.2: Comparison Table Component** (5h)

*[Detailed specification continues with table component implementation, calculator widgets, trust badges, etc.]*

---

## 📄 STAGE 4: PAGE TEMPLATES (Week 7-8)
**Goal**: Apply design system to all major pages  
**Duration**: 20 hours over 2 weeks  
**Priority**: 🟡 MEDIUM

*[Homepage redesign, category pages, product detail pages, article templates]*

---

## 📊 SUCCESS METRICS

### **Stage 1 (Foundation)**
- [ ] Authority Score: 68 → 86 (+18 points)
- [ ] Build time: No regression
- [ ] Lighthouse Performance: >85
- [ ] Visual regression: 0 broken layouts

### **Stage 2 (Fintech)**
- [ ] Authority Score: 86 → 91 (+5 points)
- [ ] Compliance: 100% pages have disclaimers
- [ ] Currency: 100% correct Indian formatting
- [ ] Accessibility: WCAG 2.1 AA maintained

### **Stage 3 (Components)**
- [ ] Reusability: 80% components from library
- [ ] Consistency: 95% design token usage
- [ ] Performance: No render regressions

### **Stage 4 (Pages)**
- [ ] Authority Score: 91 → 95 (+4 points)
- [ ] Mobile score: >90 (Lighthouse)
- [ ] User testing: 90% positive feedback

---

## 🎯 RISK MITIGATION

**Risk 1: Breaking Changes**
- Mitigation: Incremental rollout, keep old classes temporarily
- Rollback: Feature flags for new components

**Risk 2: Build Failures**
- Mitigation: Run `npm run build` after each major change
- Rollback: Git revert to last working commit

**Risk 3: Visual Regressions**
- Mitigation: Take screenshots before/after each stage
- Testing: Percy.io or manual visual QA

**Risk 4: Time Overruns**
- Mitigation: Work in 2-hour sprints, adjust weekly
- Flexibility: Stages 3-4 can extend if needed

---

## ✅ WEEKLY CHECKPOINTS

**Week 1 End**: Foundation tokens applied  
**Week 2 End**: Typography/gradients fixed  
**Week 3 End**: Compliance components live  
**Week 4 End**: Currency formatting complete  
**Week 5 End**: Component library 50% done  
**Week 6 End**: Component library 100% done  
**Week 7 End**: Homepage redesigned  
**Week 8 End**: All pages using new system

**LAUNCH**: 2026-02-28 (8 weeks from start)

**This execution plan is realistic, measurable, and accounts for current constraints. Each stage has clear deliverables and validation criteria.**
