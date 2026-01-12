
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificSlug() {
  console.log('Searching for Regalia...');
  
  // 1. Check exact slug
  const { data: exact } = await supabase
    .from('credit_cards')
    .select('slug, name')
    .eq('slug', 'hdfc-regalia-gold');
    
  if (exact && exact.length > 0) {
    console.log('FOUND EXACT:', exact[0]);
    return;
  } else {
    console.log('Exact slug "hdfc-regalia-gold" NOT FOUND.');
  }

  // 2. Search partial
  const { data: partial } = await supabase
    .from('credit_cards')
    .select('slug, name')
    .ilike('slug', '%regalia%');

  console.log('Partial matches for "regalia":');
  partial?.forEach(c => console.log(`- ${c.slug} (${c.name})`));
}

checkSpecificSlug();
