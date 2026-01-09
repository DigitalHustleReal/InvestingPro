/**
 * Test single product image generation
 */
import { aiImageGenerator } from '@/lib/images/ai-image-generator';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function test() {
  console.log('\n🧪 Testing single image generation...\n');
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 0);
  
  try {
    const result = await aiImageGenerator.generate({
      prompt: 'Ultra-realistic premium credit card for "HDFC Regalia Gold". Professional studio lighting.',
      style: 'photorealistic',
      size: '1024x1024',
      quality: 'standard'
    });
    
    console.log('\n✅ SUCCESS!');
    console.log('URL:', result.url);
    console.log('Cost:', result.cost_usd);
  } catch (error: any) {
    console.error('\n❌ FAILED:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();
