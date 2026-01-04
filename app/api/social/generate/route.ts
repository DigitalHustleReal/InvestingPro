/**
 * Social Media Post Generator API
 * Generates optimized social media content for an article
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
    try {
        const { articleId } = await request.json();

        if (!articleId) {
            return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
        }

        // 1. Fetch Article Data
        const { data: article, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('id', articleId)
            .single();

        if (articleError) throw articleError;

        console.log(`📱 Generating social posts for: "${article.title}"`);

        // 2. Generate Content with GPT-4
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `You are a social media expert. Generate 3 engaging social media posts for the following article.
                    
                    Article Title: "${article.title}"
                    Excerpt: "${article.excerpt}"
                    Category: "${article.category}"
                    URL: https://investingpro.in/articles/${article.slug}
                    
                    Requirements:
                    1. Twitter: Short, punchy, under 280 chars, 2-3 relevant hashtags. Thread hook style.
                    2. LinkedIn: Professional, value-driven, 3-4 paragraphs, bullet points, engaging question.
                    3. Facebook: Casual but informative, encourages sharing/tagging.
                    
                    Return valid JSON:
                    {
                        "twitter": "content...",
                        "linkedin": "content...",
                        "facebook": "content..."
                    }`
                }
            ],
            temperature: 0.7
        });

        const rawContent = completion.choices[0].message.content;
        const socialContent = JSON.parse(rawContent || '{}');

        // 3. Save to Database
        const posts = [
            { platform: 'twitter', content: socialContent.twitter },
            { platform: 'linkedin', content: socialContent.linkedin },
            { platform: 'facebook', content: socialContent.facebook }
        ];

        const savedPosts = [];

        for (const post of posts) {
            if (!post.content) continue;

            const { data, error } = await supabase
                .from('social_posts')
                .insert({
                    article_id: articleId,
                    platform: post.platform,
                    content: post.content,
                    status: 'draft',
                    media_url: article.featured_image
                })
                .select()
                .single();

            if (!error && data) savedPosts.push(data);
        }

        return NextResponse.json({
            success: true,
            posts: savedPosts
        });

    } catch (error: any) {
        console.error('Social generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
