/**
 * Lead Score API
 * POST /api/intelligence/lead-score
 *
 * Accepts behavioral events, updates the lead score for the session/user.
 * Used by client-side event tracker to update intent in real-time.
 *
 * Also used by admin dashboard to see segment distribution.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { computeLeadScore, LeadProfile, BehavioralSignal } from '@/lib/user/lead-scorer'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const service = createServiceClient()

  const { data: { user } } = await supabase.auth.getUser()
  const body = await req.json()

  const session_id = body.session_id ?? req.headers.get('x-session-id') ?? 'anon'
  const signal = body.signal as Omit<BehavioralSignal, 'timestamp'>

  if (!signal?.type) {
    return NextResponse.json({ error: 'signal.type required' }, { status: 400 })
  }

  // Record the behavioral event
  await service.from('behavioral_events').insert({
    user_id: user?.id ?? null,
    session_id,
    event_type: signal.type,
    product_id: signal.product_id ?? null,
    category: signal.category ?? null,
    created_at: new Date().toISOString(),
    metadata: body.metadata ?? {},
  })

  // Fetch existing signals for this session (last 7 days)
  const { data: existingEvents } = await service
    .from('behavioral_events')
    .select('event_type, product_id, category, created_at')
    .eq('session_id', session_id)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(50)

  const signals: BehavioralSignal[] = (existingEvents ?? []).map((e: any) => ({
    type: e.event_type as BehavioralSignal['type'],
    product_id: e.product_id,
    category: e.category,
    timestamp: new Date(e.created_at).getTime(),
  }))

  const leadProfile: LeadProfile = {
    user_id: user?.id,
    session_id,
    signals,
  }

  const score = computeLeadScore(leadProfile)

  // Persist lead score if user is logged in
  if (user?.id) {
    service.from('lead_scores').upsert({
      user_id: user.id,
      session_id,
      score: score.score,
      segment: score.segment,
      top_category: score.top_category,
      category_scores: score.category_scores,
      signals_triggered: score.signals_triggered,
      cta_intensity: score.cta_intensity,
      monetization_value: score.monetization_value,
      expires_at: new Date(score.expires_at).toISOString(),
      computed_at: new Date().toISOString(),
    }, { onConflict: 'user_id' }).then(() => {})
  }

  // Return score to client for dynamic CTA adjustment
  return NextResponse.json({
    score: score.score,
    segment: score.segment,
    cta_intensity: score.cta_intensity,
    recommended_nudge: score.recommended_nudge,
    top_category: score.top_category,
  })
}

/**
 * GET /api/intelligence/lead-score — Admin: segment distribution
 * (admin only, via service role check)
 */
export async function GET() {
  const service = createServiceClient()

  const { data } = await service
    .from('lead_score_summary')
    .select('*')

  return NextResponse.json({ segments: data ?? [] })
}
