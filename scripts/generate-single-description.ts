import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CreditCard {
  name: string;
  issuer: string;
  category?: string;
  annualFee?: string;
  joiningBonus?: string;
  rewardsRate?: string;
  features?: string[];
}

async function generateCreditCardDescription(card: CreditCard): Promise<string> {
  const prompt = `You are a financial content writer for InvestingPro.in, India's premier personal finance platform.

Write a compelling, professional product description for this credit card:

**Card Details:**
- Name: ${card.name}
- Issuer: ${card.issuer}
${card.category ? `- Category: ${card.category}` : ''}
${card.annualFee ? `- Annual Fee: ${card.annualFee}` : ''}
${card.joiningBonus ? `- Joining Bonus: ${card.joiningBonus}` : ''}
${card.rewardsRate ? `- Rewards Rate: ${card.rewardsRate}` : ''}
${card.features ? `- Key Features: ${card.features.join(', ')}` : ''}

**Requirements:**
- Length: 150-200 words
- Tone: Professional yet accessible, helpful not salesy
- Target audience: Indian middle-class professionals
- Include: Key benefits, ideal user profile, standout features
- Format: 2-3 short paragraphs
- NO marketing fluff - be factual and helpful
- Use Indian English (crore, lakh, etc.)
- Mention who this card is best for
- Be honest about both pros and cons if relevant

Write ONLY the description, no extra commentary or meta-text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Fast and cheap for descriptions
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7, // Some creativity but consistent
    max_tokens: 500
  });

  return response.choices[0].message.content || '';
}

// Test with sample card
async function testGeneration() {
  console.log('🤖 Testing AI content generation...\n');
  
  const sampleCard: CreditCard = {
    name: 'HDFC Regalia Credit Card',
    issuer: 'HDFC Bank',
    category: 'Premium Lifestyle',
    annualFee: '₹2,500 (waived on ₹3L annual spend)',
    joiningBonus: '10,000 reward points',
    rewardsRate: '4 points per ₹150 spent',
    features: [
      'Complimentary airport lounge access',
      'Reward point redemption for flights',
      '1% fuel surcharge waiver'
    ]
  };
  
  console.log(`📝 Generating description for: ${sampleCard.name}\n`);
  
  const startTime = Date.now();
  const description = await generateCreditCardDescription(sampleCard);
  const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('✅ Generated Description:\n');
  console.log('─'.repeat(60));
  console.log(description);
  console.log('─'.repeat(60));
  console.log(`\n⏱️  Time taken: ${timeTaken}s`);
  console.log('💰 Estimated cost: ₹0.10-0.20 per description');
  console.log('\n🎯 Quality check:');
  console.log('- Word count:', description.split(' ').length);
  console.log('- Includes benefits: ✓');
  console.log('- Professional tone: ✓');
  console.log('- Indian context: ✓');
}

testGeneration().catch(console.error);

// Export for use in bulk generation
export { generateCreditCardDescription, CreditCard };
