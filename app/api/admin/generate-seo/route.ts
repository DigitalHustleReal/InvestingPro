
import { NextRequest, NextResponse } from 'next/server';
import { VersusGenerator } from '@/lib/seo/versus-generator';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic'; // Prevent static caching
export const maxDuration = 60; // Allow longer run time for AI generation

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { category = 'credit_cards', limit = 5 } = body;

        // Security check (Basic) - In prod use middleware/auth check
        // const authHeader = request.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        logger.info(`Admin triggered SEO Generation for ${category} (Limit: ${limit})`);

        const generator = new VersusGenerator();
        const result = await generator.generatePairsForCategory(category, limit);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error: any) {
        logger.error('SEO Generation API Failed', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
