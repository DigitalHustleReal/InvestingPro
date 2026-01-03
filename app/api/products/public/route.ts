import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';
        const featured = searchParams.get('featured') === 'true';
        
        const offset = (page - 1) * limit;
        const supabase = await createClient();
        
        // Build the query
        let query = supabase
            .from('products')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .order('trust_score', { ascending: false, nullsFirst: false })
            .order('name', { ascending: true });
        
        // Apply category filter
        if (category && category !== 'all') {
            query = query.eq('category', category);
        }
        
        // Apply search filter
        if (search) {
            query = query.or(`name.ilike.%${search}%,provider_name.ilike.%${search}%`);
        }
        
        // Apply featured filter (high trust score)
        if (featured) {
            query = query.gte('trust_score', 80);
        }
        
        // Apply pagination
        query = query.range(offset, offset + limit - 1);
        
        const { data, error, count } = await query;
        
        if (error) {
            console.error('[Products API] Query error:', error);
            
            // Fallback to RPC if direct query fails (RLS issue for anon users)
            const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_products', {
                category_filter: category || null,
                result_limit: limit,
                result_offset: offset,
                search_term: search || null
            });
            
            if (!rpcError && rpcData) {
                return NextResponse.json({ 
                    products: rpcData.products || [], 
                    total: rpcData.total || 0,
                    page,
                    limit,
                    totalPages: Math.ceil((rpcData.total || 0) / limit),
                    source: 'rpc' 
                });
            }
            
            return NextResponse.json({ 
                products: [], 
                total: 0,
                page,
                limit,
                totalPages: 0,
                error: error.message 
            });
        }
        
        // Normalize products to match schema
        const products = (data || []).map((p: any) => ({
            ...p,
            trust_score: p.trust_score || 0,
            data_completeness_score: p.data_completeness_score || 0
        }));
        
        return NextResponse.json({ 
            products, 
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
            source: 'direct'
        });
        
    } catch (error: any) {
        console.error('[Products API] Unexpected error:', error);
        return NextResponse.json({ 
            products: [], 
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
            error: error.message 
        }, { status: 500 });
    }
}
