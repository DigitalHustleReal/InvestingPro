# Admin / CMS Deep Audit — InvestingPro 2026
## How to Get Stunning, Formatted, Optimised Content Output

> **Audit Date**: March 21, 2026
> **Status**: Root cause identified + all fixes implemented

---

## EXECUTIVE SUMMARY

The admin/CMS is architecturally excellent — TipTap editor, AI generation pipeline, 30+ admin sections, compliance system, scheduling. But content output was **mediocre** because of 3 specific disconnects between the CSS visual system and the AI generation pipeline.

**All 3 issues are now fixed.**

---

## THE ROOT CAUSE OF MEDIOCRE CONTENT (Before Fix)

### Problem 1: AI Prompt → Plain Markdown

The AI was instructed to output "standard markdown". The result was plain text that rendered as generic prose — completely ignoring the rich CSS visual components built into the platform.

**Before prompt (what it said):**
```
Use standard Markdown. Use bolding for emphasis.
```

**What the AI produced:**
```markdown
## Key Takeaways
- Point one
- Point two
- Point three

## Introduction
The repo rate in India is currently 6.5%...
```

**What rendered on the page:** Plain bullet list, plain text. No visual interest.

### Problem 2: normalizeArticleBody() Stripped Custom Divs

Even if an editor manually typed `<div class="key-takeaways">`, the normalize function only allowed 3 CSS classes: `['key-takeaways', 'pro-tip', 'warning-box']`. All other visual components (`metric-card`, `comparison-grid`, `allocation-container`, etc.) were stripped to nothing.

**Before ALLOWED_CLASSES (3 classes):**
```typescript
const ALLOWED_CLASSES = ['key-takeaways', 'pro-tip', 'warning-box'];
```

**After ALLOWED_CLASSES (20+ classes):**
```typescript
const ALLOWED_CLASSES = [
  'key-takeaways', 'pro-tip', 'warning-box', 'quick-verdict',
  'metrics-grid', 'metric-card', 'metric-label', 'metric-value',
  'comparison-grid', 'comparison-card',
  'allocation-container', 'allocation-item',
  'badge', 'badge-success', 'badge-info', 'badge-warning',
  // ...
];
```

### Problem 3: enrichContent() Had No Visual Shortcodes

The shortcode system only had `[sip-calculator]` and `[auto-calculator]`. None of the visual components had shortcodes, meaning writers couldn't easily insert them.

---

## WHAT WAS BUILT (The Fix)

### 1. Shortcode System (`lib/content/shortcodes.ts`)

10 new visual shortcodes that expand to stunning HTML components:

| Shortcode | Visual Output | CSS Component |
|-----------|--------------|---------------|
| `[key-takeaways]` | Green box with checkmarks | `.key-takeaways` |
| `[pro-tip]` | Blue expert insight box | `.pro-tip` |
| `[warning]` | Amber caution box | `.warning-box` |
| `[quick-verdict]` | Slate recommendation box | `.quick-verdict` |
| `[stats]` | Grid of metric cards | `.metrics-grid + .metric-card` |
| `[comparison-grid]` | Side-by-side product cards | `.comparison-grid` |
| `[comparison-card]` | Individual product card | `.comparison-card` |
| `[allocation]` | Portfolio breakdown bars | `.allocation-container` |
| `[fact-box]` | Sourced data box | `.pro-tip` (styled) |
| `[expert-quote]` | Styled blockquote | `blockquote` |
| `[badge]` | Inline colored badge | `.badge-*` |

### 2. Category-Specific Rich Prompts (`lib/ai/rich-content-prompts.ts`)

4 category-specific prompts that instruct the AI to use shortcodes:
- `getCreditCardPrompt()` — 12 required sections, shortcode examples
- `getMutualFundPrompt()` — AMFI data, allocation, stats
- `getInsurancePrompt()` — IRDAI data, compliance-first
- `getPersonalFinancePrompt()` — relatable Indian scenarios

The prompts include the complete `SHORTCODE_REFERENCE` with examples for every component.

### 3. Shortcode Cheatsheet in Admin (`components/admin/ShortcodeCheatsheet.tsx`)

New collapsible panel in the article editor sidebar:
- Shows all 10 shortcodes with visual descriptions
- Copy-to-clipboard button on each
- Added to every article edit page at `/admin/articles/[id]/edit`

### 4. Article Writer Upgrade (`lib/ai/article-writer.ts`)

- Added `category` and `useRichPrompt` params to `GenerateArticleParams`
- Routes to `getPromptForCategory(category)` for rich output
- Captures `schema_faq` from AI response for FAQ schema markup
- Processes shortcodes BEFORE markdown conversion in normalize pipeline

---

## THE COMPLETE SHORTCODE REFERENCE

### 1. Key Takeaways (use at top of EVERY article)

```
[key-takeaways]
- First key point readers will remember
- Second key point with specific data
- Third actionable insight
- Fourth point (4-5 total)
[/key-takeaways]
```

→ Renders as: Green gradient box, white checkmark bullets, subtle shadow

---

### 2. Pro Tip (use 1-2 times per article)

```
[pro-tip title="Expert Insight"]
Your specific, actionable tip here. Be concrete and useful.
[/pro-tip]
```

→ Renders as: Blue gradient box with 💡 icon

---

### 3. Warning Box (risks, regulatory cautions)

```
[warning title="Important Caution"]
The risk or caution the reader absolutely must know.
[/warning]
```

→ Renders as: Amber gradient box with ⚠️ icon

---

### 4. Quick Verdict (comparison articles, use top + bottom)

```
[quick-verdict]
Our evidence-based recommendation in 2-3 clear sentences.
[/quick-verdict]
```

→ Renders as: Slate gradient box with ⚡ label

---

### 5. Stats Grid (data sections)

```
[stats]
Repo Rate | 6.50% | success
Inflation | 5.1% | warning
GDP Growth | 6.8% | info
Sensex YTD | +12.3% | success
[/stats]
```

Format: `Label | Value | color (success/info/warning/danger)`

→ Renders as: Responsive grid of metric cards with hover effects

---

### 6. Comparison Grid + Cards

```
[comparison-grid]
[comparison-card title="HDFC Regalia Gold"]
- Annual fee: ₹2,500 + GST
- Lounge: 12 domestic/year
- Rewards: 4 pts/₹150
- Best for: Occasional travelers
[/comparison-card]
[comparison-card title="Axis Magnus"]
- Annual fee: ₹12,500 + GST
- Lounge: Unlimited
- Rewards: 12 EDGE Miles/₹200
- Best for: Heavy spenders
[/comparison-card]
[/comparison-grid]
```

→ Renders as: Side-by-side cards with gradient top border, hover lift effect

---

### 7. Portfolio Allocation

```
[allocation title="Suggested Portfolio Mix"]
Large Cap Equity | 40% | 40
Mid Cap Equity | 25% | 25
Small Cap | 15% | 15
Debt Funds | 10% | 10
Gold ETF | 10% | 10
[/allocation]
```

Format: `Asset Class | Display Value | Bar Width (0-100)`

→ Renders as: Color-coded allocation bars with hover slide effect

---

### 8. Fact Box (cite RBI/SEBI/AMFI data)

```
[fact-box source="RBI Annual Report 2025"]
India's household savings rate stands at 18.4% of GDP, but
only 4.8% is invested in financial assets beyond bank deposits.
[/fact-box]
```

→ Renders as: Blue box with 📊 icon + source badge

---

### 9. Expert Quote

```
[expert-quote name="Nilesh Shah" role="MD, Kotak Mutual Fund"]
"Equity mutual funds remain the most accessible vehicle for
long-term wealth creation for retail investors."
[/expert-quote]
```

→ Renders as: Styled blockquote with green left border + attribution

---

### 10. Inline Badge

```
[badge type="success"]SEBI Regulated[/badge]
[badge type="warning"]Lock-in Period[/badge]
[badge type="info"]Tax Saver[/badge]
```

→ Renders as: Gradient colored pill badge inline

---

## HOW TO GENERATE STUNNING CONTENT

### Option A: AI Content Factory (Automated)

1. Go to `/admin/content-factory`
2. Select **Category** (e.g. Credit Cards)
3. Enter **Topic** (e.g. "Best credit cards for airport lounge access India 2026")
4. Enter **Keywords** (e.g. "airport lounge credit card, free lounge access India")
5. Click **Generate**

The AI now:
- Receives the full `getCreditCardPrompt()` with shortcode instructions
- Generates content with `[key-takeaways]`, `[stats]`, `[comparison-grid]` embedded
- Returns `schema_faq` for FAQ structured data
- Content processes through `processShortcodes()` → beautiful HTML

**Before fix**: Generic 800-word markdown → plain rendered text
**After fix**: 2,500-word article with visual boxes, metric grids, comparison cards

---

### Option B: Manual Writing in TipTap Editor

1. Go to `/admin/articles/new` or edit an existing article
2. In the right sidebar → **Visual Shortcodes** panel (new)
3. Click any shortcode to expand it → click Copy
4. Paste into the TipTap editor
5. Fill in the content
6. Click **Preview** to see the rendered output
7. Publish

**Tip**: The shortcodes work in both markdown mode and the visual editor.

---

### Option C: Bulk Article Generation (Script)

```typescript
// scripts/generate-rich-articles.ts
import { generateArticle } from '@/lib/ai/article-writer'
import { createServiceClient } from '@/lib/supabase/service'

const BATCH = [
  { topic: 'HDFC Regalia Gold vs Axis Magnus', category: 'credit-cards', keywords: ['hdfc regalia vs axis magnus', 'best premium credit card india'] },
  { topic: 'Best SIP funds for 2026', category: 'mutual-funds', keywords: ['best sip 2026', 'top sip funds india'] },
  { topic: 'Term insurance buying guide India', category: 'insurance', keywords: ['term insurance india', 'best term plan 2026'] },
]

for (const item of BATCH) {
  const article = await generateArticle({
    topic: item.topic,
    keywords: item.keywords,
    category: item.category,
    useRichPrompt: true, // Uses category-specific rich prompt
  })

  // article.content now has [key-takeaways], [stats], [comparison-grid] embedded
  // These render as beautiful visual components on the public page
  await saveToDatabase(article)
}
```

---

## CONTENT QUALITY CHECKLIST

For every article before publishing:

**Structure:**
- [ ] Starts with `[key-takeaways]` block (4-5 points)
- [ ] Has `[quick-verdict]` for comparison articles
- [ ] At least 1 `[pro-tip]` block
- [ ] At least 1 `[warning]` block for risks
- [ ] `[stats]` block for any section with 3+ numbers
- [ ] Uses markdown table for any comparison (2+ products, 3+ criteria)
- [ ] Ends with FAQ section (5+ Q&As)

**SEO:**
- [ ] Primary keyword in H1 title (under 65 chars)
- [ ] Primary keyword in first paragraph
- [ ] `seo_title` filled (under 60 chars)
- [ ] `seo_description` filled (under 155 chars)
- [ ] At least 5 tags
- [ ] Category correctly set

**Compliance:**
- [ ] No guaranteed return claims
- [ ] No "best option for you" advice
- [ ] No "risk-free investment"
- [ ] Has affiliate disclosure (auto-injected by AdvertiserDisclosure component)
- [ ] SEBI disclaimer visible

**Content:**
- [ ] 2,000–3,500 words (comparison guides)
- [ ] At least 1 markdown table
- [ ] Indian examples (₹ currency, Indian companies, Indian regulators)
- [ ] Data cited with source ([fact-box] or inline attribution)
- [ ] Featured image set

---

## ADMIN CMS SECTION MAP

| Section | Route | Purpose |
|---------|-------|---------|
| Dashboard | `/admin` | Overview metrics |
| Articles | `/admin/articles` | List, search, filter all articles |
| New Article | `/admin/articles/new` | Create with TipTap editor |
| Edit Article | `/admin/articles/[id]/edit` | Edit + ShortcodeCheatsheet sidebar |
| Content Factory | `/admin/content-factory` | AI bulk generation |
| Pillar Pages | `/admin/pillar-pages` | SEO hub pages |
| Content Calendar | `/admin/calendar` | Publishing schedule |
| Automation Hub | `/admin/automation` | Cron job management |
| Product Catalog | `/admin/products` | Financial product database |
| Revenue Dashboard | `/admin/revenue` | Affiliate + subscription metrics |
| SEO Health | `/admin/seo` | Rankings, issues, opportunities |
| Analytics | `/admin/analytics` | Traffic + engagement |
| Email Dashboard | `/admin/email` | Newsletter + sequences |
| AI Budget | `/admin/pipeline/budget` | AI generation cost tracking |

---

## TECHNICAL STACK

| Layer | Technology | Files |
|-------|-----------|-------|
| **Editor** | TipTap v2 (WYSIWYG) | `components/admin/ArticleEditor.tsx` |
| **Rendering** | dangerouslySetInnerHTML + CSS | `components/articles/ArticleRenderer.tsx` |
| **Styling** | article-content.css | `app/articles/[slug]/article-content.css` |
| **Shortcodes** | processShortcodes() | `lib/content/shortcodes.ts` ← NEW |
| **Normalizer** | normalizeArticleBody() | `lib/content/normalize.ts` ← FIXED |
| **Auto-linking** | enrichContent() | `lib/content/link-manager.ts` |
| **AI Prompts** | getPromptForCategory() | `lib/ai/rich-content-prompts.ts` ← NEW |
| **AI Writer** | generateArticle() | `lib/ai/article-writer.ts` ← UPGRADED |
| **Cheatsheet** | ShortcodeCheatsheet | `components/admin/ShortcodeCheatsheet.tsx` ← NEW |
| **Database** | Supabase PostgreSQL | articles table (body_markdown primary) |
| **Schema** | Article + FAQ + Product | `lib/linking/schema.ts` |

---

## EXPECTED CONTENT OUTPUT QUALITY

### Before (plain markdown output):

```
## Best Credit Cards for Lounge Access

Airport lounges offer free food and WiFi. Here are the top cards:

- HDFC Regalia Gold: ₹2,500 fee, 12 lounges
- Axis Magnus: ₹12,500 fee, unlimited
- SBI Elite: ₹4,999 fee, 6 lounges
```

Plain. Boring. Indistinguishable from ChatGPT.

### After (rich shortcode output):

```
[key-takeaways]
- HDFC Regalia Gold offers best value under ₹3,000/year — 12 domestic lounges
- Axis Magnus is only worth it above ₹1.5L/month spend
- Annual fee is waived on spend milestones for all 3 cards
- Priority Pass coverage: check lounge finder before travel
[/key-takeaways]

[quick-verdict]
For professionals spending ₹50K–₹1L/month, the HDFC Regalia Gold offers the best
lounge-to-fee ratio in India. Axis Magnus is justified only for heavy spenders.
[/quick-verdict]

[stats]
Average Lounge Cost | ₹700 | warning
Break-Even Visits (Regalia) | 4/year | success
Active Priority Pass Lounges | 1,300+ | info
Annual Card Reward Value | ₹8,500 | success
[/stats]

[comparison-grid]
[comparison-card title="HDFC Regalia Gold ⭐ Best Value"]
- Annual fee: ₹2,500 + GST
- Lounge: 12 domestic + 6 international
- Rewards: 4 pts per ₹150
- Min income: ₹1L/month
[/comparison-card]
[comparison-card title="Axis Magnus 🏆 Premium"]
- Annual fee: ₹12,500 + GST
- Lounge: Unlimited domestic
- Rewards: 12 EDGE Miles per ₹200
- Min income: ₹1.8L/month
[/comparison-card]
[/comparison-grid]

[warning title="Lounge Visit Limit Trap"]
Most "12 visits/year" cards actually mean 3 per quarter — the counter resets
quarterly, not annually. Using 4 visits in Q1 doesn't give you extra in Q4.
[/warning]
```

**Renders as**: Visual dashboard-quality content with green boxes, metric grid, comparison cards, amber warning. Professional. Trustworthy. Shareable.

---

*Audit by Claude — March 21, 2026*
