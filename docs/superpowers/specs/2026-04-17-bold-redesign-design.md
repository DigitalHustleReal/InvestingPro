# InvestingPro Bold Redesign — Design Spec

> "Editorially Bold, Regulatorily Transparent, Unapologetically Indian"

## Direction
A+D+B Hybrid: Editorial Authority + Bold Disruptive + Consumer Fintech
Think: The Verge of Indian finance meets CRED meets Razorpay

## Design Language (APPROVED)

### Typography
- **Display:** Playfair Display 900 — heroes, headlines, verdicts (letter-spacing: -2px)
- **Body:** Inter 400-700 — all UI and body text
- **Data:** JetBrains Mono 400-500 — rates, scores, dates, labels, badges (uppercase, tracking-wider)

### Colors
| Token | Value | Use |
|-------|-------|-----|
| Ink | #0A1F14 | Primary text, dark sections |
| Authority Green | #166534 | Brand, trust signals |
| Action Green | #16A34A | CTAs, positive data |
| Indian Gold | #D97706 | Accent, methodology links, premium highlights |
| Canvas | #FAFAF9 | Page background |
| Warning | #DC2626 | Negative data, alerts |

**Rules:** No blue. No purple. No gradients except hero. No border-radius on cards (0px = authority).

### Signature Elements
1. **Verdict Cards** — Bold serif headline + opinion + "Methodology disclosed →" gold link
2. **Data Strips** — Ink header + monospace values, live rates
3. **Score Badges** — Square border, large monospace number, weighted criteria link
4. **Section Labels** — JetBrains Mono, 11px, uppercase, letter-spacing: 3px, gold color

### Principles
- Sharp corners = sharp opinions
- Monospace = data (measured), Serif = opinion (editorial)
- Every opinion links to methodology
- Indian DNA through ₹ symbol, gold accents — no decorative kitsch

---

## Phase 1: Design Tokens + Navbar + Footer

### Navbar
- Sticky, white bg, 2px bottom border (ink)
- Logo: "InvestingP₹o" in Playfair Display 700
- Nav items: Inter 500, uppercase JetBrains Mono for category labels
- Mega menu: 2-tier, editorial style — featured article + category links + "Editor's Pick" badge
- Mobile: Full-screen overlay, large touch targets, category icons
- Search: Command palette (Cmd+K), prominent

### Footer
- Ink (#0A1F14) background, no grid texture (clean)
- 5 columns: Products / Learn / Tools / Company / Legal
- Gold accent on hover
- Trust bar: "No paid rankings · Methodology disclosed · SEBI-compliant advice"
- Newsletter: Inline, not modal

## Phase 2: Homepage

### Hero
- Full-width, Ink background
- Playfair Display 900, ~72px: "India's most opinionated finance platform."
- Subhead Inter 400: "We test products, crunch data, and tell you what's actually worth your money."
- Gold accent line separator
- 3 stat counters: "228 articles · 75 calculators · 1,000+ products tested"
- CTA: "Start comparing →" (Action Green, square button)

### Sections (top to bottom)
1. **Hero** — Brand statement + stats
2. **Live Data Strip** — Ticker: best FD rate, cheapest home loan, Nifty 50 (monospace, auto-updating)
3. **Editor's Picks** — 3 verdict cards, opinionated headlines, Grok images
4. **Category Navigator** — 7 category blocks, each with icon + "X products tested" + top 3 links
5. **Calculator Spotlight** — 3 interactive calculator previews with live results
6. **Latest Articles** — Editorial grid, asymmetric layout, large feature + 4 small
7. **Trust & Methodology** — "How we rate" section with 6 criteria cards
8. **Newsletter** — Inline signup, no popup

## Phase 3: Product Pages (Credit Cards, Loans, MF, Insurance, Demat, FD)

### Product Listing
- Hero: Category name in Playfair 900 + "X products tested" monospace badge
- Filter bar: Horizontal pills, square corners, sticky on scroll
- Product cards: Full-width stacked, 0px radius, 2px ink border
  - Left: Product image/logo
  - Center: Key specs in data strip format (monospace values)
  - Right: Score badge (square) + "APPLY NOW" CTA (square, green)
  - Expandable: "Our Take" verdict + methodology link
- Comparison bar: Fixed bottom, "Compare X products" with square chips

### Product Detail (future)
- Full verdict page with score breakdown
- Pros/cons in data strips
- "Similar products" sidebar

## Phase 4: Article Experience

### Article Listing
- Editorial grid: 1 large feature (60% width) + 2 small (40% width) top row
- Below: 3-column grid, square cards, Grok/branded images
- Category filter: Horizontal pills, active = ink bg + white text
- Search prominent

### Article Detail
- Full-width hero image (Grok photo, edge-to-edge)
- Title: Playfair Display 900, ~40px
- Byline: "InvestingPro [Category] Desk · [Date] · [Read time]" in JetBrains Mono
- Body: Inter 400, 18px, max-width 720px, generous line-height (1.8)
- Pull quotes: Playfair Display Italic, gold left border
- Data tables: Monospace values, ink header, zebra stripe
- Sidebar: Sticky TOC + related products + calculator CTA
- Bottom: Related articles (3 cards) + sources + feedback

## Phase 5: Calculators + Remaining Pages

### Calculator Hub
- Grid of calculator cards, each with icon + live preview number
- Category grouping with JetBrains Mono section labels

### Individual Calculator
- Split layout: inputs left, results right (desktop)
- Results in large monospace numbers
- "Products for you" section below results (cross-sell)
- Share results button

---

## Assets for Super Grok (User generates separately)
- Custom category icons (7 categories)
- Hero background pattern/texture
- Product category illustrations
- OG image template refresh
- Favicon update to match new identity

## Tech Notes
- All changes are CSS/component level — no architectural changes
- Keep existing shadcn/ui primitives, override styles via CSS variables
- Tailwind CSS 4 with updated design tokens
- Dark mode: Ink as primary bg, Canvas text, reduced gold brightness
- No new dependencies except font imports
