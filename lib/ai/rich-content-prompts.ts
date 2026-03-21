/**
 * Rich Content Prompt System
 *
 * Category-specific AI prompts that instruct the model to use InvestingPro's
 * visual shortcode system, producing stunning formatted content instead of
 * plain markdown.
 *
 * The shortcodes expand to beautiful styled HTML components via:
 *   lib/content/shortcodes.ts → processShortcodes()
 *   app/articles/[slug]/article-content.css → visual styles
 *
 * Writing styles (from financialExpertPrompts.ts):
 *   'investopedia' — authoritative, educational, regulatory depth
 *   'nerdwallet'   — practical, comparison-focused, decision-making help
 *   'hybrid'       — (default) combines depth + actionability
 */

export type WritingStyle = 'investopedia' | 'nerdwallet' | 'hybrid'

// ─── Expert Persona Headers (injected before base prompt) ────────────────────

function getPersonaHeader(style: WritingStyle, topic: string): string {
  switch (style) {
    case 'investopedia':
      return `You are a senior financial educator and analyst with 20+ years of experience, writing for InvestingPro.in — India's Investopedia equivalent. Your writing is authoritative, educational, and technically rigorous. You cite RBI/SEBI/AMFI regulatory sources, include relevant formulas and calculations, and maintain academic precision while remaining accessible to Indian retail investors. Every fact is verifiable. No speculation or predictions. Topic: ${topic}\n\n`
    case 'nerdwallet':
      return `You are a financial comparison expert and consumer advocate with 15+ years of experience, writing for InvestingPro.in — India's NerdWallet equivalent. Your writing is practical, conversational, and decision-focused. You help readers compare options side-by-side, highlight costs and fees, and identify which product suits which user scenario. Topic: ${topic}\n\n`
    case 'hybrid':
    default:
      return `You are a senior financial writer for InvestingPro.in combining Investopedia's educational depth with NerdWallet's practical focus. You provide authoritative analysis AND actionable guidance — helping readers both understand concepts deeply and make better financial decisions. Topic: ${topic}\n\n`
  }
}

// ─── Shortcode Reference (included in every prompt) ────────────────────────

export const SHORTCODE_REFERENCE = `
## VISUAL COMPONENTS — Use these shortcodes to create stunning formatted content

### 1. Key Takeaways Box (green, use near the top of every article)
[key-takeaways]
- First key point readers will remember
- Second key point
- Third key point
[/key-takeaways]

### 2. Pro Tip Box (blue, use 1-2 times per article)
[pro-tip title="Expert Insight"]
Your actionable tip here. Be specific and useful.
[/pro-tip]

### 3. Warning Box (amber, use for risks, cautions, regulatory notes)
[warning title="Important Caution"]
The risk or caution the reader must know about.
[/warning]

### 4. Quick Verdict (use for comparison articles, near top and bottom)
[quick-verdict]
Our evidence-based recommendation in 2-3 sentences.
[/quick-verdict]

### 5. Stats / Metrics Grid (use for data-heavy sections)
[stats]
Repo Rate | 6.50% | success
Inflation (CPI) | 5.1% | warning
GDP Growth | 6.8% | info
Sensex YTD | +12.3% | success
[/stats]

### 6. Comparison Cards Grid (use for product comparisons)
[comparison-grid]
[comparison-card title="HDFC Regalia Gold"]
- Annual fee: ₹2,500 + GST
- 4 points per ₹150
- 12 domestic lounges/year
- Best for: Frequent travelers
[/comparison-card]
[comparison-card title="Axis Magnus"]
- Annual fee: ₹12,500 + GST
- 12 EDGE Miles per ₹200
- Unlimited domestic lounges
- Best for: Premium card holders
[/comparison-card]
[/comparison-grid]

### 7. Portfolio Allocation (use for investment articles)
[allocation title="Suggested Aggressive Portfolio"]
Large Cap Equity | 40% | 40
Mid Cap Equity | 25% | 25
Small Cap Equity | 15% | 15
Debt Funds | 10% | 10
Gold ETF | 10% | 10
[/allocation]

### 8. Fact Box (use for citing RBI/SEBI/AMFI data)
[fact-box source="RBI Annual Report 2025"]
India's household savings rate stands at 18.4% of GDP, but only 4.8% is invested in financial assets beyond bank deposits.
[/fact-box]

### 9. Expert Quote (use for credibility)
[expert-quote name="Nilesh Shah" role="MD, Kotak Mutual Fund"]
"Equity mutual funds remain the most accessible vehicle for long-term wealth creation for retail investors."
[/expert-quote]

### 10. Badge (inline, use sparingly)
[badge type="success"]SEBI Regulated[/badge]  [badge type="warning"]Lock-in Period[/badge]  [badge type="info"]Tax Saver[/badge]
`

// ─── Compliance Constraints (always appended) ────────────────────────────────

export const COMPLIANCE_CONSTRAINTS = `
## MANDATORY COMPLIANCE RULES (SEBI/IRDA)

FORBIDDEN phrases — NEVER use these:
- "guaranteed returns", "risk-free investment", "safe investment"
- "best option for you", "you should invest", "we recommend you buy"
- "will give X% return", "assured profit", "no risk"
- "financial advice", "investment advice"

REQUIRED instead — use these phrases:
- "historically", "based on available data", "according to AMFI/SEBI/RBI"
- "this product offers", "users may consider", "information shows"
- "past performance is not indicative of future returns"
- "this is for informational purposes only"
`

// ─── Base prompt builder ─────────────────────────────────────────────────────

export function buildBasePrompt(params: {
  topic: string
  keywords: string[]
  tone: string
  targetAudience: string
  groundingContext: string
  templateType: string
  wordCount: { min: number; max: number }
  requiredSections: string[]
  style?: WritingStyle
}): string {
  const personaHeader = getPersonaHeader(params.style ?? 'hybrid', params.topic)
  return `${personaHeader}Your content is read by ${params.targetAudience}. It must be accurate, compliant, and visually engaging.

## ARTICLE BRIEF
Topic: ${params.topic}
Primary Keywords: ${params.keywords.join(', ')}
Tone: ${params.tone}
Article Type: ${params.templateType}
Target Length: ${params.wordCount.min}–${params.wordCount.max} words
${params.groundingContext}

## REQUIRED STRUCTURE
${params.requiredSections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${SHORTCODE_REFERENCE}

${COMPLIANCE_CONSTRAINTS}

## FORMATTING RULES
1. Use markdown headings (## for H2, ### for H3)
2. Use shortcodes generously — they make the article visually stunning
3. Every article MUST start with a [key-takeaways] block
4. Every article MUST end with a FAQ section (minimum 5 Q&As)
5. Use ₹ for Indian rupee, spell out crore/lakh (not million/billion)
6. Include specific Indian examples (HDFC, SBI, Zerodha, AMFI-regulated funds)
7. Use real data points with source attribution in [fact-box] components
8. Tables for any comparison data (markdown table format)
9. [stats] block for any numerical data section
10. Bold the first sentence of each H2 section

## OUTPUT FORMAT
Return a JSON object:
{
  "title": "SEO-optimized H1 title (under 65 chars, include primary keyword)",
  "content": "The full article in markdown WITH shortcodes embedded",
  "excerpt": "2-sentence compelling summary (under 160 chars)",
  "seo_title": "Meta title tag (under 60 chars)",
  "seo_description": "Meta description (under 155 chars, include primary keyword)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "primary_keyword": "main keyword",
  "schema_faq": [
    {"question": "FAQ 1", "answer": "Answer 1"},
    {"question": "FAQ 2", "answer": "Answer 2"}
  ]
}
`
}

// ─── Category-specific prompts ───────────────────────────────────────────────

export function getCreditCardPrompt(params: {
  topic: string
  keywords: string[]
  cardNames?: string[]
  groundingContext?: string
  style?: WritingStyle
}) {
  return buildBasePrompt({
    topic: params.topic,
    keywords: params.keywords,
    tone: 'authoritative yet approachable',
    targetAudience: 'middle-class Indian professionals aged 25-45 who earn ₹6L-30L per year',
    groundingContext: params.groundingContext
      ? `\nGROUNDING DATA:\n"""\n${params.groundingContext.substring(0, 6000)}\n"""\n`
      : '',
    templateType: 'Credit Card Comparison Guide',
    wordCount: { min: 2000, max: 3500 },
    style: params.style,
    requiredSections: [
      '[key-takeaways] block with 4-5 points',
      'Introduction: Why this matters for Indian cardholders (hook + problem)',
      'Quick Comparison Table (markdown table with fees, rewards, lounge access)',
      '[quick-verdict] recommendation block',
      'Detailed analysis of each card (use [comparison-grid] with [comparison-card])',
      'Who should get which card (4 scenarios using [comparison-card])',
      'Reward maximization strategy ([pro-tip] blocks)',
      'Eligibility & Application Process',
      '[warning] block about common credit card traps',
      'FAQ section (minimum 5 questions)',
      'Final recommendation',
    ],
  })
}

export function getMutualFundPrompt(params: {
  topic: string
  keywords: string[]
  groundingContext?: string
  style?: WritingStyle
}) {
  return buildBasePrompt({
    topic: params.topic,
    keywords: params.keywords,
    tone: 'educational and data-driven',
    targetAudience: 'first-time and intermediate Indian investors wanting to build wealth via SIP',
    groundingContext: params.groundingContext
      ? `\nGROUNDING DATA (AMFI/Moneycontrol):\n"""\n${params.groundingContext.substring(0, 6000)}\n"""\n`
      : '',
    templateType: 'Mutual Fund Guide',
    wordCount: { min: 2500, max: 4000 },
    style: params.style,
    requiredSections: [
      '[key-takeaways] block with 5-6 points',
      'Introduction: The case for mutual funds over FDs/gold',
      '[stats] block with current market data (Nifty 50 returns, inflation, FD rates)',
      'What is [fund type] — explained simply',
      '[fact-box] with AMFI/SEBI data on Indian mutual fund AUM/growth',
      'Top 5 funds in this category (comparison table with 1Y/3Y/5Y returns, expense ratio)',
      '[comparison-grid] with top 3 funds detailed',
      'How to invest: Lumpsum vs SIP analysis',
      'Tax implications (STCG vs LTCG, ELSS benefits)',
      '[warning] block about market risks and common mistakes',
      '[pro-tip] on SIP timing and rebalancing',
      'Step-by-step investment guide',
      'FAQ section (minimum 5 questions)',
    ],
  })
}

export function getInsurancePrompt(params: {
  topic: string
  keywords: string[]
  groundingContext?: string
  style?: WritingStyle
}) {
  return buildBasePrompt({
    topic: params.topic,
    keywords: params.keywords,
    tone: 'reassuring, educational, compliance-first',
    targetAudience: 'Indian families aged 28-50 looking to protect financial future',
    groundingContext: params.groundingContext
      ? `\nGROUNDING DATA:\n"""\n${params.groundingContext.substring(0, 6000)}\n"""\n`
      : '',
    templateType: 'Insurance Guide',
    wordCount: { min: 2000, max: 3500 },
    style: params.style,
    requiredSections: [
      '[key-takeaways] block',
      'Why insurance is not optional (hook with statistics)',
      '[stats] block with IRDAI data on claim settlement ratios',
      'Types of coverage available',
      'Product comparison table (premiums, coverage, claim ratios)',
      '[comparison-grid] of top 3-4 products',
      'How to calculate your coverage need',
      '[pro-tip] on buying strategy (term + health combination)',
      '[warning] about common exclusions and what they mean',
      'How to file a claim (step-by-step)',
      'FAQ section (minimum 5 questions)',
    ],
  })
}

export function getPersonalFinancePrompt(params: {
  topic: string
  keywords: string[]
  groundingContext?: string
  style?: WritingStyle
}) {
  return buildBasePrompt({
    topic: params.topic,
    keywords: params.keywords,
    tone: 'friendly, practical, motivating',
    targetAudience: 'young Indian professionals (22-35) starting their personal finance journey',
    groundingContext: params.groundingContext
      ? `\nGROUNDING DATA:\n"""\n${params.groundingContext.substring(0, 6000)}\n"""\n`
      : '',
    templateType: 'Personal Finance Guide',
    wordCount: { min: 2000, max: 3500 },
    style: params.style,
    requiredSections: [
      '[key-takeaways] block',
      'Why this matters now (hook with relatable Indian scenario)',
      'The core concept explained simply',
      '[fact-box] with relevant RBI/SEBI/AMFI data',
      'Step-by-step implementation guide',
      '[stats] block with numbers that make the case',
      'Common mistakes to avoid ([warning] block)',
      '[pro-tip] with insider strategy',
      '[allocation] for portfolio-related articles',
      'Tools and resources to get started',
      'FAQ section (minimum 5 questions)',
    ],
  })
}

// ─── Prompt selector ─────────────────────────────────────────────────────────

export function getPromptForCategory(
  category: string,
  params: { topic: string; keywords: string[]; groundingContext?: string; style?: WritingStyle }
): string {
  switch (category) {
    case 'credit-cards':
    case 'credit_card':
      return getCreditCardPrompt(params)
    case 'mutual-funds':
    case 'mutual_fund':
      return getMutualFundPrompt(params)
    case 'insurance':
      return getInsurancePrompt(params)
    case 'loans':
    case 'personal-finance':
    default:
      return getPersonalFinancePrompt(params)
  }
}

// ─── Example output (for testing / admin preview) ────────────────────────────

export const EXAMPLE_SHORTCODE_ARTICLE = `
[key-takeaways]
- The HDFC Regalia Gold offers the best lounge access for under ₹3,000/year
- Axis Magnus is worth it only if you spend more than ₹1.5L/month
- Axis Flipkart is the best entry-level card for online shoppers
- All three cards waive the annual fee on meeting spend milestones
[/key-takeaways]

## The Best Credit Cards for Airport Lounge Access in India (2026)

**If you've ever paid ₹700 for a mediocre sandwich at Mumbai airport, you already understand why lounge access matters.**

[fact-box source="CAPA India Aviation Report, 2025"]
India's domestic air passenger traffic grew to 152 million in 2024 — a 14% year-on-year increase. Over 60% of frequent flyers cite lounge access as a top factor in credit card selection.
[/fact-box]

[quick-verdict]
For most professionals spending ₹50,000–₹1L/month: The **HDFC Regalia Gold** offers the best value at ₹2,500/year with 12 domestic + 6 international lounges. Heavy spenders (₹1.5L+) should look at the **Axis Magnus** for unlimited access.
[/quick-verdict]

## At a Glance: Top Lounge Access Cards

| Card | Annual Fee | Domestic Lounges | International | Min Income |
|------|-----------|-----------------|--------------|-----------|
| HDFC Regalia Gold | ₹2,500+GST | 12/year | 6/year | ₹1L/mo |
| Axis Magnus | ₹12,500+GST | Unlimited | 8/year | ₹1.8L/mo |
| SBI Elite | ₹4,999+GST | 6/year | 4/year (Priority Pass) | ₹60K/mo |

[stats]
Average Lounge Visit Cost | ₹700 | warning
Annual Break-Even (Regalia) | 4 visits | success
Annual Break-Even (Magnus) | 18 visits | info
Average Card Reward Value | ₹8,500/year | success
[/stats]

## Detailed Card Breakdown

[comparison-grid]
[comparison-card title="HDFC Regalia Gold ⭐ Best Value"]
- Annual Fee: ₹2,500 + GST (waived on ₹3L annual spend)
- Lounge: 12 domestic + 6 international
- Rewards: 4 points per ₹150 (2.67% rate)
- Weekend dining: 20x points
- Fuel surcharge waiver: Yes
- Best for: Mid-level professionals, occasional travelers
[/comparison-card]
[comparison-card title="Axis Magnus 🏆 Best Premium"]
- Annual Fee: ₹12,500 + GST (waived on ₹25L annual spend)
- Lounge: Unlimited domestic + 8 international
- Rewards: 12 EDGE Miles per ₹200 (6% rate on travel)
- Travel portal: 25x points via Axis Travel
- Concierge: 24/7 dedicated
- Best for: Frequent flyers, high spenders (₹1.5L+/mo)
[/comparison-card]
[/comparison-grid]

[pro-tip title="Maximize Lounge Access Without Paying Full Fee"]
Apply for the HDFC Regalia Gold with an existing HDFC salary account — the bank often waives the joining fee for salaried account holders with ₹50K+ average monthly balance. First year free = immediate break-even.
[/pro-tip]

[warning title="Lounge Access Limit Traps"]
Most cards count lounge visits per calendar quarter, not per year. HDFC Regalia's "12/year" is actually 3/quarter — arrive on January 1st and the counter resets regardless of how many you used in December.
[/warning]

## FAQ

**Q: Does my add-on cardholder get lounge access?**
HDFC Regalia Gold: Yes, 2 guest visits included. Axis Magnus: Yes, with dedicated family access on Priority Pass.

**Q: Can I use these lounges internationally?**
Both cards use Priority Pass or DreamFolios network. Coverage varies by airport — verify on the lounge finder app before travel.
`
