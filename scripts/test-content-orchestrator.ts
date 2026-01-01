/**
 * 🧪 TEST CONTENT ORCHESTRATOR
 * 
 * Tests the intelligent content planning system.
 * Safe to run - generates plan but doesn't execute articles.
 * 
 * Usage:
 *   npx tsx scripts/test-content-orchestrator.ts
 */

import { 
    generateWeeklyPlan,
    getPerformanceFeedback
} from '../lib/automation/content-orchestrator';

async function main() {
    console.log('🧪 Testing Content Orchestrator\n');
    console.log('='.repeat(70));

    // Test 1: Generate weekly plan
    console.log('\n📅 Test 1: Generate Weekly Content Plan');
    console.log('-'.repeat(70));
    
    try {
        console.log('Analyzing authority and generating optimal plan...\n');
        
        const plan = await generateWeeklyPlan({
            includeTrending: true
        });

        console.log(`✅ Plan Generated for Week ${plan.weekNumber}\n`);
        console.log(`📊 Overview:`);
        console.log(`   Period: ${plan.startDate} to ${plan.endDate}`);
        console.log(`   Your DA: ${plan.currentAuthority}/100`);
        console.log(`   Recommended: ${plan.recommendedArticles} articles`);
        console.log(`   Scheduled: ${plan.scheduledArticles.length} articles\n`);

        console.log(`📈 Distribution:`);
        console.log(`   🟢 Easy: ${plan.statistics.easy} articles`);
        console.log(`   🟡 Medium: ${plan.statistics.medium} articles`);
        console.log(`   🔴 Hard: ${plan.statistics.hard} articles\n`);

        console.log(`📋 Schedule:`);
        console.log('-'.repeat(70));
        
        plan.scheduledArticles.forEach((article, i) => {
            const emoji = article.priority === 'high' ? '🎯' : article.priority === 'medium' ? '⚡' : '📝';
            const trendEmoji = article.trending ? ' 🔥' : '';
            const difficultyEmoji = 
                article.difficultyLevel === 'easy' ? '🟢' : 
                article.difficultyLevel === 'medium' ? '🟡' : '🔴';
            
            console.log(`\n${emoji} Article ${i + 1}. ${article.topic}${trendEmoji}`);
            console.log(`   Date: ${article.scheduledDate}`);
            console.log(`   ${difficultyEmoji} Difficulty: ${article.difficulty}/100 (${article.difficultyLevel})`);
            console.log(`   Priority: ${article.priority.toUpperCase()}`);
            console.log(`   Reason: ${article.reason}`);
        });

        console.log('\n' + '-'.repeat(70));
        console.log('\n💡 Strategic Insights:');
        
        if (plan.statistics.easy > plan.statistics.medium + plan.statistics.hard) {
            console.log('   ✅ Good focus on easy wins for startup stage');
        } else if (plan.statistics.medium > plan.statistics.easy) {
            console.log('   📈 Balanced approach - growth phase detected');
        }
        
        console.log(`   📊 Average difficulty: ${Math.round(plan.scheduledArticles.reduce((sum, a) => sum + a.difficulty, 0) / plan.scheduledArticles.length)}/100`);

    } catch (error: any) {
        console.error('❌ Test 1 Failed:', error.message);
    }

    // Test 2: Performance feedback
    console.log('\n\n📊 Test 2: Performance Feedback Analysis');
    console.log('-'.repeat(70));
    
    try {
        const feedback = await getPerformanceFeedback();

        if (feedback.topPerformers.length === 0) {
            console.log('⚠️ No performance data yet (expected for new setup)');
            console.log('   Publish articles and track views to see insights');
        } else {
            console.log(`✅ Analyzing ${feedback.topPerformers.length} top performers\n`);
            
            console.log('🏆 Top Performing Articles:');
            feedback.topPerformers.forEach((p, i) => {
                console.log(`   ${i + 1}. ${p}`);
            });

            if (feedback.recommendations.length > 0) {
                console.log('\n💡 Recommendations:');
                feedback.recommendations.forEach(r => {
                    console.log(`   - ${r}`);
                });
            }
        }

    } catch (error: any) {
        console.error('❌ Test 2 Failed:', error.message);
    }

    // Test 3: Custom keyword planning
    console.log('\n\n🎯 Test 3: Custom Keyword Planning');
    console.log('-'.repeat(70));
    
    try {
        const customKeywords = [
            'how to invest in SIP',
            'best mutual funds for retirement',
            'tax saving investment options 2026'
        ];

        console.log('Testing with custom keywords:');
        customKeywords.forEach((k, i) => console.log(`   ${i + 1}. ${k}`));
        console.log('\nGenerating plan...\n');

        const customPlan = await generateWeeklyPlan({
            customKeywords,
            includeTrending: false
        });

        console.log(`✅ Generated plan with ${customPlan.scheduledArticles.length} articles\n`);

        customPlan.scheduledArticles.forEach((article, i) => {
            console.log(`${i + 1}. ${article.topic}`);
            console.log(`   Difficulty: ${article.difficulty}/100 - ${article.reason}`);
        });

    } catch (error: any) {
        console.error('❌ Test 3 Failed:', error.message);
    }

    // Summary
    console.log('\n\n' + '='.repeat(70));
    console.log('✅ All tests completed!');
    console.log('='.repeat(70));
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Review the generated plan above');
    console.log('   2. Adjust keywords if needed');
    console.log('   3. Run auto-execution: npx tsx scripts/execute-weekly-plan.ts');
    console.log('   4. Or manually generate articles from the plan');
}

main().catch(console.error);
