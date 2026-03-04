import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { planContentCalendar } from '@/lib/automation/research-strategist';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { topic } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const plannedArticles = await planContentCalendar(topic);

        return NextResponse.json({ 
            success: true, 
            count: plannedArticles.length,
            articles: plannedArticles 
        });

    } catch (error: any) {
        logger.error('Strategist Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
