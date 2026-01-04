/**
 * Scheduled Publishing Cron Job
 * Auto-publishes articles at their scheduled time
 * Run this via cron: 0 * * * * (every hour) or */5 * * * * (every 5 min)
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        console.log('⏰ Running scheduled publishing check...');

        const now = new Date().toISOString();

        // Find articles scheduled to be published
        const { data: scheduledArticles, error } = await supabase
            .from('articles')
            .select('id, title, scheduled_publish_at')
            .eq('status', 'scheduled')
            .lte('scheduled_publish_at', now)
            .order('scheduled_publish_at', { ascending: true });

        if (error) {
            console.error('Error fetching scheduled articles:', error);
            return Response.json({ error: error.message }, { status: 500 });
        }

        if (!scheduledArticles || scheduledArticles.length === 0) {
            console.log('✅ No articles to publish');
            return Response.json({ 
                message: 'No scheduled articles', 
                count: 0 
            });
        }

        console.log(`📝 Found ${scheduledArticles.length} article(s) to publish`);

        // Publish each article
        const published = [];
        const failed = [];

        for (const article of scheduledArticles) {
            try {
                const { error: updateError } = await supabase
                    .from('articles')
                    .update({
                        status: 'published',
                        published_at: now,
                        scheduled_publish_at: null
                    })
                    .eq('id', article.id);

                if (updateError) {
                    failed.push({ id: article.id, error: updateError.message });
                    console.error(`❌ Failed to publish: ${article.title}`, updateError);
                } else {
                    published.push(article);
                    console.log(`✅ Published: ${article.title}`);
                }
            } catch (err: any) {
                failed.push({ id: article.id, error: err.message });
                console.error(`❌ Error publishing: ${article.title}`, err);
            }
        }

        return Response.json({
            message: `Published ${published.length} article(s)`,
            published: published.length,
            failed: failed.length,
            details: {
                published: published.map(a => ({ id: a.id, title: a.title })),
                failed
            }
        });

    } catch (error: any) {
        console.error('Scheduled publishing cron error:', error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
}
