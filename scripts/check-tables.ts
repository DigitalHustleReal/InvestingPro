
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking database tables...');

  // Check products table
  const { count: productsCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (productsError) {
    console.error('Error checking products table:', productsError.message);
  } else {
    console.log(`Table 'products': ${productsCount} rows`);
  }

  // Check credit_cards table
  const { count: cardsCount, error: cardsError } = await supabase
    .from('credit_cards')
    .select('*', { count: 'exact', head: true });

  if (cardsError) {
    console.error('Error checking credit_cards table:', cardsError.message);
  } else {
    console.log(`Table 'credit_cards': ${cardsCount} rows`);
  }
}

checkTables();
