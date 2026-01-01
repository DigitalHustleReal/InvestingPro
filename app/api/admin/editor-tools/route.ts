import { NextRequest, NextResponse } from 'next/server';
import { optimizeArticleSEO } from '@/lib/automation/seo-optimizer';
import { proofreadContent } from '@/lib/automation/copy-editor';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, title, content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        if (action === 'optimize-seo') {
            if (!title) return NextResponse.json({ error: 'Title required for SEO' }, { status: 400 });
            const result = await optimizeArticleSEO(title, content);
            return NextResponse.json({ success: true, data: result });
        } 
        
        else if (action === 'proofread') {
            const result = await proofreadContent(content);
            return NextResponse.json({ success: true, polished_content: result });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Editor Tool Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
