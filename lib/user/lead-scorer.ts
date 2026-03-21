/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INVESTINGPRO LEAD SCORER — PROPRIETARY PURCHASE INTENT ENGINE  ║
 * ║                                                                  ║
 * ║  Scores each visitor 0-100 on likelihood to apply for a product  ║
 * ║  in the next 7 days. High-intent leads are worth 2-5x more       ║
 * ║  to affiliate partners.                                          ║
 * ║                                                                  ║
 * ║  Used for:                                                       ║
 * ║  - Dynamic CTA intensity (soft hint vs urgent nudge)             ║
 * ║  - Lead quality scoring for partner CPA negotiation              ║
 * ║  - Retargeting segment definition                                ║
 * ║  - Email trigger timing                                          ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export type ProductCategory = 'credit-cards' | 'mutual-funds' | 'insurance' | 'loans' | 'fd' | 'nps'

export interface BehavioralSignal {
  type:
    | 'product_view'
    | 'comparison_viewed'
    | 'affiliate_click'
    | 'article_read'
    | 'eligibility_check'
    | 'calculator_used'
    | 'apply_page_visited'
    | 'saved_to_watchlist'
    | 'email_opened'
    | 'return_visit'
    | 'search_query'
    | 'deep_scroll'    // scrolled >75% of a product page
  product_id?: string
  category?: ProductCategory
  timestamp: number   // Unix ms
  metadata?: Record<string, unknown>
}

export interface LeadProfile {
  user_id?: string
  session_id: string
  signals: BehavioralSignal[]
  financial_profile_complete?: boolean
  income_bracket?: 'sub_5l' | '5l_10l' | '10l_20l' | '20l_plus'
  credit_score_range?: 'below_650' | '650_750' | '750_800' | '800_plus'
  has_applied_before?: boolean   // applied for any product
  days_since_first_visit?: number
}

export interface LeadScore {
  score: number           // 0-100
  segment: LeadSegment
  category_scores: Partial<Record<ProductCategory, number>>
  top_category: ProductCategory | null
  signals_triggered: string[]
  cta_intensity: 'soft' | 'medium' | 'strong' | 'urgent'
  recommended_nudge: string
  monetization_value: 'standard' | 'premium' | 'high_value'
  expires_at: number      // Unix ms — scores decay
}

export type LeadSegment =
  | 'high_intent'    // 75-100: Ready to apply now
  | 'warm'           // 50-74: Active research
  | 'engaged'        // 30-49: Interested but early
  | 'browser'        // 10-29: Exploring casually
  | 'cold'           // 0-9: No signals yet

// ─── Signal point values ──────────────────────────────────────────────────────

const SIGNAL_POINTS: Record<BehavioralSignal['type'], number> = {
  affiliate_click:       50,   // strongest intent signal
  apply_page_visited:    45,   // about to apply
  eligibility_check:     35,   // checking if they qualify
  calculator_used:       30,   // doing serious math
  saved_to_watchlist:    25,   // decided to revisit
  comparison_viewed:     20,   // comparing products
  product_view:          15,   // looking at a product
  deep_scroll:           12,   // engaging deeply
  email_opened:          10,   // engaged with comms
  return_visit:          10,   // came back
  article_read:           8,   // consumed content
  search_query:           5,   // exploring
}

// Recency multipliers: fresher signals weigh more
function recencyMultiplier(timestamp: number): number {
  const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60)
  if (ageHours < 1) return 2.0       // last hour — very hot
  if (ageHours < 6) return 1.8
  if (ageHours < 24) return 1.5      // today
  if (ageHours < 72) return 1.2      // last 3 days
  if (ageHours < 168) return 1.0     // last week — baseline
  if (ageHours < 720) return 0.6     // last month
  return 0.3                          // older
}

// Frequency boost: repeated signals indicate serious intent
function frequencyBoost(signals: BehavioralSignal[], type: BehavioralSignal['type']): number {
  const count = signals.filter(s => s.type === type).length
  if (count === 1) return 1.0
  if (count === 2) return 1.3
  if (count === 3) return 1.5
  return 1.7  // 4+ = committed
}

// ─── Category-specific scoring ────────────────────────────────────────────────

function scoreByCatgory(
  signals: BehavioralSignal[],
  category: ProductCategory,
): number {
  const categorySignals = signals.filter(s => s.category === category || !s.category)
  // Weight category-specific signals more
  const categorySpecific = signals.filter(s => s.category === category)
  const bonus = categorySpecific.length * 5 // category focus bonus

  let raw = 0
  const seen = new Set<BehavioralSignal['type']>()

  for (const signal of categorySignals) {
    const base = SIGNAL_POINTS[signal.type] ?? 0
    const recency = recencyMultiplier(signal.timestamp)
    const freq = seen.has(signal.type) ? 0.3 : frequencyBoost(categorySignals, signal.type) // first occurrence at full rate
    seen.add(signal.type)
    raw += base * recency * freq
  }

  return Math.min(100, Math.round(raw + bonus))
}

// ─── Profile qualification signals ───────────────────────────────────────────

function qualificationBoost(profile: LeadProfile): number {
  let boost = 0

  if (profile.financial_profile_complete) boost += 15   // they filled out form = interested
  if (profile.income_bracket === '20l_plus') boost += 10
  if (profile.income_bracket === '10l_20l') boost += 7
  if (profile.credit_score_range === '800_plus') boost += 8
  if (profile.credit_score_range === '750_800') boost += 5
  if (profile.has_applied_before) boost -= 10   // already a customer of some product

  // Journey depth: how many days have they been researching?
  if (profile.days_since_first_visit) {
    if (profile.days_since_first_visit >= 7 && profile.days_since_first_visit <= 30) {
      boost += 10  // 1-4 week research = ready to decide
    }
  }

  return boost
}

// ─── Determine CTA intensity ──────────────────────────────────────────────────

function ctaIntensity(score: number): LeadScore['cta_intensity'] {
  if (score >= 75) return 'urgent'
  if (score >= 50) return 'strong'
  if (score >= 30) return 'medium'
  return 'soft'
}

function nudgeMessage(score: number, category: ProductCategory | null, segment: LeadSegment): string {
  if (!category) return 'Explore products that match your financial goals'

  const categoryLabel: Record<ProductCategory, string> = {
    'credit-cards': 'credit card',
    'mutual-funds': 'mutual fund',
    'insurance': 'insurance plan',
    'loans': 'loan',
    'fd': 'fixed deposit',
    'nps': 'NPS account',
  }
  const label = categoryLabel[category]

  if (segment === 'high_intent') return `You've been researching ${label}s — see your personalized top picks`
  if (segment === 'warm') return `Compare the top ${label}s for your profile`
  if (segment === 'engaged') return `Find the right ${label} in 2 minutes`
  return `Explore ${label} options`
}

// ─── Main scoring function ─────────────────────────────────────────────────────

export function computeLeadScore(profile: LeadProfile): LeadScore {
  const { signals } = profile

  if (!signals || signals.length === 0) {
    return {
      score: 0,
      segment: 'cold',
      category_scores: {},
      top_category: null,
      signals_triggered: [],
      cta_intensity: 'soft',
      recommended_nudge: 'Explore top financial products in India',
      monetization_value: 'standard',
      expires_at: Date.now() + 24 * 60 * 60 * 1000,
    }
  }

  // Score per category
  const categories: ProductCategory[] = ['credit-cards', 'mutual-funds', 'insurance', 'loans', 'fd', 'nps']
  const category_scores: Partial<Record<ProductCategory, number>> = {}
  for (const cat of categories) {
    const s = scoreByCatgory(signals, cat)
    if (s > 0) category_scores[cat] = s
  }

  // Overall score = weighted avg of category scores + qualification bonus
  const catScoreValues = Object.values(category_scores)
  const baseScore = catScoreValues.length > 0
    ? catScoreValues.reduce((a, b) => a + b, 0) / catScoreValues.length
    : 0

  const qualBoost = qualificationBoost(profile)
  const raw = Math.min(100, Math.round(baseScore + qualBoost))

  // Top category = highest scoring
  const top_category = catScoreValues.length > 0
    ? (Object.entries(category_scores).sort(([, a], [, b]) => b - a)[0]?.[0] as ProductCategory)
    : null

  const segment: LeadSegment =
    raw >= 75 ? 'high_intent' :
    raw >= 50 ? 'warm' :
    raw >= 30 ? 'engaged' :
    raw >= 10 ? 'browser' : 'cold'

  const signals_triggered = [...new Set(signals.map(s => s.type))]

  const monetization_value: LeadScore['monetization_value'] =
    raw >= 70 ? 'high_value' : raw >= 40 ? 'premium' : 'standard'

  // Scores decay faster for time-sensitive signals (credit card clicks)
  // High-intent scores expire in 48h, warm in 7 days
  const ttl = raw >= 75
    ? 48 * 60 * 60 * 1000
    : raw >= 50
    ? 7 * 24 * 60 * 60 * 1000
    : 30 * 24 * 60 * 60 * 1000

  return {
    score: raw,
    segment,
    category_scores,
    top_category,
    signals_triggered,
    cta_intensity: ctaIntensity(raw),
    recommended_nudge: nudgeMessage(raw, top_category, segment),
    monetization_value,
    expires_at: Date.now() + ttl,
  }
}

/**
 * Track a single behavioral signal and return updated score.
 * Use at the API layer when a user visits a product/comparison page.
 */
export function addSignalAndReScore(
  existing: LeadProfile,
  newSignal: Omit<BehavioralSignal, 'timestamp'>
): { profile: LeadProfile; score: LeadScore } {
  const profile: LeadProfile = {
    ...existing,
    signals: [
      ...existing.signals,
      { ...newSignal, timestamp: Date.now() },
    ],
  }
  const score = computeLeadScore(profile)
  return { profile, score }
}
