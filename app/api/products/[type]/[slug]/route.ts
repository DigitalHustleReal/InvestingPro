import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Product Detail API
 * Returns product data with full provenance
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string; slug: string }> }
) {
    try {
        const { type, slug } = await params;
        const supabase = await createClient();

        // Validate product type
        const validTypes = ['credit_card', 'mutual_fund', 'personal_loan'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Invalid product type' },
                { status: 400 }
            );
        }

        // Fetch product
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .eq('product_type', type)
            .eq('is_active', true)
            .single();

        if (productError || !product) {
            logger.warn('Product not found', { type, slug });
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Fetch type-specific data
        let typeData = null;
        if (type === 'credit_card') {
            const { data } = await supabase
                .from('credit_cards')
                .select('*')
                .eq('product_id', product.id)
                .single();
            typeData = data;
        } else if (type === 'mutual_fund') {
            const { data } = await supabase
                .from('mutual_funds')
                .select('*')
                .eq('product_id', product.id)
                .single();
            typeData = data;
        } else if (type === 'personal_loan') {
            const { data } = await supabase
                .from('personal_loans')
                .select('*')
                .eq('product_id', product.id)
                .single();
            typeData = data;
        }

        // Fetch data points with provenance
        const { data: dataPoints } = await supabase
            .from('product_data_points')
            .select(`
                *,
                data_sources (
                    id,
                    name,
                    url,
                    source_type,
                    is_verified
                )
            `)
            .eq('product_id', product.id)
            .order('fetched_at', { ascending: false });

        // Fetch current ranking
        const { data: ranking } = await supabase
            .from('rankings')
            .select(`
                *,
                ranking_configurations (
                    name,
                    methodology,
                    factors
                )
            `)
            .eq('product_id', product.id)
            .eq('ranking_configurations.is_published', true)
            .order('calculated_at', { ascending: false })
            .limit(1)
            .single();

        return NextResponse.json({
            product: {
                ...product,
                typeData,
            },
            dataPoints: dataPoints || [],
            ranking: ranking || null,
        });
    } catch (error: any) {
        logger.error('Error fetching product', error, {});
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

