/**
 * News Sources CRUD — list all + create new
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase
    .from('news_sources')
    .select('*')
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, type, url, category_tags, base_importance, poll_interval_m } = body;
  if (!name || !type || !url) {
    return NextResponse.json({ error: 'name, type, and url are required' }, { status: 400 });
  }
  if (!['rss', 'price_poll', 'scrape'].includes(type)) {
    return NextResponse.json({ error: 'type must be rss, price_poll, or scrape' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('news_sources')
    .insert({
      name,
      type,
      url,
      category_tags: Array.isArray(category_tags) ? category_tags : [],
      base_importance: Math.min(10, Math.max(1, Number(base_importance) || 5)),
      poll_interval_m: Number(poll_interval_m) || 15,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
