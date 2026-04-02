/**
 * Watchlist API
 * GET    /api/user/watchlist            — get user's watchlist
 * POST   /api/user/watchlist            — add product
 * DELETE /api/user/watchlist?product_id — remove product
 * PATCH  /api/user/watchlist            — update note
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  addToWatchlist,
  removeFromWatchlist,
  getUserWatchlist,
  updateWatchlistNote,
} from '@/lib/products/watchlist-service'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await getUserWatchlist(user.id)
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { product_id, note, comparison_group_id } = await req.json()
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 })

  const result = await addToWatchlist({ user_id: user.id, product_id, note, comparison_group_id })

  // Track as behavioral signal
  supabase.from('behavioral_events').insert({
    user_id: user.id,
    session_id: 'api',
    event_type: 'saved_to_watchlist',
    product_id,
    created_at: new Date().toISOString(),
  }).then(() => {})

  return NextResponse.json(result, { status: result.success ? 200 : 400 })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const product_id = req.nextUrl.searchParams.get('product_id')
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 })

  const success = await removeFromWatchlist(user.id, product_id)
  return NextResponse.json({ success })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { product_id, note } = await req.json()
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 })

  const success = await updateWatchlistNote(user.id, product_id, note)
  return NextResponse.json({ success })
}
