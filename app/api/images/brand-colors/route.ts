import { NextRequest, NextResponse } from 'next/server';
import { imageGenerationService } from '@/lib/visual-content/ImageGenerationService';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Get brand colors
 * GET /api/images/brand-colors
 */
export async function GET(request: NextRequest) {
    try {
        const colors = await imageGenerationService.getBrandColors();
        return NextResponse.json({
            success: true,
            colors
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch brand colors';
        logger.error('Error fetching brand colors', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Create/update brand color
 * POST /api/images/brand-colors
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { color_name, hex_code, usage_context } = body;

        if (!color_name || !hex_code) {
            return NextResponse.json(
                { success: false, error: 'color_name and hex_code are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('brand_color_palette')
            .insert({
                color_name,
                hex_code,
                usage_context: usage_context || ['feature_images', 'graphics'],
                is_active: true
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            color: data
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create brand color';
        logger.error('Error creating brand color', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

