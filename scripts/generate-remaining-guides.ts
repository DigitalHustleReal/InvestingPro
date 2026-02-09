
import dotenv from 'dotenv';
import path from 'path';
import type { ResearchBrief } from '@/lib/research/serp-analyzer';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    // Dynamic import
    const { generateArticleCore } = await import('@/lib/automation/article-generator');

    console.log(`🚀 Starting Generation for Remaining Guides...`);

    // 1. Mutual Fund Guide
    const mfTopic = "The Ultimate Guide to Mutual Fund Selection in India: Direct Plans, SIPs & Alpha";
    const mfBrief: ResearchBrief = {
        keywords: ['mutual fund selection guide', 'direct vs regular mutual funds', 'best sip strategy', 'expense ratio impact', 'selecting equity funds'],
        recommended_word_count: 3000,
        content_gaps: [
            'Impact of 1% Expense Ratio difference over 20 years (Mathematical proof)',
            'Step-by-step framework to filter 2500+ schemes down to 3',
            'Active vs Passive debate in Indian Large Cap context',
            'Taxation of Mutual Funds (Post-2024 Budget rules)'
        ],
        key_statistics: [
            'Direct plans outperform regular plans by ~1-1.5% CAGR',
            'Less than 20% of Large Cap funds beat the Nifty 50 index consistently'
        ],
        unique_angle: 'Data-driven selection framework. Move beyond "past returns" and focus on "rolling returns", "standard deviation", and "downside capture".',
        avg_word_count: 2000,
        competitor_urls: [],
        top_results: []
    };

    try {
        const result = await generateArticleCore(
            mfTopic, 
            (msg) => console.log(`   [MF] ${msg}`),
            { dryRun: false }
        );
        if (result.success) {
            console.log('✅ Mutual Fund Guide Complete!');
        } else {
            console.error('❌ MF Generation Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ MF Fatal Error:', error);
    }

    // Wait a bit to avoid rate limits
    await new Promise(r => setTimeout(r, 10000));

    // 2. Home Loan Guide
    const loanTopic = "The Complete Home Loan Guide 2026: Interest Rates, Eligibility & Prepayment Hacks";
    const loanBrief: ResearchBrief = {
        keywords: ['home loan guide india', 'home loan prepayment strategy', 'fixed vs floating home loan', 'home loan tax benefits', 'rbi repo rate impact'],
        recommended_word_count: 3000,
        content_gaps: [
            'Prepayment calculator: How 1 extra EMI a year saves lakhs',
            'RLLR (Repo Linked Loan Rate) vs MCLR explanation',
            'Tax benefits beyond Section 80C and 24(b) (e.g., Joint ownership)',
            'Negotiating the spread with your bank'
        ],
        key_statistics: [
            'Prepaying 5% of loan principal each year reduces tenure by ~40%',
            'Repo rate transmission is faster in RLLR regime'
        ],
        unique_angle: 'Focus on "Cost of Borrowing" reduction. Treat a home loan as a financial product to be managed, not just a liability.',
        avg_word_count: 1800,
        competitor_urls: [],
        top_results: []
    };

    try {
        const result = await generateArticleCore(
            loanTopic, 
            (msg) => console.log(`   [Loan] ${msg}`),
            { dryRun: false }
        );
        if (result.success) {
            console.log('✅ Home Loan Guide Complete!');
        } else {
            console.error('❌ Loan Generation Failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Loan Fatal Error:', error);
    }
}

main().catch(console.error);
