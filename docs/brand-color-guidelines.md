# Brand Color Guidelines

> ⚠️ **Updated:** This document has been superseded by the comprehensive  
> **[BRAND_IDENTITY_GUIDELINES.md](./BRAND_IDENTITY_GUIDELINES.md)**

---

## Quick Reference

### Centralized Theme System
All colors are defined in `lib/theme/brand-theme.ts`

### 3-Tier Architecture

**TIER 1: Primary Brand (90% of UI)**
- Primary Teal: `#14B8A6` 
- Secondary Sky: `#0EA5E9`
- Accent Amber: `#F59E0B`
- Neutral Slate: `#0F172A` - `#F8FAFC`

**TIER 2: Semantic Status (Contextual)**
- Success: `#10B981` (gains, positive)
- Danger: `#EF4444` (losses, errors)
- Warning: `#F59E0B` (caution)
- Info: `#0EA5E9` (informational)

**TIER 3: Category Accents (≤10% of UI)**

| Category | Accent | Usage |
|----------|--------|-------|
| Investing | `#10B981` Green | MF, Stocks, SIP |
| Protection | `#0EA5E9` Blue | Insurance, Cards |
| Borrowing | `#0D9488` Teal | Loans, EMI |
| Planning | `#F59E0B` Amber | Tax, Retirement |
| Education | `#14B8A6` Teal | Guides, Basics |

---

## Key Principles

1. **One Dominant Color** - Teal is our signature
2. **Category Accents are Subtle** - <10% of any page
3. **Never Use Red for Categories** - Only for losses/errors
4. **Consistency = Trust** - Same experience everywhere

---

## Usage

```typescript
import { 
  getCategoryAccent,
  getThemePalette,
  getBrandColorSet,
  BRAND_COLORS,
  SEMANTIC_COLORS 
} from '@/lib/theme/brand-theme';

// Get category accent
const accent = getCategoryAccent('mutual-funds'); // Returns 'investing' group

// Get full theme
const theme = getThemePalette('light', 'mutual-funds');
```

---

For complete guidelines, see **[BRAND_IDENTITY_GUIDELINES.md](./BRAND_IDENTITY_GUIDELINES.md)**
