/**
 * Compliance Validation API
 * 
 * POST /api/admin/articles/validate/compliance
 * Validates article content for regulatory compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkCompliance } from '@/lib/compliance/regulatory-checker';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/admin/articles/validate/compliance
 * Run compliance validation on article content
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content, category } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const result = await checkCompliance(content, {
            category
        });

        return NextResponse.json(result);
    } catch (error) {
        logger.error('Error running compliance validation', error as Error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
