import { NextRequest, NextResponse } from 'next/server';
import { generateArticleCore } from '@/lib/automation/article-generator';

export async function POST(req: NextRequest) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const logs: string[] = [];
        const logFn = (msg: string) => logs.push(msg);

        // Run the generator
        const result = await generateArticleCore(topic, logFn);

        return NextResponse.json({
            ...result,
            logs
        });

    } catch (error: any) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
