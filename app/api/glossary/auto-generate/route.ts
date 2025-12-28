import { NextRequest, NextResponse } from 'next/server';
import { autoGenerateGlossaryTerm, AutoGenerateGlossaryInput } from '@/lib/glossary/auto-generate';
import { logger } from '@/lib/logger';

/**
 * API Route: Auto-generate Glossary Term
 * 
 * POST /api/glossary/auto-generate
 * 
 * Body:
 * {
 *   term: string;
 *   full_form?: string;
 *   category: string;
 *   sources: Array<{name, url, type, verified, data?}>;
 *   related_calculators?: string[];
 *   related_guides?: string[];
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body: AutoGenerateGlossaryInput = await request.json();

        // Validate required fields
        if (!body.term || !body.category || !body.sources || body.sources.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields: term, category, sources' },
                { status: 400 }
            );
        }

        // Validate sources
        for (const source of body.sources) {
            if (!source.name || !source.url || !source.type) {
                return NextResponse.json(
                    { error: 'Each source must have name, url, and type' },
                    { status: 400 }
                );
            }
        }

        // Auto-generate glossary term
        const result = await autoGenerateGlossaryTerm(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: 'Failed to generate glossary term',
                    errors: result.errors,
                    warnings: result.warnings,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            slug: result.slug,
            message: 'Glossary term generated successfully',
            warnings: result.warnings,
        });

    } catch (error: any) {
        logger.error('Error in glossary auto-generate API', error as Error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
}

