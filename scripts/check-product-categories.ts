
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('Checking product categories...');
  const { data, error } = await supabase
    .from('products')
    .select('category, id');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  const distribution: Record<string, number> = {};
  data.forEach(p => {
    distribution[p.category] = (distribution[p.category] || 0) + 1;
  });

  console.log('Category Distribution:', distribution);
}

main().catch(console.error);
