/**
 * Image Optimization API
 * 
 * POST /api/images/optimize
 * - Optimize a single image
 * 
 * POST /api/images/optimize/batch
 * - Optimize multiple images
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { optimizeImage, batchOptimizeImages, generateResponsiveUrls, getOptimizationRecommendations } from '@/lib/images/optimizer';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/images/optimize
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { imageUrl, imageUrls, options } = body;

        // Batch optimization
        if (imageUrls && Array.isArray(imageUrls)) {
            const optimized = await batchOptimizeImages(imageUrls, options || {});
            
            return NextResponse.json({
                success: true,
                images: optimized,
                totalOptimized: optimized.length,
                averageCompression: optimized.reduce((sum, img) => sum + img.compressionRatio, 0) / optimized.length
            });
        }

        // Single image optimization
        if (!imageUrl) {
            return NextResponse.json(
                { error: 'imageUrl or imageUrls is required' },
                { status: 400 }
            );
        }

        const optimized = await optimizeImage(imageUrl, options || {});

        // Generate responsive URLs
        if (options?.responsive !== false) {
            optimized.responsiveUrls = generateResponsiveUrls(
                optimized.url || imageUrl,
                { widths: options?.widths }
            );
        }

        // Get recommendations
        const recommendations = getOptimizationRecommendations(
            optimized.originalSize || 0,
            optimized.format,
            imageUrl
        );

        return NextResponse.json({
            success: true,
            image: optimized,
            recommendations
        });
    } catch (error) {
        logger.error('Error optimizing image', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
