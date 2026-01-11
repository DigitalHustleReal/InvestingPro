import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createServiceClient } from '../lib/supabase/service';
import { runQualityGates } from '../lib/quality/quality-gates';
import { scoreContent } from '../lib/quality/content-scorer';
import { aiService } from '../lib/ai-service';

const supabase = createServiceClient();

interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  card_type?: string;
  annual_fee?: number;
  joining_bonus?: string;
  rewards_rate?: string;
  features?: string[];
  description?: string;
}

async function generateDescription(card: CreditCard): Promise<string> {
  const prompt = `You are a financial content writer for InvestingPro.in, India's premier personal finance platform.

Write a compelling, professional product description for this credit card:

**Card Details:**
- Name: ${card.name}
- Issuer: ${card.issuer}
${card.card_type ? `- Type: ${card.card_type}` : ''}
${card.annual_fee ? `- Annual Fee: ₹${card.annual_fee}` : ''}
${card.joining_bonus ? `- Joining Bonus: ${card.joining_bonus}` : ''}
${card.rewards_rate ? `- Rewards: ${card.rewards_rate}` : ''}
${card.features ? `- Features: ${card.features.join(', ')}` : ''}

**Requirements:**
- Length: 150-250 words (for good quality score)
- Tone: Professional, helpful, not salesy
- Target: Indian professionals seeking smart financial choices
- Include: Key benefits, ideal user, standout features
- Format: 2-3 well-structured paragraphs
- NO fluff - factual and helpful
- Use Indian English
- Mention who this card suits best
- Include specific use cases

Write ONLY the description in plain text (no HTML).`;

  try {
     return await aiService.generate(prompt);
  } catch (error) {
     console.error('AI Generation failed:', error);
     return 'Description currently unavailable. Please check back later.';
  }
}

async function generateWithQualityGates(limit: number = 50, testMode: boolean = false) {
  console.log('\n' + '═'.repeat(70));
  console.log('🚀 QUALITY-GATED CREDIT CARD DESCRIPTION GENERATION');
  console.log('═'.repeat(70));
  console.log(`Mode: ${testMode ? 'TEST (first 3)' : 'FULL GENERATION'}`);
  console.log(`Target: ${limit} descriptions\n`);

  // Fetch cards WITHOUT descriptions
  const { data: cards, error } = await supabase
    .from('credit_cards')
    .select('*')
    .is('description', null)
    .limit(testMode ? 3 : limit);

  if (error) {
    console.error('❌ Error fetching cards:', error);
    return;
  }

  if (!cards || cards.length === 0) {
    console.log('✅ All cards already have descriptions!');
    return;
  }

  console.log(`📊 Found ${cards.length} cards without descriptions\n`);

  let successful = 0;
  let failed = 0;
  let qualityFailed = 0;
  let totalCost = 0;

  const stats = {
    totalScore: 0,
    minScore: 100,
    maxScore: 0,
    avgWordCount: 0
  };

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    console.log(`\n[${i + 1}/${cards.length}] ${card.name}`);
    console.log('─'.repeat(70));

    try {
      // Generate description
      console.log('  🤖 Generating description...');
      const description = await generateDescription(card);
      const wordCount = description.split(/\s+/).length;
      console.log(`     Generated: ${wordCount} words`);

      // Wrap in minimal HTML for quality check
      const htmlContent = `<p>${description}</p>`;

      // Quick quality check (no plagiarism check for speed in bulk)
      console.log('  📊 Quality check...');
      const qualityScore = scoreContent(
        card.name,
        htmlContent
      );

      stats.totalScore += qualityScore.overall;
      stats.minScore = Math.min(stats.minScore, qualityScore.overall);
      stats.maxScore = Math.max(stats.maxScore, qualityScore.overall);
      stats.avgWordCount += wordCount;

      console.log(`     Score: ${qualityScore.overall}/100 ${qualityScore.canPublish ? '✅' : '❌'}`);
      console.log(`     Readability: ${qualityScore.readability}/100`);
      console.log(`     Structure: ${qualityScore.structure}/100`);

      if (!qualityScore.canPublish) {
        console.log(`  ❌ Quality too low - NOT saving`);
        if (qualityScore.recommendations.length > 0) {
          console.log(`     Issues: ${qualityScore.recommendations[0]}`);
        }
        qualityFailed++;
        failed++;
        continue;
      }

      // Save to database
      if (!testMode) {
        console.log('  💾 Saving to database...');
        const { error: updateError } = await supabase
          .from('credit_cards')
          .update({ description })
          .eq('id', card.id);

        if (updateError) {
          console.log(`  ❌ Database error: ${updateError.message}`);
          failed++;
        } else {
          console.log(`  ✅ SAVED - Quality: ${qualityScore.overall}/100`);
          successful++;
          totalCost += 0.15; // Approx cost per description
        }
      } else {
        console.log(`  🧪 TEST MODE - Would save (Quality: ${qualityScore.overall}/100)`);
        successful++;
      }

      // Rate limiting
      if (i < cards.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      failed++;
    }
  }

  // Final Report
  console.log('\n' + '═'.repeat(70));
  console.log('📈 GENERATION COMPLETE');
  console.log('═'.repeat(70));
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Quality Failed: ${qualityFailed}`);
  console.log(`\n📊 Quality Statistics:`);
  console.log(`   Average Score: ${(stats.totalScore / cards.length).toFixed(1)}/100`);
  console.log(`   Min Score: ${stats.minScore}/100`);
  console.log(`   Max Score: ${stats.maxScore}/100`);
  console.log(`   Avg Word Count: ${Math.round(stats.avgWordCount / cards.length)} words`);
  console.log(`\n💰 Cost: ~₹${totalCost.toFixed(2)}`);
  console.log(`🎯 Success Rate: ${((successful / cards.length) * 100).toFixed(1)}%`);
  console.log('═'.repeat(70) + '\n');

  if (testMode) {
    console.log('💡 Test complete! Run without --test flag to save to database.');
  }
}

// Parse command line args
const args = process.argv.slice(2);
const testMode = args.includes('--test');
const limit = parseInt(args.find(arg => !arg.startsWith('--')) || '50');

generateWithQualityGates(limit, testMode).catch(console.error);
