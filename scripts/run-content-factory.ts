import { execSync } from 'child_process';
import * as fs from 'fs';

/**
 * MASTER CONTENT FACTORY LOOP
 * 
 * The ultimate automation script that:
 * 1. Reads the content strategy/topics list
 * 2. Iterates through each topic
 * 3. Calls the complete-auto-publish script
 * 4. Manages delays to be fail-safe
 * 
 * Usage: npx tsx scripts/run-content-factory.ts
 */

async function runContentFactory() {
    console.log('🏭 STARTING CONTENT FACTORY...\n');

    // 1. Check for strategy file
    const strategyFile = 'topics-to-generate.txt';
    if (!fs.existsSync(strategyFile)) {
        console.log('❌ Strategy file not found!');
        console.log('   Running strategy generator first...');
        try {
            execSync('npx tsx scripts/auto-content-strategy.ts', { stdio: 'inherit' });
        } catch (e) {
            console.error('Failed to generate strategy');
            return;
        }
    }

    if (!fs.existsSync(strategyFile)) {
        console.error('❌ Still cannot find topics-to-generate.txt. Exiting.');
        return;
    }

    // 2. Read topics
    const content = fs.readFileSync(strategyFile, 'utf-8');
    const topics = content.split('\n').filter(t => t.trim().length > 0);

    console.log(`\nfound ${topics.length} topics queued for production.\n`);

    // 3. Process Batch
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < topics.length; i++) {
        const topic = topics[i].trim();
        console.log(`\n[${i + 1}/${topics.length}] 🚀 Processing: "${topic}"`);

        try {
            // Run the complete auto-publish script
            // Using inherit to show the live output of the generation process
            execSync(`npx tsx scripts/complete-auto-publish.ts "${topic}"`, { stdio: 'inherit' });
            
            successCount++;
            console.log(`\n✅ Completed: "${topic}"`);
            
            // Wait between articles (safety delay)
            if (i < topics.length - 1) {
                console.log('⏳ Cooling down for 15 seconds...');
                await new Promise(resolve => setTimeout(resolve, 15000));
            }

        } catch (error) {
            console.error(`\n❌ Failed to process: "${topic}"`);
            failCount++;
            // Continue to next topic instead of crashing entire batch
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('🏁 BATCH PROCESSING COMPLETE');
    console.log('═'.repeat(60));
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed:  ${failCount}`);
    console.log(`📚 Total:   ${topics.length}`);
    console.log('═'.repeat(60));
}

runContentFactory().catch(console.error);
