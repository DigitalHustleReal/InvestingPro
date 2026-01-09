/**
 * 🚀 MVL CONTENT BLITZ - Generate 54 Missing Articles
 * 
 * Current State: 6/60 articles published
 * Target: 60 articles for MVL
 * Gap: 54 articles
 * 
 * Strategy: Generate 10 articles/day for 6 days
 * 
 * Usage:
 *   npx tsx scripts/mvl-blitz.ts [batch_size]
 *   npx tsx scripts/mvl-blitz.ts 10  # Generate 10 articles (default)
 *   npx tsx scripts/mvl-blitz.ts 54  # Generate all remaining articles
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load env vars first
config({ path: resolve(process.cwd(), '.env.local') });

import { generateArticleCore } from '../lib/automation/article-generator';
import { createClient } from '@supabase/supabase-js';
import { smartFilterTopics } from '../lib/automation/topic-filter';

// AUTHOR MAPPING (Content Factory)
// Vikram Malhotra (Stocks/Advanced): a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
// Riya Sharma (Basics/Personal Finance): 9bf4e75a-6943-4cc2-9856-1558bf0ef121
const AUTHORS = {
    VIKRAM: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    RIYA: '9bf4e75a-6943-4cc2-9856-1558bf0ef121'
};

function getAuthorForTopic(topic: string): string {
    const t = topic.toLowerCase();
    // Advanced / Stocks / Analysis -> Vikram
    if (t.includes('stock') || t.includes('market') || t.includes('advanced') || t.includes('portfolio') || t.includes('tax') || t.includes('calculator')) {
        return AUTHORS.VIKRAM;
    }
    // Basics / SIP / Savings -> Riya
    return AUTHORS.RIYA;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// All 60 MVL articles from MASTER_CONTENT_PLAN.md
const MVL_ARTICLES = [
  // A. Mutual Funds Foundations (20)
  'What is SIP - Complete Guide for 2026',
  'How to Start Investing in Mutual Funds India',
  'Best Mutual Funds for Beginners 2026',
  'SIP vs Lump Sum Investment - Which is Better',
  'How to Choose the Right Mutual Funds',
  'Mutual Fund Categories Explained Simply',
  'What is NAV in Mutual Funds - Complete Guide',
  'How to Read Mutual Fund Fact Sheet',
  'Tax on Mutual Funds India - Complete Guide 2026',
  'ELSS Funds - Tax Saving Mutual Funds Explained',
  
  'How to Build a Mutual Fund Portfolio from Scratch',
  'Debt Funds vs Equity Funds - Complete Comparison',
  'Index Funds vs Actively Managed Funds India',
  'Systematic Transfer Plan (STP) - Complete Guide',
  'Systematic Withdrawal Plan (SWP) for Retirement',
  'Direct vs Regular Mutual Funds - Which to Choose',
  'Expense Ratio Impact on Mutual Fund Returns',
  'Exit Load and Lock-in Period Explained',
  'How to Track Mutual Fund Performance',
  'Portfolio Rebalancing - When and How',
  
  // B. Calculator Deep-Dive Guides (12)
  'SIP Calculator - How to Plan Your Investments 2026',
  'EMI Calculator - Calculate Your Loan EMI Instantly',
  'PPF Calculator - Plan Your Public Provident Fund',
  'FD Calculator - Compare Fixed Deposit Returns',
  'Tax Calculator - Calculate Income Tax FY 2025-26',
  'Retirement Planning Calculator - Secure Your Future',
  'NPS Calculator - National Pension System Returns',
  'Lumpsum Investment Calculator Guide India',
  'SWP Calculator - Systematic Withdrawal Planning',
  'Goal Planning Calculator - Achieve Financial Goals',
  'GST Calculator - Calculate GST on Invoices',
  'Inflation Adjusted Returns Calculator Guide',
  
  // C. Personal Finance Essentials (10)
  'Emergency Fund - How Much You Need in India',
  'Budgeting for Beginners - 50-30-20 Rule India',
  'How to Save Tax Under Section 80C - 2026 Guide',
  'Best Investment Options in India 2026',
  'Fixed Deposits vs Mutual Funds - What to Choose',
  'How to Start Investing with Just ₹500',
  'Financial Goals by Age - 20s, 30s, 40s, 50s',
  'Best Savings Account in India 2026',
  'Credit Score Basics - How to Build Good Credit',
  'Term Insurance vs Investment Plans - Comparison',
  
  // D. Advanced Investment Topics (8)
  'Asset Allocation Strategy for Indian Investors',
  'Dollar Cost Averaging in India - Rupee Cost Averaging',
  'Risk Profiling for Investors - Know Your Risk',
  'Market Volatility - How to Handle as an Investor',
  'Tax Loss Harvesting in India - Save Tax on Losses',
  'Indexation Benefits on Debt Mutual Funds',
  'Capital Gains Tax on Investments - Complete Guide',
  'Portfolio Diversification - Ultimate Guide India',
  
  // E. Trending & Timely (10)
  'Union Budget 2026 - Impact on Your Investments',
  'New Income Tax Slabs 2026 - What Changed',
  'Latest RBI Repo Rate Impact on Investments',
  'Best Tax Saving Investments for FY 2025-26',
  'NPS Changes 2026 - What Investors Should Know',
  'SEBI New Mutual Fund Regulations 2026',
  'Latest Fixed Deposit Interest Rates India 2026',
  'Best Investment Strategy for 2026',
  'Retirement Planning Changes 2026',
  'Top Mutual Funds to Invest in 2026',
  
  // F. Additional Topics (Just in case)
  'How to Save 1 Crore with SIP',
  'Best Gold Investment Options in India 2026',
  'Sovereign Gold Bonds vs Gold ETFs',
  'Senior Citizen Savings Scheme (SCSS) Guide',
  'Corporate Fixed Deposits - Safe or Risky?',
  'RBI Floating Rate Savings Bonds Guide',
  'Liquid Funds vs Savings Account',
  'Overnight Funds Explained Simply',
  'Arbitrage Funds Tax Advantage',
  'Balanced Advantage Funds Guide 2026'
];

async function getExistingArticleTitles(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('articles')
    .select('title');
  
  if (error) {
    console.error('Error fetching existing articles:', error);
    return new Set();
  }
  
  return new Set(data?.map(a => a.title) || []);
}

async function main() {
  const batchSize = parseInt(process.argv[2] || '10');
  
  console.log('🚀 MVL CONTENT BLITZ');
  console.log('===================');
  console.log(`Target: Generate ${batchSize} articles\n`);
  
  // Use Smart Topic Filter
  console.log('🧠 Running Smart Topic Filter...');
  // Check against all MVL topics to find best candidates
  const filterResult = await smartFilterTopics(
      MVL_ARTICLES, 
      'mutual-funds', 
      batchSize
  );

  const articlesToGenerate = filterResult.unique_topics;
  
  console.log(`\n✅ Selected ${articlesToGenerate.length} unique topics`);
  console.log(`❌ Filtered ${filterResult.total_filtered} duplicates/existing`);
  
  if (articlesToGenerate.length === 0) {
    console.log('✅ All MVL articles already generated or filtered!');
    return;
  }
  
  console.log(`📝 Articles to generate: ${articlesToGenerate.length}\n`);
  
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();
  
  // Generate articles
  for (let i = 0; i < articlesToGenerate.length; i++) {
    const topic = articlesToGenerate[i];
    const articleNum = i + 1;
    const totalArticles = articlesToGenerate.length;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 [${articleNum}/${totalArticles}] ${topic}`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
      const authorId = getAuthorForTopic(topic);
      console.log(`   👤 Assigning Author: ${authorId === AUTHORS.VIKRAM ? 'Vikram (Expert)' : 'Riya (Guide)'}`);

      const result: any = await generateArticleCore(topic, (msg) => {
        console.log(`   ${msg}`);
      }, { authorId });
      
      if (result.success) {
        successCount++;
        console.log(`\n✅ Success! Article URL: ${result.url}`);
      } else {
        failCount++;
        console.log(`\n❌ Failed: ${result.error}`);
      }
      
      // Progress update
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      const remaining = totalArticles - articleNum;
      const avgTimePerArticle = (Date.now() - startTime) / articleNum / 1000 / 60;
      const estimatedTimeRemaining = (avgTimePerArticle * remaining).toFixed(1);
      
      console.log(`\n📊 Progress: ${successCount} successes, ${failCount} failures`);
      console.log(`⏱️  Time elapsed: ${elapsed} minutes`);
      console.log(`⏳ Estimated time remaining: ${estimatedTimeRemaining} minutes`);
      
      // Delay between articles (30 seconds for admin use)
      if (articleNum < totalArticles) {
        console.log(`\n⏸️  Waiting 30 seconds before next article...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
      
    } catch (error: any) {
      failCount++;
      console.error(`\n❌ Error generating article: ${error.message}`);
    }
  }
  
  // Final summary
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const totalExisting = filterResult.total_filtered; // Use filter result
  const currentTotal = totalExisting + successCount;
  
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('🎯 MVL BLITZ COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Successful: ${successCount}/${articlesToGenerate.length}`);
  console.log(`❌ Failed: ${failCount}/${articlesToGenerate.length}`);
  console.log(`⏱️  Total time: ${totalTime} minutes`);
  console.log(`📈 Current total: ${currentTotal} articles`);
  console.log(`🎯 MVL Target: 60 articles`);
  console.log(`📊 Remaining: ${Math.max(0, 60 - currentTotal)} articles`);
  console.log(`${'='.repeat(60)}\n`);
  
  // Only check for 60 if we were trying to hit that target
  if (currentTotal >= 60) {
    console.log('🎉 MVL TARGET ACHIEVED! Ready for launch! 🚀');
  } else {
    console.log(`📝 Next step: Generate ${Math.max(0, 60 - currentTotal)} more articles`);
    console.log(`   Run: npx tsx scripts/mvl-blitz.ts 10`);
  }
}

main().catch(console.error);
