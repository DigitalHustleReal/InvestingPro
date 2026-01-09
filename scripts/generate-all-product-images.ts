/**
 * Generate Realistic Product Images - Automated
 * 
 * Creates unique, professional images for each product based on:
 * - Product name & provider
 * - Category (credit cards, loans, insurance, investments)
 * - Brand colors & style
 * 
 * Usage: npx tsx scripts/generate-all-product-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import { aiImageGenerator } from '@/lib/images/ai-image-generator';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Brand color mappings for Indian banks/providers
const BRAND_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  'HDFC': { primary: '#1F4E7C', secondary: '#E31E24', accent: '#FFD700' },
  'ICICI': { primary: '#F37021', secondary: '#1D428A', accent: '#FFB81C' },
  'Axis': { primary: '#800000', secondary: '#000000', accent: '#C0C0C0' },
  'SBI': { primary: '#004B87', secondary: '#FDB913', accent: '#FFFFFF' },
  'Kotak': { primary: '#ED1C24', secondary: '#000000', accent: '#FFFFFF' },
  'IDFC': { primary: '#DC1F28', secondary: '#000000', accent: '#FFFFFF' },
  'Standard Chartered': { primary: '#0072BC', secondary: '#00A758', accent: '#FFFFFF' },
  'American Express': { primary: '#006FCF', secondary: '#FFFFFF', accent: '#000000' },
  'Citibank': { primary: '#003DA5', secondary: '#D42128', accent: '#FFFFFF' },
  'YES Bank': { primary: '#0066B3', secondary: '#FFC629', accent: '#FFFFFF' },
  'IndusInd': { primary: '#EE3524', secondary: '#0033A1', accent: '#FFD700' },
  'RBL': { primary: '#004B8D', secondary: '#FF0000', accent: '#FFFFFF' },
  'AU': { primary: '#FF6B35', secondary: '#004E89', accent: '#FFD700' },
  'Bank of Baroda': { primary: '#F36C21', secondary: '#003DA5', accent: '#FFFFFF' },
  'LIC': { primary: '#00539F', secondary: '#FDB913', accent: '#FFFFFF'},
  'Star Health': { primary: '#E31E24', secondary: '#1D428A', accent: '#FFD700' },
  'Max Bupa': { primary: '#003DA5', secondary: '#E31E24', accent: '#FFFFFF' },
  'ICICI Lombard': { primary: '#F37021', secondary: '#1D428A', accent: '#FFB81C' },
  'Default': { primary: '#1E293B', secondary: '#0EA5E9', accent: '#10B981' },
};

/**
 * Extract provider name from product
 */
function extractProvider(providerName: string): string {
  const providers = Object.keys(BRAND_COLORS);
  for (const provider of providers) {
    if (providerName.toLowerCase().includes(provider.toLowerCase())) {
      return provider;
    }
  }
  return 'Default';
}

/**
 * Build smart prompt based on product details
 */
function buildProductPrompt(product: any): string {
  const provider = extractProvider(product.provider_name || product.name);
  const colors = BRAND_COLORS[provider];
  
  const category = product.category?.toLowerCase() || '';
  let basePrompt = '';
  
  if (category.includes('credit-card') || category.includes('card')) {
    basePrompt = `
Ultra-realistic premium credit card for "${product.name}". 
Physical card in landscape orientation with slight tilt for depth.
Color scheme: ${colors.primary} gradient to ${colors.secondary} with ${colors.accent} metallic accents.
"${provider}" logo embossed in top left. Card name "${product.name}" in premium serif font.
EMV chip (gold metallic), contactless wave symbol, Visa/Mastercard logo bottom right.
Professional studio lighting, dramatic shadows, reflection beneath card, depth of field background blur.
High-end banking commercial aesthetic, luxury product photography, 8K quality.
    `.trim();
  } else if (category.includes('loan') || category.includes('mortgage')) {
    basePrompt = `
Modern financial product image for "${product.name}".
Gradient from ${colors.primary} to ${colors.secondary}.
"${provider}" branding prominent.
Abstract financial graphics: rising chart, percentage, house/document icons.
Trust signals: shield icon, checkmark, "Approved" stamp.
Professional gradient background, floating 3D elements, ${colors.accent} highlights.
Clean modern trustworthy aesthetic, premium corporate design.
    `.trim();
  } else if (category.includes('insurance')) {
    basePrompt = `
Professional insurance product image for "${product.name}".
Protective trustworthy theme with shield as central element.
Primary color: ${colors.primary} with ${colors.secondary} accents.
"${provider}" branding clearly visible.
Subtle family/health/protection imagery.
Trust indicators: shield with ${colors.accent} glow, checkmarks, verified badges.
Clean reassuring aesthetic conveying security and reliability.
    `.trim();
  } else {
    basePrompt = `
Professional investment product image for "${product.name}".
Growth-oriented wealth-building theme.
Gradient: ${colors.primary} to ${colors.secondary}.
"${provider}" branding prominent.
Upward trending charts, rising arrows, ${colors.accent} growth indicators.
Modern sophisticated financial aesthetic, tech-forward professional design.
    `.trim();
  }
  
  return basePrompt;
}

/**
 * Download image from URL and save locally
 */
async function downloadAndSaveImage(url: string, product: any): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    // Create directory if it doesn't exist
    const category = product.category || 'general';
    const dir = path.join(process.cwd(), 'public', 'images', 'products', category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save file
    const filename = `${product.slug}.png`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, buffer);
    
    return `/images/products/${category}/${filename}`;
  } catch (error: any) {
    console.error(`   ⚠️  Download failed:`, error.message);
    return url; // Fallback to remote URL
  }
}

/**
 * Main function to generate all product images
 */
async function generateAllProductImages() {
  console.log('🎨 Starting Automated Product Image Generation\n');
  console.log('═'.repeat(60));
  
  // Fetch all products needing images
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .or('image_url.is.null,image_url.like.%default%');
  
  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError);
    return;
  }
  
  if (!products || products.length === 0) {
    console.log('✅ No products need image generation!');
    return;
  }
  
  console.log(`📊 Found ${products.length} products to process\n`);
  
  let successCount = 0;
  let failCount = 0;
  let totalCost = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `(${i + 1}/${products.length})`;
    
    try {
      console.log(`\n🎨 ${progress}: ${product.name}`);
      console.log(`   Provider: ${product.provider_name || 'N/A'}`);
      console.log(`   Category: ${product.category || 'N/A'}`);
      
      // Build smart prompt
      const prompt = buildProductPrompt(product);
      console.log(`   Prompt: ${prompt.substring(0, 80)}...`);
      
      // Generate image using your existing AI service
      console.log('   ⏳ Generating with DALL-E 3...');
      const result = await aiImageGenerator.generate({
        prompt: prompt,
        style: 'photorealistic',
        size: '1024x1024',
        quality: 'standard',
        brand_guidelines: false // We handle colors in prompt
      });
      
      console.log(`   ✅ Generated! Cost: $${result.cost_usd}`);
      totalCost += result.cost_usd;
      
      // Download and save locally
      console.log('   💾 Downloading and saving...');
      const localPath = await downloadAndSaveImage(result.url, product);
      
      // Update database
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          image_url: localPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`   ❌ Database update failed:`, updateError.message);
        failCount++;
      } else {
        console.log(`   ✅ Complete! Path: ${localPath}`);
        successCount++;
      }
      
      // Rate limiting: 2 seconds between requests
      if (i < products.length - 1) {
        console.log('   ⏱️  Rate limit wait (2s)...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error: any) {
      console.error(`   ❌ Failed:`, error.message);
      failCount++;
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n📈 Generation Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   💰 Total Cost: $${totalCost.toFixed(2)}`);
  console.log(`   📊 Total: ${products.length}`);
  console.log('\n🎉 Automated generation complete!');
  
  if (failCount > 0) {
    console.log('\n⚠️  Some products failed. Check errors above.');
  }
}

// Run the script
generateAllProductImages().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
