
import { NextRequest, NextResponse } from 'next/server';
import { generateOutline } from '@/lib/ai/outline-service';

export const maxDuration = 60; // Allow 60s for AI generation

export async function POST(req: NextRequest) {
    try {
        const { topic, context } = await req.json();

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            );
        }

        const outline = await generateOutline(topic, context);

        return NextResponse.json({ outline });

    } catch (error: any) {
        console.error('Outline API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate outline' },
            { status: 500 }
        );
    }
}
