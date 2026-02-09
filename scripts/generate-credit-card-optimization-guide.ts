
import dotenv from 'dotenv';
import path from 'path';
import type { ResearchBrief } from '@/lib/research/serp-analyzer';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    // Dynamic import
    const { generateArticleCore } = await import('@/lib/automation/article-generator');

    const topic = "The Definitive Guide to Credit Card Optimization in India: Maximize Rewards & Cashback";
    const categorySlug = 'credit-cards';
    
    console.log(`🚀 Starting Generation: ${topic}`);

    const brief: ResearchBrief = {
        keywords: ['credit card optimization', 'maximize credit card rewards', 'best credit card strategies india', 'card stacking', 'reward points redemption'],
        recommended_word_count: 3500, // Deep, authoritative guide
        content_gaps: [
            'Mathematical breakdown of reward rates',
            'Card stacking strategies (using multiple cards)',
            'Hidden "sweet spots" for redemption (Airmiles vs Cashback)',
            'MCC (Merchant Category Code) optimization secrets',
            'Lifetime Free (LTF) vs Premium Fee analysis'
        ],
        key_statistics: [
            'Average Indian credit card user leaves 40% of rewards unclaimed',
            'Premium cards can yield 3-5% effective return vs 1% on basic cards'
        ],
        unique_angle: 'A masterclass for power users. Focus on "ROI of Spending" and "Card Portfolio Management" rather than just listing cards. Treat credit cards as an asset class.',
        avg_word_count: 2000,
        competitor_urls: [],
        top_results: []
    };

    try {
        const result = await generateArticleCore(
            topic, 
            (msg) => console.log(`   ${msg}`),
            { dryRun: false }
        );
        if (result.success) {
            console.log('✅ Guide Generation Complete!');
            console.log('🔗 URL:', result.url);
        } else {
            console.error('❌ Generation Failed:', result.error);
        }
    } catch (error) {
        console.error('💥 Fatal Error:', error);
    }
}

main().catch(console.error);
