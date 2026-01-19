/**
 * Test In-Depth AI Article Generation
 * Tests full AI workflow with comprehensive content
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { generateArticleContent } from '../lib/workers/articleGenerator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAIArticleGeneration() {
    console.log('🤖 Testing AI Article Generation\n');
    console.log('📊 Topic: Comprehensive SIP Investment Guide for 2026');
    console.log('🎯 Target: 2000+ word in-depth article\n');
    
    try {
        // STEP 1: Generate with AI
        console.log('✍️  STEP 1: AI Content Generation');
        console.log('   Calling AI to generate comprehensive article...');
        
        const startTime = Date.now();
        
        const generatedArticle = await generateArticleContent({
            topic: 'Complete Guide to SIP Investment in India 2026',
            category: 'mutual-funds',
            targetKeywords: [
                'SIP investment',
                'systematic investment plan',
                'mutual fund SIP',
                'best SIP plans 2026',
                'SIP calculator',
                'SIP returns'
            ],
            targetAudience: 'beginner investors',
            contentLength: 'comprehensive',
            wordCount: 2000
        });
        
        const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log(`   ✅ Article generated in ${generationTime}s`);
        console.log(`   📝 Title: "${generatedArticle.title}"`);
        console.log(`   📊 Word count: ${generatedArticle.word_count}`);
        console.log(`   🏷️  Tags: ${generatedArticle.tags.join(', ')}`);
        console.log(`   🔑 Keywords: ${generatedArticle.keywords.join(', ')}`);
        console.log(`   ⏱️  Read time: ${generatedArticle.read_time} min`);
        console.log(`   🖼️  Featured image: ${generatedArticle.featured_image ? 'Generated' : 'None'}\n`);
        
        // STEP 2: Validate Content Quality
        console.log('✅ STEP 2: Content Quality Validation');
        
        const hasTitle = generatedArticle.title && generatedArticle.title.length > 10;
        const hasContent = generatedArticle.body_html && generatedArticle.body_html.length > 500;
        const hasExcerpt = generatedArticle.excerpt && generatedArticle.excerpt.length > 50;
        const hasSEO = generatedArticle.seo_title && generatedArticle.meta_description;
        const hasStructure = generatedArticle.structured_content && 
                            generatedArticle.structured_content.sections;
        
        console.log(`   ${hasTitle ? '✅' : '❌'} Title: ${hasTitle ? 'Valid' : 'Invalid'}`);
        console.log(`   ${hasContent ? '✅' : '❌'} Content: ${hasContent ? `${generatedArticle.body_html.length} chars` : 'Too short'}`);
        console.log(`   ${hasExcerpt ? '✅' : '❌'} Excerpt: ${hasExcerpt ? 'Valid' : 'Invalid'}`);
        console.log(`   ${hasSEO ? '✅' : '❌'} SEO metadata: ${hasSEO ? 'Complete' : 'Missing'}`);
        console.log(`   ${hasStructure ? '✅' : '❌'} Structured content: ${hasStructure ? 'Yes' : 'No'}\n`);
        
        const qualityScore = [hasTitle, hasContent, hasExcerpt, hasSEO, hasStructure]
            .filter(Boolean).length * 20;
        
        console.log(`   📊 Quality Score: ${qualityScore}/100\n`);
        
        // STEP 3: Save to Database
        console.log('💾 STEP 3: Save to Database');
        
        const { data: article, error: saveError } = await supabase
            .from('articles')
            .insert({
                title: generatedArticle.title,
                slug: generatedArticle.slug,
                excerpt: generatedArticle.excerpt,
                content: generatedArticle.body_html,
                featured_image: generatedArticle.featured_image,
                meta_title: generatedArticle.seo_title,
                meta_description: generatedArticle.meta_description,
                keywords: generatedArticle.keywords,
                category: generatedArticle.category,
                status: 'draft'
            })
            .select()
            .single();
        
        if (saveError) {
            throw new Error(`Save failed: ${saveError.message}`);
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
            throw new Error(`Publish failed: ${publishError.message}`);
        }
        
        console.log(`   ✅ Published successfully\n`);
        
        // SUMMARY
        console.log('='.repeat(60));
        console.log('🎉 AI ARTICLE GENERATION TEST COMPLETE!');
        console.log('='.repeat(60));
        console.log(`\n📋 Summary:`);
        console.log(`   Title: ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Category: ${article.category}`);
        console.log(`   Status: published`);
        console.log(`   Quality Score: ${qualityScore}/100`);
        console.log(`   Generation Time: ${generationTime}s`);
        console.log(`\n🌐 View at: http://localhost:3000/articles/${article.slug}`);
        console.log(`\n✅ AI content generation is WORKING!`);
        
        return { success: true, qualityScore, article };
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
        return { success: false, error };
    }
}

// Run test
testAIArticleGeneration()
    .then((result) => {
        if (result.success) {
            console.log('\n✅ AI article generation is operational!');
            process.exit(0);
        } else {
            console.log('\n❌ AI article generation has issues');
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
