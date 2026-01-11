import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testConnection() {
  console.log('🔍 Testing OpenAI connection...\n');
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say "API connected successfully!" and nothing else.'
        }
      ],
      max_tokens: 10
    });
    
    console.log('✅ SUCCESS! OpenAI API is connected.');
    console.log('Response:', response.choices[0].message.content);
    console.log('\n📊 Usage Stats:');
    console.log('- Tokens used:', response.usage?.total_tokens);
    console.log('- Cost: ₹', ((response.usage?.total_tokens || 0) * 0.000001 * 83).toFixed(4));
    console.log('\n🚀 Ready to generate content!');
    
  } catch (error: any) {
    console.error('❌ ERROR connecting to OpenAI:');
    console.error(error.message);
    console.error('\n💡 Check:');
    console.error('1. OPENAI_API_KEY is set in .env.local');
    console.error('2. You have credits in your OpenAI account');
    console.error('3. The API key is valid (starts with sk-proj-)');
  }
}

testConnection();
