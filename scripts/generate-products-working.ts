/**
 * Generate Realistic Product Images - WORKING VERSION
 * Uses OpenAI directly (bypasses the wrapper that was failing)
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

// Brand colors (same as before)
const BRAND_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  'HDFC': { primary: '#1F4E7C', secondary: '#E31E24', accent: '#FFD700' },
  'ICICI': { primary: '#F37021', secondary: '#1D428A', accent: '#FFB81C' },
  'Axis': { primary: '#800000', secondary: '#000000', accent: '#C0C0C0' },
  'SBI': { primary: '#004B87', secondary: '#FDB913', accent: '#FFFFFF' },
  'Kotak': { primary: '#ED1C24', secondary: '#000000', accent: '#FFFFFF' },
  'American Express': { primary: '#006FCF', secondary: '#FFFFFF', accent: '#000000' },
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

function buildPrompt(product: any): string {
  const provider = extractProvider(product.provider_name || product.name);
  const colors = BRAND_COLORS[provider];
  const category = product.category?.toLowerCase() || '';
  
  if (category.includes('credit-card') || category.includes('card')) {
    // SIMPLIFIED: Clean, minimal card like NerdWallet/Forbes - NO fancy backgrounds
    return `Clean, minimal credit card design for "${product.name}". Flat credit card view, slight perspective. Colors: ${colors.primary} and ${colors.secondary}. "${provider}" logo visible. EMV chip, contactless symbol. White or transparent background, subtle drop shadow only. Professional, simple, modern.`;
  } else if (category.includes('loan')) {
    return `Modern financial product image for "${product.name}". Gradient from ${colors.primary} to ${colors.secondary}. "${provider}" branding prominent. Abstract financial graphics: rising chart, percentage, house icons. Trust signals. Professional gradient background, ${colors.accent} highlights. Clean modern aesthetic.`;
  } else if (category.includes('insurance')) {
    return `Professional insurance product for "${product.name}". Protective theme with shield. Primary: ${colors.primary} with ${colors.secondary} accents. "${provider}" branding. Trust indicators with ${colors.accent} glow, checkmarks. Clean reassuring aesthetic.`;
  } else {
    return `Professional investment product for "${product.name}". Growth-oriented theme. Gradient: ${colors.primary} to ${colors.secondary}. "${provider}" branding. Upward trending charts, ${colors.accent} growth indicators. Modern sophisticated financial aesthetic.`;
  }
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

async function generateAll() {
  console.log('🎨 Product Image Generation - ACTIVE\n');
  console.log('═'.repeat(60));
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .or('image_url.is.null,image_url.like.%default%');
  
  if (!products || products.length === 0) {
    console.log('✅ All products have images!');
    return;
  }
  
  console.log(`📊 Generating images for ${products.length} products\n`);
  
  let successCount = 0;
  let totalCost = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;
    
    try {
      console.log(`\n🎨 ${progress} ${product.name}`);
      
      const prompt = buildPrompt(product);
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
  
  console.log('\n' + '═'.repeat(60));
  console.log(`\n📈 COMPLETE!`);
  console.log(`   ✅ Success: ${successCount}/${products.length}`);
  console.log(`   💰 Total Cost: $${totalCost.toFixed(2)}`);
}

generateAll();
