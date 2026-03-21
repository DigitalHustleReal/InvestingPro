/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INVESTINGPRO PERSONALIZED RECOMMENDATION ENGINE                ║
 * ║                                                                  ║
 * ║  Combines financial profile + behavioral signals + product data  ║
 * ║  to produce ranked, personalized product recommendations.        ║
 * ║                                                                  ║
 * ║  Scoring Model (proprietary weighted formula):                   ║
 * ║  • Eligibility match (can they get approved?) — 30%             ║
 * ║  • Goal match (does it serve their goal?) — 25%                 ║
 * ║  • Financial value (net annual benefit in ₹) — 25%             ║
 * ║  • Risk alignment (matches their risk appetite) — 10%           ║
 * ║  • Behavioral signal strength (have they shown interest?) — 10% ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { FinancialProfile, FinancialGoal } from '../user/financial-health-scorer'
import type { LeadScore, ProductCategory } from '../user/lead-scorer'

export interface ProductCandidate {
  id: string
  name: string
  provider: string
  category: ProductCategory
  // Credit card fields
  annual_fee?: number
  reward_rate?: number           // % of spending returned
  lounge_access?: boolean
  min_income_required?: number   // annual income in ₹
  min_credit_score?: number
  // Mutual fund fields
  risk_level?: 'low' | 'moderate' | 'high' | 'very_high'
  returns_1y?: number            // %
  returns_3y?: number
  returns_5y?: number
  expense_ratio?: number         // %
  fund_category?: string         // 'equity' | 'debt' | 'hybrid' | 'elss'
  // Insurance fields
  sum_assured?: number
  annual_premium?: number
  // Loan fields
  interest_rate_min?: number
  interest_rate_max?: number
  processing_fee_pct?: number
  // Common
  rating?: number                // 1-5 stars
  affiliate_commission?: number  // ₹ per conversion (for ranking tie-break)
  slug: string
}

export interface Recommendation {
  product: ProductCandidate
  score: number                  // 0-100 match score
  match_reasons: string[]        // human-readable why this is recommended
  estimated_annual_value: number // ₹ net benefit per year
  eligibility_confidence: number // 0-100% chance of approval
  rank: number
  is_top_pick: boolean
  personalized_cta: string       // e.g. "Start SIP for your retirement goal"
}

export interface RecommendationSet {
  user_id?: string
  generated_at: string
  context: string                // e.g. "credit-card-for-travel"
  recommendations: Recommendation[]
  explanation: string            // 1-line summary for display
}

// ─── Eligibility scoring ──────────────────────────────────────────────────────

function scoreEligibility(product: ProductCandidate, profile: FinancialProfile): number {
  let score = 100 // start optimistic

  if (product.min_income_required && profile.annual_income < product.min_income_required) {
    const gap = (product.min_income_required - profile.annual_income) / product.min_income_required
    score -= Math.min(80, Math.round(gap * 150)) // steep penalty for income gap
  }

  if (product.min_credit_score && profile.credit_score) {
    if (profile.credit_score < product.min_credit_score) {
      const gap = product.min_credit_score - profile.credit_score
      score -= Math.min(70, gap * 0.5)
    }
  }

  return Math.max(0, Math.min(100, score))
}

// ─── Goal match scoring ───────────────────────────────────────────────────────

function scoreGoalMatch(product: ProductCandidate, profile: FinancialProfile): number {
  const goals = profile.goals ?? []
  let score = 0

  const goalProductMap: Record<FinancialGoal, ProductCategory[]> = {
    retirement: ['nps', 'mutual-funds', 'ppf' as ProductCategory],
    home: ['loans'],
    education: ['mutual-funds', 'fd'],
    wealth: ['mutual-funds'],
    emergency: ['fd'],
    business: ['loans', 'credit-cards'],
    marriage: ['fd', 'mutual-funds'],
    travel: ['credit-cards'],
  }

  for (const goal of goals) {
    if (goalProductMap[goal]?.includes(product.category)) {
      score += 40 // primary goal match
    }
  }

  // Fund-specific: risk appetite match
  if (product.category === 'mutual-funds' && product.risk_level) {
    const riskMap: Record<string, number[]> = {
      low: [1, 2, 3, 4],
      moderate: [3, 4, 5, 6, 7],
      high: [5, 6, 7, 8, 9],
      very_high: [7, 8, 9, 10],
    }
    if (riskMap[product.risk_level]?.includes(profile.risk_appetite)) {
      score += 30
    } else {
      score -= 20 // mismatch penalty
    }
  }

  // ELSS bonus for tax saving
  if (product.fund_category === 'elss' && profile.annual_income > 500000) {
    score += 20 // tax saving benefit
  }

  return Math.max(0, Math.min(100, score))
}

// ─── Financial value scoring ──────────────────────────────────────────────────

function scoreFinancialValue(
  product: ProductCandidate,
  profile: FinancialProfile
): { score: number; annual_value: number } {
  let annual_value = 0

  if (product.category === 'credit-cards') {
    // Estimate monthly spend at 20% of income
    const monthly_spend = profile.annual_income * 0.20 / 12
    const annual_rewards = monthly_spend * 12 * (product.reward_rate ?? 0) / 100
    annual_value = annual_rewards - (product.annual_fee ?? 0)
  } else if (product.category === 'mutual-funds') {
    // Annualized return on monthly SIP
    const sip = profile.monthly_investments || (profile.annual_income * 0.15 / 12)
    const ret = (product.returns_3y ?? product.returns_1y ?? 10) / 100
    // Rough: SIP * returns for 1 year minus expense cost
    const expense_drag = sip * 12 * (product.expense_ratio ?? 1) / 100
    annual_value = Math.round(sip * 12 * ret - expense_drag)
  } else if (product.category === 'insurance') {
    // Value = sum assured / premium ratio (higher = better deal)
    if (product.sum_assured && product.annual_premium) {
      const coverage_multiple = product.sum_assured / product.annual_premium
      annual_value = Math.round(coverage_multiple * 100) // proxy value
    }
  } else if (product.category === 'loans') {
    // Lower interest = value
    if (product.interest_rate_min) {
      // Compare to 15% baseline (credit card debt)
      const saved_interest = Math.max(0, 15 - product.interest_rate_min) / 100
      annual_value = Math.round(profile.total_debt * saved_interest)
    }
  }

  const score = annual_value > 0
    ? Math.min(100, Math.round(annual_value / (profile.annual_income / 100)))  // % of income
    : 10

  return { score, annual_value }
}

// ─── Behavioral boost ─────────────────────────────────────────────────────────

function scoreBehavioral(product: ProductCandidate, leadScore: LeadScore): number {
  const catScore = leadScore.category_scores[product.category] ?? 0
  // Weight: high behavioral interest in category = higher boost
  return Math.round(catScore * 0.8) // up to 80pts behavioral contribution
}

// ─── Main recommendation engine ───────────────────────────────────────────────

export function generateRecommendations(params: {
  profile: FinancialProfile
  leadScore: LeadScore
  products: ProductCandidate[]
  category?: ProductCategory     // filter to category if specified
  max_results?: number
  context?: string
}): RecommendationSet {
  const {
    profile,
    leadScore,
    products,
    category,
    max_results = 5,
    context = 'general',
  } = params

  const candidates = category
    ? products.filter(p => p.category === category)
    : products

  const scored: Recommendation[] = candidates.map(product => {
    // Weighted scoring across 5 dimensions
    const eligibility = scoreEligibility(product, profile)
    if (eligibility < 20) {
      // Skip clearly ineligible products
      return null
    }

    const goalMatch = scoreGoalMatch(product, profile)
    const { score: valueScore, annual_value } = scoreFinancialValue(product, profile)
    const behavioral = scoreBehavioral(product, leadScore)
    const riskAlignment = product.risk_level
      ? Math.max(0, 100 - Math.abs((profile.risk_appetite * 10) -
          ({ low: 20, moderate: 45, high: 70, very_high: 90 }[product.risk_level] ?? 50)) * 1.5)
      : 70 // neutral if no risk level

    // Weighted formula
    const score = Math.round(
      eligibility * 0.30 +
      goalMatch * 0.25 +
      valueScore * 0.25 +
      riskAlignment * 0.10 +
      behavioral * 0.10
    )

    // Build match reasons
    const match_reasons: string[] = []
    if (eligibility >= 80) match_reasons.push('You likely qualify based on your income and credit profile')
    if (goalMatch >= 40) match_reasons.push(`Aligns with your ${profile.goals[0] ?? 'financial'} goal`)
    if (annual_value > 5000) match_reasons.push(`Estimated ₹${annual_value.toLocaleString('en-IN')} net benefit/year`)
    if (product.category === 'mutual-funds' && product.returns_3y) {
      match_reasons.push(`${product.returns_3y}% 3-year CAGR`)
    }
    if (product.category === 'credit-cards' && product.lounge_access) {
      match_reasons.push('Complimentary airport lounge access')
    }

    // Personalized CTA
    const cta = buildPersonalizedCTA(product, profile, leadScore)

    return {
      product,
      score,
      match_reasons,
      estimated_annual_value: annual_value,
      eligibility_confidence: eligibility,
      rank: 0,       // assigned after sorting
      is_top_pick: false,
      personalized_cta: cta,
    } as Recommendation
  }).filter(Boolean) as Recommendation[]

  // Sort: by score desc, then by affiliate_commission (revenue tie-break)
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return (b.product.affiliate_commission ?? 0) - (a.product.affiliate_commission ?? 0)
  })

  const top = scored.slice(0, max_results).map((r, i) => ({
    ...r,
    rank: i + 1,
    is_top_pick: i === 0,
  }))

  const explanation = top.length > 0
    ? `${top.length} products matched your ${profile.goals[0] ?? 'financial'} profile with up to ${top[0]?.score}% compatibility`
    : 'Complete your financial profile for personalized recommendations'

  return {
    generated_at: new Date().toISOString(),
    context,
    recommendations: top,
    explanation,
  }
}

// ─── CTA builder ─────────────────────────────────────────────────────────────

function buildPersonalizedCTA(
  product: ProductCandidate,
  profile: FinancialProfile,
  leadScore: LeadScore
): string {
  const urgency = leadScore.score >= 70

  switch (product.category) {
    case 'credit-cards':
      if (profile.goals.includes('travel')) return urgency ? 'Apply Now — Earn travel miles instantly' : 'See travel rewards'
      if (profile.goals.includes('wealth')) return 'Maximize cashback on every purchase'
      return urgency ? 'Apply in 5 minutes' : 'Compare rewards'
    case 'mutual-funds':
      if (profile.goals.includes('retirement')) return `Start ₹${(profile.monthly_investments || 5000).toLocaleString('en-IN')}/mo SIP for retirement`
      if (profile.goals.includes('wealth')) return 'Start SIP — wealth compounds over time'
      return 'Invest from ₹500/month'
    case 'insurance':
      return urgency ? 'Get covered today — takes 10 minutes' : 'Check your coverage needs'
    case 'loans':
      return urgency ? 'Check rate without affecting CIBIL score' : 'Compare loan rates'
    case 'fd':
      return 'Lock in current rates before they change'
    case 'nps':
      return 'Save tax + build pension corpus'
    default:
      return 'Explore details'
  }
}

/**
 * What-if simulator: "If I spend ₹X/month, which card gives most rewards?"
 */
export function simulateCardRewards(params: {
  monthly_spend: number
  cards: ProductCandidate[]
  spending_categories?: { dining?: number; travel?: number; fuel?: number; shopping?: number }
}): Array<{ card: ProductCandidate; annual_rewards: number; net_benefit: number; rank: number }> {
  const { monthly_spend, cards } = params

  return cards
    .filter(c => c.category === 'credit-cards')
    .map(card => {
      const annual_rewards = monthly_spend * 12 * (card.reward_rate ?? 1) / 100
      const net_benefit = annual_rewards - (card.annual_fee ?? 0)
      return { card, annual_rewards, net_benefit, rank: 0 }
    })
    .sort((a, b) => b.net_benefit - a.net_benefit)
    .map((item, i) => ({ ...item, rank: i + 1 }))
}
