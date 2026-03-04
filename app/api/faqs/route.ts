import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const supabase = await createClient();
    
    let query = supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching FAQs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch FAQs' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    logger.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
