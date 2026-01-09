/**
 * Regenerate Credit Card Images - CLEAN STYLE
 * 
 * Problem: Current AI images have overly fancy backgrounds (dramatic lighting, surfaces, shadows)
 * Solution: Regenerate with simplified prompts matching NerdWallet/Forbes style
 * 
 * Cost: ~$0.48 (12 credit cards × $0.04)
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

// Brand colors
const BRAND_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  'HDFC': { primary: '#1F4E7C', secondary: '#E31E24', accent: '#FFD700' },
  'ICICI': { primary: '#F37021', secondary: '#1D428A', accent: '#FFB81C' },
  'Axis': { primary: '#800000', secondary: '#000000', accent: '#C0C0C0' },
  'SBI': { primary: '#004B87', secondary: '#FDB913', accent: '#FFFFFF' },
  'Kotak': { primary: '#ED1C24', secondary: '#000000', accent: '#FFFFFF' },
  'American Express': { primary: '#006FCF', secondary: '#FFFFFF', accent: '#000000' },
  'IndusInd': { primary: '#DC143C', secondary: '#000000', accent: '#FFFFFF' },
  'Default': { primary: '#1E293B', secondary: '#0EA5E9', accent: '#10B981' },
};

function extractProvider(providerName: string): string {
  for (const provider of Object.keys(BRAND_COLORS)) {
    if (providerName.toLowerCase().includes(provider.toLowerCase())) {
      return provider;
    }
  }
  return 'Default';
}

function buildCleanPrompt(product: any): string {
  const provider = extractProvider(product.provider_name || product.name);
  const colors = BRAND_COLORS[provider];
  
  // SIMPLIFIED PROMPT - No fancy backgrounds, just clean card
  return `Clean, simple credit card for "${product.name}". 
Flat rectangular card, slight 3D perspective. 
Primary color: ${colors.primary}, secondary: ${colors.secondary}. 
"${provider}" logo clearly visible. 
EMV chip visible, contactless payment symbol. 
Plain white or light gray background ONLY. 
Very subtle shadow beneath card for depth. 
Minimal, professional, clean design like NerdWallet or Forbes Advisor.`;
}

async function downloadImage(url: string, product: any): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  
  const category = product.category || 'general';
  const dir = path.join(process.cwd(), 'public', 'images', 'products', category);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filename = `${product.slug}.png`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  
  return `/images/products/${category}/${filename}`;
}

async function regenerateCreditCards() {
  console.log('🎨 Regenerating Credit Card Images - CLEAN STYLE\\n');
  console.log('═'.repeat(60));
  
  // Only get credit cards
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .or('category.eq.credit-card,category.eq.credit_card');
  
  if (!products || products.length === 0) {
    console.log('❌ No credit cards found!');
    return;
  }
  
  console.log(`📊 Regenerating images for ${products.length} credit cards\\n`);
  console.log('⚠️  This will REPLACE existing images\\n');
  
  let successCount = 0;
  let totalCost = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;
    
    try {
      console.log(`\\n🎨 ${progress} ${product.name}`);
      
      const prompt = buildCleanPrompt(product);
      console.log(`   📝 ${prompt.substring(0, 80)}...`);
      
      console.log(`   ⏳ Calling DALL-E 3...`);
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      });
      
      const imageUrl = response.data[0].url!;
      totalCost += 0.04;
      console.log(`   ✅ Generated! ($0.04)`);
      
      console.log(`   💾 Downloading...`);
      const localPath = await downloadImage(imageUrl, product);
      
      await supabase
        .from('products')
        .update({ image_url: localPath })
        .eq('id', product.id);
      
      console.log(`   ✅ Saved: ${localPath}`);
      successCount++;
      
      if (i < products.length - 1) {
        console.log(`   ⏱️  Waiting 2s...`);
        await new Promise(r => setTimeout(r, 2000));
      }
      
    } catch (error: any) {
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\\n' + '═'.repeat(60));
  console.log(`\\n📈 COMPLETE!`);
  console.log(`   ✅ Success: ${successCount}/${products.length}`);
  console.log(`   💰 Total Cost: $${totalCost.toFixed(2)}`);
}

regenerateCreditCards();
