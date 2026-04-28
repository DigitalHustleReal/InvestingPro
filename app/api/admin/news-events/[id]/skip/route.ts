/**
 * Dismiss / skip a news event
 *
 * Marks an event as skipped (false positive dismissal by admin).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional
  }

  const reason = (body.reason as string) ?? 'Manually dismissed by admin';

  const { error } = await supabase
    .from('news_events')
    .update({
      status: 'skipped',
      skip_reason: reason.substring(0, 500),
    })
    .eq('id', params.id)
    .not('status', 'in', '("published","skipped")'); // Don't re-skip already terminal events

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
