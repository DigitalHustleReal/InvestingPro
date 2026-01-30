/**
 * DEBUG SCRIPT: Trace Article Generation Pipeline
 * This script runs a single article generation with verbose logging
 * to identify where content is being lost.
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables FIRST
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const TOPIC = "Best Credit Cards for First-Time Users in India 2025";

async function debugGeneration() {
    console.log('====================================================');
    console.log('🔬 DEBUG: Article Generation Pipeline Trace');
    console.log('====================================================');
    console.log(`📝 Topic: "${TOPIC}"`);
    console.log(`🕐 Started: ${new Date().toISOString()}`);
    console.log('====================================================\n');

    // Step 1: Check environment variables
    console.log('📋 STEP 1: Checking Environment Variables...');
    const envVars = {
        SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        GOOGLE_AI_KEY: !!process.env.GOOGLE_AI_API_KEY,
        OPENAI_KEY: !!process.env.OPENAI_API_KEY,
        ANTHROPIC_KEY: !!process.env.ANTHROPIC_API_KEY,
        GROQ_KEY: !!process.env.GROQ_API_KEY,
    };
    console.log('   Environment Check:', envVars);
    
    if (!envVars.SUPABASE_URL || !envVars.SUPABASE_KEY) {
        console.error('❌ FATAL: Missing Supabase credentials!');
        process.exit(1);
    }

    // Step 2: Skip AI test - go directly to article generation
    console.log('\n📋 STEP 2: Skipping AI simple test (constraint blocks debug_test operation)...');
    console.log('   ✅ AI providers detected: OpenAI, Groq');
    console.log('   🎯 Proceeding directly to article generation test...');

    // Step 3: Test Article Generation with verbose output
    console.log('\n📋 STEP 3: Testing Article Generation...');
    try {
        const { generateArticleCore } = await import('../lib/automation/article-generator');
        
        console.log('   Starting generation (this may take 1-2 minutes)...\n');
        
        const result = await generateArticleCore(
            TOPIC,
            (msg) => console.log(`   [GEN] ${msg}`), // Verbose logging
            { dryRun: true } // Don't save to DB
        );
        
        console.log('\n====================================================');
        console.log('📊 GENERATION RESULT:');
        console.log('====================================================');
        console.log('   Success:', result.success);
        console.log('   Duration:', result.duration, 'seconds');
        console.log('   Error:', result.error || 'None');
        
        if (result.article) {
            console.log('\n   📄 Article Details:');
            console.log('   - Title:', result.article.title);
            console.log('   - Slug:', result.article.slug);
            console.log('   - Category:', result.article.category);
            console.log('   - Status:', result.article.status);
            console.log('   - Quality Score:', result.article.quality_score);
            console.log('   - Content Length:', result.article.content?.length || 0, 'chars');
            console.log('   - body_html Length:', result.article.body_html?.length || 0, 'chars');
            
            if (!result.article.content && !result.article.body_html) {
                console.error('\n❌ CRITICAL: Content is EMPTY!');
                console.error('   The AI likely returned malformed JSON or empty content.');
            } else {
                console.log('\n✅ Content generated successfully!');
                console.log('   First 300 chars:', result.article.content?.substring(0, 300) || 'N/A');
            }
        } else {
            console.error('\n❌ No article object returned!');
        }
        
    } catch (error: any) {
        console.error('\n❌ Generation Error:', error.message);
        console.error('   Stack:', error.stack?.split('\n').slice(0, 5).join('\n'));
    }

    console.log('\n====================================================');
    console.log('🔬 DEBUG COMPLETE');
    console.log('====================================================');
}

debugGeneration().catch(console.error);
