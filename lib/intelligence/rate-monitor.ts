/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  RATE MONITOR — REAL-TIME RATE INTELLIGENCE SYSTEM              ║
 * ║                                                                  ║
 * ║  Tracks rate changes for all products and alerts users when      ║
 * ║  products they're watching change materially.                    ║
 * ║                                                                  ║
 * ║  Moat value:                                                     ║
 * ║  - Proprietary rate history database (months → years of data)   ║
 * ║  - First-mover alerts (users get notified before competitors)    ║
 * ║  - Rate trend analysis ("rates rising for 3 weeks")             ║
 * ║  - Best rate finder (dynamic, not static)                        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { createServiceClient } from '@/lib/supabase/service'

export type RateType =
  | 'nav'              // mutual fund NAV
  | 'interest_rate'    // loan interest
  | 'fd_rate'          // fixed deposit rate
  | 'reward_rate'      // credit card reward %
  | 'annual_fee'       // credit card fee
  | 'expense_ratio'    // MF expense ratio
  | 'premium'          // insurance premium
  | 'repo_rate'        // RBI repo rate

export interface RateSnapshot {
  product_id: string
  rate_type: RateType
  rate_value: number
  effective_date: string        // ISO date
  source: string                // 'amfi' | 'rbi' | 'manual' | 'partner_api'
  is_verified: boolean
}

export interface RateChange {
  product_id: string
  product_name: string
  rate_type: RateType
  old_value: number
  new_value: number
  change_pct: number           // % change
  change_direction: 'up' | 'down' | 'stable'
  is_material: boolean         // above materiality threshold
  detected_at: string
}

export interface RateTrend {
  product_id: string
  rate_type: RateType
  direction: 'rising' | 'falling' | 'volatile' | 'stable'
  change_30d_pct: number       // % change over 30 days
  change_90d_pct: number
  current_rate: number
  high_52w: number
  low_52w: number
  data_points: number          // how many snapshots we have
}

// Materiality thresholds — below this, don't alert users
const MATERIALITY: Record<RateType, number> = {
  nav: 0.5,            // 0.5% NAV change
  interest_rate: 0.25, // 25 bps change
  fd_rate: 0.25,
  reward_rate: 0.5,
  annual_fee: 5,       // ₹5 change (absolute, not %)
  expense_ratio: 0.05, // 5 bps
  premium: 2,          // 2% premium change
  repo_rate: 0.25,
}

/**
 * Record a new rate snapshot.
 * Called by AMFI sync cron, bank scrapers, partner APIs.
 */
export async function recordRateSnapshot(snapshot: RateSnapshot): Promise<RateChange | null> {
  const supabase = createServiceClient()

  // Fetch previous rate
  const { data: previous } = await supabase
    .from('product_rates_history')
    .select('rate_value, effective_date')
    .eq('product_id', snapshot.product_id)
    .eq('rate_type', snapshot.rate_type)
    .order('effective_date', { ascending: false })
    .limit(1)
    .single()

  // Insert new snapshot
  await supabase.from('product_rates_history').insert({
    product_id: snapshot.product_id,
    rate_type: snapshot.rate_type,
    rate_value: snapshot.rate_value,
    effective_date: snapshot.effective_date,
    source: snapshot.source,
    is_verified: snapshot.is_verified,
    created_at: new Date().toISOString(),
  })

  if (!previous) return null

  const change_pct = ((snapshot.rate_value - previous.rate_value) / previous.rate_value) * 100
  const abs_change = Math.abs(change_pct)
  const material_threshold = MATERIALITY[snapshot.rate_type] ?? 1.0

  return {
    product_id: snapshot.product_id,
    product_name: '',  // caller fills in
    rate_type: snapshot.rate_type,
    old_value: previous.rate_value,
    new_value: snapshot.rate_value,
    change_pct,
    change_direction: change_pct > 0.01 ? 'up' : change_pct < -0.01 ? 'down' : 'stable',
    is_material: abs_change >= material_threshold,
    detected_at: new Date().toISOString(),
  }
}

/**
 * Compute rate trends for a product from stored history.
 */
export async function computeRateTrend(
  product_id: string,
  rate_type: RateType
): Promise<RateTrend | null> {
  const supabase = createServiceClient()

  const { data: history } = await supabase
    .from('product_rates_history')
    .select('rate_value, effective_date')
    .eq('product_id', product_id)
    .eq('rate_type', rate_type)
    .order('effective_date', { ascending: false })
    .limit(365) // up to 1 year

  if (!history || history.length < 2) return null

  const current = history[0].rate_value
  const rates = history.map(h => h.rate_value)

  const now = new Date()
  const d30 = history.find(h => {
    const d = new Date(h.effective_date)
    return (now.getTime() - d.getTime()) >= 30 * 24 * 60 * 60 * 1000
  })
  const d90 = history.find(h => {
    const d = new Date(h.effective_date)
    return (now.getTime() - d.getTime()) >= 90 * 24 * 60 * 60 * 1000
  })

  const change_30d_pct = d30 ? ((current - d30.rate_value) / d30.rate_value) * 100 : 0
  const change_90d_pct = d90 ? ((current - d90.rate_value) / d90.rate_value) * 100 : 0

  const high_52w = Math.max(...rates)
  const low_52w = Math.min(...rates)

  // Trend classification
  const recent5 = history.slice(0, 5).map(h => h.rate_value)
  const isRising = recent5.every((v, i) => i === 0 || v <= recent5[i - 1])
  const isFalling = recent5.every((v, i) => i === 0 || v >= recent5[i - 1])
  const stdDev = standardDeviation(recent5)
  const isVolatile = stdDev / current > 0.02 // >2% std dev

  const direction: RateTrend['direction'] =
    isVolatile ? 'volatile' :
    isRising ? 'rising' :
    isFalling ? 'falling' : 'stable'

  return {
    product_id,
    rate_type,
    direction,
    change_30d_pct,
    change_90d_pct,
    current_rate: current,
    high_52w,
    low_52w,
    data_points: history.length,
  }
}

/**
 * Find best rates today across all products in a category.
 * Returns live-updated ranking vs static product list.
 */
export async function findBestRates(params: {
  category: 'fd' | 'loans' | 'mutual-funds'
  rate_type: RateType
  limit?: number
}): Promise<Array<{ product_id: string; current_rate: number; trend: RateTrend['direction']; last_updated: string }>> {
  const supabase = createServiceClient()

  // Get latest rate per product via subquery
  const { data } = await supabase
    .from('product_rates_history')
    .select('product_id, rate_value, effective_date')
    .eq('rate_type', params.rate_type)
    .order('effective_date', { ascending: false })

  if (!data) return []

  // Deduplicate: keep latest per product
  const seen = new Set<string>()
  const latest: Array<{ product_id: string; current_rate: number; last_updated: string }> = []
  for (const row of data) {
    if (!seen.has(row.product_id)) {
      seen.add(row.product_id)
      latest.push({
        product_id: row.product_id,
        current_rate: row.rate_value,
        last_updated: row.effective_date,
      })
    }
  }

  // Sort: loans = lowest rate first, everything else = highest first
  const isLoan = params.category === 'loans'
  latest.sort((a, b) => isLoan
    ? a.current_rate - b.current_rate
    : b.current_rate - a.current_rate
  )

  const top = latest.slice(0, params.limit ?? 10)

  // Add trend direction (fast approximation from last 2 data points)
  return top.map(item => {
    const history = data.filter(d => d.product_id === item.product_id).slice(0, 2)
    const trend: RateTrend['direction'] = history.length < 2 ? 'stable' :
      history[0].rate_value > history[1].rate_value ? 'rising' :
      history[0].rate_value < history[1].rate_value ? 'falling' : 'stable'
    return { ...item, trend }
  })
}

/**
 * Get products in a user's watchlist that had rate changes.
 * Called when user logs in or by daily notification cron.
 */
export async function getWatchlistRateAlerts(
  user_id: string,
  since_hours: number = 24
): Promise<RateChange[]> {
  const supabase = createServiceClient()
  const since = new Date(Date.now() - since_hours * 60 * 60 * 1000).toISOString()

  // Get user's watchlist products
  const { data: watchlist } = await supabase
    .from('product_watchlists')
    .select('product_id, products(name)')
    .eq('user_id', user_id)

  if (!watchlist || watchlist.length === 0) return []

  const productIds = watchlist.map((w: { product_id: string }) => w.product_id)

  // For each product, check if there was a material rate change
  const alerts: RateChange[] = []

  for (const { product_id, products } of watchlist as unknown as Array<{ product_id: string; products: { name: string } | null }>) {
    const { data: recentRates } = await supabase
      .from('product_rates_history')
      .select('rate_value, rate_type, effective_date')
      .eq('product_id', product_id)
      .gte('created_at', since)
      .order('effective_date', { ascending: false })
      .limit(2)

    if (recentRates && recentRates.length === 2) {
      const change_pct = ((recentRates[0].rate_value - recentRates[1].rate_value) / recentRates[1].rate_value) * 100
      const threshold = MATERIALITY[recentRates[0].rate_type as RateType] ?? 1

      if (Math.abs(change_pct) >= threshold) {
        alerts.push({
          product_id,
          product_name: products?.name ?? 'Unknown',
          rate_type: recentRates[0].rate_type as RateType,
          old_value: recentRates[1].rate_value,
          new_value: recentRates[0].rate_value,
          change_pct,
          change_direction: change_pct > 0 ? 'up' : 'down',
          is_material: true,
          detected_at: recentRates[0].effective_date,
        })
      }
    }
  }

  return alerts
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function standardDeviation(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}
