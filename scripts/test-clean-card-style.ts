/**
 * Test Clean Card Style - Generate 2 Sample Cards
 * Cost: $0.08 (2 × $0.04)
 */
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const BRAND_COLORS: Record<string, { primary: string; secondary: string }> = {
  'HDFC': { primary: '#1F4E7C', secondary: '#E31E24' },
  'ICICI': { primary: '#F37021', secondary: '#1D428A' },
};

async function downloadImage(url: string, filename: string): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  
  const dir = path.join(process.cwd(), 'public', 'images', 'test-cards');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/images/test-cards/${filename}`;
}

async function testCleanStyle() {
  console.log('🎨 Testing Clean Card Style (Grok-inspired)\\n');
  console.log('═'.repeat(60));
  
  const testCards = [
    {
      name: 'HDFC Regalia Gold Credit Card',
      provider: 'HDFC',
      colors: BRAND_COLORS['HDFC']
    },
    {
      name: 'ICICI Platinum Credit Card', 
      provider: 'ICICI',
      colors: BRAND_COLORS['ICICI']
    }
  ];
  
  for (let i = 0; i < testCards.length; i++) {
    const card = testCards[i];
    
    try {
      console.log(`\\n🎨 [${i+1}/2] ${card.name}`);
      
      // ULTRA-SIMPLIFIED PROMPT (like Grok example)
      const prompt = `A realistic credit card for "${card.name}". 
Black or dark ${card.colors.primary} card with ${card.colors.secondary} accents. 
"${card.provider} BANK" logo clearly visible at top left. 
Gold or metallic diagonal stripe design.
EMV chip (gold rectangle), contactless symbol (wifi icon).
Card number visible: "1932 **** **** ****"
Valid thru date, CVV placeholder.
Plain light gray background (#E5E5E5) ONLY. 
Subtle soft shadow beneath card for depth.
Clean, professional, minimal - like NerdWallet or Forbes Advisor credit card images.
3D perspective view, slight tilt.`;
      
      console.log(`   📝 Prompt: ${prompt.substring(0, 100)}...`);
      console.log(`   ⏳ Calling DALL-E 3...`);
      
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      });
      
      const imageUrl = response.data[0].url!;
      console.log(`   ✅ Generated! ($0.04)`);
      
      const filename = `test-${card.provider.toLowerCase()}-clean.png`;
      const localPath = await downloadImage(imageUrl, filename);
      
      console.log(`   ✅ Saved: ${localPath}`);
      console.log(`   🔗 View: http://localhost:3000${localPath}`);
      
      await new Promise(r => setTimeout(r, 2000));
      
    } catch (error: any) {
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\\n' + '═'.repeat(60));
  console.log(`\\n✅ TEST COMPLETE! Cost: $0.08`);
  console.log(`\\n📁 Check images at: /public/images/test-cards/`);
  console.log(`   - test-hdfc-clean.png`);
  console.log(`   - test-icici-clean.png`);
  console.log(`\\n👀 Review these in browser, then decide if we should regenerate all 12 cards.`);
}

testCleanStyle();
