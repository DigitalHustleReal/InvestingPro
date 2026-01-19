
import { economicTrigger } from '@/lib/automation/triggers/economic-trigger';
import { trendsService } from '@/lib/trends/TrendsService';
import { logger } from '@/lib/logger';

// Mock trends for testing logic if real feed determines nothing
const MOCK_TRENDS = [
    { keyword: 'RBI Repo Rate Unchanged', related_articles: [{ link: 'http://test.com' }] },
    { keyword: 'India GDP Growth 7.2%', related_articles: [{ link: 'http://test.com' }] },
    { keyword: 'Random News', related_articles: [{ link: 'http://test.com' }] }
];

async function main() {
    console.log('🚀 TESTING ECONOMIC TRIGGER (DRY RUN)\n');

    // 1. Test with Real Data
    console.log('--- Phase 1: Real Feed Check ---');
    try {
        const slugs = await economicTrigger.checkAndTrigger(true); // Dry Run = True
        console.log(`\nGenerated Slugs (Dry Run):`, slugs);
    } catch (e) {
        console.error('Real feed check failed:', e);
    }

    // 2. Test with Mock Data (Force Trigger)
    console.log('\n--- Phase 2: Mock Injection Test ---');
    try {
        // We inject mocks by temporarily overriding the service method (Quick JS Hack)
        const original = trendsService.getTrendingTopics;
        (trendsService as any).getTrendingTopics = async () => {
            console.log('   [Mock] Returning fake RBI/GDP trends...');
            return MOCK_TRENDS as any;
        };

        const slugs = await economicTrigger.checkAndTrigger(true);
        console.log(`\nGenerated Slugs (Mock Run):`, slugs);

        // Restore
        trendsService.getTrendingTopics = original;

    } catch (e) {
        console.error('Mock test failed:', e);
    }
}

main();
