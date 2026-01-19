
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { analyzeSerpForWordCount } from '../lib/seo/serp-analyzer';

async function testSerpAnalysis() {
    console.log('🧪 Testing SERP Analysis for Word Count...');
    
    const topic = 'How to Choose Mutual Funds';
    const keywords = ['mutual funds', 'investment', 'guide'];
    
    console.log(`Topic: "${topic}"`);
    console.log('Analyzing...');
    
    try {
        const result = await analyzeSerpForWordCount(topic, keywords);
        
        console.log('\n✅ Analysis Complete!');
        console.log('--------------------------------');
        console.log(`Competitor Avg:   ${result.averageWordCount}`);
        console.log(`Target Word Count:${result.targetWordCount}`);
        console.log(`Difficulty:       ${result.difficulty}`);
        
        if (result.topCompetitors) {
            console.log('\nTop Competitors (Simulated/Estimated):');
            result.topCompetitors.forEach(c => console.log(`- ${c.title} (~${c.estimatedWordCount} words)`));
        }
        
        // Verify Math
        const ratio = result.targetWordCount / result.averageWordCount;
        console.log(`\nBuffer Ratio:     ${ratio.toFixed(2)} (Expected ~1.25)`);
        
    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testSerpAnalysis();
