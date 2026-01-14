/**
 * Test Queue Migration Script
 * 
 * Tests the migration of API routes to use Inngest queue
 * Run: npx tsx scripts/test-queue-migration.ts
 */

import { inngest } from '../lib/queue/inngest-client';
import { logger } from '../lib/logger';

async function testQueueMigration() {
    console.log('🧪 Testing Queue Migration...\n');

    // Test 1: Send test event
    console.log('1️⃣ Testing event sending...');
    try {
        const result = await inngest.send({
            name: 'article/generate-comprehensive',
            data: {
                topic: 'Test Article - Queue Migration',
                category: 'investing-basics',
                targetKeywords: ['test', 'migration'],
                targetAudience: 'general',
                contentLength: 'comprehensive',
                wordCount: 1500,
            },
        });

        console.log('✅ Event sent successfully');
        console.log(`   Event IDs: ${result.ids.join(', ')}`);
        console.log(`   Job ID: ${result.ids[0]}`);
        console.log('\n📝 Next Steps:');
        console.log(`   1. Check Inngest Dashboard for job execution`);
        console.log(`   2. Query job status: GET /api/jobs/${result.ids[0]}/status`);
        console.log(`   3. Monitor logs for job completion\n`);

        return result.ids[0];
    } catch (error) {
        console.error('❌ Failed to send event');
        console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
        console.log('\n⚠️  Make sure:');
        console.log('   1. Inngest package is installed (npm install inngest)');
        console.log('   2. Environment variables are set (INNGEST_EVENT_KEY, INNGEST_SIGNING_KEY)');
        console.log('   3. Inngest account is created and configured');
        throw error;
    }
}

// Run test
testQueueMigration()
    .then((jobId) => {
        console.log(`\n✅ Test completed successfully!`);
        console.log(`   Job ID: ${jobId}`);
        console.log(`\n📚 See docs/PHASE2_API_MIGRATION_GUIDE.md for migration steps`);
        process.exit(0);
    })
    .catch((error) => {
        logger.error('Queue migration test error', error instanceof Error ? error : new Error(String(error)));
        process.exit(1);
    });
