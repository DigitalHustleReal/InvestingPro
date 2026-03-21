/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INVESTINGPRO FINANCIAL HEALTH SCORE — PROPRIETARY ENGINE       ║
 * ║                                                                  ║
 * ║  Produces a 0-850 score (like CIBIL but for financial wellness)  ║
 * ║  across 7 dimensions with Indian market calibration.             ║
 * ║                                                                  ║
 * ║  Score Bands:                                                    ║
 * ║  700-850  Excellent  — Optimal financial health                  ║
 * ║  600-699  Good       — Strong foundations, minor gaps            ║
 * ║  500-599  Fair       — Improving, needs 1-2 changes              ║
 * ║  400-499  Poor       — Needs structured improvement              ║
 * ║  <400     Critical   — Immediate intervention required           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export type EmploymentType = 'salaried' | 'self_employed' | 'business' | 'freelance' | 'student' | 'retired'
export type RiskAppetite = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type FinancialGoal = 'retirement' | 'home' | 'education' | 'wealth' | 'emergency' | 'business' | 'marriage' | 'travel'

export interface FinancialProfile {
  // Income
  annual_income: number           // ₹ per year
  monthly_expenses: number        // fixed + variable ₹/mo
  employment_type: EmploymentType
  age: number

  // Debt
  total_debt: number              // all outstanding loans
  monthly_emi: number             // monthly EMI obligations
  credit_score?: number           // CIBIL / Experian (300-900)
  credit_cards_count?: number
  credit_utilization?: number     // 0-100%

  // Assets
  emergency_fund: number          // liquid cash in bank
  total_savings: number           // FD, savings, liquid funds
  total_investments: number       // MF, stocks, PPF, etc.
  has_term_insurance?: boolean
  has_health_insurance?: boolean
  has_home?: boolean

  // Goals
  goals: FinancialGoal[]
  goal_timeline_years?: number
  goal_amount?: number
  monthly_investments: number     // SIP + recurring investments/mo

  // Optional advanced
  risk_appetite: RiskAppetite     // 1=very conservative, 10=very aggressive
  dependents?: number             // number of family members
  has_will?: boolean
}

export interface HealthScoreDimension {
  name: string
  score: number          // 0-100 for this dimension
  weighted: number       // after applying weight
  weight: number         // percentage weight in total
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  finding: string        // what's good/bad
  action: string         // specific improvement action
}

export interface FinancialHealthReport {
  score: number                        // 0-850 final score
  band: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical'
  percentile: number                   // vs Indian median (estimated)
  dimensions: HealthScoreDimension[]
  top_strengths: string[]
  top_risks: string[]
  priority_actions: PriorityAction[]
  product_needs: ProductNeed[]         // what products this person needs
  investability_score: number          // 0-100 how ready to invest
  insurance_gap: number                // ₹ of coverage needed
  monthly_surplus: number              // ₹ available to invest/save
}

export interface PriorityAction {
  urgency: 'critical' | 'high' | 'medium' | 'low'
  action: string
  impact: string            // what changes if done
  products?: string[]       // relevant product categories
}

export interface ProductNeed {
  category: 'credit-cards' | 'mutual-funds' | 'insurance' | 'loans' | 'fd' | 'ppf' | 'nps'
  reason: string
  priority: 'immediate' | 'soon' | 'planned'
}

// ─── Dimension weights (must sum to 100) ────────────────────────────────────

const WEIGHTS = {
  emergency_fund:    20,   // Most critical — safety net
  debt_management:   20,   // Debt kills wealth
  insurance_cover:   15,   // Underinsured India problem
  savings_rate:      15,   // Habit > amount
  investment_health: 15,   // Wealth building
  credit_health:     10,   // Access to credit
  goal_alignment:     5,   // Planning maturity
}

// ─── Scoring functions per dimension ─────────────────────────────────────────

function scoreEmergencyFund(p: FinancialProfile): HealthScoreDimension {
  const monthly_expenses = p.monthly_expenses || (p.annual_income / 14) // estimated
  const months_covered = p.emergency_fund / monthly_expenses

  // Indian standard: 6 months for salaried, 9-12 for self-employed
  const target = p.employment_type === 'salaried' ? 6 : 9

  let raw: number
  let finding: string
  let action: string

  if (months_covered >= target) {
    raw = 100
    finding = `Emergency fund covers ${months_covered.toFixed(1)} months — excellent buffer`
    action = 'Maintain and review annually'
  } else if (months_covered >= target * 0.66) {
    raw = 75
    finding = `${months_covered.toFixed(1)} months covered — needs ${(target - months_covered).toFixed(1)} more`
    action = `Add ₹${Math.round((target - months_covered) * monthly_expenses / 12).toLocaleString('en-IN')}/month to liquid savings`
  } else if (months_covered >= 3) {
    raw = 50
    finding = `Only ${months_covered.toFixed(1)} months — one emergency away from debt`
    action = `Build to ₹${Math.round(target * monthly_expenses).toLocaleString('en-IN')} in liquid savings urgently`
  } else if (months_covered >= 1) {
    raw = 25
    finding = `Critical: ${months_covered.toFixed(1)} months — vulnerable to any disruption`
    action = 'Priority 1: Build emergency fund before any investing'
  } else {
    raw = 0
    finding = 'No meaningful emergency fund — critical risk'
    action = 'Start with ₹10,000 liquid FD/savings account immediately'
  }

  const weight = WEIGHTS.emergency_fund
  return {
    name: 'Emergency Fund',
    score: raw,
    weighted: (raw * weight) / 100,
    weight,
    grade: raw >= 80 ? 'A' : raw >= 60 ? 'B' : raw >= 40 ? 'C' : raw >= 20 ? 'D' : 'F',
    finding,
    action,
  }
}

function scoreDebtManagement(p: FinancialProfile): HealthScoreDimension {
  const monthly_income = p.annual_income / 12
  const dti = p.monthly_emi / monthly_income  // Debt-to-income ratio

  // RBI recommendation: EMI should not exceed 40% of income
  let raw: number
  let finding: string
  let action: string

  if (p.total_debt === 0 || dti === 0) {
    raw = 100
    finding = 'Debt-free — full income available for wealth building'
    action = 'Consider strategic leverage only for appreciating assets'
  } else if (dti <= 0.3) {
    raw = 85
    finding = `EMI at ${(dti * 100).toFixed(0)}% of income — healthy debt load`
    action = 'Maintain discipline, prepay high-interest debt first'
  } else if (dti <= 0.4) {
    raw = 65
    finding = `EMI at ${(dti * 100).toFixed(0)}% of income — at the RBI ceiling`
    action = 'Avoid new loans. Target 1 loan prepayment within 12 months'
  } else if (dti <= 0.55) {
    raw = 35
    finding = `EMI at ${(dti * 100).toFixed(0)}% of income — over-leveraged`
    action = 'Loan consolidation or balance transfer to reduce EMI urgently'
  } else {
    raw = 10
    finding = `EMI at ${(dti * 100).toFixed(0)}% of income — debt trap risk`
    action = 'Immediate debt restructuring — consult a financial counsellor'
  }

  const weight = WEIGHTS.debt_management
  return {
    name: 'Debt Management',
    score: raw,
    weighted: (raw * weight) / 100,
    weight,
    grade: raw >= 80 ? 'A' : raw >= 60 ? 'B' : raw >= 40 ? 'C' : raw >= 20 ? 'D' : 'F',
    finding,
    action,
  }
}

function scoreInsuranceCover(p: FinancialProfile): HealthScoreDimension {
  let raw = 0
  const findings: string[] = []
  const actions: string[] = []

  // Term insurance: 10-15x annual income recommended (IRDAI guideline)
  if (p.has_term_insurance) {
    raw += 45
    findings.push('Term insurance: covered')
  } else if (p.dependents && p.dependents > 0) {
    actions.push(`Term cover of ₹${(p.annual_income * 12 / 100000).toFixed(0)}L required`)
  } else {
    raw += 20 // no dependents, partial credit
    findings.push('No dependents — term insurance optional now')
  }

  // Health insurance: ₹10L minimum for individual, ₹25L for family (post-Covid)
  if (p.has_health_insurance) {
    raw += 40
    findings.push('Health insurance: covered')
  } else {
    actions.push('Health insurance is non-negotiable — buy before investing')
    raw += 0
  }

  // Extra points for home asset
  if (p.has_home) raw += 15

  raw = Math.min(raw, 100)

  // Gap calculation
  const coverage_needed = p.dependents && p.dependents > 0 ? p.annual_income * 12 : 0

  const weight = WEIGHTS.insurance_cover
  return {
    name: 'Insurance Coverage',
    score: raw,
    weighted: (raw * weight) / 100,
    weight,
    grade: raw >= 80 ? 'A' : raw >= 60 ? 'B' : raw >= 40 ? 'C' : raw >= 20 ? 'D' : 'F',
    finding: findings.join('. ') || 'Underinsured — major financial risk',
    action: actions.join('. ') || 'Review adequacy annually',
  }
}

function scoreSavingsRate(p: FinancialProfile): HealthScoreDimension {
  const monthly_income = p.annual_income / 12
  const savings = monthly_income - p.monthly_expenses - p.monthly_emi
  const savings_rate = savings / monthly_income

  // Indian standard: 20-30% savings rate is healthy
  let raw: number
  let finding: string
  let action: string

  if (savings_rate >= 0.35) {
    raw = 100
    finding = `Exceptional ${(savings_rate * 100).toFixed(0)}% savings rate — top 5% of Indians`
    action = 'Maximize tax-advantaged options (ELSS, NPS, PPF)'
  } else if (savings_rate >= 0.25) {
    raw = 85
    finding = `Strong ${(savings_rate * 100).toFixed(0)}% savings rate — above average`
    action = 'Automate savings via SIP to avoid lifestyle inflation'
  } else if (savings_rate >= 0.15) {
    raw = 65
    finding = `Moderate ${(savings_rate * 100).toFixed(0)}% savings rate — room to improve`
    action = 'Apply "pay yourself first" — invest before spending'
  } else if (savings_rate >= 0.05) {
    raw = 35
    finding = `Low ${(savings_rate * 100).toFixed(0)}% savings rate — expenses too high`
    action = 'Budget audit required — identify 3 expense categories to cut'
  } else if (savings_rate > 0) {
    raw = 15
    finding = 'Near zero savings — income consumed by expenses/EMIs'
    action = 'Income increase or expense restructuring needed urgently'
  } else {
    raw = 0
    finding = 'Spending exceeds income — deficit spending'
    action = 'Immediate budget intervention required'
  }

  const weight = WEIGHTS.savings_rate
  return {
    name: 'Savings Rate',
    score: raw,
    weighted: (raw * weight) / 100,
    weight,
    grade: raw >= 80 ? 'A' : raw >= 60 ? 'B' : raw >= 40 ? 'C' : raw >= 20 ? 'D' : 'F',
    finding,
    action,
  }
}

function scoreInvestmentHealth(p: FinancialProfile): HealthScoreDimension {
  const monthly_income = p.annual_income / 12
  const investment_rate = p.monthly_investments / monthly_income
  const wealth_to_income = p.total_investments / p.annual_income

  // Rule of thumb: wealth-to-income ratio should be age/10 (e.g. 30yr old → 3x income)
  const target_ratio = p.age / 10
  let raw = 0

  if (investment_rate >= 0.2) raw += 50        // 20%+ investment rate
  else if (investment_rate >= 0.1) raw += 35
  else if (investment_rate >= 0.05) raw += 20
  else if (investment_rate > 0) raw += 10

  if (wealth_to_income >= target_ratio) raw += 50
  else if (wealth_to_income >= target_ratio * 0.66) raw += 35
  else if (wealth_to_income >= target_ratio * 0.33) raw += 20
  else raw += 5

  raw = Math.min(raw, 100)

  const weight = WEIGHTS.investment_health
  return {
    name: 'Investment Health',
    score: raw,
    weighted: (raw * weight) / 100,
    weight,
    grade: raw >= 80 ? 'A' : raw >= 60 ? 'B' : raw >= 40 ? 'C' : raw >= 20 ? 'D' : 'F',
    finding: `Investing ${(investment_rate * 100).toFixed(0)}% of income. Wealth ratio: ${wealth_to_income.toFixed(1)}x income (target: ${target_ratio}x)`,
    action: investment_rate < 0.2
      ? `Increase SIP by ₹${Math.round((0.2 - investment_rate) * monthly_income).toLocaleString('en-IN')}/month`
      : 'Diversify across equity, debt, and alternatives',
  }
}

function scoreCreditHealth(p: FinancialProfile): HealthScoreDimension {
  let raw = 60 // base — unknown credit score is neutral
  let finding = 'Credit score not provided'
  let action = 'Check free credit score on CIBIL/Experian'

  if (p.credit_score) {
    // CIBIL: 300-900
    if (p.credit_score >= 800) {
      raw = 100; finding = `Excellent CIBIL score ${p.credit_score} — top rates available`; action = 'Leverage score for best loan terms'
    } else if (p.credit_score >= 750) {
      raw = 85; finding = `Good CIBIL score ${p.credit_score} — most products accessible`; action = 'Pay all dues on time to reach 800+'
    } else if (p.credit_score >= 700) {
      raw = 65; finding = `Fair CIBIL score ${p.credit_score} — may face higher interest rates`; action = 'Reduce credit utilization below 30%'
    } else if (p.credit_score >= 650) {
      raw = 40; finding = `Below average CIBIL ${p.credit_score} — limited credit access`; action = 'No new credit. Pay all dues. Re-check in 6 months'
    } else {
      raw = 15; finding = `Poor CIBIL score ${p.credit_score} — credit rebuild required`; action = 'Secured credit card to rebuild score over 12-18 months'
    }

    // Adjust for utilization
    if (p.credit_utilization !== undefined) {
      if (p.credit_utilization > 50) raw = Math.max(0, raw - 20)
      else if (p.credit_utilization < 30) raw = Math.min(100, raw + 10)
    }
  }

  const weight = WEIGHTS.credit_health
  return {
    name: 'Credit Health',
    score: raw,
    weighted: (raw * weight) / 100,
    weight,
    grade: raw >= 80 ? 'A' : raw >= 60 ? 'B' : raw >= 40 ? 'C' : raw >= 20 ? 'D' : 'F',
    finding,
    action,
  }
}

function scoreGoalAlignment(p: FinancialProfile): HealthScoreDimension {
  let raw = 0
  let finding: string
  let action: string

  if (!p.goals || p.goals.length === 0) {
    raw = 0
    finding = 'No financial goals defined — investing without direction'
    action = 'Define at least 1 goal (retirement, home, education) with timeline'
  } else {
    raw += Math.min(p.goals.length * 20, 60) // up to 3 goals = 60pts

    if (p.goal_timeline_years && p.goal_amount) {
      raw += 20 // quantified goal
      if (p.monthly_investments > 0) {
        // Check if on track
        const monthly_need = p.goal_amount / (p.goal_timeline_years * 12)
        if (p.monthly_investments >= monthly_need) {
          raw += 20
          finding = `On track for ${p.goals[0]} goal — investing ₹${p.monthly_investments.toLocaleString('en-IN')}/mo`
          action = 'Review goal annually for inflation adjustment'
        } else {
          raw += 10
          finding = `Need ₹${Math.round(monthly_need).toLocaleString('en-IN')}/mo for goal — investing ₹${p.monthly_investments.toLocaleString('en-IN')}/mo`
          action = `Increase SIP by ₹${Math.round(monthly_need - p.monthly_investments).toLocaleString('en-IN')}/mo`
        }
      } else {
        finding = `Goal set but no investments — ₹${Math.round(p.goal_amount / (p.goal_timeline_years * 12)).toLocaleString('en-IN')}/mo needed`
        action = 'Start SIP immediately — time in market beats timing market'
      }
    } else {
      finding = `${p.goals.length} goal(s) identified but not quantified`
      action = 'Assign target amount and timeline to each goal'
    }
  }

  raw = Math.min(raw, 100)
  const weight = WEIGHTS.goal_alignment
  return {
    name: 'Goal Alignment',
    score: raw,
    weighted: (raw * weight) / 100,
    weight,
    grade: raw >= 80 ? 'A' : raw >= 60 ? 'B' : raw >= 40 ? 'C' : raw >= 20 ? 'D' : 'F',
    finding,
    action,
  }
}

// ─── Product needs inference ──────────────────────────────────────────────────

function inferProductNeeds(p: FinancialProfile, dims: HealthScoreDimension[]): ProductNeed[] {
  const needs: ProductNeed[] = []
  const ef = dims.find(d => d.name === 'Emergency Fund')!
  const debt = dims.find(d => d.name === 'Debt Management')!
  const ins = dims.find(d => d.name === 'Insurance Coverage')!
  const inv = dims.find(d => d.name === 'Investment Health')!

  if (!p.has_health_insurance) {
    needs.push({ category: 'insurance', reason: 'No health insurance — non-negotiable gap', priority: 'immediate' })
  }
  if (!p.has_term_insurance && p.dependents && p.dependents > 0) {
    needs.push({ category: 'insurance', reason: `${p.dependents} dependents with no term cover`, priority: 'immediate' })
  }
  if (ef.score < 50) {
    needs.push({ category: 'fd', reason: 'Emergency fund below target — liquid FD ideal', priority: 'immediate' })
  }
  if (p.goals.includes('retirement') || p.age > 40) {
    needs.push({ category: 'nps', reason: 'NPS provides ₹50,000 extra deduction + pension', priority: 'soon' })
  }
  if (p.annual_income > 500000 && inv.score < 60) {
    needs.push({ category: 'mutual-funds', reason: 'Equity MF SIP for long-term wealth building', priority: 'soon' })
  }
  if (p.annual_income > 700000 && p.goals.includes('wealth')) {
    needs.push({ category: 'mutual-funds', reason: 'ELSS for tax saving + wealth under 80C', priority: 'planned' })
  }
  if (!p.credit_score || (p.credit_score && p.credit_score > 750)) {
    needs.push({ category: 'credit-cards', reason: 'Rewards card to earn on daily spending', priority: 'planned' })
  }
  if (debt.score < 50 && p.total_debt > 0) {
    needs.push({ category: 'loans', reason: 'Balance transfer / consolidation to reduce EMI', priority: 'soon' })
  }
  if (p.annual_income > 600000 && p.age < 40) {
    needs.push({ category: 'ppf', reason: 'PPF: tax-free 7.1% return, 80C benefit', priority: 'planned' })
  }

  return needs
}

// ─── Priority actions ─────────────────────────────────────────────────────────

function buildPriorityActions(p: FinancialProfile, dims: HealthScoreDimension[]): PriorityAction[] {
  const actions: PriorityAction[] = []

  dims
    .filter(d => d.score < 40)
    .sort((a, b) => b.weight - a.weight) // highest weight first
    .forEach(d => {
      actions.push({
        urgency: d.score < 20 ? 'critical' : 'high',
        action: d.action,
        impact: `Improves your financial health score by up to ${Math.round(d.weight * 0.5)} points`,
        products: d.name === 'Insurance Coverage' ? ['insurance'] :
                  d.name === 'Emergency Fund' ? ['fd', 'liquid-funds'] :
                  d.name === 'Investment Health' ? ['mutual-funds', 'nps'] : undefined,
      })
    })

  dims
    .filter(d => d.score >= 40 && d.score < 70)
    .forEach(d => {
      actions.push({
        urgency: 'medium',
        action: d.action,
        impact: `Can push this dimension from ${d.grade} to B or A`,
      })
    })

  return actions.slice(0, 5) // top 5 most impactful
}

// ─── Main scoring function ────────────────────────────────────────────────────

export function computeFinancialHealthScore(profile: FinancialProfile): FinancialHealthReport {
  const dimensions = [
    scoreEmergencyFund(profile),
    scoreDebtManagement(profile),
    scoreInsuranceCover(profile),
    scoreSavingsRate(profile),
    scoreInvestmentHealth(profile),
    scoreCreditHealth(profile),
    scoreGoalAlignment(profile),
  ]

  // Raw score (0-100) from weighted dimensions
  const rawScore = dimensions.reduce((sum, d) => sum + d.weighted, 0)

  // Scale to 0-850 (like CIBIL) — feels more authoritative
  const score = Math.round(rawScore * 8.5)

  const band: FinancialHealthReport['band'] =
    score >= 700 ? 'Excellent' :
    score >= 600 ? 'Good' :
    score >= 500 ? 'Fair' :
    score >= 400 ? 'Poor' : 'Critical'

  // Estimated percentile vs Indian middle class (calibrated heuristic)
  const percentile = Math.round(
    score >= 700 ? 85 + (score - 700) / 150 * 15 :
    score >= 600 ? 65 + (score - 600) / 100 * 20 :
    score >= 500 ? 40 + (score - 500) / 100 * 25 :
    score >= 400 ? 20 + (score - 400) / 100 * 20 :
    (score / 400) * 20
  )

  const strengths = dimensions.filter(d => d.score >= 70).map(d => d.finding)
  const risks = dimensions.filter(d => d.score < 40).map(d => d.finding)

  const monthly_income = profile.annual_income / 12
  const monthly_surplus = monthly_income - profile.monthly_expenses - profile.monthly_emi

  const coverage_needed = (profile.dependents ?? 0) > 0 ? profile.annual_income * 12 : 0
  const insurance_gap = profile.has_term_insurance ? 0 : coverage_needed

  const product_needs = inferProductNeeds(profile, dimensions)
  const priority_actions = buildPriorityActions(profile, dimensions)

  // Investability score: ready to invest meaningfully?
  const investability = Math.round(
    (dimensions.find(d => d.name === 'Emergency Fund')!.score * 0.4) +
    (dimensions.find(d => d.name === 'Debt Management')!.score * 0.3) +
    (dimensions.find(d => d.name === 'Insurance Coverage')!.score * 0.3)
  )

  return {
    score,
    band,
    percentile: Math.min(99, Math.max(1, percentile)),
    dimensions,
    top_strengths: strengths,
    top_risks: risks,
    priority_actions,
    product_needs,
    investability_score: investability,
    insurance_gap,
    monthly_surplus,
  }
}

/**
 * Quick score with minimal data (for onboarding step 1)
 * Returns a rough score from just income + age + savings
 */
export function computeQuickScore(params: {
  annual_income: number
  age: number
  has_emergency_fund: boolean
  has_health_insurance: boolean
  has_investments: boolean
}): { score: number; band: string; message: string } {
  let raw = 0
  if (params.has_emergency_fund) raw += 30
  if (params.has_health_insurance) raw += 25
  if (params.has_investments) raw += 25
  if (params.annual_income > 1200000) raw += 10 // 12L+ income
  if (params.age > 25 && params.age < 55) raw += 10

  const score = Math.round(raw * 8.5)
  const band = score >= 600 ? 'Good' : score >= 400 ? 'Fair' : 'Poor'
  const message = score >= 600
    ? 'Your finances look healthy. See your detailed report.'
    : score >= 400
    ? 'Some gaps to address. Complete your profile for personalized plan.'
    : 'Your profile needs attention. We can help you fix that.'

  return { score, band, message }
}
