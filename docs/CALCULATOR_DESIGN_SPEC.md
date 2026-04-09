# InvestingPro Calculator Design Spec — Category-Best Standard

> **Goal:** Every calculator beats Groww + ET Money + NerdWallet + ClearTax combined
> **Moat:** AI insights + real product data + goal-based mode + shareable results
> **Template:** Build once, apply to all 128 calculators

---

## The 5 Differentiators (Nobody Else Has All 5)

### 1. AI Insight Engine
After every calculation, show 2-3 personalized insights:
- "If you started 3 years ago, you'd have ₹18.2L instead of ₹11.6L"
- "Your EMI of ₹43K is 55% of a ₹80K salary — banks recommend under 40%"
- "At this CAGR, your money doubles every 4.8 years (Rule of 72)"
- "Switching from FD (7%) to Nifty 50 SIP (12.5%) would give you ₹8.3L more"

### 2. Real Product Recommendations (from our DB)
- SIP calculator → "Top 5 funds matching 12% return" from our 51 MFs
- Home loan EMI → "Best rates" from our 61 loans
- FD calculator → "Highest FD rates" from our 25 FDs
- Demat → "Zero brokerage options" from our 14 brokers
- Credit card → "Best rewards for ₹X spend" from our 81 cards

### 3. Goal-Based Reverse Mode
Toggle: "I know my investment" ↔ "I know my goal"
- Forward: ₹5K/mo × 10Y × 12% = ₹11.6L
- Reverse: ₹50L goal × 10Y × 12% = ₹21,740/mo needed

### 4. What-If Scenarios (3-lane comparison)
Show Conservative / Moderate / Aggressive side by side:
- SIP: 8% / 12% / 15% returns
- Loan: current rate / -0.5% / -1%
- FD: 1Y / 3Y / 5Y tenure

### 5. Share Result as Branded Card
- Generate InvestingPro-branded result image
- WhatsApp share button (most used in India)
- Copy link with params (investingpro.in/calculators/sip?amt=5000&yr=10&ret=12)
- Download PDF report (email gate)

---

## Layout Template (All Calculators)

```
┌─────────────────────────────────────────────────┐
│ H1 + subtitle + breadcrumbs                     │
├────────────────────┬────────────────────────────┤
│                    │                            │
│  INPUT CARD        │  RESULT CARD               │
│  ─────────────     │  ─────────────             │
│  Mode toggle       │  BIG NUMBER (7xl)          │
│  (forward/goal)    │  Rating badge              │
│                    │  3-col metrics              │
│  SliderInput 1     │                            │
│  SliderInput 2     │  AI INSIGHT (amber box)    │
│  SliderInput 3     │                            │
│                    │                            │
├────────────────────┴────────────────────────────┤
│                                                 │
│  WHAT-IF SCENARIOS (3 cards side by side)        │
│  Conservative │ Moderate │ Aggressive            │
│                                                 │
├─────────────────────────┬───────────────────────┤
│                         │                       │
│  GROWTH CHART           │  PRODUCT RECS         │
│  (area/bar, dynamic)    │  from our DB          │
│                         │  "Top 5 funds at 12%" │
│                         │  [View All →]         │
│                         │                       │
├─────────────────────────┴───────────────────────┤
│                                                 │
│  YEAR-WISE BREAKDOWN TABLE                       │
│  (expandable, first 5 shown)                     │
│                                                 │
├─────────────────────────────────────────────────┤
│  SHARE / DOWNLOAD                                │
│  [WhatsApp] [Twitter] [Copy Link] [Download PDF] │
├─────────────────────────────────────────────────┤
│  FAQ (5 questions, details/summary, FAQPage LD)  │
├─────────────────────────────────────────────────┤
│  RELATED CALCULATORS (horizontal scroll)         │
├─────────────────────────────────────────────────┤
│  SEO CONTENT (1500 words, below fold)            │
└─────────────────────────────────────────────────┘
```

---

## Component Architecture

```
components/calculators/
  shared/
    SliderInput.tsx        ← Editable value + slider (done)
    charts.tsx             ← SSR-safe Recharts (done)
    ResultCard.tsx         ← Big number + rating + metrics
    AIInsight.tsx          ← Contextual insight engine
    WhatIfScenarios.tsx    ← 3-lane comparison cards
    ProductRecs.tsx        ← Real products from DB
    YearlyBreakdown.tsx    ← Expandable table
    ShareResult.tsx        ← WhatsApp/Twitter/Copy/PDF
    CalculatorLayout.tsx   ← Master layout wrapper
```

---

## Mobile Layout

```
┌─────────────────────┐
│ H1 + breadcrumbs    │
├─────────────────────┤
│ RESULT CARD (sticky │
│ at top when scroll) │
│ BIG NUMBER          │
│ 3 metrics           │
├─────────────────────┤
│ INPUT CARD          │
│ (always visible,    │
│  NOT collapsed)     │
│ SliderInput 1       │
│ SliderInput 2       │
│ SliderInput 3       │
├─────────────────────┤
│ AI INSIGHT          │
├─────────────────────┤
│ WHAT-IF (scroll)    │
├─────────────────────┤
│ CHART               │
├─────────────────────┤
│ PRODUCT RECS        │
├─────────────────────┤
│ SHARE               │
├─────────────────────┤
│ FAQ                 │
└─────────────────────┘
```

Key: Result shows FIRST on mobile (user sees answer immediately),
inputs below (they can adjust). Result card sticks to top on scroll.
