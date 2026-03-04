import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * GET /api/articles/preview?slug=...
 * 
 * Public-ish preview endpoint for draft articles.
 * Uses the service-role client to bypass RLS.
 * 
 * Security: Only returns article data — no write operations.
 * The slug acts as a "share secret" (unguessable AI-generated slugs).
 */
export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get('slug');
    
    if (!slug) {
        return NextResponse.json({ error: 'slug parameter required' }, { status: 400 });
    }

    try {
        const supabase = createServiceClient();
        
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (error || !data) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ article: data });
    } catch (error) {
        logger.error('Preview fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
