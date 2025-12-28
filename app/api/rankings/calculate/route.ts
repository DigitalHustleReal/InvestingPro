import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { rankCreditCards } from '@/lib/ranking/engine';

/**
 * Calculate Rankings API
 * Recalculates rankings for a product type using current configuration
 */
export async function POST(request: NextRequest) {
    try {
        const { productType, configurationId } = await request.json();

        if (!productType || !['credit_card', 'mutual_fund', 'personal_loan'].includes(productType)) {
            return NextResponse.json(
                { error: 'Invalid product type' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Fetch ranking configuration
        const { data: config, error: configError } = await supabase
            .from('ranking_configurations')
            .select('*')
            .eq('id', configurationId || 'default') // Use default if not specified
            .eq('product_type', productType)
            .eq('is_active', true)
            .single();

        if (configError || !config) {
            return NextResponse.json(
                { error: 'Ranking configuration not found' },
                { status: 404 }
            );
        }

        // Fetch all active products of this type
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('product_type', productType)
            .eq('is_active', true);

        if (productsError || !products) {
            return NextResponse.json(
                { error: 'Failed to fetch products' },
                { status: 500 }
            );
        }

        // Fetch type-specific data
        let typeData: any[] = [];
        if (productType === 'credit_card') {
            const { data } = await supabase
                .from('credit_cards')
                .select('*, products!inner(*)')
                .in('product_id', products.map(p => p.id));
            typeData = data || [];
        }
        // Add other product types...

        // Calculate rankings
        const rankingConfig = {
            id: config.id,
            name: config.name,
            productType: config.product_type as 'credit_card' | 'mutual_fund' | 'personal_loan',
            version: config.version,
            weights: config.weights,
            factors: config.factors,
            methodology: config.methodology,
        };

        const results = rankCreditCards(
            typeData.map(item => ({
                ...item.products,
                ...item,
            })),
            rankingConfig
        );

        // Store rankings in database
        const rankingRecords = results.map(result => ({
            configuration_id: config.id,
            product_id: result.productId,
            total_score: result.totalScore,
            rank: result.rank,
            score_breakdown: result.breakdown.reduce((acc, b) => {
                acc[b.factor] = b.weightedScore;
                return acc;
            }, {} as Record<string, number>),
            factor_scores: result.breakdown.reduce((acc, b) => {
                acc[b.factor] = {
                    rawValue: b.rawValue,
                    normalizedScore: b.normalizedScore,
                    weight: b.weight,
                    weightedScore: b.weightedScore,
                };
                return acc;
            }, {} as Record<string, any>),
            explanation_text: result.explanation,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            data_snapshot_date: new Date().toISOString().split('T')[0],
        }));

        // Insert rankings (with conflict handling)
        const { error: insertError } = await supabase
            .from('rankings')
            .upsert(rankingRecords, {
                onConflict: 'configuration_id,product_id,calculated_at',
            });

        if (insertError) {
            logger.error('Error inserting rankings', insertError, {});
            return NextResponse.json(
                { error: 'Failed to save rankings' },
                { status: 500 }
            );
        }

        logger.info('Rankings calculated successfully', {
            productType,
            count: results.length,
        });

        return NextResponse.json({
            success: true,
            count: results.length,
            rankings: results.slice(0, 10), // Return top 10
        });
    } catch (error: any) {
        logger.error('Error calculating rankings', error, {});
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

