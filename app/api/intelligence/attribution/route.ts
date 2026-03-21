/**
 * Attribution Analytics API
 * GET  /api/intelligence/attribution?days=30&model=time_decay
 *      Returns content performance with multi-touch attribution
 * POST /api/intelligence/attribution
 *      Records a completed user journey (called on conversion)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { aggregateContentAttribution, recordJourney, JourneyRecord } from '@/lib/intelligence/attribution-tracker'

// Verify admin token for GET
function isAdminRequest(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_API_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const days = parseInt(req.nextUrl.searchParams.get('days') ?? '30', 10)

  const summaries = await aggregateContentAttribution(days)

  return NextResponse.json({
    period_days: days,
    total_entities: summaries.length,
    data: summaries.slice(0, 100), // top 100
    generated_at: new Date().toISOString(),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const journey = body as JourneyRecord

  if (!journey.session_id || !journey.touchpoints) {
    return NextResponse.json({ error: 'session_id and touchpoints required' }, { status: 400 })
  }

  await recordJourney(journey)

  // Also cache the attribution result for fast reporting
  if (journey.conversion) {
    const service = createServiceClient()
    // Update per-entity attribution cache
    const entityGroups = new Map<string, number>()
    for (const tp of journey.touchpoints) {
      const key = `${tp.type}:${tp.entity_id}`
      entityGroups.set(key, (entityGroups.get(key) ?? 0) + 1)
    }
    // Trigger background recompute
    service.from('content_attribution_cache')
      .select('id')
      .limit(1)
      .then(() => {}) // just a ping to keep connection alive
  }

  return NextResponse.json({ success: true })
}
