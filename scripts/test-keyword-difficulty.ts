/**
 * 🧪 KEYWORD DIFFICULTY SCORER - TEST SCRIPT
 * 
 * Run this to test the keyword difficulty scorer without breaking anything
 * 
 * Usage:
 *   npx tsx scripts/test-keyword-difficulty.ts
 */

import { scoreKeywordDifficulty, scoreKeywordBatch } from '@/lib/seo/keyword-difficulty-scorer';

async function main() {
    console.log('🧪 Testing Keyword Difficulty Scorer\n');
    console.log('='.repeat(60));

    // Test 1: Single keyword with real SERP (if available)
    console.log('\n📊 Test 1: Score a single keyword');
    console.log('-'.repeat(60));
    
    try {
        const result = await scoreKeywordDifficulty('best mutual funds in India', {
            useRealSERP: true,
            targetAuthority: 15
        });

        console.log(`Keyword: ${result.keyword}`);
        console.log(`Difficulty: ${result.difficulty}/100 (${result.level})`);
        console.log(`Confidence: ${(result.confidence * 100).toFixed(0)}%`);
        console.log(`\nTop Competitors:`);
        result.competitors.forEach((c, i) => {
            console.log(`  ${i + 1}. ${c.url} (DA: ${c.estimatedDA})`);
        });
        console.log(`\n💡 Recommendation:\n   ${result.recommendation}`);
    } catch (error) {
        console.error('❌ Test 1 Failed:', error);
    }

    // Test 2: Heuristic-only mode (fallback)
    console.log('\n\n📊 Test 2: Heuristic mode (no SERP API)');
    console.log('-'.repeat(60));
    
    try {
        const result = await scoreKeywordDifficulty('what is SIP', {
            useRealSERP: false,
            targetAuthority: 15
        });

        console.log(`Keyword: ${result.keyword}`);
        console.log(`Difficulty: ${result.difficulty}/100 (${result.level})`);
        console.log(`Confidence: ${(result.confidence * 100).toFixed(0)}% (heuristic)`);
        console.log(`\n💡 ${result.recommendation}`);
    } catch (error) {
        console.error('❌ Test 2 Failed:', error);
    }

    // Test 3: Batch scoring
    console.log('\n\n📊 Test 3: Batch scoring multiple keywords');
    console.log('-'.repeat(60));
    
    const keywords = [
        'mutual fund calculator',
        'how to invest in stocks',
        'best credit cards',
        'tax saving investments 2026'
    ];

    try {
        console.log('Scoring keywords (this may take a few seconds)...\n');
        const results = await scoreKeywordBatch(keywords, { targetAuthority: 15 });

        console.log('Results:');
        results.forEach((r, i) => {
            const emoji = r.level === 'easy' ? '🟢' : r.level === 'medium' ? '🟡' : '🔴';
            console.log(`${emoji} ${r.keyword}: ${r.difficulty}/100 (${r.level})`);
        });
    } catch (error) {
        console.error('❌ Test 3 Failed:', error);
    }

    // Test 4: Edge cases
    console.log('\n\n📊 Test 4: Edge cases');
    console.log('-'.repeat(60));
    
    const edgeCases = [
        'investing', // Short, competitive
        'how to calculate compound interest on mutual fund returns for tax purposes', // Very long tail
    ];

    for (const kw of edgeCases) {
        try {
            const result = await scoreKeywordDifficulty(kw, { useRealSERP: false });
            console.log(`\n"${kw}"`);
            console.log(`  Difficulty: ${result.difficulty}/100 (${result.level})`);
        } catch (error) {
            console.error(`  ❌ Failed for "${kw}"`);
        }
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60));
}

main().catch(console.error);
