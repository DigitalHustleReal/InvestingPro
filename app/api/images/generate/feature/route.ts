import { NextRequest, NextResponse } from 'next/server';
import { imageGenerationService } from '@/lib/visual-content/ImageGenerationService';
import { logger } from '@/lib/logger';

/**
 * Generate feature image for article
 * POST /api/images/generate/feature
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { article_title, article_id, brand_colors } = body;

        if (!article_title) {
            return NextResponse.json(
                { success: false, error: 'article_title is required' },
                { status: 400 }
            );
        }

        const image = await imageGenerationService.generateFeatureImage(
            article_title,
            article_id,
            brand_colors
        );

        return NextResponse.json({
            success: true,
            image
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate feature image';
        logger.error('Error generating feature image', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

