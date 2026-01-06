/**
 * Article Content Normalization Script
 * 
 * Converts ALL existing articles to clean, structured HTML format.
 * 
 * Usage:
 *   npx tsx scripts/normalize-articles.ts
 * 
 * This script:
 * 1. Fetches all articles from database
 * 2. Normalizes their content to clean HTML
 * 3. Updates body_html and body_markdown fields
 * 4. Preserves all other fields (title, slug, metadata, etc.)
 */

import { createClient } from '@supabase/supabase-js';
import { normalizeArticleBody } from '../lib/content/normalize';
import { htmlToMarkdown } from '../lib/editor/markdown';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function normalizeAllArticles() {
    console.log('🚀 Starting article normalization...\n');

    try {
        // Fetch all articles
        const { data: articles, error: fetchError } = await supabase
            .from('articles')
            .select('id, title, body_html, body_markdown, content')
            .order('created_at', { ascending: false });

        if (fetchError) {
            console.error('❌ Error fetching articles:', fetchError);
            return;
        }

        if (!articles || articles.length === 0) {
            console.log('ℹ️  No articles found to normalize');
            return;
        }

        console.log(`📊 Found ${articles.length} articles to normalize\n`);

        let normalized = 0;
        let skipped = 0;
        let errors = 0;

        for (const article of articles) {
            try {
                // Get raw content from any source
                const rawContent = article.body_html || article.body_markdown || article.content || '';

                if (!rawContent || rawContent.trim().length < 10) {
                    console.log(`⏭️  Skipping "${article.title}" - no content`);
                    skipped++;
                    continue;
                }

                // Normalize to clean HTML
                const normalizedHTML = normalizeArticleBody(rawContent);

                if (!normalizedHTML || normalizedHTML.trim().length < 10) {
                    console.log(`⚠️  Skipping "${article.title}" - normalization produced empty result`);
                    skipped++;
                    continue;
                }

                // Generate markdown from normalized HTML
                const normalizedMarkdown = htmlToMarkdown(normalizedHTML);

                // Update article
                const { error: updateError } = await supabase
                    .from('articles')
                    .update({
                        body_html: normalizedHTML,
                        body_markdown: normalizedMarkdown,
                        content: normalizedMarkdown, // Legacy fallback
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', article.id);

                if (updateError) {
                    console.error(`❌ Error updating "${article.title}":`, updateError.message);
                    errors++;
                } else {
                    console.log(`✅ Normalized "${article.title}"`);
                    normalized++;
                }
            } catch (error: any) {
                console.error(`❌ Error processing "${article.title}":`, error.message);
                errors++;
            }
        }

        console.log('\n📊 Normalization Summary:');
        console.log(`   ✅ Normalized: ${normalized}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log(`   📝 Total: ${articles.length}`);

    } catch (error: any) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run normalization
normalizeAllArticles()
    .then(() => {
        console.log('\n✅ Normalization complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Normalization failed:', error);
        process.exit(1);
    });



