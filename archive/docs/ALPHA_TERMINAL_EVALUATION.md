# Alpha Terminal Evaluation & Refactoring Plan

## ❌ Current Problem: Focus Dilution

### Issue Analysis
1. **Violates Framework**: TerminalOverview is execution-focused (real-time trading) on InvestingPro (cognitive layer)
2. **Dilutes Primary Job**: InvestingPro should focus on education/comparison, not execution
3. **NerdWallet Syndrome**: Too many features competing for attention on homepage
4. **Wrong User Intent**: Users on InvestingPro are learning, not ready to execute trades

### Framework Violation
- **InvestingPro** = Cognitive/Educational Layer (explain, compare, guide)
- **SwingTrader** = Execution Layer (real-time, execute, monitor)
- **Current**: Terminal section on homepage = execution features on cognitive platform ❌

---

## ✅ Solution: Teaser Page + Footer Link

### Implementation Plan

1. **Remove from Homepage**
   - Remove `TerminalOverview` component from homepage
   - Keep homepage focused on: Hero → Categories → Tools → Comparisons

2. **Create Teaser Page**
   - Route: `/alpha-terminal` (or `/advanced-tools/alpha-terminal`)
   - Purpose: Explain what Alpha Terminal is, who needs it
   - Link to SwingTrader.com through explainer page

3. **Footer Navigation**
   - Add "Alpha Terminal" to Tools section in footer
   - Links to teaser page

4. **Update Explainer Page**
   - `/advanced-tools/active-trading` should mention SwingTrader.com specifically
   - "Open Terminal" button → explainer page → SwingTrader.com

---

## ✅ Benefits

1. **Maintains Focus**: Homepage stays educational/comparison-focused
2. **Follows Framework**: Execution features only accessible through proper routing
3. **Reduces Cognitive Load**: Users aren't overwhelmed with execution tools while learning
4. **SEO-Friendly**: Dedicated page for "alpha terminal" keyword
5. **Scalable**: Can add more advanced tools later without cluttering homepage

---

## Implementation Status

- [x] Evaluation complete
- [ ] Remove TerminalOverview from homepage
- [ ] Create teaser page
- [ ] Update footer navigation
- [ ] Update explainer page to link to SwingTrader.com
- [ ] Update TerminalOverview component to route through explainer


