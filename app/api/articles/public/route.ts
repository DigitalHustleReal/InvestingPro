import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '1000');
        
        const supabase = await createClient();
        
        // Try direct query first
        const { data: directData, error: directError } = await supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(limit);
        
        if (directData && directData.length > 0) {
            console.log(`[API] Direct query returned ${directData.length} articles`);
            return NextResponse.json({ articles: directData, source: 'direct' });
        }
        
        console.log('[API] Direct query empty, trying RPC...');
        
        // Fallback to RPC
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_articles', {
            result_limit: limit
        });
        
        console.log('[API] RPC response:', {
            hasData: !!rpcData,
            isArray: Array.isArray(rpcData),
            length: Array.isArray(rpcData) ? rpcData.length : 'N/A',
            error: rpcError?.message
        });
        
        if (rpcError) {
            console.error('[API] RPC error:', rpcError);
            return NextResponse.json({ articles: [], source: 'error', error: rpcError.message });
        }
        
        // Handle the JSON array response
        const articles = Array.isArray(rpcData) ? rpcData : [];
        
        return NextResponse.json({ 
            articles, 
            source: 'rpc',
            count: articles.length 
        });
        
    } catch (error: any) {
        console.error('[API] Unexpected error:', error);
        return NextResponse.json({ 
            articles: [], 
            source: 'error', 
            error: error.message 
        }, { status: 500 });
    }
}
