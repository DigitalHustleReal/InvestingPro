import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';
        
        const offset = (page - 1) * limit;
        const supabase = await createClient();
        
        // Build the query
        let query = supabase
            .from('articles')
            .select('*', { count: 'exact' })
            .eq('status', 'published')
            .order('published_at', { ascending: false });
        
        // Apply category filter
        if (category && category !== 'all') {
            query = query.eq('category', category);
        }
        
        // Apply search filter
        if (search) {
            query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }
        
        // Apply pagination
        query = query.range(offset, offset + limit - 1);
        
        const { data, error, count } = await query;
        
        if (error) {
            console.error('[API] Query error:', error);
            
            // Fallback to RPC if direct query fails (RLS issue for anon users)
            const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_articles', {
                result_limit: limit
            });
            
            if (!rpcError && rpcData) {
                const articles = Array.isArray(rpcData) ? rpcData : [];
                // For RPC fallback, we can't easily filter/count, return what we have
                return NextResponse.json({ 
                    articles: articles.slice(0, limit), 
                    total: articles.length,
                    page,
                    limit,
                    totalPages: Math.ceil(articles.length / limit),
                    source: 'rpc' 
                });
            }
            
            return NextResponse.json({ 
                articles: [], 
                total: 0,
                page,
                limit,
                totalPages: 0,
                error: error.message 
            });
        }
        
        return NextResponse.json({ 
            articles: data || [], 
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
            source: 'direct'
        });
        
    } catch (error: any) {
        console.error('[API] Unexpected error:', error);
        return NextResponse.json({ 
            articles: [], 
            total: 0,
            page: 1,
            limit: 12,
            totalPages: 0,
            error: error.message 
        }, { status: 500 });
    }
}
