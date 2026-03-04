import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
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

// Brand colors
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

function buildProductPrompt(product: any): string {
  const provider = extractProvider(product.provider_name || product.name);
  const colors = BRAND_COLORS[provider];
  const category = product.category?.toLowerCase() || '';
  
  if (category.includes('credit-card') || category.includes('card')) {
    return `Ultra-realistic premium credit card for "${product.name}". Physical card in landscape orientation with slight tilt. Color scheme: ${colors.primary} gradient to ${colors.secondary} with ${colors.accent} metallic accents. "${provider}" logo embossed. EMV chip, contactless symbol, professional studio lighting, dramatic shadows, luxury product photography.`;
  } else if (category.includes('loan')) {
    return `Modern financial product image for "${product.name}". Gradient from ${colors.primary} to ${colors.secondary}. "${provider}" branding prominent. Abstract financial graphics: rising chart, percentage, house icons. Professional gradient background, ${colors.accent} highlights. Clean modern aesthetic.`;
  } else if (category.includes('insurance')) {
    return `Professional insurance product for "${product.name}". Protective theme with shield. Primary: ${colors.primary} with ${colors.secondary} accents. "${provider}" branding. Trust indicators with ${colors.accent} glow. Clean reassuring aesthetic.`;
  } else {
    return `Professional investment product for "${product.name}". Growth-oriented theme. Gradient: ${colors.primary} to ${colors.secondary}. "${provider}" branding. Upward trending charts, ${colors.accent} growth indicators. Modern sophisticated financial aesthetic.`;
  }
}

async function downloadAndSaveImage(url: string, product: any): Promise<string> {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  
  const category = product.category || 'general';
  const dir = path.join(process.cwd(), 'public', 'images', 'products', category);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filename = `${product.slug}.png`;
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, buffer);
  
  return `/images/products/${category}/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return Response.json({ error: 'productId required' }, { status: 400 });
    }
    
    logger.info(`🎨 Auto-generating image for product: ${productId}`);
    
    // Fetch product
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error || !product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Skip if already has non-default image
    if (product.image_url && !product.image_url.includes('default')) {
      logger.info(`✅ Product already has image: ${product.image_url}`);
      return Response.json({ 
        message: 'Already has image', 
        imageUrl: product.image_url,
        skipped: true
      });
    }
    
    // Build prompt
    const prompt = buildProductPrompt(product);
    logger.info(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    
    // Generate image with DALL-E 3
    logger.info(`⏳ Calling DALL-E 3...`);
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });
    
    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }
    
    logger.info(`✅ Image generated successfully`);
    
    // Download and save locally
    logger.info(`💾 Downloading and saving...`);
    const localPath = await downloadAndSaveImage(imageUrl, product);
    logger.info(`✅ Saved to: ${localPath}`);
    
    // Log cost for dashboard visibility
    try {
      const { logAICost } = await import('@/lib/ai/cost-tracker');
      await logAICost({
        article_id: productId, // Using productId here for tracking
        provider: 'openai',
        model: 'dall-e-3',
        operation: 'image',
        cost_usd: 0.04,
        metadata: { productName: product.name }
      });
    } catch (costErr) {
      logger.warn('⚠️ Failed to log image cost:', costErr);
    }
    
    // Update product in database
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        image_url: localPath,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);
    
    if (updateError) {
      logger.error(`❌ Database update failed:`, updateError);
      throw updateError;
    }
    
    logger.info(`✅ Product updated successfully`);
    
    return Response.json({ 
      success: true, 
      productId,
      productName: product.name,
      imageUrl: localPath,
      cost: 0.04,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    logger.error('❌ Image generation failed:', error);
    return Response.json({ 
      error: 'Generation failed', 
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
