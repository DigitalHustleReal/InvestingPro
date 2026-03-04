
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { productService } from '@/lib/products/product-service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Admin role verification
        const { data: adminRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (adminRole?.role !== 'admin') {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role !== 'admin') {
                return NextResponse.json(
                    { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                    { status: 403 }
                );
            }
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Fetch Single Product
        if (id) {
            const product = await productService.getProductById(id, supabase);
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }
            return NextResponse.json(product);
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || undefined;
        const category = searchParams.get('category') || undefined;
        
        // Pass the authorized server client to the service
        const result = await productService.getProductsPaginated({
            page,
            limit,
            search,
            category,
            includeInactive: true // Admin always sees inactive
        }, supabase);

        return NextResponse.json(result);

    } catch (error) {
        logger.error('Product API error', error as Error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
