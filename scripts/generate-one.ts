
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { generateArticleCore } from '../lib/automation/article-generator';

async function generateOne() {
    console.log('🚀 Generating SINGLE Article (Live Mode)...');
    try {
        const result = await generateArticleCore(
            "How to Start SIP in India for Beginners 2026", 
            (msg) => console.log(msg),
            false // dryRun = false (Real Insert)
        );
        console.log('🏁 Result:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('❌ Critical Failure:', e);
    }
}

generateOne();
