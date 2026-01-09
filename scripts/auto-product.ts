
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { generateProductData } from '../lib/automation/product-generator';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function autoProduct() {
  const productName = process.argv[2];
  
  if (!productName) {
    console.log('❌ Please provide a product name. Usage: npx tsx scripts/auto-product.ts "Zerodha"');
    return;
  }

  try {
    // 1. Generate Data
    const product = await generateProductData(productName);
    console.log('✅ AI Research Complete.');
    console.log('   Stats:', product.rating, '⭐');
    console.log('   Pricing:', product.pricing);

    // 2. Check DB
    const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();
    
    if (existing) {
        console.log('⚠️  Product already exists. Updating...');
        await supabase.from('products').update(product).eq('id', existing.id);
    } else {
        console.log('✨ Creating new listing...');
        const { error } = await supabase.from('products').insert({
            ...product,
            is_active: true,
            reviews_count: 100, // Starter val
            popularity_score: 85
        });
        if (error) throw error;
    }

    console.log(`🎉 SUCCESS! '${product.name}' is now live in the Product Comparison engine.`);

  } catch (error: any) {
    console.error('💥 Failed:', error.message);
  }
}

autoProduct();
