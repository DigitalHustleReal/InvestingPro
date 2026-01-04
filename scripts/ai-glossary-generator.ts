/**
 * Script to generate glossary terms using AI
 * Run: npx tsx scripts/ai-glossary-generator.ts
 */

import { aiContentGenerator } from '../lib/ai/content-generator';
import { GLOSSARY_TERMS } from '../lib/data/glossary-seed-terms';

async function main() {
    console.log('🚀 Starting AI Glossary Generation');
    console.log('=====================================\n');

    const stats = await aiContentGenerator.getGenerationStats();
    console.log('Current Stats:');
    console.log(`- Glossary Terms: ${stats.glossaryTerms}`);
    console.log(`- Blog Posts: ${stats.blogPosts}`);
    console.log(`- Pending Tasks: ${stats.pendingTasks}\n`);

    // Start with Credit Cards category
    console.log('📝 Generating Credit Cards Glossary (50 terms)...\n');
    
    await aiContentGenerator.batchGenerateGlossary(
        GLOSSARY_TERMS['credit-cards'],
        'credit-cards',
        3 // Process 3 terms at a time to avoid rate limits
    );

    console.log('\n✅ Credit Cards glossary generation complete!');
    console.log('\n📝 Generating Loans Glossary (50 terms)...\n');

    await aiContentGenerator.batchGenerateGlossary(
        GLOSSARY_TERMS['loans'],
        'loans',
        3
    );

    console.log('\n✅ Loans glossary generation complete!');

    // Final stats
    const finalStats = await aiContentGenerator.getGenerationStats();
    console.log('\n=====================================');
    console.log('🎉 Generation Complete!');
    console.log('Final Stats:');
    console.log(`- Glossary Terms: ${finalStats.glossaryTerms}`);
    console.log(`- Blog Posts: ${finalStats.blogPosts}`);
    console.log(`- Pending Tasks: ${finalStats.pendingTasks}`);
    console.log('\n💡 Next: Review generated terms in Supabase database');
    console.log('💡 Then: Run approval script to publish reviewed terms');
}

main().catch(console.error);
