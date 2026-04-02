/**
 * User Financial Profile API
 * GET  /api/user/profile — fetch profile + health score
 * POST /api/user/profile — upsert profile + recompute health score
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { computeFinancialHealthScore, FinancialProfile } from '@/lib/user/financial-health-scorer'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_financial_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data ?? null })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const service = createServiceClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Compute health score
  const profile: FinancialProfile = {
    annual_income: body.annual_income ?? 0,
    monthly_expenses: body.monthly_expenses ?? 0,
    employment_type: body.employment_type ?? 'salaried',
    age: body.age ?? 30,
    total_debt: body.total_debt ?? 0,
    monthly_emi: body.monthly_emi ?? 0,
    credit_score: body.credit_score,
    credit_cards_count: body.credit_cards_count,
    credit_utilization: body.credit_utilization,
    emergency_fund: body.emergency_fund ?? 0,
    total_savings: body.total_savings ?? 0,
    total_investments: body.total_investments ?? 0,
    monthly_investments: body.monthly_investments ?? 0,
    has_term_insurance: body.has_term_insurance ?? false,
    has_health_insurance: body.has_health_insurance ?? false,
    has_home: body.has_home ?? false,
    goals: body.goals ?? [],
    goal_timeline_years: body.goal_timeline_years,
    goal_amount: body.goal_amount,
    risk_appetite: body.risk_appetite ?? 5,
    dependents: body.dependents ?? 0,
    has_will: body.has_will ?? false,
  }

  const report = computeFinancialHealthScore(profile)

  // Upsert profile with computed score
  const { error: upsertError } = await supabase
    .from('user_financial_profiles')
    .upsert({
      user_id: user.id,
      ...body,
      health_score: report.score,
      health_score_band: report.band,
      health_score_computed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 })

  // Store health score history (async, via service role)
  service.from('financial_health_history').insert({
    user_id: user.id,
    score: report.score,
    band: report.band,
    dimensions: report.dimensions,
    computed_at: new Date().toISOString(),
  }).then(() => {})  // fire and forget

  return NextResponse.json({
    profile: body,
    health_report: report,
  })
}
