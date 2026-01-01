/**
 * 🧪 TEST HEADLINE ANALYZER
 * 
 * Tests the headline optimization system.
 * 
 * Usage:
 *   npx tsx scripts/test-headline-analyzer.ts
 */

import { 
    analyzeHeadline, 
    generateBetterHeadlines,
    optimizeHeadline 
} from '../lib/seo/headline-analyzer';

async function main() {
    console.log('🧪 Testing Headline Analyzer\n');
    console.log('='.repeat(70));

    // Test headlines (from poor to excellent)
    const testHeadlines = [
        'SIP Calculator',
        'How to invest in mutual funds',
        'Best Mutual Funds in India',
        'Complete Guide to SIP Investment in India 2026',
        'How to Calculate SIP Returns - Ultimate Guide for Beginners 2026'
    ];

    // Test 1: Analyze all headlines
    console.log('\n📊 Test 1: Headline Analysis\n');
    
    for (const headline of testHeadlines) {
        const analysis = analyzeHeadline(headline);
        
        console.log(`Headline: "${headline}"`);
        console.log(`Score: ${analysis.score}/100 (${analysis.grade.toUpperCase()})`);
        console.log(`Length: ${analysis.length.characters} chars, ${analysis.length.words} words`);
        console.log(`EMV: ${analysis.emv.score}% (${analysis.emv.level})`);
        console.log(`Sentiment: ${analysis.sentiment}`);
        
        if (analysis.strengths.length > 0) {
            console.log(`\n✅ Strengths:`);
            analysis.strengths.forEach(s => console.log(`   - ${s}`));
        }
        
        if (analysis.weaknesses.length > 0) {
            console.log(`\n⚠️ Weaknesses:`);
            analysis.weaknesses.forEach(w => console.log(`   - ${w}`));
        }
        
        if (analysis.suggestions.length > 0) {
            console.log(`\n💡 Suggestions:`);
            analysis.suggestions.forEach(s => console.log(`   - ${s}`));
        }
        
        console.log('\n' + '-'.repeat(70) + '\n');
    }

    // Test 2: Generate better alternatives
    console.log('\n🎯 Test 2: AI-Powered Headline Generation\n');
    
    const poorHeadline = testHeadlines[0]; // 'SIP Calculator'
    console.log(`Original: "${poorHeadline}"`);
    console.log(`Generating better alternatives...\n`);
    
    try {
        const alternatives = await generateBetterHeadlines(poorHeadline, 75);
        
        console.log(`Original Score: ${alternatives.originalScore}/100\n`);
        
        if (alternatives.alternatives.length > 0) {
            console.log(`✅ Generated ${alternatives.alternatives.length} better headlines:\n`);
            
            alternatives.alternatives.forEach((alt, i) => {
                console.log(`${i + 1}. "${alt.headline}"`);
                console.log(`   Score: ${alt.score}/100`);
                console.log(`   Reason: ${alt.reason}\n`);
            });
        } else {
            console.log('⚠️ Original headline already excellent (no alternatives needed)');
        }
        
    } catch (error: any) {
        console.error('❌ Generation failed:', error.message);
    }

    // Test 3: Auto-optimize
    console.log('\n🚀 Test 3: Auto-Optimization\n');
    
    const mediumHeadline = 'Best Mutual Funds in India';
    console.log(`Testing: "${mediumHeadline}"\n`);
    
    try {
        const result = await optimizeHeadline(mediumHeadline, 75);
        
        console.log(`Original: "${result.alternatives.original}"`);
        console.log(`Original Score: ${result.alternatives.originalScore}/100\n`);
        
        console.log(`Optimized: "${result.optimized}"`);
        console.log(`New Score: ${result.score}/100`);
        console.log(`Improved: ${result.improved ? '✅ YES' : '❌ NO'}`);
        
        if (result.improved) {
            const improvement = result.score - result.alternatives.originalScore;
            console.log(`Improvement: +${improvement} points`);
        }
        
    } catch (error: any) {
        console.error('❌ Optimization failed:', error.message);
    }

    // Test 4: Word Balance Analysis
    console.log('\n\n📈 Test 4: Word Balance Comparison\n');
    
    const comparison = [
        { label: 'Poor', headline: 'SIP' },
        { label: 'Fair', headline: 'How to invest in SIP' },
        { label: 'Good', headline: 'Best SIP Plans for Beginners India' },
        { label: 'Great', headline: 'Complete SIP Investment Guide for Beginners 2026' },
        { label: 'Excellent', headline: 'Ultimate SIP Calculator - Complete Guide to Calculate Returns 2026' }
    ];
    
    console.log('Headline                      | Score | Common | Uncommon | Emotional | Power');
    console.log('-'.repeat(90));
    
    comparison.forEach(({ label, headline }) => {
        const analysis = analyzeHeadline(headline);
        console.log(
            `${label.padEnd(30)} | ${String(analysis.score).padStart(3)}   | ` +
            `${String(analysis.wordBalance.common).padStart(3)}%   | ` +
            `${String(analysis.wordBalance.uncommon).padStart(3)}%    | ` +
            `${String(analysis.wordBalance.emotional).padStart(3)}%     | ` +
            `${String(analysis.wordBalance.power).padStart(3)}%`
        );
    });

    console.log('\n' + '='.repeat(70));
    console.log('✅ All tests complete!');
    console.log('='.repeat(70));
    
    console.log('\n💡 Key Takeaways:');
    console.log('   1. Aim for 75+ score for good CTR');
    console.log('   2. Use power words: ultimate, complete, proven');
    console.log('   3. Add emotional triggers: best, top, save, easy');
    console.log('   4. Include year (2026) for freshness');
    console.log('   5. Keep 40-65 characters for Google SERPs');
    console.log('   6. Target 30-50% EMV for high engagement');
}

main().catch(console.error);
