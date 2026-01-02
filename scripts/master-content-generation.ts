/**
 * 🏭 CONTENT FACTORY: MASTER GENERATION SCRIPT
 * 
 * Generates all 210 articles from the master content plan.
 * Runs in batches to prevent API rate limits.
 * 
 * Usage:
 *   npx tsx scripts/master-content-generation.ts [phase]
 * 
 * Examples:
 *   npx tsx scripts/master-content-generation.ts mvl      # Generate MVL (60 articles)
 *   npx tsx scripts/master-content-generation.ts month1   # Month 1 (50 articles)
 *   npx tsx scripts/master-content-generation.ts all      # All 210 articles
 */

// Load environment variables FIRST
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Verify required env vars
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ ERROR: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

import { generateArticleCore } from '../lib/automation/article-generator';
import { getCurrentAuthority } from '../lib/analytics/authority-tracker';
import { recordAuthority } from '../lib/analytics/authority-tracker';

// Master article list (210 articles)
const MASTER_ARTICLES = {
  mvl: [
    // Phase 1: MVL Core (60 articles)
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
    
    'Asset Allocation Strategy for Indian Investors',
    'Dollar Cost Averaging in India - Rupee Cost Averaging',
    'Risk Profiling for Investors - Know Your Risk',
    'Market Volatility - How to Handle as an Investor',
    'Tax Loss Harvesting in India - Save Tax on Losses',
    'Indexation Benefits on Debt Mutual Funds',
    'Capital Gains Tax on Investments - Complete Guide',
    'Portfolio Diversification - Ultimate Guide India',
    
    'Union Budget 2026 - Impact on Your Investments',
    'New Income Tax Slabs 2026 - What Changed',
    'Latest RBI Repo Rate Impact on Investments',
    'Best Tax Saving Investments for FY 2025-26',
    'NPS Changes 2026 - What Investors Should Know',
    'SEBI New Mutual Fund Regulations 2026',
    'Latest Fixed Deposit Interest Rates India 2026',
    'Best Investment Strategy for 2026',
    'Retirement Planning Changes 2026',
    'Top Mutual Funds to Invest in 2026'
  ],
  
  month1: [
    // Phase 2: Month 1 Sustainment (50 articles)
    'Best Credit Cards in India 2026',
    'How to Choose a Credit Card - Complete Guide',
    'Credit Card Rewards Programs Explained',
    'How to Improve Credit Score Fast',
    'Credit Card vs Debit Card - Which to Use When',
    'Cashback Credit Cards - Best Options India',
    'Travel Credit Cards - Best for Miles & Points',
    'How to Use Credit Card Responsibly',
    'Credit Card EMI - Is It Worth It',
    'Best Zero Annual Fee Credit Cards India',
    'How to Apply for Credit Card Online',
    'Credit Card Bill Payment Methods',
    'Credit Limit - How It Decided',
    'Best Student Credit Cards India 2026',
    'Business Credit Cards - Features & Benefits',
    
    'Term Insurance - Complete Buying Guide 2026',
    'Health Insurance - How Much Coverage Needed',
    'Life Insurance vs Term Insurance',
    'ULIP vs Mutual Funds - Detailed Comparison',
    'Best Health Insurance Plans India 2026',
    'Motor Insurance - Car & Bike Insurance Guide',
    'Critical Illness Insurance - Do You Need It',
    'Group Health Insurance vs Individual Plans',
    'Insurance Claim Process - Step by Step',
    'Best Life Insurance Companies India 2026',
    
    'How to File ITR Online - Step by Step 2026',
    'Tax Deductions Under 80C, 80D, 80E Explained',
    'HRA Exemption Calculation - Complete Guide',
    'Standard Deduction 2026 - What It Means',
    'TDS on Salary - How to Calculate',
    'Form 16 vs Form 26AS - Understanding Difference',
    'Income Tax Refund - How to Claim',
    'Tax Planning for Salaried Employees 2026',
    'Tax Saving FDs vs ELSS - Which is Better',
    'Advance Tax Payment - Who Should Pay',
    
    'Home Loan - Complete Guide to Buying House',
    'Home Loan EMI Calculator - Plan Your Purchase',
    'Home Loan Tax Benefits - Section 80C & 24',
    'Renting vs Buying Home - Financial Analysis',
    'Balance Transfer Home Loan - Save on Interest',
    'Joint Home Loan - Benefits & Eligibility',
    'REITs in India - Real Estate Investment Trusts',
    'Property Investment - Is It Still Worth It 2026',
    
    'How to Start Investing in Stock Market India',
    'Demat Account - What It Is & How to Open',
    'Stock Market Basics for Beginners',
    'Blue Chip Stocks India - Best Long Term Picks',
    'Penny Stocks - Risk & Rewards Explained',
    'Stock Market vs Mutual Funds - Which is Better',
    'How to Read Stock Charts - Technical Analysis Basics'
  ],
  
  month2: [
    // Phase 3: Month 2 Sustainment (first 25 for now)
    'Multi Cap Funds - Best Options 2026',
    'Small Cap Funds - High Risk High Returns',
    'Flexi Cap Funds - Everything You Need to Know',
    'Sectoral Funds - Should You Invest',
    'Thematic Funds - Opportunities & Risks',
    'International Funds - Invest Globally from India',
    'Balanced Advantage Funds for Stable Returns',
    'Liquid Funds - Best for Emergency Money',
    'Ultra Short Duration Funds Guide',
    'Gilt Funds - Government Securities Investment',
    'Fund of Funds - Pros and Cons',
    'Target Maturity Funds Explained',
    
    'Personal Loan - How to Get Best Interest Rates',
    'Car Loan vs Car Lease - What Better',
    'Education Loan - Complete Guide for Students',
    'Gold Loan - Quick Money Against Gold',
    'Loan Against Property - Rates & Eligibility',
    'Business Loan - How to Get for Startup',
    'Top-up Loan on Home Loan - Is It Worth',
    'Loan Against Mutual Funds & Shares',
    'How to Improve Loan Eligibility',
    'Pre-Closure of Loans - Should You Do It',
    'Balance Transfer - Save on Personal Loan',
    'Debt Consolidation Loan Guide India',
    'NPS vs PPF - Best for Retirement'
  ]
};

async function generateBatch(articles: string[], batchName: string) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🏭 STARTING BATCH: ${batchName}`);
  console.log(`📊 Articles to generate: ${articles.length}`);
  console.log(`${'='.repeat(70)}\n`);

  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < articles.length; i++) {
    const topic = articles[i];
    const articleNum = i + 1;

    console.log(`\n${'━'.repeat(70)}`);
    console.log(`📝 Article ${articleNum}/${articles.length}: ${topic}`);
    console.log(`${'━'.repeat(70)}`);

    try {
      const result = await generateArticleCore(topic, (msg) => {
        console.log(`   ${msg}`);
      });

      if (result.success) {
        successCount++;
        console.log(`\n✅ SUCCESS! Article published: ${result.url}`);
      } else {
        failCount++;
        console.error(`\n❌ FAILED: ${result.error}`);
      }

      // Rate limiting: 2 minutes between articles (ONLY ON SUCCESS)
      // If failed (duplicate), move fast to next one.
      if (result.success && i < articles.length - 1) {
        console.log(`\n⏸️  Waiting 2 minutes before next article...`);
        await new Promise(resolve => setTimeout(resolve, 120000));
      } else {
        console.log(`\n⏩ Skipping wait (Failure/Duplicate detected)...`);
      }

    } catch (error: any) {
      failCount++;
      console.error(`\n❌ ERROR: ${error.message}`);
      
      // Continue with next article
      console.log(`   Continuing with next article...`);
    }

    // After every 10 articles, record authority metrics
    if ((articleNum % 10) === 0) {
      console.log(`\n📊 Recording authority metrics...`);
      try {
        await recordAuthority();
        const authority = await getCurrentAuthority();
        console.log(`   Current DA: ${authority.domainAuthority}/100`);
      } catch (e) {
        console.log(`   ⚠️ Metrics recording failed (non-critical)`);
      }
    }
  }

  const duration = Math.round((Date.now() - startTime) / 1000 / 60);

  console.log(`\n\n${'='.repeat(70)}`);
  console.log(`🎉 BATCH COMPLETE: ${batchName}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`✅ Success: ${successCount} articles`);
  console.log(`❌ Failed: ${failCount} articles`);
  console.log(`⏱️  Duration: ${duration} minutes`);
  console.log(`📊 Success Rate: ${Math.round((successCount / articles.length) * 100)}%`);
  console.log(`${'='.repeat(70)}\n`);
}

async function main() {
  const phase = process.argv[2] || 'mvl';

  console.log(`\n🏭 CONTENT FACTORY - MASTER GENERATION`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Phase: ${phase.toUpperCase()}`);
  console.log(`${'='.repeat(70)}\n`);

  // Check current authority
  try {
    const authority = await getCurrentAuthority();
    console.log(`📊 Current Platform Authority: ${authority.domainAuthority}/100`);
    console.log(`🎯 Estimation Method: ${authority.estimationMethod}`);
    console.log(`✅ Confidence: ${(authority.confidence * 100).toFixed(0)}%\n`);
  } catch (e) {
    console.log(`⚠️ Could not fetch authority (non-critical)\n`);
  }

  switch (phase.toLowerCase()) {
    case 'mvl':
      await generateBatch(MASTER_ARTICLES.mvl, 'MVL Core (60 articles)');
      break;
    
    case 'month1':
      await generateBatch(MASTER_ARTICLES.month1, 'Month 1 Sustainment (50 articles)');
      break;
    
    case 'month2':
      await generateBatch(MASTER_ARTICLES.month2, 'Month 2 Sustainment (25 articles - partial)');
      break;
    
    case 'all':
      await generateBatch(MASTER_ARTICLES.mvl, 'Phase 1: MVL');
      await generateBatch(MASTER_ARTICLES.month1, 'Phase 2: Month 1');
      await generateBatch(MASTER_ARTICLES.month2, 'Phase 3: Month 2 (partial)');
      break;
    
    default:
      console.error(`❌ Unknown phase: ${phase}`);
      console.log(`\n💡 Available phases: mvl, month1, month2, all`);
      process.exit(1);
  }

  console.log(`\n\n🎊 CONTENT FACTORY EXECUTION COMPLETE!`);
  console.log(`\n💡 Next Steps:`);
  console.log(` 1. Check your articles database`);
  console.log(`   2. Review generated content`);
  console.log(`   3. Add glossary terms (100+)`);
  console.log(`   4. Create legal pages (5)`);
  console.log(`   5. Final QA and launch!`);
}

main().catch(console.error);
