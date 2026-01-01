/**
 * 🧪 SIMPLE KEYWORD DIFFICULTY TEST
 * Tests the scorer in heuristic-only mode (no API dependencies)
 */

import { scoreKeywordDifficulty, scoreKeywordBatch } from '../lib/seo/keyword-difficulty-scorer';

async function main() {
    console.log('🧪 Testing Keyword Difficulty Scorer (Heuristic Mode)\n');
    console.log('='.repeat(60));

    // Test 1: Easy long-tail keyword
    console.log('\n📊 Test 1: Easy Long-tail Keyword');
    console.log('-'.repeat(60));
    
    try {
        const result = await scoreKeywordDifficulty('how to calculate sip returns in india 2026', {
            useRealSERP: false, // Heuristic only
            targetAuthority: 15
        });

        console.log(`Keyword: ${result.keyword}`);
        console.log(`Difficulty: ${result.difficulty}/100 (${result.level})`);
        console.log(`Confidence: ${(result.confidence * 100).toFixed(0)}%`);
        console.log(`\n💡 Recommendation:\n   ${result.recommendation}`);
    } catch (error: any) {
        console.error('❌ Test 1 Failed:', error.message);
    }

    // Test 2: Competitive keyword
    console.log('\n\n📊 Test 2: Competitive Keyword');
    console.log('-'.repeat(60));
    
    try {
        const result = await scoreKeywordDifficulty('best credit cards in india', {
            useRealSERP: false,
            targetAuthority: 15
        });

        console.log(`Keyword: ${result.keyword}`);
        console.log(`Difficulty: ${result.difficulty}/100 (${result.level})`);
        console.log(`Confidence: ${(result.confidence * 100).toFixed(0)}%`);
        console.log(`\n💡 ${result.recommendation}`);
        console.log(`\nTop Competitors:`);
        result.competitors.forEach((c, i) => {
            const emoji = c.isAuthoritative ? '🔴' : '🟢';
            console.log(`  ${emoji} ${c.url} (DA: ${c.estimatedDA})`);
        });
    } catch (error: any) {
        console.error('❌ Test 2 Failed:', error.message);
    }

    // Test 3: Informational keyword
    console.log('\n\n📊 Test 3: Informational Keyword ("What is...")');
    console.log('-'.repeat(60));
    
    try {
        const result = await scoreKeywordDifficulty('what is mutual fund nav', {
            useRealSERP: false,
            targetAuthority: 15
        });

        console.log(`Keyword: ${result.keyword}`);
        console.log(`Difficulty: ${result.difficulty}/100 (${result.level})`);
        console.log(`💡 ${result.recommendation}`);
    } catch (error: any) {
        console.error('❌ Test 3 Failed:', error.message);
    }

    // Test 4: Batch scoring
    console.log('\n\n📊 Test 4: Batch Scoring (Content Planning)');
    console.log('-'.repeat(60));
    
    const keywords = [
        'sip calculator',
        'best mutual funds',
        'how to start investing',
        'tax saving under section 80c',
        'retirement planning india'
    ];

    try {
        console.log('Analyzing keywords for content strategy...\n');
        const results = await scoreKeywordBatch(keywords, { targetAuthority: 15 });

        console.log('Results sorted by difficulty:\n');
        const sorted = results.sort((a, b) => a.difficulty - b.difficulty);
        
        sorted.forEach((r, i) => {
            const emoji = r.level === 'easy' ? '🟢' : r.level === 'medium' ? '🟡' : '🔴';
            const match = r.difficulty - 15 <= 10 ? '✅ TARGET' : '⏸️ WAIT';
            console.log(`${emoji} [${r.difficulty.toString().padStart(2, '0')}] ${r.keyword.padEnd(35)} ${match}`);
        });

        console.log('\n📋 Recommended Strategy:');
        const easyWins = sorted.filter(r => r.level === 'easy' || r.level === 'medium');
        console.log(`   Focus on ${easyWins.length}/${sorted.length} keywords that match your authority level.`);
        
    } catch (error: any) {
        console.error('❌ Test 4 Failed:', error.message);
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60));
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Apply database schema: supabase/migrations/20260102_keyword_difficulty_schema.sql');
    console.log('   2. Test article generation: npx tsx scripts/generate-article.ts');
    console.log('   3. Preview platform: npm run dev');
}

main().catch(console.error);
