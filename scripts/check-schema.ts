
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  console.log('🔍 Checking products table schema...');
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('❌ Error selecting:', error);
  } else {
    console.log('✅ Success! Columns found:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]).join(', '));
    } else {
      console.log('Table is empty, cannot infer columns from data.');
      // Try to insert a dummy record with minimal fields to see what fails?
      // Or just try to select headers if possible.
      // But select('*') should work if table exists. 
      // If table empty, we don't see keys.
    }
  }
}

check();
