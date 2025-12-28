import { NextRequest, NextResponse } from 'next/server';
import { seoServiceManager } from '@/lib/seo-services/SEOServiceManager';
import { logger } from '@/lib/logger';

/**
 * Get all SEO service integrations
 * GET /api/seo/integrations
 */
export async function GET(request: NextRequest) {
    try {
        const integrations = await seoServiceManager.getIntegrations();
        
        return NextResponse.json({
            success: true,
            integrations
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch integrations';
        logger.error('Error fetching SEO integrations', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Create/update SEO service integration
 * POST /api/seo/integrations
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const integrationId = await seoServiceManager.saveIntegration(body);
        
        return NextResponse.json({
            success: true,
            integration_id: integrationId
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save integration';
        logger.error('Error saving SEO integration', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

