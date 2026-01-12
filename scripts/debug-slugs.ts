
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listSlugs() {
  console.log('Checking credit_cards table...');
  const { data, error } = await supabase
    .from('credit_cards')
    .select('slug, name')
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Found cards:', data?.length);
  data?.forEach(card => {
    console.log(`- ${card.slug} (${card.name})`);
  });
}

listSlugs();
