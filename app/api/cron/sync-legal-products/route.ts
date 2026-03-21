/**
 * Cron: Sync Legal Product Data
 *
 * Runs daily at 6 AM IST (12:30 AM UTC)
 * Fetches product data from all legal sources and syncs to database.
 *
 * Sources:
 *   - AMFI (mutual fund NAVs) — daily, official
 *   - Curated credit cards — weekly updates
 *   - RBI policy rates — as announced
 *
 * Schedule (vercel.json):
 *   { "path": "/api/cron/sync-legal-products", "schedule": "30 0 * * *" }
 */

import { NextRequest, NextResponse } from 'next/server'
import { runFullProductSync } from '@/lib/data-sources/legal-product-pipeline'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  logger.info('[sync-legal-products] Cron triggered')

  try {
    const results = await runFullProductSync()

    const summary = {
      success: true,
      ran_at: new Date().toISOString(),
      sources: results.map(r => ({
        source: r.source,
        category: r.category,
        fetched: r.fetched,
        updated: r.updated,
        errors: r.errors.length,
        duration_ms: r.duration_ms,
      })),
      total_updated: results.reduce((s, r) => s + r.updated, 0),
      total_errors: results.reduce((s, r) => s + r.errors.length, 0),
    }

    logger.info('[sync-legal-products] Complete', summary)
    return NextResponse.json(summary)
  } catch (err: any) {
    logger.error('[sync-legal-products] Fatal error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
