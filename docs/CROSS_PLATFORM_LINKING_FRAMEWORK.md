# Cross-Platform Linking Framework

**Version 1.0** | Internal Documentation

## Core Principle

> **"You are not linking products. You are routing user intent across increasingly sophisticated levels."**

Every link must answer one question:

> **"What is the *next rational step* for this user, given what they are doing right now?"**

If a link does not answer that, it should not exist.

---

## The Three Platforms

### 1. InvestingPro.in — *Cognitive Layer*

**Primary Job:**
- Reduce confusion
- Explain choices
- Compare options
- Build confidence

**User State:**
- Still figuring out *what* to do
- Learning about investment options
- Comparing strategies and products
- Building foundational knowledge

**Vocabulary:**
- explain, compare, guide, understand, learn, research, analyze

**Tone:**
- Calm, analytical, neutral, educational

**Linking Rules:**
- ✅ Can link forward to:
  - Deeper comparison (BestStockBrokers)
  - Advanced execution explanation (SwingTrader explainer page)
- ❌ Never link directly to execution from shallow pages
- ✅ Only through explainer pages for SwingTrader

---

### 2. BestStockBrokers.org — *Vendor Resolution Layer*

**Primary Job:**
- Help users decide *who to trust* as an intermediary
- Compare fees, tools, reliability
- Choose infrastructure, not strategy

**User State:**
- Already decided to trade/invest
- Choosing infrastructure
- Comparing brokers, platforms, tools

**Vocabulary:**
- fees, tools, reliability, compare, broker, platform, infrastructure

**Tone:**
- Calm, analytical, neutral, comparison-focused

**Linking Rules:**
- ✅ Backward link → InvestingPro (for education)
- ✅ Forward link → SwingTrader (only when frequency/sophistication threshold is crossed)
- This site is a **bridge**, not a destination

---

### 3. SwingTrader — *Execution Layer*

**Primary Job:**
- Speed
- Precision
- Real-time action

**User State:**
- Acting now
- Already informed
- Ready to execute trades

**Vocabulary:**
- real-time, execute, monitor, trade, action, live, instant

**Tone:**
- Calm, analytical, neutral, action-oriented

**Linking Rules:**
- ❌ Never push outward aggressively
- ✅ Only offer "context exits":
  - "Learn more" → InvestingPro
  - "Compare brokers" → BestStockBrokers
- Execution should not pretend to educate

---

## Link Placement Rules

### ✅ Correct Places

1. **Footer** (ecosystem awareness)
   - Subtle, footnote-style
   - Not promotional
   - Just awareness

2. **Contextual Sections**
   - "Advanced tools"
   - "Next steps"
   - "Related resources"
   - After main content, not before

3. **Dedicated Explainer Pages**
   - Bridge pages that explain why another platform exists
   - Neutral, educational tone
   - Single, calm CTA

### ❌ Wrong Places

1. **Hero Sections**
   - Never in hero banners
   - Too promotional

2. **Primary CTAs**
   - Never in main call-to-action buttons
   - Dilutes primary intent

3. **Above-the-Fold on Homepage**
   - Too aggressive
   - Feels like promotion

4. **Navigation Menus**
   - Keep navigation clean
   - Links should feel like footnotes, not banners

---

## The Explainer Page Principle

**This is KEY.**

For *every* cross-platform link, there should exist:

> **A neutral explainer page that answers "Why would someone ever need this?"**

### Example Flow:

**InvestingPro → SwingTrader:**
1. ❌ Never link directly from shallow educational content
2. ✅ Always route through: `/advanced-tools/active-trading`
3. Explainer page explains:
   - When guide-based investing isn't enough
   - What active trading platforms provide
   - Who should use them
   - Single CTA to SwingTrader

**InvestingPro → BestStockBrokers:**
1. ✅ Route through: `/advanced-tools/broker-comparison`
2. Explainer page explains:
   - The gap between knowledge and action
   - Why broker comparison is separate
   - When to use it
   - Single CTA to BestStockBrokers

### Why This Works:

- ✅ SEO-safe (content-rich pages)
- ✅ Trust-positive (educational, not promotional)
- ✅ Regulator-friendly (clear intent, no hidden agendas)
- ✅ Scalable (can add more platforms later)
- ✅ Feels grown-up (professional, thoughtful)

---

## Decision Logic

When evaluating whether to add a link, ask:

1. **Is the user learning?**
   → Stay on InvestingPro

2. **Is the user comparing providers?**
   → BestStockBrokers

3. **Is the user ready to act in real time?**
   → SwingTrader

**If two answers are "yes", choose the simpler platform.**

This prevents over-routing.

---

## Value Test

Every link must pass this test:

> **"Does this link reduce uncertainty or increase cognitive load?"**

- ✅ **Reduces uncertainty** → Keep it
- ❌ **Increases cognitive load** → Remove it

Most dilution happens because links are added for *visibility*, not clarity.

---

## Vocabulary Consistency

**Critical:** Maintain vocabulary separation across layers.

### InvestingPro:
- explain, compare, guide, understand, learn, research, analyze

### BestStockBrokers:
- fees, tools, reliability, compare, broker, platform, infrastructure

### SwingTrader:
- real-time, execute, monitor, trade, action, live, instant

**No vocabulary leakage across layers.**

Same tone family (calm, analytical, neutral), but different vocabulary sets.

---

## Mental Model

Think of the ecosystem like a university:

- **InvestingPro** = Textbook
- **BestStockBrokers** = Admissions Office
- **SwingTrader** = Lab

**You don't run lab equipment from the textbook margin.**

If you reason this way, you'll make good decisions.

---

## Implementation Guide

### Using the Configuration System

```typescript
import { evaluateLinkValue, PLATFORMS } from '@/lib/platform-linking/config';

// Check if a link should exist
const evaluation = evaluateLinkValue(
  'investingpro',      // from
  'beststockbrokers',  // to
  'comparing',         // userIntent
  'contextual'         // placement
);

if (evaluation.shouldLink) {
  // Render the link
}
```

### Using the CrossPlatformLink Component

```tsx
import CrossPlatformLink from '@/components/common/CrossPlatformLink';

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

### Using ContextualLinkSection

```tsx
import { ContextualLinkSection } from '@/components/common/CrossPlatformLink';

<ContextualLinkSection
  currentPlatform="investingpro"
  userIntent="comparing"
  title="Related Tools"
  description="Tools for when you're ready to take the next step"
/>
```

---

## Examples

### ✅ Good Link Placement

**Page:** `/mutual-funds/compare`
**User Intent:** `comparing`
**Placement:** `contextual` (after comparison table)
**Link:** InvestingPro → BestStockBrokers
**Why:** User has compared funds, now needs to choose where to invest

---

### ❌ Bad Link Placement

**Page:** `/mutual-funds` (homepage)
**User Intent:** `learning`
**Placement:** `hero` (main banner)
**Link:** InvestingPro → SwingTrader
**Why:** User is still learning, not ready for execution. Also, hero placement is wrong.

---

### ✅ Good Explainer Page

**Path:** `/advanced-tools/active-trading`
**Purpose:** Bridge InvestingPro → SwingTrader
**Content:**
- Explains when guide-based investing isn't enough
- Describes what active trading platforms provide
- Lists who should use them
- Single, calm CTA to SwingTrader
**Why:** Educational, neutral, reduces uncertainty

---

## Maintenance

### Adding a New Platform

1. Add platform config to `lib/platform-linking/config.ts`
2. Define linking rules (from/to, placements, intent thresholds)
3. Create explainer pages for each valid route
4. Update Footer ecosystem section
5. Document vocabulary and tone

### Modifying Rules

1. Update `LINKING_RULES` in config
2. Update explainer pages if needed
3. Test with `evaluateLinkValue()` function
4. Update this documentation

---

## Checklist for New Links

Before adding any cross-platform link, verify:

- [ ] Link answers "What is the next rational step?"
- [ ] Placement is allowed (not hero, not primary CTA)
- [ ] User intent matches threshold
- [ ] Explainer page exists (if required)
- [ ] Vocabulary matches platform
- [ ] Link reduces uncertainty (doesn't increase cognitive load)
- [ ] Link feels like a footnote, not a banner

---

## Questions?

If you're unsure whether a link should exist:

1. Ask: "What is the next rational step?"
2. Check: Does it reduce uncertainty?
3. Verify: Is placement appropriate?
4. Confirm: Does explainer page exist?

When in doubt, **don't link**. It's better to have fewer, more intentional links than many confusing ones.

---

**Last Updated:** 2025-01-19
**Maintained By:** Development Team
























