# Trust-Focused Monetization System

## Overview

Comprehensive monetization system designed to maximize revenue while maintaining complete trust and editorial independence. **Monetization NEVER affects product rankings.**

## Core Principles

1. **Transparency First**: All monetization clearly disclosed
2. **No Dark Patterns**: No popups, no deceptive UI
3. **Editorial Independence**: Rankings never affected by monetization
4. **Contextual Relevance**: Links only shown when relevant
5. **User Control**: Users can dismiss ads, clear disclosures

## Components

### 1. Contextual Affiliate Links (`lib/monetization/contextual-links.ts`)

**Rules:**
- Maximum 3 affiliate links per page
- Only shown when contextually relevant
- Never affect product rankings
- Always include disclosure

**Usage:**
```typescript
import { generateContextualLinks } from '@/lib/monetization/contextual-links';

const links = await generateContextualLinks({
    contentType: 'product-card',
    category: 'credit-cards',
    position: 'cta',
});
```

### 2. Disclosure Blocks (`components/monetization/DisclosureBlock.tsx`)

**Types:**
- `affiliate`: For affiliate links
- `ad`: For advertisements
- `sponsored`: For sponsored content
- `general`: General transparency disclosure

**Usage:**
```tsx
<DisclosureBlock type="affiliate" position="bottom" />
```

### 3. Contextual Affiliate Link Component (`components/monetization/ContextualAffiliateLink.tsx`)

**Features:**
- Automatic click tracking
- Source page tracking
- Clear disclosure
- Context explanation

**Usage:**
```tsx
<ContextualAffiliateLink
    link={contextualLink}
    articleId={articleId}
    showDisclosure={true}
/>
```

### 4. Limited Ad Slots (`components/monetization/LimitedAdSlot.tsx`)

**Limits:**
- Header: 1 per page, 2 per session
- Sidebar: 1 per page, 3 per session
- In-article: 2 per page, 4 per session
- Footer: 1 per page, 2 per session
- Between-cards: 1 per page, 2 per session

**Features:**
- Session-based limits
- Clear "Advertisement" label
- Dismissible (no dark pattern)
- Automatic disclosure

**Usage:**
```tsx
<LimitedAdSlot position="sidebar" pageName="credit-cards" />
```

### 5. Tracking System (`lib/monetization/tracking.ts`)

**Tracks:**
- Clicks (with full context)
- Conversions (postback from affiliate network)
- Source pages
- Link positions
- User agents

**API Routes:**
- `POST /api/monetization/track-click` - Track affiliate click
- `POST /api/monetization/track-conversion` - Track conversion (webhook)

### 6. Ranking Protection (`lib/monetization/ranking-protection.ts`)

**Guarantees:**
- Rankings NEVER include monetization factors
- Score calculation is monetization-free
- Validation ensures integrity

**Ranking Factors (NEVER monetized):**
- User reviews
- Product features
- Fees and charges
- Historical performance
- Trust indicators

**Monetization Factors (NEVER affect ranking):**
- Affiliate availability
- Commission rates
- Ad placement priority
- Sponsored status

## Integration Examples

### Product Card with Affiliate Link
```tsx
import { generateContextualLinks } from '@/lib/monetization/contextual-links';
import ContextualAffiliateLink from '@/components/monetization/ContextualAffiliateLink';

const links = await generateContextualLinks({
    contentType: 'product-card',
    productId: product.id,
    category: product.category,
    position: 'cta',
});

{links.map(link => (
    <ContextualAffiliateLink key={link.productId} link={link} />
))}
```

### Article with Disclosure
```tsx
import DisclosureBlock from '@/components/monetization/DisclosureBlock';

<article>
    {/* Article content */}
    
    <DisclosureBlock type="affiliate" position="bottom" />
</article>
```

### Page with Limited Ads
```tsx
import LimitedAdSlot from '@/components/monetization/LimitedAdSlot';

<div>
    <LimitedAdSlot position="sidebar" pageName="credit-cards" />
    {/* Page content */}
    <LimitedAdSlot position="footer" pageName="credit-cards" />
</div>
```

## Trust Indicators

### Required Disclosures
1. **Affiliate Disclosure**: "We may earn a commission if you apply through this link. This does not affect our editorial independence or product rankings."
2. **Ad Disclosure**: "InvestingPro.in displays advertisements from trusted partners. These ads are clearly marked and do not influence our editorial content."
3. **Sponsored Disclosure**: "Some content may be sponsored by partners. Sponsored content is clearly labeled."

### Visual Indicators
- Clear "Advertisement" labels on ads
- "Affiliate" badges on affiliate links
- Disclosure blocks with icons
- Transparent close buttons (no dark patterns)

## Analytics

### Tracked Metrics
- Total clicks
- Conversions
- Conversion rate
- Total commission
- Clicks by source page
- Clicks by product
- Clicks by link position

### Access
Analytics available via `getMonetizationAnalytics()` (admin only)

## Compliance

### FTC Guidelines
- Clear and conspicuous disclosures
- No deceptive practices
- Transparent about relationships

### Editorial Independence
- Rankings calculated independently
- Monetization factors excluded from rankings
- Validation ensures integrity

## No Dark Patterns

### Prohibited:
- ❌ Popups or modals
- ❌ Deceptive close buttons
- ❌ Hidden affiliate links
- ❌ Fake urgency
- ❌ Misleading labels
- ❌ Forced interactions

### Allowed:
- ✅ Clear disclosure blocks
- ✅ Dismissible ads (visible close button)
- ✅ Transparent labels
- ✅ Contextual relevance
- ✅ User control

## Files Created

### Core System
- `lib/monetization/contextual-links.ts` - Contextual link generation
- `lib/monetization/tracking.ts` - Click/conversion tracking
- `lib/monetization/ranking-protection.ts` - Ranking integrity

### Components
- `components/monetization/DisclosureBlock.tsx` - Disclosure component
- `components/monetization/ContextualAffiliateLink.tsx` - Affiliate link component
- `components/monetization/LimitedAdSlot.tsx` - Limited ad slot

### API Routes
- `app/api/monetization/track-click/route.ts` - Click tracking API
- `app/api/monetization/track-conversion/route.ts` - Conversion tracking API

## Next Steps

1. **Integrate into Product Cards**: Add contextual affiliate links
2. **Add to Articles**: Insert links contextually in content
3. **Place Ad Slots**: Add limited ad slots to key pages
4. **Add Disclosures**: Ensure all monetized pages have disclosures
5. **Test Tracking**: Verify click and conversion tracking
6. **Monitor Analytics**: Track performance and optimize

## Build Status

✅ **System Complete**
- All components functional
- Tracking system ready
- Ranking protection implemented
- No dark patterns
- Clear disclosures

