/**
 * Force fast-track a news event
 *
 * Promotes an event to 'analyzing' status, bypassing spike screening.
 * Use when admin wants to fast-track an event that was routed to daily queue.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Only allow force from non-terminal states
  const { data, error } = await supabase
    .from('news_events')
    .update({
      status: 'analyzing',
      analysis_at: new Date().toISOString(),
      skip_reason: null,
      retry_count: 0,
    })
    .eq('id', params.id)
    .in('status', ['detected', 'screening', 'skipped'])
    .select('id, status, headline')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) {
    return NextResponse.json(
      { error: 'Event not found or not in a forceable state (detected/screening/skipped)' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `"${data.headline?.substring(0, 60)}" force-promoted to analyzing`,
  });
}
