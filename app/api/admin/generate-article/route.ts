import { NextResponse } from 'next/server';
import { generateArticle } from '@/lib/ai/article-writer';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Skip auth check in development (matching middleware behavior)
        const isProduction = process.env.NODE_ENV === 'production';
        if (!user && isProduction) {
            return NextResponse.json({ error: 'Unauthorized: Please log in to access admin tools' }, { status: 401 });
        }
        
        // TODO: Check for admin role
        // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        // if (profile?.role !== 'admin') ...

        // 2. Parse Request
        const body = await req.json();
        const { topic, keywords, tone } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        // 3. Generate Content
        const articleData = await generateArticle({
            topic,
            keywords: keywords || [],
            tone
        });

        return NextResponse.json(articleData);

    } catch (error) {
        console.error('Generation API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate article', details: error instanceof Error ? error.message : 'Unknown error' }, 
            { status: 500 }
        );
    }
}
