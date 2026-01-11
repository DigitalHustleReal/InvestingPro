import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import OpenAI from 'openai';
import { createServiceClient } from '../lib/supabase/service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateCreditCardDatabase() {
  console.log('\n🤖 AI-POWERED CREDIT CARD DATABASE GENERATOR');
  console.log('═'.repeat(70));
  console.log('Generating 50 realistic Indian credit cards...\n');
  
  const prompt = `Generate a JSON array of 50 realistic Indian credit cards from major banks.

Include popular cards from:
- HDFC Bank (10 cards)
- SBI Card (10 cards)
- ICICI Bank (10 cards)
- Axis Bank (10 cards)
- Other banks (10 cards: Kotak, IndusInd, RBL, Yes Bank, etc.)

For each card, provide:
{
  "name": "Full card name",
  "issuer": "Bank name",
  "card_type": "Premium/Super Premium/Cashback/Lifestyle/Travel/Shopping/Fuel/Entry-level",
  "annual_fee": "₹XXXX or 0 (numeric value)",
  "joining_bonus": "Description of joining bonus",
  "rewards_rate": "X points per ₹100 or X% cashback",
  "features": ["List", "of", "3-5", "key", "features"]
}

Use REAL card names that exist in the Indian market (HDFC Regalia, SBI SimplyCLICK, ICICI Amazon Pay, Axis Magnus, etc.)

Return ONLY the JSON array, no other text.`;

  console.log('🤖 Requesting AI generation...');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3, // Lower temperature for factual data
   max_tokens: 4000
  });
  
  let cardsJSON = response.choices[0].message.content || '[]';
  
  // Clean up response (remove markdown code blocks if present)
  cardsJSON = cardsJSON.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const cards = JSON.parse(cardsJSON);
  
  console.log(`✅ Generated ${cards.length} credit cards\n`);
  
  // Show samples
  console.log('Sample cards generated:');
  console.log('─'.repeat(70));
  cards.slice(0, 5).forEach((card: any, idx: number) => {
    console.log(`\n${idx + 1}. ${card.name} (${card.issuer})`);
    console.log(`   Type: ${card.card_type}`);
    console.log(`   Fee: ${card.annual_fee === 0 ? 'Free' : '₹' + card.annual_fee}`);
    console.log(`   Features: ${card.features.slice(0, 2).join(', ')}`);
  });
  
  return cards;
}

async function saveToDatabase(cards: any[]) {
  console.log('\n💾 Saving to database...');
  console.log('─'.repeat(70));
  
  const supabase = createServiceClient();
  let success = 0;
  let failed = 0;
  
  for (const card of cards) {
    const cardData = {
      name: card.name,
      issuer: card.issuer,
      card_type: card.card_type,
      annual_fee: typeof card.annual_fee === 'string' ? 
                  parseInt(card.annual_fee.replace(/[^0-9]/g, '')) || 0 : 
                  card.annual_fee,
      joining_bonus: card.joining_bonus,
      rewards_rate: card.rewards_rate,
      features: card.features,
     slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('credit_cards')
      .insert(cardData);
    
    if (error) {
      if (error.message.includes('duplicate')) {
        console.log(`  ⚠️  ${card.name}: Already exists`);
      } else {
        console.log(`  ❌ ${card.name}: ${error.message}`);
        failed++;
      }
    } else {
      console.log(`  ✅ ${card.name}`);
      success++;
    }
  }
  
  console.log('\n' + '═'.repeat(70));
  console.log(`📊 Results: ${success} saved, ${failed} failed`);
  console.log('═'.repeat(70));
}

async function main() {
  try {
    const cards = await generateCreditCardDatabase();
    await saveToDatabase(cards);
    
    console.log('\n✅ Database populated successfully!');
    console.log('\n🎯 Next: Generate descriptions with quality gates');
    console.log('   Run: npx tsx scripts/generate-cards-with-quality.ts 50\n');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure OPENAI_API_KEY is set in .env.local\n');
  }
}

main().catch(console.error);
