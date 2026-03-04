import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { translateArticle } from '@/lib/automation/translator';
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { articleId, targetLang, title, content } = body;

        if (!articleId || !targetLang || !title || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Perform Translation
        const result = await translateArticle(title, content, targetLang);

        // 2. Create New Article Entry
        // Generate new slug
        const originalSlug = slugify(title, { lower: true, strict: true });
        const newSlug = `${originalSlug}-${targetLang}`;

        const { data: newArticle, error } = await supabase
            .from('articles')
            .insert({
                title: result.translated_title,
                slug: newSlug,
                content: result.translated_content,
                body_html: result.translated_content,
                body_markdown: result.translated_content, // For editing
                excerpt: result.translated_excerpt,
                
                language: targetLang,
                status: 'draft', // Human Review required
                category: 'investing-basics', // Default, ideally copy from original
                
                ai_generated: true,
                author_name: 'AI Translator',
                
                // Link to original (using editorial_notes as metadata store for now)
                editorial_notes: {
                    translation_of: articleId,
                    translation_lang: targetLang
                }
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ 
            success: true, 
            original_id: articleId,
            translated_id: newArticle.id,
            translated_title: result.translated_title
        });

    } catch (error: any) {
        logger.error('Translation API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
