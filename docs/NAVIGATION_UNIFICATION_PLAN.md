# 🎯 Navigation Architecture Unification Plan

**Date:** January 13, 2026  
**Priority:** 🔴 HIGH  
**Status:** IN PROGRESS

---

## 📋 Overview

**Goal:** Unify all navigation components to use `NAVIGATION_CONFIG` as single source of truth

**Current State:** Fragmented (Navbar ✅, Footer ❌, Homepage ❌)  
**Target State:** All components use `NAVIGATION_CONFIG` ✅

---

## 🎯 Implementation Plan

### Phase 1: Create Navigation Utilities
**File:** `lib/navigation/utils.ts`

**Functions to Create:**
1. `getCategoryBySlug(slug: string)` - Get category by slug
2. `getAllCategories()` - Get all categories
3. `getFooterLinks()` - Generate footer links from config
4. `getHomepageCategories()` - Generate homepage categories from config
5. `getCategoryIcon(slug: string)` - Map category slug to icon (for homepage)

---

### Phase 2: Migrate Footer
**File:** `components/layout/Footer.tsx`

**Changes:**
1. Remove hardcoded `footerLinks` object
2. Remove `getHref` mapping function
3. Import navigation utilities
4. Generate footer links from `NAVIGATION_CONFIG`
5. Map categories to footer sections:
   - Products: Main categories (Credit Cards, Loans, Insurance, Investing, etc.)
   - Tools: Calculators category
   - Resources: Guides intent from categories
   - Keep Legal/Company links (they're not in NAVIGATION_CONFIG)

---

### Phase 3: Migrate Homepage CategoryDiscovery
**File:** `components/home/CategoryDiscovery.tsx`

**Changes:**
1. Remove hardcoded `categories` array
2. Import navigation utilities
3. Generate categories from `NAVIGATION_CONFIG`
4. Use category icons mapping
5. Use category descriptions from config

---

### Phase 4: Testing & Verification
1. Test Footer renders correctly
2. Test Homepage categories render correctly
3. Verify all links work
4. Check for broken links
5. Verify consistency with Navbar

---

## 📝 Detailed Implementation

### Phase 1: Navigation Utilities

**File:** `lib/navigation/utils.ts`

```typescript
import { NAVIGATION_CONFIG, NavigationCategory } from './config';
import { 
    CreditCard, Landmark, TrendingUp, Shield, Calculator, 
    BookOpen, Gem, Building2, Banknote, PieChart 
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Icon mapping for categories
const CATEGORY_ICONS: Record<string, LucideIcon> = {
    'credit-cards': CreditCard,
    'loans': Landmark,
    'insurance': Shield,
    'investing': TrendingUp,
    'banking': Building2,
    'calculators': Calculator,
    'mutual-funds': TrendingUp,
    'fixed-deposits': Landmark,
    'ppf-nps': Banknote,
    'taxes': Calculator,
    'small-business': Gem,
    'blog': BookOpen,
};

export function getCategoryBySlug(slug: string): NavigationCategory | undefined {
    return NAVIGATION_CONFIG.find(cat => cat.slug === slug);
}

export function getAllCategories(): NavigationCategory[] {
    return NAVIGATION_CONFIG;
}

export function getCategoryIcon(slug: string): LucideIcon {
    return CATEGORY_ICONS[slug] || TrendingUp; // Default icon
}

// Generate footer links from NAVIGATION_CONFIG
export interface FooterLink {
    name: string;
    href: string;
}

export interface FooterLinks {
    products: FooterLink[];
    tools: FooterLink[];
    resources: FooterLink[];
}

export function getFooterLinks(): FooterLinks {
    // Products: Main categories (prioritized)
    const productCategories = ['credit-cards', 'insurance', 'loans', 'investing', 'banking', 'mutual-funds', 'fixed-deposits', 'ppf-nps'];
    const products: FooterLink[] = productCategories
        .map(slug => {
            const category = getCategoryBySlug(slug);
            return category ? { name: category.name, href: `/${category.slug}` } : null;
        })
        .filter((link): link is FooterLink => link !== null);

    // Tools: Calculators category + specific calculator links
    const calculatorsCategory = getCategoryBySlug('calculators');
    const tools: FooterLink[] = [];
    if (calculatorsCategory) {
        tools.push({ name: calculatorsCategory.name, href: `/${calculatorsCategory.slug}` });
        // Add popular calculators from collections
        const calculatorsIntent = calculatorsCategory.intents.find(intent => intent.slug === 'calculators');
        if (calculatorsIntent) {
            const popularCalculators = calculatorsIntent.collections.slice(0, 4);
            popularCalculators.forEach(calc => {
                tools.push({ name: calc.name, href: calc.href });
            });
        }
    }

    // Resources: Guides from all categories
    const resources: FooterLink[] = [];
    NAVIGATION_CONFIG.forEach(category => {
        const guidesIntent = category.intents.find(intent => intent.slug === 'guides');
        if (guidesIntent && guidesIntent.collections.length > 0) {
            resources.push({
                name: `${category.name} Guides`,
                href: `/${category.slug}/guides`
            });
        }
    });

    return { products, tools, resources };
}

// Generate homepage categories from NAVIGATION_CONFIG
export interface HomepageCategory {
    title: string;
    icon: LucideIcon;
    description: string;
    href: string;
}

export function getHomepageCategories(): HomepageCategory[] {
    // Prioritized categories for homepage
    const prioritySlugs = ['credit-cards', 'loans', 'insurance', 'mutual-funds', 'calculators', 'banking', 'fixed-deposits', 'taxes', 'small-business'];
    
    return prioritySlugs
        .map(slug => {
            const category = getCategoryBySlug(slug);
            if (!category) return null;
            
            return {
                title: category.name,
                icon: getCategoryIcon(slug),
                description: category.description,
                href: `/${category.slug}`
            };
        })
        .filter((cat): cat is HomepageCategory => cat !== null);
}
```

---

### Phase 2: Footer Migration

**Changes to `components/layout/Footer.tsx`:**

1. Remove `getHref` function (lines 15-38)
2. Remove `footerLinks` object (lines 40-73)
3. Add imports:
   ```typescript
   import { getFooterLinks } from '@/lib/navigation/utils';
   ```
4. Use generated links:
   ```typescript
   const footerLinks = getFooterLinks();
   ```
5. Update footer rendering to use new structure
6. Keep Legal/Company links (they're not in NAVIGATION_CONFIG, so keep hardcoded)

---

### Phase 3: Homepage CategoryDiscovery Migration

**Changes to `components/home/CategoryDiscovery.tsx`:**

1. Remove hardcoded `categories` array (lines 18-73)
2. Add imports:
   ```typescript
   import { getHomepageCategories } from '@/lib/navigation/utils';
   ```
3. Use generated categories:
   ```typescript
   const categories = getHomepageCategories();
   ```
4. Update component to use dynamic icons

---

## ✅ Success Criteria

1. ✅ Footer uses NAVIGATION_CONFIG
2. ✅ Homepage uses NAVIGATION_CONFIG
3. ✅ All links work correctly
4. ✅ No broken links
5. ✅ Consistent with Navbar
6. ✅ Single source of truth (NAVIGATION_CONFIG)
7. ✅ Easy to maintain (change config, all components update)

---

## 🚀 Implementation Order

1. **Create utilities** (`lib/navigation/utils.ts`)
2. **Migrate Footer** (high visibility)
3. **Migrate Homepage** (high visibility)
4. **Test & verify** (all components)

---

*Plan created: January 13, 2026*
