
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 
// USING ANON KEY to simulate public access
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugFetch() {
  const slug = 'hdfc-regalia-gold';
  console.log(`Fetching card: ${slug} with ANON KEY...`);

  const { data, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('❌ Supabase Error:', error);
    // Common RLS error code is 42501
    if (error.code === '42501') {
      console.error('⚠️  Likely RLS Policy missing for public read access.');
    }
  } else if (!data) {
    console.error('❌ No data returned (and no error).');
  } else {
    console.log('✅ Success! Found card:', data.name);
  }
}

debugFetch();
