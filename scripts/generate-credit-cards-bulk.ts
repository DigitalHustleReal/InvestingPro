import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
- Length: 150-200 words
- Tone: Professional, helpful, not salesy
- Target: Indian professionals seeking smart financial choices
- Include: Key benefits, ideal user, standout features
- Format: 2-3 paragraphs
- NO fluff - factual and helpful
- Use Indian English
- Mention who this card suits best

Write ONLY the description.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content || '';
}

async function generateBulkDescriptions(limit: number = 50) {
  console.log(`🚀 Starting bulk generation for ${limit} credit cards...\n`);

  // Fetch cards WITHOUT descriptions
  const { data: cards, error } = await supabase
    .from('credit_cards')
    .select('*')
    .is('description', null)
    .limit(limit);

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
  let totalCost = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    console.log(`[${i + 1}/${cards.length}] Processing: ${card.name}...`);

    try {
      const description = await generateDescription(card);
      
      // Update database
      const { error: updateError } = await supabase
        .from('credit_cards')
        .update({ description })
        .eq('id', card.id);

      if (updateError) {
        console.log(`  ❌ Failed to update: ${updateError.message}`);
        failed++;
      } else {
        console.log(`  ✅ Generated & saved (${description.split(' ').length} words)`);
        successful++;
        totalCost += 0.15; // Approx ₹0.15 per description
      }

      // Rate limiting: Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📈 BULK GENERATION COMPLETE');
  console.log('═'.repeat(60));
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`💰 Total cost: ~₹${totalCost.toFixed(2)}`);
  console.log(`⏱️  Average: ~2-3 seconds per description`);
  console.log(`🎯 Completion rate: ${((successful / cards.length) * 100).toFixed(1)}%`);
}

// Get limit from command line args
const limit = parseInt(process.argv[2]) || 50;
generateBulkDescriptions(limit).catch(console.error);
