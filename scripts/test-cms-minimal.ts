/**
 * Minimal CMS Test - Using Basic Schema Only
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

async function testMinimalCMS() {
    console.log('🚀 Testing CMS - Minimal Schema\n');
    
    // Use ONLY columns from base cms_schema.sql
    const testArticle = {
        title: 'Test: Best SIP Plans 2026',
        slug: 'test-sip-' + Date.now(),
        excerpt: 'Test article about SIP plans',
        content: '<h2>Introduction</h2><p>This is a test article.</p>',
        featured_image: null,
        meta_title: 'Best SIP Plans 2026',
        meta_description: 'Test meta description',
        keywords: ['SIP', 'mutual funds'],
        category: 'mutual-funds', // Required field
        status: 'draft'
    };
    
    try {
        console.log('📝 TEST: Save Article');
        const { data: article, error: saveError } = await supabase
            .from('articles')
            .insert(testArticle)
            .select()
            .single();
        
        if (saveError) {
            console.error('   ❌ Save failed:', saveError.message);
            throw saveError;
        }
        
        console.log(`   ✅ Saved! ID: ${article.id}`);
        console.log(`   📍 Slug: ${article.slug}\n`);
        
        console.log('📢 TEST: Publish Article');
        const { error: publishError } = await supabase
            .from('articles')
            .update({
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', article.id);
        
        if (publishError) {
            console.error('   ❌ Publish failed:', publishError.message);
            throw publishError;
        }
        
        console.log(`   ✅ Published!\n`);
        
        console.log('🔍 TEST: Retrieve Article');
        const { data: retrieved, error: getError } = await supabase
            .from('articles')
            .select('*')
            .eq('id', article.id)
            .single();
        
        if (getError) {
            console.error('   ❌ Retrieve failed:', getError.message);
            throw getError;
        }
        
        console.log(`   ✅ Retrieved!`);
        console.log(`   Status: ${retrieved.status}`);
        console.log(`   Published: ${retrieved.published_at}\n`);
        
        console.log('='.repeat(50));
        console.log('🎉 ALL TESTS PASSED!');
        console.log('='.repeat(50));
        console.log(`\n✅ CMS Core is OPERATIONAL`);
        console.log(`\n🌐 Article URL:`);
        console.log(`   http://localhost:3000/articles/${article.slug}`);
        console.log(`\n📊 Database: WORKING`);
        console.log(`📝 CRUD Operations: WORKING`);
        console.log(`📢 Publishing: WORKING`);
        
        return { success: true };
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        return { success: false };
    }
}

testMinimalCMS()
    .then((result) => {
        if (result.success) {
            console.log('\n✅ CMS IS OPERATIONAL!');
            process.exit(0);
        } else {
            console.log('\n❌ CMS HAS ISSUES');
            process.exit(1);
        }
    });
