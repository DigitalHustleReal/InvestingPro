import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// Same helper functions as main endpoint
const BRAND_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  'HDFC': { primary: '#1F4E7C', secondary: '#E31E24', accent: '#FFD700' },
  'ICICI': { primary: '#F37021', secondary: '#1D428A', accent: '#FFB81C' },
  'Axis': { primary: '#800000', secondary: '#000000', accent: '#C0C0C0' },
  'SBI': { primary: '#004B87', secondary: '#FDB913', accent: '#FFFFFF' },
  'Default': { primary: '#1E293B', secondary: '#0EA5E9', accent: '#10B981' },
};

function extractProvider(providerName: string): string {
  for (const provider of Object.keys(BRAND_COLORS)) {
    if (providerName.toLowerCase().includes(provider.toLowerCase())) return provider;
  }
  return 'Default';
}

function buildPrompt(product: any): string {
  const provider = extractProvider(product.provider_name || product.name);
  const colors = BRAND_COLORS[provider];
  const cat = product.category?.toLowerCase() || '';
  
  if (cat.includes('card')) {
    return `Ultra-realistic premium credit card for "${product.name}". ${colors.primary} to ${colors.secondary} gradient, ${colors.accent} accents. Professional studio lighting.`;
  } else if (cat.includes('loan')) {
    return `Modern financial product for "${product.name}". Gradient ${colors.primary} to ${colors.secondary}. Professional design with ${colors.accent} highlights.`;
  } else if (cat.includes('insurance')) {
    return `Professional insurance product for "${product.name}". Shield theme, ${colors.primary} with ${colors.secondary} accents.`;
  } else {
    return `Investment product for "${product.name}". Growth theme, ${colors.primary} to ${colors.secondary} gradient.`;
  }
}

async function downloadImage(url: string, product: any): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  const category = product.category || 'general';
  const dir = path.join(process.cwd(), 'public', 'images', 'products', category);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${product.slug}.png`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/images/products/${category}/${filename}`;
}

export async function GET(request: NextRequest) {
  try {
    // Security: Check cron secret
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('\n🤖 CRON: Checking for products without images...');
    
    // Find products without images (limit 5 per run to avoid timeout)
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or('image_url.is.null,image_url.like.%default%')
      .limit(5);
    
    if (error) {
      throw error;
    }
    
    if (!products || products.length === 0) {
      console.log('✅ All products have images!');
      return Response.json({ 
        message: 'All products have images',
        generated: 0
      });
    }
    
    console.log(`📊 Found ${products.length} products needing images\n`);
    
    let generated = 0;
    const results = [];
    
    for (const product of products) {
      try {
        console.log(`🎨 Generating for: ${product.name}`);
        
        const prompt = buildPrompt(product);
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        });
        
        const imageUrl = response.data[0]?.url;
        if (!imageUrl) throw new Error('No URL returned');
        
        const localPath = await downloadImage(imageUrl, product);
        
        await supabase
          .from('products')
          .update({ image_url: localPath })
          .eq('id', product.id);
        
        console.log(`✅ Success: ${localPath}`);
        generated++;
        results.push({ productId: product.id, success: true, imageUrl: localPath });
        
        // Rate limit: 2s between requests
        if (generated < products.length) {
          await new Promise(r => setTimeout(r, 2000));
        }
        
      } catch (error: any) {
        console.error(`❌ Failed for ${product.name}:`, error.message);
        results.push({ productId: product.id, success: false, error: error.message });
      }
    }
    
    console.log(`\n📈 CRON Complete: ${generated}/${products.length} generated\n`);
    
    return Response.json({ 
      generated,
      total: products.length,
      cost: generated * 0.04,
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ CRON failed:', error);
    return Response.json({ 
      error: 'Cron job failed', 
      details: error.message 
    }, { status: 500 });
  }
}
