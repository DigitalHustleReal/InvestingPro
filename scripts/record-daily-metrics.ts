/**
 * 📊 RECORD DAILY METRICS
 * 
 * Run this script daily (manually or via cron) to track platform growth.
 * 
 * Usage:
 *   npx tsx scripts/record-daily-metrics.ts
 * 
 * Cron (daily at 9 AM):
 *   0 9 * * * cd /path/to/app && npx tsx scripts/record-daily-metrics.ts
 */

import { getCurrentAuthority, recordAuthority } from '../lib/analytics/authority-tracker';

async function main() {
    console.log('📊 Recording Daily Platform Metrics\n');
    console.log('='.repeat(60));
    
    try {
        // Get current metrics
        console.log('\n1️⃣ Analyzing current authority...');
        const metrics = await getCurrentAuthority();
        
        console.log(`   Domain Authority: ${metrics.domainAuthority}/100`);
        console.log(`   Estimation Method: ${metrics.estimationMethod}`);
        console.log(`   Confidence: ${(metrics.confidence * 100).toFixed(0)}%`);
        
        // Record to database
        console.log('\n2️⃣ Saving to database...');
        const success = await recordAuthority(metrics);
        
        if (success) {
            console.log('   ✅ Metrics recorded successfully!');
            console.log(`   Date: ${metrics.date}`);
            console.log(`   DA: ${metrics.domainAuthority}`);
        } else {
            console.log('   ❌ Failed to record metrics');
            process.exit(1);
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ Daily metrics recording complete!');
        console.log('='.repeat(60));
        
    } catch (error: any) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\n🔍 Troubleshooting:');
        console.error('   1. Check database connection');
        console.error('   2. Verify platform_metrics table exists');
        console.error('   3. Check Supabase credentials in .env.local');
        process.exit(1);
    }
}

main();
