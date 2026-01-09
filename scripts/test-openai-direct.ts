import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testDirectOpenAI() {
  console.log('Testing direct OpenAI connection...\n');
  
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('API Key exists:', !!apiKey);
  console.log('API Key starts with:', apiKey?.substring(0, 7));
  
  if (!apiKey) {
    console.error('❌ No API key found!');
    return;
  }
  
  try {
    const openai = new OpenAI({ apiKey });
    
    console.log('\n🎨 Generating test image...');
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'A professional credit card on a dark background',
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });
    
    console.log('\n✅ SUCCESS!');
    console.log('Image URL:', response.data[0].url);
    
  } catch (error: any) {
    console.error('\n❌ ERROR:');
    console.error('Message:', error.message);
    console.error('Type:', error.constructor.name);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDirectOpenAI();
