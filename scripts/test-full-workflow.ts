/**
 * Full CMS Workflow Test
 * Tests: Trend → Research → Generate → Publish → Track
 */

// Load environment variables
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFullWorkflow() {
    console.log('🚀 Starting Full CMS Workflow Test\n');
    
    // STEP 1: Trend Research (Simulated)
    console.log('📊 STEP 1: Trend Research');
    const trendingTopic = 'Best SIP Plans for 2026';
    const category = 'mutual-funds';
    const keywords = ['SIP', 'mutual funds', '2026', 'investment'];
    console.log(`   Topic: ${trendingTopic}`);
    console.log(`   Category: ${category}`);
    console.log(`   Keywords: ${keywords.join(', ')}\n`);
    
    // STEP 2: Content Generation (Using API)
    console.log('✍️  STEP 2: Content Generation');
    console.log('   Calling article generation API...');
    
    try {
        // Call the API endpoint instead of direct function
        const response = await fetch(`http://localhost:3000/api/cms/articles/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: trendingTopic,
                category,
                targetKeywords: keywords,
                targetAudience: 'beginner investors',
                contentLength: 'comprehensive',
                wordCount: 2000
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API call failed: ${error}`);
        }
        
        const generatedArticle = await response.json();
        
        console.log(`   ✅ Generated: "${generatedArticle.title}"`);
        console.log(`   📝 Word count: ${generatedArticle.word_count || 'N/A'}`);
        console.log(`   🏷️  Tags: ${generatedArticle.tags?.join(', ') || 'None'}`);
        console.log(`   🖼️  Featured image: ${generatedArticle.featured_image ? 'Yes' : 'No'}\n`);
        
        // STEP 3: Save to Database
        console.log('💾 STEP 3: Save to Database');
        
        const { data: article, error: insertError } = await supabase
            .from('articles')
            .insert({
                title: generatedArticle.title,
                slug: generatedArticle.slug,
                body_html: generatedArticle.body_html || generatedArticle.content,
                body_markdown: generatedArticle.body_markdown || '',
                excerpt: generatedArticle.excerpt || '',
                featured_image: generatedArticle.featured_image,
                seo_title: generatedArticle.seo_title || generatedArticle.title,
                meta_description: generatedArticle.meta_description || generatedArticle.excerpt,
                category: generatedArticle.category || category,
                tags: generatedArticle.tags || [],
                keywords: generatedArticle.keywords || keywords,
                read_time: generatedArticle.read_time || 5,
                word_count: generatedArticle.word_count || 2000,
                status: 'draft',
                ai_metadata: generatedArticle.ai_metadata || {},
                structured_content: generatedArticle.structured_content || {},
            })
            .select()
            .single();
        
        if (insertError) {
            throw new Error(`Failed to save article: ${insertError.message}`);
        }
        
        console.log(`   ✅ Saved to database`);
        console.log(`   🆔 Article ID: ${article.id}`);
        console.log(`   📍 Slug: ${article.slug}\n`);
        
        // STEP 4: Publish
        console.log('📢 STEP 4: Publish Article');
        
        const { error: publishError } = await supabase
            .from('articles')
            .update({
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', article.id);
        
        if (publishError) {
            throw new Error(`Failed to publish: ${publishError.message}`);
        }
        
        console.log(`   ✅ Published successfully`);
        console.log(`   🌐 URL: /articles/${article.slug}\n`);
        
        // STEP 5: Initialize Tracking
        console.log('📈 STEP 5: Initialize Tracking');
        
        // Check if analytics table exists
        const { data: tables } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_name', 'article_analytics')
            .single();
        
        if (tables) {
            const { error: trackingError } = await supabase
                .from('article_analytics')
                .insert({
                    article_id: article.id,
                    views: 0,
                    unique_visitors: 0,
                    avg_time_on_page: 0,
                    bounce_rate: 0,
                    shares: 0,
                    bookmarks: 0
                });
            
            if (trackingError) {
                console.log(`   ⚠️  Tracking initialization failed: ${trackingError.message}`);
            } else {
                console.log(`   ✅ Tracking initialized`);
            }
        } else {
            console.log(`   ⚠️  Analytics table doesn't exist (optional)`);
        }
        
        // STEP 6: Verification
        console.log('\n✅ STEP 6: Verification');
        
        const { data: verifyArticle, error: verifyError } = await supabase
            .from('articles')
            .select('*')
            .eq('id', article.id)
            .single();
        
        if (verifyError) {
            throw new Error(`Verification failed: ${verifyError.message}`);
        }
        
        console.log(`   ✅ Article verified in database`);
        console.log(`   📊 Status: ${verifyArticle.status}`);
        console.log(`   📅 Published: ${verifyArticle.published_at}`);
        
        // SUMMARY
        console.log('\n' + '='.repeat(60));
        console.log('🎉 FULL WORKFLOW TEST COMPLETE!');
        console.log('='.repeat(60));
        console.log(`\n📋 Summary:`);
        console.log(`   Title: ${verifyArticle.title}`);
        console.log(`   Slug: ${verifyArticle.slug}`);
        console.log(`   Category: ${verifyArticle.category}`);
        console.log(`   Word Count: ${verifyArticle.word_count}`);
        console.log(`   Status: ${verifyArticle.status}`);
        console.log(`   Article ID: ${verifyArticle.id}`);
        console.log(`\n🌐 View at: http://localhost:3000/articles/${verifyArticle.slug}`);
        console.log(`\n✅ All systems operational!`);
        
        return {
            success: true,
            article: verifyArticle
        };
        
    } catch (error) {
        console.error('\n❌ Workflow failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Run the test
testFullWorkflow()
    .then((result) => {
        if (result.success) {
            console.log('\n✅ Test passed!');
            process.exit(0);
        } else {
            console.log('\n❌ Test failed:', result.error);
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
