/**
 * Simple CMS Core Test
 * Direct database test - no API calls
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCMSCore() {
    console.log('🚀 Testing CMS Core Functions\n');
    
    const testArticle = {
        title: 'Test Article: Best SIP Plans for 2026',
        slug: 'test-best-sip-plans-2026-' + Date.now(),
        body_html: '<h2>Introduction</h2><p>This is a test article about SIP plans.</p><h2>Best Plans</h2><p>Here are the top SIP plans for 2026...</p>',
        body_markdown: '## Introduction\n\nThis is a test article about SIP plans.\n\n## Best Plans\n\nHere are the top SIP plans for 2026...',
        excerpt: 'Discover the best SIP mutual fund plans for 2026 with expert analysis and recommendations.',
        featured_image: null,
        seo_title: 'Best SIP Plans for 2026 | Complete Guide',
        meta_description: 'Find the best SIP mutual fund plans for 2026. Expert recommendations and detailed analysis.',
        category: 'mutual-funds',
        tags: ['SIP', 'mutual funds', '2026', 'investment'],
        keywords: ['SIP plans', 'mutual funds', 'investment', '2026'],
        read_time: 5,
        word_count: 1500,
        status: 'draft'
    };
    
    try {
        // TEST 1: Save Article
        console.log('📝 TEST 1: Save Article to Database');
        const { data: article, error: saveError } = await supabase
            .from('articles')
            .insert(testArticle)
            .select()
            .single();
        
        if (saveError) throw new Error(`Save failed: ${saveError.message}`);
        
        console.log(`   ✅ Article saved`);
        console.log(`   🆔 ID: ${article.id}`);
        console.log(`   📍 Slug: ${article.slug}\n`);
        
        // TEST 2: Publish Article
        console.log('📢 TEST 2: Publish Article');
        const { error: publishError } = await supabase
            .from('articles')
            .update({
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', article.id);
        
        if (publishError) throw new Error(`Publish failed: ${publishError.message}`);
        
        console.log(`   ✅ Article published\n`);
        
        // TEST 3: Retrieve Article
        console.log('🔍 TEST 3: Retrieve Article');
        const { data: retrieved, error: retrieveError } = await supabase
            .from('articles')
            .select('*')
            .eq('id', article.id)
            .single();
        
        if (retrieveError) throw new Error(`Retrieve failed: ${retrieveError.message}`);
        
        console.log(`   ✅ Article retrieved`);
        console.log(`   📊 Status: ${retrieved.status}`);
        console.log(`   📅 Published: ${retrieved.published_at}\n`);
        
        // TEST 4: List Articles
        console.log('📋 TEST 4: List Recent Articles');
        const { data: articles, error: listError } = await supabase
            .from('articles')
            .select('id, title, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (listError) throw new Error(`List failed: ${listError.message}`);
        
        console.log(`   ✅ Found ${articles.length} recent articles`);
        articles.forEach((a, i) => {
            console.log(`   ${i + 1}. ${a.title} (${a.status})`);
        });
        
        // SUMMARY
        console.log('\n' + '='.repeat(60));
        console.log('🎉 ALL TESTS PASSED!');
        console.log('='.repeat(60));
        console.log(`\n✅ CMS Core Functions Working:`);
        console.log(`   ✅ Article creation`);
        console.log(`   ✅ Article publishing`);
        console.log(`   ✅ Article retrieval`);
        console.log(`   ✅ Article listing`);
        console.log(`\n🌐 View test article at:`);
        console.log(`   http://localhost:3000/articles/${article.slug}`);
        console.log(`\n📊 Database Status: OPERATIONAL`);
        
        return { success: true, articleId: article.id };
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Run test
testCMSCore()
    .then((result) => {
        if (result.success) {
            console.log('\n✅ CMS is operational!');
            process.exit(0);
        } else {
            console.log('\n❌ CMS has issues:', result.error);
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
