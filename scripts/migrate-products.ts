
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Starting migration from credit_cards to products...');
  
  // 1. Fetch all credit cards
  const { data: cards, error: fetchError } = await supabase.from('credit_cards').select('*');
  
  if (fetchError) {
    console.error('Error fetching credit cards:', fetchError);
    return;
  }
  
  console.log(`Found ${cards.length} credit cards to migrate.`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const card of cards) {
    // 2. Check if product already exists to avoid duplicates (by slug)
    const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', card.slug)
        .single();
        
    if (existing) {
        console.log(`Skipping existing product: ${card.slug}`);
        continue;
    }
    
    // 3. Map to Product schema
    const product = {
        name: card.name,
        slug: card.slug,
        category: 'credit_card',
        provider_name: card.bank || 'Unknown Bank',
        // provider_slug: (card.bank || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Column does not exist
        description: card.description,
        // Map rating to nested structure if needed, or flat if schema differs. 
        // Based on product-service.ts, rating is a JSONB or object in app logic, but DB might have flat columns?
        // product-service.ts line 261: rating: { overall: Number(data.rating) ... } implies DB has 'rating' column that might be simple number or json.
        // credit_card_sample has "rating": 4 (number).
        // Let's assume DB 'rating' column is numeric or generic json.
        // If DB expects JSONB for rating:
        // rating: { overall: card.rating || 0, trust_score: 0 },
        // But let's look at product-service.ts again. 
        // "rating: { overall: Number(data.rating) || 0 }" SUGGESTS data.rating comes from DB as number or string.
        // So we Map card.rating -> product.rating.
        rating: card.rating, 
        trust_score: 0,
        
        // JSONB features
        features: {
            type: card.type,
            annual_fee: card.annual_fee,
            joining_fee: card.joining_fee,
            reward_type: card.reward_type,
            benefits: card.benefits
        },
        
        pros: card.pros || [],
        cons: card.cons || [],
        
        affiliate_link: card.apply_link,
        image_url: card.image_url,
        
        is_active: true,
        verification_status: 'pending',
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    // 4. Insert into products
    const { error: insertError } = await supabase.from('products').insert(product);
    
    if (insertError) {
        console.error(`Failed to migrate ${card.slug}:`, insertError.message);
        failCount++;
    } else {
        process.stdout.write('.');
        successCount++;
    }
  }
  
  console.log('\nMigration complete.');
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Skipped: ${cards.length - successCount - failCount}`);
}

migrate();
