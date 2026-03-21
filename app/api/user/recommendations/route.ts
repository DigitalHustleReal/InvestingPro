/**
 * Personalized Product Recommendations API
 * GET /api/user/recommendations?category=credit-cards&limit=5
 *
 * Returns AI-matched products ranked by multi-factor compatibility:
 * eligibility (30%) + goal match (25%) + financial value (25%) + risk (10%) + behavioral (10%)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeFinancialHealthScore, FinancialProfile } from '@/lib/user/financial-health-scorer'
import { computeLeadScore, LeadProfile, BehavioralSignal } from '@/lib/user/lead-scorer'
import { generateRecommendations, ProductCandidate } from '@/lib/recommendations/personalized-engine'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') as any ?? undefined
  const limit = parseInt(searchParams.get('limit') ?? '5', 10)
  const context = searchParams.get('context') ?? 'general'

  // 1. Fetch user's financial profile
  const { data: profileData } = await supabase
    .from('user_financial_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // 2. Fetch behavioral signals (last 30 days)
  const { data: events } = await supabase
    .from('behavioral_events')
    .select('event_type, product_id, category, created_at, metadata')
    .eq('user_id', user.id)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(100)

  // 3. Build financial profile (use defaults if not set)
  const fp: FinancialProfile = {
    annual_income: profileData?.annual_income ?? 600000,
    monthly_expenses: profileData?.monthly_expenses ?? 30000,
    employment_type: profileData?.employment_type ?? 'salaried',
    age: profileData?.age ?? 30,
    total_debt: profileData?.total_debt ?? 0,
    monthly_emi: profileData?.monthly_emi ?? 0,
    credit_score: profileData?.credit_score,
    emergency_fund: profileData?.emergency_fund ?? 0,
    total_savings: profileData?.total_savings ?? 0,
    total_investments: profileData?.total_investments ?? 0,
    monthly_investments: profileData?.monthly_investments ?? 0,
    has_term_insurance: profileData?.has_term_insurance ?? false,
    has_health_insurance: profileData?.has_health_insurance ?? false,
    has_home: profileData?.has_home ?? false,
    goals: profileData?.goals ?? ['wealth'],
    goal_timeline_years: profileData?.goal_timeline_years,
    goal_amount: profileData?.goal_amount,
    risk_appetite: profileData?.risk_appetite ?? 5,
    dependents: profileData?.dependents ?? 0,
  }

  // 4. Build behavioral lead profile
  const signals: BehavioralSignal[] = (events ?? []).map((e: any) => ({
    type: e.event_type as BehavioralSignal['type'],
    product_id: e.product_id,
    category: e.category,
    timestamp: new Date(e.created_at).getTime(),
    metadata: e.metadata,
  }))

  const leadProfile: LeadProfile = {
    user_id: user.id,
    session_id: 'server',
    signals,
    financial_profile_complete: !!profileData?.onboarding_complete,
    income_bracket: fp.annual_income >= 2000000 ? '20l_plus' :
                    fp.annual_income >= 1000000 ? '10l_20l' :
                    fp.annual_income >= 500000 ? '5l_10l' : 'sub_5l',
    credit_score_range: fp.credit_score
      ? fp.credit_score >= 800 ? '800_plus'
      : fp.credit_score >= 750 ? '750_800'
      : fp.credit_score >= 650 ? '650_750' : 'below_650'
      : undefined,
  }

  const leadScore = computeLeadScore(leadProfile)

  // 5. Fetch eligible products from DB
  const productQuery = supabase
    .from('products')
    .select(`
      id, name, provider, category, slug, rating,
      credit_cards (annual_fee, reward_rate, min_income_required, min_credit_score, lounge_access),
      mutual_funds (returns_1y, returns_3y, returns_5y, expense_ratio, risk_level, fund_category),
      personal_loans (interest_rate_min, interest_rate_max)
    `)
    .eq('is_active', true)
    .limit(50)

  if (category) productQuery.eq('category', category)

  const { data: rawProducts } = await productQuery

  // 6. Map to ProductCandidate
  const products: ProductCandidate[] = (rawProducts ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    provider: p.provider,
    category: p.category,
    slug: p.slug,
    rating: p.rating,
    // Credit card
    annual_fee: p.credit_cards?.[0]?.annual_fee,
    reward_rate: p.credit_cards?.[0]?.reward_rate,
    min_income_required: p.credit_cards?.[0]?.min_income_required,
    min_credit_score: p.credit_cards?.[0]?.min_credit_score,
    lounge_access: p.credit_cards?.[0]?.lounge_access,
    // Mutual fund
    returns_1y: p.mutual_funds?.[0]?.returns_1y,
    returns_3y: p.mutual_funds?.[0]?.returns_3y,
    returns_5y: p.mutual_funds?.[0]?.returns_5y,
    expense_ratio: p.mutual_funds?.[0]?.expense_ratio,
    risk_level: p.mutual_funds?.[0]?.risk_level,
    fund_category: p.mutual_funds?.[0]?.fund_category,
    // Loan
    interest_rate_min: p.personal_loans?.[0]?.interest_rate_min,
    interest_rate_max: p.personal_loans?.[0]?.interest_rate_max,
  }))

  // 7. Generate recommendations
  const result = generateRecommendations({
    profile: fp,
    leadScore,
    products,
    category,
    max_results: limit,
    context,
  })

  return NextResponse.json({
    ...result,
    lead_score: leadScore.score,
    lead_segment: leadScore.segment,
    profile_complete: !!profileData?.onboarding_complete,
  })
}
