/**
 * Saved Portfolios API
 * GET  /api/user/portfolios           — list user's portfolios
 * POST /api/user/portfolios           — create portfolio
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPortfolio, getUserPortfolios } from '@/lib/products/watchlist-service'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const portfolios = await getUserPortfolios(user.id)
  return NextResponse.json({ portfolios })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  if (!body.name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  if (!body.portfolio_items?.length) return NextResponse.json({ error: 'portfolio_items required' }, { status: 400 })

  const result = await createPortfolio({ ...body, user_id: user.id })
  return NextResponse.json(result, { status: result.success ? 201 : 400 })
}
