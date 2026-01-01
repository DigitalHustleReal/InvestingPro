# Platform Linking System - Quick Reference

## Overview

This system implements the cross-platform linking framework that routes user intent across three platforms:
- **InvestingPro.in** (Cognitive/Educational)
- **BestStockBrokers.org** (Vendor Resolution)
- **SwingTrader** (Execution)

## Quick Start

### 1. Check if a link should exist

```typescript
import { evaluateLinkValue } from '@/lib/platform-linking/config';

const evaluation = evaluateLinkValue(
  'investingpro',      // Current platform
  'beststockbrokers', // Target platform
  'comparing',        // User intent: 'learning' | 'comparing' | 'executing'
  'contextual'        // Placement: 'footer' | 'contextual' | 'explainer' | 'hero' | 'cta'
);

if (evaluation.shouldLink) {
  console.log(evaluation.reason); // Why the link is valid
}
```

### 2. Use the CrossPlatformLink component

```tsx
import CrossPlatformLink from '@/components/common/CrossPlatformLink';

// Simple link
<CrossPlatformLink
  from="investingpro"
  to="beststockbrokers"
  userIntent="comparing"
  placement="contextual"
/>

// Custom content
<CrossPlatformLink
  from="investingpro"
  to="beststockbrokers"
  userIntent="comparing"
  placement="contextual"
  variant="subtle"
>
  Compare brokers on BestStockBrokers.org
</CrossPlatformLink>
```

### 3. Use ContextualLinkSection for multiple links

```tsx
import { ContextualLinkSection } from '@/components/common/CrossPlatformLink';

<ContextualLinkSection
  currentPlatform="investingpro"
  userIntent="comparing"
  title="Related Tools"
  description="When you're ready to take the next step"
/>
```

## Common Patterns

### Pattern 1: After Comparison Table

```tsx
// User has compared mutual funds, now needs to choose a broker
<CrossPlatformLink
  from="investingpro"
  to="beststockbrokers"
  userIntent="comparing"
  placement="contextual"
  variant="subtle"
>
  Ready to invest? Compare brokers →
</CrossPlatformLink>
```

### Pattern 2: Explainer Page CTA

```tsx
// On /advanced-tools/active-trading page
<a href="https://swingtrader.app" target="_blank" rel="noopener noreferrer">
  <Button>Visit SwingTrader</Button>
</a>
```

### Pattern 3: Footer Ecosystem Awareness

Already implemented in `components/layout/Footer.tsx`. No action needed.

## User Intent Detection

Determine user intent based on page context:

- **`learning`**: User is reading, comparing options, building knowledge
  - Pages: `/mutual-funds`, `/stocks`, blog posts, guides
  
- **`comparing`**: User is actively comparing products/providers
  - Pages: `/mutual-funds/compare`, `/credit-cards/compare`
  
- **`executing`**: User is ready to take action
  - Pages: `/portfolio`, after completing comparison

## Placement Guidelines

- **`footer`**: Ecosystem awareness (already implemented)
- **`contextual`**: After main content, in "Next steps" sections
- **`explainer`**: On dedicated explainer pages only
- **`hero`**: ❌ Never use
- **`cta`**: ❌ Never use

## Explainer Pages

Required for certain routes:

- **InvestingPro → SwingTrader**: `/advanced-tools/active-trading` ✅
- **InvestingPro → BestStockBrokers**: `/advanced-tools/broker-comparison` ✅

Always route through explainer pages, never link directly.

## Testing

```typescript
import { shouldLink, getExplainerPath } from '@/lib/platform-linking/config';

// Test if link should exist
const canLink = shouldLink('investingpro', 'swingtrader', 'executing', 'explainer');
console.log(canLink); // true

// Get explainer path
const path = getExplainerPath('investingpro', 'swingtrader');
console.log(path); // '/advanced-tools/active-trading'
```

## Platform Configs

Access platform information:

```typescript
import { PLATFORMS } from '@/lib/platform-linking/config';

console.log(PLATFORMS.investingpro.name); // 'InvestingPro.in'
console.log(PLATFORMS.investingpro.vocabulary); // ['explain', 'compare', ...]
```

## Troubleshooting

**Link not showing?**
1. Check user intent matches threshold
2. Verify placement is allowed
3. Ensure explainer page exists (if required)

**Wrong explainer path?**
- Update `LINKING_RULES` in `config.ts`
- Ensure explainer page exists at that path

## See Also

- Full documentation: `docs/CROSS_PLATFORM_LINKING_FRAMEWORK.md`
- Configuration: `lib/platform-linking/config.ts`
- Components: `components/common/CrossPlatformLink.tsx`


























