import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category') || '';
        
        const offset = (page - 1) * limit;
        const supabase = await createClient();
        
        // Try direct query first
        let query = supabase
            .from('articles')
            .select('*', { count: 'exact' })
            .eq('status', 'published')
            .order('published_at', { ascending: false });
            
        if (category) {
            query = query.eq('category', category);
        }
        
        query = query.range(offset, offset + limit - 1);
        
        const { data, error, count } = await query;
        
        if (error) {
            console.error('[Articles API] Query error, falling back to RPC:', error);
            
            // Fallback to RPC if RLS blocks access
            const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_articles', {
                result_limit: limit
            });
            
            if (rpcError) {
                return NextResponse.json({ error: rpcError.message }, { status: 500 });
            }
            
            // RPC likely returns just data, not count/pagination metadata in this simple version
            // Adapting based on rpc result structure
            return NextResponse.json({
                articles: rpcData || [],
                total: (rpcData || []).length, // Approximation
                page,
                limit,
                totalPages: 1
            });
        }
        
        return NextResponse.json({
            articles: data || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        });
        
    } catch (error: any) {
        console.error('[Articles API] Unexpected error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
