/**
 * 🧪 TEST PLATFORM AUTHORITY TRACKER
 * 
 * Tests the authority tracking system without breaking anything.
 * Safe to run multiple times.
 * 
 * Usage:
 *   npx tsx scripts/test-authority-tracker.ts
 */

import { 
    getCurrentAuthority, 
    recordAuthority, 
    getAuthorityLevel,
    getAuthorityTrend,
    getGrowthRate,
    getRecommendedKeywords
} from '../lib/analytics/authority-tracker';

async function main() {
    console.log('🧪 Testing Platform Authority Tracker\n');
    console.log('='.repeat(70));

    // Test 1: Get current authority
    console.log('\n📊 Test 1: Get Current Authority');
    console.log('-'.repeat(70));
    
    try {
        const current = await getCurrentAuthority();
        console.log(`✅ Current Domain Authority: ${current.domainAuthority}/100`);
        console.log(`   Method: ${current.estimationMethod}`);
        console.log(`   Confidence: ${(current.confidence * 100).toFixed(0)}%`);
        console.log(`   Date: ${current.date}`);
        
        if (current.indexedPages) {
            console.log(`   Indexed Pages: ${current.indexedPages}`);
        }
        if (current.organicTraffic) {
            console.log(`   Organic Traffic: ${current.organicTraffic}/month`);
        }
    } catch (error: any) {
        console.error('❌ Test 1 Failed:', error.message);
    }

    // Test 2: Get authority level and strategy
    console.log('\n\n🎯 Test 2: Authority Level & Strategy');
    console.log('-'.repeat(70));
    
    try {
        const current = await getCurrentAuthority();
        const level = getAuthorityLevel(current.domainAuthority);
        
        console.log(`Level: ${level.level.toUpperCase()} (DA ${level.da})`);
        console.log(`\nRecommended Strategy:`);
        console.log(`   - Target Difficulty: ${level.targetDifficulty.min}-${level.targetDifficulty.max}`);
        console.log(`   - Articles/Week: ${level.articlesPerWeek}`);
        console.log(`   - Strategy: ${level.strategy}`);
    } catch (error: any) {
        console.error('❌ Test 2 Failed:', error.message);
    }

    // Test 3: Record current authority
    console.log('\n\n💾 Test 3: Record Authority to Database');
    console.log('-'.repeat(70));
    
    try {
        const success = await recordAuthority();
        if (success) {
            console.log('✅ Authority metrics recorded successfully!');
            console.log('   Check your platform_metrics table in Supabase');
        } else {
            console.log('⚠️ Failed to record (table might not exist yet)');
        }
    } catch (error: any) {
        console.error('❌ Test 3 Failed:', error.message);
    }

    // Test 4: Get authority trend
    console.log('\n\n📈 Test 4: Authority Growth Trend (Last 30 days)');
    console.log('-'.repeat(70));
    
    try {
        const trend = await getAuthorityTrend(30);
        
        if (trend.length === 0) {
            console.log('⚠️ No historical data yet (this is normal for new setup)');
            console.log('   Record metrics daily to build trend data');
        } else {
            console.log(`✅ Found ${trend.length} data points\n`);
            console.log('Date       | DA');
            console.log('-'.repeat(20));
            trend.forEach(t => {
                console.log(`${t.date} | ${t.domainAuthority.toString().padStart(2, ' ')}`);
            });
        }
    } catch (error: any) {
        console.error('❌ Test 4 Failed:', error.message);
    }

    // Test 5: Calculate growth rate
    console.log('\n\n🚀 Test 5: Growth Rate');
    console.log('-'.repeat(70));
    
    try {
        const growthRate = await getGrowthRate(30);
        
        if (growthRate === 0) {
            console.log('⚠️ No growth data yet (need at least 2 data points)');
        } else {
            const emoji = growthRate > 0 ? '📈' : '📉';
            console.log(`${emoji} Growth Rate: ${growthRate > 0 ? '+' : ''}${growthRate}% (30 days)`);
        }
    } catch (error: any) {
        console.error('❌ Test 5 Failed:', error.message);
    }

    // Test 6: Get recommended keywords
    console.log('\n\n🎯 Test 6: Recommended Keyword Strategy');
    console.log('-'.repeat(70));
    
    try {
        const recommendations = await getRecommendedKeywords();
        
        console.log('Based on your current authority, focus on:\n');
        
        if (recommendations.easy.length > 0) {
            console.log('🟢 EASY (Target Now):');
            recommendations.easy.forEach(k => console.log(`   - ${k}`));
        }
        
        if (recommendations.medium.length > 0) {
            console.log('\n🟡 MEDIUM (Mix In):');
            recommendations.medium.forEach(k => console.log(`   - ${k}`));
        }
        
        if (recommendations.hard.length > 0) {
            console.log('\n🔴 HARD (Save for Later):');
            recommendations.hard.forEach(k => console.log(`   - ${k}`));
        }
    } catch (error: any) {
        console.error('❌ Test 6 Failed:', error.message);
    }

    // Summary
    console.log('\n\n' + '='.repeat(70));
    console.log('✅ All tests completed!');
    console.log('='.repeat(70));
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Review your current DA and strategy above');
    console.log('   2. Run this daily to track growth: npx tsx scripts/record-daily-metrics.ts');
    console.log('   3. Check the dashboard widget for visual trends');
    console.log('   4. Adjust content strategy based on authority level');
}

main().catch(console.error);
