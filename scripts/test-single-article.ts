/**
 * Generate ONE test article to verify the system is working
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function generateTestArticle() {
    console.log('====================================================');
    console.log('🧪 TEST: Generating ONE article to verify system');
    console.log('====================================================\n');

    // Check AI providers
    console.log('📋 Checking AI Providers:');
    console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - GOOGLE_GEMINI_API_KEY: ${process.env.GOOGLE_GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - GEMINI_MODEL: ${process.env.GEMINI_MODEL || 'Not set (will use default)'}`);
    console.log(`   - GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - MISTRAL_API_KEY: ${process.env.MISTRAL_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log('');

    // Import the article generator
    const { generateArticleCore } = await import('../lib/automation/article-generator');

    const testTopic = 'Best Credit Cards for Online Shopping in India 2026';
    
    console.log(`🎯 Test Topic: "${testTopic}"`);
    console.log('');
    console.log('⏳ Starting generation (this may take 1-2 minutes)...\n');

    // Custom logger
    const logFn = (msg: string) => console.log(msg);

    try {
        // Correct signature: generateArticleCore(topic, logFn, options)
        const result = await generateArticleCore(
            testTopic, 
            logFn,
            { dryRun: false }
        );

        if (result.success && result.article) {
            console.log('\n====================================================');
            console.log('✅ TEST SUCCESSFUL!');
            console.log('====================================================');
            console.log(`   📝 Title: ${result.article.title}`);
            console.log(`   🔗 Slug: ${result.article.slug}`);
            console.log(`   📊 Status: ${result.article.status}`);
            console.log(`   ⭐ Quality Score: ${result.article.quality_score}`);
            console.log(`   📏 Content Length: ${result.article.content?.length || 0} chars`);
            
            if (result.article.status === 'published') {
                console.log(`\n🌐 View at: http://localhost:3000/articles/${result.article.slug}`);
            } else {
                console.log(`\n⚠️ Article saved as DRAFT (check quality issues)`);
            }
        } else {
            console.log('\n====================================================');
            console.log('❌ TEST FAILED!');
            console.log('====================================================');
            console.log(`   Error: ${result.error}`);
        }

    } catch (error: any) {
        console.log('\n====================================================');
        console.log('❌ TEST FAILED!');
        console.log('====================================================');
        console.log(`   Error: ${error.message}`);
        console.log('');
        console.log('🔍 Troubleshooting:');
        console.log('   1. Check OpenAI billing: https://platform.openai.com/account/billing');
        console.log('   2. Verify API keys in .env.local');
        console.log('   3. Check network connectivity');
    }
}

generateTestArticle();
