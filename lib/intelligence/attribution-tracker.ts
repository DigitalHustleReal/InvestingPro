/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  MULTI-TOUCH ATTRIBUTION TRACKER                                 ║
 * ║                                                                  ║
 * ║  Goes beyond last-click attribution to understand which content  ║
 * ║  actually drives conversions. Critical for:                      ║
 * ║  - Understanding true ROI per article                            ║
 * ║  - Identifying the "golden path" sequence to conversion         ║
 * ║  - Optimizing internal linking strategy                          ║
 * ║  - Negotiating CPA terms with partners                           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { createServiceClient } from '@/lib/supabase/service'

export type TouchpointType = 'article_read' | 'product_view' | 'comparison_view' | 'affiliate_click' | 'calculator_use' | 'search'

export interface Touchpoint {
  type: TouchpointType
  entity_id: string        // article_id, product_id, etc.
  entity_name?: string
  timestamp: number
  time_spent_seconds?: number
  scroll_depth_pct?: number
  source?: string          // 'google' | 'direct' | 'email' | 'internal'
}

export interface ConversionEvent {
  product_id: string
  product_name: string
  category: string
  commission_earned?: number  // ₹
  timestamp: number
}

export interface JourneyRecord {
  session_id: string
  user_id?: string
  touchpoints: Touchpoint[]
  conversion?: ConversionEvent
  started_at: number
  converted_at?: number
  days_to_conversion?: number
}

export type AttributionModel = 'last_click' | 'first_touch' | 'linear' | 'time_decay' | 'position_based'

export interface AttributionResult {
  model: AttributionModel
  touchpoints: Array<{
    touchpoint: Touchpoint
    attribution_pct: number   // % of conversion credited
    attributed_value: number  // ₹ value
  }>
  total_value: number
}

// ─── Attribution models ───────────────────────────────────────────────────────

function lastClickAttribution(journey: JourneyRecord): AttributionResult {
  const { touchpoints, conversion } = journey
  const total_value = conversion?.commission_earned ?? 0

  const last = touchpoints[touchpoints.length - 1]
  return {
    model: 'last_click',
    touchpoints: touchpoints.map(tp => ({
      touchpoint: tp,
      attribution_pct: tp === last ? 100 : 0,
      attributed_value: tp === last ? total_value : 0,
    })),
    total_value,
  }
}

function firstTouchAttribution(journey: JourneyRecord): AttributionResult {
  const { touchpoints, conversion } = journey
  const total_value = conversion?.commission_earned ?? 0

  const first = touchpoints[0]
  return {
    model: 'first_touch',
    touchpoints: touchpoints.map(tp => ({
      touchpoint: tp,
      attribution_pct: tp === first ? 100 : 0,
      attributed_value: tp === first ? total_value : 0,
    })),
    total_value,
  }
}

function linearAttribution(journey: JourneyRecord): AttributionResult {
  const { touchpoints, conversion } = journey
  const total_value = conversion?.commission_earned ?? 0
  const pct = touchpoints.length > 0 ? 100 / touchpoints.length : 0

  return {
    model: 'linear',
    touchpoints: touchpoints.map(tp => ({
      touchpoint: tp,
      attribution_pct: pct,
      attributed_value: (total_value * pct) / 100,
    })),
    total_value,
  }
}

function timeDecayAttribution(journey: JourneyRecord): AttributionResult {
  const { touchpoints, conversion } = journey
  const total_value = conversion?.commission_earned ?? 0
  const conversionTime = conversion?.timestamp ?? Date.now()

  // Half-life: 7 days (earlier = exponentially less credit)
  const halfLifeMs = 7 * 24 * 60 * 60 * 1000

  const weights = touchpoints.map(tp => {
    const age = conversionTime - tp.timestamp
    return Math.pow(2, -age / halfLifeMs)
  })
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  return {
    model: 'time_decay',
    touchpoints: touchpoints.map((tp, i) => {
      const pct = totalWeight > 0 ? (weights[i] / totalWeight) * 100 : 0
      return {
        touchpoint: tp,
        attribution_pct: pct,
        attributed_value: (total_value * pct) / 100,
      }
    }),
    total_value,
  }
}

function positionBasedAttribution(journey: JourneyRecord): AttributionResult {
  // 40% first, 40% last, 20% divided among middle
  const { touchpoints, conversion } = journey
  const total_value = conversion?.commission_earned ?? 0
  const n = touchpoints.length

  if (n === 0) return linearAttribution(journey)
  if (n === 1) return lastClickAttribution(journey)

  const middle_pct = n > 2 ? 20 / (n - 2) : 0

  return {
    model: 'position_based',
    touchpoints: touchpoints.map((tp, i) => {
      let pct: number
      if (i === 0) pct = 40
      else if (i === n - 1) pct = 40
      else pct = middle_pct

      return {
        touchpoint: tp,
        attribution_pct: pct,
        attributed_value: (total_value * pct) / 100,
      }
    }),
    total_value,
  }
}

// ─── Main attribution calculator ──────────────────────────────────────────────

export function attributeConversion(
  journey: JourneyRecord,
  model: AttributionModel = 'time_decay'
): AttributionResult {
  switch (model) {
    case 'last_click': return lastClickAttribution(journey)
    case 'first_touch': return firstTouchAttribution(journey)
    case 'linear': return linearAttribution(journey)
    case 'time_decay': return timeDecayAttribution(journey)
    case 'position_based': return positionBasedAttribution(journey)
  }
}

// ─── Content performance aggregator ──────────────────────────────────────────

export interface ContentAttributionSummary {
  entity_id: string
  entity_name: string
  entity_type: TouchpointType
  // Per model
  last_click_value: number
  time_decay_value: number
  position_based_value: number
  // Aggregated
  total_attributed_value: number    // average across models
  conversion_assist_count: number   // how many journeys it appeared in
  direct_conversion_count: number   // how many times it was the last click
  avg_position_in_journey: number   // 1 = first touchpoint, higher = later
}

/**
 * Aggregate attribution across all journeys for content performance reporting.
 * Runs as a background job (cron or on-demand).
 */
export async function aggregateContentAttribution(
  since_days: number = 30
): Promise<ContentAttributionSummary[]> {
  const supabase = createServiceClient()
  const since = new Date(Date.now() - since_days * 24 * 60 * 60 * 1000).toISOString()

  const { data: journeys } = await supabase
    .from('user_journeys')
    .select('*')
    .gte('created_at', since)
    .not('conversion', 'is', null)

  if (!journeys || journeys.length === 0) return []

  const entityMap = new Map<string, {
    name: string
    type: TouchpointType
    last_click_values: number[]
    time_decay_values: number[]
    position_based_values: number[]
    appearances: number
    direct_conversions: number
    positions: number[]
  }>()

  for (const rawJourney of journeys) {
    const journey = rawJourney as JourneyRecord

    const models: AttributionModel[] = ['last_click', 'time_decay', 'position_based']
    const results = models.map(m => ({ model: m, result: attributeConversion(journey, m) }))

    journey.touchpoints.forEach((tp, idx) => {
      const key = `${tp.type}:${tp.entity_id}`
      if (!entityMap.has(key)) {
        entityMap.set(key, {
          name: tp.entity_name ?? tp.entity_id,
          type: tp.type,
          last_click_values: [],
          time_decay_values: [],
          position_based_values: [],
          appearances: 0,
          direct_conversions: 0,
          positions: [],
        })
      }

      const entry = entityMap.get(key)!
      entry.appearances++
      entry.positions.push(idx + 1)

      if (idx === journey.touchpoints.length - 1) {
        entry.direct_conversions++
      }

      for (const { model, result } of results) {
        const tpResult = result.touchpoints[idx]
        if (model === 'last_click') entry.last_click_values.push(tpResult.attributed_value)
        if (model === 'time_decay') entry.time_decay_values.push(tpResult.attributed_value)
        if (model === 'position_based') entry.position_based_values.push(tpResult.attributed_value)
      }
    })
  }

  const summaries: ContentAttributionSummary[] = []

  for (const [key, data] of entityMap.entries()) {
    const [entity_type, entity_id] = key.split(':') as [TouchpointType, string]

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
    const avg = (arr: number[]) => arr.length > 0 ? sum(arr) / arr.length : 0

    const lc = sum(data.last_click_values)
    const td = sum(data.time_decay_values)
    const pb = sum(data.position_based_values)

    summaries.push({
      entity_id,
      entity_name: data.name,
      entity_type,
      last_click_value: Math.round(lc),
      time_decay_value: Math.round(td),
      position_based_value: Math.round(pb),
      total_attributed_value: Math.round((lc + td + pb) / 3),
      conversion_assist_count: data.appearances,
      direct_conversion_count: data.direct_conversions,
      avg_position_in_journey: avg(data.positions),
    })
  }

  return summaries.sort((a, b) => b.total_attributed_value - a.total_attributed_value)
}

/**
 * Record a complete user journey (called when a conversion happens).
 */
export async function recordJourney(journey: JourneyRecord): Promise<void> {
  const supabase = createServiceClient()

  await supabase.from('user_journeys').insert({
    session_id: journey.session_id,
    user_id: journey.user_id,
    touchpoints: journey.touchpoints,
    conversion: journey.conversion,
    started_at: new Date(journey.started_at).toISOString(),
    converted_at: journey.converted_at ? new Date(journey.converted_at).toISOString() : null,
    days_to_conversion: journey.days_to_conversion,
    created_at: new Date().toISOString(),
  })
}
