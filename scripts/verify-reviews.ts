
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyReviews() {
  const slug = 'hdfc-regalia-gold-credit-card'; // Adjust slug if necessary
  console.log(`Checking reviews for slug: ${slug}...`);

  // 1. Get Product ID
  const { data: product, error: prodError } = await supabase
    .from('credit_cards')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (prodError || !product) {
    console.error(`Product not found: ${prodError?.message}`);
    // Try fuzzy search
    const { data: products } = await supabase.from('credit_cards').select('slug').ilike('slug', '%regalia%');
    console.log('Did you mean one of these?', products?.map(p => p.slug));
    return;
  }

  console.log(`Product Found: ${product.name} (${product.id})`);

  // 2. Get Reviews
  const { data: reviews, error: revError, count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('product_id', product.id);

  if (revError) {
    console.error(`Error fetching reviews: ${revError.message}`);
    return;
  }

  console.log(`\nFound ${count} reviews.`);
  
  if (reviews && reviews.length > 0) {
    console.log('\nSample Review:');
    console.log('------------------------------------------------');
    console.log(`Title: ${reviews[0].title}`);
    console.log(`Rating: ${reviews[0].rating}/5`);
    console.log(`Sentiment: ${reviews[0].sentiment}`);
    console.log(`Verified: ${reviews[0].is_verified ? 'Yes' : 'No'}`);
    console.log(`Content: ${reviews[0].content.substring(0, 100)}...`);
    console.log('------------------------------------------------');
  } else {
    console.log('⚠️ No reviews found! The batch job might have failed or not run for this card.');
  }
}

verifyReviews();
